namespace GUI {

    import WUtil = WUX.WUtil;

    export class GUICalendario extends WUX.WComponent {
        protected container: WUX.WContainer;

        protected planning: CFPlanning;
        protected navCal: CFNavCalendar;
        protected txtSrc: WUX.WInput;
        protected lnkPrn: WUX.WLink;
        protected lnkTms: WUX.WLink;
        protected lnkNew: WUX.WLink;
        protected dlgOrariPers: DlgOrariPers;
        protected winBack: WUX.WWindow;

        constructor(id?: string) {
            super(id ? id : '*', 'GUICalendario');

            this.dlgOrariPers = new DlgOrariPers(this.subId('dlgop'));
            this.dlgOrariPers.onHiddenModal((e: JQueryEventObject) => {
                this.planning.resumeSync();
                if (!this.dlgOrariPers.ok) return;

                let varz = WUtil.getObject(this.dlgOrariPers.getState(), ICalendario.sORARI);

                let date = this.navCal.getState();
                if (!date) date = new Date();
                let idf = this.navCal.getProps();

                // Esecuzione controllata (viene richiesta la password dell'utente desk)
                // Superato il controllo viene aggiunto come ultimo parametro il nome utente desk.
                chkExecute('CALENDARIO.saveVariazioni', [idf, date, varz], (result) => {
                // jrpc.execute('CALENDARIO.saveVariazioni', [idf, date, varz], (result) => {

                    this.planning.autoScroll = true;
                    this.planning.setState(result);
                    this.txtSrc.focus();

                });
            });

            this.winBack = new WUX.WWindow(this.subId('wb'));
            this.winBack.width = 160;
            this.winBack.gap = 16;
            this.winBack.background = 'rgba(0,0,0,.8)';
            this.winBack.color = '#ffffff';
            this.winBack.body.add('<div style="padding:14px 14px 14px 14px;font-weight:bold;cursor:pointer;">' + WUX.buildIcon(WUX.WIcon.ARROW_LEFT) + ' Torna ad oggi</div>');
            this.winBack.on('click', (e: JQueryEventObject) => {
                this.navCal.setState(new Date());
                this.winBack.hide();
            });
        }

        protected render() {
            this.navCal = new CFNavCalendar(this.subId('cal'));
            this.navCal.onClickPrev((e: JQueryEventObject) => {
                let date = this.navCal.getState();
                let idf = this.navCal.getProps();

                if (this.navCal.isToday()) {
                    this.winBack.hide();
                }
                else {
                    this.winBack.show();
                }

                let filter = {};
                filter[ICalendario.sDATA] = date;
                filter[ICalendario.sID_FAR] = idf;
                jrpc.execute('CALENDARIO.getPlanning', [filter], (result) => {

                    this.planning.autoScroll = true;
                    this.planning.setState(result);
                    this.txtSrc.focus();

                });
            });
            this.navCal.onClickNext((e: JQueryEventObject) => {
                let date = this.navCal.getState();
                let idf = this.navCal.getProps();

                if (this.navCal.isToday()) {
                    this.winBack.hide();
                }
                else {
                    this.winBack.show();
                }

                let filter = {};
                filter[ICalendario.sDATA] = date;
                filter[ICalendario.sID_FAR] = idf;
                jrpc.execute('CALENDARIO.getPlanning', [filter], (result) => {

                    this.planning.autoScroll = true;
                    this.planning.setState(result);
                    this.txtSrc.focus();

                });
            });
            this.navCal.on('statechange', (e: WUX.WEvent) => {
                let date = this.navCal.getState();
                let idf = this.navCal.getProps();

                if (this.navCal.isToday()) {
                    this.winBack.hide();
                }
                else {
                    this.winBack.show();
                }

                let filter = {};
                filter[ICalendario.sDATA] = date;
                filter[ICalendario.sID_FAR] = idf;
                jrpc.execute('CALENDARIO.getPlanning', [filter], (result) => {

                    this.planning.autoScroll = true;
                    this.planning.setState(result);
                    this.txtSrc.focus();

                });
            });
            this.navCal.on('propschange', (e: WUX.WEvent) => {
                let date = this.navCal.getState();
                let idf = this.navCal.getProps();

                if (this.navCal.isToday()) {
                    this.winBack.hide();
                }
                else {
                    this.winBack.show();
                }

                let filter = {};
                filter[ICalendario.sDATA] = date;
                filter[ICalendario.sID_FAR] = idf;
                jrpc.execute('CALENDARIO.getPlanning', [filter], (result) => {

                    this.planning.autoScroll = true;
                    this.planning.setState(result);
                    this.txtSrc.focus();

                });
            });

            this.txtSrc = new WUX.WInput('ts', WUX.WInputType.Text);
            this.txtSrc.css({ f: 10, w: 50 });
            this.txtSrc.tooltip = 'Ricerca veloce';
            this.txtSrc.placeHolder = 'Cerca';
            this.txtSrc.onEnterPressed((e: WUX.WEvent) => {
                let s = this.txtSrc.getState();
                s = s ? s.trim() : '';

                this.txtSrc.setState('');

                if (s == '' || s == '?' || s == '#' || s == '#?' || s == '@' || s == '@?') {
                    let date = this.navCal.getState();
                    let idf = this.navCal.getProps();

                    if (this.navCal.isToday()) {
                        this.winBack.hide();
                    }
                    else {
                        this.winBack.show();
                    }

                    let filter = {};
                    filter[ICalendario.sDATA] = date;
                    filter[ICalendario.sID_FAR] = idf;
                    switch (s) {
                        case '?':
                            filter[ICalendario.sNO_APPUNTAMENTI] = true;
                            break;
                        case '#':
                            filter[ICalendario.sRIGENERA] = true;
                            break;
                        case '#?':
                            filter[ICalendario.sRIGENERA] = true;
                            filter[ICalendario.sNO_APPUNTAMENTI] = true;
                            break;
                        case '@':
                            filter[ICalendario.sAGGIORNA] = true;
                            break;
                        case '@?':
                            filter[ICalendario.sAGGIORNA] = true;
                            filter[ICalendario.sNO_APPUNTAMENTI] = true;
                            break;
                    }
                    jrpc.execute('CALENDARIO.getPlanning', [filter], (result) => {
                        this.planning.autoScroll = true;
                        this.planning.setState(result);
                        this.txtSrc.focus();
                    });
                    return;
                }

                let r = this.planning.mark(s);
                if (r && r.length) {
                    let s = '';
                    for (let i = 0; i < r.length; i++) {
                        s += '<strong>' + r[i].descCliente + '</strong> alle ore <strong>' + r[i].oraApp + '</strong><br>';
                    }
                    WUX.showSuccess('Prenotazioni trovate:<br>' + s);
                }
                else {
                    WUX.showWarning('Nessuna prenotazione trovata.');
                }
            });
            this.lnkPrn = new WUX.WLink(this.subId('lpr'), 'Prenotazioni', WUX.WIcon.FILE_TEXT_O);
            this.lnkPrn.on('click', (e: JQueryEventObject) => {
                if (isDevMode()) {
                    WUX.openURL('index.html?c=GUIPrenotazioni&d=' + WUtil.toNumber(this.navCal.getState()) + '&f=' + this.navCal.getProps(), true, true);
                }
                else {
                    WUX.openURL('prenotazioni?d=' + WUtil.toNumber(this.navCal.getState()) + '&f=' + this.navCal.getProps(), true, true);
                }
            });
            this.lnkTms = new WUX.WLink(this.subId('lts'), 'Orari', WUX.WIcon.CLOCK_O);
            this.lnkTms.on('click', (e: JQueryEventObject) => {
                let date = this.navCal.getState();
                if (!this.navCal.isToday()) this.winBack.show();
                let idf = this.navCal.getProps();
                
                this.planning.stopSync();
                
                let filter = {};
                filter[ICalendario.sDATA] = date;
                filter[ICalendario.sID_FAR] = idf;
                jrpc.execute('CALENDARIO.getTimeTable', [filter], (result) => {

                    this.dlgOrariPers.setProps(date);
                    this.dlgOrariPers.setState(result);
                    this.dlgOrariPers.show();

                });
            });
            this.lnkNew = new WUX.WLink(this.subId('ltn'), 'Nuovo', WUX.WIcon.CALENDAR);
            this.lnkNew.on('click', (e: JQueryEventObject) => {

                this.planning.newApp();

            });

            this.planning = new CFPlanning(this.subId('pln'));
            this.planning.navCal = this.navCal;

            this.container = new WUX.WContainer();
            this.container
                .addRow()
                .addCol('2', { bg: 'white', a: 'center', pt: 10, pb: 7 })
                .add(this.txtSrc)
                .addSpan(16)
                .add(this.lnkPrn)
                .addCol('8')
                .add(this.navCal)
                .addCol('2', { bg: 'white', a: 'center', pt: 10, pb: 10 })
                .add(isBookDesk() ? '' : this.lnkTms)
                .addSpan(16)
                .add(this.lnkNew)
                .addRow()
                .add(this.planning);

            return this.container;
        }

        protected componentDidMount(): void {
            let date = this.navCal.getState();
            if (!date) date = new Date();
            let idf = this.navCal.getProps();
            let filter = {};
            filter[ICalendario.sDATA] = date;
            filter[ICalendario.sID_FAR] = idf;
            jrpc.execute('CALENDARIO.getPlanning', [ filter ], (result) => {

                this.planning.autoScroll = true;
                this.planning.setState(result);
                this.txtSrc.focus();

                this.planning.startSync();
            });
        }
    }

    export class GUIChiusure extends WUX.WComponent {
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
        // Azioni base 2
        protected cntActions2: AppTableActions;
        protected btnOpen2: WUX.WButton;
        protected btnSave2: WUX.WButton;
        protected btnCancel2: WUX.WButton;
        protected btnDelete2: WUX.WButton;
        // Risultato
        protected tabResult: WUX.WDXTable;
        protected selId: any;
        // Dettaglio
        protected fpDetail: WUX.WFormPanel;
        // Stati
        protected isNew: boolean;
        protected status: number;
        readonly iSTATUS_STARTUP = 0;
        readonly iSTATUS_VIEW = 1;
        readonly iSTATUS_EDITING = 2;

        constructor(id?: string) {
            super(id ? id : '*', 'GUIChiusure');
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
                jrpc.execute('CHIUSURE.find', [AppUtil.putUserInfo(this.fpFilter.getState())], (result) => {
                    this.tabResult.setState(result);

                    this.fpDetail.clear();
                    this.status = this.iSTATUS_STARTUP;

                    if (this.selId) {
                        let idx = WUtil.indexOf(result, IChiusura.sID, this.selId);
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

            this.selFar = new CFSelectStruture();
            this.selFar.on('statechange', (e: WUX.WEvent) => {
                this.tabResult.setState([]);
                this.fpDetail.clear();
            });

            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent(IChiusura.sID_FAR, 'Struttura', this.selFar);
            this.fpFilter.addTextField(IChiusura.sDESCRIZIONE, 'Descrizione');

            this.fpFilter.setMandatory(IChiusura.sID_FAR);

            this.fpDetail = new WUX.WFormPanel(this.subId('fpd'));
            this.fpDetail.addRow();
            this.fpDetail.addDateField(IChiusura.sDATA, 'Data');
            this.fpDetail.addTextField(IChiusura.sDESCRIZIONE, 'Descrizione');
            this.fpDetail.addBooleanField(IChiusura.sANNUALE, 'Annuale');
            this.fpDetail.addInternalField(IChiusura.sID);
            this.fpDetail.enabled = false;

            this.fpDetail.setSpanField(IChiusura.sDESCRIZIONE, 2);

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
                values[IChiusura.sID_FAR] = idf;

                if (this.isNew) {
                    jrpc.execute('CHIUSURE.insert', [AppUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;

                        this.selId = result[IChiusura.sID];
                        this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('CHIUSURE.update', [AppUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;

                        this.selId = result[IChiusura.sID];
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
                let id = WUtil.getInt(rd[0], IChiusura.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, (res: any) => {
                    if (!res) return;
                    jrpc.execute('CHIUSURE.delete', [id], (result) => {
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
                values[IChiusura.sID_FAR] = idf;

                if (this.isNew) {
                    jrpc.execute('CHIUSURE.insert', [AppUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;

                        this.selId = result[IChiusura.sID];
                        this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('CHIUSURE.update', [AppUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;

                        this.selId = result[IChiusura.sID];
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
                    }
                    else {
                        this.onSelect();
                    }
                    this.status = this.iSTATUS_VIEW;

                    this.fpDetail.enabled = false;

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
                let id = WUtil.getInt(rd[0], IChiusura.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, (res: any) => {
                    if (!res) return;
                    jrpc.execute('CHIUSURE.delete', [id], (result) => {
                        this.btnFind.trigger('click');
                    });
                });
            });

            let rc = [
                ['Data chiusura', IChiusura.sDATA, 'd'],
                ['Descrizione', IChiusura.sDESCRIZIONE, 's'],
                ['Annuale', IChiusura.sANNUALE, 'b'],
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.types = WUtil.col(rc, 2);
            this.tabResult.css({ h: 220 });
            this.tabResult.widths = [150];
            this.tabResult.onSelectionChanged((e: { element?: JQuery, selectedRowsData?: Array<any> }) => {

                this.onSelect();

            });

            this.cntActions = new AppTableActions('ta');
            this.cntActions.left.add(this.btnOpen);
            this.cntActions.left.add(this.btnDelete);
            this.cntActions.left.add(this.btnSave);
            this.cntActions.left.add(this.btnCancel);
            this.cntActions.right.add(this.btnNew);

            this.cntActions2 = new AppTableActions('ta2');
            this.cntActions2.left.add(this.btnOpen2);
            this.cntActions2.left.add(this.btnDelete2);
            this.cntActions2.left.add(this.btnSave2);
            this.cntActions2.left.add(this.btnCancel2);

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
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, this.cntActions, this.tabResult, this.cntActions2)
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

        protected onSelect(): void {
            var item = WUtil.getItem(this.tabResult.getSelectedRowsData(), 0);
            if (!item) return;

            let id = WUtil.getNumber(item, IChiusura.sID);
            if (!id) return;

            this.fpDetail.clear();

            if (this.status == this.iSTATUS_EDITING) {
                WUX.showWarning('Modifiche annullate');
                this.fpDetail.enabled = false;
            }

            jrpc.execute('CHIUSURE.read', [id], (result) => {
                this.fpDetail.setState(result);
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