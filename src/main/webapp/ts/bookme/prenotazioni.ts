﻿namespace GUI {

    import WUtil = WUX.WUtil;

    export class GUIPrenotazioni extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected tagsFilter: WUX.WTags;
        protected fpFilter: WUX.WFormPanel;
        protected selFar: CFSelectStruture;
        protected selCol: CFSelectCollab;
        protected selCab: CFSelectCabine;
        protected btnFind: WUX.WButton;
        protected btnReset: WUX.WButton;
        // Azioni base
        protected cntActions: AppTableActions;
        // Risultato
        protected tabResult: WUX.WDXTable;
        protected lblResult: WUX.WLabel;
        // Dialog prenotazione
        dlgPren: DlgPrenotazione;

        constructor(id?: string) {
            super(id ? id : '*', 'GUIPrenotazioni');

            this.dlgPren = new DlgPrenotazione(this.subId('dlgp'));
        }

        protected render() {
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', (e: JQueryEventObject) => {
                if (this.fpFilter.isBlank(IPrenotazione.sID_FAR)) {
                    WUX.showWarning('Selezionare la struttura');
                    return;
                }
                let check = this.fpFilter.checkMandatory(true, true, true);
                if (check) {
                    WUX.showWarning('Specificare almeno uno dei seguenti campi: ' + check);
                    return;
                }
                let box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    this.tagsFilter.setState(this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('PRENOTAZIONI.find', [this.fpFilter.getState()], (result: any[]) => {
                    this.tabResult.setState(result);
                    if (result && result.length) {
                        this.lblResult.setState(result.length + ' prenotazioni trovate.');
                    }
                    else {
                        this.lblResult.setState('Nessuna prenotazione trovata.');
                    }
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', (e: JQueryEventObject) => {
                this.tabResult.setState([]);
                this.fpFilter.clear();
                this.fpFilter.setValue(IPrenotazione.sDATA_APP, WUtil.getCurrDate());
                this.fpFilter.setValue(IPrenotazione.sALLA_DATA, null);
                this.tagsFilter.setState({});
                this.lblResult.setState('');
            });

            this.tagsFilter = new WUX.WTags('tagsFilter');

            this.selFar = new CFSelectStruture();
            this.selFar.on('statechange', (e: WUX.WEvent) => {
                this.tabResult.setState([]);
                let idf = WUtil.toNumber(this.selFar.getState());
                this.selCol.setIdFar(idf);
                this.selCab.setIdFar(idf);
            });

            this.selCol = new CFSelectCollab();
            // Nel filtro dei prenotati si considerano anche 
            // i collaboratori non visibili nel planning.
            this.selCol.onlyVis = false;
            this.selCab = new CFSelectCabine();

            this.fpFilter = new WUX.WFormPanel(this.subId('fpf'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent(IPrenotazione.sID_FAR, 'Struttura', this.selFar);
            this.fpFilter.addDateField(IPrenotazione.sDATA_APP, 'Data Appuntamento');
            this.fpFilter.addDateField(IPrenotazione.sALLA_DATA, 'Al');
            this.fpFilter.addRow();
            this.fpFilter.addComponent(IPrenotazione.sID_CLIENTE, 'Cliente', new CFSelectClienti());
            this.fpFilter.addComponent(IPrenotazione.sID_COLL, 'Collaboratore', this.selCol);
            this.fpFilter.addTextField(IPrenotazione.sDESC_PREST, 'Trattamento');
            this.fpFilter.addRow();
            this.fpFilter.addComponent(IPrenotazione.sID_ATTR, 'Cabina', this.selCab);
            this.fpFilter.addComponent(IPrenotazione.sSTATO, 'Stato', new CFSelectStatiPren());
            this.fpFilter.addDateField(IPrenotazione.sDATA_PREN, 'Data Prenotazione');

            this.fpFilter.setMandatory(IPrenotazione.sID_FAR, IPrenotazione.sDATA_APP, IPrenotazione.sID_CLIENTE);

            this.fpFilter.setValue(IPrenotazione.sDATA_APP, WUtil.getCurrDate());

            this.lblResult = new WUX.WLabel(this.subId('lblr'), '', null, null, WUX.CSS.LABEL_INFO);

            let rc = [
                ['Data App.', IPrenotazione.sDATA_APP, 'd'],
                ['Ora App.', IPrenotazione.sORA_APP, 's'],
                ['Durata', IPrenotazione.sDURATA, 'i'],
                ['Stato', IPrenotazione.sSTATO, 's'],
                ['Cliente', IPrenotazione.sDESC_CLIENTE, 's'],
                ['Telefono', IPrenotazione.sTELEFONO1, 's'],
                ['Email', IPrenotazione.sEMAIL, 's'],
                ['Collaboratore', IPrenotazione.sDESC_COLL, 's'],
                ['Trattamento', IPrenotazione.sDESC_PREST, 's'],
                ['Cabina', IPrenotazione.sDESC_ATTR, 's'],
                ['Data Pren.', IPrenotazione.sDATA_PREN, 'd'],
                ['Data Agg.', IPrenotazione.sDATA_UPD, 't'],
                ['Struttura', IPrenotazione.sCOD_FAR, 's'],
                ['Forzatura', IPrenotazione.sOVERBOOKING, 'b'],
                ['On Line', IPrenotazione.sPREN_ONLINE, 'b'],
                ['Utente', IPrenotazione.sUSERDESK, 's'],
                ['Note', IPrenotazione.sNOTE, 's'],
                ['Coupon', IPrenotazione.sCOD_COUPON, 's'],
                ['Causale', IPrenotazione.sCAUSALE, 's']
            ];

            this.tabResult = new WUX.WDXTable(this.subId('tab'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.types = WUtil.col(rc, 2);
            this.tabResult.exportFile = 'prenotazioni';
            this.tabResult.filter = true;
            this.tabResult.css({ h: 600, f: 10 });
            this.tabResult.onRowPrepared((e: { element?: JQuery, rowElement?: JQuery, data?: any, rowIndex?: number }) => {
                if (!e.data) return;
                let stato = WUtil.getString(e.data, IPrenotazione.sSTATO, 'C');
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
            });
            this.tabResult.onDoubleClick((e: { element?: JQuery }) => {
                let srd = this.tabResult.getSelectedRowsData();
                if (!srd || !srd.length) return;

                let id = WUtil.getNumber(srd[0], IPrenotazione.sID);
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

            this.cntActions = new AppTableActions('ta');

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
                .addCol('12')
                .add(this.lblResult);

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
            let dataApp = WUtil.toDate(WUtil.getParam('d'));
            if (!dataApp) {
                if (idf) this.selFar.setState(idf);
                return;
            }
            let pidf = WUtil.toNumber(WUtil.getParam('f'));
            if (pidf) {
                this.selFar.setState(pidf);
                idf = pidf;
            }
            else {
                if (idf) this.selFar.setState(idf);
            }
            if (idf) {
                this.selCol.setIdFar(idf);
                this.selCab.setIdFar(idf);
            }
            this.fpFilter.setValue(IPrenotazione.sDATA_APP, dataApp);
            setTimeout(() => {
                this.btnFind.trigger('click');
            }, 200);
        }
    }
}