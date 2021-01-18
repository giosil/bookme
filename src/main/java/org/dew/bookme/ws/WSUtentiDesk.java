package org.dew.bookme.ws;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.UserTransaction;

import org.apache.log4j.Logger;

import org.dew.bookme.bl.User;
import org.dew.bookme.bl.UtenteDesk;

import org.dew.bookme.util.ConnectionManager;
import org.dew.bookme.util.Obfuscator;
import org.dew.bookme.util.WSContext;

public 
class WSUtentiDesk 
{
  protected static Logger logger = Logger.getLogger(WSUtentiDesk.class);
  
  public static
  String check(String sPassword)
      throws Exception
  {
    if(sPassword == null || sPassword.length() == 0) {
      return "";
    }
    sPassword = sPassword.trim().toUpperCase();
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    String sResult = null;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement("SELECT USERNAME FROM PRZ_UTENTI_DESK WHERE ID_GRU=? AND PASSWORD=? AND FLAG_ATTIVO=? AND ABILITATO=?");
      pstm.setInt(1,    iIdGru);
      pstm.setString(2, Obfuscator.encrypt(sPassword));
      pstm.setInt(3,    1); // FLAG_ATTIVO
      pstm.setInt(4,    1); // ABILITATO
      rs = pstm.executeQuery();
      if(rs.next()) {
        sResult = rs.getString("USERNAME");
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSUtentiDesk.check", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    if(sResult == null) sResult = "";
    return sResult;
  }
  
  public static
  String check(String sUsername, String sPassword)
      throws Exception
  {
    if(sUsername == null || sUsername.length() == 0) {
      return "";
    }
    sUsername = sUsername.trim().toUpperCase();
    if(sPassword == null || sPassword.length() == 0) {
      return "";
    }
    sPassword = sPassword.trim().toUpperCase();
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    String sResult = null;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement("SELECT USERNAME FROM PRZ_UTENTI_DESK WHERE ID_GRU=? AND USERNAME=? AND PASSWORD=? AND FLAG_ATTIVO=? AND ABILITATO=?");
      pstm.setInt(1,    iIdGru);
      pstm.setString(2, sUsername);
      pstm.setString(3, Obfuscator.encrypt(sPassword));
      pstm.setInt(4,    1); // FLAG_ATTIVO
      pstm.setInt(5,    1); // ABILITATO
      rs = pstm.executeQuery();
      if(rs.next()) {
        sResult = rs.getString("USERNAME");
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSUtentiDesk.check(" + sUsername + ",*)", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    if(sResult == null) sResult = "";
    return sResult;
  }
  
  public static
  List<UtenteDesk> find(UtenteDesk filter)
      throws Exception
  {
    List<UtenteDesk> listResult = new ArrayList<UtenteDesk>();
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    if(filter == null) filter = new UtenteDesk();
    int iIdFar = filter.getIdFar();
    String sFUsername = filter.getUsername();
    String sFPassword = filter.getPassword();
    String sFNote     = filter.getNote();
    
    String sSQL = "SELECT ID,USERNAME,PASSWORD,NOTE,ABILITATO ";
    sSQL += "FROM PRZ_UTENTI_DESK ";
    sSQL += "WHERE ID_GRU=? AND ID_FAR=? AND FLAG_ATTIVO=? ";
    if(sFUsername != null && sFUsername.length() > 0) {
      sSQL += "AND USERNAME LIKE ? ";
    }
    if(sFPassword != null && sFPassword.length() > 0) {
      sSQL += "AND PASSWORD LIKE ? ";
    }
    if(sFNote != null && sFNote.length() > 0) {
      sSQL += "AND UPPER(NOTE) LIKE ? ";
    }
    sSQL += "ORDER BY USERNAME";
    
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
      if(sFUsername != null && sFUsername.length() > 0) {
        pstm.setString(++p, sFUsername.trim().toUpperCase() + "%");
      }
      if(sFPassword != null && sFPassword.length() > 0) {
        pstm.setString(++p, sFPassword.trim().toUpperCase() + "%");
      }
      if(sFNote != null && sFNote.length() > 0) {
        pstm.setString(++p, sFNote + "%");
      }
      
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId        = rs.getInt("ID");
        String sUsername  = rs.getString("USERNAME");
        String sPassword  = rs.getString("PASSWORD");
        String sNote      = rs.getString("NOTE");
        int    iAbilitato = rs.getInt("ABILITATO");
        
        if(iId == 0) continue;
        
        UtenteDesk record = new UtenteDesk();
        record.setId(iId);
        record.setUsername(sUsername);
        record.setPassword(Obfuscator.decrypt(sPassword));
        record.setNote(sNote);
        record.setAbilitato(iAbilitato != 0);
        
        listResult.add(record);
        if(listResult.size() > 1000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSUtentiDesk.find", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  UtenteDesk read(int iId)
      throws Exception
  {
    UtenteDesk result = null;
    
    if(iId == 0) return result;
    
    String sSQL = "SELECT ID,USERNAME,PASSWORD,NOTE,ABILITATO FROM PRZ_UTENTI_DESK WHERE ID=?";
    
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(1, iId);
      rs = pstm.executeQuery();
      if(rs.next()) {
        String sUsername  = rs.getString("USERNAME");
        String sPassword  = rs.getString("PASSWORD");
        String sNote      = rs.getString("NOTE");
        int    iAbilitato = rs.getInt("ABILITATO");
        
        result = new UtenteDesk();
        result.setId(iId);
        result.setUsername(sUsername);
        result.setPassword(Obfuscator.decrypt(sPassword));
        result.setNote(sNote);
        result.setAbilitato(iAbilitato != 0);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSUtentiDesk.read(" + iId + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return result;
  }
  
  public static
  String exists(UtenteDesk filter)
      throws Exception
  {
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    if(filter == null) filter = new UtenteDesk();
    int iIdFar = filter.getIdFar();
    int    iIdUserDesk = filter.getId();
    String sFUsername  = filter.getUsername();
    String sFPassword  = filter.getPassword();
    
    if(iIdFar == 0) {
      return "";
    }
    if(sFUsername == null || sFUsername.length() == 0) {
      return "";
    }
    sFUsername = sFUsername.trim().toUpperCase();
    if(sFPassword == null || sFPassword.length() == 0) {
      return "";
    }
    sFPassword = sFPassword.trim().toUpperCase();
    
    String sFilterOnId = "";
    if(iIdUserDesk != 0) {
      sFilterOnId = " AND ID<>?";
    }
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      p = 0;
      pstm = conn.prepareStatement("SELECT ID FROM PRZ_UTENTI_DESK WHERE ID_GRU=? AND ID_FAR=? AND FLAG_ATTIVO=? AND USERNAME=?" + sFilterOnId);
      pstm.setInt(++p, iIdGru);
      pstm.setInt(++p, iIdFar);
      pstm.setInt(++p, 1); // FLAG_ATTIVO
      pstm.setString(++p, sFUsername);
      if(iIdUserDesk != 0) {
        pstm.setInt(++p, iIdUserDesk);
      }
      rs = pstm.executeQuery();
      if(rs.next()) return "Username";
      rs.close();
      pstm.close();
      
      p = 0;
      pstm = conn.prepareStatement("SELECT ID FROM PRZ_UTENTI_DESK WHERE ID_GRU=? AND ID_FAR=? AND FLAG_ATTIVO=? AND PASSWORD=?" + sFilterOnId);
      pstm.setInt(++p, iIdGru);
      pstm.setInt(++p, iIdFar);
      pstm.setInt(++p, 1); // FLAG_ATTIVO
      pstm.setString(++p, Obfuscator.encrypt(sFPassword));
      if(iIdUserDesk != 0) {
        pstm.setInt(++p, iIdUserDesk);
      }
      rs = pstm.executeQuery();
      if(rs.next()) return "Password";
      rs.close();
      pstm.close();
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSUtentiDesk.exists", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return "";
  }
  
  public static
  UtenteDesk insert(UtenteDesk record) 
      throws Exception 
  {
    if(record == null) return null;
    
    String sUsername = record.getUsername();
    if(sUsername == null || sUsername.length() == 0) {
      sUsername = "DESK";
    }
    sUsername = sUsername.trim().toUpperCase();
    record.setUsername(sUsername);
    String sPassword = record.getPassword();
    if(sPassword == null || sPassword.length() == 0) {
      sPassword = "DESK";
    }
    sPassword = sPassword.trim().toUpperCase();
    record.setPassword(sPassword);
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "INSERT INTO PRZ_UTENTI_DESK(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,ID_FAR,USERNAME,PASSWORD,NOTE,ABILITATO) VALUES(?,?,?,?,?,?,?,?,?,?)";
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_UTENTI_DESK");
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,       iId);
      pstm.setInt(++p,       iIdUte);
      pstm.setTimestamp(++p, new java.sql.Timestamp(System.currentTimeMillis())); // DATA_INSERT
      pstm.setInt(++p,       1); // FLAG_ATTIVO
      pstm.setInt(++p,       iIdGru);
      pstm.setInt(++p,       record.getIdFar());
      pstm.setString(++p,    record.getUsername());
      pstm.setString(++p,    Obfuscator.encrypt(record.getPassword()));
      pstm.setString(++p,    record.getNote());
      pstm.setInt(++p,       record.isAbilitato() ? 1 : 0);
      pstm.executeUpdate();
      
      ut.commit();
      
      record.setId(iId);
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSUtentiDesk.insert", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return record;
  }
  
  public static
  UtenteDesk update(UtenteDesk record) 
      throws Exception 
  {
    if(record == null || record.getId() == 0) {
      throw new Exception("Identificativo assente");
    }
    
    String sUsername = record.getUsername();
    if(sUsername == null || sUsername.length() == 0) {
      sUsername = "DESK";
    }
    sUsername = sUsername.trim().toUpperCase();
    record.setUsername(sUsername);
    String sPassword = record.getPassword();
    if(sPassword == null || sPassword.length() == 0) {
      sPassword = "DESK";
    }
    sPassword = sPassword.trim().toUpperCase();
    record.setPassword(sPassword);
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    int iId = record.getId();
    
    String sSQL = "UPDATE PRZ_UTENTI_DESK SET USERNAME=?,PASSWORD=?,NOTE=?,ABILITATO=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?";
    
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
      pstm.setString(++p,    record.getUsername());
      pstm.setString(++p,    Obfuscator.encrypt(record.getPassword()));
      pstm.setString(++p,    record.getNote());
      pstm.setInt(++p,       record.isAbilitato() ? 1 : 0);
      pstm.setInt(++p,       iIdUte);
      pstm.setDate(++p,      new java.sql.Date(System.currentTimeMillis())); // DATA_UPDATE
      // WHERE
      pstm.setInt(++p,       iId);
      pstm.executeUpdate();
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSUtentiDesk.update(id=" + iId + ")", ex);
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
    int iIdUte = user != null ? user.getId() : 0;
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstm = conn.prepareStatement("UPDATE PRZ_UTENTI_DESK SET FLAG_ATTIVO=?,ID_UTE_DELETE=?,DATA_DELETE=? WHERE ID=?");
      // SET
      pstm.setInt(++p, 0); // FLAG_ATTIVO
      pstm.setInt(++p, iIdUte);
      pstm.setTimestamp(++p, new java.sql.Timestamp(System.currentTimeMillis())); // DATA_DELETE
      // WHERE
      pstm.setInt(++p, iId);
      int iRows = pstm.executeUpdate();
      
      ut.commit();
      
      result = iRows > 0;
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSUtentiDesk.delete(" + iId + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return result;
  }
}
