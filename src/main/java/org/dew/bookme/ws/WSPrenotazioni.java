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
import java.util.List;

import javax.transaction.UserTransaction;

import org.apache.log4j.Logger;

import org.util.WList;
import org.util.WMap;
import org.util.WUtil;

import org.dew.bookme.bl.Calendario;
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
class WSPrenotazioni 
{
  protected static Logger logger = Logger.getLogger(WSPrenotazioni.class);
  
  public static
  List<Prenotazione> find(Prenotazione filter)
      throws Exception
  {
    logger.debug("WSPrenotazioni.find(" + filter + ")...");
    Connection conn = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      return find(conn, filter, false);
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSPrenotazioni.find", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
  }
  
  public static
  List<Prenotazione> findLog(Prenotazione filter)
      throws Exception
  {
    logger.debug("WSPrenotazioni.findLog(" + filter + ")...");
    Connection conn = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      return find(conn, filter, true);
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSPrenotazioni.findLog", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
  }
  
  public static
  List<Prenotazione> find(Connection conn, Prenotazione filter, boolean boFromLog)
      throws Exception
  {
    logger.debug("WSPrenotazioni.find(Connection," + filter + "," + boFromLog + ")...");
    List<Prenotazione> listResult = new ArrayList<Prenotazione>();
    
    if(filter == null) return listResult;
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    int iFIdFar       = filter.getIdFar();
    int iFIdCliente   = filter.getIdCliente();
    Date dFDallaData  = WUtil.toSQLDate(filter.getDataApp(),  null);
    Date dFAllaData   = WUtil.toSQLDate(filter.getAllaData(), null);
    if(iFIdCliente == 0) {
      int iMese = WUtil.toInt(filter.getPreferenze(), 0);
      if(dFDallaData == null) {
        if(iMese > 200001 && iMese < 999912) {
          int iDataDal = iMese * 100 + 01;
          Calendar calDataDal = WUtil.toCalendar(iDataDal, 0);
          dFDallaData = WUtil.toSQLDate(calDataDal != null ? calDataDal : WUtil.getCurrentDate(), null);
        }
        else {
          dFDallaData = new java.sql.Date(WUtil.getCurrentDate().getTimeInMillis());
        }
      }
      if(dFAllaData  == null) {
        if(iMese > 200001 && iMese < 999912) {
          int iDataAl = iMese * 100 + 01;
          Calendar calDataAl = WUtil.toCalendar(iDataAl, 0);
          if(calDataAl != null) {
            calDataAl.add(Calendar.MONTH, 1);
            calDataAl.add(Calendar.DATE, -1);
            dFAllaData = new java.sql.Date(calDataAl.getTimeInMillis());
          }
          else {
            dFAllaData = dFDallaData;
          }
        }
        else {
          dFAllaData = dFDallaData;
        }
      }
    }
    int iFIdColl      = filter.getIdColl();
    int iFIdPrestaz   = filter.getIdPrest();
    int iFIdAttrezz   = filter.getIdAttr();
    Date dFDataPren   = WUtil.toSQLDate(filter.getDataPren(), null);
    String sFStato    = filter.getStato();
    boolean boFPOL    = filter.isPrenOnLine();
    String sFDesPrest = filter.getDescPrest();
    String sFUserDesk = filter.getUserDesk();
    String sFOperaz   = null;
    boolean boFltCal  = false;
    if(boFromLog) {
      if(sFUserDesk != null && sFUserDesk.length() == 1) {
        if(sFUserDesk.equals("?") || sFUserDesk.equals("*")) {
          boFltCal   = true;
          sFUserDesk = null;
        }
        else {
          sFOperaz   = sFUserDesk.toUpperCase() + "%";
          sFUserDesk = null;
        }
      }
    }
    
    String sSQL = "SELECT ";
    if(boFromLog) {
      sSQL += "Z.ID,L.DATA_INSERT,L.UTENTE_DESK,L.OPERAZIONE,L.DATA_CALENDARIO,L.LOG_NOTE,";
      sSQL += "Z.DATA_UPDATE,L.ID_FAR,S.CODICE COD_FAR,S.DESCRIZIONE DES_FAR,Z.CODICE,Z.DATA_APPUNTAMENTO,Z.ORA_APPUNTAMENTO,Z.DURATA,Z.STATO,Z.PREN_ONLINE,Z.FLAG_PAGATO,Z.PREZZO_FINALE,Z.OVERBOOKING,Z.NOTE,Z.CODICE_COUPON,Z.CAUSALE,";
    }
    else {
      sSQL += "Z.ID,Z.DATA_INSERT,Z.UTENTE_DESK,";
      sSQL += "Z.DATA_UPDATE,Z.ID_FAR,S.CODICE COD_FAR,S.DESCRIZIONE DES_FAR,Z.CODICE,Z.DATA_APPUNTAMENTO,Z.ORA_APPUNTAMENTO,Z.DURATA,Z.STATO,Z.PREN_ONLINE,Z.FLAG_PAGATO,Z.PREZZO_FINALE,Z.OVERBOOKING,Z.NOTE,Z.CODICE_COUPON,Z.CAUSALE,";
    }
    sSQL += "Z.ID_COLLABORATORE,O.NOME NOME_COLL,O.COLORE,";
    sSQL += "Z.ID_CLIENTE,C.COGNOME,C.NOME,C.TELEFONO_1,C.TELEFONO_2,C.EMAIL,";
    sSQL += "Z.ID_PRESTAZIONE,P.DESCRIZIONE DESC_PREST,Z.ID_ATTREZZATURA,A.DESCRIZIONE DESC_ATTREZZ,Z.MARCATORE ";
    if(boFromLog) {
      sSQL += "FROM PRZ_LOG_OPERAZIONI L,PRZ_PRENOTAZIONI Z,PRZ_CLIENTI C,PRZ_COLLABORATORI O,PRZ_PRESTAZIONI P,PRZ_ATTREZZATURE A,PRZ_STRUTTURE S ";
      sSQL += "WHERE L.ID_PRENOTAZIONE=Z.ID AND Z.ID_CLIENTE=C.ID AND Z.ID_COLLABORATORE=O.ID AND Z.ID_PRESTAZIONE=P.ID AND Z.ID_ATTREZZATURA=A.ID AND L.ID_FAR=S.ID_FAR ";
      // sSQL += "AND Z.FLAG_ATTIVO=1 ";
    }
    else {
      sSQL += "FROM PRZ_PRENOTAZIONI Z,PRZ_CLIENTI C,PRZ_COLLABORATORI O,PRZ_PRESTAZIONI P,PRZ_ATTREZZATURE A,PRZ_STRUTTURE S ";
      sSQL += "WHERE Z.ID_CLIENTE=C.ID AND Z.ID_COLLABORATORE=O.ID AND Z.ID_PRESTAZIONE=P.ID AND Z.ID_ATTREZZATURA=A.ID AND Z.ID_FAR=S.ID_FAR ";
      sSQL += "AND Z.FLAG_ATTIVO=1 ";
    }
    if(boFromLog) {
      sSQL += "AND L.ID_GRU=? ";
      if(iFIdFar     !=    0) {
        sSQL += "AND L.ID_FAR=? ";
      }
    }
    else {
      sSQL += "AND Z.ID_GRU=? ";
      if(iFIdFar     !=    0) {
        sSQL += "AND Z.ID_FAR=? ";
      }
    }
    if(boFromLog) {
      if(dFDallaData != null) {
        if(boFltCal) {
          sSQL += "AND L.DATA_CALENDARIO>=? ";
        }
        else {
          sSQL += "AND L.DATA_INSERT>=? ";
        }
      }
      if(dFAllaData  != null) {
        if(boFltCal) {
          sSQL += "AND L.DATA_CALENDARIO<? ";
        }
        else {
          sSQL += "AND L.DATA_INSERT<=? ";
        }
      }
    }
    else {
      if(dFDallaData != null) sSQL += "AND Z.DATA_APPUNTAMENTO>=? ";
      if(dFAllaData  != null) sSQL += "AND Z.DATA_APPUNTAMENTO<=? ";
    }
    if(iFIdCliente !=    0) sSQL += "AND Z.ID_CLIENTE=? ";
    if(iFIdColl    !=    0) sSQL += "AND Z.ID_COLLABORATORE=? ";
    if(iFIdPrestaz !=    0) sSQL += "AND Z.ID_PRESTAZIONE=? ";
    if(iFIdAttrezz !=    0) sSQL += "AND Z.ID_ATTREZZATURA=? ";
    if(dFDataPren  != null) sSQL += "AND Z.DATA_INSERT=? ";
    if(boFPOL)              sSQL += "AND Z.PREN_ONLINE=? ";
    if(sFDesPrest  != null && sFDesPrest.length() > 0) {
      sSQL += "AND UPPER(P.DESCRIZIONE) LIKE ? ";
    }
    if(sFStato != null && sFStato.length() != 0) {
      if(sFStato.equals("N")) {
        sSQL += "AND (Z.STATO=? OR (Z.STATO='A' AND Z.MARCATORE=-1)) ";
      }
      else if(!sFStato.equals("*")) {
        sSQL += "AND Z.STATO=? ";
      }
    }
    if(sFUserDesk != null && sFUserDesk.length() > 0) {
      if(boFromLog) {
        sSQL += "AND L.UTENTE_DESK LIKE ? ";
      }
      else {
        sSQL += "AND Z.UTENTE_DESK LIKE ? ";
      }
    }
    if(boFromLog && sFOperaz != null && sFOperaz.length() > 0) {
      sSQL += "AND L.OPERAZIONE LIKE ? ";
    }
    if(boFromLog) {
      sSQL += "ORDER BY L.DATA_INSERT ";
    }
    else {
      sSQL += "ORDER BY Z.DATA_APPUNTAMENTO,Z.ORA_APPUNTAMENTO,Z.ID_COLLABORATORE,C.COGNOME,C.NOME ";
    }
    
    int p = 0;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p, iIdGru);
      if(iFIdFar     !=    0) pstm.setInt(++p,  iFIdFar);
      if(dFDallaData != null) pstm.setDate(++p, dFDallaData);
      if(dFAllaData  != null) {
        if(boFromLog) {
          pstm.setDate(++p, DataUtil.addDays(dFAllaData, 1));
        }
        else {
          pstm.setDate(++p, dFAllaData);
        }
      }
      if(iFIdCliente !=    0) pstm.setInt(++p,  iFIdCliente);
      if(iFIdColl    !=    0) pstm.setInt(++p,  iFIdColl);
      if(iFIdPrestaz !=    0) pstm.setInt(++p,  iFIdPrestaz);
      if(iFIdAttrezz !=    0) pstm.setInt(++p,  iFIdAttrezz);
      if(dFDataPren  != null) pstm.setDate(++p, dFDataPren);
      if(boFPOL)              pstm.setInt(++p,  1);
      if(sFDesPrest  != null && sFDesPrest.length() > 0) {
        pstm.setString(++p, "%" + sFDesPrest.toUpperCase() + "%");
      }
      if(sFStato != null && sFStato.length() != 0) {
        if(!sFStato.equals("*")) pstm.setString(++p, sFStato);
      }
      if(sFUserDesk != null && sFUserDesk.length() > 0) {
        pstm.setString(++p, sFUserDesk.trim().toUpperCase());
      }
      if(boFromLog && sFOperaz != null && sFOperaz.length() > 0) {
        pstm.setString(++p, sFOperaz);
      }
      rs = pstm.executeQuery();
      while(rs.next()) {
        int     iId           = rs.getInt("ID");
        Timestamp tsDataIns   = rs.getTimestamp("DATA_INSERT");
        String  sOperazione   = null;
        Date    dDataCal      = null;
        String  sLogNote      = null;
        if(boFromLog) {
          sOperazione       = rs.getString("OPERAZIONE");
          dDataCal          = rs.getDate("DATA_CALENDARIO");
          sLogNote          = rs.getString("LOG_NOTE");
        }
        Timestamp tsDataUpd   = rs.getTimestamp("DATA_UPDATE");
        int     iIdFarPre     = rs.getInt("ID_FAR");
        String  sCodFar       = rs.getString("COD_FAR");
        String  sDesFar       = rs.getString("DES_FAR");
        String  sCodice       = rs.getString("CODICE");
        Date    dDataApp      = rs.getDate("DATA_APPUNTAMENTO");
        int     iOraApp       = rs.getInt("ORA_APPUNTAMENTO");
        int     iDurata       = rs.getInt("DURATA");
        String  sStato        = rs.getString("STATO");
        int     iPrenOnLine   = rs.getInt("PREN_ONLINE");
        int     iFlagPagato   = rs.getInt("FLAG_PAGATO");
        double  dPrezzoFinale = rs.getDouble("PREZZO_FINALE");
        int     iOverbooking  = rs.getInt("OVERBOOKING");
        int     iIdColl       = rs.getInt("ID_COLLABORATORE");
        String  sNomeColl     = rs.getString("NOME_COLL");
        String  sColore       = rs.getString("COLORE");
        int     iIdCliente    = rs.getInt("ID_CLIENTE");
        String  sCognome      = rs.getString("COGNOME");
        String  sNome         = rs.getString("NOME");
        String  sTelefono1    = rs.getString("TELEFONO_1");
        String  sTelefono2    = rs.getString("TELEFONO_2");
        String  sEmail        = rs.getString("EMAIL");
        int     iIdPrestaz    = rs.getInt("ID_PRESTAZIONE");
        String  sDescPrestaz  = rs.getString("DESC_PREST");
        int     iIdAttrezz    = rs.getInt("ID_ATTREZZATURA");
        String  sDescAttrezz  = rs.getString("DESC_ATTREZZ");
        String  sNote         = rs.getString("NOTE");
        String  sCodCoupon    = rs.getString("CODICE_COUPON");
        String  sCausale      = rs.getString("CAUSALE");
        String  sUserDesk     = rs.getString("UTENTE_DESK");
        int     iMarcatore    = rs.getInt("MARCATORE");
        
        if(sStato != null && sStato.equals("A")) {
          if(iMarcatore == -1) {
            if(sFStato != null && sFStato.equals("A")) {
              continue;
            }
            sStato = "N";
          }
          else {
            if(!boFromLog) {
              if(!"*".equals(sFStato)) {
                continue;
              }
            }
          }
        }
        
        int iHHA = iOraApp / 100;
        int iMMA = iOraApp % 100;
        int idxA = iHHA * 60 + iMMA;
        int idxF = idxA + iDurata;
        int iHHF = idxF / 60;
        int iMMF = idxF % 60;
        int iOraFine = iHHF * 100 + iMMF;
        
        Prenotazione prenotazione = new Prenotazione();
        prenotazione.setId(iId);
        prenotazione.setDataPren(tsDataIns);
        prenotazione.setDataUpd(tsDataUpd);
        prenotazione.setIdFar(iIdFarPre);
        prenotazione.setCodFar(sCodFar);
        prenotazione.setDesFar(sDesFar);
        if(iId != 0) {
          prenotazione.setCodice(sCodice);
          prenotazione.setDataApp(dDataApp);
          prenotazione.setOraApp(WUtil.formatTime(iOraApp, false, false));
          prenotazione.setOraFine(WUtil.formatTime(iOraFine, false, false));
          prenotazione.setDurata(iDurata);
          prenotazione.setStato(sStato);
          prenotazione.setPrenOnLine(iPrenOnLine != 0);
          prenotazione.setPagato(iFlagPagato != 0);
          prenotazione.setPrezzoFinale(dPrezzoFinale);
          prenotazione.setIdColl(iIdColl);
          prenotazione.setDescColl(sNomeColl);
          prenotazione.setColore(sColore);
          prenotazione.setIdCliente(iIdCliente);
          prenotazione.setDescCliente(sCognome + " " + sNome);
          prenotazione.setTel1(sTelefono1);
          prenotazione.setTel2(sTelefono2);
          prenotazione.setEmail(sEmail);
          prenotazione.setIdPrest(iIdPrestaz);
          prenotazione.setDescPrest(sDescPrestaz);
          prenotazione.setIdAttr(iIdAttrezz);
          prenotazione.setDescAttr(sDescAttrezz);
          prenotazione.setNote(sNote);
          prenotazione.setCodCoupon(sCodCoupon);
          prenotazione.setOverbooking(iOverbooking != 0);
          prenotazione.setCausale(sCausale);
        }
        else {
          prenotazione.setDataApp(dDataCal);
          if(sOperazione != null && sOperazione.length() > 0) {
            char c0 = sOperazione.charAt(0);
            if(c0 == 'O' || c0 == 'o' || c0 == 'C' || c0 == 'c') {
              prenotazione.setDescColl(sLogNote);
            }
            else {
              prenotazione.setNote(sLogNote);
            }
          }
          else {
            prenotazione.setNote(sLogNote);
          }
        }
        prenotazione.setUserDesk(sUserDesk);
        prenotazione.setMessaggio(sOperazione);
        
        listResult.add(prenotazione);
        if(listResult.size() > 4000) break;
      }
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return listResult;
  }
  
  public static
  List<Prenotazione> history(int iFIdCliente, int iAppIdFar, Date oAppDate)
      throws Exception
  {
    logger.debug("WSPrenotazioni.history(" + iFIdCliente + "," + iAppIdFar + "," + oAppDate + ")...");
    Connection conn = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      return history(conn, iFIdCliente, iAppIdFar, oAppDate);
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSPrenotazioni.history(" + iFIdCliente + "," + iAppIdFar + "," + oAppDate + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
  }
  
  public static
  List<Prenotazione> history(Connection conn, int iFIdCliente)
      throws Exception
  {
    return history(conn, iFIdCliente, 0, null);
  }
  
  public static
  List<Prenotazione> history(Connection conn, int iFIdCliente, int iFIdFar, Object oFDate)
      throws Exception
  {
    if(iFIdCliente == 0) {
      return new ArrayList<Prenotazione>(0);
    }
    
    Date dFDate = WUtil.toSQLDate(oFDate, null); 
    
    List<Prenotazione> listResult = new ArrayList<Prenotazione>();
    
    String sSQL = "SELECT ";
    sSQL += "Z.ID,Z.DATA_INSERT,Z.DATA_UPDATE,Z.ID_FAR,S.CODICE COD_FAR,S.DESCRIZIONE DES_FAR,Z.CODICE,Z.DATA_APPUNTAMENTO,Z.ORA_APPUNTAMENTO,Z.DURATA,Z.STATO,Z.PREN_ONLINE,Z.FLAG_PAGATO,Z.PREZZO_FINALE,Z.OVERBOOKING,Z.NOTE,Z.CODICE_COUPON,";
    sSQL += "Z.ID_COLLABORATORE,O.NOME NOME_COLL,O.COLORE,";
    sSQL += "Z.ID_PRESTAZIONE,P.DESCRIZIONE DESC_PREST,Z.ID_ATTREZZATURA,A.DESCRIZIONE DESC_ATTREZZ,Z.MARCATORE ";
    sSQL += "FROM PRZ_PRENOTAZIONI Z,PRZ_COLLABORATORI O,PRZ_PRESTAZIONI P,PRZ_ATTREZZATURE A,PRZ_STRUTTURE S ";
    sSQL += "WHERE Z.ID_COLLABORATORE=O.ID AND Z.ID_PRESTAZIONE=P.ID AND Z.ID_ATTREZZATURA=A.ID AND Z.ID_FAR=S.ID_FAR ";
    sSQL += "AND Z.ID_CLIENTE=? AND Z.FLAG_ATTIVO=1 ";
    if(iFIdFar != 0) {
      sSQL += "AND Z.ID_FAR=? ";
    }
    if(dFDate != null) {
      sSQL += "AND Z.DATA_APPUNTAMENTO=? ";
    }
    sSQL += "ORDER BY Z.DATA_APPUNTAMENTO DESC,Z.ORA_APPUNTAMENTO ";
    
    int p = 0;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,  iFIdCliente);
      if(iFIdFar != 0) {
        pstm.setInt(++p, iFIdFar);
      }
      if(dFDate != null) {
        pstm.setDate(++p, dFDate);
      }
      rs = pstm.executeQuery();
      while(rs.next()) {
        int     iId           = rs.getInt("ID");
        Date    dDataIns      = rs.getDate("DATA_INSERT");
        Date    dDataUpd      = rs.getDate("DATA_UPDATE");
        int     iIdFar        = rs.getInt("ID_FAR");
        String  sCodFar       = rs.getString("COD_FAR");
        String  sDesFar       = rs.getString("DES_FAR");
        String  sCodice       = rs.getString("CODICE");
        Date    dDataApp      = rs.getDate("DATA_APPUNTAMENTO");
        int     iOraApp       = rs.getInt("ORA_APPUNTAMENTO");
        int     iDurata       = rs.getInt("DURATA");
        String  sStato        = rs.getString("STATO");
        int     iPrenOnLine   = rs.getInt("PREN_ONLINE");
        int     iFlagPagato   = rs.getInt("FLAG_PAGATO");
        double  dPrezzoFinale = rs.getDouble("PREZZO_FINALE");
        int     iIdColl       = rs.getInt("ID_COLLABORATORE");
        String  sNomeColl     = rs.getString("NOME_COLL");
        String  sColore       = rs.getString("COLORE");
        int     iIdPrestaz    = rs.getInt("ID_PRESTAZIONE");
        String  sDescPrestaz  = rs.getString("DESC_PREST");
        int     iIdAttrezz    = rs.getInt("ID_ATTREZZATURA");
        String  sDescAttrezz  = rs.getString("DESC_ATTREZZ");
        int     iOverbooking  = rs.getInt("OVERBOOKING");
        String  sNote         = rs.getString("NOTE");
        String  sCodCoupon    = rs.getString("CODICE_COUPON");
        int     iMarcatore    = rs.getInt("MARCATORE");
        
        if(sStato != null && sStato.equals("A")) {
          if(iMarcatore == -1) {
            sStato = "N";
          }
          else {
            continue;
          }
        }
        
        int iHHA = iOraApp / 100;
        int iMMA = iOraApp % 100;
        int idxA = iHHA * 60 + iMMA;
        int idxF = idxA + iDurata;
        int iHHF = idxF / 60;
        int iMMF = idxF % 60;
        int iOraFine = iHHF * 100 + iMMF;
        
        Prenotazione prenotazione = new Prenotazione();
        prenotazione.setId(iId);
        prenotazione.setDataPren(dDataIns);
        prenotazione.setDataUpd(dDataUpd);
        prenotazione.setIdFar(iIdFar);
        prenotazione.setCodFar(sCodFar);
        prenotazione.setDesFar(sDesFar);
        prenotazione.setCodice(sCodice);
        prenotazione.setDataApp(dDataApp);
        prenotazione.setOraApp(WUtil.formatTime(iOraApp, false, false));
        prenotazione.setOraFine(WUtil.formatTime(iOraFine, false, false));
        prenotazione.setDurata(iDurata);
        prenotazione.setStato(sStato);
        prenotazione.setPrenOnLine(iPrenOnLine != 0);
        prenotazione.setPagato(iFlagPagato != 0);
        prenotazione.setPrezzoFinale(dPrezzoFinale);
        prenotazione.setIdColl(iIdColl);
        prenotazione.setDescColl(sNomeColl);
        prenotazione.setColore(sColore);
        prenotazione.setIdPrest(iIdPrestaz);
        prenotazione.setDescPrest(sDescPrestaz);
        prenotazione.setIdAttr(iIdAttrezz);
        prenotazione.setDescAttr(sDescAttrezz);
        prenotazione.setNote(sNote);
        prenotazione.setCodCoupon(sCodCoupon);
        prenotazione.setOverbooking(iOverbooking != 0);
        
        listResult.add(prenotazione);
        if(listResult.size() > 1000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSPrenotazioni.history(conn," + iFIdCliente + "," + iFIdFar + "," + oFDate + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return listResult;
  }
  
  public static
  Prenotazione read(String sId)
      throws Exception
  {
    return read(WUtil.toInt(sId, 0));
  }
  
  public static
  Prenotazione read(int iId)
      throws Exception
  {
    if(iId == 0) return null;
    
    Prenotazione prenotazione = null;
    
    long currentTimeMillis = System.currentTimeMillis();
    long lDataOraApp = 0;
    String  sStato = null;
    int iIdCliente = 0;
    
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      prenotazione = read(conn, iId);
      if(prenotazione == null) return null;
      
      prenotazione.setCkUserDesk(WSStrutture.readCheckUserDesk(conn, prenotazione.getIdFar()));
      
      java.util.Date dDataApp = prenotazione.getDataApp();
      if(dDataApp == null) return prenotazione;
      
      sStato = prenotazione.getStato();
      if(sStato == null || !sStato.equals("C")) return prenotazione;
      
      iIdCliente = prenotazione.getIdCliente();
      if(iIdCliente == 0) return prenotazione;
      
      String sOraApp = prenotazione.getOraApp();
      int iOraApp = WUtil.toIntTime(sOraApp, 0);
      int iHHA = iOraApp / 100;
      int iMMA = iOraApp % 100;
      Calendar calDataOraApp = Calendar.getInstance();
      calDataOraApp.setTimeInMillis(dDataApp.getTime());
      calDataOraApp.set(Calendar.HOUR_OF_DAY, iHHA);
      calDataOraApp.set(Calendar.MINUTE,      iMMA);
      calDataOraApp.set(Calendar.SECOND,      0);
      calDataOraApp.set(Calendar.MILLISECOND, 0);
      lDataOraApp = calDataOraApp.getTimeInMillis();
      
      if(lDataOraApp > 0 && lDataOraApp < currentTimeMillis) {
        ut = ConnectionManager.getUserTransaction(conn);
        ut.begin();
        
        DBUtil.execUpd(conn, "UPDATE PRZ_PRENOTAZIONI SET STATO=? WHERE ID=?", "E", iId);
        DBUtil.execUpd(conn, "UPDATE PRZ_CLIENTI SET REPUTAZIONE=? WHERE ID=?", 0, iIdCliente);
        
        ut.commit();
      }
    }
    catch(Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSPrenotazioni.read(" + iId + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.closeConnection(conn);
    }
    return prenotazione;
  }
  
  public static
  Prenotazione read(Connection conn, int iId)
      throws Exception
  {
    if(iId == 0) return null;
    
    Prenotazione prenotazione = null;
    
    String sSQL = "SELECT ";
    sSQL += "Z.ID,Z.DATA_INSERT,Z.DATA_UPDATE,Z.ID_FAR,Z.CODICE,Z.DATA_APPUNTAMENTO,Z.ORA_APPUNTAMENTO,Z.DURATA,Z.STATO,Z.PREN_ONLINE,Z.FLAG_PAGATO,Z.PREZZO_FINALE,Z.NOTE,Z.CODICE_COUPON,Z.TIPO_PAGAMENTO,Z.IMPORTO_PAGATO,Z.TIPO_APPUNTAMENTO,";
    sSQL += "Z.ID_COLLABORATORE,O.NOME NOME_COLL,O.COLORE,";
    sSQL += "Z.ID_CLIENTE,C.COGNOME,C.NOME,C.TELEFONO_1,C.TELEFONO_2,C.EMAIL,";
    sSQL += "Z.ID_PRESTAZIONE,P.DESCRIZIONE DESC_PREST,Z.ID_ATTREZZATURA,A.DESCRIZIONE DESC_ATTREZZ ";
    sSQL += "FROM PRZ_PRENOTAZIONI Z,PRZ_CLIENTI C,PRZ_COLLABORATORI O,PRZ_PRESTAZIONI P,PRZ_ATTREZZATURE A ";
    sSQL += "WHERE Z.ID_CLIENTE=C.ID AND Z.ID_COLLABORATORE=O.ID AND Z.ID_PRESTAZIONE=P.ID AND Z.ID_ATTREZZATURA=A.ID AND Z.ID=?";
    
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(1,  iId);
      rs = pstm.executeQuery();
      if(rs.next()) {
        Timestamp tsDataIns   = rs.getTimestamp("DATA_INSERT");
        Timestamp tsDataUpd   = rs.getTimestamp("DATA_UPDATE");
        int     iIdFarPre     = rs.getInt("ID_FAR");
        String  sCodice       = rs.getString("CODICE");
        Date    dDataApp      = rs.getDate("DATA_APPUNTAMENTO");
        int     iOraApp       = rs.getInt("ORA_APPUNTAMENTO");
        int     iDurata       = rs.getInt("DURATA");
        String  sStato        = rs.getString("STATO");
        int     iPrenOnLine   = rs.getInt("PREN_ONLINE");
        int     iFlagPagato   = rs.getInt("FLAG_PAGATO");
        double  dPrezzoFinale = rs.getDouble("PREZZO_FINALE");
        int     iIdColl       = rs.getInt("ID_COLLABORATORE");
        String  sNomeColl     = rs.getString("NOME_COLL");
        String  sColore       = rs.getString("COLORE");
        int     iIdCliente    = rs.getInt("ID_CLIENTE");
        String  sCognome      = rs.getString("COGNOME");
        String  sNome         = rs.getString("NOME");
        String  sTelefono1    = rs.getString("TELEFONO_1");
        String  sTelefono2    = rs.getString("TELEFONO_2");
        String  sEmail        = rs.getString("EMAIL");
        int     iIdPrestaz    = rs.getInt("ID_PRESTAZIONE");
        String  sDescPrestaz  = rs.getString("DESC_PREST");
        int     iIdAttrezz    = rs.getInt("ID_ATTREZZATURA");
        String  sDescAttrezz  = rs.getString("DESC_ATTREZZ");
        String  sNote         = rs.getString("NOTE");
        String  sCodCoupon    = rs.getString("CODICE_COUPON");
        String  sTipoPagam    = rs.getString("TIPO_PAGAMENTO");
        double  dImpPagato    = rs.getDouble("IMPORTO_PAGATO");
        String  sTipoApp      = rs.getString("TIPO_APPUNTAMENTO");
        
        int iHHA = iOraApp / 100;
        int iMMA = iOraApp % 100;
        int idxA = iHHA * 60 + iMMA;
        int idxF = idxA + iDurata;
        int iHHF = idxF / 60;
        int iMMF = idxF % 60;
        int iOraFine = iHHF * 100 + iMMF;
        
        prenotazione = new Prenotazione();
        prenotazione.setId(iId);
        prenotazione.setDataPren(tsDataIns);
        prenotazione.setDataUpd(tsDataUpd);
        prenotazione.setIdFar(iIdFarPre);
        prenotazione.setCodice(sCodice);
        prenotazione.setDataApp(dDataApp);
        prenotazione.setOraApp(WUtil.formatTime(iOraApp, false, false));
        prenotazione.setOraFine(WUtil.formatTime(iOraFine, false, false));
        prenotazione.setDurata(iDurata);
        prenotazione.setStato(sStato);
        prenotazione.setPrenOnLine(iPrenOnLine != 0);
        prenotazione.setPagato(iFlagPagato != 0);
        prenotazione.setPrezzoFinale(dPrezzoFinale);
        prenotazione.setIdColl(iIdColl);
        prenotazione.setDescColl(sNomeColl);
        prenotazione.setColore(sColore);
        prenotazione.setIdCliente(iIdCliente);
        prenotazione.setDescCliente(sCognome + " " + sNome);
        prenotazione.setTel1(sTelefono1);
        prenotazione.setTel2(sTelefono2);
        prenotazione.setEmail(sEmail);
        prenotazione.setIdPrest(iIdPrestaz);
        prenotazione.setDescPrest(sDescPrestaz);
        prenotazione.setIdAttr(iIdAttrezz);
        prenotazione.setDescAttr(sDescAttrezz);
        prenotazione.setNote(sNote);
        prenotazione.setNoteCliente(DBUtil.readString(conn, "SELECT NOTE FROM PRZ_CLIENTI WHERE ID=?", iIdCliente));
        prenotazione.setCodCoupon(sCodCoupon);
        prenotazione.setTipoPag(sTipoPagam);
        prenotazione.setImpPagato(dImpPagato);
        prenotazione.setTipo(sTipoApp);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSPrenotazioni.read(Connection, " + iId + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return prenotazione;
  }
  
  public static
  Prenotazione relocate(Prenotazione prenotazione)
      throws Exception
  {
    logger.debug("WSPrenotazioni.relocate(" + prenotazione + ")...");
    if(prenotazione == null) {
      return new Prenotazione("Dati prenotazione non presenti.");
    }
    int iIdCliente = prenotazione.getIdCliente();
    if(iIdCliente == 0) {
      return new Prenotazione("Identificativo del cliente assente.");
    }
    Date dDataApp = WUtil.toSQLDate(prenotazione.getDataApp(), null);
    if(dDataApp == null) {
      return new Prenotazione("Data appuntamento assente.");
    }
    int iOraApp = WUtil.toIntTime(prenotazione.getOraApp(), -1);
    if(iOraApp < 0 || iOraApp > 2359) {
      return new Prenotazione("Ora appuntamento non valida.");
    }
    int iCambioOraApp = WUtil.toIntTime(prenotazione.getCambioOra(), -1);
    if(iCambioOraApp != -1) {
      if(iCambioOraApp < 0 || iCambioOraApp > 2359) {
        return new Prenotazione("Cambio ora appuntamento non valida.");
      }
    }
    Date dCambioDataApp = WUtil.toSQLDate(prenotazione.getCambioData(), null);
    int  iCambioIdColl  = prenotazione.getCambioIdColl();
    List<Integer> prestazioni = prenotazione.getPrestazioni();
    if(prestazioni == null || prestazioni.size() == 0) {
      int iIdPrest = prenotazione.getIdPrest();
      if(iIdPrest == 0) {
        return new Prenotazione("Trattamenti non specificati.");
      }
      prestazioni = new ArrayList<Integer>();
      prestazioni.add(iIdPrest);
    }
    else {
      Integer oIdPrest0 = prestazioni.get(0);
      if(oIdPrest0 == null || oIdPrest0.intValue() == 0) {
        return new Prenotazione("Trattamenti non validi.");
      }
    }
    prenotazione.setOverbooking(true);
    
    Prenotazione result = null; 
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      // Annullamento
      result = cancel(conn, prenotazione, "Ricolloca da");
      if(result == null) {
        ut.rollback();
        return new Prenotazione("Errore interno in fase di annullamento");
      }
      String sMessaggio = result.getMessaggio();
      if(sMessaggio != null && sMessaggio.length() > 0) {
        ut.rollback();
        return result;
      }
      
      // Prenotazione
      result = book(conn, prenotazione, dCambioDataApp, iCambioOraApp, iCambioIdColl, "Ricolloca a");
      if(result == null) {
        ut.rollback();
        result = new Prenotazione("Errore interno in fase di prenotazione");
      }
      sMessaggio = result.getMessaggio();
      if(sMessaggio != null && sMessaggio.length() > 0) {
        ut.rollback();
        return result;
      }
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSPrenotazioni.relocate", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(conn);
    }
    return result;
  }
  
  public static
  Prenotazione move(Prenotazione prenotazione)
      throws Exception
  {
    logger.debug("WSPrenotazioni.move(" + prenotazione + ")...");
    if(prenotazione == null) {
      return new Prenotazione("Dati prenotazione non presenti.");
    }
    int iIdCliente = prenotazione.getIdCliente();
    if(iIdCliente == 0) {
      return new Prenotazione("Identificativo del cliente assente.");
    }
    Date dDataApp = WUtil.toSQLDate(prenotazione.getDataApp(), null);
    if(dDataApp == null) {
      return new Prenotazione("Data appuntamento assente.");
    }
    int iOraApp = WUtil.toIntTime(prenotazione.getOraApp(), -1);
    if(iOraApp < 0 || iOraApp > 2359) {
      return new Prenotazione("Ora appuntamento non valida.");
    }
    int iCambioOraApp = WUtil.toIntTime(prenotazione.getCambioOra(), -1);
    if(iCambioOraApp != -1) {
      if(iCambioOraApp < 0 || iCambioOraApp > 2359) {
        return new Prenotazione("Cambio ora appuntamento non valida.");
      }
    }
    Date dCambioDataApp = WUtil.toSQLDate(prenotazione.getCambioData(), null);
    if(dCambioDataApp == null) {
      return new Prenotazione("Cambio data appuntamento assente.");
    }
    int iCambioIdColl = prenotazione.getCambioIdColl();
    List<Integer> prestazioni = prenotazione.getPrestazioni();
    if(prestazioni == null || prestazioni.size() == 0) {
      int iIdPrest = prenotazione.getIdPrest();
      if(iIdPrest == 0) {
        return new Prenotazione("Trattamenti non specificati.");
      }
      prestazioni = new ArrayList<Integer>();
      prestazioni.add(iIdPrest);
    }
    else {
      Integer oIdPrest0 = prestazioni.get(0);
      if(oIdPrest0 == null || oIdPrest0.intValue() == 0) {
        return new Prenotazione("Trattamenti non validi.");
      }
    }
    boolean overBooking = prenotazione.isOverbooking();
    if(!overBooking) {
      Calendar calCambioDataOraApp = WUtil.toCalendar(dCambioDataApp, null);
      if(calCambioDataOraApp != null) {
        calCambioDataOraApp = WUtil.setTime(calCambioDataOraApp, iCambioOraApp);
        // Si tollera la prenotazione passata di 30' minuti per esigenza di servizio (30 x 60 x 1000 = 1800000)
        if(calCambioDataOraApp.getTimeInMillis() < System.currentTimeMillis() - 1800000) {
          return new Prenotazione("Appuntamento passato.");
        }
      }
    }
    
    Prenotazione result = null; 
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      // Annullamento
      result = revoke(conn, prenotazione, "Sposta da");
      if(result == null) {
        ut.rollback();
        return new Prenotazione("Errore interno in fase di annullamento");
      }
      String sMessaggio = result.getMessaggio();
      if(sMessaggio != null && sMessaggio.length() > 0) {
        ut.rollback();
        return result;
      }
      
      // Prenotazione
      result = book(conn, prenotazione, dCambioDataApp, iCambioOraApp, iCambioIdColl, "Sposta a");
      if(result == null) {
        ut.rollback();
        result = new Prenotazione("Errore interno in fase di prenotazione");
      }
      sMessaggio = result.getMessaggio();
      if(sMessaggio != null && sMessaggio.length() > 0) {
        ut.rollback();
        return result;
      }
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSPrenotazioni.move", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(conn);
    }
    return result;
  }
  
  public static
  boolean changeAttr(Prenotazione prenotazione, int iIdAttr)
      throws Exception
  {
    logger.debug("WSPrenotazioni.changeAttr(" + prenotazione + "," + iIdAttr + ")...");
    if(prenotazione == null || prenotazione.getId() == 0 || prenotazione.getDataApp() == null) return false;
    
    int iIdColl     = prenotazione.getIdColl();
    int iPrevIdAttr = prenotazione.getIdAttr();
    
    java.util.Date dDataApp = prenotazione.getDataApp();
    int iOraApp = WUtil.toIntTime(prenotazione.getOraApp(), 0);
    int iDurata = prenotazione.getDurata();
    if(iDurata < 10) iDurata = 10;
    Calendar calStart = WUtil.toCalendar(dDataApp, null);
    if(calStart == null) calStart = Calendar.getInstance();
    Calendar calEnd = WUtil.toCalendar(dDataApp, null);
    if(calEnd == null) calEnd = Calendar.getInstance();
    
    int iHHI  = iOraApp / 100;
    int iMMI  = iOraApp % 100;
    int iIxI  = iHHI * 60 + iMMI;
    int iIxF  = iIxI + iDurata;
    int iHHF  = iIxF / 60;
    int iMMF  = iIxF % 60;
    int iOraF = iHHF * 100 + iMMF;
    
    calStart = WUtil.setTime(calStart, iOraApp);
    calEnd   = WUtil.setTime(calEnd,   iOraF);
    Timestamp tsStart = new Timestamp(calStart.getTimeInMillis());
    Timestamp tsEnd   = new Timestamp(calEnd.getTimeInMillis());
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    Connection conn = null;
    PreparedStatement pstmA = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      if(iPrevIdAttr != 0) {
        int p = 0;
        pstmA = conn.prepareStatement("DELETE FROM PRZ_ATTREZZATURE_RIS WHERE ID_COLLABORATORE=? AND ID_ATTREZZATURA=? AND RISERVATO_DAL=? AND RISERVATO_AL=?");
        pstmA.setInt(++p,       iIdColl);
        pstmA.setInt(++p,       iPrevIdAttr);
        pstmA.setTimestamp(++p, tsStart);
        pstmA.setTimestamp(++p, tsEnd);
        pstmA.executeUpdate();
      }
      
      if(iIdAttr != 0) {
        if(pstmA != null) pstmA.close();
        int iIdRis = ConnectionManager.nextVal(conn, "SEQ_PRZ_ATTREZZATURE_RIS");
        int p = 0;
        pstmA = conn.prepareStatement("INSERT INTO PRZ_ATTREZZATURE_RIS(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_ATTREZZATURA,ID_COLLABORATORE,RISERVATO_DAL,RISERVATO_AL) VALUES(?,?,?,?,?,?,?,?)");
        pstmA.setInt(++p,       iIdRis);
        pstmA.setInt(++p,       iIdUte);
        pstmA.setDate(++p,      new java.sql.Date(System.currentTimeMillis()));
        pstmA.setInt(++p,       1);
        pstmA.setInt(++p,       iIdAttr);
        pstmA.setInt(++p,       iIdColl);
        pstmA.setTimestamp(++p, tsStart);
        pstmA.setTimestamp(++p, tsEnd);
        pstmA.executeUpdate();
      }
      
      DBUtil.execUpd(conn, "UPDATE PRZ_PRENOTAZIONI SET ID_ATTREZZATURA=?,OVERBOOKING=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?", iIdAttr, 1, iIdUte, new Timestamp(System.currentTimeMillis()), prenotazione.getId());
      
      WSLogOperazioni.insert(conn, "Cambio cab.", prenotazione);
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSPrenotazioni.changeAttr", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstmA, conn);
    }
    return true;
  }
  
  public static
  boolean changePrest(Prenotazione prenotazione, int iIdPrest)
      throws Exception
  {
    logger.debug("WSPrenotazioni.changePrest(" + prenotazione + "," + iIdPrest + ")...");
    if(prenotazione == null || prenotazione.getId() == 0 || iIdPrest == 0) return false;
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      int iIdAttr = prenotazione.getIdAttr();
      int iIdFar  = prenotazione.getIdFar();
      
      // Si controlla che il nuovo trattamento non preveda un'attrezzatura diversa
      if(iIdAttr == 0) {
        iIdAttr = DBUtil.readInt(conn, "SELECT ID_ATTREZZATURA FROM PRZ_PRENOTAZIONI WHERE ID=?", prenotazione.getId());
      }
      if(iIdFar == 0) {
        iIdFar = DBUtil.readInt(conn, "SELECT ID_FAR FROM PRZ_PRENOTAZIONI WHERE ID=?", prenotazione.getId());
      }
      if(iIdAttr != 0 && iIdFar != 0) {
        List<Integer> listAttrezzature = DBUtil.readListOfInteger(conn, "SELECT PA.ID_ATTREZZATURA,PA.ID FROM PRZ_PRESTAZIONI_ATTREZ PA,PRZ_ATTREZZATURE A WHERE PA.ID_ATTREZZATURA=A.ID AND A.FLAG_ATTIVO=? AND PA.ID_PRESTAZIONE=? AND A.ID_FAR=? ORDER BY PA.ID", 1, iIdPrest, iIdFar);
        if(listAttrezzature != null && listAttrezzature.size() > 0) {
          if(!listAttrezzature.contains(iIdAttr)) {
            return false;
          }
        }
      }
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      double dPrezzoFinale = DBUtil.readDouble(conn, "SELECT PREZZO_FINALE FROM PRZ_PRESTAZIONI WHERE ID=?", iIdPrest);
      
      DBUtil.execUpd(conn, "UPDATE PRZ_PRENOTAZIONI SET ID_PRESTAZIONE=?,PREZZO_FINALE=?,OVERBOOKING=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?", iIdPrest, dPrezzoFinale, 1, iIdUte, new Timestamp(System.currentTimeMillis()), prenotazione.getId());
      
      WSLogOperazioni.insert(conn, "Cambio tratt.", prenotazione);
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSPrenotazioni.changePrest", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(conn);
    }
    return true;
  }
  
  public static
  Prenotazione book(Prenotazione prenotazione)
      throws Exception
  {
    logger.debug("WSPrenotazioni.book(" + prenotazione + ")...");
    if(prenotazione == null) {
      return new Prenotazione("Dati prenotazione non presenti.");
    }
    int iIdCliente = prenotazione.getIdCliente();
    if(iIdCliente == 0) {
      return new Prenotazione("Identificativo del cliente assente.");
    }
    Date dDataApp = WUtil.toSQLDate(prenotazione.getDataApp(), null);
    if(dDataApp == null) {
      return new Prenotazione("Data appuntamento assente.");
    }
    int iOraApp = WUtil.toIntTime(prenotazione.getOraApp(), -1);
    if(iOraApp < 0 || iOraApp > 2359) {
      return new Prenotazione("Ora appuntamento non valida.");
    }
    List<Integer> prestazioni = prenotazione.getPrestazioni();
    if(prestazioni == null || prestazioni.size() == 0) {
      int iIdPrest = prenotazione.getIdPrest();
      if(iIdPrest == 0) {
        return new Prenotazione("Trattamenti non specificati.");
      }
      prestazioni = new ArrayList<Integer>();
      prestazioni.add(iIdPrest);
    }
    else {
      Integer oIdPrest0 = prestazioni.get(0);
      if(oIdPrest0 == null || oIdPrest0.intValue() == 0) {
        return new Prenotazione("Trattamenti non validi.");
      }
    }
    boolean overBooking = prenotazione.isOverbooking();
    if(!overBooking) {
      Calendar calDataOraApp = WUtil.toCalendar(dDataApp, null);
      if(calDataOraApp != null) {
        calDataOraApp = WUtil.setTime(calDataOraApp, iOraApp);
        // Si tollera la prenotazione passata di 120' minuti per esigenza di servizio (120 x 60 x 1000 = 7200000)
        if(calDataOraApp.getTimeInMillis() < System.currentTimeMillis() - 7200000) {
          return new Prenotazione("Appuntamento passato.");
        }
      }
    }
    
    Prenotazione result = null;
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      result = book(conn, prenotazione, "Prenota");
      
      if(result == null) result = new Prenotazione("Errore interno in fase di prenotazione");
      String sMessaggio = result.getMessaggio();
      if(sMessaggio != null && sMessaggio.length() > 0) {
        ut.rollback();
      }
      else {
        ut.commit();
      }
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSPrenotazioni.book", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(conn);
    }
    return result;
  }
  
  public static
  Prenotazione book(Connection conn, Prenotazione prenotazione, String sOperazione)
      throws Exception
  {
    return book(conn, prenotazione, null, -1, 0, sOperazione);
  }
  
  public static
  Prenotazione book(Connection conn, Prenotazione prenotazione, Date dCambioDataApp, int iCambioOraApp, int iCambioIdColl, String sOperazione)
      throws Exception
  {
    logger.debug("WSPrenotazioni.book(conn," + prenotazione + "," + WUtil.formatDate(dCambioDataApp, "-") + "," + iCambioOraApp + "," + iCambioIdColl + "," + sOperazione + ")...");
    if(prenotazione == null) {
      return new Prenotazione("Dati prenotazione non presenti.");
    }
    int iIdCliente = prenotazione.getIdCliente();
    if(iIdCliente == 0) {
      return new Prenotazione("Identificativo del cliente assente.");
    }
    Date dDataApp = dCambioDataApp != null ? dCambioDataApp : WUtil.toSQLDate(prenotazione.getDataApp(), null);
    if(dDataApp == null) {
      return new Prenotazione("Data appuntamento assente.");
    }
    int iOraApp = iCambioOraApp >= 0 ? iCambioOraApp : WUtil.toIntTime(prenotazione.getOraApp(), -1);
    if(iOraApp < 0 || iOraApp > 2359) {
      return new Prenotazione("Ora appuntamento non valida.");
    }
    if(iOraApp < 100) {
      iOraApp = iOraApp * 100;
    }
    List<Integer> prestazioni = prenotazione.getPrestazioni();
    if(prestazioni == null || prestazioni.size() == 0) {
      int iIdPrest = prenotazione.getIdPrest();
      if(iIdPrest == 0) {
        return new Prenotazione("Trattamenti non specificati.");
      }
      prestazioni = new ArrayList<Integer>();
      prestazioni.add(iIdPrest);
    }
    else {
      Integer oIdPrest0 = prestazioni.get(0);
      if(oIdPrest0 == null || oIdPrest0.intValue() == 0) {
        return new Prenotazione("Trattamenti non validi.");
      }
    }
    
    boolean pastAppointment = false;
    boolean pastAppointmentAccepted = false;
    Calendar calDataOraApp = WUtil.toCalendar(dDataApp, null);
    if(calDataOraApp != null) {
      calDataOraApp = WUtil.setTime(calDataOraApp, iOraApp);
      long currentTimeMillis = System.currentTimeMillis();
      if(calDataOraApp.getTimeInMillis() < currentTimeMillis) {
        pastAppointment = true; 
        // Si tollera la prenotazione passata di 120' minuti per esigenza di servizio (120 x 60 x 1000 = 7200000)
        if(calDataOraApp.getTimeInMillis() >= currentTimeMillis - 7200000) {
          pastAppointmentAccepted = true; 
        }
      }
    }
    
    // Il flag overBooking consente di prenotare in slot non disponibili
    // Tuttavia rimane il controllo sulla disponibilita' di una cabina (se il trattamento lo richiede)
    boolean overBooking = prenotazione.isOverbooking();
    if(!overBooking) {
      if(pastAppointment && !pastAppointmentAccepted) {
        return new Prenotazione("Appuntamento passato.");
      }
    }
    
    int iIdAttr = prenotazione.getIdAttr();
    boolean ignoreCheck = false;
    if(iIdAttr != 0) {
      // Se una cabina e' stata indicata insieme al flag di overbooking 
      // allora viene ignorato il controllo sulla disponibilta' delle cabine
      ignoreCheck = overBooking;
      if(iIdAttr == -1) {
        // La cabina -1 e' fittizia: serve per ignorare il controllo sulle cabine (se overBooking=true)
        // senza doverne specificare una. Questo potrebbe dar luogo ad una prenotazione senza cabina assegnata.
        iIdAttr = 0;
        prenotazione.setIdAttr(0);
      }
    }
    
    WList wlDurate = new WList(prenotazione.getDurate());
    if(wlDurate.size() == 0) {
      if(prestazioni != null && prestazioni.size() == 1) {
        wlDurate.add(prenotazione.getDurata());
      }
    }
    int iIdFar      = prenotazione.getIdFar();
    int iIdCollOrig = prenotazione.getIdColl();
    int iIdColl     = 0;
    if(iCambioIdColl != 0) {
      iIdColl = iCambioIdColl;
    }
    else {
      iIdColl = iIdCollOrig;
    }
    String sNote = prenotazione.getNote();
    boolean prenOnLine = prenotazione.isPrenOnLine();
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL_Ins = "INSERT INTO PRZ_PRENOTAZIONI(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,ID_FAR,CODICE,ID_CLIENTE,ID_PRESTAZIONE,ID_COLLABORATORE,ID_ATTREZZATURA,DATA_APPUNTAMENTO,ORA_APPUNTAMENTO,GIORNO,DURATA,DATAORA_INIZIO,DATAORA_FINE,ID_AGENDA,ID_AGENDA_MODELLO,PROGRESSIVO,STATO,NOTE,PREZZO_FINALE,OVERBOOKING,PREN_ONLINE,FLAG_PAGATO,UTENTE_DESK,TIPO_APPUNTAMENTO)";
    sSQL_Ins += "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    int iDataApp   = WUtil.toIntDate(dDataApp, 0);
    int iGiorno    = DateSplitter.getDayOfWeek(iDataApp);
    String codPren = iDataApp + "_" + iOraApp + "_" + iIdCliente;
    prenotazione.setCodice(codPren);
    
    //                                                                         1
    String sSQL_R = "SELECT ID FROM PRZ_ATTREZZATURE_RIS WHERE ID_ATTREZZATURA=? ";
    //                          dal <= t1 < al                           dal < t2 < al                              t1 < dal && t2 > al
    //                              2                  3                    4                   5                     6                   7
    sSQL_R += "AND ((RISERVATO_DAL<=? AND RISERVATO_AL>?) OR (RISERVATO_DAL<? AND RISERVATO_AL>=?) OR (RISERVATO_DAL>=? AND RISERVATO_AL<=?)) ";
    // L'ulteriore condizione su ID_COLLABORATORE consente la ricollocazione
    //                               8
    sSQL_R += "AND ID_COLLABORATORE<>? ";
    if(iCambioIdColl != 0 && iIdCollOrig != iCambioIdColl) {
      //                               9
      sSQL_R += "AND ID_COLLABORATORE<>? ";
    }
    
    Prenotazione result = new Prenotazione(prenotazione);
    
    int p = 0;
    PreparedStatement pstmS = null;
    PreparedStatement pstmU = null;
    PreparedStatement pstmI = null;
    PreparedStatement pstmA = null;
    PreparedStatement pstmR = null;
    ResultSet rsC = null;
    ResultSet rsR = null;
    try {
      pstmI = conn.prepareStatement(sSQL_Ins);
      
      for(int t = 0; t < prestazioni.size(); t++) {
        int iIdPrestazione = WUtil.toInt(prestazioni.get(t), 0);
        if(iIdPrestazione == 0) continue;
        
        WMap wmPrest = new WMap(DBUtil.read(conn, "SELECT ID_FAR,DESCRIZIONE,DURATA,PREZZO_FINALE,FLAG_ATTIVO FROM PRZ_PRESTAZIONI WHERE ID=?", iIdPrestazione));
        
        if(prenotazione.getIdFar() == 0) {
          prenotazione.setIdFar(wmPrest.getInt("ID_FAR"));
        }
        
        int iFlagAtPrest = wmPrest.getInt("FLAG_ATTIVO");
        if(iFlagAtPrest == 0) {
          String sDescPrest = wmPrest.getString("DESCRIZIONE");
          if(sDescPrest == null || sDescPrest.length() == 0) {
            return new Prenotazione("Trattamento " + iIdPrestazione + " non disponibile.");
          }
          return new Prenotazione("Trattamento " + sDescPrest + " non prenotabile.");
        }
        int iDurataPrest  = wmPrest.getInt("DURATA");
        int iDurataModif  = wlDurate.getInt(t, 0);
        if(iDurataModif > 0) {
          iDurataPrest = iDurataModif;
        }
        int iMod = iDurataPrest % 10; 
        if(iMod != 0) {
          iDurataPrest += (10 - iMod);
        }
        double dPrezzoFin = wmPrest.getDouble("PREZZO_FINALE");
        
        Calendar calStart = WUtil.toCalendar(dDataApp, null);
        if(calStart == null) calStart = Calendar.getInstance();
        Calendar calEnd = WUtil.toCalendar(dDataApp, null);
        if(calEnd == null) calEnd = Calendar.getInstance();
        
        int iHHI  = iOraApp / 100;
        int iMMI  = iOraApp % 100;
        int iIxI  = iHHI * 60 + iMMI;
        int iIxF  = iIxI + iDurataPrest;
        int iHHF  = iIxF / 60;
        int iMMF  = iIxF % 60;
        int iOraF = iHHF * 100 + iMMF;
        
        calStart = WUtil.setTime(calStart, iOraApp);
        calEnd   = WUtil.setTime(calEnd,   iOraF);
        Timestamp tsStart = new Timestamp(calStart.getTimeInMillis());
        Timestamp tsEnd   = new Timestamp(calEnd.getTimeInMillis());
        
        Ricerca ricerca = new Ricerca(iIdFar, iIdPrestazione, iDurataPrest, dDataApp, dDataApp, iOraApp);
        ricerca.executedBy(iIdColl, t == 0 && iIdColl != 0, iIdAttr, t == 0 && iIdAttr != 0);
        ricerca.setPrenOnLine(prenOnLine);
        ricerca.setFirst(true);
        ricerca.setStep(-1);
        
        List<String> listSearchMessages = new ArrayList<String>();
        
        Calendario calendario = null;
        if(!pastAppointment || !overBooking) {
          // Per gli appuntamenti passati la search cerca il primo orario disponibile.
          // Per questo motivo in caso di overbooking si esclude la ricerca.
          List<Calendario> listCalendario = WSCalendario.search(conn, ricerca, listSearchMessages);
          if(listCalendario != null && listCalendario.size() > 0) {
            calendario = listCalendario.get(0);
          }
        }
        
        if(calendario == null && overBooking) {
          List<Integer> listAttrezzature = DBUtil.readListOfInteger(conn, "SELECT PA.ID_ATTREZZATURA,PA.ID FROM PRZ_PRESTAZIONI_ATTREZ PA,PRZ_ATTREZZATURE A WHERE PA.ID_ATTREZZATURA=A.ID AND A.FLAG_ATTIVO=? AND PA.ID_PRESTAZIONE=? AND A.ID_FAR=? ORDER BY PA.ID", 1, iIdPrestazione, iIdFar);
          if(iIdAttr != 0) {
            // Si riporta come prima la cabina eventualmente specificata
            int iIndexOf = listAttrezzature.indexOf(iIdAttr);
            if(iIndexOf >= 0) {
              listAttrezzature.remove(iIndexOf);
              listAttrezzature.add(0, iIdAttr);
            }
          }
          pstmR = conn.prepareStatement(sSQL_R);
          if(listAttrezzature != null && listAttrezzature.size() > 0) {
            int iIdAttrLibera = 0;
            for(int a = 0; a < listAttrezzature.size(); a++) {
              int iIdAttrezzatura = listAttrezzature.get(a);
              
              boolean boRiservata = false;
              pstmR.setInt(1,       iIdAttrezzatura);
              pstmR.setTimestamp(2, tsStart);
              pstmR.setTimestamp(3, tsStart);
              pstmR.setTimestamp(4, tsEnd);
              pstmR.setTimestamp(5, tsEnd);
              pstmR.setTimestamp(6, tsStart);
              pstmR.setTimestamp(7, tsEnd);
              pstmR.setInt(8,       iIdCollOrig);
              if(iCambioIdColl != 0 && iIdCollOrig != iCambioIdColl) {
                pstmR.setInt(9,   iCambioIdColl);
              }
              rsR = pstmR.executeQuery();
              if(rsR.next()) boRiservata = true;
              rsR.close();
              
              if(!boRiservata) {
                iIdAttrLibera = iIdAttrezzatura;
                break;
              }
            }
            if(iIdAttrLibera == 0) {
              if(!overBooking || !ignoreCheck) {
                return new Prenotazione("Nessuna cabina disponibile.");
              }
            }
            else {
              iIdAttr = iIdAttrLibera;
            }
          }
        }
        
        if(calendario == null && overBooking) {
          WMap wmCal = new WMap(DBUtil.read(conn, "SELECT ID,ID_AGENDA,ID_AGENDA_MODELLO,PROGRESSIVO,TIPOLOGIA FROM PRZ_CALENDARIO WHERE ID_COLLABORATORE=? AND DATA_CALENDARIO=? AND ORAINIZIO<=? AND ORAFINE>? AND FLAG_ATTIVO=?", iIdColl, dDataApp, iOraApp, iOraApp, 1));
          int iIdCal = wmCal.getInt("ID");
          if(iIdCal != 0) {
            int iIdAgenda     = wmCal.getInt("ID_AGENDA");
            int iIdAgendaMod  = wmCal.getInt("ID_AGENDA_MODELLO");
            int iProgressivo  = wmCal.getInt("PROGRESSIVO");
            String sTipologia = wmCal.getString("TIPOLOGIA");
            calendario = new Calendario(iIdCal, iIdColl, iIdAgenda, iIdAgendaMod, dDataApp, iGiorno, iProgressivo, sTipologia);
            calendario.setIdCollaboratore(iIdColl);
            calendario.setIdAttrez(iIdAttr);
            calendario.setOraInizio(iOraApp);
          }
        }
        
        if(calendario == null) {
          if(!overBooking && !pastAppointmentAccepted) {
            if(listSearchMessages != null && listSearchMessages.size() > 0) {
              String sMsg0 = listSearchMessages.get(0);
              return new Prenotazione(sMsg0);
            }
            return new Prenotazione("Appuntamento non disponibile");
          }
          
          // Controllo sovrapposizione
          int iCheck = DBUtil.readInt(conn, "SELECT ID FROM PRZ_PRENOTAZIONI WHERE ID_COLLABORATORE=? AND DATA_APPUNTAMENTO=? AND ORA_APPUNTAMENTO=? AND STATO<>? AND STATO<>?", iIdColl, dDataApp, iOraApp, "A", "N");
          if(iCheck != 0) {
            return new Prenotazione("Appuntamento in sovrapposizione");
          }
          
          if(iIdAttr != 0) {
            int iIdRis = ConnectionManager.nextVal(conn, "SEQ_PRZ_ATTREZZATURE_RIS");
            p = 0;
            pstmA = conn.prepareStatement("INSERT INTO PRZ_ATTREZZATURE_RIS(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_ATTREZZATURA,ID_COLLABORATORE,RISERVATO_DAL,RISERVATO_AL) VALUES(?,?,?,?,?,?,?,?)");
            pstmA.setInt(++p,       iIdRis);
            pstmA.setInt(++p,       iIdUte);
            pstmA.setDate(++p,      new java.sql.Date(System.currentTimeMillis()));
            pstmA.setInt(++p,       1);
            pstmA.setInt(++p,       iIdAttr);
            pstmA.setInt(++p,       iIdColl);
            pstmA.setTimestamp(++p, tsStart);
            pstmA.setTimestamp(++p, tsEnd);
            pstmA.executeUpdate();
          }
          
          int iIdPre = ConnectionManager.nextVal(conn, "SEQ_PRZ_PRENOTAZIONI");
          
          p = 0;
          pstmI.setInt(++p,       iIdPre);
          pstmI.setInt(++p,       iIdUte);
          pstmI.setTimestamp(++p, new java.sql.Timestamp(System.currentTimeMillis())); // DATA_INSERT
          pstmI.setInt(++p,       1); // FLAG_ATTIVO
          pstmI.setInt(++p,       iIdGru);
          pstmI.setInt(++p,       prenotazione.getIdFar());
          pstmI.setString(++p,    codPren);
          pstmI.setInt(++p,       iIdCliente);
          pstmI.setInt(++p,       iIdPrestazione);
          pstmI.setInt(++p,       iIdColl);
          pstmI.setInt(++p,       iIdAttr);
          pstmI.setDate(++p,      dDataApp);
          pstmI.setInt(++p,       iOraApp);
          pstmI.setInt(++p,       iGiorno);
          pstmI.setInt(++p,       iDurataPrest);
          pstmI.setTimestamp(++p, tsStart);
          pstmI.setTimestamp(++p, tsEnd);
          pstmI.setInt(++p,       0); // ID_AGENDA
          pstmI.setInt(++p,       0); // ID_AGENDA_MODELLO
          pstmI.setInt(++p,       0); // PROGRESSIVO
          pstmI.setString(++p,    "C");
          pstmI.setString(++p,    sNote);
          pstmI.setDouble(++p,    dPrezzoFin);
          pstmI.setInt(++p,       overBooking ? 1 : 0);
          pstmI.setInt(++p,       prenOnLine  ? 1 : 0);
          pstmI.setInt(++p,       0); // FLAG_PAGATO
          pstmI.setString(++p,    prenotazione.getUserDesk());
          pstmI.setString(++p,    prenotazione.getTipo());
          pstmI.executeUpdate();
          
          result.setId(iIdPre);
          result.setIdFar(prenotazione.getIdFar());
          result.setIdCliente(iIdCliente);
          result.setIdColl(iIdColl);
          result.setIdAttr(iIdAttr);
          result.setIdPrest(iIdPrestazione);
          result.setDataApp(dDataApp);
          result.setOraApp(WUtil.formatTime(iOraApp, false, false));
          result.setDurata(iDurataPrest);
          result.setUserDesk(prenotazione.getUserDesk());
          result.setTipo(prenotazione.getTipo());
          
          // Appuntamento successivo
          iOraApp = WUtil.toIntTime(tsEnd, DataUtil.addMinutes(iOraApp, iDurataPrest));
          
          WSLogOperazioni.insert(conn, sOperazione + "*", result);
        }
        else {
          // Controllo sovrapposizione
          int iCheck = DBUtil.readInt(conn, "SELECT ID FROM PRZ_PRENOTAZIONI WHERE ID_COLLABORATORE=? AND DATA_APPUNTAMENTO=? AND ORA_APPUNTAMENTO=? AND STATO<>? AND STATO<>?", iIdColl, dDataApp, iOraApp, "A", "N");
          if(iCheck != 0) {
            return new Prenotazione("Appuntamento in sovrapposizione");
          }
          
          // Lock PRZ_CALENDARIO
          int iRows = DBUtil.execUpd(conn, "UPDATE PRZ_CALENDARIO SET FLAG_ATTIVO=? WHERE ID=? AND FLAG_ATTIVO=?", 1, calendario.getId(), 1);
          if(iRows == 0) {
            return new Prenotazione("Appuntamento selezionato non piu' prenotabile.");
          }
          
          String sModello     = null;
          String sTipologia   = null;
          int    iMinuti      = 0;
          int    iPosti       = 0;
          int    iMaxConsec   = 0;
          pstmS = conn.prepareStatement("SELECT MODELLO,TIPOLOGIA,MINUTI,POSTI,MAX_CONSECUTIVI FROM PRZ_CALENDARIO WHERE ID=?");
          pstmS.setInt(1, calendario.getId());
          rsC = pstmS.executeQuery();
          if(rsC.next()) {
            sModello    = rsC.getString("MODELLO");
            sTipologia  = rsC.getString("TIPOLOGIA");
            iMinuti     = rsC.getInt("MINUTI");
            iPosti      = rsC.getInt("POSTI");
            iMaxConsec  = rsC.getInt("MAX_CONSECUTIVI");
          }
          rsC.close();
          
          if(sModello == null) sModello = "";
          if(sModello.length() < 1440) sModello = WUtil.rpad(sModello, '0', 1440);
          if(sTipologia == null || sTipologia.length() == 0) sTipologia = "O";
          
          StringBuffer sbModello = new StringBuffer(sModello);
          if(!sTipologia.equalsIgnoreCase("O")) {
            if(iPosti < 1 && !overBooking) {
              return new Prenotazione("Posto individuato non piu' prenotabile.");
            }
            iPosti     = iPosti - 1;
            iMaxConsec = iPosti;
          }
          else {
            if(!DataUtil.reserve(sbModello, calendario.getOraInizio(), iDurataPrest, !overBooking)) {
              return new Prenotazione("Appuntamento individuato non piu' disponibile.");
            }
            iMinuti    = DataUtil.getDisponibili(sbModello);
            iMaxConsec = DataUtil.getMaxConsecutivi(sbModello);
          }
          if(iPosti     < 0) iPosti     = 0;
          if(iMinuti    < 0) iMinuti    = 0;
          if(iMaxConsec < 0) iMaxConsec = 0;
          
          p = 0;
          pstmU = conn.prepareStatement("UPDATE PRZ_CALENDARIO SET MODELLO=?,MINUTI=?,POSTI=?,MAX_CONSECUTIVI=? WHERE ID=?");
          // SET
          pstmU.setString(++p, sbModello.toString());
          pstmU.setInt(++p,    iMinuti);
          pstmU.setInt(++p,    iPosti);
          pstmU.setInt(++p,    iMaxConsec);
          // WHERE
          pstmU.setInt(++p,    calendario.getId());
          pstmU.executeUpdate();
          
          Date data = WUtil.toSQLDate(calendario.getData(), dDataApp);
          int  ora  = calendario.getOraInizio();
          int  fine = DataUtil.addMinutes(ora, iDurataPrest);
          Calendar cal0 = WUtil.toCalendar(data, null);
          Calendar cal1 = WUtil.toCalendar(data, null);
          cal0 = WUtil.setTime(cal0, ora);
          cal1 = WUtil.setTime(cal1, fine);
          Timestamp ts0 = new Timestamp(cal0.getTimeInMillis());
          Timestamp ts1 = new Timestamp(cal1.getTimeInMillis());
          
          if(calendario.getIdAttrez() != 0) {
            int iIdRis = ConnectionManager.nextVal(conn, "SEQ_PRZ_ATTREZZATURE_RIS");
            p = 0;
            pstmA = conn.prepareStatement("INSERT INTO PRZ_ATTREZZATURE_RIS(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_ATTREZZATURA,ID_COLLABORATORE,RISERVATO_DAL,RISERVATO_AL) VALUES(?,?,?,?,?,?,?,?)");
            pstmA.setInt(++p,       iIdRis);
            pstmA.setInt(++p,       iIdUte);
            pstmA.setDate(++p,      new java.sql.Date(System.currentTimeMillis()));
            pstmA.setInt(++p,       1);
            pstmA.setInt(++p,       calendario.getIdAttrez());
            pstmA.setInt(++p,       calendario.getIdCollaboratore());
            pstmA.setTimestamp(++p, ts0);
            pstmA.setTimestamp(++p, ts1);
            pstmA.executeUpdate();
          }
          
          int iIdPre = ConnectionManager.nextVal(conn, "SEQ_PRZ_PRENOTAZIONI");
          
          p = 0;
          pstmI.setInt(++p,       iIdPre);
          pstmI.setInt(++p,       iIdUte);
          pstmI.setTimestamp(++p, new java.sql.Timestamp(System.currentTimeMillis())); // DATA_INSERT
          pstmI.setInt(++p,       1); // FLAG_ATTIVO
          pstmI.setInt(++p,       iIdGru);
          pstmI.setInt(++p,       prenotazione.getIdFar());
          pstmI.setString(++p,    codPren);
          pstmI.setInt(++p,       iIdCliente);
          pstmI.setInt(++p,       iIdPrestazione);
          pstmI.setInt(++p,       calendario.getIdCollaboratore());
          pstmI.setInt(++p,       calendario.getIdAttrez());
          pstmI.setDate(++p,      data);
          pstmI.setInt(++p,       ora);
          pstmI.setInt(++p,       iGiorno);
          pstmI.setInt(++p,       iDurataPrest);
          pstmI.setTimestamp(++p, ts0);
          pstmI.setTimestamp(++p, ts1);
          pstmI.setInt(++p,       calendario.getIdAgenda());    // ID_AGENDA
          pstmI.setInt(++p,       calendario.getIdAgendaMod()); // ID_AGENDA_MODELLO
          pstmI.setInt(++p,       calendario.getProgressivo()); // PROGRESSIVO
          pstmI.setString(++p,    "C");
          pstmI.setString(++p,    sNote);
          pstmI.setDouble(++p,    dPrezzoFin);
          pstmI.setInt(++p,       overBooking ? 1 : 0);
          pstmI.setInt(++p,       prenOnLine  ? 1 : 0);
          pstmI.setInt(++p,       0); // FLAG_PAGATO
          pstmI.setString(++p,    prenotazione.getUserDesk());
          pstmI.setString(++p,    prenotazione.getTipo());
          pstmI.executeUpdate();
          
          result.setId(iIdPre);
          result.setIdFar(prenotazione.getIdFar());
          result.setIdCliente(iIdCliente);
          result.setIdColl(calendario.getIdCollaboratore());
          result.setIdAttr(calendario.getIdAttrez());
          result.setIdPrest(iIdPrestazione);
          result.setDataApp(data);
          result.setOraApp(WUtil.formatTime(ora, false, false));
          result.setDurata(iDurataPrest);
          result.setUserDesk(prenotazione.getUserDesk());
          result.setTipo(prenotazione.getTipo());
          
          // Appuntamento successivo
          iOraApp = WUtil.toIntTime(ts1, DataUtil.addMinutes(ora, iDurataPrest));
          
          WSLogOperazioni.insert(conn, sOperazione, result);
        }
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSPrenotazioni.book(conn, " + prenotazione + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rsC, rsR, pstmR, pstmS, pstmI, pstmU, pstmA);
    }
    return result;
  }
  
  public static
  Prenotazione revoke(Prenotazione prenotazione)
      throws Exception
  {
    logger.debug("WSPrenotazioni.revoke(" + prenotazione + ")...");
    if(prenotazione == null || prenotazione.getId() == 0) {
      return new Prenotazione("Prenotazione non valida");
    }
    Prenotazione result = null; 
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      result = revoke(conn, prenotazione, "Annulla");
      
      if(result == null) result = new Prenotazione("Errore interno in fase di annullamento");
      String sMessaggio = result.getMessaggio();
      if(sMessaggio != null && sMessaggio.length() > 0) {
        ut.rollback();
      }
      else {
        ut.commit();
      }
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSPrenotazioni.revoke", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(conn);
    }
    return result;
  }
  
  public static
  Prenotazione revoke(Connection conn, Prenotazione prenotazione, String sOperazione)
      throws Exception
  {
    if(prenotazione == null || prenotazione.getId() == 0) {
      return new Prenotazione("Prenotazione non valida");
    }
    int iIdFar = prenotazione.getIdFar();
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    String sNote = prenotazione.getNote();
    
    int p = 0;
    PreparedStatement pstmP = null;
    PreparedStatement pstmA = null;
    try {
      WMap wmPren = null;
      if(iIdFar != 0) {
        wmPren = new WMap(DBUtil.read(conn, "SELECT DATA_APPUNTAMENTO,ORA_APPUNTAMENTO,ID_COLLABORATORE,ID_ATTREZZATURA,DATAORA_INIZIO,DATAORA_FINE,STATO FROM PRZ_PRENOTAZIONI WHERE ID=? AND ID_FAR=?", prenotazione.getId(), iIdFar));
      }
      else {
        wmPren = new WMap(DBUtil.read(conn, "SELECT DATA_APPUNTAMENTO,ORA_APPUNTAMENTO,ID_COLLABORATORE,ID_ATTREZZATURA,DATAORA_INIZIO,DATAORA_FINE,STATO FROM PRZ_PRENOTAZIONI WHERE ID=?", prenotazione.getId()));
      }
      Date dDataApp      = wmPren.getSQLDate("DATA_APPUNTAMENTO");
      if(dDataApp == null) {
        prenotazione.setMessaggio("Prenotazione " + prenotazione.getId() + " non trovata");
        return prenotazione;
      }
      int iOraApp        = wmPren.getInt("ORA_APPUNTAMENTO");
      int iIdColl        = wmPren.getInt("ID_COLLABORATORE");
      int iIdAttrez      = wmPren.getInt("ID_ATTREZZATURA");
      Timestamp tsInizio = wmPren.getSQLTimestamp("DATAORA_INIZIO");
      Timestamp tsFine   = wmPren.getSQLTimestamp("DATAORA_FINE");
      String    sStato   = wmPren.getString("STATO");
      
      // Lock calendario
      DAOAgende.lock(conn, iIdColl, dDataApp, iOraApp, user);
      
      if(iIdAttrez != 0) {
        p = 0;
        pstmA = conn.prepareStatement("DELETE FROM PRZ_ATTREZZATURE_RIS WHERE ID_COLLABORATORE=? AND ID_ATTREZZATURA=? AND RISERVATO_DAL=? AND RISERVATO_AL=?");
        pstmA.setInt(++p,       iIdColl);
        pstmA.setInt(++p,       iIdAttrez);
        pstmA.setTimestamp(++p, tsInizio);
        pstmA.setTimestamp(++p, tsFine);
        pstmA.executeUpdate();
      }
      
      String sSQL_Upd = "UPDATE PRZ_PRENOTAZIONI SET STATO=?,NOTE=?,ID_UTE_UPDATE=?,DATA_UPDATE=?";
      if(sStato != null && sStato.equals("N")) {
        // Se lo stato della prenotazione e'  N = Non presentato
        // allora si aggiorna il marcatore con -1 per conservare
        // tale informazione.
        sSQL_Upd += ",MARCATORE=?";
      }
      sSQL_Upd += " WHERE ID=?";
      
      p = 0;
      pstmP = conn.prepareStatement(sSQL_Upd);
      // SET
      pstmP.setString(++p, "A");
      pstmP.setString(++p, sNote);
      pstmP.setInt(++p,    iIdUte);
      pstmP.setTimestamp(++p, new java.sql.Timestamp(System.currentTimeMillis()));
      if(sStato != null && sStato.equals("N")) {
        pstmP.setInt(++p, -1); // MARCATORE
      }
      // WHERE
      pstmP.setInt(++p,    prenotazione.getId());
      pstmP.executeUpdate();
      
      prenotazione.setMessaggio(null);
      
      // Ricostruzione del modello
      DAOAgende.rebuild(conn, iIdColl, dDataApp, iOraApp, user);
      
      // Log
      WSLogOperazioni.insert(conn, sOperazione, prenotazione);
    } 
    catch (Exception ex) {
      logger.error("Eccezione in WSPrenotazioni.revoke", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstmP, pstmA);
    }
    return prenotazione;
  }
  
  public static
  Prenotazione cancel(Connection conn, Prenotazione prenotazione, String sOperazione)
      throws Exception
  {
    if(prenotazione == null || prenotazione.getId() == 0) {
      return new Prenotazione("Prenotazione non valida");
    }
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    String sNote = prenotazione.getNote();
    
    int p = 0;
    PreparedStatement pstmP = null;
    PreparedStatement pstmA = null;
    try {
      WMap wmPren = new WMap(DBUtil.read(conn, "SELECT DATA_APPUNTAMENTO,ORA_APPUNTAMENTO,ID_COLLABORATORE,ID_ATTREZZATURA,DATAORA_INIZIO,DATAORA_FINE FROM PRZ_PRENOTAZIONI WHERE ID=?", prenotazione.getId()));
      Date dDataApp      = wmPren.getSQLDate("DATA_APPUNTAMENTO");
      if(dDataApp == null) {
        prenotazione.setMessaggio("Prenotazione " + prenotazione.getId() + " non trovata");
        return prenotazione;
      }
      int iOraApp        = wmPren.getInt("ORA_APPUNTAMENTO");
      int iIdColl        = wmPren.getInt("ID_COLLABORATORE");
      int iIdAttrez      = wmPren.getInt("ID_ATTREZZATURA");
      Timestamp tsInizio = wmPren.getSQLTimestamp("DATAORA_INIZIO");
      Timestamp tsFine   = wmPren.getSQLTimestamp("DATAORA_FINE");
      
      // Lock calendario
      DAOAgende.lock(conn, iIdColl, dDataApp, iOraApp, user);
      
      p = 0;
      pstmA = conn.prepareStatement("DELETE FROM PRZ_ATTREZZATURE_RIS WHERE ID_COLLABORATORE=? AND ID_ATTREZZATURA=? AND RISERVATO_DAL=? AND RISERVATO_AL=?");
      pstmA.setInt(++p,       iIdColl);
      pstmA.setInt(++p,       iIdAttrez);
      pstmA.setTimestamp(++p, tsInizio);
      pstmA.setTimestamp(++p, tsFine);
      pstmA.executeUpdate();
      
      p = 0;
      pstmP = conn.prepareStatement("UPDATE PRZ_PRENOTAZIONI SET FLAG_ATTIVO=?,STATO=?,NOTE=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?");
      // SET
      pstmP.setInt(++p,         0); // FLAG_ATTIVO
      pstmP.setString(++p,    "A"); // STATO
      pstmP.setString(++p,  sNote);
      pstmP.setInt(++p,    iIdUte);
      pstmP.setTimestamp(++p, new java.sql.Timestamp(System.currentTimeMillis()));
      // WHERE
      pstmP.setInt(++p,    prenotazione.getId());
      pstmP.executeUpdate();
      
      prenotazione.setMessaggio(null);
      
      WSLogOperazioni.insert(conn, sOperazione, prenotazione);
      
      // Ricostruzione del modello
      DAOAgende.rebuild(conn, iIdColl, dDataApp, iOraApp, user);
    } 
    catch (Exception ex) {
      logger.error("Eccezione in WSPrenotazioni.cancel", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstmP, pstmA);
    }
    return prenotazione;
  }
  
  public static
  Prenotazione update(Prenotazione prenotazione)
      throws Exception
  {
    logger.debug("WSPrenotazioni.update(" + prenotazione + ")...");
    if(prenotazione == null || prenotazione.getId() == 0) {
      return new Prenotazione("Prenotazione non valida");
    }
    int iId = prenotazione.getId();
    if(iId == 0) {
      return new Prenotazione("Identificativo della prenotazione non valido");
    }
    String sStato = prenotazione.getStato();
    String sNote  = prenotazione.getNote();
    String sTipo  = prenotazione.getTipo();
    
    boolean boPast = false;
    Calendar calDataOraApp = WUtil.toCalendar(prenotazione.getDataApp(), null);
    if(calDataOraApp != null) {
      String sOraApp = prenotazione.getOraApp();
      if(sOraApp != null && sOraApp.length() > 0) {
        calDataOraApp = WUtil.setTime(calDataOraApp, WUtil.toIntTime(sOraApp, 0));
        boPast = System.currentTimeMillis() > calDataOraApp.getTimeInMillis();
      }
    }
    
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
      
      if(sStato == null || sStato.length() == 0) {
        if(boPast) {
          String sOldStato = DBUtil.readString(conn, "SELECT STATO FROM PRZ_PRENOTAZIONI WHERE ID=?", iId);
          if(sOldStato != null && sOldStato.equalsIgnoreCase("C")) sStato = "E";
        }
      }
      
      if(sStato != null && sStato.length() > 0) {
        pstm = conn.prepareStatement("UPDATE PRZ_PRENOTAZIONI SET STATO=?,NOTE=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?");
      }
      else {
        pstm = conn.prepareStatement("UPDATE PRZ_PRENOTAZIONI SET TIPO_APPUNTAMENTO=?,NOTE=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?");
      }
      // SET
      if(sStato != null && sStato.length() > 0) {
        pstm.setString(++p, sStato.toUpperCase());
      }
      else {
        pstm.setString(++p, sTipo != null ? sTipo.toUpperCase() : null);
      }
      pstm.setString(++p,    sNote);
      pstm.setInt(++p,       iIdUte);
      pstm.setTimestamp(++p, new java.sql.Timestamp(System.currentTimeMillis()));
      // WHERE
      pstm.setInt(++p,    iId);
      pstm.executeUpdate();
      
      if(sStato != null && sStato.equals("N")) {
        DBUtil.execUpd(conn, "UPDATE PRZ_CLIENTI SET REPUTAZIONE=1 WHERE ID IN (SELECT ID_CLIENTE FROM PRZ_PRENOTAZIONI WHERE ID=?)", iId);
      }
      else if(sStato != null && sStato.equals("E")) {
        DBUtil.execUpd(conn, "UPDATE PRZ_CLIENTI SET REPUTAZIONE=0 WHERE ID IN (SELECT ID_CLIENTE FROM PRZ_PRENOTAZIONI WHERE ID=?)", iId);
      }
      
      ut.commit();
      
      prenotazione.setMessaggio(null);
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSPrenotazioni.update({id:" + iId + "})", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return prenotazione;
  }
  
  public static
  boolean updatePag(int iId, String sTipoPagamento)
      throws Exception
  {
    logger.debug("WSPrenotazioni.updatePag(" + iId + "," + sTipoPagamento + ")...");
    if(iId == 0) {
      logger.debug("WSPrenotazioni.updatePag(" + iId + "," + sTipoPagamento + ") -> false (iId=" + iId + ")");
      return false;
    }
    List<Integer> listOfIdPren = new ArrayList<Integer>(1);
    listOfIdPren.add(iId);
    return updatePag(listOfIdPren, sTipoPagamento, -1, null);
  }
  
  public static
  boolean updatePag(List<Integer> listOfIdPren, String sTipoPagamento, int iImpPagato, String sCodCoupon)
      throws Exception
  {
    return updatePag(listOfIdPren, sTipoPagamento, (double) iImpPagato, sCodCoupon, "");
  }
  
  public static
  boolean updatePag(List<Integer> listOfIdPren, String sTipoPagamento, double dImpPagato, String sCodCoupon)
      throws Exception
  {
    return updatePag(listOfIdPren, sTipoPagamento, dImpPagato, sCodCoupon, "");
  }
  
  public static
  boolean updatePag(List<Integer> listOfIdPren, String sTipoPagamento, int iImpPagato, String sCodCoupon, String sCausale)
      throws Exception
  {
    return updatePag(listOfIdPren, sTipoPagamento, (double) iImpPagato, sCodCoupon, sCausale);
  }
  
  public static
  boolean updatePag(List<Integer> listOfIdPren, String sTipoPagamento, double dImpPagato, String sCodCoupon, String sCausale)
      throws Exception
  {
    logger.debug("WSPrenotazioni.updatePag(" + listOfIdPren + "," + sTipoPagamento + "," + dImpPagato + "," + sCodCoupon + "," + sCausale + ")...");
    if(listOfIdPren == null || listOfIdPren.size() == 0) {
      return false;
    }
    if(sTipoPagamento == null || sTipoPagamento.length() == 0) {
      return false;
    }
    sTipoPagamento = sTipoPagamento.toUpperCase();
    if(sTipoPagamento.length() > 3) {
      sTipoPagamento = sTipoPagamento.substring(0, 3);
    }
    int iFlagPagato = 1;
    if(sTipoPagamento != null && sTipoPagamento.startsWith("NES")) {
      iFlagPagato = 0;
    }
    if(sCausale != null && sCausale.length() > 50) {
      sCausale = sCausale.substring(0, 50);
    }
    Calendar calCurrDate = WUtil.getCurrentDate();
    int iCurrDate = WUtil.toIntDate(calCurrDate, 0);
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    if(sCodCoupon != null && sCodCoupon.length() > 0) {
      sCodCoupon = sCodCoupon.trim();
      StringBuilder sbNormalized = new StringBuilder();
      boolean lastIsASep = false;
      for(int i = 0; i < sCodCoupon.length(); i++) {
        char c = sCodCoupon.charAt(i);
        if(c == ',' || c == ' ' || c == ';' || c == ':' || c == '_' || c == '/') {
          if(!lastIsASep) sbNormalized.append(',');
          lastIsASep = true;
        }
        else {
          lastIsASep = false;
          sbNormalized.append(c);
        }
      }
      sCodCoupon = sbNormalized.toString();
    }
    else {
      sCodCoupon = "";
    }
    List<String> listCoupon = new ArrayList<String>();
    int iSep = sCodCoupon != null ? sCodCoupon.indexOf(',') : -1;
    if(iSep >= 0) {
      int iBegin = 0;
      while(iSep >= 0) {
        listCoupon.add(sCodCoupon.substring(iBegin, iSep));
        iBegin = iSep + 1;
        iSep = sCodCoupon.indexOf(',', iBegin);
      }
      listCoupon.add(sCodCoupon.substring(iBegin));
    }
    else {
      listCoupon.add(sCodCoupon);
    }
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      if(dImpPagato >= 0.0d) {
        pstm = conn.prepareStatement("UPDATE PRZ_PRENOTAZIONI SET STATO=?,FLAG_PAGATO=?,TIPO_PAGAMENTO=?,CODICE_COUPON=?,CAUSALE=?,IMPORTO_PAGATO=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?");
      }
      else {
        pstm = conn.prepareStatement("UPDATE PRZ_PRENOTAZIONI SET STATO=?,FLAG_PAGATO=?,TIPO_PAGAMENTO=?,CODICE_COUPON=?,CAUSALE=?,IMPORTO_PAGATO=PREZZO_FINALE,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?");
      }
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      for(int i = 0; i < listOfIdPren.size(); i++) {
        Integer oId = listOfIdPren.get(i);
        if(oId == null) continue;
        int iId = oId.intValue();
        if(iId == 0) continue;
        
        Calendar calDataApp = DBUtil.readCalendar(conn, "SELECT DATA_APPUNTAMENTO FROM PRZ_PRENOTAZIONI WHERE ID=?", iId);
        if(calDataApp == null) {
          continue;
        }
        int iDataApp = WUtil.toIntDate(calDataApp, 0);
        if(iDataApp < iCurrDate) {
          logger.debug("WSPrenotazioni.updatePag(" + listOfIdPren + "," + sTipoPagamento + ") -> false (iDataApp=" + iDataApp + " != iCurrDate=" + iCurrDate + ")");
          ut.rollback();
          return false;
        }
        
        String sCodCoupon_i = null;
        if(listCoupon.size() > i) {
          sCodCoupon_i = listCoupon.get(i);
        }
        else {
          sCodCoupon_i = listCoupon.get(listCoupon.size()-1);
        }
        if(sCodCoupon_i == null) sCodCoupon_i = "";
        sCodCoupon_i = sCodCoupon_i.toUpperCase();
        
        p = 0;
        // SET
        pstm.setString(++p, "E");
        pstm.setInt(++p,    iFlagPagato);
        pstm.setString(++p, sTipoPagamento);
        pstm.setString(++p, sCodCoupon_i);
        pstm.setString(++p, sCausale);
        if(dImpPagato >= 0.0d) {
          pstm.setDouble(++p, dImpPagato);
        }
        pstm.setInt(++p,       iIdUte);
        pstm.setTimestamp(++p, new java.sql.Timestamp(System.currentTimeMillis()));
        // WHERE
        pstm.setInt(++p,    iId);
        pstm.executeUpdate();
        
        DBUtil.execUpd(conn, "UPDATE PRZ_CLIENTI SET REPUTAZIONE=0 WHERE ID IN (SELECT ID_CLIENTE FROM PRZ_PRENOTAZIONI WHERE ID=?)", iId);
      }
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSPrenotazioni.updatePag(" + listOfIdPren + "," + sTipoPagamento + "," + dImpPagato + "," + sCodCoupon + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return true;
  }
  
  public static
  int importData(Connection conn, InputStream is, int iIdGru, int iIdFar, java.util.Date dFrom, java.util.Date dTo)
      throws Exception
  {
    if(conn == null || is == null) return 0;
    
    int iCurrDate = WUtil.toIntDate(WUtil.getCurrentDate(), 0);
    int iFromDate = WUtil.toIntDate(dFrom, 0);
    int iToDate   = WUtil.toIntDate(dTo, 0);
    
    String sSQL_Ins = "INSERT INTO PRZ_PRENOTAZIONI(ID,ID_UTE_INSERT,DATA_INSERT,ID_UTE_UPDATE,DATA_UPDATE,FLAG_ATTIVO,ID_GRU,ID_FAR,CODICE,ID_CLIENTE,ID_PRESTAZIONE,ID_COLLABORATORE,ID_ATTREZZATURA,DATA_APPUNTAMENTO,ORA_APPUNTAMENTO,GIORNO,DURATA,DATAORA_INIZIO,DATAORA_FINE,STATO,NOTE,PREZZO_FINALE)";
    sSQL_Ins += "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    String sSQL_Sel = "SELECT ID FROM PRZ_PRENOTAZIONI WHERE ID_CLIENTE=? AND ID_PRESTAZIONE=? AND ID_COLLABORATORE=? AND DATA_APPUNTAMENTO=? AND ORA_APPUNTAMENTO=?";
    
    String sSQL_InA = "INSERT INTO PRZ_ATTREZZATURE_RIS(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_ATTREZZATURA,ID_COLLABORATORE,RISERVATO_DAL,RISERVATO_AL) VALUES(?,?,?,?,?,?,?,?)";
    
    int iRow = 0;
    int p = 0;
    int iResult = 0;
    
    PreparedStatement pstmI = null;
    PreparedStatement pstmS = null;
    PreparedStatement pstmA = null;
    ResultSet rs = null;
    BufferedReader br = null;
    try {
      pstmI = conn.prepareStatement(sSQL_Ins);
      pstmS = conn.prepareStatement(sSQL_Sel);
      pstmA = conn.prepareStatement(sSQL_InA);
      
      br = new BufferedReader(new InputStreamReader(is));
      
      String sLine = null;
      while((sLine = br.readLine()) != null) {
        
        iRow++;
        if(iRow == 1) continue; // Header
        
        WList wlRecord = new WList(sLine, ',');
        
        Date dDataPren        = wlRecord.getSQLDate(0,  null);
        Date dDataUpdate      = wlRecord.getSQLDate(1,  null);
        Calendar calStart     = wlRecord.getCalendar(2, null);
        Calendar calEnd       = wlRecord.getCalendar(3, null);
        Date dDataDelete      = wlRecord.getSQLDate(4,  null);
        String sCollaboratore = wlRecord.getString(5,   null);
        String sTrattamento   = wlRecord.getString(6,   null);
        String sAttrezzatura  = wlRecord.getString(7,   null);
        double dPrice         = wlRecord.getDouble(8,   0.0d);
        String sCliente       = wlRecord.getUpperString(9, "");
        
        int iDataApp = WUtil.toIntDate(calStart, 0);
        int iOraApp  = WUtil.toIntTime(calStart, 0);
        if(iDataApp == 0) {
          System.out.println("[" + iRow + "] Prenotazione scartata: data appuntamento assente o non valida");
          continue;
        }
        if(iFromDate > 0 && iDataApp < iFromDate) continue;
        if(iToDate   > 0 && iDataApp > iToDate)   continue;
        
        if(calStart == null || calEnd == null) {
          System.out.println("[" + iRow + "] Prenotazione scartata: dati temporali assenti");
          continue;
        }
        if(sCollaboratore == null || sCollaboratore.length() == 0) {
          System.out.println("[" + iRow + "] Prenotazione scartata: collaboratore non valorizzato.");
          continue;
        }
        if(sTrattamento == null || sTrattamento.length() == 0) {
          System.out.println("[" + iRow + "] Prenotazione scartata: trattamento non valorizzato.");
          continue;
        }
        if(sCliente == null || sCliente.length() == 0) {
          System.out.println("[" + iRow + "] Prenotazione scartata: cliente non valorizzato.");
          continue;
        }
        int iDurata = DataUtil.diffMinutes(calEnd, calStart);
        if(iDurata == 0 || iDurata > 1440) {
          System.out.println("[" + iRow + "] Prenotazione scartata durata anomala = " + iDurata);
          continue;
        }
        
        if(sCollaboratore != null && sCollaboratore.startsWith("\"") && sCollaboratore.endsWith("\"")) {
          sCollaboratore = sCollaboratore.substring(1, sCollaboratore.length()-1);
        }
        if(sTrattamento != null && sTrattamento.startsWith("\"") && sTrattamento.endsWith("\"")) {
          sTrattamento = sTrattamento.substring(1, sTrattamento.length()-1);
        }
        sTrattamento = sTrattamento.replace('#', ',');
        sTrattamento = sTrattamento.replace("LuminositC B Viso", "Luminosit&agrave; Viso");
        sTrattamento = sTrattamento.replace("LuminositC",        "Luminosit&agrave;");
        sTrattamento = sTrattamento.replace(";  Viso",           "; Viso");
        
        sCollaboratore = sCollaboratore.trim();
        sTrattamento   = sTrattamento.trim();
        sAttrezzatura  = sAttrezzatura != null ? sAttrezzatura.trim() : "";
        sCliente       = sCliente.trim();
        
        iResult++;
        if(iResult % 500 == 0) System.out.println(iResult);
        
        int iIdPrestazione = DBUtil.readInt(conn, "SELECT ID FROM PRZ_PRESTAZIONI WHERE ID_FAR=? AND DESCRIZIONE=?", iIdFar, sTrattamento);
        if(iIdPrestazione == 0) {
          System.out.println("[" + iRow + "] Prenotazione scartata: trattamento \"" + sTrattamento + "\" non identificato");
          continue;
        }
        int iIdCollaboratore = DBUtil.readInt(conn, "SELECT ID FROM PRZ_COLLABORATORI WHERE ID_FAR=? AND NOME=?", iIdFar, sCollaboratore);
        if(iIdCollaboratore == 0) {
          System.out.println("[" + iRow + "] Prenotazione scartata: collaboratore \"" + sCollaboratore + "\" non identificato");
          continue;
        }
        int iIdAttrezzatura = 0;
        if(sAttrezzatura != null && sAttrezzatura.length() > 0) {
          iIdAttrezzatura = DBUtil.readInt(conn, "SELECT ID FROM PRZ_ATTREZZATURE WHERE ID_FAR=? AND DESCRIZIONE=?", iIdFar, sAttrezzatura);
          if(iIdAttrezzatura == 0) {
            System.out.println("[" + iRow + "] Prenotazione scartata: attrezzatura \"" + sAttrezzatura + "\" non identificata");
            continue;
          }
        }
        int iIdCliente = DBUtil.readInt(conn, "SELECT ID FROM PRZ_CLIENTI WHERE ID_GRU=? AND (NOME || ' ' || COGNOME)=?", iIdGru, sCliente);
        if(iIdCliente == 0) {
          iIdCliente = WSClienti.create(sCliente, iIdGru);
          if(iIdCliente != 0) {
            System.out.println("[" + iRow + "] cliente \"" + sCliente + "\" creato con id=" + iIdCliente);
          }
          else {
            System.out.println("[" + iRow + "] Prenotazione scartata: cliente \"" + sCliente + "\" non identificato");
            continue;
          }
        }
        
        String codPren = iDataApp + "_" + iOraApp + "_" + iIdCliente;
        
        int iIdPre = 0;
        pstmS.setInt(1,  iIdCliente);
        pstmS.setInt(2,  iIdPrestazione);
        pstmS.setInt(3,  iIdCollaboratore);
        pstmS.setDate(4, new java.sql.Date(calStart.getTimeInMillis()));
        pstmS.setInt(5,  iOraApp);
        rs = pstmS.executeQuery();
        if(rs.next()) iIdPre = rs.getInt("ID");
        rs.close();
        
        if(iIdPre != 0) {
          System.out.println("[" + iRow + "] Prenotazione gia' presente id=" + iIdPre);
          continue;
        }
        
        iIdPre = ConnectionManager.nextVal(conn, "SEQ_PRZ_PRENOTAZIONI");
        
        int iGiorno = DateSplitter.getDayOfWeek(iDataApp);
        
        p = 0;
        pstmI.setInt(++p,     iIdPre);
        pstmI.setInt(++p,     0);
        if(dDataPren != null) {
          pstmI.setDate(++p,    dDataPren);
        }
        else {
          pstmI.setDate(++p,    new java.sql.Date(System.currentTimeMillis()));
        }
        pstmI.setInt(++p,     0);
        if(dDataDelete != null) {
          pstmI.setDate(++p,    dDataDelete);
        }
        else if(dDataUpdate != null) {
          pstmI.setDate(++p,    dDataUpdate);
        }
        else {
          pstmI.setDate(++p,    new java.sql.Date(System.currentTimeMillis()));
        }
        pstmI.setInt(++p,       1); // FLAG_ATTIVO
        pstmI.setInt(++p,       iIdGru);
        pstmI.setInt(++p,       iIdFar);
        pstmI.setString(++p,    codPren);
        pstmI.setInt(++p,       iIdCliente);
        pstmI.setInt(++p,       iIdPrestazione);
        pstmI.setInt(++p,       iIdCollaboratore);
        pstmI.setInt(++p,       iIdAttrezzatura);
        pstmI.setDate(++p,      WUtil.toSQLDate(iDataApp, null));
        pstmI.setInt(++p,       iOraApp);
        pstmI.setInt(++p,       iGiorno);
        pstmI.setInt(++p,       iDurata);
        pstmI.setTimestamp(++p, new java.sql.Timestamp(calStart.getTimeInMillis()));
        pstmI.setTimestamp(++p, new java.sql.Timestamp(calEnd.getTimeInMillis()));
        pstmI.setString(++p,    dDataDelete == null ? "C" : "A");
        pstmI.setString(++p,    "#" + iRow);
        pstmI.setDouble(++p,    dPrice);
        pstmI.executeUpdate();
        
        if(iDataApp >= iCurrDate && iIdAttrezzatura != 0) {
          int iIdRis = ConnectionManager.nextVal(conn, "SEQ_PRZ_ATTREZZATURE_RIS");
          
          p = 0;
          pstmA.setInt(++p,  iIdRis);
          pstmA.setInt(++p,  0);
          pstmA.setDate(++p, new java.sql.Date(System.currentTimeMillis()));
          pstmA.setInt(++p,  1);
          pstmA.setInt(++p,  iIdAttrezzatura);
          pstmA.setInt(++p,  iIdCollaboratore);
          pstmA.setTimestamp(++p, new java.sql.Timestamp(calStart.getTimeInMillis()));
          pstmA.setTimestamp(++p, new java.sql.Timestamp(calEnd.getTimeInMillis()));
          pstmA.executeUpdate();
        }
        
        conn.commit();
      }
    }
    catch(Exception ex) {
      ex.printStackTrace();
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstmI, pstmS, pstmA, conn);
    }
    return iResult;
  }
}
