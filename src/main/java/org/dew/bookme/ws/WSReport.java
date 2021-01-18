package org.dew.bookme.ws;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import org.util.WMap;
import org.util.WUtil;

import org.dew.bookme.bl.User;
import org.dew.bookme.util.ConnectionManager;
import org.dew.bookme.util.DataUtil;
import org.dew.bookme.util.WSContext;

public 
class WSReport 
{
  protected static Logger logger = Logger.getLogger(WSReport.class);
  
  public static
  List<Map<String,Object>> getProduttivita(Map<String,Object> mapFilter)
      throws Exception
  {
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    if(mapFilter == null || mapFilter.isEmpty()) {
      return listResult;
    }
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    WMap wmFilter = new WMap(mapFilter);
    int iIdFar = wmFilter.getInt("idFar");
    
    int iAnnoMese = wmFilter.getInt("mese");
    Calendar calDal = null;
    Calendar calAl   = null;
    if(iAnnoMese > 200000) {
      calDal = new GregorianCalendar(iAnnoMese / 100, (iAnnoMese % 100) - 1, 1);
      
      calAl   = new GregorianCalendar(iAnnoMese / 100, (iAnnoMese % 100) - 1, 1);
      calAl.add(Calendar.MONTH, 1);
      calAl.add(Calendar.DATE, -1);
    }
    else {
      calDal = wmFilter.getCalendar("dal", null);
      if(calDal == null) {
        calDal = Calendar.getInstance();
        calDal.set(Calendar.DATE, 1);
      }
      calAl = wmFilter.getCalendar("al",  null);
      if(calAl == null) {
        calAl   = Calendar.getInstance();
        calAl.set(Calendar.DATE,  1);
        calAl.add(Calendar.MONTH, 1);
        calAl.add(Calendar.DATE, -1);
      }
    }
    
    calDal  = WUtil.setTime(calDal,  0);
    java.sql.Date dDal = new java.sql.Date(calDal.getTimeInMillis());
    calAl  = WUtil.setTime(calAl,  0);
    java.sql.Date dAl  = new java.sql.Date(calAl.getTimeInMillis());
    calAl  = WUtil.setTime(calAl,  2359);
    
    // Query per ottenere la mappa collaboratore - minuti liberi
    String sSQL_C = "SELECT O.NOME,C.MINUTI ";
    sSQL_C += "FROM PRZ_CALENDARIO C,PRZ_COLLABORATORI O ";
    sSQL_C += "WHERE C.ID_COLLABORATORE=O.ID AND C.ID_GRU=? ";
    if(iIdFar != 0) {
      sSQL_C += "AND C.ID_FAR=? ";
    }
    sSQL_C += "AND C.DATA_CALENDARIO>=? AND C.DATA_CALENDARIO<=? AND C.STATO='S' ";
    
    // Escludere MARCATORE=-1 (annullata prenotazione con STATO=N)
    String sSQL_A = "SELECT ID_COLLABORATORE,COUNT(*) COUNT_A FROM PRZ_PRENOTAZIONI WHERE ID_GRU=? ";
    if(iIdFar != 0) sSQL_A += "AND ID_FAR=? ";
    sSQL_A += "AND DATA_APPUNTAMENTO>=? AND DATA_APPUNTAMENTO<=? AND STATO='A' AND (MARCATORE IS NULL OR MARCATORE<>-1) AND FLAG_ATTIVO=1 ";
    sSQL_A += "GROUP BY ID_COLLABORATORE";
    
    // Includere STATO='A' AND MARCATORE=-1 (annullata prenotazione con STATO=N)
    String sSQL_N = "SELECT ID_COLLABORATORE,COUNT(*) COUNT_N FROM PRZ_PRENOTAZIONI WHERE ID_GRU=? ";
    if(iIdFar != 0) sSQL_N += "AND ID_FAR=? ";
    sSQL_N += "AND DATA_APPUNTAMENTO>=? AND DATA_APPUNTAMENTO<=? AND (STATO='N' OR (STATO='A' AND MARCATORE=-1)) AND FLAG_ATTIVO=1 ";
    sSQL_N += "GROUP BY ID_COLLABORATORE";
    
    // Query sulle prenotazioni per ottenere le altre misure
    String sSQL_P = "SELECT C.ID_FAR,C.ID,C.NOME,COUNT(UNIQUE Z.ID_CLIENTE) CLI,COUNT(UNIQUE Z.ID_PRESTAZIONE) PRE,COUNT(*) ESE,SUM(P.DURATA) DUR,SUM(P.PREZZO_FINALE) VAL,SUM(P.PUNTI_COLLAB) PTI,MAX(A.COUNT_A) ANN,MAX(N.COUNT_N) NES ";
    sSQL_P += "FROM PRZ_PRENOTAZIONI Z,PRZ_PRESTAZIONI P,PRZ_COLLABORATORI C,";
    sSQL_P += "(" + sSQL_A + ") A,"; // ANNULLATI
    sSQL_P += "(" + sSQL_N + ") N "; // NON ESEGUITI
    sSQL_P += "WHERE Z.ID_PRESTAZIONE=P.ID AND Z.ID_COLLABORATORE=C.ID ";
    sSQL_P += "AND Z.ID_COLLABORATORE=A.ID_COLLABORATORE(+) AND Z.ID_COLLABORATORE=N.ID_COLLABORATORE(+) ";
    sSQL_P += "AND Z.ID_GRU=? ";
    if(iIdFar != 0) sSQL_P += "AND Z.ID_FAR=? ";
    sSQL_P += "AND Z.DATA_APPUNTAMENTO>=? AND Z.DATA_APPUNTAMENTO<=? ";
    sSQL_P += "AND Z.STATO NOT IN ('A','N') AND Z.FLAG_ATTIVO=1 ";
    sSQL_P += "AND P.DESCRIZIONE NOT IN ('OCCUPATO','occupato','RECEPTION') ";
    sSQL_P += "GROUP BY C.ID_FAR,C.ID,C.NOME ";
    sSQL_P += "ORDER BY PTI DESC,C.NOME ";
    
    Map<String,Integer> mapMinutiLiberi = new HashMap<String,Integer>();
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL_C);
      // C
      pstm.setInt(++p,  iIdGru);
      if(iIdFar != 0) {
        pstm.setInt(++p,  iIdFar);
      }
      pstm.setDate(++p, dDal);
      pstm.setDate(++p, dAl);
      rs = pstm.executeQuery();
      while(rs.next()) {
        String sNomeColl  = rs.getString("NOME");
        int iMinutiLiberi = rs.getInt("MINUTI");
        if(iMinutiLiberi < 0) iMinutiLiberi = 0;
        
        Integer oTotaleMinutiLib = mapMinutiLiberi.get(sNomeColl);
        if(oTotaleMinutiLib == null) {
          mapMinutiLiberi.put(sNomeColl, iMinutiLiberi);
        }
        else {
          mapMinutiLiberi.put(sNomeColl, oTotaleMinutiLib.intValue() + iMinutiLiberi);
        }
      }
      rs.close();
      pstm.close();
      
      p = 0;
      pstm = conn.prepareStatement(sSQL_P);
      // A
      pstm.setInt(++p,  iIdGru);
      if(iIdFar != 0) {
        pstm.setInt(++p,  iIdFar);
      }
      pstm.setDate(++p, dDal);
      pstm.setDate(++p, dAl);
      // N
      pstm.setInt(++p,  iIdGru);
      if(iIdFar != 0) {
        pstm.setInt(++p,  iIdFar);
      }
      pstm.setDate(++p, dDal);
      pstm.setDate(++p, dAl);
      // Z
      pstm.setInt(++p,  iIdGru);
      if(iIdFar != 0) {
        pstm.setInt(++p,  iIdFar);
      }
      pstm.setDate(++p, dDal);
      pstm.setDate(++p, dAl);
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iIdFarCollab  = rs.getInt("ID_FAR");
        int    iIdCollab     = rs.getInt("ID");
        String sNomeCollab   = rs.getString("NOME");
        int    iClienti      = rs.getInt("CLI");
        int    iPrestazioni  = rs.getInt("PRE");
        int    iEseguiti     = rs.getInt("ESE");
        int    iSumDurata    = rs.getInt("DUR");
        double dValore       = rs.getDouble("VAL");
        int    iSumPunti     = rs.getInt("PTI");
        int    iTraAnnullati = rs.getInt("ANN");
        int    iTraNonEseg   = rs.getInt("NES");
        
        Integer oTotMinutiLib = mapMinutiLiberi.get(sNomeCollab);
        
        int iTempoLibero  = oTotMinutiLib != null ? oTotMinutiLib.intValue() : 0;
        if(iTempoLibero < 0) iTempoLibero = 0;
        if(iClienti == 0) iClienti = 1;
        int iTotMinuti    = iSumDurata + iTempoLibero;
        if (iTotMinuti < 1) iTotMinuti = 1;
        
        double dRapEseClienti = WUtil.round2(((double) iEseguiti) / ((double) iClienti));
        int iPercDurataTotale = (iSumDurata * 100) / iTotMinuti;
        int iPercLiberoTotale = 100 - iPercDurataTotale;
        int iProduttivita     = (((int) dValore) / 10);
        
        double dSumDurata = DataUtil.minutesToHHMM(iSumDurata);
        double dTotMinuti = DataUtil.minutesToHHMM(iTotMinuti);
        double dTempoLib  = DataUtil.minutesToHHMM(iTempoLibero);
        
        double dIndiceProd = WUtil.round2((double) iProduttivita / dTotMinuti);
        if(iPercLiberoTotale < 0) iPercLiberoTotale = 0;
        
        Map<String,Object> mapRecord = new HashMap<String, Object>(17);
        mapRecord.put("idf", iIdFarCollab);
        mapRecord.put("ico", iIdCollab);
        mapRecord.put("col", sNomeCollab);
        mapRecord.put("cli", iClienti);
        mapRecord.put("pre", iPrestazioni);
        mapRecord.put("ese", iEseguiti);
        mapRecord.put("dur", dSumDurata);
        mapRecord.put("val", iProduttivita);
        mapRecord.put("pti", iSumPunti);
        mapRecord.put("tmi", dTotMinuti);
        mapRecord.put("tli", dTempoLib);
        mapRecord.put("rec", dRapEseClienti);
        mapRecord.put("pte", iPercDurataTotale);
        mapRecord.put("ptl", iPercLiberoTotale);
        mapRecord.put("ipo", dIndiceProd);
        mapRecord.put("ann", iTraAnnullati);
        mapRecord.put("nes", iTraNonEseg);
        
        listResult.add(mapRecord);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSReport.getProduttivita(" + mapFilter + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  Map<String,Object> getGrafici(Map<String,Object> mapFilter)
      throws Exception
  {
    Map<String,Object> mapResult = new HashMap<String,Object>();
    
    if(mapFilter == null || mapFilter.isEmpty()) {
      return mapResult;
    }
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    WMap wmFilter = new WMap(mapFilter);
    int iIdFar = wmFilter.getInt("idFar");
    if(iIdFar == 0) {
      return mapResult;
    }
    
    int iAnnoMese = wmFilter.getInt("mese");
    Calendar calDal = null;
    Calendar calAl   = null;
    if(iAnnoMese > 200000) {
      calDal = new GregorianCalendar(iAnnoMese / 100, (iAnnoMese % 100) - 1, 1);
      
      calAl   = new GregorianCalendar(iAnnoMese / 100, (iAnnoMese % 100) - 1, 1);
      calAl.add(Calendar.MONTH, 1);
      calAl.add(Calendar.DATE, -1);
    }
    else {
      calDal = wmFilter.getCalendar("dal", null);
      if(calDal == null) {
        calDal = Calendar.getInstance();
        calDal.set(Calendar.DATE, 1);
      }
      calAl = wmFilter.getCalendar("al",  null);
      if(calAl == null) {
        calAl   = Calendar.getInstance();
        calAl.set(Calendar.DATE,  1);
        calAl.add(Calendar.MONTH, 1);
        calAl.add(Calendar.DATE, -1);
      }
    }
    
    calDal  = WUtil.setTime(calDal,  0);
    java.sql.Date dDal = new java.sql.Date(calDal.getTimeInMillis());
    calAl  = WUtil.setTime(calAl,  0);
    java.sql.Date dAl  = new java.sql.Date(calAl.getTimeInMillis());
    calAl  = WUtil.setTime(calAl,  2359);
    
    String sSQL_CV = "SELECT C.NOME,COUNT(*) ESE,SUM(Z.PREZZO_FINALE) VAL ";
    sSQL_CV += "FROM PRZ_PRENOTAZIONI Z,PRZ_COLLABORATORI C ";
    sSQL_CV += "WHERE Z.ID_COLLABORATORE=C.ID ";
    sSQL_CV += "AND Z.ID_GRU=? AND Z.ID_FAR=? AND Z.DATA_APPUNTAMENTO>=? AND Z.DATA_APPUNTAMENTO<=? ";
    sSQL_CV += "AND Z.STATO NOT IN ('A','N') AND Z.FLAG_ATTIVO=1 ";
    sSQL_CV += "GROUP BY C.NOME ";
    sSQL_CV += "ORDER BY C.NOME";
    
    String sSQL_PEV = "SELECT G.DESCRIZIONE,COUNT(*) ESE,SUM(Z.PREZZO_FINALE) VAL ";
    sSQL_PEV += "FROM PRZ_PRENOTAZIONI Z,PRZ_PRESTAZIONI P,PRZ_PRESTAZIONI_GRUPPI G ";
    sSQL_PEV += "WHERE Z.ID_PRESTAZIONE=P.ID AND P.ID_GRUPPO_PRE=G.ID ";
    sSQL_PEV += "AND Z.ID_GRU=? AND Z.ID_FAR=? AND Z.DATA_APPUNTAMENTO>=? AND Z.DATA_APPUNTAMENTO<=? ";
    sSQL_PEV += "AND Z.STATO NOT IN ('A','N') AND Z.FLAG_ATTIVO=1 ";
    sSQL_PEV += "GROUP BY G.DESCRIZIONE ";
    sSQL_PEV += "ORDER BY G.DESCRIZIONE";
    
    String sSQL_GV = "SELECT Z.DATA_APPUNTAMENTO,SUM(Z.PREZZO_FINALE) VAL ";
    sSQL_GV += "FROM PRZ_PRENOTAZIONI Z ";
    sSQL_GV += "WHERE Z.ID_GRU=? AND Z.ID_FAR=? AND Z.DATA_APPUNTAMENTO>=? AND Z.DATA_APPUNTAMENTO<=? ";
    sSQL_GV += "AND Z.STATO NOT IN ('A','N') AND Z.FLAG_ATTIVO=1 ";
    sSQL_GV += "GROUP BY Z.DATA_APPUNTAMENTO ";
    sSQL_GV += "ORDER BY Z.DATA_APPUNTAMENTO";
    
    // Collaboratore - Eseguiti (CE)
    List<String> list_CE_labels = new ArrayList<String>();
    List<Number> list_CE_serie0 = new ArrayList<Number>();
    // Collaboratore - Valore (CV)
    List<String> list_CV_labels = new ArrayList<String>();
    List<Number> list_CV_serie0 = new ArrayList<Number>();
    // Prestazione - Eseguiti (PE)
    List<String> list_PE_labels = new ArrayList<String>();
    List<Number> list_PE_serie0 = new ArrayList<Number>();
    // Prestazione - Valore (PV)
    List<String> list_PV_labels = new ArrayList<String>();
    List<Number> list_PV_serie0 = new ArrayList<Number>();
    // Prestazione - Percentuale (PP)
    List<String> list_PP_labels = new ArrayList<String>();
    List<Number> list_PP_serie0 = new ArrayList<Number>();
    // Giorno - Valore (GV)
    List<String> list_GV_labels = new ArrayList<String>();
    List<Number> list_GV_serie0 = new ArrayList<Number>();
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      p = 0;
      pstm = conn.prepareStatement(sSQL_CV);
      pstm.setInt(++p,  iIdGru);
      pstm.setInt(++p,  iIdFar);
      pstm.setDate(++p, dDal);
      pstm.setDate(++p, dAl);
      rs = pstm.executeQuery();
      while(rs.next()) {
        String sCollaboratore = rs.getString("NOME");
        int    iEseguiti      = rs.getInt("ESE");
        double dValore        = rs.getDouble("VAL");
        
        list_CE_labels.add(sCollaboratore);
        list_CE_serie0.add(iEseguiti);
        
        list_CV_labels.add(sCollaboratore);
        list_CV_serie0.add(dValore);
      }
      rs.close();
      pstm.close();
      
      double dTotValore = 0.0;
      p = 0;
      pstm = conn.prepareStatement(sSQL_PEV);
      pstm.setInt(++p,  iIdGru);
      pstm.setInt(++p,  iIdFar);
      pstm.setDate(++p, dDal);
      pstm.setDate(++p, dAl);
      rs = pstm.executeQuery();
      while(rs.next()) {
        String sPrestazione = rs.getString("DESCRIZIONE");
        int    iEseguiti    = rs.getInt("ESE");
        double dValore      = rs.getDouble("VAL");
        
        dTotValore += dValore;
        
        if(sPrestazione != null && sPrestazione.length() > 16) {
          sPrestazione = sPrestazione.substring(0, 13) + "...";
        }
        
        list_PE_labels.add(sPrestazione);
        list_PE_serie0.add(iEseguiti);
        
        list_PV_labels.add(sPrestazione);
        list_PV_serie0.add(dValore);
      }
      rs.close();
      pstm.close();
      
      
      for(int i = 0; i < list_PV_labels.size(); i++) {
        list_PP_labels.add(list_PV_labels.get(i));
        double dValore = WUtil.toDouble(list_PV_serie0.get(i), 0.0d);
        double dPerc = 0.0d;
        if(dTotValore > 0.0d) {
          dPerc = WUtil.round2(dValore * 100.0d / dTotValore);
        }
        list_PP_serie0.add(dPerc);
      }
      
      p = 0;
      pstm = conn.prepareStatement(sSQL_GV);
      pstm.setInt(++p,  iIdGru);
      pstm.setInt(++p,  iIdFar);
      pstm.setDate(++p, dDal);
      pstm.setDate(++p, dAl);
      rs = pstm.executeQuery();
      while(rs.next()) {
        Date dDataApp  = rs.getDate("DATA_APPUNTAMENTO");
        double dValore = rs.getDouble("VAL");
        
        list_GV_labels.add(WUtil.formatDate(dDataApp, "-"));
        list_GV_serie0.add(dValore);
      }
      rs.close();
      pstm.close();
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSReport.getGrafici(" + mapFilter + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    
    mapResult.put("ce", DataUtil.buildChartData(list_CE_labels, list_CE_serie0));
    mapResult.put("cv", DataUtil.buildChartData(list_CV_labels, list_CV_serie0));
    mapResult.put("pe", DataUtil.buildChartData(list_PE_labels, list_PE_serie0));
    mapResult.put("pv", DataUtil.buildChartData(list_PV_labels, list_PV_serie0));
    mapResult.put("pp", DataUtil.buildChartData(list_PP_labels, list_PP_serie0));
    mapResult.put("gv", DataUtil.buildChartData(list_GV_labels, list_GV_serie0));
    
    return mapResult;
  }
  
  public static
  List<Map<String,Object>> getMessaggi(Map<String,Object> mapFilter)
      throws Exception
  {
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    if(mapFilter == null || mapFilter.isEmpty()) {
      return listResult;
    }
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    WMap wmFilter = new WMap(mapFilter);
    int iIdFar = wmFilter.getInt("idFar");
    if(iIdFar == 0) {
      return listResult;
    }
    
    int iAnnoMese = wmFilter.getInt("mese");
    Calendar calDal = null;
    Calendar calAl   = null;
    if(iAnnoMese > 200000) {
      calDal = new GregorianCalendar(iAnnoMese / 100, (iAnnoMese % 100) - 1, 1);
      
      calAl   = new GregorianCalendar(iAnnoMese / 100, (iAnnoMese % 100) - 1, 1);
      calAl.add(Calendar.MONTH, 1);
      calAl.add(Calendar.DATE, -1);
    }
    else {
      calDal = wmFilter.getCalendar("dal", null);
      if(calDal == null) {
        calDal = Calendar.getInstance();
        calDal.set(Calendar.DATE, 1);
      }
      calAl = wmFilter.getCalendar("al",  null);
      if(calAl == null) {
        calAl   = Calendar.getInstance();
        calAl.set(Calendar.DATE,  1);
        calAl.add(Calendar.MONTH, 1);
        calAl.add(Calendar.DATE, -1);
      }
    }
    
    calDal = WUtil.setTime(calDal,  0);
    calAl  = WUtil.setTime(calAl,  2359);
    
    int iYYYYMM = calDal.get(Calendar.YEAR) * 100 + (calDal.get(Calendar.MONTH) + 1);
    
    String sSQL = null;
    if(iYYYYMM >= 201906) {
      // Passaggio alla gestione centralizzata della messaggistica (App)
      sSQL = "SELECT TO_CHAR(DATA_INSERT,'YYYYMMDD') DATA,COUNT(UNIQUE ID_CLIENTE) CLI,COUNT(*) MSG,SUM(1-INVIATO) ERR ";
      sSQL += "FROM LOG_SMS ";
      sSQL += "WHERE ID_GRU=? AND ID_FAR=? AND DATA_INSERT>=? AND DATA_INSERT<=? ";
      sSQL += "GROUP BY TO_CHAR(DATA_INSERT,'YYYYMMDD') ";
      sSQL += "ORDER BY 1";
    }
    else {
      sSQL = "SELECT TO_CHAR(DATA_INSERT,'YYYYMMDD') DATA,COUNT(UNIQUE ID_CLIENTE) CLI,COUNT(*) MSG,SUM(1-INVIATO) ERR ";
      sSQL += "FROM PRZ_LOG_SMS ";
      sSQL += "WHERE ID_GRU=? AND ID_FAR=? AND DATA_INSERT>=? AND DATA_INSERT<=? ";
      sSQL += "GROUP BY TO_CHAR(DATA_INSERT,'YYYYMMDD') ";
      sSQL += "ORDER BY 1";
    }
    
    int iTotMsg = 0;
    int iTotErr = 0;
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,       iIdGru);
      pstm.setInt(++p,       iIdFar);
      pstm.setTimestamp(++p, new java.sql.Timestamp(calDal.getTimeInMillis()));
      pstm.setTimestamp(++p, new java.sql.Timestamp(calAl.getTimeInMillis()));
      rs = pstm.executeQuery();
      while(rs.next()) {
        String sData     = rs.getString("DATA");
        int    iClienti  = rs.getInt("CLI");
        int    iMessaggi = rs.getInt("MSG");
        int    iErrori   = rs.getInt("ERR");
        
        Date dData = WUtil.toDate(sData, null);
        if(dData == null) continue;
        
        Map<String,Object> mapRecord = new HashMap<String, Object>();
        mapRecord.put("dat", WUtil.formatDate(dData, "-"));
        mapRecord.put("cli", iClienti);
        mapRecord.put("msg", iMessaggi);
        mapRecord.put("err", iErrori);
        
        iTotMsg += iMessaggi;
        iTotErr += iErrori;
        
        listResult.add(mapRecord);
      }
      
      Map<String,Object> mapRecord = new HashMap<String, Object>();
      mapRecord.put("dat", "Totali");
      mapRecord.put("msg", iTotMsg);
      mapRecord.put("err", iTotErr);
      
      listResult.add(mapRecord);
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSReport.getMessaggi(" + mapFilter + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
}
