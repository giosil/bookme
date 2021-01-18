package org.dew.bookme.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;

import org.apache.log4j.Logger;

import org.dew.bookme.util.ConnectionManager;

public 
class DAOLog 
{
  protected static Logger logger = Logger.getLogger(DAOLog.class);
  
  public static
  int insertLogSms(Connection conn, int iIdUtente, int iIdGru, int iIdAzi, int iIdFar, int iIdCliente, String sNumero, String sMessaggio, boolean boInviato, String sRisposta)
  {
    if(sNumero == null || sNumero.length() == 0) return 0;
    if(sMessaggio == null || sMessaggio.length() == 0)  return 0;
    if(sMessaggio.length() > 160) sMessaggio = sMessaggio.substring(0, 160).replace('\n', ' ');
    if(sRisposta == null || sRisposta.length() == 0) sRisposta = "-";
    if(sRisposta.length() > 255) sRisposta = sRisposta.substring(0, 255).replace('\n', ' ');
    
    int iResult = 0;
    PreparedStatement pstm = null;
    try {
      int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_LOG_SMS");
      
      pstm = conn.prepareStatement("INSERT INTO PRZ_LOG_SMS(ID,ID_UTE_INSERT,DATA_INSERT,ID_GRU,ID_AZI,ID_FAR,ID_CLIENTE,NUMERO,MESSAGGIO,INVIATO,RISPOSTA) VALUES(?,?,?,?,?,?,?,?,?,?,?)");
      pstm.setInt(1, iId);
      pstm.setInt(2, iIdUtente);
      pstm.setTimestamp(3, new java.sql.Timestamp(System.currentTimeMillis()));
      pstm.setInt(4, iIdGru);
      pstm.setInt(5, iIdAzi);
      pstm.setInt(6, iIdFar);
      pstm.setInt(7, iIdCliente);
      pstm.setString(8, sNumero);
      pstm.setString(9, sMessaggio);
      pstm.setInt(10, boInviato ? 1 : 0);
      pstm.setString(11, sRisposta);
      pstm.executeUpdate();
    }
    catch(Exception ex) {
      logger.error("Eccezione in DAOLog.insertLogSms", ex);
    }
    finally {
      if(pstm != null) try { pstm.close(); } catch(Exception ex) {}
    }
    return iResult;
  }
}
