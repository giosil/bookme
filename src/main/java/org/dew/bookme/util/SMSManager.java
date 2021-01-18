package org.dew.bookme.util;

import java.sql.Connection;

import org.dew.bookme.dao.DAOLog;

public 
class SMSManager 
{
  public static
  int sendSMS(String number, String message)
  {
    if(number == null || number.length() == 0) {
      return -1;
    }
    if(message == null || message.length() == 0) {
      return -1;
    }
    
    /** 
     * @TODO To implement.
     */
    System.out.println(number + ": " + message);
    
    return 0;
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
    
    boolean sent = false;
    String  resp = "";
    
    /** 
     * @TODO To implement.
     */
    System.out.println(number + ": " + message);
    
    DAOLog.insertLogSms(conn, iIdUtente, iIdGru, iIdAzi, iIdFar, iIdCliente, number, message, sent, resp);
    
    return 0;
  }
  
}
