namespace GUI {

    import WUtil = WUX.WUtil;

    export class DlgDataCal extends WUX.WDialog<string, Date> {
        cal: WUX.WDXCalendar;

        constructor(id: string) {
            super(id, 'DlgDataCal');

            this.title = 'Calendario';

            this.cal = new WUX.WDXCalendar(this.subId('cal'));
            this.cal.on('statechange', (e: WUX.WEvent) => {
                let dsel = this.cal.getState();
                if (WUtil.isSameDate(dsel, this.state)) return;
                setTimeout(() => { if (this.btnOK) this.btnOK.trigger('click'); }, 100);
            });
            //this.cal.onDoubleClick((e: { element?: JQuery }) => {
            //    setTimeout(() => { if (this.btnOK) this.btnOK.trigger('click'); }, 100);
            //});
            // Consente di 'centrare' il div relativo al calendario
            this.cal.style = 'margin:auto;';

            this.body
                .addRow()
                .addCol('12', { a: 'center' })
                .add(this.cal);
        }

        protected updateState(nextState: Date): void {
            super.updateState(nextState);
            this.cal.setState(this.state);
        }

        getState(): Date {
            if (this.cal) {
                let selDate = this.cal.getState();
                if (selDate) this.state = selDate;
            }
            return this.state;
        }

        protected componentDidMount(): void {
            super.componentDidMount();
            let calw = this.cal.getRoot().width();
            if (calw < 400) calw = 400;
            this.cntMain.css({ w: calw });
        }
    }

    export class DlgSMSText extends WUX.WDialog<string, string> {
        protected tarea: WUX.WTextArea;

        constructor(id: string) {
            super(id, 'DlgSMSText');

            this.title = 'Testo SMS';
            
            this.tarea = new WUX.WTextArea(this.subId('ta'), 5);

            this.body
                .addRow()
                .addCol('12', { a: 'center' })
                .add(this.tarea);
        }

        protected updateState(nextState: string): void {
            super.updateState(nextState);
            if (this.tarea) this.tarea.setState(this.state);
        }

        getState(): string {
            if (this.tarea) this.state = this.tarea.getState();
            return this.state;
        }

        protected onClickOk(): boolean {
            let text = this.tarea.getState();
            if (!text) {
                WUX.showWarning('Testo del messaggio non valido.');
                return false;
            }
            text = text.trim();
            if (text.length < 2) {
                WUX.showWarning('Testo non significativo.');
                return false;
            }
            if (text.length > 160) {
                WUX.showWarning('Il testo supera 160 caratteri.');
                return false;
            }
            return true;
        }

        protected onShown() {
            this.tarea.focus();
        }

        protected componentDidMount(): void {
            super.componentDidMount();
            if (this.tarea) this.tarea.setState(this.state);
            this.cntMain.css({ w: 400 });
        }
    }

    export class DlgCheckDesk extends WUX.WDialog<string, string> {
        protected inp: WUX.WInput;

        constructor(id: string) {
            super(id, 'DlgCheckDesk');

            this.title = 'Controllo Desk';

            this.inp = new WUX.WInput(this.subId('icud'), WUX.WInputType.Password);
            this.inp.css({ w: '100%' });
            this.inp.onEnterPressed((e: WUX.WEvent) => {
                if (this.onClickOk()) {
                    this.ok = true;
                    this.cancel = false;
                    this.root.modal('hide');
                }
            });

            this.body
                .addRow()
                .addCol('12')
                .add(this.inp);
        }

        protected updateState(nextState: string): void {
            super.updateState(nextState);
            if (this.inp) this.inp.setState(this.state);
        }

        getState(): string {
            if (this.inp) this.state = this.inp.getState();
            return this.state;
        }

        protected onClickOk(): boolean {
            let text = this.inp.getState();
            if (!text) {
                WUX.showWarning('Password non valida.');
                return false;
            }
            return true;
        }

        protected onShown() {
            this.inp.setState('');
            this.inp.focus();
        }

        protected componentDidMount(): void {
            super.componentDidMount();
            if (this.inp) this.inp.setState(this.state);
            this.cntMain.css({ w: 400 });
        }
    }

    export class DlgAppPag extends WUX.WDialog<any[], any> {
        protected table: WUX.WDXTable;
        protected fp: WUX.WFormPanel;
        protected selPag: CFSelectAppTipoPag;
        protected impPag: number;

        constructor(id: string) {
            super(id, 'DlgAppPag');

            this.title = 'Registrazione pagamento';

            let sc = [
                ['Trattamento', IPrenotazione.sDESC_PREST, 's'],
                ['Collaboratore', IPrenotazione.sDESC_COLL, 's'],
                ['Note', IPrenotazione.sNOTE, 's'],
                ['Causale', IPrenotazione.sCAUSALE, 's'],
                ['Coupon', IPrenotazione.sCOD_COUPON, 's'],
                ['Pagato', IPrenotazione.sPAGATO, 'b'],
                ['Prezzo', IPrenotazione.sPREZZO_FINALE, 'c']
            ];

            this.table = new WUX.WDXTable(this.subId('tap'), WUtil.col(sc, 0), WUtil.col(sc, 1));
            this.table.selectionMode = "multiple"
            this.table.types = WUtil.col(sc, 2);
            this.table.css({ h: 200, f: 10 });
            this.table.onSelectionChanged((e: { element?: JQuery, selectedRowsData?: Array<any>, currentSelectedRowKeys?: Array<any>, currentDeselectedRowKeys?: Array<any> }) => {
                let srd = this.table.getSelectedRowsData();
                if (!srd) srd = [];
                let s = 0;
                let c = '';
                for (let i = 0; i < srd.length; i++) {
                    s += WUtil.getNumber(srd[i], IPrenotazione.sPREZZO_FINALE);
                    let x = WUtil.getString(srd[i], IPrenotazione.sCOD_COUPON);
                    if (!x) continue;
                    c += c ? ',' + x : x;
                }

                this.fp.setValue(IPrenotazione.sPREZZO_FINALE, s);
                if (this.impPag) {
                    if (this.fp.isBlank(IPrenotazione.sIMP_PAGATO)) {
                        this.fp.setValue(IPrenotazione.sIMP_PAGATO, s);
                    }
                    else {
                        this.fp.setValue(IPrenotazione.sIMP_PAGATO, this.impPag);
                    }
                }
                else {
                    this.fp.setValue(IPrenotazione.sIMP_PAGATO, s);
                }
                if (c) this.fp.setValue(IPrenotazione.sCOD_COUPON, c);

                setTimeout(() => {
                    this.fp.focusOn(IPrenotazione.sIMP_PAGATO);
                }, 200);
            });

            this.selPag = new CFSelectAppTipoPag();

            let ln = new WUX.WLabel('');
            ln.css({ f: 14, fw: 'bold', d: 'block', pt: 8, pb: 8 }, WUX.CSS.LABEL_NOTICE);

            this.fp = new WUX.WFormPanel(this.subId('fp'));
            this.fp.addRow();
            this.fp.addComponent(IPrenotazione.sNOTE_CLIENTE, 'Note cliente', ln);
            this.fp.addRow();
            this.fp.addTextField(IPrenotazione.sCOD_COUPON, 'Codici Coupon <small>(separare con spazio o virgola)</small>');
            this.fp.addComponent(IPrenotazione.sTIPO_PAG, 'Tipo pagamento', this.selPag);
            this.fp.addRow();
            this.fp.addTextField(IPrenotazione.sCAUSALE, 'Causale');
            this.fp.addCurrencyField(IPrenotazione.sPREZZO_FINALE, 'Totale &euro;', true);
            this.fp.addCurrencyField(IPrenotazione.sIMP_PAGATO, 'Pagato &euro;');

            this.fp.setSpanField(IPrenotazione.sCAUSALE, 2);
            this.fp.setMandatory(IPrenotazione.sTIPO_PAG, IPrenotazione.sIMP_PAGATO);

            this.fp.onEnterPressed((e: WUX.WEvent) => {
                if (e.data == IPrenotazione.sCOD_COUPON) {
                    if (!this.fp.isBlank(IPrenotazione.sCOD_COUPON)) {
                        this.fp.setValue(IPrenotazione.sTIPO_PAG, 'CPN');
                        this.fp.focusOn(IPrenotazione.sIMP_PAGATO);
                    }
                    else {
                        let srd = this.table.getSelectedRowsData();
                        if (!srd) srd = [];
                        let c = '';
                        for (let i = 0; i < srd.length; i++) {
                            let x = WUtil.getString(srd[i], IPrenotazione.sCOD_COUPON);
                            if (!x) continue;
                            c += c ? ',' + x : x;
                        }
                        if (c) {
                            this.fp.setValue(IPrenotazione.sCOD_COUPON, c);
                            this.fp.setValue(IPrenotazione.sTIPO_PAG, 'CPN');
                            this.fp.focusOn(IPrenotazione.sIMP_PAGATO);
                        }
                        else {
                            this.fp.focusOn(IPrenotazione.sTIPO_PAG);
                        }
                    }
                }
                if (this.fp.isBlank(IPrenotazione.sIMP_PAGATO)) {
                    let srd = this.table.getSelectedRowsData();
                    if (!srd) srd = [];
                    let s = 0;
                    for (let i = 0; i < srd.length; i++) {
                        s += WUtil.getNumber(srd[i], IPrenotazione.sPREZZO_FINALE);
                    }
                    this.fp.setValue(IPrenotazione.sIMP_PAGATO, s);
                    this.impPag = 0;
                }
            });

            this.body
                .addRow()
                .addCol('12').section('Appuntamenti da pagare')
                .add(this.table)
                .addRow()
                .addCol('12')
                .add(this.fp);
        }

        protected onShown() {
            let tipoPag = this.selPag.getState();
            if (!tipoPag) this.selPag.setState('CON');
            setTimeout(() => {
                this.table.repaint();
                this.table.selectAll();
                this.fp.focusOn(IPrenotazione.sIMP_PAGATO);
            }, 200);
        }

        updateProps(nextProps: any[]) {
            super.updateProps(nextProps);
            if (this.table) this.table.setState(this.props);
        }

        getProps(): any[] {
            if (this.table) this.props = this.table.getSelectedRowsData();
            return this.props
        }

        updateState(nextState: any) {
            super.updateState(nextState);
            this.impPag = WUtil.getNumber(this.state, IPrenotazione.sIMP_PAGATO);
            if (this.fp) {
                this.fp.setValue(IPrenotazione.sPREZZO_FINALE, this.impPag);
                this.fp.setValue(IPrenotazione.sIMP_PAGATO, this.impPag);
                this.fp.setValue(IPrenotazione.sCOD_COUPON, WUtil.getString(this.state, IPrenotazione.sCOD_COUPON));
                this.fp.setValue(IPrenotazione.sTIPO_PAG, WUtil.getString(this.state, IPrenotazione.sTIPO_PAG));
                this.fp.setValue(IPrenotazione.sNOTE_CLIENTE, WUtil.getString(this.state, IPrenotazione.sNOTE_CLIENTE));
                this.fp.setValue(IPrenotazione.sCAUSALE, WUtil.getString(this.state, IPrenotazione.sCAUSALE));
            }
        }

        getState(): any {
            this.state = {};
            if (this.selPag) {
                this.state[IPrenotazione.sTIPO_PAG] = WUtil.toString(this.selPag.getState());
            }
            if (this.fp) {
                this.state[IPrenotazione.sCOD_COUPON] = WUtil.toString(this.fp.getValue(IPrenotazione.sCOD_COUPON));
                this.state[IPrenotazione.sIMP_PAGATO] = WUtil.toNumber(this.fp.getValue(IPrenotazione.sIMP_PAGATO));
                this.state[IPrenotazione.sCAUSALE] = WUtil.toString(this.fp.getValue(IPrenotazione.sCAUSALE));
            }
            return this.state;
        }

        protected onClickOk(): boolean {
            let check = this.fp.checkMandatory(true);
            if (check) {
                WUX.showWarning('Specificare: ' + check);
                return false;
            }
            let vs = this.fp.getValues();
            let ip = WUtil.getNumber(vs, IPrenotazione.sIMP_PAGATO);
            if (!ip) {
                let c = WUtil.getString(vs, IPrenotazione.sCAUSALE);
                if (!c) {
                    WUX.showWarning('Con pagato 0 riportare una causale');
                    this.fp.focusOn(IPrenotazione.sCAUSALE);
                    return false;
                }
            }
            return true;
        }
    }

    export class DlgPrenotazione extends WUX.WDialog<string, any> {
        fp: WUX.WFormPanel;
        lnkSApp: WUX.WLink;
        lnkNext: WUX.WLink;
        lnkPrev: WUX.WLink;
        lnkCPre: WUX.WLink;
        lnkCAtt: WUX.WLink;
        selOra: CFSelectOrario;
        selCol: CFSelectCollab;
        selTip: CFSelectTipoApp;
        chkOvr: WUX.WCheck;
        chkMat: WUX.WCheck;
        chkPom: WUX.WCheck;
        btnSrc: WUX.WButton;
        btnRic: WUX.WButton;
        btnMov: WUX.WButton;
        btnRev: WUX.WButton;
        btnAbs: WUX.WButton;
        btnPag: WUX.WButton;
        idFar: number;
        idPren: number;
        idCliente: number;
        dataPren: Date;
        oraPren: number;
        dlgCAtt: DlgCambioAttr;
        dlgCPre: DlgCambioPrest;
        dlgSApp: DlgStoricoApp;
        dlgPApp: DlgAppPag;
        refPlan: boolean;
        // Ctrl doFind
        _sdate: boolean;
        _idcol: number;
        _efind: boolean;

        constructor(id: string) {
            super(id, 'DlgPrenotazione', false, false);

            this.title = 'Appuntamento';

            this.idFar = 0;
            this.idPren = 0;
            this.idCliente = 0;
            this.dataPren = null;
            this.refPlan = false;

            this._sdate = false;
            this._idcol = 0;
            this._efind = false;

            let isOper = isBookOper();

            this.dlgCAtt = new DlgCambioAttr(this.subId('dca'));
            this.dlgCAtt.onHiddenModal((e: JQueryEventObject) => {
                if (!this.dlgCAtt.ok) return;
                let a = this.dlgCAtt.getProps();
                if (!a) {
                    WUX.showWarning('Nessuna cabina selezionata');
                    return;
                }
                let app = this.fp.getValues();
                app[IPrenotazione.sDATA_APP] = WUtil.toDate(app[IPrenotazione.sDATA_APP]);
                app[IPrenotazione.sDATA_PREN] = WUtil.toDate(app[IPrenotazione.sDATA_PREN]);
                // Esecuzione controllata (viene richiesta la password dell'utente desk)
                // Superato il controllo al primo parametro (oggetto) viene aggiunto il campo userDesk.
                chkExecute('PRENOTAZIONI.changeAttr', [app, a.id], (result) => {
                // jrpc.execute('PRENOTAZIONI.changeAttr', [app, a.id], (result) => {
                    if (result) {
                        WUX.showSuccess('Cambio cabina avvenuto con successo.');
                        this.fp.setValue(IPrenotazione.sID_ATTR, a.id);
                        this.fp.setValue(IPrenotazione.sDESC_ATTR, a.text);
                    }
                    else {
                        WUX.showWarning('Cambio cabina NON avvenuto.');
                    }
                });
            });

            this.dlgCPre = new DlgCambioPrest(this.subId('dcp'));
            this.dlgCPre.onHiddenModal((e: JQueryEventObject) => {
                if (!this.dlgCPre.ok) return;
                let p = this.dlgCPre.getProps();
                if (!p) {
                    WUX.showWarning('Nessuna prestazione selezionata');
                    return;
                }
                let app = this.fp.getValues();
                app[IPrenotazione.sDATA_APP] = WUtil.toDate(app[IPrenotazione.sDATA_APP]);
                app[IPrenotazione.sDATA_PREN] = WUtil.toDate(app[IPrenotazione.sDATA_PREN]);
                // Esecuzione controllata (viene richiesta la password dell'utente desk)
                // Superato il controllo al primo parametro (oggetto) viene aggiunto il campo userDesk.
                chkExecute('PRENOTAZIONI.changePrest', [app, p.id], (result) => {
                // jrpc.execute('PRENOTAZIONI.changePrest', [app, p.id], (result) => {
                    if (result) {
                        WUX.showSuccess('Cambio trattamento avvenuto con successo.');
                        this.fp.setValue(IPrenotazione.sID_PREST, p.id);
                        this.fp.setValue(IPrenotazione.sDESC_PREST, p.text);
                        if (p.value) {
                            this.fp.setValue(IPrenotazione.sPREZZO_FINALE, WUX.formatCurr(p.value));
                        }
                        this.refPlan = true;
                    }
                    else {
                        WUX.showWarning('Cambio trattamento NON avvenuto.');
                    }
                });
            });

            this.dlgSApp = new DlgStoricoApp(this.subId('dsa'));

            this.dlgPApp = new DlgAppPag(this.subId('dpa'));
            this.dlgPApp.onHiddenModal((e: JQueryEventObject) => {
                if (!this.dlgPApp.ok) return;
                let appSel = this.dlgPApp.getProps();
                if (!appSel || !appSel.length) {
                    WUX.showWarning('Nessuna prenotazione selezionata');
                    return;
                }
                let lidp: number[] = [];
                for (let i = 0; i < appSel.length; i++) {
                    lidp.push(WUtil.getNumber(appSel[i], IPrenotazione.sID));
                }
                let data = this.dlgPApp.getState();
                if (!data) {
                    WUX.showWarning('Dati pagamenti non disponibili.');
                }
                let tipoPag = WUtil.getString(data, IPrenotazione.sTIPO_PAG);
                if (!tipoPag) {
                    WUX.showWarning('Tipo pagamento non specificato.');
                    return;
                }
                let impPag = WUtil.getNumber(data, IPrenotazione.sIMP_PAGATO);
                let codCou = WUtil.getString(data, IPrenotazione.sCOD_COUPON);
                let causale = WUtil.getString(data, IPrenotazione.sCAUSALE);
                jrpc.execute('PRENOTAZIONI.updatePag', [lidp, tipoPag, impPag, codCou, causale], (result) => {
                    if (result) {
                        WUX.showSuccess('Pagamento registrato con successo.');
                        this.fp.setValue(IPrenotazione.sTIPO_PAG, tipoPag);
                        this.fp.setValue(IPrenotazione.sIMP_PAGATO, impPag);
                        this.fp.setValue(IPrenotazione.sCOD_COUPON, codCou);
                        this.fp.setValue(IPrenotazione.sCAUSALE, causale);
                    }
                    else {
                        WUX.showWarning('Pagamento NON registrato.');
                    }
                });
            });

            this.selOra = new CFSelectOrario();
            this.selCol = new CFSelectCollab();
            this.selCol.on('statechange', (e: WUX.WEvent) => {
                if (!this.selCol.count) return;
                if (!this._efind) return;
                let idColl = WUtil.toNumber(this.selCol.getState());
                console.log('selCol statechange _idcol=' + this._idcol + ',idColl=' + idColl);
                if (this._idcol && idColl != this._idcol) this.doFind();
            });

            this.selTip = new CFSelectTipoApp();
            this.selTip.on('statechange', (e: WUX.WEvent) => {
                if (!this.isShown) return;
                let ts = this.selTip.getState();
                if (!ts) {
                    setTimeout(() => {
                        this.selTip.close();
                    }, 100);
                }
                WUX.showWarning('Riportare eventualmente una nota e premere invio per aggiornare.');
                setTimeout(() => {
                    this.fp.focusOn(IPrenotazione.sNOTE);
                }, 100);
            });

            this.btnSrc = new WUX.WButton(this.subId('btc'), 'Cerca', GUI.ICO.FIND, WUX.BTN.SECONDARY);
            this.btnSrc.tooltip = 'Cerca appuntamenti disponibili';
            this.btnSrc.on('click', (e: JQueryEventObject) => {
                this.doFind();
            });

            if (!isOper) {
                this.btnRic = new WUX.WButton(this.subId('btr'), 'Ricolloca', GUI.ICO.TOOL, WUX.BTN.PRIMARY);
                this.btnRic.on('click', (e: JQueryEventObject) => {
                    WUX.confirm('Si vuole ricollocare l\'appuntamento?', (res) => {
                        if (!res) return;
                        let app = this.fp.getValues();
                        app[IPrenotazione.sDATA_APP] = WUtil.toDate(app[IPrenotazione.sDATA_APP]);
                        app[IPrenotazione.sDATA_PREN] = WUtil.toDate(app[IPrenotazione.sDATA_PREN]);
                        // Esecuzione controllata (viene richiesta la password dell'utente desk)
                        // Superato il controllo al primo parametro (oggetto) viene aggiunto il campo userDesk.
                        chkExecute('PRENOTAZIONI.relocate', [app], (result) => {
                        // jrpc.execute('PRENOTAZIONI.relocate', [app], (result) => {
                            if (!result) {
                                WUX.showWarning('Ricollocazione appuntamento NON eseguita.');
                                return;
                            }
                            let msg = WUtil.getString(result, IPrenotazione.sMESSAGGIO);
                            if (msg) {
                                WUX.showWarning(msg);
                                return;
                            }
                            this.idPren = WUtil.getNumber(result, IPrenotazione.sID);
                            this.dataPren = WUtil.getDate(result, IPrenotazione.sDATA_APP);
                            WUX.showSuccess('Ricollocazione eseguita con successo.');
                            this.ok = true;
                            this.cancel = false;
                            this.root.modal('hide');
                        });
                    });
                });
            }

            this.btnMov = new WUX.WButton(this.subId('bts'), 'Sposta', GUI.ICO.CALENDAR, WUX.BTN.INFO);
            this.btnMov.tooltip = 'Sposta appuntamento';
            this.btnMov.on('click', (e: JQueryEventObject) => {
                if (this.fp.isBlank(IPrenotazione.sCAMBIO_DATA) && this.fp.isBlank(IPrenotazione.sCAMBIO_ORA)) {
                    this.doFind();
                }
                else {
                    if (this.fp.isBlank(IPrenotazione.sCAMBIO_DATA)) {
                        let dtApp = WUtil.toString(this.fp.getValue(IPrenotazione.sDATA_APP));
                        if (!dtApp) {
                            WUX.showWarning('Selezionare la data del nuovo appuntamento.');
                            return;
                        }
                        let iSep = dtApp.indexOf(',');
                        if (iSep >= 0) dtApp = dtApp.substring(iSep + 1).trim();
                        this.fp.setValue(IPrenotazione.sCAMBIO_DATA, dtApp);
                    }
                    if (this.fp.isBlank(IPrenotazione.sCAMBIO_ORA)) {
                        WUX.showWarning('Selezionare l\'ora del nuovo appuntamento.');
                        this.fp.focusOn(IPrenotazione.sCAMBIO_ORA);
                        return;
                    }
                    WUX.confirm('Si vuole spostare l\'appuntamento?', (res) => {
                        if (!res) return;
                        let app = this.fp.getValues();
                        app[IPrenotazione.sDATA_APP] = WUtil.toDate(app[IPrenotazione.sDATA_APP]);
                        app[IPrenotazione.sDATA_PREN] = WUtil.toDate(app[IPrenotazione.sDATA_PREN]);
                        if (this.idFar) app[IPrenotazione.sID_FAR] = this.idFar;
                        // Esecuzione controllata (viene richiesta la password dell'utente desk)
                        // Superato il controllo al primo parametro (oggetto) viene aggiunto il campo userDesk.
                        chkExecute('PRENOTAZIONI.move', [app], (result) => {
                        // jrpc.execute('PRENOTAZIONI.move', [app], (result) => {
                            if (!result) {
                                WUX.showWarning('Spostamento della prenotazione NON eseguito.');
                                return;
                            }
                            let msg = WUtil.getString(result, IPrenotazione.sMESSAGGIO);
                            if (msg) {
                                WUX.showWarning(msg);
                                return;
                            }
                            this.idPren = WUtil.getNumber(result, IPrenotazione.sID);
                            this.dataPren = WUtil.getDate(result, IPrenotazione.sDATA_APP);
                            WUX.showSuccess('Spostamento eseguito con successo.');
                            this.ok = true;
                            this.cancel = false;
                            this.root.modal('hide');
                        });
                    });
                }
            });
            this.btnRev = new WUX.WButton(this.subId('btd'), 'Disdici', GUI.ICO.DELETE, WUX.BTN.DANGER);
            this.btnRev.tooltip = 'Annulla appuntamento';
            this.btnRev.on('click', (e: JQueryEventObject) => {
                let app = this.fp.getValues();
                app[IPrenotazione.sDATA_APP] = WUtil.toDate(app[IPrenotazione.sDATA_APP]);
                // Esecuzione controllata (viene richiesta la password dell'utente desk)
                // Superato il controllo al primo parametro (oggetto) viene aggiunto il campo userDesk.
                chkExecute('PRENOTAZIONI.revoke', [app], (result) => {
                // jrpc.execute('PRENOTAZIONI.revoke', [app], (result) => {
                    if (!result) {
                        WUX.showWarning('Annullamento della prenotazione non eseguito.');
                        return;
                    }
                    let msg = WUtil.getString(result, IPrenotazione.sMESSAGGIO);
                    if (msg) {
                        WUX.showWarning(msg);
                        return;
                    }
                    this.idPren = 0;
                    WUX.showSuccess('Prenotazione annullata con successo.');
                    this.ok = true;
                    this.cancel = false;
                    this.root.modal('hide');
                });
            });
            this.btnAbs = new WUX.WButton(this.subId('btn'), 'Non Pres.', GUI.ICO.CANCEL, WUX.BTN.WARNING);
            this.btnAbs.tooltip = 'Registra non presentato';
            this.btnAbs.on('click', (e: JQueryEventObject) => {
                let app = this.fp.getValues();
                app[IPrenotazione.sDATA_APP] = WUtil.toDate(app[IPrenotazione.sDATA_APP]);
                app[IPrenotazione.sSTATO] = 'N';
                jrpc.execute('PRENOTAZIONI.update', [app], (result) => {
                    if (!result) {
                        WUX.showWarning('Aggiornamento della prenotazione non eseguito.');
                        return;
                    }
                    let msg = WUtil.getString(result, IPrenotazione.sMESSAGGIO);
                    if (msg) {
                        WUX.showWarning(msg);
                        return;
                    }
                    WUX.showSuccess('Aggiornamento eseguito con successo.');
                    this.ok = true;
                    this.cancel = false;
                    this.root.modal('hide');
                });
            });
            this.btnPag = new WUX.WButton(this.subId('btp'), 'Pagam.', GUI.ICO.OK, WUX.BTN.SUCCESS);
            this.btnPag.tooltip = 'Registra pagamento';
            this.btnPag.on('click', (e: JQueryEventObject) => {
                if (!this.idCliente) {
                    WUX.showWarning('Riferimento al cliente assente');
                    return;
                }
                if (!this.idFar) {
                    WUX.showWarning('Riferimento alla struttura assente');
                    return;
                }
                if (!this.dataPren) {
                    WUX.showWarning('Data appuntamento non disponibile');
                    return;
                }
                jrpc.execute('PRENOTAZIONI.history', [this.idCliente, this.idFar, this.dataPren], (result: any[]) => {
                    if (!result || !result.length) {
                        WUX.showWarning('Appuntamenti da pagare non disponibili');
                        return;
                    }
                    if (this.idPren) {
                        let p = WUtil.find(result, IPrenotazione.sID, this.idPren);
                        let f = WUtil.getBoolean(p, IPrenotazione.sPAGATO);
                        if (f) {
                            WUX.showWarning('Prenotazione pagata.');
                            return;
                        }
                    }
                    let data = {};
                    data[IPrenotazione.sTIPO_PAG] = WUtil.toString(this.fp.getValue(IPrenotazione.sTIPO_PAG));
                    data[IPrenotazione.sIMP_PAGATO] = WUtil.toNumber(this.fp.getValue(IPrenotazione.sIMP_PAGATO));
                    data[IPrenotazione.sCOD_COUPON] = WUtil.toString(this.fp.getValue(IPrenotazione.sCOD_COUPON));
                    data[IPrenotazione.sNOTE_CLIENTE] = WUtil.toString(this.fp.getValue(IPrenotazione.sNOTE_CLIENTE));
                    data[IPrenotazione.sCAUSALE] = WUtil.toString(this.fp.getValue(IPrenotazione.sCAUSALE));
                    this.dlgPApp.setProps(result);
                    this.dlgPApp.setState(data);
                    this.dlgPApp.show(this);
                });
            });

            if (!this.buttons) this.buttons = [];
            this.buttons.push(this.btnSrc);
            if (!isOper) {
                this.buttons.push(this.btnRic);
            }
            this.buttons.push(this.btnMov);
            this.buttons.push(this.btnRev);
            this.buttons.push(this.btnPag);
            this.buttons.push(this.btnAbs);

            let lt = new WUX.WLabel('');
            lt.css({ f: 14, fw: 'bold', d: 'block', pt: 8, pb: 8 }, WUX.CSS.LABEL_INFO);

            let ln = new WUX.WLabel('');
            ln.css({ f: 14, fw: 'bold', d: 'block', pt: 8, pb: 8 }, WUX.CSS.LABEL_NOTICE);

            this.chkOvr = new WUX.WCheck('', 'Ignora controlli');
            this.chkMat = new WUX.WCheck('', 'fino alle 14:00');
            this.chkPom = new WUX.WCheck('', 'dalle 14:00');

            this.fp = new WUX.WFormPanel(this.subId('fp'));
            this.fp.addRow();
            this.fp.addTextField(IPrenotazione.sDESC_CLIENTE, 'Cliente', true);
            this.fp.addRow();
            this.fp.addTextField(IPrenotazione.sTELEFONO1, 'Telefono', true);
            this.fp.addComponent(IPrenotazione.sID_FAR, 'Struttura', new CFSelectStruture(), true);
            this.fp.addRow();
            this.fp.addTextField(IPrenotazione.sDATA_APP, 'Data Appuntamento', true);
            this.fp.addDateField(IPrenotazione.sCAMBIO_DATA, 'Cambio data');
            this.fp.addRow();
            this.fp.addTextField(IPrenotazione.sORA_APP, 'Dalle ore', true);
            this.fp.addTextField(IPrenotazione.sORA_FINE, 'alle ore', true);
            this.fp.addComponent(IPrenotazione.sCAMBIO_ORA, 'Cambio ora', this.selOra);
            if (isOper) {
                this.fp.addBlankField();
            }
            else {
                this.fp.addComponent(IPrenotazione.sOVERBOOKING, 'Forzatura', this.chkOvr.getWrapper({ mt: 4 }));
            }
            this.fp.addRow();
            this.fp.addComponent(IPrenotazione.sDESC_PREST, 'Trattamento', lt);
            this.fp.addRow();
            this.fp.addTextField(IPrenotazione.sDESC_COLL, 'Collaboratore', true);
            this.fp.addComponent(IPrenotazione.sCAMBIO_ID_COLL, 'Cambio Coll.', this.selCol);
            this.fp.addRow();
            this.fp.addTextField(IPrenotazione.sDESC_ATTR, 'Cabina', true);
            this.fp.addComponent(IPrenotazione.sMATTINO, 'Mattino', this.chkMat.getWrapper({ mt: 4 }));
            this.fp.addComponent(IPrenotazione.sPOMERIGGIO, 'Pomeriggio', this.chkPom.getWrapper({ mt: 4 }));
            this.fp.addRow();
            this.fp.addIntegerField(IPrenotazione.sDURATA, 'Durata');
            this.fp.addTextField(IPrenotazione.sPREZZO_FINALE, 'Importo', true);
            this.fp.addRow();
            this.fp.addTextField(IPrenotazione.sDATA_PREN, 'Prenotato il', true);
            this.fp.addComponent(IPrenotazione.sTIPO, 'Tipo', this.selTip);
            this.fp.addRow();
            this.fp.addComponent(IPrenotazione.sNOTE_CLIENTE, 'Note Cliente', ln);
            this.fp.addRow();
            this.fp.addTextField(IPrenotazione.sNOTE, 'Note Prenotazione (premere invio per aggiornarle)');
            this.fp.addInternalField(IPrenotazione.sID);
            this.fp.addInternalField(IPrenotazione.sID_CLIENTE);
            this.fp.addInternalField(IPrenotazione.sID_COLL);
            this.fp.addInternalField(IPrenotazione.sID_ATTR);
            this.fp.addInternalField(IPrenotazione.sID_PREST);
            this.fp.addInternalField(IPrenotazione.sSTATO);
            this.fp.addInternalField(IPrenotazione.sTIPO_PAG);
            this.fp.addInternalField(IPrenotazione.sIMP_PAGATO);
            this.fp.addInternalField(IPrenotazione.sCOD_COUPON);
            this.fp.addInternalField(IPrenotazione.sCAUSALE);
            if (isOper) {
                this.fp.addInternalField(IPrenotazione.sOVERBOOKING);
            }

            this.fp.setSpanField(IPrenotazione.sDESC_ATTR, 2);

            this.lnkSApp = new WUX.WLink(this.subId('lsa'), 'Storico', WUX.WIcon.FOLDER_OPEN_O);
            this.lnkSApp.on('click', (e: JQueryEventObject) => {
                let idc = WUtil.toNumber(this.fp.getValue(IPrenotazione.sID_CLIENTE));
                if (!idc) return;
                jrpc.execute('CLIENTI.read', [idc], (result) => {
                    if (!result) {
                        WUX.showWarning('Dati cliente ' + idc + ' non disponibili.');
                        return;
                    }
                    this.dlgSApp.setState(WUtil.getArray(result, ICliente.sPRENOTAZIONI));
                    this.dlgSApp.show(this);
                });
            });
            this.fp.setLabelLinks(IPrenotazione.sDESC_CLIENTE, [ this.lnkSApp ]);

            this.lnkCPre = new WUX.WLink(this.subId('lcp'), 'Cambio', WUX.WIcon.RECYCLE);
            this.lnkCPre.on('click', (e: JQueryEventObject) => {
                let app = this.fp.getValues();
                let idf = WUtil.getNumber(app, IPrenotazione.sID_FAR);
                let idc = WUtil.getNumber(app, IPrenotazione.sID_COLL);
                jrpc.execute('PRESTAZIONI.getAll', [idf, idc], (result) => {
                    this.dlgCPre.setState(result);
                    // L'impostazione della durata dopo setState (che la resetta)
                    this.dlgCPre.durata = WUtil.getNumber(app, IPrenotazione.sDURATA);
                    this.dlgCPre.show(this);
                });                
            });
            this.fp.setLabelLinks(IPrenotazione.sDESC_PREST, [this.lnkCPre]);

            this.lnkCAtt = new WUX.WLink(this.subId('lcc'), 'Cambio', WUX.WIcon.RECYCLE);
            this.lnkCAtt.on('click', (e: JQueryEventObject) => {
                let app = this.fp.getValues();
                app[IPrenotazione.sDATA_APP] = WUtil.toDate(app[IPrenotazione.sDATA_APP]);
                app[IPrenotazione.sDATA_PREN] = WUtil.toDate(app[IPrenotazione.sDATA_PREN]);
                jrpc.execute('ATTREZZATURE.getCollegate', [app], (result) => {
                    this.dlgCAtt.setProps({ id: WUtil.getNumber(app, IPrenotazione.sID_ATTR) })
                    this.dlgCAtt.setState(result);
                    this.dlgCAtt.show(this);
                });
            });
            this.fp.setLabelLinks(IPrenotazione.sDESC_ATTR, [ this.lnkCAtt ]);

            this.fp.onEnterPressed((e: WUX.WEvent) => {
                let fid = e.data;
                if (fid == IPrenotazione.sNOTE) {
                    let app = this.fp.getValues();
                    app[IPrenotazione.sDATA_APP] = WUtil.toDate(app[IPrenotazione.sDATA_APP]);
                    app[IPrenotazione.sSTATO] = '';
                    app[IPrenotazione.sTIPO] = this.fp.getValue(IPrenotazione.sTIPO);
                    jrpc.execute('PRENOTAZIONI.update', [app], (result) => {
                        if (!result) {
                            WUX.showWarning('Aggiornamento prenotazione NON eseguito.');
                            return;
                        }
                        let msg = WUtil.getString(result, IPrenotazione.sMESSAGGIO);
                        if (msg) {
                            WUX.showWarning(msg);
                            return;
                        }
                        WUX.showSuccess('Aggiornamento prenotazione eseguito con successo.');
                        this.ok = true;
                        this.cancel = false;
                        this.root.modal('hide');
                    });
                }
            });

            this.lnkPrev = new WUX.WLink(this.subId('lnkp'), '', GUI.ICO.LEFT);
            this.lnkPrev.tooltip = 'Data precedente';
            this.lnkPrev.on('click', (e: JQueryEventObject) => {
                this._efind = false;
                let dataApp = WUtil.toDate(this.fp.getValue(IPrenotazione.sCAMBIO_DATA));
                if (!dataApp) {
                    WUX.showWarning('Data non selezionata.');
                    return;
                }
                if (!this._idcol) {
                    WUX.showWarning('Interrogare le disponibilit&agrave;.');
                    return;
                }
                this.doFind(null, dataApp);
            });
            this.lnkNext = new WUX.WLink(this.subId('lnkn'), '', GUI.ICO.RIGHT);
            this.lnkNext.tooltip = 'Data successiva';
            this.lnkNext.on('click', (e: JQueryEventObject) => {
                this._efind = false;
                let dataApp = WUtil.toDate(this.fp.getValue(IPrenotazione.sCAMBIO_DATA));
                if (!dataApp) {
                    WUX.showWarning('Data non selezionata.');
                    return;
                }
                if (!this._idcol) {
                    WUX.showWarning('Interrogare le disponibilit&agrave;.');
                    return;
                }
                dataApp.setDate(dataApp.getDate() + 1);
                this.doFind(dataApp);
            });
            this.fp.setLabelLinks(IPrenotazione.sCAMBIO_DATA, [this.lnkPrev, this.lnkNext]);

            this.fp.onChangeDate((e: JQueryEventObject) => {
                let fid = WUX.lastSub($(e.target));
                if (fid == IPrenotazione.sCAMBIO_DATA) {
                    if (this._sdate) {
                        this._sdate = false;
                        return;
                    }
                    if (this.fp.isBlank(IPrenotazione.sCAMBIO_DATA)) return;
                    if (!this._efind) return;
                    this.doFind();
                }
            });

            this.body
                .addRow()
                .addCol('12')
                .add(this.fp);
        }

        protected doFind(fromDate?: Date, toDate?: Date): this {
            console.log('doFind fromDate=' + WUX.formatDate(fromDate) + ',toDate=' + WUX.formatDate(toDate));
            this._efind = false;
            let app = this.fp.getValues();
            app[IPrenotazione.sPREFERENZE] = '';
            if (app[IPrenotazione.sMATTINO] && !app[IPrenotazione.sPOMERIGGIO]) {
                app[IPrenotazione.sPREFERENZE] = 'M';
            }
            else if (!app[IPrenotazione.sMATTINO] && app[IPrenotazione.sPOMERIGGIO]) {
                app[IPrenotazione.sPREFERENZE] = 'P';
            }
            app[IPrenotazione.sID_COLL] = this.fp.getValue(IPrenotazione.sCAMBIO_ID_COLL);
            delete app[IPrenotazione.sDATA_APP];
            delete app[IPrenotazione.sCAMBIO_DATA];
            if (fromDate) {
                app[IPrenotazione.sCAMBIO_DAL] = fromDate;
            }
            else if (toDate) {
                app[IPrenotazione.sCAMBIO_AL] = toDate;
            }
            else if (this.fp.isBlank(IPrenotazione.sCAMBIO_DATA)) {
                app[IPrenotazione.sCAMBIO_DAL] = WUtil.toDate(this.fp.getValue(IPrenotazione.sDATA_APP));
            }
            else {
                app[IPrenotazione.sCAMBIO_DATA] = WUtil.toDate(this.fp.getValue(IPrenotazione.sCAMBIO_DATA));
                app[IPrenotazione.sCAMBIO_DAL] = null;
            }
            app[IPrenotazione.sPREN_ONLINE] = false;
            if (this.idFar) app[IPrenotazione.sID_FAR] = this.idFar;
            jrpc.execute('CALENDARIO.getAvailabilities', [app], (result: Calendario[]) => {
                let appts = [];
                if (!result || !result.length) {
                    // Con -1 si scatena la ricerca automatica qualora si toglie il cambio collaboratore
                    this._idcol = -1;
                    this.fp.setValue(IPrenotazione.sCAMBIO_ORA, null);
                    this.selOra.setAllSlots();
                    WUX.showWarning('Non vi sono appuntamenti disponibili.');
                    this._efind = true;
                    return;
                }
                let c = result[0];
                if (c.data) {
                    WUX.showSuccess('Primo appuntamento disponibile:<br><strong>' + WUX.formatDate(c.data, true) + '</strong> alle ore <strong>' + WUX.formatTime(c.oraInizio) + '</strong><br>con <strong>' + c.nomeCollab + '</strong>');
                    this._sdate = true;
                    this.fp.setValue(IPrenotazione.sCAMBIO_DATA, c.data);
                    this.fp.setValue(IPrenotazione.sCAMBIO_ORA, c.oraInizio);
                    this._idcol = c.idCollaboratore;
                    this.fp.setValue(IPrenotazione.sCAMBIO_ID_COLL, this._idcol);
                }
                for (let i = 0; i < result.length; i++) {
                    let o = result[i].oraInizio;
                    if (appts.indexOf(o) < 0) appts.push(o);
                }
                appts.sort((a, b) => a - b);
                this.selOra.setAppts(appts);
                this._efind = true;
            });
            return this;
        }

        protected updateState(nextState: any): void {
            super.updateState(nextState);

            let ckUsrDesk = WUtil.getBoolean(this.state, IPrenotazione.sCHECK_USER_DESK);
            if (ckUsrDesk) {
                BookmeCfg.CHECK_USER_DESK = ckUsrDesk;
            }

            this.idFar = WUtil.getNumber(this.state, IPrenotazione.sID_FAR);
            this.idPren = WUtil.getNumber(this.state, IPrenotazione.sID);
            this.idCliente = WUtil.getNumber(this.state, IPrenotazione.sID_CLIENTE);
            this.dataPren = WUtil.getDate(this.state, IPrenotazione.sDATA_APP);
            this.oraPren = this.state ? WUtil.toIntTime(this.state[IPrenotazione.sORA_APP]) : 0;

            this.refPlan = false;

            this._sdate = false;
            this._idcol = 0;
            this._efind = false;
            if (this.selOra) this.selOra.setAllSlots();
            if (this.fp) {
                this.fp.clear();

                delete this.state[IPrenotazione.sCAMBIO_ID_COLL];
                this.fp.setState(this.state);

                this._idcol = WUtil.getNumber(this.state, IPrenotazione.sID_COLL);
                setTimeout(() => {
                    this.selCol.setIdFar(this.idFar, this._idcol);
                }, 100);
            }
        }

        getState(): any {
            if (this.fp) {
                this.state = this.fp.getState();
            }
            return this.state;
        }

        protected componentDidMount(): void {
            super.componentDidMount();
            this.cntMain.css({ w: 650 });
        }
    }

    export class DlgOrariPers extends WUX.WDialog<Date, any> {
        protected cfOrariPers: CFOrariPers;

        constructor(id: string) {
            super(id, 'DlgOrariPers');

            this.title = 'Personalizza orari';

            this.cfOrariPers = new CFOrariPers(this.subId('op'));

            this.body
                .addRow()
                .addCol('12')
                .add(this.cfOrariPers);
        }

        protected updateState(nextState: any): void {
            this.state = {};
            this.state[ICalendario.sORARI] = WUtil.getObject(nextState, ICalendario.sORARI);
            if (this.cfOrariPers) {
                let date = WUtil.getDate(nextState, ICalendario.sDATA);
                if (date) {
                    this.title = 'Personalizza orari di ' + WUX.formatDate(date, true, false);
                }
                else {
                    this.title = 'Personalizza orari';
                }
                this.cfOrariPers.resources = WUtil.getArray(nextState, ICalendario.sRISORSE);
                this.cfOrariPers.setState(WUtil.getObject(nextState, ICalendario.sORARI));
            }
        }

        getState(): any {
            if (!this.state) this.state = {};
            if (this.cfOrariPers) {
                this.state[ICalendario.sORARI] = this.cfOrariPers.getState();
            }
            return this.state;
        }

        refresh(): this {
            if (!this.cfOrariPers) this.cfOrariPers.refresh();
            return this;
        }

        protected onShown() {
            this.cfOrariPers.refresh();
        }
    }

    export class DlgAssenze extends WUX.WDialog<string, Date[]> {
        protected fp: WUX.WFormPanel;

        constructor(id: string) {
            super(id, 'DlgAssenze');

            this.title = 'Assenze';

            this.fp = new WUX.WFormPanel(this.subId('fp'));
            this.fp.addRow();
            this.fp.addDateField('ad', 'Dal');
            this.fp.addDateField('aa', 'al');

            this.fp.setMandatory('ad', 'aa');

            this.body
                .addRow()
                .addCol('12')
                .add(this.fp);
        }

        getState(): Date[] {
            if (this.fp) {
                this.state = [];
                this.state[0] = WUtil.toDate(this.fp.getValue('ad'));
                this.state[1] = WUtil.toDate(this.fp.getValue('aa'));
            }
            return this.state;
        }

        protected onShown() {
            this.fp.clear();
        }

        protected onClickOk(): boolean {
            let check = this.fp.checkMandatory(true);
            if (check) {
                WUX.showWarning('Specificare: ' + check);
                return false;
            }
            let ad = WUtil.toNumber(WUtil.toDate(this.fp.getValue('ad')));
            let aa = WUtil.toNumber(WUtil.toDate(this.fp.getValue('aa')));
            if (aa < ad) {
                WUX.showWarning('Data "al" anteriore rispetto alla data "dal".');
                return false;
            }
            return true;
        }
    }

    export class DlgAgenda extends WUX.WDialog<string, Agenda> {
        protected cmpAgenda: CFAgenda;
        protected fp: WUX.WFormPanel;
        protected conf: boolean;

        constructor(id: string) {
            super(id, 'DlgAgenda');

            this.title = 'Orario';

            this.cmpAgenda = new CFAgenda(this.subId('age'));

            this.fp = new WUX.WFormPanel(this.subId('fp'));
            this.fp.addRow();
            this.fp.addDateField('iv', 'Inizio Validit&agrave;');
            this.fp.addDateField('fv', 'Fine Validit&agrave;');
            this.fp.addTextField('ds', 'Descrizione');
            this.fp.addInternalField('id');

            this.fp.setMandatory('iv');

            this.body
                .addRow()
                .addCol('12')
                .add(this.fp)
                .addRow()
                .addCol('12', { a: 'center' })
                .add(this.cmpAgenda);
        }

        getState(): Agenda {
            if (this.cmpAgenda) {
                let iv = WUtil.toDate(this.fp.getValue('iv'));
                // Serve per allineare sett. pari/disp. rispetto all'inizio validita'.
                this.cmpAgenda.setDateRef(iv);
                this.state = this.cmpAgenda.getState();
                if (this.state) {
                    this.state.id = WUtil.toNumber(this.fp.getValue('id'));
                    this.state.inizioValidita = WUtil.toDate(this.fp.getValue('iv'));
                    this.state.fineValidita = WUtil.toDate(this.fp.getValue('fv'));
                    this.state.descrizione = WUtil.toString(this.fp.getValue('ds'));
                    if (!this.state.descrizione) this.state.descrizione = 'PIANO';
                }
            }
            return this.state;
        }

        protected onClickOk(): boolean {
            let div = WUtil.toDate(this.fp.getValue('iv'));
            if (!div) {
                WUX.showWarning('Inizio Validit&agrave; non valida');
                this.fp.focusOn('iv');
                return false;
            }
            let cd = WUtil.toNumber(new Date());
            let iv = WUtil.toNumber(div);
            if (iv <= cd) {
                WUX.showWarning('La variazione deve avere inizio validit&agrave; nel futuro.');
                this.fp.focusOn('iv');
                return false;
            }
            let fv = WUtil.toNumber(WUtil.toDate(this.fp.getValue('fv')));
            if (fv && fv <= iv) {
                this.fp.focusOn('fv');
                WUX.showWarning('La data di fine validit&agrave; deve essere posteriore a quella di inizio.');
                return false;
            }
            if (this.conf) return true;
            if (!this.cmpAgenda.isActivated()) {
                WUX.confirm('Settimana corrente non attiva. Proseguire?', (res) => {
                    if (res) {
                        this.conf = true;
                        this.btnOK.trigger('click');
                    }
                });
                return false;
            }
            return true;
        }

        protected onShown() {
            this.fp.clear();
            this.cmpAgenda.clear();
            this.conf = false;

            if (!this.state) {
                this.fp.setValue('iv', WUtil.getCurrDate(1));
                this.fp.setValue('ds', 'PIANO');
                this.fp.setValue('id', 0);

                this.cmpAgenda.clear();
            }
            else {
                this.fp.setValue('iv', WUtil.getDate(this.state, 'inizioValidita'));
                this.fp.setValue('fv', WUtil.getDate(this.state, 'fineValidita'));
                this.fp.setValue('ds', WUtil.getString(this.state, 'descrizione'));
                this.fp.setValue('id', WUtil.getNumber(this.state, 'id'));

                this.cmpAgenda.setDateRef(WUtil.getDate(this.state, 'inizioValidita'));
                this.cmpAgenda.setState(this.state);
            }
        }

        protected componentDidMount(): void {
            super.componentDidMount();
            let w = $(window).width();
            if (w > 1260) {
                this.cntMain.css({ w: 1260, h: 600 });
            }
            else {
                this.cntMain.css({ w: 1000, h: 600 });
            }
        }
    }

    export class DlgCliente extends WUX.WDialog<string, any> {
        fp: WUX.WFormPanel;
        done: boolean;

        constructor(id: string) {
            super(id, 'DlgCliente');

            this.title = 'Cliente';

            this.fp = new WUX.WFormPanel(this.subId('fp'));
            this.fp.addRow();
            this.fp.addTextField(ICliente.sCOGNOME, 'Cognome');
            this.fp.addRow();
            this.fp.addTextField(ICliente.sNOME, 'Nome');
            this.fp.addRow();
            this.fp.addTextField(ICliente.sTELEFONO1, 'Telefono');
            this.fp.addRow();
            this.fp.addTextField(ICliente.sEMAIL, 'Email');
            this.fp.addRow();
            this.fp.addOptionsField(ICliente.sSESSO, 'Sesso', [{ id: '', text: '' }, { id: 'M', text: 'Maschio' }, { id: 'F', text: 'Femmina' }]);
            this.fp.addRow();
            this.fp.addDateField(ICliente.sDATA_NASCITA, 'Data di nascita');
            this.fp.addRow();
            this.fp.addTextField(ICliente.sNOTE, 'Note');
            this.fp.addInternalField(ICliente.sID);

            this.fp.setMandatory(ICliente.sCOGNOME, ICliente.sNOME, ICliente.sTELEFONO1);

            this.body
                .addRow()
                .addCol('12')
                .add(this.fp);
        }

        protected onShown() {
            this.done = false;
            this.fp.clear();
            if (this.state) {
                this.fp.setState(this.state);
            }
            setTimeout(() => {
                this.fp.focusOn(ICliente.sCOGNOME);
            }, 100);
        }

        protected onClickOk(): boolean {
            if (this.done) return true;
            let cs = this.fp.checkMandatory(true, true);
            if (cs) {
                WUX.showWarning('Specificare i seguenti campi: ' + cs);
                return false;
            }
            let values = this.fp.getValues();
            let t = WUtil.getString(values, ICliente.sTELEFONO1);
            if (!t || t.length < 5) {
                WUX.showWarning('Numero di telefono non valido');
                this.fp.focusOn(ICliente.sTELEFONO1);
                return false;
            }

            if (values[ICliente.sID]) {
                jrpc.execute('CLIENTI.update', [values], (result) => {
                    if (!result) {
                        WUX.showWarning('Dati cliente non registrati.');
                        return;
                    }
                    this.state = result;
                    this.done = true;
                    this.btnOK.trigger('click');
                    WUX.showSuccess('Dati cliente registrati con successo.');
                });
            }
            else {
                let t = values[ICliente.sTELEFONO1];
                if (t) {
                    jrpc.execute('CLIENTI.exists', [t], (re) => {
                        if (re && re[ICliente.sCOGNOME]) {
                            let msg = re[ICliente.sCOGNOME] + ' ' + re[ICliente.sNOME] + ' ha il numero di telefono ' + re[ICliente.sTELEFONO1] + '. Proseguire?';
                            WUX.confirm(msg, (cnf) => {
                                if (!cnf) return;
                                jrpc.execute('CLIENTI.insert', [values], (resIns) => {
                                    if (!resIns) {
                                        WUX.showWarning('Dati cliente non registrati.');
                                        return;
                                    }
                                    this.state = resIns;
                                    this.done = true;
                                    this.btnOK.trigger('click');
                                    WUX.showSuccess('Cliente inserito con successo.');
                                });
                            })
                            return;
                        }
                        jrpc.execute('CLIENTI.insert', [values], (result) => {
                            if (!result) {
                                WUX.showWarning('Dati cliente non registrati.');
                                return;
                            }
                            this.state = result;
                            this.done = true;
                            this.btnOK.trigger('click');
                            WUX.showSuccess('Cliente inserito con successo.');
                        });
                    });
                }
                else {
                    jrpc.execute('CLIENTI.insert', [values], (result) => {
                        if (!result) {
                            WUX.showWarning('Dati cliente non registrati.');
                            return;
                        }
                        this.state = result;
                        this.done = true;
                        this.btnOK.trigger('click');
                        WUX.showSuccess('Cliente inserito con successo.');
                    });
                }
            }
            return false;
        }

        protected componentDidMount(): void {
            super.componentDidMount();
            this.cntMain.css({ w: 500 });
        }
    }

    export class DlgClienti extends WUX.WDialog<number, any> {
        fpFilter: WUX.WFormPanel;
        btnFind: WUX.WButton;
        btnReset: WUX.WButton;
        tabResult: WUX.WDXTable;

        constructor(id: string) {
            super(id, 'DlgClienti');

            this.title = 'Selezionare il cliente';

            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addTextField(ICliente.sCOGNOME, 'Cognome');
            this.fpFilter.addTextField(ICliente.sNOME, 'Nome');
            this.fpFilter.addTextField(ICliente.sTELEFONO1, 'Telefono');
            this.fpFilter.addTextField(ICliente.sEMAIL, 'Email');

            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', (e: JQueryEventObject) => {
                jrpc.execute('CLIENTI.find', [this.fpFilter.getState()], (result: any[]) => {
                    this.state = null;
                    if (result) {
                        if (this.props) {
                            let idx = WUtil.indexOf(result, ICliente.sID, this.props);
                            if (idx >= 0) result.splice(idx, 1);
                        }
                        this.tabResult.setState(result);
                    }
                    else {
                        this.tabResult.setState([]);
                    }
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', (e: JQueryEventObject) => {
                this.state = null;
                this.fpFilter.clear();
                this.tabResult.setState([]);
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
            this.tabResult.css({ h: 200 });
            this.tabResult.widths = [100];

            this.body
                .addBox('Filtri di ricerca:', '', '', '', WUX.ATT.BOX_FILTER)
                .addRow()
                .addCol('col-xs-11 b-r')
                .add(this.fpFilter)
                .addCol('col-xs-1 b-l')
                .addGroup({ classStyle: 'form-group text-right' }, this.btnFind, this.btnReset)
                .end() // end Box
                .addBox()
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, this.tabResult)
                .end(); // end Box
        }

        protected onClickOk(): boolean {
            let srd = this.tabResult.getSelectedRowsData();
            if (!srd || !srd.length) {
                WUX.showWarning('Selezionare un cliente');
                return false;
            }
            this.state = srd[0];
            return true;
        }

        protected onShown() {
            this.state = null;
            this.tabResult.scrollTo(0);
            this.tabResult.setState([]);
            setTimeout(() => {
                this.fpFilter.focusOn(ICliente.sCOGNOME);
                this.tabResult.repaint();
                if (!this.fpFilter.isBlank()) {
                    this.btnFind.trigger('click');
                }
            }, 100);
        }
    }

    export class DlgAttrRis extends WUX.WDialog<Date, any[]> {
        tabAttr: WUX.WDXTable;

        constructor(id: string) {
            super(id, 'DlgAttrRis');

            this.title = 'Cabine riservate';

            let pc = [
                ['Cabina', 'da'],
                ['Collaboratore', 'dc'],
                ['Giorno', 'rg'],
                ['Riservata dalle', 'rd'],
                ['alle', 'ra']
            ];
            this.tabAttr = new WUX.WDXTable(this.subId('tpa'), WUtil.col(pc, 0), WUtil.col(pc, 1));
            this.tabAttr.css({ h: 328 });
            this.tabAttr.exportFile = 'cabine_riservate';
            this.tabAttr.widths = [240];
            this.tabAttr.selectionMode = 'single';

            this.tabAttr.onRowPrepared((e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number }) => {
                if (!e.data) return;
                let at = WUtil.getBoolean(e.data, 'at');
                let sp = WUtil.getBoolean(e.data, 'sp');
                if (!at) {
                    WUX.setCss(e.rowElement, WUX.CSS.ERROR);
                }
                else if (sp) {
                    WUX.setCss(e.rowElement, WUX.CSS.WARNING);
                }
            });

            this.body
                .addRow()
                .addCol('12')
                .add(this.tabAttr);
        }

        protected updateState(nextState: any[]): void {
            super.updateState(nextState);
            if (this.tabAttr) {
                this.tabAttr.setState(this.state);
            }
        }

        getState(): any[] {
            if (this.tabAttr) {
                this.state = this.tabAttr.getState();
            }
            return this.state;
        }

        protected onShown() {
            this.tabAttr.scrollTo(0);
            setTimeout(() => {
                if (this.state && this.state.length) {
                    this.tabAttr.refresh();
                }
                else {
                    this.tabAttr.repaint();
                }
            }, 100);
        }
    }

    export class DlgStoricoApp extends WUX.WDialog<string, any[]> {
        protected tabStorico: WUX.WDXTable;
        protected dataRif: number;

        constructor(id: string) {
            super(id, 'DlgStoricoApp');

            this.title = 'Storico appuntamenti';

            this.dataRif = WUtil.toNumber(new Date());

            let sc = [
                ['Data App.', IPrenotazione.sDATA_APP, 'd'],
                ['Ora App.', IPrenotazione.sORA_APP, 's'],
                ['Durata', IPrenotazione.sDURATA, 'i'],
                ['Stato', IPrenotazione.sSTATO, 's'],
                ['Collaboratore', IPrenotazione.sDESC_COLL, 's'],
                ['Trattamento', IPrenotazione.sDESC_PREST, 's'],
                ['Cabina', IPrenotazione.sDESC_ATTR, 's'],
                ['Data Pren.', IPrenotazione.sDATA_PREN, 'd'],
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


            this.body
                .addRow()
                .addCol('12')
                .add(this.tabStorico);
        }

        protected updateState(nextState: any[]): void {
            super.updateState(nextState);
            if (this.tabStorico) {
                this.tabStorico.setState(this.state);
            }
        }

        protected onShown() {
            this.tabStorico.scrollTo(0);
            setTimeout(() => {
                if (this.state && this.state.length) {
                    this.tabStorico.refresh();
                }
                else {
                    this.tabStorico.repaint();
                }
            }, 100);
        }

        protected componentDidMount(): void {
            super.componentDidMount();
            let w = $(window).width();
            if (w > 1200) {
                this.cntMain.css({ w: 1200, h: 600 });
            }
            else {
                this.cntMain.css({ w: 900, h: 600 });
            }
        }
    }

    export class DlgStoricoColl extends WUX.WDialog<string, any[]> {
        protected label: WUX.WLabel;
        protected tabStorico: WUX.WDXTable;
        protected dataRif: number;

        constructor(id: string) {
            super(id, 'DlgStoricoColl');

            this.title = 'Storico prenotazioni collaboratore';

            this.dataRif = WUtil.toNumber(new Date());

            let sc = [
                ['Data App.', IPrenotazione.sDATA_APP, 'd'],
                ['Ora App.', IPrenotazione.sORA_APP, 's'],
                ['Durata', IPrenotazione.sDURATA, 'i'],
                ['Stato', IPrenotazione.sSTATO, 's'],
                ['Cliente', IPrenotazione.sDESC_CLIENTE, 's'],
                ['Trattamento', IPrenotazione.sDESC_PREST, 's'],
                ['Cabina', IPrenotazione.sDESC_ATTR, 's'],
                ['Data Pren.', IPrenotazione.sDATA_PREN, 'd'],
                ['Data Agg.', IPrenotazione.sDATA_UPD, 't'],
                ['Struttura', IPrenotazione.sCOD_FAR, 's'],
                ['Note', IPrenotazione.sNOTE, 's'],
                ['Forzatura', IPrenotazione.sOVERBOOKING, 'b'],
                ['On Line', IPrenotazione.sPREN_ONLINE, 'b']
            ];

            this.label = new WUX.WLabel(this.subId('lbl'));
            this.label.css({ f: 14, fw: 'bold' }, WUX.CSS.LABEL_INFO);

            this.tabStorico = new WUX.WDXTable(this.subId('tps'), WUtil.col(sc, 0), WUtil.col(sc, 1));
            this.tabStorico.filter = true;
            this.tabStorico.exportFile = 'storico_coll';
            this.tabStorico.types = WUtil.col(sc, 2);
            this.tabStorico.css({ h: 400, f: 10 });
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

            this.body
                .addRow()
                .addCol('12', { a: 'right' })
                .add(this.label)
                .addRow()
                .addDiv(8)
                .addCol('12')
                .add(this.tabStorico);
        }

        protected updateState(nextState: any[]): void {
            super.updateState(nextState);
            if (this.tabStorico) {
                this.tabStorico.setState(this.state);
            }
        }

        protected updateProps(nextProps: string): void {
            super.updateProps(nextProps);
            if (!this.mounted) return;
            this.label.setState(this.props);
        }

        protected onShown() {
            this.tabStorico.scrollTo(0);
            this.tabStorico.clearFilter();
            setTimeout(() => {
                if (this.state && this.state.length) {
                    this.tabStorico.refresh();
                }
                else {
                    this.tabStorico.repaint();
                }
            }, 100);
        }

        protected componentDidMount(): void {
            super.componentDidMount();
            let w = $(window).width();
            if (w > 1200) {
                this.cntMain.css({ w: 1200, h: 600 });
            }
            else {
                this.cntMain.css({ w: 900, h: 600 });
            }
        }
    }

    export class DlgComunicazione extends WUX.WDialog<WUX.WEntity, any[]> {
        tabCom: WUX.WDXTable;

        constructor(id: string) {
            super(id, 'DlgComunicazione');

            this.title = 'Seleziona comunicazione';

            let pc = [
                ['Oggetto', IComunicazione.sOGGETTO, 's']
            ];
            this.tabCom = new WUX.WDXTable(this.subId('tpr'), WUtil.col(pc, 0), WUtil.col(pc, 1));
            this.tabCom.types = WUtil.col(pc, 2);
            this.tabCom.css({ h: 350 });
            this.tabCom.selectionMode = 'single';

            this.body
                .addRow()
                .addCol('12')
                .add(this.tabCom);
        }

        protected updateState(nextState: any[]): void {
            super.updateState(nextState);
            if (this.tabCom) this.tabCom.setState(this.state);
        }

        getState(): any[] {
            if (this.tabCom) this.state = this.tabCom.getState();
            return this.state;
        }

        getProps(): WUX.WEntity {
            this.props = null;
            if (this.tabCom) {
                let srd = this.tabCom.getSelectedRowsData();
                if (srd && srd.length) {
                    this.props = {
                        id: WUtil.getNumber(srd[0], IComunicazione.sID),
                        text: WUtil.getString(srd[0], IComunicazione.sOGGETTO),                        
                    };
                }
            }
            return this.props;
        }

        protected onClickOk(): boolean {
            let srd = this.tabCom.getSelectedRowsData();
            if (!srd || !srd.length) {
                WUX.showWarning('Comunicazione non selezionata.');
                return false;
            }
            return true;
        }

        protected onShown() {
            this.tabCom.scrollTo(0);
            setTimeout(() => {
                if (this.state && this.state.length) {
                    this.tabCom.refresh();
                }
                else {
                    this.tabCom.repaint();
                }
            }, 100);
        }
    }

    export class DlgCambioAttr extends WUX.WDialog<WUX.WEntity, any[]> {
        tabAttr: WUX.WDXTable;

        constructor(id: string) {
            super(id, 'DlgCambioAttr');

            this.title = 'Cambio cabina';

            let pc = [
                ['Cabina', 'da'],
                ['Collaboratore', 'dc'],
                ['Giorno', 'rg'],
                ['Ris. dalle', 'rd'],
                ['alle', 'ra'],
                ['Coll.Successivo', 'nn'],
                ['dalle', 'nd'],
                ['alle', 'na']
            ];
            this.tabAttr = new WUX.WDXTable(this.subId('tpa'), WUtil.col(pc, 0), WUtil.col(pc, 1));
            this.tabAttr.css({ h: 350 });
            this.tabAttr.widths = [240];
            this.tabAttr.selectionMode = 'single';

            this.tabAttr.onRowPrepared((e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number }) => {
                if (!e.data) return;
                let ia = WUtil.getNumber(e.data, 'ia');
                let rf = WUtil.getBoolean(e.data, 'rf');
                let cp = WUtil.getBoolean(e.data, 'cp');
                if (this.props && this.props.id == ia) {
                    WUX.setCss(e.rowElement, WUX.CSS.INFO);
                }
                else if (rf) {
                    WUX.setCss(e.rowElement, WUX.CSS.ERROR);
                }
                if (cp) {
                    e.rowElement.css('font-weight', 'bold');
                }
            });

            this.body
                .addRow()
                .addCol('12')
                .add(this.tabAttr);
        }

        protected updateState(nextState: any[]): void {
            super.updateState(nextState);
            if (this.tabAttr) {
                this.tabAttr.setState(this.state);
            }
        }

        getState(): any[] {
            if (this.tabAttr) {
                this.state = this.tabAttr.getState();
            }
            return this.state;
        }

        getProps(): WUX.WEntity {
            this.props = null;
            if (this.tabAttr) {
                let srd = this.tabAttr.getSelectedRowsData();
                if (srd && srd.length) {
                    this.props = { id: WUtil.getNumber(srd[0], 'ia'), text: WUtil.getString(srd[0], 'da') };
                }
            }
            return this.props;
        }

        protected onClickOk(): boolean {
            let srd = this.tabAttr.getSelectedRowsData();
            if (!srd || !srd.length) {
                WUX.showWarning('Cabina non selezionata.');
                return false;
            }
            let rf = WUtil.getBoolean(srd[0], 'rf');
            if (rf) {
                WUX.showWarning('Cabina occupata.');
                return false;
            }
            return true;
        }

        protected onShown() {
            this.tabAttr.scrollTo(0);
            setTimeout(() => {
                if (this.state && this.state.length) {
                    this.tabAttr.refresh();
                }
                else {
                    this.tabAttr.repaint();
                }
            }, 100);
        }
    }

    export class DlgCambioPrest extends WUX.WDialog<WUX.WEntity, any[]> {
        tabPrest: WUX.WDXTable;
        durata: number;
        done: boolean;

        constructor(id: string) {
            super(id, 'DlgCambioPrest');

            this.title = 'Cambio Trattamento';

            let pc = [
                ['Descrizione', IPrestazione.sDESCRIZIONE, 's', false],
                ['Durata', IPrestazione.sDURATA, 'i', true],
                ['Prezzo', IPrestazione.sPREZZO_FINALE, 'c', false]
            ];
            this.tabPrest = new WUX.WDXTable(this.subId('tpr'), WUtil.col(pc, 0), WUtil.col(pc, 1));
            this.tabPrest.types = WUtil.col(pc, 2);
            this.tabPrest.css({ h: 350 });
            this.tabPrest.selectionMode = 'single';
            
            this.body
                .addRow()
                .addCol('12')
                .add(this.tabPrest);
        }

        protected updateState(nextState: any[]): void {
            super.updateState(nextState);
            if (this.tabPrest) {
                this.tabPrest.setState(this.state);
            }
            this.durata = 0;
        }

        getState(): any[] {
            if (this.tabPrest) {
                this.state = this.tabPrest.getState();
            }
            return this.state;
        }

        getProps(): WUX.WEntity {
            this.props = null;
            if (this.tabPrest) {
                let srd = this.tabPrest.getSelectedRowsData();
                if (srd && srd.length) {
                    this.props = {
                        id: WUtil.getNumber(srd[0], IPrestazione.sID),
                        text: WUtil.getString(srd[0], IPrestazione.sDESCRIZIONE),
                        value: WUtil.getNumber(srd[0], IPrestazione.sPREZZO_FINALE)
                    };
                }
            }
            return this.props;
        }

        protected onClickOk(): boolean {
            if (this.done) return true;
            if (this.durata) {
                let srd = this.tabPrest.getSelectedRowsData();
                if (srd && srd.length) {
                    // Si tollerano 10 minuti
                    let dp = WUtil.getNumber(srd[0], IPrestazione.sDURATA) - 10;
                    if (this.durata < dp) {
                        //WUX.confirm('Il trattamento scelto ha una durata diversa. Proseguire?', (res) => {
                        //    if (!res) return;

                        //    this.done = true;
                        //    this.btnOK.trigger('click');
                        //});
                        WUX.showWarning('Il trattamento scelto ha una durata superiore.');
                        this.done = false;
                    }
                    else {
                        this.done = true;
                    }
                }
            }
            else {
                this.done = true;
            }
            return this.done;
        }

        protected onShown() {
            this.tabPrest.scrollTo(0);
            this.done = false;
            setTimeout(() => {
                if (this.state && this.state.length) {
                    this.tabPrest.refresh();
                }
                else {
                    this.tabPrest.repaint();
                }
            }, 100);
        }
    }

    export class DlgOrgPrest extends WUX.WDialog<any, any[]> {
        tabPrestaz: WUX.WDXTable;
        btnUp: WUX.WButton;
        btnDw: WUX.WButton;

        constructor(id: string) {
            super(id, 'DlgOrgPrest');

            this.title = 'Organizza Prestazioni';

            let pc = [
                ['Descrizione', IPrestazione.sDESCRIZIONE, 's', false],
                ['Durata', IPrestazione.sDURATA, 'i', true],
                ['Prezzo', IPrestazione.sPREZZO_FINALE, 'c', false]
            ];
            this.tabPrestaz = new WUX.WDXTable(this.subId('tpr'), WUtil.col(pc, 0), WUtil.col(pc, 1));
            this.tabPrestaz.editable = true;
            this.tabPrestaz.types = WUtil.col(pc, 2);
            this.tabPrestaz.editables = WUtil.col(pc, 3);
            this.tabPrestaz.css({ h: 328 });
            this.tabPrestaz.widths = [240];
            this.tabPrestaz.selectionMode = 'single';

            this.btnUp = new WUX.WButton(this.subId('bu'), '', WUX.WIcon.ARROW_CIRCLE_UP, WUX.BTN.ACT_PRIMARY, { p: '3px 6px 3px 6px' });
            this.btnUp.tooltip = 'Sposta su';
            this.btnUp.on('click', (e: JQueryEventObject) => {
                let srd = this.tabPrestaz.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare il trattamento da spostare.')
                    return;
                }
                let id = srd[0][IPrenotazione.sID];
                let st = this.tabPrestaz.getState();
                let ix = WUtil.indexOf(st, IPrenotazione.sID, id);
                if (ix <= 0) return;

                let p = st[ix - 1];
                let c = st[ix]
                st[ix - 1] = c;
                st[ix] = p;

                this.tabPrestaz.setState(st);

                setTimeout(() => {
                    this.tabPrestaz.select([ix - 1]);
                }, 100);
            });
            this.btnDw = new WUX.WButton(this.subId('bd'), '', WUX.WIcon.ARROW_CIRCLE_DOWN, WUX.BTN.ACT_PRIMARY, { p: '3px 6px 3px 6px' });
            this.btnDw.tooltip = 'Sposta giu\'';
            this.btnDw.on('click', (e: JQueryEventObject) => {
                let srd = this.tabPrestaz.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare il trattamento da spostare.')
                    return;
                }
                let id = srd[0][IPrenotazione.sID];
                let st = this.tabPrestaz.getState();
                let ix = WUtil.indexOf(st, IPrenotazione.sID, id);
                if (ix < 0 || ix == st.length - 1) return;

                let n = st[ix + 1];
                let c = st[ix]
                st[ix + 1] = c;
                st[ix] = n;

                this.tabPrestaz.setState(st);

                setTimeout(() => {
                    this.tabPrestaz.select([ix + 1]);
                }, 100);
            });

            let cntTab0 = new WUX.WContainer(this.subId('ct0'), '');
            cntTab0
                .addRow()
                .addCol('11', { p: 0 })
                .add(this.tabPrestaz)
                .addCol('1', { p: 0 })
                .addStack(WUX.CSS.STACK_BTNS, this.btnUp, this.btnDw);

            this.body
                .addRow()
                .addCol('12')
                .add(cntTab0);
        }

        protected updateState(nextState: any[]): void {
            super.updateState(nextState);
            if (this.tabPrestaz) {
                this.tabPrestaz.setState(this.state);
            }
        }

        getState(): any[] {
            if (this.tabPrestaz) {
                this.state = this.tabPrestaz.getState();
            }
            return this.state;
        }

        protected onShown() {
            setTimeout(() => {
                this.tabPrestaz.repaint();
            }, 100);
        }
    }

    export class DlgNuovoApp extends WUX.WDialog<string, any> {
        txtSearch: WUX.WInput;
        btnNew: WUX.WButton;
        tabClienti: WUX.WDXTable;
        tabPrestaz: WUX.WDXTable;
        fpApp: WUX.WFormPanel;
        lnkNext: WUX.WLink;
        lnkPrev: WUX.WLink;
        appts: number[];
        selCol: CFSelectCollab;
        selCab: CFSelectCabine;
        selTip: CFSelectTipoApp;
        chkOvr: WUX.WCheck;
        chkMat: WUX.WCheck;
        chkPom: WUX.WCheck;
        lblNote: WUX.WLabel;
        tabStorico: WUX.WDXTable;
        idCollStart: number;
        idCliente: number;
        dataPren: Date;
        currDate: number;
        idFar: number;
        idPren: number;
        prestAbil: number[];
        prestSort: any[];
        confCanc: boolean;
        dlgCliente: DlgCliente;
        dlgOrgPres: DlgOrgPrest;
        btnOrgPr: WUX.WButton;
        btnReset: WUX.WButton;
        btnFirst: WUX.WButton;
        // Ctrl doFind
        _sdate: boolean;
        _idcol: number;
        _efind: boolean;
        _count: number;

        constructor(id: string) {
            super(id, 'DlgNuovoApp');

            this.title = 'Nuovo Appuntamento';

            this.idCollStart = 0;
            this.idCliente = 0;
            this.dataPren = null;
            this.appts = [];
            this.prestAbil = [];
            this.prestSort = [];
            this.currDate = WUtil.toNumber(new Date());
            this.idFar = 0;
            this.idPren = 0;
            this.confCanc = false;

            this._sdate = false;
            this._idcol = 0;
            this._efind = false;
            this._count = 0;

            this.dlgCliente = new DlgCliente(this.subId('dlc'));
            this.dlgCliente.onHiddenModal((e: JQueryEventObject) => {
                if (!this.dlgCliente.ok) return;
                let cliente = this.dlgCliente.getState();
                if (!cliente) return;
                this.tabClienti.setState([cliente]);
                this.lblNote.setState('');
                setTimeout(() => {
                    this.tabClienti.select([0]);
                }, 100);
            });

            this.dlgOrgPres = new DlgOrgPrest(this.subId('dlp'))
            this.dlgOrgPres.onHiddenModal((e: JQueryEventObject) => {
                if (this.dlgCliente.cancel) return;
                this.prestSort = this.dlgOrgPres.getState();
            });

            this.btnNew = new WUX.WButton(this.subId('bba'), '', GUI.ICO.ADD, WUX.BTN.PRIMARY, { p: '1px 6px 0px 6px' });
            this.btnNew.tooltip = 'Registra nuovo cliente';
            this.btnNew.on('click', (e: JQueryEventObject) => {
                this.dlgCliente.setState(null);
                this.dlgCliente.show(this);
            });

            this.txtSearch = new WUX.WInput('txtTest', WUX.WInputType.Text);
            this.txtSearch.css({ w: '84%' });
            this.txtSearch.tooltip = 'Ricerca cliente';
            this.txtSearch.placeHolder = 'Ricerca cliente';
            this.txtSearch.onEnterPressed((e: WUX.WEvent) => {
                let text = this.txtSearch.getState();
                if (!text) {
                    WUX.showWarning('Riportare un criterio di ricerca per il cliente');
                    return;
                }
                let filter = {};
                filter[ICliente.sNOMINATIVO] = text;
                jrpc.execute('CLIENTI.find', [filter], (result: any[]) => {
                    if (result && result.length) {
                        this.tabClienti.setState(result);
                        if (result.length == 1) {
                            setTimeout(() => {
                                this.tabClienti.select([0]);
                            }, 100);
                        }
                    }
                    else {
                        this.tabClienti.setState([]);
                    }
                });
            });

            let cntCliente = new WUX.WContainer(this.subId('ccl'));
            cntCliente.add(this.txtSearch).addSpan(8).add(this.btnNew);

            let rc = [
                ['Cognome', ICliente.sCOGNOME],
                ['Nome', ICliente.sNOME],
                ['Telefono', ICliente.sTELEFONO1]
            ];
            this.tabClienti = new WUX.WDXTable(this.subId('tcl'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabClienti.css({ h: 300 });
            this.tabClienti.widths = [100];
            this.tabClienti.selectionMode = 'single';
            this.tabClienti.onSelectionChanged((e: { element?: JQuery, selectedRowsData?: Array<any> }) => {
                let srd = this.tabClienti.getSelectedRowsData();
                if (!srd || !srd.length) return;
                let idc = WUtil.getNumber(srd[0], ICliente.sID);
                if (!idc) return;
                this.idCliente = idc;
                jrpc.execute('CLIENTI.read', [idc], (result) => {
                    if (!result) {
                        WUX.showWarning('Dati cliente ' + idc + ' non disponibili.');
                        return;
                    }
                    let prnz = WUtil.getArray(result, ICliente.sPRENOTAZIONI);
                    let note = WUtil.getString(result, ICliente.sNOTE);
                    this.tabStorico.setState(prnz);
                    this.lblNote.setState(note);
                });
            });
            this.tabClienti.onRowPrepared((e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number }) => {
                if (!e.data) return;
                if (e.data[ICliente.sREPUTAZIONE]) {
                    WUX.setCss(e.rowElement, WUX.CSS.ERROR);
                }
            });
            this.tabClienti.onDoubleClick((e: { element?: JQuery }) => {
                let srd = this.tabClienti.getSelectedRowsData();
                if (!srd || !srd.length) return;
                this.dlgCliente.setState(srd[0]);
                this.dlgCliente.show();
            });

            let pc = [
                ['Descrizione', IPrestazione.sDESCRIZIONE, 's', false],
                ['Durata', IPrestazione.sDURATA, 'i', true],
                ['Prezzo', IPrestazione.sPREZZO_FINALE, 'c', false]
            ];
            this.tabPrestaz = new WUX.WDXTable(this.subId('tpr'), WUtil.col(pc, 0), WUtil.col(pc, 1));
            this.tabPrestaz.editable = true;
            this.tabPrestaz.types = WUtil.col(pc, 2);
            this.tabPrestaz.editables = WUtil.col(pc, 3);
            this.tabPrestaz.css({ h: 328 });
            this.tabPrestaz.widths = [320];
            this.tabPrestaz.selectionMode = 'multiple';
            this.tabPrestaz.filter = true;
            this.tabPrestaz.onSelectionChanged((e: { element?: JQuery, selectedRowsData?: Array<any> }) => {
                let psrd = this.tabPrestaz.getSelectedRowsData();
                if (!psrd || !psrd.length) {
                    this.fpApp.setValue(IPrenotazione.sPREZZO_FINALE, null);
                    this.fpApp.setValue(IPrenotazione.sDURATA, null);
                    return false;
                }
                let tot = 0;
                let dur = 0;
                for (let i = 0; i < psrd.length; i++) {
                    tot += WUtil.getNumber(psrd[i], IPrestazione.sPREZZO_FINALE);
                    dur += WUtil.getNumber(psrd[i], IPrestazione.sDURATA);
                }
                this.fpApp.setValue(IPrenotazione.sPREZZO_FINALE, WUX.formatCurr(tot));
                this.fpApp.setValue(IPrenotazione.sDURATA, dur);
            });
            this.tabPrestaz.onRowPrepared((e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number }) => {
                if (!e.data) return;
                if (!this.prestAbil || !this.prestAbil.length) return;
                let idPrest = WUtil.getNumber(e.data, IPrestazione.sID);
                if (this.prestAbil.indexOf(idPrest) >= 0) {
                    e.rowElement.css('font-weight', 'bold');
                }
            });
            this.tabPrestaz.onRowUpdated((e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, error?: Error }) => {
                setTimeout(() => {
                    let psrd = this.tabPrestaz.getSelectedRowsData();
                    if (!psrd || !psrd.length) return false;
                    let dur = 0;
                    for (let i = 0; i < psrd.length; i++) {
                        dur += WUtil.getNumber(psrd[i], IPrestazione.sDURATA);
                    }
                    this.fpApp.setValue(IPrenotazione.sDURATA, dur);
                }, 100);
            });

            this.lblNote = new WUX.WLabel(this.subId('lbln'), '', '', null, WUX.CSS.LABEL_NOTICE);

            let sc = [
                ['Data App.', IPrenotazione.sDATA_APP, 'd'],
                ['Ora App.', IPrenotazione.sORA_APP, 's'],
                ['Durata', IPrenotazione.sDURATA, 'i'],
                ['Stato', IPrenotazione.sSTATO, 's'],
                ['Collaboratore', IPrenotazione.sDESC_COLL, 's'],
                ['Trattamento', IPrenotazione.sDESC_PREST, 's'],
                ['Cabina', IPrenotazione.sDESC_ATTR, 's'],
                ['Data Pren.', IPrenotazione.sDATA_PREN, 'd'],
                ['Note', IPrenotazione.sNOTE, 's']
            ];

            this.tabStorico = new WUX.WDXTable(this.subId('tps'), WUtil.col(sc, 0), WUtil.col(sc, 1));
            this.tabStorico.types = WUtil.col(sc, 2);
            this.tabStorico.css({ h: 150, f: 10 });
            this.tabStorico.onRowPrepared((e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number }) => {
                if (!e.data) return;
                let stato = WUtil.getString(e.data, IPrenotazione.sSTATO, 'C');
                let pdata = WUtil.getNumber(e.data, IPrenotazione.sDATA_APP);
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
                if (pdata == this.currDate) {
                    e.rowElement.css('font-weight', 'bold');
                }
            });

            this.selCol = new CFSelectCollab();
            this.selCol.on('statechange', (w: WUX.WEvent) => {
                let idColl = WUtil.toNumber(this.selCol.getState());
                if (!idColl) {
                    this.prestAbil = [];
                    this.tabPrestaz.repaint();
                }
                else {
                    if (this._count == 0) this.idCollStart = idColl;
                    jrpc.execute('COLLABORATORI.getServices', [idColl], (result: any[]) => {
                        if (!result) return;
                        this.prestAbil = result;
                        this.tabPrestaz.repaint();
                    });
                }
                if (!this.selCol.count) return;
                if (!this._efind) return;
                if (this._idcol && idColl != this._idcol) this.doFind();
            });

            this.selCab = new CFSelectCabine();
            this.selTip = new CFSelectTipoApp();
            this.chkOvr = new WUX.WCheck('', 'Ignora controlli');
            this.chkMat = new WUX.WCheck('', 'fino alle 14:00');
            this.chkPom = new WUX.WCheck('', 'dalle 14:00');

            this.btnOrgPr = new WUX.WButton(this.subId('bro'), 'Organizza', GUI.ICO.TOOL, WUX.BTN.SECONDARY);
            this.btnOrgPr.on('click', (e: JQueryEventObject) => {
                let psrd = this.getSelectedPrest(true);
                if (!psrd || !psrd.length) return;
                this.dlgOrgPres.setState(psrd);
                this.dlgOrgPres.show(this);
            });

            this.btnReset = new WUX.WButton(this.subId('brs'), GUI.TXT.RESET, GUI.ICO.RESET, WUX.BTN.DANGER);
            this.btnReset.on('click', (e: JQueryEventObject) => {
                this.appts = [];
                this._sdate = false;
                this._idcol = 0;
                this._efind = false;
                this._count = 0;
                this.fpApp.setValue(IPrenotazione.sID_COLL, null);
                this.fpApp.setValue(IPrenotazione.sID_ATTR, null);
                this.fpApp.setValue(IPrenotazione.sDATA_APP, null);
                this.fpApp.setValue(IPrenotazione.sORA_APP, null);
                this.tabPrestaz.clearSelection();
                this.tabPrestaz.clearFilter();
            });
            this.btnFirst = new WUX.WButton(this.subId('bfa'), GUI.TXT.SEARCH, GUI.ICO.SEARCH, WUX.BTN.WARNING);
            this.btnFirst.on('click', (e: JQueryEventObject) => {
                let psrd = this.tabPrestaz.getSelectedRowsData();
                if (!psrd || !psrd.length) {
                    WUX.showWarning('Selezionare uno o pi&ugrave; trattamenti.');
                    return;
                }
                this.doFind();
            });
            let cntBtns = new WUX.WContainer(this.subId(), null, { a: 'right' });
            cntBtns.add(this.btnOrgPr).addSpan(5).add(this.btnReset).addSpan(5).add(this.btnFirst);

            let isOper = isBookOper();

            this.fpApp = new WUX.WFormPanel(this.subId('fpa'));
            this.fpApp.addRow();
            this.fpApp.addComponent(IPrenotazione.sID_COLL, 'Collaboratore', this.selCol);
            this.fpApp.addRow();
            this.fpApp.addComponent(IPrenotazione.sID_ATTR, 'Cabina', this.selCab);
            this.fpApp.addComponent(IPrenotazione.sTIPO, 'Tipo', this.selTip);
            this.fpApp.addRow();
            this.fpApp.addDateField(IPrenotazione.sDATA_APP, 'Data');
            this.fpApp.addTextField(IPrenotazione.sORA_APP, 'Ora');
            this.fpApp.addRow();
            this.fpApp.addTextField(IPrenotazione.sDURATA, 'Durata', true);
            this.fpApp.addTextField(IPrenotazione.sPREZZO_FINALE, 'Totale &euro;', true);
            this.fpApp.addRow();
            this.fpApp.addTextField(IPrenotazione.sNOTE, 'Note');
            this.fpApp.addRow();
            if (isOper) {
                this.fpApp.addBlankField();
            }
            else {
                this.fpApp.addComponent(IPrenotazione.sIGNORE_CHECK, 'Forzatura', this.chkOvr.getWrapper());
            }
            this.fpApp.addComponent(IPrenotazione.sMATTINO, 'Mattino', this.chkMat.getWrapper());
            this.fpApp.addComponent(IPrenotazione.sPOMERIGGIO, 'Pomeriggio', this.chkPom.getWrapper());
            // Flag over booking
            this.fpApp.addInternalField(IPrenotazione.sOVERBOOKING);

            this.lnkPrev = new WUX.WLink(this.subId('lnkp'), '', GUI.ICO.LEFT);
            this.lnkPrev.tooltip = 'Data precedente';
            this.lnkPrev.on('click', (e: JQueryEventObject) => {
                this._efind = false;
                let dataApp = WUtil.toDate(this.fpApp.getValue(IPrenotazione.sDATA_APP));
                if (!dataApp) {
                    WUX.showWarning('Data non selezionata.');
                    return;
                }
                if (!this._idcol) {
                    WUX.showWarning('Interrogare le disponibilit&agrave;.');
                    return;
                }
                if (!this.idCollStart) this.fpApp.setValue(IPrenotazione.sID_COLL, null);
                this.doFind(null, dataApp);
            });
            this.lnkNext = new WUX.WLink(this.subId('lnkn'), '', GUI.ICO.RIGHT);
            this.lnkNext.tooltip = 'Data successiva';
            this.lnkNext.on('click', (e: JQueryEventObject) => {
                this._efind = false;
                let dataApp = WUtil.toDate(this.fpApp.getValue(IPrenotazione.sDATA_APP));
                if (!dataApp) {
                    WUX.showWarning('Data non selezionata.');
                    return;
                }
                if (!this._idcol) {
                    WUX.showWarning('Interrogare le disponibilit&agrave;.');
                    return;
                }
                if (!this.idCollStart) this.fpApp.setValue(IPrenotazione.sID_COLL, null);
                dataApp.setDate(dataApp.getDate() + 1);
                this.doFind(dataApp);
            });
            this.fpApp.setLabelLinks(IPrenotazione.sDATA_APP, [this.lnkPrev, this.lnkNext]);

            this.fpApp.onChangeDate((e: JQueryEventObject) => {
                let fid = WUX.lastSub($(e.target));
                if (fid == IPrenotazione.sDATA_APP) {
                    if (this._sdate) {
                        this._sdate = false;
                        return;
                    }
                    if (this.fpApp.isBlank(IPrenotazione.sDATA_APP)) return;
                    if (!this._efind) return;
                    this.doFind();
                }
            });

            this.fpApp.onFocus(IPrenotazione.sORA_APP, (e: JQueryEventObject) => {
                let $t = $(e.target);
                $t.autocomplete({
                    source: (req, res: (data) => void) => {
                        if (!this.appts) return;
                        let r = [];
                        for (let i = 0; i < this.appts.length; i++) {
                            let l = WUX.formatTime(this.appts[i]);
                            r.push({ id: this.appts[i], label: l, value: l });
                        }
                        res(r);
                    },
                    minLength: 0,
                    open: (e) => {
                        $('.ui-autocomplete').css('width', $t.innerWidth() + 'px');
                    },
                    select: (e, c) => {
                        // c.item.id, c.item.label, c.item.value
                        this.fpApp.setValue(IPrenotazione.sORA_APP, c.item.value);
                    }
                }).keydown();
            });

            this.fpApp.setMandatory(IPrenotazione.sDATA_APP, IPrenotazione.sORA_APP);

            this.body
                .addRow()
                .addCol('3')
                .addStack({ pt: 2, pb: 2, a: 'left' }, cntCliente, this.tabClienti)
                .addCol('5')
                .add(this.tabPrestaz)
                .addCol('4')
                .add(this.fpApp)
                .add(cntBtns)
                .addRow()
                .addCol('12')
                .addStack({ pt: 2, pb: 2, a: 'left' }, this.lblNote, this.tabStorico);
        }

        getSelectedPrest(msg?: boolean): any[] {
            let psrd = this.tabPrestaz.getSelectedRowsData();
            if (!psrd || !psrd.length) {
                if (msg) WUX.showWarning('Selezionare uno o pi&ugrave; trattamenti.');
                return [];
            }
            if (this.prestSort && this.prestSort.length) {
                let r = [];
                for (let i = 0; i < this.prestSort.length; i++) {
                    let p = this.prestSort[i];
                    let ix = WUtil.indexOf(psrd, IPrestazione.sID, p.id);
                    if (ix >= 0) {
                        r.push(psrd[ix]);
                        psrd.splice(ix, 1);
                    }
                }
                for (let i = 0; i < psrd.length; i++) {
                    r.push(psrd[i]);
                }
                return r;
            }
            return psrd;
        }

        setIdFar(idf: number, idc?: number) {
            this.selCol.setIdFar(idf, idc);
            this.selCab.setIdFar(idf);

            if (idf) {
                if (this.idFar != idf) {
                    this.idFar = idf;
                    jrpc.execute('PRESTAZIONI.getAll', [this.idFar], (result: any[]) => {
                        if (result) {
                            // keep original values
                            for (let i = 0; i < result.length; i++) {
                                result[i][IPrestazione.sDURATA + '_'] = result[i][IPrestazione.sDURATA];
                            }
                            this.tabPrestaz.setState(result);
                        }
                        else {
                            this.tabPrestaz.setState([]);
                        }
                    });
                }
            }
            else {
                this.idFar = 0;
                this.tabPrestaz.setState([]);
                WUX.showWarning('Riferimento alla struttura non presente');
            }
        }

        protected doFind(fromDate?: Date, toDate?: Date): this {
            console.log('doFind fromDate=' + WUX.formatDate(fromDate) + ',toDate=' + WUX.formatDate(toDate));
            console.trace();
            this._efind = false;
            this._count++;
            let psrd = this.getSelectedPrest(false);
            if (!psrd || !psrd.length) return this;
            this.appts = [];
            let aprest = [];
            let durate = [];
            for (let i = 0; i < psrd.length; i++) {
                aprest.push(psrd[i][IPrestazione.sID]);
                durate.push(psrd[i][IPrestazione.sDURATA]);
            }
            let app = this.fpApp.getValues();
            app[IPrenotazione.sPREFERENZE] = '';
            if (app[IPrenotazione.sMATTINO] && !app[IPrenotazione.sPOMERIGGIO]) {
                app[IPrenotazione.sPREFERENZE] = 'M';
            }
            else if (!app[IPrenotazione.sMATTINO] && app[IPrenotazione.sPOMERIGGIO]) {
                app[IPrenotazione.sPREFERENZE] = 'P';
            }
            if (fromDate) {
                app[IPrenotazione.sCAMBIO_DAL] = fromDate;
            }
            else if (toDate) {
                app[IPrenotazione.sCAMBIO_AL] = toDate;
            }
            else {
                app[IPrenotazione.sCAMBIO_DATA] = WUtil.toDate(this.fpApp.getValue(IPrenotazione.sDATA_APP));
            }
            app[IPrenotazione.sPRESTAZIONI] = aprest;
            app[IPrenotazione.sDURATE] = durate;
            app[IPrenotazione.sPREN_ONLINE] = false;
            if (this.idFar) app[IPrenotazione.sID_FAR] = this.idFar;
            console.log('doFind', app);
            jrpc.execute('CALENDARIO.getAvailabilities', [app], (result: Calendario[]) => {
                if (!result || !result.length) {
                    this._idcol = -1;
                    this.fpApp.setValue(IPrenotazione.sORA_APP, '');
                    WUX.showWarning('Non vi sono appuntamenti disponibili.');
                    this._efind = true;
                    return;
                }
                let c = result[0];
                if (c.data) {
                    let msg = 'Primo appuntamento disponibile:<br><strong>' + WUX.formatDate(c.data, true) + '</strong> ';
                    msg += 'alle ore <strong>' + WUX.formatTime(c.oraInizio) + '</strong><br>';
                    msg += 'con <strong>' + c.nomeCollab + '</strong>';
                    if (c.altriCollab) msg += '<br>e con <strong>' + c.altriCollab + '</strong>';
                    WUX.showSuccess(msg);
                    this._sdate = true;
                    this.fpApp.setValue(IPrenotazione.sDATA_APP, c.data);
                    this.fpApp.setValue(IPrenotazione.sORA_APP, WUX.formatTime(c.oraInizio));
                    this._idcol = c.idCollaboratore;
                    this.fpApp.setValue(IPrenotazione.sID_COLL, c.idCollaboratore);
                    if (!this.txtSearch.getState()) {
                        this.txtSearch.focus();
                    }
                }
                this.appts = [];
                for (let i = 0; i < result.length; i++) {
                    let o = result[i].oraInizio;
                    if (this.appts.indexOf(o) < 0) this.appts.push(o);
                }
                this.appts.sort((a, b) => a - b);
                this._efind = true;
            });
            return this;
        }

        protected onClickOk(): boolean {
            if (this.idPren) return true;

            let cs = this.fpApp.checkMandatory(true, true);
            if (cs) {
                WUX.showWarning('Specificare i seguenti campi: ' + cs);
                return false;
            }
            if (!this.idCliente) {
                WUX.showWarning('Selezionare prima un cliente per prenotare un appuntamento');
                return false;
            }
            let psrd = this.getSelectedPrest(true);
            if (!psrd || !psrd.length) return false;
            let aprest = [];
            let durate = [];
            for (let i = 0; i < psrd.length; i++) {
                let d = WUtil.getNumber(psrd[i], IPrestazione.sDURATA);
                let s = WUtil.getString(psrd[i], IPrestazione.sDESCRIZIONE);
                if (!s) {
                    let n = i + 1;
                    s = 'prestazione num. ' + n;
                }
                if (d < 5) {
                    WUX.showWarning('Durata (' + d + ') non valida per ' + s);
                    return false;
                }
                aprest.push(psrd[i][IPrestazione.sID]);
                durate.push(psrd[i][IPrestazione.sDURATA]);
            }
            let app = this.fpApp.getValues();
            app[IPrenotazione.sID_CLIENTE] = this.idCliente;
            app[IPrenotazione.sPRESTAZIONI] = aprest;
            app[IPrenotazione.sDURATE] = durate;
            if (this.idFar) app[IPrenotazione.sID_FAR] = this.idFar;

            let ic = WUtil.getBoolean(app, IPrenotazione.sIGNORE_CHECK);
            let ob = WUtil.getBoolean(app, IPrenotazione.sOVERBOOKING);
            if (ic) {
                app[IPrenotazione.sOVERBOOKING] = true;
                // Se non specificata la cabina si introduce la cabina fittizia -1
                // che consente di non effettura il controllo sulle cabine disponibili.
                if (!app[IPrenotazione.sID_ATTR]) app[IPrenotazione.sID_ATTR] = -1;
            }
            else if (ob) {
                // In caso di over booking senza ignore check si azzera l'eventuale cabina specificata.
                if (app[IPrenotazione.sID_ATTR]) app[IPrenotazione.sID_ATTR] = 0;
            }
            // Esecuzione controllata (viene richiesta la password dell'utente desk)
            // Superato il controllo al primo parametro (oggetto) viene aggiunto il campo userDesk.
            chkExecute('PRENOTAZIONI.book', [app], (result) => {
            // jrpc.execute('PRENOTAZIONI.book', [app], (result) => {
                if (!result) {
                    WUX.showWarning('Prenotazione NON eseguita.');
                    return;
                }
                let msg = WUtil.getString(result, IPrenotazione.sMESSAGGIO);
                if (msg) {
                    WUX.showWarning(msg);
                    return;
                }
                this.idPren = WUtil.getNumber(result, IPrenotazione.sID);
                this.dataPren = WUtil.getDate(result, IPrenotazione.sDATA_APP);
                this.btnOK.trigger('click');
                WUX.showSuccess('Prenotazione eseguita con successo.');
            });
            return false;
        }

        protected onClickCancel(): boolean {
            if (this.confCanc) return true;
            let psrd = this.getSelectedPrest(false);
            if (!psrd || !psrd.length) return true;
            WUX.confirm('Si vuole annullare l\'inserimento di un nuovo appuntamento?', (res) => {
                if (res) {
                    this.confCanc = true;
                    this.btnCancel.trigger('click');
                }
            });
            return false;
        }

        protected updateState(nextState: any): void {
            super.updateState(nextState);

            this._sdate = false;
            this._idcol = 0;
            this._efind = false;
            this._count = 0;

            this.idCollStart = WUtil.getNumber(nextState, IPrenotazione.sID_COLL);
            if (this.fpApp) {
                this.fpApp.clear();
                // Evita che venga richiamata la ricerca
                if (this.state[IPrenotazione.sDATA_APP]) this._sdate = true;

                // Impostare _idcol esattamente prima del setState (per impedire la ricerca automatica)
                this._idcol = this.idCollStart;
                let idf = WUtil.getNumber(nextState, IPrenotazione.sID_FAR);
                if (idf) this.setIdFar(idf, this.idCollStart);
                this.fpApp.setState(this.state);
            }
        }

        getState(): any {
            if (this.fpApp) {
                this.state = this.fpApp.getState();
            }
            return this.state;
        }

        protected onShown() {
            this.idCliente = 0;
            this.appts = [];
            this.prestSort = [];
            this.idPren = 0;
            this.dataPren = null;
            this.confCanc = false;

            this._sdate = false;
            // this._idcol = 0; // Eventualmente impostato in updateState
            this._efind = false;
            this._count = 0;
            // Tale lista non si resetta poiche' viene impostata dalla selezione del collaboratore
            // this.prestAbil = [];

            let a = this.tabPrestaz.getState();
            if (a) {
                // Revert changes
                for (let i = 0; i < a.length; i++) {
                    if (a[i][IPrenotazione.sDURATA + '_'] != null) {
                        a[i][IPrenotazione.sDURATA] = a[i][IPrenotazione.sDURATA + '_'];
                    }
                }
            }

            setTimeout(() => {
                this.txtSearch.setState('');
                this.tabClienti.setState([]);
                this.tabPrestaz.clearSelection();
                this.tabPrestaz.clearFilter();
                this.tabStorico.setState([]);

                this.tabClienti.repaint();
                this.tabPrestaz.repaint();
                this.tabStorico.repaint();

                this.lblNote.setState('');
                this.txtSearch.focus();
            }, 100);
        }

        protected componentDidMount(): void {
            super.componentDidMount();
            let w = $(window).width();
            if (w > 1260) {
                this.cntMain.css({ w: 1260, h: 600 });
            }
            else {
                this.cntMain.css({ w: 1000, h: 600 });
            }
        }
    }
}