package org.dew.bookme.ws;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.UserTransaction;

import org.apache.log4j.Logger;

import org.util.WUtil;

import org.dew.bookme.bl.Attrezzatura;
import org.dew.bookme.bl.Prenotazione;
import org.dew.bookme.bl.Prestazione;
import org.dew.bookme.bl.User;

import org.dew.bookme.util.ConnectionManager;
import org.dew.bookme.util.DBUtil;
import org.dew.bookme.util.DataUtil;
import org.dew.bookme.util.WSContext;

public 
class WSAttrezzature 
{
  protected static Logger logger = Logger.getLogger(WSAttrezzature.class);
  
  public static
  List<Attrezzatura> getAll(int iIdFar)
      throws Exception
  {
    List<Attrezzatura> listResult = new ArrayList<Attrezzatura>();
    
    if(iIdFar == 0) return listResult;
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "SELECT ID,CODICE,DESCRIZIONE ";
    sSQL += "FROM PRZ_ATTREZZATURE ";
    sSQL += "WHERE ID_GRU=? AND ID_FAR=? AND FLAG_ATTIVO=? ";
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
      pstm.setInt(++p, 1);
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId          = rs.getInt("ID");
        String sCodice      = rs.getString("CODICE");
        String sDescrizione = rs.getString("DESCRIZIONE");
        
        if(iId == 0) continue;
        
        Attrezzatura attrezzatura = new Attrezzatura(iId, sCodice, sDescrizione);
        
        listResult.add(attrezzatura);
        if(listResult.size() > 2000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSAttrezzature.getAll(" + iIdFar + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> getCollegate(Prenotazione prenotazione)
      throws Exception
  {
    if(prenotazione == null) return new ArrayList<Map<String,Object>>();
    
    return getCollegate(prenotazione.getIdFar(), prenotazione.getIdPrest(), prenotazione.getDataApp(), WUtil.toIntTime(prenotazione.getOraApp(), 0), prenotazione.getDurata());
  }
  
  public static
  List<Map<String,Object>> getCollegate(int iIdFar, int iIdPrest, Date dDate, int iOra, int iDurata)
      throws Exception
  {
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    if(iIdPrest == 0 || dDate == null) return listResult;
    
    String sSQL_A = "SELECT ID,DESCRIZIONE FROM PRZ_ATTREZZATURE WHERE ID_FAR=? AND FLAG_ATTIVO=1 ORDER BY DESCRIZIONE";
    
    String sSQL_C = "SELECT ID FROM PRZ_PRESTAZIONI_ATTREZ WHERE ID_PRESTAZIONE=? AND ID_ATTREZZATURA=? AND FLAG_ATTIVO=1";
    
    if(iDurata < 10) iDurata = 10;
    Calendar c1 = WUtil.toCalendar(dDate, new Date());
    c1 = WUtil.setTime(c1, iOra);
    Calendar c2 = WUtil.toCalendar(dDate, new Date());
    c2 = WUtil.setTime(c2, DataUtil.addMinutes(iOra, iDurata));
    Timestamp t1 = new java.sql.Timestamp(c1.getTimeInMillis());
    Timestamp t2 = new java.sql.Timestamp(c2.getTimeInMillis());
    Calendar c3 = WUtil.toCalendar(dDate, new Date());
    c3.add(Calendar.DATE, 1);
    
    String sSQL_R = "SELECT R.ID_COLLABORATORE,C.NOME,R.RISERVATO_DAL,R.RISERVATO_AL FROM PRZ_ATTREZZATURE_RIS R,PRZ_COLLABORATORI C ";
    //                                                             1
    sSQL_R += "WHERE R.ID_COLLABORATORE=C.ID AND R.ID_ATTREZZATURA=? ";
    //                          dal <= t1 < al                           dal < t2 < al                              t1 < dal && t2 > al
    //                                2                    3                      4                    5                      6                    7
    sSQL_R += "AND ((R.RISERVATO_DAL<=? AND R.RISERVATO_AL>?) OR (R.RISERVATO_DAL<? AND R.RISERVATO_AL>?) OR (R.RISERVATO_DAL>? AND R.RISERVATO_AL<?)) ";
    
    String sSQL_N = "SELECT R.ID_COLLABORATORE,C.NOME,R.RISERVATO_DAL,R.RISERVATO_AL FROM PRZ_ATTREZZATURE_RIS R,PRZ_COLLABORATORI C ";
    //                                                             1
    sSQL_N += "WHERE R.ID_COLLABORATORE=C.ID AND R.ID_ATTREZZATURA=? ";
    //                              2                    3
    sSQL_N += "AND R.RISERVATO_DAL>=? AND R.RISERVATO_AL<?";
    
    Connection conn = null;
    PreparedStatement pstmA = null;
    PreparedStatement pstmC = null;
    PreparedStatement pstmR = null;
    PreparedStatement pstmN = null;
    ResultSet rsA = null;
    ResultSet rsC = null;
    ResultSet rsR = null;
    ResultSet rsN = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstmA = conn.prepareStatement(sSQL_A);
      pstmC = conn.prepareStatement(sSQL_C);
      pstmR = conn.prepareStatement(sSQL_R);
      pstmN = conn.prepareStatement(sSQL_N);
      
      pstmA.setInt(1, iIdFar);
      rsA = pstmA.executeQuery();
      while(rsA.next()) {
        int iIdAttr     = rsA.getInt("ID");
        String sDesAttr = rsA.getString("DESCRIZIONE");
        
        if(iIdAttr == 0) continue;
        
        boolean boCollegata = false;
        pstmC.setInt(1, iIdPrest);
        pstmC.setInt(2, iIdAttr);
        rsC = pstmC.executeQuery();
        if(rsC.next()) {
          boCollegata = true;
        }
        rsC.close();
        
        Timestamp tsNextFrom = t2;
        Timestamp tsNextTo   = new java.sql.Timestamp(c3.getTimeInMillis());
        
        boolean boRiservata = false;
        int     iIdColl     = 0;
        String  sDesColl    = "";
        Date    dRisDal     = null;
        String  sRisDal     = "";
        String  sRisAl      = "";
        pstmR.setInt(1,       iIdAttr);
        pstmR.setTimestamp(2, t1);
        pstmR.setTimestamp(3, t1);
        pstmR.setTimestamp(4, t2);
        pstmR.setTimestamp(5, t2);
        pstmR.setTimestamp(6, t1);
        pstmR.setTimestamp(7, t2);
        rsR = pstmR.executeQuery();
        if(rsR.next()) {
          boRiservata = true;
          iIdColl  = rsR.getInt("ID_COLLABORATORE");
          sDesColl = rsR.getString("NOME");
          
          Timestamp tsRisDal = rsR.getTimestamp("RISERVATO_DAL");
          Timestamp tsRisAl  = rsR.getTimestamp("RISERVATO_AL");
          
          if(tsRisAl != null) tsNextFrom = tsRisAl;
          
          dRisDal  = WUtil.toDate(tsRisDal, null);
          sRisDal  = WUtil.formatTime(tsRisDal, false, false);
          sRisAl   = WUtil.formatTime(tsRisAl,  false, false);
        }
        rsR.close();
        
        int     iIdColl_N   = 0;
        String  sDesColl_N  = "";
        String  sRisDal_N   = "";
        String  sRisAl_N    = "";
        pstmN.setInt(1,       iIdAttr);
        pstmN.setTimestamp(2, tsNextFrom);
        pstmN.setTimestamp(3, tsNextTo);
        rsN = pstmN.executeQuery();
        if(rsN.next()) {
          iIdColl_N  = rsN.getInt("ID_COLLABORATORE");
          sDesColl_N = rsN.getString("NOME");
          
          Timestamp tsRisDal = rsN.getTimestamp("RISERVATO_DAL");
          Timestamp tsRisAl  = rsN.getTimestamp("RISERVATO_AL");
          
          sRisDal_N  = WUtil.formatTime(tsRisDal, false, false);
          sRisAl_N   = WUtil.formatTime(tsRisAl,  false, false);
        }
        rsN.close();
        
        Map<String,Object> mapRecord = new HashMap<String,Object>();
        mapRecord.put("ia", iIdAttr);
        mapRecord.put("da", sDesAttr);
        mapRecord.put("cp", boCollegata);
        mapRecord.put("rf", boRiservata);
        // Reserved
        mapRecord.put("ic", iIdColl);
        mapRecord.put("dc", sDesColl);
        mapRecord.put("rg", dRisDal);
        mapRecord.put("rd", sRisDal);
        mapRecord.put("ra", sRisAl);
        // Next
        mapRecord.put("nc", iIdColl_N);
        mapRecord.put("nn", sDesColl_N);
        mapRecord.put("nd", sRisDal_N);
        mapRecord.put("na", sRisAl_N);
        
        listResult.add(mapRecord);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSAttrezzature.getCollegate(" + iIdFar + "," + iIdPrest + "," + dDate + "," + iOra + "," + iDurata + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rsA, rsC, rsR, rsN, pstmA, pstmC, pstmR, pstmN, conn);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> getRiservate(int iIdFar, Date dDate)
      throws Exception
  {
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    if(iIdFar == 0 || dDate == null) return listResult;
    
    String sSQL_R = "SELECT AR.ID,AR.ID_ATTREZZATURA,A.DESCRIZIONE,AR.RISERVATO_DAL,AR.RISERVATO_AL,AR.ID_COLLABORATORE,C.NOME ";
    sSQL_R += "FROM PRZ_ATTREZZATURE_RIS AR,PRZ_COLLABORATORI C,PRZ_ATTREZZATURE A ";
    sSQL_R += "WHERE AR.ID_COLLABORATORE=C.ID AND AR.ID_ATTREZZATURA=A.ID ";
    sSQL_R += "AND A.ID_FAR=? AND C.ID_FAR=? AND AR.RISERVATO_DAL>=? AND AR.RISERVATO_DAL<=? ";
    sSQL_R += "ORDER BY A.DESCRIZIONE,AR.RISERVATO_DAL,AR.ID DESC";
    
    Calendar cal0 = WUtil.toCalendar(dDate, null);
    cal0 = WUtil.setTime(cal0, 0);
    Calendar cal1 = WUtil.toCalendar(dDate, null);
    cal1 = WUtil.setTime(cal1, 2359);
    
    // Check sovrapposizioni
    //                                                                         1
    String sSQL_C = "SELECT ID FROM PRZ_ATTREZZATURE_RIS WHERE ID_ATTREZZATURA=? ";
    //                          dal <= t1 < al                           dal < t2 < al                              t1 < dal && t2 > al
    //                              2                  3                    4                  5                    6                  7
    sSQL_C += "AND ((RISERVATO_DAL<=? AND RISERVATO_AL>?) OR (RISERVATO_DAL<? AND RISERVATO_AL>?) OR (RISERVATO_DAL>? AND RISERVATO_AL<?)) ";
    // L'ulteriore condizione su ID_COLLABORATORE consente la ricollocazione
    //                 8
    sSQL_C += "AND ID<>? ";
    
    String sSQL_A = "SELECT FLAG_ATTIVO FROM PRZ_ATTREZZATURE WHERE ID=?";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstmR = null;
    PreparedStatement pstmC = null;
    PreparedStatement pstmA = null;
    ResultSet rsR = null;
    ResultSet rsC = null;
    ResultSet rsA = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstmR = conn.prepareStatement(sSQL_R);
      pstmC = conn.prepareStatement(sSQL_C);
      pstmA = conn.prepareStatement(sSQL_A);
      
      pstmR.setInt(++p,       iIdFar);
      pstmR.setInt(++p,       iIdFar);
      pstmR.setTimestamp(++p, new Timestamp(cal0.getTimeInMillis()));
      pstmR.setTimestamp(++p, new Timestamp(cal1.getTimeInMillis()));
      rsR = pstmR.executeQuery();
      while(rsR.next()) {
        int    iIdAttrRis  = rsR.getInt("ID");
        int    iIdAttr     = rsR.getInt("ID_ATTREZZATURA");
        String sDesAttr    = rsR.getString("DESCRIZIONE");
        Timestamp tsRisDal = rsR.getTimestamp("RISERVATO_DAL");
        Timestamp tsRisAl  = rsR.getTimestamp("RISERVATO_AL");
        int    iIdColl     = rsR.getInt("ID_COLLABORATORE");
        String sDesColl    = rsR.getString("NOME");
        
        if(iIdAttr == 0) continue;
        
        boolean sovrapposizione = false;
        pstmC.setInt(1, iIdAttr);
        pstmC.setTimestamp(2, tsRisDal);
        pstmC.setTimestamp(3, tsRisDal);
        pstmC.setTimestamp(4, tsRisAl);
        pstmC.setTimestamp(5, tsRisAl);
        pstmC.setTimestamp(6, tsRisDal);
        pstmC.setTimestamp(7, tsRisAl);
        pstmC.setInt(8, iIdAttrRis);
        rsC = pstmC.executeQuery();
        if(rsC.next()) {
          sovrapposizione = true;
        }
        rsC.close();
        
        int iFlagAttivo = 0;
        pstmA.setInt(1, iIdAttr);
        rsA = pstmA.executeQuery();
        if(rsA.next()) {
          iFlagAttivo = rsA.getInt(1);
        }
        rsA.close();
        
        Map<String,Object> mapRecord = new HashMap<String,Object>();
        mapRecord.put("ia", iIdAttr);
        mapRecord.put("da", sDesAttr);
        mapRecord.put("ic", iIdColl);
        mapRecord.put("dc", sDesColl);
        mapRecord.put("rg", WUtil.toDate(tsRisDal, null));
        mapRecord.put("rd", WUtil.formatTime(tsRisDal, false, false));
        mapRecord.put("ra", WUtil.formatTime(tsRisAl,  false, false));
        mapRecord.put("sp", sovrapposizione);
        mapRecord.put("at", iFlagAttivo != 0);
        
        listResult.add(mapRecord);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSAttrezzature.getRiservate(" + iIdFar + "," + dDate + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rsR, rsC, rsA, pstmR, pstmC, pstmA, conn);
    }
    return listResult;
  }
  
  public static
  List<Attrezzatura> find(Attrezzatura filter)
      throws Exception
  {
    List<Attrezzatura> listResult = new ArrayList<Attrezzatura>();
    
    if(filter == null) filter = new Attrezzatura();
    
    int iIdFar = filter.getIdFar();
    if(iIdFar == 0) return listResult;
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sFCodice = WUtil.toUpperString(filter.getCodice(), null);
    String sFDescrizione = WUtil.toUpperString(filter.getDescrizione(), null);
    
    String sSQL = "SELECT ID,CODICE,DESCRIZIONE ";
    sSQL += "FROM PRZ_ATTREZZATURE ";
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
      pstm.setInt(++p, 1);
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
        
        Attrezzatura record = new Attrezzatura();
        record.setId(iId);
        record.setCodice(sCodice);
        record.setDescrizione(sDescrizione);
        
        listResult.add(record);
        if(listResult.size() > 1000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSAttrezzature.find", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  Attrezzatura read(int iId)
      throws Exception
  {
    Attrezzatura result = null;
    
    if(iId == 0) return result;
    
    String sSQL = "SELECT ID,CODICE,DESCRIZIONE FROM PRZ_ATTREZZATURE WHERE ID=?";
    
    String sSQL_P = "SELECT P.ID,P.ID_GRUPPO_PRE,PG.DESCRIZIONE DESC_GRU,P.DESCRIZIONE ";
    sSQL_P += "FROM PRZ_PRESTAZIONI_ATTREZ PA,PRZ_PRESTAZIONI P,PRZ_PRESTAZIONI_GRUPPI PG ";
    sSQL_P += "WHERE PA.ID_PRESTAZIONE=P.ID AND P.ID_GRUPPO_PRE=PG.ID AND PA.FLAG_ATTIVO=1 AND PA.ID_ATTREZZATURA=? ";
    sSQL_P += "ORDER BY P.ID_GRUPPO_PRE,P.DESCRIZIONE ";
    
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
        
        result = new Attrezzatura();
        result.setId(iId);
        result.setCodice(sCodice);
        result.setDescrizione(sDescrizione);
      }
      if(result == null) return null;
      
      List<Prestazione> listPrestazioni = new ArrayList<Prestazione>();
      result.setPrestazioni(listPrestazioni);
      
      // PRESTAZIONI
      ConnectionManager.close(rs, pstm);
      pstm = conn.prepareStatement(sSQL_P);
      pstm.setInt(1, iId);
      rs = pstm.executeQuery();
      while(rs.next()) {
        int iIdPrest   = rs.getInt("ID");
        int iIdGru     = rs.getInt("ID_GRUPPO_PRE");
        String sDesGru = rs.getString("DESC_GRU");
        String sDesPre = rs.getString("DESCRIZIONE");
        
        listPrestazioni.add(new Prestazione(iIdPrest, sDesPre, iIdGru, sDesGru));
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSAttrezzature.read(" + iId + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return result;
  }
  
  public 
  Attrezzatura insert(Attrezzatura record) 
      throws Exception 
  {
    if(record == null) return null;
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL_A = "INSERT INTO PRZ_ATTREZZATURE(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,ID_FAR,CODICE,DESCRIZIONE) VALUES(?,?,?,?,?,?,?,?)";
    String sSQL_P = "INSERT INTO PRZ_PRESTAZIONI_ATTREZ(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_PRESTAZIONE,ID_ATTREZZATURA) VALUES(?,?,?,?,?,?)";
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstmA = null;
    PreparedStatement pstmP = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_ATTREZZATURE");
      
      pstmA = conn.prepareStatement(sSQL_A);
      pstmA.setInt(++p,       iId);
      pstmA.setInt(++p,       iIdUte);
      pstmA.setDate(++p,      new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
      pstmA.setInt(++p,       1); // FLAG_ATTIVO
      pstmA.setInt(++p,       iIdGru);
      pstmA.setInt(++p,       record.getIdFar());
      pstmA.setString(++p,    WUtil.toUpperString(record.getCodice(), String.valueOf(iId)));
      pstmA.setString(++p,    WUtil.toString(record.getDescrizione(), String.valueOf(iId)));
      pstmA.executeUpdate();
      
      List<Prestazione> listPrestazioni = record.getPrestazioni();
      if(listPrestazioni != null && listPrestazioni.size() > 0) {
        pstmP = conn.prepareStatement(sSQL_P);
        for(int i = 0; i < listPrestazioni.size(); i++) {
          Prestazione prestazione = listPrestazioni.get(i);
          
          if(prestazione == null) continue;
          int iIdPrest = prestazione.getId();
          if(iIdPrest == 0) continue;
          
          int iIdP = ConnectionManager.nextVal(conn, "SEQ_PRZ_PRESTAZIONI_ATTREZ");
          
          p = 0;
          pstmP.setInt(++p,  iIdP);
          pstmP.setInt(++p,  iIdUte);
          pstmP.setDate(++p, new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
          pstmP.setInt(++p,  1); // FLAG_ATTIVO
          pstmP.setInt(++p,  iIdPrest);
          pstmP.setInt(++p,  iId);
          pstmP.executeUpdate();
        }
      }
      
      ut.commit();
      
      record.setId(iId);
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSAttrezzature.insert", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstmA, pstmP, conn);
    }
    return record;
  }
  
  public 
  Attrezzatura update(Attrezzatura record) 
      throws Exception 
  {
    if(record == null || record.getId() == 0) {
      throw new Exception("Identificativo assente");
    }
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    int iId = record.getId();
    
    String sSQL_A = "UPDATE PRZ_ATTREZZATURE SET CODICE=?,DESCRIZIONE=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?";
    String sSQL_P = "INSERT INTO PRZ_PRESTAZIONI_ATTREZ(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_PRESTAZIONE,ID_ATTREZZATURA) VALUES(?,?,?,?,?,?)";
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstmA = null;
    PreparedStatement pstmP = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstmA = conn.prepareStatement(sSQL_A);
      // SET
      pstmA.setString(++p,    WUtil.toUpperString(record.getCodice(), String.valueOf(iId)));
      pstmA.setString(++p,    WUtil.toString(record.getDescrizione(), String.valueOf(iId)));
      pstmA.setInt(++p,       iIdUte);
      pstmA.setDate(++p,      new java.sql.Date(System.currentTimeMillis())); // DATA_UPDATE
      // WHERE
      pstmA.setInt(++p,       iId);
      pstmA.executeUpdate();
      
      DBUtil.execUpd(conn, "DELETE FROM PRZ_PRESTAZIONI_ATTREZ WHERE ID_ATTREZZATURA=?", iId);
      
      List<Prestazione> listPrestazioni = record.getPrestazioni();
      if(listPrestazioni != null && listPrestazioni.size() > 0) {
        pstmP = conn.prepareStatement(sSQL_P);
        
        for(int i = 0; i < listPrestazioni.size(); i++) {
          Prestazione prestazione = listPrestazioni.get(i);
          
          if(prestazione == null) continue;
          int iIdPrest = prestazione.getId();
          if(iIdPrest == 0) continue;
          
          int iIdP = ConnectionManager.nextVal(conn, "SEQ_PRZ_PRESTAZIONI_ATTREZ");
          
          p = 0;
          pstmP.setInt(++p,  iIdP);
          pstmP.setInt(++p,  iIdUte);
          pstmP.setDate(++p, new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
          pstmP.setInt(++p,  1); // FLAG_ATTIVO
          pstmP.setInt(++p,  iIdPrest);
          pstmP.setInt(++p,  iId);
          pstmP.executeUpdate();
        }
      }
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSAttrezzature.update(id=" + iId + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstmA, pstmP, conn);
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
      
      pstm = conn.prepareStatement("UPDATE PRZ_ATTREZZATURE SET FLAG_ATTIVO=?,ID_UTE_DELETE=?,DATA_DELETE=? WHERE ID=?");
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
      logger.error("Eccezione in WSAttrezzature.delete(" + iId + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return result;
  }
}
