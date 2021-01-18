package org.dew.bookme.bl;

import java.io.Serializable;

import java.util.List;

public 
class Attrezzatura implements Serializable
{
  private static final long serialVersionUID = -4325561217938355105L;
  
  private int id;
  private int idFar;
  private String codice;
  private String descrizione;
  private String ubicazione;
  private List<Prestazione> prestazioni;
  
  public Attrezzatura()
  {
  }
  
  public Attrezzatura(int id)
  {
    this.id = id;
  }
  
  public Attrezzatura(int id, String codice, String descrizione)
  {
    this.id = id;
    this.codice = codice;
    this.descrizione = descrizione;
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
  
  public String getUbicazione() {
    return ubicazione;
  }
  
  public List<Prestazione> getPrestazioni() {
    return prestazioni;
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
  
  public void setUbicazione(String ubicazione) {
    this.ubicazione = ubicazione;
  }
  
  public void setPrestazioni(List<Prestazione> prestazioni) {
    this.prestazioni = prestazioni;
  }
  
  @Override
  public boolean equals(Object object) {
    if (object instanceof Attrezzatura) {
      int iId = ((Attrezzatura) object).getId();
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
    return "Attrezzatura(" + id + "," + codice + "," + descrizione + ")";
  }
}
