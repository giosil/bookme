namespace GUI {

    import WUtil = WUX.WUtil;

    export class GUIClienti extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected tagsFilter: WUX.WTags;
        protected fpFilter: WUX.WFormPanel;
        protected btnFind: WUX.WButton;
        protected btnReset: WUX.WButton;
        // Nuovo
        protected btnNew: WUX.WButton;
        // Azioni base
        protected cntActions: CFTableActions;
        protected btnOpen: WUX.WButton;
        protected btnSave: WUX.WButton;
        protected btnCancel: WUX.WButton;
        protected btnDelete: WUX.WButton;
        protected btnMerge: WUX.WButton;
        protected btnSMS: WUX.WButton;
        protected btnComm: WUX.WButton;
        // Risultato
        protected tabResult: WUX.WDXTable;
        protected selId: any;
        protected itemMrg: any;
        // Dettaglio
        protected fpDetail: WUX.WFormPanel;
        // Storico Prenotazioni
        protected tabStorico: WUX.WDXTable;
        protected dataRif: number;
        // Dialogs
        dlgMrgC: DlgClienti;
        dlgPren: DlgPrenotazione;
        dlgText: DlgSMSText;
        dlgComm: DlgComunicazione;
        // Stati
        protected isNew: boolean;
        protected status: number;
        readonly iSTATUS_STARTUP = 0;
        readonly iSTATUS_VIEW = 1;
        readonly iSTATUS_EDITING = 2;

        constructor(id?: string) {
            super(id ? id : '*', 'GUIClienti');
            this.status = this.iSTATUS_STARTUP;
            this.dataRif = WUtil.toNumber(new Date());

            this.dlgMrgC = new DlgClienti(this.subId('dlgm'));
            this.dlgMrgC.onHiddenModal((e: JQueryEventObject) => {
                if (!this.dlgMrgC.ok) return;
                let selItem = this.dlgMrgC.getState();
                if (!selItem || !selItem[ICliente.sID]) {
                    WUX.showWarning('Cliente non selezionato dalla finestra di dialogo.');
                    return;
                }
                if (!this.itemMrg || !this.itemMrg[ICliente.sID]) {
                    WUX.showWarning('Cliente non selezionato.');
                    return;
                }
                if (this.itemMrg[ICliente.sID] == selItem[ICliente.sID]) {
                    WUX.showWarning('Il cliente selezionato &egrave; lo stesso di quello che si vuole accorpare.');
                    return;
                }
                // Cliente selezionato nella maschera di gestione
                let cid1 = WUtil.getNumber(this.itemMrg, ICliente.sID);
                let cco1 = WUtil.getString(this.itemMrg, ICliente.sCOGNOME);
                let cno1 = WUtil.getString(this.itemMrg, ICliente.sNOME);
                let cte1 = WUtil.getString(this.itemMrg, ICliente.sTELEFONO1);
                let cli1 = cco1;
                if (cno1) cli1 += ' ' + cno1;
                if (cte1) cli1 += ' (' + cte1 + ')';

                // Cliente selezionato nella finestra di dialogo
                let cid2 = WUtil.getNumber(selItem, ICliente.sID);
                let cco2 = WUtil.getString(selItem, ICliente.sCOGNOME);
                let cno2 = WUtil.getString(selItem, ICliente.sNOME);
                let cte2 = WUtil.getString(selItem, ICliente.sTELEFONO1);
                let cli2 = cco2;
                if (cno2) cli2 += ' ' + cno2;
                if (cte2) cli2 += ' (' + cte2 + ')';

                let msg = 'Il cliente ' + cli1 + ' sara\' rimosso e le sue prenotazioni passeranno a ' + cli2 + '. ';
                msg += 'L\'operazione sara\' irreversibile. Si vuole procedere con l\'accorpamento?';

                WUX.confirm(msg, (res) => {
                    if (!res) return;
                    jrpc.execute('CLIENTI.merge', [cid1, cid2], (result) => {
                        if (result) {
                            WUX.showSuccess('Cliente accorpato con successo.');
                            this.btnFind.trigger('click');
                        }
                        else {
                            WUX.showSuccess('Operazione NON eseguita.');
                        }
                    });
                });
            });

            this.dlgPren = new DlgPrenotazione(this.subId('dlgp'));

            this.dlgText = new DlgSMSText(this.subId('dlgs'));
            this.dlgText.onHiddenModal((e: JQueryEventObject) => {
                if (!this.dlgText.ok) return;

                let text = this.dlgText.getState();
                let rd = this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length) {
                    WUX.showWarning('Cliente non selezionato.');
                    return;
                }
                let id = WUtil.getInt(rd[0], ICliente.sID);
                jrpc.execute('CLIENTI.sendSMS', [id, text], (result) => {
                    if (result) {
                        WUX.showSuccess('Messaggio inviato con successo.');
                    }
                    else {
                        WUX.showSuccess('Messaggio NON inviato.');
                    }
                });
            });

            this.dlgComm = new DlgComunicazione(this.subId('dlgc'));
            this.dlgComm.onHiddenModal((e: JQueryEventObject) => {
                if (!this.dlgComm.ok) return;
                let c = this.dlgComm.getProps();
                if (!c || !c.id) {
                    WUX.showWarning('Comunicazione non selezionata.');
                    return;
                }
                let r = this.tabResult.getState();
                if (!r || !r.length) {
                    WUX.showWarning('Effettuare una ricerca per l\'invio di una comunicazione');
                    return;
                }
                let a: number[] = [];
                for (let i = 0; i < r.length; i++) {
                    a[i] = WUtil.getNumber(r[i], ICliente.sID);
                }
                jrpc.execute('COMUNICAZIONI.add', [c.id, a], (result) => {
                    if (result) {
                        WUX.showSuccess(result + ' clienti inseriti nella lista di comunicazione.');
                    }
                    else {
                        WUX.showSuccess('Nessun cliente inserito nella lista di comunicazione.');
                    }
                });
            });
        }

        protected render() {
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', (e: JQueryEventObject) => {
                if (this.status == this.iSTATUS_EDITING) return;
                let box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    this.tagsFilter.setState(this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('CLIENTI.find', [this.fpFilter.getState()], (result) => {
                    this.itemMrg = null;
                    this.tabResult.setState(result);
                    this.fpDetail.clear();
                    this.status = this.iSTATUS_STARTUP;
                    if (this.selId) {
                        let idx = WUtil.indexOf(result, ICliente.sID, this.selId);
                        if (idx >= 0) {
                            setTimeout(() => {
                                this.tabResult.select([idx]);
                            }, 100);
                        }
                        this.selId = null;
                    }
                });
            });

            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', (e: JQueryEventObject) => {
                if (this.status == this.iSTATUS_EDITING) return;
                this.itemMrg = null;
                this.fpFilter.clear();
                this.tagsFilter.setState({});
                this.tabResult.setState([]);
                this.fpDetail.clear();
                this.status = this.iSTATUS_STARTUP;
            });

            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addTextField(ICliente.sCOGNOME, 'Cognome');
            this.fpFilter.addTextField(ICliente.sNOME, 'Nome');
            this.fpFilter.addOptionsField(ICliente.sSESSO, 'Sesso', [{ id: '', text: '' }, { id: 'M', text: 'Maschio' }, { id: 'F', text: 'Femmina' }]);
            this.fpFilter.addComponent(ICliente.sOPZIONI, 'Opzioni', new CFSelOpzClienti());
            this.fpFilter.addRow();
            this.fpFilter.addTextField(ICliente.sTELEFONO1, 'Telefono');
            this.fpFilter.addTextField(ICliente.sEMAIL, 'Email');
            this.fpFilter.addIntegerField(ICliente.sETA_DA, 'Et&agrave; da');
            this.fpFilter.addIntegerField(ICliente.sETA_A, 'Et&agrave; a');

            this.fpDetail = new WUX.WFormPanel(this.subId('fpd'));
            this.fpDetail.addRow();
            this.fpDetail.addTextField(ICliente.sCOGNOME, 'Cognome');
            this.fpDetail.addTextField(ICliente.sNOME, 'Nome');
            this.fpDetail.addTextField(ICliente.sTELEFONO1, 'Telefono');
            this.fpDetail.addTextField(ICliente.sEMAIL, 'Email');
            this.fpDetail.addRow();
            this.fpDetail.addDateField(ICliente.sDATA_NASCITA, 'Data di nascita');
            this.fpDetail.addOptionsField(ICliente.sSESSO, 'Sesso', [{ id: '', text: '' }, { id: 'M', text: 'Maschio' }, { id: 'F', text: 'Femmina' }]);
            this.fpDetail.addBooleanField(ICliente.sDIS_PREN_ONLINE, 'Disab. Pren. OnLine');
            this.fpDetail.addBlankField();
            this.fpDetail.addRow();
            this.fpDetail.addTextField(ICliente.sNOTE, 'Note');
            this.fpDetail.addInternalField(ICliente.sID);
            this.fpDetail.enabled = false;

            let sc = [
                ['Data App.', IPrenotazione.sDATA_APP, 'd'],
                ['Ora App.', IPrenotazione.sORA_APP, 's'],
                ['Durata', IPrenotazione.sDURATA, 'i'],
                ['Stato', IPrenotazione.sSTATO, 's'],
                ['Collaboratore', IPrenotazione.sDESC_COLL, 's'],
                ['Trattamento', IPrenotazione.sDESC_PREST, 's'],
                ['Cabina', IPrenotazione.sDESC_ATTR, 's'],
                ['Data Pren.', IPrenotazione.sDATA_PREN, 'd'],
                ['Data Agg.', IPrenotazione.sDATA_UPD, 't'],
                ['Struttura', IPrenotazione.sCOD_FAR, 's'],
                ['Note', IPrenotazione.sNOTE, 's'],
                ['Coupon', IPrenotazione.sCOD_COUPON, 's'],
                ['Forzatura', IPrenotazione.sOVERBOOKING, 'b'],
                ['On Line', IPrenotazione.sPREN_ONLINE, 'b']
            ];

            this.tabStorico = new WUX.WDXTable(this.subId('tps'), WUtil.col(sc, 0), WUtil.col(sc, 1));
            this.tabStorico.types = WUtil.col(sc, 2);
            this.tabStorico.css({ h: 200, f: 10 });
            this.tabStorico.onRowPrepared((e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number }) => {
                if (!e.data) return;
                let stato = WUtil.getString(e.data, IPrenotazione.sSTATO, 'C');
                let pdata = WUtil.getInt(e.data, IPrenotazione.sDATA_APP);
                switch (stato) {
                    case 'F':
                        WUX.setCss(e.rowElement, WUX.CSS.WARNING);
                        break;
                    case 'E':
                        WUX.setCss(e.rowElement, WUX.CSS.SUCCESS);
                        break;
                    case 'N':
                        WUX.setCss(e.rowElement, WUX.CSS.ERROR);
                        break;
                    case 'A':
                        WUX.setCss(e.rowElement, WUX.CSS.COMPLETED);
                        break;
                }
                if (pdata == this.dataRif) {
                    e.rowElement.css('font-weight', 'bold');
                }
            });
            this.tabStorico.onDoubleClick((e: { element?: JQuery }) => {
                let srd = this.tabStorico.getSelectedRowsData();
                if (!srd || !srd.length) return;

                let id = WUtil.getString(srd[0], IPrenotazione.sID);
                jrpc.execute('PRENOTAZIONI.read', [id], (result) => {
                    if (!result) {
                        WUX.showWarning('Prenotazione ' + id + ' non disponibile.');
                        return;
                    }
                    let dataApp = WUtil.getDate(result, IPrenotazione.sDATA_APP);
                    if (dataApp) {
                        result[IPrenotazione.sDATA_APP] = WUX.formatDate(dataApp, true);
                    }
                    let dataPre = WUtil.getDate(result, IPrenotazione.sDATA_PREN);
                    if (dataPre) {
                        result[IPrenotazione.sDATA_PREN] = WUX.formatDateTime(dataPre, false, true);
                    }

                    this.dlgPren.setState(result);
                    this.dlgPren.show();
                });
            });

            this.fpFilter.onEnterPressed((e: WUX.WEvent) => {
                this.btnFind.trigger('click');
            });

            this.btnNew = new WUX.WButton(this.subId('bn'), GUI.TXT.NEW, '', WUX.BTN.SM_INFO);
            this.btnNew.on('click', (e: JQueryEventObject) => {
                if (this.status == this.iSTATUS_EDITING) {
                    this.btnNew.blur();
                    return;
                }

                this.isNew = true;
                this.status = this.iSTATUS_EDITING;
                this.selId = null;

                this.tabResult.clearSelection();

                this.fpDetail.enabled = true;
                this.fpDetail.clear();
                setTimeout(() => { this.fpDetail.focus(); }, 100);
            });
            this.btnOpen = new WUX.WButton(this.subId('bo'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen.on('click', (e: JQueryEventObject) => {
                if (this.status == this.iSTATUS_EDITING || this.status == this.iSTATUS_STARTUP) {
                    this.btnOpen.blur();
                    return;
                }
                let sr = this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    this.btnOpen.blur();
                    return;
                }
                this.isNew = false;
                this.status = this.iSTATUS_EDITING;
                this.selId = null;

                this.fpDetail.enabled = true;
                setTimeout(() => { this.fpDetail.focus(); }, 100);
            });
            this.btnSave = new WUX.WButton(this.subId('bs'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave.on('click', (e: JQueryEventObject) => {
                if (this.status != this.iSTATUS_EDITING) {
                    this.btnSave.blur();
                    return;
                }
                let check = this.fpDetail.checkMandatory(true);
                if (check) {
                    this.btnSave.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                let values = this.fpDetail.getState();
                if (this.isNew) {
                    jrpc.execute('CLIENTI.insert', [CFUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;
                        this.fpDetail.enabled = false;
                        this.selId = result[ICliente.sID];
                        if (this.fpFilter.isBlank(ICliente.sCOGNOME)) {
                            this.fpFilter.setValue(ICliente.sCOGNOME, WUtil.getString(result, ICliente.sCOGNOME));
                        }
                        this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('CLIENTI.update', [CFUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;
                        this.fpDetail.enabled = false;
                        this.selId = result[ICliente.sID];
                        let selRows = this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            if (this.fpFilter.isBlank(ICliente.sCOGNOME)) {
                                this.fpFilter.setValue(ICliente.sCOGNOME, WUtil.getString(result, ICliente.sCOGNOME));
                            }
                            this.btnFind.trigger('click');
                        }
                        else {
                            let idx = selRows[0];
                            let records = this.tabResult.getState();
                            records[idx] = result;
                            this.tabResult.refresh();
                            setTimeout(() => {
                                this.tabResult.select([idx]);
                            }, 100);
                        }
                    });
                }
            });
            this.btnCancel = new WUX.WButton(this.subId('bc'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel.on('click', (e: JQueryEventObject) => {
                if (this.status != this.iSTATUS_EDITING) {
                    this.btnCancel.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, (res: any) => {
                    if (!res) return;
                    if (this.isNew) {
                        this.fpDetail.clear();
                    }
                    else {
                        this.onSelect();
                    }
                    this.status = this.iSTATUS_VIEW;
                    this.fpDetail.enabled = false;
                    this.selId = null;
                });
            });
            this.btnDelete = new WUX.WButton(this.subId('bd'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete.on('click', (e: JQueryEventObject) => {
                this.selId = null;
                this.btnDelete.blur();
                if (this.status == this.iSTATUS_EDITING || this.status == this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                let rd = this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length) return;
                let id = WUtil.getInt(rd[0], ICliente.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, (res: any) => {
                    if (!res) return;
                    jrpc.execute('CLIENTI.delete', [id], (result) => {
                        this.btnFind.trigger('click');
                    });
                });
            });
            this.btnMerge = new WUX.WButton(this.subId('bm'), 'Accorpa', GUI.ICO.COPY, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnMerge.on('click', (e: JQueryEventObject) => {
                this.selId = null;
                this.itemMrg = null;
                this.btnMerge.blur();
                if (this.status == this.iSTATUS_EDITING || this.status == this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                let rd = this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length) return;
                this.itemMrg = rd[0];

                // Cliente selezionato nella maschera di gestione
                let cid1 = WUtil.getNumber(this.itemMrg, ICliente.sID);
                let cco1 = WUtil.getString(this.itemMrg, ICliente.sCOGNOME);
                let cno1 = WUtil.getString(this.itemMrg, ICliente.sNOME);
                let cte1 = WUtil.getString(this.itemMrg, ICliente.sTELEFONO1);
                let cli1 = cco1;
                if (cno1) cli1 += ' ' + cno1;
                if (cte1) cli1 += ' (' + cte1 + ')';

                let msg = 'Il cliente ' + cli1 + ' sara\' rimosso e le sue prenotazioni ';
                msg += 'passeranno al cliente che sara\' selezionato nel prossimo passaggio. ';
                msg += 'In questo modo le due posizioni anagrafiche saranno accorpate. Proseguire?';

                WUX.confirm(msg, (res) => {
                    if (!res) return;
                    this.dlgMrgC.setProps(cid1);
                    this.fpFilter.transferTo(this.dlgMrgC.fpFilter);
                    this.dlgMrgC.show();
                });
            });
            this.btnSMS = new WUX.WButton(this.subId('bx'), 'Invia SMS', WUX.WIcon.ENVELOPE_O, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnSMS.on('click', (e: JQueryEventObject) => {
                let rd = this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length) {
                    WUX.showWarning('Selezionare un cliente per inviare un SMS');
                    return;
                }
                this.dlgText.setState('');
                this.dlgText.show();
            });
            this.btnComm = new WUX.WButton(this.subId('by'), 'Comunicazione', WUX.WIcon.SEND, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnComm.on('click', (e: JQueryEventObject) => {
                let clienti = this.tabResult.getState();
                if (!clienti || !clienti.length) {
                    WUX.showWarning('Effettuare una ricerca per l\'invio di una comunicazione');
                    return;
                }
                if (!strutture || !strutture.length) {
                    WUX.showWarning('Strutture non caricate');
                    return;
                }
                jrpc.execute('COMUNICAZIONI.getAll', [strutture[0].id], (result) => {
                    this.dlgComm.setState(result);
                    this.dlgComm.show();
                });
            });

            let rc = [
                ['Cognome', ICliente.sCOGNOME, 's'],
                ['Nome', ICliente.sNOME, 's'],
                ['Telefono', ICliente.sTELEFONO1, 's'],
                ['Email', ICliente.sEMAIL, 's'],
                ['Sesso', ICliente.sSESSO, 's'],
                ['Data Nascita', ICliente.sDATA_NASCITA, 'd']
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.exportFile = 'clienti';
            this.tabResult.types = WUtil.col(rc, 2);
            this.tabResult.css({ h: 250 });
            this.tabResult.widths = [100];
            this.tabResult.onSelectionChanged((e: { element?: JQuery, selectedRowsData?: Array<any> }) => {

                this.onSelect();

            });
            this.tabResult.onRowPrepared((e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number }) => {
                if (!e.data) return;
                if (e.data[ICliente.sREPUTAZIONE]) {
                    WUX.setCss(e.rowElement, WUX.CSS.ERROR);
                }
            });

            this.cntActions = new CFTableActions('ta');
            this.cntActions.left.add(this.btnOpen);
            this.cntActions.left.add(this.btnDelete);
            this.cntActions.left.add(this.btnSave);
            this.cntActions.left.add(this.btnCancel);
            this.cntActions.left.add(this.btnMerge);
            this.cntActions.left.add(this.btnSMS);
            this.cntActions.left.add(this.btnComm);
            this.cntActions.right.add(this.btnNew);

            this.tagsFilter = new WUX.WTags('tf');

            this.container = new WUX.WContainer();
            this.container.attributes = WUX.ATT.STICKY_CONTAINER;
            this.container
                .addBox('Filtri di ricerca:', '', '', 'boxFilter', WUX.ATT.BOX_FILTER)
                .addTool(this.tagsFilter)
                .addCollapse(this.collapseHandler.bind(this))
                .addRow()
                .addCol('col-xs-11 b-r')
                .add(this.fpFilter)
                .addCol('col-xs-1 b-l')
                .addGroup({ classStyle: 'form-group text-right' }, this.btnFind, this.btnReset)
                .end() // end Box
                .addBox()
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, this.cntActions, this.tabResult)
                .end() // end Box
                .addRow()
                .addCol('12').section('Dettaglio')
                .add(this.fpDetail)
                .addRow()
                .addCol('12').section('Storico Prenotazioni')
                .add(this.tabStorico);

            return this.container;
        }

        collapseHandler(e: JQueryEventObject) {
            let c = WUtil.getBoolean(e.data, 'collapsed');
            if (c) {
                this.tagsFilter.setState({});
            }
            else {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
            }
        }

        protected onSelect(): void {
            var item = WUtil.getItem(this.tabResult.getSelectedRowsData(), 0);
            if (!item) return;

            let id = WUtil.getNumber(item, ICliente.sID);
            if (!id) return;

            if (this.status == this.iSTATUS_EDITING) {
                WUX.showWarning('Modifiche annullate');
                this.fpDetail.enabled = false;
            }

            this.fpDetail.clear();
            jrpc.execute('CLIENTI.read', [id], (result) => {
                this.fpDetail.setState(result);
                this.tabStorico.setState(WUtil.getArray(result, ICliente.sPRENOTAZIONI));
                this.status = this.iSTATUS_VIEW;
            });
        }
    }
}