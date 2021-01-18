package org.dew.bookme.bl;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.util.WUtil;

public 
class Prenotazione implements Serializable
{
  private static final long serialVersionUID = -2140956656578462809L;
  
  private int id;
  private int idFar;
  private String codFar;
  private String desFar;
  private int idColl;
  private String descColl;
  private String colore;
  private int idCliente;
  private String descCliente;
  private String tel1;
  private String tel2;
  private String email;
  private int idPrest;
  private String descPrest;
  private int idAttr;
  private String descAttr;
  private String codice;
  private Date dataPren;
  private Date dataUpd;
  private Date dataApp;
  private String oraApp;
  private String oraFine;
  private int durata;
  private String stato;
  private String tipo;
  private double prezzoFinale;
  private boolean prenOnLine;
  private boolean pagato;
  private String note;
  private String noteCliente;
  private boolean overbooking;
  private String tipoPag;
  private double impPagato;
  private String codCoupon;
  private String causale;
  private String userDesk;
  // Attributi ausiliari 
  private int cambioIdColl;
  private Date cambioData;
  private String cambioOra;
  private Date cambioDal;
  private Date cambioAl;
  private Date allaData;
  private List<Integer> prestazioni;
  private List<Integer> durate;
  private String messaggio;
  private String preferenze;
  private String ckUserDesk;
  
  public Prenotazione()
  {
  }
  
  public Prenotazione(int id)
  {
    this.id = id;
  }
  
  public Prenotazione(int id, int idFar)
  {
    this.id = id;
    this.idFar = idFar;
  }
  
  public Prenotazione(int id, int idCliente, String descCliente, int idPrest, String descPrest, Date dataApp, String oraApp)
  {
    this.id = id;
    this.idCliente = idCliente;
    this.descCliente = descCliente;
    this.idPrest = idPrest;
    this.descPrest = descPrest;
    this.dataApp = dataApp;
    this.oraApp = oraApp;
  }
  
  public Prenotazione(Prenotazione p)
  {
    if(p == null) return;
    
    id = p.getId();
    idFar = p.getIdFar();
    codFar = p.getCodFar();
    desFar = p.getDesFar();
    idColl = p.getIdColl();
    descColl = p.getDescColl();
    colore = p.getColore();
    idCliente = p.getIdCliente();
    descCliente = p.getDescCliente();
    tel1 = p.getTel1();
    tel2 = p.getTel2();
    email = p.getEmail();
    idPrest = p.getIdPrest();
    descPrest = p.getDescPrest();
    idAttr = p.getIdAttr();
    descAttr = p.getDescAttr();
    codice = p.getCodice();
    dataPren = p.getDataPren();
    dataUpd = p.getDataUpd();
    dataApp = p.getDataApp();
    oraApp = p.getOraApp();
    oraFine = p.getOraFine();
    durata = p.getDurata();
    stato = p.getStato();
    tipo = p.getTipo();
    prezzoFinale = p.getPrezzoFinale();
    prenOnLine = p.isPrenOnLine();
    pagato = p.isPagato();
    note = p.getNote();
    noteCliente = p.getNoteCliente();
    overbooking = p.isOverbooking();
    tipoPag = p.getTipoPag();
    impPagato = p.getImpPagato();
    codCoupon = p.getCodCoupon();
    causale = p.getCausale();
    userDesk = p.getUserDesk();
    
    cambioIdColl = p.getCambioIdColl();
    cambioData = p.getCambioData();
    cambioOra = p.getCambioOra();
    cambioDal = p.getCambioDal();
    cambioAl = p.getCambioAl();
    allaData = p.getAllaData();
    prestazioni = p.getPrestazioni();
    durate = p.getDurate();
    messaggio = p.getMessaggio();
    preferenze = p.getPreferenze();
    ckUserDesk = p.getCkUserDesk();
  }
  
  public Prenotazione(String messaggio)
  {
    this.messaggio = messaggio;
  }
  
  public int getId() {
    return id;
  }
  
  public int getIdFar() {
    return idFar;
  }
  
  public String getCodFar() {
    return codFar;
  }
  
  public String getDesFar() {
    return desFar;
  }
  
  public int getIdColl() {
    return idColl;
  }
  
  public String getDescColl() {
    return descColl;
  }
  
  public String getColore() {
    return colore;
  }
  
  public int getIdCliente() {
    return idCliente;
  }
  
  public String getDescCliente() {
    return descCliente;
  }
  
  public String getTel1() {
    return tel1;
  }
  
  public String getTel2() {
    return tel2;
  }
  
  public String getEmail() {
    return email;
  }
  
  public int getIdPrest() {
    return idPrest;
  }
  
  public String getDescPrest() {
    return descPrest;
  }
  
  public int getIdAttr() {
    return idAttr;
  }
  
  public String getDescAttr() {
    return descAttr;
  }
  
  public String getCodice() {
    return codice;
  }
  
  public Date getDataPren() {
    return dataPren;
  }
  
  public Date getDataUpd() {
    return dataUpd;
  }
  
  public Date getDataApp() {
    return dataApp;
  }
  
  public String getOraApp() {
    return oraApp;
  }
  
  public String getOraFine() {
    return oraFine;
  }
  
  public int getDurata() {
    return durata;
  }
  
  public String getStato() {
    return stato;
  }
  
  public String getTipo() {
    return tipo;
  }
  
  public double getPrezzoFinale() {
    return prezzoFinale;
  }
  
  public boolean isPrenOnLine() {
    return prenOnLine;
  }
  
  public boolean isPagato() {
    return pagato;
  }
  
  public String getNote() {
    return note;
  }
  
  public String getNoteCliente() {
    return noteCliente;
  }
  
  public boolean isOverbooking() {
    return overbooking;
  }
  
  public String getTipoPag() {
    return tipoPag;
  }
  
  public double getImpPagato() {
    return impPagato;
  }
  
  public String getCodCoupon() {
    return codCoupon;
  }
  
  public String getCausale() {
    return causale;
  }
  
  public String getUserDesk() {
    return userDesk;
  }
  
  public int getCambioIdColl() {
    return cambioIdColl;
  }
  
  public Date getCambioData() {
    return cambioData;
  }
  
  public String getCambioOra() {
    return cambioOra;
  }
  
  public Date getCambioDal() {
    return cambioDal;
  }
  
  public Date getCambioAl() {
    return cambioAl;
  }
  
  public Date getAllaData() {
    return allaData;
  }
  
  public List<Integer> getPrestazioni() {
    return prestazioni;
  }
  
  public List<Integer> getDurate() {
    return durate;
  }
  
  public String getMessaggio() {
    return messaggio;
  }
  
  public String getPreferenze() {
    return preferenze;
  }
  
  public String getCkUserDesk() {
    return ckUserDesk;
  }
  
  public void setId(int id) {
    this.id = id;
  }
  
  public void setIdFar(int idFar) {
    this.idFar = idFar;
  }
  
  public void setCodFar(String codFar) {
    this.codFar = codFar;
  }
  
  public void setDesFar(String desFar) {
    this.desFar = desFar;
  }
  
  public void setIdColl(int idColl) {
    this.idColl = idColl;
  }
  
  public void setDescColl(String descColl) {
    this.descColl = descColl;
  }
  
  public void setColore(String colore) {
    this.colore = colore;
  }
  
  public void setIdCliente(int idCliente) {
    this.idCliente = idCliente;
  }
  
  public void setDescCliente(String descCliente) {
    this.descCliente = descCliente;
  }
  
  public void setTel1(String tel1) {
    this.tel1 = tel1;
  }
  
  public void setTel2(String tel2) {
    this.tel2 = tel2;
  }
  
  public void setEmail(String email) {
    this.email = email;
  }
  
  public void setIdPrest(int idPrest) {
    this.idPrest = idPrest;
  }
  
  public void setDescPrest(String descPrest) {
    this.descPrest = descPrest;
  }
  
  public void setIdAttr(int idAttr) {
    this.idAttr = idAttr;
  }
  
  public void setDescAttr(String descAttr) {
    this.descAttr = descAttr;
  }
  
  public void setCodice(String codice) {
    this.codice = codice;
  }
  
  public void setDataPren(Date dataPren) {
    this.dataPren = dataPren;
  }
  
  public void setDataUpd(Date dataUpd) {
    this.dataUpd = dataUpd;
  }
  
  public void setDataApp(Date dataApp) {
    this.dataApp = dataApp;
  }
  
  public void setOraApp(String oraApp) {
    this.oraApp = oraApp;
  }
  
  public void setOraFine(String oraFine) {
    this.oraFine = oraFine;
  }
  
  public void setDurata(int durata) {
    this.durata = durata;
  }
  
  public void setStato(String stato) {
    this.stato = stato;
  }
  
  public void setTipo(String tipo) {
    this.tipo = tipo;
  }
  
  public void setPrezzoFinale(double prezzoFinale) {
    this.prezzoFinale = prezzoFinale;
  }
  
  public void setPrenOnLine(boolean prenOnLine) {
    this.prenOnLine = prenOnLine;
  }
  
  public void setPagato(boolean pagato) {
    this.pagato = pagato;
  }
  
  public void setNote(String note) {
    this.note = note;
  }
  
  public void setNoteCliente(String noteCliente) {
    this.noteCliente = noteCliente;
  }
  
  public void setOverbooking(boolean overbooking) {
    this.overbooking = overbooking;
  }
  
  public void setTipoPag(String tipoPag) {
    this.tipoPag = tipoPag;
  }
  
  public void setImpPagato(double impPagato) {
    this.impPagato = impPagato;
  }
  
  public void setCodCoupon(String codCoupon) {
    this.codCoupon = codCoupon;
  }
  
  public void setCausale(String causale) {
    this.causale = causale;
  }
  
  public void setUserDesk(String userDesk) {
    this.userDesk = userDesk;
  }
  
  public void setCambioIdColl(int cambioIdColl) {
    this.cambioIdColl = cambioIdColl;
  }
  
  public void setCambioData(Date cambioData) {
    this.cambioData = cambioData;
  }
  
  public void setCambioOra(String cambioOra) {
    this.cambioOra = cambioOra;
  }
  
  public void setCambioDal(Date cambioDal) {
    this.cambioDal = cambioDal;
  }
  
  public void setCambioAl(Date cambioAl) {
    this.cambioAl = cambioAl;
  }
  
  public void setAllaData(Date allaData) {
    this.allaData = allaData;
  }
  
  public void setPrestazioni(List<Integer> prestazioni) {
    this.prestazioni = prestazioni;
  }
  
  public void setDurate(List<Integer> durate) {
    this.durate = durate;
  }
  
  public void setMessaggio(String messaggio) {
    this.messaggio = messaggio;
  }
  
  public void setPreferenze(String preferenze) {
    this.preferenze = preferenze;
  }
  
  public void setCkUserDesk(String ckUserDesk) {
    this.ckUserDesk = ckUserDesk;
  }
  
  @Override
  public boolean equals(Object object) {
    if (object instanceof Prenotazione) {
      int iId = ((Prenotazione) object).getId();
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
    List<Integer> p = null;
    if(prestazioni != null && prestazioni.size() == 0) {
      p = prestazioni;
    }
    else {
      p = new ArrayList<Integer>(1);
      p.add(idPrest);
    }
    return "Prenotazione(" + id + "," + WUtil.formatDate(dataApp, "-") + "," + oraApp + "," + idCliente + "," + descCliente + "," + p + "," + idColl + "," + idAttr + ")";
  }
}
