package org.dew.bookme.ws;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.UserTransaction;

import org.apache.log4j.Logger;
import org.util.WList;
import org.util.WUtil;

import org.dew.bookme.bl.Cliente;
import org.dew.bookme.bl.Comunicazione;
import org.dew.bookme.bl.User;

import org.dew.bookme.util.ConnectionManager;
import org.dew.bookme.util.WSContext;

public 
class WSComunicazioni 
{
  protected static Logger logger = Logger.getLogger(WSComunicazioni.class);
  
  public static
  List<Comunicazione> getAll(int iIdFar)
      throws Exception
  {
    List<Comunicazione> listResult = new ArrayList<Comunicazione>();
    
    if(iIdFar == 0) return listResult;
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "SELECT ID,OGGETTO ";
    sSQL += "FROM PRZ_COMUNICAZIONI ";
    sSQL += "WHERE ID_GRU=? AND ID_FAR=? AND FLAG_ATTIVO=? ";
    sSQL += "ORDER BY OGGETTO";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p, iIdGru);
      pstm.setInt(++p, iIdFar);
      pstm.setInt(++p, 1);
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId      = rs.getInt("ID");
        String sOggetto = rs.getString("OGGETTO");
        
        if(iId == 0) continue;
        
        Comunicazione record = new Comunicazione();
        record.setId(iId);
        record.setOggetto(sOggetto);
        
        listResult.add(record);
        if(listResult.size() > 1000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSComunicazioni.getAll", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<Comunicazione> find(Comunicazione filter)
      throws Exception
  {
    List<Comunicazione> listResult = new ArrayList<Comunicazione>();
    
    if(filter == null) filter = new Comunicazione();
    
    int iIdFar = filter.getIdFar();
    if(iIdFar == 0) return listResult;
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sFOggetto = WUtil.toUpperString(filter.getOggetto(), null);
    
    String sSQL = "SELECT ID,OGGETTO ";
    sSQL += "FROM PRZ_COMUNICAZIONI ";
    sSQL += "WHERE ID_GRU=? AND ID_FAR=? AND FLAG_ATTIVO=? ";
    if(sFOggetto != null && sFOggetto.length() > 0) {
      sSQL += "AND OGGETTO LIKE ? ";
    }
    sSQL += "ORDER BY OGGETTO";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p, iIdGru);
      pstm.setInt(++p, iIdFar);
      pstm.setInt(++p, 1);
      if(sFOggetto != null && sFOggetto.length() > 0) {
        pstm.setString(++p, "%" + sFOggetto + "%");
      }
      
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId      = rs.getInt("ID");
        String sOggetto = rs.getString("OGGETTO");
        
        if(iId == 0) continue;
        
        Comunicazione record = new Comunicazione();
        record.setId(iId);
        record.setOggetto(sOggetto);
        
        listResult.add(record);
        if(listResult.size() > 1000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSComunicazioni.find", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  Comunicazione read(int iId)
      throws Exception
  {
    Comunicazione result = null;
    
    if(iId == 0) return result;
    
    String sSQL = "SELECT ID,OGGETTO,MESSAGGIO,MEZZO FROM PRZ_COMUNICAZIONI WHERE ID=?";
    
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(1, iId);
      rs = pstm.executeQuery();
      if(rs.next()) {
        String sOggetto   = rs.getString("OGGETTO");
        String sMessaggio = rs.getString("MESSAGGIO");
        String sMezzo     = rs.getString("MEZZO");
        
        result = new Comunicazione();
        result.setId(iId);
        result.setOggetto(sOggetto);
        result.setMessaggio(sMessaggio);
        result.setMezzo(sMezzo);
      }
      
      if(result != null) {
        rs.close();
        pstm.close();
        
        sSQL = "SELECT C.ID,C.COGNOME,C.NOME,C.TELEFONO_1 ";
        sSQL += "FROM PRZ_COMUNICAZIONI_CODA Q,PRZ_CLIENTI C ";
        sSQL += "WHERE Q.ID_CLIENTE=C.ID AND C.FLAG_ATTIVO=1 AND Q.ID_COMUNICAZIONE=? ";
        sSQL += "GROUP BY C.ID,C.COGNOME,C.NOME,C.TELEFONO_1 ";
        sSQL += "ORDER BY C.COGNOME,C.NOME";
        
        List<Cliente> listCoda = new ArrayList<Cliente>();
        result.setCoda(listCoda);
        
        int iProg = 0;
        pstm = conn.prepareStatement(sSQL);
        pstm.setInt(1, iId);
        rs = pstm.executeQuery();
        while(rs.next()) {
          int iIdCliente   = rs.getInt("ID");
          String sCognome  = rs.getString("COGNOME");
          String sNome     = rs.getString("NOME");
          String sTelefono = rs.getString("TELEFONO_1");
          iProg++;
          
          Cliente cliente = new Cliente(iIdCliente, sCognome, sNome, sTelefono);
          cliente.setReputazione(iProg);
          listCoda.add(cliente);
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSComunicazioni.read(" + iId + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return result;
  }
  
  public 
  Comunicazione insert(Comunicazione record) 
      throws Exception 
  {
    if(record == null) return null;
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "INSERT INTO PRZ_COMUNICAZIONI(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,ID_FAR,OGGETTO,MESSAGGIO,MEZZO) VALUES(?,?,?,?,?,?,?,?,?)";
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_COMUNICAZIONI");
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,       iId);
      pstm.setInt(++p,       iIdUte);
      pstm.setDate(++p,      new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
      pstm.setInt(++p,       1); // FLAG_ATTIVO
      pstm.setInt(++p,       iIdGru);
      pstm.setInt(++p,       record.getIdFar());
      pstm.setString(++p,    WUtil.toUpperString(record.getOggetto(), String.valueOf(iId)));
      pstm.setString(++p,    WUtil.toString(record.getMessaggio(), ""));
      pstm.setString(++p,    WUtil.toString(record.getMezzo(), "M"));
      pstm.executeUpdate();
      
      ut.commit();
      
      record.setId(iId);
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSComunicazioni.insert", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return record;
  }
  
  public 
  Comunicazione update(Comunicazione record) 
      throws Exception 
  {
    if(record == null || record.getId() == 0) {
      throw new Exception("Identificativo assente");
    }
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    int iId = record.getId();
    
    String sSQL = "UPDATE PRZ_COMUNICAZIONI SET OGGETTO=?,MESSAGGIO=?,MEZZO=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?";
    
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
      pstm.setString(++p,    WUtil.toUpperString(record.getOggetto(), String.valueOf(iId)));
      pstm.setString(++p,    WUtil.toString(record.getMessaggio(), ""));
      pstm.setString(++p,    WUtil.toString(record.getMezzo(),     "M"));
      pstm.setInt(++p,       iIdUte);
      pstm.setDate(++p,      new java.sql.Date(System.currentTimeMillis())); // DATA_UPDATE
      // WHERE
      pstm.setInt(++p,       iId);
      pstm.executeUpdate();
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSComunicazioni.update", ex);
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
      
      pstm = conn.prepareStatement("UPDATE PRZ_COMUNICAZIONI SET FLAG_ATTIVO=?,ID_UTE_DELETE=?,DATA_DELETE=? WHERE ID=?");
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
      logger.error("Eccezione in WSComunicazioni.delete(" + iId + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return result;
  }
  
  public static
  int add(int iId, List<?> listOfId)
      throws Exception
  {
    if(iId == 0 || listOfId == null || listOfId.size() == 0) {
      return 0;
    }
    WList wlist = new WList(listOfId);
    
    long lCurrentTimeMillis = System.currentTimeMillis();
    
    int result = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstm = conn.prepareStatement("INSERT INTO PRZ_COMUNICAZIONI_CODA(ID_COMUNICAZIONE,ID_CLIENTE,DATA_ORA_INS) VALUES(?,?,?)");
      
      for(int i = 0; i < wlist.size(); i++) {
        int iIdCliente = wlist.getInt(i);
        if(iIdCliente == 0) continue;
        try {
          pstm.setInt(1, iId);
          pstm.setInt(2, iIdCliente);
          pstm.setTimestamp(3, new java.sql.Timestamp(lCurrentTimeMillis));
          pstm.executeUpdate();
          result++;
        }
        catch(Exception ex) {
          logger.warn("WSComunicazioni.add(" + iId + ",...) iIdCliente=" + iIdCliente + " non aggiunto");
        }
      }
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSComunicazioni.add(" + iId + "," + listOfId + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return result;
  }
  
  public static
  boolean remove(int iId, int iIdCliente) 
      throws Exception 
  {
    boolean result = false;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstm = conn.prepareStatement("DELETE FROM PRZ_COMUNICAZIONI_CODA WHERE ID_COMUNICAZIONE=? AND ID_CLIENTE=?");
      pstm.setInt(1, iId);
      pstm.setInt(2, iIdCliente);
      int iRows = pstm.executeUpdate();
      
      ut.commit();
      
      result = iRows > 0;
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSComunicazioni.remove(" + iId + "," + iIdCliente + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return result;
  }
  
  public static
  boolean removeAll(int iId) 
      throws Exception 
  {
    boolean result = false;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstm = conn.prepareStatement("DELETE FROM PRZ_COMUNICAZIONI_CODA WHERE ID_COMUNICAZIONE=?");
      pstm.setInt(1, iId);
      int iRows = pstm.executeUpdate();
      
      ut.commit();
      
      result = iRows > 0;
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSComunicazioni.removeAll(" + iId + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return result;
  }
}