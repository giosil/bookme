package org.dew.bookme.bl;

import java.io.Serializable;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

public 
class User implements Principal, Serializable 
{
  private static final long serialVersionUID = -7421291620439014969L;
  
  // User attributes
  private int id;
  private String userName;
  private String lastName;
  private String firstName;
  private String email;
  private String mobile;
  private String taxCode;
  
  // Profile
  private String role;
  private List<String> groups;
  private List<String> grants;
  private List<String> structures;
  private Map<String, Object> resources;
  
  // Configuration
  private String locale;
  private String home;
  private String menu;
  private String menuManager;
  
  // Access attributes
  private Date   currLogin;
  private String tokenId;
  private Date   dateLastAccess;
  private String message;
  
  public User() {
  }

  public User(String userName) {
    this.userName = userName;
  }

  public User(int id, String userName) {
    this.id = id;
    this.userName = userName;
  }
  
  public User(int id, int group) {
    this.id = id;
    setGroup(group);
  }
  
  // java.security.Principal
  @Override
  public String getName() {
    return userName;
  }

  public int getId() {
    return id;
  }

  public String getUserName() {
    return userName;
  }

  public String getLastName() {
    return lastName;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getEmail() {
    return email;
  }

  public String getMobile() {
    return mobile;
  }

  public String getTaxCode() {
    return taxCode;
  }

  public String getRole() {
    return role;
  }

  public List<String> getGroups() {
    return groups;
  }

  public List<String> getGrants() {
    return grants;
  }

  public List<String> getStructures() {
    return structures;
  }

  public Map<String, Object> getResources() {
    return resources;
  }

  public String getLocale() {
    return locale;
  }

  public String getHome() {
    return home;
  }

  public String getMenu() {
    return menu;
  }

  public String getMenuManager() {
    return menuManager;
  }

  public Date getCurrLogin() {
    return currLogin;
  }

  public String getTokenId() {
    return tokenId;
  }

  public Date getDateLastAccess() {
    return dateLastAccess;
  }

  public String getMessage() {
    return message;
  }

  public void setId(int id) {
    this.id = id;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setMobile(String mobile) {
    this.mobile = mobile;
  }

  public void setTaxCode(String taxCode) {
    this.taxCode = taxCode;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public void setGroups(List<String> groups) {
    this.groups = groups;
  }

  public void setGrants(List<String> grants) {
    this.grants = grants;
  }

  public void setStructures(List<String> structures) {
    this.structures = structures;
  }

  public void setResources(Map<String, Object> resources) {
    this.resources = resources;
  }

  public void setLocale(String locale) {
    this.locale = locale;
  }

  public void setHome(String home) {
    this.home = home;
  }

  public void setMenu(String menu) {
    this.menu = menu;
  }

  public void setMenuManager(String menuManager) {
    this.menuManager = menuManager;
  }

  public void setCurrLogin(Date currLogin) {
    this.currLogin = currLogin;
  }

  public void setTokenId(String tokenId) {
    this.tokenId = tokenId;
  }

  public void setDateLastAccess(Date dateLastAccess) {
    this.dateLastAccess = dateLastAccess;
  }

  public void setMessage(String message) {
    this.message = message;
  }
  
  // Helpers
  
  public int getGroup() {
    if(groups == null || groups.size() == 0) {
      return 0;
    }
    String item0 = groups.get(0);
    if(item0 == null || item0.length() == 0) {
      return 0;
    }
    try {
      return Integer.parseInt(item0.trim());
    }
    catch(Exception ex) {
      ex.printStackTrace();
    }
    return 0;
  }

  public void setGroup(int group) {
    groups = new ArrayList<String>();
    groups.add(String.valueOf(group));
  }

  @Override
  public boolean equals(Object object) {
    if (object instanceof User) {
      int iId = ((User) object).getId();
      return iId == id;
    }
    return false;
  }
  
  @Override
  public int hashCode() {
    if (id == 0) {
      if (userName != null) {
        return userName.hashCode();
      }
    }
    return id;
  }
  
  @Override
  public String toString() {
    return "User(" + id + "," + userName + ")";
  }
}
