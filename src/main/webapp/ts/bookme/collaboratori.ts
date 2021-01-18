namespace GUI {

    import WUtil = WUX.WUtil;

    export class GUICollaboratori extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected tagsFilter: WUX.WTags;
        protected fpFilter: WUX.WFormPanel;
        protected selFar: CFSelectStruture;
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
        protected btnVisible: WUX.WButton;
        // Azioni base 2
        protected cntActions2: CFTableActions;
        protected btnOpen2: WUX.WButton;
        protected btnSave2: WUX.WButton;
        protected btnCancel2: WUX.WButton;
        protected btnDelete2: WUX.WButton;
        protected btnVisible2: WUX.WButton;
        // Risultato
        protected tabResult: WUX.WDXTable;
        protected selId: any;
        // Dettaglio
        protected tcoDetail: WUX.WTab;
        // Dettaglio dati anagrafici
        protected fpDetail: WUX.WFormPanel;
        // Dettaglio orari
        protected cmpAgenda: CFAgenda;
        // Dettaglio variazioni
        protected lblVar: WUX.WLabel;
        protected tabVar: WUX.WDXTable;
        protected btnAddVar: WUX.WButton;
        protected btnAddAss: WUX.WButton;
        protected btnRemVar: WUX.WButton;
        protected dlgAgenda: DlgAgenda;
        protected dlgAssenze: DlgAssenze;
        protected dlgOrariPers: DlgOrariPers;
        // Dettaglio trattamenti
        protected tabSel: WUX.WDXTable;
        protected tabAll: WUX.WDXTable;
        protected btnSx: WUX.WButton;
        protected btnDx: WUX.WButton;
        protected btnCp: WUX.WButton;
        protected btnPa: WUX.WButton;
        // Stati
        protected isNew: boolean;
        protected status: number;
        readonly iSTATUS_STARTUP = 0;
        readonly iSTATUS_VIEW = 1;
        readonly iSTATUS_EDITING = 2;

        constructor(id?: string) {
            super(id ? id : '*', 'GUICollaboratori');
            this.status = this.iSTATUS_STARTUP;

            this.dlgOrariPers = new DlgOrariPers(this.subId('dlgop'));
            this.dlgOrariPers.onHiddenModal((e: JQueryEventObject) => {
                if (!this.dlgOrariPers.ok) return;

                let idf = WUtil.toNumber(this.selFar.getState());
                let date = this.dlgOrariPers.getProps();
                let varz = WUtil.getObject(this.dlgOrariPers.getState(), ICalendario.sORARI);

                if (!date) {
                    WUX.showWarning('Data variazione non presente.')
                    return;
                }

                // Esecuzione controllata (viene richiesta la password dell'utente desk)
                // Superato il controllo viene aggiunto come ultimo parametro il nome utente desk.
                chkExecute('CALENDARIO.saveVariazioni', [idf, date, varz], (result) => {
                // jrpc.execute('CALENDARIO.saveVariazioni', [idf, date, varz], (result) => {

                    WUX.showSuccess('Variazione salvata con successo.');

                });
            });
            this.dlgAgenda = new DlgAgenda(this.subId('dlga'));
            this.dlgAgenda.onHiddenModal((e: JQueryEventObject) => {
                if (!this.dlgAgenda.ok) return;

                let agenda = this.dlgAgenda.getState();
                if (!agenda) {
                    WUX.showWarning('Informazioni agenda assenti');
                    return;
                }
                var item = WUtil.getItem(this.tabResult.getSelectedRowsData(), 0);
                if (!item) return;
                let idc = WUtil.getNumber(item, ICollaboratore.sID);
                if (!idc) {
                    WUX.showWarning('Collaboratore non selezionato.');
                    return;
                }
                let prevId = agenda.id;
                let preOnLine = WUtil.toBoolean(this.fpDetail.getValue(ICollaboratore.sPREN_ONLINE));

                // Esecuzione controllata (viene richiesta la password dell'utente desk)
                // Superato il controllo viene aggiunto come ultimo parametro il nome utente desk.
                chkExecute('COLLABORATORI.addAgenda', [idc, preOnLine, agenda], (result: number) => {
                // jrpc.execute('COLLABORATORI.addAgenda', [idc, preOnLine, agenda], (result: number) => {
                    if (!result) {
                        WUX.showWarning('Piano NON inserito');
                        return;
                    }
                    WUX.showSuccess('Piano inserito con successo.');
                    agenda.id = result;
                    let v = this.tabVar.getState();
                    if (!v) v = [];
                    if (prevId) {
                        let idx = WUtil.indexOf(v, 'id', prevId);
                        if (idx >= 0) v.splice(idx, 1);
                    }
                    v.push(agenda);
                    this.tabVar.setState(v);
                });
            });

            this.dlgAssenze = new DlgAssenze(this.subId('dlgx'));
            this.dlgAssenze.onHiddenModal((e: JQueryEventObject) => {
                if (!this.dlgAssenze.ok) return;

                let dates = this.dlgAssenze.getState();
                if (dates == null || dates.length < 2) return;

                var item = WUtil.getItem(this.tabResult.getSelectedRowsData(), 0);
                if (!item) return;
                let idc = WUtil.getNumber(item, ICollaboratore.sID);
                if (!idc) {
                    WUX.showWarning('Collaboratore non selezionato.');
                    return;
                }

                // Esecuzione controllata (viene richiesta la password dell'utente desk)
                // Superato il controllo viene aggiunto come ultimo parametro il nome utente desk.
                chkExecute('COLLABORATORI.addAssenze', [idc, dates[0], dates[1]], (result: any[]) => {
                // jrpc.execute('COLLABORATORI.addAssenze', [idc, dates[0], dates[1]], (result: any[]) => {
                    if (!result || !result.length) {
                        WUX.showWarning('Assenze NON inserite');
                        return;
                    }
                    WUX.showSuccess(result.length + ' variazioni giornaliere inserite');
                    let v = this.tabVar.getState();
                    if (!v) v = [];
                    for (let i = 0; i < result.length; i++) {
                        v.push(result[i]);
                    }
                    this.tabVar.setState(v);
                });
            });
        }

        protected render() {
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', (e: JQueryEventObject) => {
                if (this.status == this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                let check = this.fpFilter.checkMandatory(true, true, false);
                if (check) {
                    WUX.showWarning('Specificare i seguenti campi: ' + check);
                    return;
                }
                let box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    this.tagsFilter.setState(this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('COLLABORATORI.find', [this.fpFilter.getState()], (result: any[]) => {
                    this.tabResult.setState(result);

                    this.fpDetail.clear();
                    this.cmpAgenda.clear();
                    this.tabVar.setState([]);
                    this.tabSel.setState([]);
                    this.tabAll.clearSelection();
                    this.tabAll.clearFilter();
                    this.btnVisible.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                    this.btnVisible2.setText('Visibile', WUX.WIcon.THUMBS_O_UP);

                    this.status = this.iSTATUS_STARTUP;
                    if (this.selId) {
                        let idx = WUtil.indexOf(result, ICollaboratore.sID, this.selId);
                        if (idx >= 0) {
                            setTimeout(() => {
                                this.tabResult.select([idx]);
                            }, 200);
                        }
                        this.selId = null;
                    }
                });
            });

            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', (e: JQueryEventObject) => {
                if (this.status == this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }                
                this.fpFilter.clear();
                this.tagsFilter.setState({});
                this.tabResult.setState([]);
                this.fpDetail.clear();
                this.cmpAgenda.clear();
                this.tabVar.setState([]);
                this.tabSel.setState([]);
                this.tabAll.clearSelection();
                this.tabAll.clearFilter();
                this.btnVisible.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                this.btnVisible2.setText('Visibile', WUX.WIcon.THUMBS_O_UP);

                this.status = this.iSTATUS_STARTUP;
            });

            this.selFar = new CFSelectStruture();
            this.selFar.on('statechange', (e: WUX.WEvent) => {
                this.tabResult.setState([]);
                this.fpDetail.clear();
                this.cmpAgenda.clear();
                this.tabVar.setState([]);
                this.tabSel.setState([]);
                this.tabAll.clearSelection();
                this.tabAll.clearFilter();

                // Le prestazioni copiate da una struttura non possono essere incollate ovunque.
                cp_prest = null;

                let idf = WUtil.toNumber(this.selFar.getState(), 0);
                jrpc.execute('PRESTAZIONI.getAll', [idf], (result) => {
                    this.tabAll.setState(result);
                });
            });

            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent(ICollaboratore.sID_FAR, 'Struttura', this.selFar);
            this.fpFilter.addTextField(ICollaboratore.sNOME, 'Nome');

            this.fpFilter.setMandatory(ICollaboratore.sID_FAR);

            this.fpDetail = new WUX.WFormPanel(this.subId('fpd'));
            this.fpDetail.addRow();
            this.fpDetail.addTextField(ICollaboratore.sNOME, 'Nome');
            this.fpDetail.addBlankField();
            this.fpDetail.addBlankField();
            this.fpDetail.addRow();
            this.fpDetail.addBooleanField(ICollaboratore.sPREN_ONLINE, 'Prenotabile On Line');
            this.fpDetail.addBlankField();
            this.fpDetail.addBlankField();
            this.fpDetail.addRow();
            this.fpDetail.addComponent(ICollaboratore.sCOLORE, 'Colore', new CFSelectColore());
            this.fpDetail.addBlankField();
            this.fpDetail.addBlankField();
            this.fpDetail.addRow();
            this.fpDetail.addIntegerField(ICollaboratore.sORDINE, 'Ordine nel planning');
            this.fpDetail.addBooleanField(ICollaboratore.sVISIBILE, 'Visibile nel planning');
            this.fpDetail.addBlankField();
            this.fpDetail.addInternalField(ICollaboratore.sID);
            this.fpDetail.enabled = false;

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
                this.cmpAgenda.enabled = true;
                this.btnDx.enabled = true;
                this.btnSx.enabled = true;
                this.btnPa.enabled = true;

                this.fpDetail.clear();
                this.cmpAgenda.clear();
                this.tabVar.setState([]);
                this.tabSel.setState([]);
                this.tabAll.clearSelection();
                this.tabAll.clearFilter();

                this.tcoDetail.setState(0);
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
                this.cmpAgenda.enabled = true;
                this.btnDx.enabled = true;
                this.btnSx.enabled = true;
                this.btnPa.enabled = true;

                // this.tabAll.clearSelection();

                setTimeout(() => { this.fpDetail.focus(); }, 100);
            });
            this.btnSave = new WUX.WButton(this.subId('bs'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave.on('click', (e: JQueryEventObject) => {
                if (this.status != this.iSTATUS_EDITING) {
                    WUX.showWarning('Cliccare su Modifica.');
                    this.btnSave.blur();
                    return;
                }
                let check = this.fpDetail.checkMandatory(true);
                if (check) {
                    this.btnSave.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                let idf = WUtil.toNumber(this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Selezionare la struttura di competenza');
                    return;
                }

                if (!this.cmpAgenda.isBlank() && !this.cmpAgenda.isActivated()) {
                    WUX.showWarning('Planning non generato poich&aacute; orario non attivato.');
                }

                let values = this.fpDetail.getState();
                values[ICollaboratore.sID_FAR] = idf;                
                values[ICollaboratore.sPRESTAZIONI] = this.tabSel.getState();
                values[ICollaboratore.sAGENDA] = this.cmpAgenda.getState();

                if (this.isNew) {
                    jrpc.execute('COLLABORATORI.insert', [CFUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;
                        this.cmpAgenda.enabled = false;
                        this.btnDx.enabled = false;
                        this.btnSx.enabled = false;
                        this.btnPa.enabled = false;

                        WUX.showSuccess('Collaboratore inserito con successo.');

                        this.selId = result[ICollaboratore.sID];
                        this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('COLLABORATORI.update', [CFUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;
                        this.cmpAgenda.enabled = false;
                        this.btnDx.enabled = false;
                        this.btnSx.enabled = false;
                        this.btnPa.enabled = false;

                        WUX.showSuccess('Collaboratore aggiornato con successo.');

                        this.selId = result[ICollaboratore.sID];
                        let selRows = this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
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
                        this.tabSel.setState([]);
                        this.tabAll.clearSelection();
                        this.tabAll.clearFilter();
                    }
                    else {
                        this.onSelect();
                    }
                    this.status = this.iSTATUS_VIEW;

                    this.fpDetail.enabled = false;
                    this.cmpAgenda.enabled = false;
                    this.btnDx.enabled = false;
                    this.btnSx.enabled = false;
                    this.btnPa.enabled = false;
                    
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
                if (!rd || !rd.length) {
                    WUX.showWarning('Selezione l\'elemento da eliminare');
                    return;
                }
                let id = WUtil.getInt(rd[0], ICollaboratore.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, (res: any) => {
                    if (!res) return;
                    jrpc.execute('COLLABORATORI.delete', [id], (result) => {
                        this.btnFind.trigger('click');
                    });
                });
            });
            this.btnVisible = new WUX.WButton(this.subId('bv'), 'Visibile', WUX.WIcon.THUMBS_O_UP, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnVisible.on('click', (e: JQueryEventObject) => {
                this.btnVisible.blur();
                let rd = this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length) {
                    WUX.showWarning('Selezione l\'elemento da aggiornare');
                    return;
                }
                let id = WUtil.getInt(rd[0], ICollaboratore.sID);
                let nv = !WUtil.getBoolean(rd[0], ICollaboratore.sVISIBILE);
                jrpc.execute('COLLABORATORI.setVisible', [id, nv], (result) => {
                    if (result) {
                        WUX.showSuccess('Aggiornamento eseguito con successo.');
                        this.selId = result[ICollaboratore.sID];
                        let selRows = this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            this.btnFind.trigger('click');
                        }
                        else {
                            let idx = selRows[0];
                            let records = this.tabResult.getState();
                            if (records[idx]) {
                                records[idx][ICollaboratore.sVISIBILE] = nv;
                                this.tabResult.refresh();
                                setTimeout(() => {
                                    this.tabResult.select([idx]);
                                }, 100);
                                if (nv) {
                                    this.btnVisible.setText('Non visibile', WUX.WIcon.THUMBS_O_DOWN);
                                    this.btnVisible2.setText('Non visibile', WUX.WIcon.THUMBS_O_DOWN);
                                }
                                else {
                                    this.btnVisible.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                                    this.btnVisible2.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                                }
                            }
                        }
                    }
                });
            });

            this.btnOpen2 = new WUX.WButton(this.subId('bo2'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen2.on('click', (e: JQueryEventObject) => {
                if (this.status == this.iSTATUS_EDITING || this.status == this.iSTATUS_STARTUP) {
                    this.btnOpen2.blur();
                    return;
                }
                let sr = this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    this.btnOpen2.blur();
                    return;
                }
                this.isNew = false;
                this.status = this.iSTATUS_EDITING;
                this.selId = null;

                this.fpDetail.enabled = true;
                this.cmpAgenda.enabled = true;
                this.btnDx.enabled = true;
                this.btnSx.enabled = true;
                this.btnPa.enabled = true;

                // this.tabAll.clearSelection();

                setTimeout(() => { this.fpDetail.focus(); }, 100);
            });
            this.btnSave2 = new WUX.WButton(this.subId('bs2'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave2.on('click', (e: JQueryEventObject) => {
                if (this.status != this.iSTATUS_EDITING) {
                    WUX.showWarning('Cliccare su Modifica.');
                    this.btnSave2.blur();
                    return;
                }
                let check = this.fpDetail.checkMandatory(true);
                if (check) {
                    this.btnSave2.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                let idf = WUtil.toNumber(this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Selezionare la struttura di competenza');
                    return;
                }

                if (!this.cmpAgenda.isBlank() && !this.cmpAgenda.isActivated()) {
                    WUX.showWarning('Planning non generato poich&aacute; orario non attivato.');
                }

                let values = this.fpDetail.getState();
                values[ICollaboratore.sID_FAR] = idf;
                values[ICollaboratore.sPRESTAZIONI] = this.tabSel.getState();
                values[ICollaboratore.sAGENDA] = this.cmpAgenda.getState();

                if (this.isNew) {
                    jrpc.execute('COLLABORATORI.insert', [CFUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;
                        this.cmpAgenda.enabled = false;
                        this.btnDx.enabled = false;
                        this.btnSx.enabled = false;
                        this.btnPa.enabled = false;

                        WUX.showSuccess('Collaboratore inserito con successo.');

                        this.selId = result[ICollaboratore.sID];
                        this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('COLLABORATORI.update', [CFUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;
                        this.cmpAgenda.enabled = false;
                        this.btnDx.enabled = false;
                        this.btnSx.enabled = false;
                        this.btnPa.enabled = false;

                        WUX.showSuccess('Collaboratore aggiornato con successo.');

                        this.selId = result[ICollaboratore.sID];
                        let selRows = this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
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
            this.btnCancel2 = new WUX.WButton(this.subId('bc2'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel2.on('click', (e: JQueryEventObject) => {
                if (this.status != this.iSTATUS_EDITING) {
                    this.btnCancel2.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, (res: any) => {
                    if (!res) return;
                    if (this.isNew) {
                        this.fpDetail.clear();
                        this.tabSel.setState([]);
                        this.tabAll.clearSelection();
                        this.tabAll.clearFilter();
                    }
                    else {
                        this.onSelect();
                    }
                    this.status = this.iSTATUS_VIEW;

                    this.fpDetail.enabled = false;
                    this.cmpAgenda.enabled = false;
                    this.btnDx.enabled = false;
                    this.btnSx.enabled = false;
                    this.btnPa.enabled = false;

                    this.selId = null;
                });
            });
            this.btnDelete2 = new WUX.WButton(this.subId('bd2'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete2.on('click', (e: JQueryEventObject) => {
                this.selId = null;
                this.btnDelete2.blur();
                if (this.status == this.iSTATUS_EDITING || this.status == this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                let rd = this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length) {
                    WUX.showWarning('Selezione l\'elemento da eliminare');
                    return;
                }
                let id = WUtil.getInt(rd[0], ICollaboratore.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, (res: any) => {
                    if (!res) return;
                    jrpc.execute('COLLABORATORI.delete', [id], (result) => {
                        this.btnFind.trigger('click');
                    });
                });
            });
            this.btnVisible2 = new WUX.WButton(this.subId('bv2'), 'Visibile', WUX.WIcon.THUMBS_O_UP, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnVisible2.on('click', (e: JQueryEventObject) => {
                this.btnVisible2.blur();
                let rd = this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length) {
                    WUX.showWarning('Selezione l\'elemento da aggiornare');
                    return;
                }
                let id = WUtil.getInt(rd[0], ICollaboratore.sID);
                let nv = !WUtil.getBoolean(rd[0], ICollaboratore.sVISIBILE);
                jrpc.execute('COLLABORATORI.setVisible', [id, nv], (result) => {
                    if (result) {
                        WUX.showSuccess('Aggiornamento eseguito con successo.');
                        this.selId = result[ICollaboratore.sID];
                        let selRows = this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            this.btnFind.trigger('click');
                        }
                        else {
                            let idx = selRows[0];
                            let records = this.tabResult.getState();
                            if (records[idx]) {
                                records[idx][ICollaboratore.sVISIBILE] = nv;
                                this.tabResult.refresh();
                                setTimeout(() => {
                                    this.tabResult.select([idx]);
                                }, 100);
                                if (nv) {
                                    this.btnVisible.setText('Non visibile', WUX.WIcon.THUMBS_O_DOWN);
                                    this.btnVisible2.setText('Non visibile', WUX.WIcon.THUMBS_O_DOWN);
                                }
                                else {
                                    this.btnVisible.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                                    this.btnVisible2.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                                }
                            }
                        }
                    }
                });
            });

            let rc = [
                ['Colore', ICollaboratore.sCOLORE, 's'],
                ['Nome', ICollaboratore.sNOME, 's'],
                ['Ordine', ICollaboratore.sORDINE, 'i'],
                ['Pren. On Line', ICollaboratore.sPREN_ONLINE, 'b'],
                ['Visibile', ICollaboratore.sVISIBILE, 'b']
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.css({ h: 220 });
            this.tabResult.widths = [50, 300];
            this.tabResult.types = WUtil.col(rc, 2);
            this.tabResult.onSelectionChanged((e: { element?: JQuery, selectedRowsData?: Array<any> }) => {

                this.onSelect();

            });
            this.tabResult.onCellPrepared((e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: DevExpress.ui.dxDataGridColumn, rowIndex?: number, rowType?: string, row?: DevExpress.ui.dxDataGridRowObject, isSelected?: boolean, isExpanded?: boolean, cellElement?: DevExpress.core.dxElement }) => {
                if (e.rowType == 'header') return;
                e.cellElement.css('padding', '4px 0px 4px 8px');
                let df = e.column.dataField;
                if (df == ICollaboratore.sCOLORE) {
                    e.cellElement.html('<div style="width:30px;height:30px;border-radius:50%;background-color:#' + e.value + ';"></div>');
                }
            });

            this.lblVar = new WUX.WLabel(this.subId('lba'), 'Non occorre cliccare su Modifica o Salva: le modifiche fatte in questa sezione sono immediate.', WUX.WIcon.WARNING);
            this.lblVar.css({ f: 14, fw: 'bold' }, WUX.CSS.LABEL_NOTICE);

            this.tabVar = new WUX.WDXTable(this.subId('tbv'), ['Inizio Val.', 'Fine Val.', 'Descrizione'], ['inizioValidita', 'fineValidita', 'descrizione']);
            this.tabVar.selectionMode = 'single';
            this.tabVar.css({ h: 250 });
            this.tabVar.widths = [120, 120];
            this.tabVar.onDoubleClick((e: { element?: JQuery }) => {
                let srd = this.tabVar.getSelectedRowsData();
                if (!srd || !srd.length) return;
                let idv = WUtil.getNumber(srd[0], 'id');
                if (!idv) {
                    WUX.showWarning('Riferimento alla variazione assente');
                    return;
                }
                if (idv < 0) {
                    let dtv = WUtil.getDate(srd[0], 'inizioValidita');
                    if (!dtv) {
                        WUX.showWarning('Data variazione assente');
                        return;
                    }
                    let filter = {};
                    filter[ICalendario.sDATA] = dtv;
                    filter[ICalendario.sID_COLLABORATORE] = this.fpDetail.getValue(ICollaboratore.sID);
                    jrpc.execute('CALENDARIO.getTimeTable', [filter], (result) => {

                        this.dlgOrariPers.setProps(dtv);
                        this.dlgOrariPers.setState(result);
                        this.dlgOrariPers.show();

                    });
                }
                else {
                    jrpc.execute('COLLABORATORI.readAgenda', [idv], (result) => {

                        this.dlgAgenda.setState(result);
                        this.dlgAgenda.show();

                    });
                }
            });

            this.btnAddVar = new WUX.WButton(this.subId('bav'), GUI.TXT.ADD, '', WUX.BTN.SM_PRIMARY);
            this.btnAddVar.on('click', (e: JQueryEventObject) => {
                this.dlgAgenda.setState(null);
                this.dlgAgenda.show();
            });
            this.btnAddAss = new WUX.WButton(this.subId('bac'), 'Assenze', '', WUX.BTN.SM_INFO);
            this.btnAddAss.on('click', (e: JQueryEventObject) => {
                this.dlgAssenze.show();
            });
            this.btnRemVar = new WUX.WButton(this.subId('brv'), GUI.TXT.REMOVE, '', WUX.BTN.SM_DANGER);
            this.btnRemVar.on('click', (e: JQueryEventObject) => {
                var item = WUtil.getItem(this.tabResult.getSelectedRowsData(), 0);
                if (!item) return;
                let idc = WUtil.getNumber(item, ICollaboratore.sID);
                if (!idc) {
                    WUX.showWarning('Collaboratore non selezionato.');
                    return;
                }
                let sr = this.tabVar.getSelectedRows();
                let srd = this.tabVar.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare la variazione da rimuovere');
                    return;
                }
                let idv = WUtil.getNumber(srd[0], 'id');
                if (!idv) {
                    WUX.showWarning('Riferimento alla variazione assente');
                    return;
                }
                let div = WUtil.getDate(srd[0], 'inizioValidita');
                WUX.confirm('Si vuole rimuovere la variazione selezionata?', (res) => {
                    if (!res) return;
                    if (idv < 0) {
                        // Esecuzione controllata (viene richiesta la password dell'utente desk)
                        // Superato il controllo viene aggiunto come ultimo parametro il nome utente desk.
                        chkExecute('CALENDARIO.deleteVariazioni', [idc, div], (result) => {
                        // jrpc.execute('CALENDARIO.deleteVariazioni', [idc, div], (result) => {
                            if (!result) {
                                WUX.showWarning('Variazione NON eliminata.');
                                return;
                            }
                            WUX.showSuccess('Variazione eliminata con successo.');
                            let v = this.tabVar.getState();
                            v.splice(sr[0], 1);
                            this.tabVar.setState(v);
                        });
                    }
                    else if (idv > 0) {
                        // Esecuzione controllata (viene richiesta la password dell'utente desk)
                        // Superato il controllo viene aggiunto come ultimo parametro il nome utente desk.
                        chkExecute('COLLABORATORI.deleteAgenda', [idv], (result) => {
                        // jrpc.execute('COLLABORATORI.deleteAgenda', [idv], (result) => {
                            if (!result) {
                                WUX.showWarning('Piano NON eliminato.');
                                return;
                            }
                            WUX.showSuccess('Piano eliminato con successo.');
                            let v = this.tabVar.getState();
                            v.splice(sr[0], 1);
                            this.tabVar.setState(v);
                        });
                    }
                });
            });

            this.tabSel = new WUX.WDXTable(this.subId('tbs'), ['Gruppo', 'Descrizione'], [IPrestazione.sDESC_GRUPPO, IPrestazione.sDESCRIZIONE]);
            this.tabSel.selectionMode = 'multiple';
            this.tabSel.css({ h: 250 });
            this.tabSel.widths = [100];
            this.tabSel.filter = true;
            this.tabSel.onCellPrepared((e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: DevExpress.ui.dxDataGridColumn, rowIndex?: number, rowType?: string, row?: DevExpress.ui.dxDataGridRowObject, isSelected?: boolean, isExpanded?: boolean, cellElement?: DevExpress.core.dxElement }) => {
                let f = e.column.dataField;
                if (f == IPrestazione.sDESC_GRUPPO) {
                    e.cellElement.addClass('clickable');
                }
            });
            this.tabSel.onCellClick((e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: DevExpress.event, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: DevExpress.ui.dxDataGridRowObject }) => {
                let row = e.row;
                if (row != null && row.rowType == 'data') {
                    let f = e.column.dataField;
                    if (f == IPrestazione.sDESC_GRUPPO) {
                        let x: number[] = [];
                        let d = this.tabSel.getState();
                        for (let i = 0; i < d.length; i++) {
                            let r = d[i];
                            if (r[IPrestazione.sDESC_GRUPPO] == e.value) x.push(i);
                        }
                        if (!x || !x.length) return;
                        // Riporta i record nell'ordine originario (ovvero di getState)
                        this.tabSel.setState(d);
                        setTimeout(() => {
                            this.tabSel.select(x);
                        }, 200);
                    }
                }
            });

            this.tabAll = new WUX.WDXTable(this.subId('tba'), ['Gruppo', 'Descrizione'], [IPrestazione.sDESC_GRUPPO, IPrestazione.sDESCRIZIONE]);
            this.tabAll.selectionMode = 'multiple';
            this.tabAll.css({ h: 250 });
            this.tabAll.widths = [100];
            this.tabAll.filter = true;
            this.tabAll.onCellPrepared((e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: DevExpress.ui.dxDataGridColumn, rowIndex?: number, rowType?: string, row?: DevExpress.ui.dxDataGridRowObject, isSelected?: boolean, isExpanded?: boolean, cellElement?: DevExpress.core.dxElement }) => {
                let f = e.column.dataField;
                if (f == IPrestazione.sDESC_GRUPPO) {
                    e.cellElement.addClass('clickable');
                }
            });
            this.tabAll.onCellClick((e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: DevExpress.event, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: DevExpress.ui.dxDataGridRowObject }) => {
                let row = e.row;
                if (row != null && row.rowType == 'data') {
                    let f = e.column.dataField;
                    if (f == IPrestazione.sDESC_GRUPPO) {
                        let x: number[] = [];
                        let d = this.tabAll.getState();
                        for (let i = 0; i < d.length; i++) {
                            let r = d[i];
                            if (r[IPrestazione.sDESC_GRUPPO] == e.value) x.push(i);
                        }
                        if (!x || !x.length) return;
                        // Riporta i record nell'ordine originario (ovvero di getState)
                        this.tabAll.setState(d);
                        setTimeout(() => {
                            this.tabAll.select(x);
                        }, 200);
                    }
                }
            });

            this.btnSx = new WUX.WButton(this.subId('bba'), '', GUI.ICO.LEFT, WUX.BTN.PRIMARY, { p: '1px 6px 1px 6px' });
            this.btnSx.tooltip = 'Aggiungi trattamenti';
            this.btnSx.enabled = false;
            this.btnSx.on('click', (e: JQueryEventObject) => {
                let dts = this.tabSel.getState();
                if (!dts) dts = [];
                let srd = this.tabAll.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare uno o pi&ugrave; trattamenti dal catalogo.');
                    return;
                }
                let scr = false;
                for (let i = 0; i < srd.length; i++) {
                    let p = srd[i];
                    let pid = p[IPrestazione.sID];
                    let f = false;
                    for (let j = 0; j < dts.length; j++) {
                        let s = dts[j];
                        let sid = s[IPrestazione.sID];
                        if (sid == pid) {
                            f = true;
                            break;
                        }
                    }
                    if (!f) {
                        dts.push(p);
                        scr = true;
                    }
                }
                this.tabSel.setState(dts);
                if (scr) {
                    setTimeout(() => {
                        this.tabSel.scrollTo(999999);
                    }, 250);
                }
            });

            this.btnDx = new WUX.WButton(this.subId('bbd'), '', GUI.ICO.DELETE, WUX.BTN.DANGER, { p: '1px 7px 1px 7px' });
            this.btnDx.tooltip = 'Rimuovi trattamenti';
            this.btnDx.enabled = false;
            this.btnDx.on('click', (e: JQueryEventObject) => {
                let dts = this.tabSel.getState();
                if (!dts) dts = [];
                let srd = this.tabSel.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare uno o pi&ugrave; trattamenti dall\'elenco degli assegnati.');
                    return;
                }
                let cpy = [];
                for (let i = 0; i < dts.length; i++) {
                    let p = dts[i];
                    let pid = p[IPrestazione.sID];
                    let f = false;
                    for (let j = 0; j < srd.length; j++) {
                        let s = srd[j];
                        let sid = s[IPrestazione.sID];
                        if (sid == pid) {
                            f = true;
                            break;
                        }
                    }
                    if (!f) cpy.push(p);
                }
                this.tabSel.setState(cpy);
            });

            this.btnCp = new WUX.WButton(this.subId('bbc'), '', GUI.ICO.COPY, WUX.BTN.SECONDARY, { p: '1px 7px 1px 7px' });
            this.btnCp.tooltip = 'Copia trattamenti';
            this.btnCp.on('click', (e: JQueryEventObject) => {
                let items = this.tabSel.getState()
                if (!items || !items.length) {
                    WUX.showSuccess('Nessun elemento selezionato');
                    return;
                }
                cp_prest = items;
                WUX.showSuccess('Trattamenti copiati nella clipboard');
            });
            this.btnPa = new WUX.WButton(this.subId('bbp'), '', GUI.ICO.PASTE, WUX.BTN.WARNING, { p: '1px 7px 1px 7px' });
            this.btnPa.tooltip = 'Incolla trattamenti';
            this.btnPa.enabled = false;
            this.btnPa.on('click', (e: JQueryEventObject) => {
                if (!cp_prest) {
                    WUX.showWarning('Non vi sono trattamenti nella clipboard');
                    return;
                }
                this.tabSel.setState(cp_prest);
            });

            let cntTab0 = new WUX.WContainer(this.subId('ct0'), '');
            cntTab0
                .addRow()
                .addCol('11', { p: 0 })
                .add(this.tabSel)
                .addCol('1', { p: 0 })
                .addStack(WUX.CSS.STACK_BTNS, this.btnSx, this.btnDx, this.btnCp, this.btnPa);

            this.cntActions = new CFTableActions('ta');
            this.cntActions.left.add(this.btnOpen);
            this.cntActions.left.add(this.btnDelete);
            this.cntActions.left.add(this.btnSave);
            this.cntActions.left.add(this.btnCancel);
            this.cntActions.left.add(this.btnVisible);
            this.cntActions.right.add(this.btnNew);

            this.cntActions2 = new CFTableActions('ta2');
            this.cntActions2.left.add(this.btnOpen2);
            this.cntActions2.left.add(this.btnDelete2);
            this.cntActions2.left.add(this.btnSave2);
            this.cntActions2.left.add(this.btnCancel2);
            this.cntActions2.left.add(this.btnVisible2);

            this.tagsFilter = new WUX.WTags('tf');

            this.cmpAgenda = new CFAgenda(this.subId('age'));

            this.tcoDetail = new WUX.WTab('tcod');
            this.tcoDetail.addTab('Anagrafica', WUX.WIcon.ADDRESS_CARD)
                .addRow()
                .addCol('12', { h: 300 })
                .add(this.fpDetail);

            this.tcoDetail.addTab('Orari', WUX.WIcon.CLOCK_O)
                .add(this.cmpAgenda);

            this.tcoDetail.addTab('Variazioni', WUX.WIcon.CALENDAR)
                .addRow()
                .addCol('12')
                .add(this.lblVar)
                .addDiv(8)
                .addRow()
                .addCol('11', { h: 300 })
                .add(this.tabVar)
                .addCol('1', { h: 300 })
                .addStack(WUX.CSS.STACK_BTNS, this.btnAddVar, this.btnAddAss, this.btnRemVar);

            this.tcoDetail.addTab('Trattamenti', WUX.WIcon.COG)
                .addRow()
                .addCol('6').section('Assegnati', { h: 300 })
                .add(cntTab0)
                .addCol('6').section('Catalogo', { h: 300 })
                .add(this.tabAll);

            this.tcoDetail.on('statechange', (e: WUX.WEvent) => {
                let itab = this.tcoDetail.getState();
                switch (itab) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        this.tabVar.repaint();
                        break;
                    case 3:
                        this.tabSel.repaint();
                        this.tabAll.repaint();
                        break;
                }
            });

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
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, this.cntActions, this.tabResult, this.cntActions2)
                .end() // end Box
                .addRow()
                .addCol('12').section('Dettaglio')
                .add(this.tcoDetail);

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

            let id = WUtil.getNumber(item, ICollaboratore.sID);
            if (!id) return;

            this.fpDetail.clear();
            this.cmpAgenda.clear();
            this.tabVar.setState([]);
            this.tabSel.setState([]);
            this.tabAll.clearSelection();
            this.tabAll.clearFilter();

            if (this.status == this.iSTATUS_EDITING) {
                WUX.showWarning('Modifiche annullate');
                this.fpDetail.enabled = false;
                this.cmpAgenda.enabled = false;
                this.btnDx.enabled = false;
                this.btnSx.enabled = false;
                this.btnPa.enabled = false;
            }

            jrpc.execute('COLLABORATORI.read', [id], (result) => {
                this.fpDetail.setState(result);
                this.cmpAgenda.setState(WUtil.getObject(result, ICollaboratore.sAGENDA));
                this.tabVar.setState(WUtil.getArray(result, ICollaboratore.sVARIAZIONI));
                this.tabSel.setState(WUtil.getArray(result, ICollaboratore.sPRESTAZIONI));
                this.status = this.iSTATUS_VIEW;

                CFBookCfg.CHECK_USER_DESK = WUtil.getBoolean(result, ICalendario.sCHECK_USER_DESK);

                let vis = WUtil.getBoolean(result, ICollaboratore.sVISIBILE);
                if (vis) {
                    this.btnVisible.setText('Non visibile', WUX.WIcon.THUMBS_O_DOWN);
                    this.btnVisible2.setText('Non visibile', WUX.WIcon.THUMBS_O_DOWN);
                }
                else {
                    this.btnVisible.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                    this.btnVisible2.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                }
            });
        }

        protected componentDidMount(): void {
            let idf = WUtil.toInt(WUtil.getParam(ICollaboratore.sID_FAR), 0);
            if (!idf) {
                if (strutture && strutture.length) {
                    idf = strutture[0].id;
                }
            }
            if (idf) this.selFar.setState(idf);

            this.cmpAgenda.clear();
            this.cmpAgenda.setDateRef(new Date());
            this.cmpAgenda.enabled = false;

            let id = WUtil.toInt(WUtil.getParam(ICollaboratore.sID), 0);

            let box = WUX.getComponent('boxFilter');
            if (box instanceof WUX.WBox) {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
                box.collapse();
            }
            let filter = {};
            filter[ICollaboratore.sID] = id;
            filter[ICollaboratore.sID_FAR] = idf;
            this.selId = id;
            jrpc.execute('COLLABORATORI.find', [filter], (result) => {
                this.tabResult.setState(result);
                if (result && result.length == 1) {
                    setTimeout(() => {
                        this.tabResult.select([0]);
                    }, 200);
                }
            });
        }
    }
}