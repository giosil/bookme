package org.dew.bookme.ws;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.transaction.UserTransaction;

import org.apache.log4j.Logger;
import org.json.JSON;
import org.util.WList;
import org.util.WMap;
import org.util.WUtil;

import org.dew.bookme.bl.Agenda;
import org.dew.bookme.bl.AgendaModello;
import org.dew.bookme.bl.Calendario;
import org.dew.bookme.bl.ICalendario;
import org.dew.bookme.bl.IEntity;
import org.dew.bookme.bl.Prenotazione;
import org.dew.bookme.bl.Ricerca;
import org.dew.bookme.bl.User;
import org.dew.bookme.dao.DAOAgende;

import org.dew.bookme.util.ConnectionManager;
import org.dew.bookme.util.DBUtil;
import org.dew.bookme.util.DataUtil;
import org.dew.bookme.util.DateSplitter;
import org.dew.bookme.util.WSContext;

public 
class WSCalendario implements ICalendario
{
  protected static Logger logger = Logger.getLogger(WSCalendario.class);
  
  public static
  List<Integer> getOnLineBookings(Map<String,Object> mapFilter)
      throws Exception
  {
    List<Integer> listResult = new ArrayList<Integer>();
    
    WMap wmFilter  = new WMap(mapFilter);
    Calendar cData = wmFilter.getCalendar(sDATA, System.currentTimeMillis());
    Date dDataCal  = new java.sql.Date(WUtil.setTime(cData, 0).getTimeInMillis());
    int iIdFar     = wmFilter.getInt(sID_FAR);
    int iIdCollab  = wmFilter.getInt(sID_COLLABORATORE);
    
    String sSQL = "SELECT ID FROM PRZ_PRENOTAZIONI ";
    //                    1                       2                 3            4                 5
    sSQL += "WHERE ID_FAR=? AND DATA_APPUNTAMENTO=? AND FLAG_ATTIVO=? AND STATO<>? AND PREN_ONLINE=? ";
    if(iIdCollab != 0) {
      //                            6
      sSQL += "AND ID_COLLABORATORE=? ";
    }
    sSQL += "ORDER BY ID";
    
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      if(iIdCollab != 0 && iIdFar == 0) {
        iIdFar = DBUtil.readInt(conn, "SELECT ID_FAR FROM PRZ_COLLABORATORI WHERE ID=?", iIdCollab);
      }
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(1,    iIdFar);
      pstm.setDate(2,   dDataCal);
      pstm.setInt(3,    1);   // FLAG_ATTIVO
      pstm.setString(4, "A"); // STATO <> A = Annullata
      pstm.setInt(5,    1);   // PREN_ONLINE
      if(iIdCollab != 0) {
        pstm.setInt(6, iIdCollab);
      }
      rs = pstm.executeQuery();
      while(rs.next()) {
        int iId = rs.getInt("ID");
        listResult.add(new Integer(iId));
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCalendario.getOnLineBookings", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  Map<String,Object> getPlanning(Map<String,Object> mapFilter)
      throws Exception
  {
    if(mapFilter == null || mapFilter.isEmpty()) {
      return new HashMap<String,Object>();
    }
    
    WMap wmFilter  = new WMap(mapFilter);
    Calendar cData = wmFilter.getCalendar(sDATA, System.currentTimeMillis());
    Date dDataCal  = new java.sql.Date(WUtil.setTime(cData, 0).getTimeInMillis());
    int iIdFar     = wmFilter.getInt(sID_FAR);
    int iIdCollab  = wmFilter.getInt(sID_COLLABORATORE);
    boolean boRig  = wmFilter.getBoolean(sRIGENERA, false);
    boolean boAgg  = wmFilter.getBoolean(sAGGIORNA, false);
    boolean boNOA  = wmFilter.getBoolean(sNO_APPUNTAMENTI, false);
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    Map<String,Object> mapResult = new HashMap<String,Object>();
    
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      Map<String,Object> mapConfig = WSStrutture.getConfiguration(iIdFar);
      if(mapConfig != null) {
        mapResult.putAll(mapConfig);
      }
      
      if(iIdCollab != 0 && iIdFar == 0) {
        iIdFar = DBUtil.readInt(conn, "SELECT ID_FAR FROM PRZ_COLLABORATORI WHERE ID=?", iIdCollab);
      }
      
      List<Map<String,Object>> listResources = getResources(conn, iIdGru, iIdFar, iIdCollab);
      if(boRig || boAgg) {
        if(listResources != null && listResources.size() > 0) {
          ut = ConnectionManager.getUserTransaction(conn);
          ut.begin();
          
          if(boRig) {
            for(int i = 0; i < listResources.size(); i++) {
              Map<String,Object> mapCollaboratore = listResources.get(i);
              int iIdColl = WUtil.toInt(mapCollaboratore.get(IEntity.sID), 0);
              if(iIdColl == 0) continue;
              
              DAOAgende.generate(conn, iIdColl, dDataCal, user);
            }
          }
          else if(boAgg) {
            for(int i = 0; i < listResources.size(); i++) {
              Map<String,Object> mapCollaboratore = listResources.get(i);
              int iIdColl = WUtil.toInt(mapCollaboratore.get(IEntity.sID), 0);
              if(iIdColl == 0) continue;
              
              DAOAgende.rebuild(conn, iIdColl, dDataCal, user);
            }
          }
          
          ut.commit();
          ut = null;
        }
      }
      
      Map<String,Object> mapSlots = getSlots(conn, iIdGru, iIdFar, iIdCollab, dDataCal, boNOA);
      
      mapResult.put(sDATA,         dDataCal);
      mapResult.put(sID_FAR,       iIdFar);
      mapResult.put(sRISORSE,      listResources);
      mapResult.put(sSLOTS,        mapSlots);
      if(boNOA) {
        mapResult.put(sAPPUNTAMENTI, new HashMap<String,Object>());
      }
      else {
        mapResult.put(sAPPUNTAMENTI, getAppointments(conn, iIdGru, iIdFar, iIdCollab, dDataCal, mapSlots));
      }
    }
    catch(Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSCalendario.getPlanning", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
    return mapResult;
  }
  
  public static
  Map<String,Object> getTimeTable(Map<String,Object> mapFilter)
      throws Exception
  {
    if(mapFilter == null || mapFilter.isEmpty()) {
      return new HashMap<String,Object>();
    }
    
    WMap wmFilter  = new WMap(mapFilter);
    int iIdFar     = wmFilter.getInt(sID_FAR);
    Calendar cData = wmFilter.getCalendar(sDATA, System.currentTimeMillis());
    Date dDataCal  = new java.sql.Date(WUtil.setTime(cData, 0).getTimeInMillis());
    int iIdCollab  = wmFilter.getInt(sID_COLLABORATORE);
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    Map<String,Object> mapResult = new HashMap<String,Object>();
    
    Connection conn = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      if(iIdCollab != 0 && iIdFar == 0) {
        iIdFar = DBUtil.readInt(conn, "SELECT ID_FAR FROM PRZ_COLLABORATORI WHERE ID=?", iIdCollab);
      }
      
      mapResult.put(sDATA,    dDataCal);
      mapResult.put(sID_FAR,  iIdFar);
      mapResult.put(sRISORSE, getResources(conn, iIdGru, iIdFar, iIdCollab));
      mapResult.put(sORARI,   getTimeTable(conn, iIdGru, iIdFar, iIdCollab, dDataCal));
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCalendario.getTimeTable", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
    return mapResult;
  }
  
  public static
  List<Calendario> getAvailabilities(Prenotazione prenotazione)
      throws Exception
  {
    logger.debug("WSCalendario.getAvailabilities(" + JSON.stringify(prenotazione) + ")...");
    if(prenotazione == null) return new ArrayList<Calendario>(0);
    List<Integer> listPrestazioni = prenotazione.getPrestazioni();
    if(listPrestazioni == null || listPrestazioni.isEmpty()) {
      int iIdPrest = prenotazione.getIdPrest();
      if(iIdPrest == 0) return new ArrayList<Calendario>(0);
      listPrestazioni = new ArrayList<Integer>();
      listPrestazioni.add(iIdPrest);
    }
    int iFIdFar             = prenotazione.getIdFar();
    int iFIdColl            = prenotazione.getIdColl();
    int iFIdAttr            = prenotazione.getIdAttr();
    java.util.Date dDataApp = prenotazione.getCambioData();
    java.util.Date dDataDal = prenotazione.getCambioDal();
    java.util.Date dDataAl  = prenotazione.getCambioAl();
    int iDurata             = prenotazione.getDurata();
    boolean prenOnLine      = prenotazione.isPrenOnLine();
    WList wlDurate          = new WList(prenotazione.getDurate());
    if(wlDurate.size() == 0) {
      if(listPrestazioni != null && listPrestazioni.size() == 1) {
        wlDurate.add(iDurata);
      }
    }
    int iCountPrest = listPrestazioni.size();
    int iStep = 10;
    if(iCountPrest > 3) iStep = 20;
    String preferenze = prenotazione.getPreferenze();
    
    Object from  = null;
    Object to    = null;
    if(dDataApp != null) {
      from = dDataApp;
      to   = from;
    }
    else if(dDataDal != null) {
      from = dDataDal;
    }
    else {
      from = WUtil.getCurrentDate();
    }
    
    if(dDataAl != null) {
      to = dDataAl;
    }
    
    int iTime = 0;
    // Si rimuove poiche' potrebbe dare difficolta' in fase di ricerca
    //		String sCambioOra = prenotazione.getCambioOra();
    //		if(sCambioOra != null && sCambioOra.length() > 0) {
    //			iTime = WUtil.toIntTime(sCambioOra, 0);
    //		}
    
    List<Calendario> listOfCalendario = new ArrayList<Calendario>();
    
    Connection conn = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      for(int t = 0; t < listPrestazioni.size(); t++) {
        int iIdPrest = WUtil.toInt(listPrestazioni.get(t), 0);
        if(iIdPrest == 0) continue;
        
        int iDurataPrest  = wlDurate.getInt(t, 0);
        int iMod = iDurataPrest % 10; 
        if(iMod != 0) {
          iDurataPrest += (10 - iMod);
        }
        
        if(t == 0) {
          Ricerca r0 = new Ricerca(iFIdFar, iIdPrest, iDurataPrest, from, to, iTime);
          r0.executedBy(iFIdColl, iFIdColl != 0, iFIdAttr, iFIdAttr != 0);
          if(listPrestazioni.size() == 1) {
            r0.setMaxDate(2);
            r0.setMaxColl(4);
          }
          else {
            r0.setMaxDate(listPrestazioni.size() * 2);
            r0.setMaxColl(listPrestazioni.size() * 2);
          }
          r0.setPrenOnLine(prenOnLine);
          r0.setStep(iStep);
          if(preferenze != null && preferenze.equalsIgnoreCase("M")) {
            r0.setDalleOre(400);
            r0.setAlleOre(1400);
          }
          else if(preferenze != null && preferenze.equalsIgnoreCase("P")) {
            r0.setDalleOre(1400);
            r0.setAlleOre(2350);
          }
          
          List<Calendario> listSearch = search(conn, r0, null);
          if(listSearch == null || listSearch.size() == 0) {
            return new ArrayList<Calendario>(0);
          }
          
          listOfCalendario.addAll(listSearch);
        }
        else {
          if(listOfCalendario.size() == 0) {
            return new ArrayList<Calendario>(0);
          }
          
          Iterator<Calendario> iterator = listOfCalendario.iterator();
          while(iterator.hasNext()) {
            Calendario cal = iterator.next();
            
            from  = cal.getData();
            to    = from;
            iTime = cal.getOraFine();
            
            Ricerca rN = new Ricerca(iFIdFar, iIdPrest, iDurataPrest, from, to, iTime);
            // In caso di prenOnLine=true si vincola l'appuntamento affinche' venga eseguito
            // da un unico operatore. Per questo motivo si riporta prenOnLine come secondo parametro (talColl)
            rN.executedBy(cal.getIdCollaboratore(), prenOnLine, cal.getIdAttrez(), false);
            rN.setPrenOnLine(prenOnLine);
            rN.setFirst(true);
            rN.setStep(-1);
            
            List<Calendario> listSearch = search(conn, rN, null);
            if(listSearch == null || listSearch.size() == 0) {
              iterator.remove();
            }
            else {
              Calendario calFirst = listSearch.get(0);
              cal.addAltroCollab(iIdPrest, calFirst.getNomeCollab());
              cal.setOraFine(DataUtil.addMinutes(cal.getOraFine(), calFirst.getMinuti()));
            }
          }
          
          if(listOfCalendario.size() == 0) {
            return new ArrayList<Calendario>(0);
          }
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCalendario.getAvailabilities", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
    
    // Primo collaboratore disponibile
    String sMinDateTime = null;
    int iFirstIdColl = 0;
    for(int i = 0; i < listOfCalendario.size(); i++) {
      Calendario cal = listOfCalendario.get(i);
      
      int iCalDate = WUtil.toIntDate(cal.getData(), 0);
      int iCalTime = cal.getOraInizio();
      
      String sDateTime = iCalDate + WUtil.lpad(String.valueOf(iCalTime), '0', 4);
      if(sMinDateTime == null) {
        sMinDateTime = sDateTime;
        iFirstIdColl = cal.getIdCollaboratore();
        continue;
      }
      
      if(sDateTime.compareTo(sMinDateTime) < 0) {
        sMinDateTime = sDateTime;
        iFirstIdColl = cal.getIdCollaboratore();
      }
    }
    
    // Si restituiscono le disponibilita' del primo collaboratore / data
    String sLastGroup = null;
    List<Calendario> listResult = new ArrayList<Calendario>();
    for(int i = 0; i < listOfCalendario.size(); i++) {
      Calendario cal = listOfCalendario.get(i);
      
      if(iFirstIdColl != 0 && cal.getIdCollaboratore() != iFirstIdColl) {
        continue;
      }
      
      String sGroup = cal.getIdCollaboratore() + ":" + WUtil.toIntDate(cal.getData(), 0);
      if(sLastGroup != null && !sLastGroup.equals(sGroup)) break;
      
      listResult.add(cal);
      
      sLastGroup = sGroup;
    }
    logger.debug("WSCalendario.getAvailabilities(" + JSON.stringify(prenotazione) + ") -> " + listResult);
    return listResult;
  }
  
  public static
  List<Calendario> search(Connection conn, Ricerca ricerca, List<String> listMessaggi)
      throws Exception
  {
    boolean dev = ConnectionManager.boIsOnDebug;
    
    if(dev) logger.debug("WSCalendario.search(" + ricerca + ")...");
    if(ricerca == null) {
      if(dev) logger.debug("WSCalendario.search -> 0 items (ricerca = null)");
      return new ArrayList<Calendario>(0);
    }
    int iIdPrest = ricerca.getIdPrest();
    if(iIdPrest == 0) {
      if(dev) logger.debug("WSCalendario.search -> 0 items (iIdPrest = 0)");
      return new ArrayList<Calendario>(0);
    }
    
    int iRIdFar   = ricerca.getIdFar();
    int iDurata   = ricerca.getDurata();
    Object from   = ricerca.getDal();
    Object to     = ricerca.getAl();
    int iTime     = WUtil.toIntTime(ricerca.getOra(), 0);
    int iFromTime = WUtil.toIntTime(ricerca.getDalleOre(), 0);
    int iToTime   = WUtil.toIntTime(ricerca.getAlleOre(),  0);
    boolean pol   = ricerca.isPrenOnLine();
    int iIdColl   = ricerca.getIdColl();
    boolean itc   = ricerca.isTalColl();
    int iIdAttr   = ricerca.getIdAttr();
    boolean ita   = ricerca.isTalAttr();
    int iMaxDate  = ricerca.getMaxDate();
    boolean first = ricerca.isFirst();
    if(iMaxDate < 1) iMaxDate = 1;
    if(first) iMaxDate = 1;
    int iMaxColl  = ricerca.getMaxColl();
    if(iMaxColl < 1) iMaxColl = 10;
    int iStep     = ricerca.getStep();
    if(iStep == 0) iStep = 10;
    if(iStep > 0 && iStep < 10) iStep = 10;
    
    Calendar calCurrDate = WUtil.getCurrentDate();
    int iCurrDate = WUtil.toIntDate(calCurrDate, 0);
    Date dFrom    = WUtil.toSQLDate(from, calCurrDate);
    if(dFrom == null) dFrom = new java.sql.Date(calCurrDate.getTimeInMillis());
    int iFrom     = WUtil.toIntDate(dFrom, 0);
    if(iFrom < iCurrDate) {
      dFrom = new java.sql.Date(calCurrDate.getTimeInMillis());
      iFrom = iCurrDate;
    }
    Date dTo      = WUtil.toSQLDate(to, null);
    int iTo       = WUtil.toIntDate(dTo, 0);
    Date dDateApp = null;
    if(iTo > 0 && iTo == iFrom) {
      dDateApp = new Date(dFrom.getTime());
    }
    if(iTo > 0 && iTo <= iCurrDate) {
      Calendar calTomorrow = WUtil.getCurrentDate();
      calTomorrow.add(Calendar.DATE, 1);
      dFrom = new Date(calTomorrow.getTimeInMillis());
      iFrom     = WUtil.toIntDate(dFrom, 0);
    }
    
    List<Calendario> listResult = new ArrayList<Calendario>();
    
    String sSQL_D = "SELECT C.ID,C.ID_COLLABORATORE,O.NOME,C.ID_AGENDA,C.ID_AGENDA_MODELLO,C.DATA_CALENDARIO,C.GIORNO,C.PROGRESSIVO,C.ORAINIZIO,C.MODELLO,C.TIPOLOGIA,C.MAX_CONSECUTIVI ";
    sSQL_D += "FROM PRZ_CALENDARIO C,PRZ_COLLABORATORI O ";
    sSQL_D += "WHERE C.ID_COLLABORATORE=O.ID AND C.FLAG_ATTIVO=? AND O.FLAG_ATTIVO=? AND O.VISIBILE=? AND C.STATO=? AND C.MAX_CONSECUTIVI>=? ";
    sSQL_D += "AND C.ID_COLLABORATORE=? ";
    if(dDateApp != null) {
      // Singola Data (from == to)
      sSQL_D += "AND C.DATA_CALENDARIO=? ";
    }
    else
      if(dFrom != null && dTo != null) {
        // Range (from - to)
        sSQL_D += "AND C.DATA_CALENDARIO>=? AND C.DATA_CALENDARIO<? ";
      }
      else {
        // Dal (from)
        sSQL_D += "AND C.DATA_CALENDARIO>=? ";
      }
    if(pol) {
      sSQL_D += "AND O.PREN_ONLINE=? ";
    }
    if(dDateApp != null) {
      sSQL_D += "ORDER BY C.ORAINIZIO";
    }
    else
      if(dTo != null) {
        sSQL_D += "ORDER BY C.DATA_CALENDARIO DESC,C.ORAINIZIO";
      }
      else {
        sSQL_D += "ORDER BY C.DATA_CALENDARIO,C.ORAINIZIO";
      }
    
    //                                                                         1
    String sSQL_R = "SELECT ID FROM PRZ_ATTREZZATURE_RIS WHERE ID_ATTREZZATURA=? ";
    //                          dal <= t1 < al                           dal < t2 < al                              t1 < dal && t2 > al
    //                              2                  3                    4                   5                     6                   7
    sSQL_R += "AND ((RISERVATO_DAL<=? AND RISERVATO_AL>?) OR (RISERVATO_DAL<? AND RISERVATO_AL>=?) OR (RISERVATO_DAL>=? AND RISERVATO_AL<=?)) ";
    
    String sSQL_P = "SELECT ID FROM PRZ_PRENOTAZIONI ";
    sSQL_P += "WHERE FLAG_ATTIVO=1 AND STATO<>'A' ";
    sSQL_P += "AND ID_COLLABORATORE=? AND DATAORA_INIZIO<=? AND DATAORA_FINE>?";
    
    int p = 0;
    PreparedStatement pstmD = null;
    PreparedStatement pstmR = null;
    PreparedStatement pstmP = null;
    ResultSet rsD = null;
    ResultSet rsR = null;
    ResultSet rsP = null;
    try {
      // [1] Controllo prestazione
      if(iDurata == 0) {
        iDurata = DBUtil.readInt(conn, -1, "SELECT DURATA FROM PRZ_PRESTAZIONI WHERE ID=? AND FLAG_ATTIVO=?", iIdPrest, 1);
        if(iDurata < 0) {
          if(listMessaggi != null) listMessaggi.add("Prestazione non piu' prenotabile.");
          if(dev) logger.debug("WSCalendario.search -> 0 items (iIdPrest=" + iIdPrest + " not bookable)");
          return new ArrayList<Calendario>(0);
        }
      }
      else {
        int iFlagAttivoPrest = DBUtil.readInt(conn, "SELECT FLAG_ATTIVO FROM PRZ_PRESTAZIONI WHERE ID=?", iIdPrest);
        if(iFlagAttivoPrest == 0) {
          if(listMessaggi != null) listMessaggi.add("Prestazione non piu' prenotabile.");
          if(dev) logger.debug("WSCalendario.search -> 0 items (iIdPrest=" + iIdPrest + " not bookable)");
          return new ArrayList<Calendario>(0);
        }
      }
      if(dev) logger.debug("WSCalendario.getAvailabilities [1] iIdPrest=" + iIdPrest + ",iDurata=" + iDurata);
      
      // [2] Ricerca collaboratori che eseguono la prestazione
      String sSQL_C = "SELECT C.ID FROM PRZ_COLLABORATORI C,PRZ_COLLABORATORI_PRE CP ";
      sSQL_C += "WHERE C.ID=CP.ID_COLLABORATORE AND C.FLAG_ATTIVO=1 AND C.VISIBILE=1 AND CP.FLAG_ATTIVO=1 AND CP.ID_PRESTAZIONE=?";
      if(iRIdFar != 0)        sSQL_C += " AND C.ID_FAR=? ";
      // itc = isTalColl
      if(iIdColl != 0 && itc) sSQL_C += " AND C.ID=? ";
      // pol = isPrenOnLine
      if(pol)                 sSQL_C += " AND C.PREN_ONLINE=? ";
      List<Integer> listCollaboratori = null;
      if(iIdColl != 0 && itc) {
        if(pol) {
          if(iRIdFar != 0) {
            listCollaboratori = DBUtil.readListOfInteger(conn, sSQL_C, iIdPrest, iRIdFar, iIdColl, pol ? 1 : 0);
          }
          else {
            listCollaboratori = DBUtil.readListOfInteger(conn, sSQL_C, iIdPrest, iIdColl, pol ? 1 : 0);
          }
        }
        else {
          if(iRIdFar != 0) {
            listCollaboratori = DBUtil.readListOfInteger(conn, sSQL_C, iIdPrest, iRIdFar, iIdColl);
          }
          else {
            listCollaboratori = DBUtil.readListOfInteger(conn, sSQL_C, iIdPrest, iIdColl);
          }
        }
      }
      else if(pol) {
        if(iRIdFar != 0) {
          listCollaboratori = DBUtil.readListOfInteger(conn, sSQL_C, iIdPrest, iRIdFar, pol ? 1 : 0);
        }
        else {
          listCollaboratori = DBUtil.readListOfInteger(conn, sSQL_C, iIdPrest, pol ? 1 : 0);
        }
      }
      else {
        if(iRIdFar != 0) {
          listCollaboratori = DBUtil.readListOfInteger(conn, sSQL_C, iIdPrest, iRIdFar);
        }
        else {
          listCollaboratori = DBUtil.readListOfInteger(conn, sSQL_C, iIdPrest);
        }
      }
      if(listCollaboratori == null || listCollaboratori.size() == 0) {
        if(iIdColl != 0 && itc) {
          if(listMessaggi != null) listMessaggi.add("Il collaboratore non esegue la prestazione.");
        }
        else {
          if(listMessaggi != null) listMessaggi.add("Non vi sono collaboratori che eseguono la prestazione.");
        }
        if(dev) logger.debug("WSCalendario.search -> 0 items (listCollaboratori=" + listCollaboratori + ")");
        return new ArrayList<Calendario>(0);
      }
      
      // Si riporta come primo il collaboratore eventualmente specificato
      if(iIdColl != 0) {
        int iIndexOf = listCollaboratori.indexOf(iIdColl);
        if(iIndexOf >= 0) {
          listCollaboratori.remove(iIndexOf);
          listCollaboratori.add(0, iIdColl);
        }
        else if(itc) {
          if(listMessaggi != null) listMessaggi.add("Il collaboratore specificato non esegue la prestazione.");
          if(dev) logger.debug("WSCalendario.search -> 0 items (listCollaboratori=" + listCollaboratori + " dont contains " + iIdColl + " and itc=" + itc + ")");
          return new ArrayList<Calendario>(0);
        }
      }
      if(dev) logger.debug("WSCalendario.search [2] listCollaboratori=" + listCollaboratori + ",iIdColl=" + iIdColl);
      
      // [3] Ricerca attrezzature (cabine) collegate alla prestazione
      List<Integer> listAttrezzature = null;
      if(iRIdFar != 0) {
        listAttrezzature = DBUtil.readListOfInteger(conn, "SELECT PA.ID_ATTREZZATURA,PA.ID FROM PRZ_PRESTAZIONI_ATTREZ PA,PRZ_ATTREZZATURE A WHERE PA.ID_ATTREZZATURA=A.ID AND A.FLAG_ATTIVO=? AND PA.ID_PRESTAZIONE=? AND A.ID_FAR=? ORDER BY PA.ID", 1, iIdPrest, iRIdFar);
      }
      else {
        listAttrezzature = DBUtil.readListOfInteger(conn, "SELECT PA.ID_ATTREZZATURA,PA.ID FROM PRZ_PRESTAZIONI_ATTREZ PA,PRZ_ATTREZZATURE A WHERE PA.ID_ATTREZZATURA=A.ID AND A.FLAG_ATTIVO=? AND PA.ID_PRESTAZIONE=? ORDER BY PA.ID", 1, iIdPrest);
      }
      if(listAttrezzature != null && listAttrezzature.size() > 0) {
        if(iIdAttr != 0) {
          // Si riporta come prima l'attrezzatura eventualmente specificata
          int iIndexOf = listAttrezzature.indexOf(iIdAttr);
          if(iIndexOf >= 0) {
            listAttrezzature.remove(iIndexOf);
            listAttrezzature.add(0, iIdAttr);
          }
          else if(ita) {
            if(listMessaggi != null) listMessaggi.add("La cabina specificata non e' legata alla prestazione.");
            if(dev) logger.debug("WSCalendario.search -> 0 items (listAttrezzature=" + listAttrezzature + " dont contains " + iIdAttr + " and ita=" + ita + ")");
            return new ArrayList<Calendario>(0);
          }
        }
      }
      if(dev) logger.debug("WSCalendario.search [3] listAttrezzature=" + listAttrezzature + ",iIdAttrez=" + iIdAttr);
      
      pstmD = conn.prepareStatement(sSQL_D);
      pstmR = conn.prepareStatement(sSQL_R);
      pstmP = conn.prepareStatement(sSQL_P);
      
      int iCurrTime = WUtil.toIntTime(Calendar.getInstance(), 0);
      int iCollDisp = 0;
      // [4] Ricerca calendario per ciascun collaboratore 
      for(int i = 0; i < listCollaboratori.size(); i++) {
        int iIdCollaboratore = listCollaboratori.get(i);
        
        if(dev) logger.debug("WSCalendario.search [4] iIdCollaboratore=" + iIdCollaboratore + ",dDateApp=" + dDateApp + ",dFrom=" + dFrom + ",dTo=" + dTo);
        
        p = 0;
        pstmD.setInt(++p,       1); // C.FLAG_ATTIVO
        pstmD.setInt(++p,       1); // O.FLAG_ATTIVO
        pstmD.setInt(++p,       1); // O.VISIBILE
        pstmD.setString(++p,  "S"); // C.STATO
        pstmD.setInt(++p,     iDurata);
        pstmD.setInt(++p,     iIdCollaboratore);
        if(dDateApp != null) {
          // Singola Data (from == to)
          pstmD.setDate(++p, dDateApp);
        }
        else
          if(dFrom != null && dTo != null) {
            // Range (from - to)
            pstmD.setDate(++p, dFrom);
            pstmD.setDate(++p, dTo);
          }
          else {
            if(dFrom == null) dFrom = new java.sql.Date(System.currentTimeMillis());
            // Dal (from)
            pstmD.setDate(++p, dFrom);
          }
        if(pol) {
          pstmD.setInt(++p, 1); // O.PREN_ONLINE
        }
        
        Set<Integer> setOfDate = new HashSet<Integer>();
        List<Calendario> listResCol = new ArrayList<Calendario>();
        
        rsD = pstmD.executeQuery();
        while(rsD.next()) {
          int    iId           = rsD.getInt("ID");
          int    iIdCollab     = rsD.getInt("ID_COLLABORATORE");
          String sNomeCollab   = rsD.getString("NOME");
          int    iIdAgenda     = rsD.getInt("ID_AGENDA");
          int    iIdAgendaMod  = rsD.getInt("ID_AGENDA_MODELLO");
          Date dDataCalendario = rsD.getDate("DATA_CALENDARIO");
          int    iGiorno       = rsD.getInt("GIORNO");
          int    iProgressivo  = rsD.getInt("PROGRESSIVO");
          int    iOraInizio    = rsD.getInt("ORAINIZIO");
          String sModello      = rsD.getString("MODELLO");
          String sTipologia    = rsD.getString("TIPOLOGIA");
          
          if(dev) logger.debug("WSCalendario.search [4] iIdCollab=" + iIdCollab + ",dDataCalendario=" + dDataCalendario + ",iOraInizio=" + iOraInizio);
          
          int iDataCalendario  = WUtil.toIntDate(dDataCalendario, 0);
          if(!setOfDate.contains(iDataCalendario)) {
            setOfDate.add(iDataCalendario);
          }
          
          if(setOfDate.size() > iMaxDate) {
            if(listResCol.size() > 0) break;
          }
          
          if(iDataCalendario == iCurrDate) {
            int iCalTime = 0;
            if(iTime > 0 && iTime >= iCurrTime) {
              iCalTime = iTime;
            }
            else {
              iCalTime = DataUtil.closeSlot(iCurrTime);
            }
            while(iCalTime < 2350) {
              boolean isAvailable = false;
              if(DataUtil.isAvailable(sModello, iCalTime, iDurata)) {
                
                if(iFromTime > 0 && iCalTime < iFromTime) {
                  iCalTime = DataUtil.addMinutes(iCalTime, 10);
                  continue;
                }
                if(iToTime > 0 && iCalTime >= iToTime) {
                  break;
                }
                
                Calendar calDataOra = WUtil.toCalendar(iDataCalendario, null);
                if(calDataOra != null) {
                  int iIdPren = 0;
                  calDataOra = WUtil.setTime(calDataOra, iCalTime);
                  pstmP.setInt(1, iIdCollab);
                  pstmP.setTimestamp(2, new java.sql.Timestamp(calDataOra.getTimeInMillis()));
                  pstmP.setTimestamp(3, new java.sql.Timestamp(calDataOra.getTimeInMillis()));
                  rsP = pstmP.executeQuery();
                  if(rsP.next()) iIdPren = rsP.getInt(1);
                  rsP.close();
                  if(iIdPren != 0) {
                    if(dev) logger.debug("WSCalendario.search [4] iIdCollab=" + iIdCollab + ",dDataCalendario=" + dDataCalendario + ",iCalTime=" + iCalTime + " NOT VALID (idPren=" + iIdPren + ")");
                    iCalTime = DataUtil.addMinutes(iCalTime, 10);
                    continue;
                  }
                }
                
                Calendario cal = new Calendario(iId, iIdCollab, iIdAgenda, iIdAgendaMod, dDataCalendario, iGiorno, iProgressivo, sTipologia);
                cal.setNomeCollab(sNomeCollab);
                cal.setOraInizio(iCalTime);
                cal.setMinuti(iDurata);
                cal.setOraFine(DataUtil.addMinutes(iCalTime, iDurata));
                
                // Controllo disponibilita' attrezzatura
                if(listAttrezzature != null && listAttrezzature.size() > 0) {
                  Calendar calTs1 = WUtil.toCalendar(dDataCalendario, null);
                  calTs1 = WUtil.setTime(calTs1, iCalTime);
                  if(calTs1 == null) continue;
                  Calendar calTs2 = Calendar.getInstance();
                  calTs2.setTimeInMillis(calTs1.getTimeInMillis() + iDurata * 60000);
                  Timestamp ts1 = new Timestamp(calTs1.getTimeInMillis());
                  Timestamp ts2 = new Timestamp(calTs2.getTimeInMillis());
                  for(int a = 0; a < listAttrezzature.size(); a++) {
                    int iIdAttrezzatura = listAttrezzature.get(a);
                    
                    boolean boRiservata = false;
                    pstmR.setInt(1,       iIdAttrezzatura);
                    pstmR.setTimestamp(2, ts1);
                    pstmR.setTimestamp(3, ts1);
                    pstmR.setTimestamp(4, ts2);
                    pstmR.setTimestamp(5, ts2);
                    pstmR.setTimestamp(6, ts1);
                    pstmR.setTimestamp(7, ts2);
                    rsR = pstmR.executeQuery();
                    if(rsR.next()) boRiservata = true;
                    rsR.close();
                    
                    if(!boRiservata) {
                      cal.setIdAttrez(iIdAttrezzatura);
                      break;
                    }
                  }
                  if(cal.getIdAttrez() != 0) {
                    listResCol.add(cal);
                    isAvailable = true;
                  }
                  else {
                    if(dev) logger.debug("WSCalendario.search [4] cal=" + cal + " discarded (idAttrez=0)");
                  }
                }
                else {
                  listResCol.add(cal);
                  isAvailable = true;
                }
              }
              if(first || iTime > 0) {
                if(listResCol.size() > 0) break;
              }
              
              if(iStep < 0) break;
              if(!isAvailable) {
                iCalTime = DataUtil.addMinutes(iCalTime, 10);
              }
              else {
                iCalTime = DataUtil.addMinutes(iCalTime, iStep);
              }
              if(iTime > 0 && listResCol.size() > 0) break;
            }
          }
          else {
            int iCalTime = iOraInizio;
            if(iTime > 0) iCalTime = iTime;
            while(iCalTime < 2350) {
              boolean isAvailable = false;
              if(DataUtil.isAvailable(sModello, iCalTime, iDurata)) {
                
                if(iFromTime > 0 && iCalTime < iFromTime) {
                  iCalTime = DataUtil.addMinutes(iCalTime, 10);
                  continue;
                }
                if(iToTime > 0 && iCalTime >= iToTime) {
                  break;
                }
                
                Calendar calDataOra = WUtil.toCalendar(iDataCalendario, null);
                if(calDataOra != null) {
                  int iIdPren = 0;
                  calDataOra = WUtil.setTime(calDataOra, iCalTime);
                  pstmP.setInt(1, iIdCollab);
                  pstmP.setTimestamp(2, new java.sql.Timestamp(calDataOra.getTimeInMillis()));
                  pstmP.setTimestamp(3, new java.sql.Timestamp(calDataOra.getTimeInMillis()));
                  rsP = pstmP.executeQuery();
                  if(rsP.next()) iIdPren = rsP.getInt(1);
                  rsP.close();
                  if(iIdPren != 0) {
                    if(dev) logger.debug("WSCalendario.search [4] iIdCollab=" + iIdCollab + ",dDataCalendario=" + dDataCalendario + ",iCalTime=" + iCalTime + " NOT VALID (idPren=" + iIdPren + ")");
                    iCalTime = DataUtil.addMinutes(iCalTime, 10);
                    continue;
                  }
                }
                
                Calendario cal = new Calendario(iId, iIdCollab, iIdAgenda, iIdAgendaMod, dDataCalendario, iGiorno, iProgressivo, sTipologia);
                cal.setNomeCollab(sNomeCollab);
                cal.setOraInizio(iCalTime);
                cal.setMinuti(iDurata);
                cal.setOraFine(DataUtil.addMinutes(iCalTime, iDurata));
                
                // Controllo disponibilita' attrezzatura
                if(listAttrezzature != null && listAttrezzature.size() > 0) {
                  Calendar calTs1 = WUtil.toCalendar(dDataCalendario, null);
                  calTs1 = WUtil.setTime(calTs1, iCalTime);
                  if(calTs1 == null) continue;
                  Calendar calTs2 = Calendar.getInstance();
                  calTs2.setTimeInMillis(calTs1.getTimeInMillis() + iDurata * 60000);
                  Timestamp ts1 = new Timestamp(calTs1.getTimeInMillis());
                  Timestamp ts2 = new Timestamp(calTs2.getTimeInMillis());
                  
                  for(int a = 0; a < listAttrezzature.size(); a++) {
                    int iIdAttrezzatura = listAttrezzature.get(a);
                    
                    boolean boRiservata = false;
                    pstmR.setInt(1,       iIdAttrezzatura);
                    pstmR.setTimestamp(2, ts1);
                    pstmR.setTimestamp(3, ts1);
                    pstmR.setTimestamp(4, ts2);
                    pstmR.setTimestamp(5, ts2);
                    pstmR.setTimestamp(6, ts1);
                    pstmR.setTimestamp(7, ts2);
                    rsR = pstmR.executeQuery();
                    if(rsR.next()) boRiservata = true;
                    rsR.close();
                    
                    if(!boRiservata) {
                      cal.setIdAttrez(iIdAttrezzatura);
                      break;
                    }
                  }
                  if(cal.getIdAttrez() != 0) {
                    listResCol.add(cal);
                    isAvailable = true;
                  }
                  else {
                    if(listMessaggi != null) listMessaggi.add("Nessuna cabina disponibile.");
                    if(dev) logger.debug("WSCalendario.search [4] cal=" + cal + " discarded (idAttrez=0)");
                  }
                }
                else {
                  listResCol.add(cal);
                  isAvailable = true;
                }
              }
              
              if(first || iTime > 0) {
                if(listResCol.size() > 0) break;
              }
              
              if(iStep < 0) break;
              if(!isAvailable) {
                iCalTime = DataUtil.addMinutes(iCalTime, 10);
              }
              else {
                iCalTime = DataUtil.addMinutes(iCalTime, iStep);
              }
              if(iTime > 0 && listResCol.size() > 0) break;
            }
          }
          
          if(iTime > 0 && listResCol.size() > 0) break;
        }
        
        if(dev) logger.debug("WSCalendario.search [4] listResCol=" + listResCol);
        if(listResCol.size() == 0) {
          // Nessuna disponibilita' trovata: si continua con il collaboratore successivo
          continue;
        }
        
        if(listResCol.size() > 0) {
          listResult.addAll(listResCol);
          iCollDisp++;
          if(iCollDisp >= iMaxColl) break;
        }
        
        // In caso di prima disp: si esce appena si ha un record
        if(first && listResult.size() > 0) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCalendario.search", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rsD, pstmD, rsR, pstmR, rsP, pstmP);
    }
    if(listResult != null && listResult.size() > 0) {
      if(listMessaggi != null) listMessaggi.clear();
    }
    if(dev) logger.debug("WSCalendario.search(" + ricerca + ") -> " + listResult.size() + " items");
    return listResult;
  }
  
  public static
  boolean deleteVariazioni(int iIdCollaboratore, java.util.Date dDataCal)
      throws Exception
  {
    return deleteVariazioni(iIdCollaboratore, dDataCal, null);
  }
  
  public static
  boolean deleteVariazioni(int iIdCollaboratore, java.util.Date dDataCal, String sUserDesk)
      throws Exception
  {
    if(iIdCollaboratore == 0 || dDataCal == null) return false;
    
    dDataCal = WUtil.setTime(dDataCal, 0);
    
    User user  = WSContext.getUser();
    
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      DBUtil.execUpd(conn, "DELETE FROM PRZ_CALENDARIO_VARIAZ WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO=?", iIdCollaboratore, dDataCal);
      
      DAOAgende.generate(conn, iIdCollaboratore, dDataCal, user);
      
      int    iIdFar = WSCollaboratori.getIdFar(conn, iIdCollaboratore);
      String sNome  = DBUtil.readString(conn, "SELECT NOME FROM PRZ_COLLABORATORI WHERE ID=?", iIdCollaboratore);
      WSLogOperazioni.insert(conn, "V.Canc.Variaz.", sUserDesk, iIdFar, dDataCal, sNome);
      
      ut.commit();
    }
    catch(Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSCalendario.deleteVariazioni(" + iIdCollaboratore + "," + dDataCal + "," + sUserDesk + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
    return true;
  }
  
  public static
  Map<String,Object> saveVariazioni(int iIdFar, java.util.Date dDataCal, Map<String,Object> mapValues)
      throws Exception
  {
    return saveVariazioni(iIdFar, dDataCal, mapValues, null);
  }
  
  public static
  Map<String,Object> saveVariazioni(int iIdFar, java.util.Date dDataCal, Map<String,Object> mapValues, String sUserDesk)
      throws Exception
  {
    Map<String,Object> mapResult = new HashMap<String,Object>();
    
    if(dDataCal == null) {
      throw new Exception("Data calendario non specificata.");
    }
    dDataCal = WUtil.setTime(dDataCal, 0);
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      saveVariazioni(conn, dDataCal, mapValues, sUserDesk);
      
      Map<String,Object> mapSlots = getSlots(conn, iIdGru, iIdFar, 0, dDataCal, false);
      
      mapResult.put(sDATA,         dDataCal);
      mapResult.put(sRISORSE,      getResources(conn, iIdGru, iIdFar, 0));
      mapResult.put(sSLOTS,        mapSlots);
      mapResult.put(sAPPUNTAMENTI, getAppointments(conn, iIdGru, iIdFar, 0, dDataCal, mapSlots));
      
      ut.commit();
    }
    catch(Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSCalendario.saveVariazioni", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
    return mapResult;
  }
  
  public static
  Map<String,Object> saveVariazioni(Connection conn, java.util.Date dDataCal, Map<String,Object> mapValues, String sUserDesk)
      throws Exception
  {
    if(dDataCal == null || mapValues == null || mapValues.isEmpty()) {
      return new HashMap<String,Object>();
    }
    dDataCal = WUtil.setTime(dDataCal, 0);
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    int iIdFar = 0;
    
    Map<String,Object> mapResult = new HashMap<String,Object>();
    
    String sSQL_Sel = "SELECT ID,STATO FROM PRZ_CALENDARIO WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO=? AND ORAINIZIO=? AND ORAFINE=? AND FLAG_VARIAZIONE=?";
    String sSQL_Del = "DELETE PRZ_CALENDARIO_VARIAZ WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO=?";
    String sSQL_Ins = "INSERT INTO PRZ_CALENDARIO_VARIAZ(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,ID_COLLABORATORE,DATA_CALENDARIO,GIORNO,PROGRESSIVO,ORAINIZIO,ORAFINE,TIPOLOGIA,VALORE,PREN_ONLINE,STATO)";
    sSQL_Ins += "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    String sLogNote = null;
    int p = 0;
    PreparedStatement pstmS = null;
    PreparedStatement pstmD = null;
    PreparedStatement pstmI = null;
    PreparedStatement pstmC = null;
    ResultSet rsS = null;
    ResultSet rsC = null;
    try {
      pstmS = conn.prepareStatement(sSQL_Sel);
      pstmD = conn.prepareStatement(sSQL_Del);
      pstmI = conn.prepareStatement(sSQL_Ins);
      pstmC = conn.prepareStatement("SELECT NOME FROM PRZ_COLLABORATORI WHERE ID=?");
      
      Iterator<Entry<String,Object>> iterator = mapValues.entrySet().iterator();
      while(iterator.hasNext()) {
        Entry<String,Object> entry = iterator.next();
        
        int iIdCollaboratore = WUtil.toInt(entry.getKey(), 0);
        if(iIdCollaboratore == 0) continue;
        
        if(iIdFar == 0) {
          iIdFar = WSCollaboratori.getIdFar(conn, iIdCollaboratore);
        }
        
        int[] orari = WUtil.toArrayOfInt(entry.getValue(), true);
        if(orari == null || orari.length < 4) continue;
        
        // 0 = Ora inizio (attacco)
        // 1 = Ora Fine (stacco / inizio pausa)
        // 2 = Lavora / Non Lavora
        // 3 = Applica personalizzazione (variazione)
        
        // 4 = Ora inizio (rientro)
        // 5 = Ora Fine (stacco)
        // 6 = Lavora / Non Lavora
        // 7 = Applica personalizzazione (variazione)
        
        // Si rimuovono le variazioni precedenti
        pstmD.setInt(1, iIdCollaboratore);
        pstmD.setDate(2, new java.sql.Date(dDataCal.getTime()));
        pstmD.executeUpdate();
        
        if(orari[3] == 0) {
          DAOAgende.generate(conn, iIdCollaboratore, dDataCal, user);
          continue;
        }
        
        // Controllo variazione
        boolean variaz1 = false;
        boolean variaz2 = false;
        String sStatoF1 = null;
        String sStatoF2 = null;
        pstmS.setInt(1,  iIdCollaboratore);
        pstmS.setDate(2, new java.sql.Date(dDataCal.getTime()));
        pstmS.setInt(3,  orari[0]);
        pstmS.setInt(4,  orari[1]);
        pstmS.setInt(5,  0);
        rsS = pstmS.executeQuery();
        if(rsS.next()) sStatoF1 = rsS.getString(2);
        rsS.close();
        if(sStatoF1 != null) {
          if(orari[2] == 1 &&  sStatoF1.equals("N")) variaz1 = true;
          if(orari[2] == 0 && !sStatoF1.equals("N")) variaz1 = true;
        }
        else {
          variaz1 = true;
        }
        
        if(orari.length >= 8) {
          pstmS.setInt(1,  iIdCollaboratore);
          pstmS.setDate(2, new java.sql.Date(dDataCal.getTime()));
          pstmS.setInt(3,  orari[4]);
          pstmS.setInt(4,  orari[5]);
          pstmS.setInt(5,  0);
          rsS = pstmS.executeQuery();
          if(rsS.next()) sStatoF2 = rsS.getString(2);
          rsS.close();
          if(sStatoF2 != null) {
            if(orari[6] == 1 &&  sStatoF2.equals("N")) variaz2 = true;
            if(orari[6] == 0 && !sStatoF2.equals("N")) variaz2 = true;
          }
          else {
            variaz2 = true;
          }
        }
        else {
          variaz2 = false;
        }
        
        if(!variaz1 && !variaz2) {
          DAOAgende.generate(conn, iIdCollaboratore, dDataCal, user);
          continue;
        }
        
        pstmC.setInt(1, iIdCollaboratore);
        rsC = pstmC.executeQuery();
        if(rsC.next()) {
          String sNome = rsC.getString("NOME");
          if(sNome != null && sNome.length() > 0) {
            if(sLogNote == null || sLogNote.length() == 0) {
              sLogNote = sNome;
            }
            else {
              sLogNote += "," + sNome;
            }
          }
        }
        rsC.close();
        
        // Si inseriscono le nuove variazioni
        if(variaz1) {
          String sStatoVar  = orari[2] == 1 ? "S" : "N";
          
          int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_CALENDARIO_VARIAZ");
          p = 0;
          pstmI.setInt(++p,    iId);
          pstmI.setInt(++p,    iIdUte);
          pstmI.setDate(++p,   new java.sql.Date(System.currentTimeMillis()));
          pstmI.setInt(++p,    1);
          pstmI.setInt(++p,    iIdGru);
          pstmI.setInt(++p,    iIdCollaboratore);
          pstmI.setDate(++p,   new java.sql.Date(dDataCal.getTime()));
          pstmI.setInt(++p,    DateSplitter.getDayOfWeek(dDataCal));
          pstmI.setInt(++p,    1);
          pstmI.setInt(++p,    orari[0]);
          pstmI.setInt(++p,    orari[1]);
          pstmI.setString(++p, "O"); // TIPOLOGIA
          pstmI.setInt(++p,    DataUtil.diffMinutes(orari[1], orari[0]));
          pstmI.setInt(++p,    1); // PREN_ONLINE
          pstmI.setString(++p, sStatoVar); // STATO
          pstmI.executeUpdate();
        }
        if(variaz2) {
          String sStatoVar  = orari[6] == 1 ? "S" : "N";
          
          int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_CALENDARIO_VARIAZ");
          p = 0;
          pstmI.setInt(++p,    iId);
          pstmI.setInt(++p,    iIdUte);
          pstmI.setDate(++p,   new java.sql.Date(System.currentTimeMillis()));
          pstmI.setInt(++p,    1);
          pstmI.setInt(++p,    iIdGru);
          pstmI.setInt(++p,    iIdCollaboratore);
          pstmI.setDate(++p,   new java.sql.Date(dDataCal.getTime()));
          pstmI.setInt(++p,    DateSplitter.getDayOfWeek(dDataCal));
          pstmI.setInt(++p,    2);
          pstmI.setInt(++p,    orari[4]);
          pstmI.setInt(++p,    orari[5]);
          pstmI.setString(++p, "O"); // TIPOLOGIA
          pstmI.setInt(++p,    DataUtil.diffMinutes(orari[1], orari[0]));
          pstmI.setInt(++p,    1); // PREN_ONLINE
          pstmI.setString(++p, sStatoVar); // STATO
          pstmI.executeUpdate();
        }
        
        DAOAgende.generate(conn, iIdCollaboratore, dDataCal, user);
      }
      
      WSLogOperazioni.insert(conn, "Orari", sUserDesk, iIdFar, dDataCal, sLogNote);
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCalendario.saveVariazioni(" + dDataCal + "," + mapValues + "," + sUserDesk + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rsC, rsS, pstmS, pstmD, pstmI, pstmC);
    }
    return mapResult;
  }
  
  public static
  List<Map<String,Object>> getResources(Connection conn, int iIdGru, int iIdFar, int iIdCollab)
      throws Exception
  {
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    String sSQL = "SELECT ID,NOME,COLORE,ORDINE ";
    sSQL += "FROM PRZ_COLLABORATORI ";
    sSQL += "WHERE ID_GRU=? AND ID_FAR=? AND FLAG_ATTIVO=? AND VISIBILE=? ";
    if(iIdCollab != 0) {
      sSQL += "AND ID=? ";
    }
    sSQL += "ORDER BY ORDINE,NOME";
    
    int p = 0;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p, iIdGru);
      pstm.setInt(++p, iIdFar);
      pstm.setInt(++p, 1);
      pstm.setInt(++p, 1);
      if(iIdCollab != 0) {
        pstm.setInt(++p, iIdCollab);
      }
      
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId     = rs.getInt("ID");
        String sNome   = rs.getString("NOME");
        String sColore = rs.getString("COLORE");
        
        if(iId == 0) continue;
        
        Map<String,Object> mapRecord = new HashMap<String,Object>(3);
        mapRecord.put(IEntity.sID,    iId);
        mapRecord.put(IEntity.sTEXT,  sNome);
        mapRecord.put(IEntity.sCOLOR, sColore);
        
        listResult.add(mapRecord);
        if(listResult.size() > 1000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCalendario.getResources(conn, " + iIdGru + "," + iIdFar + "," + iIdCollab + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return listResult;
  }
  
  public static
  Map<String,Object> getSlots(Connection conn, int iIdGru, int iIdFar, int iIdCollab, Object oDate, boolean markAppointment)
      throws Exception
  {
    Map<String,Object> mapResult = new HashMap<String,Object>();
    
    Calendar cDate = WUtil.toCalendar(oDate, null);
    if(cDate == null) return mapResult;
    Date dDate = new Date(WUtil.setTime(cDate, 0).getTimeInMillis());
    
    String sSQL = "SELECT ID_COLLABORATORE,ORAINIZIO,ORAFINE,MODELLO ";
    sSQL += "FROM PRZ_CALENDARIO ";
    sSQL += "WHERE ID_GRU=? AND ID_FAR=? AND FLAG_ATTIVO=? AND DATA_CALENDARIO=? AND STATO=? ";
    if(iIdCollab != 0) {
      sSQL += "AND ID_COLLABORATORE=? ";
    }
    
    int p = 0;
    PreparedStatement pstmC = null;
    PreparedStatement pstmP = null;
    ResultSet rsC = null;
    ResultSet rsP = null;
    try {
      pstmC = conn.prepareStatement(sSQL);
      pstmC.setInt(++p,    iIdGru);
      pstmC.setInt(++p,    iIdFar);
      pstmC.setInt(++p,    1); // FLAG_ATTIVO
      pstmC.setDate(++p,   dDate);
      pstmC.setString(++p, "S"); // STATO
      if(iIdCollab != 0) {
        pstmC.setInt(++p, iIdCollab);
      }
      rsC = pstmC.executeQuery();
      while(rsC.next()) {
        int    iIdColl    = rsC.getInt("ID_COLLABORATORE");
        int    iOraInizio = rsC.getInt("ORAINIZIO");
        int    iOraFine   = rsC.getInt("ORAFINE");
        String sModello   = rsC.getString("MODELLO");
        
        if(iIdColl == 0 || sModello == null) continue;
        
        int iHH0 = iOraInizio / 100;
        int iMM0 = iOraInizio % 100;
        int i0   = iHH0 * 60 + iMM0;
        
        int iHH1 = iOraFine / 100;
        int iMM1 = iOraFine % 100;
        int i1   = iHH1 * 60 + iMM1;
        
        int iC = i0;
        while(iC < i1) {
          if(sModello.length() <= iC) break;
          
          char c = sModello.charAt(iC);
          if(c == '0') {
            iC += 10;
            continue;
          }
          
          int iHHC = iC / 60;
          int iMMC = iC % 60;
          int iOraCorr = iHHC * 100 + iMMC;
          
          int iValue = 1;
          if(markAppointment) {
            if(pstmP == null) {
              pstmP = conn.prepareStatement("SELECT ID FROM PRZ_PRENOTAZIONI WHERE ID_COLLABORATORE=? AND DATAORA_INIZIO<=? AND DATAORA_FINE>? AND STATO<>'A'");
            }
            Calendar calDateTime = WUtil.toCalendar(dDate, null);
            if(calDateTime != null) {
              calDateTime = WUtil.setTime(calDateTime, iOraCorr);
              pstmP.setInt(1, iIdColl);
              pstmP.setTimestamp(2, new java.sql.Timestamp(calDateTime.getTimeInMillis()));
              pstmP.setTimestamp(3, new java.sql.Timestamp(calDateTime.getTimeInMillis()));
              rsP = pstmP.executeQuery();
              if(rsP.next()) {
                iValue = 4;
              }
              rsP.close();
            }
          }
          
          mapResult.put(iIdColl + "_" + iOraCorr, iValue);
          iC += 10;
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCalendario.getSlots(conn," + iIdGru + "," + iIdFar + "," + iIdCollab + "," + oDate + "," + markAppointment + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rsC, pstmC, rsP, pstmP);
    }
    return mapResult;
  }
  
  public static
  Map<String,List<Integer>> getTimeTable(Connection conn, int iIdGru, int iIdFar, int iIdCollab, Object oDate)
      throws Exception
  {
    Map<String,List<Integer>> mapResult = new HashMap<String,List<Integer>>();
    
    Calendar cDate = WUtil.toCalendar(oDate, null);
    if(cDate == null) return mapResult;
    Date dDate = new Date(WUtil.setTime(cDate, 0).getTimeInMillis());
    
    String sSQL_V = "SELECT ID_COLLABORATORE,ORAINIZIO,ORAFINE,STATO ";
    sSQL_V += "FROM PRZ_CALENDARIO_VARIAZ ";
    sSQL_V += "WHERE ID_GRU=? AND ID_FAR=? AND FLAG_ATTIVO=? AND DATA_CALENDARIO=? ";
    if(iIdCollab != 0) {
      sSQL_V += "AND ID_COLLABORATORE=? ";
    }
    sSQL_V += "ORDER BY ID_COLLABORATORE,ORAINIZIO";
    
    String sSQL_C = "SELECT ID_COLLABORATORE,ORAINIZIO,ORAFINE,STATO,FLAG_VARIAZIONE ";
    sSQL_C += "FROM PRZ_CALENDARIO ";
    sSQL_C += "WHERE ID_GRU=? AND ID_FAR=? AND FLAG_ATTIVO=? AND DATA_CALENDARIO=? ";
    if(iIdCollab != 0) {
      sSQL_C += "AND ID_COLLABORATORE=? ";
    }
    sSQL_C += "ORDER BY ID_COLLABORATORE,ORAINIZIO";
    
    int p = 0;
    Set<Integer> setOfIdColl = new HashSet<Integer>();
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      // Lettura Calendario
      pstm = conn.prepareStatement(sSQL_C);
      pstm.setInt(++p,  iIdGru);
      pstm.setInt(++p,  iIdFar);
      pstm.setInt(++p,  1);
      pstm.setDate(++p, dDate);
      if(iIdCollab != 0) {
        pstm.setInt(++p, iIdCollab);
      }
      rs = pstm.executeQuery();
      while(rs.next()) {
        int iIdColl     = rs.getInt("ID_COLLABORATORE");
        int iOraInizio  = rs.getInt("ORAINIZIO");
        int iOraFine    = rs.getInt("ORAFINE");
        String sStato   = rs.getString("STATO");
        int iFlagVariaz = rs.getInt("FLAG_VARIAZIONE");
        
        if(iIdColl == 0 || iOraFine <= iOraInizio) continue;
        
        List<Integer> listOrari = mapResult.get(String.valueOf(iIdColl));
        if(listOrari == null) {
          listOrari = new ArrayList<Integer>();
          mapResult.put(String.valueOf(iIdColl), listOrari);
        }
        listOrari.add(iOraInizio);
        listOrari.add(iOraFine);
        if(sStato != null && sStato.equals("N")) {
          listOrari.add(0);
        }
        else {
          listOrari.add(1);
        }
        listOrari.add(iFlagVariaz);
        
        setOfIdColl.add(iIdColl);
      }
      
      // Lettura Variazioni
      ConnectionManager.close(rs, pstm);
      p = 0;
      pstm = conn.prepareStatement(sSQL_V);
      pstm.setInt(++p,  iIdGru);
      pstm.setInt(++p,  iIdFar);
      pstm.setInt(++p,  1);
      pstm.setDate(++p, dDate);
      if(iIdCollab != 0) {
        pstm.setInt(++p, iIdCollab);
      }
      rs = pstm.executeQuery();
      while(rs.next()) {
        int iIdColl     = rs.getInt("ID_COLLABORATORE");
        int iOraInizio  = rs.getInt("ORAINIZIO");
        int iOraFine    = rs.getInt("ORAFINE");
        String sStato   = rs.getString("STATO");
        int iFlagVariaz = 1;
        
        if(iIdColl == 0 || iOraFine <= iOraInizio) continue;
        
        if(setOfIdColl.contains(iIdColl)) {
          // Le variazioni sovrascrivono il calendario
          mapResult.put(String.valueOf(iIdColl), new ArrayList<Integer>());
          setOfIdColl.remove(iIdColl);
        }
        
        List<Integer> listOrari = mapResult.get(String.valueOf(iIdColl));
        if(listOrari == null) {
          listOrari = new ArrayList<Integer>();
          mapResult.put(String.valueOf(iIdColl), listOrari);
        }
        listOrari.add(iOraInizio);
        listOrari.add(iOraFine);
        if(sStato != null && sStato.equals("N")) {
          listOrari.add(0);
        }
        else {
          listOrari.add(1);
        }
        listOrari.add(iFlagVariaz);
      }
      
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCalendario.getTimeTable(conn," + iIdGru + "," + iIdFar + "," + iIdCollab + "," + oDate + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return mapResult;
  }
  
  public static
  Map<String,Object> getAppointments(Connection conn, int iIdGru, int iIdFar, int iIdCollab, Object oDate, Map<String,Object> mapSlots)
      throws Exception
  {
    Map<String,Object> mapResult = new HashMap<String,Object>();
    
    Date dDate = WUtil.toSQLDate(oDate, null);
    if(dDate == null) return mapResult;
    
    if(mapSlots == null) mapSlots = new HashMap<String,Object>();
    
    String sSQL = "SELECT Z.ID,Z.ID_COLLABORATORE,Z.ID_ATTREZZATURA,Z.DATA_APPUNTAMENTO,Z.ORA_APPUNTAMENTO,Z.DURATA,Z.STATO,Z.ID_CLIENTE,C.COGNOME,C.NOME,Z.ID_PRESTAZIONE,P.DESCRIZIONE,Z.PREN_ONLINE,Z.TIPO_APPUNTAMENTO ";
    sSQL += "FROM PRZ_PRENOTAZIONI Z,PRZ_CLIENTI C,PRZ_PRESTAZIONI P ";
    sSQL += "WHERE Z.ID_CLIENTE=C.ID AND Z.ID_PRESTAZIONE=P.ID AND Z.ID_GRU=? AND Z.ID_FAR=? AND Z.FLAG_ATTIVO=? AND Z.STATO<>'A' AND Z.DATA_APPUNTAMENTO=? ";
    if(iIdCollab != 0) {
      sSQL += "AND Z.ID_COLLABORATORE=? ";
    }
    
    long currentTimeMillis = System.currentTimeMillis();
    int p = 0;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,  iIdGru);
      pstm.setInt(++p,  iIdFar);
      pstm.setInt(++p,  1);
      pstm.setDate(++p, dDate);
      if(iIdCollab != 0) {
        pstm.setInt(++p, iIdCollab);
      }
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iIdPren     = rs.getInt("ID");
        int    iIdColl     = rs.getInt("ID_COLLABORATORE");
        int    iIdAttr     = rs.getInt("ID_ATTREZZATURA");
        Date dDataApp      = rs.getDate("DATA_APPUNTAMENTO");
        int    iOraApp     = rs.getInt("ORA_APPUNTAMENTO");
        int    iDurata     = rs.getInt("DURATA");
        String sStato      = rs.getString("STATO");
        int    iIdCliente  = rs.getInt("ID_CLIENTE");
        String sCognome    = rs.getString("COGNOME");
        String sNome       = rs.getString("NOME");
        int    iIdPrestaz  = rs.getInt("ID_PRESTAZIONE");
        String sDesPrestaz = rs.getString("DESCRIZIONE");
        int    iPrenOnLine = rs.getInt("PREN_ONLINE");
        String tipoApp     = rs.getString("TIPO_APPUNTAMENTO");
        
        if(dDataApp == null) continue;
        if(sStato   == null) sStato = "C";
        
        int iHH0 = iOraApp / 100;
        int iMM0 = iOraApp % 100;
        int i0   = iHH0 * 60 + iMM0;
        
        int i1   = i0 + iDurata;
        
        Calendar calDataOraApp = Calendar.getInstance();
        calDataOraApp.setTimeInMillis(dDataApp.getTime());
        calDataOraApp.set(Calendar.HOUR_OF_DAY, iHH0);
        calDataOraApp.set(Calendar.MINUTE,      iMM0);
        calDataOraApp.set(Calendar.SECOND,      0);
        calDataOraApp.set(Calendar.MILLISECOND, 0);
        long lDataOraApp = calDataOraApp.getTimeInMillis();
        if(lDataOraApp < currentTimeMillis) {
          if("C".equals(sStato)) sStato = "E";
        }
        
        Prenotazione prenotazione = new Prenotazione(iIdPren, iIdCliente, sCognome + " " + sNome, iIdPrestaz, sDesPrestaz, dDataApp, WUtil.formatTime(iOraApp, false, false));
        prenotazione.setIdAttr(iIdAttr);
        prenotazione.setTipo(tipoApp);
        mapResult.put(iIdColl + "_" + iOraApp, prenotazione);
        
        int iC = i0;
        while(iC < i1) {
          int iHHC = iC / 60;
          int iMMC = iC % 60;
          int iOraCorr = iHHC * 100 + iMMC;
          
          //	readonly COLOR_NA: string = '#dcdcdc'; // Not AVailable (0)
          //	readonly COLOR_AV: string = '#f5f5f5'; // AVailable     (1)
          //	readonly COLOR_BK: string = '#bbffbb'; // BooKed        (2)
          //	readonly COLOR_EX: string = '#ddedf6'; // Executed      (3)
          //	readonly COLOR_NE: string = '#fecccc'; // Not Executed  (4)
          //	readonly COLOR_SU: string = '#fefecc'; // Suspended     (5)
          
          int iValue = 2; // BooKed
          
          if("E".equalsIgnoreCase(sStato)) {
            iValue = 3; // Executed
          }
          else if("N".equalsIgnoreCase(sStato)) {
            iValue = 4; // Not Executed
          }
          else if("F".equalsIgnoreCase(sStato)) {
            iValue = 5; // Suspended
          }
          else {
            iValue = 2; // BooKed
          }
          
          // I valori negativi vengono intepretati come appuntamenti online
          if(iPrenOnLine == 1) {
            iValue = iValue * -1;
          }
          
          mapSlots.put(iIdColl + "_" + iOraCorr, iValue);
          
          iC += 10;
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSCalendario.getAppointments(conn," + iIdGru + "," + iIdFar + "," + iIdCollab + "," + oDate + "," + mapSlots + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return mapResult;
  }
  
  public static
  int importVariazioni(Connection conn, InputStream is, int iIdGru, int iIdFar)
      throws Exception
  {
    if(conn == null || is == null) return 0;
    
    String sSQL_Ins = "INSERT INTO PRZ_CALENDARIO_VARIAZ(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,ID_FAR,ID_COLLABORATORE,DATA_CALENDARIO,GIORNO,PROGRESSIVO,ORAINIZIO,ORAFINE,TIPOLOGIA,VALORE,PREN_ONLINE,STATO)";
    sSQL_Ins += "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    int iRow = 0;
    int iResult = 0;
    
    int p = 0;
    PreparedStatement pstmI = null;
    BufferedReader br = null;
    try {
      pstmI = conn.prepareStatement(sSQL_Ins);
      
      br = new BufferedReader(new InputStreamReader(is));
      
      String sLine = null;
      while((sLine = br.readLine()) != null) {
        
        iRow++;
        if(iRow == 1) continue; // Header
        
        WList wlRecord = new WList(sLine, ',');
        
        String sCollaboratore = wlRecord.getString(0,  "");
        int iDataInizio       = wlRecord.getIntDate(1);
        int iDataFine         = wlRecord.getIntDate(2);
        String sLun_1         = wlRecord.getString(4,  "");
        String sMar_1         = wlRecord.getString(5,  "");
        String sMer_1         = wlRecord.getString(6,  "");
        String sGio_1         = wlRecord.getString(7,  "");
        String sVen_1         = wlRecord.getString(8,  "");
        String sSab_1         = wlRecord.getString(9,  "");
        String sDom_1         = wlRecord.getString(10, "");
        
        if(sCollaboratore != null) sCollaboratore = sCollaboratore.trim();
        
        if(sLun_1 == null || sLun_1.length() == 0 || sLun_1.equals("\"\"")) sLun_1 = "";
        if(sMar_1 == null || sMar_1.length() == 0 || sMar_1.equals("\"\"")) sMar_1 = "";
        if(sMer_1 == null || sMer_1.length() == 0 || sMer_1.equals("\"\"")) sMer_1 = "";
        if(sGio_1 == null || sGio_1.length() == 0 || sGio_1.equals("\"\"")) sGio_1 = "";
        if(sVen_1 == null || sVen_1.length() == 0 || sVen_1.equals("\"\"")) sVen_1 = "";
        if(sSab_1 == null || sSab_1.length() == 0 || sSab_1.equals("\"\"")) sSab_1 = "";
        if(sDom_1 == null || sDom_1.length() == 0 || sDom_1.equals("\"\"")) sDom_1 = "";
        
        String[] asOrari_1 = {sLun_1, sMar_1, sMer_1, sGio_1, sVen_1, sSab_1, sDom_1};
        
        if(iDataInizio != iDataFine) {
          System.out.println("[" + iRow + "] Non e' una variazione " + iDataInizio + "!=" + iDataFine);
          continue;
        }
        
        int iIdCollaboratore = DBUtil.readInt(conn, "SELECT ID FROM PRZ_COLLABORATORI WHERE NOME=?", sCollaboratore);
        if(iIdCollaboratore == 0) {
          System.out.println("[" + iRow + "] Collaboratore " + sCollaboratore + " non trovato");
          continue;
        }
        
        int iGiorno = DateSplitter.getDayOfWeek(iDataInizio);
        
        System.out.println(iDataInizio);
        int[] aiFasceOrarie = getFasceOrarie(asOrari_1, iGiorno);
        if(aiFasceOrarie == null || aiFasceOrarie.length < 3) {
          System.out.println("[" + iRow + "] Non vi sono fasce orarie");
          continue;
        }
        
        DBUtil.execUpd(conn, "DELETE FROM PRZ_CALENDARIO_VARIAZ WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO=?", iIdCollaboratore, WUtil.toSQLDate(iDataInizio, null));
        
        int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_CALENDARIO_VARIAZ");
        p = 0;
        pstmI.setInt(++p,    iId);
        pstmI.setInt(++p,    0);
        pstmI.setDate(++p,   new java.sql.Date(System.currentTimeMillis()));
        pstmI.setInt(++p,    1);
        pstmI.setInt(++p,    iIdGru);
        pstmI.setInt(++p,    iIdFar);
        pstmI.setInt(++p,    iIdCollaboratore);
        pstmI.setDate(++p,   WUtil.toSQLDate(iDataInizio, null));
        pstmI.setInt(++p,    iGiorno);
        pstmI.setInt(++p,    1);
        pstmI.setInt(++p,    aiFasceOrarie[0]);
        pstmI.setInt(++p,    aiFasceOrarie[1]);
        pstmI.setString(++p, "O"); // TIPOLOGIA
        pstmI.setInt(++p,    DataUtil.diffMinutes(aiFasceOrarie[1], aiFasceOrarie[0]));
        pstmI.setInt(++p,    1); // PREN_ONLINE
        pstmI.setString(++p, aiFasceOrarie[2] == 1 ? "S" : "N"); // STATO
        pstmI.executeUpdate();
        
        if(aiFasceOrarie.length >= 6) {
          iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_CALENDARIO_VARIAZ");
          p = 0;
          pstmI.setInt(++p,    iId);
          pstmI.setInt(++p,    0);
          pstmI.setDate(++p,   new java.sql.Date(System.currentTimeMillis()));
          pstmI.setInt(++p,    1);
          pstmI.setInt(++p,    iIdGru);
          pstmI.setInt(++p,    iIdFar);
          pstmI.setInt(++p,    iIdCollaboratore);
          pstmI.setDate(++p,   WUtil.toSQLDate(iDataInizio, null));
          pstmI.setInt(++p,    iGiorno);
          pstmI.setInt(++p,    1);
          pstmI.setInt(++p,    aiFasceOrarie[3]);
          pstmI.setInt(++p,    aiFasceOrarie[4]);
          pstmI.setString(++p, "O"); // TIPOLOGIA
          pstmI.setInt(++p,    DataUtil.diffMinutes(aiFasceOrarie[4], aiFasceOrarie[3]));
          pstmI.setInt(++p,    1); // PREN_ONLINE
          pstmI.setString(++p, aiFasceOrarie[5] == 1 ? "S" : "N"); // STATO
          pstmI.executeUpdate();
        }
        
        DAOAgende.generate(conn, iIdCollaboratore, WUtil.toSQLDate(iDataInizio, null), new User(0, iIdGru));
        
        conn.commit();
        iResult++;
      }
    }
    catch(Exception ex) {
      ex.printStackTrace();
      throw ex;
    }
    finally {
      ConnectionManager.close(pstmI, conn);
    }
    return iResult;
  }
  
  public static
  int importPiani(Connection conn, InputStream is, int iIdGru, int iIdFar)
      throws Exception
  {
    if(conn == null || is == null) return 0;
    
    int iRow = 0;
    int iResult = 0;
    
    BufferedReader br = null;
    try {
      br = new BufferedReader(new InputStreamReader(is));
      
      String sLine = null;
      while((sLine = br.readLine()) != null) {
        
        iRow++;
        if(iRow == 1) continue; // Header
        
        WList wlRecord = new WList(sLine, ',');
        
        String sCollaboratore = wlRecord.getString(0,  "");
        int iDataInizio       = wlRecord.getIntDate(1);
        int iDataFine         = wlRecord.getIntDate(2);
        String sTipoPiano     = wlRecord.getString(3,  "");
        String sLun_1         = wlRecord.getString(4,  "");
        String sMar_1         = wlRecord.getString(5,  "");
        String sMer_1         = wlRecord.getString(6,  "");
        String sGio_1         = wlRecord.getString(7,  "");
        String sVen_1         = wlRecord.getString(8,  "");
        String sSab_1         = wlRecord.getString(9,  "");
        String sDom_1         = wlRecord.getString(10, "");
        String sLun_2         = wlRecord.getString(11, "");
        String sMar_2         = wlRecord.getString(12, "");
        String sMer_2         = wlRecord.getString(13, "");
        String sGio_2         = wlRecord.getString(14, "");
        String sVen_2         = wlRecord.getString(15, "");
        String sSab_2         = wlRecord.getString(16, "");
        String sDom_2         = wlRecord.getString(17, "");
        
        if(sCollaboratore != null) sCollaboratore = sCollaboratore.trim();
        
        if(sLun_1 == null || sLun_1.length() == 0 || sLun_1.equals("\"\"")) sLun_1 = "";
        if(sMar_1 == null || sMar_1.length() == 0 || sMar_1.equals("\"\"")) sMar_1 = "";
        if(sMer_1 == null || sMer_1.length() == 0 || sMer_1.equals("\"\"")) sMer_1 = "";
        if(sGio_1 == null || sGio_1.length() == 0 || sGio_1.equals("\"\"")) sGio_1 = "";
        if(sVen_1 == null || sVen_1.length() == 0 || sVen_1.equals("\"\"")) sVen_1 = "";
        if(sSab_1 == null || sSab_1.length() == 0 || sSab_1.equals("\"\"")) sSab_1 = "";
        if(sDom_1 == null || sDom_1.length() == 0 || sDom_1.equals("\"\"")) sDom_1 = "";
        
        if(sLun_2 == null || sLun_2.length() == 0 || sLun_2.equals("\"\"")) sLun_2 = "";
        if(sMar_2 == null || sMar_2.length() == 0 || sMar_2.equals("\"\"")) sMar_2 = "";
        if(sMer_2 == null || sMer_2.length() == 0 || sMer_2.equals("\"\"")) sMer_2 = "";
        if(sGio_2 == null || sGio_2.length() == 0 || sGio_2.equals("\"\"")) sGio_2 = "";
        if(sVen_2 == null || sVen_2.length() == 0 || sVen_2.equals("\"\"")) sVen_2 = "";
        if(sSab_2 == null || sSab_2.length() == 0 || sSab_2.equals("\"\"")) sSab_2 = "";
        if(sDom_2 == null || sDom_2.length() == 0 || sDom_2.equals("\"\"")) sDom_2 = "";
        
        String[] asOrari_1 = {sLun_1, sMar_1, sMer_1, sGio_1, sVen_1, sSab_1, sDom_1};
        String[] asOrari_2 = {sLun_2, sMar_2, sMer_2, sGio_2, sVen_2, sSab_2, sDom_2};
        
        if(iDataInizio == iDataFine) {
          System.out.println("[" + iRow + "] Non e' un piano " + iDataInizio + "==" + iDataFine);
          continue;
        }
        
        int iIdCollaboratore = DBUtil.readInt(conn, "SELECT ID FROM PRZ_COLLABORATORI WHERE ID_FAR=? AND NOME=?", iIdFar, sCollaboratore);
        if(iIdCollaboratore == 0) {
          System.out.println("[" + iRow + "] Collaboratore " + sCollaboratore + " non trovato");
          continue;
        }
        
        boolean boSettAlt = sTipoPiano != null && sTipoPiano.indexOf("alter") >= 0;
        
        List<AgendaModello> fasceOrarie = getAgendeModelli(asOrari_1, asOrari_2, DateSplitter.getWeek2020(iDataInizio), boSettAlt);
        if(fasceOrarie == null || fasceOrarie.size() == 0) {
          System.out.println("[" + iRow + "] Non vi sono fasce orarie");
          continue;
        }
        
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
          
          if(!modello.isAttivo()) continue;
          
          sbGiorni.setCharAt(iGiorno-1, 'S');
        }
        
        Agenda agenda = new Agenda();
        agenda.setIdFar(iIdFar);
        agenda.setSettimaneAlt(boSettAlt);
        agenda.setDescrizione("PIANO");
        agenda.setInizioValidita(WUtil.toDate(iDataInizio, 0));
        agenda.setFineValidita(WUtil.toDate(iDataFine, 0));
        agenda.setGiorni(sbGiorni.toString());
        agenda.setFasceOrarie(fasceOrarie);
        
        Agenda agendaIns = DAOAgende.insert(conn, iIdCollaboratore, true, agenda, new User(0, iIdGru));
        if(agendaIns == null || agendaIns.getId() == 0) {
          System.out.println("[" + iRow + "] Agenda NON inserita");
          continue;
        }
        
        DAOAgende.generate(conn, agenda, new User(0, iIdGru));
        
        conn.commit();
        iResult++;
      }
    }
    catch(Exception ex) {
      ex.printStackTrace();
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
    return iResult;
  }
  
  public static
  int[] getFasceOrarie(String[] asOrari, int iGiorno)
  {
    String sFO = asOrari[iGiorno - 1];
    if(sFO == null || sFO.length() == 0) {
      System.out.println(sFO + " -> 9,18,0");
      return new int[] { 900, 1800, 0 };
    }
    int iSep1 = sFO.indexOf(" - ");
    if(iSep1 < 0) {
      System.out.println(sFO + " -> 9,18,0");
      return new int[] { 900, 1800, 0 };
    }
    if(iSep1 > 0) {
      int iSep2 = sFO.indexOf(" - ", iSep1 + 4);
      if(iSep2 > 0) {
        int iSep3 = sFO.indexOf(' ', iSep1 + 4);
        if(iSep3 > 0) {
          String sFascia1   = sFO.substring(0,iSep3);
          String sFascia2   = sFO.substring(iSep3+1);
          
          String sOraInizio1 = sFascia1.substring(0,iSep1).trim();
          String sOraFine1   = sFascia1.substring(iSep1+3).trim();
          
          String sOraInizio2 = sFascia2.substring(0,iSep1).trim();
          String sOraFine2   = sFascia2.substring(iSep1+3).trim();
          
          System.out.println(sFO + " -> " + WUtil.toIntTime(sOraInizio1, 0) + "," + WUtil.toIntTime(sOraFine1, 0) + ",1," + WUtil.toIntTime(sOraInizio2, 0) + "," + WUtil.toIntTime(sOraFine2, 0) + ",1");
          return new int[] { WUtil.toIntTime(sOraInizio1, 0), WUtil.toIntTime(sOraFine1, 0), 1, WUtil.toIntTime(sOraInizio2, 0), WUtil.toIntTime(sOraFine2, 0), 1};
        }
        else {
          String sOraInizio = sFO.substring(0,iSep1).trim();
          String sOraFine   = sFO.substring(iSep1+3).trim();
          System.out.println(sFO + " -> " + WUtil.toIntTime(sOraInizio, 0) + "," + WUtil.toIntTime(sOraFine, 0) + ",1");
          return new int[] { WUtil.toIntTime(sOraInizio, 0), WUtil.toIntTime(sOraFine, 0), 1 };
        }
      }
      else {
        String sOraInizio = sFO.substring(0,iSep1).trim();
        String sOraFine   = sFO.substring(iSep1+3).trim();
        System.out.println(sFO + " -> " + WUtil.toIntTime(sOraInizio, 0) + "," + WUtil.toIntTime(sOraFine, 0) + ",1");
        return new int[] { WUtil.toIntTime(sOraInizio, 0), WUtil.toIntTime(sOraFine, 0), 1 };
      }
    }
    System.out.println(sFO + " -> 9,18,0");
    return new int[] { 900, 1800, 0 };
  }
  
  public static
  List<AgendaModello> getAgendeModelli(String[] asOrari_1, String[] asOrari_2, int iWeekNum, boolean settAlt)
  {
    List<AgendaModello> listResult = new ArrayList<AgendaModello>();
    
    if(settAlt) {
      boolean boDispari1 = (iWeekNum % 2 == 0) ? false : true;
      boolean boPari1    = (iWeekNum % 2 == 0) ? true  : false;
      boolean boDispari2 = (iWeekNum % 2 == 0) ? true  : false;
      boolean boPari2    = (iWeekNum % 2 == 0) ? false : true;
      
      for(int iGiorno = 1; iGiorno <= 7; iGiorno++) {
        int iProgressivo = 0;
        
        // Settimana Corrente
        int[] aiFasceOrarie = getFasceOrarie(asOrari_1, iGiorno);
        if(aiFasceOrarie == null || aiFasceOrarie.length < 3 || aiFasceOrarie[2] == 0) {
          continue;
        }
        
        iProgressivo++;
        AgendaModello am = new AgendaModello();
        am.setGiorno(iGiorno);
        am.setOraInizio(aiFasceOrarie[0]);
        am.setOraFine(aiFasceOrarie[1]);
        am.setTipologia("O");
        am.setValore(DataUtil.diffMinutes(aiFasceOrarie[1], aiFasceOrarie[0]));
        am.setAttivo(true);
        am.setProgressivo(iProgressivo);
        am.setSettDispari(boDispari1);
        am.setSettPari(boPari1);
        am.setPrenOnLine(true);
        listResult.add(am);
        
        if(aiFasceOrarie.length >= 6) {
          iProgressivo++;
          am = new AgendaModello();
          am.setGiorno(iGiorno);
          am.setOraInizio(aiFasceOrarie[3]);
          am.setOraFine(aiFasceOrarie[4]);
          am.setTipologia("O");
          am.setValore(DataUtil.diffMinutes(aiFasceOrarie[4], aiFasceOrarie[3]));
          am.setAttivo(true);
          am.setProgressivo(iProgressivo);
          am.setSettDispari(boDispari1);
          am.setSettPari(boPari1);
          am.setPrenOnLine(true);
          listResult.add(am);
        }
        
        // Settimana Successiva
        aiFasceOrarie = getFasceOrarie(asOrari_2, iGiorno);
        if(aiFasceOrarie == null || aiFasceOrarie.length < 3 || aiFasceOrarie[2] == 0) {
          continue;
        }
        
        iProgressivo++;
        am = new AgendaModello();
        am.setGiorno(iGiorno);
        am.setOraInizio(aiFasceOrarie[0]);
        am.setOraFine(aiFasceOrarie[1]);
        am.setTipologia("O");
        am.setValore(DataUtil.diffMinutes(aiFasceOrarie[1], aiFasceOrarie[0]));
        am.setAttivo(true);
        am.setProgressivo(iProgressivo);
        am.setSettDispari(boDispari2);
        am.setSettPari(boPari2);
        am.setPrenOnLine(true);
        listResult.add(am);
        
        if(aiFasceOrarie.length >= 6) {
          iProgressivo++;
          am = new AgendaModello();
          am.setGiorno(iGiorno);
          am.setOraInizio(aiFasceOrarie[3]);
          am.setOraFine(aiFasceOrarie[4]);
          am.setTipologia("O");
          am.setValore(DataUtil.diffMinutes(aiFasceOrarie[4], aiFasceOrarie[3]));
          am.setAttivo(true);
          am.setProgressivo(iProgressivo);
          am.setSettDispari(boDispari2);
          am.setSettPari(boPari2);
          am.setPrenOnLine(true);
          listResult.add(am);
        }
      }
    }
    else {
      for(int iGiorno = 1; iGiorno <= 7; iGiorno++) {
        int iProgressivo = 0;
        
        int[] aiFasceOrarie = getFasceOrarie(asOrari_1, iGiorno);
        if(aiFasceOrarie == null || aiFasceOrarie.length < 3 || aiFasceOrarie[2] == 0) {
          continue;
        }
        
        iProgressivo++;
        AgendaModello am = new AgendaModello();
        am.setGiorno(iGiorno);
        am.setOraInizio(aiFasceOrarie[0]);
        am.setOraFine(aiFasceOrarie[1]);
        am.setTipologia("O");
        am.setValore(DataUtil.diffMinutes(aiFasceOrarie[1], aiFasceOrarie[0]));
        am.setAttivo(true);
        am.setProgressivo(iProgressivo);
        am.setSettDispari(true);
        am.setSettPari(true);
        am.setPrenOnLine(true);
        listResult.add(am);
        
        if(aiFasceOrarie.length >= 6) {
          iProgressivo++;
          am = new AgendaModello();
          am.setGiorno(iGiorno);
          am.setOraInizio(aiFasceOrarie[3]);
          am.setOraFine(aiFasceOrarie[4]);
          am.setTipologia("O");
          am.setValore(DataUtil.diffMinutes(aiFasceOrarie[4], aiFasceOrarie[3]));
          am.setAttivo(true);
          am.setProgressivo(iProgressivo);
          am.setSettDispari(true);
          am.setSettPari(true);
          am.setPrenOnLine(true);
          listResult.add(am);
        }
      }
    }
    
    return listResult;
  }
}