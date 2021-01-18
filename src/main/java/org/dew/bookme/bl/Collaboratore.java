package org.dew.bookme.bl;

import java.io.Serializable;

import java.util.List;

public 
class Collaboratore implements Serializable
{
  private static final long serialVersionUID = 2093287845927271199L;
  
  private int id;
  private int idFar;
  private String nome;
  private String colore;
  private boolean prenOnLine;
  private int idUtente;
  private int ordine;
  private boolean visibile;
  private List<Prestazione> prestazioni;
  private Agenda agenda;
  private List<Agenda> variazioni;
  private String ckUserDesk;
  
  public Collaboratore()
  {
  }
  
  public Collaboratore(int id, String nome)
  {
    this.id = id;
    this.nome = nome;
  }
  
  public int getId() {
    return id;
  }
  
  public int getIdFar() {
    return idFar;
  }
  
  public String getNome() {
    return nome;
  }
  
  public String getColore() {
    return colore;
  }
  
  public boolean isPrenOnLine() {
    return prenOnLine;
  }
  
  public int getIdUtente() {
    return idUtente;
  }
  
  public int getOrdine() {
    return ordine;
  }
  
  public boolean isVisibile() {
    return visibile;
  }
  
  public List<Prestazione> getPrestazioni() {
    return prestazioni;
  }
  
  public Agenda getAgenda() {
    return agenda;
  }
  
  public List<Agenda> getVariazioni() {
    return variazioni;
  }
  
  public void setId(int id) {
    this.id = id;
  }
  
  public void setIdFar(int idFar) {
    this.idFar = idFar;
  }
  
  public void setNome(String nome) {
    this.nome = nome;
  }
  
  public void setColore(String colore) {
    this.colore = colore;
  }
  
  public void setPrenOnLine(boolean prenOnLine) {
    this.prenOnLine = prenOnLine;
  }
  
  public void setIdUtente(int idUtente) {
    this.idUtente = idUtente;
  }
  
  public void setOrdine(int ordine) {
    this.ordine = ordine;
  }
  
  public void setVisibile(boolean visibile) {
    this.visibile = visibile;
  }
  
  public void setPrestazioni(List<Prestazione> prestazioni) {
    this.prestazioni = prestazioni;
  }
  
  public void setAgenda(Agenda agenda) {
    this.agenda = agenda;
  }
  
  public void setVariazioni(List<Agenda> variazioni) {
    this.variazioni = variazioni;
  }
  
  public String getCkUserDesk() {
    return ckUserDesk;
  }
  
  public void setCkUserDesk(String ckUserDesk) {
    this.ckUserDesk = ckUserDesk;
  }
  
  @Override
  public boolean equals(Object object) {
    if (object instanceof Collaboratore) {
      int iId = ((Collaboratore) object).getId();
      return iId == id;
    }
    return false;
  }
  
  @Override
  public int hashCode() {
    if (id == 0) {
      if (nome != null) return nome.hashCode();
    }
    return id;
  }
  
  @Override
  public String toString() {
    return "Collaboratore(" + id + "," + nome + ")";
  }
}
