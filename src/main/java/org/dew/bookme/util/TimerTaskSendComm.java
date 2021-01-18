package org.dew.bookme.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.util.Calendar;
import java.util.TimerTask;

import org.apache.log4j.Logger;

public 
class TimerTaskSendComm extends TimerTask 
{
  protected transient Logger logger = Logger.getLogger(getClass());
  
  protected transient boolean running = false;
  
  protected boolean firstTime = true;
  
  public
  void run()
  {
    if(running) return;
    running = true;
    
    logger.debug("TimerTaskSendComm.run 1.2...");
    
    Calendar cal = Calendar.getInstance();
    int iHour = cal.get(Calendar.HOUR_OF_DAY);
    if(iHour < 17 || iHour > 19) {
      logger.debug("TimerTaskSendComm.run (iHour=" + iHour + ") aborted");
      running = false;
      return;
    }
    
    String sHostName = System.getenv("HOSTNAME");
    if(sHostName == null || sHostName.length() == 0) {
      sHostName = System.getProperty("jboss.host.name");
    }
    if(sHostName == null || !sHostName.equalsIgnoreCase(BEConfig.PROD_HOST)) {
      logger.debug("TimerTaskSendComm.run (HOSTNAME=" + sHostName + ") aborted");
      running = false;
      return;
    }
    if(ConnectionManager.boIsOnDebug) {
      logger.debug("TimerTaskSendComm.run (ConnectionManager.boIsOnDebug=" + ConnectionManager.boIsOnDebug + ") aborted");
      running = false;
      return;
    }
    
    Connection conn = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      sendMessages(conn, 0);
    }
    catch(Exception ex) {
      logger.error("Eccezione in TimerTaskSendComm.run()", ex);
    }
    finally {
      ConnectionManager.closeConnection(conn);
      running   = false;
      firstTime = false;
    }
  }
  
  public
  int sendMessages(Connection conn, int iIdComunicazione)
    throws Exception
  {
    int iResult = 0;
    
    String sSQL_C = "SELECT ID,ID_GRU,ID_AZI,ID_FAR,MESSAGGIO FROM PRZ_COMUNICAZIONI WHERE FLAG_ATTIVO=1 ";
    if(iIdComunicazione != 0) sSQL_C += "AND ID=" + iIdComunicazione + " ";
    sSQL_C += "ORDER BY ID";
    
    String sSQL_L = "SELECT C.TELEFONO_1,C.ID,C.FLAG_ATTIVO ";
    sSQL_L += "FROM PRZ_COMUNICAZIONI_CODA Q,PRZ_CLIENTI C ";
    sSQL_L += "WHERE Q.ID_CLIENTE=C.ID AND Q.ID_COMUNICAZIONE=? ";
    sSQL_L += "ORDER BY C.TELEFONO_1";
    
    String sSQL_D = "DELETE FROM PRZ_COMUNICAZIONI_CODA WHERE ID_COMUNICAZIONE=? AND ID_CLIENTE=?";
    
    PreparedStatement pstmC = null;
    PreparedStatement pstmL = null;
    PreparedStatement pstmD = null;
    ResultSet rsC = null;
    ResultSet rsL = null;
    try {
      logger.debug("TimerTaskSendComm.run read PRZ_COMUNICAZIONI...");
      pstmC = conn.prepareStatement(sSQL_C);
      pstmL = conn.prepareStatement(sSQL_L);
      pstmD = conn.prepareStatement(sSQL_D);
      
      rsC = pstmC.executeQuery();
      while(rsC.next()) {
        int iIdCom = rsC.getInt("ID");
        int iIdGru = rsC.getInt("ID_GRU");
        int iIdAzi = rsC.getInt("ID_AZI");
        int iIdFar = rsC.getInt("ID_FAR");
        String sMessaggio = rsC.getString("MESSAGGIO");
        String sLogMsg    = sMessaggio != null ? sMessaggio.replace('\n', ' ') : "null";
        
        logger.debug("TimerTaskSendComm.run ID=" + iIdCom + ",ID_GRU=" + iIdGru + ",ID_AZI=" + iIdAzi + ",ID_FAR=" + iIdFar + ",MESSAGGIO=" + sLogMsg + "...");
        if(sMessaggio == null || sMessaggio.length() < 2) {
          continue;
        }
        
        int iCountMsgComm = 0;
        logger.debug("TimerTaskSendComm.run read PRZ_COMUNICAZIONI_CODA...");
        String sLastTelefono = null;
        pstmL.setInt(1, iIdCom);
        rsL = pstmL.executeQuery();
        while(rsL.next()) {
          String sTelefono   = DataUtil.normalizePhoneNumber(rsL.getString("TELEFONO_1"));
          int    iIdCliente  = rsL.getInt("ID");
          int    iFlagAttivo = rsL.getInt("FLAG_ATTIVO");
          
          logger.debug("TimerTaskSendComm.run ID_CLIENTE=" + iIdCliente + ",TELEFONO_1=" + sTelefono + ",FLAG_ATTIVO=" + iFlagAttivo + "...");
          
          boolean boSendSMS = true;
          if(sTelefono == null || sTelefono.length() < 12) {
            boSendSMS = false;
          }
          if(sLastTelefono != null && sLastTelefono.equals(sTelefono)) {
            boSendSMS = false;
          }
          if(iFlagAttivo == 0) {
            boSendSMS = false;
          }
          int iParams = sMessaggio.indexOf('$');
          if(iParams >= 0) {
            // Non si invano le comunicazioni parametrizzate (ad esempio il reminder)
            boSendSMS = false;
          }
          
          if(boSendSMS) {
            sLastTelefono = sTelefono;
            
            logger.debug("TimerTaskSendComm.run SMSManager.sendSMS(" + sTelefono + "," + sLogMsg + ")...");
            
            SMSManager.sendSMS(conn, 0, iIdGru, iIdAzi, iIdFar, iIdCliente, sTelefono, sMessaggio);
            
            iCountMsgComm++;
            iResult++;
          }
          
          logger.debug("TimerTaskSendComm.run delete PRZ_COMUNICAZIONI_CODA ID_COMUNICAZIONE=" + iIdCom + ",ID_CLIENTE=" + iIdCliente + "...");
          pstmD.setInt(1, iIdCom);
          pstmD.setInt(2, iIdCliente);
          pstmD.executeUpdate();
        }
        rsL.close();
        logger.debug("TimerTaskSendComm.run " + iCountMsgComm + " messages sent.");
      }
      
      logger.debug("TimerTaskSendComm.run A total of " + iResult + " messages were sent.");
    }
    finally {
      ConnectionManager.close(rsC, pstmC, rsL, pstmL, pstmD);
    }
    return iResult;
  }
}
