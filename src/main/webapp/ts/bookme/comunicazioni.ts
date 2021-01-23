namespace GUI {

    import WUtil = WUX.WUtil;

    export class GUIComunicazioni extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected tagsFilter: WUX.WTags;
        protected fpFilter: WUX.WFormPanel;
        protected selFar: CFSelectStruture;
        protected btnFind: WUX.WButton;
        protected btnReset: WUX.WButton;
        // Nuovo
        protected btnNew: WUX.WButton;
        // Azioni base
        protected cntActions: AppTableActions;
        protected btnOpen: WUX.WButton;
        protected btnSave: WUX.WButton;
        protected btnCancel: WUX.WButton;
        protected btnDelete: WUX.WButton;
        // Risultato
        protected tabResult: WUX.WDXTable;
        protected selId: any;
        // Dettaglio
        protected tcoDetail: WUX.WTab;
        protected fpDetail: WUX.WFormPanel;
        protected tabList: WUX.WDXTable;
        protected btnRemOne: WUX.WButton;
        protected btnRemAll: WUX.WButton;
        // Stati
        protected isNew: boolean;
        protected status: number;
        readonly iSTATUS_STARTUP = 0;
        readonly iSTATUS_VIEW = 1;
        readonly iSTATUS_EDITING = 2;

        constructor(id?: string) {
            super(id ? id : '*', 'GUIComunicazioni');
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
                jrpc.execute('COMUNICAZIONI.find', [AppUtil.putUserInfo(this.fpFilter.getState())], (result) => {
                    this.tabResult.setState(result);

                    this.fpDetail.clear();
                    this.tabList.setState([]);
                    this.status = this.iSTATUS_STARTUP;

                    if (this.selId) {
                        let idx = WUtil.indexOf(result, IComunicazione.sID, this.selId);
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
                this.tabList.setState([]);
                this.status = this.iSTATUS_STARTUP;
            });

            this.selFar = new CFSelectStruture();
            this.selFar.on('statechange', (e: WUX.WEvent) => {
                this.tabResult.setState([]);
                this.fpDetail.clear();
            });

            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent(IComunicazione.sID_FAR, 'Struttura', this.selFar);
            this.fpFilter.addTextField(IComunicazione.sOGGETTO, 'Oggetto');

            this.fpFilter.setMandatory(IComunicazione.sID_FAR);

            this.fpDetail = new WUX.WFormPanel(this.subId('fpd'));
            this.fpDetail.addRow();
            this.fpDetail.addTextField(IComunicazione.sOGGETTO, 'Oggetto');
            this.fpDetail.addComponent(IComunicazione.sMEZZO, 'Mezzo', new CFSelectTipoCom());
            this.fpDetail.addRow();
            this.fpDetail.addComponent(IComunicazione.sMESSAGGIO, 'Messaggio', new WUX.WTextArea());
            this.fpDetail.addInternalField(IComunicazione.sID);
            this.fpDetail.enabled = false;

            this.fpDetail.setSpanField(IComunicazione.sOGGETTO, 3);

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
                this.tabList.setState([]);

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
                let msg = WUtil.getString(values, IComunicazione.sMESSAGGIO);
                if (!msg || !msg.length) {
                    WUX.showWarning('Messaggio non specificato.');
                    return;
                }
                if (msg.length > 160) {
                    WUX.showWarning('Il messaggio ha ' + msg.length + ' caratteri (massimo consentito 160).');
                    return;
                }
                values[IComunicazione.sID_FAR] = idf;
                if (this.isNew) {
                    jrpc.execute('COMUNICAZIONI.insert', [AppUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;
                        this.fpDetail.enabled = false;
                        this.selId = result[IComunicazione.sID];
                        this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('COMUNICAZIONI.update', [AppUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;
                        this.fpDetail.enabled = false;
                        this.selId = result[IComunicazione.sID];
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
                let id = WUtil.getInt(rd[0], IComunicazione.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, (res: any) => {
                    if (!res) return;
                    jrpc.execute('COMUNICAZIONI.delete', [id], (result) => {
                        this.btnFind.trigger('click');
                    });
                });
            });

            let rc = [
                ['Oggetto', IComunicazione.sOGGETTO]
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.css({ h: 180 });
            this.tabResult.onSelectionChanged((e: { element?: JQuery, selectedRowsData?: Array<any> }) => {

                this.onSelect();

            });

            this.tabList = new WUX.WDXTable(this.subId('tbv'), ['Prog.', 'Cognome', 'Nome', 'Telefono'], [ICliente.sREPUTAZIONE, ICliente.sCOGNOME, ICliente.sNOME, ICliente.sTELEFONO1]);
            this.tabList.selectionMode = 'single';
            this.tabList.css({ h: 250 });

            this.btnRemOne = new WUX.WButton(this.subId('bro'), GUI.TXT.REMOVE, '', WUX.BTN.SM_DANGER);
            this.btnRemOne.on('click', (e: JQueryEventObject) => {
                var item = WUtil.getItem(this.tabResult.getSelectedRowsData(), 0);
                if (!item) return;
                let idc = WUtil.getNumber(item, ICollaboratore.sID);
                if (!idc) {
                    WUX.showWarning('Comunicazione non selezionata.');
                    return;
                }
                let sr = this.tabList.getSelectedRows();
                let srd = this.tabList.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare il cliente da rimuovere dalla lista di comunicazione');
                    return;
                }
                let idq = WUtil.getNumber(srd[0], 'id');
                if (!idq) {
                    WUX.showWarning('Riferimento al cliente assente');
                    return;
                }
                jrpc.execute('COMUNICAZIONI.remove', [idc, idq], (result) => {
                    if (!result) {
                        WUX.showWarning('Cliente NON rimosso dalla lista di comunicazione.');
                        return;
                    }
                    WUX.showSuccess('Cliente rimosso dalla lista di comunicazione.');
                    let q = this.tabList.getState();
                    q.splice(sr[0], 1);
                    this.tabList.setState(q);
                });
            });
            this.btnRemAll = new WUX.WButton(this.subId('bra'), GUI.TXT.REMOVE_ALL, '', WUX.BTN.SM_DANGER);
            this.btnRemAll.on('click', (e: JQueryEventObject) => {
                var item = WUtil.getItem(this.tabResult.getSelectedRowsData(), 0);
                if (!item) return;
                let idc = WUtil.getNumber(item, ICollaboratore.sID);
                if (!idc) {
                    WUX.showWarning('Comunicazione non selezionata.');
                    return;
                }
                WUX.confirm('Si vuole eliminare tutta la lista di comunicazione?', (res) => {
                    if (!res) return;
                    jrpc.execute('COMUNICAZIONI.removeAll', [idc], (result) => {
                        if (!result) {
                            WUX.showWarning('Lista di comunicazione non aggiornata.');
                            return;
                        }
                        WUX.showSuccess('Lista di comunicazione svuotata.');
                        this.tabList.setState([]);
                    });
                });
            });

            this.cntActions = new AppTableActions('ta');
            this.cntActions.left.add(this.btnOpen);
            this.cntActions.left.add(this.btnDelete);
            this.cntActions.left.add(this.btnSave);
            this.cntActions.left.add(this.btnCancel);
            this.cntActions.right.add(this.btnNew);

            this.tcoDetail = new WUX.WTab('tcod');
            this.tcoDetail.addTab('Comunicazione', WUX.WIcon.ADDRESS_CARD)
                .addRow()
                .addCol('12', { h: 300 })
                .add(this.fpDetail);

            this.tcoDetail.addTab('Lista clienti', WUX.WIcon.USERS)
                .addRow()
                .addCol('11', { h: 300 })
                .add(this.tabList)
                .addCol('1', { h: 300 })
                .addStack(WUX.CSS.STACK_BTNS, this.btnRemOne, this.btnRemAll);

            this.tcoDetail.on('statechange', (e: WUX.WEvent) => {
                let itab = this.tcoDetail.getState();
                switch (itab) {
                    case 0:
                        break;
                    case 1:
                        this.tabList.repaint();
                        break;
                }
            });

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

            let id = WUtil.getNumber(item, IComunicazione.sID);
            if (!id) return;

            this.fpDetail.clear();
            this.fpDetail.setState(item);

            if (this.status == this.iSTATUS_EDITING) {
                WUX.showWarning('Modifiche annullate');
                this.fpDetail.enabled = false;
            }

            jrpc.execute('COMUNICAZIONI.read', [id], (result) => {
                this.fpDetail.setState(result);
                this.tabList.setState(WUtil.getArray(result, IComunicazione.sCODA));
                this.status = this.iSTATUS_VIEW;
            });
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