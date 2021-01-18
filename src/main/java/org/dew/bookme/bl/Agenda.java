package org.dew.bookme.bl;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.util.WUtil;

import org.dew.bookme.util.DataUtil;

public 
class Agenda implements Serializable
{
  private static final long serialVersionUID = -5571320919403089640L;
  
  private int id;
  private int idFar;
  private int idCollaboratore;
  private String descrizione;
  private String giorni;
  private boolean settimaneAlt;
  private Date inizioValidita;
  private Date fineValidita;
  private List<AgendaModello> fasceOrarie;
  private boolean attivo;
  
  public Agenda()
  {
  }
  
  public Agenda(int id)
  {
    this.id = id;
    this.attivo = true;
  }
  
  public Agenda(int id, String descrizione)
  {
    this.id = id;
    this.descrizione = descrizione;
    this.attivo = true;
  }
  
  public Agenda(int id, String descrizione, String giorni, boolean settimaneAlt)
  {
    this.id = id;
    this.descrizione = descrizione;
    this.giorni = giorni;
    this.settimaneAlt = settimaneAlt;
    this.attivo = true;
  }
  
  public int getId() {
    return id;
  }
  
  public int getIdFar() {
    return idFar;
  }
  
  public int getIdCollaboratore() {
    return idCollaboratore;
  }
  
  public String getDescrizione() {
    return descrizione;
  }
  
  public String getGiorni() {
    return giorni;
  }
  
  public boolean isSettimaneAlt() {
    return settimaneAlt;
  }
  
  public Date getInizioValidita() {
    return inizioValidita;
  }
  
  public Date getFineValidita() {
    return fineValidita;
  }
  
  public List<AgendaModello> getFasceOrarie() {
    return fasceOrarie;
  }
  
  public boolean isAttivo() {
    return attivo;
  }
  
  public void setId(int id) {
    this.id = id;
  }
  
  public void setIdFar(int idFar) {
    this.idFar = idFar;
  }
  
  public void setIdCollaboratore(int idCollaboratore) {
    this.idCollaboratore = idCollaboratore;
  }
  
  public void setDescrizione(String descrizione) {
    this.descrizione = descrizione;
  }
  
  public void setGiorni(String giorni) {
    this.giorni = giorni;
  }
  
  public void setSettimaneAlt(boolean settimaneAlt) {
    this.settimaneAlt = settimaneAlt;
  }
  
  public void setInizioValidita(Date inizioValidita) {
    this.inizioValidita = inizioValidita;
  }
  
  public void setFineValidita(Date fineValidita) {
    this.fineValidita = fineValidita;
  }
  
  public void setFasceOrarie(List<AgendaModello> fasceOrarie) {
    this.fasceOrarie = fasceOrarie;
  }
  
  public void setAttivo(boolean attivo) {
    this.attivo = attivo;
  }
  
  public List<AgendaModello> filterFasceOrarie(int iGiorno) {
    if(fasceOrarie == null || fasceOrarie.size() == 0) {
      return new ArrayList<AgendaModello>();
    }
    List<AgendaModello> listResult = new ArrayList<AgendaModello>();
    for(int i = 0; i < fasceOrarie.size(); i++) {
      AgendaModello am = fasceOrarie.get(i);
      if(am == null) continue;
      
      am.setIdAgenda(this.id);
      
      if(!am.isAttivo()) continue;
      
      int iOraInizio = am.getOraInizio();
      if(iOraInizio < 0 || iOraInizio > 2359) continue;
      int iOraFine = am.getOraFine();
      if(iOraFine < 0 || iOraFine > 2359) continue;
      if(iOraFine <= iOraInizio) continue;
      
      String sTipologia = am.getTipologia();
      if(sTipologia == null || sTipologia.length() == 0) {
        am.setTipologia("O");
      }
      int iValore = am.getValore();
      if(iValore < 1) {
        iValore = DataUtil.diffMinutes(iOraFine, iOraInizio);
        am.setValore(iValore);
      }
      
      if(am.getGiorno() == iGiorno) {
        listResult.add(am);
      }
    }
    return listResult;
  }
  
  @Override
  public boolean equals(Object object) {
    if (object instanceof Agenda) {
      int iId = ((Agenda) object).getId();
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
    return "Agenda(" + id + "," + descrizione + "," + WUtil.formatDate(inizioValidita, "IT") + "," + WUtil.formatDate(fineValidita, "IT") + ")";
  }
}
