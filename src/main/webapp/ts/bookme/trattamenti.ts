namespace GUI {

    import WUtil = WUX.WUtil;

    export class GUIGruppiTrat extends WUX.WComponent {
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
        // Risultato
        protected tabResult: WUX.WDXTable;
        protected selId: any;
        // Dettaglio
        protected fpDetail: WUX.WFormPanel;

        protected isNew: boolean;
        protected status: number;
        readonly iSTATUS_STARTUP = 0;
        readonly iSTATUS_VIEW = 1;
        readonly iSTATUS_EDITING = 2;

        constructor(id?: string) {
            super(id ? id : '*', 'GUIGruppiTrat');
            this.status = this.iSTATUS_STARTUP;
        }

        protected render() {
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', (e: JQueryEventObject) => {
                if (this.status == this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                let check = this.fpFilter.checkMandatory(true, true, true);
                if (check) {
                    WUX.showWarning('Specificare i seguenti campi: ' + check);
                    return;
                }
                let box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    this.tagsFilter.setState(this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('GRUPPI_PREST.find', [CFUtil.putUserInfo(this.fpFilter.getState())], (result) => {
                    this.tabResult.setState(result);

                    this.fpDetail.clear();
                    this.status = this.iSTATUS_STARTUP;

                    if (this.selId) {
                        let idx = WUtil.indexOf(result, IPrestazione.sID, this.selId);
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
                if (this.status == this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                this.fpFilter.clear();
                this.tagsFilter.setState({});
                this.tabResult.setState([]);
                this.fpDetail.clear();

                this.status = this.iSTATUS_STARTUP;
            });

            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addTextField(IGruppoPrest.sCODICE, 'Codice');
            this.fpFilter.addTextField(IGruppoPrest.sDESCRIZIONE, 'Descrizione');

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
                    WUX.showWarning('Cliccare su Modifica.');
                    this.btnSave.blur();
                    return;
                }
                let check = this.fpDetail.checkMandatory(true, true, false);
                if (check) {
                    this.btnSave.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                let values = this.fpDetail.getState();
                if (this.isNew) {
                    jrpc.execute('GRUPPI_PREST.insert', [values], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;

                        WUX.showSuccess('Gruppo inserito con successo.');

                        this.selId = result[IGruppoPrest.sID];
                        this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('GRUPPI_PREST.update', [values], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;

                        WUX.showSuccess('Gruppo aggiornato con successo.');

                        this.selId = result[IGruppoPrest.sID];
                        let selRows = this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            this.btnFind.trigger('click');
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
                let id = WUtil.getInt(rd[0], IGruppoPrest.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, (res: any) => {
                    if (!res) return;
                    jrpc.execute('GRUPPI_PREST.delete', [id], (result) => {
                        this.btnFind.trigger('click');
                    });
                });
            });


            let rc = [
                ['Codice', IGruppoPrest.sCODICE, 100, 's'],
                ['Descrizione', IGruppoPrest.sDESCRIZIONE, 0, 's']
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.css({ h: 220 });
            this.tabResult.widths = WUtil.col(rc, 2);
            this.tabResult.types = WUtil.col(rc, 3);
            this.tabResult.exportFile = 'trattamenti';
            this.tabResult.onSelectionChanged((e: { element?: JQuery, selectedRowsData?: Array<any> }) => {

                let srd = this.tabResult.getSelectedRowsData();
                if (!srd || !srd.length) return;

                this.fpDetail.setState(srd[0]);

                this.status = this.iSTATUS_VIEW
            });

            this.fpDetail = new WUX.WFormPanel(this.subId('fd'));
            this.fpDetail.addRow();
            this.fpDetail.addTextField(IGruppoPrest.sCODICE, 'Codice');
            this.fpDetail.addTextField(IGruppoPrest.sDESCRIZIONE, 'Descrizione');
            this.fpDetail.addInternalField(IGruppoPrest.sID);
            this.fpDetail.enabled = false;

            this.cntActions = new CFTableActions('ta');
            this.cntActions.left.add(this.btnOpen);
            this.cntActions.left.add(this.btnDelete);
            this.cntActions.left.add(this.btnSave);
            this.cntActions.left.add(this.btnCancel);
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
                .add(this.fpDetail);

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
    }

    export class GUITrattamenti extends WUX.WComponent {
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
        // Azioni base 2
        protected cntActions2: CFTableActions;
        protected btnOpen2: WUX.WButton;
        protected btnSave2: WUX.WButton;
        protected btnCancel2: WUX.WButton;
        protected btnDelete2: WUX.WButton;
        // Risultato
        protected tabResult: WUX.WDXTable;
        protected selId: any;
        // Dettaglio
        protected tcoDetail: WUX.WTab;
        // Dettaglio dati anagrafici
        protected selGruppo: CFSelectGruppiPre;
        protected fpDetail: WUX.WFormPanel;
        // Dettaglio cabine
        protected tabSelA: WUX.WDXTable;
        protected tabAllA: WUX.WDXTable;
        protected btnSxA: WUX.WButton;
        protected btnDxA: WUX.WButton;
        protected btnCpA: WUX.WButton;
        protected btnPaA: WUX.WButton;
        // Dettaglio collaboratori
        protected tabSelC: WUX.WDXTable;
        protected tabAllC: WUX.WDXTable;
        protected btnSxC: WUX.WButton;
        protected btnDxC: WUX.WButton;
        protected btnCpC: WUX.WButton;
        protected btnPaC: WUX.WButton;
        // Stati
        protected isNew: boolean;
        protected status: number;
        readonly iSTATUS_STARTUP = 0;
        readonly iSTATUS_VIEW = 1;
        readonly iSTATUS_EDITING = 2;

        constructor(id?: string) {
            super(id ? id : '*', 'GUITrattamenti');
            this.status = this.iSTATUS_STARTUP;
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
                jrpc.execute('PRESTAZIONI.find', [CFUtil.putUserInfo(this.fpFilter.getState())], (result) => {
                    this.tabResult.setState(result);

                    this.fpDetail.clear();
                    this.status = this.iSTATUS_STARTUP;

                    if (this.selId) {
                        let idx = WUtil.indexOf(result, IPrestazione.sID, this.selId);
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
                if (this.status == this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }                
                this.fpFilter.clear();
                this.tagsFilter.setState({});
                this.tabResult.setState([]);
                this.fpDetail.clear();
                this.tabSelA.setState([]);
                this.tabAllA.clearSelection();
                this.tabAllA.clearFilter();
                this.tabSelC.setState([]);
                this.tabAllC.clearSelection();
                this.tabAllC.clearFilter();

                this.status = this.iSTATUS_STARTUP;
            });

            this.selFar = new CFSelectStruture();
            this.selFar.on('statechange', (e: WUX.WEvent) => {
                this.tabResult.setState([]);
                this.fpDetail.clear();
                this.tabSelA.setState([]);
                this.tabAllA.clearSelection();
                this.tabAllA.clearFilter();
                this.tabSelC.setState([]);
                this.tabAllC.clearSelection();
                this.tabAllC.clearFilter();

                // Le attrezzature e i collaboratori copiati da una struttura non possono essere incollate ovunque.
                cp_attrz = null;
                cp_collb = null;

                let idf = WUtil.toNumber(this.selFar.getState(), 0);
                jrpc.execute('ATTREZZATURE.getAll', [idf], (result) => {
                    this.tabAllA.setState(result);
                });
                jrpc.execute('COLLABORATORI.getAll', [idf], (result) => {
                    this.tabAllC.setState(result);
                });
            });

            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent(IPrestazione.sID_FAR, 'Struttura', this.selFar);
            this.fpFilter.addComponent(IPrestazione.sGRUPPO, 'Gruppo', new CFSelectGruppiPre());
            this.fpFilter.addTextField(IPrestazione.sDESCRIZIONE, 'Descrizione');

            this.fpFilter.setMandatory(IPrestazione.sID_FAR);

            this.selGruppo = new CFSelectGruppiPre();

            this.fpDetail = new WUX.WFormPanel(this.subId('fpd'));
            this.fpDetail.addRow();
            this.fpDetail.addTextField(IPrestazione.sDESCRIZIONE, 'Descrizione');
            this.fpDetail.addComponent(IPrestazione.sGRUPPO, 'Gruppo', this.selGruppo);
            this.fpDetail.addIntegerField(IPrestazione.sDURATA, 'Durata (min.)');
            this.fpDetail.addBooleanField(IPrestazione.sPREN_ONLINE, 'Pren. On Line');
            this.fpDetail.addRow();
            this.fpDetail.addComponent(IPrestazione.sTIPO_PREZZO, 'Tipo prezzo', new CFSelectTipoPrezzo());
            this.fpDetail.addCurrencyField(IPrestazione.sPREZZO_LISTINO, 'Prezzo Listino');
            this.fpDetail.addCurrencyField(IPrestazione.sSCONTO_ASS, 'Sconto &euro;');
            this.fpDetail.addIntegerField(IPrestazione.sSCONTO_PERC, 'Sconto %');
            this.fpDetail.addCurrencyField(IPrestazione.sPREZZO_FINALE, 'Prezzo Finale');
            this.fpDetail.addIntegerField(IPrestazione.sPUNTI_COLL, 'Punti Coll.');
            this.fpDetail.addRow();
            this.fpDetail.addTextField(IPrestazione.sCODICE, 'Cod.Servizio');
            this.fpDetail.addTextField(IPrestazione.sAVVERTENZE, 'Avvertenze');
            this.fpDetail.addTextField(IPrestazione.sINDICAZIONI, 'Indicazioni');
            this.fpDetail.addInternalField(IPrestazione.sID);
            this.fpDetail.enabled = false;

            this.fpDetail.onBlur(IPrestazione.sPREZZO_LISTINO, (e: JQueryEventObject) => {
                this.calcPrezzi();
            });
            this.fpDetail.onBlur(IPrestazione.sSCONTO_ASS, (e: JQueryEventObject) => {
                this.calcPrezzi();
            });
            this.fpDetail.onBlur(IPrestazione.sSCONTO_PERC, (e: JQueryEventObject) => {
                this.calcPrezzi();
            });
            this.fpDetail.onBlur(IPrestazione.sPREZZO_FINALE, (e: JQueryEventObject) => {
                this.calcPrezzi();
            });

            this.fpDetail.setSpanField(IPrestazione.sDESCRIZIONE, 3);
            this.fpDetail.setSpanField(IPrestazione.sCODICE, 2);
            this.fpDetail.setSpanField(IPrestazione.sAVVERTENZE, 2);
            this.fpDetail.setSpanField(IPrestazione.sINDICAZIONI, 2);

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
                this.btnDxA.enabled = true;
                this.btnSxA.enabled = true;
                this.btnPaA.enabled = true;
                this.btnDxC.enabled = true;
                this.btnSxC.enabled = true;
                this.btnPaC.enabled = true;

                this.fpDetail.clear();
                this.tabSelA.setState([]);
                this.tabAllA.clearSelection();
                this.tabSelC.setState([]);
                this.tabAllC.clearSelection();

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
                this.btnDxA.enabled = true;
                this.btnSxA.enabled = true;
                this.btnPaA.enabled = true;
                this.btnDxC.enabled = true;
                this.btnSxC.enabled = true;
                this.btnPaC.enabled = true;

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
                let values = this.fpDetail.getState();
                let d = WUtil.getNumber(values, IPrestazione.sDURATA);
                if (d < 5) {
                    WUX.showWarning('Durata non valida.');
                    return;
                }
                if (d > 600) {
                    WUX.showWarning('Durata non valida: massimo 600 minuti.');
                    return;
                }
                values[IPrestazione.sID_FAR] = idf;                  
                values[IPrestazione.sATTREZZATURE] = this.tabSelA.getState();
                values[IPrestazione.sCOLLABORATORI] = this.tabSelC.getState();
                if (this.isNew) {
                    jrpc.execute('PRESTAZIONI.insert', [values], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;
                        this.btnDxA.enabled = false;
                        this.btnSxA.enabled = false;
                        this.btnPaA.enabled = false;
                        this.btnDxC.enabled = false;
                        this.btnSxC.enabled = false;
                        this.btnPaC.enabled = false;

                        WUX.showSuccess('Trattamento inserito con successo.');

                        this.selId = result[IPrestazione.sID];
                        this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('PRESTAZIONI.update', [values], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;
                        this.btnDxA.enabled = false;
                        this.btnSxA.enabled = false;
                        this.btnPaA.enabled = false;
                        this.btnDxC.enabled = false;
                        this.btnSxC.enabled = false;
                        this.btnPaC.enabled = false;

                        WUX.showSuccess('Trattamento aggiornato con successo.');

                        this.selId = result[IPrestazione.sID];
                        let selRows = this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            this.btnFind.trigger('click');
                        }
                        else {
                            let idx = selRows[0];
                            let records = this.tabResult.getState();
                            records[idx] = result;
                            records[idx][IPrestazione.sDESC_GRUPPO] = this.selGruppo.getProps();
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
                        this.tabSelA.setState([]);
                        this.tabAllA.clearSelection();
                        this.tabSelC.setState([]);
                        this.tabAllC.clearSelection();
                    }
                    else {
                        this.onSelect();
                    }
                    this.status = this.iSTATUS_VIEW;

                    this.fpDetail.enabled = false;
                    this.btnDxA.enabled = false;
                    this.btnSxA.enabled = false;
                    this.btnPaA.enabled = false;
                    this.btnDxC.enabled = false;
                    this.btnSxC.enabled = false;
                    this.btnPaC.enabled = false;

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
                let id = WUtil.getInt(rd[0], IPrestazione.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, (res: any) => {
                    if (!res) return;
                    jrpc.execute('PRESTAZIONI.delete', [id], (result) => {
                        this.btnFind.trigger('click');
                    });
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
                this.btnDxA.enabled = true;
                this.btnSxA.enabled = true;
                this.btnPaA.enabled = true;
                this.btnDxC.enabled = true;
                this.btnSxC.enabled = true;
                this.btnPaC.enabled = true;

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
                let values = this.fpDetail.getState();
                let d = WUtil.getNumber(values, IPrestazione.sDURATA);
                if (d < 5) {
                    WUX.showWarning('Durata non valida.');
                    return;
                }
                if (d > 600) {
                    WUX.showWarning('Durata non valida: massimo 600 minuti.');
                    return;
                }
                values[IPrestazione.sID_FAR] = idf;
                values[IPrestazione.sATTREZZATURE] = this.tabSelA.getState();
                values[IPrestazione.sCOLLABORATORI] = this.tabSelC.getState();
                if (this.isNew) {
                    jrpc.execute('PRESTAZIONI.insert', [values], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;
                        this.btnDxA.enabled = false;
                        this.btnSxA.enabled = false;
                        this.btnPaA.enabled = false;
                        this.btnDxC.enabled = false;
                        this.btnSxC.enabled = false;
                        this.btnPaC.enabled = false;

                        WUX.showSuccess('Trattamento inserito con successo.');

                        this.selId = result[IPrestazione.sID];
                        this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('PRESTAZIONI.update', [values], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;
                        this.btnDxA.enabled = false;
                        this.btnSxA.enabled = false;
                        this.btnPaA.enabled = false;
                        this.btnDxC.enabled = false;
                        this.btnSxC.enabled = false;
                        this.btnPaC.enabled = false;

                        WUX.showSuccess('Trattamento aggiornato con successo.');

                        this.selId = result[IPrestazione.sID];
                        let selRows = this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            this.btnFind.trigger('click');
                        }
                        else {
                            let idx = selRows[0];
                            let records = this.tabResult.getState();
                            records[idx] = result;
                            records[idx][IPrestazione.sDESC_GRUPPO] = this.selGruppo.getProps();
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
                        this.tabSelA.setState([]);
                        this.tabAllA.clearSelection();
                        this.tabSelC.setState([]);
                        this.tabAllC.clearSelection();
                    }
                    else {
                        this.onSelect();
                    }
                    this.status = this.iSTATUS_VIEW;

                    this.fpDetail.enabled = false;
                    this.btnDxA.enabled = false;
                    this.btnSxA.enabled = false;
                    this.btnPaA.enabled = false;
                    this.btnDxC.enabled = false;
                    this.btnSxC.enabled = false;
                    this.btnPaC.enabled = false;

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
                if (!rd || !rd.length) return;
                let id = WUtil.getInt(rd[0], IPrestazione.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, (res: any) => {
                    if (!res) return;
                    jrpc.execute('PRESTAZIONI.delete', [id], (result) => {
                        this.btnFind.trigger('click');
                    });
                });
            });

            let rc = [
                ['Gruppo', IPrestazione.sDESC_GRUPPO, 's'],
                ['Descrizione', IPrestazione.sDESCRIZIONE, 's'],
                ['Durata', IPrestazione.sDURATA, 'i'],
                ['Tipo prezzo', IPrestazione.sTIPO_PREZZO, 's'],
                ['Prezzo Listino', IPrestazione.sPREZZO_LISTINO, 'c'],
                ['Sconto Ass.', IPrestazione.sSCONTO_ASS, 'c'],
                ['Sconto Perc.', IPrestazione.sSCONTO_PERC, 'i'],
                ['Prezzo Finale', IPrestazione.sPREZZO_FINALE, 'c'],
                ['Punti Coll.', IPrestazione.sPUNTI_COLL, 'i'],
                ['Pren. On Line', IPrestazione.sPREN_ONLINE, 'b']
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.css({ h: 220 });
            this.tabResult.types = WUtil.col(rc, 2);
            this.tabResult.exportFile = 'trattamenti';
            this.tabResult.onSelectionChanged((e: { element?: JQuery, selectedRowsData?: Array<any> }) => {

                this.onSelect();

            });

            this.tabSelA = new WUX.WDXTable(this.subId('tbs'), ['Codice', 'Descrizione'], [IAttrezzatura.sCODICE, IAttrezzatura.sDESCRIZIONE]);
            this.tabSelA.selectionMode = 'multiple';
            this.tabSelA.css({ h: 200 });
            this.tabSelA.widths = [100];

            this.tabAllA = new WUX.WDXTable(this.subId('tba'), ['Codice', 'Descrizione'], [IAttrezzatura.sCODICE, IAttrezzatura.sDESCRIZIONE]);
            this.tabAllA.selectionMode = 'multiple';
            this.tabAllA.css({ h: 200 });
            this.tabAllA.widths = [100];

            this.btnSxA = new WUX.WButton(this.subId('bba'), '', GUI.ICO.LEFT, WUX.BTN.PRIMARY, { p: '1px 6px 1px 6px' });
            this.btnSxA.tooltip = 'Aggiungi cabine';
            this.btnSxA.enabled = false;
            this.btnSxA.on('click', (e: JQueryEventObject) => {
                let dts = this.tabSelA.getState();
                if (!dts) dts = [];
                let srd = this.tabAllA.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare una o pi&ugrave; cabine dall\'elenco disponibile.');
                    return;
                }
                let scr = false;
                for (let i = 0; i < srd.length; i++) {
                    let p = srd[i];
                    let pid = p[IAttrezzatura.sID];
                    let f = false;
                    for (let j = 0; j < dts.length; j++) {
                        let s = dts[j];
                        let sid = s[IAttrezzatura.sID];
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
                this.tabSelA.setState(dts);
                if (scr) {
                    setTimeout(() => {
                        this.tabSelA.scrollTo(999999);
                    }, 250);
                }
            });

            this.btnDxA = new WUX.WButton(this.subId('bbd'), '', GUI.ICO.DELETE, WUX.BTN.DANGER, { p: '1px 7px 1px 7px' });
            this.btnDxA.tooltip = 'Rimuovi cabine';
            this.btnDxA.enabled = false;
            this.btnDxA.on('click', (e: JQueryEventObject) => {
                let dts = this.tabSelA.getState();
                if (!dts) dts = [];
                let srd = this.tabSelA.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare una o pi&ugrave; cabine dall\'elenco delle assegnate.');
                    return;
                }
                let cpy = [];
                for (let i = 0; i < dts.length; i++) {
                    let p = dts[i];
                    let pid = p[IAttrezzatura.sID];
                    let f = false;
                    for (let j = 0; j < srd.length; j++) {
                        let s = srd[j];
                        let sid = s[IAttrezzatura.sID];
                        if (sid == pid) {
                            f = true;
                            break;
                        }
                    }
                    if (!f) cpy.push(p);
                }
                this.tabSelA.setState(cpy);
            });
            this.btnCpA = new WUX.WButton(this.subId('bbc'), '', GUI.ICO.COPY, WUX.BTN.SECONDARY, { p: '1px 7px 1px 7px' });
            this.btnCpA.tooltip = 'Copia cabine';
            this.btnCpA.on('click', (e: JQueryEventObject) => {
                let items = this.tabSelA.getState()
                if (!items || !items.length) {
                    WUX.showSuccess('Nessun elemento selezionato');
                    return;
                }
                cp_attrz = items;
                WUX.showSuccess('Cabine copiate nella clipboard');
            });
            this.btnPaA = new WUX.WButton(this.subId('bbp'), '', GUI.ICO.PASTE, WUX.BTN.WARNING, { p: '1px 7px 1px 7px' });
            this.btnPaA.tooltip = 'Incolla cabine';
            this.btnPaA.enabled = false;
            this.btnPaA.on('click', (e: JQueryEventObject) => {
                if (!cp_attrz) {
                    WUX.showWarning('Non vi sono cabine nella clipboard');
                    return;
                }
                this.tabSelA.setState(cp_attrz);
            });

            this.tabSelC = new WUX.WDXTable(this.subId('tbsc'), ['Nome'], [ICollaboratore.sNOME]);
            this.tabSelC.selectionMode = 'multiple';
            this.tabSelC.css({ h: 200 });

            this.tabAllC = new WUX.WDXTable(this.subId('tbac'), ['Nome'], [ICollaboratore.sNOME]);
            this.tabAllC.selectionMode = 'multiple';
            this.tabAllC.css({ h: 200 });

            this.btnSxC = new WUX.WButton(this.subId('bbac'), '', GUI.ICO.LEFT, WUX.BTN.PRIMARY, { p: '1px 6px 1px 6px' });
            this.btnSxC.tooltip = 'Aggiungi collaboratore';
            this.btnSxC.enabled = false;
            this.btnSxC.on('click', (e: JQueryEventObject) => {
                let dts = this.tabSelC.getState();
                if (!dts) dts = [];
                let srd = this.tabAllC.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare uno o pi&ugrave; collaboratori dall\'elenco disponibile.');
                    return;
                }
                let scr = false;
                for (let i = 0; i < srd.length; i++) {
                    let p = srd[i];
                    let pid = p[ICollaboratore.sID];
                    let f = false;
                    for (let j = 0; j < dts.length; j++) {
                        let s = dts[j];
                        let sid = s[ICollaboratore.sID];
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
                this.tabSelC.setState(dts);
                if (scr) {
                    setTimeout(() => {
                        this.tabSelC.scrollTo(999999);
                    }, 250);
                }
            });

            this.btnDxC = new WUX.WButton(this.subId('bbdc'), '', GUI.ICO.DELETE, WUX.BTN.DANGER, { p: '1px 7px 1px 7px' });
            this.btnDxC.tooltip = 'Rimuovi collaboratori';
            this.btnDxC.enabled = false;
            this.btnDxC.on('click', (e: JQueryEventObject) => {
                let dts = this.tabSelC.getState();
                if (!dts) dts = [];
                let srd = this.tabSelC.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare una o pi&ugrave; cabine dall\'elenco delle assegnate.');
                    return;
                }
                let cpy = [];
                for (let i = 0; i < dts.length; i++) {
                    let p = dts[i];
                    let pid = p[IAttrezzatura.sID];
                    let f = false;
                    for (let j = 0; j < srd.length; j++) {
                        let s = srd[j];
                        let sid = s[IAttrezzatura.sID];
                        if (sid == pid) {
                            f = true;
                            break;
                        }
                    }
                    if (!f) cpy.push(p);
                }
                this.tabSelC.setState(cpy);
            });
            this.btnCpC = new WUX.WButton(this.subId('bbcc'), '', GUI.ICO.COPY, WUX.BTN.SECONDARY, { p: '1px 7px 1px 7px' });
            this.btnCpC.tooltip = 'Copia collaboratori';
            this.btnCpC.on('click', (e: JQueryEventObject) => {
                let items = this.tabSelC.getState()
                if (!items || !items.length) {
                    WUX.showSuccess('Nessun elemento selezionato');
                    return;
                }
                cp_collb = items;
                WUX.showSuccess('Collaboratori copiati nella clipboard');
            });
            this.btnPaC = new WUX.WButton(this.subId('bbpc'), '', GUI.ICO.PASTE, WUX.BTN.WARNING, { p: '1px 7px 1px 7px' });
            this.btnPaC.tooltip = 'Incolla collaboratori';
            this.btnPaC.enabled = false;
            this.btnPaC.on('click', (e: JQueryEventObject) => {
                if (!cp_collb) {
                    WUX.showWarning('Non vi sono collaboratori nella clipboard');
                    return;
                }
                this.tabSelC.setState(cp_collb);
            });

            this.cntActions = new CFTableActions('ta');
            this.cntActions.left.add(this.btnOpen);
            this.cntActions.left.add(this.btnDelete);
            this.cntActions.left.add(this.btnSave);
            this.cntActions.left.add(this.btnCancel);
            this.cntActions.right.add(this.btnNew);

            this.cntActions2 = new CFTableActions('ta2');
            this.cntActions2.left.add(this.btnOpen2);
            this.cntActions2.left.add(this.btnDelete2);
            this.cntActions2.left.add(this.btnSave2);
            this.cntActions2.left.add(this.btnCancel2);

            this.tagsFilter = new WUX.WTags('tf');

            let cntTab0A = new WUX.WContainer(this.subId('ct0a'), '');
            cntTab0A
                .addRow()
                .addCol('11', { p: 0 })
                .add(this.tabSelA)
                .addCol('1', { p: 0 })
                .addStack(WUX.CSS.STACK_BTNS, this.btnSxA, this.btnDxA, this.btnCpA, this.btnPaA);

            let cntTab0C = new WUX.WContainer(this.subId('ct0c'), '');
            cntTab0C
                .addRow()
                .addCol('11', { p: 0 })
                .add(this.tabSelC)
                .addCol('1', { p: 0 })
                .addStack(WUX.CSS.STACK_BTNS, this.btnSxC, this.btnDxC, this.btnCpC, this.btnPaC);

            this.tcoDetail = new WUX.WTab('tcod');
            this.tcoDetail.addTab('Anagrafica', WUX.WIcon.ADDRESS_CARD)
                .addRow()
                .addCol('12', { h: 260 })
                .add(this.fpDetail);

            this.tcoDetail.addTab('Cabine', WUX.WIcon.COG)
                .addRow()
                .addCol('6').section('Assegnate', { h: 260 })
                .add(cntTab0A)
                .addCol('6').section('Disponibili', { h: 260 })
                .add(this.tabAllA);

            this.tcoDetail.addTab('Collaboratori', WUX.WIcon.USERS)
                .addRow()
                .addCol('6').section('Assegnati', { h: 260 })
                .add(cntTab0C)
                .addCol('6').section('Disponibili', { h: 260 })
                .add(this.tabAllC);

            this.tcoDetail.on('statechange', (e: WUX.WEvent) => {
                let itab = this.tcoDetail.getState();
                switch (itab) {
                    case 0:
                        break;
                    case 1:
                        this.tabSelA.refresh();
                        this.tabAllA.refresh();
                        break;
                    case 2:
                        this.tabSelC.refresh();
                        this.tabAllC.refresh();
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

            let id = WUtil.getNumber(item, IPrestazione.sID);
            if (!id) return;

            this.fpDetail.clear();
            this.tabSelA.setState([]);
            this.tabAllA.clearSelection();
            this.tabAllA.clearFilter();
            this.tabSelC.setState([]);
            this.tabAllC.clearSelection();
            this.tabAllC.clearFilter();

            if (this.status == this.iSTATUS_EDITING) {
                WUX.showWarning('Modifiche annullate');
                this.fpDetail.enabled = false;
                this.btnDxA.enabled = false;
                this.btnSxA.enabled = false;
                this.btnPaA.enabled = false;
                this.btnDxC.enabled = false;
                this.btnSxC.enabled = false;
                this.btnPaC.enabled = false;
            }

            let idf = WUtil.toNumber(this.selFar.getState(), 0);
            jrpc.execute('PRESTAZIONI.read', [id, idf], (result) => {
                this.fpDetail.setState(result);
                this.tabSelA.setState(WUtil.getArray(result, IPrestazione.sATTREZZATURE));
                this.tabSelC.setState(WUtil.getArray(result, IPrestazione.sCOLLABORATORI));
                this.status = this.iSTATUS_VIEW;
            });
        }

        protected calcPrezzi() {
            let pl = WUtil.toNumber(this.fpDetail.getValue(IPrestazione.sPREZZO_LISTINO));
            let sa = WUtil.toNumber(this.fpDetail.getValue(IPrestazione.sSCONTO_ASS));
            let sp = WUtil.toNumber(this.fpDetail.getValue(IPrestazione.sSCONTO_PERC));
            let pf = 0;
            if (sa) {
                pf = pl - sa;
            }
            else {
                pf = CFUtil.scontato(pl, sp);
            }
            if (pf < 0) pf = 0;
            let pt = Math.floor(Math.floor(pf / 5) * 2.5);
            this.fpDetail.setValue(IPrestazione.sPREZZO_FINALE, WUX.formatCurr(pf));
            this.fpDetail.setValue(IPrestazione.sPUNTI_COLL, pt);
        }

        protected componentDidMount(): void {
            let idf: number = 0;
            if (strutture && strutture.length) {
                idf = strutture[0].id;
            }
            if (idf) this.selFar.setState(idf);
        }
    }
}