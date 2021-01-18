package org.dew.bookme.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import org.util.WUtil;

@SuppressWarnings({"rawtypes"})
public
class BEConfig
{
  public static String PROD_HOST = "bookme.dew.org";
  
  public static Properties config = new Properties();
  
  private static boolean boConfigFileLoaded = false;
  private static String sResultLoading = "OK";
  
  static {
    String sUserHome = System.getProperty("user.home");
    String sPathFile = sUserHome + File.separator + "cfg" + File.separator + "bookme.cfg";
    try {
      InputStream in = (InputStream)new FileInputStream(sPathFile);
      config = new Properties();
      config.load(in);
      in.close();
      boConfigFileLoaded = true;
      sResultLoading = "File " + sPathFile + " loaded.";
      
      String sProdHost = config.getProperty("prod.host");
      if(sProdHost != null && sProdHost.length() > 0) {
        PROD_HOST = sProdHost;
      }
    }
    catch(FileNotFoundException ex) {
      sResultLoading = "File " + sPathFile + " not found.";
    }
    catch(IOException ioex) {
      sResultLoading = "IOException during load " + sPathFile + ": " + ioex;
    }
  }
  
  public static
  boolean isConfigFileLoaded()
  {
    return boConfigFileLoaded;
  }
  
  public static
  String getResultLoading()
  {
    return sResultLoading;
  }
  
  public static
  String getProperty(String sKey)
  {
    return config.getProperty(sKey);
  }
  
  public static
  String getProperty(String sKey, String sDefault)
  {
    return config.getProperty(sKey, sDefault);
  }
  
  public static
  String getProperty(String sKey, boolean boMandatory)
      throws Exception
  {
    String sResult = config.getProperty(sKey);
    if(boMandatory) {
      if(sResult == null || sResult.length() == 0) {
        throw new Exception("Entry \"" + sKey + "\" of configuration is blank.");
      }
    }
    return sResult;
  }
  
  public static
  Calendar getCalendarProperty(String sKey, Calendar oDefault)
  {
    String sValue = config.getProperty(sKey);
    return WUtil.toCalendar(sValue, oDefault);
  }
  
  public static
  Date getDateProperty(String sKey, Date oDefault)
  {
    String sValue = config.getProperty(sKey);
    return WUtil.toDate(sValue, oDefault);
  }
  
  public static
  List getListProperty(String sKey)
  {
    String sValue = config.getProperty(sKey);
    return WUtil.toList(sValue, true);
  }
  
  public static
  boolean getBooleanProperty(String sKey, boolean bDefault)
  {
    String sValue = config.getProperty(sKey);
    return WUtil.toBoolean(sValue, bDefault);
  }
  
  public static
  String getStrProperty(String sKey, String sDefault)
  {
    return config.getProperty(sKey, sDefault);
  }
  
  public static
  int getIntProperty(String sKey, int iDefault)
  {
    String sValue = config.getProperty(sKey);
    return WUtil.toInt(sValue, iDefault);
  }
  
  public static
  double getDoubleProperty(String sKey, double dDefault)
  {
    String sValue = config.getProperty(sKey);
    return WUtil.toDouble(sValue, dDefault);
  }
}
