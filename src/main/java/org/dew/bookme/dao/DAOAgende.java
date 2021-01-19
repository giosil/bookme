package org.dew.bookme.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;

import org.util.WMap;
import org.util.WUtil;

import org.dew.bookme.bl.Agenda;
import org.dew.bookme.bl.AgendaModello;
import org.dew.bookme.bl.User;

import org.dew.bookme.util.ConnectionManager;
import org.dew.bookme.util.DBUtil;
import org.dew.bookme.util.DataUtil;
import org.dew.bookme.util.DateSplitter;

public 
class DAOAgende 
{
  protected static Logger logger = Logger.getLogger(DAOAgende.class);
  
  protected static int iMAX_MONTHS_GEN = 18;
  
  public static
  int generateAll(Connection conn, int iIdCollaboratore, Date dDate, User user, boolean standalone)
      throws Exception 
  {
    logger.debug("DAOAgende.generateAll("  + iIdCollaboratore + "," + dDate + "," + user + ")...");
    
    int iIdGru = user != null ? user.getGroup() : 0;
    
    int iResult = 0;
    
    String sSQL = "SELECT ID_FAR,ID,INIZIO_VALIDITA ";
    sSQL += "FROM PRZ_AGENDE ";
    sSQL += "WHERE FLAG_ATTIVO=? AND (FINE_VALIDITA IS NULL OR FINE_VALIDITA >=?) ";
    if(iIdGru != 0) {
      sSQL += "AND ID_GRU=? ";
    }
    if(iIdCollaboratore != 0) {
      sSQL += "AND ID_COLLABORATORE=? ";
    }
    if(dDate != null) {
      sSQL += "AND INIZIO_VALIDITA>=? ";
    }
    sSQL += "ORDER BY ID_FAR,INIZIO_VALIDITA";
    
    Calendar calCurrDate = WUtil.getCurrentDate();
    
    int p = 0;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,  1); // FLAG_ATTIVO
      pstm.setDate(++p, new java.sql.Date(calCurrDate.getTimeInMillis()));
      if(iIdGru != 0) {
        pstm.setInt(++p,  iIdGru);
      }
      if(iIdCollaboratore != 0) {
        pstm.setInt(++p,  iIdCollaboratore);
      }
      if(dDate != null) {
        pstm.setDate(++p, new java.sql.Date(dDate.getTime()));
      }
      rs = pstm.executeQuery();
      while(rs.next()) {
        int  iIdAgenda = rs.getInt("ID");
        
        Agenda agenda = DAOAgende.read(conn, iIdAgenda);
        if(agenda == null) continue;
        
        if(dDate == null) {
          DAOAgende.generate(conn, agenda, user);
        }
        else {
          Calendar calFrom = WUtil.toCalendar(dDate, null);
          Calendar calTo   = WUtil.toCalendar(dDate, null);
          DAOAgende.generate(conn, agenda, calFrom, calTo, user);
        }
        
        if(standalone) {
          System.out.println("Commit iIdAgenda=" + iIdAgenda);
          conn.commit();
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in DAOAgende.generateAll(" + iIdCollaboratore + "," + dDate + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return iResult;
  }
  
  public static
  Agenda insert(Connection conn, int iIdCollaboratore, boolean prenOnLine, Agenda agenda, User user) 
      throws Exception 
  {
    logger.debug("DAOAgende.insert("  + iIdCollaboratore + "," + prenOnLine + "," + agenda + "," + user + ")...");
    
    if(agenda == null) return agenda;
    
    if(agenda.getIdFar() == 0) {
      int iIdFar = DBUtil.readInt(conn, "SELECT ID_FAR FROM PRZ_COLLABORATORI WHERE ID=?", iIdCollaboratore);
      agenda.setIdFar(iIdFar);
    }
    
    List<AgendaModello> fasceOrarie = agenda.getFasceOrarie();
    if(fasceOrarie == null || fasceOrarie.size() == 0) {
      return agenda;
    }
    
    String sDescrizione = agenda.getDescrizione();
    if(sDescrizione == null || sDescrizione.length() == 0) {
      agenda.setDescrizione("PIANO");
    }
    agenda.setIdCollaboratore(iIdCollaboratore);
    
    boolean boSettimaneAlterne = false;
    StringBuffer sbGiorni = new StringBuffer("NNNNNNN");
    for(int i = 0; i < fasceOrarie.size(); i++) {
      AgendaModello modello = fasceOrarie.get(i);
      
      if(!modello.isSettDispari() && !modello.isSettPari()) {
        modello.setSettDispari(true);
        modello.setSettPari(true);
      }
      
      int iGiorno = modello.getGiorno();
      if(iGiorno == 0 || iGiorno > 7) continue;
      int iOraInizio = modello.getOraInizio();
      if(iOraInizio < 0 || iOraInizio > 2359) continue;
      int iOraFine = modello.getOraFine();
      if(iOraFine < 0 || iOraFine > 2359) continue;
      if(iOraFine <= iOraInizio) continue;
      
      if(modello.isSettPari() && !modello.isSettDispari()) {
        boSettimaneAlterne = true;
      }
      if(!modello.isSettPari() && modello.isSettDispari()) {
        boSettimaneAlterne = true;
      }
      
      if(!modello.isAttivo()) continue;
      
      sbGiorni.setCharAt(iGiorno-1, 'S');
    }
    agenda.setGiorni(sbGiorni.toString());
    agenda.setSettimaneAlt(boSettimaneAlterne);
    
    String sSQL_A = "INSERT INTO PRZ_AGENDE(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,ID_FAR,ID_COLLABORATORE,DESCRIZIONE,GIORNI,SETTIMANE_ALT,INIZIO_VALIDITA,FINE_VALIDITA) ";
    sSQL_A += "VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";
    
    String sSQL_M = "INSERT INTO PRZ_AGENDE_MODELLI(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_AGENDA,SETTIMANA_PARI,SETTIMANA_DISP,GIORNO,PROGRESSIVO,ORAINIZIO,ORAFINE,TIPOLOGIA,VALORE,PREN_ONLINE) ";
    sSQL_M += "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    int iId = 0;
    
    int p = 0;
    PreparedStatement pstmA = null;
    PreparedStatement pstmM = null;
    try {
      pstmA = conn.prepareStatement(sSQL_A);
      pstmM = conn.prepareStatement(sSQL_M);
      
      iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_AGENDE");
      
      pstmA.setInt(++p,    iId);
      pstmA.setInt(++p,    user != null ? user.getId() : 0);
      pstmA.setDate(++p,   new java.sql.Date(System.currentTimeMillis()));
      pstmA.setInt(++p,    1);
      pstmA.setInt(++p,    user != null ? user.getGroup() : 0);
      pstmA.setInt(++p,    agenda.getIdFar());
      pstmA.setInt(++p,    iIdCollaboratore);
      pstmA.setString(++p, agenda.getDescrizione());
      pstmA.setString(++p, agenda.getGiorni());
      pstmA.setInt(++p,    boSettimaneAlterne ? 1 : 0);
      pstmA.setDate(++p,   WUtil.toSQLDate(agenda.getInizioValidita(), WUtil.getCurrentDate()));
      pstmA.setDate(++p,   WUtil.toSQLDate(agenda.getFineValidita(),   null));
      pstmA.executeUpdate();
      
      // Set Id Agenda
      agenda.setId(iId);
      
      Map<Integer,Integer> mapGiorniProg = new HashMap<>();
      for(int i = 0; i < fasceOrarie.size(); i++) {
        AgendaModello modello = fasceOrarie.get(i);
        
        if(!modello.isSettDispari() && !modello.isSettPari()) {
          modello.setSettDispari(true);
          modello.setSettPari(true);
        }
        
        int iGiorno = modello.getGiorno();
        if(iGiorno == 0 || iGiorno > 7) continue;
        int iOraInizio = modello.getOraInizio();
        if(iOraInizio < 0 || iOraInizio > 2359) continue;
        int iOraFine = modello.getOraFine();
        if(iOraFine < 0 || iOraFine > 2359) continue;
        if(iOraFine <= iOraInizio) continue;
        
        String sTipologia = modello.getTipologia();
        if(sTipologia == null || sTipologia.length() == 0) {
          sTipologia = "O";
          modello.setTipologia(sTipologia);
        }
        if(sTipologia.equals("O")) {
          modello.setValore(DataUtil.diffMinutes(iOraFine, iOraInizio));
        }
        
        int iProgressivo = WUtil.toInt(mapGiorniProg.get(iGiorno), 0);
        iProgressivo++;
        mapGiorniProg.put(iGiorno, iProgressivo);
        
        int iIdAgendaModello = ConnectionManager.nextVal(conn, "SEQ_PRZ_AGENDE_MODELLI");
        
        p = 0;
        pstmM.setInt(++p,    iIdAgendaModello);
        pstmM.setInt(++p,    user != null ? user.getId() : 0);
        pstmM.setDate(++p,   new java.sql.Date(System.currentTimeMillis()));
        pstmM.setInt(++p,    modello.isAttivo() ? 1 : 0);
        pstmM.setInt(++p,    iId);
        pstmM.setInt(++p,    modello.isSettPari()    ? 1 : 0);
        pstmM.setInt(++p,    modello.isSettDispari() ? 1 : 0);
        pstmM.setInt(++p,    iGiorno);
        pstmM.setInt(++p,    iProgressivo);
        pstmM.setInt(++p,    iOraInizio);
        pstmM.setInt(++p,    iOraFine);
        pstmM.setString(++p, sTipologia);
        pstmM.setInt(++p,    modello.getValore());
        pstmM.setInt(++p,    prenOnLine ? 1 : 0);
        pstmM.executeUpdate();
        
        // Set Id AgendaModello
        modello.setId(iIdAgendaModello);
        modello.setProgressivo(iProgressivo);
        modello.setPrenOnLine(prenOnLine);
      }
    }
    finally {
      ConnectionManager.close(pstmA, pstmM);
    }
    return agenda;
  }
  
  public static
  boolean delete(Connection conn, int iIdAgenda)
      throws Exception
  {
    logger.debug("DAOAgende.delete("  + iIdAgenda + ")...");
    
    if(iIdAgenda == 0) {
      logger.debug("DAOAgende.delete("  + iIdAgenda + ") -> false");
      return false;
    }
    
    DBUtil.execUpd(conn, "UPDATE PRZ_PRENOTAZIONI SET STATO='F' WHERE ID_AGENDA=? AND STATO<>'A' AND STATO<>'N' AND FLAG_ATTIVO=1 AND DATA_APPUNTAMENTO>=?", iIdAgenda, WUtil.getCurrentDate());
    
    DBUtil.execUpd(conn, "DELETE FROM PRZ_CALENDARIO WHERE ID_AGENDA=?", iIdAgenda);
    
    DBUtil.execUpd(conn, "DELETE FROM PRZ_AGENDE_MODELLI WHERE ID_AGENDA=?", iIdAgenda);
    
    DBUtil.execUpd(conn, "DELETE FROM PRZ_AGENDE WHERE ID=?", iIdAgenda);
    
    return true;
  }
  
  public static
  boolean disable(Connection conn, int iIdAgenda)
      throws Exception
  {
    logger.debug("DAOAgende.disable("  + iIdAgenda + ")...");
    
    if(iIdAgenda == 0) {
      logger.debug("DAOAgende.disable("  + iIdAgenda + ") -> false");
      return false;
    }
    
    DBUtil.execUpd(conn, "UPDATE PRZ_AGENDE SET FLAG_ATTIVO=0 WHERE ID=?", iIdAgenda);
    
    return true;
  }
  
  public static
  boolean deleteCurrentPlan(Connection conn, int iIdColl) 
      throws Exception 
  {
    logger.debug("DAOAgende.deleteCurrentPlan("  + iIdColl + ")...");
    
    String sSQL_A = "SELECT ID FROM PRZ_AGENDE ";
    sSQL_A += "WHERE FLAG_ATTIVO=1 AND ID_COLLABORATORE=? AND INIZIO_VALIDITA<=? AND FINE_VALIDITA IS NULL ";
    sSQL_A += "ORDER BY INIZIO_VALIDITA DESC,ID DESC";
    
    int iIdAgenda = DBUtil.readInt(conn, sSQL_A, iIdColl, WUtil.getCurrentDate());
    
    boolean boResult = false;
    if(iIdAgenda != 0) {
      boResult = delete(conn, iIdAgenda);
    }
    
    logger.debug("DAOAgende.deleteCurrentPlan("  + iIdColl + ") -> " + boResult);
    return boResult;
  }
  
  public static
  Agenda readCurrent(Connection conn, int iIdColl, Object oDate)
      throws Exception
  {
    logger.debug("DAOAgende.readCurrent("  + iIdColl + "," + oDate + ")...");
    
    java.sql.Date dDate = null;
    if(oDate != null) {
      dDate = WUtil.toSQLDate(oDate, null);
    }
    if(dDate == null) {
      Calendar calCurrDate = WUtil.getCurrentDate();
      dDate = new java.sql.Date(calCurrDate.getTimeInMillis());
    }
    
    String sSQL_A = "SELECT ID FROM PRZ_AGENDE ";
    sSQL_A += "WHERE FLAG_ATTIVO=1 AND ID_COLLABORATORE=? AND INIZIO_VALIDITA<=? AND FINE_VALIDITA>=? ";
    sSQL_A += "ORDER BY INIZIO_VALIDITA DESC,ID DESC";
    
    int iIdAgenda = DBUtil.readInt(conn, sSQL_A, iIdColl, dDate, dDate);
    if(iIdAgenda == 0) {
      sSQL_A = "SELECT ID FROM PRZ_AGENDE ";
      sSQL_A += "WHERE FLAG_ATTIVO=1 AND ID_COLLABORATORE=? AND INIZIO_VALIDITA<=? AND FINE_VALIDITA IS NULL ";
      sSQL_A += "ORDER BY INIZIO_VALIDITA DESC,ID DESC";
      
      iIdAgenda = DBUtil.readInt(conn, sSQL_A, iIdColl, dDate);
    }
    
    if(iIdAgenda == 0) {
      logger.debug("DAOAgende.deleteCurrentPlan("  + iIdColl + ") -> null");
      return null;
    }
    
    logger.debug("DAOAgende.deleteCurrentPlan("  + iIdColl + ") -> read(conn, " + iIdAgenda+ ")");
    return read(conn, iIdAgenda);
  }
  
  public static
  Agenda readCurrentPlan(Connection conn, int iIdColl)
      throws Exception
  {
    logger.debug("DAOAgende.readCurrentPlan("  + iIdColl + ")...");
    
    Calendar calCurrDate = WUtil.getCurrentDate();
    java.sql.Date dDate = new java.sql.Date(calCurrDate.getTimeInMillis());
    
    String sSQL_A = "SELECT ID,INIZIO_VALIDITA FROM PRZ_AGENDE ";
    sSQL_A += "WHERE FLAG_ATTIVO=1 AND ID_COLLABORATORE=? AND INIZIO_VALIDITA<=? AND FINE_VALIDITA IS NULL ";
    sSQL_A += "ORDER BY INIZIO_VALIDITA DESC,ID DESC";
    int iIdAgenda = DBUtil.readInt(conn, sSQL_A, iIdColl, dDate);
    
    if(iIdAgenda == 0) {
      logger.debug("DAOAgende.readCurrentPlan("  + iIdColl + ") -> null");
      return null;
    }
    
    logger.debug("DAOAgende.readCurrentPlan("  + iIdColl + ") -> read(conn, " + iIdAgenda + ")");
    return read(conn, iIdAgenda);
  }
  
  public static
  Agenda read(Connection conn, int iIdAgenda)
      throws Exception
  {
    logger.debug("DAOAgende.read("  + iIdAgenda + ")...");
    
    Agenda result = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      String sSQL_A = "SELECT ID,ID_FAR,ID_COLLABORATORE,GIORNI,SETTIMANE_ALT,DESCRIZIONE,INIZIO_VALIDITA,FINE_VALIDITA FROM PRZ_AGENDE WHERE ID=?";
      
      String sSQL_AM = "SELECT ID,SETTIMANA_PARI,SETTIMANA_DISP,GIORNO,PROGRESSIVO,ORAINIZIO,ORAFINE,TIPOLOGIA,VALORE,PREN_ONLINE,FLAG_ATTIVO ";
      sSQL_AM += "FROM PRZ_AGENDE_MODELLI ";
      sSQL_AM += "WHERE ID_AGENDA=? ";
      sSQL_AM += "ORDER BY GIORNO,PROGRESSIVO ";
      
      pstm = conn.prepareStatement(sSQL_A);
      pstm.setInt(1,  iIdAgenda);
      rs = pstm.executeQuery();
      if(rs.next()) {
        int iIdAge       = rs.getInt("ID");
        int iIdFar       = rs.getInt("ID_FAR");
        int iIdCollab    = rs.getInt("ID_COLLABORATORE");
        String sGiorni   = rs.getString("GIORNI");
        int iFlagSettAlt = rs.getInt("SETTIMANE_ALT");
        String sDesAge   = rs.getString("DESCRIZIONE");
        Date dInizioVal  = rs.getDate("INIZIO_VALIDITA");
        Date dFineVal    = rs.getDate("FINE_VALIDITA");
        
        result = new Agenda(iIdAge, sDesAge, sGiorni, iFlagSettAlt != 0);
        result.setIdFar(iIdFar);
        result.setIdCollaboratore(iIdCollab);
        if(dInizioVal != null) {
          result.setInizioValidita(new java.util.Date(dInizioVal.getTime()));
        }
        if(dFineVal != null) {
          result.setFineValidita(new java.util.Date(dFineVal.getTime()));
        }
      }
      
      if(result != null) {
        List<AgendaModello> listFasceOrarie = new ArrayList<AgendaModello>();
        result.setFasceOrarie(listFasceOrarie);
        
        // FASCE ORARIE
        ConnectionManager.close(rs, pstm);
        pstm = conn.prepareStatement(sSQL_AM);
        pstm.setInt(1, result.getId());
        rs = pstm.executeQuery();
        while(rs.next()) {
          int iIdModello    = rs.getInt("ID");
          int iFlagSettPari = rs.getInt("SETTIMANA_PARI");
          int iFlagSettDisp = rs.getInt("SETTIMANA_DISP");
          int iGiorno       = rs.getInt("GIORNO");
          int iProgressivo  = rs.getInt("PROGRESSIVO");
          int iOraInizio    = rs.getInt("ORAINIZIO");
          int iOraFine      = rs.getInt("ORAFINE");
          String sTipologia = rs.getString("TIPOLOGIA");
          int iValore       = rs.getInt("VALORE");
          int iPrenOnLine   = rs.getInt("PREN_ONLINE");
          int iFlagAttivo   = rs.getInt("FLAG_ATTIVO");
          
          AgendaModello am = new AgendaModello(iIdModello, iGiorno, iProgressivo, iOraInizio, iOraFine, sTipologia, iValore);
          am.setIdFar(result.getIdFar());
          am.setSettPari(iFlagSettPari != 0);
          am.setSettDispari(iFlagSettDisp != 0);
          am.setPrenOnLine(iPrenOnLine != 0);
          am.setAttivo(iFlagAttivo != 0);
          
          listFasceOrarie.add(am);
        }
      }
      
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return result;
  }
  
  public static
  int lock(Connection conn, int iIdColl, Object oDate, User user)
      throws Exception
  {
    logger.debug("DAOAgende.lock("  + iIdColl + "," + WUtil.formatDate(oDate, "-") + "," + user + ")...");
    
    if(iIdColl == 0) return 0;
    java.sql.Date dDate = WUtil.toSQLDate(oDate, null);
    if(dDate  == null) return 0;
    
    return DBUtil.execUpd(conn, "UPDATE PRZ_CALENDARIO SET FLAG_ATTIVO=1 WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO=? AND FLAG_ATTIVO=?", iIdColl, dDate, 1);
  }
  
  public static
  int lock(Connection conn, int iIdColl, Object oDate, int iOra, User user)
      throws Exception
  {
    logger.debug("DAOAgende.lock("  + iIdColl + "," + WUtil.formatDate(oDate, "-") + "," + iOra + "," + user + ")...");
    
    if(iIdColl == 0) return 0;
    java.sql.Date dDate = WUtil.toSQLDate(oDate, null);
    if(dDate  == null) return 0;
    
    return DBUtil.execUpd(conn, "UPDATE PRZ_CALENDARIO SET FLAG_ATTIVO=1 WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO=? AND ORAINIZIO<=? AND ORAFINE>? AND FLAG_ATTIVO=?", iIdColl, dDate, iOra, iOra, 1);
  }
  
  public static
  int rebuild(Connection conn, int iIdColl, Object oDate, User user)
      throws Exception
  {
    logger.debug("DAOAgende.rebuild("  + iIdColl + "," + WUtil.formatDate(oDate, "-") + "," + user + ")...");
    
    if(iIdColl == 0) return 0;
    java.sql.Date dDate = WUtil.toSQLDate(oDate, null);
    if(dDate  == null) return 0;
    
    int iResult = 0;
    PreparedStatement pstmS = null;
    PreparedStatement pstmP = null;
    PreparedStatement pstmU = null;
    PreparedStatement pstmA = null;
    ResultSet rsS = null;
    ResultSet rsP = null;
    ResultSet rsA = null;
    try {
      String sSQL_S = "SELECT ID,ID_AGENDA,ID_AGENDA_MODELLO,GIORNO,PROGRESSIVO,ORAINIZIO,ORAFINE,TIPOLOGIA ";
      sSQL_S += "FROM PRZ_CALENDARIO ";
      //                                1                     2                 3
      sSQL_S += "WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO=? AND FLAG_ATTIVO=?";
      pstmS = conn.prepareStatement(sSQL_S);
      
      pstmS.setInt(1,  iIdColl);
      pstmS.setDate(2, dDate);
      pstmS.setInt(3,  1); // FLAG_ATTIVO
      rsS = pstmS.executeQuery();
      while(rsS.next()) {
        int iIdCalendario    = rsS.getInt("ID");
        int iIdAgendaModello = rsS.getInt("ID_AGENDA_MODELLO");
        int iGiorno          = rsS.getInt("GIORNO");
        int iProgressivo     = rsS.getInt("PROGRESSIVO");
        int iOraInizio       = rsS.getInt("ORAINIZIO");
        int iOraFine         = rsS.getInt("ORAFINE");
        String sTipologia    = rsS.getString("TIPOLOGIA");
        int iPosti           = 0;
        
        if(sTipologia != null && sTipologia.equals("P")) {
          if(pstmA == null) {
            pstmA = conn.prepareStatement("SELECT VALORE FROM PRZ_AGENDE_MODELLI WHERE ID=? AND GIORNO=? AND PROGRESSIVO=?");
          }
          pstmA.setInt(1, iIdAgendaModello);
          pstmA.setInt(2, iGiorno);
          pstmA.setInt(3, iProgressivo);
          rsA = pstmA.executeQuery();
          if(rsA.next()) {
            iPosti = rsA.getInt("VALORE");
          }
          rsA.close();
        }
        
        StringBuffer sbModello = buildModello(iOraInizio, iOraFine);
        
        if(pstmP == null) {
          String sSQL_P = "SELECT ORA_APPUNTAMENTO,DURATA ";
          sSQL_P += "FROM PRZ_PRENOTAZIONI ";
          //                                1                       2                 3            4
          sSQL_P += "WHERE ID_COLLABORATORE=? AND DATA_APPUNTAMENTO=? AND FLAG_ATTIVO=? AND STATO<>?";
          pstmP = conn.prepareStatement(sSQL_P);
        }
        pstmP.setInt(1,    iIdColl);
        pstmP.setDate(2,   dDate);
        pstmP.setInt(3,    1); // FLAG_ATTIVO
        pstmP.setString(4, "A");
        rsP = pstmP.executeQuery();
        while(rsP.next()) {
          int iOraApp = rsP.getInt("ORA_APPUNTAMENTO");
          int iDurata = rsP.getInt("DURATA");
          
          if(iOraApp >= iOraInizio && iOraApp < iOraFine) {
            DataUtil.reserve(sbModello, iOraApp, iDurata, false);
            iPosti--;
          }
        }
        rsP.close();
        
        int iMinuti  = DataUtil.getDisponibili(sbModello);
        int iMaxCons = DataUtil.getMaxConsecutivi(sbModello);
        if(iPosti < 0) iPosti = 0;
        
        // SET
        if(pstmU == null) {
          pstmU = conn.prepareStatement("UPDATE PRZ_CALENDARIO SET MODELLO=?,MINUTI=?,POSTI=?,MAX_CONSECUTIVI=? WHERE ID=?");
        }
        pstmU.setString(1, sbModello.toString());
        pstmU.setInt(2, iMinuti);
        pstmU.setInt(3, iPosti);
        pstmU.setInt(4, iMaxCons);
        // WHERE
        pstmU.setInt(5, iIdCalendario);
        pstmU.executeUpdate();
        iResult++;
      }
    }
    finally {
      ConnectionManager.close(rsS, pstmS, rsP, pstmP, rsA, pstmA, pstmU);
    }
    return iResult;
  }
  
  public static
  int rebuild(Connection conn, int iIdColl, Object oDate, int iOra, User user)
      throws Exception
  {
    logger.debug("DAOAgende.rebuild("  + iIdColl + "," + WUtil.formatDate(oDate, "-") + "," + iOra + "," + user + ")...");
    
    if(iIdColl == 0) return 0;
    java.sql.Date dDate = WUtil.toSQLDate(oDate, null);
    if(dDate  == null) return 0;
    
    int iResult = 0;
    PreparedStatement pstmS = null;
    PreparedStatement pstmP = null;
    PreparedStatement pstmU = null;
    PreparedStatement pstmA = null;
    ResultSet rsS = null;
    ResultSet rsP = null;
    ResultSet rsA = null;
    try {
      String sSQL_S = "SELECT ID,ID_AGENDA,ID_AGENDA_MODELLO,GIORNO,PROGRESSIVO,ORAINIZIO,ORAFINE,TIPOLOGIA ";
      sSQL_S += "FROM PRZ_CALENDARIO ";
      //                                1                     2                3             4                 5
      sSQL_S += "WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO=? AND ORAINIZIO<=? AND ORAFINE>? AND FLAG_ATTIVO=?";
      pstmS = conn.prepareStatement(sSQL_S);
      
      pstmS.setInt(1,  iIdColl);
      pstmS.setDate(2, dDate);
      pstmS.setInt(3,  iOra);
      pstmS.setInt(4,  iOra);
      pstmS.setInt(5,  1); // FLAG_ATTIVO
      rsS = pstmS.executeQuery();
      while(rsS.next()) {
        int iIdCalendario    = rsS.getInt("ID");
        int iIdAgendaModello = rsS.getInt("ID_AGENDA_MODELLO");
        int iGiorno          = rsS.getInt("GIORNO");
        int iProgressivo     = rsS.getInt("PROGRESSIVO");
        int iOraInizio       = rsS.getInt("ORAINIZIO");
        int iOraFine         = rsS.getInt("ORAFINE");
        String sTipologia    = rsS.getString("TIPOLOGIA");
        int iPosti           = 0;
        
        if(sTipologia != null && sTipologia.equals("P")) {
          if(pstmA == null) {
            pstmA = conn.prepareStatement("SELECT VALORE FROM PRZ_AGENDE_MODELLI WHERE ID=? AND GIORNO=? AND PROGRESSIVO=?");
          }
          pstmA.setInt(1, iIdAgendaModello);
          pstmA.setInt(2, iGiorno);
          pstmA.setInt(3, iProgressivo);
          rsA = pstmA.executeQuery();
          if(rsA.next()) {
            iPosti = rsA.getInt("VALORE");
          }
          rsA.close();
        }
        
        StringBuffer sbModello = buildModello(iOraInizio, iOraFine);
        
        if(pstmP == null) {
          String sSQL_P = "SELECT ORA_APPUNTAMENTO,DURATA ";
          sSQL_P += "FROM PRZ_PRENOTAZIONI ";
          //                                1                       2                 3            4
          sSQL_P += "WHERE ID_COLLABORATORE=? AND DATA_APPUNTAMENTO=? AND FLAG_ATTIVO=? AND STATO<>?";
          pstmP = conn.prepareStatement(sSQL_P);
        }
        pstmP.setInt(1,    iIdColl);
        pstmP.setDate(2,   dDate);
        pstmP.setInt(3,    1); // FLAG_ATTIVO
        pstmP.setString(4, "A");
        rsP = pstmP.executeQuery();
        while(rsP.next()) {
          int iOraApp = rsP.getInt("ORA_APPUNTAMENTO");
          int iDurata = rsP.getInt("DURATA");
          
          if(iOraApp >= iOraInizio && iOraApp < iOraFine) {
            DataUtil.reserve(sbModello, iOraApp, iDurata, false);
            iPosti--;
          }
        }
        rsP.close();
        
        int iMinuti  = DataUtil.getDisponibili(sbModello);
        int iMaxCons = DataUtil.getMaxConsecutivi(sbModello);
        if(iPosti < 0) iPosti = 0;
        
        // SET
        if(pstmU == null) {
          pstmU = conn.prepareStatement("UPDATE PRZ_CALENDARIO SET MODELLO=?,MINUTI=?,POSTI=?,MAX_CONSECUTIVI=? WHERE ID=?");
        }
        pstmU.setString(1, sbModello.toString());
        pstmU.setInt(2, iMinuti);
        pstmU.setInt(3, iPosti);
        pstmU.setInt(4, iMaxCons);
        // WHERE
        pstmU.setInt(5, iIdCalendario);
        pstmU.executeUpdate();
        iResult++;
      }
    }
    finally {
      ConnectionManager.close(rsS, pstmS, rsP, pstmP, rsA, pstmA, pstmU);
    }
    return iResult;
  }
  
  public static
  int generate(Connection conn, int iIdColl, Object oDate, User user)
      throws Exception
  {
    logger.debug("DAOAgende.generate("  + iIdColl + "," + WUtil.formatDate(oDate, "-") + "," + user + ")...");
    
    if(iIdColl == 0) return 0;
    Date dDate = WUtil.toDate(oDate, null);
    if(dDate  == null) return 0;
    
    Agenda agenda = readCurrent(conn, iIdColl, oDate);
    
    int iIdFar = 0;
    if(agenda != null) {
      iIdFar = agenda.getIdFar();
    }
    if(iIdFar == 0) {
      iIdFar = DBUtil.readInt(conn, "SELECT ID_FAR FROM PRZ_COLLABORATORI WHERE ID=?", iIdColl);
    }
    
    // Lettura Variazioni
    String sSQL_V = "SELECT ID_FAR,DATA_CALENDARIO,GIORNO,PROGRESSIVO,ORAINIZIO,ORAFINE,TIPOLOGIA,VALORE,PREN_ONLINE,STATO ";
    sSQL_V += "FROM PRZ_CALENDARIO_VARIAZ ";
    sSQL_V += "WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO=? ";
    sSQL_V += "ORDER BY DATA_CALENDARIO,GIORNO,PROGRESSIVO";
    List<Map<String,Object>> listVar = DBUtil.readList(conn, sSQL_V, iIdColl, dDate);
    
    Set<Integer> setOfDataVar = DataUtil.getSetOfInteger(listVar, "DATA_CALENDARIO");
    if(setOfDataVar == null) setOfDataVar = new HashSet<Integer>(0);
    
    // Cancellazione calendario precedente
    String sSQL_D = "DELETE FROM PRZ_CALENDARIO WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO=?";
    DBUtil.execUpd(conn, sSQL_D, iIdColl, oDate);
    
    // Costruzione SQL UPDATE PRZ_PRENOTAZIONI e INSERT INTO PRZ_CALENDARIO
    String sSQL_U = "UPDATE PRZ_PRENOTAZIONI SET ID_AGENDA=?,ID_AGENDA_MODELLO=?,PROGRESSIVO=?,STATO=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID";
    
    String sSQL_I = "INSERT INTO PRZ_CALENDARIO";
    sSQL_I += "(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,ID_FAR,ID_COLLABORATORE,ID_AGENDA,ID_AGENDA_MODELLO,DATA_CALENDARIO,GIORNO,PROGRESSIVO,ORAINIZIO,ORAFINE,TIPOLOGIA,MODELLO,MINUTI,POSTI,MAX_CONSECUTIVI,PREN_ONLINE,STATO,FLAG_VARIAZIONE)";
    sSQL_I += "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    
    int iResult = 0;
    int p = 0;
    Date currentDate = new Date();
    PreparedStatement pstmI = null;
    PreparedStatement pstmC = null;
    ResultSet rsC = null;
    try {
      pstmI = conn.prepareStatement(sSQL_I);
      //                                                                                 1                      2                3
      pstmC = conn.prepareStatement("SELECT ID FROM PRZ_CALENDARIO_CHIUSURE WHERE ID_FAR=? AND (DATA_CALENDARIO=? OR MESE_GIORNO=?) AND FLAG_ATTIVO=1");
      
      // Generazione calendario
      DateSplitter ds = new DateSplitter();
      ds.setInterval(dDate, dDate);
      ds.setDaysWeek("SSSSSSS"); // Si generano tutti i giorni (in assenza di fasce si cercano le variazioni)
      ds.split();
      while(ds.hasNext()) {
        int iDataCalendario = ds.next();
        
        java.sql.Date dDataCalendario = WUtil.toSQLDate(iDataCalendario, null);
        if(dDataCalendario == null) continue;
        
        // Controllo chiusura 
        int iIdChiusura = 0;
        pstmC.setInt(1,  iIdFar);
        pstmC.setDate(2, dDataCalendario);
        pstmC.setInt(3,  iDataCalendario % 10000);
        rsC = pstmC.executeQuery();
        if(rsC.next()) iIdChiusura = rsC.getInt("ID");
        rsC.close();
        
        if(iIdChiusura != 0) {
          logger.debug("DAOAgende.generate("  + iIdColl + "," + WUtil.formatDate(oDate, "-") + "," + user + ") cal=" + iDataCalendario + ",chius=" + iIdChiusura);
          continue;
        }
        
        int iWeekNum = DateSplitter.getWeek2020(iDataCalendario);
        int iGiorno  = DateSplitter.getDayOfWeek(iDataCalendario);
        int iFlagVar = 0;
        
        List<AgendaModello> listFasceOrarie = null;
        if(setOfDataVar.contains(iDataCalendario)) {
          // Fasce orarie prese dalle variazioni
          listFasceOrarie = toListOfAgendaModello(listVar, iDataCalendario);
          iFlagVar = 1;
        }
        else {
          // Controllo festivita'
          if(DataUtil.isHoliday(iDataCalendario)) continue;
          
          // Fasce orarie prese dall'agenda
          if(agenda != null) {
            listFasceOrarie = agenda.filterFasceOrarie(iGiorno);
          }
          else {
            listFasceOrarie = new ArrayList<>();
          }
        }
        
        if(listFasceOrarie == null || listFasceOrarie.size() == 0) {
          continue;
        }
        
        // Lettura prenotazioni
        List<Map<String,Object>> listPren = DBUtil.readList(conn, "SELECT ID,ORA_APPUNTAMENTO,DURATA,STATO,OVERBOOKING FROM PRZ_PRENOTAZIONI WHERE ID_COLLABORATORE=? AND DATA_APPUNTAMENTO=? AND STATO<>'A' ORDER BY OVERBOOKING,ID", iIdColl, dDataCalendario);
        if(listPren == null) listPren = new ArrayList<Map<String,Object>>(0);
        
        // Insieme degli id relativi a prenotazioni ricollocabili (C=Confermate, F=Fuori uscite)
        Set<Integer> setOfIdPren = new HashSet<Integer>();
        for(int k = 0; k < listPren.size(); k++) {
          WMap wmPren = new WMap(listPren.get(k));
          String sStato         = wmPren.getUpperString("STATO", "C");
          if("C".equals(sStato) || "F".equals(sStato)) setOfIdPren.add(wmPren.getInt("ID"));
        }
        
        if(listFasceOrarie == null || listFasceOrarie.size() == 0) {
          // Non vi sono fasce orarie nella giornata pertanto si aggiornano tutte le prenotazioni
          if(setOfIdPren != null && setOfIdPren.size() > 0) {
            DBUtil.execUpd(conn, sSQL_U + " IN (" + DBUtil.buildInSet(setOfIdPren) + ")", 0, 0, 0, "F", iIdUte, currentDate);
            iResult += setOfIdPren.size();
          }
          continue;
        }
        
        for(int i = 0; i < listFasceOrarie.size(); i++) {
          AgendaModello am = listFasceOrarie.get(i);
          
          if(!am.isSettDispari() && ((iWeekNum % 2) == 1)) {
            continue;
          }
          if(!am.isSettPari() && ((iWeekNum % 2) == 0)) {
            continue;
          }
          if(am.getIdFar() == 0) {
            am.setIdFar(iIdFar);
          }
          
          // Controlli
          int minuti  = 0;
          int posti   = 0;
          int maxCons = 0;
          String tipologia = am.getTipologia();
          if(tipologia == null || tipologia.length() == 0) tipologia = "O";
          tipologia = tipologia.toUpperCase();
          if(tipologia.equals("O")) {
            minuti = am.getValore();
            if(minuti < 1) minuti = DataUtil.diffMinutes(am.getOraFine(), am.getOraInizio());
            maxCons = minuti;
          }
          else {
            posti = am.getValore();
            maxCons = posti;
          }
          
          // Occupazione prenotazioni
          int iOraInizio = am.getOraInizio();
          int iOraFine   = am.getOraFine();
          StringBuffer sbModello = buildModello(iOraInizio, iOraFine);
          for(int j = 0; j < listPren.size(); j++) {
            WMap wmPren = new WMap(listPren.get(j));
            int iIdPren = wmPren.getInt("ID");
            int iOraApp = wmPren.getInt("ORA_APPUNTAMENTO");
            int iDurata = wmPren.getInt("DURATA");
            String sPSt = wmPren.getUpperString("STATO");
            if(iOraApp >= iOraInizio && iOraApp < iOraFine) {
              setOfIdPren.remove(iIdPren);
              if(DataUtil.isAvailable(sbModello, iOraApp, iDurata)) {
                // Prenotazione ricollocata
                if("F".equals(sPSt)) sPSt = "C";
                //                                                                                                                                   =?
                DBUtil.execUpd(conn, sSQL_U + "=?", agenda != null ? agenda.getId() : 0, am.getId(), am.getProgressivo(), sPSt, iIdUte, currentDate, iIdPren);
              }
              else {
                // Prenotazione Fuori uscita
                if("C".equals(sPSt)) sPSt = "F";
                //                                                                                                                                   =?
                DBUtil.execUpd(conn, sSQL_U + "=?", agenda != null ? agenda.getId() : 0, am.getId(), am.getProgressivo(), sPSt, iIdUte, currentDate, iIdPren);
              }
              // Indipendentemente dalla disponibilita' si riserva lo spazio richiesto dalla prenotazione
              posti = posti - 1;
              DataUtil.reserve(sbModello, iOraApp, iDurata, false);
            }
          }
          
          String sStato = am.getStato();
          if(sStato == null || sStato.length() == 0) sStato = "S";
          
          minuti  = DataUtil.getDisponibili(sbModello);
          maxCons = DataUtil.getMaxConsecutivi(sbModello);
          if(posti < 0) posti = 0;
          
          int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_CALENDARIO");
          
          p = 0;
          pstmI.setInt(++p,    iId);
          pstmI.setInt(++p,    iIdUte);
          pstmI.setDate(++p,   new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
          pstmI.setInt(++p,    1); // FLAG_ATTIVO
          pstmI.setInt(++p,    iIdGru);
          pstmI.setInt(++p,    am.getIdFar());
          pstmI.setInt(++p,    iIdColl);
          pstmI.setInt(++p,    am.getIdAgenda());
          pstmI.setInt(++p,    am.getId());
          pstmI.setDate(++p,   dDataCalendario);
          pstmI.setInt(++p,    iGiorno);
          pstmI.setInt(++p,    am.getProgressivo());
          pstmI.setInt(++p,    am.getOraInizio());
          pstmI.setInt(++p,    am.getOraFine());
          pstmI.setString(++p, am.getTipologia());
          pstmI.setString(++p, sbModello.toString());
          pstmI.setInt(++p,    minuti);
          pstmI.setInt(++p,    posti);
          pstmI.setInt(++p,    maxCons);
          pstmI.setInt(++p,    am.isPrenOnLine() ? 1 : 0);
          pstmI.setString(++p, sStato);
          pstmI.setInt(++p,    iFlagVar);
          pstmI.executeUpdate();
        }
        
        // Al termine della generazione della data calendario si aggiornano le prenotazioni rimanenti
        if(setOfIdPren != null && setOfIdPren.size() > 0) {
          DBUtil.execUpd(conn, sSQL_U + " IN (" + DBUtil.buildInSet(setOfIdPren) + ")", 0, 0, 0, "F", iIdUte, currentDate);
          iResult += setOfIdPren.size();
        }
      }
    }
    finally {
      ConnectionManager.close(rsC, pstmI, pstmC);
    }
    // Si restituisce il numero di prenotazioni NON ricollocate
    return iResult;
  }
  
  public static
  int generate(Connection conn, Agenda agenda, User user)
      throws Exception
  {
    if(agenda == null || agenda.getId() == 0) return 0;
    
    logger.debug("DAOAgende.generate(conn, " + agenda + ", " + user + ")...");
    
    Calendar calFrom = WUtil.toCalendar(agenda.getInizioValidita(), null);
    if(calFrom == null) calFrom = WUtil.getCurrentDate();
    Calendar calTo = WUtil.toCalendar(agenda.getFineValidita(), null);
    if(calTo != null) {
      // Nel caso l'agenda abbia inizio e fine validita si genera nell'intervallo specificato
      return generate(conn, agenda, calFrom, calTo, user);
    }
    
    int iAgeId = agenda.getId();
    int iAgeInizioValidita = WUtil.toIntDate(calFrom, 0);
    
    boolean boStopGenerate = false;
    int iResult = 0;
    // ... altrimenti si genera nei periodi eventualmente interrotti da altre agende
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      String sSQL = "SELECT ID,INIZIO_VALIDITA,FINE_VALIDITA ";
      sSQL += "FROM PRZ_AGENDE ";
      //                              1                       2                   3                  4
      sSQL += "WHERE ID_COLLABORATORE=? AND (INIZIO_VALIDITA>=? OR FINE_VALIDITA>=?) AND FLAG_ATTIVO=? ";
      sSQL += "ORDER BY INIZIO_VALIDITA,ID";
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(1,  agenda.getIdCollaboratore());
      pstm.setDate(2, new java.sql.Date(calFrom.getTimeInMillis()));
      pstm.setDate(3, new java.sql.Date(calFrom.getTimeInMillis()));
      pstm.setInt(4,  1);
      rs = pstm.executeQuery();
      while(rs.next()) {
        int  iId             = rs.getInt("ID");
        Date dInizioValidita = rs.getDate("INIZIO_VALIDITA");
        Date dFineValidita   = rs.getDate("FINE_VALIDITA");
        
        if(iId == iAgeId) continue;
        if(dInizioValidita == null) continue;
        
        // Nel caso si stia generando in un periodo gia' coperto da un altro piano (variazione)
        // la generazione parte dopo l'eventuale fine validita' della variazione.
        int iInizioValidita = WUtil.toIntDate(dInizioValidita, 0);
        int iFineValidita   = WUtil.toIntDate(dFineValidita,   99991231);
        if(iInizioValidita <= iAgeInizioValidita && iFineValidita >= iAgeInizioValidita) {
          if(dFineValidita != null) {
            calFrom.setTimeInMillis(dFineValidita.getTime());
            calFrom.add(Calendar.DATE, 1);
            
            calTo = null;
            // si salta la generazione lasciando quella in essere
            continue;
          }
          else {
            boStopGenerate = true;
            break;
          }
        }
        
        calTo = Calendar.getInstance();
        calTo.setTimeInMillis(dInizioValidita.getTime());
        calTo.add(Calendar.DATE, -1);
        
        iResult += generate(conn, agenda, calFrom, calTo, user);
        
        if(dFineValidita != null) {
          calFrom.setTimeInMillis(dFineValidita.getTime());
          calFrom.add(Calendar.DATE, 1);
          
          calTo = null;
        }
        else {
          boStopGenerate = true;
          break;
        }
      }
      rs.close();
      pstm.close();
      
      // Infine si genera il piano...
      if(!boStopGenerate) {
        if(calTo == null) {
          calTo = Calendar.getInstance();
          calTo.setTimeInMillis(calFrom.getTimeInMillis());
          calTo.add(Calendar.MONTH, iMAX_MONTHS_GEN);
          iResult += generate(conn, agenda, calFrom, calTo, user);
        }
      }
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return iResult;
  }
  
  private static
  int generate(Connection conn, Agenda agenda, Object oFrom, Object oTo, User user)
      throws Exception
  {
    logger.debug("DAOAgende.generate("  + agenda + "," + WUtil.formatDate(oFrom, "-") + "," + WUtil.formatDate(oTo, "-") + "," + user + ")...");
    
    if(agenda == null) return 0;
    Date dFrom = WUtil.toDate(oFrom, null);
    Date dTo   = WUtil.toDate(oTo, null);
    if(dFrom  == null) return 0;
    if(dTo == null) {
      Calendar calTo = Calendar.getInstance();
      calTo.setTimeInMillis(dFrom.getTime());
      calTo.add(Calendar.MONTH, iMAX_MONTHS_GEN);
      dTo = calTo.getTime();
    }
    
    int iIdColl = agenda.getIdCollaboratore();
    if(iIdColl == 0) return 0;
    
    int iIdFar = 0;
    if(agenda != null) {
      iIdFar = agenda.getIdFar();
    }
    if(iIdFar == 0) {
      iIdFar = DBUtil.readInt(conn, "SELECT ID_FAR FROM PRZ_COLLABORATORI WHERE ID=?", iIdColl);
    }
    
    // Lettura Variazioni
    String sSQL_V = "SELECT DATA_CALENDARIO,GIORNO,PROGRESSIVO,ORAINIZIO,ORAFINE,TIPOLOGIA,VALORE,PREN_ONLINE,STATO ";
    sSQL_V += "FROM PRZ_CALENDARIO_VARIAZ ";
    sSQL_V += "WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO>=? AND DATA_CALENDARIO<=? ";
    sSQL_V += "ORDER BY DATA_CALENDARIO,GIORNO,PROGRESSIVO";
    List<Map<String,Object>> listVar = DBUtil.readList(conn, sSQL_V, iIdColl, dFrom, dTo);
    
    Set<Integer> setOfDataVar = DataUtil.getSetOfInteger(listVar, "DATA_CALENDARIO");
    if(setOfDataVar == null) setOfDataVar = new HashSet<Integer>(0);
    
    // Cancellazione calendario precedente
    String sSQL_D = "DELETE FROM PRZ_CALENDARIO WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO>=? AND DATA_CALENDARIO<=?";
    DBUtil.execUpd(conn, sSQL_D, iIdColl, dFrom, dTo);
    
    // Costruzione SQL UPDATE PRZ_PRENOTAZIONI e INSERT INTO PRZ_CALENDARIO
    String sSQL_U = "UPDATE PRZ_PRENOTAZIONI SET ID_AGENDA=?,ID_AGENDA_MODELLO=?,PROGRESSIVO=?,STATO=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID";
    
    String sSQL_I = "INSERT INTO PRZ_CALENDARIO";
    sSQL_I += "(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,ID_FAR,ID_COLLABORATORE,ID_AGENDA,ID_AGENDA_MODELLO,DATA_CALENDARIO,GIORNO,PROGRESSIVO,ORAINIZIO,ORAFINE,TIPOLOGIA,MODELLO,MINUTI,POSTI,MAX_CONSECUTIVI,PREN_ONLINE,STATO,FLAG_VARIAZIONE)";
    sSQL_I += "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    
    int iResult = 0;
    int p = 0;
    Date currentDate = new Date();
    PreparedStatement pstmI = null;
    PreparedStatement pstmC = null;
    ResultSet rsC = null;
    try {
      pstmI = conn.prepareStatement(sSQL_I);
      //                                                                                 1                      2                3
      pstmC = conn.prepareStatement("SELECT ID FROM PRZ_CALENDARIO_CHIUSURE WHERE ID_FAR=? AND (DATA_CALENDARIO=? OR MESE_GIORNO=?) AND FLAG_ATTIVO=1");
      
      // Generazione calendario
      DateSplitter ds = new DateSplitter();
      ds.setInterval(dFrom, dTo);
      ds.setDaysWeek("SSSSSSS"); // Si generano tutti i giorni (in assenza di fasce si cercano le variazioni)
      ds.split();
      while(ds.hasNext()) {
        int iDataCalendario = ds.next();
        
        java.sql.Date dDataCalendario = WUtil.toSQLDate(iDataCalendario, null);
        if(dDataCalendario == null) continue;
        
        // Controllo chiusura 
        int iIdChiusura = 0;
        pstmC.setInt(1,  agenda.getIdFar());
        pstmC.setDate(2, dDataCalendario);
        pstmC.setInt(3,  iDataCalendario % 10000);
        rsC = pstmC.executeQuery();
        if(rsC.next()) iIdChiusura = rsC.getInt("ID");
        rsC.close();
        
        if(iIdChiusura != 0) {
          logger.debug("DAOAgende.generate("  + agenda + "," + WUtil.formatDate(oFrom, "-") + "," + WUtil.formatDate(oTo, "-") + "," + user + ") data=" + iDataCalendario + ",chius.=" + iIdChiusura);
          continue;
        }
        
        int iWeekNum = DateSplitter.getWeek2020(iDataCalendario);
        int iGiorno  = DateSplitter.getDayOfWeek(iDataCalendario);
        int iFlagVar = 0;
        
        List<AgendaModello> listFasceOrarie = null;
        if(setOfDataVar.contains(iDataCalendario)) {
          // Fasce orarie prese dalle variazioni
          listFasceOrarie = toListOfAgendaModello(listVar, iDataCalendario);
          iFlagVar = 1;
        }
        else {
          // Controllo festivita'
          if(DataUtil.isHoliday(iDataCalendario)) continue;
          
          // Fasce orarie prese dall'agenda
          listFasceOrarie = agenda.filterFasceOrarie(iGiorno);
        }
        
        if(listFasceOrarie == null || listFasceOrarie.size() == 0) {
          continue;
        }
        
        // Lettura prenotazioni
        List<Map<String,Object>> listPren = DBUtil.readList(conn, "SELECT ID,ORA_APPUNTAMENTO,DURATA,STATO,OVERBOOKING FROM PRZ_PRENOTAZIONI WHERE ID_COLLABORATORE=? AND DATA_APPUNTAMENTO=? AND STATO<>'A' AND FLAG_ATTIVO=1 ORDER BY OVERBOOKING,ID", iIdColl, dDataCalendario);
        if(listPren == null) listPren = new ArrayList<Map<String,Object>>(0);
        
        // Insieme degli id relativi a prenotazioni ricollocabili (C=Confermate, F=Fuori uscite)
        Set<Integer> setOfIdPren = new HashSet<Integer>();
        for(int k = 0; k < listPren.size(); k++) {
          WMap wmPren = new WMap(listPren.get(k));
          String sStato = wmPren.getUpperString("STATO", "C");
          if("C".equals(sStato) || "F".equals(sStato)) setOfIdPren.add(wmPren.getInt("ID"));
        }
        
        if(listFasceOrarie == null || listFasceOrarie.size() == 0) {
          // Non vi sono fasce orarie nella giornata pertanto si aggiornano tutte le prenotazioni
          if(setOfIdPren != null && setOfIdPren.size() > 0) {
            DBUtil.execUpd(conn, sSQL_U + " IN (" + DBUtil.buildInSet(setOfIdPren) + ")", 0, 0, 0, "F", iIdUte, currentDate);
            iResult += setOfIdPren.size();
          }
          continue;
        }
        
        for(int i = 0; i < listFasceOrarie.size(); i++) {
          AgendaModello am = listFasceOrarie.get(i);
          
          if(!am.isSettDispari() && ((iWeekNum % 2) == 1)) {
            continue;
          }
          if(!am.isSettPari() && ((iWeekNum % 2) == 0)) {
            continue;
          }
          
          // Controlli
          int minuti  = 0;
          int posti   = 0;
          int maxCons = 0;
          String tipologia = am.getTipologia();
          if(tipologia == null || tipologia.length() == 0) tipologia = "O";
          tipologia = tipologia.toUpperCase();
          if(tipologia.equals("O")) {
            minuti = am.getValore();
            if(minuti < 1) minuti = DataUtil.diffMinutes(am.getOraFine(), am.getOraInizio());
            maxCons = minuti;
          }
          else {
            posti = am.getValore();
            maxCons = posti;
          }
          
          // Occupazione prenotazioni
          int iOraInizio = am.getOraInizio();
          int iOraFine   = am.getOraFine();
          StringBuffer sbModello = buildModello(iOraInizio, iOraFine);
          for(int j = 0; j < listPren.size(); j++) {
            WMap wmPren = new WMap(listPren.get(j));
            int iIdPren = wmPren.getInt("ID");
            int iOraApp = wmPren.getInt("ORA_APPUNTAMENTO");
            int iDurata = wmPren.getInt("DURATA");
            String sPSt = wmPren.getUpperString("STATO");
            if(iOraApp >= iOraInizio && iOraApp < iOraFine) {
              setOfIdPren.remove(iIdPren);
              if(DataUtil.isAvailable(sbModello, iOraApp, iDurata)) {
                // Prenotazione ricollocata
                if("F".equals(sPSt)) sPSt = "C";
                //                                                                                                              =?
                DBUtil.execUpd(conn, sSQL_U + "=?", agenda.getId(), am.getId(), am.getProgressivo(), sPSt, iIdUte, currentDate, iIdPren);
              }
              else {
                // Prenotazione Fuori uscita
                if("C".equals(sPSt)) sPSt = "F";
                //                                                                                                              =?
                DBUtil.execUpd(conn, sSQL_U + "=?", agenda.getId(), am.getId(), am.getProgressivo(), sPSt, iIdUte, currentDate, iIdPren);
              }
              // Indipendentemente dalla disponibilita' si riserva lo spazio richiesto dalla prenotazione
              posti = posti - 1;
              DataUtil.reserve(sbModello, iOraApp, iDurata, false);
            }
          }
          
          minuti  = DataUtil.getDisponibili(sbModello);
          maxCons = DataUtil.getMaxConsecutivi(sbModello);
          if(posti < 0) posti = 0;
          
          String sStato = am.getStato();
          if(sStato == null || sStato.length() == 0) sStato = "S";
          
          int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_CALENDARIO");
          
          p = 0;
          pstmI.setInt(++p,    iId);
          pstmI.setInt(++p,    iIdUte);
          pstmI.setDate(++p,   new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
          pstmI.setInt(++p,    1); // FLAG_ATTIVO
          pstmI.setInt(++p,    iIdGru);
          pstmI.setInt(++p,    agenda.getIdFar());
          pstmI.setInt(++p,    iIdColl);
          pstmI.setInt(++p,    agenda.getId());
          pstmI.setInt(++p,    am.getId());
          pstmI.setDate(++p,   dDataCalendario);
          pstmI.setInt(++p,    iGiorno);
          pstmI.setInt(++p,    am.getProgressivo());
          pstmI.setInt(++p,    am.getOraInizio());
          pstmI.setInt(++p,    am.getOraFine());
          pstmI.setString(++p, am.getTipologia());
          pstmI.setString(++p, sbModello.toString());
          pstmI.setInt(++p,    minuti);
          pstmI.setInt(++p,    posti);
          pstmI.setInt(++p,    maxCons);
          pstmI.setInt(++p,    am.isPrenOnLine() ? 1 : 0);
          pstmI.setString(++p, sStato);
          pstmI.setInt(++p,    iFlagVar);
          pstmI.executeUpdate();
        }
        
        // Al termine della generazione della data calendario si aggiornano le prenotazioni rimanenti
        if(setOfIdPren != null && setOfIdPren.size() > 0) {
          DBUtil.execUpd(conn, sSQL_U + " IN (" + DBUtil.buildInSet(setOfIdPren) + ")", 0, 0, 0, "F", iIdUte, currentDate);
          iResult += setOfIdPren.size();
        }
      }
    }
    finally {
      ConnectionManager.close(rsC, pstmI, pstmC);
    }
    // Si restituisce il numero di prenotazioni NON ricollocate
    return iResult;
  }
  
  private static
  List<AgendaModello> toListOfAgendaModello(List<Map<String,Object>> listData, int iDataCalendario)
  {
    if(listData == null || listData.size() == 0) {
      return new ArrayList<AgendaModello>(0);
    }
    
    List<AgendaModello> listResult = new ArrayList<AgendaModello>();
    for(int i = 0; i<  listData.size(); i++) {
      WMap wmItem = new WMap(listData.get(i));
      
      int iVarDataCalendario = wmItem.getInt("DATA_CALENDARIO");
      if(iVarDataCalendario != iDataCalendario) continue;
      
      // Puo' essere zero se i record provengono da PRZ_CALENDARIO_VARIAZ
      int iId = wmItem.getInt("ID_AGENDA_MODELLO");
      int iIdFar = wmItem.getInt("ID_FAR");
      int iGiorno = wmItem.getInt("GIORNO");
      if(iGiorno < 1 || iGiorno > 7) continue;
      int iProgressivo = wmItem.getInt("PROGRESSIVO");
      int iOraInizio = wmItem.getInt("ORAINIZIO");
      if(iOraInizio < 0 || iOraInizio > 2359) continue;
      int iOraFine = wmItem.getInt("ORAFINE");
      if(iOraFine < 0 || iOraFine > 2359) continue;
      if(iOraFine <= iOraInizio) continue;
      String sTipologia = wmItem.getUpperString("TIPOLOGIA");
      if(sTipologia == null || sTipologia.length() == 0) sTipologia = "O";
      int iValore = wmItem.getInt("VALORE");
      if(sTipologia.equals("O") && iValore < 1) {
        iValore = DataUtil.diffMinutes(iOraFine, iOraInizio);
      }
      boolean prenOnLine = wmItem.getBoolean("PREN_ONLINE");
      String sStato = wmItem.getUpperString("STATO");
      if(sStato == null || sStato.length() != 1) sStato = "C";
      
      AgendaModello am = new AgendaModello(iId, iGiorno, iProgressivo, iOraInizio, iOraFine, sTipologia, iValore);
      am.setIdFar(iIdFar);
      am.setPrenOnLine(prenOnLine);
      am.setStato(sStato);
      am.setSettDispari(true);
      am.setSettPari(true);
      am.setAttivo(true);
      
      listResult.add(am);
    }
    return listResult;
  }
  
  private static
  StringBuffer buildModello(int iOraInizio, int iOraFine)
  {
    int iHourBegin   = iOraInizio / 100;
    int iMinuteBegin = iOraInizio % 100;
    int iHourEnd     = iOraFine / 100;
    int iMinuteEnd   = iOraFine % 100;
    
    int iLenLeft     = (iHourBegin * 60 + iMinuteBegin);
    int iLenCenter   = ((iHourEnd - iHourBegin) * 60 + (iMinuteEnd - iMinuteBegin));
    int iLenRight    = 1440 - (iLenCenter + iLenLeft);
    
    String sLeft     = buildSegmento('0', iLenLeft);
    String sCenter   = buildSegmento('1', iLenCenter);
    String sRight    = buildSegmento('0', iLenRight);
    
    return new StringBuffer(sLeft + sCenter + sRight);
  }
  
  private static
  String buildSegmento(char c, int n)
  {
    StringBuilder sb = new StringBuilder(n);
    for(int i = 0; i < n; i++) sb.append(c);
    return sb.toString();
  }
}
