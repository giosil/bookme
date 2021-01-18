package org.dew.bookme.bl;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public 
class Cliente implements Serializable
{
  private static final long serialVersionUID = 5983002774258868765L;
  
  private int id;
  private int idFar;
  private String cognome;
  private String nome;
  private String sesso;
  private Date dataNascita;
  private String codiceFiscale;
  private String telefono1;
  private String telefono2;
  private String email;
  private String note;
  private int reputazione;
  private boolean disPrenOnLine;
  private List<Prenotazione> prenotazioni;
  // Campi ausiliari
  private String nominativo;
  private int etaDa;
  private int etaA;
  private String opzioni;
  
  public Cliente()
  {
  }
  
  public Cliente(int id, String cognome, String nome, String telefono1)
  {
    this.id = id;
    this.cognome = cognome;
    this.nome = nome;
    this.telefono1 = telefono1;
  }
  
  public int getId() {
    return id;
  }
  
  public int getIdFar() {
    return idFar;
  }
  
  public String getCognome() {
    return cognome;
  }
  
  public String getNome() {
    return nome;
  }
  
  public String getSesso() {
    return sesso;
  }
  
  public Date getDataNascita() {
    return dataNascita;
  }
  
  public String getCodiceFiscale() {
    return codiceFiscale;
  }
  
  public String getTelefono1() {
    return telefono1;
  }
  
  public String getTelefono2() {
    return telefono2;
  }
  
  public String getEmail() {
    return email;
  }
  
  public String getNote() {
    return note;
  }
  
  public int getReputazione() {
    return reputazione;
  }
  
  public List<Prenotazione> getPrenotazioni() {
    return prenotazioni;
  }
  
  public String getNominativo() {
    return nominativo;
  }
  
  public void setId(int id) {
    this.id = id;
  }
  
  public void setIdFar(int idFar) {
    this.idFar = idFar;
  }
  
  public void setCognome(String cognome) {
    this.cognome = cognome;
  }
  
  public void setNome(String nome) {
    this.nome = nome;
  }
  
  public void setSesso(String sesso) {
    this.sesso = sesso;
  }
  
  public void setDataNascita(Date dataNascita) {
    this.dataNascita = dataNascita;
  }
  
  public void setCodiceFiscale(String codiceFiscale) {
    this.codiceFiscale = codiceFiscale;
  }
  
  public void setTelefono1(String telefono1) {
    this.telefono1 = telefono1;
  }
  
  public void setTelefono2(String telefono2) {
    this.telefono2 = telefono2;
  }
  
  public void setEmail(String email) {
    this.email = email;
  }
  
  public void setNote(String note) {
    this.note = note;
  }
  
  public void setReputazione(int reputazione) {
    this.reputazione = reputazione;
  }
  
  public void setPrenotazioni(List<Prenotazione> prenotazioni) {
    this.prenotazioni = prenotazioni;
  }
  
  public void setNominativo(String nominativo) {
    this.nominativo = nominativo;
  }
  
  public int getEtaDa() {
    return etaDa;
  }
  
  public int getEtaA() {
    return etaA;
  }
  
  public void setEtaDa(int etaDa) {
    this.etaDa = etaDa;
  }
  
  public void setEtaA(int etaA) {
    this.etaA = etaA;
  }
  
  public String getOpzioni() {
    return opzioni;
  }
  
  public void setOpzioni(String opzioni) {
    this.opzioni = opzioni;
  }
  
  public boolean isDisPrenOnLine() {
    return disPrenOnLine;
  }
  
  public void setDisPrenOnLine(boolean disPrenOnLine) {
    this.disPrenOnLine = disPrenOnLine;
  }
  
  @Override
  public boolean equals(Object object) {
    if (object instanceof Cliente) {
      int iId = ((Cliente) object).getId();
      return iId == id;
    }
    return false;
  }
  
  @Override
  public int hashCode() {
    if (id == 0) {
      if (codiceFiscale != null) return codiceFiscale.hashCode();
    }
    return id;
  }
  
  @Override
  public String toString() {
    return "Cliente(" + id + "," + cognome + "," + nome + "," + email + ")";
  }
}