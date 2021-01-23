namespace GUI {

    import WUtil = WUX.WUtil;

    export let strutture: WUX.WEntity[];

    export let cp_orari: AgendaModello[];
    export let cp_prest: any[];
    export let cp_attrz: any[];
    export let cp_collb: any[];

    export class AppTableActions extends WUX.WComponent {
        left: WUX.WContainer;
        right: WUX.WContainer;

        constructor(id: string) {
            // WComponent init
            super(id, 'AppTableActions', null, 'table-actions-wrapper');
            // AppTableActions init
            this.left = new WUX.WContainer(this.subId('l'), 'left-actions');
            this.right = new WUX.WContainer(this.subId('r'), 'right-actions');
        }

        protected componentDidMount(): void {
            let $i = $('<div class="table-actions clearfix" data-b2x-sticky-element="1" data-b2x-sticky-element-z-index="3"></div>');
            this.root.append($i);
            this.left.mount($i);
            this.right.mount($i);
        }

        setLeftVisible(v: boolean) {
            this.left.visible = v;
        }

        setRightVisible(v: boolean) {
            this.right.visible = v;
        }
    }

    export class CFSelectMesi extends WUX.WSelect2 {
        constructor(id?: string, mesi: number = 12, pros: number = 0) {
            super(id);
            this.multiple = false;
            this.name = 'CFSelectMesi';
            this.options = [] as WUX.WEntity[];
            let currDate = new Date();
            let currMonth = currDate.getMonth() + 1;
            let currYear = currDate.getFullYear();
            if (pros > 0) {
                currMonth += pros;
                if (currMonth > 12) {
                    currMonth -= 12;
                    if (currMonth > 12) currMonth = 1;
                    currYear++;
                }
            }
            for (let i = 0; i < mesi; i++) {
                let m = currYear * 100 + currMonth;
                this.options.push({ id: m, text: WUX.formatMonth(currMonth, true, currYear) });
                currMonth--;
                if (currMonth == 0) {
                    currMonth = 12;
                    currYear--;
                }
            }
        }
    }

    export class CFSelectStruture extends WUX.WSelect2 {
        items: WUX.WEntity[];
        constructor(id?: string, multiple?: boolean) {
            super(id);
            this.multiple = multiple;
            this.name = 'CFSelectStruture';
            this.openOnFocus = false;
        }

        protected componentDidMount(): void {
            this.items = [];
            if (strutture) {
                this.items = strutture;
                let options: Select2Options = {
                    data: this.items,
                    placeholder: "",
                    allowClear: true,
                };
                this.init(options);
                return;
            }
            let user = getUserLogged();
            let idff = 0;
            if (user && user.structures && user.structures.length) {
                idff = WUtil.toNumber(user.structures[0]);
            }
            let result = jrpc.executeSync('STRUTTURE.getFarmacie', [idff]);
            if (!result) result = [];
            for (var i = 0; i < result.length; i++) {
                let r = result[i];
                this.items.push({ id: r['i'], text: r['c'] + ' - ' + r['d'] });
            }
            strutture = this.items;
            let options: Select2Options = {
                data: this.items,
                placeholder: "",
                allowClear: true,
            };
            this.init(options);
        }
    }

    export class CFSelOpzClienti extends WUX.WSelect2 {
        items: WUX.WEntity[];
        strts: WUX.WEntity[];
        constructor(id?: string, multiple?: boolean) {
            super(id);
            this.multiple = multiple;
            this.name = 'CFSelOpzClienti';
            this.openOnFocus = false;
        }

        protected componentDidMount(): void {
            this.items = [];
            this.strts = [];
            this.items.push({ id: 'M', text: 'inseriti dall\'operatore corrente' });
            let user = getUserLogged();
            let idff = 0;
            if (user && user.structures && user.structures.length) {
                idff = WUtil.toNumber(user.structures[0]);
            }
            let result = jrpc.executeSync('STRUTTURE.getFarmacie', [idff]);
            if (!result) result = [];
            for (var i = 0; i < result.length; i++) {
                let r = result[i];
                this.items.push({ id: r['i'], text: 'prenotati in ' + r['d'] });
                this.strts.push({ id: r['i'], text: r['c'] + ' - ' + r['d'] });
            }
            strutture = this.strts;
            let options: Select2Options = {
                data: this.items,
                placeholder: "",
                allowClear: true,
            };
            this.init(options);
        }
    }

    export class CFSelectTipoPrezzo extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean) {
            super(id);
            this.multiple = multiple;
            this.name = 'CFSelectTipoPrezzo';
            this.options = [
                { id: '', text: '' },
                { id: 'F', text: 'Fisso' },
                { id: 'A', text: 'A partire da' }
            ];
        }
    }

    export class CFSelectLav extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean) {
            super(id);
            this.multiple = multiple;
            this.name = 'CFSelectLav';
            this.options = [
                { id: '', text: '' },
                { id: 'L', text: 'Lavora' },
                { id: 'N', text: 'Non lavora' }
            ];
        }
    }

    export class CFSelectStatiPren extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean) {
            super(id);
            this.multiple = multiple;
            this.name = 'CFSelectStatiPren';
            this.options = [
                { id: '', text: '' },
                { id: 'C', text: 'Confermata' },
                { id: 'E', text: 'Eseguita' },
                { id: 'N', text: 'Non presentato' },
                { id: 'F', text: 'Fuori uscita' },
                { id: 'A', text: 'Annullata' },
                { id: '*', text: 'Compreso Annullata' }
            ];
        }
    }

    export class CFSelectTipoCom extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean) {
            super(id);
            this.multiple = multiple;
            this.name = 'CFSelectTipoCom';
            this.options = [
                { id: '', text: '' },
                { id: 'S', text: 'SMS' },
                { id: 'N', text: 'Notifica' },
                { id: 'M', text: 'Misto (SMS/Notifica)' },
            ];
        }
    }

    export class CFSelectAppTipoPag extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean) {
            super(id);
            this.multiple = multiple;
            this.name = 'CFSelectAppTipoPag';
            this.options = [
                { id: '', text: '' },
                { id: 'CPN', text: 'Coupon' },
                { id: 'CON', text: 'Contanti' },
                { id: 'CAR', text: 'Carta di credito' },
                { id: 'BAN', text: 'Bancomat' },
                { id: 'ASS', text: 'Assegno' },
                { id: 'BON', text: 'Bonifico' },
                { id: 'OMA', text: 'Omaggio' },
                { id: 'NES', text: 'Nessuno' }
            ];
        }
    }

    export class CFSelectTipoApp extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean) {
            super(id);
            this.multiple = multiple;
            this.name = 'CFSelectTipoApp';
            this.options = [
                { id: '', text: '' },
                { id: 'F', text: 'Fidelity' },
                { id: 'O', text: 'Omaggio' }
            ];
        }

        close(): void {
            if (!this.root) return;
            this.root.select2('close');
        }
    }

    export class CFSelectOrario extends WUX.WSelect2 {
        allSlots: WUX.WEntity[];

        constructor(id?: string, multiple?: boolean) {
            super(id);
            this.multiple = multiple;
            this.name = 'CFSelectOrario';
            this.options = [];
            this.allSlots = [];
            for (let h = 0; h < 24; h++) {
                let hh = h < 10 ? '0' + h : '' + h;
                for (let m = 0; m < 60; m+=10) {
                    let mm = m < 10 ? '0' + m : '' + m;
                    let hm = h * 100 + m;
                    this.options.push({ id: hm, text: hh + ':' + mm });
                    this.allSlots.push({ id: hm, text: hh + ':' + mm });
                }
            }
        }

        setAppts(a: number[]): this {
            if (!a || !a.length) {
                this.setOptions([]);
                return this;
            }
            let s: WUX.WEntity[] = [];
            for (let i = 0; i < a.length; i++) {
                s.push({ id: a[i], text: WUX.formatTime(a[i]) });
            }
            this.setOptions(s);
            return this;
        }

        setAllSlots(): this {
            this.setOptions(this.allSlots);
            return this;
        }
    }

    export class CFSelectGruppiPre extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean) {
            super(id);
            this.multiple = multiple;
            this.name = 'CFSelectGruppiPre';
        }

        protected componentDidMount(): void {
            jrpc.execute('PRESTAZIONI.lookupGruppi', [{}], (result) => {
                let data = [];
                for (var i = 0; i < result.length; i++) {
                    var r = result[i];
                    var d = { id: r[0], text: r[1] };
                    data.push(d);
                }
                let options: Select2Options = {
                    data: data,
                    placeholder: "",
                    allowClear: true,
                };
                this.init(options);
            });
        }
    }

    export class CFSelectTipiPre extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean) {
            super(id);
            this.multiple = multiple;
            this.name = 'CFSelectGruppiPre';
        }

        protected componentDidMount(): void {
            jrpc.execute('PRESTAZIONI.lookupTipi', [{}], (result) => {
                let data = [];
                for (var i = 0; i < result.length; i++) {
                    var r = result[i];
                    var d = { id: r[0], text: r[1] };
                    data.push(d);
                }
                let options: Select2Options = {
                    data: data,
                    placeholder: "",
                    allowClear: true,
                };
                this.init(options);
            });
        }
    }

    export class CFSelectCabine extends WUX.WSelect2 {
        idFar: number;

        constructor(id?: string, multiple?: boolean) {
            super(id);
            this.multiple = multiple;
            this.name = 'CFSelectCabine';
            this.idFar = 0;
            this.openOnFocus = false;
        }

        setIdFar(idf: number, val?: number): this {
            if (!idf) {
                this.idFar = 0;
                let options: Select2Options = {
                    data: [],
                    placeholder: "",
                    allowClear: true,
                };
                this.init(options);
                return this;
            }
            if (this.idFar == idf) {
                if (val) this.setState(val);
                return;
            }
            this.idFar = idf;
            jrpc.execute('ATTREZZATURE.getAll', [this.idFar], (result) => {
                let data = [];
                for (var i = 0; i < result.length; i++) {
                    var r = result[i];
                    var d = { id: r[IAttrezzatura.sID], text: r[IAttrezzatura.sDESCRIZIONE] };
                    data.push(d);
                }
                let options: Select2Options = {
                    data: data,
                    placeholder: "",
                    allowClear: true,
                };
                this.init(options);
                if (val) {
                    setTimeout(() => {
                        this.setState(val);
                    }, 100);
                }
            });
            return this;
        }

        protected componentDidMount(): void {
            let idf = this.idFar;
            // Si azzera per effettuare l'invocazione esclusa da if (this.idFar == idf)
            this.idFar = 0;
            this.setIdFar(idf);
        }
    }

    export class CFSelectCollab extends WUX.WSelect2 {
        idFar: number;
        onlyVis: boolean;

        constructor(id?: string, multiple?: boolean) {
            super(id);
            this.multiple = multiple;
            this.name = 'CFSelectCollab';
            this.idFar = 0;
            this.openOnFocus = false;
            this.onlyVis = true;
        }

        setIdFar(idf: number, val?: number): this {
            if (!idf) {
                this.idFar = 0;
                let options: Select2Options = {
                    data: [],
                    placeholder: "",
                    allowClear: true,
                };
                this.init(options);
                return this;
            }
            if (this.idFar == idf) {
                if (val) this.setState(val);
                return;
            }
            this.idFar = idf;
            let params = this.onlyVis ? [this.idFar] : [this.idFar, this.onlyVis];
            jrpc.execute('COLLABORATORI.getAll', params, (result) => {
                let data = [];
                for (var i = 0; i < result.length; i++) {
                    var r = result[i];
                    var d = { id: r[ICollaboratore.sID], text: r[ICollaboratore.sNOME] };
                    data.push(d);
                }
                let options: Select2Options = {
                    data: data,
                    placeholder: "",
                    allowClear: true,
                };
                this.init(options);
                if (val) {
                    setTimeout(() => {
                        this.setState(val);
                    }, 100);
                }
            });
            return this;
        }

        protected componentDidMount(): void {
            let idf = this.idFar;
            // Si azzera per effettuare l'invocazione esclusa da if (this.idFar == idf)
            this.idFar = 0;
            this.setIdFar(idf);
        }
    }

    export class CFSelectClienti extends WUX.WSelect2 {

        constructor(id?: string, multiple?: boolean) {
            super(id, [], multiple);
            this.name = 'CFSelectClienti';
        }

        protected componentDidMount(): void {
            let options: Select2Options = {
                ajax: {
                    dataType: "json",
                    delay: 400,
                    processResults: function (result, params) {
                        return {
                            results: result
                        };
                    },
                    transport: function (params: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null): JQueryXHR {
                        jrpc.execute("CLIENTI.lookup", [params.data], success);
                        return undefined;
                    }
                },
                placeholder: "",
                allowClear: true,
                minimumInputLength: 3
            };
            this.init(options);
        }
    }

    export class CFSelectColore extends WUX.WComponent<string, string> {
        colors: string[];
        items: JQuery[];

        constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
            // WComponent init
            super(id ? id : '*', 'CFSelectColore', null, classStyle, style, attributes);
            this.colors = ['7bd148', '5484ed', 'a4bdfc', '46d6db', '7ae7bf', '51b749', 'fbd75b', 'ffb878', 'ff887c', 'dc2127', 'dbadff', 'e1e1e1'];
            this.items = [];
        }

        protected updateState(nextState: string) {
            super.updateState(nextState);
            if (this.state && this.state[0] == '#') {
                this.state = this.state.substring(1);
            }
            if (!this.mounted) return;
            this.updateView();
        }

        clear() {
            this.setState('');
        }

        protected componentDidMount(): void {
            this.items = [];
            for (let i = 0; i < this.colors.length; i++) {
                let $i = $('<span style="display:inline-block;width:25px;height:25px;cursor:pointer;border-radius:50%;background-color:#' + this.colors[i] + ';"></span>');
                this.items.push($i);
                this.root.append($i);
                this.root.append('&nbsp;');
                $i.on('click', (e: JQueryEventObject) => {
                    if (!this._enabled) return;
                    if (e.target) {
                        let $t = $(e.target);
                        let bg = this.rgb2hex($t.css('background-color'));
                        this.setState(bg);
                    }
                });
            }
        }

        protected updateView(): void {
            for (let i = 0; i < this.items.length; i++) {
                let $i = this.items[i];
                let bg = this.rgb2hex($i.css('background-color'));
                if (this.state && bg == ('#' + this.state)) {
                    $i.css('border', '2px solid rgba(0,0,0,.5)');
                }
                else {
                    $i.css('border', 'none');
                }
            }
        }

        protected rgb2hex(bg): string {
            if (!bg) return '';
            var rgb = bg.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
            return (rgb && rgb.length === 4) ? "#" +
                ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : bg;
        }
    }

    export class CFOrariSett extends WUX.WComponent<string, AgendaModello[]> {
        protected fp: WUX.WFormPanel;
        protected ck: WUX.WCheck;
        protected lc: WUX.WLink;
        protected lp: WUX.WLink;
        title: string;
        evenWeek: boolean;
        oddWeek: boolean;

        constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
            // WComponent init
            super(id ? id : '*', 'CFOrariSett', null, classStyle, style, attributes);
            this.title = 'orario';
        }

        set enabled(b: boolean) {
            this._enabled = b;
            if (this.fp) {
                this.fp.enabled = b;
                if (b) {
                    let v = this.fp.getValues();
                    for (let i = 1; i <= 7; i++) {
                        let l = v['l' + i] == 'L'; // Lavorativo?
                        if (!l) {
                            this.fp.setEnabled('a' + i, false);
                            this.fp.setEnabled('s' + i, false);
                            this.fp.setEnabled('p' + i, false);
                            this.fp.setEnabled('r' + i, false);
                        }
                    }
                }
            }
        }

        protected updateState(nextState: AgendaModello[]) {
            super.updateState(nextState);
            if (!this.mounted) return;
            if (!this.state) {
                this.fp.clear();
                return;
            }
            let ad = true; // All disabled
            let ld = 0; // Last day
            let ps = false; // Pause
            let v = {};
            for (let i = 0; i <= this.state.length; i++) {
                let am = this.state[i];
                if (!am) continue;
                let g = am.giorno
                if (!g) continue;

                if (this.evenWeek && !am.settPari) continue; 
                if (this.oddWeek && !am.settDispari) continue;

                ps = false;
                if (ld == g) ps = true;
                ld = g;

                if (am.attivo) {
                    ad = false;
                    v['l' + g] = 'L';
                }
                else {
                    v['l' + g] = 'N';
                }
                if (ps) {
                    v['p' + g] = v['s' + g];
                    v['s' + g] = am.oraFine;
                    v['r' + g] = am.oraInizio;

                }
                else {
                    v['a' + g] = am.oraInizio;
                    v['s' + g] = am.oraFine;
                }
            }
            this.ck.checked = !ad;
            this.fp.setState(v);
        }

        getState(): AgendaModello[] {
            this.state = [];
            if (!this.mounted) return this.state;
            let v = this.fp.getValues();
            let c = this.ck.checked;
            for (let i = 1; i <= 7; i++) {

                let l = v['l' + i] == 'L'; // Lavorativo?
                if (!l) continue;

                let a = WUtil.toInt(v['a' + i]); // Attacco
                let s = WUtil.toInt(v['s' + i]); // Stacco
                let p = WUtil.toInt(v['p' + i]); // Pausa
                let r = WUtil.toInt(v['r' + i]); // Rientro
                if (s <= a) continue;
                if (p > a && r > p) {
                    let am0: AgendaModello = {
                        settPari: this.evenWeek,
                        settDispari: this.oddWeek,
                        giorno: i,
                        oraInizio: a,
                        oraFine: p,
                        attivo: c && l
                    };
                    let am1: AgendaModello = {
                        settPari: this.evenWeek,
                        settDispari: this.oddWeek,
                        giorno: i,
                        oraInizio: r,
                        oraFine: s,
                        attivo: c && l
                    };
                    this.state.push(am0);
                    this.state.push(am1);
                }
                else {
                    let am: AgendaModello = {
                        settPari: this.evenWeek,
                        settDispari: this.oddWeek,
                        giorno: i,
                        oraInizio: a,
                        oraFine: s,
                        attivo: c && l
                    };
                    this.state.push(am);
                }
            }
            return this.state;
        }

        clear(): this {
            if (this.fp) this.fp.clear();
            return this;
        }

        setDefaults(): this {
            if (!this.fp) return this;
            let values = {};
            for (let i = 1; i <= 7; i++) {
                if (i == 1 || i == 7) {
                    values['l' + i] = 'N';
                }
                else {
                    values['l' + i] = 'L';
                }
                values['a' + i] = 900;
                values['s' + i] = 1800;
                values['p' + i] = null;
                values['r' + i] = null;
            }
            this.fp.setState(values);
            return this;
        }

        isBlank(): boolean {
            if (!this.fp) return true;
            let v = this.fp.getValues();
            for (let i = 1; i <= 7; i++) {
                if (v['l' + i]) return false;
            }
            return true;
        }

        isActivated(): boolean {
            if (this.ck) return this.ck.checked;
            return false;
        }

        protected render() {
            if (this.title == null) this.title = '';

            this.ck = new WUX.WCheck('', 'Attiva ' + this.title);
            this.ck.on('statechange', (e: WUX.WEvent) => {
                if (this.ck.checked) {
                    if (this.isBlank()) {
                        this.setDefaults();
                    }
                }
            });

            this.lc = new WUX.WLink(this.subId('l_c'), 'Copia', GUI.ICO.COPY);
            this.lc.on('click', (e: JQueryEventObject) => {
                let aam = this.getState();
                if (aam) {
                    for (let i = 0; i < aam.length; i++) {
                        aam[i].settDispari = true;
                        aam[i].settPari = true;
                    }
                    cp_orari = aam;
                    WUX.showSuccess('Orari copiati nella clipboard');
                }
            });
            this.lp = new WUX.WLink(this.subId('l_p'), 'Incolla', GUI.ICO.PASTE);
            this.lp.on('click', (e: JQueryEventObject) => {
                if (!cp_orari) {
                    WUX.showWarning('Non vi sono orari nella clipboard');
                    return;
                }
                this.clear();
                this.setState(cp_orari);
            });
            let ccp = new WUX.WContainer('*', '', { pt: 10, a: 'right' });
            ccp.add(this.lc).addSpan(12).add(this.lp);

            this.fp = new WUX.WFormPanel(this.subId('f'));
            this.fp.addRow();
            this.fp.addComponent('a', '', this.ck.getWrapper())
            this.fp.addBlankField();
            this.fp.addComponent('_c', '', ccp);
            this.fp.addRow();
            this.fp.addCaption('Giorni', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Lavorativi?', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Attacco', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Stacco', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Pausa', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Rientro', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addRow();
            this.fp.addCaption('&nbsp;');
            for (let i = 1; i <= 7; i++) {
                let d = this.descDay(i);
                this.fp.addRow();
                if (i == 7) {
                    this.fp.addCaption(d, '', '', WUX.CSS.LABEL_NOTICE);
                }
                else {
                    this.fp.addCaption(d, '', '', { fw: 'bold' });
                }
                let l = new CFSelectLav();
                l.data = i;
                l.on('statechange', (e: WUX.WEvent) => {
                    let c = e.component;
                    if (!c || !c.enabled) return;
                    let st = c.getState();
                    let ix = c.data;
                    if (!st || st == 'N') {
                        this.fp.setEnabled('a' + ix, false);
                        this.fp.setEnabled('s' + ix, false);
                        this.fp.setEnabled('p' + ix, false);
                        this.fp.setEnabled('r' + ix, false);
                    }
                    else {
                        this.fp.setEnabled('a' + ix, true);
                        this.fp.setEnabled('s' + ix, true);
                        this.fp.setEnabled('p' + ix, true);
                        this.fp.setEnabled('r' + ix, true);
                    }
                });
                this.fp.addComponent('l' + i, '', l);
                this.fp.addComponent('a' + i, '', new CFSelectOrario()); // Attacco
                this.fp.addComponent('s' + i, '', new CFSelectOrario()); // Stacco
                this.fp.addComponent('p' + i, '', new CFSelectOrario()); // Pausa
                this.fp.addComponent('r' + i, '', new CFSelectOrario()); // Rientro
            }
            return this.fp;
        }

        protected descDay(d: number) {
            switch (d) {
                case 1: return 'Luned&igrave;';
                case 2: return 'Marted&igrave;';
                case 3: return 'Mercoled&igrave;';
                case 4: return 'Gioved&igrave;';
                case 5: return 'Venerd&igrave;';
                case 6: return 'Sabato';
                case 7: return 'Domenica';
            }
            return '';
        }
    }

    export class CFOrariPers extends WUX.WComponent<string, {[resId: string]: number[]}> {
        protected fp: WUX.WFormPanel;
        title: string;
        resources: WUX.WEntity[];
        values: any;

        constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
            // WComponent init
            super(id ? id : '*', 'CFOrariPers', null, classStyle, style, attributes);
            this.title = 'orario';

            this.resources = [];

            this.forceOnChange = true;
        }

        protected updateState(nextState: {[resId: string]: number[] }) {
            super.updateState(nextState);
            if (!this.mounted) return;
            if (!this.state || !this.resources) {
                this.fp.clear();
                return;
            }
            let v = {};
            for (let i = 0; i < this.resources.length; i++) {
                let r = this.resources[i];
                if (!r || !r.id) continue;

                let fo = this.state['' + r.id];
                if (!fo || !fo.length) continue;

                // 0 = Ora inizio (attacco)
				// 1 = Ora Fine (stacco / inizio pausa)
				// 2 = Lavora / Non Lavora
				// 3 = Applica personalizzazione (variazione)

				// 4 = Ora inizio (rientro)
				// 5 = Ora Fine (stacco)
				// 6 = Lavora / Non Lavora
				// 7 = Applica personalizzazione (variazione)

                if (fo.length == 4) {
                    v['v' + r.id] = fo[3];
                    v['l' + r.id] = fo[2] ? 'L' : 'N';
                    v['a' + r.id] = fo[0];
                    v['s' + r.id] = fo[1];
                }
                else if (fo.length == 8) {
                    if (fo[3] || fo[7]) {
                        v['v' + r.id] = 1;
                    }
                    else {
                        v['v' + r.id] = 0;
                    }
                    v['l' + r.id] = fo[2] ? 'L' : 'N';
                    v['a' + r.id] = fo[0]; // 0 = Ora inizio (attacco)
                    v['s' + r.id] = fo[5]; // 5 = Ora Fine (stacco)
                    v['p' + r.id] = fo[1]; // 1 = Ora Fine (inizio pausa)
                    v['r' + r.id] = fo[4]; // 4 = Ora inizio (rientro)
                }
            }
            this.values = v;
            this.fp.clear();
            this.fp.setState(v);
        }

        getState(): { [resId: string]: number[] } {
            this.state = {};
            if (!this.mounted) return this.state;
            if (!this.resources) this.resources = [];
            let v = this.fp.getValues();
            for (let i = 0; i < this.resources.length; i++) {
                let r = this.resources[i];
                if (!r || !r.id) continue;

                let f = WUtil.toInt(v['v' + r.id]); // Flag Variazione
                let l = WUtil.toString(v['l' + r.id]) == 'L' ? 1 : 0; // Lavorativo
                let a = WUtil.toInt(v['a' + r.id]); // Attacco
                let s = WUtil.toInt(v['s' + r.id]); // Stacco
                let p = WUtil.toInt(v['p' + r.id]); // Pausa
                let n = WUtil.toInt(v['r' + r.id]); // Rientro

                if (p > a && n > p) {
                    this.state['' + r.id] = [a, p, l, f, n, s, l, f];
                }
                else {
                    this.state['' + r.id] = [a, s, l, f];
                }
            }
            return this.state;
        }

        clear(): this {
            if (this.fp) this.fp.clear();
            return this;
        }

        refresh(): this {
            if (this.fp) {
                this.fp.clear();
                this.fp.setState(this.values);
            }
            return this;
        }

        protected render() {
            if (this.title == null) this.title = '';

            if (!this.resources) this.resources = [];

            this.fp = new WUX.WFormPanel(this.subId('f'));
            this.fp.addRow();
            this.fp.addCaption('Collaboratore', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Lavorativi?', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Attacco', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Stacco', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Pausa', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Rientro', '', '', WUX.CSS.LABEL_INFO);
            for (let i = 0; i < this.resources.length; i++) {
                let r = this.resources[i];
                if (!r || !r.id) continue;

                let l = new CFSelectLav();
                l.data = r.id;
                l.on('statechange', (e: WUX.WEvent) => {
                    let c = e.component;
                    if (!c || !c.enabled) return;
                    let st = c.getState();
                    let rid = c.data;
                    if (!st || st == 'N') {
                        this.fp.setEnabled('a' + rid, false);
                        this.fp.setEnabled('s' + rid, false);
                        this.fp.setEnabled('p' + rid, false);
                        this.fp.setEnabled('r' + rid, false);
                    }
                    else {
                        this.fp.setEnabled('a' + rid, true);
                        this.fp.setEnabled('s' + rid, true);
                        this.fp.setEnabled('p' + rid, true);
                        this.fp.setEnabled('r' + rid, true);
                    }
                });
                let x = new WUX.WCheck('', r.text, 1);

                let vrz = false;
                if (this.state) {
                    let fo = this.state['' + r.id];
                    // 0 = Ora inizio (attacco)
				    // 1 = Ora Fine (stacco / inizio pausa)
				    // 2 = Lavora / Non Lavora
				    // 3 = Applica personalizzazione (variazione)
				    // 4 = Ora inizio (rientro)
				    // 5 = Ora Fine (stacco)
				    // 6 = Lavora / Non Lavora
				    // 7 = Applica personalizzazione (variazione)
                    if (fo && fo.length == 4) {
                        if (fo[3]) vrz = true;
                    }
                    else if (fo && fo.length == 8) {
                        if (fo[3] || fo[7]) vrz = true;
                    }
                }

                this.fp.addRow();
                if (vrz) {
                    this.fp.addComponent('v' + r.id, '', x.getWrapper({ mt: 4, mb: 0, c: 'blue' }));
                }
                else {
                    this.fp.addComponent('v' + r.id, '', x.getWrapper({ mt: 4, mb: 0 }));
                }
                this.fp.addComponent('l' + r.id, '', l);
                this.fp.addComponent('a' + r.id, '', new CFSelectOrario()); // Attacco
                this.fp.addComponent('s' + r.id, '', new CFSelectOrario()); // Stacco
                this.fp.addComponent('p' + r.id, '', new CFSelectOrario()); // Pausa
                this.fp.addComponent('r' + r.id, '', new CFSelectOrario()); // Rientro
            }
            return this.fp;
        }
    }

    export class CFAgenda extends WUX.WComponent<string, Agenda> {
        protected container: WUX.WContainer;
        protected cmpSx: CFOrariSett;
        protected cmpDx: CFOrariSett;
        protected dateRif: Date;

        constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object) {
            // WComponent init
            super(id ? id : '*', 'CFAgenda', null, classStyle, style, attributes);
            this.dateRif = new Date();
        }

        set enabled(b: boolean) {
            this._enabled = b;
            if (this.cmpSx) this.cmpSx.enabled = b;
            if (this.cmpDx) this.cmpDx.enabled = b;
        }

        clear(): this {
            if (this.cmpSx) this.cmpSx.clear();
            if (this.cmpDx) this.cmpDx.clear();
            return this;
        }

        isBlank(): boolean {
            if (this.cmpSx && !this.cmpSx.isBlank()) return false;
            if (this.cmpDx && !this.cmpDx.isBlank()) return false;
            return true;
        }

        isActivated(): boolean {
            return this.cmpSx && this.cmpSx.isActivated();
        }

        protected updateState(nextState: Agenda) {
            super.updateState(nextState);
            if (!this.mounted) return;
            if (!this.state) {
                this.cmpSx.clear();
                this.cmpDx.clear();
                return;
            }
            let aam = this.state.fasceOrarie;
            if (!aam || !aam.length) {
                this.cmpSx.clear();
                this.cmpDx.clear();
                return;
            }
            if (this.state.settimaneAlt) {
                let w = getWeek2020(this.dateRif);
                let sxam: AgendaModello[] = [];
                let dxam: AgendaModello[] = [];
                for (let i = 0; i < aam.length; i++) {
                    let am = aam[i];
                    if (am.settDispari && am.settPari) {
                        sxam.push(am);
                    }
                    else if (am.settDispari && !am.settPari) {
                        if (w % 2 == 0) {
                            dxam.push(am);
                        }
                        else {
                            sxam.push(am);
                        }
                    }
                    else if (!am.settDispari && am.settPari) {
                        if (w % 2 == 0) {
                            sxam.push(am);
                        }
                        else {
                            dxam.push(am);
                        }
                    }
                }
                this.cmpSx.setState(sxam);
                this.cmpDx.setState(dxam);
            }
            else {
                this.cmpSx.setState(aam);
            }
        }

        getState(): Agenda {
            this.state = null;
            if (!this.mounted) return this.state;
            this.state = {
                id: 0
            };
            let salt = this.cmpDx && this.cmpDx.isActivated();
            let fo: AgendaModello[] = [];
            if (this.cmpSx) {
                let sxam = this.cmpSx.getState();
                if (sxam && sxam.length) {
                    for (let i = 0; i < sxam.length; i++) {
                        let am = sxam[i];
                        if (am.oraInizio >= am.oraFine) continue;
                        if (!salt) {
                            am.settPari = true;
                            am.settDispari = true;
                        }
                        fo.push(am);
                    }
                }
            }
            if (this.cmpDx && this.cmpDx.isActivated()) {
                let dxam = this.cmpDx.getState();
                if (dxam && dxam.length) {
                    for (let i = 0; i < dxam.length; i++) {
                        let am = dxam[i];
                        if (am.oraInizio >= am.oraFine) continue;
                        fo.push(am);
                    }
                }
            }
            this.state.settimaneAlt = salt;
            this.state.fasceOrarie = fo;
            return this.state;
        }

        public setDateRef(date: any) {
            this.dateRif = WUtil.toDate(date);
            if (!this.mounted) return;
            let w = getWeek2020(this.dateRif);
            if (w % 2 == 0) {
                this.cmpSx.evenWeek = true;
                this.cmpSx.oddWeek = false;
                this.cmpDx.evenWeek = false;
                this.cmpDx.oddWeek = true;
            }
            else {
                this.cmpSx.evenWeek = false;
                this.cmpSx.oddWeek = true;
                this.cmpDx.evenWeek = true;
                this.cmpDx.oddWeek = false;
            }
        }

        protected render() {
            this.cmpSx = new CFOrariSett(this.subId('osc'));
            this.cmpSx.title = 'settimana corrente';
            this.cmpDx = new CFOrariSett(this.subId('osa'));
            this.cmpDx.title = 'settimana successiva';

            let w = getWeek2020();
            if (w % 2 == 0) {
                this.cmpSx.evenWeek = true;
                this.cmpSx.oddWeek = false;
                this.cmpDx.evenWeek = false;
                this.cmpDx.oddWeek = true;
            }
            else {
                this.cmpSx.evenWeek = false;
                this.cmpSx.oddWeek = true;
                this.cmpDx.evenWeek = true;
                this.cmpDx.oddWeek = false;
            }

            this.container = new WUX.WContainer();

            this.container
                .addRow()
                .addCol('col-md-6 b-r')
                .add(this.cmpSx)
                .addCol('col-md-6')
                .add(this.cmpDx);

            return this.container;
        }
    }
}