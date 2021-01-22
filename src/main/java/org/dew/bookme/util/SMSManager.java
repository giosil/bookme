package org.dew.bookme.util;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.sql.Connection;

import org.dew.bookme.dao.DAOLog;

public 
class SMSManager 
{
  private static final String SMS_SERVICE_URL = "";
  private static final String SMS_SERVICE_USR = "XXXXXXXX";
  private static final String SMS_SERVICE_PWD = "********";
  private static final String SMS_SERVICE_SND = "bookme";
  
  public static
  int sendSMS(String number, String message)
  {
    if(number == null || number.length() == 0) {
      return -1;
    }
    if(message == null || message.length() == 0) {
      return -1;
    }
    
    if(SMS_SERVICE_URL == null || SMS_SERVICE_URL.length() < 10) {
      System.out.println(number + ": " + message);
      return -1;
    }
    
    int result = 0;
    
    String response = "";
    URLConnection urlConnection = null;
    DataOutputStream dataOutputStream = null;
    try {
      URL url = new URL(SMS_SERVICE_URL);
      
      urlConnection = url.openConnection();
      urlConnection.setConnectTimeout(5000);
      urlConnection.setDoInput(true);
      urlConnection.setDoOutput(true);
      
      dataOutputStream = new DataOutputStream(urlConnection.getOutputStream());
      String content = "user=" + URLEncoder.encode(SMS_SERVICE_USR, "UTF-8") + 
          "&pass="   + URLEncoder.encode(SMS_SERVICE_PWD, "UTF-8") + 
          "&rcpt="   + URLEncoder.encode(number, "UTF-8") + 
          "&data="   + URLEncoder.encode(message, "UTF-8") + 
          "&sender=" + URLEncoder.encode(SMS_SERVICE_SND, "UTF-8") + 
          "&qty="    + URLEncoder.encode("h", "UTF-8");
      
      dataOutputStream.writeBytes(content);
      dataOutputStream.flush();
      dataOutputStream.close();
      
      BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
      String line;
      while (((line = bufferedReader.readLine())) != null) {
        response += line + " ";
      }
      
      System.out.println(response);
      
      boolean sent = response.trim().equalsIgnoreCase("OK");
      
      result = sent ? 1 : 0;
    }
    catch(Exception ex) {
      System.err.println("SMSManager.sendSMS(\"" + number + "\",\"" + message + "\"): " + ex);
    }
    finally {
      if(dataOutputStream != null) try { dataOutputStream.close(); } catch(Exception ex) {}
    }
    
    return result;
  }
  
  public static
  int sendSMS(Connection conn, int iIdUtente, int iIdGru, int iIdAzi, int iIdFar, int iIdCliente, String number, String message)
  {
    if(number == null || number.length() == 0) {
      return -1;
    }
    if(message == null || message.length() == 0) {
      return -1;
    }
    
    if(SMS_SERVICE_URL == null || SMS_SERVICE_URL.length() < 10) {
      System.out.println(number + ": " + message);
      return -1;
    }
    
    int result = 0;
    
    String response = "";
    URLConnection urlConnection = null;
    DataOutputStream dataOutputStream = null;
    try {
      URL url = new URL(SMS_SERVICE_URL);
      
      urlConnection = url.openConnection();
      urlConnection.setConnectTimeout(5000);
      urlConnection.setDoInput(true);
      urlConnection.setDoOutput(true);
      
      dataOutputStream = new DataOutputStream(urlConnection.getOutputStream());
      String content = "user=" + URLEncoder.encode(SMS_SERVICE_USR, "UTF-8") + 
          "&pass="   + URLEncoder.encode(SMS_SERVICE_PWD, "UTF-8") + 
          "&rcpt="   + URLEncoder.encode(number, "UTF-8") + 
          "&data="   + URLEncoder.encode(message, "UTF-8") + 
          "&sender=" + URLEncoder.encode(SMS_SERVICE_SND, "UTF-8") + 
          "&qty="    + URLEncoder.encode("h", "UTF-8");
      
      dataOutputStream.writeBytes(content);
      dataOutputStream.flush();
      dataOutputStream.close();
      
      BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
      String line;
      while (((line = bufferedReader.readLine())) != null) {
        response += line + " ";
      }
      
      boolean sent = response.trim().equalsIgnoreCase("OK");
      
      result = sent ? 1 : 0;
      
      DAOLog.insertLogSms(conn, iIdUtente, iIdGru, iIdAzi, iIdFar, iIdCliente, number, message, sent, response);
    }
    catch(Exception ex) {
      System.err.println("SMSManager.sendSMS(conn," + iIdUtente + "," + iIdGru + "," + iIdAzi + "," + iIdFar + "," + iIdCliente + ",\"" + number + "\",\"" + message + "\"): " + ex);
    }
    finally {
      if(dataOutputStream != null) try { dataOutputStream.close(); } catch(Exception ex) {}
    }
    
    return result;
  }
  
}
