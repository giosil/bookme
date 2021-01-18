package org.dew.bookme.ws;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import javax.transaction.UserTransaction;

import org.apache.log4j.Logger;
import org.util.WUtil;

import org.dew.bookme.bl.GruppoPrestazione;
import org.dew.bookme.bl.User;
import org.dew.bookme.util.ConnectionManager;
import org.dew.bookme.util.WSContext;

public 
class WSGruppiPrestazioni 
{
  protected static Logger logger = Logger.getLogger(WSGruppiPrestazioni.class);
  
  public static
  List<GruppoPrestazione> find(GruppoPrestazione filter)
      throws Exception
  {
    List<GruppoPrestazione> listResult = new ArrayList<GruppoPrestazione>();
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    if(filter == null) filter = new GruppoPrestazione();
    int iIdFar = filter.getIdFar();
    String sFCodice = filter.getCodice();
    String sFDescrizione = filter.getDescrizione();
    
    String sSQL = "SELECT ID,CODICE,DESCRIZIONE ";
    sSQL += "FROM PRZ_PRESTAZIONI_GRUPPI ";
    sSQL += "WHERE ID_GRU=? AND ID_FAR=? AND FLAG_ATTIVO=? ";
    if(sFCodice != null && sFCodice.length() > 0) {
      sSQL += "AND CODICE LIKE ? ";
    }
    if(sFDescrizione != null && sFDescrizione.length() > 0) {
      sSQL += "AND UPPER(DESCRIZIONE) LIKE ? ";
    }
    sSQL += "ORDER BY DESCRIZIONE";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p, iIdGru);
      pstm.setInt(++p, iIdFar);
      pstm.setInt(++p, 1); // FLAG_ATTIVO
      if(sFCodice != null && sFCodice.length() > 0) {
        pstm.setString(++p, sFCodice + "%");
      }
      if(sFDescrizione != null && sFDescrizione.length() > 0) {
        pstm.setString(++p, sFDescrizione + "%");
      }
      
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId          = rs.getInt("ID");
        String sCodice      = rs.getString("CODICE");
        String sDescrizione = rs.getString("DESCRIZIONE");
        
        if(iId == 0) continue;
        
        GruppoPrestazione record = new GruppoPrestazione();
        record.setId(iId);
        record.setCodice(sCodice);
        record.setDescrizione(sDescrizione);
        
        listResult.add(record);
        if(listResult.size() > 1000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSGruppiPrestazioni.find", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  GruppoPrestazione read(int iId)
      throws Exception
  {
    GruppoPrestazione result = null;
    
    if(iId == 0) return result;
    
    String sSQL = "SELECT ID,CODICE,DESCRIZIONE FROM PRZ_PRESTAZIONI_GRUPPI WHERE ID=?";
    
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(1, iId);
      rs = pstm.executeQuery();
      if(rs.next()) {
        String sCodice      = rs.getString("CODICE");
        String sDescrizione = rs.getString("DESCRIZIONE");
        
        result = new GruppoPrestazione();
        result.setId(iId);
        result.setCodice(sCodice);
        result.setDescrizione(sDescrizione);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSGruppiPrestazioni.read(" + iId + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return result;
  }
  
  public static
  GruppoPrestazione insert(GruppoPrestazione record) 
      throws Exception 
  {
    if(record == null) return null;
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "INSERT INTO PRZ_PRESTAZIONI_GRUPPI(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,ID_FAR,CODICE,DESCRIZIONE) VALUES(?,?,?,?,?,?,?,?)";
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_PRESTAZIONI_GRUPPI");
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,       iId);
      pstm.setInt(++p,       iIdUte);
      pstm.setDate(++p,      new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
      pstm.setInt(++p,       1); // FLAG_ATTIVO
      pstm.setInt(++p,       iIdGru);
      pstm.setInt(++p,       record.getIdFar());
      pstm.setString(++p,    WUtil.toUpperString(record.getCodice(), String.valueOf(iId)));
      pstm.setString(++p,    WUtil.toString(record.getDescrizione(), String.valueOf(iId)));
      pstm.executeUpdate();
      
      ut.commit();
      
      record.setId(iId);
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSGruppiPrestazioni.insert", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return record;
  }
  
  public static
  GruppoPrestazione update(GruppoPrestazione record) 
      throws Exception 
  {
    if(record == null || record.getId() == 0) {
      throw new Exception("Identificativo assente");
    }
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    int iId = record.getId();
    
    String sSQL = "UPDATE PRZ_PRESTAZIONI_GRUPPI SET CODICE=?,DESCRIZIONE=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?";
    
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
      pstm.setString(++p,    WUtil.toUpperString(record.getCodice(), String.valueOf(iId)));
      pstm.setString(++p,    WUtil.toString(record.getDescrizione(), String.valueOf(iId)));
      pstm.setInt(++p,       iIdUte);
      pstm.setDate(++p,      new java.sql.Date(System.currentTimeMillis())); // DATA_UPDATE
      // WHERE
      pstm.setInt(++p,       iId);
      pstm.executeUpdate();
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSGruppiPrestazioni.update(id=" + iId + ")", ex);
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
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstm = conn.prepareStatement("UPDATE PRZ_PRESTAZIONI_GRUPPI SET FLAG_ATTIVO=?,ID_UTE_DELETE=?,DATA_DELETE=? WHERE ID=?");
      // SET
      pstm.setInt(++p,  0); // FLAG_ATTIVO
      pstm.setInt(++p,  iIdUte);
      pstm.setDate(++p, new java.sql.Date(System.currentTimeMillis())); // DATA_DELETE
      // WHERE
      pstm.setInt(++p, iId);
      int iRows = pstm.executeUpdate();
      
      ut.commit();
      
      result = iRows > 0;
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSGruppiPrestazioni.delete(" + iId + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return result;
  }
}
