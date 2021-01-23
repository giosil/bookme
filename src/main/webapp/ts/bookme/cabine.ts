namespace GUI {

    import WUtil = WUX.WUtil;

    export class GUICabine extends WUX.WComponent {
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
        protected tcoDetail: WUX.WTab;
        // Dettaglio attributi
        protected fpDetail: WUX.WFormPanel;
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
            super(id ? id : '*', 'GUICabine');
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
                jrpc.execute('ATTREZZATURE.find', [AppUtil.putUserInfo(this.fpFilter.getState())], (result) => {
                    this.tabResult.setState(result);

                    this.fpDetail.clear();
                    this.tabSel.setState([]);
                    this.tabAll.clearSelection();
                    this.tabAll.clearFilter();
                    this.status = this.iSTATUS_STARTUP;

                    if (this.selId) {
                        let idx = WUtil.indexOf(result, IAttrezzatura.sID, this.selId);
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
                this.tabSel.setState([]);
                this.tabAll.clearSelection();
                this.tabAll.clearFilter();
                this.status = this.iSTATUS_STARTUP;
            });

            this.selFar = new CFSelectStruture();
            this.selFar.on('statechange', (e: WUX.WEvent) => {
                this.tabResult.setState([]);
                this.fpDetail.clear();
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
            this.fpFilter.addComponent(IAttrezzatura.sID_FAR, 'Struttura', this.selFar);
            this.fpFilter.addTextField(IAttrezzatura.sDESCRIZIONE, 'Descrizione');

            this.fpFilter.setMandatory(IAttrezzatura.sID_FAR);

            this.fpDetail = new WUX.WFormPanel(this.subId('fpd'));
            this.fpDetail.addRow();
            this.fpDetail.addTextField(IAttrezzatura.sCODICE, 'Codice');
            this.fpDetail.addTextField(IAttrezzatura.sDESCRIZIONE, 'Descrizione');
            this.fpDetail.addTextField(IAttrezzatura.sUBICAZIONE, 'Ubicazione');
            this.fpDetail.addInternalField(IAttrezzatura.sID);
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
                this.btnDx.enabled = true;
                this.btnSx.enabled = true;
                this.btnPa.enabled = true;

                this.fpDetail.clear();
                this.tabSel.setState([]);
                this.tabAll.clearSelection();
                this.tabAll.clearFilter();

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
                this.btnDx.enabled = true;
                this.btnSx.enabled = true;
                this.btnPa.enabled = true;

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
                values[IAttrezzatura.sID_FAR] = idf;
                values[IAttrezzatura.sPRESTAZIONI] = this.tabSel.getState();

                if (this.isNew) {
                    jrpc.execute('ATTREZZATURE.insert', [AppUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;
                        this.btnDx.enabled = false;
                        this.btnSx.enabled = false;
                        this.btnPa.enabled = false;

                        this.selId = result[IAttrezzatura.sID];
                        this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('ATTREZZATURE.update', [AppUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;
                        this.btnDx.enabled = false;
                        this.btnSx.enabled = false;
                        this.btnPa.enabled = false;

                        this.selId = result[IAttrezzatura.sID];
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
                if (!rd || !rd.length) return;
                let id = WUtil.getInt(rd[0], IAttrezzatura.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, (res: any) => {
                    if (!res) return;
                    jrpc.execute('ATTREZZATURE.delete', [id], (result) => {
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
                this.btnDx.enabled = true;
                this.btnSx.enabled = true;
                this.btnPa.enabled = true;

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
                values[IAttrezzatura.sID_FAR] = idf;
                values[IAttrezzatura.sPRESTAZIONI] = this.tabSel.getState();

                if (this.isNew) {
                    jrpc.execute('ATTREZZATURE.insert', [AppUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;
                        this.btnDx.enabled = false;
                        this.btnSx.enabled = false;
                        this.btnPa.enabled = false;

                        this.selId = result[IAttrezzatura.sID];
                        this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('ATTREZZATURE.update', [AppUtil.putUserInfo(values)], (result) => {
                        this.status = this.iSTATUS_VIEW;

                        this.fpDetail.enabled = false;
                        this.btnDx.enabled = false;
                        this.btnSx.enabled = false;
                        this.btnPa.enabled = false;

                        this.selId = result[IAttrezzatura.sID];
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
                if (!rd || !rd.length) return;
                let id = WUtil.getInt(rd[0], IAttrezzatura.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, (res: any) => {
                    if (!res) return;
                    jrpc.execute('ATTREZZATURE.delete', [id], (result) => {
                        this.btnFind.trigger('click');
                    });
                });
            });

            let rc = [
                ['Codice', IAttrezzatura.sCODICE],
                ['Descrizione', IAttrezzatura.sDESCRIZIONE]
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.css({ h: 220 });
            this.tabResult.widths = [100];
            this.tabResult.onSelectionChanged((e: { element?: JQuery, selectedRowsData?: Array<any> }) => {

                this.onSelect();

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

            this.tcoDetail = new WUX.WTab('tcod');
            this.tcoDetail.addTab('Attributi', WUX.WIcon.ADDRESS_CARD)
                .addRow()
                .addCol('12', { h: 300 })
                .add(this.fpDetail);

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

            let id = WUtil.getNumber(item, IAttrezzatura.sID);
            if (!id) return;

            this.fpDetail.clear();

            this.tabSel.setState([]);
            this.tabAll.clearSelection();
            this.tabAll.clearFilter();

            if (this.status == this.iSTATUS_EDITING) {
                WUX.showWarning('Modifiche annullate');
                this.fpDetail.enabled = false;
                this.btnDx.enabled = false;
                this.btnSx.enabled = false;
                this.btnPa.enabled = false;
            }

            jrpc.execute('ATTREZZATURE.read', [id], (result) => {
                this.fpDetail.setState(result);
                this.tabSel.setState(WUtil.getArray(result, IAttrezzatura.sPRESTAZIONI));
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