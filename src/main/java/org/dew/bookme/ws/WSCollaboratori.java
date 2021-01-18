package org.dew.bookme.ws;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.UserTransaction;

import org.apache.log4j.Logger;

import org.util.WUtil;

import org.dew.bookme.bl.Agenda;
import org.dew.bookme.bl.Collaboratore;
import org.dew.bookme.bl.Prestazione;
import org.dew.bookme.bl.User;

import org.dew.bookme.dao.DAOAgende;

import org.dew.bookme.util.ConnectionManager;
import org.dew.bookme.util.DBUtil;
import org.dew.bookme.util.DateSplitter;
import org.dew.bookme.util.WSContext;

public 
class WSCollaboratori 
{
  protected static Logger logger = Logger.getLogger(WSCollaboratori.class);
  
  public static
  List<Collaboratore> getAll(int iIdFar)
      throws Exception
  {
    List<Collaboratore> listResult = new ArrayList<Collaboratore>();
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "SELECT ID,NOME ";
    sSQL += "FROM PRZ_COLLABORATORI ";
    sSQL += "WHERE ID_GRU=? AND ID_FAR=? AND FLAG_ATTIVO=? AND VISIBILE=? ";
    sSQL += "ORDER BY NOME";
    
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
      pstm.setInt(++p, 1); // VISIBILE
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId   = rs.getInt("ID");
        String sNome = rs.getString("NOME");
        
        Collaboratore collaboratore = new Collaboratore(iId, sNome);
        
        listResult.add(collaboratore);
        if(listResult.size() > 2000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCollaboratori.getAll(" + iIdFar + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<Collaboratore> getAll(int iIdFar, boolean boOnlyVisible)
      throws Exception
  {
    List<Collaboratore> listResult = new ArrayList<Collaboratore>();
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "SELECT ID,NOME,VISIBILE ";
    sSQL += "FROM PRZ_COLLABORATORI ";
    sSQL += "WHERE ID_GRU=? AND ID_FAR=? AND FLAG_ATTIVO=? ";
    if(boOnlyVisible) {
      sSQL += "AND VISIBILE=? ";
    }
    sSQL += "ORDER BY NOME";
    
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
      if(boOnlyVisible) {
        pstm.setInt(++p, 1); // VISIBILE
      }
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId   = rs.getInt("ID");
        String sNome = rs.getString("NOME");
        int iFlgVis  = rs.getInt("VISIBILE");
        
        if(iFlgVis == 0) sNome += " *";
        
        Collaboratore collaboratore = new Collaboratore(iId, sNome);
        
        listResult.add(collaboratore);
        if(listResult.size() > 2000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCollaboratori.getAll(" + iIdFar + "," + boOnlyVisible + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  int getIdFar(Connection conn, int iIdCollaboratore)
      throws Exception
  {
    int iResult = 0;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement("SELECT ID_FAR FROM PRZ_COLLABORATORI WHERE ID=?");
      pstm.setInt(1, iIdCollaboratore);
      rs = pstm.executeQuery();
      if(rs.next()) iResult = rs.getInt("ID_FAR");
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCollaboratori.getIdFar(conn, " + iIdCollaboratore + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return iResult;
  }
  
  public static
  String getName(Connection conn, int iIdCollaboratore)
      throws Exception
  {
    String sResult = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement("SELECT NOME FROM PRZ_COLLABORATORI WHERE ID=?");
      pstm.setInt(1, iIdCollaboratore);
      rs = pstm.executeQuery();
      if(rs.next()) sResult = rs.getString("NOME");
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCollaboratori.getName(conn, " + iIdCollaboratore + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    if(sResult == null || sResult.length() == 0) {
      sResult = "[" + iIdCollaboratore + "]";
    }
    return sResult;
  }
  
  public static
  List<Agenda> addAssenze(int iIdColl, java.util.Date dal, java.util.Date al)
      throws Exception
  {
    return addAssenze(iIdColl, dal, al, null);
  }
  
  public static
  List<Agenda> addAssenze(int iIdColl, java.util.Date dal, java.util.Date al, String sUserDesk)
      throws Exception
  {
    logger.debug("WSCollaboratori.addAssenze(" + iIdColl + "," + WUtil.formatDate(dal, "-") + "," + WUtil.formatDate(al, "-") + "," + sUserDesk + ")...");
    
    List<Agenda> listResult = new ArrayList<Agenda>();
    
    if(iIdColl == 0 || dal == null || al == null) return listResult;
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL_Ins = "INSERT INTO PRZ_CALENDARIO_VARIAZ(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,ID_FAR,ID_COLLABORATORE,DATA_CALENDARIO,GIORNO,PROGRESSIVO,ORAINIZIO,ORAFINE,TIPOLOGIA,VALORE,PREN_ONLINE,STATO)";
    sSQL_Ins += "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstmI = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      int iIdFar = DBUtil.readInt(conn, "SELECT ID_FAR FROM PRZ_COLLABORATORI WHERE ID=?", iIdColl);
      
      DBUtil.execUpd(conn, "DELETE FROM PRZ_CALENDARIO_VARIAZ WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO>=? AND DATA_CALENDARIO<=?", iIdColl, dal, al);
      
      String sNome  = DBUtil.readString(conn, "SELECT NOME FROM PRZ_COLLABORATORI WHERE ID=?", iIdColl);
      
      pstmI = conn.prepareStatement(sSQL_Ins);
      
      // Generazione calendario
      DateSplitter ds = new DateSplitter();
      ds.setInterval(dal, al);
      ds.setDaysWeek("SSSSSSS"); // Si scorrono tutti i giorni
      ds.split();
      while(ds.hasNext()) {
        int iDataCalendario = ds.next();
        
        java.sql.Date dDataCalendario = WUtil.toSQLDate(iDataCalendario, null);
        if(dDataCalendario == null) continue;
        
        int iGiorno  = DateSplitter.getDayOfWeek(iDataCalendario);
        
        int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_CALENDARIO_VARIAZ");
        
        int p = 0;
        pstmI.setInt(++p,    iId);
        pstmI.setInt(++p,    iIdUte);
        pstmI.setDate(++p,   new java.sql.Date(System.currentTimeMillis()));
        pstmI.setInt(++p,    1); // FLAG_ATTIVO
        pstmI.setInt(++p,    iIdGru);
        pstmI.setInt(++p,    iIdFar);
        pstmI.setInt(++p,    iIdColl);
        pstmI.setDate(++p,   dDataCalendario);
        pstmI.setInt(++p,    iGiorno);
        pstmI.setInt(++p,    1);       // PROGRESSIVO
        pstmI.setInt(++p,    800);     // ORAINIZIO
        pstmI.setInt(++p,    2200);    // ORAFINE
        pstmI.setString(++p, "O");     // TIPOLOGIA 
        pstmI.setInt(++p,    14 * 60); // VALORE
        pstmI.setInt(++p,    0);       // PREN_ONLINE
        pstmI.setString(++p, "N");     // STATO
        pstmI.executeUpdate();
        
        DAOAgende.generate(conn, iIdColl, dDataCalendario, user);
        
        Agenda variazione = new Agenda();
        variazione.setId(iId * -1);
        variazione.setDescrizione("Variazione giornaliera");
        variazione.setInizioValidita(dDataCalendario);
        variazione.setFineValidita(dDataCalendario);
        
        listResult.add(variazione);
        
        WSLogOperazioni.insert(conn, "V.Assenza", sUserDesk, iIdFar, dDataCalendario, sNome);
      }
      
      ut.commit();
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCollaboratori.addAssenze(" + iIdColl + "," + WUtil.formatDate(dal, "-") + "," + WUtil.formatDate(al, "-") + "," + sUserDesk + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(pstmI, conn);
    }
    return listResult;
  }
  
  public static
  List<Collaboratore> find(Collaboratore filter)
      throws Exception
  {
    List<Collaboratore> listResult = new ArrayList<Collaboratore>();
    
    if(filter == null) filter = new Collaboratore();
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    int iIdFar = filter.getIdFar();
    if(iIdFar == 0) return listResult;
    
    int iFId      = filter.getId();
    String sFNome = WUtil.toUpperString(filter.getNome(), null);
    
    String sSQL = "SELECT ID,NOME,COLORE,ORDINE,PREN_ONLINE,VISIBILE ";
    sSQL += "FROM PRZ_COLLABORATORI ";
    sSQL += "WHERE ID_GRU=? AND ID_FAR=? AND FLAG_ATTIVO=? ";
    if(iFId != 0) {
      sSQL += "AND ID=? ";
    }
    if(sFNome != null && sFNome.length() > 0) {
      sSQL += "AND UPPER(NOME) LIKE ? ";
    }
    sSQL += "ORDER BY NOME";
    
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
      if(iFId != 0) {
        pstm.setInt(++p, iFId);
      }
      if(sFNome != null && sFNome.length() > 0) {
        pstm.setString(++p, sFNome + "%");
      }
      
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId         = rs.getInt("ID");
        String sNome       = rs.getString("NOME");
        String sColore     = rs.getString("COLORE");
        int    iOrdine     = rs.getInt("ORDINE");
        int    iPrenOnLine = rs.getInt("PREN_ONLINE");
        int    iVisibile   = rs.getInt("VISIBILE");
        
        Collaboratore record = new Collaboratore();
        record.setId(iId);
        record.setNome(sNome);
        record.setColore(sColore);
        record.setOrdine(iOrdine);
        record.setPrenOnLine(iPrenOnLine != 0);
        record.setVisibile(iVisibile != 0);
        
        listResult.add(record);
        if(listResult.size() > 1000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCollaboratori.find", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  Agenda readAgenda(int iId)
      throws Exception
  {
    Connection conn = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      return DAOAgende.read(conn, iId);
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCollaboratori.readAgenda(" + iId + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
  }
  
  public static
  Collaboratore read(int iId)
      throws Exception
  {
    Collaboratore result = null;
    
    if(iId == 0) return result;
    
    String sSQL = "SELECT ID,ID_FAR,NOME,COLORE,PREN_ONLINE,ORDINE,VISIBILE FROM PRZ_COLLABORATORI WHERE ID=?";
    
    // Prestazioni
    String sSQL_P = "SELECT P.ID,P.ID_GRUPPO_PRE,PG.DESCRIZIONE DESC_GRU,P.DESCRIZIONE ";
    sSQL_P += "FROM PRZ_COLLABORATORI_PRE CP,PRZ_PRESTAZIONI P,PRZ_PRESTAZIONI_GRUPPI PG ";
    sSQL_P += "WHERE CP.ID_PRESTAZIONE=P.ID AND P.ID_GRUPPO_PRE=PG.ID AND CP.FLAG_ATTIVO=1 AND CP.ID_COLLABORATORE=? ";
    sSQL_P += "ORDER BY P.ID_GRUPPO_PRE,P.DESCRIZIONE ";
    
    // Piani futuri (variazioni rispetto al piano corrente)
    String sSQL_F = "SELECT ID,GIORNI,SETTIMANE_ALT,DESCRIZIONE,INIZIO_VALIDITA,FINE_VALIDITA ";
    sSQL_F += "FROM PRZ_AGENDE ";
    sSQL_F += "WHERE ID_COLLABORATORE=? AND FLAG_ATTIVO=1 AND (INIZIO_VALIDITA>? OR FINE_VALIDITA>=?)";
    sSQL_F += "ORDER BY INIZIO_VALIDITA";
    
    // Variazioni giornaliere
    String sSQL_V = "SELECT DATA_CALENDARIO ";
    sSQL_V += "FROM PRZ_CALENDARIO_VARIAZ ";
    sSQL_V += "WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO>=? ";
    sSQL_V += "GROUP BY DATA_CALENDARIO ";
    sSQL_V += "ORDER BY DATA_CALENDARIO ";
    
    int iIdFar = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      // DATI ANAGRAFICI
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(1, iId);
      rs = pstm.executeQuery();
      if(rs.next()) {
        iIdFar             = rs.getInt("ID_FAR");
        String sNome       = rs.getString("NOME");
        String sColore     = rs.getString("COLORE");
        int    iPrenOnLine = rs.getInt("PREN_ONLINE");
        int    iOrdine     = rs.getInt("ORDINE");
        int    iVisibile   = rs.getInt("VISIBILE");
        
        result = new Collaboratore();
        result.setId(iId);
        result.setNome(sNome);
        result.setColore(sColore);
        result.setOrdine(iOrdine);
        result.setPrenOnLine(iPrenOnLine != 0);
        result.setVisibile(iVisibile != 0);
      }
      
      if(result == null) return null;
      if(iIdFar != 0) {
        result.setCkUserDesk(WSStrutture.readCheckUserDesk(conn, iIdFar));
      }
      
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
      
      // AGENDA
      Agenda agenda = DAOAgende.readCurrentPlan(conn, iId);
      if(agenda != null) {
        result.setAgenda(agenda);
      }
      
      List<Agenda> listVariazioni = new ArrayList<Agenda>();
      result.setVariazioni(listVariazioni);
      
      // PIANI FUTURI
      ConnectionManager.close(rs, pstm);
      pstm = conn.prepareStatement(sSQL_F);
      pstm.setInt(1,  iId);
      pstm.setDate(2, new java.sql.Date(WUtil.getCurrentDate().getTimeInMillis()));
      pstm.setDate(3, new java.sql.Date(WUtil.getCurrentDate().getTimeInMillis()));
      rs = pstm.executeQuery();
      while(rs.next()) {
        int iIdAge       = rs.getInt("ID");
        int iFlagSettAlt = rs.getInt("SETTIMANE_ALT");
        String sGiorni   = rs.getString("GIORNI");
        String sDesAge   = rs.getString("DESCRIZIONE");
        Date dInizioVal  = rs.getDate("INIZIO_VALIDITA");
        Date dFineVal    = rs.getDate("FINE_VALIDITA");
        
        Agenda variazione = new Agenda(iIdAge, sDesAge, sGiorni, iFlagSettAlt != 0);
        variazione.setInizioValidita(dInizioVal);
        variazione.setFineValidita(dFineVal);
        
        listVariazioni.add(variazione);
      }
      
      // VARIAZIONI
      ConnectionManager.close(rs, pstm);
      int iIdV = 0;
      pstm = conn.prepareStatement(sSQL_V);
      pstm.setInt(1,  iId);
      pstm.setDate(2, new java.sql.Date(WUtil.getCurrentDate().getTimeInMillis()));
      rs = pstm.executeQuery();
      while(rs.next()) {
        Date dDataCal  = rs.getDate("DATA_CALENDARIO");
        if(dDataCal == null) continue;
        
        // Id negativi -> Variazione giornaliera
        iIdV--;
        
        Agenda variazione = new Agenda();
        variazione.setId(iIdV);
        variazione.setDescrizione("Variazione giornaliera");
        variazione.setInizioValidita(dDataCal);
        variazione.setFineValidita(dDataCal);
        
        listVariazioni.add(variazione);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCollaboratori.read(" + iId + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return result;
  }
  
  public static
  List<Integer> getServices(int iId)
      throws Exception
  {
    if(iId == 0) return new ArrayList<Integer>(0);
    
    List<Integer> listResult = null;
    Connection conn = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      listResult = DBUtil.readListOfInteger(conn, "SELECT ID_PRESTAZIONE FROM PRZ_COLLABORATORI_PRE WHERE ID_COLLABORATORE=? AND FLAG_ATTIVO=?", iId, 1);
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCollaboratori.getServices(" + iId + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
    if(listResult == null) listResult = new ArrayList<Integer>(0);
    return listResult;
  }
  
  public 
  Collaboratore insert(Collaboratore record) 
      throws Exception 
  {
    logger.debug("WSCollaboratori.insert(" + record + ")...");
    
    if(record == null) return null;
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL_C = "INSERT INTO PRZ_COLLABORATORI(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,ID_FAR,NOME,COLORE,PREN_ONLINE,ORDINE,VISIBILE) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
    String sSQL_P = "INSERT INTO PRZ_COLLABORATORI_PRE(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_COLLABORATORE,ID_PRESTAZIONE) VALUES(?,?,?,?,?,?)";
    
    Agenda agenda = record.getAgenda();
    if(agenda != null) {
      agenda.setIdFar(record.getIdFar());
    }
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstmC = null;
    PreparedStatement pstmP = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_COLLABORATORI");
      
      pstmC = conn.prepareStatement(sSQL_C);
      pstmC.setInt(++p,       iId);
      pstmC.setInt(++p,       iIdUte);
      pstmC.setDate(++p,      new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
      pstmC.setInt(++p,       1); // FLAG_ATTIVO
      pstmC.setInt(++p,       iIdGru);
      pstmC.setInt(++p,       record.getIdFar());
      pstmC.setString(++p,    record.getNome());
      pstmC.setString(++p,    record.getColore());
      pstmC.setInt(++p,       record.isPrenOnLine() ? 1 : 0);
      pstmC.setInt(++p,       record.getOrdine());
      pstmC.setInt(++p,       record.isPrenOnLine() ? 1 : 0);
      pstmC.executeUpdate();
      
      List<Prestazione> listPrestazioni = record.getPrestazioni();
      if(listPrestazioni != null && listPrestazioni.size() > 0) {
        pstmP = conn.prepareStatement(sSQL_P);
        for(int i = 0; i < listPrestazioni.size(); i++) {
          Prestazione prestazione = listPrestazioni.get(i);
          
          if(prestazione == null) continue;
          int iIdPrest = prestazione.getId();
          if(iIdPrest == 0) continue;
          
          int iIdP = ConnectionManager.nextVal(conn, "SEQ_PRZ_COLLABORATORI_PRE");
          
          p = 0;
          pstmP.setInt(++p,  iIdP);
          pstmP.setInt(++p,  iIdUte);
          pstmP.setDate(++p, new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
          pstmP.setInt(++p,  1); // FLAG_ATTIVO
          pstmP.setInt(++p,  iId);
          pstmP.setInt(++p,  iIdPrest);
          pstmP.executeUpdate();
        }
      }
      
      Agenda agendaIns = DAOAgende.insert(conn, iId, record.isPrenOnLine(), agenda, user);
      
      DAOAgende.generate(conn, agendaIns, user);
      
      ut.commit();
      
      record.setId(iId);
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSCollaboratori.insert", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstmC, pstmP, conn);
    }
    return record;
  }
  
  public 
  int addAgenda(int iIdCollaboratore, boolean boPrenOnLine, Agenda agenda) 
      throws Exception 
  {
    return addAgenda(iIdCollaboratore, boPrenOnLine, agenda, null);
  }
  
  public 
  int addAgenda(int iIdCollaboratore, boolean boPrenOnLine, Agenda agenda, String sUserDesk) 
      throws Exception 
  {
    logger.error("WSCollaboratori.addAgenda(" + iIdCollaboratore + "," + boPrenOnLine + "," + agenda + "," + sUserDesk + ")...");
    
    if(iIdCollaboratore == 0 || agenda == null) return 0;
    
    User user  = WSContext.getUser();
    
    int iId = 0;
    
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstmC = null;
    PreparedStatement pstmP = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      int iIdAgenda = agenda.getId();
      
      if(iIdAgenda != 0) {
        DAOAgende.delete(conn, iIdAgenda);
      }
      
      Agenda result = DAOAgende.insert(conn, iIdCollaboratore, boPrenOnLine, agenda, user);
      
      if(result != null && result.getId() != 0) {
        
        DAOAgende.generate(conn, result, user);
        
        iId = result.getId();
      }
      
      int    iIdFar = WSCollaboratori.getIdFar(conn, iIdCollaboratore);
      String sNome  = DBUtil.readString(conn, "SELECT NOME FROM PRZ_COLLABORATORI WHERE ID=?", iIdCollaboratore);
      WSLogOperazioni.insert(conn, "V.Piano", sUserDesk, iIdFar, result.getInizioValidita(), sNome);
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSCollaboratori.addAgenda(" + iIdCollaboratore + "," + boPrenOnLine + "," + agenda + "," + sUserDesk + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstmC, pstmP, conn);
    }
    return iId;
  }
  
  public static
  boolean deleteAgenda(int iIdAgenda)
      throws Exception
  {
    return deleteAgenda(iIdAgenda, null);
  }
  
  public static
  boolean deleteAgenda(int iIdAgenda, String sUserDesk)
      throws Exception
  {
    logger.error("WSCollaboratori.deleteAgenda(" + iIdAgenda + "," + sUserDesk + ")...");
    
    if(iIdAgenda == 0) return false;
    
    User user  = WSContext.getUser();
    
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      int iIdColl = DBUtil.readInt(conn, "SELECT ID_COLLABORATORE FROM PRZ_AGENDE WHERE ID=?", iIdAgenda);
      
      DAOAgende.delete(conn, iIdAgenda);
      
      Agenda agenda = DAOAgende.readCurrentPlan(conn, iIdColl);
      
      if(agenda != null) {
        
        DAOAgende.generate(conn, agenda, user);
        
      }
      
      int    iIdFar = WSCollaboratori.getIdFar(conn, iIdColl);
      String sNome  = DBUtil.readString(conn, "SELECT NOME FROM PRZ_COLLABORATORI WHERE ID=?", iIdColl);
      WSLogOperazioni.insert(conn, "V.Canc.Piano", sUserDesk, iIdFar, new Date(System.currentTimeMillis()), sNome);
      
      ut.commit();
    }
    catch(Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSCalendario.deleteAgenda(" + iIdAgenda + "," + sUserDesk + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
    return true;
  }
  
  public 
  Collaboratore update(Collaboratore record) 
      throws Exception 
  {
    logger.debug("WSCollaboratori.update(" + record + ")...");
    
    if(record == null || record.getId() == 0) {
      throw new Exception("Identificativo assente");
    }
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    int iId = record.getId();
    
    String sSQL_C = "UPDATE PRZ_COLLABORATORI SET NOME=?,COLORE=?,PREN_ONLINE=?,ORDINE=?,VISIBILE=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?";
    String sSQL_P = "INSERT INTO PRZ_COLLABORATORI_PRE(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_COLLABORATORE,ID_PRESTAZIONE) VALUES(?,?,?,?,?,?)";
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstmC = null;
    PreparedStatement pstmP = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstmC = conn.prepareStatement(sSQL_C);
      // SET
      pstmC.setString(++p,    record.getNome());
      pstmC.setString(++p,    record.getColore());
      pstmC.setInt(++p,       record.isPrenOnLine() ? 1 : 0);
      pstmC.setInt(++p,       record.getOrdine());
      pstmC.setInt(++p,       record.isVisibile() ? 1 : 0);
      pstmC.setInt(++p,       iIdUte);
      pstmC.setDate(++p,      new java.sql.Date(System.currentTimeMillis())); // DATA_UPDATE
      // WHERE
      pstmC.setInt(++p,       iId);
      pstmC.executeUpdate();
      
      DBUtil.execUpd(conn, "DELETE FROM PRZ_COLLABORATORI_PRE WHERE ID_COLLABORATORE=?", iId);
      
      List<Prestazione> listPrestazioni = record.getPrestazioni();
      if(listPrestazioni != null && listPrestazioni.size() > 0) {
        pstmP = conn.prepareStatement(sSQL_P);
        
        for(int i = 0; i < listPrestazioni.size(); i++) {
          Prestazione prestazione = listPrestazioni.get(i);
          
          if(prestazione == null) continue;
          int iIdPrest = prestazione.getId();
          if(iIdPrest == 0) continue;
          
          int iIdP = ConnectionManager.nextVal(conn, "SEQ_PRZ_COLLABORATORI_PRE");
          
          p = 0;
          pstmP.setInt(++p,  iIdP);
          pstmP.setInt(++p,  iIdUte);
          pstmP.setDate(++p, new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
          pstmP.setInt(++p,  1); // FLAG_ATTIVO
          pstmP.setInt(++p,  iId);
          pstmP.setInt(++p,  iIdPrest);
          pstmP.executeUpdate();
        }
      }
      
      DAOAgende.deleteCurrentPlan(conn, iId);
      
      Agenda agenda = DAOAgende.insert(conn, iId, record.isPrenOnLine(), record.getAgenda(), user);
      
      DAOAgende.generate(conn, agenda, user);
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSCollaboratori.update(id=" + iId + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstmC, pstmP, conn);
    }
    return record;
  }
  
  public 
  boolean setVisible(int iId, boolean boVisible) 
      throws Exception 
  {
    logger.debug("WSCollaboratori.setVisible(" + iId + "," + boVisible + ")...");
    
    if(iId == 0) return false;
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    String sSQL = "UPDATE PRZ_COLLABORATORI SET VISIBILE=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?";
    
    int p = 0;
    int iResult = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      pstm = conn.prepareStatement(sSQL);
      // SET
      pstm.setInt(++p,       boVisible ? 1 : 0);
      pstm.setInt(++p,       iIdUte);
      pstm.setDate(++p,      new java.sql.Date(System.currentTimeMillis())); // DATA_UPDATE
      // WHERE
      pstm.setInt(++p,       iId);
      iResult = pstm.executeUpdate();
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSCollaboratori.setVisible", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return iResult > 0;
  }
  
  public 
  boolean delete(int iId) 
      throws Exception 
  {
    logger.debug("WSCollaboratori.delete(" + iId + ")...");
    
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
      
      pstm = conn.prepareStatement("UPDATE PRZ_COLLABORATORI SET FLAG_ATTIVO=?,ID_UTE_DELETE=?,DATA_DELETE=? WHERE ID=?");
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
      logger.error("Eccezione in WSCollaboratori.delete(" + iId + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return result;
  }
}
