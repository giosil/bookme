package org.dew.bookme.ws;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.util.WUtil;
import org.dew.bookme.bl.ICalendario;
import org.dew.bookme.bl.User;
import org.dew.bookme.util.ConnectionManager;
import org.dew.bookme.util.WSContext;

public 
class WSStrutture 
{
  protected static Logger logger = Logger.getLogger(WSStrutture.class);
  
  public static
  List<Map<String,Object>> getFarmacie(int iIdFarmacia)
      throws Exception
  {
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "SELECT ID,ID_FAR,CODICE,DESCRIZIONE ";
    sSQL += "FROM PRZ_STRUTTURE ";
    sSQL += "WHERE ID_GRU=? AND FLAG_ATTIVO=? ";
    sSQL += "ORDER BY ID";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p, iIdGru);
      pstm.setInt(++p, 1);
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId          = rs.getInt("ID");
        int    iIdFar       = rs.getInt("ID_FAR");
        String sCodice      = rs.getString("CODICE");
        String sDescrizione = rs.getString("DESCRIZIONE");
        
        if(iId == 0 || iIdFar == 0) continue;
        if(sCodice == null || sCodice.length() == 0) {
          sCodice = String.valueOf(iIdFar);
        }
        if(sDescrizione == null || sDescrizione.length() == 0) {
          sDescrizione = "Struttura " + sCodice;
        }
        
        Map<String,Object> mapRecord = new HashMap<String,Object>(3);
        mapRecord.put("i", iIdFar);
        mapRecord.put("c", sCodice);
        mapRecord.put("d", sDescrizione);
        
        if(iIdFarmacia == iIdFar) {
          listResult.add(0, mapRecord);
        }
        else {
          listResult.add(mapRecord);
        }
        if(listResult.size() > 1000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSStrutture.getFarmacie", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> getFarmacie()
      throws Exception
  {
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "SELECT ID,ID_FAR,CODICE,DESCRIZIONE ";
    sSQL += "FROM PRZ_STRUTTURE ";
    sSQL += "WHERE ID_GRU=? AND FLAG_ATTIVO=? ";
    sSQL += "ORDER BY ID";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p, iIdGru);
      pstm.setInt(++p, 1);
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId          = rs.getInt("ID");
        int    iIdFar       = rs.getInt("ID_FAR");
        String sCodice      = rs.getString("CODICE");
        String sDescrizione = rs.getString("DESCRIZIONE");
        
        if(iId == 0 || iIdFar == 0) continue;
        if(sCodice == null || sCodice.length() == 0) {
          sCodice = String.valueOf(iIdFar);
        }
        if(sDescrizione == null || sDescrizione.length() == 0) {
          sDescrizione = "Struttura " + sCodice;
        }
        
        Map<String,Object> mapRecord = new HashMap<String,Object>(3);
        mapRecord.put("i", iIdFar);
        mapRecord.put("c", sCodice);
        mapRecord.put("d", sDescrizione);
        
        listResult.add(mapRecord);
        if(listResult.size() > 1000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSStrutture.getFarmacie", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  Map<String,Object> getConfiguration(int iIdFarmacia)
      throws Exception
  {
    Map<String,Object> mapResult = null;
    
    Connection conn = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      mapResult = getConfiguration(conn, iIdFarmacia);
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSStrutture.getConfiguration(" + iIdFarmacia + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
    
    if(mapResult == null) mapResult = new HashMap<String,Object>();
    return mapResult;
  }
  
  public static
  Map<String,Object> getConfiguration(Connection conn, int iIdFarmacia)
      throws Exception
  {
    Map<String,Object> mapResult = new HashMap<String,Object>();
    
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement("SELECT CHECK_USER_DESK FROM PRZ_STRUTTURE WHERE ID_FAR=? AND FLAG_ATTIVO=?");
      pstm.setInt(1, iIdFarmacia);
      pstm.setInt(2, 1);
      rs = pstm.executeQuery();
      if(rs.next()) {
        int iCheckUserDesk = rs.getInt("CHECK_USER_DESK");
        mapResult.put(ICalendario.sCHECK_USER_DESK, WUtil.toBoolean(iCheckUserDesk, false));
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSStrutture.getConfiguration(conn, " + iIdFarmacia + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    
    return mapResult;
  }
  
  public static
  String readCheckUserDesk(Connection conn, int iIdFarmacia)
      throws Exception
  {
    String sResult = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement("SELECT CHECK_USER_DESK FROM PRZ_STRUTTURE WHERE ID_FAR=? AND FLAG_ATTIVO=?");
      pstm.setInt(1, iIdFarmacia);
      pstm.setInt(2, 1);
      rs = pstm.executeQuery();
      if(rs.next()) {
        int iCheckUserDesk = rs.getInt("CHECK_USER_DESK");
        if(iCheckUserDesk != 0) {
          sResult = String.valueOf(iCheckUserDesk);
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSStrutture.readCheckUserDesk(conn, " + iIdFarmacia + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return sResult;
  }
}
