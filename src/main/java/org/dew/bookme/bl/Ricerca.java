package org.dew.bookme.bl;

import java.io.Serializable;

import org.util.WUtil;

public 
class Ricerca implements Serializable
{
  private static final long serialVersionUID = -3551717161450310188L;
  
  protected Object dal;
  protected Object al;
  protected Object ora;
  protected Object dalleOre;
  protected Object alleOre;
  protected int idFar;
  protected int idPrest;
  protected int durata;
  protected int idColl;
  protected boolean talColl;
  protected int idAttr;
  protected boolean talAttr;
  protected boolean prenOnLine;
  protected boolean first;
  protected int maxDate;
  protected int maxColl;
  protected int step;
  
  public Ricerca()
  {
  }
  
  public Ricerca(int idPrest, boolean first)
  {
    this.idPrest = idPrest;
    this.first   = first;
  }
  
  public Ricerca(int idFar, int idPrest, int durata, Object dal, Object al, Object ora)
  {
    this.idFar   = idFar;
    this.idPrest = idPrest;
    this.durata  = durata;
    this.dal     = dal;
    this.al      = al;
    this.ora     = ora;
  }
  
  public Object getDal() {
    return dal;
  }
  
  public Object getAl() {
    return al;
  }
  
  public Object getOra() {
    return ora;
  }
  
  public Object getDalleOre() {
    return dalleOre;
  }
  
  public Object getAlleOre() {
    return alleOre;
  }
  
  public int getIdFar() {
    return idFar;
  }
  
  public int getIdPrest() {
    return idPrest;
  }
  
  public int getDurata() {
    return durata;
  }
  
  public int getIdColl() {
    return idColl;
  }
  
  public boolean isTalColl() {
    return talColl;
  }
  
  public int getIdAttr() {
    return idAttr;
  }
  
  public boolean isTalAttr() {
    return talAttr;
  }
  
  public boolean isPrenOnLine() {
    return prenOnLine;
  }
  
  public boolean isFirst() {
    return first;
  }
  
  public int getMaxDate() {
    return maxDate;
  }
  
  public int getMaxColl() {
    return maxColl;
  }
  
  public int getStep() {
    return step;
  }
  
  public void setDal(Object dal) {
    this.dal = dal;
  }
  
  public void setAl(Object al) {
    this.al = al;
  }
  
  public void setOra(Object ora) {
    this.ora = ora;
  }
  
  public void setDalleOre(Object dalleOre) {
    this.dalleOre = dalleOre;
  }
  
  public void setAlleOre(Object alleOre) {
    this.alleOre = alleOre;
  }
  
  public void setIdFar(int idFar) {
    this.idFar = idFar;
  }
  
  public void setIdPrest(int idPrest) {
    this.idPrest = idPrest;
  }
  
  public void setDurata(int durata) {
    this.durata = durata;
  }
  
  public void setIdColl(int idColl) {
    this.idColl = idColl;
  }
  
  public void setTalColl(boolean talColl) {
    this.talColl = talColl;
  }
  
  public void setIdAttr(int idAttr) {
    this.idAttr = idAttr;
  }
  
  public void setTalAttr(boolean talAttr) {
    this.talAttr = talAttr;
  }
  
  public void setPrenOnLine(boolean prenOnLine) {
    this.prenOnLine = prenOnLine;
  }
  
  public void setFirst(boolean first) {
    this.first = first;
  }
  
  public void setMaxDate(int maxDate) {
    this.maxDate = maxDate;
  }
  
  public void setMaxColl(int maxColl) {
    this.maxColl = maxColl;
  }
  
  public void setStep(int step) {
    this.step = step;
  }
  
  public void executedBy(int iIdColl, boolean talColl, int iIdAttr, boolean talAttr) {
    this.idColl  = iIdColl;
    this.talColl = talColl;
    this.idAttr  = iIdAttr;
    this.talAttr = talAttr;
  }
  
  @Override
  public boolean equals(Object object) {
    if (object instanceof Ricerca) {
      int iId = ((Ricerca) object).getIdPrest();
      return iId == idPrest;
    }
    return false;
  }
  
  @Override
  public int hashCode() {
    if (idPrest == 0) {
      return idPrest;
    }
    return idPrest;
  }
  
  @Override
  public String toString() {
    return "Ricerca(dal=" + WUtil.formatDate(dal, "-") + ",al=" + WUtil.formatDate(al, "-") + ",ora=" + ora + ",idFar=" + idFar + ",idPrest=" + idPrest + ",durata=" + durata + ",idColl=" + idColl + ",talColl=" + talColl + ",idAttr=" + idAttr + ",talAttr=" + talAttr + ",first=" + first + ",maxDate=" + maxDate + ")";
  }
}