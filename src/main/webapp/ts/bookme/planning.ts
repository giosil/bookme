namespace GUI {

    import WUtil = WUX.WUtil;

    export class CFPlanning extends WUX.WComponent<any, any> {
        resources: WUX.WEntity[];
        idFar: number;
        dateCal: Date;
        appts: { [resId_hhmm: string]: Prenotazione };
        slots: { [resId_hhmm: string]: number };
        alist: Prenotazione[];

        $body: JQuery;
        autoScroll: boolean;

        dlgPren: DlgPrenotazione;
        dlgNApp: DlgNuovoApp;
        // Refereziata in GUICalendario
        navCal: CFNavCalendar;
        // Cliente selezionato
        idCliente: number;
        // Sincronizzazione a tempo
        _sync: boolean;
        _syncbk: boolean;
        // Lista prenotazioni on line
        _lstolb: number[];

        readonly COLOR_NA: string = '#dcdcdc'; // Not AVailable (0)
        readonly COLOR_AV: string = '#f5f5f5'; // AVailable     (1)
        readonly COLOR_BK: string = '#bbffbb'; // BooKed        (2)
        readonly COLOR_EX: string = '#ddedf6'; // Executed      (3)
        readonly COLOR_NE: string = '#fecccc'; // Not Executed  (4)
        readonly COLOR_SU: string = '#fefecc'; // Suspended     (5)
        readonly COLOR_BK_OL: string = '#aaeeaa'; // BooKed        (-2)
        readonly COLOR_EX_OL: string = '#ccdcf6'; // Executed      (-3)
        readonly COLOR_NE_OL: string = '#edbbbb'; // Not Executed  (-4)
        readonly COLOR_SU_OL: string = '#ededbb'; // Suspended     (-5)

        readonly COLOR_AP: string = '#6d7295'; // Font Appointment
        readonly COLOR_HH: string = '#707070'; // Font Hour
        readonly COLOR_MM: string = '#808080'; // Font Minutes
        readonly COLOR_MK: string = '#ff0000'; // Font Minutes

        constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
            // WComponent init
            super(id ? id : '*', 'CFPlanning', null, classStyle, style, attributes);

            this.forceOnChange = true;

            this._sync = false;
            this._syncbk = false;
            this._lstolb = [];

            this.resources = [];
            this.dateCal = new Date();
            this.appts = {};
            this.slots = {};
            this.alist = [];
            this.idCliente = 0;
            this.autoScroll = true;

            this.dlgPren = new DlgPrenotazione(this.subId('dlgp'));
            this.dlgPren.onHiddenModal((e: JQueryEventObject) => {
                this._sync = this._syncbk;
                if (!this.dlgPren.ok) {
                    if (this.dlgPren.refPlan) {
                        // Refresh Planning
                        let filter = {};
                        filter[ICalendario.sDATA] = this.dateCal;
                        filter[ICalendario.sID_FAR] = this.dlgPren.idFar;
                        jrpc.execute('CALENDARIO.getPlanning', [filter], (result) => {

                            this.autoScroll = !this.dlgPren.idCliente;
                            this.setState(result);
                            let r = this.mark(this.dlgPren.idCliente);
                            if (!r || !r.length) {
                                this.scroll(this.dlgPren.oraPren);
                            }

                        });
                    }
                    return;
                }

                if (this.dlgPren.dataPren && !WUtil.isSameDate(this.dlgPren.dataPren, this.dateCal)) {

                    if (this.navCal) {
                        this.idCliente = this.dlgPren.idCliente;
                        this.navCal.setState(this.dlgPren.dataPren);
                    }

                }
                else {
                    // Refresh Planning
                    let filter = {};
                    filter[ICalendario.sDATA] = this.dateCal;
                    filter[ICalendario.sID_FAR] = this.dlgPren.idFar;
                    jrpc.execute('CALENDARIO.getPlanning', [filter], (result) => {

                        this.autoScroll = !this.dlgPren.idCliente;
                        this.setState(result);
                        let r = this.mark(this.dlgPren.idCliente);
                        if (!r || !r.length) {
                            this.scroll(this.dlgPren.oraPren);
                        }

                    });
                }
            });

            this.dlgNApp = new DlgNuovoApp(this.subId('dlgn'));
            this.dlgNApp.onHiddenModal((e: JQueryEventObject) => {
                this._sync = this._syncbk;
                if (!this.dlgNApp.ok) return;

                if (this.dlgNApp.dataPren && !WUtil.isSameDate(this.dlgNApp.dataPren, this.dateCal)) {
                    if (this.navCal) {
                        this.idCliente = this.dlgNApp.idCliente;
                        this.navCal.setState(this.dlgNApp.dataPren);
                    }
                }
                else {
                    // Refresh Planning
                    let filter = {};
                    filter[ICalendario.sDATA] = this.dateCal;
                    filter[ICalendario.sID_FAR] = this.dlgNApp.idFar;
                    jrpc.execute('CALENDARIO.getPlanning', [filter], (result) => {

                        this.autoScroll = !this.dlgNApp.idCliente;
                        this.setState(result);
                        let r = this.mark(this.dlgNApp.idCliente);
                        if (!r || !r.length) {
                            this.scrollFirst();
                        }

                    });
                }
            });

            // Sincronizzazione automatica
            setInterval(() => {
                console.log(WUX.formatDateTime(new Date(), true) + ' _sync=' + this._sync);
                if (!this._sync) return;
                let filter = {};
                filter[ICalendario.sDATA] = this.dateCal;
                filter[ICalendario.sID_FAR] = this.idFar;
                jrpc.execute('CALENDARIO.getOnLineBookings', [filter], (result: number[]) => {
                    console.log('CALENDARIO.getOnLineBookings -> ' + JSON.stringify(result));
                    let so = WUtil.size(this._lstolb);
                    let sn = WUtil.size(result);
                    this._lstolb = result;
                    let df = false;
                    if (sn != so) {
                        df = true;
                    }
                    else if (so && sn) {
                        // Si comincia dall'ultimo poiche' e' piu' probabile incontrare prima le differenze
                        for (let i = so - 1; i >= 0; i--) {
                            if (this._lstolb[i] != result[i]) {
                                df = true;
                                break;
                            }
                        }
                    }
                    if (df) {
                        if (sn) {
                            WUX.showSuccess(sn + ' appuntamenti on line');
                        }
                        if (!this._sync) {
                            console.log('CALENDARIO.getPlanning not invoked _sync=' + this._sync);
                            return;
                        }
                        console.log('CALENDARIO.getPlanning...');
                        jrpc.execute('CALENDARIO.getPlanning', [filter], (resgetp) => {
                            if (!this._sync) return;
                            this.setState(resgetp);
                        }, (e: JRPCError) => {
                            console.error('CALENDARIO.getPlanning: ' + e.message);
                        });
                    }
                }, (e: JRPCError) => {
                    console.error('CALENDARIO.getOnLineBookings: ' + e.message);
                });

            }, 30000); 
        }

        public stopSync(): this {
            this._sync = false;
            this._syncbk = false;
            return this;
        }

        public startSync(): this {
            this._sync = true;
            this._syncbk = true;
            return this;
        }

        public suspendSync(): this {
            this._sync = false;
            return this;
        }

        public resumeSync(force?: boolean): this {
            this._sync = this._syncbk;
            return this;
        }

        public showPren(id: number) {
            if (!id) return
            this._sync = false;
            jrpc.execute('PRENOTAZIONI.read', [id], (result) => {
                if (!result) {
                    WUX.showWarning('Prenotazione ' + id + ' non disponibile.');
                    this._sync = this._syncbk;
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
        }

        public onClick(hhmm: number, resIdx: number) {
            if (resIdx < 0) return;
            if (hhmm < 0 || hhmm > 2359) return;
            if (!this.resources || !this.resources.length) return;
            if (this.resources.length <= resIdx) {
                WUX.showWarning('Risorsa non disponbile.');
                return;
            }
            let fhhmm = WUX.formatTime(hhmm);

            let r = this.resources[resIdx];
            if (!r || !r.id) {
                WUX.showWarning('Risorsa non identificabile.');
                return;
            }
            this._sync = false;
            if (this.slots) {
                let s = this.slots[r.id + '_' + hhmm];
                if (!s) {
                    WUX.confirm('Stai prenotando in un orario fuori lavorativo. Procedere?', (res: any) => {
                        if (!res) return;
                        // Nuovo appuntamento
                        let app = {};
                        app[IPrenotazione.sID_FAR] = this.idFar;
                        app[IPrenotazione.sDATA_APP] = this.dateCal;
                        app[IPrenotazione.sORA_APP] = fhhmm;
                        app[IPrenotazione.sID_COLL] = r.id;
                        app[IPrenotazione.sOVERBOOKING] = true;
                        this.dlgNApp.setState(app);
                        this.dlgNApp.show();
                    });
                }
                else if (s == 1) {
                    // Nuovo appuntamento
                    let app = {};
                    app[IPrenotazione.sID_FAR] = this.idFar;
                    app[IPrenotazione.sDATA_APP] = this.dateCal;
                    app[IPrenotazione.sORA_APP] = fhhmm;
                    app[IPrenotazione.sID_COLL] = r.id;
                    app[IPrenotazione.sOVERBOOKING] = false;
                    this.dlgNApp.setState(app);
                    this.dlgNApp.show();
                }
                else if (s > 1 || s < 0) {
                    // Prenotata
                    if (!this.appts) {
                        WUX.showWarning('Informazioni prenotazione non disponibili');
                        return;
                    }
                    let pren: Prenotazione;
                    let c = hhmm;
                    while (true) {
                        pren = this.appts[r.id + '_' + c];
                        if (pren) break;
                        let hh = Math.floor(c / 100);
                        let mm = c % 100;
                        if (mm > 0) {
                            mm = mm - 10;
                        }
                        else {
                            hh = hh - 1;
                            mm = 50;
                        }
                        if (hh < 0) break;
                        c = hh * 100 + mm;
                    }
                    if (!pren) {
                        WUX.showWarning('Informazioni prenotazione assenti');
                        return;
                    }
                    else {
                        this.showPren(pren.id);
                    }
                }
                return;
            }
            // Nuovo appuntamento
            WUX.confirm('Stai prenotando in un orario fuori lavorativo. Procedere?', (res: any) => {
                if (!res) return;
                let app = {};
                app[IPrenotazione.sID_FAR] = this.idFar;
                app[IPrenotazione.sDATA_APP] = this.dateCal;
                app[IPrenotazione.sORA_APP] = fhhmm;
                app[IPrenotazione.sID_COLL] = r.id;
                app[IPrenotazione.sOVERBOOKING] = true;
                this.dlgNApp.setState(app);
                this.dlgNApp.show();
            });
        }

        newApp(): this {
            this._sync = false;
            let app = {};
            app[IPrenotazione.sID_FAR] = this.idFar;
            // app[IPrenotazione.sDATA_APP] = this.dateCal;
            // Si imposta sempre il giorno corrente per un appuntamento nuovo
            // senza aver selezionato un orario dal planning.
            app[IPrenotazione.sDATA_APP] = new Date();
            this.dlgNApp.setState(app);
            this.dlgNApp.show();
            return this;
        }

        protected updateState(nextState: any) {
            super.updateState(nextState);
            this.idFar = WUtil.getNumber(this.state, ICalendario.sID_FAR);
            this.dateCal = WUtil.getDate(this.state, ICalendario.sDATA);
            BookmeCfg.CHECK_USER_DESK = WUtil.getBoolean(this.state, ICalendario.sCHECK_USER_DESK);
            if (!this.mounted) return;
            if (this.state) {
                this.resources = WUtil.getArray(this.state, ICalendario.sRISORSE);
                this.appts = WUtil.getObject(this.state, ICalendario.sAPPUNTAMENTI);
                this.slots = WUtil.getObject(this.state, ICalendario.sSLOTS);
                if (!this.resources) this.resources = [];
                if (!this.appts) this.appts = {};
                if (!this.slots) this.slots = {};
                this.alist = [];
                for (let k in this.appts) {
                    if (this.appts.hasOwnProperty(k)) {
                        let a = WUtil.getArray(this.appts, k);
                        this.alist.push(...a);
                    }
                }
            }
            else {
                this.resources = [];
                this.appts = {};
                this.slots = {};
                this.alist = [];
            }
        }

        protected componentDidMount(): void {
            this._lstolb = [];
            if (!this.resources || !this.resources.length) return;

            let $dh = $('<div style="overflow-y:scroll;"></div>')
            this.root.append($dh);

            var wh = $(window).height();
            let ph = wh - 150;
            if (ph < 400) ph = 400;

            // font-size header
            let fh = 12;
            // font-size body
            let fs = 14;
            // line-height
            let lh = fs - 1;

            let alnk: string[] = [];
            let th = '<table style="table-layout:fixed;width:100%;border-collapse:collapse;">';
            th += '<thead><tr>';
            for (let i = 0; i < this.resources.length; i++) {
                let r = this.resources[i];
                let ilnk = this.subId(r.id);
                alnk.push(ilnk);
                if (!r.color) r.color = 'ffffff';
                th += '<td style="border:1px solid #b5b5b5;"><div style="width:100%;text-align:center;height:30px;overflow-x:hidden;font-size:' + fh + 'px;font-weight:bold;"><a href="#" id="' + ilnk + '">' + r.text + '</a></div><div style="width:100%;height:10px;background-color:#' + r.color + '"></div></td>';
            }
            th += '</tr></thead>';
            th += '</table>';
            $dh.append(th);

            let idb = this.subId('db');
            this.$body = $('<div id="' + idb + '" style="height:' + ph + 'px;overflow-x:hidden;overflow-y:scroll;"></div>')
            this.root.append(this.$body);

            let itb = this.subId('tb');
            let tb = '<table id="' + itb + '" style="table-layout:fixed;width:100%;border-collapse:collapse;cursor:pointer;">';
            tb += '<tbody>';
            for (let h = 0; h < 24; h++) {
                let hh = h < 9 ? '0' + h : '' + h;
                for (let m = 0; m < 60; m += 10) {
                    let mm = m < 10 ? '0' + m : '' + m;
                    let hm = h * 100 + m;

                    tb += '<tr>';
                    for (let i = 0; i < this.resources.length; i++) {
                        let r = this.resources[i];
                        let c = this.COLOR_NA;
                        let s = this.slots[r.id + '_' + hm];
                        if (!s) s = 0;
                        switch (s) {
                            case 1:
                                c = this.COLOR_AV;
                                break;
                            case 2:
                                c = this.COLOR_BK;
                                break;
                            case -2:
                                c = this.COLOR_BK_OL;
                                break;
                            case 3:
                                c = this.COLOR_EX;
                                break;
                            case -3:
                                c = this.COLOR_EX_OL;
                                break;
                            case 4:
                                c = this.COLOR_NE;
                                break;
                            case -4:
                                c = this.COLOR_NE_OL;
                                break;
                            case 5:
                                c = this.COLOR_SU;
                                break;
                            case -5:
                                c = this.COLOR_SU_OL;
                                break;
                        }
                        let pren = this.appts[r.id + '_' + hm];
                        if (pren) {
                            if (pren.id && s < 0) {
                                this._lstolb.push(pren.id);
                            }
                            let dc = pren.descCliente;
                            if (dc && dc.length > 5) dc = dc.substring(0, 5);
                            let dp = pren.descPrest;
                            if (dp && dp.length > 5) dp = dp.substring(0, 5);
                            if (!dc) dc = '&nbsp;';
                            if (!dp) dp = '&nbsp;';
                            let da = '<br>' + dc + '<br>' + dp;
                            let ds = '';
                            if (pren.tipo == 'F') {
                                ds = 'background-image:url(/bookme/img/heart.png);background-repeat:no-repeat;';
                            }
                            else if (pren.tipo == 'O') {
                                ds = 'background-image:url(/bookme/img/star.png);background-repeat:no-repeat;';
                            }
                            tb += '<td style="border:1px solid #b5b5b5;"><div style="line-height:' + lh + 'px;font-size:' + fs + 'px;width:100%;text-align:center;overflow:hidden;background-color:' + c + ';color:' + this.COLOR_AP + ';font-weight:bold;' + ds + '"><span id="a' + pren.id + '">' + hh + ':' + mm + da + '</span></div></td>';
                        }
                        else if (mm == '00') {
                            let tm = s < 2 ? hh + ':' + mm : '';
                            let da = '<br>&nbsp;<br>&nbsp;';
                            tb += '<td style="border:1px solid #b5b5b5;"><div style="line-height:' + lh + 'px;font-size:' + fs + 'px;width:100%;text-align:center;overflow:hidden;background-color:' + c + ';color:' + this.COLOR_HH + ';font-weight:bold;">' + tm + da + '</div></td>';
                        }
                        else {
                            let tm = s < 2 ? hh + ':' + mm : '';
                            let da = '<br>&nbsp;<br>&nbsp;';
                            tb += '<td style="border:1px solid #b5b5b5;"><div style="line-height:' + lh + 'px;font-size:' + fs + 'px;width:100%;text-align:center;overflow:hidden;background-color:' + c + ';color:' + this.COLOR_MM + ';">' + tm + da + '</div></td>';
                        }
                    }
                    tb += '</tr>';
                }
            }
            tb += '</tbody>';
            tb += '</table>';
            this.$body.append(tb);

            let isOper = isBookOper();
            if (!isOper) {
                for (let i = 0; i < alnk.length; i++) {
                    let $l = $('#' + alnk[i]);
                    if (!$l.length) continue;
                    $l.on('click', (e: JQueryEventObject) => {
                        if (isDevMode()) {
                            WUX.openURL('index.html?c=GUICollaboratori&id=' + WUX.lastSub(e.target) + '&idFar=' + this.idFar, true, true);
                        }
                        else {
                            WUX.openURL('collaboratori?id=' + WUX.lastSub(e.target) + '&idFar=' + this.idFar, true, true);
                        }
                    });
                }
            }

            let $tb = $('#' + itb);
            if ($tb.length) {
                let _self = this;
                this.root.on('click', 'tbody tr td', function (e) {
                    let $this = $(this);
                    let r = $this.parent().index();
                    let c = $this.index();

                    let hh = Math.floor((r * 10) / 60);
                    let mm = (r * 10) % 60;
                    let hhmm = hh * 100 + mm;
                    
                    _self.onClick(hhmm, c);
                });
            }

            if (this.autoScroll) {
                if (this.idCliente) {

                    let r = this.mark(this.idCliente);
                    if (!r || !r.length) {
                        this.scrollFirst();
                    }

                    this.idCliente = 0;
                }
                else {

                    setTimeout(() => {
                        let sh = this.$body[0].scrollHeight;
                        let st = Math.floor((sh * 8) / 24);
                        this.$body.animate({
                            scrollTop: st
                        }, 'fast');
                    }, 200);

                }
            }
        }

        mark(a: string | number): Prenotazione[] {
            console.log('CFPlanning.mark(' + a + ')');
            if (!this.alist || !this.alist.length) return [];
            if (!a) return [];
            let r: Prenotazione[] = [];
            let h: number = -1;
            if (typeof a == 'string') {
                for (let i = 0; i < this.alist.length; i++) {
                    let p = this.alist[i];
                    if (a == '!' && p.idAttr == 0) {
                        r.push(p);
                        let o = WUtil.toIntTime(p.oraApp);
                        if (h < 0 || h > o) h = o;
                    }
                    else if (p.descCliente.toLowerCase().indexOf(a.toLowerCase().trim()) >= 0) {
                        r.push(p);
                        let o = WUtil.toIntTime(p.oraApp);
                        if (h < 0 || h > o) h = o;
                    }
                    let $a = $('#a' + p.id);
                    if ($a.length) $a.css('color', this.COLOR_AP);
                }
            }
            else {
                for (let i = 0; i < this.alist.length; i++) {
                    let p = this.alist[i];
                    if (p.idCliente == a) {
                        r.push(p);
                        let o = WUtil.toIntTime(p.oraApp);
                        if (h < 0 || h > o) h = o;
                    }
                    let $a = $('#a' + p.id);
                    if ($a.length) $a.css('color', this.COLOR_AP);
                }
            }
            for (let i = 0; i < r.length; i++) {
                let $a = $('#a' + r[i].id);
                if ($a.length) $a.css('color', this.COLOR_MK);
            }
            if (h >= 0) this.scroll(h);
            return r;
        }

        scrollFirst(): number {
            return this.scroll(800);
        }

        scroll(hhmm: string | number): number {
            console.log('CFPlanning.scroll(' + hhmm + ')');
            if (!this.$body) return;
            let hh = 0;
            let mm = 0;
            if (typeof hhmm == 'string') {
                let sep = hhmm.indexOf(':');
                if (sep) {
                    hh = WUtil.toNumber(hhmm.substring(0, sep));
                    mm = WUtil.toNumber(hhmm.substring(sep + 1));
                }
                else {
                    let time = WUtil.toNumber(hhmm);
                    if (time > 99) {
                        hh = Math.floor(time / 100);
                        mm = time % 100;
                    }
                    else {
                        hh = time;
                    }
                }
            }
            else {
                hh = Math.floor(hhmm / 100);
                mm = hhmm % 100;
            }
            let sh = this.$body[0].scrollHeight;
            let st = Math.floor((sh * hh) / 24 + (sh * mm) / 1440);
            this.$body.animate({ scrollTop: st }, 'fast');
            console.log('CFPlanning.scroll(' + hhmm + ') -> ' + st);
            return st;
        }
    }

    export class CFNavCalendar extends WUX.WComponent<number, Date> {
        container: WUX.WContainer
        selFar: CFSelectStruture;
        chkSel: WUX.WCheck;
        lnkPrev: WUX.WLink;
        lnkNext: WUX.WLink;
        lnkDate: WUX.WLink;
        lnkAttr: WUX.WLink;
        dlgDate: DlgDataCal;
        dlgAttr: DlgAttrRis;
        c0: string;
        c1: string;
        c2: string;

        constructor(id: string) {
            super(id ? id : '*', 'CFNavCalendar');
            this.state = new Date();

            this.dlgDate = new DlgDataCal(this.subId('ddc'));
            this.dlgDate.onHiddenModal((e: JQueryEventObject) => {
                if (this.dlgDate.cancel) return;
                let date = this.dlgDate.getState();
                if (!date) return;
                this.setState(date);

                setTimeout(() => {
                    // Keeps the session active
                    $.get("/wrapp/api/nop");
                }, 0);
            });

            this.dlgAttr = new DlgAttrRis(this.subId('dda'));
        }

        onClickPrev(h: (e: JQueryEventObject) => any) {
            if (!this.handlers['_clickprev']) this.handlers['_clickprev'] = [];
            this.handlers['_clickprev'].push(h);
        }

        onClickNext(h: (e: JQueryEventObject) => any) {
            if (!this.handlers['_clicknext']) this.handlers['_clicknext'] = [];
            this.handlers['_clicknext'].push(h);
        }

        prev() {
            if (this.lnkPrev) this.lnkPrev.trigger('click');
        }

        next() {
            if (this.lnkNext) this.lnkNext.trigger('click');
        }

        protected render() {
            this.lnkDate = new WUX.WLink(this.subId('lt'));
            this.lnkDate.css({ f: 16, fw: '600' });
            this.lnkDate.setState(this.formatDate(this.state));
            this.lnkDate.on('click', (e: JQueryEventObject) => {
                this.dlgDate.setState(this.state);
                this.dlgDate.show();
            });

            this.lnkPrev = new WUX.WLink(this.subId('lp'), '', WUX.WIcon.LARGE + WUX.WIcon.ANGLE_LEFT);
            this.lnkPrev.css({ f: 18, fw: '600', pr: 16 });
            this.lnkPrev.tooltip = 'F7';
            this.lnkPrev.on('click', (e: JQueryEventObject) => {
                if (!this.state) this.state = new Date();
                this.state.setDate(this.state.getDate() - 1);
                this.lnkDate.setState(this.formatDate(this.state, true));
                if (!this.handlers['_clickprev']) return;
                for (let h of this.handlers['_clickprev']) h(e);
            });
            this.lnkNext = new WUX.WLink(this.subId('ln'), '', WUX.WIcon.LARGE + WUX.WIcon.ANGLE_RIGHT);
            this.lnkNext.css({ f: 18, fw: '600', pl: 16 });
            this.lnkNext.tooltip = 'F8';
            this.lnkNext.on('click', (e: JQueryEventObject) => {
                if (!this.state) this.state = new Date();
                this.state.setDate(this.state.getDate() + 1);
                this.lnkDate.setState(this.formatDate(this.state, true));
                if (!this.handlers['_clicknext']) return;
                for (let h of this.handlers['_clicknext']) h(e);
            });

            this.lnkAttr = new WUX.WLink(this.subId('la'), 'Cabine riservate', GUI.ICO.WORK);
            this.lnkAttr.tooltip = 'Cabine riservate';
            this.lnkAttr.on('click', (e: JQueryEventObject) => {
                if (!this.state) {
                    WUX.showWarning('Data non selezionata');
                    return;
                }
                let idf = WUtil.toNumber(this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Struttura non selezionata');
                    return;
                }
                jrpc.execute('ATTREZZATURE.getRiservate', [idf, this.state], (result: any[]) => {
                    if (!result || !result.length) {
                        WUX.showWarning('Non vi sono cabine riservate');
                    }
                    this.dlgAttr.setProps(this.state);
                    this.dlgAttr.setState(result);
                    this.dlgAttr.show();
                });
            });

            this.chkSel = new WUX.WCheck(this.subId('sc'), '');
            this.chkSel.on('statechange', (e: WUX.WEvent) => {
                if (this.chkSel.checked && !this.selFar.enabled) {
                    WUX.confirm('Si vuole abilitare la selezione della struttura?', (res) => {
                        if (!res) {
                            setTimeout(() => {
                                this.chkSel.checked = false;
                            }, 100);
                            return;
                        }
                        this.selFar.enabled = true;
                    });
                }
                else {
                    this.selFar.enabled = false;
                }
            });

            this.selFar = new CFSelectStruture();
            this.selFar.enabled = false;
            this.selFar.on('statechange', (e: WUX.WEvent) => {
                let sidf = WUtil.toString(this.selFar.getState());
                if (sidf) {
                    let l = sidf.charAt(sidf.length - 1);
                    switch (l) {
                        case '1':
                            WUX.setCss($('#' + this.c0), WUX.CSS.SUCCESS);
                            WUX.setCss($('#' + this.c1), WUX.CSS.SUCCESS);
                            WUX.setCss($('#' + this.c2), WUX.CSS.SUCCESS);
                            break;
                        case '3':
                            WUX.setCss($('#' + this.c0), WUX.CSS.INFO);
                            WUX.setCss($('#' + this.c1), WUX.CSS.INFO);
                            WUX.setCss($('#' + this.c2), WUX.CSS.INFO);
                            break;
                        case '5':
                            WUX.setCss($('#' + this.c0), WUX.CSS.WARNING);
                            WUX.setCss($('#' + this.c1), WUX.CSS.WARNING);
                            WUX.setCss($('#' + this.c2), WUX.CSS.WARNING);
                            break;
                        case '9':
                            WUX.setCss($('#' + this.c0), WUX.CSS.ERROR);
                            WUX.setCss($('#' + this.c1), WUX.CSS.ERROR);
                            WUX.setCss($('#' + this.c2), WUX.CSS.ERROR);
                            break;
                        default:
                            WUX.setCss($('#' + this.c0), { bg: 'white' });
                            WUX.setCss($('#' + this.c1), { bg: 'white' });
                            WUX.setCss($('#' + this.c2), { bg: 'white' });
                            break;
                    }
                }
                this.trigger('propschange', WUtil.toNumber(this.selFar.getState()));
            });

            let cntFar = new WUX.WContainer(this.subId('cnf'));
            cntFar
                .addRow()
                .addCol('1')
                .add(this.chkSel)
                .addCol('11')
                .add(this.selFar);

            this.c0 = this.subId('c0');
            this.c1 = this.subId('c1');
            this.c2 = this.subId('c2');

            this.container = new WUX.WContainer();
            this.container
                .addRow()
                .addCol('3', { bg: 'white', a: 'left', pt: 5, pb: 6, pl: 8 }, this.c0)
                .add(cntFar)
                .addCol('6', { bg: 'white', a: 'center', pt: 5, pb: 6 }, this.c1)
                .addLine(WUX.CSS.LINE_BTNS, this.lnkPrev, this.lnkDate, this.lnkNext)
                .addCol('3', { bg: 'white', a: 'right', pt: 10, pb: 10, pr: 8 }, this.c2)
                .add(this.lnkAttr);

            return this.container;
        }

        getProps(): number {
            if (this.selFar) this.props = WUtil.toNumber(this.selFar.getState());
            return this.props;
        }

        protected updateState(nextState: Date): void {
            super.updateState(nextState);
            if (!this.mounted) return;
            this.updateView();
        }

        protected updateProps(nextProps: number) {
            super.updateProps(nextProps);
            if (this.selFar) this.selFar.setState(this.props);
        }

        protected updateView(): void {
            if (this.state) {
                this.lnkDate.setState(this.formatDate(this.state, true));
                this.lnkPrev.visible = true;
                this.lnkNext.visible = true;
            }
            else {
                this.lnkDate.setState('');
                this.lnkPrev.visible = false;
                this.lnkNext.visible = false;
            }
        }

        isToday(): boolean {
            return WUtil.isSameDate(this.state, new Date());
        }

        formatDate(d: Date, h: boolean = true): string {
            if (!d) return '';
            let t = new Date();
            let pf = '';
            if (h) {
                let a = WUX.WUtil.getCurrDate(-2);
                let y = WUX.WUtil.getCurrDate(-1);
                let w = WUX.WUtil.getCurrDate(1);
                let z = WUX.WUtil.getCurrDate(2);
                let id = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
                let it = t.getFullYear() * 10000 + (t.getMonth() + 1) * 100 + t.getDate();
                let iy = y.getFullYear() * 10000 + (y.getMonth() + 1) * 100 + y.getDate();
                let ia = a.getFullYear() * 10000 + (a.getMonth() + 1) * 100 + a.getDate();
                let iw = w.getFullYear() * 10000 + (w.getMonth() + 1) * 100 + w.getDate();
                let iz = z.getFullYear() * 10000 + (z.getMonth() + 1) * 100 + z.getDate();
                if (id == it) {
                    pf = '<strong>Oggi</strong> ';
                }
                else if (id == iy) {
                    pf = '<strong>Ieri</strong> ';
                }
                else if (id == ia) {
                    pf = '<strong>Ieri l\'altro</strong> ';
                }
                else if (id == iw) {
                    pf = '<strong>Domani</strong> ';
                }
                else if (id == iz) {
                    pf = '<strong>Dopodomani</strong> ';
                }
            }
            return pf + WUX.formatDay(d.getDay()) + ', ' + d.getDate() + ' ' + WUX.formatMonth(d.getMonth() + 1, true) + ', ' + d.getFullYear();
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