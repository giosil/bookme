package org.dew.bookme.ws;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.transaction.UserTransaction;

import org.apache.log4j.Logger;

import org.util.WList;
import org.util.WUtil;

import org.dew.bookme.bl.Attrezzatura;
import org.dew.bookme.bl.Collaboratore;
import org.dew.bookme.bl.Prestazione;
import org.dew.bookme.bl.User;

import org.dew.bookme.util.ConnectionManager;
import org.dew.bookme.util.DBUtil;
import org.dew.bookme.util.WSContext;

public 
class WSPrestazioni 
{
  protected static Logger logger = Logger.getLogger(WSPrestazioni.class);
  
  public static final boolean CATALOGO_DI_GRUPPO = true;
  
  public static
  List<Prestazione> getAll(int iIdFar)
      throws Exception
  {
    List<Prestazione> listResult = new ArrayList<Prestazione>();
    
    if(iIdFar == 0) return listResult;
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "SELECT P.ID,P.ID_GRUPPO_PRE,PG.DESCRIZIONE DES_GRU,P.DESCRIZIONE,P.DURATA,P.PREZZO_FINALE ";
    sSQL += "FROM PRZ_PRESTAZIONI P,PRZ_PRESTAZIONI_GRUPPI PG ";
    // Ammettendo anche P.ID_FAR=0 e' possibile gestire un unico catalogo di gruppo.
    sSQL += "WHERE P.ID_GRUPPO_PRE=PG.ID AND P.ID_GRU=? AND (P.ID_FAR=0 OR P.ID_FAR=?) AND P.FLAG_ATTIVO=? ";
    sSQL += "ORDER BY P.ID_GRUPPO_PRE,P.DESCRIZIONE";
    
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
        int    iId           = rs.getInt("ID");
        int    iIdGruppo     = rs.getInt("ID_GRUPPO_PRE");
        String sDescGruppo   = rs.getString("DES_GRU");
        String sDescrizione  = rs.getString("DESCRIZIONE");
        int    iDurata       = rs.getInt("DURATA");
        double dPrezzoFinale = rs.getDouble("PREZZO_FINALE");
        
        if(iId == 0) continue;
        
        Prestazione prestazione = new Prestazione();
        prestazione.setId(iId);
        prestazione.setGruppo(iIdGruppo);
        prestazione.setDescGruppo(sDescGruppo);
        prestazione.setDescrizione(sDescrizione);
        prestazione.setDurata(iDurata);
        prestazione.setPrezzoFinale(dPrezzoFinale);
        
        listResult.add(prestazione);
        if(listResult.size() > 2000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSPrestazioni.getAll(" + iIdFar + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<Prestazione> getAll(int iIdFar, int iIdColl)
      throws Exception
  {
    List<Prestazione> listResult = new ArrayList<Prestazione>();
    
    if(iIdFar == 0) return listResult;
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "SELECT P.ID,P.ID_GRUPPO_PRE,PG.DESCRIZIONE DES_GRU,P.DESCRIZIONE,P.DURATA,P.PREZZO_FINALE ";
    sSQL += "FROM PRZ_PRESTAZIONI P,PRZ_PRESTAZIONI_GRUPPI PG,PRZ_COLLABORATORI_PRE C ";
    // Ammettendo anche P.ID_FAR=0 e' possibile gestire un unico catalogo di gruppo.
    sSQL += "WHERE P.ID_GRUPPO_PRE=PG.ID AND P.ID=C.ID_PRESTAZIONE AND P.ID_GRU=? AND (P.ID_FAR=0 OR P.ID_FAR=?) AND C.ID_COLLABORATORE=? AND P.FLAG_ATTIVO=? ";
    sSQL += "ORDER BY P.ID_GRUPPO_PRE,P.DESCRIZIONE";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p, iIdGru);
      pstm.setInt(++p, iIdFar);
      pstm.setInt(++p, iIdColl);
      pstm.setInt(++p, 1);
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId           = rs.getInt("ID");
        int    iIdGruppo     = rs.getInt("ID_GRUPPO_PRE");
        String sDescGruppo   = rs.getString("DES_GRU");
        String sDescrizione  = rs.getString("DESCRIZIONE");
        int    iDurata       = rs.getInt("DURATA");
        double dPrezzoFinale = rs.getDouble("PREZZO_FINALE");
        
        if(iId == 0) continue;
        
        Prestazione prestazione = new Prestazione();
        prestazione.setId(iId);
        prestazione.setGruppo(iIdGruppo);
        prestazione.setDescGruppo(sDescGruppo);
        prestazione.setDescrizione(sDescrizione);
        prestazione.setDurata(iDurata);
        prestazione.setPrezzoFinale(dPrezzoFinale);
        
        listResult.add(prestazione);
        if(listResult.size() > 2000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSPrestazioni.getAll(" + iIdFar + "," + iIdColl + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<List<Object>> lookup(Map<String,Object> mapFilter)
      throws Exception
  {
    List<List<Object>> listResult = new ArrayList<List<Object>>();
    
    if(mapFilter == null || mapFilter.isEmpty()) {
      return listResult;
    }
    int iIdFar = WUtil.toInt(mapFilter.get("idFar"), 0);
    if(iIdFar == 0) return listResult;
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "SELECT P.ID,P.ID_GRUPPO_PRE,PG.DESCRIZIONE DES_GRU,P.DESCRIZIONE ";
    sSQL += "FROM PRZ_PRESTAZIONI P,PRZ_PRESTAZIONI_GRUPPI PG ";
    // Ammettendo anche P.ID_FAR=0 e' possibile gestire un unico catalogo di gruppo.
    sSQL += "WHERE P.ID_GRUPPO_PRE=PG.ID AND P.ID_GRU=? AND (P.ID_FAR=0 OR P.ID_FAR=?) AND P.FLAG_ATTIVO=? ";
    sSQL += "ORDER BY P.ID_GRUPPO_PRE,P.DESCRIZIONE";
    
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
        String sDescGruppo  = rs.getString("DES_GRU");
        String sDescrizione = rs.getString("DESCRIZIONE");
        
        if(iId == 0) continue;
        
        List<Object> listRecord = new ArrayList<Object>(3);
        listRecord.add(iId);
        listRecord.add(sDescGruppo);
        listRecord.add(sDescrizione);
        
        listResult.add(listRecord);
        if(listResult.size() > 1000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSPrestazioni.lookupGruppi", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<List<Object>> lookupGruppi(Map<String,Object> mapFilter)
      throws Exception
  {
    List<List<Object>> listResult = new ArrayList<List<Object>>();
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "SELECT ID,DESCRIZIONE ";
    sSQL += "FROM PRZ_PRESTAZIONI_GRUPPI ";
    sSQL += "WHERE ID_GRU=? AND FLAG_ATTIVO=? ";
    sSQL += "ORDER BY DESCRIZIONE";
    
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
        String sDescrizione = rs.getString("DESCRIZIONE");
        
        List<Object> listRecord = new ArrayList<Object>(2);
        listRecord.add(iId);
        listRecord.add(sDescrizione);
        
        listResult.add(listRecord);
        if(listResult.size() > 1000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSPrestazioni.lookupGruppi", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<List<Object>> lookupTipi(Map<String,Object> mapFilter)
      throws Exception
  {
    List<List<Object>> listResult = new ArrayList<List<Object>>();
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "SELECT ID,DESCRIZIONE ";
    sSQL += "FROM PRZ_PRESTAZIONI_TIPI ";
    sSQL += "WHERE FLAG_ATTIVO=? ";
    sSQL += "ORDER BY DESCRIZIONE";
    
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
        String sDescrizione = rs.getString("DESCRIZIONE");
        
        if(iId == 0) continue;
        
        List<Object> listRecord = new ArrayList<Object>(2);
        listRecord.add(iId);
        listRecord.add(sDescrizione);
        
        listResult.add(listRecord);
        if(listResult.size() > 1000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSPrestazioni.lookupTipi", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<Prestazione> find(Prestazione filter)
      throws Exception
  {
    List<Prestazione> listResult = new ArrayList<Prestazione>();
    
    if(filter == null) filter = new Prestazione();
    
    int iIdFar = filter.getIdFar();
    if(iIdFar == 0) return listResult;
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sFCodice      = WUtil.toUpperString(filter.getCodice(), null);
    String sFDescrizione = WUtil.toUpperString(filter.getDescrizione(), null);
    int iFIdGruppoPre    = filter.getGruppo();
    int iFDurata         = filter.getDurata();
    
    String sSQL = "SELECT P.ID,P.ID_GRUPPO_PRE,G.DESCRIZIONE DEG,P.COD_CSF,P.COD_PROD,P.DESCRIZIONE,P.DURATA,P.TIPO_PREZZO,P.PREN_ONLINE,P.PREZZO_LISTINO,P.SCONTO_PERC,P.SCONTO_ASS,P.PREZZO_FINALE,P.PUNTI_COLLAB ";
    sSQL += "FROM PRZ_PRESTAZIONI P,PRZ_PRESTAZIONI_GRUPPI G ";
    // Ammettendo anche P.ID_FAR=0 e' possibile gestire un unico catalogo di gruppo.
    sSQL += "WHERE P.ID_GRUPPO_PRE=G.ID AND P.ID_GRU=? AND (P.ID_FAR=0 OR P.ID_FAR=?) AND P.FLAG_ATTIVO=? ";
    if(sFCodice != null && sFCodice.length() > 0) {
      sSQL += "AND P.CODICE LIKE ? ";
    }
    if(sFDescrizione != null && sFDescrizione.length() > 0) {
      sSQL += "AND UPPER(P.DESCRIZIONE) LIKE ? ";
    }
    if(iFIdGruppoPre != 0) {
      sSQL += "AND P.ID_GRUPPO_PRE=? ";
    }
    if(iFDurata != 0) {
      sSQL += "AND P.DURATA=? ";
    }
    sSQL += "ORDER BY P.ID_GRUPPO_PRE,P.DESCRIZIONE";
    
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
      if(iFIdGruppoPre != 0) {
        pstm.setInt(++p, iFIdGruppoPre);
      }
      if(iFDurata != 0) {
        pstm.setInt(++p, iFDurata);
      }
      
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId            = rs.getInt("ID");
        int    iIdGruppoPre   = rs.getInt("ID_GRUPPO_PRE");
        String sDescGruppoPre = rs.getString("DEG");
        int    iCodCsf        = rs.getInt("COD_CSF");
        String sCodice        = rs.getString("COD_PROD");
        String sDescrizione   = rs.getString("DESCRIZIONE");
        int    iDurata        = rs.getInt("DURATA");
        String sTipoPrezzo    = rs.getString("TIPO_PREZZO");
        int iPrenOnLine       = rs.getInt("PREN_ONLINE");
        double dPrezzoListino = rs.getDouble("PREZZO_LISTINO");
        double dScontoPerc    = rs.getDouble("SCONTO_PERC");
        double dScontoAss     = rs.getDouble("SCONTO_ASS");
        double dPrezzoFinale  = rs.getDouble("PREZZO_FINALE");
        int iPuntiCollab      = rs.getInt("PUNTI_COLLAB");
        
        Prestazione record = new Prestazione();
        record.setId(iId);
        record.setGruppo(iIdGruppoPre);
        record.setDescGruppo(sDescGruppoPre);
        record.setCodCsf(iCodCsf);
        record.setCodice(sCodice);
        record.setDescrizione(sDescrizione);
        record.setDurata(iDurata);
        record.setTipoPrezzo(sTipoPrezzo);
        record.setPrenOnLine(WUtil.toBoolean(iPrenOnLine, false));
        record.setPrezzoListino(dPrezzoListino);
        record.setScontoPerc(dScontoPerc);
        record.setScontoAss(dScontoAss);
        record.setPrezzoFinale(dPrezzoFinale);
        record.setPuntiColl(iPuntiCollab);
        
        listResult.add(record);
        if(listResult.size() > 2000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSPrestazioni.find", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  Prestazione read(int iId)
      throws Exception
  {
    return read(iId, 0);
  }
  
  public static
  Prestazione read(int iId, int iIdFar)
      throws Exception
  {
    Prestazione result = null;
    
    if(iId == 0) return result;
    
    String sSQL = "SELECT P.ID,P.ID_GRUPPO_PRE,G.DESCRIZIONE DEG,P.ID_TIPO,T.DESCRIZIONE DET,P.COD_CSF,P.COD_PROD,P.DESCRIZIONE,P.DURATA,P.TIPO_PREZZO,P.PREN_ONLINE,P.PREZZO_LISTINO,P.SCONTO_PERC,P.SCONTO_ASS,P.PREZZO_FINALE,P.AVVERTENZE,P.INDICAZIONI,P.PUNTI_COLLAB ";
    sSQL += "FROM PRZ_PRESTAZIONI P,PRZ_PRESTAZIONI_GRUPPI G,PRZ_PRESTAZIONI_TIPI T ";
    sSQL += "WHERE P.ID_GRUPPO_PRE=G.ID AND P.ID_TIPO=T.ID AND P.ID=?";
    
    String sSQL_A = "SELECT PA.ID_ATTREZZATURA,A.CODICE,A.DESCRIZIONE ";
    sSQL_A += "FROM PRZ_PRESTAZIONI_ATTREZ PA,PRZ_ATTREZZATURE A ";
    sSQL_A += "WHERE PA.ID_ATTREZZATURA=A.ID AND PA.FLAG_ATTIVO=1 ";
    sSQL_A += "AND PA.ID_PRESTAZIONE=? ";
    if(iIdFar != 0) {
      sSQL_A += "AND A.ID_FAR=? ";
    }
    sSQL_A += "ORDER BY A.DESCRIZIONE";
    
    String sSQL_C = "SELECT CP.ID_COLLABORATORE,C.NOME ";
    sSQL_C += "FROM PRZ_COLLABORATORI_PRE CP,PRZ_COLLABORATORI C ";
    sSQL_C += "WHERE CP.ID_COLLABORATORE=C.ID AND C.FLAG_ATTIVO=1 ";
    sSQL_C += "AND CP.ID_PRESTAZIONE=? ";
    if(iIdFar != 0) {
      sSQL_C += "AND C.ID_FAR=? ";
    }
    sSQL_C += "ORDER BY C.NOME";
    
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(1, iId);
      rs = pstm.executeQuery();
      if(rs.next()) {
        int    iIdGruppoPre   = rs.getInt("ID_GRUPPO_PRE");
        String sDescGruppoPre = rs.getString("DEG");
        int    iIdTipo        = rs.getInt("ID_TIPO");
        String sDescTipo      = rs.getString("DET");
        int    iCodCsf        = rs.getInt("COD_CSF");
        String sCodice        = rs.getString("COD_PROD");
        String sDescrizione   = rs.getString("DESCRIZIONE");
        int    iDurata        = rs.getInt("DURATA");
        String sTipoPrezzo    = rs.getString("TIPO_PREZZO");
        int iPrenOnLine       = rs.getInt("PREN_ONLINE");
        double dPrezzoListino = rs.getDouble("PREZZO_LISTINO");
        double dScontoPerc    = rs.getDouble("SCONTO_PERC");
        double dScontoAss     = rs.getDouble("SCONTO_ASS");
        double dPrezzoFinale  = rs.getDouble("PREZZO_FINALE");
        String sAvvertenze    = rs.getString("AVVERTENZE");
        String sIndicazioni   = rs.getString("INDICAZIONI");
        int iPuntiCollab      = rs.getInt("PUNTI_COLLAB");
        
        result = new Prestazione();
        result.setId(iId);
        result.setGruppo(iIdGruppoPre);
        result.setDescGruppo(sDescGruppoPre);
        result.setTipo(iIdTipo);
        result.setDescTipo(sDescTipo);
        result.setCodCsf(iCodCsf);
        result.setCodice(sCodice);
        result.setDescrizione(sDescrizione);
        result.setDurata(iDurata);
        result.setTipoPrezzo(sTipoPrezzo);
        result.setPrenOnLine(WUtil.toBoolean(iPrenOnLine, false));
        result.setPrezzoListino(dPrezzoListino);
        result.setScontoPerc(dScontoPerc);
        result.setScontoAss(dScontoAss);
        result.setPrezzoFinale(dPrezzoFinale);
        result.setAvvertenze(sAvvertenze);
        result.setIndicazioni(sIndicazioni);
        result.setPuntiColl(iPuntiCollab);
      }
      if(result == null) return null;
      
      // ATTREZZATURE (CABINE)
      List<Attrezzatura> listAttrezzature = new ArrayList<Attrezzatura>();
      result.setAttrezzature(listAttrezzature);
      ConnectionManager.close(rs, pstm);
      pstm = conn.prepareStatement(sSQL_A);
      pstm.setInt(1, iId);
      if(iIdFar != 0) {
        pstm.setInt(2, iIdFar);
      }
      rs = pstm.executeQuery();
      while(rs.next()) {
        int iIdAttrezzatura = rs.getInt("ID_ATTREZZATURA");
        String sCodice      = rs.getString("CODICE");
        String sDescAttrezz = rs.getString("DESCRIZIONE");
        
        listAttrezzature.add(new Attrezzatura(iIdAttrezzatura, sCodice, sDescAttrezz));
      }
      
      // COLLABORATORI
      List<Collaboratore> listCollaboratori = new ArrayList<Collaboratore>();
      result.setCollaboratori(listCollaboratori);
      ConnectionManager.close(rs, pstm);
      pstm = conn.prepareStatement(sSQL_C);
      pstm.setInt(1, iId);
      if(iIdFar != 0) {
        pstm.setInt(2, iIdFar);
      }
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iIdColl = rs.getInt("ID_COLLABORATORE");
        String sCodice = rs.getString("NOME");
        
        listCollaboratori.add(new Collaboratore(iIdColl, sCodice));
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSPrestazioni.read(" + iId + "," + iIdFar + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return result;
  }
  
  public 
  Prestazione insert(Prestazione record) 
      throws Exception 
  {
    if(record == null) return null;
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL_P = "INSERT INTO PRZ_PRESTAZIONI(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,ID_FAR,ID_GRUPPO_PRE,ID_TIPO,COD_CSF,COD_PROD,DESCRIZIONE,DURATA,TIPO_PREZZO,PREN_ONLINE,PREZZO_LISTINO,SCONTO_PERC,SCONTO_ASS,PREZZO_FINALE,AVVERTENZE,INDICAZIONI,PUNTI_COLLAB) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    String sSQL_A = "INSERT INTO PRZ_PRESTAZIONI_ATTREZ(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_PRESTAZIONE,ID_ATTREZZATURA) VALUES(?,?,?,?,?,?)";
    String sSQL_C = "INSERT INTO PRZ_COLLABORATORI_PRE(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_COLLABORATORE,ID_PRESTAZIONE) VALUES(?,?,?,?,?,?)";
    
    int iIdFar = record.getIdFar();
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstmP = null;
    PreparedStatement pstmA = null;
    PreparedStatement pstmC = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_PRESTAZIONI");
      
      pstmP = conn.prepareStatement(sSQL_P);
      pstmP.setInt(++p,       iId);
      pstmP.setInt(++p,       iIdUte);
      pstmP.setDate(++p,      new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
      pstmP.setInt(++p,       1); // FLAG_ATTIVO
      pstmP.setInt(++p,       iIdGru);
      if(CATALOGO_DI_GRUPPO) {
        pstmP.setInt(++p,   0);       // ID_FAR
      }
      else {
        pstmP.setInt(++p,   iIdFar);  // ID_FAR
      }
      pstmP.setInt(++p,       record.getGruppo());
      pstmP.setInt(++p,       record.getTipo());
      pstmP.setInt(++p,       record.getCodCsf());
      pstmP.setString(++p,    record.getCodice());
      pstmP.setString(++p,    record.getDescrizione());
      pstmP.setInt(++p,       record.getDurata());
      pstmP.setString(++p,    record.getTipoPrezzo());
      pstmP.setInt(++p,       record.isPrenOnLine() ? 1 : 0);
      pstmP.setDouble(++p,    record.getPrezzoListino());
      pstmP.setDouble(++p,    record.getScontoPerc());
      pstmP.setDouble(++p,    record.getScontoAss());
      pstmP.setDouble(++p,    record.getPrezzoFinale());
      pstmP.setString(++p,    record.getAvvertenze());
      pstmP.setString(++p,    record.getIndicazioni());
      pstmP.setInt(++p,       record.getPuntiColl());
      pstmP.executeUpdate();
      
      List<Attrezzatura> listAttrezzature = record.getAttrezzature();
      if(listAttrezzature != null && listAttrezzature.size() > 0) {
        pstmA = conn.prepareStatement(sSQL_A);
        for(int i = 0; i < listAttrezzature.size(); i++) {
          Attrezzatura attrezzatura = listAttrezzature.get(i);
          
          if(attrezzatura == null) continue;
          int iIdAttrezzatura = attrezzatura.getId();
          if(iIdAttrezzatura == 0) continue;
          
          int iIdPA = ConnectionManager.nextVal(conn, "SEQ_PRZ_PRESTAZIONI_ATTREZ");
          
          p = 0;
          pstmA.setInt(++p,  iIdPA);
          pstmA.setInt(++p,  iIdUte);
          pstmA.setDate(++p, new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
          pstmA.setInt(++p,  1); // FLAG_ATTIVO
          pstmA.setInt(++p,  iId);
          pstmA.setInt(++p,  iIdAttrezzatura);
          pstmA.executeUpdate();
        }
      }
      
      List<Collaboratore> listCollaboratori = record.getCollaboratori();
      if(listCollaboratori != null && listCollaboratori.size() > 0) {
        pstmC = conn.prepareStatement(sSQL_C);
        for(int i = 0; i < listCollaboratori.size(); i++) {
          Collaboratore collaboratore = listCollaboratori.get(i);
          
          if(collaboratore == null) continue;
          int iIdCollaboratore = collaboratore.getId();
          if(iIdCollaboratore == 0) continue;
          
          int iIdCP = ConnectionManager.nextVal(conn, "SEQ_PRZ_COLLABORATORI_PRE");
          
          p = 0;
          pstmC.setInt(++p,  iIdCP);
          pstmC.setInt(++p,  iIdUte);
          pstmC.setDate(++p, new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
          pstmC.setInt(++p,  1); // FLAG_ATTIVO
          pstmC.setInt(++p,  iIdCollaboratore);
          pstmC.setInt(++p,  iId);
          pstmC.executeUpdate();
        }
      }
      
      ut.commit();
      
      record.setId(iId);
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSPrestazioni.insert", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstmP, pstmA, pstmC, conn);
    }
    return record;
  }
  
  public 
  Prestazione update(Prestazione record) 
      throws Exception 
  {
    if(record == null || record.getId() == 0) {
      throw new Exception("Identificativo assente");
    }
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    int iId    = record.getId();
    int iIdFar = record.getIdFar();
    
    String sSQL_P = "UPDATE PRZ_PRESTAZIONI SET ID_GRUPPO_PRE=?,ID_TIPO=?,COD_CSF=?,COD_PROD=?,DESCRIZIONE=?,DURATA=?,TIPO_PREZZO=?,PREN_ONLINE=?,PREZZO_LISTINO=?,SCONTO_PERC=?,SCONTO_ASS=?,PREZZO_FINALE=?,AVVERTENZE=?,INDICAZIONI=?,PUNTI_COLLAB=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?";
    String sSQL_A = "INSERT INTO PRZ_PRESTAZIONI_ATTREZ(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_PRESTAZIONE,ID_ATTREZZATURA) VALUES(?,?,?,?,?,?)";
    String sSQL_C = "INSERT INTO PRZ_COLLABORATORI_PRE(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_COLLABORATORE,ID_PRESTAZIONE) VALUES(?,?,?,?,?,?)";
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstmP = null;
    PreparedStatement pstmA = null;
    PreparedStatement pstmC = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstmP = conn.prepareStatement(sSQL_P);
      // SET
      pstmP.setInt(++p,       record.getGruppo());
      pstmP.setInt(++p,       record.getTipo());
      pstmP.setInt(++p,       record.getCodCsf());
      pstmP.setString(++p,    record.getCodice());
      pstmP.setString(++p,    record.getDescrizione());
      pstmP.setInt(++p,       record.getDurata());
      pstmP.setString(++p,    record.getTipoPrezzo());
      pstmP.setInt(++p,       record.isPrenOnLine() ? 1 : 0);
      pstmP.setDouble(++p,    record.getPrezzoListino());
      pstmP.setDouble(++p,    record.getScontoPerc());
      pstmP.setDouble(++p,    record.getScontoAss());
      pstmP.setDouble(++p,    record.getPrezzoFinale());
      pstmP.setString(++p,    record.getAvvertenze());
      pstmP.setString(++p,    record.getIndicazioni());
      pstmP.setInt(++p,       record.getPuntiColl());
      pstmP.setInt(++p,       iIdUte);
      pstmP.setDate(++p,      new java.sql.Date(System.currentTimeMillis())); // DATA_UPDATE
      // WHERE
      pstmP.setInt(++p,       iId);
      pstmP.executeUpdate();
      
      if(iIdFar != 0) {
        String sSQL_DelA = "DELETE FROM PRZ_PRESTAZIONI_ATTREZ WHERE ID_PRESTAZIONE=? ";
        sSQL_DelA += "AND ID_ATTREZZATURA IN (SELECT ID FROM PRZ_ATTREZZATURE WHERE ID_FAR=?)";
        
        DBUtil.execUpd(conn, sSQL_DelA, iId, iIdFar);
        
        List<Attrezzatura> listAttrezzature = record.getAttrezzature();
        if(listAttrezzature != null && listAttrezzature.size() > 0) {
          pstmA = conn.prepareStatement(sSQL_A);
          for(int i = 0; i < listAttrezzature.size(); i++) {
            Attrezzatura attrezzatura = listAttrezzature.get(i);
            
            if(attrezzatura == null) continue;
            int iIdAttrezzatura = attrezzatura.getId();
            if(iIdAttrezzatura == 0) continue;
            
            int iIdPA = ConnectionManager.nextVal(conn, "SEQ_PRZ_PRESTAZIONI_ATTREZ");
            
            p = 0;
            pstmA.setInt(++p,  iIdPA);
            pstmA.setInt(++p,  iIdUte);
            pstmA.setDate(++p, new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
            pstmA.setInt(++p,  1); // FLAG_ATTIVO
            pstmA.setInt(++p,  iId);
            pstmA.setInt(++p,  iIdAttrezzatura);
            pstmA.executeUpdate();
          }
        }
        
        String sSQL_DelC = "DELETE FROM PRZ_COLLABORATORI_PRE WHERE ID_PRESTAZIONE=? ";
        sSQL_DelC += "AND ID_COLLABORATORE IN (SELECT ID FROM PRZ_COLLABORATORI WHERE ID_FAR=?)";
        
        DBUtil.execUpd(conn, sSQL_DelC, iId, iIdFar);
        
        List<Collaboratore> listCollaboratori = record.getCollaboratori();
        if(listCollaboratori != null && listCollaboratori.size() > 0) {
          pstmC = conn.prepareStatement(sSQL_C);
          for(int i = 0; i < listCollaboratori.size(); i++) {
            Collaboratore collaboratore = listCollaboratori.get(i);
            
            if(collaboratore == null) continue;
            int iIdCollaboratore = collaboratore.getId();
            if(iIdCollaboratore == 0) continue;
            
            int iIdCP = ConnectionManager.nextVal(conn, "SEQ_PRZ_COLLABORATORI_PRE");
            
            p = 0;
            pstmC.setInt(++p,  iIdCP);
            pstmC.setInt(++p,  iIdUte);
            pstmC.setDate(++p, new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
            pstmC.setInt(++p,  1); // FLAG_ATTIVO
            pstmC.setInt(++p,  iIdCollaboratore);
            pstmC.setInt(++p,  iId);
            pstmC.executeUpdate();
          }
        }
      }
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSPrestazioni.update", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstmP, pstmA, pstmC, conn);
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
      
      pstm = conn.prepareStatement("UPDATE PRZ_PRESTAZIONI SET FLAG_ATTIVO=?,ID_UTE_DELETE=?,DATA_DELETE=? WHERE ID=?");
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
      logger.error("Eccezione in WSPrestazioni.delete(" + iId + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return result;
  }
  
  public static
  int importData(Connection conn, InputStream is, int iIdGru, int iIdFar)
      throws Exception
  {
    if(conn == null || is == null) return 0;
    
    int iRow = 0;
    int iResult = 0;
    
    int p = 0;
    PreparedStatement pstmD = null;
    PreparedStatement pstmI = null;
    BufferedReader br = null;
    try {
      pstmD = conn.prepareStatement("DELETE FROM PRZ_COLLABORATORI_PRE WHERE ID_PRESTAZIONE=?");
      pstmI = conn.prepareStatement("INSERT INTO PRZ_COLLABORATORI_PRE(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_COLLABORATORE,ID_PRESTAZIONE) VALUES(?,?,?,?,?,?)");
      
      br = new BufferedReader(new InputStreamReader(is));
      
      String sLine = null;
      while((sLine = br.readLine()) != null) {
        
        iRow++;
        if(iRow == 1) continue; // Header
        
        WList wlRecord = new WList(sLine, ',');
        
        String sTrattamento   = wlRecord.getString(2, "");
        //				double dPrezzo        = wlRecord.getDouble(3, 0);
        //				double dPrezzoFin     = wlRecord.getDouble(4, 0);
        //				int    iDurata        = wlRecord.getInt(5, 0);
        String sCollaboratori = wlRecord.getString(6, "");
        
        if(sTrattamento == null || sTrattamento.length() == 0 || sTrattamento.equals("\"\"")) {
          System.out.println("[" + iRow + "] Record scartato: trattamento assente");
          continue;
        }
        if(sCollaboratori == null || sCollaboratori.length() == 0 || sCollaboratori.equals("\"\"")) {
          System.out.println("[" + iRow + "] Record scartato: collaboratori assenti");
          continue;
        }
        
        if(sTrattamento.startsWith("\"") && sTrattamento.endsWith("\"")) {
          sTrattamento = sTrattamento.substring(1, sTrattamento.length() - 1).trim();
        }
        sTrattamento = sTrattamento.replace('#', ',');
        sTrattamento = sTrattamento.replace("LuminositC B Viso", "Luminosit&agrave; Viso");
        sTrattamento = sTrattamento.replace("LuminositC",        "Luminosit&agrave;");
        sTrattamento = sTrattamento.replace(";  Viso",           "; Viso");
        
        int iIdPrestazione = DBUtil.readInt(conn, "SELECT ID FROM PRZ_PRESTAZIONI WHERE ID_FAR=? AND DESCRIZIONE=?", iIdFar, sTrattamento);
        if(iIdPrestazione == 0) {
          System.out.println("[" + iRow + "] Record scartato: trattamento \"" + sTrattamento + "\" non identificato");
          continue;
        }
        
        pstmD.setInt(1, iIdPrestazione);
        pstmD.executeUpdate();
        
        if(sCollaboratori.startsWith("\"") && sCollaboratori.endsWith("\"")) {
          sCollaboratori = sCollaboratori.substring(1, sCollaboratori.length() - 1).trim();
        }
        else {
          sCollaboratori = sCollaboratori.trim();
        }
        
        WList wlCollaboratori = new WList(sCollaboratori, '|');
        for(int i = 0; i < wlCollaboratori.size(); i++) {
          String sCollaboratore = wlCollaboratori.getString(i);
          if(sCollaboratore == null) continue;
          if(sCollaboratore.startsWith("\"")) sCollaboratore = sCollaboratore.substring(1);
          if(sCollaboratore.endsWith("\""))   sCollaboratore = sCollaboratore.substring(0, sCollaboratore.length() - 1);
          sCollaboratore = sCollaboratore.trim();
          if(sCollaboratore.length() == 0) continue;
          
          int iIdCollaboratore = DBUtil.readInt(conn, "SELECT ID FROM PRZ_COLLABORATORI WHERE ID_FAR=? AND NOME=?", iIdFar, sCollaboratore);
          if(iIdCollaboratore == 0) {
            System.out.println("[" + iRow + "] collaboratore \"" + sCollaboratore + "\" non identificato");
            continue;
          }
          
          int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_COLLABORATORI_PRE");
          
          p = 0;
          pstmI.setInt(++p, iId);
          pstmI.setInt(++p,   1);
          pstmI.setDate(++p,  new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
          pstmI.setInt(++p,   1); // FLAG_ATTIVO
          pstmI.setInt(++p, iIdCollaboratore);
          pstmI.setInt(++p, iIdPrestazione);
          pstmI.executeUpdate();
        }
        
        conn.commit();
        iResult++;
      }
    }
    catch(Exception ex) {
      ex.printStackTrace();
      throw ex;
    }
    finally {
      ConnectionManager.close(pstmD, pstmI, conn);
    }
    return iResult;
  }
}
