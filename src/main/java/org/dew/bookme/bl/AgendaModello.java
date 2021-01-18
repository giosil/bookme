package org.dew.bookme.bl;

import java.io.Serializable;

public
class AgendaModello implements Serializable
{
  private static final long serialVersionUID = 6287275481560362627L;
  
  private int id;
  private int idFar;
  private int idAgenda;
  private boolean settDispari;
  private boolean settPari;
  private int giorno;
  private int progressivo;
  private int oraInizio;
  private int oraFine;
  private String tipologia;
  private int valore;
  private boolean prenOnLine;
  private boolean attivo;
  private String stato;
  
  public AgendaModello()
  {
  }
  
  public AgendaModello(int id)
  {
    this.id = id;
    this.attivo = true;
  }
  
  public AgendaModello(int id, int giorno, int progressivo, int oraInizio, int oraFine, String tipologia, int valore)
  {
    this.id = id;
    this.giorno = giorno;
    this.progressivo = progressivo;
    this.oraInizio = oraInizio;
    this.oraFine = oraFine;
    this.tipologia = tipologia;
    this.valore = valore;
    this.attivo = true;
  }
  
  public int getId() {
    return id;
  }
  
  public int getIdFar() {
    return idFar;
  }
  
  public int getIdAgenda() {
    return idAgenda;
  }
  
  public boolean isSettDispari() {
    return settDispari;
  }
  
  public boolean isSettPari() {
    return settPari;
  }
  
  public int getGiorno() {
    return giorno;
  }
  
  public int getProgressivo() {
    return progressivo;
  }
  
  public int getOraInizio() {
    return oraInizio;
  }
  
  public int getOraFine() {
    return oraFine;
  }
  
  public String getTipologia() {
    return tipologia;
  }
  
  public int getValore() {
    return valore;
  }
  
  public boolean isPrenOnLine() {
    return prenOnLine;
  }
  
  public boolean isAttivo() {
    return attivo;
  }
  
  public String getStato() {
    return stato;
  }
  
  public void setId(int id) {
    this.id = id;
  }
  
  public void setIdFar(int idFar) {
    this.idFar = idFar;
  }
  
  public void setIdAgenda(int idAgenda) {
    this.idAgenda = idAgenda;
  }
  
  public void setSettDispari(boolean settDispari) {
    this.settDispari = settDispari;
  }
  
  public void setSettPari(boolean settPari) {
    this.settPari = settPari;
  }
  
  public void setGiorno(int giorno) {
    this.giorno = giorno;
  }
  
  public void setProgressivo(int progressivo) {
    this.progressivo = progressivo;
  }
  
  public void setOraInizio(int oraInizio) {
    this.oraInizio = oraInizio;
  }
  
  public void setOraFine(int oraFine) {
    this.oraFine = oraFine;
  }
  
  public void setTipologia(String tipologia) {
    this.tipologia = tipologia;
  }
  
  public void setValore(int valore) {
    this.valore = valore;
  }
  
  public void setPrenOnLine(boolean prenOnLine) {
    this.prenOnLine = prenOnLine;
  }
  
  public void setAttivo(boolean attivo) {
    this.attivo = attivo;
  }
  
  public void setStato(String stato) {
    this.stato = stato;
  }
  
  @Override
  public boolean equals(Object object) {
    if (object instanceof AgendaModello) {
      int iId = ((AgendaModello) object).getId();
      return iId == id;
    }
    return false;
  }
  
  @Override
  public int hashCode() {
    return id;
  }
  
  @Override
  public String toString() {
    return "AgendaModello(" + id + "," + idAgenda + "," + progressivo + "," + oraInizio + "," + oraFine + ")";
  }
}
