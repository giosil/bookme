package org.dew.bookme.ws;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.transaction.UserTransaction;

import org.apache.log4j.Logger;

import org.util.WUtil;

import org.dew.bookme.bl.Chiusura;
import org.dew.bookme.bl.User;
import org.dew.bookme.dao.DAOAgende;
import org.dew.bookme.util.ConnectionManager;
import org.dew.bookme.util.DBUtil;
import org.dew.bookme.util.WSContext;

/**
 * Servizio da rivedere per la sua stretta correlazione al calendario e alle prenotazioni. 
 */
public 
class WSChiusure 
{
  protected static Logger logger = Logger.getLogger(WSChiusure.class);
  
  public static
  List<Chiusura> getAll()
      throws Exception
  {
    List<Chiusura> listResult = new ArrayList<Chiusura>();
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "SELECT ID,ID_FAR,DATA_CALENDARIO,MESE_GIORNO,DESCRIZIONE ";
    sSQL += "FROM PRZ_CALENDARIO_CHIUSURE ";
    sSQL += "WHERE ID_GRU=? AND FLAG_ATTIVO=? AND (DATA_CALENDARIO IS NULL OR DATA_CALENDARIO >= ?) ";
    sSQL += "ORDER BY DATA_CALENDARIO,MESE_GIORNO";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,  iIdGru);
      pstm.setInt(++p,  1);
      pstm.setDate(++p, new java.sql.Date(WUtil.getCurrentDate().getTimeInMillis()));
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId          = rs.getInt("ID");
        int    iIdFar       = rs.getInt("ID_FAR");
        Date   dDataCal     = rs.getDate("DATA_CALENDARIO");
        int    iMeseGiorno  = rs.getInt("MESE_GIORNO");
        String sDescrizione = rs.getString("DESCRIZIONE");
        
        Chiusura chiusura = new Chiusura(iId, iIdFar, WUtil.toDate(dDataCal, null), iMeseGiorno, sDescrizione, iMeseGiorno != 0);
        
        listResult.add(chiusura);
        if(listResult.size() > 2000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSChiusure.getAll", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<Chiusura> find(Chiusura filter)
      throws Exception
  {
    List<Chiusura> listResult = new ArrayList<Chiusura>();
    
    if(filter == null) filter = new Chiusura();
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    java.util.Date dDataDal = filter.getData();
    int iFIdFar = filter.getIdFar();
    
    String sSQL = "SELECT ID,ID_FAR,DATA_CALENDARIO,MESE_GIORNO,DESCRIZIONE ";
    sSQL += "FROM PRZ_CALENDARIO_CHIUSURE ";
    sSQL += "WHERE ID_GRU=? AND FLAG_ATTIVO=? ";
    if(iFIdFar != 0) {
      sSQL += "AND ID_FAR=? ";
    }
    if(dDataDal != null) {
      sSQL += "AND (DATA_CALENDARIO IS NULL OR DATA_CALENDARIO >= ?) ";
    }
    sSQL += "ORDER BY DATA_CALENDARIO,MESE_GIORNO";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p, iIdGru);
      pstm.setInt(++p, 1);
      if(iFIdFar != 0) {
        pstm.setInt(++p, iFIdFar);
      }
      if(dDataDal != null) {
        pstm.setDate(++p, new java.sql.Date(dDataDal.getTime()));
      }
      
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId          = rs.getInt("ID");
        int    iIdFar       = rs.getInt("ID_FAR");
        Date   dDataCal     = rs.getDate("DATA_CALENDARIO");
        int    iMeseGiorno  = rs.getInt("MESE_GIORNO");
        String sDescrizione = rs.getString("DESCRIZIONE");
        
        Chiusura chiusura = new Chiusura(iId, iIdFar, WUtil.toDate(dDataCal, null), iMeseGiorno, sDescrizione, iMeseGiorno != 0);
        
        listResult.add(chiusura);
        if(listResult.size() > 2000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSChiusure.find", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  Chiusura read(int iId)
      throws Exception
  {
    Chiusura result = null;
    
    if(iId == 0) return result;
    
    String sSQL = "SELECT ID,ID_FAR,DATA_CALENDARIO,MESE_GIORNO,DESCRIZIONE FROM PRZ_CALENDARIO_CHIUSURE WHERE ID=?";
    
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(1, iId);
      rs = pstm.executeQuery();
      if(rs.next()) {
        int    iIdFar       = rs.getInt("ID_FAR");
        Date   dDataCal     = rs.getDate("DATA_CALENDARIO");
        int    iMeseGiorno  = rs.getInt("MESE_GIORNO");
        String sDescrizione = rs.getString("DESCRIZIONE");
        
        if(dDataCal == null && iMeseGiorno != 0) {
          Calendar cal = Calendar.getInstance();
          int iYear = cal.get(Calendar.YEAR);
          dDataCal = WUtil.toSQLDate(iYear * 10000 + iMeseGiorno, null);
        }
        
        result = new Chiusura(iId, iIdFar, WUtil.toDate(dDataCal, null), iMeseGiorno, sDescrizione, iMeseGiorno != 0);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSChiusure.read(" + iId + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return result;
  }
  
  public 
  Chiusura insert(Chiusura record) 
      throws Exception 
  {
    if(record == null) return null;
    
    int iIdFar = record.getIdFar();
    if(iIdFar == 0) {
      throw new Exception("Invalid idFar");
    }
    Date dData = WUtil.toSQLDate(record.getData(), null);
    if(dData == null) {
      throw new Exception("Invalid Data");
    }
    if(record.isAnnuale()) {
      int iData = WUtil.toIntDate(dData, 0);
      record.setMeseGiorno(iData % 10000);
    }
    else {
      record.setMeseGiorno(0);
    }
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "INSERT INTO PRZ_CALENDARIO_CHIUSURE(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,ID_FAR,DATA_CALENDARIO,MESE_GIORNO,DESCRIZIONE) VALUES(?,?,?,?,?,?,?,?,?)";
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_CALENDARIO_CHIUSURE");
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,       iId);
      pstm.setInt(++p,       iIdUte);
      pstm.setDate(++p,      new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
      pstm.setInt(++p,       1); // FLAG_ATTIVO
      pstm.setInt(++p,       iIdGru);
      pstm.setInt(++p,       iIdFar);
      pstm.setDate(++p,      dData);
      pstm.setInt(++p,       record.getMeseGiorno());
      pstm.setString(++p,    record.getDescrizione());
      pstm.executeUpdate();
      
      if(dData != null) {
        DBUtil.execUpd(conn, "DELETE FROM PRZ_CALENDARIO WHERE ID_FAR=? AND DATA_CALENDARIO=?", iIdFar, dData);
      }
      
      ut.commit();
      
      record.setId(iId);
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSChiusure.insert", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return record;
  }
  
  public 
  Chiusura update(Chiusura record) 
      throws Exception 
  {
    if(record == null || record.getId() == 0) {
      throw new Exception("Identificativo assente");
    }
    
    int iIdFar = record.getIdFar();
    if(iIdFar == 0) {
      throw new Exception("Invalid idFar");
    }
    Date dData = WUtil.toSQLDate(record.getData(), null);
    if(dData == null) {
      throw new Exception("Invalid Data");
    }
    if(record.isAnnuale()) {
      int iData = WUtil.toIntDate(dData, 0);
      record.setMeseGiorno(iData % 10000);
    }
    else {
      record.setMeseGiorno(0);
    }
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    int iId = record.getId();
    
    String sSQL = "UPDATE PRZ_CALENDARIO_CHIUSURE SET DATA_CALENDARIO=?,MESE_GIORNO=?,DESCRIZIONE=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?";
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstm = conn.prepareStatement(sSQL);
      // SET
      pstm.setDate(++p,   dData);
      pstm.setInt(++p,    record.getMeseGiorno());
      pstm.setString(++p, record.getDescrizione());
      pstm.setInt(++p,    iIdUte);
      pstm.setDate(++p,   new java.sql.Date(System.currentTimeMillis())); // DATA_UPDATE
      // WHERE
      pstm.setInt(++p,    iId);
      pstm.executeUpdate();
      
      if(dData != null) {
        DBUtil.execUpd(conn, "DELETE FROM PRZ_CALENDARIO WHERE ID_FAR=? AND DATA_CALENDARIO=?", iIdFar, dData);
      }
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSChiusure.update", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return record;
  }
  
  public 
  boolean delete(int iId) 
      throws Exception 
  {
    boolean result = false;
    
    User user = WSContext.getUser();
    
    Date dDataCal = null;
    int  iIdFar = 0;
    
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstmD = null;
    PreparedStatement pstmC = null;
    ResultSet rsC = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstmC = conn.prepareStatement("SELECT ID_FAR,DATA_CALENDARIO FROM PRZ_CALENDARIO_CHIUSURE WHERE ID=?");
      pstmC.setInt(1, iId);
      rsC = pstmC.executeQuery();
      if(rsC.next()) {
        iIdFar   = rsC.getInt("ID_FAR");
        dDataCal = rsC.getDate("DATA_CALENDARIO");
      }
      rsC.close();
      pstmC.close();
      if(dDataCal == null) return false;
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstmD = conn.prepareStatement("DELETE FROM PRZ_CALENDARIO_CHIUSURE WHERE ID=?");
      pstmD.setInt(1, iId);
      int iRows = pstmD.executeUpdate();
      
      // Si rigenerano le agende dei collaboratori per la data di chiusura
      if(iIdFar != 0 && dDataCal != null) {
        pstmC = conn.prepareStatement("SELECT ID FROM PRZ_COLLABORATORI WHERE ID_FAR=? AND FLAG_ATTIVO=1 ORDER BY ID");
        pstmC.setInt(1, iIdFar);
        rsC = pstmC.executeQuery();
        while(rsC.next()) {
          int iIdColl = rsC.getInt("ID");
          
          DAOAgende.generate(conn, iIdColl, dDataCal, user);
        }
      }
      
      ut.commit();
      
      result = iRows > 0;
    }
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSChiusure.delete(" + iId + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(rsC, pstmC, pstmD, conn);
    }
    return result;
  }
}
