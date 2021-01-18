package org.dew.bookme.bl;

import java.io.Serializable;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.util.WUtil;

public 
class Calendario implements Serializable
{
  private static final long serialVersionUID = -5267407290333459576L;
  
  private int id;
  private int idAgenda;
  private int idAgendaMod;
  private int idCollaboratore;
  private String nomeCollab;
  private int progressivo;
  private Date data;
  private int giorno;
  private int oraInizio;
  private int oraFine;
  private String tipologia;
  private int minuti;
  private int posti;
  private int maxCons;
  private String stato;
  private String modello;
  private boolean prenOnLine;
  // Attributi ausiliari 
  private int idAttrez;
  private String nomeAttrez;
  private String altriCollab;
  private Map<String,String> prestCollab;
  
  public Calendario()
  {
  }
  
  public Calendario(int id, int idCollaboratore, int idAgenda, int idAgendaMod, Date data, int giorno, int progressivo, String tipologia)
  {
    this.id              = id;
    this.idCollaboratore = idCollaboratore;
    this.idAgenda        = idAgenda;
    this.idAgendaMod     = idAgendaMod;
    this.data            = data;
    this.giorno          = giorno;
    this.progressivo     = progressivo;
    this.tipologia       = tipologia;
  }
  
  public int getId() {
    return id;
  }
  
  public int getIdAgenda() {
    return idAgenda;
  }
  
  public int getIdAgendaMod() {
    return idAgendaMod;
  }
  
  public int getIdCollaboratore() {
    return idCollaboratore;
  }
  
  public String getNomeCollab() {
    return nomeCollab;
  }
  
  public int getProgressivo() {
    return progressivo;
  }
  
  public Date getData() {
    return data;
  }
  
  public int getGiorno() {
    return giorno;
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
  
  public int getMinuti() {
    return minuti;
  }
  
  public int getPosti() {
    return posti;
  }
  
  public int getMaxCons() {
    return maxCons;
  }
  
  public String getStato() {
    return stato;
  }
  
  public String getModello() {
    return modello;
  }
  
  public boolean isPrenOnLine() {
    return prenOnLine;
  }
  
  public int getIdAttrez() {
    return idAttrez;
  }
  
  public String getNomeAttrez() {
    return nomeAttrez;
  }
  
  public String getAltriCollab() {
    return altriCollab;
  }
  
  public Map<String, String> getPrestCollab() {
    return prestCollab;
  }
  
  public void setId(int id) {
    this.id = id;
  }
  
  public void setIdAgenda(int idAgenda) {
    this.idAgenda = idAgenda;
  }
  
  public void setIdAgendaMod(int idAgendaMod) {
    this.idAgendaMod = idAgendaMod;
  }
  
  public void setIdCollaboratore(int idCollaboratore) {
    this.idCollaboratore = idCollaboratore;
  }
  
  public void setNomeCollab(String nomeCollab) {
    this.nomeCollab = nomeCollab;
  }
  
  public void setProgressivo(int progressivo) {
    this.progressivo = progressivo;
  }
  
  public void setData(Date data) {
    this.data = data;
  }
  
  public void setGiorno(int giorno) {
    this.giorno = giorno;
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
  
  public void setMinuti(int minuti) {
    this.minuti = minuti;
  }
  
  public void setPosti(int posti) {
    this.posti = posti;
  }
  
  public void setMaxCons(int maxCons) {
    this.maxCons = maxCons;
  }
  
  public void setStato(String stato) {
    this.stato = stato;
  }
  
  public void setModello(String modello) {
    this.modello = modello;
  }
  
  public void setPrenOnLine(boolean prenOnLine) {
    this.prenOnLine = prenOnLine;
  }
  
  public void setIdAttrez(int idAttrez) {
    this.idAttrez = idAttrez;
  }
  
  public void setNomeAttrez(String nomeAttrez) {
    this.nomeAttrez = nomeAttrez;
  }
  
  public void setAltriCollab(String altriCollab) {
    this.altriCollab = altriCollab;
  }
  
  public void setPrestCollab(Map<String, String> prestCollab) {
    this.prestCollab = prestCollab;
  }
  
  public void addAltroCollab(int iIdPrest, String sCollab) {
    if(sCollab == null || sCollab.length() == 0) {
      return;
    }
    if(prestCollab == null) {
      prestCollab = new HashMap<String, String>();
    }
    prestCollab.put(String.valueOf(iIdPrest), sCollab);
    
    if(nomeCollab != null && nomeCollab.equals(sCollab)) return;
    
    if(altriCollab == null) altriCollab = "";
    if(altriCollab.equals(sCollab)) return;
    int i = altriCollab.indexOf(sCollab + ",");
    if(i >= 0) return;
    if(altriCollab.endsWith("," + sCollab)) return;
    if(altriCollab.length() > 0) {
      altriCollab += "," + sCollab;
    }
    else {
      altriCollab = sCollab;
    }
  }
  
  @Override
  public boolean equals(Object object) {
    if (object instanceof Calendario) {
      int iId = ((Calendario) object).getId();
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
    return "Calendario(" + id + "," + WUtil.formatDate(data, '-') + "," + oraInizio + "," + oraFine + "," + stato + "," + idCollaboratore + "," + nomeCollab + "," + idAgenda + "," + idAgendaMod + ")";
  }
}
