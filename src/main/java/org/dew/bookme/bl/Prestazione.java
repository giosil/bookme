package org.dew.bookme.bl;

import java.io.Serializable;
import java.util.List;

public 
class Prestazione implements Serializable
{
  private static final long serialVersionUID = 4896129740505926724L;
  
  private int id;
  private int idFar;
  private int codCsf;
  private String codice;
  private String descrizione;
  private int durata;
  private String tipoPrezzo;
  private boolean prenOnLine;
  private boolean flagPosa;
  private double prezzoListino;
  private double scontoAss;
  private double scontoPerc;
  private double prezzoFinale;
  private String avvertenze;
  private String indicazioni;
  private int puntiColl;
  private List<Attrezzatura> attrezzature;
  private List<Collaboratore> collaboratori;
  
  private int gruppo;
  private String descGruppo;
  private int tipo;
  private String descTipo;
  
  public Prestazione()
  {
  }
  
  public Prestazione(int id)
  {
    this.id = id;
  }
  
  public Prestazione(int id, String descrizione)
  {
    this.id = id;
    this.descrizione = descrizione;
  }
  
  public Prestazione(int id, String descrizione, int gruppo, String descGruppo)
  {
    this.id = id;
    this.descrizione = descrizione;
    this.gruppo = gruppo;
    this.descGruppo = descGruppo;
  }
  
  public int getId() {
    return id;
  }
  
  public int getIdFar() {
    return idFar;
  }
  
  public int getCodCsf() {
    return codCsf;
  }
  
  public String getCodice() {
    return codice;
  }
  
  public String getDescrizione() {
    return descrizione;
  }
  
  public int getDurata() {
    return durata;
  }
  
  public String getTipoPrezzo() {
    return tipoPrezzo;
  }
  
  public boolean isPrenOnLine() {
    return prenOnLine;
  }
  
  public boolean isFlagPosa() {
    return flagPosa;
  }
  
  public double getPrezzoListino() {
    return prezzoListino;
  }
  
  public double getScontoAss() {
    return scontoAss;
  }
  
  public double getScontoPerc() {
    return scontoPerc;
  }
  
  public double getPrezzoFinale() {
    return prezzoFinale;
  }
  
  public String getAvvertenze() {
    return avvertenze;
  }
  
  public String getIndicazioni() {
    return indicazioni;
  }
  
  public int getPuntiColl() {
    return puntiColl;
  }
  
  public List<Attrezzatura> getAttrezzature() {
    return attrezzature;
  }
  
  public List<Collaboratore> getCollaboratori() {
    return collaboratori;
  }
  
  public int getGruppo() {
    return gruppo;
  }
  
  public String getDescGruppo() {
    return descGruppo;
  }
  
  public int getTipo() {
    return tipo;
  }
  
  public String getDescTipo() {
    return descTipo;
  }
  
  public void setId(int id) {
    this.id = id;
  }
  
  public void setIdFar(int idFar) {
    this.idFar = idFar;
  }
  
  public void setCodCsf(int codCsf) {
    this.codCsf = codCsf;
  }
  
  public void setCodice(String codice) {
    this.codice = codice;
  }
  
  public void setDescrizione(String descrizione) {
    this.descrizione = descrizione;
  }
  
  public void setDurata(int durata) {
    this.durata = durata;
  }
  
  public void setTipoPrezzo(String tipoPrezzo) {
    this.tipoPrezzo = tipoPrezzo;
  }
  
  public void setPrenOnLine(boolean prenOnLine) {
    this.prenOnLine = prenOnLine;
  }
  
  public void setFlagPosa(boolean flagPosa) {
    this.flagPosa = flagPosa;
  }
  
  public void setPrezzoListino(double prezzoListino) {
    this.prezzoListino = prezzoListino;
  }
  
  public void setScontoAss(double scontoAss) {
    this.scontoAss = scontoAss;
  }
  
  public void setScontoPerc(double scontoPerc) {
    this.scontoPerc = scontoPerc;
  }
  
  public void setPrezzoFinale(double prezzoFinale) {
    this.prezzoFinale = prezzoFinale;
  }
  
  public void setAvvertenze(String avvertenze) {
    this.avvertenze = avvertenze;
  }
  
  public void setIndicazioni(String indicazioni) {
    this.indicazioni = indicazioni;
  }
  
  public void setPuntiColl(int puntiColl) {
    this.puntiColl = puntiColl;
  }
  
  public void setAttrezzature(List<Attrezzatura> attrezzature) {
    this.attrezzature = attrezzature;
  }
  
  public void setCollaboratori(List<Collaboratore> collaboratori) {
    this.collaboratori = collaboratori;
  }
  
  public void setGruppo(int gruppo) {
    this.gruppo = gruppo;
  }
  
  public void setDescGruppo(String descGruppo) {
    this.descGruppo = descGruppo;
  }
  
  public void setTipo(int tipo) {
    this.tipo = tipo;
  }
  
  public void setDescTipo(String descTipo) {
    this.descTipo = descTipo;
  }
  
  @Override
  public boolean equals(Object object) {
    if (object instanceof Prestazione) {
      int iId = ((Prestazione) object).getId();
      return iId == id;
    }
    return false;
  }
  
  @Override
  public int hashCode() {
    if (id == 0) {
      if (codice != null) return codice.hashCode();
      if (descrizione != null) return descrizione.hashCode();
    }
    return id;
  }
  
  @Override
  public String toString() {
    return "Prestazione(" + id + "," + codice + "," + descrizione + ")";
  }
}
