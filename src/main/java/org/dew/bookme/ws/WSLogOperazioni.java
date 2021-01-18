package org.dew.bookme.ws;

import java.sql.Connection;
import java.sql.PreparedStatement;

import org.apache.log4j.Logger;
import org.util.WUtil;

import org.dew.bookme.bl.Prenotazione;
import org.dew.bookme.bl.User;

import org.dew.bookme.util.ConnectionManager;
import org.dew.bookme.util.WSContext;

public 
class WSLogOperazioni 
{
  protected static Logger logger = Logger.getLogger(WSLogOperazioni.class);
  
  public static
  int insert(Connection conn, String sOperazione, Prenotazione prenotazione)
      throws Exception
  {
    if(prenotazione == null) return 0;
    if(sOperazione == null || sOperazione.length() == 0) {
      sOperazione = "Appuntamento";
    }
    User user = WSContext.getUser();
    String sUserDesk = prenotazione.getUserDesk();
    if(sUserDesk == null || sUserDesk.length() == 0 || sUserDesk.equals("-")) {
      sUserDesk = user != null ? user.getUserName() : "";
    }
    
    int iResult = 0;
    
    String sSQL = "INSERT INTO PRZ_LOG_OPERAZIONI(ID,DATA_INSERT,OPERAZIONE,UTENTE_SIST,UTENTE_DESK,ID_GRU,ID_FAR,ID_CLIENTE,ID_PRESTAZIONE,ID_COLLABORATORE,ID_ATTREZZATURA,ID_PRENOTAZIONE,ID_AGENDA,DATA_CALENDARIO) ";
    sSQL += "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    int p = 0;
    PreparedStatement pstm = null;
    try {
      iResult = ConnectionManager.nextVal(conn, "SEQ_PRZ_LOG_OPERAZIONI");
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,       iResult);
      pstm.setTimestamp(++p, new java.sql.Timestamp(System.currentTimeMillis())); // DATA_INSERT
      pstm.setString(++p,    sOperazione);
      pstm.setString(++p,    user != null ? user.getUserName() : "-");
      pstm.setString(++p,    sUserDesk);
      pstm.setInt(++p,       user != null ? user.getGroup() : 0);
      pstm.setInt(++p,       prenotazione.getIdFar());
      pstm.setInt(++p,       prenotazione.getIdCliente());
      pstm.setInt(++p,       prenotazione.getIdPrest());
      pstm.setInt(++p,       prenotazione.getIdColl());
      pstm.setInt(++p,       prenotazione.getIdAttr());
      pstm.setInt(++p,       prenotazione.getId());
      pstm.setInt(++p,       0); // ID_AGENDA
      pstm.setDate(++p,      WUtil.toSQLDate(prenotazione.getDataApp(), null)); // DATA_CALENDARIO 
      pstm.executeUpdate();
    } 
    catch (Exception ex) {
      logger.error("Eccezione in WSLogOperazioni.insert(" + sOperazione + "," + prenotazione + ")", ex);
    } 
    finally {
      if(pstm != null) try { pstm.close(); } catch(Exception ex) {}
    }
    
    return iResult;
  }
  
  public static
  int insert(Connection conn, String sOperazione, String sUserDesk, int iIdFar, Object dataCalendario, String sNote)
      throws Exception
  {
    if(sOperazione == null || sOperazione.length() == 0) {
      return 0;
    }
    if(sUserDesk == null || sUserDesk.length() == 0 || sUserDesk.equals("-")) {
      return 0;
    }
    
    User user = WSContext.getUser();
    if(sNote != null && sNote.length() > 255) {
      sNote = sNote.substring(0, 255);
    }
    
    int iResult = 0;
    
    String sSQL = "INSERT INTO PRZ_LOG_OPERAZIONI(ID,DATA_INSERT,OPERAZIONE,UTENTE_SIST,UTENTE_DESK,ID_GRU,ID_FAR,ID_CLIENTE,ID_PRESTAZIONE,ID_COLLABORATORE,ID_ATTREZZATURA,ID_PRENOTAZIONE,ID_AGENDA,DATA_CALENDARIO,LOG_NOTE) ";
    sSQL += "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    int p = 0;
    PreparedStatement pstm = null;
    try {
      iResult = ConnectionManager.nextVal(conn, "SEQ_PRZ_LOG_OPERAZIONI");
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,       iResult);
      pstm.setTimestamp(++p, new java.sql.Timestamp(System.currentTimeMillis())); // DATA_INSERT
      pstm.setString(++p,    sOperazione);
      pstm.setString(++p,    user != null ? user.getUserName() : "-");
      pstm.setString(++p,    sUserDesk);
      pstm.setInt(++p,       user != null ? user.getGroup() : 0);
      pstm.setInt(++p,       iIdFar);
      pstm.setInt(++p,       0); // ID_CLIENTE
      pstm.setInt(++p,       0); // ID_PRESTAZIONE
      pstm.setInt(++p,       0); // ID_COLLABORATORE
      pstm.setInt(++p,       0); // ID_ATTREZZATURA
      pstm.setInt(++p,       0); // ID_PRENOTAZIONE
      pstm.setInt(++p,       0); // ID_AGENDA
      pstm.setDate(++p,      WUtil.toSQLDate(dataCalendario, null)); // DATA_CALENDARIO
      pstm.setString(++p,    sNote); // LOG_NOTE
      pstm.executeUpdate();
    } 
    catch (Exception ex) {
      logger.error("Eccezione in WSLogOperazioni.insert(" + sOperazione + "," + sUserDesk + "," + iIdFar + "," + dataCalendario + "," + sNote + ")", ex);
    } 
    finally {
      if(pstm != null) try { pstm.close(); } catch(Exception ex) {}
    }
    
    return iResult;
  }
}
