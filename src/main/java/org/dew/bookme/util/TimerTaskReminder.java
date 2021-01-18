package org.dew.bookme.util;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimerTask;

import org.apache.log4j.Logger;

import org.util.WUtil;

public 
class TimerTaskReminder extends TimerTask 
{
  protected transient Logger logger = Logger.getLogger(getClass());
  
  protected transient boolean running = false;
  
  protected boolean firstTime = true;
  
  public
  void run()
  {
    if(running) return;
    running = true;
    
    logger.debug("TimerTaskReminder.run() 1.0...");
    
    Calendar cal = Calendar.getInstance();
    int iHour = cal.get(Calendar.HOUR_OF_DAY);
    if(iHour < 9 || iHour > 18) {
      logger.debug("TimerTaskReminder.run (iHour=" + iHour + ") aborted");
      running = false;
      return;
    }
    String sHostName = System.getenv("HOSTNAME");
    if(sHostName == null || sHostName.length() == 0) {
      sHostName = System.getProperty("jboss.host.name");
    }
    if(sHostName == null || !sHostName.equalsIgnoreCase(BEConfig.PROD_HOST)) {
      logger.debug("TimerTaskReminder.run (HOSTNAME=" + sHostName + ") aborted");
      running = false;
      return;
    }
    if(ConnectionManager.boIsOnDebug) {
      logger.debug("TimerTaskReminder.run (ConnectionManager.boIsOnDebug=" + ConnectionManager.boIsOnDebug + ") aborted");
      running = false;
      return;
    }
    
    long currentTimeMillis = System.currentTimeMillis();
    Calendar calCurrDate = WUtil.getCurrentDate();
    Calendar calTomorrow = WUtil.getCurrentDate();
    calTomorrow.add(Calendar.DATE, 1);
    int iCurrentDate = WUtil.toIntDate(calCurrDate, 0);
    int iCurrentTime = WUtil.toIntTime(Calendar.getInstance(), 0);
    
    String sSQL_P = "SELECT P.ID,P.ID_GRU,P.ID_AZI,P.ID_FAR,P.CODICE,P.DATA_INSERT,P.DATA_APPUNTAMENTO,P.ORA_APPUNTAMENTO,P.ID_CLIENTE,C.TELEFONO_1 ";
    sSQL_P += "FROM PRZ_PRENOTAZIONI P,PRZ_CLIENTI C ";
    sSQL_P += "WHERE P.ID_CLIENTE=C.ID ";
    sSQL_P += "AND P.FLAG_ATTIVO=1 AND P.STATO<>'A' ";
    sSQL_P += "AND P.DATA_APPUNTAMENTO>? AND P.DATA_APPUNTAMENTO<=? ";
    sSQL_P += "AND P.DATAORA_REMIND IS NULL ";
    sSQL_P += "ORDER BY P.DATA_APPUNTAMENTO,P.ID_CLIENTE,P.ORA_APPUNTAMENTO";
    
    String sSQL_C = "SELECT MESSAGGIO FROM PRZ_COMUNICAZIONI WHERE ID_GRU=? AND ID_FAR=? AND OGGETTO=? AND FLAG_ATTIVO=?";
    
    String sSQL_U = "UPDATE PRZ_PRENOTAZIONI SET DATAORA_REMIND=? WHERE ID=?";
    
    String sLastCodice    = null;
    int    iLastIdCLiente = 0;
    int    iLastDataApp   = 0;
    int    iLastOraApp    = 0;
    Map<String,String> mapMessaggi = new HashMap<String,String>();
    
    Connection conn = null;
    PreparedStatement pstmP = null;
    PreparedStatement pstmC = null;
    PreparedStatement pstmU = null;
    ResultSet rsP = null;
    ResultSet rsC = null;
    
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstmP = conn.prepareStatement(sSQL_P);
      pstmC = conn.prepareStatement(sSQL_C);
      pstmU = conn.prepareStatement(sSQL_U);
      
      pstmP.setDate(1, new java.sql.Date(calCurrDate.getTimeInMillis()));
      pstmP.setDate(2, new java.sql.Date(calTomorrow.getTimeInMillis()));
      rsP = pstmP.executeQuery();
      while(rsP.next()) {
        int iIdPre       = rsP.getInt("ID");
        int iIdGru       = rsP.getInt("ID_GRU");
        int iIdAzi       = rsP.getInt("ID_AZI");
        int iIdFar       = rsP.getInt("ID_FAR");
        String sCodice   = rsP.getString("CODICE");
        Timestamp tsDIns = rsP.getTimestamp("DATA_INSERT");
        Date dDataApp    = rsP.getDate("DATA_APPUNTAMENTO");
        int iOraApp      = rsP.getInt("ORA_APPUNTAMENTO");
        int iIdCliente   = rsP.getInt("ID_CLIENTE");
        String sNumero   = DataUtil.normalizePhoneNumber(rsP.getString("TELEFONO_1"));
        int iDataApp     = WUtil.toIntDate(dDataApp, 0);
        
        logger.debug("TimerTaskReminder.run ID=" + iIdPre + ",ID_GRU=" + iIdGru + ",ID_FAR=" + iIdFar + ",ID_AZI=" + iIdAzi + ",ID_CLIENTE=" + iIdCliente + ",DATA_INSERT= " + WUtil.formatDateTime(tsDIns, "-", true) + ",DATA_APPUNTAMENTO=" + iDataApp + ",ORA_APPUNTAMENTO=" + iOraApp + ",TELEFONO_1=" + sNumero + "...");
        
        if(tsDIns != null) {
          // Le prenotazioni effettuate cinque minuti fa si saltano
          long lTimeDataInsert = tsDIns.getTime();
          long lDiff = currentTimeMillis - lTimeDataInsert;
          if(lDiff < 300000) continue;
        }
        if(sNumero == null || sNumero.length() < 12) {
          continue;
        }
        if(iDataApp < iCurrentDate) {
          continue;
        }
        if(iDataApp == iCurrentDate && iOraApp <= iCurrentTime) {
          continue;
        }
        
        boolean boSameAppointment = false;
        if(iLastIdCLiente != 0 && iLastIdCLiente == iIdCliente) {
          if(sLastCodice != null && sLastCodice.equals(sCodice)) {
            // Stesso appuntamento
            boSameAppointment = true;
          }
          if(iLastDataApp == iDataApp) {
            int iMinutes = DataUtil.diffMinutes(iOraApp, iLastOraApp);
            if(iMinutes <= 90) {
              // Appuntamenti ravvicinati stessa giornata
              boSameAppointment = true;
            }
          }
        }
        sLastCodice    = sCodice;
        iLastIdCLiente = iIdCliente;
        iLastDataApp   = iDataApp;
        iLastOraApp    = iOraApp;
        
        String sKeyMsg = iIdGru + ":" + iIdFar;
        String sMessaggio = mapMessaggi.get(sKeyMsg);
        if(sMessaggio == null) {
          pstmC.setInt(1, iIdGru);
          pstmC.setInt(2, iIdFar);
          pstmC.setString(3, "REMINDER");
          pstmC.setInt(4, 1); // FLAG_ATTIVO
          rsC = pstmC.executeQuery();
          if(rsC.next()) sMessaggio = rsC.getString(1);
          rsC.close();
          if(sMessaggio != null && sMessaggio.length() > 4) {
            mapMessaggi.put(sKeyMsg, sMessaggio);
          }
        }
        if(sMessaggio == null || sMessaggio.length() < 5) {
          continue;
        }
        int iParams = sMessaggio.indexOf('$');
        if(iParams < 0) {
          continue;
        }
        
        sMessaggio = sMessaggio.replace("$d", WUtil.formatDate(dDataApp, "IT"));
        sMessaggio = sMessaggio.replace("$o", WUtil.formatTime(iOraApp, false, false));
        String sLogMsg = sMessaggio != null ? sMessaggio.replace('\n', ' ') : "null";
        
        if(!boSameAppointment) {
          logger.debug("TimerTaskReminder.run SMSManager.sendSMS(" + sNumero + "," + sLogMsg + ")...");
          boolean sent = false;
          try {
            SMSManager.sendSMS(conn, 0, iIdGru, iIdAzi, iIdFar, iIdCliente, sNumero, sMessaggio);
          } 
          catch (Exception e) {
            logger.error("Eccezione in TimerTaskReminder.run()[sendSMS]", e);
          }
          
          if(sent) {
            pstmU.setTimestamp(1, new java.sql.Timestamp(System.currentTimeMillis()));
            pstmU.setInt(2, iIdPre);
            pstmU.executeUpdate();
          }
        }
        else {
          pstmU.setTimestamp(1, new java.sql.Timestamp(System.currentTimeMillis()));
          pstmU.setInt(2, iIdPre);
          pstmU.executeUpdate();
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in TimerTaskReminder.run()", ex);
    }
    finally {
      ConnectionManager.close(rsP, rsC, pstmP, pstmC, pstmU, conn);
      running   = false;
      firstTime = false;
    }
  }
}