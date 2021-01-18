package org.dew.bookme.util;

import java.security.Principal;

import org.rpc.util.RPCContext;

import org.dew.bookme.bl.User;

public 
class WSContext 
{
  public static
  User getUser()
  {
    Principal principal = RPCContext.getUserPrincipal();
    if(principal instanceof User) {
      return (User) principal;
    }
    Object user = RPCContext.getSessionAttribute("user");
    if(user instanceof User) {
      return (User) user;
    }
    User defUser = new User(0, "default");
    return defUser;
  }
  
  public static
  String getUserName()
  {
    User user = getUser();
    if(user == null) {
      return "anonymous";
    }
    return user.getUserName();
  }
}
