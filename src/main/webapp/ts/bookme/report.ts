namespace GUI {

    import WUtil = WUX.WUtil;

    export class GUIRepPro extends WUX.WComponent {
        container: WUX.WContainer;
        tagsFilter: WUX.WTags;
        fpFilter: WUX.WFormPanel;
        selFar: CFSelectStruture;
        selMese: CFSelectMesi;
        btnFind: WUX.WButton;
        btnReset: WUX.WButton;
        // Risultato
        tabResult: WUX.WDXTable;
        // Dialogs
        dlgDet: DlgStoricoColl;

        constructor(id?: string) {
            super(id ? id : '*', 'GUIRepPro');

            this.dlgDet = new DlgStoricoColl(this.subId('dlgd'));
        }

        protected render() {
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', (e: JQueryEventObject) => {
                let labels = this.fpFilter.checkMandatory(true, true);
                if (labels) {
                    WUX.showWarning('Occorre valorizzare i seguenti campi: ' + labels);
                    return false;
                }
                let box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    this.tagsFilter.setState(this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('REPORT.getProduttivita', [this.fpFilter.getState()], (result) => {
                    this.tabResult.setState(result);
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', (e: JQueryEventObject) => {
                this.tabResult.setState([]);
                this.fpFilter.clear();
                this.tagsFilter.setState({});
            });

            this.tagsFilter = new WUX.WTags('tagsFilter');

            this.selFar = new CFSelectStruture();
            this.selFar.on('statechange', (e: WUX.WEvent) => {
                this.tabResult.setState([]);
            });

            this.selMese = new CFSelectMesi();

            this.fpFilter = new WUX.WFormPanel(this.subId('fpf'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent('idFar', 'Struttura', this.selFar);
            this.fpFilter.addComponent('mese', 'Mese', this.selMese);

            this.fpFilter.setMandatory('mese');

            this.fpFilter.onEnterPressed((e: WUX.WEvent) => {
                this.btnFind.trigger('click');
            });

            let rc = [
                ['Collaboratore', 'col', 's'],
                ['Trattamenti', 'pre', 'i'],
                ['Eseguiti', 'ese', 'i'],
                ['Annullati', 'ann', 'i'],
                ['Non Eseguiti', 'nes', 'i'],
                ['Clienti', 'cli', 'i'],
                ['Ese./Cli.', 'rec', 'n'],
                ['Tempo Eseguiti', 'dur', 'n'],
                ['Tempo Libero', 'tli', 'n'],
                ['Tempo Totale', 'tmi', 'n'],
                ['Perc. Libero', 'ptl', 'i'],
                ['Perc. Eseguiti', 'pte', 'i'],
                ['Produttivita\'', 'val', 'i'],
                ['Indice Prod.', 'ipo', 'n'],
                ['Punteggio', 'pti', 'i']
            ];

            this.tabResult = new WUX.WDXTable(this.subId('tab'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.css({ f: 12 });
            this.tabResult.types = WUtil.col(rc, 2);
            this.tabResult.filter = true;
            this.tabResult.exportFile = 'prod_collaboratori';
            this.tabResult.onCellPrepared((e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: DevExpress.ui.dxDataGridColumn, rowIndex?: number, rowType?: string, row?: DevExpress.ui.dxDataGridRowObject, isSelected?: boolean, isExpanded?: boolean, cellElement?: DevExpress.core.dxElement }) => {
                let f = e.column.dataField;
                if (f == 'col') e.cellElement.addClass('clickable');
            });
            this.tabResult.onCellClick((e: { component?: DevExpress.DOMComponent, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: DevExpress.event, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: DevExpress.ui.dxDataGridRowObject }) => {
                let row = e.row;
                if (row != null && row.rowType == 'data') {
                    let f = e.column.dataField;
                    if (f == 'col') {
                        let v = this.fpFilter.getState();
                        let f = {};
                        f['preferenze'] = WUtil.getString(v, 'mese');
                        f['idColl'] = WUtil.getNumber(e.data, 'ico');
                        f['idFar'] = WUtil.getNumber(e.data, 'idf');
                        f['stato'] = '*';
                        jrpc.execute('PRENOTAZIONI.find', [f], (result) => {
                            this.dlgDet.setProps('Collaboratore: ' + e.value);
                            this.dlgDet.setState(result);
                            this.dlgDet.show(this);
                        });
                    }
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
                .addRow()
                .addCol('12').section('Risultato')
                .add(this.tabResult);

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

        protected componentDidMount(): void {
            let idf: number = 0;
            if (strutture && strutture.length) {
                idf = strutture[0].id;
            }
            if (idf) this.selFar.setState(idf);
        }
    }

    export class GUIRepMsg extends WUX.WComponent {
        container: WUX.WContainer;
        tagsFilter: WUX.WTags;
        fpFilter: WUX.WFormPanel;
        selFar: CFSelectStruture;
        selMese: CFSelectMesi;
        btnFind: WUX.WButton;
        btnReset: WUX.WButton;
        // Risultato
        tabResult: WUX.WDXTable;

        constructor(id?: string) {
            super(id ? id : '*', 'GUIRepMsg');
        }

        protected render() {
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', (e: JQueryEventObject) => {
                let labels = this.fpFilter.checkMandatory(true, true);
                if (labels) {
                    WUX.showWarning('Occorre valorizzare i seguenti campi: ' + labels);
                    return false;
                }
                let box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    this.tagsFilter.setState(this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('REPORT.getMessaggi', [this.fpFilter.getState()], (result) => {
                    this.tabResult.setState(result);
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', (e: JQueryEventObject) => {
                this.tabResult.setState([]);
                this.fpFilter.clear();
                this.fpFilter.setValue('dal', WUtil.getCurrDate(0, -1, 0));
                this.fpFilter.setValue('al', WUtil.getCurrDate());
                this.tagsFilter.setState({});
            });

            this.tagsFilter = new WUX.WTags('tagsFilter');

            this.selFar = new CFSelectStruture();
            this.selFar.on('statechange', (e: WUX.WEvent) => {
                this.tabResult.setState([]);
            });

            this.selMese = new CFSelectMesi();

            this.fpFilter = new WUX.WFormPanel(this.subId('fpf'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent('idFar', 'Struttura', this.selFar);
            this.fpFilter.addComponent('mese', 'Mese', this.selMese);

            this.fpFilter.setMandatory('idFar', 'mese');

            this.fpFilter.onEnterPressed((e: WUX.WEvent) => {
                this.btnFind.trigger('click');
            });

            let rc = [
                ['Data', 'dat', 'd'],
                ['Clienti', 'cli', 'i'],
                ['Messaggi', 'msg', 'i'],
                ['Non Inviati', 'err', 'i']
            ];

            this.tabResult = new WUX.WDXTable(this.subId('tab'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.types = WUtil.col(rc, 2);
            this.tabResult.filter = true;
            this.tabResult.exportFile = 'messaggi';

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
                .addRow()
                .addCol('12').section('Risultato')
                .add(this.tabResult);

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

        protected componentDidMount(): void {
            let idf: number = 0;
            if (strutture && strutture.length) {
                idf = strutture[0].id;
            }
            if (idf) this.selFar.setState(idf);
        }
    }

    export class GUIChartsPro extends WUX.WComponent {
        container: WUX.WContainer;
        tagsFilter: WUX.WTags;
        fpFilter: WUX.WFormPanel;
        selFar: CFSelectStruture;
        selMese: CFSelectMesi;
        btnFind: WUX.WButton;
        btnReset: WUX.WButton;
        // Risultato
        chrCE: WUX.WChartJS; // Collaboratore - Eseguiti
        chrCV: WUX.WChartJS; // Collaboratore - Valore
        chrPE: WUX.WChartJS; // Prestazione - Eseguiti
        chrPV: WUX.WChartJS; // Prestazione - Valore
        chrPP: WUX.WChartJS; // Prestazione - Percentuale
        chrGV: WUX.WChartJS; // Giorno - Valore

        constructor(id?: string) {
            super(id ? id : '*', 'GUIRepPro');
        }

        protected render() {
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', (e: JQueryEventObject) => {
                let labels = this.fpFilter.checkMandatory(true, true);
                if (labels) {
                    WUX.showWarning('Occorre valorizzare i seguenti campi: ' + labels);
                    return false;
                }
                let box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    this.tagsFilter.setState(this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('REPORT.getGrafici', [this.fpFilter.getState()], (result) => {
                    if (WUtil.isEmpty(result)) {
                        WUX.showWarning('Non vi sono dati rappresentabili');
                        return;
                    }
                    this.chrCE.setState(result['ce']);
                    this.chrCV.setState(result['cv']);
                    this.chrPE.setState(result['pe']);
                    this.chrPV.setState(result['pv']);
                    this.chrPP.setState(result['pp']);
                    this.chrGV.setState(result['gv']);

                    setTimeout(() => {
                        this.fix();
                    }, 200);
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', (e: JQueryEventObject) => {
                this.chrCE.setState(null);
                this.chrCV.setState(null);
                this.chrPE.setState(null);
                this.chrPV.setState(null);
                this.chrPP.setState(null);
                this.chrGV.setState(null);

                this.fpFilter.clear();
                this.tagsFilter.setState({});
            });

            this.tagsFilter = new WUX.WTags('tagsFilter');

            this.selFar = new CFSelectStruture();
            this.selFar.on('statechange', (e: WUX.WEvent) => {

                this.chrCE.setState(null);
                this.chrCV.setState(null);
                this.chrPE.setState(null);
                this.chrPV.setState(null);
                this.chrPP.setState(null);
                this.chrGV.setState(null);

            });

            this.selMese = new CFSelectMesi();

            this.fpFilter = new WUX.WFormPanel(this.subId('fpf'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent('idFar', 'Struttura', this.selFar);
            this.fpFilter.addComponent('mese', 'Mese', this.selMese);

            this.fpFilter.setMandatory('idFar', 'mese');

            this.fpFilter.onEnterPressed((e: WUX.WEvent) => {
                this.btnFind.trigger('click');
            });

            this.chrCE = new WUX.WChartJS('chrce', 'bar');
            this.chrCV = new WUX.WChartJS('chrcv', 'bar');
            this.chrPE = new WUX.WChartJS('chrpe', 'bar');
            this.chrPV = new WUX.WChartJS('chrpv', 'bar');
            this.chrPP = new WUX.WChartJS('chrpp', 'pie');
            this.chrGV = new WUX.WChartJS('chrgv', 'line');

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
                .addRow()
                    .addCol('6').section('Trattamenti eseguiti collaboratore')
                        .add(this.chrCE)
                    .addCol('6').section('Produttivit&agrave; collaboratori')
                        .add(this.chrCV)
                .addRow()
                    .addCol('6').section('Trattamenti eseguiti')
                        .add(this.chrPE)
                    .addCol('6').section('Valore trattamenti')
                        .add(this.chrPV)
                .addRow()
                    .addCol('6').section('Composizione trattamenti')
                       .add(this.chrPP)
                    .addCol('6').section('Andamento valore')
                       .add(this.chrGV);

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

        protected fix(): void {
            // Quando si espande o si collassa il menu i grafici cambiano dimensione
            // per questo motivo si imposta anche il max-height.
            let r = this.chrCE.getRoot();
            let v = r.height();
            if (v) {
                this.chrCE.css({ h: v, maxh: v });
                this.chrCV.css({ h: v, maxh: v });
                this.chrPE.css({ h: v, maxh: v });
                this.chrPV.css({ h: v, maxh: v });
                this.chrPP.css({ h: v, maxh: v });
                this.chrGV.css({ h: v, maxh: v });
            }
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