package org.dew.bookme.util;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

import java.sql.Blob;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.util.WUtil;

public
class DBUtil
{
  public static final String sFIELDS = "#f";
  
  public static
  int readInt(Connection conn, String sSQL, Object... parameters)
      throws SQLException
  {
    int iResult = 0;
    PreparedStatement pstm = null;
    ResultSet rs  = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      setParameters(pstm, parameters);
      rs = pstm.executeQuery();
      if(rs.next()) iResult = rs.getInt(1);
    }
    finally {
      if(rs   != null) try{ rs.close();   } catch(Exception ex) {}
      if(pstm != null) try{ pstm.close(); } catch(Exception ex) {}
    }
    return iResult;
  }
  
  public static
  int readInt(Connection conn, int iDefault, String sSQL, Object... parameters)
      throws SQLException
  {
    int iResult = 0;
    PreparedStatement pstm = null;
    ResultSet rs  = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      setParameters(pstm, parameters);
      rs = pstm.executeQuery();
      if(rs.next()) {
        iResult = rs.getInt(1);
      }
      else {
        iResult = iDefault;
      }
    }
    finally {
      if(rs   != null) try{ rs.close();   } catch(Exception ex) {}
      if(pstm != null) try{ pstm.close(); } catch(Exception ex) {}
    }
    return iResult;
  }
  
  public static
  double readDouble(Connection conn, String sSQL, Object... parameters)
      throws SQLException
  {
    double dResult = 0;
    PreparedStatement pstm = null;
    ResultSet rs  = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      setParameters(pstm, parameters);
      rs = pstm.executeQuery();
      if(rs.next()) dResult = rs.getDouble(1);
    }
    finally {
      if(rs   != null) try{ rs.close();   } catch(Exception ex) {}
      if(pstm != null) try{ pstm.close(); } catch(Exception ex) {}
    }
    return dResult;
  }
  
  public static
  Calendar readCalendar(Connection conn, String sSQL, Object... parameters)
      throws SQLException
  {
    Calendar calResult = null;
    PreparedStatement pstm = null;
    ResultSet rs  = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      setParameters(pstm, parameters);
      rs = pstm.executeQuery();
      if(rs.next()) {
        Date date = rs.getDate(1);
        if(date != null) {
          calResult = Calendar.getInstance();
          calResult.setTimeInMillis(date.getTime());
        }
      }
    }
    finally {
      if(rs   != null) try{ rs.close();   } catch(Exception ex) {}
      if(pstm != null) try{ pstm.close(); } catch(Exception ex) {}
    }
    return calResult;
  }
  
  public static
  Calendar readDateTime(Connection conn, String sSQL, Object... parameters)
      throws SQLException
  {
    Calendar calResult = null;
    PreparedStatement pstm = null;
    ResultSet rs  = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      setParameters(pstm, parameters);
      rs = pstm.executeQuery();
      if(rs.next()) {
        Timestamp timestamp = rs.getTimestamp(1);
        if(timestamp != null) {
          calResult = Calendar.getInstance();
          calResult.setTimeInMillis(timestamp.getTime());
        }
      }
    }
    finally {
      if(rs   != null) try{ rs.close();   } catch(Exception ex) {}
      if(pstm != null) try{ pstm.close(); } catch(Exception ex) {}
    }
    return calResult;
  }
  
  public static
  String readString(Connection conn, String sSQL, Object... parameters)
      throws SQLException
  {
    String result = null;
    PreparedStatement pstm = null;
    ResultSet rs  = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      setParameters(pstm, parameters);
      rs = pstm.executeQuery();
      if(rs.next()) result = rs.getString(1);
    }
    finally {
      if(rs   != null) try{ rs.close();   } catch(Exception ex) {}
      if(pstm != null) try{ pstm.close(); } catch(Exception ex) {}
    }
    return result;
  }
  
  public static
  int execUpd(Connection conn, String sSQL, Object... parameters)
      throws SQLException
  {
    int result = 0;
    PreparedStatement pstm = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      setParameters(pstm, parameters);
      result = pstm.executeUpdate();
    }
    finally {
      if(pstm != null) try{ pstm.close(); } catch(Exception ex) {}
    }
    return result;
  }
  
  public static
  Map<String, Object> read(Connection conn, String sSQL)
      throws Exception
  {
    Statement stm = null;
    try {
      stm = conn.createStatement();
      return toMap(stm.executeQuery(sSQL));
    }
    finally {
      if(stm != null) try{ stm.close(); } catch(Exception ex) {}
    }
  }
  
  public static
  Map<String, Object> read(Connection conn, String sSQL, Object... parameters)
      throws Exception
  {
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      setParameters(pstm, parameters);
      return toMap(pstm.executeQuery());
    }
    finally {
      if(rs   != null) try{ rs.close();   } catch(Exception ex) {}
      if(pstm != null) try{ pstm.close(); } catch(Exception ex) {}
    }
  }
  
  public static
  List<Map<String, Object>> readList(Connection conn, String sSQL)
      throws Exception
  {
    Statement stm = null;
    try {
      stm = conn.createStatement();
      return toList(stm.executeQuery(sSQL));
    }
    finally {
      if(stm != null) try{ stm.close(); } catch(Exception ex) {}
    }
  }
  
  public static
  List<Map<String, Object>> readList(Connection conn, String sSQL, Object... parameters)
      throws Exception
  {
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      setParameters(pstm, parameters);
      return toList(pstm.executeQuery());
    }
    finally {
      if(rs   != null) try{ rs.close();   } catch(Exception ex) {}
      if(pstm != null) try{ pstm.close(); } catch(Exception ex) {}
    }
  }
  
  public static
  List<Integer> readListOfInteger(Connection conn, String sSQL)
      throws Exception
  {
    Statement stm = null;
    try {
      stm = conn.createStatement();
      return toListOfInteger(stm.executeQuery(sSQL));
    }
    finally {
      if(stm != null) try{ stm.close(); } catch(Exception ex) {}
    }
  }
  
  public static
  List<Integer> readListOfInteger(Connection conn, String sSQL, Object... parameters)
      throws Exception
  {
    PreparedStatement pstm = null;
    ResultSet rs = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      setParameters(pstm, parameters);
      return toListOfInteger(pstm.executeQuery());
    }
    finally {
      if(rs   != null) try{ rs.close();   } catch(Exception ex) {}
      if(pstm != null) try{ pstm.close(); } catch(Exception ex) {}
    }
  }
  
  public static
  Map<String, Object> toMap(ResultSet rs)
      throws Exception
  {
    Map<String,Object> mapResult = null;
    
    List<String> listFields = new ArrayList<String>();
    try {
      ResultSetMetaData rsmd = rs.getMetaData();
      int iColumnCount = rsmd.getColumnCount();
      if(rs.next()) {
        mapResult = new HashMap<String,Object>();
        mapResult.put(sFIELDS, listFields);
        for(int i = 1; i <= iColumnCount; i++) {
          String sField  = rsmd.getColumnName(i);
          int iFieldType = rsmd.getColumnType(i);
          if(iFieldType == java.sql.Types.CHAR || iFieldType == java.sql.Types.VARCHAR) {
            mapResult.put(sField, rs.getString(i));
          }
          else if(iFieldType == java.sql.Types.DATE) {
            mapResult.put(sField, rs.getDate(i));
          }
          else if(iFieldType == java.sql.Types.TIME || iFieldType == java.sql.Types.TIMESTAMP) {
            mapResult.put(sField, rs.getTimestamp(i));
          }
          else if(iFieldType == java.sql.Types.BINARY || iFieldType == java.sql.Types.BLOB || iFieldType == java.sql.Types.CLOB) {
            mapResult.put(sField, getBLOBContent(rs, i));
          }
          else {
            String sValue = rs.getString(i);
            if(sValue != null) {
              if(sValue.indexOf('.') >= 0 || sValue.indexOf(',') >= 0) {
                mapResult.put(sField, new Double(rs.getDouble(i)));
              }
              else {
                mapResult.put(sField, new Integer(rs.getInt(i)));
              }
            }
            else {
              mapResult.put(sField, null);
            }
          }
          listFields.add(sField);
        }
      }
    }
    finally {
      if(rs  != null) try{ rs.close();  } catch(Exception ex) {}
    }
    return mapResult;
  }
  
  public static
  List<Map<String, Object>> toList(ResultSet rs)
      throws Exception
  {
    List<Map<String,Object>> listResult = new ArrayList<Map<String,Object>>();
    
    List<String> listFields = new ArrayList<String>();
    try {
      ResultSetMetaData rsmd = rs.getMetaData();
      int iColumnCount = rsmd.getColumnCount();
      while(rs.next()) {
        Map<String,Object> mapResult = new HashMap<String,Object>();
        if(listResult.size() == 0) {
          mapResult.put(sFIELDS, listFields);
        }
        listResult.add(mapResult);
        
        for(int i = 1; i <= iColumnCount; i++) {
          String sField  = rsmd.getColumnName(i);
          int iFieldType = rsmd.getColumnType(i);
          if(iFieldType == java.sql.Types.CHAR || iFieldType == java.sql.Types.VARCHAR) {
            mapResult.put(sField, rs.getString(i));
          }
          else if(iFieldType == java.sql.Types.DATE) {
            mapResult.put(sField, rs.getDate(i));
          }
          else if(iFieldType == java.sql.Types.TIME || iFieldType == java.sql.Types.TIMESTAMP) {
            mapResult.put(sField, rs.getTimestamp(i));
          }
          else if(iFieldType == java.sql.Types.BINARY || iFieldType == java.sql.Types.BLOB || iFieldType == java.sql.Types.CLOB) {
            mapResult.put(sField, getBLOBContent(rs, i));
          }
          else {
            String sValue = rs.getString(i);
            if(sValue != null) {
              if(sValue.indexOf('.') >= 0 || sValue.indexOf(',') >= 0) {
                mapResult.put(sField, new Double(rs.getDouble(i)));
              }
              else {
                mapResult.put(sField, new Integer(rs.getInt(i)));
              }
            }
            else {
              mapResult.put(sField, null);
            }
          }
          listFields.add(sField);
        }
      }
    }
    finally {
      if(rs  != null) try{ rs.close();  } catch(Exception ex) {}
    }
    return listResult;
  }
  
  public static
  List<Integer> toListOfInteger(ResultSet rs)
      throws Exception
  {
    List<Integer> listResult = new ArrayList<Integer>();
    try {
      while(rs.next()) {
        listResult.add(rs.getInt(1));
      }
    }
    finally {
      if(rs  != null) try{ rs.close();  } catch(Exception ex) {}
    }
    return listResult;
  }
  
  public static
  boolean insert(Connection conn, String sTable, Map<String, Object> mapValues)
      throws SQLException
  {
    if(mapValues == null || mapValues.isEmpty()) return false;
    
    List<String> listFields = getFields(mapValues);
    if(listFields == null || listFields.size() == 0) return false;
    
    String sSQL = "INSERT INTO " + sTable;
    String sFields = "";
    for(int i = 0; i < listFields.size(); i++) {
      sFields += "," + listFields.get(i);
    }
    sFields = sFields.substring(1);
    sSQL += "(" + sFields + ") VALUES ";
    String sValues = "";
    for(int i = 0; i < listFields.size(); i++) sValues += ",?";
    sValues = sValues.substring(1);
    sSQL += "(" + sValues + ")";
    PreparedStatement pstm = null;
    try {
      pstm = conn.prepareStatement(sSQL);
      for(int i = 0; i < listFields.size(); i++) {
        String sField = listFields.get(i);
        Object oValue = mapValues.get(sField);
        if(oValue == null) {
          pstm.setObject(i + 1, null);
        }
        else if(oValue instanceof String) {
          pstm.setString(i + 1, oValue.toString());
        }
        else if(oValue instanceof Integer) {
          pstm.setInt(i + 1,((Integer) oValue).intValue());
        }
        else if(oValue instanceof Double) {
          pstm.setDouble(i + 1,((Double) oValue).doubleValue());
        }
        else if(oValue instanceof java.sql.Date) {
          pstm.setDate(i + 1,(java.sql.Date) oValue);
        }
        else if(oValue instanceof java.sql.Timestamp) {
          pstm.setTimestamp(i + 1,(java.sql.Timestamp) oValue);
        }
        else if(oValue instanceof byte[]) {
          pstm.setBytes(i + 1,(byte[]) oValue);
        }
        else {
          pstm.setString(i + 1, oValue.toString());
        }
      }
      pstm.executeUpdate();
    }
    finally {
      if(pstm != null) try { pstm.close(); } catch(Exception ex) {}
    }
    return true;
  }
  
  public static
  List<String> getFields(Map<String, Object> mapValues)
  {
    List<String> listResult = null;
    if(mapValues == null || mapValues.isEmpty()) return new ArrayList<String>();
    listResult = WUtil.toListOfString(mapValues.get(sFIELDS));
    if(listResult != null) return listResult;
    listResult = new ArrayList<String>();
    Iterator<String> itKeys = mapValues.keySet().iterator();
    while(itKeys.hasNext()) {
      Object oKey = itKeys.next();
      listResult.add(oKey.toString());
    }
    return listResult;
  }
  
  public static
  String buildInSet(List<?> oElements)
  {
    if(oElements == null || oElements.size() == 0) return "";
    StringBuilder sb = new StringBuilder();
    for(int i = 0; i < oElements.size(); i++) {
      Object oElement = oElements.get(i);
      if(oElement instanceof String) {
        sb.append(",'" +((String) oElement).replace("'", "''") + "'");
      } 
      else {
        sb.append("," + oElement.toString());
      }
    }
    String s = sb.toString();
    return s.substring(1);
  }
  
  public static
  String buildInSet(Set<?> setElements)
  {
    if(setElements == null || setElements.size() == 0) return "";
    StringBuilder sb = new StringBuilder();
    Iterator<?> iterator = setElements.iterator();
    while(iterator.hasNext()) {
      Object oElement = iterator.next();
      if(oElement instanceof String) {
        sb.append(",'" + ((String) oElement).replace("'", "''") + "'");
      } 
      else {
        sb.append("," + oElement.toString());
      }
    }
    String s = sb.toString();
    return s.substring(1);
  }
  
  public static
  String buildInSet(Set<?> setElements, int iMaxElements)
  {
    if(setElements == null || setElements.size() == 0) return "";
    int iElements = 0;
    StringBuilder sb = new StringBuilder();
    Iterator<?> iterator = setElements.iterator();
    while(iterator.hasNext()) {
      Object oElement = iterator.next();
      if(oElement instanceof String) {
        sb.append(",'" + ((String) oElement).replace("'", "''") + "'");
      } 
      else {
        sb.append("," + oElement.toString());
      }
      iElements++;
      if(iElements >= iMaxElements) break;
    }
    String s = sb.toString();
    return s.substring(1);
  }
  
  public static
  String buildInSet(List<?> oElements, String sSymbolic)
  {
    if(oElements == null || oElements.size() == 0) return "";
    StringBuilder sb = new StringBuilder();
    for(int i = 0; i < oElements.size(); i++) {
      Object oElement = oElements.get(i);
      if(oElement instanceof String) {
        sb.append(",'" + ((String) oElement).replace("'", "''") + "'");
      } 
      else if(oElement instanceof Map) {
        Object oValue = ((Map<?, ?>) oElement).get(sSymbolic);
        if(oValue == null) {
          continue;
        }
        if(oValue instanceof String) {
          sb.append(",'" + oValue.toString().replace("'", "''") + "'");
        } 
        else {
          sb.append("," + oValue);
        }
      } 
      else {
        sb.append("," + oElement.toString());
      }
    }
    return sb.toString().substring(1);
  }
  
  public static
  byte[] getBLOBContent(ResultSet rs, int index)
      throws Exception
  {
    Blob blob = rs.getBlob(index);
    if(blob == null) return null;
    InputStream is = blob.getBinaryStream();
    // Lettura del contenuto
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    byte[] abDataBuffer = new byte[1024];
    int iBytesRead = 0;
    while((iBytesRead = is.read(abDataBuffer, 0, abDataBuffer.length)) != -1) {
      baos.write(abDataBuffer, 0, iBytesRead);
    }
    baos.flush();
    return baos.toByteArray();
  }
  
  public static
  byte[] getBLOBContent(ResultSet rs, String sFieldName)
      throws Exception
  {
    Blob blob = rs.getBlob(sFieldName);
    if(blob == null) return null;
    InputStream is = blob.getBinaryStream();
    // Lettura del contenuto
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    byte[] abDataBuffer = new byte[1024];
    int iBytesRead = 0;
    while((iBytesRead = is.read(abDataBuffer, 0, abDataBuffer.length)) != -1) {
      baos.write(abDataBuffer, 0, iBytesRead);
    }
    baos.flush();
    return baos.toByteArray();
  }
  
  public static
  boolean setEmptyBLOB(Connection conn, String sField, String sTable, String sWhere)
      throws Exception
  {
    int iRows = 0;
    String sSQL = "UPDATE " + sTable + " SET " + sField + " = EMPTY_BLOB() WHERE " + sWhere;
    Statement stm = null;
    try{
      stm = conn.createStatement();
      iRows = stm.executeUpdate(sSQL);
    }
    finally {
      if(stm != null) try{ stm.close(); } catch(Exception ex) {}
    }
    return iRows > 0;
  }
  
  public static
  boolean setBLOBContent(Connection conn, String sField, String sTable, String sWhere, byte[] abBlobContent)
      throws Exception
  {
    // Richiamare sempre setEmptyBLOB
    boolean setEmptyRes = setEmptyBLOB(conn, sField, sTable, sWhere);
    if(abBlobContent == null || abBlobContent.length == 0) {
      return setEmptyRes;
    }
    String sSQL = "SELECT " + sField + " FROM " + sTable;
    if(sWhere != null && sWhere.length() > 0) sSQL += " WHERE " + sWhere;
    sSQL += " FOR UPDATE";
    boolean boResult = false;
    Statement stm = null;
    ResultSet rs = null;
    try{
      stm = conn.createStatement();
      rs = stm.executeQuery(sSQL);
      if(rs.next()) {
        Blob blob = rs.getBlob(sField);
        // Il metodo oracle.sql.BLOB.getBinaryOutputStream e' deprecato
        // OutputStream blobOutputStream = ((oracle.sql.BLOB)blob).getBinaryOutputStream();
        OutputStream blobOutputStream = blob.setBinaryStream(0);
        for(int i = 0; i < abBlobContent.length; i++) {
          blobOutputStream.write(abBlobContent[i]);
        }
        blobOutputStream.flush();
        blobOutputStream.close();
        boResult = true;
      }
    }
    finally {
      if(rs  != null) try{ rs.close();  } catch(Exception ex) {}
      if(stm != null) try{ stm.close(); } catch(Exception ex) {}
    }
    return boResult;
  }
  
  public static
  String buildInSetParams(int iItems)
  {
    if(iItems < 1) return "";
    StringBuilder sb = new StringBuilder();
    for(int i = 0; i < iItems; i++) sb.append(",?");
    return sb.substring(1);
  }
  
  protected static
  void setParameters(PreparedStatement pstm, Object... parameters)
      throws SQLException
  {
    if(parameters == null || parameters.length == 0) return;
    for(int i = 0; i < parameters.length; i++) {
      Object parameter = parameters[i];
      if(parameter instanceof Integer) {
        pstm.setInt(i+1, ((Integer) parameter).intValue());
      }
      else if(parameter instanceof Long) {
        pstm.setLong(i+1, ((Long) parameter).longValue());
      }
      else if(parameter instanceof Double) {
        pstm.setDouble(i+1, ((Double) parameter).doubleValue());
      }
      else if(parameter instanceof String) {
        pstm.setString(i+1, (String) parameter);
      }
      else if(parameter instanceof Boolean) {
        pstm.setInt(i+1, ((Boolean) parameter).booleanValue() ? 1 : 0);
      }
      else if(parameter instanceof java.util.Calendar) {
        pstm.setDate(i+1, new java.sql.Date(((java.util.Calendar) parameter).getTimeInMillis()));
      }
      else if(parameter instanceof java.sql.Date) {
        pstm.setDate(i+1, (java.sql.Date) parameter);
      }
      else if(parameter instanceof java.sql.Timestamp) {
        pstm.setTimestamp(i+1, (java.sql.Timestamp) parameter);
      }
      else if(parameter instanceof java.sql.Time) {
        pstm.setTime(i+1, (java.sql.Time) parameter);
      }
      else if(parameter instanceof java.util.Date) {
        // java.util.Date deve stare dopo java.sql.Date, Timestamp e Time in quanto queste tre classi ereditano da java.util.Date
        // pertanto un oggetto di tipo java.sql.Date o Timestamp o Time � anche un oggetto di tipo java.util.Date
        pstm.setDate(i+1, new java.sql.Date(((java.util.Date) parameter).getTime()));
      }
      else {
        pstm.setObject(i+1, parameter);
      }
    }
  }
}
