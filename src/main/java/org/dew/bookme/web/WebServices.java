package org.dew.bookme.web;

import java.security.Principal;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;

import org.dew.bookme.bl.User;

import org.dew.bookme.ws.*;

/**
 * Entry point per il servizio RPC.
 */
@WebServlet(name = "WebServices", loadOnStartup = 2, urlPatterns = { "/rpc/*" })
public 
class WebServices extends org.rpc.server.RpcServlet 
{
  private static final long serialVersionUID = 628211903812731650L;
  
  public 
  void init() 
      throws ServletException 
  {
    System.out.println("org.dew.bookme.web.WebServices.init()...");
    
    rpcExecutor = new org.rpc.server.MultiRpcExecutor();
    
    restAudit  = null;
    restTracer = null;
    
    legacy           = false;
    createRpcContex  = true;
    checkSession     = false;
    checkSessionREST = false;
    restful          = true;
    about            = true;
    
    basicAuth        = true;
    
    addWebService(new WSStrutture(),         "STRUTTURE",      "Gestione strutture");
    addWebService(new WSAttrezzature(),      "ATTREZZATURE",   "Gestione attrezzature");
    addWebService(new WSCollaboratori(),     "COLLABORATORI",  "Gestione collaboratori");
    addWebService(new WSClienti(),           "CLIENTI",        "Gestione clienti");
    addWebService(new WSComunicazioni(),     "COMUNICAZIONI",  "Gestione comunicazioni");
    addWebService(new WSPrestazioni(),       "PRESTAZIONI",    "Gestione prestazioni");
    addWebService(new WSGruppiPrestazioni(), "GRUPPI_PREST",   "Gestione gruppi prestazioni");
    addWebService(new WSCalendario(),        "CALENDARIO",     "Gestione calendario");
    addWebService(new WSChiusure(),          "CHIUSURE",       "Gestione chiusure");
    addWebService(new WSPrenotazioni(),      "PRENOTAZIONI",   "Gestione prenotazioni");
    addWebService(new WSReport(),            "REPORT",         "Gestione report");
    addWebService(new WSUtentiDesk(),        "UTENTI_DESK",    "Gestione utenti desk");
    
    // App Mobile
    addWebService(new WSOnLine(),            "ONLINE",         "Servizi online");
  }
  
  protected
  Principal authenticate(String username, String password)
  {
    User user = new User(username);
    user.setGroup(3);
    return user;
  }
}