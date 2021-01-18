package org.dew.bookme.ws;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.UserTransaction;

import org.apache.log4j.Logger;

import org.util.WList;
import org.util.WUtil;

import org.dew.bookme.bl.Cliente;
import org.dew.bookme.bl.User;

import org.dew.bookme.util.ConnectionManager;
import org.dew.bookme.util.DBUtil;
import org.dew.bookme.util.DataUtil;
import org.dew.bookme.util.SMSManager;
import org.dew.bookme.util.WSContext;

public 
class WSClienti 
{
  protected static Logger logger = Logger.getLogger(WSClienti.class);
  
  public static
  boolean merge(int iIdCliente1, int iIdCliente2)
      throws Exception
  {
    logger.debug("WSClienti.merge(" + iIdCliente1 + "," + iIdCliente2 + ")...");
    if(iIdCliente1 == 0 || iIdCliente2 == 0) {
      return false;
    }
    boolean boResult = false;
    Connection conn = null;
    UserTransaction ut = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      // Le prenotazioni di iIdCliente1 passano a iIdCliente2
      DBUtil.execUpd(conn, "UPDATE PRZ_PRENOTAZIONI SET ID_CLIENTE=?,MARCATORE=? WHERE ID_CLIENTE=?", iIdCliente2, iIdCliente1, iIdCliente1);
      
      // Il cliente iIdCliente1 viene rimosso
      int iRes = DBUtil.execUpd(conn, "UPDATE PRZ_CLIENTI SET FLAG_ATTIVO=? WHERE ID=?", 0, iIdCliente1);
      
      boResult = iRes != 0;
      
      ut.commit();
    }
    catch(Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSClienti.merge(" + iIdCliente1 + "," + iIdCliente2 + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
    logger.debug("WSClienti.merge(" + iIdCliente1 + "," + iIdCliente2 + ") -> " + boResult);
    return boResult;
  }
  
  public static
  List<Map<String, Object>> lookup(Map<String,Object> mapFilter)
      throws Exception
  {
    List<Map<String, Object>> listResult = new ArrayList<Map<String, Object>>();
    
    if(mapFilter == null || mapFilter.isEmpty()) {
      return listResult;
    }
    String sQuery = WUtil.toUpperString(mapFilter.get("q"), null);
    if(sQuery == null || sQuery.length() == 0) {
      return listResult;
    }
    
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "SELECT ID,COGNOME,NOME ";
    sSQL += "FROM PRZ_CLIENTI ";
    sSQL += "WHERE ID_GRU=? AND FLAG_ATTIVO=? ";
    if(sQuery != null && sQuery.length() > 0) {
      char c0 = sQuery.charAt(0);
      if(Character.isDigit(c0) || c0 == '+') {
        sSQL += "AND TELEFONO_1 LIKE ? ";
      }
      else {
        sSQL += "AND COGNOME LIKE ? ";
      }
    }
    sSQL += "ORDER BY COGNOME";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p, iIdGru);
      pstm.setInt(++p, 1);
      if(sQuery != null && sQuery.length() > 0) {
        pstm.setString(++p, "%" + sQuery + "%");
      }
      
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId          = rs.getInt("ID");
        String sCognome     = rs.getString("COGNOME");
        String sNome        = rs.getString("NOME");
        
        Map<String, Object> mapRecord = new HashMap<String, Object>(2);
        mapRecord.put("id",   String.valueOf(iId));
        mapRecord.put("text", sCognome + " " + sNome);
        
        listResult.add(mapRecord);
        if(listResult.size() > 1000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSClienti.lookup", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  List<Cliente> find(Cliente filter)
      throws Exception
  {
    List<Cliente> listResult = new ArrayList<Cliente>();
    
    if(filter == null) filter = new Cliente();
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sFNominativo = WUtil.toUpperString(filter.getNominativo(), null);
    String sFCognome    = WUtil.toUpperString(filter.getCognome(),    null);
    String sFNome       = WUtil.toUpperString(filter.getNome(),       null);
    String sFSesso      = WUtil.toUpperString(filter.getSesso(),      null);
    String sFEmail      = WUtil.toLowerString(filter.getEmail(),      null);
    String sFTelefono   = filter.getTelefono1();
    String sFOpzioni    = WUtil.toUpperString(filter.getOpzioni(),    null);
    int    iFIdFarPren  = 0;
    if(sFOpzioni != null && sFOpzioni.length() > 0) {
      char c0 = sFOpzioni.charAt(0);
      if(Character.isDigit(c0)) {
        try { iFIdFarPren = Integer.parseInt(sFOpzioni); } catch(Exception ex) {}
        if(iFIdFarPren != 0) sFOpzioni = null;
      }
    }
    
    if(sFNominativo != null && sFNominativo.length() > 0) {
      sFNominativo = sFNominativo.trim().replace("  ", " ");
    }
    
    int iEtaDa = filter.getEtaDa();
    int iEtaA  = filter.getEtaA();
    
    String sSQL = "SELECT ID,COGNOME,NOME,CODICE_FISCALE,SESSO,DATA_NASCITA,TELEFONO_1,TELEFONO_2,EMAIL,REPUTAZIONE ";
    sSQL += "FROM PRZ_CLIENTI ";
    sSQL += "WHERE ID_GRU=? AND FLAG_ATTIVO=? ";
    if(sFNominativo != null && sFNominativo.length() > 0) {
      char c0 = sFNominativo.charAt(0);
      if(Character.isDigit(c0) || c0 == '+') {
        sFNominativo = DataUtil.normalizePhoneNumber(sFNominativo);
        sSQL += "AND TELEFONO_1 LIKE ? ";
      }
      else {
        sSQL += "AND (COGNOME || ' ' || NOME) LIKE ? ";
      }
    }
    if(sFCognome != null && sFCognome.length() > 0) {
      char c0 = sFCognome.charAt(0);
      if(Character.isDigit(c0) || c0 == '+') {
        sFCognome = DataUtil.normalizePhoneNumber(sFCognome);
        sSQL += "AND TELEFONO_1 LIKE ? ";
      }
      else {
        sSQL += "AND COGNOME LIKE ? ";
      }
    }
    if(sFNome != null && sFNome.length() > 0) {
      sSQL += "AND NOME LIKE ? ";
    }
    if(sFSesso != null && sFSesso.length() > 0) {
      sSQL += "AND SESSO=? ";
    }
    if(sFEmail != null && sFEmail.length() > 0) {
      char c0 = sFEmail.charAt(0);
      if(sFEmail.indexOf('@') < 0 && (Character.isDigit(c0) || c0 == '+')) {
        sFEmail = DataUtil.normalizePhoneNumber(sFEmail);
        sSQL += "AND TELEFONO_1 LIKE ? ";
      }
      else {
        sSQL += "AND EMAIL LIKE ? ";
      }
    }
    if(sFTelefono != null && sFTelefono.length() > 0) {
      sFTelefono = DataUtil.normalizePhoneNumber(sFTelefono);
      sSQL += "AND TELEFONO_1 LIKE ? ";
    }
    if(sFOpzioni != null && sFOpzioni.equals("M")) {
      sSQL += "AND ID_UTE_INSERT=? ";
    }
    if(iEtaDa != 0 || iEtaA != 0) {
      sSQL += "AND DATA_NASCITA>=? AND DATA_NASCITA<=? ";
    }
    if(iFIdFarPren != 0) {
      sSQL += "AND ID IN (SELECT ID_CLIENTE FROM PRZ_PRENOTAZIONI WHERE ID_FAR=? AND DATA_APPUNTAMENTO>=? AND STATO<>'A' GROUP BY ID_CLIENTE) ";
    }
    sSQL += "ORDER BY COGNOME";
    
    int p = 0;
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p, iIdGru);
      pstm.setInt(++p, 1);
      if(sFNominativo != null && sFNominativo.length() > 0) {
        pstm.setString(++p, "%" + sFNominativo.trim() + "%");
      }
      if(sFCognome != null && sFCognome.length() > 0) {
        pstm.setString(++p, sFCognome.trim() + "%");
      }
      if(sFNome != null && sFNome.length() > 0) {
        pstm.setString(++p, sFNome.trim() + "%");
      }
      if(sFSesso != null && sFSesso.length() > 0) {
        pstm.setString(++p, sFSesso);
      }
      if(sFEmail != null && sFEmail.length() > 0) {
        pstm.setString(++p, sFEmail.trim() + "%");
      }
      if(sFTelefono != null && sFTelefono.length() > 0) {
        pstm.setString(++p, sFTelefono.trim() + "%");
      }
      if(sFOpzioni != null && sFOpzioni.equals("M")) {
        pstm.setInt(++p, iIdUte);
      }
      if(iEtaDa != 0 || iEtaA != 0) {
        if(iEtaDa == iEtaA) iEtaA++;
        Calendar calLt = WUtil.getCurrentDate();
        calLt.set(Calendar.DATE, 1);
        if(iEtaA > 0) {
          calLt.add(Calendar.YEAR, iEtaA * -1);
        }
        else {
          calLt.add(Calendar.YEAR, -120);
        }
        Calendar calGt  = WUtil.getCurrentDate();
        calGt.set(Calendar.DATE, 1);
        calGt.add(Calendar.MONTH, 1);
        calGt.add(Calendar.DATE, -1);
        if(iEtaDa > 0) {
          calGt.add(Calendar.YEAR, iEtaDa * -1);
        }
        pstm.setDate(++p, new java.sql.Date(calLt.getTimeInMillis()));
        pstm.setDate(++p, new java.sql.Date(calGt.getTimeInMillis()));
      }
      if(iFIdFarPren != 0) {
        pstm.setInt(++p, iFIdFarPren);
        Calendar calFrom = WUtil.getCurrentDate();
        calFrom.add(Calendar.MONTH, -6);
        pstm.setDate(++p, new java.sql.Date(calFrom.getTimeInMillis()));
      }
      
      rs = pstm.executeQuery();
      while(rs.next()) {
        int    iId          = rs.getInt("ID");
        String sCognome     = rs.getString("COGNOME");
        String sNome        = rs.getString("NOME");
        String sCodFiscale  = rs.getString("CODICE_FISCALE");
        String sSesso       = rs.getString("SESSO");
        Date   dDataNascita = rs.getDate("DATA_NASCITA");
        String sTelefono1   = rs.getString("TELEFONO_1");
        String sTelefono2   = rs.getString("TELEFONO_2");
        String sEmail       = rs.getString("EMAIL");
        int iReputazione    = rs.getInt("REPUTAZIONE");
        
        Cliente record = new Cliente();
        record.setId(iId);
        record.setCognome(sCognome);
        record.setNome(sNome);
        record.setCodiceFiscale(sCodFiscale);
        record.setSesso(sSesso);
        record.setDataNascita(dDataNascita);
        record.setTelefono1(sTelefono1);
        record.setTelefono2(sTelefono2);
        record.setEmail(sEmail);
        record.setReputazione(iReputazione);
        
        listResult.add(record);
        if(listResult.size() > 10000) break;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSClienti.find", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return listResult;
  }
  
  public static
  boolean isDisPrenOnLine(Connection conn, int iId)
      throws Exception
  {
    boolean boResult = false;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement("SELECT DIS_PREN_ONLINE FROM PRZ_CLIENTI WHERE ID=?");
      pstm.setInt(1, iId);
      rs = pstm.executeQuery();
      if(rs.next()) {
        int iDisPrenOnLine  = rs.getInt("DIS_PREN_ONLINE");
        boResult = iDisPrenOnLine != 0;
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSClienti.isDisPrenOnLine(conn," + iId + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return boResult;
  }
  
  public static
  Cliente read(int iId)
      throws Exception
  {
    Cliente result = null;
    
    if(iId == 0) return result;
    
    String sSQL = "SELECT ID,COGNOME,NOME,CODICE_FISCALE,SESSO,DATA_NASCITA,TELEFONO_1,TELEFONO_2,EMAIL,NOTE,DIS_PREN_ONLINE FROM PRZ_CLIENTI WHERE ID=?";
    
    Connection conn = null;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(1, iId);
      rs = pstm.executeQuery();
      if(rs.next()) {
        String sCognome     = rs.getString("COGNOME");
        String sNome        = rs.getString("NOME");
        String sCodFiscale  = rs.getString("CODICE_FISCALE");
        String sSesso       = rs.getString("SESSO");
        Date   dDataNascita = rs.getDate("DATA_NASCITA");
        String sTelefono1   = rs.getString("TELEFONO_1");
        String sTelefono2   = rs.getString("TELEFONO_2");
        String sEmail       = rs.getString("EMAIL");
        String sNote        = rs.getString("NOTE");
        int iDisPrenOnLine  = rs.getInt("DIS_PREN_ONLINE");
        
        result = new Cliente();
        result.setId(iId);
        result.setCognome(sCognome);
        result.setNome(sNome);
        result.setCodiceFiscale(sCodFiscale);
        result.setSesso(sSesso);
        result.setDataNascita(dDataNascita);
        result.setTelefono1(sTelefono1);
        result.setTelefono2(sTelefono2);
        result.setEmail(sEmail);
        result.setNote(sNote);
        result.setDisPrenOnLine(iDisPrenOnLine != 0);
        
        result.setPrenotazioni(WSPrenotazioni.history(conn, iId));
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSClienti.read(" + iId + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm, conn);
    }
    return result;
  }
  
  public static
  Cliente exists(String sNumTelefono)
      throws Exception
  {
    User user  = WSContext.getUser();
    int iIdGru = user != null ? user.getGroup() : 0;
    
    Connection conn = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      return exists(conn, iIdGru, sNumTelefono);
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSClienti.exists(" + sNumTelefono + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(conn);
    }
  }
  
  public static
  Cliente exists(Connection conn, int iIdGru, String sNumTelefono)
      throws Exception
  {
    Cliente result = null;
    
    if(sNumTelefono == null || sNumTelefono.length() == 0) return null;
    sNumTelefono = DataUtil.normalizePhoneNumber(sNumTelefono);
    
    String sSQL = "SELECT ID,COGNOME,NOME,CODICE_FISCALE,SESSO,DATA_NASCITA,TELEFONO_1,TELEFONO_2,EMAIL,NOTE FROM PRZ_CLIENTI WHERE TELEFONO_1=? AND FLAG_ATTIVO=? AND ID_GRU=?";
    
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      pstm.setString(1, sNumTelefono);
      pstm.setInt(2, 1);
      pstm.setInt(3, iIdGru);
      rs = pstm.executeQuery();
      if(rs.next()) {
        int    iId          = rs.getInt("ID");
        String sCognome     = rs.getString("COGNOME");
        String sNome        = rs.getString("NOME");
        String sCodFiscale  = rs.getString("CODICE_FISCALE");
        String sSesso       = rs.getString("SESSO");
        Date   dDataNascita = rs.getDate("DATA_NASCITA");
        String sTelefono1   = rs.getString("TELEFONO_1");
        String sTelefono2   = rs.getString("TELEFONO_2");
        String sEmail       = rs.getString("EMAIL");
        String sNote        = rs.getString("NOTE");
        
        result = new Cliente();
        result.setId(iId);
        result.setCognome(sCognome);
        result.setNome(sNome);
        result.setCodiceFiscale(sCodFiscale);
        result.setSesso(sSesso);
        result.setDataNascita(dDataNascita);
        result.setTelefono1(sTelefono1);
        result.setTelefono2(sTelefono2);
        result.setEmail(sEmail);
        result.setNote(sNote);
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSClienti.exists(conn," + iIdGru + "," + sNumTelefono + ")", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return result;
  }
  
  public static
  int getId(Connection conn, int iIdGru, int iIdFar, String sTelefono)
      throws Exception
  {
    if(sTelefono == null || sTelefono.length() == 0) return 0;
    if(iIdGru == 0 && iIdFar == 0) return 0;
    sTelefono = DataUtil.normalizePhoneNumber(sTelefono);
    
    int iResult = 0;
    
    String sSQL = "SELECT ID FROM PRZ_CLIENTI WHERE ID_GRU=? AND FLAG_ATTIVO=? AND TELEFONO_1 LIKE ?";
    
    int p = 0;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      if(iIdGru == 0) {
        iIdGru = DBUtil.readInt(conn, "SELECT ID_GRU FROM PRZ_STRUTTURE WHERE ID_FAR=?", iIdFar);
      }
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,    iIdGru);
      pstm.setInt(++p,    1);
      pstm.setString(++p, sTelefono + "%");
      
      rs = pstm.executeQuery();
      if(rs.next()) iResult = rs.getInt("ID");
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSClienti.getId", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return iResult;
  }
  
  public static
  int getIdOrCreate(Connection conn, int iIdGru, int iIdFar, String sCognome, String sNome, String sTelefono)
      throws Exception
  {
    if(sCognome  == null || sCognome.length()  == 0) return 0;
    if(sNome     == null || sNome.length()     == 0) return 0;
    if(sTelefono == null || sTelefono.length() == 0) return 0;
    if(iIdGru == 0 && iIdFar == 0) return 0;
    sTelefono = DataUtil.normalizePhoneNumber(sTelefono);
    
    int iResult = 0;
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    String sSQL = "SELECT ID FROM PRZ_CLIENTI WHERE ID_GRU=? AND FLAG_ATTIVO=? AND COGNOME=? AND NOME=? AND TELEFONO_1 LIKE ?";
    
    int p = 0;
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      if(iIdGru == 0) {
        iIdGru = DBUtil.readInt(conn, "SELECT ID_GRU FROM PRZ_STRUTTURE WHERE ID_FAR=?", iIdFar);
      }
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,    iIdGru);
      pstm.setInt(++p,    1);
      pstm.setString(++p, sCognome);
      pstm.setString(++p, sNome);
      pstm.setString(++p, sTelefono + "%");
      
      rs = pstm.executeQuery();
      if(rs.next()) iResult = rs.getInt("ID");
      rs.close();
      
      if(iResult == 0) {
        pstm.close();
        
        iResult = ConnectionManager.nextVal(conn, "SEQ_PRZ_CLIENTI");
        
        p = 0;
        pstm = conn.prepareStatement("INSERT INTO PRZ_CLIENTI(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,COGNOME,NOME,TELEFONO_1) VALUES(?,?,?,?,?,?,?,?)");
        pstm.setInt(++p,    iResult);
        pstm.setInt(++p,    iIdUte);
        pstm.setDate(++p,   new java.sql.Date(System.currentTimeMillis()));
        pstm.setInt(++p,    1);
        pstm.setInt(++p,    iIdGru);
        pstm.setString(++p, sCognome);
        pstm.setString(++p, sNome);
        pstm.setString(++p, sTelefono);
        pstm.executeUpdate();
      }
    }
    catch(Exception ex) {
      logger.error("Eccezione in WSClienti.getIdOrCreate", ex);
      throw ex;
    }
    finally {
      ConnectionManager.close(rs, pstm);
    }
    return iResult;
  }
  
  public 
  Cliente insert(Cliente record) 
      throws Exception 
  {
    logger.debug("WSClienti.insert(" + record + ")...");
    if(record == null) return null;
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    
    String sSQL = "INSERT INTO PRZ_CLIENTI(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,COGNOME,NOME,CODICE_FISCALE,SESSO,DATA_NASCITA,TELEFONO_1,TELEFONO_2,EMAIL,NOTE,DIS_PREN_ONLINE) ";
    sSQL += "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    // In questo modo al client ritorna il bean normalizzato
    record.setCognome(WUtil.toUpperString(record.getCognome(), ""));
    record.setNome(WUtil.toUpperString(record.getNome(), ""));
    record.setCodiceFiscale(WUtil.toUpperString(record.getCodiceFiscale(), ""));
    
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      int iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_CLIENTI");
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,     iId);
      pstm.setInt(++p,     iIdUte);
      pstm.setDate(++p,    new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
      pstm.setInt(++p,     1); // FLAG_ATTIVO
      pstm.setInt(++p,     iIdGru);
      pstm.setString(++p,  WUtil.toUpperString(record.getCognome(),       ""));
      pstm.setString(++p,  WUtil.toUpperString(record.getNome(),          ""));
      pstm.setString(++p,  WUtil.toUpperString(record.getCodiceFiscale(), ""));
      pstm.setString(++p,  WUtil.toUpperString(record.getSesso(),         ""));
      pstm.setDate(++p,    WUtil.toSQLDate(record.getDataNascita(),     null));
      pstm.setString(++p,  DataUtil.normalizePhoneNumber(record.getTelefono1()));
      pstm.setString(++p,  DataUtil.normalizePhoneNumber(record.getTelefono2()));
      pstm.setString(++p,  WUtil.toLowerString(record.getEmail(),         ""));
      pstm.setString(++p,  record.getNote());
      pstm.setInt(++p,     record.isDisPrenOnLine() ? 1 : 0);
      pstm.executeUpdate();
      
      ut.commit();
      
      record.setId(iId);
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSClienti.insert", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return record;
  }
  
  public static
  int create(String sNominativo, int iIdGru) 
      throws Exception 
  {
    if(sNominativo == null || sNominativo.length() == 0) {
      return 0;
    }
    String sCognome = getCognome(sNominativo);
    String sNome    = getNome(sNominativo);
    if(sCognome == null || sCognome.length() == 0) return 0;
    if(sNome    == null || sNome.length()    == 0) sNome = "-";
    
    String sSQL = "INSERT INTO PRZ_CLIENTI(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,COGNOME,NOME,CODICE_FISCALE,SESSO,DATA_NASCITA,TELEFONO_1,TELEFONO_2,EMAIL,NOTE) ";
    sSQL += "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    int iId = 0;
    int p = 0;
    Connection conn = null;
    UserTransaction ut = null;
    PreparedStatement pstm = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      ut = ConnectionManager.getUserTransaction(conn);
      ut.begin();
      
      iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_CLIENTI");
      
      pstm = conn.prepareStatement(sSQL);
      pstm.setInt(++p,    iId);
      pstm.setInt(++p,    1);
      pstm.setDate(++p,   new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
      pstm.setInt(++p,    1); // FLAG_ATTIVO
      pstm.setInt(++p,    iIdGru);
      pstm.setString(++p, sCognome);
      pstm.setString(++p, sNome);
      pstm.setString(++p, "");
      pstm.setString(++p, "");
      pstm.setDate(++p,   null);
      pstm.setString(++p, "");
      pstm.setString(++p, "");
      pstm.setString(++p, "");
      pstm.setString(++p, "");
      pstm.executeUpdate();
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSClienti.create", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return iId;
  }
  
  public 
  Cliente update(Cliente record) 
      throws Exception 
  {
    logger.debug("WSClienti.update(" + record + ")...");
    if(record == null || record.getId() == 0) {
      throw new Exception("Identificativo assente");
    }
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    
    // In questo modo al client ritorna il bean normalizzato
    record.setCognome(WUtil.toUpperString(record.getCognome(), ""));
    record.setNome(WUtil.toUpperString(record.getNome(), ""));
    record.setCodiceFiscale(WUtil.toUpperString(record.getCodiceFiscale(), ""));
    
    int iId = record.getId();
    
    String sSQL = "UPDATE PRZ_CLIENTI SET COGNOME=?,NOME=?,CODICE_FISCALE=?,SESSO=?,DATA_NASCITA=?,TELEFONO_1=?,TELEFONO_2=?,EMAIL=?,NOTE=?,DIS_PREN_ONLINE=?,ID_UTE_UPDATE=?,DATA_UPDATE=? WHERE ID=?";
    
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
      pstm.setString(++p,    WUtil.toUpperString(record.getCognome(),       ""));
      pstm.setString(++p,    WUtil.toUpperString(record.getNome(),          ""));
      pstm.setString(++p,    WUtil.toUpperString(record.getCodiceFiscale(), ""));
      pstm.setString(++p,    WUtil.toUpperString(record.getSesso(),         ""));
      pstm.setDate(++p,      WUtil.toSQLDate(record.getDataNascita(),     null));
      pstm.setString(++p,    DataUtil.normalizePhoneNumber(record.getTelefono1()));
      pstm.setString(++p,    DataUtil.normalizePhoneNumber(record.getTelefono2()));
      pstm.setString(++p,    WUtil.toLowerString(record.getEmail(),         ""));
      pstm.setString(++p,    record.getNote());
      pstm.setInt(++p,       record.isDisPrenOnLine() ? 1 : 0);
      pstm.setInt(++p,       iIdUte);
      pstm.setDate(++p,      new java.sql.Date(System.currentTimeMillis())); // DATA_UPDATE
      // WHERE
      pstm.setInt(++p,       iId);
      pstm.executeUpdate();
      
      ut.commit();
    } 
    catch (Exception ex) {
      ConnectionManager.rollback(ut);
      logger.error("Eccezione in WSClienti.update", ex);
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
    logger.debug("WSClienti.delete(" + iId + ")...");
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
      
      pstm = conn.prepareStatement("UPDATE PRZ_CLIENTI SET FLAG_ATTIVO=?,ID_UTE_DELETE=?,DATA_DELETE=? WHERE ID=?");
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
      logger.error("Eccezione in WSClienti.delete(" + iId + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(pstm, conn);
    }
    return result;
  }
  
  public static
  int importData(Connection conn, InputStream is, int iIdGru)
      throws Exception
  {
    if(conn == null || is == null) return 0;
    
    String sSQL_Ins = "INSERT INTO PRZ_CLIENTI(ID,ID_UTE_INSERT,DATA_INSERT,FLAG_ATTIVO,ID_GRU,COGNOME,NOME,CODICE_FISCALE,SESSO,DATA_NASCITA,TELEFONO_1,TELEFONO_2,EMAIL,NOTE) ";
    sSQL_Ins += "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    String sSQL_Upd = "UPDATE PRZ_CLIENTI ";
    sSQL_Upd += "SET COGNOME=?,NOME=?,CODICE_FISCALE=?,SESSO=?,DATA_NASCITA=?,TELEFONO_1=?,TELEFONO_2=?,EMAIL=?,NOTE=?,ID_UTE_UPDATE=?,DATA_UPDATE=? ";
    sSQL_Upd += "WHERE ID=?";
    
    int iRow = 0;
    int iResult = 0;
    
    PreparedStatement pstmI = null;
    PreparedStatement pstmU = null;
    BufferedReader br = null;
    try {
      pstmI = conn.prepareStatement(sSQL_Ins);
      pstmU = conn.prepareStatement(sSQL_Upd);
      
      br = new BufferedReader(new InputStreamReader(is));
      
      String sLine = null;
      while((sLine = br.readLine()) != null) {
        
        iRow++;
        if(iRow == 1) continue; // Header
        
        WList wlRecord = new WList(sLine, ',');
        
        String sNome      = wlRecord.getUpperString(0, "");
        String sCognome   = wlRecord.getUpperString(1, "");
        String sTelefono1 = wlRecord.getString(2,      "");
        String sEmail     = wlRecord.getLowerString(3, "");
        String sSesso     = wlRecord.getUpperString(4, "");
        String sNote      = wlRecord.getString(5,      "");
        //				String sCitta     = wlRecord.getString(6,      "");
        //				String sCap       = wlRecord.getString(7,      "");
        Date dDataNascita = wlRecord.getSQLDate(8,   null);
        
        if(sCognome   == null || sCognome.length()   == 0) sCognome   = "-";
        if(sTelefono1 == null || sTelefono1.length() == 0) sTelefono1 = "-";
        if(sNote != null && sNote.startsWith("\"") && sNote.endsWith("\"")) {
          sNote = sNote.substring(1, sNote.length()-1);
        }
        if(sSesso != null && sSesso.length() > 0) sSesso = sSesso.substring(0, 1);
        iResult++;
        
        int iId = DBUtil.readInt(conn, "SELECT ID FROM PRZ_CLIENTI WHERE COGNOME=? AND NOME=? AND TELEFONO_1=?", sCognome, sNome, sTelefono1);
        if(iId == 0) {
          // Insert
          iId = ConnectionManager.nextVal(conn, "SEQ_PRZ_CLIENTI");
          
          int p = 0;
          pstmI.setInt(++p,     iId);
          pstmI.setInt(++p,     1);
          pstmI.setDate(++p,    new java.sql.Date(System.currentTimeMillis())); // DATA_INSERT
          pstmI.setInt(++p,     1); // FLAG_ATTIVO
          pstmI.setInt(++p,     iIdGru);
          pstmI.setString(++p,  sCognome);
          pstmI.setString(++p,  sNome);
          pstmI.setString(++p,  "");
          pstmI.setString(++p,  sSesso);
          pstmI.setDate(++p,    dDataNascita);
          pstmI.setString(++p,  DataUtil.normalizePhoneNumber(sTelefono1));
          pstmI.setString(++p,  "");
          pstmI.setString(++p,  sEmail);
          pstmI.setString(++p,  sNote);
          pstmI.executeUpdate();
        }
        else {
          // Update
          
          int p = 0;
          // SET
          pstmU.setString(++p,  sCognome);
          pstmU.setString(++p,  sNome);
          pstmU.setString(++p,  "");
          pstmU.setString(++p,  sSesso);
          pstmU.setDate(++p,    dDataNascita);
          pstmU.setString(++p,  DataUtil.normalizePhoneNumber(sTelefono1));
          pstmU.setString(++p,  "");
          pstmU.setString(++p,  sEmail);
          pstmU.setString(++p,  sNote);
          pstmU.setInt(++p,     1);
          pstmU.setDate(++p,    new java.sql.Date(System.currentTimeMillis())); // DATA_UPDATE
          // WHERE
          pstmU.setInt(++p,     iId);
          pstmU.executeUpdate();
        }
        
        conn.commit();
      }
    }
    catch(Exception ex) {
      ex.printStackTrace();
      throw ex;
    }
    finally {
      ConnectionManager.close(pstmI, pstmU, conn);
    }
    return iResult;
  }
  
  public static
  boolean sendSMS(int iIdCliente, String sText)
      throws Exception
  {
    logger.debug("WSClienti.sendSMS(" + iIdCliente + "," + sText + ")...");
    if(iIdCliente == 0) return false;
    if(sText == null || sText.length() == 0) return false;
    
    User user  = WSContext.getUser();
    int iIdUte = user != null ? user.getId()    : 0;
    int iIdGru = user != null ? user.getGroup() : 0;
    
    boolean result = false;
    Connection conn = null;
    try {
      conn = ConnectionManager.getDefaultConnection();
      
      String sTelefono = DBUtil.readString(conn, "SELECT TELEFONO_1 FROM PRZ_CLIENTI WHERE ID=?", iIdCliente);
      
      if(sTelefono == null || sTelefono.length() < 9) {
        return false;
      }
      
      SMSManager.sendSMS(conn, iIdUte, iIdGru, 0, 0, iIdCliente, sTelefono, sText);
    }
    catch (Exception ex) {
      logger.error("Eccezione in WSClienti.sendSMS(" + iIdCliente + "," + sText + ")", ex);
      throw ex;
    } 
    finally {
      ConnectionManager.close(conn);
    }
    return result;
  }
  
  public static
  String getCognome(String sNomeCognome)
  {
    if(sNomeCognome == null || sNomeCognome.length() == 0) return null;
    
    int iSep = sNomeCognome.lastIndexOf(' ');
    if(iSep < 0) return "";
    if(iSep > 3) {
      char c = sNomeCognome.charAt(iSep - 3);
      if(c == ' ') iSep = iSep - 3;
    }
    return sNomeCognome.substring(iSep + 1).trim().toUpperCase();
  }
  
  public static
  String getNome(String sNomeCognome)
  {
    if(sNomeCognome == null) return null;
    
    int iSep = sNomeCognome.lastIndexOf(' ');
    if(iSep < 0) return "";
    if(iSep > 3) {
      char c = sNomeCognome.charAt(iSep - 3);
      if(c == ' ') iSep = iSep - 3;
    }
    return sNomeCognome.substring(0, iSep).trim().toUpperCase();
  }
}
