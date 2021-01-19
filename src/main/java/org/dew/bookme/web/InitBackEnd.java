package org.dew.bookme.web;

import java.util.*;
import java.util.Date;
import java.sql.*;
import java.io.*;

import javax.servlet.http.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;

import org.apache.log4j.PropertyConfigurator;

import org.util.WUtil;

import org.dew.bookme.util.*;

@WebServlet(name = "InitBackEnd", loadOnStartup = 0, urlPatterns = { "/init" })
public
class InitBackEnd extends HttpServlet
{
  private static final long serialVersionUID = 2827831039975773755L;
  
  public static String sSTARTUP_TIME = WUtil.formatDateTime(new Date(), "#", true);
  
  private final static String sLOGGER_CFG = "logger.cfg";
  
  private Properties oLoggerCfg;
  private String sCheckInit;
  private String sCheckConfig;
  private Timer timer;
  
  public
  void init()
      throws ServletException
  {
    System.out.println("org.dew.bookme.web.InitBackEnd.init()...");
    
    try {
      InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream(sLOGGER_CFG);
      if(is != null) {
        oLoggerCfg = new Properties();
        oLoggerCfg.load(is);
        changeLogFilePath(oLoggerCfg);
        PropertyConfigurator.configure(oLoggerCfg);
      }
    }
    catch (IOException ex) {
      sCheckInit = ex.toString();
      return;
    }
    
    sCheckInit = "OK";
    if(BEConfig.isConfigFileLoaded()) {
      sCheckConfig = "OK (" + BEConfig.getResultLoading() + ")";
    }
    else {
      sCheckConfig = BEConfig.getResultLoading();
    }
    
    timer = new Timer();
    
    timer.schedule(new TimerTaskSendComm(),  1000,  60 * 60 * 1000);
    timer.schedule(new TimerTaskReminder(),  3000,  15 * 60 * 1000);
  }
  
  @SuppressWarnings("rawtypes")
  protected
  void changeLogFilePath(Properties oProps)
  {
    if(oProps == null) return;
    
    String sUserHome = System.getProperty("user.home");
    String sLogFilePath = sUserHome + File.separator + "log" + File.separator;
    
    Iterator oItKeys = oProps.keySet().iterator();
    while(oItKeys.hasNext()){
      String sKey = oItKeys.next().toString();
      String sValue = oProps.getProperty(sKey);
      if(sKey.endsWith(".File") && sValue != null) {
        if(!sValue.startsWith(".") && !sValue.startsWith("/")) {
          oProps.put(sKey, sLogFilePath + sValue);
        }
      }
    }
  }
  
  public
  void doGet(HttpServletRequest oReq, HttpServletResponse oRes)
      throws ServletException, IOException
  {
    String sCheckConn = "OK";
    try {
      checkConnection();
    }
    catch(Exception ex) {
      sCheckConn = ex.toString();
      sCheckConn += "<br>";
      sCheckConn += "if server run on a developer environment set VM parameter: <i>-Dondebug=1</i>";
    }
    
    oRes.setContentType("text/html");
    PrintWriter out = oRes.getWriter();
    out.println("<html>");
    out.println("<body>");
    out.println("<b>Logger initialization: " + sCheckInit + "</b>");
    out.println("<br><br>");
    out.println("<b>BackEnd configuration: " + sCheckConfig + "</b>");
    out.println("<br><br>");
    out.println("<b>Check DBMS Connection: " + sCheckConn + "<b>");
    out.println("</body>");
    out.println("</html>");
  }
  
  public
  void destroy()
  {
    if(timer != null) timer.cancel();
  }
  
  public
  void checkConnection()
      throws Exception
  {
    Connection conn = ConnectionManager.getDefaultConnection();
    
    conn.close();
  }
}
