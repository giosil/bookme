package org.dew.bookme.bl;

import java.io.Serializable;

public 
class GruppoPrestazione implements Serializable
{
  private static final long serialVersionUID = -6964629648897937073L;
  
  private int id;
  private int idFar;
  private String codice;
  private String descrizione;
  
  public GruppoPrestazione()
  {
  }
  
  public int getId() {
    return id;
  }
  
  public int getIdFar() {
    return idFar;
  }
  
  public String getCodice() {
    return codice;
  }
  
  public String getDescrizione() {
    return descrizione;
  }
  
  public void setId(int id) {
    this.id = id;
  }
  
  public void setIdFar(int idFar) {
    this.idFar = idFar;
  }
  
  public void setCodice(String codice) {
    this.codice = codice;
  }
  
  public void setDescrizione(String descrizione) {
    this.descrizione = descrizione;
  }
  
  @Override
  public boolean equals(Object object) {
    if (object instanceof GruppoPrestazione) {
      int iId = ((GruppoPrestazione) object).getId();
      return iId == id;
    }
    return false;
  }
  
  @Override
  public int hashCode() {
    if (id == 0) {
      if (codice != null) return codice.hashCode();
    }
    return id;
  }
  
  @Override
  public String toString() {
    return "GruppoPrestazione(" + id + "," + codice + "," + descrizione + ")";
  }
}
