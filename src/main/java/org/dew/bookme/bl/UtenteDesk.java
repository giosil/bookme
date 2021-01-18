package org.dew.bookme.bl;

import java.io.Serializable;

public 
class UtenteDesk implements Serializable
{
  private static final long serialVersionUID = -4755230721536883984L;
  
  private int     id;
  private int     idFar;
  private String  username;
  private String  password;
  private String  note;
  private boolean abilitato;
  
  public UtenteDesk()
  {
  }
  
  public int getId() {
    return id;
  }
  
  public int getIdFar() {
    return idFar;
  }
  
  public String getUsername() {
    return username;
  }
  
  public String getPassword() {
    return password;
  }
  
  public String getNote() {
    return note;
  }
  
  public boolean isAbilitato() {
    return abilitato;
  }
  
  public void setId(int id) {
    this.id = id;
  }
  
  public void setIdFar(int idFar) {
    this.idFar = idFar;
  }
  
  public void setUsername(String username) {
    this.username = username;
  }
  
  public void setPassword(String password) {
    this.password = password;
  }
  
  public void setNote(String note) {
    this.note = note;
  }
  
  public void setAbilitato(boolean abilitato) {
    this.abilitato = abilitato;
  }
  
  @Override
  public boolean equals(Object object) {
    if (object instanceof UtenteDesk) {
      int iId = ((UtenteDesk) object).getId();
      return iId == id;
    }
    return false;
  }
  
  @Override
  public int hashCode() {
    if (id == 0) {
      if (username != null) return username.hashCode();
    }
    return id;
  }
  
  @Override
  public String toString() {
    return "UtenteDesk(" + id + "," + username + ")";
  }
}
