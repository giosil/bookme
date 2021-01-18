package org.dew.bookme.ws;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.UserTransaction;

import org.apache.log4j.Logger;

import org.json.JSON;
import org.util.WMap;
import org.util.WUtil;

import org.dew.bookme.bl.Calendario;
import org.dew.bookme.bl.Prenotazione;
import org.dew.bookme.bl.User;

import org.dew.bookme.util.ConnectionManager;
import org.dew.bookme.util.DataUtil;
import org.dew.bookme.util.DBUtil;
import org.dew.bookme.util.WSContext;

public 
class WSOnLine 
{
  protected static Logger logger = Logger.getLogger(WSOnLine.class);
  
  protected static Map<String,Integer> mapUserIdFar = new HashMap<String,Integer>();
  
  public static
  User checkUserLogged()
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.checkUserLogged()[" + sUserName + "]...");
    
    User user = WSContext.getUser();
    
    mapUserIdFar.remove(sUserName);
    
    logger.debug("WSOnLine.checkUserLogged()[" + sUserName + "] -> " + user);
    return user;
  }
  
  public static
  List<Map<String,Object>> getStructures(int iIdStruttura)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.getStructures(" + iIdStruttura + ")[" + sUserName + "]...");
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    mapUserIdFar.remove(sUserName);
    
    if(iIdStruttura == 0) return listResult;
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      int iIdGru = DBUtil.readInt(conn, "SELECT ID_GRU FROM PRZ_STRUTTURE WHERE ID_FAR=? AND FLAG_ATTIVO=?", iIdStruttura, 1);
      if(iIdGru == 0) return listResult;
      
      User user  = WSContext.getUser();
      if(user.getGroup() == 0) {
        user.setGroup(iIdGru);
      }
      
      pstm = conn.prepareStatement("SELECT ID,ID_FAR,CODICE,DESCRIZIONE,TELEFONO,EMAIL FROM PRZ_STRUTTURE WHERE ID_GRU=? AND FLAG_ATTIVO=? AND PREN_ONLINE=?");
      pstm.setInt(++p, iIdGru);
      pstm.setInt(++p, 1);
      pstm.setInt(++p, 1);
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId          = rs.getInt("ID");
        int    iIdFar       = rs.getInt("ID_FAR");
        String sCodice      = rs.getString("CODICE");
        String sDescrizione = rs.getString("DESCRIZIONE");
        String sTelefono    = rs.getString("TELEFONO");
        String sEmail       = rs.getString("EMAIL");
        
        Map<String,Object> mapRecord = new HashMap<String,Object>(4);
        mapRecord.put("id",          iId);
        mapRecord.put("idStruttura",  iIdFar);
        mapRecord.put("codice",      sCodice);
        mapRecord.put("descrizione", sDescrizione);
        mapRecord.put("telefono",    sTelefono);
        mapRecord.put("email",       sEmail);
        
        listResult.add(mapRecord);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.getStructures(" + iIdStruttura + ")[" + sUserName + "]", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static List<Map<String, Object>> getInfoContattiApp(int idGruppo) throws Exception {
    String sUserName = WSContext.getUserName();
    logger.debug("WSOnLine.getIntoContattiApp(" + idGruppo + ")[" + sUserName + "]...");
    List<Map<String, Object>> listResult = new ArrayList<Map<String, Object>>();
    return listResult;
  }
  
  public static
  Map<String,Object> getStructure(int iIdStruttura)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.getStructure(" + iIdStruttura + ")[" + sUserName + "]...");
    Map<String,Object> mapResult = new HashMap<String,Object>(4);
    
    mapUserIdFar.remove(sUserName);
    
    if(iIdStruttura == 0) return mapResult;
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement("SELECT ID,CODICE,DESCRIZIONE,TELEFONO,EMAIL FROM PRZ_STRUTTURE WHERE ID_FAR=? AND FLAG_ATTIVO=? AND PREN_ONLINE=?");
      pstm.setInt(++p, iIdStruttura);
      pstm.setInt(++p, 1);
      pstm.setInt(++p, 1);
      rs = pstm.executeQuery();
      if(rs.next()) {
        int    iId          = rs.getInt("ID");
        String sCodice      = rs.getString("CODICE");
        String sDescrizione = rs.getString("DESCRIZIONE");
        String sTelefono    = rs.getString("TELEFONO");
        String sEmail       = rs.getString("EMAIL");
        
        mapResult.put("id",          iId);
        mapResult.put("idStruttura",  iIdStruttura);
        mapResult.put("codice",      sCodice);
        mapResult.put("descrizione", sDescrizione);
        mapResult.put("telefono",    sTelefono);
        mapResult.put("email",       sEmail);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.getStructure(" + iIdStruttura + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return mapResult;
  }
  
  public static List<Map<String,Object>> getServices(int iIdStruttura)
      throws Exception
  {
    return WSOnLine.getServices(iIdStruttura, false);
  }
  
  public static List<Map<String,Object>> getServices(int iIdStruttura, boolean soloPrenotabileOnline)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.getServices(" + iIdStruttura + ")[" + sUserName + "]...");
    
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    if(iIdStruttura == 0) return listResult;
    
    mapUserIdFar.put(sUserName, iIdStruttura);
    
    // Solo i trattamenti realmente eseguiti e prenotabili on line
    String sSQL = "SELECT UNIQUE P.ID,G.ID ID_GRUPPO,G.DESCRIZIONE DES_GRUPPO,P.DESCRIZIONE,P.TIPO_PREZZO,P.PREZZO_LISTINO,P.PREZZO_FINALE,P.DURATA, P.PREN_ONLINE ";
    sSQL += "FROM PRZ_PRESTAZIONI P,PRZ_PRESTAZIONI_GRUPPI G,PRZ_COLLABORATORI_PRE E,PRZ_COLLABORATORI C ";
    sSQL += "WHERE P.ID_GRUPPO_PRE=G.ID AND P.ID=E.ID_PRESTAZIONE AND E.ID_COLLABORATORE=C.ID AND P.ID_GRU=? ";
    sSQL += "AND E.FLAG_ATTIVO=1 AND C.FLAG_ATTIVO=1 AND P.FLAG_ATTIVO=1 AND C.ID_FAR=? ";
    
    if (soloPrenotabileOnline) {
      sSQL +=  " AND C.PREN_ONLINE=? AND P.PREN_ONLINE=? "; 
    }
    
    sSQL += " ORDER BY G.ID,P.DESCRIZIONE ";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      int iIdGru = DBUtil.readInt(conn, "SELECT ID_GRU FROM PRZ_STRUTTURE WHERE ID_FAR=? AND FLAG_ATTIVO=?", iIdStruttura, 1);
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p, iIdGru);
      pstm.setInt(++p, iIdStruttura);
      if ( soloPrenotabileOnline ) {
        pstm.setInt(++p, 1); // PRZ_COLLABORATORI.PREN_ONLINE
        pstm.setInt(++p, 1); // PRZ_PRESTAZIONI.PREN_ONLINE
      }
      rs = pstm.executeQuery();
      
      while(rs.next()) {
        int    iId               = rs.getInt("ID");
        String sGruppo           = rs.getString("DES_GRUPPO");
        String sDescrizione      = rs.getString("DESCRIZIONE");
        String sTipoPrezzo       = rs.getString("TIPO_PREZZO");
        double dPrezzoListino    = rs.getDouble("PREZZO_LISTINO");
        double dPrezzoFinale     = rs.getDouble("PREZZO_FINALE");
        int    iDurata           = rs.getInt("DURATA");
        int    prenotabileOnline = rs.getInt("PREN_ONLINE");
        double dDifferenza       = dPrezzoListino - dPrezzoFinale;
        double dSconto           = 0.0d;
        if(dDifferenza > 0.01d && dPrezzoListino > 0.01d) {
          dSconto = WUtil.round2((dDifferenza * 100.0) / dPrezzoListino);
        }
        
        if(prenotabileOnline == 0) {
          // Se non e' prenotabile on line, si verifica che vi sia un prezzo impostato.
          // Altrimenti e' un trattamento che non deve essere visibile
          if(dPrezzoListino == 0.0d) continue;
        }
        
        Map<String,Object> mapRecord = new HashMap<String,Object>();
        mapRecord.put("id",          iId);
        mapRecord.put("gruppo",      sGruppo);
        mapRecord.put("descrizione", sDescrizione);
        mapRecord.put("tipoPrezzo",  sTipoPrezzo);
        mapRecord.put("listino",     dPrezzoListino);
        mapRecord.put("prezzo",      dPrezzoFinale);
        mapRecord.put("sconto",      dSconto);
        mapRecord.put("durata",      iDurata);
        mapRecord.put("prenOnline",  prenotabileOnline != 0);
        
        listResult.add(mapRecord);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.getServices(" + iIdStruttura + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> getOperators(int iIdService)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.getOperators(" + iIdService + ")[" + sUserName + "]...");
    
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    if(iIdService == 0) return listResult;
    
    Integer oIdStruttura = mapUserIdFar.get(sUserName);
    int iIdStruttura = oIdStruttura != null ? oIdStruttura.intValue() : 0;
    logger.debug("WSOnLine.getOperators(" + iIdService + ")[" + sUserName + "] iIdStruttura=" + iIdStruttura);
    
    String sSQL = "SELECT C.ID,C.NOME ";
    sSQL += "FROM PRZ_COLLABORATORI_PRE CP,PRZ_COLLABORATORI C ";
    sSQL += "WHERE CP.ID_COLLABORATORE=C.ID AND CP.ID_PRESTAZIONE=? AND CP.FLAG_ATTIVO=? AND C.FLAG_ATTIVO=? AND C.PREN_ONLINE=? ";
    if(iIdStruttura != 0) {
      sSQL += "AND C.ID_FAR=? ";
    }
    sSQL += "ORDER BY C.NOME";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p, iIdService);
      pstm.setInt(++p, 1); // CP.FLAG_ATTIVO
      pstm.setInt(++p, 1); // C.FLAG_ATTIVO
      pstm.setInt(++p, 1); // C.PREN_ONLINE
      if(iIdStruttura != 0) {
        pstm.setInt(++p, iIdStruttura); // C.ID_FAR
      }
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId          = rs.getInt("ID");
        String sDescrizione = rs.getString("NOME");
        
        Map<String,Object> mapRecord = new HashMap<String,Object>(2);
        mapRecord.put("id",          iId);
        mapRecord.put("descrizione", sDescrizione);
        
        listResult.add(mapRecord);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.getOperators(" + iIdService + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> getOperators(int iIdService, int iIdStruttura)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.getOperators(" + iIdService + "," + iIdStruttura + ")[" + sUserName + "]...");
    
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    if(iIdService == 0) return listResult;
    
    String sSQL = "SELECT C.ID,C.NOME ";
    sSQL += "FROM PRZ_COLLABORATORI_PRE CP,PRZ_COLLABORATORI C ";
    sSQL += "WHERE CP.ID_COLLABORATORE=C.ID AND CP.ID_PRESTAZIONE=? AND CP.FLAG_ATTIVO=? AND C.FLAG_ATTIVO=? AND C.PREN_ONLINE=? ";
    if(iIdStruttura != 0) {
      sSQL += "AND C.ID_FAR=? ";
    }
    sSQL += "ORDER BY C.NOME";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p, iIdService); // CP.ID_PRESTAZIONE
      pstm.setInt(++p, 1); // CP.FLAG_ATTIVO
      pstm.setInt(++p, 1); // C.FLAG_ATTIVO
      pstm.setInt(++p, 1); // C.PREN_ONLINE
      if(iIdStruttura != 0) {
        pstm.setInt(++p, iIdStruttura); // C.ID_FAR
      }
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId          = rs.getInt("ID");
        String sDescrizione = rs.getString("NOME");
        
        Map<String,Object> mapRecord = new HashMap<String,Object>(2);
        mapRecord.put("id",          iId);
        mapRecord.put("descrizione", sDescrizione);
        
        listResult.add(mapRecord);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.getOperators(" + iIdService + "," + iIdStruttura + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> getOperators(Map<String,Object> mapFilter)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.getOperators(" + mapFilter + ")[" + sUserName + "]...");
    
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    if(mapFilter == null || mapFilter.isEmpty()) return listResult;
    
    WMap wmFilter = new WMap(mapFilter);
    
    int   iIdFar    = wmFilter.getInt("idFar");
    int[] aiIdPrest = wmFilter.getArrayOfInt("prestazioni");
    if(aiIdPrest == null || aiIdPrest.length == 0) {
      return listResult;
    }
    
    String sSQL = "SELECT C.ID,C.NOME,COUNT(*) ";
    sSQL += "FROM PRZ_COLLABORATORI_PRE CP,PRZ_COLLABORATORI C ";
    sSQL += "WHERE CP.ID_COLLABORATORE=C.ID ";
    if(aiIdPrest.length == 1) {
      sSQL += "AND CP.ID_PRESTAZIONE=? ";
    }
    else {
      sSQL += "AND CP.ID_PRESTAZIONE IN (" + DBUtil.buildInSetParams(aiIdPrest.length) + ") ";
    }
    sSQL += "AND CP.FLAG_ATTIVO=? AND C.FLAG_ATTIVO=? AND C.PREN_ONLINE=? ";
    if(iIdFar != 0) {
      sSQL += "AND C.ID_FAR=? ";
    }
    sSQL += "GROUP BY C.ID,C.NOME ";
    if(aiIdPrest.length > 1) {
      sSQL += "HAVING COUNT(*)=" + aiIdPrest.length + " ";
    }
    sSQL += "ORDER BY C.NOME";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      for(int i = 0; i < aiIdPrest.length; i++) {
        pstm.setInt(++p, aiIdPrest[i]); // CP.ID_PRESTAZIONE
      }
      pstm.setInt(++p, 1); // CP.FLAG_ATTIVO
      pstm.setInt(++p, 1); // C.FLAG_ATTIVO
      pstm.setInt(++p, 1); // C.PREN_ONLINE
      if(iIdFar != 0) {
        pstm.setInt(++p, iIdFar); // C.ID_FAR
      }
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId          = rs.getInt("ID");
        String sDescrizione = rs.getString("NOME");
        
        Map<String,Object> mapRecord = new HashMap<String,Object>(2);
        mapRecord.put("id",          iId);
        mapRecord.put("descrizione", sDescrizione);
        
        listResult.add(mapRecord);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.getOperators(" + mapFilter + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> check(Map<String,Object> mapValues)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.check(" + mapValues + ")[" + sUserName + "]...");
    
    if(mapValues == null || mapValues.isEmpty()) {
      return new ArrayList<Map<String,Object>>();
    }
    WMap wmValues = new WMap(mapValues);
    List<?> listServizi = wmValues.getList("servizi");
    if(listServizi == null || listServizi.size() == 0) {
      return new ArrayList<Map<String,Object>>();
    }
    List<Integer> listPrestazioni = new ArrayList<Integer>();
    for(int i = 0; i < listServizi.size(); i++) {
      Integer oIdService = WUtil.toInteger(listServizi.get(i), null);
      if(oIdService == null || oIdService.intValue() == 0) continue;
      listPrestazioni.add(oIdService);
    }
    if(listPrestazioni.size() == 0) {
      return new ArrayList<Map<String,Object>>();
    }
    Date dDate = wmValues.getDate("data");
    if(dDate == null) dDate = new Date();
    int iIdStruttura      = wmValues.getInt("struttura");
    int iIdOperator      = wmValues.getInt("collaboratore");
    boolean boMattina    = wmValues.getBoolean("mattina");
    boolean boPomeriggio = wmValues.getBoolean("pomeriggio");
    
    if(iIdStruttura == 0) {
      Integer oIdStruttura = mapUserIdFar.get(sUserName);
      iIdStruttura = oIdStruttura != null ? oIdStruttura.intValue() : 0;
      logger.debug("WSOnLine.check(" + mapValues + ")[" + sUserName + "] iIdStruttura=" + iIdStruttura);
    }
    
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    try {
      Prenotazione prenotazione = new Prenotazione();
      prenotazione.setPrestazioni(listPrestazioni);
      prenotazione.setIdColl(iIdOperator);
      prenotazione.setIdFar(iIdStruttura);
      prenotazione.setCambioData(dDate);
      
      if(boMattina && !boPomeriggio) {
        prenotazione.setPreferenze("M");
      }
      else if(!boMattina && boPomeriggio) {
        prenotazione.setPreferenze("P");
      }
      prenotazione.setPrenOnLine(true);
      
      List<Calendario> listCalendario = WSCalendario.getAvailabilities(prenotazione);
      if(listCalendario != null) {
        for(int i = 0; i < listCalendario.size(); i++) {
          
          Calendario calendario = listCalendario.get(i);
          
          Map<String,Object> mapRecord = new HashMap<String,Object>();
          mapRecord.put("data",    calendario.getData());
          mapRecord.put("ora",     calendario.getOraInizio());
          mapRecord.put("idOpe",   calendario.getIdCollaboratore());
          mapRecord.put("descOpe", calendario.getNomeCollab());
          
          listResult.add(mapRecord);
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.check", ex);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> check(int iIdService, Date dDate, int iIdOperator, int iMattina, int iPomeriggio)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.check(" + iIdService + "," + WUtil.formatDate(dDate, "-") + "," + iIdOperator + "," + iMattina + "," + iPomeriggio + ")[" + sUserName + "]...");
    
    if(iIdService == 0) return new ArrayList<Map<String,Object>>();
    if(dDate == null) dDate = new Date();
    
    Integer oIdStruttura = mapUserIdFar.get(sUserName);
    int iIdStruttura = oIdStruttura != null ? oIdStruttura.intValue() : 0;
    logger.debug("WSOnLine.check(" + iIdService + "," + WUtil.formatDate(dDate, "-") + "," + iIdOperator + "," + iMattina + "," + iPomeriggio + ")[" + sUserName + "] iIdStruttura=" + iIdStruttura);
    
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    try {
      Prenotazione prenotazione = new Prenotazione();
      prenotazione.setIdPrest(iIdService);
      prenotazione.setIdFar(iIdStruttura);
      prenotazione.setIdColl(iIdOperator);
      prenotazione.setCambioData(dDate);
      if(iMattina != 0 && iPomeriggio == 0) {
        prenotazione.setPreferenze("M");
      }
      else if(iMattina == 0 && iPomeriggio != 0) {
        prenotazione.setPreferenze("P");
      }
      prenotazione.setPrenOnLine(true);
      
      List<Calendario> listCalendario = WSCalendario.getAvailabilities(prenotazione);
      if(listCalendario != null) {
        for(int i = 0; i < listCalendario.size(); i++) {
          
          Calendario calendario = listCalendario.get(i);
          
          Map<String,Object> mapRecord = new HashMap<String,Object>();
          mapRecord.put("data",    calendario.getData());
          mapRecord.put("ora",     calendario.getOraInizio());
          mapRecord.put("idOpe",   calendario.getIdCollaboratore());
          mapRecord.put("descOpe", calendario.getNomeCollab());
          
          listResult.add(mapRecord);
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.check(" + iIdService + "," + WUtil.formatDate(dDate, "-") + "," + iIdOperator + "," + iMattina + "," + iPomeriggio + ")", ex);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> check(int iIdService, Date dDate, int iIdOperator, int iMattina, int iPomeriggio, int iIdFar)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.check(" + iIdService + "," + WUtil.formatDate(dDate, "-") + "," + iIdOperator + "," + iMattina + "," + iPomeriggio + "," + iIdFar + ")[" + sUserName + "]...");
    
    if(iIdService == 0) return new ArrayList<Map<String,Object>>();
    if(dDate == null) dDate = new Date();
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    try {
      Prenotazione prenotazione = new Prenotazione();
      prenotazione.setIdPrest(iIdService);
      prenotazione.setIdFar(iIdFar);
      prenotazione.setIdColl(iIdOperator);
      prenotazione.setCambioData(dDate);
      if(iMattina != 0 && iPomeriggio == 0) {
        prenotazione.setPreferenze("M");
      }
      else if(iMattina == 0 && iPomeriggio != 0) {
        prenotazione.setPreferenze("P");
      }
      prenotazione.setPrenOnLine(true);
      
      List<Calendario> listCalendario = WSCalendario.getAvailabilities(prenotazione);
      if(listCalendario != null) {
        for(int i = 0; i < listCalendario.size(); i++) {
          
          Calendario calendario = listCalendario.get(i);
          
          Map<String,Object> mapRecord = new HashMap<String,Object>();
          mapRecord.put("data",    calendario.getData());
          mapRecord.put("ora",     calendario.getOraInizio());
          mapRecord.put("idOpe",   calendario.getIdCollaboratore());
          mapRecord.put("descOpe", calendario.getNomeCollab());
          
          listResult.add(mapRecord);
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.check(" + iIdService + "," + WUtil.formatDate(dDate, "-") + "," + iIdOperator + "," + iMattina + "," + iPomeriggio + "," + iIdFar + ")...", ex);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> next(Map<String,Object> mapValues)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.next(" + mapValues + ")[" + sUserName + "]...");
    
    if(mapValues == null || mapValues.isEmpty()) {
      return new ArrayList<Map<String,Object>>();
    }
    WMap wmValues = new WMap(mapValues);
    List<?> listServizi = wmValues.getList("servizi");
    if(listServizi == null || listServizi.size() == 0) {
      return new ArrayList<Map<String,Object>>();
    }
    List<Integer> listPrestazioni = new ArrayList<Integer>();
    for(int i = 0; i < listServizi.size(); i++) {
      Integer oIdService = WUtil.toInteger(listServizi.get(i), null);
      if(oIdService == null || oIdService.intValue() == 0) continue;
      listPrestazioni.add(oIdService);
    }
    if(listPrestazioni.size() == 0) {
      return new ArrayList<Map<String,Object>>();
    }
    Date dDate = wmValues.getDate("data");
    if(dDate == null) {
      dDate = new Date();
    }
    else {
      Calendar cal = Calendar.getInstance();
      cal.setTimeInMillis(dDate.getTime());
      cal.add(Calendar.DATE, 1);
      dDate = cal.getTime();
    }
    int iIdStruttura      = wmValues.getInt("struttura");
    int iIdOperator      = wmValues.getInt("collaboratore");
    boolean boMattina    = wmValues.getBoolean("mattina");
    boolean boPomeriggio = wmValues.getBoolean("pomeriggio");
    
    if(iIdStruttura == 0) {
      Integer oIdStruttura = mapUserIdFar.get(sUserName);
      iIdStruttura = oIdStruttura != null ? oIdStruttura.intValue() : 0;
    }
    
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    try {
      Prenotazione prenotazione = new Prenotazione();
      prenotazione.setPrestazioni(listPrestazioni);
      prenotazione.setIdFar(iIdStruttura);
      prenotazione.setIdColl(iIdOperator);
      prenotazione.setCambioDal(dDate);
      if(boMattina && !boPomeriggio) {
        prenotazione.setPreferenze("M");
      }
      else if(!boMattina && boPomeriggio) {
        prenotazione.setPreferenze("P");
      }
      prenotazione.setPrenOnLine(true);
      
      List<Calendario> listCalendario = WSCalendario.getAvailabilities(prenotazione);
      if(listCalendario != null) {
        for(int i = 0; i < listCalendario.size(); i++) {
          
          Calendario calendario = listCalendario.get(i);
          
          Map<String,Object> mapRecord = new HashMap<String,Object>();
          mapRecord.put("data",    calendario.getData());
          mapRecord.put("ora",     calendario.getOraInizio());
          mapRecord.put("idOpe",   calendario.getIdCollaboratore());
          mapRecord.put("descOpe", calendario.getNomeCollab());
          
          listResult.add(mapRecord);
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.next", ex);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> next(int iIdService, Date dDate, int iIdOperator, int iMattina, int iPomeriggio)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.next(" + iIdService + "," + WUtil.formatDate(dDate, "-") + "," + iIdOperator + "," + iMattina + "," + iPomeriggio + ")[" + sUserName + "]...");
    
    if(iIdService == 0) return new ArrayList<Map<String,Object>>();
    if(dDate == null) {
      dDate = new Date();
    }
    else {
      Calendar cal = Calendar.getInstance();
      cal.setTimeInMillis(dDate.getTime());
      cal.add(Calendar.DATE, 1);
      dDate = cal.getTime();
    }
    
    Integer oIdStruttura = mapUserIdFar.get(sUserName);
    int iIdStruttura = oIdStruttura != null ? oIdStruttura.intValue() : 0;
    
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    try {
      Prenotazione prenotazione = new Prenotazione();
      prenotazione.setIdPrest(iIdService);
      prenotazione.setIdFar(iIdStruttura);
      prenotazione.setIdColl(iIdOperator);
      prenotazione.setCambioDal(dDate);
      if(iMattina != 0 && iPomeriggio == 0) {
        prenotazione.setPreferenze("M");
      }
      else if(iMattina == 0 && iPomeriggio != 0) {
        prenotazione.setPreferenze("P");
      }
      prenotazione.setPrenOnLine(true);
      
      List<Calendario> listCalendario = WSCalendario.getAvailabilities(prenotazione);
      if(listCalendario != null) {
        for(int i = 0; i < listCalendario.size(); i++) {
          
          Calendario calendario = listCalendario.get(i);
          
          Map<String,Object> mapRecord = new HashMap<String,Object>();
          mapRecord.put("data",    calendario.getData());
          mapRecord.put("ora",     calendario.getOraInizio());
          mapRecord.put("idOpe",   calendario.getIdCollaboratore());
          mapRecord.put("descOpe", calendario.getNomeCollab());
          
          listResult.add(mapRecord);
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.next(" + iIdService + "," + WUtil.formatDate(dDate, "-") + "," + iIdOperator + "," + iMattina + "," + iPomeriggio + ")", ex);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> next(int iIdService, Date dDate, int iIdOperator, int iMattina, int iPomeriggio, int iIdFar)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.next(" + iIdService + "," + WUtil.formatDate(dDate, "-") + "," + iIdOperator + "," + iMattina + "," + iPomeriggio + "," + iIdFar + ")[" + sUserName + "]...");
    
    if(iIdService == 0) return new ArrayList<Map<String,Object>>();
    if(dDate == null) {
      dDate = new Date();
    }
    else {
      Calendar cal = Calendar.getInstance();
      cal.setTimeInMillis(dDate.getTime());
      cal.add(Calendar.DATE, 1);
      dDate = cal.getTime();
    }
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    try {
      Prenotazione prenotazione = new Prenotazione();
      prenotazione.setIdPrest(iIdService);
      prenotazione.setIdFar(iIdFar);
      prenotazione.setIdColl(iIdOperator);
      prenotazione.setCambioDal(dDate);
      if(iMattina != 0 && iPomeriggio == 0) {
        prenotazione.setPreferenze("M");
      }
      else if(iMattina == 0 && iPomeriggio != 0) {
        prenotazione.setPreferenze("P");
      }
      prenotazione.setPrenOnLine(true);
      
      List<Calendario> listCalendario = WSCalendario.getAvailabilities(prenotazione);
      if(listCalendario != null) {
        for(int i = 0; i < listCalendario.size(); i++) {
          
          Calendario calendario = listCalendario.get(i);
          
          Map<String,Object> mapRecord = new HashMap<String,Object>();
          mapRecord.put("data",    calendario.getData());
          mapRecord.put("ora",     calendario.getOraInizio());
          mapRecord.put("idOpe",   calendario.getIdCollaboratore());
          mapRecord.put("descOpe", calendario.getNomeCollab());
          
          listResult.add(mapRecord);
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.next(" + iIdService + "," + WUtil.formatDate(dDate, "-") + "," + iIdOperator + "," + iMattina + "," + iPomeriggio + "," + iIdFar + ")", ex);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> prev(Map<String,Object> mapValues)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.prev(" + mapValues + ")[" + sUserName + "]...");
    
    if(mapValues == null || mapValues.isEmpty()) {
      return new ArrayList<Map<String,Object>>();
    }
    WMap wmValues = new WMap(mapValues);
    List<?> listServizi = wmValues.getList("servizi");
    if(listServizi == null || listServizi.size() == 0) {
      return new ArrayList<Map<String,Object>>();
    }
    List<Integer> listPrestazioni = new ArrayList<Integer>();
    for(int i = 0; i < listServizi.size(); i++) {
      Integer oIdService = WUtil.toInteger(listServizi.get(i), null);
      if(oIdService == null || oIdService.intValue() == 0) continue;
      listPrestazioni.add(oIdService);
    }
    if(listPrestazioni.size() == 0) {
      return new ArrayList<Map<String,Object>>();
    }
    Date dDate = wmValues.getDate("data");
    if(dDate == null) dDate = new Date();
    int iIdStruttura      = wmValues.getInt("struttura");
    int iIdOperator      = wmValues.getInt("collaboratore");
    boolean boMattina    = wmValues.getBoolean("mattina");
    boolean boPomeriggio = wmValues.getBoolean("pomeriggio");
    
    if(iIdStruttura == 0) {
      Integer oIdStruttura = mapUserIdFar.get(sUserName);
      iIdStruttura = oIdStruttura != null ? oIdStruttura.intValue() : 0;
    }
    
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    try {
      Prenotazione prenotazione = new Prenotazione();
      prenotazione.setPrestazioni(listPrestazioni);
      prenotazione.setIdFar(iIdStruttura);
      prenotazione.setIdColl(iIdOperator);
      prenotazione.setCambioAl(dDate);
      if(boMattina && !boPomeriggio) {
        prenotazione.setPreferenze("M");
      }
      else if(!boMattina && boPomeriggio) {
        prenotazione.setPreferenze("P");
      }
      prenotazione.setPrenOnLine(true);
      
      List<Calendario> listCalendario = WSCalendario.getAvailabilities(prenotazione);
      if(listCalendario != null) {
        for(int i = 0; i < listCalendario.size(); i++) {
          
          Calendario calendario = listCalendario.get(i);
          
          Map<String,Object> mapRecord = new HashMap<String,Object>();
          mapRecord.put("data",    calendario.getData());
          mapRecord.put("ora",     calendario.getOraInizio());
          mapRecord.put("idOpe",   calendario.getIdCollaboratore());
          mapRecord.put("descOpe", calendario.getNomeCollab());
          
          listResult.add(mapRecord);
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.prev", ex);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> prev(int iIdService, Date dDate, int iIdOperator, int iMattina, int iPomeriggio)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.prev(" + iIdService + "," + WUtil.formatDate(dDate, "-") + "," + iIdOperator + "," + iMattina + "," + iPomeriggio + ")[" + sUserName + "]...");
    
    if(iIdService == 0) return new ArrayList<Map<String,Object>>();
    if(dDate == null) dDate = new Date();
    
    Integer oIdStruttura = mapUserIdFar.get(sUserName);
    int iIdStruttura = oIdStruttura != null ? oIdStruttura.intValue() : 0;
    
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    try {
      Prenotazione prenotazione = new Prenotazione();
      prenotazione.setIdPrest(iIdService);
      prenotazione.setIdFar(iIdStruttura);
      prenotazione.setIdColl(iIdOperator);
      prenotazione.setCambioAl(dDate);
      if(iMattina != 0 && iPomeriggio == 0) {
        prenotazione.setPreferenze("M");
      }
      else if(iMattina == 0 && iPomeriggio != 0) {
        prenotazione.setPreferenze("P");
      }
      prenotazione.setPrenOnLine(true);
      
      List<Calendario> listCalendario = WSCalendario.getAvailabilities(prenotazione);
      if(listCalendario != null) {
        for(int i = 0; i < listCalendario.size(); i++) {
          
          Calendario calendario = listCalendario.get(i);
          
          Map<String,Object> mapRecord = new HashMap<String,Object>();
          mapRecord.put("data",    calendario.getData());
          mapRecord.put("ora",     calendario.getOraInizio());
          mapRecord.put("idOpe",   calendario.getIdCollaboratore());
          mapRecord.put("descOpe", calendario.getNomeCollab());
          
          listResult.add(mapRecord);
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.prev(" + iIdService + "," + WUtil.formatDate(dDate, "-") + "," + iIdOperator + "," + iMattina + "," + iPomeriggio + ")", ex);
    }
    return listResult;
  }
  
  public static
  List<Map<String,Object>> prev(int iIdService, Date dDate, int iIdOperator, int iMattina, int iPomeriggio, int iIdFar)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.prev(" + iIdService + "," + WUtil.formatDate(dDate, "-") + "," + iIdOperator + "," + iMattina + "," + iPomeriggio + "," + iIdFar + ")[" + sUserName + "]...");
    
    if(iIdService == 0) return new ArrayList<Map<String,Object>>();
    if(dDate == null) dDate = new Date();
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    try {
      Prenotazione prenotazione = new Prenotazione();
      prenotazione.setIdPrest(iIdService);
      prenotazione.setIdColl(iIdOperator);
      prenotazione.setCambioAl(dDate);
      if(iMattina != 0 && iPomeriggio == 0) {
        prenotazione.setPreferenze("M");
      }
      else if(iMattina == 0 && iPomeriggio != 0) {
        prenotazione.setPreferenze("P");
      }
      prenotazione.setPrenOnLine(true);
      
      List<Calendario> listCalendario = WSCalendario.getAvailabilities(prenotazione);
      if(listCalendario != null) {
        for(int i = 0; i < listCalendario.size(); i++) {
          
          Calendario calendario = listCalendario.get(i);
          
          Map<String,Object> mapRecord = new HashMap<String,Object>();
          mapRecord.put("data",    calendario.getData());
          mapRecord.put("ora",     calendario.getOraInizio());
          mapRecord.put("idOpe",   calendario.getIdCollaboratore());
          mapRecord.put("descOpe", calendario.getNomeCollab());
          
          listResult.add(mapRecord);
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.prev(" + iIdService + "," + WUtil.formatDate(dDate, "-") + "," + iIdOperator + "," + iMattina + "," + iPomeriggio + "," + iIdFar + ")", ex);
    }
    return listResult;
  }
  
  public static 
  int getIdCustomer(int iIdStruttura)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.getIdCustomer(" + iIdStruttura + ")[" + sUserName + "]...");
    
    User user = WSContext.getUser();
    if(user == null) {
      logger.debug("WSOnLine.getIdCustomer(" + iIdStruttura + ")[" + sUserName + "] -> 0 (user == null)");
      return 0;
    }
    logger.debug("WSOnLine.getIdCustomer(" + iIdStruttura + ")[" + sUserName + "] user=" + JSON.stringify(user));
    
    String sCognomeNome = user.getFirstName();
    String sTelefono    = user.getMobile();
    
    int iResult = 0;
    Connection conn = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      String nome = user.getFirstName();
      String cognome = user.getLastName();
      
      // se sCognomeNome e' null, allora non esiste profilo.nome in mobcit_credenziali: si usa un nome cognome fittizio basato sul telefono
      if (sCognomeNome == null || sCognomeNome.trim().length() == 0) {
        cognome = sUserName;
        nome = "UTENTE";
      }
      
      iResult = WSClienti.getIdOrCreate(conn, 0, iIdStruttura, cognome, nome, sTelefono);
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.getIdCustomer(" + iIdStruttura + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
    logger.debug("WSOnLine.getIdCustomer(" + iIdStruttura + ")[" + sUserName + "] -> " + iResult);
    return iResult;
  }
  
  public static
  Map<String,Object> book(Prenotazione prenotazione)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.book(" + prenotazione + ")[" + sUserName + "]...");
    
    if(prenotazione == null) {
      logger.debug("WSOnLine.book(" + prenotazione + ") -> Invalid Prenotazione");
      return DataUtil.buildMap("messaggio", "Invalid Prenotazione");
    }
    int iIdFar = prenotazione.getIdFar();
    if(iIdFar == 0) {
      logger.debug("WSOnLine.book(" + prenotazione + ") -> Invalid Prenotazione.idFar");
      return DataUtil.buildMap("messaggio", "Invalid Prenotazione.idFar");
    }
    int iIdPrest = prenotazione.getIdPrest();
    if(iIdPrest == 0) {
      List<Integer> listPrestazioni = prenotazione.getPrestazioni();
      if(listPrestazioni == null || listPrestazioni.size() == 0) {
        logger.debug("WSOnLine.book(" + prenotazione + ") -> Invalid Prenotazione.idPrest or Prenotazione.prestazioni");
        return DataUtil.buildMap("messaggio", "Invalid Prenotazione.idPrest or Prenotazione.prestazioni");
      }
    }
    int iIdColl = prenotazione.getIdColl();
    if(iIdColl == 0) {
      logger.debug("WSOnLine.book(" + prenotazione + ") -> Invalid Prenotazione.idColl");
      return DataUtil.buildMap("messaggio", "Invalid Prenotazione.idColl");
    }
    Date dDataApp = prenotazione.getDataApp();
    if(dDataApp == null) {
      logger.debug("WSOnLine.book(" + prenotazione + ") -> Invalid Prenotazione.dataApp");
      return DataUtil.buildMap("messaggio", "Invalid Prenotazione.dataApp");
    }
    String sOraApp = prenotazione.getOraApp();
    if(sOraApp == null || sOraApp.length() < 3) {
      logger.debug("WSOnLine.book(" + prenotazione + ") -> Invalid Prenotazione.oraApp");
      return DataUtil.buildMap("messaggio", "Invalid Prenotazione.oraApp");
    }
    prenotazione.setPrenOnLine(true);
    prenotazione.setOverbooking(false);
    
    User user  = WSContext.getUser();
    if(user == null) {
      logger.debug("WSOnLine.book(" + prenotazione + ") -> Utente non riconosciuto");
      return DataUtil.buildMap("messaggio", "Utente non riconosciuto");
    }
    
    int iResult = 0;
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      // Se per qualche ragione il gruppo non e' valorizzato allora lo si recupera dalla struttura
      int iIdGru = user.getGroup();
      if(iIdGru == 0) {
        iIdGru = DBUtil.readInt(conn, "SELECT ID_GRU FROM PRZ_STRUTTURE WHERE ID_FAR=? AND FLAG_ATTIVO=?", iIdFar, 1);
        user.setGroup(iIdGru);
      }
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      int iIdCliente = prenotazione.getIdCliente();
      if(iIdCliente == 0) {
        String sCognome = null;
        String sNome    = null;
        String sDescCliente = prenotazione.getDescCliente();
        if(sDescCliente != null && sDescCliente.length() > 1) {
          sCognome = WSClienti.getCognome(sDescCliente);
          sNome    = WSClienti.getNome(sDescCliente);
        }
        else {
          sCognome = user.getLastName();
          sNome    = user.getFirstName();
        }
        iIdCliente = WSClienti.getIdOrCreate(conn, 0, prenotazione.getIdFar(), sCognome, sNome, user.getMobile());
        if(iIdCliente == 0) {
          logger.debug("WSOnLine.book(" + prenotazione + ") -> Dati cliente non disponibili");
          return DataUtil.buildMap("messaggio", "Dati cliente non disponibili");
        }
        prenotazione.setIdCliente(iIdCliente);
      }
      
      if(WSClienti.isDisPrenOnLine(conn, iIdCliente)) {
        logger.debug("WSOnLine.book(" + prenotazione + "):  isDisPrenOnLine(" + iIdCliente + ") -> true");
        return DataUtil.buildMap("messaggio", "Servizio di prenotazione sospeso");
      }
      
      prenotazione.setUserDesk(sUserName);
      
      Prenotazione res = WSPrenotazioni.book(conn, prenotazione, "Prenota App");
      if(res == null) {
        ut.rollback();
        logger.debug("WSOnLine.book(" + prenotazione + ") -> Prenotazione NON eseguita");
        return DataUtil.buildMap("messaggio", "Prenotazione NON eseguita");
      }
      String sMessaggio = res.getMessaggio();
      if(sMessaggio != null && sMessaggio.length() > 0) {
        ut.rollback();
        logger.debug("WSOnLine.book(" + prenotazione + ") -> " + sMessaggio);
        return DataUtil.buildMap("messaggio", sMessaggio);
      }
      iResult = res.getId();
      
      ut.commit();
    }
    catch(Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSOnLine.book", ex);
      return DataUtil.buildMap("messaggio", ex.toString());
    }
    finally {
      ConnectionManager.close(conn);
    }
    logger.debug("WSOnLine.book(" + prenotazione + ") -> {id=" + iResult + " ...}");
    return WUtil.toMapObject(prenotazione);
  }
  
  public static
  List<Map<String,Object>> multiBook(List<Prenotazione> prenotazioni)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.multiBook(" + prenotazioni + ")[" + sUserName + "]...");
    
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    if(prenotazioni == null || prenotazioni.size() == 0) {
      logger.debug("WSOnLine.multiBook(" + prenotazioni + ") -> No Prenotazione to book");
      listResult.add(DataUtil.buildMap("messaggio", "No Prenotazione to book"));
      return listResult;
    }
    
    User user  = WSContext.getUser();
    if(user == null) {
      logger.debug("WSOnLine.multiBook(" + prenotazioni + ") -> Utente non riconosciuto");
      listResult.add(DataUtil.buildMap("messaggio", "Utente non riconosciuto"));
      return listResult;
    }
    
    boolean boAtLeastOneErr = false;
    int iIdFar = 0;
    for(int i = 0; i < prenotazioni.size(); i++) {
      Prenotazione prenotazione = prenotazioni.get(i);
      if(prenotazione == null) {
        logger.debug("WSOnLine.multiBook(" + prenotazioni + ") -> Invalid Prenotazione[" + i + "]");
        listResult.add(DataUtil.buildMap("messaggio", "Invalid Prenotazione[" + i + "]"));
        boAtLeastOneErr = true;
      }
      iIdFar = prenotazione.getIdFar();
      if(iIdFar == 0) {
        logger.debug("WSOnLine.multiBook(" + prenotazioni + ") -> Invalid Prenotazione[" + i + "].idFar");
        listResult.add(DataUtil.buildMap("messaggio", "Invalid Prenotazione[" + i + "].idFar"));
        boAtLeastOneErr = true;
      }
      int iIdPrest = prenotazione.getIdPrest();
      if(iIdPrest == 0) {
        List<Integer> listPrestazioni = prenotazione.getPrestazioni();
        if(listPrestazioni == null || listPrestazioni.size() == 0) {
          logger.debug("WSOnLine.multiBook(" + prenotazioni + ") -> Invalid Prenotazione[" + i + "].idPrest or prestazioni");
          listResult.add(DataUtil.buildMap("messaggio", "Invalid Prenotazione[" + i + "].idPrest or Prenotazione[" + i + "].prestazioni"));
          boAtLeastOneErr = true;
        }
      }
      int iIdColl = prenotazione.getIdColl();
      if(iIdColl == 0) {
        logger.debug("WSOnLine.multiBook(" + prenotazioni + ") -> Invalid Prenotazione[" + i + "].idColl");
        listResult.add(DataUtil.buildMap("messaggio", "Invalid Prenotazione[" + i + "].idColl"));
        boAtLeastOneErr = true;
      }
      Date dDataApp = prenotazione.getDataApp();
      if(dDataApp == null) {
        logger.debug("WSOnLine.multiBook(" + prenotazioni + ") -> Invalid Prenotazione[" + i + "].dataApp");
        listResult.add(DataUtil.buildMap("messaggio", "Invalid Prenotazione[" + i + "].dataApp"));
        boAtLeastOneErr = true;
      }
      String sOraApp = prenotazione.getOraApp();
      if(sOraApp == null || sOraApp.length() < 3) {
        logger.debug("WSOnLine.multiBook(" + prenotazioni + ") -> Invalid Prenotazione[" + i + "].oraApp");
        listResult.add(DataUtil.buildMap("messaggio", "Invalid Prenotazione[" + i + "].oraApp"));
        boAtLeastOneErr = true;
      }
      prenotazione.setPrenOnLine(true);
      prenotazione.setOverbooking(false);
      // Nessun errore
      listResult.add(new HashMap<String,Object>(0));
    }
    if(boAtLeastOneErr) return listResult;
    // Si resetta la lista di ritorno
    listResult.clear();
    
    List<Integer> listOfId = new ArrayList<Integer>();
    
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      // Se per qualche ragione il gruppo non e' valorizzato allora lo si recupera dalla struttura
      int iIdGru = user.getGroup();
      if(iIdGru == 0) {
        iIdGru = DBUtil.readInt(conn, "SELECT ID_GRU FROM PRZ_STRUTTURE WHERE ID_FAR=? AND FLAG_ATTIVO=?", iIdFar, 1);
        user.setGroup(iIdGru);
      }
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      Prenotazione p0 = prenotazioni.get(0);
      int iIdCliente = p0.getIdCliente();
      if(iIdCliente == 0) {
        String sCognome = null;
        String sNome    = null;
        String sDescCliente = p0.getDescCliente();
        if(sDescCliente != null && sDescCliente.length() > 1) {
          sCognome = WSClienti.getCognome(sDescCliente);
          sNome    = WSClienti.getNome(sDescCliente);
        }
        else {
          sCognome = user.getLastName();
          sNome    = user.getFirstName();
        }
        iIdCliente = WSClienti.getIdOrCreate(conn, 0, p0.getIdFar(), sCognome, sNome, user.getMobile());
        if(iIdCliente == 0) {
          logger.debug("WSOnLine.multiBook([0]" + p0 + ") -> Dati cliente non disponibili");
          listResult.add(DataUtil.buildMap("messaggio", "Dati cliente non disponibili"));
          return listResult;
        }
        p0.setIdCliente(iIdCliente);
      }
      
      if(WSClienti.isDisPrenOnLine(conn, iIdCliente)) {
        logger.debug("WSOnLine.multiBook([0]" + p0 + "): isDisPrenOnLine(" + iIdCliente + ") -> true");
        listResult.add(DataUtil.buildMap("messaggio", "Servizio di prenotazione sospeso"));
        return listResult;
      }
      
      for(int i = 0; i < prenotazioni.size(); i++) {
        Prenotazione prenotazione = prenotazioni.get(i);
        prenotazione.setIdCliente(iIdCliente);
        prenotazione.setUserDesk(sUserName);
        
        Prenotazione res = WSPrenotazioni.book(conn, prenotazione, "Prenota App");
        if(res == null) {
          ut.rollback();
          logger.debug("WSOnLine.multiBook([" + i + "] " + prenotazione + ") -> Prenotazione NON eseguita");
          listResult.clear();
          listResult.add(DataUtil.buildMap("messaggio", "Prenotazione NON eseguita"));
          
          return listResult;
        }
        String sMessaggio = res.getMessaggio();
        if(sMessaggio != null && sMessaggio.length() > 0) {
          ut.rollback();
          logger.debug("WSOnLine.multiBook([" + i + "] " + prenotazione + ") -> " + sMessaggio);
          listResult.clear();
          listResult.add(DataUtil.buildMap("messaggio", sMessaggio));
          
          return listResult;
        }
        listOfId.add(res.getId());
        
        listResult.add(WUtil.toMapObject(prenotazione));
      }
      
      ut.commit();
    }
    catch(Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSOnLine.multiBook", ex);
      listResult.clear();
      listResult.add(DataUtil.buildMap("messaggio", ex.toString()));
      return listResult;
    }
    finally {
      ConnectionManager.close(conn);
    }
    logger.debug("WSOnLine.multiBook(" + prenotazioni + ") -> " + listOfId);
    return listResult;
  }
  
  public static
  boolean revoke(int iIdStruttura, int iId)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.revoke(" + iIdStruttura + "," + iId + ")[" + sUserName + "]...");
    
    if(iId == 0) {
      logger.debug("WSOnLine.revoke(" + iIdStruttura + "," + iId + ")[" + sUserName + "] -> false");
      return false;
    }
    
    long lCurrent = System.currentTimeMillis();
    
    boolean result = false;
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      Calendar calDataOraInizio = DBUtil.readDateTime(conn, "SELECT DATAORA_INIZIO FROM PRZ_PRENOTAZIONI WHERE ID=?", iId);
      if(calDataOraInizio != null) {
        long lApp  = calDataOraInizio.getTimeInMillis();
        long lDiff = lApp - lCurrent;
        if(lDiff < (3 * 60 * 60 * 1000)) {
          logger.debug("WSOnLine.revoke(" + iIdStruttura + "," + iId + ")[" + sUserName + "] -> false (lCurrent=" + lCurrent + ", lApp=" + lApp + ", lDiff=" + lDiff + ")");
          return false;
        }
      }
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      Prenotazione pre = WSPrenotazioni.read(conn, iId);
      if(pre == null) {
        logger.debug("WSOnLine.revoke(" + iIdStruttura + "," + iId + ")[" + sUserName + "] -> false (WSPrenotazioni.read(" + iId + ") -> null)");
        return false;
      }
      pre.setUserDesk(sUserName);
      
      Prenotazione res = WSPrenotazioni.revoke(conn, pre, "Annulla App");
      if(res == null || res.getMessaggio() == null) {
        result = true;
      }
      
      ut.commit();
    }
    catch(Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSOnLine.revoke(" + iIdStruttura + "," + iId + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
    logger.debug("WSOnLine.revoke(" + iIdStruttura + "," + iId + ") -> " + result);
    return result;
  }
  
  public static 
  List<Prenotazione> list(int iIdStruttura)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.list(" + iIdStruttura + ")[" + sUserName + "]...");
    List<Prenotazione> listResult = null;
    
    User user  = WSContext.getUser();
    if(user == null) {
      logger.debug("WSOnLine.list(" + iIdStruttura + ")[" + sUserName + "] -> [] (user is null)");
      return new ArrayList<Prenotazione>(0);
    }
    int iIdGru = user.getGroup();
    
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      int iIdCliente = WSClienti.getId(conn, iIdGru, iIdStruttura, user.getMobile());
      if(iIdCliente == 0) {
        logger.debug("WSOnLine.list(" + iIdStruttura + ")[" + sUserName + "] -> [] (iIdCliente=" + iIdCliente + ",iIdGru=" + iIdGru + ")");
        return new ArrayList<Prenotazione>(0);
      }
      
      ut.commit();
      
      Prenotazione filter = new Prenotazione();
      filter.setIdFar(iIdStruttura);
      filter.setIdCliente(iIdCliente);
      filter.setDataApp(WUtil.getCurrentDate().getTime());
      filter.setAllaData(WUtil.getUndefinedDate().getTime());
      
      listResult = WSPrenotazioni.find(conn, filter, false);
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.list(" + iIdStruttura + ")[" + sUserName + "]", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
    if(listResult == null) listResult = new ArrayList<Prenotazione>(0);
    logger.debug("WSOnLine.list(" + iIdStruttura + ")[" + sUserName + "] -> [" + listResult.size() + " items]");
    return listResult;
  }
  
  public static
  List<Prenotazione> history(int iIdStruttura)
      throws Exception
  {
    String sUserName = WSContext.getUserName();
    
    logger.debug("WSOnLine.history(" + iIdStruttura + ")[" + sUserName + "]...");
    List<Prenotazione> listResult = null;
    
    User user  = WSContext.getUser();
    if(user == null) {
      logger.debug("WSOnLine.history(" + iIdStruttura + ")[" + sUserName + "] -> [] (user is null)");
      return new ArrayList<Prenotazione>(0);
    }
    int iIdGru = user.getGroup();
    
    Calendar calFrom = WUtil.getCurrentDate();	
    calFrom.add(Calendar.YEAR, -2);
    Calendar calTo = WUtil.getCurrentDate();
    calTo.add(Calendar.DATE, -1);
    
    Connection conn = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      int iIdCliente = WSClienti.getId(conn, user.getGroup(), iIdStruttura, user.getMobile());
      if(iIdCliente == 0) {
        logger.debug("WSOnLine.history(" + iIdStruttura + ")[" + sUserName + "] -> [] (iIdCliente=" + iIdCliente + ",iIdGru=" + iIdGru + ")");
        return new ArrayList<Prenotazione>(0);
      }
      
      Prenotazione filter = new Prenotazione();
      filter.setIdFar(iIdStruttura);
      filter.setIdCliente(iIdCliente);
      filter.setDataApp(calFrom.getTime());
      filter.setAllaData(calTo.getTime());
      
      listResult = WSPrenotazioni.find(conn, filter, false);
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSOnLine.history(" + iIdStruttura + ")[" + sUserName + "]", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
    if(listResult == null) listResult = new ArrayList<Prenotazione>(0);
    logger.debug("WSOnLine.history(" + iIdStruttura + ")[" + sUserName + "] -> [" + listResult.size() + " items]");
    return listResult;
  }
}
