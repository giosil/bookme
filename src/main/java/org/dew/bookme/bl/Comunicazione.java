package org.dew.bookme.bl;

import java.io.Serializable;
import java.util.List;

public 
class Comunicazione implements Serializable
{
  private static final long serialVersionUID = -5826309985368453805L;
  
  private int id;
  private int idFar;
  private String oggetto;
  private String messaggio;
  private String mezzo;
  private List<Cliente> coda;
  
  public Comunicazione()
  {
  }
  
  public Comunicazione(int id)
  {
    this.id = id;
  }
  
  public Comunicazione(int id, String oggetto, String messaggio)
  {
    this.id = id;
    this.oggetto = oggetto;
    this.messaggio = messaggio;
  }
  
  public Comunicazione(int id, String oggetto, String messaggio, String mezzo)
  {
    this.id = id;
    this.oggetto = oggetto;
    this.messaggio = messaggio;
    this.mezzo = mezzo;
  }
  
  public int getId() {
    return id;
  }
  
  public int getIdFar() {
    return idFar;
  }
  
  public String getOggetto() {
    return oggetto;
  }
  
  public String getMessaggio() {
    return messaggio;
  }
  
  public String getMezzo() {
    return mezzo;
  }
  
  public List<Cliente> getCoda() {
    return coda;
  }
  
  public void setId(int id) {
    this.id = id;
  }
  
  public void setIdFar(int idFar) {
    this.idFar = idFar;
  }
  
  public void setOggetto(String oggetto) {
    this.oggetto = oggetto;
  }
  
  public void setMessaggio(String messaggio) {
    this.messaggio = messaggio;
  }
  
  public void setMezzo(String mezzo) {
    this.mezzo = mezzo;
  }
  
  public void setCoda(List<Cliente> coda) {
    this.coda = coda;
  }
  
  @Override
  public boolean equals(Object object) {
    if (object instanceof Comunicazione) {
      int iId = ((Comunicazione) object).getId();
      return iId == id;
    }
    return false;
  }
  
  @Override
  public int hashCode() {
    if (id == 0) {
      if (oggetto != null) return oggetto.hashCode();
    }
    return id;
  }
  
  @Override
  public String toString() {
    return "Comunicazione(" + id + "," + oggetto + "," + mezzo + ")";
  }
}
