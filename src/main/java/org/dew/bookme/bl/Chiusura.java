package org.dew.bookme.bl;

import java.io.Serializable;
import java.util.Date;

public 
class Chiusura implements Serializable
{
  private static final long serialVersionUID = -9153773691105068192L;
  
  private int     id;
  private int     idFar;
  private Date    data;
  private int     meseGiorno;
  private String  descrizione;
  private boolean annuale;
  
  public Chiusura()
  {
  }
  
  public Chiusura(int id, int idFar, Date data, int meseGiorno, String descrizione, boolean annuale)
  {
    this.id = id;
    this.idFar = idFar;
    this.data = data;
    this.meseGiorno = meseGiorno;
    this.descrizione = descrizione;
    this.annuale = annuale;
  }
  
  public int getId() {
    return id;
  }
  
  public int getIdFar() {
    return idFar;
  }
  
  public Date getData() {
    return data;
  }
  
  public int getMeseGiorno() {
    return meseGiorno;
  }
  
  public String getDescrizione() {
    return descrizione;
  }
  
  public boolean isAnnuale() {
    return annuale;
  }
  
  public void setId(int id) {
    this.id = id;
  }
  
  public void setIdFar(int idFar) {
    this.idFar = idFar;
  }
  
  public void setData(Date data) {
    this.data = data;
  }
  
  public void setMeseGiorno(int meseGiorno) {
    this.meseGiorno = meseGiorno;
  }
  
  public void setDescrizione(String descrizione) {
    this.descrizione = descrizione;
  }
  
  public void setAnnuale(boolean annuale) {
    this.annuale = annuale;
  }
  
  @Override
  public boolean equals(Object object) {
    if (object instanceof Chiusura) {
      int iId = ((Chiusura) object).getId();
      return iId == id;
    }
    return false;
  }
  
  @Override
  public int hashCode() {
    if (id == 0) {
      if (data != null) return data.hashCode();
      if (meseGiorno != 0) return meseGiorno;
    }
    return id;
  }
  
  @Override
  public String toString() {
    return "Chiusura(" + id + "," + data + "," + meseGiorno + "," + descrizione + ")";
  }
}
