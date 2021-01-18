var GUI;
(function (GUI) {
    var WUtil = WUX.WUtil;
    GUI.URL_DEV = 'http://localhost:8080/bookme';
    GUI.GRP_DEV = '3';
    function getUserLogged() {
        var userLogged = window ? window['_userLogged'] : undefined;
        if (userLogged && typeof userLogged == 'object')
            return userLogged;
        return { id: 1, userName: 'dew', currLogin: new Date(), role: 'admin', groups: [GUI.GRP_DEV], structures: [], email: 'test@dew.org', mobile: '3491234567', tokenId: 'KURJPghMTJ' };
    }
    GUI.getUserLogged = getUserLogged;
    function getConfig() {
        var config = window ? window['_config'] : undefined;
        if (config && typeof config == 'object')
            return config;
        return {};
    }
    GUI.getConfig = getConfig;
    function getLocale() {
        var u = getUserLogged();
        if (u != null && u.locale)
            return u.locale;
        return WUX.WUtil.getString(getConfig(), 'locale', '');
    }
    GUI.getLocale = getLocale;
    function isDevMode() {
        var userLogged = window ? window['_userLogged'] : undefined;
        if (userLogged && typeof userLogged == 'object')
            return false;
        return true;
    }
    GUI.isDevMode = isDevMode;
    var CFUtil = (function () {
        function CFUtil() {
        }
        CFUtil.putUserInfo = function (params) {
            var user = getUserLogged();
            if (!params) {
                return { '_usr': user.userName, '_grp': WUtil.toNumber(WUtil.getFirst(GUI.getUserLogged().groups, GUI.GRP_DEV)) };
            }
            if (Array.isArray(params)) {
                params.push(user.userName);
                params.push(WUtil.toNumber(WUtil.getFirst(GUI.getUserLogged().groups, GUI.GRP_DEV)));
                return params;
            }
            params._usr = user.userName;
            params._grp = WUtil.toNumber(WUtil.getFirst(GUI.getUserLogged().groups, GUI.GRP_DEV));
            return params;
        };
        CFUtil.addUserInfo = function (params) {
            var user = getUserLogged();
            if (!params) {
                return [user.userName, WUtil.toNumber(WUtil.getFirst(GUI.getUserLogged().groups, GUI.GRP_DEV))];
            }
            params.push(user.userName);
            params.push(WUtil.toNumber(WUtil.getFirst(GUI.getUserLogged().groups, GUI.GRP_DEV)));
            return params;
        };
        CFUtil.getUserInfo = function () {
            var user = getUserLogged();
            return { '_usr': user.userName, '_grp': WUtil.toNumber(WUtil.getFirst(GUI.getUserLogged().groups, GUI.GRP_DEV)) };
        };
        CFUtil.scontato = function (costoBase, s1, s2, s3, s4, s5) {
            if (s1 === void 0) { s1 = 0; }
            if (s2 === void 0) { s2 = 0; }
            if (s3 === void 0) { s3 = 0; }
            if (s4 === void 0) { s4 = 0; }
            if (s5 === void 0) { s5 = 0; }
            if (!costoBase || costoBase < 0)
                return 0;
            var r = costoBase;
            if (s1)
                r = WUX.WUtil.round2(r * ((100 - s1) / 100));
            if (s2)
                r = WUX.WUtil.round2(r * ((100 - s2) / 100));
            if (s3)
                r = WUX.WUtil.round2(r * ((100 - s3) / 100));
            if (s4)
                r = WUX.WUtil.round2(r * ((100 - s4) / 100));
            if (s5)
                r = WUX.WUtil.round2(r * ((100 - s5) / 100));
            if (r < 0)
                return 0;
            return r;
        };
        return CFUtil;
    }());
    GUI.CFUtil = CFUtil;
    var CFBookCfg = (function () {
        function CFBookCfg() {
        }
        CFBookCfg.CHECK_USER_DESK = false;
        return CFBookCfg;
    }());
    GUI.CFBookCfg = CFBookCfg;
    var IAttrezzatura = (function () {
        function IAttrezzatura() {
        }
        IAttrezzatura.sID = 'id';
        IAttrezzatura.sID_FAR = 'idFar';
        IAttrezzatura.sCODICE = 'codice';
        IAttrezzatura.sDESCRIZIONE = 'descrizione';
        IAttrezzatura.sUBICAZIONE = 'ubicazione';
        IAttrezzatura.sPRESTAZIONI = 'prestazioni';
        return IAttrezzatura;
    }());
    GUI.IAttrezzatura = IAttrezzatura;
    var IComunicazione = (function () {
        function IComunicazione() {
        }
        IComunicazione.sID = 'id';
        IComunicazione.sID_FAR = 'idFar';
        IComunicazione.sOGGETTO = 'oggetto';
        IComunicazione.sMESSAGGIO = 'messaggio';
        IComunicazione.sMEZZO = 'mezzo';
        IComunicazione.sCODA = 'coda';
        return IComunicazione;
    }());
    GUI.IComunicazione = IComunicazione;
    var IChiusura = (function () {
        function IChiusura() {
        }
        IChiusura.sID = 'id';
        IChiusura.sID_FAR = 'idFar';
        IChiusura.sDATA = 'data';
        IChiusura.sMESE_GIORNO = 'meseGiorno';
        IChiusura.sDESCRIZIONE = 'descrizione';
        IChiusura.sANNUALE = 'annuale';
        return IChiusura;
    }());
    GUI.IChiusura = IChiusura;
    var ICollaboratore = (function () {
        function ICollaboratore() {
        }
        ICollaboratore.sID = 'id';
        ICollaboratore.sID_FAR = 'idFar';
        ICollaboratore.sNOME = 'nome';
        ICollaboratore.sCOLORE = 'colore';
        ICollaboratore.sORDINE = 'ordine';
        ICollaboratore.sPREN_ONLINE = 'prenOnLine';
        ICollaboratore.sVISIBILE = 'visibile';
        ICollaboratore.sPRESTAZIONI = 'prestazioni';
        ICollaboratore.sAGENDA = 'agenda';
        ICollaboratore.sVARIAZIONI = 'variazioni';
        return ICollaboratore;
    }());
    GUI.ICollaboratore = ICollaboratore;
    var ICliente = (function () {
        function ICliente() {
        }
        ICliente.sID = 'id';
        ICliente.sCOGNOME = 'cognome';
        ICliente.sNOME = 'nome';
        ICliente.sSESSO = 'sesso';
        ICliente.sDATA_NASCITA = 'dataNascita';
        ICliente.sCODICE_FISCALE = 'codiceFiscale';
        ICliente.sTELEFONO1 = 'telefono1';
        ICliente.sTELEFONO2 = 'telefono2';
        ICliente.sEMAIL = 'email';
        ICliente.sNOTE = 'note';
        ICliente.sPRENOTAZIONI = 'prenotazioni';
        ICliente.sNOMINATIVO = 'nominativo';
        ICliente.sREPUTAZIONE = 'reputazione';
        ICliente.sETA_DA = 'etaDa';
        ICliente.sETA_A = 'etaA';
        ICliente.sOPZIONI = 'opzioni';
        ICliente.sDIS_PREN_ONLINE = 'disPrenOnLine';
        return ICliente;
    }());
    GUI.ICliente = ICliente;
    var IGruppoPrest = (function () {
        function IGruppoPrest() {
        }
        IGruppoPrest.sID = 'id';
        IGruppoPrest.sID_FAR = 'idFar';
        IGruppoPrest.sCODICE = 'codice';
        IGruppoPrest.sDESCRIZIONE = 'descrizione';
        return IGruppoPrest;
    }());
    GUI.IGruppoPrest = IGruppoPrest;
    var IPrestazione = (function () {
        function IPrestazione() {
        }
        IPrestazione.sID = 'id';
        IPrestazione.sID_FAR = 'idFar';
        IPrestazione.sCODCSF = 'codCsf';
        IPrestazione.sCODICE = 'codice';
        IPrestazione.sDESCRIZIONE = 'descrizione';
        IPrestazione.sDURATA = 'durata';
        IPrestazione.sTIPO_PREZZO = 'tipoPrezzo';
        IPrestazione.sPREN_ONLINE = 'prenOnLine';
        IPrestazione.sFLAG_POSA = 'flagPosa';
        IPrestazione.sPREZZO_LISTINO = 'prezzoListino';
        IPrestazione.sSCONTO_ASS = 'scontoAss';
        IPrestazione.sSCONTO_PERC = 'scontoPerc';
        IPrestazione.sPREZZO_FINALE = 'prezzoFinale';
        IPrestazione.sAVVERTENZE = 'avvertenze';
        IPrestazione.sINDICAZIONI = 'indicazioni';
        IPrestazione.sGRUPPO = 'gruppo';
        IPrestazione.sDESC_GRUPPO = 'descGruppo';
        IPrestazione.sTIPO = 'tipo';
        IPrestazione.sDESC_TIPO = 'descTipo';
        IPrestazione.sATTREZZATURE = 'attrezzature';
        IPrestazione.sCOLLABORATORI = 'collaboratori';
        IPrestazione.sPUNTI_COLL = 'puntiColl';
        return IPrestazione;
    }());
    GUI.IPrestazione = IPrestazione;
    var ICalendario = (function () {
        function ICalendario() {
        }
        ICalendario.sDATA = 'data';
        ICalendario.sID_FAR = 'id_far';
        ICalendario.sID_COLLABORATORE = 'id_collaboratore';
        ICalendario.sRIGENERA = 'rigenera';
        ICalendario.sAGGIORNA = 'aggiorna';
        ICalendario.sNO_APPUNTAMENTI = 'no_appts';
        ICalendario.sRISORSE = 'resources';
        ICalendario.sSLOTS = 'slots';
        ICalendario.sAPPUNTAMENTI = 'appts';
        ICalendario.sORARI = 'times';
        ICalendario.sCHECK_USER_DESK = 'ckUserDesk';
        return ICalendario;
    }());
    GUI.ICalendario = ICalendario;
    var IPrenotazione = (function () {
        function IPrenotazione() {
        }
        IPrenotazione.sID = 'id';
        IPrenotazione.sID_FAR = 'idFar';
        IPrenotazione.sCOD_FAR = 'codFar';
        IPrenotazione.sID_COLL = 'idColl';
        IPrenotazione.sDESC_COLL = 'descColl';
        IPrenotazione.sCOLORE = 'colore';
        IPrenotazione.sID_CLIENTE = 'idCliente';
        IPrenotazione.sDESC_CLIENTE = 'descCliente';
        IPrenotazione.sTELEFONO1 = 'tel1';
        IPrenotazione.sTELEFONO2 = 'tel2';
        IPrenotazione.sEMAIL = 'email';
        IPrenotazione.sID_PREST = 'idPrest';
        IPrenotazione.sDESC_PREST = 'descPrest';
        IPrenotazione.sID_ATTR = 'idAttr';
        IPrenotazione.sDESC_ATTR = 'descAttr';
        IPrenotazione.sDATA_PREN = 'dataPren';
        IPrenotazione.sDATA_UPD = 'dataUpd';
        IPrenotazione.sDATA_APP = 'dataApp';
        IPrenotazione.sORA_APP = 'oraApp';
        IPrenotazione.sORA_FINE = 'oraFine';
        IPrenotazione.sDURATA = 'durata';
        IPrenotazione.sSTATO = 'stato';
        IPrenotazione.sTIPO = 'tipo';
        IPrenotazione.sPREZZO_FINALE = 'prezzoFinale';
        IPrenotazione.sALLA_DATA = 'allaData';
        IPrenotazione.sPREN_ONLINE = 'prenOnLine';
        IPrenotazione.sPAGATO = 'pagato';
        IPrenotazione.sNOTE = 'note';
        IPrenotazione.sNOTE_CLIENTE = 'noteCliente';
        IPrenotazione.sOVERBOOKING = 'overbooking';
        IPrenotazione.sTIPO_PAG = 'tipoPag';
        IPrenotazione.sPRESTAZIONI = 'prestazioni';
        IPrenotazione.sDURATE = 'durate';
        IPrenotazione.sMESSAGGIO = 'messaggio';
        IPrenotazione.sPREFERENZE = 'preferenze';
        IPrenotazione.sIMP_PAGATO = 'impPagato';
        IPrenotazione.sCOD_COUPON = 'codCoupon';
        IPrenotazione.sCAUSALE = 'causale';
        IPrenotazione.sUSERDESK = 'userDesk';
        IPrenotazione.sCHECK_USER_DESK = 'ckUserDesk';
        IPrenotazione.sCAMBIO_ID_COLL = 'cambioIdColl';
        IPrenotazione.sCAMBIO_DATA = 'cambioData';
        IPrenotazione.sCAMBIO_ORA = 'cambioOra';
        IPrenotazione.sCAMBIO_DAL = 'cambioDal';
        IPrenotazione.sCAMBIO_AL = 'cambioAl';
        IPrenotazione.sMATTINO = 'mattino';
        IPrenotazione.sPOMERIGGIO = 'pomeriggio';
        IPrenotazione.sIGNORE_CHECK = 'ignoreCheck';
        return IPrenotazione;
    }());
    GUI.IPrenotazione = IPrenotazione;
    var IUtenteDesk = (function () {
        function IUtenteDesk() {
        }
        IUtenteDesk.sID = 'id';
        IUtenteDesk.sID_FAR = 'idFar';
        IUtenteDesk.sUSERNAME = 'username';
        IUtenteDesk.sPASSWORD = 'password';
        IUtenteDesk.sNOTE = 'note';
        IUtenteDesk.sABILITATO = 'abilitato';
        return IUtenteDesk;
    }());
    GUI.IUtenteDesk = IUtenteDesk;
    function isBookOper() {
        var user = getUserLogged();
        if (!user)
            return false;
        if (user.userName && user.userName.indexOf('_oper') >= 0)
            return true;
        if (user.reference && user.reference.toLowerCase().indexOf('oper') >= 0)
            return true;
        return false;
    }
    GUI.isBookOper = isBookOper;
    function isBookDesk() {
        var user = getUserLogged();
        if (!user)
            return false;
        if (user.userName && user.userName.indexOf('_desk') >= 0)
            return true;
        if (user.reference && user.reference.toLowerCase().indexOf('desk') >= 0)
            return true;
        return false;
    }
    GUI.isBookDesk = isBookDesk;
    function getWeek2020(d) {
        if (!d)
            d = new Date();
        return Math.floor(WUX.WUtil.diffDays(d, new Date(2019, 11, 30)) / 7) + 1;
    }
    GUI.getWeek2020 = getWeek2020;
    function chkExecute(methodName, params, successHandler) {
        if (!CFBookCfg.CHECK_USER_DESK) {
            jrpc.execute(methodName, params, successHandler);
            return;
        }
        GUI.__m = methodName;
        GUI.__p = params;
        GUI.__s = successHandler;
        if (!GUI.__d) {
            GUI.__d = new GUI.DlgCheckDesk('dlgckdesk');
            GUI.__d.onHiddenModal(function (e) {
                if (!GUI.__d.ok) {
                    WUX.showWarning('Operazione annullata.');
                    return;
                }
                var c = GUI.__d.getState();
                if (!c) {
                    WUX.showWarning('Password non corretta. Operazione annullata.');
                    return;
                }
                var r = jrpc.executeSync('UTENTI_DESK.check', [c]);
                if (!r) {
                    WUX.showWarning('Password non valida. Operazione annullata.');
                    return;
                }
                if (!GUI.__p)
                    GUI.__p = [];
                var p0 = GUI.__p.length ? GUI.__p[0] : null;
                if (typeof p0 === 'object' && p0 !== null) {
                    p0[IPrenotazione.sUSERDESK] = r;
                }
                else if (p0 === null) {
                    GUI.__p[0] = r;
                }
                else {
                    GUI.__p.push(r);
                }
                if (!GUI.__m) {
                    WUX.showWarning('Riferimento operazione assente.');
                    return;
                }
                jrpc.execute(GUI.__m, GUI.__p, GUI.__s);
            });
        }
        GUI.__d.show();
    }
    GUI.chkExecute = chkExecute;
})(GUI || (GUI = {}));
WUX.global.locale = GUI.getLocale();
var jrpc = new JRPC("/bookme/rpc");
jrpc.setUserName(GUI.getUserLogged().userName);
jrpc.setPassword('' + WUX.WUtil.getFirst(GUI.getUserLogged().groups, GUI.GRP_DEV));
var GUI;
(function (GUI) {
    var WUtil = WUX.WUtil;
    var GUICabine = (function (_super) {
        __extends(GUICabine, _super);
        function GUICabine(id) {
            var _this = _super.call(this, id ? id : '*', 'GUICabine') || this;
            _this.iSTATUS_STARTUP = 0;
            _this.iSTATUS_VIEW = 1;
            _this.iSTATUS_EDITING = 2;
            _this.status = _this.iSTATUS_STARTUP;
            return _this;
        }
        GUICabine.prototype.render = function () {
            var _this = this;
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var check = _this.fpFilter.checkMandatory(true, true, false);
                if (check) {
                    WUX.showWarning('Specificare i seguenti campi: ' + check);
                    return;
                }
                var box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    _this.tagsFilter.setState(_this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('ATTREZZATURE.find', [GUI.CFUtil.putUserInfo(_this.fpFilter.getState())], function (result) {
                    _this.tabResult.setState(result);
                    _this.fpDetail.clear();
                    _this.tabSel.setState([]);
                    _this.tabAll.clearSelection();
                    _this.tabAll.clearFilter();
                    _this.status = _this.iSTATUS_STARTUP;
                    if (_this.selId) {
                        var idx_1 = WUtil.indexOf(result, GUI.IAttrezzatura.sID, _this.selId);
                        if (idx_1 >= 0) {
                            setTimeout(function () {
                                _this.tabResult.select([idx_1]);
                            }, 100);
                        }
                        _this.selId = null;
                    }
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                _this.fpFilter.clear();
                _this.tagsFilter.setState({});
                _this.tabResult.setState([]);
                _this.fpDetail.clear();
                _this.tabSel.setState([]);
                _this.tabAll.clearSelection();
                _this.tabAll.clearFilter();
                _this.status = _this.iSTATUS_STARTUP;
            });
            this.selFar = new GUI.CFSelectStruture();
            this.selFar.on('statechange', function (e) {
                _this.tabResult.setState([]);
                _this.fpDetail.clear();
                _this.tabSel.setState([]);
                _this.tabAll.clearSelection();
                _this.tabAll.clearFilter();
                GUI.cp_prest = null;
                var idf = WUtil.toNumber(_this.selFar.getState(), 0);
                jrpc.execute('PRESTAZIONI.getAll', [idf], function (result) {
                    _this.tabAll.setState(result);
                });
            });
            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent(GUI.IAttrezzatura.sID_FAR, 'Struttura', this.selFar);
            this.fpFilter.addTextField(GUI.IAttrezzatura.sDESCRIZIONE, 'Descrizione');
            this.fpFilter.setMandatory(GUI.IAttrezzatura.sID_FAR);
            this.fpDetail = new WUX.WFormPanel(this.subId('fpd'));
            this.fpDetail.addRow();
            this.fpDetail.addTextField(GUI.IAttrezzatura.sCODICE, 'Codice');
            this.fpDetail.addTextField(GUI.IAttrezzatura.sDESCRIZIONE, 'Descrizione');
            this.fpDetail.addTextField(GUI.IAttrezzatura.sUBICAZIONE, 'Ubicazione');
            this.fpDetail.addInternalField(GUI.IAttrezzatura.sID);
            this.fpDetail.enabled = false;
            this.fpFilter.onEnterPressed(function (e) {
                _this.btnFind.trigger('click');
            });
            this.btnNew = new WUX.WButton(this.subId('bn'), GUI.TXT.NEW, '', WUX.BTN.SM_INFO);
            this.btnNew.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    _this.btnNew.blur();
                    return;
                }
                _this.isNew = true;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.tabResult.clearSelection();
                _this.fpDetail.enabled = true;
                _this.btnDx.enabled = true;
                _this.btnSx.enabled = true;
                _this.btnPa.enabled = true;
                _this.fpDetail.clear();
                _this.tabSel.setState([]);
                _this.tabAll.clearSelection();
                _this.tabAll.clearFilter();
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnOpen = new WUX.WButton(this.subId('bo'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    _this.btnOpen.blur();
                    return;
                }
                var sr = _this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    _this.btnOpen.blur();
                    return;
                }
                _this.isNew = false;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.fpDetail.enabled = true;
                _this.btnDx.enabled = true;
                _this.btnSx.enabled = true;
                _this.btnPa.enabled = true;
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnSave = new WUX.WButton(this.subId('bs'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    WUX.showWarning('Cliccare su Modifica.');
                    _this.btnSave.blur();
                    return;
                }
                var check = _this.fpDetail.checkMandatory(true);
                if (check) {
                    _this.btnSave.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                var idf = WUtil.toNumber(_this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Selezionare la struttura di competenza');
                    return;
                }
                var values = _this.fpDetail.getState();
                values[GUI.IAttrezzatura.sID_FAR] = idf;
                values[GUI.IAttrezzatura.sPRESTAZIONI] = _this.tabSel.getState();
                if (_this.isNew) {
                    jrpc.execute('ATTREZZATURE.insert', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.btnDx.enabled = false;
                        _this.btnSx.enabled = false;
                        _this.btnPa.enabled = false;
                        _this.selId = result[GUI.IAttrezzatura.sID];
                        _this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('ATTREZZATURE.update', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.btnDx.enabled = false;
                        _this.btnSx.enabled = false;
                        _this.btnPa.enabled = false;
                        _this.selId = result[GUI.IAttrezzatura.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            _this.btnFind.trigger('click');
                        }
                        else {
                            var idx_2 = selRows[0];
                            var records = _this.tabResult.getState();
                            records[idx_2] = result;
                            _this.tabResult.refresh();
                            setTimeout(function () {
                                _this.tabResult.select([idx_2]);
                            }, 100);
                        }
                    });
                }
            });
            this.btnCancel = new WUX.WButton(this.subId('bc'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    _this.btnCancel.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, function (res) {
                    if (!res)
                        return;
                    if (_this.isNew) {
                        _this.fpDetail.clear();
                        _this.tabSel.setState([]);
                        _this.tabAll.clearSelection();
                        _this.tabAll.clearFilter();
                    }
                    else {
                        _this.onSelect();
                    }
                    _this.status = _this.iSTATUS_VIEW;
                    _this.fpDetail.enabled = false;
                    _this.btnDx.enabled = false;
                    _this.btnSx.enabled = false;
                    _this.btnPa.enabled = false;
                    _this.selId = null;
                });
            });
            this.btnDelete = new WUX.WButton(this.subId('bd'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete.on('click', function (e) {
                _this.selId = null;
                _this.btnDelete.blur();
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length)
                    return;
                var id = WUtil.getInt(rd[0], GUI.IAttrezzatura.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, function (res) {
                    if (!res)
                        return;
                    jrpc.execute('ATTREZZATURE.delete', [id], function (result) {
                        _this.btnFind.trigger('click');
                    });
                });
            });
            this.btnOpen2 = new WUX.WButton(this.subId('bo2'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen2.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    _this.btnOpen2.blur();
                    return;
                }
                var sr = _this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    _this.btnOpen2.blur();
                    return;
                }
                _this.isNew = false;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.fpDetail.enabled = true;
                _this.btnDx.enabled = true;
                _this.btnSx.enabled = true;
                _this.btnPa.enabled = true;
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnSave2 = new WUX.WButton(this.subId('bs2'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave2.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    WUX.showWarning('Cliccare su Modifica.');
                    _this.btnSave2.blur();
                    return;
                }
                var check = _this.fpDetail.checkMandatory(true);
                if (check) {
                    _this.btnSave2.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                var idf = WUtil.toNumber(_this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Selezionare la struttura di competenza');
                    return;
                }
                var values = _this.fpDetail.getState();
                values[GUI.IAttrezzatura.sID_FAR] = idf;
                values[GUI.IAttrezzatura.sPRESTAZIONI] = _this.tabSel.getState();
                if (_this.isNew) {
                    jrpc.execute('ATTREZZATURE.insert', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.btnDx.enabled = false;
                        _this.btnSx.enabled = false;
                        _this.btnPa.enabled = false;
                        _this.selId = result[GUI.IAttrezzatura.sID];
                        _this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('ATTREZZATURE.update', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.btnDx.enabled = false;
                        _this.btnSx.enabled = false;
                        _this.btnPa.enabled = false;
                        _this.selId = result[GUI.IAttrezzatura.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            _this.btnFind.trigger('click');
                        }
                        else {
                            var idx_3 = selRows[0];
                            var records = _this.tabResult.getState();
                            records[idx_3] = result;
                            _this.tabResult.refresh();
                            setTimeout(function () {
                                _this.tabResult.select([idx_3]);
                            }, 100);
                        }
                    });
                }
            });
            this.btnCancel2 = new WUX.WButton(this.subId('bc2'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel2.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    _this.btnCancel2.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, function (res) {
                    if (!res)
                        return;
                    if (_this.isNew) {
                        _this.fpDetail.clear();
                        _this.tabSel.setState([]);
                        _this.tabAll.clearSelection();
                        _this.tabAll.clearFilter();
                    }
                    else {
                        _this.onSelect();
                    }
                    _this.status = _this.iSTATUS_VIEW;
                    _this.fpDetail.enabled = false;
                    _this.btnDx.enabled = false;
                    _this.btnSx.enabled = false;
                    _this.btnPa.enabled = false;
                    _this.selId = null;
                });
            });
            this.btnDelete2 = new WUX.WButton(this.subId('bd2'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete2.on('click', function (e) {
                _this.selId = null;
                _this.btnDelete2.blur();
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length)
                    return;
                var id = WUtil.getInt(rd[0], GUI.IAttrezzatura.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, function (res) {
                    if (!res)
                        return;
                    jrpc.execute('ATTREZZATURE.delete', [id], function (result) {
                        _this.btnFind.trigger('click');
                    });
                });
            });
            var rc = [
                ['Codice', GUI.IAttrezzatura.sCODICE],
                ['Descrizione', GUI.IAttrezzatura.sDESCRIZIONE]
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.css({ h: 220 });
            this.tabResult.widths = [100];
            this.tabResult.onSelectionChanged(function (e) {
                _this.onSelect();
            });
            this.tabSel = new WUX.WDXTable(this.subId('tbs'), ['Gruppo', 'Descrizione'], [GUI.IPrestazione.sDESC_GRUPPO, GUI.IPrestazione.sDESCRIZIONE]);
            this.tabSel.selectionMode = 'multiple';
            this.tabSel.css({ h: 250 });
            this.tabSel.widths = [100];
            this.tabSel.filter = true;
            this.tabSel.onCellPrepared(function (e) {
                var f = e.column.dataField;
                if (f == GUI.IPrestazione.sDESC_GRUPPO) {
                    e.cellElement.addClass('clickable');
                }
            });
            this.tabSel.onCellClick(function (e) {
                var row = e.row;
                if (row != null && row.rowType == 'data') {
                    var f = e.column.dataField;
                    if (f == GUI.IPrestazione.sDESC_GRUPPO) {
                        var x_1 = [];
                        var d = _this.tabSel.getState();
                        for (var i = 0; i < d.length; i++) {
                            var r = d[i];
                            if (r[GUI.IPrestazione.sDESC_GRUPPO] == e.value)
                                x_1.push(i);
                        }
                        if (!x_1 || !x_1.length)
                            return;
                        _this.tabSel.setState(d);
                        setTimeout(function () {
                            _this.tabSel.select(x_1);
                        }, 200);
                    }
                }
            });
            this.tabAll = new WUX.WDXTable(this.subId('tba'), ['Gruppo', 'Descrizione'], [GUI.IPrestazione.sDESC_GRUPPO, GUI.IPrestazione.sDESCRIZIONE]);
            this.tabAll.selectionMode = 'multiple';
            this.tabAll.css({ h: 250 });
            this.tabAll.widths = [100];
            this.tabAll.filter = true;
            this.tabAll.onCellPrepared(function (e) {
                var f = e.column.dataField;
                if (f == GUI.IPrestazione.sDESC_GRUPPO) {
                    e.cellElement.addClass('clickable');
                }
            });
            this.tabAll.onCellClick(function (e) {
                var row = e.row;
                if (row != null && row.rowType == 'data') {
                    var f = e.column.dataField;
                    if (f == GUI.IPrestazione.sDESC_GRUPPO) {
                        var x_2 = [];
                        var d = _this.tabAll.getState();
                        for (var i = 0; i < d.length; i++) {
                            var r = d[i];
                            if (r[GUI.IPrestazione.sDESC_GRUPPO] == e.value)
                                x_2.push(i);
                        }
                        if (!x_2 || !x_2.length)
                            return;
                        _this.tabAll.setState(d);
                        setTimeout(function () {
                            _this.tabAll.select(x_2);
                        }, 200);
                    }
                }
            });
            this.btnSx = new WUX.WButton(this.subId('bba'), '', GUI.ICO.LEFT, WUX.BTN.PRIMARY, { p: '1px 6px 1px 6px' });
            this.btnSx.tooltip = 'Aggiungi trattamenti';
            this.btnSx.enabled = false;
            this.btnSx.on('click', function (e) {
                var dts = _this.tabSel.getState();
                if (!dts)
                    dts = [];
                var srd = _this.tabAll.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare uno o pi&ugrave; trattamenti dal catalogo.');
                    return;
                }
                var scr = false;
                for (var i = 0; i < srd.length; i++) {
                    var p = srd[i];
                    var pid = p[GUI.IPrestazione.sID];
                    var f = false;
                    for (var j = 0; j < dts.length; j++) {
                        var s = dts[j];
                        var sid = s[GUI.IPrestazione.sID];
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
                _this.tabSel.setState(dts);
                if (scr) {
                    setTimeout(function () {
                        _this.tabSel.scrollTo(999999);
                    }, 250);
                }
            });
            this.btnDx = new WUX.WButton(this.subId('bbd'), '', GUI.ICO.DELETE, WUX.BTN.DANGER, { p: '1px 7px 1px 7px' });
            this.btnDx.tooltip = 'Rimuovi trattamenti';
            this.btnDx.enabled = false;
            this.btnDx.on('click', function (e) {
                var dts = _this.tabSel.getState();
                if (!dts)
                    dts = [];
                var srd = _this.tabSel.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare uno o pi&ugrave; trattamenti dall\'elenco degli assegnati.');
                    return;
                }
                var cpy = [];
                for (var i = 0; i < dts.length; i++) {
                    var p = dts[i];
                    var pid = p[GUI.IPrestazione.sID];
                    var f = false;
                    for (var j = 0; j < srd.length; j++) {
                        var s = srd[j];
                        var sid = s[GUI.IPrestazione.sID];
                        if (sid == pid) {
                            f = true;
                            break;
                        }
                    }
                    if (!f)
                        cpy.push(p);
                }
                _this.tabSel.setState(cpy);
            });
            this.btnCp = new WUX.WButton(this.subId('bbc'), '', GUI.ICO.COPY, WUX.BTN.SECONDARY, { p: '1px 7px 1px 7px' });
            this.btnCp.tooltip = 'Copia trattamenti';
            this.btnCp.on('click', function (e) {
                var items = _this.tabSel.getState();
                if (!items || !items.length) {
                    WUX.showSuccess('Nessun elemento selezionato');
                    return;
                }
                GUI.cp_prest = items;
                WUX.showSuccess('Trattamenti copiati nella clipboard');
            });
            this.btnPa = new WUX.WButton(this.subId('bbp'), '', GUI.ICO.PASTE, WUX.BTN.WARNING, { p: '1px 7px 1px 7px' });
            this.btnPa.tooltip = 'Incolla trattamenti';
            this.btnPa.enabled = false;
            this.btnPa.on('click', function (e) {
                if (!GUI.cp_prest) {
                    WUX.showWarning('Non vi sono trattamenti nella clipboard');
                    return;
                }
                _this.tabSel.setState(GUI.cp_prest);
            });
            var cntTab0 = new WUX.WContainer(this.subId('ct0'), '');
            cntTab0
                .addRow()
                .addCol('11', { p: 0 })
                .add(this.tabSel)
                .addCol('1', { p: 0 })
                .addStack(WUX.CSS.STACK_BTNS, this.btnSx, this.btnDx, this.btnCp, this.btnPa);
            this.cntActions = new GUI.CFTableActions('ta');
            this.cntActions.left.add(this.btnOpen);
            this.cntActions.left.add(this.btnDelete);
            this.cntActions.left.add(this.btnSave);
            this.cntActions.left.add(this.btnCancel);
            this.cntActions.right.add(this.btnNew);
            this.cntActions2 = new GUI.CFTableActions('ta2');
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
            this.tcoDetail.on('statechange', function (e) {
                var itab = _this.tcoDetail.getState();
                switch (itab) {
                    case 0:
                        break;
                    case 1:
                        _this.tabSel.repaint();
                        _this.tabAll.repaint();
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
                .end()
                .addBox()
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, this.cntActions, this.tabResult, this.cntActions2)
                .end()
                .addRow()
                .addCol('12').section('Dettaglio')
                .add(this.tcoDetail);
            return this.container;
        };
        GUICabine.prototype.collapseHandler = function (e) {
            var c = WUtil.getBoolean(e.data, 'collapsed');
            if (c) {
                this.tagsFilter.setState({});
            }
            else {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
            }
        };
        GUICabine.prototype.onSelect = function () {
            var _this = this;
            var item = WUtil.getItem(this.tabResult.getSelectedRowsData(), 0);
            if (!item)
                return;
            var id = WUtil.getNumber(item, GUI.IAttrezzatura.sID);
            if (!id)
                return;
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
            jrpc.execute('ATTREZZATURE.read', [id], function (result) {
                _this.fpDetail.setState(result);
                _this.tabSel.setState(WUtil.getArray(result, GUI.IAttrezzatura.sPRESTAZIONI));
                _this.status = _this.iSTATUS_VIEW;
            });
        };
        GUICabine.prototype.componentDidMount = function () {
            var idf = 0;
            if (GUI.strutture && GUI.strutture.length) {
                idf = GUI.strutture[0].id;
            }
            if (idf)
                this.selFar.setState(idf);
        };
        return GUICabine;
    }(WUX.WComponent));
    GUI.GUICabine = GUICabine;
})(GUI || (GUI = {}));
var GUI;
(function (GUI) {
    var WUtil = WUX.WUtil;
    var GUICalendario = (function (_super) {
        __extends(GUICalendario, _super);
        function GUICalendario(id) {
            var _this = _super.call(this, id ? id : '*', 'GUICalendario') || this;
            _this.dlgOrariPers = new GUI.DlgOrariPers(_this.subId('dlgop'));
            _this.dlgOrariPers.onHiddenModal(function (e) {
                _this.planning.resumeSync();
                if (!_this.dlgOrariPers.ok)
                    return;
                var varz = WUtil.getObject(_this.dlgOrariPers.getState(), GUI.ICalendario.sORARI);
                var date = _this.navCal.getState();
                if (!date)
                    date = new Date();
                var idf = _this.navCal.getProps();
                GUI.chkExecute('CALENDARIO.saveVariazioni', [idf, date, varz], function (result) {
                    _this.planning.autoScroll = true;
                    _this.planning.setState(result);
                    _this.txtSrc.focus();
                });
            });
            _this.winBack = new WUX.WWindow(_this.subId('wb'));
            _this.winBack.width = 160;
            _this.winBack.gap = 16;
            _this.winBack.background = 'rgba(0,0,0,.8)';
            _this.winBack.color = '#ffffff';
            _this.winBack.body.add('<div style="padding:14px 14px 14px 14px;font-weight:bold;cursor:pointer;">' + WUX.buildIcon(WUX.WIcon.ARROW_LEFT) + ' Torna ad oggi</div>');
            _this.winBack.on('click', function (e) {
                _this.navCal.setState(new Date());
                _this.winBack.hide();
            });
            return _this;
        }
        GUICalendario.prototype.render = function () {
            var _this = this;
            this.navCal = new GUI.CFNavCalendar(this.subId('cal'));
            this.navCal.onClickPrev(function (e) {
                var date = _this.navCal.getState();
                var idf = _this.navCal.getProps();
                if (_this.navCal.isToday()) {
                    _this.winBack.hide();
                }
                else {
                    _this.winBack.show();
                }
                var filter = {};
                filter[GUI.ICalendario.sDATA] = date;
                filter[GUI.ICalendario.sID_FAR] = idf;
                jrpc.execute('CALENDARIO.getPlanning', [filter], function (result) {
                    _this.planning.autoScroll = true;
                    _this.planning.setState(result);
                    _this.txtSrc.focus();
                });
            });
            this.navCal.onClickNext(function (e) {
                var date = _this.navCal.getState();
                var idf = _this.navCal.getProps();
                if (_this.navCal.isToday()) {
                    _this.winBack.hide();
                }
                else {
                    _this.winBack.show();
                }
                var filter = {};
                filter[GUI.ICalendario.sDATA] = date;
                filter[GUI.ICalendario.sID_FAR] = idf;
                jrpc.execute('CALENDARIO.getPlanning', [filter], function (result) {
                    _this.planning.autoScroll = true;
                    _this.planning.setState(result);
                    _this.txtSrc.focus();
                });
            });
            this.navCal.on('statechange', function (e) {
                var date = _this.navCal.getState();
                var idf = _this.navCal.getProps();
                if (_this.navCal.isToday()) {
                    _this.winBack.hide();
                }
                else {
                    _this.winBack.show();
                }
                var filter = {};
                filter[GUI.ICalendario.sDATA] = date;
                filter[GUI.ICalendario.sID_FAR] = idf;
                jrpc.execute('CALENDARIO.getPlanning', [filter], function (result) {
                    _this.planning.autoScroll = true;
                    _this.planning.setState(result);
                    _this.txtSrc.focus();
                });
            });
            this.navCal.on('propschange', function (e) {
                var date = _this.navCal.getState();
                var idf = _this.navCal.getProps();
                if (_this.navCal.isToday()) {
                    _this.winBack.hide();
                }
                else {
                    _this.winBack.show();
                }
                var filter = {};
                filter[GUI.ICalendario.sDATA] = date;
                filter[GUI.ICalendario.sID_FAR] = idf;
                jrpc.execute('CALENDARIO.getPlanning', [filter], function (result) {
                    _this.planning.autoScroll = true;
                    _this.planning.setState(result);
                    _this.txtSrc.focus();
                });
            });
            this.txtSrc = new WUX.WInput('ts', WUX.WInputType.Text);
            this.txtSrc.css({ f: 10, w: 50 });
            this.txtSrc.tooltip = 'Ricerca veloce';
            this.txtSrc.placeHolder = 'Cerca';
            this.txtSrc.onEnterPressed(function (e) {
                var s = _this.txtSrc.getState();
                s = s ? s.trim() : '';
                _this.txtSrc.setState('');
                if (s == '' || s == '?' || s == '#' || s == '#?' || s == '@' || s == '@?') {
                    var date = _this.navCal.getState();
                    var idf = _this.navCal.getProps();
                    if (_this.navCal.isToday()) {
                        _this.winBack.hide();
                    }
                    else {
                        _this.winBack.show();
                    }
                    var filter = {};
                    filter[GUI.ICalendario.sDATA] = date;
                    filter[GUI.ICalendario.sID_FAR] = idf;
                    switch (s) {
                        case '?':
                            filter[GUI.ICalendario.sNO_APPUNTAMENTI] = true;
                            break;
                        case '#':
                            filter[GUI.ICalendario.sRIGENERA] = true;
                            break;
                        case '#?':
                            filter[GUI.ICalendario.sRIGENERA] = true;
                            filter[GUI.ICalendario.sNO_APPUNTAMENTI] = true;
                            break;
                        case '@':
                            filter[GUI.ICalendario.sAGGIORNA] = true;
                            break;
                        case '@?':
                            filter[GUI.ICalendario.sAGGIORNA] = true;
                            filter[GUI.ICalendario.sNO_APPUNTAMENTI] = true;
                            break;
                    }
                    jrpc.execute('CALENDARIO.getPlanning', [filter], function (result) {
                        _this.planning.autoScroll = true;
                        _this.planning.setState(result);
                        _this.txtSrc.focus();
                    });
                    return;
                }
                var r = _this.planning.mark(s);
                if (r && r.length) {
                    var s_1 = '';
                    for (var i = 0; i < r.length; i++) {
                        s_1 += '<strong>' + r[i].descCliente + '</strong> alle ore <strong>' + r[i].oraApp + '</strong><br>';
                    }
                    WUX.showSuccess('Prenotazioni trovate:<br>' + s_1);
                }
                else {
                    WUX.showWarning('Nessuna prenotazione trovata.');
                }
            });
            this.lnkPrn = new WUX.WLink(this.subId('lpr'), 'Prenotazioni', WUX.WIcon.FILE_TEXT_O);
            this.lnkPrn.on('click', function (e) {
                if (GUI.isDevMode()) {
                    WUX.openURL('index.html?c=GUIPrenotazioni&d=' + WUtil.toNumber(_this.navCal.getState()) + '&f=' + _this.navCal.getProps(), true, true);
                }
                else {
                    WUX.openURL('prenotazioni?d=' + WUtil.toNumber(_this.navCal.getState()) + '&f=' + _this.navCal.getProps(), true, true);
                }
            });
            this.lnkTms = new WUX.WLink(this.subId('lts'), 'Orari', WUX.WIcon.CLOCK_O);
            this.lnkTms.on('click', function (e) {
                var date = _this.navCal.getState();
                if (!_this.navCal.isToday())
                    _this.winBack.show();
                var idf = _this.navCal.getProps();
                _this.planning.stopSync();
                var filter = {};
                filter[GUI.ICalendario.sDATA] = date;
                filter[GUI.ICalendario.sID_FAR] = idf;
                jrpc.execute('CALENDARIO.getTimeTable', [filter], function (result) {
                    _this.dlgOrariPers.setProps(date);
                    _this.dlgOrariPers.setState(result);
                    _this.dlgOrariPers.show();
                });
            });
            this.lnkNew = new WUX.WLink(this.subId('ltn'), 'Nuovo', WUX.WIcon.CALENDAR);
            this.lnkNew.on('click', function (e) {
                _this.planning.newApp();
            });
            this.planning = new GUI.CFPlanning(this.subId('pln'));
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
                .add(GUI.isBookDesk() ? '' : this.lnkTms)
                .addSpan(16)
                .add(this.lnkNew)
                .addRow()
                .add(this.planning);
            return this.container;
        };
        GUICalendario.prototype.componentDidMount = function () {
            var _this = this;
            var date = this.navCal.getState();
            if (!date)
                date = new Date();
            var idf = this.navCal.getProps();
            var filter = {};
            filter[GUI.ICalendario.sDATA] = date;
            filter[GUI.ICalendario.sID_FAR] = idf;
            jrpc.execute('CALENDARIO.getPlanning', [filter], function (result) {
                _this.planning.autoScroll = true;
                _this.planning.setState(result);
                _this.txtSrc.focus();
                _this.planning.startSync();
            });
        };
        return GUICalendario;
    }(WUX.WComponent));
    GUI.GUICalendario = GUICalendario;
    var GUIChiusure = (function (_super) {
        __extends(GUIChiusure, _super);
        function GUIChiusure(id) {
            var _this = _super.call(this, id ? id : '*', 'GUIChiusure') || this;
            _this.iSTATUS_STARTUP = 0;
            _this.iSTATUS_VIEW = 1;
            _this.iSTATUS_EDITING = 2;
            _this.status = _this.iSTATUS_STARTUP;
            return _this;
        }
        GUIChiusure.prototype.render = function () {
            var _this = this;
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var check = _this.fpFilter.checkMandatory(true, true, false);
                if (check) {
                    WUX.showWarning('Specificare i seguenti campi: ' + check);
                    return;
                }
                var box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    _this.tagsFilter.setState(_this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('CHIUSURE.find', [GUI.CFUtil.putUserInfo(_this.fpFilter.getState())], function (result) {
                    _this.tabResult.setState(result);
                    _this.fpDetail.clear();
                    _this.status = _this.iSTATUS_STARTUP;
                    if (_this.selId) {
                        var idx_4 = WUtil.indexOf(result, GUI.IChiusura.sID, _this.selId);
                        if (idx_4 >= 0) {
                            setTimeout(function () {
                                _this.tabResult.select([idx_4]);
                            }, 100);
                        }
                        _this.selId = null;
                    }
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                _this.fpFilter.clear();
                _this.tagsFilter.setState({});
                _this.tabResult.setState([]);
                _this.fpDetail.clear();
                _this.status = _this.iSTATUS_STARTUP;
            });
            this.selFar = new GUI.CFSelectStruture();
            this.selFar.on('statechange', function (e) {
                _this.tabResult.setState([]);
                _this.fpDetail.clear();
            });
            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent(GUI.IChiusura.sID_FAR, 'Struttura', this.selFar);
            this.fpFilter.addTextField(GUI.IChiusura.sDESCRIZIONE, 'Descrizione');
            this.fpFilter.setMandatory(GUI.IChiusura.sID_FAR);
            this.fpDetail = new WUX.WFormPanel(this.subId('fpd'));
            this.fpDetail.addRow();
            this.fpDetail.addDateField(GUI.IChiusura.sDATA, 'Data');
            this.fpDetail.addTextField(GUI.IChiusura.sDESCRIZIONE, 'Descrizione');
            this.fpDetail.addBooleanField(GUI.IChiusura.sANNUALE, 'Annuale');
            this.fpDetail.addInternalField(GUI.IChiusura.sID);
            this.fpDetail.enabled = false;
            this.fpDetail.setSpanField(GUI.IChiusura.sDESCRIZIONE, 2);
            this.fpFilter.onEnterPressed(function (e) {
                _this.btnFind.trigger('click');
            });
            this.btnNew = new WUX.WButton(this.subId('bn'), GUI.TXT.NEW, '', WUX.BTN.SM_INFO);
            this.btnNew.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    _this.btnNew.blur();
                    return;
                }
                _this.isNew = true;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.tabResult.clearSelection();
                _this.fpDetail.enabled = true;
                _this.fpDetail.clear();
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnOpen = new WUX.WButton(this.subId('bo'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    _this.btnOpen.blur();
                    return;
                }
                var sr = _this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    _this.btnOpen.blur();
                    return;
                }
                _this.isNew = false;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.fpDetail.enabled = true;
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnSave = new WUX.WButton(this.subId('bs'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    WUX.showWarning('Cliccare su Modifica.');
                    _this.btnSave.blur();
                    return;
                }
                var check = _this.fpDetail.checkMandatory(true);
                if (check) {
                    _this.btnSave.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                var idf = WUtil.toNumber(_this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Selezionare la struttura di competenza');
                    return;
                }
                var values = _this.fpDetail.getState();
                values[GUI.IChiusura.sID_FAR] = idf;
                if (_this.isNew) {
                    jrpc.execute('CHIUSURE.insert', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.selId = result[GUI.IChiusura.sID];
                        _this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('CHIUSURE.update', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.selId = result[GUI.IChiusura.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            _this.btnFind.trigger('click');
                        }
                        else {
                            var idx_5 = selRows[0];
                            var records = _this.tabResult.getState();
                            records[idx_5] = result;
                            _this.tabResult.refresh();
                            setTimeout(function () {
                                _this.tabResult.select([idx_5]);
                            }, 100);
                        }
                    });
                }
            });
            this.btnCancel = new WUX.WButton(this.subId('bc'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    _this.btnCancel.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, function (res) {
                    if (!res)
                        return;
                    if (_this.isNew) {
                        _this.fpDetail.clear();
                    }
                    else {
                        _this.onSelect();
                    }
                    _this.status = _this.iSTATUS_VIEW;
                    _this.fpDetail.enabled = false;
                    _this.selId = null;
                });
            });
            this.btnDelete = new WUX.WButton(this.subId('bd'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete.on('click', function (e) {
                _this.selId = null;
                _this.btnDelete.blur();
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length)
                    return;
                var id = WUtil.getInt(rd[0], GUI.IChiusura.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, function (res) {
                    if (!res)
                        return;
                    jrpc.execute('CHIUSURE.delete', [id], function (result) {
                        _this.btnFind.trigger('click');
                    });
                });
            });
            this.btnOpen2 = new WUX.WButton(this.subId('bo2'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen2.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    _this.btnOpen2.blur();
                    return;
                }
                var sr = _this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    _this.btnOpen2.blur();
                    return;
                }
                _this.isNew = false;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.fpDetail.enabled = true;
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnSave2 = new WUX.WButton(this.subId('bs2'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave2.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    WUX.showWarning('Cliccare su Modifica.');
                    _this.btnSave2.blur();
                    return;
                }
                var check = _this.fpDetail.checkMandatory(true);
                if (check) {
                    _this.btnSave2.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                var idf = WUtil.toNumber(_this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Selezionare la struttura di competenza');
                    return;
                }
                var values = _this.fpDetail.getState();
                values[GUI.IChiusura.sID_FAR] = idf;
                if (_this.isNew) {
                    jrpc.execute('CHIUSURE.insert', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.selId = result[GUI.IChiusura.sID];
                        _this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('CHIUSURE.update', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.selId = result[GUI.IChiusura.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            _this.btnFind.trigger('click');
                        }
                        else {
                            var idx_6 = selRows[0];
                            var records = _this.tabResult.getState();
                            records[idx_6] = result;
                            _this.tabResult.refresh();
                            setTimeout(function () {
                                _this.tabResult.select([idx_6]);
                            }, 100);
                        }
                    });
                }
            });
            this.btnCancel2 = new WUX.WButton(this.subId('bc2'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel2.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    _this.btnCancel2.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, function (res) {
                    if (!res)
                        return;
                    if (_this.isNew) {
                        _this.fpDetail.clear();
                    }
                    else {
                        _this.onSelect();
                    }
                    _this.status = _this.iSTATUS_VIEW;
                    _this.fpDetail.enabled = false;
                    _this.selId = null;
                });
            });
            this.btnDelete2 = new WUX.WButton(this.subId('bd2'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete2.on('click', function (e) {
                _this.selId = null;
                _this.btnDelete2.blur();
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length)
                    return;
                var id = WUtil.getInt(rd[0], GUI.IChiusura.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, function (res) {
                    if (!res)
                        return;
                    jrpc.execute('CHIUSURE.delete', [id], function (result) {
                        _this.btnFind.trigger('click');
                    });
                });
            });
            var rc = [
                ['Data chiusura', GUI.IChiusura.sDATA, 'd'],
                ['Descrizione', GUI.IChiusura.sDESCRIZIONE, 's'],
                ['Annuale', GUI.IChiusura.sANNUALE, 'b'],
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.types = WUtil.col(rc, 2);
            this.tabResult.css({ h: 220 });
            this.tabResult.widths = [150];
            this.tabResult.onSelectionChanged(function (e) {
                _this.onSelect();
            });
            this.cntActions = new GUI.CFTableActions('ta');
            this.cntActions.left.add(this.btnOpen);
            this.cntActions.left.add(this.btnDelete);
            this.cntActions.left.add(this.btnSave);
            this.cntActions.left.add(this.btnCancel);
            this.cntActions.right.add(this.btnNew);
            this.cntActions2 = new GUI.CFTableActions('ta2');
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
                .end()
                .addBox()
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, this.cntActions, this.tabResult, this.cntActions2)
                .end()
                .addRow()
                .addCol('12').section('Dettaglio')
                .add(this.fpDetail);
            return this.container;
        };
        GUIChiusure.prototype.collapseHandler = function (e) {
            var c = WUtil.getBoolean(e.data, 'collapsed');
            if (c) {
                this.tagsFilter.setState({});
            }
            else {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
            }
        };
        GUIChiusure.prototype.onSelect = function () {
            var _this = this;
            var item = WUtil.getItem(this.tabResult.getSelectedRowsData(), 0);
            if (!item)
                return;
            var id = WUtil.getNumber(item, GUI.IChiusura.sID);
            if (!id)
                return;
            this.fpDetail.clear();
            if (this.status == this.iSTATUS_EDITING) {
                WUX.showWarning('Modifiche annullate');
                this.fpDetail.enabled = false;
            }
            jrpc.execute('CHIUSURE.read', [id], function (result) {
                _this.fpDetail.setState(result);
                _this.status = _this.iSTATUS_VIEW;
            });
        };
        GUIChiusure.prototype.componentDidMount = function () {
            var idf = 0;
            if (GUI.strutture && GUI.strutture.length) {
                idf = GUI.strutture[0].id;
            }
            if (idf)
                this.selFar.setState(idf);
        };
        return GUIChiusure;
    }(WUX.WComponent));
    GUI.GUIChiusure = GUIChiusure;
})(GUI || (GUI = {}));
var GUI;
(function (GUI) {
    var WUtil = WUX.WUtil;
    var GUIClienti = (function (_super) {
        __extends(GUIClienti, _super);
        function GUIClienti(id) {
            var _this = _super.call(this, id ? id : '*', 'GUIClienti') || this;
            _this.iSTATUS_STARTUP = 0;
            _this.iSTATUS_VIEW = 1;
            _this.iSTATUS_EDITING = 2;
            _this.status = _this.iSTATUS_STARTUP;
            _this.dataRif = WUtil.toNumber(new Date());
            _this.dlgMrgC = new GUI.DlgClienti(_this.subId('dlgm'));
            _this.dlgMrgC.onHiddenModal(function (e) {
                if (!_this.dlgMrgC.ok)
                    return;
                var selItem = _this.dlgMrgC.getState();
                if (!selItem || !selItem[GUI.ICliente.sID]) {
                    WUX.showWarning('Cliente non selezionato dalla finestra di dialogo.');
                    return;
                }
                if (!_this.itemMrg || !_this.itemMrg[GUI.ICliente.sID]) {
                    WUX.showWarning('Cliente non selezionato.');
                    return;
                }
                if (_this.itemMrg[GUI.ICliente.sID] == selItem[GUI.ICliente.sID]) {
                    WUX.showWarning('Il cliente selezionato &egrave; lo stesso di quello che si vuole accorpare.');
                    return;
                }
                var cid1 = WUtil.getNumber(_this.itemMrg, GUI.ICliente.sID);
                var cco1 = WUtil.getString(_this.itemMrg, GUI.ICliente.sCOGNOME);
                var cno1 = WUtil.getString(_this.itemMrg, GUI.ICliente.sNOME);
                var cte1 = WUtil.getString(_this.itemMrg, GUI.ICliente.sTELEFONO1);
                var cli1 = cco1;
                if (cno1)
                    cli1 += ' ' + cno1;
                if (cte1)
                    cli1 += ' (' + cte1 + ')';
                var cid2 = WUtil.getNumber(selItem, GUI.ICliente.sID);
                var cco2 = WUtil.getString(selItem, GUI.ICliente.sCOGNOME);
                var cno2 = WUtil.getString(selItem, GUI.ICliente.sNOME);
                var cte2 = WUtil.getString(selItem, GUI.ICliente.sTELEFONO1);
                var cli2 = cco2;
                if (cno2)
                    cli2 += ' ' + cno2;
                if (cte2)
                    cli2 += ' (' + cte2 + ')';
                var msg = 'Il cliente ' + cli1 + ' sara\' rimosso e le sue prenotazioni passeranno a ' + cli2 + '. ';
                msg += 'L\'operazione sara\' irreversibile. Si vuole procedere con l\'accorpamento?';
                WUX.confirm(msg, function (res) {
                    if (!res)
                        return;
                    jrpc.execute('CLIENTI.merge', [cid1, cid2], function (result) {
                        if (result) {
                            WUX.showSuccess('Cliente accorpato con successo.');
                            _this.btnFind.trigger('click');
                        }
                        else {
                            WUX.showSuccess('Operazione NON eseguita.');
                        }
                    });
                });
            });
            _this.dlgPren = new GUI.DlgPrenotazione(_this.subId('dlgp'));
            _this.dlgText = new GUI.DlgSMSText(_this.subId('dlgs'));
            _this.dlgText.onHiddenModal(function (e) {
                if (!_this.dlgText.ok)
                    return;
                var text = _this.dlgText.getState();
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length) {
                    WUX.showWarning('Cliente non selezionato.');
                    return;
                }
                var id = WUtil.getInt(rd[0], GUI.ICliente.sID);
                jrpc.execute('CLIENTI.sendSMS', [id, text], function (result) {
                    if (result) {
                        WUX.showSuccess('Messaggio inviato con successo.');
                    }
                    else {
                        WUX.showSuccess('Messaggio NON inviato.');
                    }
                });
            });
            _this.dlgComm = new GUI.DlgComunicazione(_this.subId('dlgc'));
            _this.dlgComm.onHiddenModal(function (e) {
                if (!_this.dlgComm.ok)
                    return;
                var c = _this.dlgComm.getProps();
                if (!c || !c.id) {
                    WUX.showWarning('Comunicazione non selezionata.');
                    return;
                }
                var r = _this.tabResult.getState();
                if (!r || !r.length) {
                    WUX.showWarning('Effettuare una ricerca per l\'invio di una comunicazione');
                    return;
                }
                var a = [];
                for (var i = 0; i < r.length; i++) {
                    a[i] = WUtil.getNumber(r[i], GUI.ICliente.sID);
                }
                jrpc.execute('COMUNICAZIONI.add', [c.id, a], function (result) {
                    if (result) {
                        WUX.showSuccess(result + ' clienti inseriti nella lista di comunicazione.');
                    }
                    else {
                        WUX.showSuccess('Nessun cliente inserito nella lista di comunicazione.');
                    }
                });
            });
            return _this;
        }
        GUIClienti.prototype.render = function () {
            var _this = this;
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING)
                    return;
                var box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    _this.tagsFilter.setState(_this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('CLIENTI.find', [_this.fpFilter.getState()], function (result) {
                    _this.itemMrg = null;
                    _this.tabResult.setState(result);
                    _this.fpDetail.clear();
                    _this.status = _this.iSTATUS_STARTUP;
                    if (_this.selId) {
                        var idx_7 = WUtil.indexOf(result, GUI.ICliente.sID, _this.selId);
                        if (idx_7 >= 0) {
                            setTimeout(function () {
                                _this.tabResult.select([idx_7]);
                            }, 100);
                        }
                        _this.selId = null;
                    }
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING)
                    return;
                _this.itemMrg = null;
                _this.fpFilter.clear();
                _this.tagsFilter.setState({});
                _this.tabResult.setState([]);
                _this.fpDetail.clear();
                _this.status = _this.iSTATUS_STARTUP;
            });
            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addTextField(GUI.ICliente.sCOGNOME, 'Cognome');
            this.fpFilter.addTextField(GUI.ICliente.sNOME, 'Nome');
            this.fpFilter.addOptionsField(GUI.ICliente.sSESSO, 'Sesso', [{ id: '', text: '' }, { id: 'M', text: 'Maschio' }, { id: 'F', text: 'Femmina' }]);
            this.fpFilter.addComponent(GUI.ICliente.sOPZIONI, 'Opzioni', new GUI.CFSelOpzClienti());
            this.fpFilter.addRow();
            this.fpFilter.addTextField(GUI.ICliente.sTELEFONO1, 'Telefono');
            this.fpFilter.addTextField(GUI.ICliente.sEMAIL, 'Email');
            this.fpFilter.addIntegerField(GUI.ICliente.sETA_DA, 'Et&agrave; da');
            this.fpFilter.addIntegerField(GUI.ICliente.sETA_A, 'Et&agrave; a');
            this.fpDetail = new WUX.WFormPanel(this.subId('fpd'));
            this.fpDetail.addRow();
            this.fpDetail.addTextField(GUI.ICliente.sCOGNOME, 'Cognome');
            this.fpDetail.addTextField(GUI.ICliente.sNOME, 'Nome');
            this.fpDetail.addTextField(GUI.ICliente.sTELEFONO1, 'Telefono');
            this.fpDetail.addTextField(GUI.ICliente.sEMAIL, 'Email');
            this.fpDetail.addRow();
            this.fpDetail.addDateField(GUI.ICliente.sDATA_NASCITA, 'Data di nascita');
            this.fpDetail.addOptionsField(GUI.ICliente.sSESSO, 'Sesso', [{ id: '', text: '' }, { id: 'M', text: 'Maschio' }, { id: 'F', text: 'Femmina' }]);
            this.fpDetail.addBooleanField(GUI.ICliente.sDIS_PREN_ONLINE, 'Disab. Pren. OnLine');
            this.fpDetail.addBlankField();
            this.fpDetail.addRow();
            this.fpDetail.addTextField(GUI.ICliente.sNOTE, 'Note');
            this.fpDetail.addInternalField(GUI.ICliente.sID);
            this.fpDetail.enabled = false;
            var sc = [
                ['Data App.', GUI.IPrenotazione.sDATA_APP, 'd'],
                ['Ora App.', GUI.IPrenotazione.sORA_APP, 's'],
                ['Durata', GUI.IPrenotazione.sDURATA, 'i'],
                ['Stato', GUI.IPrenotazione.sSTATO, 's'],
                ['Collaboratore', GUI.IPrenotazione.sDESC_COLL, 's'],
                ['Trattamento', GUI.IPrenotazione.sDESC_PREST, 's'],
                ['Cabina', GUI.IPrenotazione.sDESC_ATTR, 's'],
                ['Data Pren.', GUI.IPrenotazione.sDATA_PREN, 'd'],
                ['Data Agg.', GUI.IPrenotazione.sDATA_UPD, 't'],
                ['Struttura', GUI.IPrenotazione.sCOD_FAR, 's'],
                ['Note', GUI.IPrenotazione.sNOTE, 's'],
                ['Coupon', GUI.IPrenotazione.sCOD_COUPON, 's'],
                ['Forzatura', GUI.IPrenotazione.sOVERBOOKING, 'b'],
                ['On Line', GUI.IPrenotazione.sPREN_ONLINE, 'b']
            ];
            this.tabStorico = new WUX.WDXTable(this.subId('tps'), WUtil.col(sc, 0), WUtil.col(sc, 1));
            this.tabStorico.types = WUtil.col(sc, 2);
            this.tabStorico.css({ h: 200, f: 10 });
            this.tabStorico.onRowPrepared(function (e) {
                if (!e.data)
                    return;
                var stato = WUtil.getString(e.data, GUI.IPrenotazione.sSTATO, 'C');
                var pdata = WUtil.getInt(e.data, GUI.IPrenotazione.sDATA_APP);
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
                if (pdata == _this.dataRif) {
                    e.rowElement.css('font-weight', 'bold');
                }
            });
            this.tabStorico.onDoubleClick(function (e) {
                var srd = _this.tabStorico.getSelectedRowsData();
                if (!srd || !srd.length)
                    return;
                var id = WUtil.getString(srd[0], GUI.IPrenotazione.sID);
                jrpc.execute('PRENOTAZIONI.read', [id], function (result) {
                    if (!result) {
                        WUX.showWarning('Prenotazione ' + id + ' non disponibile.');
                        return;
                    }
                    var dataApp = WUtil.getDate(result, GUI.IPrenotazione.sDATA_APP);
                    if (dataApp) {
                        result[GUI.IPrenotazione.sDATA_APP] = WUX.formatDate(dataApp, true);
                    }
                    var dataPre = WUtil.getDate(result, GUI.IPrenotazione.sDATA_PREN);
                    if (dataPre) {
                        result[GUI.IPrenotazione.sDATA_PREN] = WUX.formatDateTime(dataPre, false, true);
                    }
                    _this.dlgPren.setState(result);
                    _this.dlgPren.show();
                });
            });
            this.fpFilter.onEnterPressed(function (e) {
                _this.btnFind.trigger('click');
            });
            this.btnNew = new WUX.WButton(this.subId('bn'), GUI.TXT.NEW, '', WUX.BTN.SM_INFO);
            this.btnNew.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    _this.btnNew.blur();
                    return;
                }
                _this.isNew = true;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.tabResult.clearSelection();
                _this.fpDetail.enabled = true;
                _this.fpDetail.clear();
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnOpen = new WUX.WButton(this.subId('bo'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    _this.btnOpen.blur();
                    return;
                }
                var sr = _this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    _this.btnOpen.blur();
                    return;
                }
                _this.isNew = false;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.fpDetail.enabled = true;
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnSave = new WUX.WButton(this.subId('bs'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    _this.btnSave.blur();
                    return;
                }
                var check = _this.fpDetail.checkMandatory(true);
                if (check) {
                    _this.btnSave.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                var values = _this.fpDetail.getState();
                if (_this.isNew) {
                    jrpc.execute('CLIENTI.insert', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.selId = result[GUI.ICliente.sID];
                        if (_this.fpFilter.isBlank(GUI.ICliente.sCOGNOME)) {
                            _this.fpFilter.setValue(GUI.ICliente.sCOGNOME, WUtil.getString(result, GUI.ICliente.sCOGNOME));
                        }
                        _this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('CLIENTI.update', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.selId = result[GUI.ICliente.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            if (_this.fpFilter.isBlank(GUI.ICliente.sCOGNOME)) {
                                _this.fpFilter.setValue(GUI.ICliente.sCOGNOME, WUtil.getString(result, GUI.ICliente.sCOGNOME));
                            }
                            _this.btnFind.trigger('click');
                        }
                        else {
                            var idx_8 = selRows[0];
                            var records = _this.tabResult.getState();
                            records[idx_8] = result;
                            _this.tabResult.refresh();
                            setTimeout(function () {
                                _this.tabResult.select([idx_8]);
                            }, 100);
                        }
                    });
                }
            });
            this.btnCancel = new WUX.WButton(this.subId('bc'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    _this.btnCancel.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, function (res) {
                    if (!res)
                        return;
                    if (_this.isNew) {
                        _this.fpDetail.clear();
                    }
                    else {
                        _this.onSelect();
                    }
                    _this.status = _this.iSTATUS_VIEW;
                    _this.fpDetail.enabled = false;
                    _this.selId = null;
                });
            });
            this.btnDelete = new WUX.WButton(this.subId('bd'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete.on('click', function (e) {
                _this.selId = null;
                _this.btnDelete.blur();
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length)
                    return;
                var id = WUtil.getInt(rd[0], GUI.ICliente.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, function (res) {
                    if (!res)
                        return;
                    jrpc.execute('CLIENTI.delete', [id], function (result) {
                        _this.btnFind.trigger('click');
                    });
                });
            });
            this.btnMerge = new WUX.WButton(this.subId('bm'), 'Accorpa', GUI.ICO.COPY, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnMerge.on('click', function (e) {
                _this.selId = null;
                _this.itemMrg = null;
                _this.btnMerge.blur();
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length)
                    return;
                _this.itemMrg = rd[0];
                var cid1 = WUtil.getNumber(_this.itemMrg, GUI.ICliente.sID);
                var cco1 = WUtil.getString(_this.itemMrg, GUI.ICliente.sCOGNOME);
                var cno1 = WUtil.getString(_this.itemMrg, GUI.ICliente.sNOME);
                var cte1 = WUtil.getString(_this.itemMrg, GUI.ICliente.sTELEFONO1);
                var cli1 = cco1;
                if (cno1)
                    cli1 += ' ' + cno1;
                if (cte1)
                    cli1 += ' (' + cte1 + ')';
                var msg = 'Il cliente ' + cli1 + ' sara\' rimosso e le sue prenotazioni ';
                msg += 'passeranno al cliente che sara\' selezionato nel prossimo passaggio. ';
                msg += 'In questo modo le due posizioni anagrafiche saranno accorpate. Proseguire?';
                WUX.confirm(msg, function (res) {
                    if (!res)
                        return;
                    _this.dlgMrgC.setProps(cid1);
                    _this.fpFilter.transferTo(_this.dlgMrgC.fpFilter);
                    _this.dlgMrgC.show();
                });
            });
            this.btnSMS = new WUX.WButton(this.subId('bx'), 'Invia SMS', WUX.WIcon.ENVELOPE_O, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnSMS.on('click', function (e) {
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length) {
                    WUX.showWarning('Selezionare un cliente per inviare un SMS');
                    return;
                }
                _this.dlgText.setState('');
                _this.dlgText.show();
            });
            this.btnComm = new WUX.WButton(this.subId('by'), 'Comunicazione', WUX.WIcon.SEND, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnComm.on('click', function (e) {
                var clienti = _this.tabResult.getState();
                if (!clienti || !clienti.length) {
                    WUX.showWarning('Effettuare una ricerca per l\'invio di una comunicazione');
                    return;
                }
                if (!GUI.strutture || !GUI.strutture.length) {
                    WUX.showWarning('Strutture non caricate');
                    return;
                }
                jrpc.execute('COMUNICAZIONI.getAll', [GUI.strutture[0].id], function (result) {
                    _this.dlgComm.setState(result);
                    _this.dlgComm.show();
                });
            });
            var rc = [
                ['Cognome', GUI.ICliente.sCOGNOME, 's'],
                ['Nome', GUI.ICliente.sNOME, 's'],
                ['Telefono', GUI.ICliente.sTELEFONO1, 's'],
                ['Email', GUI.ICliente.sEMAIL, 's'],
                ['Sesso', GUI.ICliente.sSESSO, 's'],
                ['Data Nascita', GUI.ICliente.sDATA_NASCITA, 'd']
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.exportFile = 'clienti';
            this.tabResult.types = WUtil.col(rc, 2);
            this.tabResult.css({ h: 250 });
            this.tabResult.widths = [100];
            this.tabResult.onSelectionChanged(function (e) {
                _this.onSelect();
            });
            this.tabResult.onRowPrepared(function (e) {
                if (!e.data)
                    return;
                if (e.data[GUI.ICliente.sREPUTAZIONE]) {
                    WUX.setCss(e.rowElement, WUX.CSS.ERROR);
                }
            });
            this.cntActions = new GUI.CFTableActions('ta');
            this.cntActions.left.add(this.btnOpen);
            this.cntActions.left.add(this.btnDelete);
            this.cntActions.left.add(this.btnSave);
            this.cntActions.left.add(this.btnCancel);
            this.cntActions.left.add(this.btnMerge);
            this.cntActions.left.add(this.btnSMS);
            this.cntActions.left.add(this.btnComm);
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
                .end()
                .addBox()
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, this.cntActions, this.tabResult)
                .end()
                .addRow()
                .addCol('12').section('Dettaglio')
                .add(this.fpDetail)
                .addRow()
                .addCol('12').section('Storico Prenotazioni')
                .add(this.tabStorico);
            return this.container;
        };
        GUIClienti.prototype.collapseHandler = function (e) {
            var c = WUtil.getBoolean(e.data, 'collapsed');
            if (c) {
                this.tagsFilter.setState({});
            }
            else {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
            }
        };
        GUIClienti.prototype.onSelect = function () {
            var _this = this;
            var item = WUtil.getItem(this.tabResult.getSelectedRowsData(), 0);
            if (!item)
                return;
            var id = WUtil.getNumber(item, GUI.ICliente.sID);
            if (!id)
                return;
            if (this.status == this.iSTATUS_EDITING) {
                WUX.showWarning('Modifiche annullate');
                this.fpDetail.enabled = false;
            }
            this.fpDetail.clear();
            jrpc.execute('CLIENTI.read', [id], function (result) {
                _this.fpDetail.setState(result);
                _this.tabStorico.setState(WUtil.getArray(result, GUI.ICliente.sPRENOTAZIONI));
                _this.status = _this.iSTATUS_VIEW;
            });
        };
        return GUIClienti;
    }(WUX.WComponent));
    GUI.GUIClienti = GUIClienti;
})(GUI || (GUI = {}));
var GUI;
(function (GUI) {
    var WUtil = WUX.WUtil;
    var GUICollaboratori = (function (_super) {
        __extends(GUICollaboratori, _super);
        function GUICollaboratori(id) {
            var _this = _super.call(this, id ? id : '*', 'GUICollaboratori') || this;
            _this.iSTATUS_STARTUP = 0;
            _this.iSTATUS_VIEW = 1;
            _this.iSTATUS_EDITING = 2;
            _this.status = _this.iSTATUS_STARTUP;
            _this.dlgOrariPers = new GUI.DlgOrariPers(_this.subId('dlgop'));
            _this.dlgOrariPers.onHiddenModal(function (e) {
                if (!_this.dlgOrariPers.ok)
                    return;
                var idf = WUtil.toNumber(_this.selFar.getState());
                var date = _this.dlgOrariPers.getProps();
                var varz = WUtil.getObject(_this.dlgOrariPers.getState(), GUI.ICalendario.sORARI);
                if (!date) {
                    WUX.showWarning('Data variazione non presente.');
                    return;
                }
                GUI.chkExecute('CALENDARIO.saveVariazioni', [idf, date, varz], function (result) {
                    WUX.showSuccess('Variazione salvata con successo.');
                });
            });
            _this.dlgAgenda = new GUI.DlgAgenda(_this.subId('dlga'));
            _this.dlgAgenda.onHiddenModal(function (e) {
                if (!_this.dlgAgenda.ok)
                    return;
                var agenda = _this.dlgAgenda.getState();
                if (!agenda) {
                    WUX.showWarning('Informazioni agenda assenti');
                    return;
                }
                var item = WUtil.getItem(_this.tabResult.getSelectedRowsData(), 0);
                if (!item)
                    return;
                var idc = WUtil.getNumber(item, GUI.ICollaboratore.sID);
                if (!idc) {
                    WUX.showWarning('Collaboratore non selezionato.');
                    return;
                }
                var prevId = agenda.id;
                var preOnLine = WUtil.toBoolean(_this.fpDetail.getValue(GUI.ICollaboratore.sPREN_ONLINE));
                GUI.chkExecute('COLLABORATORI.addAgenda', [idc, preOnLine, agenda], function (result) {
                    if (!result) {
                        WUX.showWarning('Piano NON inserito');
                        return;
                    }
                    WUX.showSuccess('Piano inserito con successo.');
                    agenda.id = result;
                    var v = _this.tabVar.getState();
                    if (!v)
                        v = [];
                    if (prevId) {
                        var idx = WUtil.indexOf(v, 'id', prevId);
                        if (idx >= 0)
                            v.splice(idx, 1);
                    }
                    v.push(agenda);
                    _this.tabVar.setState(v);
                });
            });
            _this.dlgAssenze = new GUI.DlgAssenze(_this.subId('dlgx'));
            _this.dlgAssenze.onHiddenModal(function (e) {
                if (!_this.dlgAssenze.ok)
                    return;
                var dates = _this.dlgAssenze.getState();
                if (dates == null || dates.length < 2)
                    return;
                var item = WUtil.getItem(_this.tabResult.getSelectedRowsData(), 0);
                if (!item)
                    return;
                var idc = WUtil.getNumber(item, GUI.ICollaboratore.sID);
                if (!idc) {
                    WUX.showWarning('Collaboratore non selezionato.');
                    return;
                }
                GUI.chkExecute('COLLABORATORI.addAssenze', [idc, dates[0], dates[1]], function (result) {
                    if (!result || !result.length) {
                        WUX.showWarning('Assenze NON inserite');
                        return;
                    }
                    WUX.showSuccess(result.length + ' variazioni giornaliere inserite');
                    var v = _this.tabVar.getState();
                    if (!v)
                        v = [];
                    for (var i = 0; i < result.length; i++) {
                        v.push(result[i]);
                    }
                    _this.tabVar.setState(v);
                });
            });
            return _this;
        }
        GUICollaboratori.prototype.render = function () {
            var _this = this;
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var check = _this.fpFilter.checkMandatory(true, true, false);
                if (check) {
                    WUX.showWarning('Specificare i seguenti campi: ' + check);
                    return;
                }
                var box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    _this.tagsFilter.setState(_this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('COLLABORATORI.find', [_this.fpFilter.getState()], function (result) {
                    _this.tabResult.setState(result);
                    _this.fpDetail.clear();
                    _this.cmpAgenda.clear();
                    _this.tabVar.setState([]);
                    _this.tabSel.setState([]);
                    _this.tabAll.clearSelection();
                    _this.tabAll.clearFilter();
                    _this.btnVisible.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                    _this.btnVisible2.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                    _this.status = _this.iSTATUS_STARTUP;
                    if (_this.selId) {
                        var idx_9 = WUtil.indexOf(result, GUI.ICollaboratore.sID, _this.selId);
                        if (idx_9 >= 0) {
                            setTimeout(function () {
                                _this.tabResult.select([idx_9]);
                            }, 200);
                        }
                        _this.selId = null;
                    }
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                _this.fpFilter.clear();
                _this.tagsFilter.setState({});
                _this.tabResult.setState([]);
                _this.fpDetail.clear();
                _this.cmpAgenda.clear();
                _this.tabVar.setState([]);
                _this.tabSel.setState([]);
                _this.tabAll.clearSelection();
                _this.tabAll.clearFilter();
                _this.btnVisible.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                _this.btnVisible2.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                _this.status = _this.iSTATUS_STARTUP;
            });
            this.selFar = new GUI.CFSelectStruture();
            this.selFar.on('statechange', function (e) {
                _this.tabResult.setState([]);
                _this.fpDetail.clear();
                _this.cmpAgenda.clear();
                _this.tabVar.setState([]);
                _this.tabSel.setState([]);
                _this.tabAll.clearSelection();
                _this.tabAll.clearFilter();
                GUI.cp_prest = null;
                var idf = WUtil.toNumber(_this.selFar.getState(), 0);
                jrpc.execute('PRESTAZIONI.getAll', [idf], function (result) {
                    _this.tabAll.setState(result);
                });
            });
            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent(GUI.ICollaboratore.sID_FAR, 'Struttura', this.selFar);
            this.fpFilter.addTextField(GUI.ICollaboratore.sNOME, 'Nome');
            this.fpFilter.setMandatory(GUI.ICollaboratore.sID_FAR);
            this.fpDetail = new WUX.WFormPanel(this.subId('fpd'));
            this.fpDetail.addRow();
            this.fpDetail.addTextField(GUI.ICollaboratore.sNOME, 'Nome');
            this.fpDetail.addBlankField();
            this.fpDetail.addBlankField();
            this.fpDetail.addRow();
            this.fpDetail.addBooleanField(GUI.ICollaboratore.sPREN_ONLINE, 'Prenotabile On Line');
            this.fpDetail.addBlankField();
            this.fpDetail.addBlankField();
            this.fpDetail.addRow();
            this.fpDetail.addComponent(GUI.ICollaboratore.sCOLORE, 'Colore', new GUI.CFSelectColore());
            this.fpDetail.addBlankField();
            this.fpDetail.addBlankField();
            this.fpDetail.addRow();
            this.fpDetail.addIntegerField(GUI.ICollaboratore.sORDINE, 'Ordine nel planning');
            this.fpDetail.addBooleanField(GUI.ICollaboratore.sVISIBILE, 'Visibile nel planning');
            this.fpDetail.addBlankField();
            this.fpDetail.addInternalField(GUI.ICollaboratore.sID);
            this.fpDetail.enabled = false;
            this.fpFilter.onEnterPressed(function (e) {
                _this.btnFind.trigger('click');
            });
            this.btnNew = new WUX.WButton(this.subId('bn'), GUI.TXT.NEW, '', WUX.BTN.SM_INFO);
            this.btnNew.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    _this.btnNew.blur();
                    return;
                }
                _this.isNew = true;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.tabResult.clearSelection();
                _this.fpDetail.enabled = true;
                _this.cmpAgenda.enabled = true;
                _this.btnDx.enabled = true;
                _this.btnSx.enabled = true;
                _this.btnPa.enabled = true;
                _this.fpDetail.clear();
                _this.cmpAgenda.clear();
                _this.tabVar.setState([]);
                _this.tabSel.setState([]);
                _this.tabAll.clearSelection();
                _this.tabAll.clearFilter();
                _this.tcoDetail.setState(0);
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnOpen = new WUX.WButton(this.subId('bo'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    _this.btnOpen.blur();
                    return;
                }
                var sr = _this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    _this.btnOpen.blur();
                    return;
                }
                _this.isNew = false;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.fpDetail.enabled = true;
                _this.cmpAgenda.enabled = true;
                _this.btnDx.enabled = true;
                _this.btnSx.enabled = true;
                _this.btnPa.enabled = true;
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnSave = new WUX.WButton(this.subId('bs'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    WUX.showWarning('Cliccare su Modifica.');
                    _this.btnSave.blur();
                    return;
                }
                var check = _this.fpDetail.checkMandatory(true);
                if (check) {
                    _this.btnSave.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                var idf = WUtil.toNumber(_this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Selezionare la struttura di competenza');
                    return;
                }
                if (!_this.cmpAgenda.isBlank() && !_this.cmpAgenda.isActivated()) {
                    WUX.showWarning('Planning non generato poich&aacute; orario non attivato.');
                }
                var values = _this.fpDetail.getState();
                values[GUI.ICollaboratore.sID_FAR] = idf;
                values[GUI.ICollaboratore.sPRESTAZIONI] = _this.tabSel.getState();
                values[GUI.ICollaboratore.sAGENDA] = _this.cmpAgenda.getState();
                if (_this.isNew) {
                    jrpc.execute('COLLABORATORI.insert', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.cmpAgenda.enabled = false;
                        _this.btnDx.enabled = false;
                        _this.btnSx.enabled = false;
                        _this.btnPa.enabled = false;
                        WUX.showSuccess('Collaboratore inserito con successo.');
                        _this.selId = result[GUI.ICollaboratore.sID];
                        _this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('COLLABORATORI.update', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.cmpAgenda.enabled = false;
                        _this.btnDx.enabled = false;
                        _this.btnSx.enabled = false;
                        _this.btnPa.enabled = false;
                        WUX.showSuccess('Collaboratore aggiornato con successo.');
                        _this.selId = result[GUI.ICollaboratore.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            _this.btnFind.trigger('click');
                        }
                        else {
                            var idx_10 = selRows[0];
                            var records = _this.tabResult.getState();
                            records[idx_10] = result;
                            _this.tabResult.refresh();
                            setTimeout(function () {
                                _this.tabResult.select([idx_10]);
                            }, 100);
                        }
                    });
                }
            });
            this.btnCancel = new WUX.WButton(this.subId('bc'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    _this.btnCancel.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, function (res) {
                    if (!res)
                        return;
                    if (_this.isNew) {
                        _this.fpDetail.clear();
                        _this.tabSel.setState([]);
                        _this.tabAll.clearSelection();
                        _this.tabAll.clearFilter();
                    }
                    else {
                        _this.onSelect();
                    }
                    _this.status = _this.iSTATUS_VIEW;
                    _this.fpDetail.enabled = false;
                    _this.cmpAgenda.enabled = false;
                    _this.btnDx.enabled = false;
                    _this.btnSx.enabled = false;
                    _this.btnPa.enabled = false;
                    _this.selId = null;
                });
            });
            this.btnDelete = new WUX.WButton(this.subId('bd'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete.on('click', function (e) {
                _this.selId = null;
                _this.btnDelete.blur();
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length) {
                    WUX.showWarning('Selezione l\'elemento da eliminare');
                    return;
                }
                var id = WUtil.getInt(rd[0], GUI.ICollaboratore.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, function (res) {
                    if (!res)
                        return;
                    jrpc.execute('COLLABORATORI.delete', [id], function (result) {
                        _this.btnFind.trigger('click');
                    });
                });
            });
            this.btnVisible = new WUX.WButton(this.subId('bv'), 'Visibile', WUX.WIcon.THUMBS_O_UP, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnVisible.on('click', function (e) {
                _this.btnVisible.blur();
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length) {
                    WUX.showWarning('Selezione l\'elemento da aggiornare');
                    return;
                }
                var id = WUtil.getInt(rd[0], GUI.ICollaboratore.sID);
                var nv = !WUtil.getBoolean(rd[0], GUI.ICollaboratore.sVISIBILE);
                jrpc.execute('COLLABORATORI.setVisible', [id, nv], function (result) {
                    if (result) {
                        WUX.showSuccess('Aggiornamento eseguito con successo.');
                        _this.selId = result[GUI.ICollaboratore.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            _this.btnFind.trigger('click');
                        }
                        else {
                            var idx_11 = selRows[0];
                            var records = _this.tabResult.getState();
                            if (records[idx_11]) {
                                records[idx_11][GUI.ICollaboratore.sVISIBILE] = nv;
                                _this.tabResult.refresh();
                                setTimeout(function () {
                                    _this.tabResult.select([idx_11]);
                                }, 100);
                                if (nv) {
                                    _this.btnVisible.setText('Non visibile', WUX.WIcon.THUMBS_O_DOWN);
                                    _this.btnVisible2.setText('Non visibile', WUX.WIcon.THUMBS_O_DOWN);
                                }
                                else {
                                    _this.btnVisible.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                                    _this.btnVisible2.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                                }
                            }
                        }
                    }
                });
            });
            this.btnOpen2 = new WUX.WButton(this.subId('bo2'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen2.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    _this.btnOpen2.blur();
                    return;
                }
                var sr = _this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    _this.btnOpen2.blur();
                    return;
                }
                _this.isNew = false;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.fpDetail.enabled = true;
                _this.cmpAgenda.enabled = true;
                _this.btnDx.enabled = true;
                _this.btnSx.enabled = true;
                _this.btnPa.enabled = true;
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnSave2 = new WUX.WButton(this.subId('bs2'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave2.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    WUX.showWarning('Cliccare su Modifica.');
                    _this.btnSave2.blur();
                    return;
                }
                var check = _this.fpDetail.checkMandatory(true);
                if (check) {
                    _this.btnSave2.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                var idf = WUtil.toNumber(_this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Selezionare la struttura di competenza');
                    return;
                }
                if (!_this.cmpAgenda.isBlank() && !_this.cmpAgenda.isActivated()) {
                    WUX.showWarning('Planning non generato poich&aacute; orario non attivato.');
                }
                var values = _this.fpDetail.getState();
                values[GUI.ICollaboratore.sID_FAR] = idf;
                values[GUI.ICollaboratore.sPRESTAZIONI] = _this.tabSel.getState();
                values[GUI.ICollaboratore.sAGENDA] = _this.cmpAgenda.getState();
                if (_this.isNew) {
                    jrpc.execute('COLLABORATORI.insert', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.cmpAgenda.enabled = false;
                        _this.btnDx.enabled = false;
                        _this.btnSx.enabled = false;
                        _this.btnPa.enabled = false;
                        WUX.showSuccess('Collaboratore inserito con successo.');
                        _this.selId = result[GUI.ICollaboratore.sID];
                        _this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('COLLABORATORI.update', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.cmpAgenda.enabled = false;
                        _this.btnDx.enabled = false;
                        _this.btnSx.enabled = false;
                        _this.btnPa.enabled = false;
                        WUX.showSuccess('Collaboratore aggiornato con successo.');
                        _this.selId = result[GUI.ICollaboratore.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            _this.btnFind.trigger('click');
                        }
                        else {
                            var idx_12 = selRows[0];
                            var records = _this.tabResult.getState();
                            records[idx_12] = result;
                            _this.tabResult.refresh();
                            setTimeout(function () {
                                _this.tabResult.select([idx_12]);
                            }, 100);
                        }
                    });
                }
            });
            this.btnCancel2 = new WUX.WButton(this.subId('bc2'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel2.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    _this.btnCancel2.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, function (res) {
                    if (!res)
                        return;
                    if (_this.isNew) {
                        _this.fpDetail.clear();
                        _this.tabSel.setState([]);
                        _this.tabAll.clearSelection();
                        _this.tabAll.clearFilter();
                    }
                    else {
                        _this.onSelect();
                    }
                    _this.status = _this.iSTATUS_VIEW;
                    _this.fpDetail.enabled = false;
                    _this.cmpAgenda.enabled = false;
                    _this.btnDx.enabled = false;
                    _this.btnSx.enabled = false;
                    _this.btnPa.enabled = false;
                    _this.selId = null;
                });
            });
            this.btnDelete2 = new WUX.WButton(this.subId('bd2'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete2.on('click', function (e) {
                _this.selId = null;
                _this.btnDelete2.blur();
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length) {
                    WUX.showWarning('Selezione l\'elemento da eliminare');
                    return;
                }
                var id = WUtil.getInt(rd[0], GUI.ICollaboratore.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, function (res) {
                    if (!res)
                        return;
                    jrpc.execute('COLLABORATORI.delete', [id], function (result) {
                        _this.btnFind.trigger('click');
                    });
                });
            });
            this.btnVisible2 = new WUX.WButton(this.subId('bv2'), 'Visibile', WUX.WIcon.THUMBS_O_UP, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnVisible2.on('click', function (e) {
                _this.btnVisible2.blur();
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length) {
                    WUX.showWarning('Selezione l\'elemento da aggiornare');
                    return;
                }
                var id = WUtil.getInt(rd[0], GUI.ICollaboratore.sID);
                var nv = !WUtil.getBoolean(rd[0], GUI.ICollaboratore.sVISIBILE);
                jrpc.execute('COLLABORATORI.setVisible', [id, nv], function (result) {
                    if (result) {
                        WUX.showSuccess('Aggiornamento eseguito con successo.');
                        _this.selId = result[GUI.ICollaboratore.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            _this.btnFind.trigger('click');
                        }
                        else {
                            var idx_13 = selRows[0];
                            var records = _this.tabResult.getState();
                            if (records[idx_13]) {
                                records[idx_13][GUI.ICollaboratore.sVISIBILE] = nv;
                                _this.tabResult.refresh();
                                setTimeout(function () {
                                    _this.tabResult.select([idx_13]);
                                }, 100);
                                if (nv) {
                                    _this.btnVisible.setText('Non visibile', WUX.WIcon.THUMBS_O_DOWN);
                                    _this.btnVisible2.setText('Non visibile', WUX.WIcon.THUMBS_O_DOWN);
                                }
                                else {
                                    _this.btnVisible.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                                    _this.btnVisible2.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                                }
                            }
                        }
                    }
                });
            });
            var rc = [
                ['Colore', GUI.ICollaboratore.sCOLORE, 's'],
                ['Nome', GUI.ICollaboratore.sNOME, 's'],
                ['Ordine', GUI.ICollaboratore.sORDINE, 'i'],
                ['Pren. On Line', GUI.ICollaboratore.sPREN_ONLINE, 'b'],
                ['Visibile', GUI.ICollaboratore.sVISIBILE, 'b']
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.css({ h: 220 });
            this.tabResult.widths = [50, 300];
            this.tabResult.types = WUtil.col(rc, 2);
            this.tabResult.onSelectionChanged(function (e) {
                _this.onSelect();
            });
            this.tabResult.onCellPrepared(function (e) {
                if (e.rowType == 'header')
                    return;
                e.cellElement.css('padding', '4px 0px 4px 8px');
                var df = e.column.dataField;
                if (df == GUI.ICollaboratore.sCOLORE) {
                    e.cellElement.html('<div style="width:30px;height:30px;border-radius:50%;background-color:#' + e.value + ';"></div>');
                }
            });
            this.lblVar = new WUX.WLabel(this.subId('lba'), 'Non occorre cliccare su Modifica o Salva: le modifiche fatte in questa sezione sono immediate.', WUX.WIcon.WARNING);
            this.lblVar.css({ f: 14, fw: 'bold' }, WUX.CSS.LABEL_NOTICE);
            this.tabVar = new WUX.WDXTable(this.subId('tbv'), ['Inizio Val.', 'Fine Val.', 'Descrizione'], ['inizioValidita', 'fineValidita', 'descrizione']);
            this.tabVar.selectionMode = 'single';
            this.tabVar.css({ h: 250 });
            this.tabVar.widths = [120, 120];
            this.tabVar.onDoubleClick(function (e) {
                var srd = _this.tabVar.getSelectedRowsData();
                if (!srd || !srd.length)
                    return;
                var idv = WUtil.getNumber(srd[0], 'id');
                if (!idv) {
                    WUX.showWarning('Riferimento alla variazione assente');
                    return;
                }
                if (idv < 0) {
                    var dtv_1 = WUtil.getDate(srd[0], 'inizioValidita');
                    if (!dtv_1) {
                        WUX.showWarning('Data variazione assente');
                        return;
                    }
                    var filter = {};
                    filter[GUI.ICalendario.sDATA] = dtv_1;
                    filter[GUI.ICalendario.sID_COLLABORATORE] = _this.fpDetail.getValue(GUI.ICollaboratore.sID);
                    jrpc.execute('CALENDARIO.getTimeTable', [filter], function (result) {
                        _this.dlgOrariPers.setProps(dtv_1);
                        _this.dlgOrariPers.setState(result);
                        _this.dlgOrariPers.show();
                    });
                }
                else {
                    jrpc.execute('COLLABORATORI.readAgenda', [idv], function (result) {
                        _this.dlgAgenda.setState(result);
                        _this.dlgAgenda.show();
                    });
                }
            });
            this.btnAddVar = new WUX.WButton(this.subId('bav'), GUI.TXT.ADD, '', WUX.BTN.SM_PRIMARY);
            this.btnAddVar.on('click', function (e) {
                _this.dlgAgenda.setState(null);
                _this.dlgAgenda.show();
            });
            this.btnAddAss = new WUX.WButton(this.subId('bac'), 'Assenze', '', WUX.BTN.SM_INFO);
            this.btnAddAss.on('click', function (e) {
                _this.dlgAssenze.show();
            });
            this.btnRemVar = new WUX.WButton(this.subId('brv'), GUI.TXT.REMOVE, '', WUX.BTN.SM_DANGER);
            this.btnRemVar.on('click', function (e) {
                var item = WUtil.getItem(_this.tabResult.getSelectedRowsData(), 0);
                if (!item)
                    return;
                var idc = WUtil.getNumber(item, GUI.ICollaboratore.sID);
                if (!idc) {
                    WUX.showWarning('Collaboratore non selezionato.');
                    return;
                }
                var sr = _this.tabVar.getSelectedRows();
                var srd = _this.tabVar.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare la variazione da rimuovere');
                    return;
                }
                var idv = WUtil.getNumber(srd[0], 'id');
                if (!idv) {
                    WUX.showWarning('Riferimento alla variazione assente');
                    return;
                }
                var div = WUtil.getDate(srd[0], 'inizioValidita');
                WUX.confirm('Si vuole rimuovere la variazione selezionata?', function (res) {
                    if (!res)
                        return;
                    if (idv < 0) {
                        GUI.chkExecute('CALENDARIO.deleteVariazioni', [idc, div], function (result) {
                            if (!result) {
                                WUX.showWarning('Variazione NON eliminata.');
                                return;
                            }
                            WUX.showSuccess('Variazione eliminata con successo.');
                            var v = _this.tabVar.getState();
                            v.splice(sr[0], 1);
                            _this.tabVar.setState(v);
                        });
                    }
                    else if (idv > 0) {
                        GUI.chkExecute('COLLABORATORI.deleteAgenda', [idv], function (result) {
                            if (!result) {
                                WUX.showWarning('Piano NON eliminato.');
                                return;
                            }
                            WUX.showSuccess('Piano eliminato con successo.');
                            var v = _this.tabVar.getState();
                            v.splice(sr[0], 1);
                            _this.tabVar.setState(v);
                        });
                    }
                });
            });
            this.tabSel = new WUX.WDXTable(this.subId('tbs'), ['Gruppo', 'Descrizione'], [GUI.IPrestazione.sDESC_GRUPPO, GUI.IPrestazione.sDESCRIZIONE]);
            this.tabSel.selectionMode = 'multiple';
            this.tabSel.css({ h: 250 });
            this.tabSel.widths = [100];
            this.tabSel.filter = true;
            this.tabSel.onCellPrepared(function (e) {
                var f = e.column.dataField;
                if (f == GUI.IPrestazione.sDESC_GRUPPO) {
                    e.cellElement.addClass('clickable');
                }
            });
            this.tabSel.onCellClick(function (e) {
                var row = e.row;
                if (row != null && row.rowType == 'data') {
                    var f = e.column.dataField;
                    if (f == GUI.IPrestazione.sDESC_GRUPPO) {
                        var x_3 = [];
                        var d = _this.tabSel.getState();
                        for (var i = 0; i < d.length; i++) {
                            var r = d[i];
                            if (r[GUI.IPrestazione.sDESC_GRUPPO] == e.value)
                                x_3.push(i);
                        }
                        if (!x_3 || !x_3.length)
                            return;
                        _this.tabSel.setState(d);
                        setTimeout(function () {
                            _this.tabSel.select(x_3);
                        }, 200);
                    }
                }
            });
            this.tabAll = new WUX.WDXTable(this.subId('tba'), ['Gruppo', 'Descrizione'], [GUI.IPrestazione.sDESC_GRUPPO, GUI.IPrestazione.sDESCRIZIONE]);
            this.tabAll.selectionMode = 'multiple';
            this.tabAll.css({ h: 250 });
            this.tabAll.widths = [100];
            this.tabAll.filter = true;
            this.tabAll.onCellPrepared(function (e) {
                var f = e.column.dataField;
                if (f == GUI.IPrestazione.sDESC_GRUPPO) {
                    e.cellElement.addClass('clickable');
                }
            });
            this.tabAll.onCellClick(function (e) {
                var row = e.row;
                if (row != null && row.rowType == 'data') {
                    var f = e.column.dataField;
                    if (f == GUI.IPrestazione.sDESC_GRUPPO) {
                        var x_4 = [];
                        var d = _this.tabAll.getState();
                        for (var i = 0; i < d.length; i++) {
                            var r = d[i];
                            if (r[GUI.IPrestazione.sDESC_GRUPPO] == e.value)
                                x_4.push(i);
                        }
                        if (!x_4 || !x_4.length)
                            return;
                        _this.tabAll.setState(d);
                        setTimeout(function () {
                            _this.tabAll.select(x_4);
                        }, 200);
                    }
                }
            });
            this.btnSx = new WUX.WButton(this.subId('bba'), '', GUI.ICO.LEFT, WUX.BTN.PRIMARY, { p: '1px 6px 1px 6px' });
            this.btnSx.tooltip = 'Aggiungi trattamenti';
            this.btnSx.enabled = false;
            this.btnSx.on('click', function (e) {
                var dts = _this.tabSel.getState();
                if (!dts)
                    dts = [];
                var srd = _this.tabAll.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare uno o pi&ugrave; trattamenti dal catalogo.');
                    return;
                }
                var scr = false;
                for (var i = 0; i < srd.length; i++) {
                    var p = srd[i];
                    var pid = p[GUI.IPrestazione.sID];
                    var f = false;
                    for (var j = 0; j < dts.length; j++) {
                        var s = dts[j];
                        var sid = s[GUI.IPrestazione.sID];
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
                _this.tabSel.setState(dts);
                if (scr) {
                    setTimeout(function () {
                        _this.tabSel.scrollTo(999999);
                    }, 250);
                }
            });
            this.btnDx = new WUX.WButton(this.subId('bbd'), '', GUI.ICO.DELETE, WUX.BTN.DANGER, { p: '1px 7px 1px 7px' });
            this.btnDx.tooltip = 'Rimuovi trattamenti';
            this.btnDx.enabled = false;
            this.btnDx.on('click', function (e) {
                var dts = _this.tabSel.getState();
                if (!dts)
                    dts = [];
                var srd = _this.tabSel.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare uno o pi&ugrave; trattamenti dall\'elenco degli assegnati.');
                    return;
                }
                var cpy = [];
                for (var i = 0; i < dts.length; i++) {
                    var p = dts[i];
                    var pid = p[GUI.IPrestazione.sID];
                    var f = false;
                    for (var j = 0; j < srd.length; j++) {
                        var s = srd[j];
                        var sid = s[GUI.IPrestazione.sID];
                        if (sid == pid) {
                            f = true;
                            break;
                        }
                    }
                    if (!f)
                        cpy.push(p);
                }
                _this.tabSel.setState(cpy);
            });
            this.btnCp = new WUX.WButton(this.subId('bbc'), '', GUI.ICO.COPY, WUX.BTN.SECONDARY, { p: '1px 7px 1px 7px' });
            this.btnCp.tooltip = 'Copia trattamenti';
            this.btnCp.on('click', function (e) {
                var items = _this.tabSel.getState();
                if (!items || !items.length) {
                    WUX.showSuccess('Nessun elemento selezionato');
                    return;
                }
                GUI.cp_prest = items;
                WUX.showSuccess('Trattamenti copiati nella clipboard');
            });
            this.btnPa = new WUX.WButton(this.subId('bbp'), '', GUI.ICO.PASTE, WUX.BTN.WARNING, { p: '1px 7px 1px 7px' });
            this.btnPa.tooltip = 'Incolla trattamenti';
            this.btnPa.enabled = false;
            this.btnPa.on('click', function (e) {
                if (!GUI.cp_prest) {
                    WUX.showWarning('Non vi sono trattamenti nella clipboard');
                    return;
                }
                _this.tabSel.setState(GUI.cp_prest);
            });
            var cntTab0 = new WUX.WContainer(this.subId('ct0'), '');
            cntTab0
                .addRow()
                .addCol('11', { p: 0 })
                .add(this.tabSel)
                .addCol('1', { p: 0 })
                .addStack(WUX.CSS.STACK_BTNS, this.btnSx, this.btnDx, this.btnCp, this.btnPa);
            this.cntActions = new GUI.CFTableActions('ta');
            this.cntActions.left.add(this.btnOpen);
            this.cntActions.left.add(this.btnDelete);
            this.cntActions.left.add(this.btnSave);
            this.cntActions.left.add(this.btnCancel);
            this.cntActions.left.add(this.btnVisible);
            this.cntActions.right.add(this.btnNew);
            this.cntActions2 = new GUI.CFTableActions('ta2');
            this.cntActions2.left.add(this.btnOpen2);
            this.cntActions2.left.add(this.btnDelete2);
            this.cntActions2.left.add(this.btnSave2);
            this.cntActions2.left.add(this.btnCancel2);
            this.cntActions2.left.add(this.btnVisible2);
            this.tagsFilter = new WUX.WTags('tf');
            this.cmpAgenda = new GUI.CFAgenda(this.subId('age'));
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
            this.tcoDetail.on('statechange', function (e) {
                var itab = _this.tcoDetail.getState();
                switch (itab) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        _this.tabVar.repaint();
                        break;
                    case 3:
                        _this.tabSel.repaint();
                        _this.tabAll.repaint();
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
                .end()
                .addBox()
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, this.cntActions, this.tabResult, this.cntActions2)
                .end()
                .addRow()
                .addCol('12').section('Dettaglio')
                .add(this.tcoDetail);
            return this.container;
        };
        GUICollaboratori.prototype.collapseHandler = function (e) {
            var c = WUtil.getBoolean(e.data, 'collapsed');
            if (c) {
                this.tagsFilter.setState({});
            }
            else {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
            }
        };
        GUICollaboratori.prototype.onSelect = function () {
            var _this = this;
            var item = WUtil.getItem(this.tabResult.getSelectedRowsData(), 0);
            if (!item)
                return;
            var id = WUtil.getNumber(item, GUI.ICollaboratore.sID);
            if (!id)
                return;
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
            jrpc.execute('COLLABORATORI.read', [id], function (result) {
                _this.fpDetail.setState(result);
                _this.cmpAgenda.setState(WUtil.getObject(result, GUI.ICollaboratore.sAGENDA));
                _this.tabVar.setState(WUtil.getArray(result, GUI.ICollaboratore.sVARIAZIONI));
                _this.tabSel.setState(WUtil.getArray(result, GUI.ICollaboratore.sPRESTAZIONI));
                _this.status = _this.iSTATUS_VIEW;
                GUI.CFBookCfg.CHECK_USER_DESK = WUtil.getBoolean(result, GUI.ICalendario.sCHECK_USER_DESK);
                var vis = WUtil.getBoolean(result, GUI.ICollaboratore.sVISIBILE);
                if (vis) {
                    _this.btnVisible.setText('Non visibile', WUX.WIcon.THUMBS_O_DOWN);
                    _this.btnVisible2.setText('Non visibile', WUX.WIcon.THUMBS_O_DOWN);
                }
                else {
                    _this.btnVisible.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                    _this.btnVisible2.setText('Visibile', WUX.WIcon.THUMBS_O_UP);
                }
            });
        };
        GUICollaboratori.prototype.componentDidMount = function () {
            var _this = this;
            var idf = WUtil.toInt(WUtil.getParam(GUI.ICollaboratore.sID_FAR), 0);
            if (!idf) {
                if (GUI.strutture && GUI.strutture.length) {
                    idf = GUI.strutture[0].id;
                }
            }
            if (idf)
                this.selFar.setState(idf);
            this.cmpAgenda.clear();
            this.cmpAgenda.setDateRef(new Date());
            this.cmpAgenda.enabled = false;
            var id = WUtil.toInt(WUtil.getParam(GUI.ICollaboratore.sID), 0);
            var box = WUX.getComponent('boxFilter');
            if (box instanceof WUX.WBox) {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
                box.collapse();
            }
            var filter = {};
            filter[GUI.ICollaboratore.sID] = id;
            filter[GUI.ICollaboratore.sID_FAR] = idf;
            this.selId = id;
            jrpc.execute('COLLABORATORI.find', [filter], function (result) {
                _this.tabResult.setState(result);
                if (result && result.length == 1) {
                    setTimeout(function () {
                        _this.tabResult.select([0]);
                    }, 200);
                }
            });
        };
        return GUICollaboratori;
    }(WUX.WComponent));
    GUI.GUICollaboratori = GUICollaboratori;
})(GUI || (GUI = {}));
var GUI;
(function (GUI) {
    var WUtil = WUX.WUtil;
    var CFTableActions = (function (_super) {
        __extends(CFTableActions, _super);
        function CFTableActions(id) {
            var _this = _super.call(this, id, 'CFTableActions', null, 'table-actions-wrapper') || this;
            _this.left = new WUX.WContainer(_this.subId('l'), 'left-actions');
            _this.right = new WUX.WContainer(_this.subId('r'), 'right-actions');
            return _this;
        }
        CFTableActions.prototype.componentDidMount = function () {
            var $i = $('<div class="table-actions clearfix" data-b2x-sticky-element="1" data-b2x-sticky-element-z-index="3"></div>');
            this.root.append($i);
            this.left.mount($i);
            this.right.mount($i);
        };
        CFTableActions.prototype.setLeftVisible = function (v) {
            this.left.visible = v;
        };
        CFTableActions.prototype.setRightVisible = function (v) {
            this.right.visible = v;
        };
        return CFTableActions;
    }(WUX.WComponent));
    GUI.CFTableActions = CFTableActions;
    var CFSelectMesi = (function (_super) {
        __extends(CFSelectMesi, _super);
        function CFSelectMesi(id, mesi, pros) {
            if (mesi === void 0) { mesi = 12; }
            if (pros === void 0) { pros = 0; }
            var _this = _super.call(this, id) || this;
            _this.multiple = false;
            _this.name = 'CFSelectMesi';
            _this.options = [];
            var currDate = new Date();
            var currMonth = currDate.getMonth() + 1;
            var currYear = currDate.getFullYear();
            if (pros > 0) {
                currMonth += pros;
                if (currMonth > 12) {
                    currMonth -= 12;
                    if (currMonth > 12)
                        currMonth = 1;
                    currYear++;
                }
            }
            for (var i = 0; i < mesi; i++) {
                var m = currYear * 100 + currMonth;
                _this.options.push({ id: m, text: WUX.formatMonth(currMonth, true, currYear) });
                currMonth--;
                if (currMonth == 0) {
                    currMonth = 12;
                    currYear--;
                }
            }
            return _this;
        }
        return CFSelectMesi;
    }(WUX.WSelect2));
    GUI.CFSelectMesi = CFSelectMesi;
    var CFSelectStruture = (function (_super) {
        __extends(CFSelectStruture, _super);
        function CFSelectStruture(id, multiple) {
            var _this = _super.call(this, id) || this;
            _this.multiple = multiple;
            _this.name = 'CFSelectStruture';
            _this.openOnFocus = false;
            return _this;
        }
        CFSelectStruture.prototype.componentDidMount = function () {
            this.items = [];
            if (GUI.strutture) {
                this.items = GUI.strutture;
                var options_1 = {
                    data: this.items,
                    placeholder: "",
                    allowClear: true,
                };
                this.init(options_1);
                return;
            }
            var user = GUI.getUserLogged();
            var idff = 0;
            if (user && user.structures && user.structures.length) {
                idff = WUtil.toNumber(user.structures[0]);
            }
            var result = jrpc.executeSync('STRUTTURE.getFarmacie', [idff]);
            if (!result)
                result = [];
            for (var i = 0; i < result.length; i++) {
                var r = result[i];
                this.items.push({ id: r['i'], text: r['c'] + ' - ' + r['d'] });
            }
            GUI.strutture = this.items;
            var options = {
                data: this.items,
                placeholder: "",
                allowClear: true,
            };
            this.init(options);
        };
        return CFSelectStruture;
    }(WUX.WSelect2));
    GUI.CFSelectStruture = CFSelectStruture;
    var CFSelOpzClienti = (function (_super) {
        __extends(CFSelOpzClienti, _super);
        function CFSelOpzClienti(id, multiple) {
            var _this = _super.call(this, id) || this;
            _this.multiple = multiple;
            _this.name = 'CFSelOpzClienti';
            _this.openOnFocus = false;
            return _this;
        }
        CFSelOpzClienti.prototype.componentDidMount = function () {
            this.items = [];
            this.strts = [];
            this.items.push({ id: 'M', text: 'inseriti dall\'operatore corrente' });
            var user = GUI.getUserLogged();
            var idff = 0;
            if (user && user.structures && user.structures.length) {
                idff = WUtil.toNumber(user.structures[0]);
            }
            var result = jrpc.executeSync('STRUTTURE.getFarmacie', [idff]);
            if (!result)
                result = [];
            for (var i = 0; i < result.length; i++) {
                var r = result[i];
                this.items.push({ id: r['i'], text: 'prenotati in ' + r['d'] });
                this.strts.push({ id: r['i'], text: r['c'] + ' - ' + r['d'] });
            }
            GUI.strutture = this.strts;
            var options = {
                data: this.items,
                placeholder: "",
                allowClear: true,
            };
            this.init(options);
        };
        return CFSelOpzClienti;
    }(WUX.WSelect2));
    GUI.CFSelOpzClienti = CFSelOpzClienti;
    var CFSelectTipoPrezzo = (function (_super) {
        __extends(CFSelectTipoPrezzo, _super);
        function CFSelectTipoPrezzo(id, multiple) {
            var _this = _super.call(this, id) || this;
            _this.multiple = multiple;
            _this.name = 'CFSelectTipoPrezzo';
            _this.options = [
                { id: '', text: '' },
                { id: 'F', text: 'Fisso' },
                { id: 'A', text: 'A partire da' }
            ];
            return _this;
        }
        return CFSelectTipoPrezzo;
    }(WUX.WSelect2));
    GUI.CFSelectTipoPrezzo = CFSelectTipoPrezzo;
    var CFSelectLav = (function (_super) {
        __extends(CFSelectLav, _super);
        function CFSelectLav(id, multiple) {
            var _this = _super.call(this, id) || this;
            _this.multiple = multiple;
            _this.name = 'CFSelectLav';
            _this.options = [
                { id: '', text: '' },
                { id: 'L', text: 'Lavora' },
                { id: 'N', text: 'Non lavora' }
            ];
            return _this;
        }
        return CFSelectLav;
    }(WUX.WSelect2));
    GUI.CFSelectLav = CFSelectLav;
    var CFSelectStatiPren = (function (_super) {
        __extends(CFSelectStatiPren, _super);
        function CFSelectStatiPren(id, multiple) {
            var _this = _super.call(this, id) || this;
            _this.multiple = multiple;
            _this.name = 'CFSelectStatiPren';
            _this.options = [
                { id: '', text: '' },
                { id: 'C', text: 'Confermata' },
                { id: 'E', text: 'Eseguita' },
                { id: 'N', text: 'Non presentato' },
                { id: 'F', text: 'Fuori uscita' },
                { id: 'A', text: 'Annullata' },
                { id: '*', text: 'Compreso Annullata' }
            ];
            return _this;
        }
        return CFSelectStatiPren;
    }(WUX.WSelect2));
    GUI.CFSelectStatiPren = CFSelectStatiPren;
    var CFSelectTipoCom = (function (_super) {
        __extends(CFSelectTipoCom, _super);
        function CFSelectTipoCom(id, multiple) {
            var _this = _super.call(this, id) || this;
            _this.multiple = multiple;
            _this.name = 'CFSelectTipoCom';
            _this.options = [
                { id: '', text: '' },
                { id: 'S', text: 'SMS' },
                { id: 'N', text: 'Notifica' },
                { id: 'M', text: 'Misto (SMS/Notifica)' },
            ];
            return _this;
        }
        return CFSelectTipoCom;
    }(WUX.WSelect2));
    GUI.CFSelectTipoCom = CFSelectTipoCom;
    var CFSelectAppTipoPag = (function (_super) {
        __extends(CFSelectAppTipoPag, _super);
        function CFSelectAppTipoPag(id, multiple) {
            var _this = _super.call(this, id) || this;
            _this.multiple = multiple;
            _this.name = 'CFSelectAppTipoPag';
            _this.options = [
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
            return _this;
        }
        return CFSelectAppTipoPag;
    }(WUX.WSelect2));
    GUI.CFSelectAppTipoPag = CFSelectAppTipoPag;
    var CFSelectTipoApp = (function (_super) {
        __extends(CFSelectTipoApp, _super);
        function CFSelectTipoApp(id, multiple) {
            var _this = _super.call(this, id) || this;
            _this.multiple = multiple;
            _this.name = 'CFSelectTipoApp';
            _this.options = [
                { id: '', text: '' },
                { id: 'F', text: 'Fidelity' },
                { id: 'O', text: 'Omaggio' }
            ];
            return _this;
        }
        CFSelectTipoApp.prototype.close = function () {
            if (!this.root)
                return;
            this.root.select2('close');
        };
        return CFSelectTipoApp;
    }(WUX.WSelect2));
    GUI.CFSelectTipoApp = CFSelectTipoApp;
    var CFSelectOrario = (function (_super) {
        __extends(CFSelectOrario, _super);
        function CFSelectOrario(id, multiple) {
            var _this = _super.call(this, id) || this;
            _this.multiple = multiple;
            _this.name = 'CFSelectOrario';
            _this.options = [];
            _this.allSlots = [];
            for (var h = 0; h < 24; h++) {
                var hh = h < 10 ? '0' + h : '' + h;
                for (var m = 0; m < 60; m += 10) {
                    var mm = m < 10 ? '0' + m : '' + m;
                    var hm = h * 100 + m;
                    _this.options.push({ id: hm, text: hh + ':' + mm });
                    _this.allSlots.push({ id: hm, text: hh + ':' + mm });
                }
            }
            return _this;
        }
        CFSelectOrario.prototype.setAppts = function (a) {
            if (!a || !a.length) {
                this.setOptions([]);
                return this;
            }
            var s = [];
            for (var i = 0; i < a.length; i++) {
                s.push({ id: a[i], text: WUX.formatTime(a[i]) });
            }
            this.setOptions(s);
            return this;
        };
        CFSelectOrario.prototype.setAllSlots = function () {
            this.setOptions(this.allSlots);
            return this;
        };
        return CFSelectOrario;
    }(WUX.WSelect2));
    GUI.CFSelectOrario = CFSelectOrario;
    var CFSelectGruppiPre = (function (_super) {
        __extends(CFSelectGruppiPre, _super);
        function CFSelectGruppiPre(id, multiple) {
            var _this = _super.call(this, id) || this;
            _this.multiple = multiple;
            _this.name = 'CFSelectGruppiPre';
            return _this;
        }
        CFSelectGruppiPre.prototype.componentDidMount = function () {
            var _this = this;
            jrpc.execute('PRESTAZIONI.lookupGruppi', [{}], function (result) {
                var data = [];
                for (var i = 0; i < result.length; i++) {
                    var r = result[i];
                    var d = { id: r[0], text: r[1] };
                    data.push(d);
                }
                var options = {
                    data: data,
                    placeholder: "",
                    allowClear: true,
                };
                _this.init(options);
            });
        };
        return CFSelectGruppiPre;
    }(WUX.WSelect2));
    GUI.CFSelectGruppiPre = CFSelectGruppiPre;
    var CFSelectTipiPre = (function (_super) {
        __extends(CFSelectTipiPre, _super);
        function CFSelectTipiPre(id, multiple) {
            var _this = _super.call(this, id) || this;
            _this.multiple = multiple;
            _this.name = 'CFSelectGruppiPre';
            return _this;
        }
        CFSelectTipiPre.prototype.componentDidMount = function () {
            var _this = this;
            jrpc.execute('PRESTAZIONI.lookupTipi', [{}], function (result) {
                var data = [];
                for (var i = 0; i < result.length; i++) {
                    var r = result[i];
                    var d = { id: r[0], text: r[1] };
                    data.push(d);
                }
                var options = {
                    data: data,
                    placeholder: "",
                    allowClear: true,
                };
                _this.init(options);
            });
        };
        return CFSelectTipiPre;
    }(WUX.WSelect2));
    GUI.CFSelectTipiPre = CFSelectTipiPre;
    var CFSelectCabine = (function (_super) {
        __extends(CFSelectCabine, _super);
        function CFSelectCabine(id, multiple) {
            var _this = _super.call(this, id) || this;
            _this.multiple = multiple;
            _this.name = 'CFSelectCabine';
            _this.idFar = 0;
            _this.openOnFocus = false;
            return _this;
        }
        CFSelectCabine.prototype.setIdFar = function (idf, val) {
            var _this = this;
            if (!idf) {
                this.idFar = 0;
                var options = {
                    data: [],
                    placeholder: "",
                    allowClear: true,
                };
                this.init(options);
                return this;
            }
            if (this.idFar == idf) {
                if (val)
                    this.setState(val);
                return;
            }
            this.idFar = idf;
            jrpc.execute('ATTREZZATURE.getAll', [this.idFar], function (result) {
                var data = [];
                for (var i = 0; i < result.length; i++) {
                    var r = result[i];
                    var d = { id: r[GUI.IAttrezzatura.sID], text: r[GUI.IAttrezzatura.sDESCRIZIONE] };
                    data.push(d);
                }
                var options = {
                    data: data,
                    placeholder: "",
                    allowClear: true,
                };
                _this.init(options);
                if (val) {
                    setTimeout(function () {
                        _this.setState(val);
                    }, 100);
                }
            });
            return this;
        };
        CFSelectCabine.prototype.componentDidMount = function () {
            var idf = this.idFar;
            this.idFar = 0;
            this.setIdFar(idf);
        };
        return CFSelectCabine;
    }(WUX.WSelect2));
    GUI.CFSelectCabine = CFSelectCabine;
    var CFSelectCollab = (function (_super) {
        __extends(CFSelectCollab, _super);
        function CFSelectCollab(id, multiple) {
            var _this = _super.call(this, id) || this;
            _this.multiple = multiple;
            _this.name = 'CFSelectCollab';
            _this.idFar = 0;
            _this.openOnFocus = false;
            _this.onlyVis = true;
            return _this;
        }
        CFSelectCollab.prototype.setIdFar = function (idf, val) {
            var _this = this;
            if (!idf) {
                this.idFar = 0;
                var options = {
                    data: [],
                    placeholder: "",
                    allowClear: true,
                };
                this.init(options);
                return this;
            }
            if (this.idFar == idf) {
                if (val)
                    this.setState(val);
                return;
            }
            this.idFar = idf;
            var params = this.onlyVis ? [this.idFar] : [this.idFar, this.onlyVis];
            jrpc.execute('COLLABORATORI.getAll', params, function (result) {
                var data = [];
                for (var i = 0; i < result.length; i++) {
                    var r = result[i];
                    var d = { id: r[GUI.ICollaboratore.sID], text: r[GUI.ICollaboratore.sNOME] };
                    data.push(d);
                }
                var options = {
                    data: data,
                    placeholder: "",
                    allowClear: true,
                };
                _this.init(options);
                if (val) {
                    setTimeout(function () {
                        _this.setState(val);
                    }, 100);
                }
            });
            return this;
        };
        CFSelectCollab.prototype.componentDidMount = function () {
            var idf = this.idFar;
            this.idFar = 0;
            this.setIdFar(idf);
        };
        return CFSelectCollab;
    }(WUX.WSelect2));
    GUI.CFSelectCollab = CFSelectCollab;
    var CFSelectClienti = (function (_super) {
        __extends(CFSelectClienti, _super);
        function CFSelectClienti(id, multiple) {
            var _this = _super.call(this, id, [], multiple) || this;
            _this.name = 'CFSelectClienti';
            return _this;
        }
        CFSelectClienti.prototype.componentDidMount = function () {
            var options = {
                ajax: {
                    dataType: "json",
                    delay: 400,
                    processResults: function (result, params) {
                        return {
                            results: result
                        };
                    },
                    transport: function (params, success, failure) {
                        jrpc.execute("CLIENTI.lookup", [params.data], success);
                        return undefined;
                    }
                },
                placeholder: "",
                allowClear: true,
                minimumInputLength: 3
            };
            this.init(options);
        };
        return CFSelectClienti;
    }(WUX.WSelect2));
    GUI.CFSelectClienti = CFSelectClienti;
    var CFSelectColore = (function (_super) {
        __extends(CFSelectColore, _super);
        function CFSelectColore(id, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'CFSelectColore', null, classStyle, style, attributes) || this;
            _this.colors = ['7bd148', '5484ed', 'a4bdfc', '46d6db', '7ae7bf', '51b749', 'fbd75b', 'ffb878', 'ff887c', 'dc2127', 'dbadff', 'e1e1e1'];
            _this.items = [];
            return _this;
        }
        CFSelectColore.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.state && this.state[0] == '#') {
                this.state = this.state.substring(1);
            }
            if (!this.mounted)
                return;
            this.updateView();
        };
        CFSelectColore.prototype.clear = function () {
            this.setState('');
        };
        CFSelectColore.prototype.componentDidMount = function () {
            var _this = this;
            this.items = [];
            for (var i = 0; i < this.colors.length; i++) {
                var $i = $('<span style="display:inline-block;width:25px;height:25px;cursor:pointer;border-radius:50%;background-color:#' + this.colors[i] + ';"></span>');
                this.items.push($i);
                this.root.append($i);
                this.root.append('&nbsp;');
                $i.on('click', function (e) {
                    if (!_this._enabled)
                        return;
                    if (e.target) {
                        var $t = $(e.target);
                        var bg = _this.rgb2hex($t.css('background-color'));
                        _this.setState(bg);
                    }
                });
            }
        };
        CFSelectColore.prototype.updateView = function () {
            for (var i = 0; i < this.items.length; i++) {
                var $i = this.items[i];
                var bg = this.rgb2hex($i.css('background-color'));
                if (this.state && bg == ('#' + this.state)) {
                    $i.css('border', '2px solid rgba(0,0,0,.5)');
                }
                else {
                    $i.css('border', 'none');
                }
            }
        };
        CFSelectColore.prototype.rgb2hex = function (bg) {
            if (!bg)
                return '';
            var rgb = bg.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
            return (rgb && rgb.length === 4) ? "#" +
                ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : bg;
        };
        return CFSelectColore;
    }(WUX.WComponent));
    GUI.CFSelectColore = CFSelectColore;
    var CFOrariSett = (function (_super) {
        __extends(CFOrariSett, _super);
        function CFOrariSett(id, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'CFOrariSett', null, classStyle, style, attributes) || this;
            _this.title = 'orario';
            return _this;
        }
        Object.defineProperty(CFOrariSett.prototype, "enabled", {
            set: function (b) {
                this._enabled = b;
                if (this.fp) {
                    this.fp.enabled = b;
                    if (b) {
                        var v = this.fp.getValues();
                        for (var i = 1; i <= 7; i++) {
                            var l = v['l' + i] == 'L';
                            if (!l) {
                                this.fp.setEnabled('a' + i, false);
                                this.fp.setEnabled('s' + i, false);
                                this.fp.setEnabled('p' + i, false);
                                this.fp.setEnabled('r' + i, false);
                            }
                        }
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        CFOrariSett.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (!this.mounted)
                return;
            if (!this.state) {
                this.fp.clear();
                return;
            }
            var ad = true;
            var ld = 0;
            var ps = false;
            var v = {};
            for (var i = 0; i <= this.state.length; i++) {
                var am = this.state[i];
                if (!am)
                    continue;
                var g = am.giorno;
                if (!g)
                    continue;
                if (this.evenWeek && !am.settPari)
                    continue;
                if (this.oddWeek && !am.settDispari)
                    continue;
                ps = false;
                if (ld == g)
                    ps = true;
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
        };
        CFOrariSett.prototype.getState = function () {
            this.state = [];
            if (!this.mounted)
                return this.state;
            var v = this.fp.getValues();
            var c = this.ck.checked;
            for (var i = 1; i <= 7; i++) {
                var l = v['l' + i] == 'L';
                if (!l)
                    continue;
                var a = WUtil.toInt(v['a' + i]);
                var s = WUtil.toInt(v['s' + i]);
                var p = WUtil.toInt(v['p' + i]);
                var r = WUtil.toInt(v['r' + i]);
                if (s <= a)
                    continue;
                if (p > a && r > p) {
                    var am0 = {
                        settPari: this.evenWeek,
                        settDispari: this.oddWeek,
                        giorno: i,
                        oraInizio: a,
                        oraFine: p,
                        attivo: c && l
                    };
                    var am1 = {
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
                    var am = {
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
        };
        CFOrariSett.prototype.clear = function () {
            if (this.fp)
                this.fp.clear();
            return this;
        };
        CFOrariSett.prototype.setDefaults = function () {
            if (!this.fp)
                return this;
            var values = {};
            for (var i = 1; i <= 7; i++) {
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
        };
        CFOrariSett.prototype.isBlank = function () {
            if (!this.fp)
                return true;
            var v = this.fp.getValues();
            for (var i = 1; i <= 7; i++) {
                if (v['l' + i])
                    return false;
            }
            return true;
        };
        CFOrariSett.prototype.isActivated = function () {
            if (this.ck)
                return this.ck.checked;
            return false;
        };
        CFOrariSett.prototype.render = function () {
            var _this = this;
            if (this.title == null)
                this.title = '';
            this.ck = new WUX.WCheck('', 'Attiva ' + this.title);
            this.ck.on('statechange', function (e) {
                if (_this.ck.checked) {
                    if (_this.isBlank()) {
                        _this.setDefaults();
                    }
                }
            });
            this.lc = new WUX.WLink(this.subId('l_c'), 'Copia', GUI.ICO.COPY);
            this.lc.on('click', function (e) {
                var aam = _this.getState();
                if (aam) {
                    for (var i = 0; i < aam.length; i++) {
                        aam[i].settDispari = true;
                        aam[i].settPari = true;
                    }
                    GUI.cp_orari = aam;
                    WUX.showSuccess('Orari copiati nella clipboard');
                }
            });
            this.lp = new WUX.WLink(this.subId('l_p'), 'Incolla', GUI.ICO.PASTE);
            this.lp.on('click', function (e) {
                if (!GUI.cp_orari) {
                    WUX.showWarning('Non vi sono orari nella clipboard');
                    return;
                }
                _this.clear();
                _this.setState(GUI.cp_orari);
            });
            var ccp = new WUX.WContainer('*', '', { pt: 10, a: 'right' });
            ccp.add(this.lc).addSpan(12).add(this.lp);
            this.fp = new WUX.WFormPanel(this.subId('f'));
            this.fp.addRow();
            this.fp.addComponent('a', '', this.ck.getWrapper());
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
            for (var i = 1; i <= 7; i++) {
                var d = this.descDay(i);
                this.fp.addRow();
                if (i == 7) {
                    this.fp.addCaption(d, '', '', WUX.CSS.LABEL_NOTICE);
                }
                else {
                    this.fp.addCaption(d, '', '', { fw: 'bold' });
                }
                var l = new CFSelectLav();
                l.data = i;
                l.on('statechange', function (e) {
                    var c = e.component;
                    if (!c || !c.enabled)
                        return;
                    var st = c.getState();
                    var ix = c.data;
                    if (!st || st == 'N') {
                        _this.fp.setEnabled('a' + ix, false);
                        _this.fp.setEnabled('s' + ix, false);
                        _this.fp.setEnabled('p' + ix, false);
                        _this.fp.setEnabled('r' + ix, false);
                    }
                    else {
                        _this.fp.setEnabled('a' + ix, true);
                        _this.fp.setEnabled('s' + ix, true);
                        _this.fp.setEnabled('p' + ix, true);
                        _this.fp.setEnabled('r' + ix, true);
                    }
                });
                this.fp.addComponent('l' + i, '', l);
                this.fp.addComponent('a' + i, '', new CFSelectOrario());
                this.fp.addComponent('s' + i, '', new CFSelectOrario());
                this.fp.addComponent('p' + i, '', new CFSelectOrario());
                this.fp.addComponent('r' + i, '', new CFSelectOrario());
            }
            return this.fp;
        };
        CFOrariSett.prototype.descDay = function (d) {
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
        };
        return CFOrariSett;
    }(WUX.WComponent));
    GUI.CFOrariSett = CFOrariSett;
    var CFOrariPers = (function (_super) {
        __extends(CFOrariPers, _super);
        function CFOrariPers(id, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'CFOrariPers', null, classStyle, style, attributes) || this;
            _this.title = 'orario';
            _this.resources = [];
            _this.forceOnChange = true;
            return _this;
        }
        CFOrariPers.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (!this.mounted)
                return;
            if (!this.state || !this.resources) {
                this.fp.clear();
                return;
            }
            var v = {};
            for (var i = 0; i < this.resources.length; i++) {
                var r = this.resources[i];
                if (!r || !r.id)
                    continue;
                var fo = this.state['' + r.id];
                if (!fo || !fo.length)
                    continue;
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
                    v['a' + r.id] = fo[0];
                    v['s' + r.id] = fo[5];
                    v['p' + r.id] = fo[1];
                    v['r' + r.id] = fo[4];
                }
            }
            this.values = v;
            this.fp.clear();
            this.fp.setState(v);
        };
        CFOrariPers.prototype.getState = function () {
            this.state = {};
            if (!this.mounted)
                return this.state;
            if (!this.resources)
                this.resources = [];
            var v = this.fp.getValues();
            for (var i = 0; i < this.resources.length; i++) {
                var r = this.resources[i];
                if (!r || !r.id)
                    continue;
                var f = WUtil.toInt(v['v' + r.id]);
                var l = WUtil.toString(v['l' + r.id]) == 'L' ? 1 : 0;
                var a = WUtil.toInt(v['a' + r.id]);
                var s = WUtil.toInt(v['s' + r.id]);
                var p = WUtil.toInt(v['p' + r.id]);
                var n = WUtil.toInt(v['r' + r.id]);
                if (p > a && n > p) {
                    this.state['' + r.id] = [a, p, l, f, n, s, l, f];
                }
                else {
                    this.state['' + r.id] = [a, s, l, f];
                }
            }
            return this.state;
        };
        CFOrariPers.prototype.clear = function () {
            if (this.fp)
                this.fp.clear();
            return this;
        };
        CFOrariPers.prototype.refresh = function () {
            if (this.fp) {
                this.fp.clear();
                this.fp.setState(this.values);
            }
            return this;
        };
        CFOrariPers.prototype.render = function () {
            var _this = this;
            if (this.title == null)
                this.title = '';
            if (!this.resources)
                this.resources = [];
            this.fp = new WUX.WFormPanel(this.subId('f'));
            this.fp.addRow();
            this.fp.addCaption('Collaboratore', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Lavorativi?', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Attacco', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Stacco', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Pausa', '', '', WUX.CSS.LABEL_INFO);
            this.fp.addCaption('Rientro', '', '', WUX.CSS.LABEL_INFO);
            for (var i = 0; i < this.resources.length; i++) {
                var r = this.resources[i];
                if (!r || !r.id)
                    continue;
                var l = new CFSelectLav();
                l.data = r.id;
                l.on('statechange', function (e) {
                    var c = e.component;
                    if (!c || !c.enabled)
                        return;
                    var st = c.getState();
                    var rid = c.data;
                    if (!st || st == 'N') {
                        _this.fp.setEnabled('a' + rid, false);
                        _this.fp.setEnabled('s' + rid, false);
                        _this.fp.setEnabled('p' + rid, false);
                        _this.fp.setEnabled('r' + rid, false);
                    }
                    else {
                        _this.fp.setEnabled('a' + rid, true);
                        _this.fp.setEnabled('s' + rid, true);
                        _this.fp.setEnabled('p' + rid, true);
                        _this.fp.setEnabled('r' + rid, true);
                    }
                });
                var x = new WUX.WCheck('', r.text, 1);
                var vrz = false;
                if (this.state) {
                    var fo = this.state['' + r.id];
                    if (fo && fo.length == 4) {
                        if (fo[3])
                            vrz = true;
                    }
                    else if (fo && fo.length == 8) {
                        if (fo[3] || fo[7])
                            vrz = true;
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
                this.fp.addComponent('a' + r.id, '', new CFSelectOrario());
                this.fp.addComponent('s' + r.id, '', new CFSelectOrario());
                this.fp.addComponent('p' + r.id, '', new CFSelectOrario());
                this.fp.addComponent('r' + r.id, '', new CFSelectOrario());
            }
            return this.fp;
        };
        return CFOrariPers;
    }(WUX.WComponent));
    GUI.CFOrariPers = CFOrariPers;
    var CFAgenda = (function (_super) {
        __extends(CFAgenda, _super);
        function CFAgenda(id, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'CFAgenda', null, classStyle, style, attributes) || this;
            _this.dateRif = new Date();
            return _this;
        }
        Object.defineProperty(CFAgenda.prototype, "enabled", {
            set: function (b) {
                this._enabled = b;
                if (this.cmpSx)
                    this.cmpSx.enabled = b;
                if (this.cmpDx)
                    this.cmpDx.enabled = b;
            },
            enumerable: false,
            configurable: true
        });
        CFAgenda.prototype.clear = function () {
            if (this.cmpSx)
                this.cmpSx.clear();
            if (this.cmpDx)
                this.cmpDx.clear();
            return this;
        };
        CFAgenda.prototype.isBlank = function () {
            if (this.cmpSx && !this.cmpSx.isBlank())
                return false;
            if (this.cmpDx && !this.cmpDx.isBlank())
                return false;
            return true;
        };
        CFAgenda.prototype.isActivated = function () {
            return this.cmpSx && this.cmpSx.isActivated();
        };
        CFAgenda.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (!this.mounted)
                return;
            if (!this.state) {
                this.cmpSx.clear();
                this.cmpDx.clear();
                return;
            }
            var aam = this.state.fasceOrarie;
            if (!aam || !aam.length) {
                this.cmpSx.clear();
                this.cmpDx.clear();
                return;
            }
            if (this.state.settimaneAlt) {
                var w = GUI.getWeek2020(this.dateRif);
                var sxam = [];
                var dxam = [];
                for (var i = 0; i < aam.length; i++) {
                    var am = aam[i];
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
        };
        CFAgenda.prototype.getState = function () {
            this.state = null;
            if (!this.mounted)
                return this.state;
            this.state = {
                id: 0
            };
            var salt = this.cmpDx && this.cmpDx.isActivated();
            var fo = [];
            if (this.cmpSx) {
                var sxam = this.cmpSx.getState();
                if (sxam && sxam.length) {
                    for (var i = 0; i < sxam.length; i++) {
                        var am = sxam[i];
                        if (am.oraInizio >= am.oraFine)
                            continue;
                        if (!salt) {
                            am.settPari = true;
                            am.settDispari = true;
                        }
                        fo.push(am);
                    }
                }
            }
            if (this.cmpDx && this.cmpDx.isActivated()) {
                var dxam = this.cmpDx.getState();
                if (dxam && dxam.length) {
                    for (var i = 0; i < dxam.length; i++) {
                        var am = dxam[i];
                        if (am.oraInizio >= am.oraFine)
                            continue;
                        fo.push(am);
                    }
                }
            }
            this.state.settimaneAlt = salt;
            this.state.fasceOrarie = fo;
            return this.state;
        };
        CFAgenda.prototype.setDateRef = function (date) {
            this.dateRif = WUtil.toDate(date);
            if (!this.mounted)
                return;
            var w = GUI.getWeek2020(this.dateRif);
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
        };
        CFAgenda.prototype.render = function () {
            this.cmpSx = new CFOrariSett(this.subId('osc'));
            this.cmpSx.title = 'settimana corrente';
            this.cmpDx = new CFOrariSett(this.subId('osa'));
            this.cmpDx.title = 'settimana successiva';
            var w = GUI.getWeek2020();
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
        };
        return CFAgenda;
    }(WUX.WComponent));
    GUI.CFAgenda = CFAgenda;
})(GUI || (GUI = {}));
var GUI;
(function (GUI) {
    var WUtil = WUX.WUtil;
    var GUIComunicazioni = (function (_super) {
        __extends(GUIComunicazioni, _super);
        function GUIComunicazioni(id) {
            var _this = _super.call(this, id ? id : '*', 'GUIComunicazioni') || this;
            _this.iSTATUS_STARTUP = 0;
            _this.iSTATUS_VIEW = 1;
            _this.iSTATUS_EDITING = 2;
            _this.status = _this.iSTATUS_STARTUP;
            return _this;
        }
        GUIComunicazioni.prototype.render = function () {
            var _this = this;
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var check = _this.fpFilter.checkMandatory(true, true, false);
                if (check) {
                    WUX.showWarning('Specificare i seguenti campi: ' + check);
                    return;
                }
                var box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    _this.tagsFilter.setState(_this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('COMUNICAZIONI.find', [GUI.CFUtil.putUserInfo(_this.fpFilter.getState())], function (result) {
                    _this.tabResult.setState(result);
                    _this.fpDetail.clear();
                    _this.tabList.setState([]);
                    _this.status = _this.iSTATUS_STARTUP;
                    if (_this.selId) {
                        var idx_14 = WUtil.indexOf(result, GUI.IComunicazione.sID, _this.selId);
                        if (idx_14 >= 0) {
                            setTimeout(function () {
                                _this.tabResult.select([idx_14]);
                            }, 100);
                        }
                        _this.selId = null;
                    }
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                _this.fpFilter.clear();
                _this.tagsFilter.setState({});
                _this.tabResult.setState([]);
                _this.fpDetail.clear();
                _this.tabList.setState([]);
                _this.status = _this.iSTATUS_STARTUP;
            });
            this.selFar = new GUI.CFSelectStruture();
            this.selFar.on('statechange', function (e) {
                _this.tabResult.setState([]);
                _this.fpDetail.clear();
            });
            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent(GUI.IComunicazione.sID_FAR, 'Struttura', this.selFar);
            this.fpFilter.addTextField(GUI.IComunicazione.sOGGETTO, 'Oggetto');
            this.fpFilter.setMandatory(GUI.IComunicazione.sID_FAR);
            this.fpDetail = new WUX.WFormPanel(this.subId('fpd'));
            this.fpDetail.addRow();
            this.fpDetail.addTextField(GUI.IComunicazione.sOGGETTO, 'Oggetto');
            this.fpDetail.addComponent(GUI.IComunicazione.sMEZZO, 'Mezzo', new GUI.CFSelectTipoCom());
            this.fpDetail.addRow();
            this.fpDetail.addComponent(GUI.IComunicazione.sMESSAGGIO, 'Messaggio', new WUX.WTextArea());
            this.fpDetail.addInternalField(GUI.IComunicazione.sID);
            this.fpDetail.enabled = false;
            this.fpDetail.setSpanField(GUI.IComunicazione.sOGGETTO, 3);
            this.fpFilter.onEnterPressed(function (e) {
                _this.btnFind.trigger('click');
            });
            this.btnNew = new WUX.WButton(this.subId('bn'), GUI.TXT.NEW, '', WUX.BTN.SM_INFO);
            this.btnNew.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    _this.btnNew.blur();
                    return;
                }
                _this.isNew = true;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.tabResult.clearSelection();
                _this.fpDetail.enabled = true;
                _this.fpDetail.clear();
                _this.tabList.setState([]);
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnOpen = new WUX.WButton(this.subId('bo'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    _this.btnOpen.blur();
                    return;
                }
                var sr = _this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    _this.btnOpen.blur();
                    return;
                }
                _this.isNew = false;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.fpDetail.enabled = true;
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnSave = new WUX.WButton(this.subId('bs'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    WUX.showWarning('Cliccare su Modifica.');
                    _this.btnSave.blur();
                    return;
                }
                var check = _this.fpDetail.checkMandatory(true);
                if (check) {
                    _this.btnSave.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                var idf = WUtil.toNumber(_this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Selezionare la struttura di competenza');
                    return;
                }
                var values = _this.fpDetail.getState();
                var msg = WUtil.getString(values, GUI.IComunicazione.sMESSAGGIO);
                if (!msg || !msg.length) {
                    WUX.showWarning('Messaggio non specificato.');
                    return;
                }
                if (msg.length > 160) {
                    WUX.showWarning('Il messaggio ha ' + msg.length + ' caratteri (massimo consentito 160).');
                    return;
                }
                values[GUI.IComunicazione.sID_FAR] = idf;
                if (_this.isNew) {
                    jrpc.execute('COMUNICAZIONI.insert', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.selId = result[GUI.IComunicazione.sID];
                        _this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('COMUNICAZIONI.update', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.selId = result[GUI.IComunicazione.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            _this.btnFind.trigger('click');
                        }
                        else {
                            var idx_15 = selRows[0];
                            var records = _this.tabResult.getState();
                            records[idx_15] = result;
                            _this.tabResult.refresh();
                            setTimeout(function () {
                                _this.tabResult.select([idx_15]);
                            }, 100);
                        }
                    });
                }
            });
            this.btnCancel = new WUX.WButton(this.subId('bc'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    _this.btnCancel.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, function (res) {
                    if (!res)
                        return;
                    if (_this.isNew) {
                        _this.fpDetail.clear();
                    }
                    else {
                        _this.onSelect();
                    }
                    _this.status = _this.iSTATUS_VIEW;
                    _this.fpDetail.enabled = false;
                    _this.selId = null;
                });
            });
            this.btnDelete = new WUX.WButton(this.subId('bd'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete.on('click', function (e) {
                _this.selId = null;
                _this.btnDelete.blur();
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length)
                    return;
                var id = WUtil.getInt(rd[0], GUI.IComunicazione.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, function (res) {
                    if (!res)
                        return;
                    jrpc.execute('COMUNICAZIONI.delete', [id], function (result) {
                        _this.btnFind.trigger('click');
                    });
                });
            });
            var rc = [
                ['Oggetto', GUI.IComunicazione.sOGGETTO]
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.css({ h: 180 });
            this.tabResult.onSelectionChanged(function (e) {
                _this.onSelect();
            });
            this.tabList = new WUX.WDXTable(this.subId('tbv'), ['Prog.', 'Cognome', 'Nome', 'Telefono'], [GUI.ICliente.sREPUTAZIONE, GUI.ICliente.sCOGNOME, GUI.ICliente.sNOME, GUI.ICliente.sTELEFONO1]);
            this.tabList.selectionMode = 'single';
            this.tabList.css({ h: 250 });
            this.btnRemOne = new WUX.WButton(this.subId('bro'), GUI.TXT.REMOVE, '', WUX.BTN.SM_DANGER);
            this.btnRemOne.on('click', function (e) {
                var item = WUtil.getItem(_this.tabResult.getSelectedRowsData(), 0);
                if (!item)
                    return;
                var idc = WUtil.getNumber(item, GUI.ICollaboratore.sID);
                if (!idc) {
                    WUX.showWarning('Comunicazione non selezionata.');
                    return;
                }
                var sr = _this.tabList.getSelectedRows();
                var srd = _this.tabList.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare il cliente da rimuovere dalla lista di comunicazione');
                    return;
                }
                var idq = WUtil.getNumber(srd[0], 'id');
                if (!idq) {
                    WUX.showWarning('Riferimento al cliente assente');
                    return;
                }
                jrpc.execute('COMUNICAZIONI.remove', [idc, idq], function (result) {
                    if (!result) {
                        WUX.showWarning('Cliente NON rimosso dalla lista di comunicazione.');
                        return;
                    }
                    WUX.showSuccess('Cliente rimosso dalla lista di comunicazione.');
                    var q = _this.tabList.getState();
                    q.splice(sr[0], 1);
                    _this.tabList.setState(q);
                });
            });
            this.btnRemAll = new WUX.WButton(this.subId('bra'), GUI.TXT.REMOVE_ALL, '', WUX.BTN.SM_DANGER);
            this.btnRemAll.on('click', function (e) {
                var item = WUtil.getItem(_this.tabResult.getSelectedRowsData(), 0);
                if (!item)
                    return;
                var idc = WUtil.getNumber(item, GUI.ICollaboratore.sID);
                if (!idc) {
                    WUX.showWarning('Comunicazione non selezionata.');
                    return;
                }
                WUX.confirm('Si vuole eliminare tutta la lista di comunicazione?', function (res) {
                    if (!res)
                        return;
                    jrpc.execute('COMUNICAZIONI.removeAll', [idc], function (result) {
                        if (!result) {
                            WUX.showWarning('Lista di comunicazione non aggiornata.');
                            return;
                        }
                        WUX.showSuccess('Lista di comunicazione svuotata.');
                        _this.tabList.setState([]);
                    });
                });
            });
            this.cntActions = new GUI.CFTableActions('ta');
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
            this.tcoDetail.on('statechange', function (e) {
                var itab = _this.tcoDetail.getState();
                switch (itab) {
                    case 0:
                        break;
                    case 1:
                        _this.tabList.repaint();
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
                .end()
                .addBox()
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, this.cntActions, this.tabResult)
                .end()
                .addRow()
                .addCol('12').section('Dettaglio')
                .add(this.tcoDetail);
            return this.container;
        };
        GUIComunicazioni.prototype.collapseHandler = function (e) {
            var c = WUtil.getBoolean(e.data, 'collapsed');
            if (c) {
                this.tagsFilter.setState({});
            }
            else {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
            }
        };
        GUIComunicazioni.prototype.onSelect = function () {
            var _this = this;
            var item = WUtil.getItem(this.tabResult.getSelectedRowsData(), 0);
            if (!item)
                return;
            var id = WUtil.getNumber(item, GUI.IComunicazione.sID);
            if (!id)
                return;
            this.fpDetail.clear();
            this.fpDetail.setState(item);
            if (this.status == this.iSTATUS_EDITING) {
                WUX.showWarning('Modifiche annullate');
                this.fpDetail.enabled = false;
            }
            jrpc.execute('COMUNICAZIONI.read', [id], function (result) {
                _this.fpDetail.setState(result);
                _this.tabList.setState(WUtil.getArray(result, GUI.IComunicazione.sCODA));
                _this.status = _this.iSTATUS_VIEW;
            });
        };
        GUIComunicazioni.prototype.componentDidMount = function () {
            var idf = 0;
            if (GUI.strutture && GUI.strutture.length) {
                idf = GUI.strutture[0].id;
            }
            if (idf)
                this.selFar.setState(idf);
        };
        return GUIComunicazioni;
    }(WUX.WComponent));
    GUI.GUIComunicazioni = GUIComunicazioni;
})(GUI || (GUI = {}));
var GUI;
(function (GUI) {
    var WUtil = WUX.WUtil;
    var DlgDataCal = (function (_super) {
        __extends(DlgDataCal, _super);
        function DlgDataCal(id) {
            var _this = _super.call(this, id, 'DlgDataCal') || this;
            _this.title = 'Calendario';
            _this.cal = new WUX.WDXCalendar(_this.subId('cal'));
            _this.cal.on('statechange', function (e) {
                var dsel = _this.cal.getState();
                if (WUtil.isSameDate(dsel, _this.state))
                    return;
                setTimeout(function () { if (_this.btnOK)
                    _this.btnOK.trigger('click'); }, 100);
            });
            _this.cal.style = 'margin:auto;';
            _this.body
                .addRow()
                .addCol('12', { a: 'center' })
                .add(_this.cal);
            return _this;
        }
        DlgDataCal.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            this.cal.setState(this.state);
        };
        DlgDataCal.prototype.getState = function () {
            if (this.cal) {
                var selDate = this.cal.getState();
                if (selDate)
                    this.state = selDate;
            }
            return this.state;
        };
        DlgDataCal.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            var calw = this.cal.getRoot().width();
            if (calw < 400)
                calw = 400;
            this.cntMain.css({ w: calw });
        };
        return DlgDataCal;
    }(WUX.WDialog));
    GUI.DlgDataCal = DlgDataCal;
    var DlgSMSText = (function (_super) {
        __extends(DlgSMSText, _super);
        function DlgSMSText(id) {
            var _this = _super.call(this, id, 'DlgSMSText') || this;
            _this.title = 'Testo SMS';
            _this.tarea = new WUX.WTextArea(_this.subId('ta'), 5);
            _this.body
                .addRow()
                .addCol('12', { a: 'center' })
                .add(_this.tarea);
            return _this;
        }
        DlgSMSText.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.tarea)
                this.tarea.setState(this.state);
        };
        DlgSMSText.prototype.getState = function () {
            if (this.tarea)
                this.state = this.tarea.getState();
            return this.state;
        };
        DlgSMSText.prototype.onClickOk = function () {
            var text = this.tarea.getState();
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
        };
        DlgSMSText.prototype.onShown = function () {
            this.tarea.focus();
        };
        DlgSMSText.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            if (this.tarea)
                this.tarea.setState(this.state);
            this.cntMain.css({ w: 400 });
        };
        return DlgSMSText;
    }(WUX.WDialog));
    GUI.DlgSMSText = DlgSMSText;
    var DlgCheckDesk = (function (_super) {
        __extends(DlgCheckDesk, _super);
        function DlgCheckDesk(id) {
            var _this = _super.call(this, id, 'DlgCheckDesk') || this;
            _this.title = 'Controllo Desk';
            _this.inp = new WUX.WInput(_this.subId('icud'), WUX.WInputType.Password);
            _this.inp.css({ w: '100%' });
            _this.inp.onEnterPressed(function (e) {
                if (_this.onClickOk()) {
                    _this.ok = true;
                    _this.cancel = false;
                    _this.root.modal('hide');
                }
            });
            _this.body
                .addRow()
                .addCol('12')
                .add(_this.inp);
            return _this;
        }
        DlgCheckDesk.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.inp)
                this.inp.setState(this.state);
        };
        DlgCheckDesk.prototype.getState = function () {
            if (this.inp)
                this.state = this.inp.getState();
            return this.state;
        };
        DlgCheckDesk.prototype.onClickOk = function () {
            var text = this.inp.getState();
            if (!text) {
                WUX.showWarning('Password non valida.');
                return false;
            }
            return true;
        };
        DlgCheckDesk.prototype.onShown = function () {
            this.inp.setState('');
            this.inp.focus();
        };
        DlgCheckDesk.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            if (this.inp)
                this.inp.setState(this.state);
            this.cntMain.css({ w: 400 });
        };
        return DlgCheckDesk;
    }(WUX.WDialog));
    GUI.DlgCheckDesk = DlgCheckDesk;
    var DlgAppPag = (function (_super) {
        __extends(DlgAppPag, _super);
        function DlgAppPag(id) {
            var _this = _super.call(this, id, 'DlgAppPag') || this;
            _this.title = 'Registrazione pagamento';
            var sc = [
                ['Trattamento', GUI.IPrenotazione.sDESC_PREST, 's'],
                ['Collaboratore', GUI.IPrenotazione.sDESC_COLL, 's'],
                ['Note', GUI.IPrenotazione.sNOTE, 's'],
                ['Causale', GUI.IPrenotazione.sCAUSALE, 's'],
                ['Coupon', GUI.IPrenotazione.sCOD_COUPON, 's'],
                ['Pagato', GUI.IPrenotazione.sPAGATO, 'b'],
                ['Prezzo', GUI.IPrenotazione.sPREZZO_FINALE, 'c']
            ];
            _this.table = new WUX.WDXTable(_this.subId('tap'), WUtil.col(sc, 0), WUtil.col(sc, 1));
            _this.table.selectionMode = "multiple";
            _this.table.types = WUtil.col(sc, 2);
            _this.table.css({ h: 200, f: 10 });
            _this.table.onSelectionChanged(function (e) {
                var srd = _this.table.getSelectedRowsData();
                if (!srd)
                    srd = [];
                var s = 0;
                var c = '';
                for (var i = 0; i < srd.length; i++) {
                    s += WUtil.getNumber(srd[i], GUI.IPrenotazione.sPREZZO_FINALE);
                    var x = WUtil.getString(srd[i], GUI.IPrenotazione.sCOD_COUPON);
                    if (!x)
                        continue;
                    c += c ? ',' + x : x;
                }
                _this.fp.setValue(GUI.IPrenotazione.sPREZZO_FINALE, s);
                if (_this.impPag) {
                    if (_this.fp.isBlank(GUI.IPrenotazione.sIMP_PAGATO)) {
                        _this.fp.setValue(GUI.IPrenotazione.sIMP_PAGATO, s);
                    }
                    else {
                        _this.fp.setValue(GUI.IPrenotazione.sIMP_PAGATO, _this.impPag);
                    }
                }
                else {
                    _this.fp.setValue(GUI.IPrenotazione.sIMP_PAGATO, s);
                }
                if (c)
                    _this.fp.setValue(GUI.IPrenotazione.sCOD_COUPON, c);
                setTimeout(function () {
                    _this.fp.focusOn(GUI.IPrenotazione.sIMP_PAGATO);
                }, 200);
            });
            _this.selPag = new GUI.CFSelectAppTipoPag();
            var ln = new WUX.WLabel('');
            ln.css({ f: 14, fw: 'bold', d: 'block', pt: 8, pb: 8 }, WUX.CSS.LABEL_NOTICE);
            _this.fp = new WUX.WFormPanel(_this.subId('fp'));
            _this.fp.addRow();
            _this.fp.addComponent(GUI.IPrenotazione.sNOTE_CLIENTE, 'Note cliente', ln);
            _this.fp.addRow();
            _this.fp.addTextField(GUI.IPrenotazione.sCOD_COUPON, 'Codici Coupon <small>(separare con spazio o virgola)</small>');
            _this.fp.addComponent(GUI.IPrenotazione.sTIPO_PAG, 'Tipo pagamento', _this.selPag);
            _this.fp.addRow();
            _this.fp.addTextField(GUI.IPrenotazione.sCAUSALE, 'Causale');
            _this.fp.addCurrencyField(GUI.IPrenotazione.sPREZZO_FINALE, 'Totale &euro;', true);
            _this.fp.addCurrencyField(GUI.IPrenotazione.sIMP_PAGATO, 'Pagato &euro;');
            _this.fp.setSpanField(GUI.IPrenotazione.sCAUSALE, 2);
            _this.fp.setMandatory(GUI.IPrenotazione.sTIPO_PAG, GUI.IPrenotazione.sIMP_PAGATO);
            _this.fp.onEnterPressed(function (e) {
                if (e.data == GUI.IPrenotazione.sCOD_COUPON) {
                    if (!_this.fp.isBlank(GUI.IPrenotazione.sCOD_COUPON)) {
                        _this.fp.setValue(GUI.IPrenotazione.sTIPO_PAG, 'CPN');
                        _this.fp.focusOn(GUI.IPrenotazione.sIMP_PAGATO);
                    }
                    else {
                        var srd = _this.table.getSelectedRowsData();
                        if (!srd)
                            srd = [];
                        var c = '';
                        for (var i = 0; i < srd.length; i++) {
                            var x = WUtil.getString(srd[i], GUI.IPrenotazione.sCOD_COUPON);
                            if (!x)
                                continue;
                            c += c ? ',' + x : x;
                        }
                        if (c) {
                            _this.fp.setValue(GUI.IPrenotazione.sCOD_COUPON, c);
                            _this.fp.setValue(GUI.IPrenotazione.sTIPO_PAG, 'CPN');
                            _this.fp.focusOn(GUI.IPrenotazione.sIMP_PAGATO);
                        }
                        else {
                            _this.fp.focusOn(GUI.IPrenotazione.sTIPO_PAG);
                        }
                    }
                }
                if (_this.fp.isBlank(GUI.IPrenotazione.sIMP_PAGATO)) {
                    var srd = _this.table.getSelectedRowsData();
                    if (!srd)
                        srd = [];
                    var s = 0;
                    for (var i = 0; i < srd.length; i++) {
                        s += WUtil.getNumber(srd[i], GUI.IPrenotazione.sPREZZO_FINALE);
                    }
                    _this.fp.setValue(GUI.IPrenotazione.sIMP_PAGATO, s);
                    _this.impPag = 0;
                }
            });
            _this.body
                .addRow()
                .addCol('12').section('Appuntamenti da pagare')
                .add(_this.table)
                .addRow()
                .addCol('12')
                .add(_this.fp);
            return _this;
        }
        DlgAppPag.prototype.onShown = function () {
            var _this = this;
            var tipoPag = this.selPag.getState();
            if (!tipoPag)
                this.selPag.setState('CON');
            setTimeout(function () {
                _this.table.repaint();
                _this.table.selectAll();
                _this.fp.focusOn(GUI.IPrenotazione.sIMP_PAGATO);
            }, 200);
        };
        DlgAppPag.prototype.updateProps = function (nextProps) {
            _super.prototype.updateProps.call(this, nextProps);
            if (this.table)
                this.table.setState(this.props);
        };
        DlgAppPag.prototype.getProps = function () {
            if (this.table)
                this.props = this.table.getSelectedRowsData();
            return this.props;
        };
        DlgAppPag.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            this.impPag = WUtil.getNumber(this.state, GUI.IPrenotazione.sIMP_PAGATO);
            if (this.fp) {
                this.fp.setValue(GUI.IPrenotazione.sPREZZO_FINALE, this.impPag);
                this.fp.setValue(GUI.IPrenotazione.sIMP_PAGATO, this.impPag);
                this.fp.setValue(GUI.IPrenotazione.sCOD_COUPON, WUtil.getString(this.state, GUI.IPrenotazione.sCOD_COUPON));
                this.fp.setValue(GUI.IPrenotazione.sTIPO_PAG, WUtil.getString(this.state, GUI.IPrenotazione.sTIPO_PAG));
                this.fp.setValue(GUI.IPrenotazione.sNOTE_CLIENTE, WUtil.getString(this.state, GUI.IPrenotazione.sNOTE_CLIENTE));
                this.fp.setValue(GUI.IPrenotazione.sCAUSALE, WUtil.getString(this.state, GUI.IPrenotazione.sCAUSALE));
            }
        };
        DlgAppPag.prototype.getState = function () {
            this.state = {};
            if (this.selPag) {
                this.state[GUI.IPrenotazione.sTIPO_PAG] = WUtil.toString(this.selPag.getState());
            }
            if (this.fp) {
                this.state[GUI.IPrenotazione.sCOD_COUPON] = WUtil.toString(this.fp.getValue(GUI.IPrenotazione.sCOD_COUPON));
                this.state[GUI.IPrenotazione.sIMP_PAGATO] = WUtil.toNumber(this.fp.getValue(GUI.IPrenotazione.sIMP_PAGATO));
                this.state[GUI.IPrenotazione.sCAUSALE] = WUtil.toString(this.fp.getValue(GUI.IPrenotazione.sCAUSALE));
            }
            return this.state;
        };
        DlgAppPag.prototype.onClickOk = function () {
            var check = this.fp.checkMandatory(true);
            if (check) {
                WUX.showWarning('Specificare: ' + check);
                return false;
            }
            var vs = this.fp.getValues();
            var ip = WUtil.getNumber(vs, GUI.IPrenotazione.sIMP_PAGATO);
            if (!ip) {
                var c = WUtil.getString(vs, GUI.IPrenotazione.sCAUSALE);
                if (!c) {
                    WUX.showWarning('Con pagato 0 riportare una causale');
                    this.fp.focusOn(GUI.IPrenotazione.sCAUSALE);
                    return false;
                }
            }
            return true;
        };
        return DlgAppPag;
    }(WUX.WDialog));
    GUI.DlgAppPag = DlgAppPag;
    var DlgPrenotazione = (function (_super) {
        __extends(DlgPrenotazione, _super);
        function DlgPrenotazione(id) {
            var _this = _super.call(this, id, 'DlgPrenotazione', false, false) || this;
            _this.title = 'Appuntamento';
            _this.idFar = 0;
            _this.idPren = 0;
            _this.idCliente = 0;
            _this.dataPren = null;
            _this.refPlan = false;
            _this._sdate = false;
            _this._idcol = 0;
            _this._efind = false;
            var isOper = GUI.isBookOper();
            _this.dlgCAtt = new DlgCambioAttr(_this.subId('dca'));
            _this.dlgCAtt.onHiddenModal(function (e) {
                if (!_this.dlgCAtt.ok)
                    return;
                var a = _this.dlgCAtt.getProps();
                if (!a) {
                    WUX.showWarning('Nessuna cabina selezionata');
                    return;
                }
                var app = _this.fp.getValues();
                app[GUI.IPrenotazione.sDATA_APP] = WUtil.toDate(app[GUI.IPrenotazione.sDATA_APP]);
                app[GUI.IPrenotazione.sDATA_PREN] = WUtil.toDate(app[GUI.IPrenotazione.sDATA_PREN]);
                GUI.chkExecute('PRENOTAZIONI.changeAttr', [app, a.id], function (result) {
                    if (result) {
                        WUX.showSuccess('Cambio cabina avvenuto con successo.');
                        _this.fp.setValue(GUI.IPrenotazione.sID_ATTR, a.id);
                        _this.fp.setValue(GUI.IPrenotazione.sDESC_ATTR, a.text);
                    }
                    else {
                        WUX.showWarning('Cambio cabina NON avvenuto.');
                    }
                });
            });
            _this.dlgCPre = new DlgCambioPrest(_this.subId('dcp'));
            _this.dlgCPre.onHiddenModal(function (e) {
                if (!_this.dlgCPre.ok)
                    return;
                var p = _this.dlgCPre.getProps();
                if (!p) {
                    WUX.showWarning('Nessuna prestazione selezionata');
                    return;
                }
                var app = _this.fp.getValues();
                app[GUI.IPrenotazione.sDATA_APP] = WUtil.toDate(app[GUI.IPrenotazione.sDATA_APP]);
                app[GUI.IPrenotazione.sDATA_PREN] = WUtil.toDate(app[GUI.IPrenotazione.sDATA_PREN]);
                GUI.chkExecute('PRENOTAZIONI.changePrest', [app, p.id], function (result) {
                    if (result) {
                        WUX.showSuccess('Cambio trattamento avvenuto con successo.');
                        _this.fp.setValue(GUI.IPrenotazione.sID_PREST, p.id);
                        _this.fp.setValue(GUI.IPrenotazione.sDESC_PREST, p.text);
                        if (p.value) {
                            _this.fp.setValue(GUI.IPrenotazione.sPREZZO_FINALE, WUX.formatCurr(p.value));
                        }
                        _this.refPlan = true;
                    }
                    else {
                        WUX.showWarning('Cambio trattamento NON avvenuto.');
                    }
                });
            });
            _this.dlgSApp = new DlgStoricoApp(_this.subId('dsa'));
            _this.dlgPApp = new DlgAppPag(_this.subId('dpa'));
            _this.dlgPApp.onHiddenModal(function (e) {
                if (!_this.dlgPApp.ok)
                    return;
                var appSel = _this.dlgPApp.getProps();
                if (!appSel || !appSel.length) {
                    WUX.showWarning('Nessuna prenotazione selezionata');
                    return;
                }
                var lidp = [];
                for (var i = 0; i < appSel.length; i++) {
                    lidp.push(WUtil.getNumber(appSel[i], GUI.IPrenotazione.sID));
                }
                var data = _this.dlgPApp.getState();
                if (!data) {
                    WUX.showWarning('Dati pagamenti non disponibili.');
                }
                var tipoPag = WUtil.getString(data, GUI.IPrenotazione.sTIPO_PAG);
                if (!tipoPag) {
                    WUX.showWarning('Tipo pagamento non specificato.');
                    return;
                }
                var impPag = WUtil.getNumber(data, GUI.IPrenotazione.sIMP_PAGATO);
                var codCou = WUtil.getString(data, GUI.IPrenotazione.sCOD_COUPON);
                var causale = WUtil.getString(data, GUI.IPrenotazione.sCAUSALE);
                jrpc.execute('PRENOTAZIONI.updatePag', [lidp, tipoPag, impPag, codCou, causale], function (result) {
                    if (result) {
                        WUX.showSuccess('Pagamento registrato con successo.');
                        _this.fp.setValue(GUI.IPrenotazione.sTIPO_PAG, tipoPag);
                        _this.fp.setValue(GUI.IPrenotazione.sIMP_PAGATO, impPag);
                        _this.fp.setValue(GUI.IPrenotazione.sCOD_COUPON, codCou);
                        _this.fp.setValue(GUI.IPrenotazione.sCAUSALE, causale);
                    }
                    else {
                        WUX.showWarning('Pagamento NON registrato.');
                    }
                });
            });
            _this.selOra = new GUI.CFSelectOrario();
            _this.selCol = new GUI.CFSelectCollab();
            _this.selCol.on('statechange', function (e) {
                if (!_this.selCol.count)
                    return;
                if (!_this._efind)
                    return;
                var idColl = WUtil.toNumber(_this.selCol.getState());
                console.log('selCol statechange _idcol=' + _this._idcol + ',idColl=' + idColl);
                if (_this._idcol && idColl != _this._idcol)
                    _this.doFind();
            });
            _this.selTip = new GUI.CFSelectTipoApp();
            _this.selTip.on('statechange', function (e) {
                if (!_this.isShown)
                    return;
                var ts = _this.selTip.getState();
                if (!ts) {
                    setTimeout(function () {
                        _this.selTip.close();
                    }, 100);
                }
                WUX.showWarning('Riportare eventualmente una nota e premere invio per aggiornare.');
                setTimeout(function () {
                    _this.fp.focusOn(GUI.IPrenotazione.sNOTE);
                }, 100);
            });
            _this.btnSrc = new WUX.WButton(_this.subId('btc'), 'Cerca', GUI.ICO.FIND, WUX.BTN.SECONDARY);
            _this.btnSrc.tooltip = 'Cerca appuntamenti disponibili';
            _this.btnSrc.on('click', function (e) {
                _this.doFind();
            });
            if (!isOper) {
                _this.btnRic = new WUX.WButton(_this.subId('btr'), 'Ricolloca', GUI.ICO.TOOL, WUX.BTN.PRIMARY);
                _this.btnRic.on('click', function (e) {
                    WUX.confirm('Si vuole ricollocare l\'appuntamento?', function (res) {
                        if (!res)
                            return;
                        var app = _this.fp.getValues();
                        app[GUI.IPrenotazione.sDATA_APP] = WUtil.toDate(app[GUI.IPrenotazione.sDATA_APP]);
                        app[GUI.IPrenotazione.sDATA_PREN] = WUtil.toDate(app[GUI.IPrenotazione.sDATA_PREN]);
                        GUI.chkExecute('PRENOTAZIONI.relocate', [app], function (result) {
                            if (!result) {
                                WUX.showWarning('Ricollocazione appuntamento NON eseguita.');
                                return;
                            }
                            var msg = WUtil.getString(result, GUI.IPrenotazione.sMESSAGGIO);
                            if (msg) {
                                WUX.showWarning(msg);
                                return;
                            }
                            _this.idPren = WUtil.getNumber(result, GUI.IPrenotazione.sID);
                            _this.dataPren = WUtil.getDate(result, GUI.IPrenotazione.sDATA_APP);
                            WUX.showSuccess('Ricollocazione eseguita con successo.');
                            _this.ok = true;
                            _this.cancel = false;
                            _this.root.modal('hide');
                        });
                    });
                });
            }
            _this.btnMov = new WUX.WButton(_this.subId('bts'), 'Sposta', GUI.ICO.CALENDAR, WUX.BTN.INFO);
            _this.btnMov.tooltip = 'Sposta appuntamento';
            _this.btnMov.on('click', function (e) {
                if (_this.fp.isBlank(GUI.IPrenotazione.sCAMBIO_DATA) && _this.fp.isBlank(GUI.IPrenotazione.sCAMBIO_ORA)) {
                    _this.doFind();
                }
                else {
                    if (_this.fp.isBlank(GUI.IPrenotazione.sCAMBIO_DATA)) {
                        var dtApp = WUtil.toString(_this.fp.getValue(GUI.IPrenotazione.sDATA_APP));
                        if (!dtApp) {
                            WUX.showWarning('Selezionare la data del nuovo appuntamento.');
                            return;
                        }
                        var iSep = dtApp.indexOf(',');
                        if (iSep >= 0)
                            dtApp = dtApp.substring(iSep + 1).trim();
                        _this.fp.setValue(GUI.IPrenotazione.sCAMBIO_DATA, dtApp);
                    }
                    if (_this.fp.isBlank(GUI.IPrenotazione.sCAMBIO_ORA)) {
                        WUX.showWarning('Selezionare l\'ora del nuovo appuntamento.');
                        _this.fp.focusOn(GUI.IPrenotazione.sCAMBIO_ORA);
                        return;
                    }
                    WUX.confirm('Si vuole spostare l\'appuntamento?', function (res) {
                        if (!res)
                            return;
                        var app = _this.fp.getValues();
                        app[GUI.IPrenotazione.sDATA_APP] = WUtil.toDate(app[GUI.IPrenotazione.sDATA_APP]);
                        app[GUI.IPrenotazione.sDATA_PREN] = WUtil.toDate(app[GUI.IPrenotazione.sDATA_PREN]);
                        if (_this.idFar)
                            app[GUI.IPrenotazione.sID_FAR] = _this.idFar;
                        GUI.chkExecute('PRENOTAZIONI.move', [app], function (result) {
                            if (!result) {
                                WUX.showWarning('Spostamento della prenotazione NON eseguito.');
                                return;
                            }
                            var msg = WUtil.getString(result, GUI.IPrenotazione.sMESSAGGIO);
                            if (msg) {
                                WUX.showWarning(msg);
                                return;
                            }
                            _this.idPren = WUtil.getNumber(result, GUI.IPrenotazione.sID);
                            _this.dataPren = WUtil.getDate(result, GUI.IPrenotazione.sDATA_APP);
                            WUX.showSuccess('Spostamento eseguito con successo.');
                            _this.ok = true;
                            _this.cancel = false;
                            _this.root.modal('hide');
                        });
                    });
                }
            });
            _this.btnRev = new WUX.WButton(_this.subId('btd'), 'Disdici', GUI.ICO.DELETE, WUX.BTN.DANGER);
            _this.btnRev.tooltip = 'Annulla appuntamento';
            _this.btnRev.on('click', function (e) {
                var app = _this.fp.getValues();
                app[GUI.IPrenotazione.sDATA_APP] = WUtil.toDate(app[GUI.IPrenotazione.sDATA_APP]);
                GUI.chkExecute('PRENOTAZIONI.revoke', [app], function (result) {
                    if (!result) {
                        WUX.showWarning('Annullamento della prenotazione non eseguito.');
                        return;
                    }
                    var msg = WUtil.getString(result, GUI.IPrenotazione.sMESSAGGIO);
                    if (msg) {
                        WUX.showWarning(msg);
                        return;
                    }
                    _this.idPren = 0;
                    WUX.showSuccess('Prenotazione annullata con successo.');
                    _this.ok = true;
                    _this.cancel = false;
                    _this.root.modal('hide');
                });
            });
            _this.btnAbs = new WUX.WButton(_this.subId('btn'), 'Non Pres.', GUI.ICO.CANCEL, WUX.BTN.WARNING);
            _this.btnAbs.tooltip = 'Registra non presentato';
            _this.btnAbs.on('click', function (e) {
                var app = _this.fp.getValues();
                app[GUI.IPrenotazione.sDATA_APP] = WUtil.toDate(app[GUI.IPrenotazione.sDATA_APP]);
                app[GUI.IPrenotazione.sSTATO] = 'N';
                jrpc.execute('PRENOTAZIONI.update', [app], function (result) {
                    if (!result) {
                        WUX.showWarning('Aggiornamento della prenotazione non eseguito.');
                        return;
                    }
                    var msg = WUtil.getString(result, GUI.IPrenotazione.sMESSAGGIO);
                    if (msg) {
                        WUX.showWarning(msg);
                        return;
                    }
                    WUX.showSuccess('Aggiornamento eseguito con successo.');
                    _this.ok = true;
                    _this.cancel = false;
                    _this.root.modal('hide');
                });
            });
            _this.btnPag = new WUX.WButton(_this.subId('btp'), 'Pagam.', GUI.ICO.OK, WUX.BTN.SUCCESS);
            _this.btnPag.tooltip = 'Registra pagamento';
            _this.btnPag.on('click', function (e) {
                if (!_this.idCliente) {
                    WUX.showWarning('Riferimento al cliente assente');
                    return;
                }
                if (!_this.idFar) {
                    WUX.showWarning('Riferimento alla struttura assente');
                    return;
                }
                if (!_this.dataPren) {
                    WUX.showWarning('Data appuntamento non disponibile');
                    return;
                }
                jrpc.execute('PRENOTAZIONI.history', [_this.idCliente, _this.idFar, _this.dataPren], function (result) {
                    if (!result || !result.length) {
                        WUX.showWarning('Appuntamenti da pagare non disponibili');
                        return;
                    }
                    if (_this.idPren) {
                        var p = WUtil.find(result, GUI.IPrenotazione.sID, _this.idPren);
                        var f = WUtil.getBoolean(p, GUI.IPrenotazione.sPAGATO);
                        if (f) {
                            WUX.showWarning('Prenotazione pagata.');
                            return;
                        }
                    }
                    var data = {};
                    data[GUI.IPrenotazione.sTIPO_PAG] = WUtil.toString(_this.fp.getValue(GUI.IPrenotazione.sTIPO_PAG));
                    data[GUI.IPrenotazione.sIMP_PAGATO] = WUtil.toNumber(_this.fp.getValue(GUI.IPrenotazione.sIMP_PAGATO));
                    data[GUI.IPrenotazione.sCOD_COUPON] = WUtil.toString(_this.fp.getValue(GUI.IPrenotazione.sCOD_COUPON));
                    data[GUI.IPrenotazione.sNOTE_CLIENTE] = WUtil.toString(_this.fp.getValue(GUI.IPrenotazione.sNOTE_CLIENTE));
                    data[GUI.IPrenotazione.sCAUSALE] = WUtil.toString(_this.fp.getValue(GUI.IPrenotazione.sCAUSALE));
                    _this.dlgPApp.setProps(result);
                    _this.dlgPApp.setState(data);
                    _this.dlgPApp.show(_this);
                });
            });
            if (!_this.buttons)
                _this.buttons = [];
            _this.buttons.push(_this.btnSrc);
            if (!isOper) {
                _this.buttons.push(_this.btnRic);
            }
            _this.buttons.push(_this.btnMov);
            _this.buttons.push(_this.btnRev);
            _this.buttons.push(_this.btnPag);
            _this.buttons.push(_this.btnAbs);
            var lt = new WUX.WLabel('');
            lt.css({ f: 14, fw: 'bold', d: 'block', pt: 8, pb: 8 }, WUX.CSS.LABEL_INFO);
            var ln = new WUX.WLabel('');
            ln.css({ f: 14, fw: 'bold', d: 'block', pt: 8, pb: 8 }, WUX.CSS.LABEL_NOTICE);
            _this.chkOvr = new WUX.WCheck('', 'Ignora controlli');
            _this.chkMat = new WUX.WCheck('', 'fino alle 14:00');
            _this.chkPom = new WUX.WCheck('', 'dalle 14:00');
            _this.fp = new WUX.WFormPanel(_this.subId('fp'));
            _this.fp.addRow();
            _this.fp.addTextField(GUI.IPrenotazione.sDESC_CLIENTE, 'Cliente', true);
            _this.fp.addRow();
            _this.fp.addTextField(GUI.IPrenotazione.sTELEFONO1, 'Telefono', true);
            _this.fp.addComponent(GUI.IPrenotazione.sID_FAR, 'Struttura', new GUI.CFSelectStruture(), true);
            _this.fp.addRow();
            _this.fp.addTextField(GUI.IPrenotazione.sDATA_APP, 'Data Appuntamento', true);
            _this.fp.addDateField(GUI.IPrenotazione.sCAMBIO_DATA, 'Cambio data');
            _this.fp.addRow();
            _this.fp.addTextField(GUI.IPrenotazione.sORA_APP, 'Dalle ore', true);
            _this.fp.addTextField(GUI.IPrenotazione.sORA_FINE, 'alle ore', true);
            _this.fp.addComponent(GUI.IPrenotazione.sCAMBIO_ORA, 'Cambio ora', _this.selOra);
            if (isOper) {
                _this.fp.addBlankField();
            }
            else {
                _this.fp.addComponent(GUI.IPrenotazione.sOVERBOOKING, 'Forzatura', _this.chkOvr.getWrapper({ mt: 4 }));
            }
            _this.fp.addRow();
            _this.fp.addComponent(GUI.IPrenotazione.sDESC_PREST, 'Trattamento', lt);
            _this.fp.addRow();
            _this.fp.addTextField(GUI.IPrenotazione.sDESC_COLL, 'Collaboratore', true);
            _this.fp.addComponent(GUI.IPrenotazione.sCAMBIO_ID_COLL, 'Cambio Coll.', _this.selCol);
            _this.fp.addRow();
            _this.fp.addTextField(GUI.IPrenotazione.sDESC_ATTR, 'Cabina', true);
            _this.fp.addComponent(GUI.IPrenotazione.sMATTINO, 'Mattino', _this.chkMat.getWrapper({ mt: 4 }));
            _this.fp.addComponent(GUI.IPrenotazione.sPOMERIGGIO, 'Pomeriggio', _this.chkPom.getWrapper({ mt: 4 }));
            _this.fp.addRow();
            _this.fp.addIntegerField(GUI.IPrenotazione.sDURATA, 'Durata');
            _this.fp.addTextField(GUI.IPrenotazione.sPREZZO_FINALE, 'Importo', true);
            _this.fp.addRow();
            _this.fp.addTextField(GUI.IPrenotazione.sDATA_PREN, 'Prenotato il', true);
            _this.fp.addComponent(GUI.IPrenotazione.sTIPO, 'Tipo', _this.selTip);
            _this.fp.addRow();
            _this.fp.addComponent(GUI.IPrenotazione.sNOTE_CLIENTE, 'Note Cliente', ln);
            _this.fp.addRow();
            _this.fp.addTextField(GUI.IPrenotazione.sNOTE, 'Note Prenotazione (premere invio per aggiornarle)');
            _this.fp.addInternalField(GUI.IPrenotazione.sID);
            _this.fp.addInternalField(GUI.IPrenotazione.sID_CLIENTE);
            _this.fp.addInternalField(GUI.IPrenotazione.sID_COLL);
            _this.fp.addInternalField(GUI.IPrenotazione.sID_ATTR);
            _this.fp.addInternalField(GUI.IPrenotazione.sID_PREST);
            _this.fp.addInternalField(GUI.IPrenotazione.sSTATO);
            _this.fp.addInternalField(GUI.IPrenotazione.sTIPO_PAG);
            _this.fp.addInternalField(GUI.IPrenotazione.sIMP_PAGATO);
            _this.fp.addInternalField(GUI.IPrenotazione.sCOD_COUPON);
            _this.fp.addInternalField(GUI.IPrenotazione.sCAUSALE);
            if (isOper) {
                _this.fp.addInternalField(GUI.IPrenotazione.sOVERBOOKING);
            }
            _this.fp.setSpanField(GUI.IPrenotazione.sDESC_ATTR, 2);
            _this.lnkSApp = new WUX.WLink(_this.subId('lsa'), 'Storico', WUX.WIcon.FOLDER_OPEN_O);
            _this.lnkSApp.on('click', function (e) {
                var idc = WUtil.toNumber(_this.fp.getValue(GUI.IPrenotazione.sID_CLIENTE));
                if (!idc)
                    return;
                jrpc.execute('CLIENTI.read', [idc], function (result) {
                    if (!result) {
                        WUX.showWarning('Dati cliente ' + idc + ' non disponibili.');
                        return;
                    }
                    _this.dlgSApp.setState(WUtil.getArray(result, GUI.ICliente.sPRENOTAZIONI));
                    _this.dlgSApp.show(_this);
                });
            });
            _this.fp.setLabelLinks(GUI.IPrenotazione.sDESC_CLIENTE, [_this.lnkSApp]);
            _this.lnkCPre = new WUX.WLink(_this.subId('lcp'), 'Cambio', WUX.WIcon.RECYCLE);
            _this.lnkCPre.on('click', function (e) {
                var app = _this.fp.getValues();
                var idf = WUtil.getNumber(app, GUI.IPrenotazione.sID_FAR);
                var idc = WUtil.getNumber(app, GUI.IPrenotazione.sID_COLL);
                jrpc.execute('PRESTAZIONI.getAll', [idf, idc], function (result) {
                    _this.dlgCPre.setState(result);
                    _this.dlgCPre.durata = WUtil.getNumber(app, GUI.IPrenotazione.sDURATA);
                    _this.dlgCPre.show(_this);
                });
            });
            _this.fp.setLabelLinks(GUI.IPrenotazione.sDESC_PREST, [_this.lnkCPre]);
            _this.lnkCAtt = new WUX.WLink(_this.subId('lcc'), 'Cambio', WUX.WIcon.RECYCLE);
            _this.lnkCAtt.on('click', function (e) {
                var app = _this.fp.getValues();
                app[GUI.IPrenotazione.sDATA_APP] = WUtil.toDate(app[GUI.IPrenotazione.sDATA_APP]);
                app[GUI.IPrenotazione.sDATA_PREN] = WUtil.toDate(app[GUI.IPrenotazione.sDATA_PREN]);
                jrpc.execute('ATTREZZATURE.getCollegate', [app], function (result) {
                    _this.dlgCAtt.setProps({ id: WUtil.getNumber(app, GUI.IPrenotazione.sID_ATTR) });
                    _this.dlgCAtt.setState(result);
                    _this.dlgCAtt.show(_this);
                });
            });
            _this.fp.setLabelLinks(GUI.IPrenotazione.sDESC_ATTR, [_this.lnkCAtt]);
            _this.fp.onEnterPressed(function (e) {
                var fid = e.data;
                if (fid == GUI.IPrenotazione.sNOTE) {
                    var app = _this.fp.getValues();
                    app[GUI.IPrenotazione.sDATA_APP] = WUtil.toDate(app[GUI.IPrenotazione.sDATA_APP]);
                    app[GUI.IPrenotazione.sSTATO] = '';
                    app[GUI.IPrenotazione.sTIPO] = _this.fp.getValue(GUI.IPrenotazione.sTIPO);
                    jrpc.execute('PRENOTAZIONI.update', [app], function (result) {
                        if (!result) {
                            WUX.showWarning('Aggiornamento prenotazione NON eseguito.');
                            return;
                        }
                        var msg = WUtil.getString(result, GUI.IPrenotazione.sMESSAGGIO);
                        if (msg) {
                            WUX.showWarning(msg);
                            return;
                        }
                        WUX.showSuccess('Aggiornamento prenotazione eseguito con successo.');
                        _this.ok = true;
                        _this.cancel = false;
                        _this.root.modal('hide');
                    });
                }
            });
            _this.lnkPrev = new WUX.WLink(_this.subId('lnkp'), '', GUI.ICO.LEFT);
            _this.lnkPrev.tooltip = 'Data precedente';
            _this.lnkPrev.on('click', function (e) {
                _this._efind = false;
                var dataApp = WUtil.toDate(_this.fp.getValue(GUI.IPrenotazione.sCAMBIO_DATA));
                if (!dataApp) {
                    WUX.showWarning('Data non selezionata.');
                    return;
                }
                if (!_this._idcol) {
                    WUX.showWarning('Interrogare le disponibilit&agrave;.');
                    return;
                }
                _this.doFind(null, dataApp);
            });
            _this.lnkNext = new WUX.WLink(_this.subId('lnkn'), '', GUI.ICO.RIGHT);
            _this.lnkNext.tooltip = 'Data successiva';
            _this.lnkNext.on('click', function (e) {
                _this._efind = false;
                var dataApp = WUtil.toDate(_this.fp.getValue(GUI.IPrenotazione.sCAMBIO_DATA));
                if (!dataApp) {
                    WUX.showWarning('Data non selezionata.');
                    return;
                }
                if (!_this._idcol) {
                    WUX.showWarning('Interrogare le disponibilit&agrave;.');
                    return;
                }
                dataApp.setDate(dataApp.getDate() + 1);
                _this.doFind(dataApp);
            });
            _this.fp.setLabelLinks(GUI.IPrenotazione.sCAMBIO_DATA, [_this.lnkPrev, _this.lnkNext]);
            _this.fp.onChangeDate(function (e) {
                var fid = WUX.lastSub($(e.target));
                if (fid == GUI.IPrenotazione.sCAMBIO_DATA) {
                    if (_this._sdate) {
                        _this._sdate = false;
                        return;
                    }
                    if (_this.fp.isBlank(GUI.IPrenotazione.sCAMBIO_DATA))
                        return;
                    if (!_this._efind)
                        return;
                    _this.doFind();
                }
            });
            _this.body
                .addRow()
                .addCol('12')
                .add(_this.fp);
            return _this;
        }
        DlgPrenotazione.prototype.doFind = function (fromDate, toDate) {
            var _this = this;
            console.log('doFind fromDate=' + WUX.formatDate(fromDate) + ',toDate=' + WUX.formatDate(toDate));
            this._efind = false;
            var app = this.fp.getValues();
            app[GUI.IPrenotazione.sPREFERENZE] = '';
            if (app[GUI.IPrenotazione.sMATTINO] && !app[GUI.IPrenotazione.sPOMERIGGIO]) {
                app[GUI.IPrenotazione.sPREFERENZE] = 'M';
            }
            else if (!app[GUI.IPrenotazione.sMATTINO] && app[GUI.IPrenotazione.sPOMERIGGIO]) {
                app[GUI.IPrenotazione.sPREFERENZE] = 'P';
            }
            app[GUI.IPrenotazione.sID_COLL] = this.fp.getValue(GUI.IPrenotazione.sCAMBIO_ID_COLL);
            delete app[GUI.IPrenotazione.sDATA_APP];
            delete app[GUI.IPrenotazione.sCAMBIO_DATA];
            if (fromDate) {
                app[GUI.IPrenotazione.sCAMBIO_DAL] = fromDate;
            }
            else if (toDate) {
                app[GUI.IPrenotazione.sCAMBIO_AL] = toDate;
            }
            else if (this.fp.isBlank(GUI.IPrenotazione.sCAMBIO_DATA)) {
                app[GUI.IPrenotazione.sCAMBIO_DAL] = WUtil.toDate(this.fp.getValue(GUI.IPrenotazione.sDATA_APP));
            }
            else {
                app[GUI.IPrenotazione.sCAMBIO_DATA] = WUtil.toDate(this.fp.getValue(GUI.IPrenotazione.sCAMBIO_DATA));
                app[GUI.IPrenotazione.sCAMBIO_DAL] = null;
            }
            app[GUI.IPrenotazione.sPREN_ONLINE] = false;
            if (this.idFar)
                app[GUI.IPrenotazione.sID_FAR] = this.idFar;
            jrpc.execute('CALENDARIO.getAvailabilities', [app], function (result) {
                var appts = [];
                if (!result || !result.length) {
                    _this._idcol = -1;
                    _this.fp.setValue(GUI.IPrenotazione.sCAMBIO_ORA, null);
                    _this.selOra.setAllSlots();
                    WUX.showWarning('Non vi sono appuntamenti disponibili.');
                    _this._efind = true;
                    return;
                }
                var c = result[0];
                if (c.data) {
                    WUX.showSuccess('Primo appuntamento disponibile:<br><strong>' + WUX.formatDate(c.data, true) + '</strong> alle ore <strong>' + WUX.formatTime(c.oraInizio) + '</strong><br>con <strong>' + c.nomeCollab + '</strong>');
                    _this._sdate = true;
                    _this.fp.setValue(GUI.IPrenotazione.sCAMBIO_DATA, c.data);
                    _this.fp.setValue(GUI.IPrenotazione.sCAMBIO_ORA, c.oraInizio);
                    _this._idcol = c.idCollaboratore;
                    _this.fp.setValue(GUI.IPrenotazione.sCAMBIO_ID_COLL, _this._idcol);
                }
                for (var i = 0; i < result.length; i++) {
                    var o = result[i].oraInizio;
                    if (appts.indexOf(o) < 0)
                        appts.push(o);
                }
                appts.sort(function (a, b) { return a - b; });
                _this.selOra.setAppts(appts);
                _this._efind = true;
            });
            return this;
        };
        DlgPrenotazione.prototype.updateState = function (nextState) {
            var _this = this;
            _super.prototype.updateState.call(this, nextState);
            var ckUsrDesk = WUtil.getBoolean(this.state, GUI.IPrenotazione.sCHECK_USER_DESK);
            if (ckUsrDesk) {
                GUI.CFBookCfg.CHECK_USER_DESK = ckUsrDesk;
            }
            this.idFar = WUtil.getNumber(this.state, GUI.IPrenotazione.sID_FAR);
            this.idPren = WUtil.getNumber(this.state, GUI.IPrenotazione.sID);
            this.idCliente = WUtil.getNumber(this.state, GUI.IPrenotazione.sID_CLIENTE);
            this.dataPren = WUtil.getDate(this.state, GUI.IPrenotazione.sDATA_APP);
            this.oraPren = this.state ? WUtil.toIntTime(this.state[GUI.IPrenotazione.sORA_APP]) : 0;
            this.refPlan = false;
            this._sdate = false;
            this._idcol = 0;
            this._efind = false;
            if (this.selOra)
                this.selOra.setAllSlots();
            if (this.fp) {
                this.fp.clear();
                delete this.state[GUI.IPrenotazione.sCAMBIO_ID_COLL];
                this.fp.setState(this.state);
                this._idcol = WUtil.getNumber(this.state, GUI.IPrenotazione.sID_COLL);
                setTimeout(function () {
                    _this.selCol.setIdFar(_this.idFar, _this._idcol);
                }, 100);
            }
        };
        DlgPrenotazione.prototype.getState = function () {
            if (this.fp) {
                this.state = this.fp.getState();
            }
            return this.state;
        };
        DlgPrenotazione.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.cntMain.css({ w: 650 });
        };
        return DlgPrenotazione;
    }(WUX.WDialog));
    GUI.DlgPrenotazione = DlgPrenotazione;
    var DlgOrariPers = (function (_super) {
        __extends(DlgOrariPers, _super);
        function DlgOrariPers(id) {
            var _this = _super.call(this, id, 'DlgOrariPers') || this;
            _this.title = 'Personalizza orari';
            _this.cfOrariPers = new GUI.CFOrariPers(_this.subId('op'));
            _this.body
                .addRow()
                .addCol('12')
                .add(_this.cfOrariPers);
            return _this;
        }
        DlgOrariPers.prototype.updateState = function (nextState) {
            this.state = {};
            this.state[GUI.ICalendario.sORARI] = WUtil.getObject(nextState, GUI.ICalendario.sORARI);
            if (this.cfOrariPers) {
                var date = WUtil.getDate(nextState, GUI.ICalendario.sDATA);
                if (date) {
                    this.title = 'Personalizza orari di ' + WUX.formatDate(date, true, false);
                }
                else {
                    this.title = 'Personalizza orari';
                }
                this.cfOrariPers.resources = WUtil.getArray(nextState, GUI.ICalendario.sRISORSE);
                this.cfOrariPers.setState(WUtil.getObject(nextState, GUI.ICalendario.sORARI));
            }
        };
        DlgOrariPers.prototype.getState = function () {
            if (!this.state)
                this.state = {};
            if (this.cfOrariPers) {
                this.state[GUI.ICalendario.sORARI] = this.cfOrariPers.getState();
            }
            return this.state;
        };
        DlgOrariPers.prototype.refresh = function () {
            if (!this.cfOrariPers)
                this.cfOrariPers.refresh();
            return this;
        };
        DlgOrariPers.prototype.onShown = function () {
            this.cfOrariPers.refresh();
        };
        return DlgOrariPers;
    }(WUX.WDialog));
    GUI.DlgOrariPers = DlgOrariPers;
    var DlgAssenze = (function (_super) {
        __extends(DlgAssenze, _super);
        function DlgAssenze(id) {
            var _this = _super.call(this, id, 'DlgAssenze') || this;
            _this.title = 'Assenze';
            _this.fp = new WUX.WFormPanel(_this.subId('fp'));
            _this.fp.addRow();
            _this.fp.addDateField('ad', 'Dal');
            _this.fp.addDateField('aa', 'al');
            _this.fp.setMandatory('ad', 'aa');
            _this.body
                .addRow()
                .addCol('12')
                .add(_this.fp);
            return _this;
        }
        DlgAssenze.prototype.getState = function () {
            if (this.fp) {
                this.state = [];
                this.state[0] = WUtil.toDate(this.fp.getValue('ad'));
                this.state[1] = WUtil.toDate(this.fp.getValue('aa'));
            }
            return this.state;
        };
        DlgAssenze.prototype.onShown = function () {
            this.fp.clear();
        };
        DlgAssenze.prototype.onClickOk = function () {
            var check = this.fp.checkMandatory(true);
            if (check) {
                WUX.showWarning('Specificare: ' + check);
                return false;
            }
            var ad = WUtil.toNumber(WUtil.toDate(this.fp.getValue('ad')));
            var aa = WUtil.toNumber(WUtil.toDate(this.fp.getValue('aa')));
            if (aa < ad) {
                WUX.showWarning('Data "al" anteriore rispetto alla data "dal".');
                return false;
            }
            return true;
        };
        return DlgAssenze;
    }(WUX.WDialog));
    GUI.DlgAssenze = DlgAssenze;
    var DlgAgenda = (function (_super) {
        __extends(DlgAgenda, _super);
        function DlgAgenda(id) {
            var _this = _super.call(this, id, 'DlgAgenda') || this;
            _this.title = 'Orario';
            _this.cmpAgenda = new GUI.CFAgenda(_this.subId('age'));
            _this.fp = new WUX.WFormPanel(_this.subId('fp'));
            _this.fp.addRow();
            _this.fp.addDateField('iv', 'Inizio Validit&agrave;');
            _this.fp.addDateField('fv', 'Fine Validit&agrave;');
            _this.fp.addTextField('ds', 'Descrizione');
            _this.fp.addInternalField('id');
            _this.fp.setMandatory('iv');
            _this.body
                .addRow()
                .addCol('12')
                .add(_this.fp)
                .addRow()
                .addCol('12', { a: 'center' })
                .add(_this.cmpAgenda);
            return _this;
        }
        DlgAgenda.prototype.getState = function () {
            if (this.cmpAgenda) {
                var iv = WUtil.toDate(this.fp.getValue('iv'));
                this.cmpAgenda.setDateRef(iv);
                this.state = this.cmpAgenda.getState();
                if (this.state) {
                    this.state.id = WUtil.toNumber(this.fp.getValue('id'));
                    this.state.inizioValidita = WUtil.toDate(this.fp.getValue('iv'));
                    this.state.fineValidita = WUtil.toDate(this.fp.getValue('fv'));
                    this.state.descrizione = WUtil.toString(this.fp.getValue('ds'));
                    if (!this.state.descrizione)
                        this.state.descrizione = 'PIANO';
                }
            }
            return this.state;
        };
        DlgAgenda.prototype.onClickOk = function () {
            var _this = this;
            var div = WUtil.toDate(this.fp.getValue('iv'));
            if (!div) {
                WUX.showWarning('Inizio Validit&agrave; non valida');
                this.fp.focusOn('iv');
                return false;
            }
            var cd = WUtil.toNumber(new Date());
            var iv = WUtil.toNumber(div);
            if (iv <= cd) {
                WUX.showWarning('La variazione deve avere inizio validit&agrave; nel futuro.');
                this.fp.focusOn('iv');
                return false;
            }
            var fv = WUtil.toNumber(WUtil.toDate(this.fp.getValue('fv')));
            if (fv && fv <= iv) {
                this.fp.focusOn('fv');
                WUX.showWarning('La data di fine validit&agrave; deve essere posteriore a quella di inizio.');
                return false;
            }
            if (this.conf)
                return true;
            if (!this.cmpAgenda.isActivated()) {
                WUX.confirm('Settimana corrente non attiva. Proseguire?', function (res) {
                    if (res) {
                        _this.conf = true;
                        _this.btnOK.trigger('click');
                    }
                });
                return false;
            }
            return true;
        };
        DlgAgenda.prototype.onShown = function () {
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
        };
        DlgAgenda.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            var w = $(window).width();
            if (w > 1260) {
                this.cntMain.css({ w: 1260, h: 600 });
            }
            else {
                this.cntMain.css({ w: 1000, h: 600 });
            }
        };
        return DlgAgenda;
    }(WUX.WDialog));
    GUI.DlgAgenda = DlgAgenda;
    var DlgCliente = (function (_super) {
        __extends(DlgCliente, _super);
        function DlgCliente(id) {
            var _this = _super.call(this, id, 'DlgCliente') || this;
            _this.title = 'Cliente';
            _this.fp = new WUX.WFormPanel(_this.subId('fp'));
            _this.fp.addRow();
            _this.fp.addTextField(GUI.ICliente.sCOGNOME, 'Cognome');
            _this.fp.addRow();
            _this.fp.addTextField(GUI.ICliente.sNOME, 'Nome');
            _this.fp.addRow();
            _this.fp.addTextField(GUI.ICliente.sTELEFONO1, 'Telefono');
            _this.fp.addRow();
            _this.fp.addTextField(GUI.ICliente.sEMAIL, 'Email');
            _this.fp.addRow();
            _this.fp.addOptionsField(GUI.ICliente.sSESSO, 'Sesso', [{ id: '', text: '' }, { id: 'M', text: 'Maschio' }, { id: 'F', text: 'Femmina' }]);
            _this.fp.addRow();
            _this.fp.addDateField(GUI.ICliente.sDATA_NASCITA, 'Data di nascita');
            _this.fp.addRow();
            _this.fp.addTextField(GUI.ICliente.sNOTE, 'Note');
            _this.fp.addInternalField(GUI.ICliente.sID);
            _this.fp.setMandatory(GUI.ICliente.sCOGNOME, GUI.ICliente.sNOME, GUI.ICliente.sTELEFONO1);
            _this.body
                .addRow()
                .addCol('12')
                .add(_this.fp);
            return _this;
        }
        DlgCliente.prototype.onShown = function () {
            var _this = this;
            this.done = false;
            this.fp.clear();
            if (this.state) {
                this.fp.setState(this.state);
            }
            setTimeout(function () {
                _this.fp.focusOn(GUI.ICliente.sCOGNOME);
            }, 100);
        };
        DlgCliente.prototype.onClickOk = function () {
            var _this = this;
            if (this.done)
                return true;
            var cs = this.fp.checkMandatory(true, true);
            if (cs) {
                WUX.showWarning('Specificare i seguenti campi: ' + cs);
                return false;
            }
            var values = this.fp.getValues();
            var t = WUtil.getString(values, GUI.ICliente.sTELEFONO1);
            if (!t || t.length < 5) {
                WUX.showWarning('Numero di telefono non valido');
                this.fp.focusOn(GUI.ICliente.sTELEFONO1);
                return false;
            }
            if (values[GUI.ICliente.sID]) {
                jrpc.execute('CLIENTI.update', [values], function (result) {
                    if (!result) {
                        WUX.showWarning('Dati cliente non registrati.');
                        return;
                    }
                    _this.state = result;
                    _this.done = true;
                    _this.btnOK.trigger('click');
                    WUX.showSuccess('Dati cliente registrati con successo.');
                });
            }
            else {
                var t_1 = values[GUI.ICliente.sTELEFONO1];
                if (t_1) {
                    jrpc.execute('CLIENTI.exists', [t_1], function (re) {
                        if (re && re[GUI.ICliente.sCOGNOME]) {
                            var msg = re[GUI.ICliente.sCOGNOME] + ' ' + re[GUI.ICliente.sNOME] + ' ha il numero di telefono ' + re[GUI.ICliente.sTELEFONO1] + '. Proseguire?';
                            WUX.confirm(msg, function (cnf) {
                                if (!cnf)
                                    return;
                                jrpc.execute('CLIENTI.insert', [values], function (resIns) {
                                    if (!resIns) {
                                        WUX.showWarning('Dati cliente non registrati.');
                                        return;
                                    }
                                    _this.state = resIns;
                                    _this.done = true;
                                    _this.btnOK.trigger('click');
                                    WUX.showSuccess('Cliente inserito con successo.');
                                });
                            });
                            return;
                        }
                        jrpc.execute('CLIENTI.insert', [values], function (result) {
                            if (!result) {
                                WUX.showWarning('Dati cliente non registrati.');
                                return;
                            }
                            _this.state = result;
                            _this.done = true;
                            _this.btnOK.trigger('click');
                            WUX.showSuccess('Cliente inserito con successo.');
                        });
                    });
                }
                else {
                    jrpc.execute('CLIENTI.insert', [values], function (result) {
                        if (!result) {
                            WUX.showWarning('Dati cliente non registrati.');
                            return;
                        }
                        _this.state = result;
                        _this.done = true;
                        _this.btnOK.trigger('click');
                        WUX.showSuccess('Cliente inserito con successo.');
                    });
                }
            }
            return false;
        };
        DlgCliente.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.cntMain.css({ w: 500 });
        };
        return DlgCliente;
    }(WUX.WDialog));
    GUI.DlgCliente = DlgCliente;
    var DlgClienti = (function (_super) {
        __extends(DlgClienti, _super);
        function DlgClienti(id) {
            var _this = _super.call(this, id, 'DlgClienti') || this;
            _this.title = 'Selezionare il cliente';
            _this.fpFilter = new WUX.WFormPanel(_this.subId('ff'));
            _this.fpFilter.addRow();
            _this.fpFilter.addTextField(GUI.ICliente.sCOGNOME, 'Cognome');
            _this.fpFilter.addTextField(GUI.ICliente.sNOME, 'Nome');
            _this.fpFilter.addTextField(GUI.ICliente.sTELEFONO1, 'Telefono');
            _this.fpFilter.addTextField(GUI.ICliente.sEMAIL, 'Email');
            _this.btnFind = new WUX.WButton(_this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            _this.btnFind.on('click', function (e) {
                jrpc.execute('CLIENTI.find', [_this.fpFilter.getState()], function (result) {
                    _this.state = null;
                    if (result) {
                        if (_this.props) {
                            var idx = WUtil.indexOf(result, GUI.ICliente.sID, _this.props);
                            if (idx >= 0)
                                result.splice(idx, 1);
                        }
                        _this.tabResult.setState(result);
                    }
                    else {
                        _this.tabResult.setState([]);
                    }
                });
            });
            _this.btnReset = new WUX.WButton(_this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            _this.btnReset.on('click', function (e) {
                _this.state = null;
                _this.fpFilter.clear();
                _this.tabResult.setState([]);
            });
            var rc = [
                ['Cognome', GUI.ICliente.sCOGNOME, 's'],
                ['Nome', GUI.ICliente.sNOME, 's'],
                ['Telefono', GUI.ICliente.sTELEFONO1, 's'],
                ['Email', GUI.ICliente.sEMAIL, 's'],
                ['Sesso', GUI.ICliente.sSESSO, 's'],
                ['Data Nascita', GUI.ICliente.sDATA_NASCITA, 'd']
            ];
            _this.tabResult = new WUX.WDXTable(_this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            _this.tabResult.exportFile = 'clienti';
            _this.tabResult.types = WUtil.col(rc, 2);
            _this.tabResult.css({ h: 200 });
            _this.tabResult.widths = [100];
            _this.body
                .addBox('Filtri di ricerca:', '', '', '', WUX.ATT.BOX_FILTER)
                .addRow()
                .addCol('col-xs-11 b-r')
                .add(_this.fpFilter)
                .addCol('col-xs-1 b-l')
                .addGroup({ classStyle: 'form-group text-right' }, _this.btnFind, _this.btnReset)
                .end()
                .addBox()
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, _this.tabResult)
                .end();
            return _this;
        }
        DlgClienti.prototype.onClickOk = function () {
            var srd = this.tabResult.getSelectedRowsData();
            if (!srd || !srd.length) {
                WUX.showWarning('Selezionare un cliente');
                return false;
            }
            this.state = srd[0];
            return true;
        };
        DlgClienti.prototype.onShown = function () {
            var _this = this;
            this.state = null;
            this.tabResult.scrollTo(0);
            this.tabResult.setState([]);
            setTimeout(function () {
                _this.fpFilter.focusOn(GUI.ICliente.sCOGNOME);
                _this.tabResult.repaint();
                if (!_this.fpFilter.isBlank()) {
                    _this.btnFind.trigger('click');
                }
            }, 100);
        };
        return DlgClienti;
    }(WUX.WDialog));
    GUI.DlgClienti = DlgClienti;
    var DlgAttrRis = (function (_super) {
        __extends(DlgAttrRis, _super);
        function DlgAttrRis(id) {
            var _this = _super.call(this, id, 'DlgAttrRis') || this;
            _this.title = 'Cabine riservate';
            var pc = [
                ['Cabina', 'da'],
                ['Collaboratore', 'dc'],
                ['Giorno', 'rg'],
                ['Riservata dalle', 'rd'],
                ['alle', 'ra']
            ];
            _this.tabAttr = new WUX.WDXTable(_this.subId('tpa'), WUtil.col(pc, 0), WUtil.col(pc, 1));
            _this.tabAttr.css({ h: 328 });
            _this.tabAttr.exportFile = 'cabine_riservate';
            _this.tabAttr.widths = [240];
            _this.tabAttr.selectionMode = 'single';
            _this.tabAttr.onRowPrepared(function (e) {
                if (!e.data)
                    return;
                var at = WUtil.getBoolean(e.data, 'at');
                var sp = WUtil.getBoolean(e.data, 'sp');
                if (!at) {
                    WUX.setCss(e.rowElement, WUX.CSS.ERROR);
                }
                else if (sp) {
                    WUX.setCss(e.rowElement, WUX.CSS.WARNING);
                }
            });
            _this.body
                .addRow()
                .addCol('12')
                .add(_this.tabAttr);
            return _this;
        }
        DlgAttrRis.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.tabAttr) {
                this.tabAttr.setState(this.state);
            }
        };
        DlgAttrRis.prototype.getState = function () {
            if (this.tabAttr) {
                this.state = this.tabAttr.getState();
            }
            return this.state;
        };
        DlgAttrRis.prototype.onShown = function () {
            var _this = this;
            this.tabAttr.scrollTo(0);
            setTimeout(function () {
                if (_this.state && _this.state.length) {
                    _this.tabAttr.refresh();
                }
                else {
                    _this.tabAttr.repaint();
                }
            }, 100);
        };
        return DlgAttrRis;
    }(WUX.WDialog));
    GUI.DlgAttrRis = DlgAttrRis;
    var DlgStoricoApp = (function (_super) {
        __extends(DlgStoricoApp, _super);
        function DlgStoricoApp(id) {
            var _this = _super.call(this, id, 'DlgStoricoApp') || this;
            _this.title = 'Storico appuntamenti';
            _this.dataRif = WUtil.toNumber(new Date());
            var sc = [
                ['Data App.', GUI.IPrenotazione.sDATA_APP, 'd'],
                ['Ora App.', GUI.IPrenotazione.sORA_APP, 's'],
                ['Durata', GUI.IPrenotazione.sDURATA, 'i'],
                ['Stato', GUI.IPrenotazione.sSTATO, 's'],
                ['Collaboratore', GUI.IPrenotazione.sDESC_COLL, 's'],
                ['Trattamento', GUI.IPrenotazione.sDESC_PREST, 's'],
                ['Cabina', GUI.IPrenotazione.sDESC_ATTR, 's'],
                ['Data Pren.', GUI.IPrenotazione.sDATA_PREN, 'd'],
                ['Struttura', GUI.IPrenotazione.sCOD_FAR, 's'],
                ['Note', GUI.IPrenotazione.sNOTE, 's'],
                ['Coupon', GUI.IPrenotazione.sCOD_COUPON, 's'],
                ['Forzatura', GUI.IPrenotazione.sOVERBOOKING, 'b'],
                ['On Line', GUI.IPrenotazione.sPREN_ONLINE, 'b']
            ];
            _this.tabStorico = new WUX.WDXTable(_this.subId('tps'), WUtil.col(sc, 0), WUtil.col(sc, 1));
            _this.tabStorico.types = WUtil.col(sc, 2);
            _this.tabStorico.css({ h: 200, f: 10 });
            _this.tabStorico.onRowPrepared(function (e) {
                if (!e.data)
                    return;
                var stato = WUtil.getString(e.data, GUI.IPrenotazione.sSTATO, 'C');
                var pdata = WUtil.getInt(e.data, GUI.IPrenotazione.sDATA_APP);
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
                if (pdata == _this.dataRif) {
                    e.rowElement.css('font-weight', 'bold');
                }
            });
            _this.body
                .addRow()
                .addCol('12')
                .add(_this.tabStorico);
            return _this;
        }
        DlgStoricoApp.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.tabStorico) {
                this.tabStorico.setState(this.state);
            }
        };
        DlgStoricoApp.prototype.onShown = function () {
            var _this = this;
            this.tabStorico.scrollTo(0);
            setTimeout(function () {
                if (_this.state && _this.state.length) {
                    _this.tabStorico.refresh();
                }
                else {
                    _this.tabStorico.repaint();
                }
            }, 100);
        };
        DlgStoricoApp.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            var w = $(window).width();
            if (w > 1200) {
                this.cntMain.css({ w: 1200, h: 600 });
            }
            else {
                this.cntMain.css({ w: 900, h: 600 });
            }
        };
        return DlgStoricoApp;
    }(WUX.WDialog));
    GUI.DlgStoricoApp = DlgStoricoApp;
    var DlgStoricoColl = (function (_super) {
        __extends(DlgStoricoColl, _super);
        function DlgStoricoColl(id) {
            var _this = _super.call(this, id, 'DlgStoricoColl') || this;
            _this.title = 'Storico prenotazioni collaboratore';
            _this.dataRif = WUtil.toNumber(new Date());
            var sc = [
                ['Data App.', GUI.IPrenotazione.sDATA_APP, 'd'],
                ['Ora App.', GUI.IPrenotazione.sORA_APP, 's'],
                ['Durata', GUI.IPrenotazione.sDURATA, 'i'],
                ['Stato', GUI.IPrenotazione.sSTATO, 's'],
                ['Cliente', GUI.IPrenotazione.sDESC_CLIENTE, 's'],
                ['Trattamento', GUI.IPrenotazione.sDESC_PREST, 's'],
                ['Cabina', GUI.IPrenotazione.sDESC_ATTR, 's'],
                ['Data Pren.', GUI.IPrenotazione.sDATA_PREN, 'd'],
                ['Data Agg.', GUI.IPrenotazione.sDATA_UPD, 't'],
                ['Struttura', GUI.IPrenotazione.sCOD_FAR, 's'],
                ['Note', GUI.IPrenotazione.sNOTE, 's'],
                ['Forzatura', GUI.IPrenotazione.sOVERBOOKING, 'b'],
                ['On Line', GUI.IPrenotazione.sPREN_ONLINE, 'b']
            ];
            _this.label = new WUX.WLabel(_this.subId('lbl'));
            _this.label.css({ f: 14, fw: 'bold' }, WUX.CSS.LABEL_INFO);
            _this.tabStorico = new WUX.WDXTable(_this.subId('tps'), WUtil.col(sc, 0), WUtil.col(sc, 1));
            _this.tabStorico.filter = true;
            _this.tabStorico.exportFile = 'storico_coll';
            _this.tabStorico.types = WUtil.col(sc, 2);
            _this.tabStorico.css({ h: 400, f: 10 });
            _this.tabStorico.onRowPrepared(function (e) {
                if (!e.data)
                    return;
                var stato = WUtil.getString(e.data, GUI.IPrenotazione.sSTATO, 'C');
                var pdata = WUtil.getInt(e.data, GUI.IPrenotazione.sDATA_APP);
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
                if (pdata == _this.dataRif) {
                    e.rowElement.css('font-weight', 'bold');
                }
            });
            _this.body
                .addRow()
                .addCol('12', { a: 'right' })
                .add(_this.label)
                .addRow()
                .addDiv(8)
                .addCol('12')
                .add(_this.tabStorico);
            return _this;
        }
        DlgStoricoColl.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.tabStorico) {
                this.tabStorico.setState(this.state);
            }
        };
        DlgStoricoColl.prototype.updateProps = function (nextProps) {
            _super.prototype.updateProps.call(this, nextProps);
            if (!this.mounted)
                return;
            this.label.setState(this.props);
        };
        DlgStoricoColl.prototype.onShown = function () {
            var _this = this;
            this.tabStorico.scrollTo(0);
            this.tabStorico.clearFilter();
            setTimeout(function () {
                if (_this.state && _this.state.length) {
                    _this.tabStorico.refresh();
                }
                else {
                    _this.tabStorico.repaint();
                }
            }, 100);
        };
        DlgStoricoColl.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            var w = $(window).width();
            if (w > 1200) {
                this.cntMain.css({ w: 1200, h: 600 });
            }
            else {
                this.cntMain.css({ w: 900, h: 600 });
            }
        };
        return DlgStoricoColl;
    }(WUX.WDialog));
    GUI.DlgStoricoColl = DlgStoricoColl;
    var DlgComunicazione = (function (_super) {
        __extends(DlgComunicazione, _super);
        function DlgComunicazione(id) {
            var _this = _super.call(this, id, 'DlgComunicazione') || this;
            _this.title = 'Seleziona comunicazione';
            var pc = [
                ['Oggetto', GUI.IComunicazione.sOGGETTO, 's']
            ];
            _this.tabCom = new WUX.WDXTable(_this.subId('tpr'), WUtil.col(pc, 0), WUtil.col(pc, 1));
            _this.tabCom.types = WUtil.col(pc, 2);
            _this.tabCom.css({ h: 350 });
            _this.tabCom.selectionMode = 'single';
            _this.body
                .addRow()
                .addCol('12')
                .add(_this.tabCom);
            return _this;
        }
        DlgComunicazione.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.tabCom)
                this.tabCom.setState(this.state);
        };
        DlgComunicazione.prototype.getState = function () {
            if (this.tabCom)
                this.state = this.tabCom.getState();
            return this.state;
        };
        DlgComunicazione.prototype.getProps = function () {
            this.props = null;
            if (this.tabCom) {
                var srd = this.tabCom.getSelectedRowsData();
                if (srd && srd.length) {
                    this.props = {
                        id: WUtil.getNumber(srd[0], GUI.IComunicazione.sID),
                        text: WUtil.getString(srd[0], GUI.IComunicazione.sOGGETTO),
                    };
                }
            }
            return this.props;
        };
        DlgComunicazione.prototype.onClickOk = function () {
            var srd = this.tabCom.getSelectedRowsData();
            if (!srd || !srd.length) {
                WUX.showWarning('Comunicazione non selezionata.');
                return false;
            }
            return true;
        };
        DlgComunicazione.prototype.onShown = function () {
            var _this = this;
            this.tabCom.scrollTo(0);
            setTimeout(function () {
                if (_this.state && _this.state.length) {
                    _this.tabCom.refresh();
                }
                else {
                    _this.tabCom.repaint();
                }
            }, 100);
        };
        return DlgComunicazione;
    }(WUX.WDialog));
    GUI.DlgComunicazione = DlgComunicazione;
    var DlgCambioAttr = (function (_super) {
        __extends(DlgCambioAttr, _super);
        function DlgCambioAttr(id) {
            var _this = _super.call(this, id, 'DlgCambioAttr') || this;
            _this.title = 'Cambio cabina';
            var pc = [
                ['Cabina', 'da'],
                ['Collaboratore', 'dc'],
                ['Giorno', 'rg'],
                ['Ris. dalle', 'rd'],
                ['alle', 'ra'],
                ['Coll.Successivo', 'nn'],
                ['dalle', 'nd'],
                ['alle', 'na']
            ];
            _this.tabAttr = new WUX.WDXTable(_this.subId('tpa'), WUtil.col(pc, 0), WUtil.col(pc, 1));
            _this.tabAttr.css({ h: 350 });
            _this.tabAttr.widths = [240];
            _this.tabAttr.selectionMode = 'single';
            _this.tabAttr.onRowPrepared(function (e) {
                if (!e.data)
                    return;
                var ia = WUtil.getNumber(e.data, 'ia');
                var rf = WUtil.getBoolean(e.data, 'rf');
                var cp = WUtil.getBoolean(e.data, 'cp');
                if (_this.props && _this.props.id == ia) {
                    WUX.setCss(e.rowElement, WUX.CSS.INFO);
                }
                else if (rf) {
                    WUX.setCss(e.rowElement, WUX.CSS.ERROR);
                }
                if (cp) {
                    e.rowElement.css('font-weight', 'bold');
                }
            });
            _this.body
                .addRow()
                .addCol('12')
                .add(_this.tabAttr);
            return _this;
        }
        DlgCambioAttr.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.tabAttr) {
                this.tabAttr.setState(this.state);
            }
        };
        DlgCambioAttr.prototype.getState = function () {
            if (this.tabAttr) {
                this.state = this.tabAttr.getState();
            }
            return this.state;
        };
        DlgCambioAttr.prototype.getProps = function () {
            this.props = null;
            if (this.tabAttr) {
                var srd = this.tabAttr.getSelectedRowsData();
                if (srd && srd.length) {
                    this.props = { id: WUtil.getNumber(srd[0], 'ia'), text: WUtil.getString(srd[0], 'da') };
                }
            }
            return this.props;
        };
        DlgCambioAttr.prototype.onClickOk = function () {
            var srd = this.tabAttr.getSelectedRowsData();
            if (!srd || !srd.length) {
                WUX.showWarning('Cabina non selezionata.');
                return false;
            }
            var rf = WUtil.getBoolean(srd[0], 'rf');
            if (rf) {
                WUX.showWarning('Cabina occupata.');
                return false;
            }
            return true;
        };
        DlgCambioAttr.prototype.onShown = function () {
            var _this = this;
            this.tabAttr.scrollTo(0);
            setTimeout(function () {
                if (_this.state && _this.state.length) {
                    _this.tabAttr.refresh();
                }
                else {
                    _this.tabAttr.repaint();
                }
            }, 100);
        };
        return DlgCambioAttr;
    }(WUX.WDialog));
    GUI.DlgCambioAttr = DlgCambioAttr;
    var DlgCambioPrest = (function (_super) {
        __extends(DlgCambioPrest, _super);
        function DlgCambioPrest(id) {
            var _this = _super.call(this, id, 'DlgCambioPrest') || this;
            _this.title = 'Cambio Trattamento';
            var pc = [
                ['Descrizione', GUI.IPrestazione.sDESCRIZIONE, 's', false],
                ['Durata', GUI.IPrestazione.sDURATA, 'i', true],
                ['Prezzo', GUI.IPrestazione.sPREZZO_FINALE, 'c', false]
            ];
            _this.tabPrest = new WUX.WDXTable(_this.subId('tpr'), WUtil.col(pc, 0), WUtil.col(pc, 1));
            _this.tabPrest.types = WUtil.col(pc, 2);
            _this.tabPrest.css({ h: 350 });
            _this.tabPrest.selectionMode = 'single';
            _this.body
                .addRow()
                .addCol('12')
                .add(_this.tabPrest);
            return _this;
        }
        DlgCambioPrest.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.tabPrest) {
                this.tabPrest.setState(this.state);
            }
            this.durata = 0;
        };
        DlgCambioPrest.prototype.getState = function () {
            if (this.tabPrest) {
                this.state = this.tabPrest.getState();
            }
            return this.state;
        };
        DlgCambioPrest.prototype.getProps = function () {
            this.props = null;
            if (this.tabPrest) {
                var srd = this.tabPrest.getSelectedRowsData();
                if (srd && srd.length) {
                    this.props = {
                        id: WUtil.getNumber(srd[0], GUI.IPrestazione.sID),
                        text: WUtil.getString(srd[0], GUI.IPrestazione.sDESCRIZIONE),
                        value: WUtil.getNumber(srd[0], GUI.IPrestazione.sPREZZO_FINALE)
                    };
                }
            }
            return this.props;
        };
        DlgCambioPrest.prototype.onClickOk = function () {
            if (this.done)
                return true;
            if (this.durata) {
                var srd = this.tabPrest.getSelectedRowsData();
                if (srd && srd.length) {
                    var dp = WUtil.getNumber(srd[0], GUI.IPrestazione.sDURATA) - 10;
                    if (this.durata < dp) {
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
        };
        DlgCambioPrest.prototype.onShown = function () {
            var _this = this;
            this.tabPrest.scrollTo(0);
            this.done = false;
            setTimeout(function () {
                if (_this.state && _this.state.length) {
                    _this.tabPrest.refresh();
                }
                else {
                    _this.tabPrest.repaint();
                }
            }, 100);
        };
        return DlgCambioPrest;
    }(WUX.WDialog));
    GUI.DlgCambioPrest = DlgCambioPrest;
    var DlgOrgPrest = (function (_super) {
        __extends(DlgOrgPrest, _super);
        function DlgOrgPrest(id) {
            var _this = _super.call(this, id, 'DlgOrgPrest') || this;
            _this.title = 'Organizza Prestazioni';
            var pc = [
                ['Descrizione', GUI.IPrestazione.sDESCRIZIONE, 's', false],
                ['Durata', GUI.IPrestazione.sDURATA, 'i', true],
                ['Prezzo', GUI.IPrestazione.sPREZZO_FINALE, 'c', false]
            ];
            _this.tabPrestaz = new WUX.WDXTable(_this.subId('tpr'), WUtil.col(pc, 0), WUtil.col(pc, 1));
            _this.tabPrestaz.editable = true;
            _this.tabPrestaz.types = WUtil.col(pc, 2);
            _this.tabPrestaz.editables = WUtil.col(pc, 3);
            _this.tabPrestaz.css({ h: 328 });
            _this.tabPrestaz.widths = [240];
            _this.tabPrestaz.selectionMode = 'single';
            _this.btnUp = new WUX.WButton(_this.subId('bu'), '', WUX.WIcon.ARROW_CIRCLE_UP, WUX.BTN.ACT_PRIMARY, { p: '3px 6px 3px 6px' });
            _this.btnUp.tooltip = 'Sposta su';
            _this.btnUp.on('click', function (e) {
                var srd = _this.tabPrestaz.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare il trattamento da spostare.');
                    return;
                }
                var id = srd[0][GUI.IPrenotazione.sID];
                var st = _this.tabPrestaz.getState();
                var ix = WUtil.indexOf(st, GUI.IPrenotazione.sID, id);
                if (ix <= 0)
                    return;
                var p = st[ix - 1];
                var c = st[ix];
                st[ix - 1] = c;
                st[ix] = p;
                _this.tabPrestaz.setState(st);
                setTimeout(function () {
                    _this.tabPrestaz.select([ix - 1]);
                }, 100);
            });
            _this.btnDw = new WUX.WButton(_this.subId('bd'), '', WUX.WIcon.ARROW_CIRCLE_DOWN, WUX.BTN.ACT_PRIMARY, { p: '3px 6px 3px 6px' });
            _this.btnDw.tooltip = 'Sposta giu\'';
            _this.btnDw.on('click', function (e) {
                var srd = _this.tabPrestaz.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare il trattamento da spostare.');
                    return;
                }
                var id = srd[0][GUI.IPrenotazione.sID];
                var st = _this.tabPrestaz.getState();
                var ix = WUtil.indexOf(st, GUI.IPrenotazione.sID, id);
                if (ix < 0 || ix == st.length - 1)
                    return;
                var n = st[ix + 1];
                var c = st[ix];
                st[ix + 1] = c;
                st[ix] = n;
                _this.tabPrestaz.setState(st);
                setTimeout(function () {
                    _this.tabPrestaz.select([ix + 1]);
                }, 100);
            });
            var cntTab0 = new WUX.WContainer(_this.subId('ct0'), '');
            cntTab0
                .addRow()
                .addCol('11', { p: 0 })
                .add(_this.tabPrestaz)
                .addCol('1', { p: 0 })
                .addStack(WUX.CSS.STACK_BTNS, _this.btnUp, _this.btnDw);
            _this.body
                .addRow()
                .addCol('12')
                .add(cntTab0);
            return _this;
        }
        DlgOrgPrest.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (this.tabPrestaz) {
                this.tabPrestaz.setState(this.state);
            }
        };
        DlgOrgPrest.prototype.getState = function () {
            if (this.tabPrestaz) {
                this.state = this.tabPrestaz.getState();
            }
            return this.state;
        };
        DlgOrgPrest.prototype.onShown = function () {
            var _this = this;
            setTimeout(function () {
                _this.tabPrestaz.repaint();
            }, 100);
        };
        return DlgOrgPrest;
    }(WUX.WDialog));
    GUI.DlgOrgPrest = DlgOrgPrest;
    var DlgNuovoApp = (function (_super) {
        __extends(DlgNuovoApp, _super);
        function DlgNuovoApp(id) {
            var _this = _super.call(this, id, 'DlgNuovoApp') || this;
            _this.title = 'Nuovo Appuntamento';
            _this.idCollStart = 0;
            _this.idCliente = 0;
            _this.dataPren = null;
            _this.appts = [];
            _this.prestAbil = [];
            _this.prestSort = [];
            _this.currDate = WUtil.toNumber(new Date());
            _this.idFar = 0;
            _this.idPren = 0;
            _this.confCanc = false;
            _this._sdate = false;
            _this._idcol = 0;
            _this._efind = false;
            _this._count = 0;
            _this.dlgCliente = new DlgCliente(_this.subId('dlc'));
            _this.dlgCliente.onHiddenModal(function (e) {
                if (!_this.dlgCliente.ok)
                    return;
                var cliente = _this.dlgCliente.getState();
                if (!cliente)
                    return;
                _this.tabClienti.setState([cliente]);
                _this.lblNote.setState('');
                setTimeout(function () {
                    _this.tabClienti.select([0]);
                }, 100);
            });
            _this.dlgOrgPres = new DlgOrgPrest(_this.subId('dlp'));
            _this.dlgOrgPres.onHiddenModal(function (e) {
                if (_this.dlgCliente.cancel)
                    return;
                _this.prestSort = _this.dlgOrgPres.getState();
            });
            _this.btnNew = new WUX.WButton(_this.subId('bba'), '', GUI.ICO.ADD, WUX.BTN.PRIMARY, { p: '1px 6px 0px 6px' });
            _this.btnNew.tooltip = 'Registra nuovo cliente';
            _this.btnNew.on('click', function (e) {
                _this.dlgCliente.setState(null);
                _this.dlgCliente.show(_this);
            });
            _this.txtSearch = new WUX.WInput('txtTest', WUX.WInputType.Text);
            _this.txtSearch.css({ w: '84%' });
            _this.txtSearch.tooltip = 'Ricerca cliente';
            _this.txtSearch.placeHolder = 'Ricerca cliente';
            _this.txtSearch.onEnterPressed(function (e) {
                var text = _this.txtSearch.getState();
                if (!text) {
                    WUX.showWarning('Riportare un criterio di ricerca per il cliente');
                    return;
                }
                var filter = {};
                filter[GUI.ICliente.sNOMINATIVO] = text;
                jrpc.execute('CLIENTI.find', [filter], function (result) {
                    if (result && result.length) {
                        _this.tabClienti.setState(result);
                        if (result.length == 1) {
                            setTimeout(function () {
                                _this.tabClienti.select([0]);
                            }, 100);
                        }
                    }
                    else {
                        _this.tabClienti.setState([]);
                    }
                });
            });
            var cntCliente = new WUX.WContainer(_this.subId('ccl'));
            cntCliente.add(_this.txtSearch).addSpan(8).add(_this.btnNew);
            var rc = [
                ['Cognome', GUI.ICliente.sCOGNOME],
                ['Nome', GUI.ICliente.sNOME],
                ['Telefono', GUI.ICliente.sTELEFONO1]
            ];
            _this.tabClienti = new WUX.WDXTable(_this.subId('tcl'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            _this.tabClienti.css({ h: 300 });
            _this.tabClienti.widths = [100];
            _this.tabClienti.selectionMode = 'single';
            _this.tabClienti.onSelectionChanged(function (e) {
                var srd = _this.tabClienti.getSelectedRowsData();
                if (!srd || !srd.length)
                    return;
                var idc = WUtil.getNumber(srd[0], GUI.ICliente.sID);
                if (!idc)
                    return;
                _this.idCliente = idc;
                jrpc.execute('CLIENTI.read', [idc], function (result) {
                    if (!result) {
                        WUX.showWarning('Dati cliente ' + idc + ' non disponibili.');
                        return;
                    }
                    var prnz = WUtil.getArray(result, GUI.ICliente.sPRENOTAZIONI);
                    var note = WUtil.getString(result, GUI.ICliente.sNOTE);
                    _this.tabStorico.setState(prnz);
                    _this.lblNote.setState(note);
                });
            });
            _this.tabClienti.onRowPrepared(function (e) {
                if (!e.data)
                    return;
                if (e.data[GUI.ICliente.sREPUTAZIONE]) {
                    WUX.setCss(e.rowElement, WUX.CSS.ERROR);
                }
            });
            _this.tabClienti.onDoubleClick(function (e) {
                var srd = _this.tabClienti.getSelectedRowsData();
                if (!srd || !srd.length)
                    return;
                _this.dlgCliente.setState(srd[0]);
                _this.dlgCliente.show();
            });
            var pc = [
                ['Descrizione', GUI.IPrestazione.sDESCRIZIONE, 's', false],
                ['Durata', GUI.IPrestazione.sDURATA, 'i', true],
                ['Prezzo', GUI.IPrestazione.sPREZZO_FINALE, 'c', false]
            ];
            _this.tabPrestaz = new WUX.WDXTable(_this.subId('tpr'), WUtil.col(pc, 0), WUtil.col(pc, 1));
            _this.tabPrestaz.editable = true;
            _this.tabPrestaz.types = WUtil.col(pc, 2);
            _this.tabPrestaz.editables = WUtil.col(pc, 3);
            _this.tabPrestaz.css({ h: 328 });
            _this.tabPrestaz.widths = [320];
            _this.tabPrestaz.selectionMode = 'multiple';
            _this.tabPrestaz.filter = true;
            _this.tabPrestaz.onSelectionChanged(function (e) {
                var psrd = _this.tabPrestaz.getSelectedRowsData();
                if (!psrd || !psrd.length) {
                    _this.fpApp.setValue(GUI.IPrenotazione.sPREZZO_FINALE, null);
                    _this.fpApp.setValue(GUI.IPrenotazione.sDURATA, null);
                    return false;
                }
                var tot = 0;
                var dur = 0;
                for (var i = 0; i < psrd.length; i++) {
                    tot += WUtil.getNumber(psrd[i], GUI.IPrestazione.sPREZZO_FINALE);
                    dur += WUtil.getNumber(psrd[i], GUI.IPrestazione.sDURATA);
                }
                _this.fpApp.setValue(GUI.IPrenotazione.sPREZZO_FINALE, WUX.formatCurr(tot));
                _this.fpApp.setValue(GUI.IPrenotazione.sDURATA, dur);
            });
            _this.tabPrestaz.onRowPrepared(function (e) {
                if (!e.data)
                    return;
                if (!_this.prestAbil || !_this.prestAbil.length)
                    return;
                var idPrest = WUtil.getNumber(e.data, GUI.IPrestazione.sID);
                if (_this.prestAbil.indexOf(idPrest) >= 0) {
                    e.rowElement.css('font-weight', 'bold');
                }
            });
            _this.tabPrestaz.onRowUpdated(function (e) {
                setTimeout(function () {
                    var psrd = _this.tabPrestaz.getSelectedRowsData();
                    if (!psrd || !psrd.length)
                        return false;
                    var dur = 0;
                    for (var i = 0; i < psrd.length; i++) {
                        dur += WUtil.getNumber(psrd[i], GUI.IPrestazione.sDURATA);
                    }
                    _this.fpApp.setValue(GUI.IPrenotazione.sDURATA, dur);
                }, 100);
            });
            _this.lblNote = new WUX.WLabel(_this.subId('lbln'), '', '', null, WUX.CSS.LABEL_NOTICE);
            var sc = [
                ['Data App.', GUI.IPrenotazione.sDATA_APP, 'd'],
                ['Ora App.', GUI.IPrenotazione.sORA_APP, 's'],
                ['Durata', GUI.IPrenotazione.sDURATA, 'i'],
                ['Stato', GUI.IPrenotazione.sSTATO, 's'],
                ['Collaboratore', GUI.IPrenotazione.sDESC_COLL, 's'],
                ['Trattamento', GUI.IPrenotazione.sDESC_PREST, 's'],
                ['Cabina', GUI.IPrenotazione.sDESC_ATTR, 's'],
                ['Data Pren.', GUI.IPrenotazione.sDATA_PREN, 'd'],
                ['Note', GUI.IPrenotazione.sNOTE, 's']
            ];
            _this.tabStorico = new WUX.WDXTable(_this.subId('tps'), WUtil.col(sc, 0), WUtil.col(sc, 1));
            _this.tabStorico.types = WUtil.col(sc, 2);
            _this.tabStorico.css({ h: 150, f: 10 });
            _this.tabStorico.onRowPrepared(function (e) {
                if (!e.data)
                    return;
                var stato = WUtil.getString(e.data, GUI.IPrenotazione.sSTATO, 'C');
                var pdata = WUtil.getNumber(e.data, GUI.IPrenotazione.sDATA_APP);
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
                if (pdata == _this.currDate) {
                    e.rowElement.css('font-weight', 'bold');
                }
            });
            _this.selCol = new GUI.CFSelectCollab();
            _this.selCol.on('statechange', function (w) {
                var idColl = WUtil.toNumber(_this.selCol.getState());
                if (!idColl) {
                    _this.prestAbil = [];
                    _this.tabPrestaz.repaint();
                }
                else {
                    if (_this._count == 0)
                        _this.idCollStart = idColl;
                    jrpc.execute('COLLABORATORI.getServices', [idColl], function (result) {
                        if (!result)
                            return;
                        _this.prestAbil = result;
                        _this.tabPrestaz.repaint();
                    });
                }
                if (!_this.selCol.count)
                    return;
                if (!_this._efind)
                    return;
                if (_this._idcol && idColl != _this._idcol)
                    _this.doFind();
            });
            _this.selCab = new GUI.CFSelectCabine();
            _this.selTip = new GUI.CFSelectTipoApp();
            _this.chkOvr = new WUX.WCheck('', 'Ignora controlli');
            _this.chkMat = new WUX.WCheck('', 'fino alle 14:00');
            _this.chkPom = new WUX.WCheck('', 'dalle 14:00');
            _this.btnOrgPr = new WUX.WButton(_this.subId('bro'), 'Organizza', GUI.ICO.TOOL, WUX.BTN.SECONDARY);
            _this.btnOrgPr.on('click', function (e) {
                var psrd = _this.getSelectedPrest(true);
                if (!psrd || !psrd.length)
                    return;
                _this.dlgOrgPres.setState(psrd);
                _this.dlgOrgPres.show(_this);
            });
            _this.btnReset = new WUX.WButton(_this.subId('brs'), GUI.TXT.RESET, GUI.ICO.RESET, WUX.BTN.DANGER);
            _this.btnReset.on('click', function (e) {
                _this.appts = [];
                _this._sdate = false;
                _this._idcol = 0;
                _this._efind = false;
                _this._count = 0;
                _this.fpApp.setValue(GUI.IPrenotazione.sID_COLL, null);
                _this.fpApp.setValue(GUI.IPrenotazione.sID_ATTR, null);
                _this.fpApp.setValue(GUI.IPrenotazione.sDATA_APP, null);
                _this.fpApp.setValue(GUI.IPrenotazione.sORA_APP, null);
                _this.tabPrestaz.clearSelection();
                _this.tabPrestaz.clearFilter();
            });
            _this.btnFirst = new WUX.WButton(_this.subId('bfa'), GUI.TXT.SEARCH, GUI.ICO.SEARCH, WUX.BTN.WARNING);
            _this.btnFirst.on('click', function (e) {
                var psrd = _this.tabPrestaz.getSelectedRowsData();
                if (!psrd || !psrd.length) {
                    WUX.showWarning('Selezionare uno o pi&ugrave; trattamenti.');
                    return;
                }
                _this.doFind();
            });
            var cntBtns = new WUX.WContainer(_this.subId(), null, { a: 'right' });
            cntBtns.add(_this.btnOrgPr).addSpan(5).add(_this.btnReset).addSpan(5).add(_this.btnFirst);
            var isOper = GUI.isBookOper();
            _this.fpApp = new WUX.WFormPanel(_this.subId('fpa'));
            _this.fpApp.addRow();
            _this.fpApp.addComponent(GUI.IPrenotazione.sID_COLL, 'Collaboratore', _this.selCol);
            _this.fpApp.addRow();
            _this.fpApp.addComponent(GUI.IPrenotazione.sID_ATTR, 'Cabina', _this.selCab);
            _this.fpApp.addComponent(GUI.IPrenotazione.sTIPO, 'Tipo', _this.selTip);
            _this.fpApp.addRow();
            _this.fpApp.addDateField(GUI.IPrenotazione.sDATA_APP, 'Data');
            _this.fpApp.addTextField(GUI.IPrenotazione.sORA_APP, 'Ora');
            _this.fpApp.addRow();
            _this.fpApp.addTextField(GUI.IPrenotazione.sDURATA, 'Durata', true);
            _this.fpApp.addTextField(GUI.IPrenotazione.sPREZZO_FINALE, 'Totale &euro;', true);
            _this.fpApp.addRow();
            _this.fpApp.addTextField(GUI.IPrenotazione.sNOTE, 'Note');
            _this.fpApp.addRow();
            if (isOper) {
                _this.fpApp.addBlankField();
            }
            else {
                _this.fpApp.addComponent(GUI.IPrenotazione.sIGNORE_CHECK, 'Forzatura', _this.chkOvr.getWrapper());
            }
            _this.fpApp.addComponent(GUI.IPrenotazione.sMATTINO, 'Mattino', _this.chkMat.getWrapper());
            _this.fpApp.addComponent(GUI.IPrenotazione.sPOMERIGGIO, 'Pomeriggio', _this.chkPom.getWrapper());
            _this.fpApp.addInternalField(GUI.IPrenotazione.sOVERBOOKING);
            _this.lnkPrev = new WUX.WLink(_this.subId('lnkp'), '', GUI.ICO.LEFT);
            _this.lnkPrev.tooltip = 'Data precedente';
            _this.lnkPrev.on('click', function (e) {
                _this._efind = false;
                var dataApp = WUtil.toDate(_this.fpApp.getValue(GUI.IPrenotazione.sDATA_APP));
                if (!dataApp) {
                    WUX.showWarning('Data non selezionata.');
                    return;
                }
                if (!_this._idcol) {
                    WUX.showWarning('Interrogare le disponibilit&agrave;.');
                    return;
                }
                if (!_this.idCollStart)
                    _this.fpApp.setValue(GUI.IPrenotazione.sID_COLL, null);
                _this.doFind(null, dataApp);
            });
            _this.lnkNext = new WUX.WLink(_this.subId('lnkn'), '', GUI.ICO.RIGHT);
            _this.lnkNext.tooltip = 'Data successiva';
            _this.lnkNext.on('click', function (e) {
                _this._efind = false;
                var dataApp = WUtil.toDate(_this.fpApp.getValue(GUI.IPrenotazione.sDATA_APP));
                if (!dataApp) {
                    WUX.showWarning('Data non selezionata.');
                    return;
                }
                if (!_this._idcol) {
                    WUX.showWarning('Interrogare le disponibilit&agrave;.');
                    return;
                }
                if (!_this.idCollStart)
                    _this.fpApp.setValue(GUI.IPrenotazione.sID_COLL, null);
                dataApp.setDate(dataApp.getDate() + 1);
                _this.doFind(dataApp);
            });
            _this.fpApp.setLabelLinks(GUI.IPrenotazione.sDATA_APP, [_this.lnkPrev, _this.lnkNext]);
            _this.fpApp.onChangeDate(function (e) {
                var fid = WUX.lastSub($(e.target));
                if (fid == GUI.IPrenotazione.sDATA_APP) {
                    if (_this._sdate) {
                        _this._sdate = false;
                        return;
                    }
                    if (_this.fpApp.isBlank(GUI.IPrenotazione.sDATA_APP))
                        return;
                    if (!_this._efind)
                        return;
                    _this.doFind();
                }
            });
            _this.fpApp.onFocus(GUI.IPrenotazione.sORA_APP, function (e) {
                var $t = $(e.target);
                $t.autocomplete({
                    source: function (req, res) {
                        if (!_this.appts)
                            return;
                        var r = [];
                        for (var i = 0; i < _this.appts.length; i++) {
                            var l = WUX.formatTime(_this.appts[i]);
                            r.push({ id: _this.appts[i], label: l, value: l });
                        }
                        res(r);
                    },
                    minLength: 0,
                    open: function (e) {
                        $('.ui-autocomplete').css('width', $t.innerWidth() + 'px');
                    },
                    select: function (e, c) {
                        _this.fpApp.setValue(GUI.IPrenotazione.sORA_APP, c.item.value);
                    }
                }).keydown();
            });
            _this.fpApp.setMandatory(GUI.IPrenotazione.sDATA_APP, GUI.IPrenotazione.sORA_APP);
            _this.body
                .addRow()
                .addCol('3')
                .addStack({ pt: 2, pb: 2, a: 'left' }, cntCliente, _this.tabClienti)
                .addCol('5')
                .add(_this.tabPrestaz)
                .addCol('4')
                .add(_this.fpApp)
                .add(cntBtns)
                .addRow()
                .addCol('12')
                .addStack({ pt: 2, pb: 2, a: 'left' }, _this.lblNote, _this.tabStorico);
            return _this;
        }
        DlgNuovoApp.prototype.getSelectedPrest = function (msg) {
            var psrd = this.tabPrestaz.getSelectedRowsData();
            if (!psrd || !psrd.length) {
                if (msg)
                    WUX.showWarning('Selezionare uno o pi&ugrave; trattamenti.');
                return [];
            }
            if (this.prestSort && this.prestSort.length) {
                var r = [];
                for (var i = 0; i < this.prestSort.length; i++) {
                    var p = this.prestSort[i];
                    var ix = WUtil.indexOf(psrd, GUI.IPrestazione.sID, p.id);
                    if (ix >= 0) {
                        r.push(psrd[ix]);
                        psrd.splice(ix, 1);
                    }
                }
                for (var i = 0; i < psrd.length; i++) {
                    r.push(psrd[i]);
                }
                return r;
            }
            return psrd;
        };
        DlgNuovoApp.prototype.setIdFar = function (idf, idc) {
            var _this = this;
            this.selCol.setIdFar(idf, idc);
            this.selCab.setIdFar(idf);
            if (idf) {
                if (this.idFar != idf) {
                    this.idFar = idf;
                    jrpc.execute('PRESTAZIONI.getAll', [this.idFar], function (result) {
                        if (result) {
                            for (var i = 0; i < result.length; i++) {
                                result[i][GUI.IPrestazione.sDURATA + '_'] = result[i][GUI.IPrestazione.sDURATA];
                            }
                            _this.tabPrestaz.setState(result);
                        }
                        else {
                            _this.tabPrestaz.setState([]);
                        }
                    });
                }
            }
            else {
                this.idFar = 0;
                this.tabPrestaz.setState([]);
                WUX.showWarning('Riferimento alla struttura non presente');
            }
        };
        DlgNuovoApp.prototype.doFind = function (fromDate, toDate) {
            var _this = this;
            console.log('doFind fromDate=' + WUX.formatDate(fromDate) + ',toDate=' + WUX.formatDate(toDate));
            console.trace();
            this._efind = false;
            this._count++;
            var psrd = this.getSelectedPrest(false);
            if (!psrd || !psrd.length)
                return this;
            this.appts = [];
            var aprest = [];
            var durate = [];
            for (var i = 0; i < psrd.length; i++) {
                aprest.push(psrd[i][GUI.IPrestazione.sID]);
                durate.push(psrd[i][GUI.IPrestazione.sDURATA]);
            }
            var app = this.fpApp.getValues();
            app[GUI.IPrenotazione.sPREFERENZE] = '';
            if (app[GUI.IPrenotazione.sMATTINO] && !app[GUI.IPrenotazione.sPOMERIGGIO]) {
                app[GUI.IPrenotazione.sPREFERENZE] = 'M';
            }
            else if (!app[GUI.IPrenotazione.sMATTINO] && app[GUI.IPrenotazione.sPOMERIGGIO]) {
                app[GUI.IPrenotazione.sPREFERENZE] = 'P';
            }
            if (fromDate) {
                app[GUI.IPrenotazione.sCAMBIO_DAL] = fromDate;
            }
            else if (toDate) {
                app[GUI.IPrenotazione.sCAMBIO_AL] = toDate;
            }
            else {
                app[GUI.IPrenotazione.sCAMBIO_DATA] = WUtil.toDate(this.fpApp.getValue(GUI.IPrenotazione.sDATA_APP));
            }
            app[GUI.IPrenotazione.sPRESTAZIONI] = aprest;
            app[GUI.IPrenotazione.sDURATE] = durate;
            app[GUI.IPrenotazione.sPREN_ONLINE] = false;
            if (this.idFar)
                app[GUI.IPrenotazione.sID_FAR] = this.idFar;
            console.log('doFind', app);
            jrpc.execute('CALENDARIO.getAvailabilities', [app], function (result) {
                if (!result || !result.length) {
                    _this._idcol = -1;
                    _this.fpApp.setValue(GUI.IPrenotazione.sORA_APP, '');
                    WUX.showWarning('Non vi sono appuntamenti disponibili.');
                    _this._efind = true;
                    return;
                }
                var c = result[0];
                if (c.data) {
                    var msg = 'Primo appuntamento disponibile:<br><strong>' + WUX.formatDate(c.data, true) + '</strong> ';
                    msg += 'alle ore <strong>' + WUX.formatTime(c.oraInizio) + '</strong><br>';
                    msg += 'con <strong>' + c.nomeCollab + '</strong>';
                    if (c.altriCollab)
                        msg += '<br>e con <strong>' + c.altriCollab + '</strong>';
                    WUX.showSuccess(msg);
                    _this._sdate = true;
                    _this.fpApp.setValue(GUI.IPrenotazione.sDATA_APP, c.data);
                    _this.fpApp.setValue(GUI.IPrenotazione.sORA_APP, WUX.formatTime(c.oraInizio));
                    _this._idcol = c.idCollaboratore;
                    _this.fpApp.setValue(GUI.IPrenotazione.sID_COLL, c.idCollaboratore);
                    if (!_this.txtSearch.getState()) {
                        _this.txtSearch.focus();
                    }
                }
                _this.appts = [];
                for (var i = 0; i < result.length; i++) {
                    var o = result[i].oraInizio;
                    if (_this.appts.indexOf(o) < 0)
                        _this.appts.push(o);
                }
                _this.appts.sort(function (a, b) { return a - b; });
                _this._efind = true;
            });
            return this;
        };
        DlgNuovoApp.prototype.onClickOk = function () {
            var _this = this;
            if (this.idPren)
                return true;
            var cs = this.fpApp.checkMandatory(true, true);
            if (cs) {
                WUX.showWarning('Specificare i seguenti campi: ' + cs);
                return false;
            }
            if (!this.idCliente) {
                WUX.showWarning('Selezionare prima un cliente per prenotare un appuntamento');
                return false;
            }
            var psrd = this.getSelectedPrest(true);
            if (!psrd || !psrd.length)
                return false;
            var aprest = [];
            var durate = [];
            for (var i = 0; i < psrd.length; i++) {
                var d = WUtil.getNumber(psrd[i], GUI.IPrestazione.sDURATA);
                var s = WUtil.getString(psrd[i], GUI.IPrestazione.sDESCRIZIONE);
                if (!s) {
                    var n = i + 1;
                    s = 'prestazione num. ' + n;
                }
                if (d < 5) {
                    WUX.showWarning('Durata (' + d + ') non valida per ' + s);
                    return false;
                }
                aprest.push(psrd[i][GUI.IPrestazione.sID]);
                durate.push(psrd[i][GUI.IPrestazione.sDURATA]);
            }
            var app = this.fpApp.getValues();
            app[GUI.IPrenotazione.sID_CLIENTE] = this.idCliente;
            app[GUI.IPrenotazione.sPRESTAZIONI] = aprest;
            app[GUI.IPrenotazione.sDURATE] = durate;
            if (this.idFar)
                app[GUI.IPrenotazione.sID_FAR] = this.idFar;
            var ic = WUtil.getBoolean(app, GUI.IPrenotazione.sIGNORE_CHECK);
            var ob = WUtil.getBoolean(app, GUI.IPrenotazione.sOVERBOOKING);
            if (ic) {
                app[GUI.IPrenotazione.sOVERBOOKING] = true;
                if (!app[GUI.IPrenotazione.sID_ATTR])
                    app[GUI.IPrenotazione.sID_ATTR] = -1;
            }
            else if (ob) {
                if (app[GUI.IPrenotazione.sID_ATTR])
                    app[GUI.IPrenotazione.sID_ATTR] = 0;
            }
            GUI.chkExecute('PRENOTAZIONI.book', [app], function (result) {
                if (!result) {
                    WUX.showWarning('Prenotazione NON eseguita.');
                    return;
                }
                var msg = WUtil.getString(result, GUI.IPrenotazione.sMESSAGGIO);
                if (msg) {
                    WUX.showWarning(msg);
                    return;
                }
                _this.idPren = WUtil.getNumber(result, GUI.IPrenotazione.sID);
                _this.dataPren = WUtil.getDate(result, GUI.IPrenotazione.sDATA_APP);
                _this.btnOK.trigger('click');
                WUX.showSuccess('Prenotazione eseguita con successo.');
            });
            return false;
        };
        DlgNuovoApp.prototype.onClickCancel = function () {
            var _this = this;
            if (this.confCanc)
                return true;
            var psrd = this.getSelectedPrest(false);
            if (!psrd || !psrd.length)
                return true;
            WUX.confirm('Si vuole annullare l\'inserimento di un nuovo appuntamento?', function (res) {
                if (res) {
                    _this.confCanc = true;
                    _this.btnCancel.trigger('click');
                }
            });
            return false;
        };
        DlgNuovoApp.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            this._sdate = false;
            this._idcol = 0;
            this._efind = false;
            this._count = 0;
            this.idCollStart = WUtil.getNumber(nextState, GUI.IPrenotazione.sID_COLL);
            if (this.fpApp) {
                this.fpApp.clear();
                if (this.state[GUI.IPrenotazione.sDATA_APP])
                    this._sdate = true;
                this._idcol = this.idCollStart;
                var idf = WUtil.getNumber(nextState, GUI.IPrenotazione.sID_FAR);
                if (idf)
                    this.setIdFar(idf, this.idCollStart);
                this.fpApp.setState(this.state);
            }
        };
        DlgNuovoApp.prototype.getState = function () {
            if (this.fpApp) {
                this.state = this.fpApp.getState();
            }
            return this.state;
        };
        DlgNuovoApp.prototype.onShown = function () {
            var _this = this;
            this.idCliente = 0;
            this.appts = [];
            this.prestSort = [];
            this.idPren = 0;
            this.dataPren = null;
            this.confCanc = false;
            this._sdate = false;
            this._efind = false;
            this._count = 0;
            var a = this.tabPrestaz.getState();
            if (a) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i][GUI.IPrenotazione.sDURATA + '_'] != null) {
                        a[i][GUI.IPrenotazione.sDURATA] = a[i][GUI.IPrenotazione.sDURATA + '_'];
                    }
                }
            }
            setTimeout(function () {
                _this.txtSearch.setState('');
                _this.tabClienti.setState([]);
                _this.tabPrestaz.clearSelection();
                _this.tabPrestaz.clearFilter();
                _this.tabStorico.setState([]);
                _this.tabClienti.repaint();
                _this.tabPrestaz.repaint();
                _this.tabStorico.repaint();
                _this.lblNote.setState('');
                _this.txtSearch.focus();
            }, 100);
        };
        DlgNuovoApp.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            var w = $(window).width();
            if (w > 1260) {
                this.cntMain.css({ w: 1260, h: 600 });
            }
            else {
                this.cntMain.css({ w: 1000, h: 600 });
            }
        };
        return DlgNuovoApp;
    }(WUX.WDialog));
    GUI.DlgNuovoApp = DlgNuovoApp;
})(GUI || (GUI = {}));
var GUI;
(function (GUI) {
    var WUtil = WUX.WUtil;
    var GUILogOpPren = (function (_super) {
        __extends(GUILogOpPren, _super);
        function GUILogOpPren(id) {
            return _super.call(this, id ? id : '*', 'GUILogOpPren') || this;
        }
        GUILogOpPren.prototype.render = function () {
            var _this = this;
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', function (e) {
                if (_this.fpFilter.isBlank(GUI.IPrenotazione.sID_FAR)) {
                    WUX.showWarning('Selezionare la struttura');
                    return;
                }
                var check = _this.fpFilter.checkMandatory(true, true, true);
                if (check) {
                    WUX.showWarning('Specificare almeno uno dei seguenti campi: ' + check);
                    return;
                }
                var box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    _this.tagsFilter.setState(_this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('PRENOTAZIONI.findLog', [_this.fpFilter.getState()], function (result) {
                    _this.tabResult.setState(result);
                    if (result && result.length) {
                        _this.lblResult.setState(result.length + ' operazioni trovate.');
                    }
                    else {
                        _this.lblResult.setState('Nessuna operazione trovata.');
                    }
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', function (e) {
                _this.tabResult.setState([]);
                _this.fpFilter.clear();
                _this.fpFilter.setValue(GUI.IPrenotazione.sDATA_APP, WUtil.getCurrDate());
                _this.fpFilter.setValue(GUI.IPrenotazione.sALLA_DATA, null);
                _this.tagsFilter.setState({});
                _this.lblResult.setState('');
            });
            this.tagsFilter = new WUX.WTags('tagsFilter');
            this.selFar = new GUI.CFSelectStruture();
            this.selFar.on('statechange', function (e) {
                _this.tabResult.setState([]);
                var idf = WUtil.toNumber(_this.selFar.getState());
                _this.selCol.setIdFar(idf);
                _this.selCab.setIdFar(idf);
            });
            this.selCol = new GUI.CFSelectCollab();
            this.selCab = new GUI.CFSelectCabine();
            this.fpFilter = new WUX.WFormPanel(this.subId('fpf'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent(GUI.IPrenotazione.sID_FAR, 'Struttura', this.selFar);
            this.fpFilter.addDateField(GUI.IPrenotazione.sDATA_APP, 'Data Operazione');
            this.fpFilter.addDateField(GUI.IPrenotazione.sALLA_DATA, 'Al');
            this.fpFilter.addRow();
            this.fpFilter.addComponent(GUI.IPrenotazione.sID_CLIENTE, 'Cliente', new GUI.CFSelectClienti());
            this.fpFilter.addComponent(GUI.IPrenotazione.sID_COLL, 'Collaboratore', this.selCol);
            this.fpFilter.addTextField(GUI.IPrenotazione.sDESC_PREST, 'Trattamento');
            this.fpFilter.addRow();
            this.fpFilter.addComponent(GUI.IPrenotazione.sID_ATTR, 'Cabina', this.selCab);
            this.fpFilter.addComponent(GUI.IPrenotazione.sSTATO, 'Stato', new GUI.CFSelectStatiPren());
            this.fpFilter.addTextField(GUI.IPrenotazione.sUSERDESK, 'Operaz. (1a lettera) / Utente Desk');
            this.fpFilter.setMandatory(GUI.IPrenotazione.sID_FAR, GUI.IPrenotazione.sDATA_APP, GUI.IPrenotazione.sID_CLIENTE);
            this.fpFilter.setValue(GUI.IPrenotazione.sDATA_APP, WUtil.getCurrDate());
            this.lblResult = new WUX.WLabel(this.subId('lblr'), '', null, null, WUX.CSS.LABEL_INFO);
            var rc = [
                ['Data Op.', GUI.IPrenotazione.sDATA_PREN, 't'],
                ['Utente', GUI.IPrenotazione.sUSERDESK, 's'],
                ['Operazione', GUI.IPrenotazione.sMESSAGGIO, 's'],
                ['Id Pren.', GUI.IPrenotazione.sID, 'n'],
                ['Data App.', GUI.IPrenotazione.sDATA_APP, 'd'],
                ['Ora App.', GUI.IPrenotazione.sORA_APP, 's'],
                ['Durata', GUI.IPrenotazione.sDURATA, 'i'],
                ['Stato', GUI.IPrenotazione.sSTATO, 's'],
                ['Cliente', GUI.IPrenotazione.sDESC_CLIENTE, 's'],
                ['Telefono', GUI.IPrenotazione.sTELEFONO1, 's'],
                ['Collaboratore', GUI.IPrenotazione.sDESC_COLL, 's'],
                ['Trattamento', GUI.IPrenotazione.sDESC_PREST, 's'],
                ['Cabina', GUI.IPrenotazione.sDESC_ATTR, 's'],
                ['Struttura', GUI.IPrenotazione.sCOD_FAR, 's'],
                ['Forzatura', GUI.IPrenotazione.sOVERBOOKING, 'b'],
                ['On Line', GUI.IPrenotazione.sPREN_ONLINE, 'b'],
                ['Note', GUI.IPrenotazione.sNOTE, 's']
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tab'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.types = WUtil.col(rc, 2);
            this.tabResult.exportFile = 'prenotazioni';
            this.tabResult.filter = true;
            this.tabResult.css({ h: 600, f: 10 });
            this.tabResult.onRowPrepared(function (e) {
                if (!e.data)
                    return;
                var stato = WUtil.getString(e.data, GUI.IPrenotazione.sSTATO, 'C');
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
            this.cntActions = new GUI.CFTableActions('ta');
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
                .end()
                .addBox()
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, this.cntActions, this.tabResult)
                .end()
                .addRow()
                .addCol('12')
                .add(this.lblResult);
            return this.container;
        };
        GUILogOpPren.prototype.collapseHandler = function (e) {
            var c = WUtil.getBoolean(e.data, 'collapsed');
            if (c) {
                this.tagsFilter.setState({});
            }
            else {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
            }
        };
        GUILogOpPren.prototype.componentDidMount = function () {
            var _this = this;
            var idf = 0;
            if (GUI.strutture && GUI.strutture.length) {
                idf = GUI.strutture[0].id;
            }
            var dataApp = WUtil.toDate(WUtil.getParam('d'));
            if (!dataApp) {
                if (idf)
                    this.selFar.setState(idf);
                return;
            }
            var pidf = WUtil.toNumber(WUtil.getParam('f'));
            if (pidf) {
                this.selFar.setState(pidf);
                idf = pidf;
            }
            else {
                if (idf)
                    this.selFar.setState(idf);
            }
            if (idf) {
                this.selCol.setIdFar(idf);
                this.selCab.setIdFar(idf);
            }
            this.fpFilter.setValue(GUI.IPrenotazione.sDATA_APP, dataApp);
            setTimeout(function () {
                _this.btnFind.trigger('click');
            }, 200);
        };
        return GUILogOpPren;
    }(WUX.WComponent));
    GUI.GUILogOpPren = GUILogOpPren;
})(GUI || (GUI = {}));
var GUI;
(function (GUI) {
    var WUtil = WUX.WUtil;
    var CFPlanning = (function (_super) {
        __extends(CFPlanning, _super);
        function CFPlanning(id, classStyle, style, attributes) {
            var _this = _super.call(this, id ? id : '*', 'CFPlanning', null, classStyle, style, attributes) || this;
            _this.COLOR_NA = '#dcdcdc';
            _this.COLOR_AV = '#f5f5f5';
            _this.COLOR_BK = '#bbffbb';
            _this.COLOR_EX = '#ddedf6';
            _this.COLOR_NE = '#fecccc';
            _this.COLOR_SU = '#fefecc';
            _this.COLOR_BK_OL = '#aaeeaa';
            _this.COLOR_EX_OL = '#ccdcf6';
            _this.COLOR_NE_OL = '#edbbbb';
            _this.COLOR_SU_OL = '#ededbb';
            _this.COLOR_AP = '#6d7295';
            _this.COLOR_HH = '#707070';
            _this.COLOR_MM = '#808080';
            _this.COLOR_MK = '#ff0000';
            _this.forceOnChange = true;
            _this._sync = false;
            _this._syncbk = false;
            _this._lstolb = [];
            _this.resources = [];
            _this.dateCal = new Date();
            _this.appts = {};
            _this.slots = {};
            _this.alist = [];
            _this.idCliente = 0;
            _this.autoScroll = true;
            _this.dlgPren = new GUI.DlgPrenotazione(_this.subId('dlgp'));
            _this.dlgPren.onHiddenModal(function (e) {
                _this._sync = _this._syncbk;
                if (!_this.dlgPren.ok) {
                    if (_this.dlgPren.refPlan) {
                        var filter = {};
                        filter[GUI.ICalendario.sDATA] = _this.dateCal;
                        filter[GUI.ICalendario.sID_FAR] = _this.dlgPren.idFar;
                        jrpc.execute('CALENDARIO.getPlanning', [filter], function (result) {
                            _this.autoScroll = !_this.dlgPren.idCliente;
                            _this.setState(result);
                            var r = _this.mark(_this.dlgPren.idCliente);
                            if (!r || !r.length) {
                                _this.scroll(_this.dlgPren.oraPren);
                            }
                        });
                    }
                    return;
                }
                if (_this.dlgPren.dataPren && !WUtil.isSameDate(_this.dlgPren.dataPren, _this.dateCal)) {
                    if (_this.navCal) {
                        _this.idCliente = _this.dlgPren.idCliente;
                        _this.navCal.setState(_this.dlgPren.dataPren);
                    }
                }
                else {
                    var filter = {};
                    filter[GUI.ICalendario.sDATA] = _this.dateCal;
                    filter[GUI.ICalendario.sID_FAR] = _this.dlgPren.idFar;
                    jrpc.execute('CALENDARIO.getPlanning', [filter], function (result) {
                        _this.autoScroll = !_this.dlgPren.idCliente;
                        _this.setState(result);
                        var r = _this.mark(_this.dlgPren.idCliente);
                        if (!r || !r.length) {
                            _this.scroll(_this.dlgPren.oraPren);
                        }
                    });
                }
            });
            _this.dlgNApp = new GUI.DlgNuovoApp(_this.subId('dlgn'));
            _this.dlgNApp.onHiddenModal(function (e) {
                _this._sync = _this._syncbk;
                if (!_this.dlgNApp.ok)
                    return;
                if (_this.dlgNApp.dataPren && !WUtil.isSameDate(_this.dlgNApp.dataPren, _this.dateCal)) {
                    if (_this.navCal) {
                        _this.idCliente = _this.dlgNApp.idCliente;
                        _this.navCal.setState(_this.dlgNApp.dataPren);
                    }
                }
                else {
                    var filter = {};
                    filter[GUI.ICalendario.sDATA] = _this.dateCal;
                    filter[GUI.ICalendario.sID_FAR] = _this.dlgNApp.idFar;
                    jrpc.execute('CALENDARIO.getPlanning', [filter], function (result) {
                        _this.autoScroll = !_this.dlgNApp.idCliente;
                        _this.setState(result);
                        var r = _this.mark(_this.dlgNApp.idCliente);
                        if (!r || !r.length) {
                            _this.scrollFirst();
                        }
                    });
                }
            });
            setInterval(function () {
                console.log(WUX.formatDateTime(new Date(), true) + ' _sync=' + _this._sync);
                if (!_this._sync)
                    return;
                var filter = {};
                filter[GUI.ICalendario.sDATA] = _this.dateCal;
                filter[GUI.ICalendario.sID_FAR] = _this.idFar;
                jrpc.execute('CALENDARIO.getOnLineBookings', [filter], function (result) {
                    console.log('CALENDARIO.getOnLineBookings -> ' + JSON.stringify(result));
                    var so = WUtil.size(_this._lstolb);
                    var sn = WUtil.size(result);
                    _this._lstolb = result;
                    var df = false;
                    if (sn != so) {
                        df = true;
                    }
                    else if (so && sn) {
                        for (var i = so - 1; i >= 0; i--) {
                            if (_this._lstolb[i] != result[i]) {
                                df = true;
                                break;
                            }
                        }
                    }
                    if (df) {
                        if (sn) {
                            WUX.showSuccess(sn + ' appuntamenti on line');
                        }
                        if (!_this._sync) {
                            console.log('CALENDARIO.getPlanning not invoked _sync=' + _this._sync);
                            return;
                        }
                        console.log('CALENDARIO.getPlanning...');
                        jrpc.execute('CALENDARIO.getPlanning', [filter], function (resgetp) {
                            if (!_this._sync)
                                return;
                            _this.setState(resgetp);
                        }, function (e) {
                            console.error('CALENDARIO.getPlanning: ' + e.message);
                        });
                    }
                }, function (e) {
                    console.error('CALENDARIO.getOnLineBookings: ' + e.message);
                });
            }, 30000);
            return _this;
        }
        CFPlanning.prototype.stopSync = function () {
            this._sync = false;
            this._syncbk = false;
            return this;
        };
        CFPlanning.prototype.startSync = function () {
            this._sync = true;
            this._syncbk = true;
            return this;
        };
        CFPlanning.prototype.suspendSync = function () {
            this._sync = false;
            return this;
        };
        CFPlanning.prototype.resumeSync = function (force) {
            this._sync = this._syncbk;
            return this;
        };
        CFPlanning.prototype.showPren = function (id) {
            var _this = this;
            if (!id)
                return;
            this._sync = false;
            jrpc.execute('PRENOTAZIONI.read', [id], function (result) {
                if (!result) {
                    WUX.showWarning('Prenotazione ' + id + ' non disponibile.');
                    _this._sync = _this._syncbk;
                    return;
                }
                var dataApp = WUtil.getDate(result, GUI.IPrenotazione.sDATA_APP);
                if (dataApp) {
                    result[GUI.IPrenotazione.sDATA_APP] = WUX.formatDate(dataApp, true);
                }
                var dataPre = WUtil.getDate(result, GUI.IPrenotazione.sDATA_PREN);
                if (dataPre) {
                    result[GUI.IPrenotazione.sDATA_PREN] = WUX.formatDateTime(dataPre, false, true);
                }
                _this.dlgPren.setState(result);
                _this.dlgPren.show();
            });
        };
        CFPlanning.prototype.onClick = function (hhmm, resIdx) {
            var _this = this;
            if (resIdx < 0)
                return;
            if (hhmm < 0 || hhmm > 2359)
                return;
            if (!this.resources || !this.resources.length)
                return;
            if (this.resources.length <= resIdx) {
                WUX.showWarning('Risorsa non disponbile.');
                return;
            }
            var fhhmm = WUX.formatTime(hhmm);
            var r = this.resources[resIdx];
            if (!r || !r.id) {
                WUX.showWarning('Risorsa non identificabile.');
                return;
            }
            this._sync = false;
            if (this.slots) {
                var s = this.slots[r.id + '_' + hhmm];
                if (!s) {
                    WUX.confirm('Stai prenotando in un orario fuori lavorativo. Procedere?', function (res) {
                        if (!res)
                            return;
                        var app = {};
                        app[GUI.IPrenotazione.sID_FAR] = _this.idFar;
                        app[GUI.IPrenotazione.sDATA_APP] = _this.dateCal;
                        app[GUI.IPrenotazione.sORA_APP] = fhhmm;
                        app[GUI.IPrenotazione.sID_COLL] = r.id;
                        app[GUI.IPrenotazione.sOVERBOOKING] = true;
                        _this.dlgNApp.setState(app);
                        _this.dlgNApp.show();
                    });
                }
                else if (s == 1) {
                    var app = {};
                    app[GUI.IPrenotazione.sID_FAR] = this.idFar;
                    app[GUI.IPrenotazione.sDATA_APP] = this.dateCal;
                    app[GUI.IPrenotazione.sORA_APP] = fhhmm;
                    app[GUI.IPrenotazione.sID_COLL] = r.id;
                    app[GUI.IPrenotazione.sOVERBOOKING] = false;
                    this.dlgNApp.setState(app);
                    this.dlgNApp.show();
                }
                else if (s > 1 || s < 0) {
                    if (!this.appts) {
                        WUX.showWarning('Informazioni prenotazione non disponibili');
                        return;
                    }
                    var pren = void 0;
                    var c = hhmm;
                    while (true) {
                        pren = this.appts[r.id + '_' + c];
                        if (pren)
                            break;
                        var hh = Math.floor(c / 100);
                        var mm = c % 100;
                        if (mm > 0) {
                            mm = mm - 10;
                        }
                        else {
                            hh = hh - 1;
                            mm = 50;
                        }
                        if (hh < 0)
                            break;
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
            WUX.confirm('Stai prenotando in un orario fuori lavorativo. Procedere?', function (res) {
                if (!res)
                    return;
                var app = {};
                app[GUI.IPrenotazione.sID_FAR] = _this.idFar;
                app[GUI.IPrenotazione.sDATA_APP] = _this.dateCal;
                app[GUI.IPrenotazione.sORA_APP] = fhhmm;
                app[GUI.IPrenotazione.sID_COLL] = r.id;
                app[GUI.IPrenotazione.sOVERBOOKING] = true;
                _this.dlgNApp.setState(app);
                _this.dlgNApp.show();
            });
        };
        CFPlanning.prototype.newApp = function () {
            this._sync = false;
            var app = {};
            app[GUI.IPrenotazione.sID_FAR] = this.idFar;
            app[GUI.IPrenotazione.sDATA_APP] = new Date();
            this.dlgNApp.setState(app);
            this.dlgNApp.show();
            return this;
        };
        CFPlanning.prototype.updateState = function (nextState) {
            var _a;
            _super.prototype.updateState.call(this, nextState);
            this.idFar = WUtil.getNumber(this.state, GUI.ICalendario.sID_FAR);
            this.dateCal = WUtil.getDate(this.state, GUI.ICalendario.sDATA);
            GUI.CFBookCfg.CHECK_USER_DESK = WUtil.getBoolean(this.state, GUI.ICalendario.sCHECK_USER_DESK);
            if (!this.mounted)
                return;
            if (this.state) {
                this.resources = WUtil.getArray(this.state, GUI.ICalendario.sRISORSE);
                this.appts = WUtil.getObject(this.state, GUI.ICalendario.sAPPUNTAMENTI);
                this.slots = WUtil.getObject(this.state, GUI.ICalendario.sSLOTS);
                if (!this.resources)
                    this.resources = [];
                if (!this.appts)
                    this.appts = {};
                if (!this.slots)
                    this.slots = {};
                this.alist = [];
                for (var k in this.appts) {
                    if (this.appts.hasOwnProperty(k)) {
                        var a = WUtil.getArray(this.appts, k);
                        (_a = this.alist).push.apply(_a, a);
                    }
                }
            }
            else {
                this.resources = [];
                this.appts = {};
                this.slots = {};
                this.alist = [];
            }
        };
        CFPlanning.prototype.componentDidMount = function () {
            var _this = this;
            this._lstolb = [];
            if (!this.resources || !this.resources.length)
                return;
            var $dh = $('<div style="overflow-y:scroll;"></div>');
            this.root.append($dh);
            var wh = $(window).height();
            var ph = wh - 150;
            if (ph < 400)
                ph = 400;
            var fh = 12;
            var fs = 14;
            var lh = fs - 1;
            var alnk = [];
            var th = '<table style="table-layout:fixed;width:100%;border-collapse:collapse;">';
            th += '<thead><tr>';
            for (var i = 0; i < this.resources.length; i++) {
                var r = this.resources[i];
                var ilnk = this.subId(r.id);
                alnk.push(ilnk);
                if (!r.color)
                    r.color = 'ffffff';
                th += '<td style="border:1px solid #b5b5b5;"><div style="width:100%;text-align:center;height:30px;overflow-x:hidden;font-size:' + fh + 'px;font-weight:bold;"><a href="#" id="' + ilnk + '">' + r.text + '</a></div><div style="width:100%;height:10px;background-color:#' + r.color + '"></div></td>';
            }
            th += '</tr></thead>';
            th += '</table>';
            $dh.append(th);
            var idb = this.subId('db');
            this.$body = $('<div id="' + idb + '" style="height:' + ph + 'px;overflow-x:hidden;overflow-y:scroll;"></div>');
            this.root.append(this.$body);
            var itb = this.subId('tb');
            var tb = '<table id="' + itb + '" style="table-layout:fixed;width:100%;border-collapse:collapse;cursor:pointer;">';
            tb += '<tbody>';
            for (var h = 0; h < 24; h++) {
                var hh = h < 9 ? '0' + h : '' + h;
                for (var m = 0; m < 60; m += 10) {
                    var mm = m < 10 ? '0' + m : '' + m;
                    var hm = h * 100 + m;
                    tb += '<tr>';
                    for (var i = 0; i < this.resources.length; i++) {
                        var r = this.resources[i];
                        var c = this.COLOR_NA;
                        var s = this.slots[r.id + '_' + hm];
                        if (!s)
                            s = 0;
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
                        var pren = this.appts[r.id + '_' + hm];
                        if (pren) {
                            if (pren.id && s < 0) {
                                this._lstolb.push(pren.id);
                            }
                            var dc = pren.descCliente;
                            if (dc && dc.length > 5)
                                dc = dc.substring(0, 5);
                            var dp = pren.descPrest;
                            if (dp && dp.length > 5)
                                dp = dp.substring(0, 5);
                            if (!dc)
                                dc = '&nbsp;';
                            if (!dp)
                                dp = '&nbsp;';
                            var da = '<br>' + dc + '<br>' + dp;
                            var ds = '';
                            if (pren.tipo == 'F') {
                                ds = 'background-image:url(/bookme/img/heart.png);background-repeat:no-repeat;';
                            }
                            else if (pren.tipo == 'O') {
                                ds = 'background-image:url(/bookme/img/star.png);background-repeat:no-repeat;';
                            }
                            tb += '<td style="border:1px solid #b5b5b5;"><div style="line-height:' + lh + 'px;font-size:' + fs + 'px;width:100%;text-align:center;overflow:hidden;background-color:' + c + ';color:' + this.COLOR_AP + ';font-weight:bold;' + ds + '"><span id="a' + pren.id + '">' + hh + ':' + mm + da + '</span></div></td>';
                        }
                        else if (mm == '00') {
                            var tm = s < 2 ? hh + ':' + mm : '';
                            var da = '<br>&nbsp;<br>&nbsp;';
                            tb += '<td style="border:1px solid #b5b5b5;"><div style="line-height:' + lh + 'px;font-size:' + fs + 'px;width:100%;text-align:center;overflow:hidden;background-color:' + c + ';color:' + this.COLOR_HH + ';font-weight:bold;">' + tm + da + '</div></td>';
                        }
                        else {
                            var tm = s < 2 ? hh + ':' + mm : '';
                            var da = '<br>&nbsp;<br>&nbsp;';
                            tb += '<td style="border:1px solid #b5b5b5;"><div style="line-height:' + lh + 'px;font-size:' + fs + 'px;width:100%;text-align:center;overflow:hidden;background-color:' + c + ';color:' + this.COLOR_MM + ';">' + tm + da + '</div></td>';
                        }
                    }
                    tb += '</tr>';
                }
            }
            tb += '</tbody>';
            tb += '</table>';
            this.$body.append(tb);
            var isOper = GUI.isBookOper();
            if (!isOper) {
                for (var i = 0; i < alnk.length; i++) {
                    var $l = $('#' + alnk[i]);
                    if (!$l.length)
                        continue;
                    $l.on('click', function (e) {
                        if (GUI.isDevMode()) {
                            WUX.openURL('index.html?c=GUICollaboratori&id=' + WUX.lastSub(e.target) + '&idFar=' + _this.idFar, true, true);
                        }
                        else {
                            WUX.openURL('collaboratori?id=' + WUX.lastSub(e.target) + '&idFar=' + _this.idFar, true, true);
                        }
                    });
                }
            }
            var $tb = $('#' + itb);
            if ($tb.length) {
                var _self_1 = this;
                this.root.on('click', 'tbody tr td', function (e) {
                    var $this = $(this);
                    var r = $this.parent().index();
                    var c = $this.index();
                    var hh = Math.floor((r * 10) / 60);
                    var mm = (r * 10) % 60;
                    var hhmm = hh * 100 + mm;
                    _self_1.onClick(hhmm, c);
                });
            }
            if (this.autoScroll) {
                if (this.idCliente) {
                    var r = this.mark(this.idCliente);
                    if (!r || !r.length) {
                        this.scrollFirst();
                    }
                    this.idCliente = 0;
                }
                else {
                    setTimeout(function () {
                        var sh = _this.$body[0].scrollHeight;
                        var st = Math.floor((sh * 8) / 24);
                        _this.$body.animate({
                            scrollTop: st
                        }, 'fast');
                    }, 200);
                }
            }
        };
        CFPlanning.prototype.mark = function (a) {
            console.log('CFPlanning.mark(' + a + ')');
            if (!this.alist || !this.alist.length)
                return [];
            if (!a)
                return [];
            var r = [];
            var h = -1;
            if (typeof a == 'string') {
                for (var i = 0; i < this.alist.length; i++) {
                    var p = this.alist[i];
                    if (a == '!' && p.idAttr == 0) {
                        r.push(p);
                        var o = WUtil.toIntTime(p.oraApp);
                        if (h < 0 || h > o)
                            h = o;
                    }
                    else if (p.descCliente.toLowerCase().indexOf(a.toLowerCase().trim()) >= 0) {
                        r.push(p);
                        var o = WUtil.toIntTime(p.oraApp);
                        if (h < 0 || h > o)
                            h = o;
                    }
                    var $a = $('#a' + p.id);
                    if ($a.length)
                        $a.css('color', this.COLOR_AP);
                }
            }
            else {
                for (var i = 0; i < this.alist.length; i++) {
                    var p = this.alist[i];
                    if (p.idCliente == a) {
                        r.push(p);
                        var o = WUtil.toIntTime(p.oraApp);
                        if (h < 0 || h > o)
                            h = o;
                    }
                    var $a = $('#a' + p.id);
                    if ($a.length)
                        $a.css('color', this.COLOR_AP);
                }
            }
            for (var i = 0; i < r.length; i++) {
                var $a = $('#a' + r[i].id);
                if ($a.length)
                    $a.css('color', this.COLOR_MK);
            }
            if (h >= 0)
                this.scroll(h);
            return r;
        };
        CFPlanning.prototype.scrollFirst = function () {
            return this.scroll(800);
        };
        CFPlanning.prototype.scroll = function (hhmm) {
            console.log('CFPlanning.scroll(' + hhmm + ')');
            if (!this.$body)
                return;
            var hh = 0;
            var mm = 0;
            if (typeof hhmm == 'string') {
                var sep = hhmm.indexOf(':');
                if (sep) {
                    hh = WUtil.toNumber(hhmm.substring(0, sep));
                    mm = WUtil.toNumber(hhmm.substring(sep + 1));
                }
                else {
                    var time = WUtil.toNumber(hhmm);
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
            var sh = this.$body[0].scrollHeight;
            var st = Math.floor((sh * hh) / 24 + (sh * mm) / 1440);
            this.$body.animate({ scrollTop: st }, 'fast');
            console.log('CFPlanning.scroll(' + hhmm + ') -> ' + st);
            return st;
        };
        return CFPlanning;
    }(WUX.WComponent));
    GUI.CFPlanning = CFPlanning;
    var CFNavCalendar = (function (_super) {
        __extends(CFNavCalendar, _super);
        function CFNavCalendar(id) {
            var _this = _super.call(this, id ? id : '*', 'CFNavCalendar') || this;
            _this.state = new Date();
            _this.dlgDate = new GUI.DlgDataCal(_this.subId('ddc'));
            _this.dlgDate.onHiddenModal(function (e) {
                if (_this.dlgDate.cancel)
                    return;
                var date = _this.dlgDate.getState();
                if (!date)
                    return;
                _this.setState(date);
                setTimeout(function () {
                    $.get("/wrapp/api/nop");
                }, 0);
            });
            _this.dlgAttr = new GUI.DlgAttrRis(_this.subId('dda'));
            return _this;
        }
        CFNavCalendar.prototype.onClickPrev = function (h) {
            if (!this.handlers['_clickprev'])
                this.handlers['_clickprev'] = [];
            this.handlers['_clickprev'].push(h);
        };
        CFNavCalendar.prototype.onClickNext = function (h) {
            if (!this.handlers['_clicknext'])
                this.handlers['_clicknext'] = [];
            this.handlers['_clicknext'].push(h);
        };
        CFNavCalendar.prototype.prev = function () {
            if (this.lnkPrev)
                this.lnkPrev.trigger('click');
        };
        CFNavCalendar.prototype.next = function () {
            if (this.lnkNext)
                this.lnkNext.trigger('click');
        };
        CFNavCalendar.prototype.render = function () {
            var _this = this;
            this.lnkDate = new WUX.WLink(this.subId('lt'));
            this.lnkDate.css({ f: 16, fw: '600' });
            this.lnkDate.setState(this.formatDate(this.state));
            this.lnkDate.on('click', function (e) {
                _this.dlgDate.setState(_this.state);
                _this.dlgDate.show();
            });
            this.lnkPrev = new WUX.WLink(this.subId('lp'), '', WUX.WIcon.LARGE + WUX.WIcon.ANGLE_LEFT);
            this.lnkPrev.css({ f: 18, fw: '600', pr: 16 });
            this.lnkPrev.tooltip = 'F7';
            this.lnkPrev.on('click', function (e) {
                if (!_this.state)
                    _this.state = new Date();
                _this.state.setDate(_this.state.getDate() - 1);
                _this.lnkDate.setState(_this.formatDate(_this.state, true));
                if (!_this.handlers['_clickprev'])
                    return;
                for (var _i = 0, _a = _this.handlers['_clickprev']; _i < _a.length; _i++) {
                    var h = _a[_i];
                    h(e);
                }
            });
            this.lnkNext = new WUX.WLink(this.subId('ln'), '', WUX.WIcon.LARGE + WUX.WIcon.ANGLE_RIGHT);
            this.lnkNext.css({ f: 18, fw: '600', pl: 16 });
            this.lnkNext.tooltip = 'F8';
            this.lnkNext.on('click', function (e) {
                if (!_this.state)
                    _this.state = new Date();
                _this.state.setDate(_this.state.getDate() + 1);
                _this.lnkDate.setState(_this.formatDate(_this.state, true));
                if (!_this.handlers['_clicknext'])
                    return;
                for (var _i = 0, _a = _this.handlers['_clicknext']; _i < _a.length; _i++) {
                    var h = _a[_i];
                    h(e);
                }
            });
            this.lnkAttr = new WUX.WLink(this.subId('la'), 'Cabine riservate', GUI.ICO.WORK);
            this.lnkAttr.tooltip = 'Cabine riservate';
            this.lnkAttr.on('click', function (e) {
                if (!_this.state) {
                    WUX.showWarning('Data non selezionata');
                    return;
                }
                var idf = WUtil.toNumber(_this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Struttura non selezionata');
                    return;
                }
                jrpc.execute('ATTREZZATURE.getRiservate', [idf, _this.state], function (result) {
                    if (!result || !result.length) {
                        WUX.showWarning('Non vi sono cabine riservate');
                    }
                    _this.dlgAttr.setProps(_this.state);
                    _this.dlgAttr.setState(result);
                    _this.dlgAttr.show();
                });
            });
            this.chkSel = new WUX.WCheck(this.subId('sc'), '');
            this.chkSel.on('statechange', function (e) {
                if (_this.chkSel.checked && !_this.selFar.enabled) {
                    WUX.confirm('Si vuole abilitare la selezione della struttura?', function (res) {
                        if (!res) {
                            setTimeout(function () {
                                _this.chkSel.checked = false;
                            }, 100);
                            return;
                        }
                        _this.selFar.enabled = true;
                    });
                }
                else {
                    _this.selFar.enabled = false;
                }
            });
            this.selFar = new GUI.CFSelectStruture();
            this.selFar.enabled = false;
            this.selFar.on('statechange', function (e) {
                var sidf = WUtil.toString(_this.selFar.getState());
                if (sidf) {
                    var l = sidf.charAt(sidf.length - 1);
                    switch (l) {
                        case '1':
                            WUX.setCss($('#' + _this.c0), WUX.CSS.SUCCESS);
                            WUX.setCss($('#' + _this.c1), WUX.CSS.SUCCESS);
                            WUX.setCss($('#' + _this.c2), WUX.CSS.SUCCESS);
                            break;
                        case '3':
                            WUX.setCss($('#' + _this.c0), WUX.CSS.INFO);
                            WUX.setCss($('#' + _this.c1), WUX.CSS.INFO);
                            WUX.setCss($('#' + _this.c2), WUX.CSS.INFO);
                            break;
                        case '5':
                            WUX.setCss($('#' + _this.c0), WUX.CSS.WARNING);
                            WUX.setCss($('#' + _this.c1), WUX.CSS.WARNING);
                            WUX.setCss($('#' + _this.c2), WUX.CSS.WARNING);
                            break;
                        case '9':
                            WUX.setCss($('#' + _this.c0), WUX.CSS.ERROR);
                            WUX.setCss($('#' + _this.c1), WUX.CSS.ERROR);
                            WUX.setCss($('#' + _this.c2), WUX.CSS.ERROR);
                            break;
                        default:
                            WUX.setCss($('#' + _this.c0), { bg: 'white' });
                            WUX.setCss($('#' + _this.c1), { bg: 'white' });
                            WUX.setCss($('#' + _this.c2), { bg: 'white' });
                            break;
                    }
                }
                _this.trigger('propschange', WUtil.toNumber(_this.selFar.getState()));
            });
            var cntFar = new WUX.WContainer(this.subId('cnf'));
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
        };
        CFNavCalendar.prototype.getProps = function () {
            if (this.selFar)
                this.props = WUtil.toNumber(this.selFar.getState());
            return this.props;
        };
        CFNavCalendar.prototype.updateState = function (nextState) {
            _super.prototype.updateState.call(this, nextState);
            if (!this.mounted)
                return;
            this.updateView();
        };
        CFNavCalendar.prototype.updateProps = function (nextProps) {
            _super.prototype.updateProps.call(this, nextProps);
            if (this.selFar)
                this.selFar.setState(this.props);
        };
        CFNavCalendar.prototype.updateView = function () {
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
        };
        CFNavCalendar.prototype.isToday = function () {
            return WUtil.isSameDate(this.state, new Date());
        };
        CFNavCalendar.prototype.formatDate = function (d, h) {
            if (h === void 0) { h = true; }
            if (!d)
                return '';
            var t = new Date();
            var pf = '';
            if (h) {
                var a = WUX.WUtil.getCurrDate(-2);
                var y = WUX.WUtil.getCurrDate(-1);
                var w = WUX.WUtil.getCurrDate(1);
                var z = WUX.WUtil.getCurrDate(2);
                var id = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
                var it = t.getFullYear() * 10000 + (t.getMonth() + 1) * 100 + t.getDate();
                var iy = y.getFullYear() * 10000 + (y.getMonth() + 1) * 100 + y.getDate();
                var ia = a.getFullYear() * 10000 + (a.getMonth() + 1) * 100 + a.getDate();
                var iw = w.getFullYear() * 10000 + (w.getMonth() + 1) * 100 + w.getDate();
                var iz = z.getFullYear() * 10000 + (z.getMonth() + 1) * 100 + z.getDate();
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
        };
        CFNavCalendar.prototype.componentDidMount = function () {
            var idf = 0;
            if (GUI.strutture && GUI.strutture.length) {
                idf = GUI.strutture[0].id;
            }
            if (idf)
                this.selFar.setState(idf);
        };
        return CFNavCalendar;
    }(WUX.WComponent));
    GUI.CFNavCalendar = CFNavCalendar;
})(GUI || (GUI = {}));
var GUI;
(function (GUI) {
    var WUtil = WUX.WUtil;
    var GUIPrenotazioni = (function (_super) {
        __extends(GUIPrenotazioni, _super);
        function GUIPrenotazioni(id) {
            var _this = _super.call(this, id ? id : '*', 'GUIPrenotazioni') || this;
            _this.dlgPren = new GUI.DlgPrenotazione(_this.subId('dlgp'));
            return _this;
        }
        GUIPrenotazioni.prototype.render = function () {
            var _this = this;
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', function (e) {
                if (_this.fpFilter.isBlank(GUI.IPrenotazione.sID_FAR)) {
                    WUX.showWarning('Selezionare la struttura');
                    return;
                }
                var check = _this.fpFilter.checkMandatory(true, true, true);
                if (check) {
                    WUX.showWarning('Specificare almeno uno dei seguenti campi: ' + check);
                    return;
                }
                var box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    _this.tagsFilter.setState(_this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('PRENOTAZIONI.find', [_this.fpFilter.getState()], function (result) {
                    _this.tabResult.setState(result);
                    if (result && result.length) {
                        _this.lblResult.setState(result.length + ' prenotazioni trovate.');
                    }
                    else {
                        _this.lblResult.setState('Nessuna prenotazione trovata.');
                    }
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', function (e) {
                _this.tabResult.setState([]);
                _this.fpFilter.clear();
                _this.fpFilter.setValue(GUI.IPrenotazione.sDATA_APP, WUtil.getCurrDate());
                _this.fpFilter.setValue(GUI.IPrenotazione.sALLA_DATA, null);
                _this.tagsFilter.setState({});
                _this.lblResult.setState('');
            });
            this.tagsFilter = new WUX.WTags('tagsFilter');
            this.selFar = new GUI.CFSelectStruture();
            this.selFar.on('statechange', function (e) {
                _this.tabResult.setState([]);
                var idf = WUtil.toNumber(_this.selFar.getState());
                _this.selCol.setIdFar(idf);
                _this.selCab.setIdFar(idf);
            });
            this.selCol = new GUI.CFSelectCollab();
            this.selCol.onlyVis = false;
            this.selCab = new GUI.CFSelectCabine();
            this.fpFilter = new WUX.WFormPanel(this.subId('fpf'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent(GUI.IPrenotazione.sID_FAR, 'Struttura', this.selFar);
            this.fpFilter.addDateField(GUI.IPrenotazione.sDATA_APP, 'Data Appuntamento');
            this.fpFilter.addDateField(GUI.IPrenotazione.sALLA_DATA, 'Al');
            this.fpFilter.addRow();
            this.fpFilter.addComponent(GUI.IPrenotazione.sID_CLIENTE, 'Cliente', new GUI.CFSelectClienti());
            this.fpFilter.addComponent(GUI.IPrenotazione.sID_COLL, 'Collaboratore', this.selCol);
            this.fpFilter.addTextField(GUI.IPrenotazione.sDESC_PREST, 'Trattamento');
            this.fpFilter.addRow();
            this.fpFilter.addComponent(GUI.IPrenotazione.sID_ATTR, 'Cabina', this.selCab);
            this.fpFilter.addComponent(GUI.IPrenotazione.sSTATO, 'Stato', new GUI.CFSelectStatiPren());
            this.fpFilter.addDateField(GUI.IPrenotazione.sDATA_PREN, 'Data Prenotazione');
            this.fpFilter.setMandatory(GUI.IPrenotazione.sID_FAR, GUI.IPrenotazione.sDATA_APP, GUI.IPrenotazione.sID_CLIENTE);
            this.fpFilter.setValue(GUI.IPrenotazione.sDATA_APP, WUtil.getCurrDate());
            this.lblResult = new WUX.WLabel(this.subId('lblr'), '', null, null, WUX.CSS.LABEL_INFO);
            var rc = [
                ['Data App.', GUI.IPrenotazione.sDATA_APP, 'd'],
                ['Ora App.', GUI.IPrenotazione.sORA_APP, 's'],
                ['Durata', GUI.IPrenotazione.sDURATA, 'i'],
                ['Stato', GUI.IPrenotazione.sSTATO, 's'],
                ['Cliente', GUI.IPrenotazione.sDESC_CLIENTE, 's'],
                ['Telefono', GUI.IPrenotazione.sTELEFONO1, 's'],
                ['Email', GUI.IPrenotazione.sEMAIL, 's'],
                ['Collaboratore', GUI.IPrenotazione.sDESC_COLL, 's'],
                ['Trattamento', GUI.IPrenotazione.sDESC_PREST, 's'],
                ['Cabina', GUI.IPrenotazione.sDESC_ATTR, 's'],
                ['Data Pren.', GUI.IPrenotazione.sDATA_PREN, 'd'],
                ['Data Agg.', GUI.IPrenotazione.sDATA_UPD, 't'],
                ['Struttura', GUI.IPrenotazione.sCOD_FAR, 's'],
                ['Forzatura', GUI.IPrenotazione.sOVERBOOKING, 'b'],
                ['On Line', GUI.IPrenotazione.sPREN_ONLINE, 'b'],
                ['Utente', GUI.IPrenotazione.sUSERDESK, 's'],
                ['Note', GUI.IPrenotazione.sNOTE, 's'],
                ['Coupon', GUI.IPrenotazione.sCOD_COUPON, 's'],
                ['Causale', GUI.IPrenotazione.sCAUSALE, 's']
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tab'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.types = WUtil.col(rc, 2);
            this.tabResult.exportFile = 'prenotazioni';
            this.tabResult.filter = true;
            this.tabResult.css({ h: 600, f: 10 });
            this.tabResult.onRowPrepared(function (e) {
                if (!e.data)
                    return;
                var stato = WUtil.getString(e.data, GUI.IPrenotazione.sSTATO, 'C');
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
            this.tabResult.onDoubleClick(function (e) {
                var srd = _this.tabResult.getSelectedRowsData();
                if (!srd || !srd.length)
                    return;
                var id = WUtil.getNumber(srd[0], GUI.IPrenotazione.sID);
                jrpc.execute('PRENOTAZIONI.read', [id], function (result) {
                    if (!result) {
                        WUX.showWarning('Prenotazione ' + id + ' non disponibile.');
                        return;
                    }
                    var dataApp = WUtil.getDate(result, GUI.IPrenotazione.sDATA_APP);
                    if (dataApp) {
                        result[GUI.IPrenotazione.sDATA_APP] = WUX.formatDate(dataApp, true);
                    }
                    var dataPre = WUtil.getDate(result, GUI.IPrenotazione.sDATA_PREN);
                    if (dataPre) {
                        result[GUI.IPrenotazione.sDATA_PREN] = WUX.formatDateTime(dataPre, false, true);
                    }
                    _this.dlgPren.setState(result);
                    _this.dlgPren.show();
                });
            });
            this.cntActions = new GUI.CFTableActions('ta');
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
                .end()
                .addBox()
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, this.cntActions, this.tabResult)
                .end()
                .addRow()
                .addCol('12')
                .add(this.lblResult);
            return this.container;
        };
        GUIPrenotazioni.prototype.collapseHandler = function (e) {
            var c = WUtil.getBoolean(e.data, 'collapsed');
            if (c) {
                this.tagsFilter.setState({});
            }
            else {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
            }
        };
        GUIPrenotazioni.prototype.componentDidMount = function () {
            var _this = this;
            var idf = 0;
            if (GUI.strutture && GUI.strutture.length) {
                idf = GUI.strutture[0].id;
            }
            var dataApp = WUtil.toDate(WUtil.getParam('d'));
            if (!dataApp) {
                if (idf)
                    this.selFar.setState(idf);
                return;
            }
            var pidf = WUtil.toNumber(WUtil.getParam('f'));
            if (pidf) {
                this.selFar.setState(pidf);
                idf = pidf;
            }
            else {
                if (idf)
                    this.selFar.setState(idf);
            }
            if (idf) {
                this.selCol.setIdFar(idf);
                this.selCab.setIdFar(idf);
            }
            this.fpFilter.setValue(GUI.IPrenotazione.sDATA_APP, dataApp);
            setTimeout(function () {
                _this.btnFind.trigger('click');
            }, 200);
        };
        return GUIPrenotazioni;
    }(WUX.WComponent));
    GUI.GUIPrenotazioni = GUIPrenotazioni;
})(GUI || (GUI = {}));
var GUI;
(function (GUI) {
    var WUtil = WUX.WUtil;
    var GUIRepPro = (function (_super) {
        __extends(GUIRepPro, _super);
        function GUIRepPro(id) {
            var _this = _super.call(this, id ? id : '*', 'GUIRepPro') || this;
            _this.dlgDet = new GUI.DlgStoricoColl(_this.subId('dlgd'));
            return _this;
        }
        GUIRepPro.prototype.render = function () {
            var _this = this;
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', function (e) {
                var labels = _this.fpFilter.checkMandatory(true, true);
                if (labels) {
                    WUX.showWarning('Occorre valorizzare i seguenti campi: ' + labels);
                    return false;
                }
                var box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    _this.tagsFilter.setState(_this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('REPORT.getProduttivita', [_this.fpFilter.getState()], function (result) {
                    _this.tabResult.setState(result);
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', function (e) {
                _this.tabResult.setState([]);
                _this.fpFilter.clear();
                _this.tagsFilter.setState({});
            });
            this.tagsFilter = new WUX.WTags('tagsFilter');
            this.selFar = new GUI.CFSelectStruture();
            this.selFar.on('statechange', function (e) {
                _this.tabResult.setState([]);
            });
            this.selMese = new GUI.CFSelectMesi();
            this.fpFilter = new WUX.WFormPanel(this.subId('fpf'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent('idFar', 'Struttura', this.selFar);
            this.fpFilter.addComponent('mese', 'Mese', this.selMese);
            this.fpFilter.setMandatory('mese');
            this.fpFilter.onEnterPressed(function (e) {
                _this.btnFind.trigger('click');
            });
            var rc = [
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
            this.tabResult.onCellPrepared(function (e) {
                var f = e.column.dataField;
                if (f == 'col')
                    e.cellElement.addClass('clickable');
            });
            this.tabResult.onCellClick(function (e) {
                var row = e.row;
                if (row != null && row.rowType == 'data') {
                    var f = e.column.dataField;
                    if (f == 'col') {
                        var v = _this.fpFilter.getState();
                        var f_1 = {};
                        f_1['preferenze'] = WUtil.getString(v, 'mese');
                        f_1['idColl'] = WUtil.getNumber(e.data, 'ico');
                        f_1['idFar'] = WUtil.getNumber(e.data, 'idf');
                        f_1['stato'] = '*';
                        jrpc.execute('PRENOTAZIONI.find', [f_1], function (result) {
                            _this.dlgDet.setProps('Collaboratore: ' + e.value);
                            _this.dlgDet.setState(result);
                            _this.dlgDet.show(_this);
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
                .end()
                .addRow()
                .addCol('12').section('Risultato')
                .add(this.tabResult);
            return this.container;
        };
        GUIRepPro.prototype.collapseHandler = function (e) {
            var c = WUtil.getBoolean(e.data, 'collapsed');
            if (c) {
                this.tagsFilter.setState({});
            }
            else {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
            }
        };
        GUIRepPro.prototype.componentDidMount = function () {
            var idf = 0;
            if (GUI.strutture && GUI.strutture.length) {
                idf = GUI.strutture[0].id;
            }
            if (idf)
                this.selFar.setState(idf);
        };
        return GUIRepPro;
    }(WUX.WComponent));
    GUI.GUIRepPro = GUIRepPro;
    var GUIRepMsg = (function (_super) {
        __extends(GUIRepMsg, _super);
        function GUIRepMsg(id) {
            return _super.call(this, id ? id : '*', 'GUIRepMsg') || this;
        }
        GUIRepMsg.prototype.render = function () {
            var _this = this;
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', function (e) {
                var labels = _this.fpFilter.checkMandatory(true, true);
                if (labels) {
                    WUX.showWarning('Occorre valorizzare i seguenti campi: ' + labels);
                    return false;
                }
                var box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    _this.tagsFilter.setState(_this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('REPORT.getMessaggi', [_this.fpFilter.getState()], function (result) {
                    _this.tabResult.setState(result);
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', function (e) {
                _this.tabResult.setState([]);
                _this.fpFilter.clear();
                _this.fpFilter.setValue('dal', WUtil.getCurrDate(0, -1, 0));
                _this.fpFilter.setValue('al', WUtil.getCurrDate());
                _this.tagsFilter.setState({});
            });
            this.tagsFilter = new WUX.WTags('tagsFilter');
            this.selFar = new GUI.CFSelectStruture();
            this.selFar.on('statechange', function (e) {
                _this.tabResult.setState([]);
            });
            this.selMese = new GUI.CFSelectMesi();
            this.fpFilter = new WUX.WFormPanel(this.subId('fpf'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent('idFar', 'Struttura', this.selFar);
            this.fpFilter.addComponent('mese', 'Mese', this.selMese);
            this.fpFilter.setMandatory('idFar', 'mese');
            this.fpFilter.onEnterPressed(function (e) {
                _this.btnFind.trigger('click');
            });
            var rc = [
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
                .end()
                .addRow()
                .addCol('12').section('Risultato')
                .add(this.tabResult);
            return this.container;
        };
        GUIRepMsg.prototype.collapseHandler = function (e) {
            var c = WUtil.getBoolean(e.data, 'collapsed');
            if (c) {
                this.tagsFilter.setState({});
            }
            else {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
            }
        };
        GUIRepMsg.prototype.componentDidMount = function () {
            var idf = 0;
            if (GUI.strutture && GUI.strutture.length) {
                idf = GUI.strutture[0].id;
            }
            if (idf)
                this.selFar.setState(idf);
        };
        return GUIRepMsg;
    }(WUX.WComponent));
    GUI.GUIRepMsg = GUIRepMsg;
    var GUIChartsPro = (function (_super) {
        __extends(GUIChartsPro, _super);
        function GUIChartsPro(id) {
            return _super.call(this, id ? id : '*', 'GUIRepPro') || this;
        }
        GUIChartsPro.prototype.render = function () {
            var _this = this;
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', function (e) {
                var labels = _this.fpFilter.checkMandatory(true, true);
                if (labels) {
                    WUX.showWarning('Occorre valorizzare i seguenti campi: ' + labels);
                    return false;
                }
                var box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    _this.tagsFilter.setState(_this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('REPORT.getGrafici', [_this.fpFilter.getState()], function (result) {
                    if (WUtil.isEmpty(result)) {
                        WUX.showWarning('Non vi sono dati rappresentabili');
                        return;
                    }
                    _this.chrCE.setState(result['ce']);
                    _this.chrCV.setState(result['cv']);
                    _this.chrPE.setState(result['pe']);
                    _this.chrPV.setState(result['pv']);
                    _this.chrPP.setState(result['pp']);
                    _this.chrGV.setState(result['gv']);
                    setTimeout(function () {
                        _this.fix();
                    }, 200);
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', function (e) {
                _this.chrCE.setState(null);
                _this.chrCV.setState(null);
                _this.chrPE.setState(null);
                _this.chrPV.setState(null);
                _this.chrPP.setState(null);
                _this.chrGV.setState(null);
                _this.fpFilter.clear();
                _this.tagsFilter.setState({});
            });
            this.tagsFilter = new WUX.WTags('tagsFilter');
            this.selFar = new GUI.CFSelectStruture();
            this.selFar.on('statechange', function (e) {
                _this.chrCE.setState(null);
                _this.chrCV.setState(null);
                _this.chrPE.setState(null);
                _this.chrPV.setState(null);
                _this.chrPP.setState(null);
                _this.chrGV.setState(null);
            });
            this.selMese = new GUI.CFSelectMesi();
            this.fpFilter = new WUX.WFormPanel(this.subId('fpf'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent('idFar', 'Struttura', this.selFar);
            this.fpFilter.addComponent('mese', 'Mese', this.selMese);
            this.fpFilter.setMandatory('idFar', 'mese');
            this.fpFilter.onEnterPressed(function (e) {
                _this.btnFind.trigger('click');
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
                .end()
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
        };
        GUIChartsPro.prototype.collapseHandler = function (e) {
            var c = WUtil.getBoolean(e.data, 'collapsed');
            if (c) {
                this.tagsFilter.setState({});
            }
            else {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
            }
        };
        GUIChartsPro.prototype.fix = function () {
            var r = this.chrCE.getRoot();
            var v = r.height();
            if (v) {
                this.chrCE.css({ h: v, maxh: v });
                this.chrCV.css({ h: v, maxh: v });
                this.chrPE.css({ h: v, maxh: v });
                this.chrPV.css({ h: v, maxh: v });
                this.chrPP.css({ h: v, maxh: v });
                this.chrGV.css({ h: v, maxh: v });
            }
        };
        GUIChartsPro.prototype.componentDidMount = function () {
            var idf = 0;
            if (GUI.strutture && GUI.strutture.length) {
                idf = GUI.strutture[0].id;
            }
            if (idf)
                this.selFar.setState(idf);
        };
        return GUIChartsPro;
    }(WUX.WComponent));
    GUI.GUIChartsPro = GUIChartsPro;
})(GUI || (GUI = {}));
var GUI;
(function (GUI) {
    var WUtil = WUX.WUtil;
    var GUIGruppiTrat = (function (_super) {
        __extends(GUIGruppiTrat, _super);
        function GUIGruppiTrat(id) {
            var _this = _super.call(this, id ? id : '*', 'GUIGruppiTrat') || this;
            _this.iSTATUS_STARTUP = 0;
            _this.iSTATUS_VIEW = 1;
            _this.iSTATUS_EDITING = 2;
            _this.status = _this.iSTATUS_STARTUP;
            return _this;
        }
        GUIGruppiTrat.prototype.render = function () {
            var _this = this;
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var check = _this.fpFilter.checkMandatory(true, true, true);
                if (check) {
                    WUX.showWarning('Specificare i seguenti campi: ' + check);
                    return;
                }
                var box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    _this.tagsFilter.setState(_this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('GRUPPI_PREST.find', [GUI.CFUtil.putUserInfo(_this.fpFilter.getState())], function (result) {
                    _this.tabResult.setState(result);
                    _this.fpDetail.clear();
                    _this.status = _this.iSTATUS_STARTUP;
                    if (_this.selId) {
                        var idx_16 = WUtil.indexOf(result, GUI.IPrestazione.sID, _this.selId);
                        if (idx_16 >= 0) {
                            setTimeout(function () {
                                _this.tabResult.select([idx_16]);
                            }, 100);
                        }
                        _this.selId = null;
                    }
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                _this.fpFilter.clear();
                _this.tagsFilter.setState({});
                _this.tabResult.setState([]);
                _this.fpDetail.clear();
                _this.status = _this.iSTATUS_STARTUP;
            });
            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addTextField(GUI.IGruppoPrest.sCODICE, 'Codice');
            this.fpFilter.addTextField(GUI.IGruppoPrest.sDESCRIZIONE, 'Descrizione');
            this.fpFilter.onEnterPressed(function (e) {
                _this.btnFind.trigger('click');
            });
            this.btnNew = new WUX.WButton(this.subId('bn'), GUI.TXT.NEW, '', WUX.BTN.SM_INFO);
            this.btnNew.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    _this.btnNew.blur();
                    return;
                }
                _this.isNew = true;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.tabResult.clearSelection();
                _this.fpDetail.enabled = true;
                _this.fpDetail.clear();
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnOpen = new WUX.WButton(this.subId('bo'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    _this.btnOpen.blur();
                    return;
                }
                var sr = _this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    _this.btnOpen.blur();
                    return;
                }
                _this.isNew = false;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.fpDetail.enabled = true;
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnSave = new WUX.WButton(this.subId('bs'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    WUX.showWarning('Cliccare su Modifica.');
                    _this.btnSave.blur();
                    return;
                }
                var check = _this.fpDetail.checkMandatory(true, true, false);
                if (check) {
                    _this.btnSave.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                var values = _this.fpDetail.getState();
                if (_this.isNew) {
                    jrpc.execute('GRUPPI_PREST.insert', [values], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        WUX.showSuccess('Gruppo inserito con successo.');
                        _this.selId = result[GUI.IGruppoPrest.sID];
                        _this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('GRUPPI_PREST.update', [values], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        WUX.showSuccess('Gruppo aggiornato con successo.');
                        _this.selId = result[GUI.IGruppoPrest.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            _this.btnFind.trigger('click');
                        }
                    });
                }
            });
            this.btnCancel = new WUX.WButton(this.subId('bc'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    _this.btnCancel.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, function (res) {
                    if (!res)
                        return;
                    if (_this.isNew) {
                        _this.fpDetail.clear();
                    }
                    _this.status = _this.iSTATUS_VIEW;
                    _this.fpDetail.enabled = false;
                    _this.selId = null;
                });
            });
            this.btnDelete = new WUX.WButton(this.subId('bd'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete.on('click', function (e) {
                _this.selId = null;
                _this.btnDelete.blur();
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length)
                    return;
                var id = WUtil.getInt(rd[0], GUI.IGruppoPrest.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, function (res) {
                    if (!res)
                        return;
                    jrpc.execute('GRUPPI_PREST.delete', [id], function (result) {
                        _this.btnFind.trigger('click');
                    });
                });
            });
            var rc = [
                ['Codice', GUI.IGruppoPrest.sCODICE, 100, 's'],
                ['Descrizione', GUI.IGruppoPrest.sDESCRIZIONE, 0, 's']
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.css({ h: 220 });
            this.tabResult.widths = WUtil.col(rc, 2);
            this.tabResult.types = WUtil.col(rc, 3);
            this.tabResult.exportFile = 'trattamenti';
            this.tabResult.onSelectionChanged(function (e) {
                var srd = _this.tabResult.getSelectedRowsData();
                if (!srd || !srd.length)
                    return;
                _this.fpDetail.setState(srd[0]);
                _this.status = _this.iSTATUS_VIEW;
            });
            this.fpDetail = new WUX.WFormPanel(this.subId('fd'));
            this.fpDetail.addRow();
            this.fpDetail.addTextField(GUI.IGruppoPrest.sCODICE, 'Codice');
            this.fpDetail.addTextField(GUI.IGruppoPrest.sDESCRIZIONE, 'Descrizione');
            this.fpDetail.addInternalField(GUI.IGruppoPrest.sID);
            this.fpDetail.enabled = false;
            this.cntActions = new GUI.CFTableActions('ta');
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
                .end()
                .addBox()
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, this.cntActions, this.tabResult)
                .end()
                .addRow()
                .addCol('12').section('Dettaglio')
                .add(this.fpDetail);
            return this.container;
        };
        GUIGruppiTrat.prototype.collapseHandler = function (e) {
            var c = WUtil.getBoolean(e.data, 'collapsed');
            if (c) {
                this.tagsFilter.setState({});
            }
            else {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
            }
        };
        return GUIGruppiTrat;
    }(WUX.WComponent));
    GUI.GUIGruppiTrat = GUIGruppiTrat;
    var GUITrattamenti = (function (_super) {
        __extends(GUITrattamenti, _super);
        function GUITrattamenti(id) {
            var _this = _super.call(this, id ? id : '*', 'GUITrattamenti') || this;
            _this.iSTATUS_STARTUP = 0;
            _this.iSTATUS_VIEW = 1;
            _this.iSTATUS_EDITING = 2;
            _this.status = _this.iSTATUS_STARTUP;
            return _this;
        }
        GUITrattamenti.prototype.render = function () {
            var _this = this;
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var check = _this.fpFilter.checkMandatory(true, true, false);
                if (check) {
                    WUX.showWarning('Specificare i seguenti campi: ' + check);
                    return;
                }
                var box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    _this.tagsFilter.setState(_this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('PRESTAZIONI.find', [GUI.CFUtil.putUserInfo(_this.fpFilter.getState())], function (result) {
                    _this.tabResult.setState(result);
                    _this.fpDetail.clear();
                    _this.status = _this.iSTATUS_STARTUP;
                    if (_this.selId) {
                        var idx_17 = WUtil.indexOf(result, GUI.IPrestazione.sID, _this.selId);
                        if (idx_17 >= 0) {
                            setTimeout(function () {
                                _this.tabResult.select([idx_17]);
                            }, 100);
                        }
                        _this.selId = null;
                    }
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                _this.fpFilter.clear();
                _this.tagsFilter.setState({});
                _this.tabResult.setState([]);
                _this.fpDetail.clear();
                _this.tabSelA.setState([]);
                _this.tabAllA.clearSelection();
                _this.tabAllA.clearFilter();
                _this.tabSelC.setState([]);
                _this.tabAllC.clearSelection();
                _this.tabAllC.clearFilter();
                _this.status = _this.iSTATUS_STARTUP;
            });
            this.selFar = new GUI.CFSelectStruture();
            this.selFar.on('statechange', function (e) {
                _this.tabResult.setState([]);
                _this.fpDetail.clear();
                _this.tabSelA.setState([]);
                _this.tabAllA.clearSelection();
                _this.tabAllA.clearFilter();
                _this.tabSelC.setState([]);
                _this.tabAllC.clearSelection();
                _this.tabAllC.clearFilter();
                GUI.cp_attrz = null;
                GUI.cp_collb = null;
                var idf = WUtil.toNumber(_this.selFar.getState(), 0);
                jrpc.execute('ATTREZZATURE.getAll', [idf], function (result) {
                    _this.tabAllA.setState(result);
                });
                jrpc.execute('COLLABORATORI.getAll', [idf], function (result) {
                    _this.tabAllC.setState(result);
                });
            });
            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent(GUI.IPrestazione.sID_FAR, 'Struttura', this.selFar);
            this.fpFilter.addComponent(GUI.IPrestazione.sGRUPPO, 'Gruppo', new GUI.CFSelectGruppiPre());
            this.fpFilter.addTextField(GUI.IPrestazione.sDESCRIZIONE, 'Descrizione');
            this.fpFilter.setMandatory(GUI.IPrestazione.sID_FAR);
            this.selGruppo = new GUI.CFSelectGruppiPre();
            this.fpDetail = new WUX.WFormPanel(this.subId('fpd'));
            this.fpDetail.addRow();
            this.fpDetail.addTextField(GUI.IPrestazione.sDESCRIZIONE, 'Descrizione');
            this.fpDetail.addComponent(GUI.IPrestazione.sGRUPPO, 'Gruppo', this.selGruppo);
            this.fpDetail.addIntegerField(GUI.IPrestazione.sDURATA, 'Durata (min.)');
            this.fpDetail.addBooleanField(GUI.IPrestazione.sPREN_ONLINE, 'Pren. On Line');
            this.fpDetail.addRow();
            this.fpDetail.addComponent(GUI.IPrestazione.sTIPO_PREZZO, 'Tipo prezzo', new GUI.CFSelectTipoPrezzo());
            this.fpDetail.addCurrencyField(GUI.IPrestazione.sPREZZO_LISTINO, 'Prezzo Listino');
            this.fpDetail.addCurrencyField(GUI.IPrestazione.sSCONTO_ASS, 'Sconto &euro;');
            this.fpDetail.addIntegerField(GUI.IPrestazione.sSCONTO_PERC, 'Sconto %');
            this.fpDetail.addCurrencyField(GUI.IPrestazione.sPREZZO_FINALE, 'Prezzo Finale');
            this.fpDetail.addIntegerField(GUI.IPrestazione.sPUNTI_COLL, 'Punti Coll.');
            this.fpDetail.addRow();
            this.fpDetail.addTextField(GUI.IPrestazione.sCODICE, 'Cod.Servizio');
            this.fpDetail.addTextField(GUI.IPrestazione.sAVVERTENZE, 'Avvertenze');
            this.fpDetail.addTextField(GUI.IPrestazione.sINDICAZIONI, 'Indicazioni');
            this.fpDetail.addInternalField(GUI.IPrestazione.sID);
            this.fpDetail.enabled = false;
            this.fpDetail.onBlur(GUI.IPrestazione.sPREZZO_LISTINO, function (e) {
                _this.calcPrezzi();
            });
            this.fpDetail.onBlur(GUI.IPrestazione.sSCONTO_ASS, function (e) {
                _this.calcPrezzi();
            });
            this.fpDetail.onBlur(GUI.IPrestazione.sSCONTO_PERC, function (e) {
                _this.calcPrezzi();
            });
            this.fpDetail.onBlur(GUI.IPrestazione.sPREZZO_FINALE, function (e) {
                _this.calcPrezzi();
            });
            this.fpDetail.setSpanField(GUI.IPrestazione.sDESCRIZIONE, 3);
            this.fpDetail.setSpanField(GUI.IPrestazione.sCODICE, 2);
            this.fpDetail.setSpanField(GUI.IPrestazione.sAVVERTENZE, 2);
            this.fpDetail.setSpanField(GUI.IPrestazione.sINDICAZIONI, 2);
            this.fpFilter.onEnterPressed(function (e) {
                _this.btnFind.trigger('click');
            });
            this.btnNew = new WUX.WButton(this.subId('bn'), GUI.TXT.NEW, '', WUX.BTN.SM_INFO);
            this.btnNew.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    _this.btnNew.blur();
                    return;
                }
                _this.isNew = true;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.tabResult.clearSelection();
                _this.fpDetail.enabled = true;
                _this.btnDxA.enabled = true;
                _this.btnSxA.enabled = true;
                _this.btnPaA.enabled = true;
                _this.btnDxC.enabled = true;
                _this.btnSxC.enabled = true;
                _this.btnPaC.enabled = true;
                _this.fpDetail.clear();
                _this.tabSelA.setState([]);
                _this.tabAllA.clearSelection();
                _this.tabSelC.setState([]);
                _this.tabAllC.clearSelection();
                _this.tcoDetail.setState(0);
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnOpen = new WUX.WButton(this.subId('bo'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    _this.btnOpen.blur();
                    return;
                }
                var sr = _this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    _this.btnOpen.blur();
                    return;
                }
                _this.isNew = false;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.fpDetail.enabled = true;
                _this.btnDxA.enabled = true;
                _this.btnSxA.enabled = true;
                _this.btnPaA.enabled = true;
                _this.btnDxC.enabled = true;
                _this.btnSxC.enabled = true;
                _this.btnPaC.enabled = true;
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnSave = new WUX.WButton(this.subId('bs'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    WUX.showWarning('Cliccare su Modifica.');
                    _this.btnSave.blur();
                    return;
                }
                var check = _this.fpDetail.checkMandatory(true);
                if (check) {
                    _this.btnSave.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                var idf = WUtil.toNumber(_this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Selezionare la struttura di competenza');
                    return;
                }
                var values = _this.fpDetail.getState();
                var d = WUtil.getNumber(values, GUI.IPrestazione.sDURATA);
                if (d < 5) {
                    WUX.showWarning('Durata non valida.');
                    return;
                }
                if (d > 600) {
                    WUX.showWarning('Durata non valida: massimo 600 minuti.');
                    return;
                }
                values[GUI.IPrestazione.sID_FAR] = idf;
                values[GUI.IPrestazione.sATTREZZATURE] = _this.tabSelA.getState();
                values[GUI.IPrestazione.sCOLLABORATORI] = _this.tabSelC.getState();
                if (_this.isNew) {
                    jrpc.execute('PRESTAZIONI.insert', [values], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.btnDxA.enabled = false;
                        _this.btnSxA.enabled = false;
                        _this.btnPaA.enabled = false;
                        _this.btnDxC.enabled = false;
                        _this.btnSxC.enabled = false;
                        _this.btnPaC.enabled = false;
                        WUX.showSuccess('Trattamento inserito con successo.');
                        _this.selId = result[GUI.IPrestazione.sID];
                        _this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('PRESTAZIONI.update', [values], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.btnDxA.enabled = false;
                        _this.btnSxA.enabled = false;
                        _this.btnPaA.enabled = false;
                        _this.btnDxC.enabled = false;
                        _this.btnSxC.enabled = false;
                        _this.btnPaC.enabled = false;
                        WUX.showSuccess('Trattamento aggiornato con successo.');
                        _this.selId = result[GUI.IPrestazione.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            _this.btnFind.trigger('click');
                        }
                        else {
                            var idx_18 = selRows[0];
                            var records = _this.tabResult.getState();
                            records[idx_18] = result;
                            records[idx_18][GUI.IPrestazione.sDESC_GRUPPO] = _this.selGruppo.getProps();
                            _this.tabResult.refresh();
                            setTimeout(function () {
                                _this.tabResult.select([idx_18]);
                            }, 100);
                        }
                    });
                }
            });
            this.btnCancel = new WUX.WButton(this.subId('bc'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    _this.btnCancel.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, function (res) {
                    if (!res)
                        return;
                    if (_this.isNew) {
                        _this.fpDetail.clear();
                        _this.tabSelA.setState([]);
                        _this.tabAllA.clearSelection();
                        _this.tabSelC.setState([]);
                        _this.tabAllC.clearSelection();
                    }
                    else {
                        _this.onSelect();
                    }
                    _this.status = _this.iSTATUS_VIEW;
                    _this.fpDetail.enabled = false;
                    _this.btnDxA.enabled = false;
                    _this.btnSxA.enabled = false;
                    _this.btnPaA.enabled = false;
                    _this.btnDxC.enabled = false;
                    _this.btnSxC.enabled = false;
                    _this.btnPaC.enabled = false;
                    _this.selId = null;
                });
            });
            this.btnDelete = new WUX.WButton(this.subId('bd'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete.on('click', function (e) {
                _this.selId = null;
                _this.btnDelete.blur();
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length)
                    return;
                var id = WUtil.getInt(rd[0], GUI.IPrestazione.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, function (res) {
                    if (!res)
                        return;
                    jrpc.execute('PRESTAZIONI.delete', [id], function (result) {
                        _this.btnFind.trigger('click');
                    });
                });
            });
            this.btnOpen2 = new WUX.WButton(this.subId('bo2'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen2.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    _this.btnOpen2.blur();
                    return;
                }
                var sr = _this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    _this.btnOpen2.blur();
                    return;
                }
                _this.isNew = false;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.fpDetail.enabled = true;
                _this.btnDxA.enabled = true;
                _this.btnSxA.enabled = true;
                _this.btnPaA.enabled = true;
                _this.btnDxC.enabled = true;
                _this.btnSxC.enabled = true;
                _this.btnPaC.enabled = true;
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnSave2 = new WUX.WButton(this.subId('bs2'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave2.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    WUX.showWarning('Cliccare su Modifica.');
                    _this.btnSave2.blur();
                    return;
                }
                var check = _this.fpDetail.checkMandatory(true);
                if (check) {
                    _this.btnSave2.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                var idf = WUtil.toNumber(_this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Selezionare la struttura di competenza');
                    return;
                }
                var values = _this.fpDetail.getState();
                var d = WUtil.getNumber(values, GUI.IPrestazione.sDURATA);
                if (d < 5) {
                    WUX.showWarning('Durata non valida.');
                    return;
                }
                if (d > 600) {
                    WUX.showWarning('Durata non valida: massimo 600 minuti.');
                    return;
                }
                values[GUI.IPrestazione.sID_FAR] = idf;
                values[GUI.IPrestazione.sATTREZZATURE] = _this.tabSelA.getState();
                values[GUI.IPrestazione.sCOLLABORATORI] = _this.tabSelC.getState();
                if (_this.isNew) {
                    jrpc.execute('PRESTAZIONI.insert', [values], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.btnDxA.enabled = false;
                        _this.btnSxA.enabled = false;
                        _this.btnPaA.enabled = false;
                        _this.btnDxC.enabled = false;
                        _this.btnSxC.enabled = false;
                        _this.btnPaC.enabled = false;
                        WUX.showSuccess('Trattamento inserito con successo.');
                        _this.selId = result[GUI.IPrestazione.sID];
                        _this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('PRESTAZIONI.update', [values], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.btnDxA.enabled = false;
                        _this.btnSxA.enabled = false;
                        _this.btnPaA.enabled = false;
                        _this.btnDxC.enabled = false;
                        _this.btnSxC.enabled = false;
                        _this.btnPaC.enabled = false;
                        WUX.showSuccess('Trattamento aggiornato con successo.');
                        _this.selId = result[GUI.IPrestazione.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            _this.btnFind.trigger('click');
                        }
                        else {
                            var idx_19 = selRows[0];
                            var records = _this.tabResult.getState();
                            records[idx_19] = result;
                            records[idx_19][GUI.IPrestazione.sDESC_GRUPPO] = _this.selGruppo.getProps();
                            _this.tabResult.refresh();
                            setTimeout(function () {
                                _this.tabResult.select([idx_19]);
                            }, 100);
                        }
                    });
                }
            });
            this.btnCancel2 = new WUX.WButton(this.subId('bc2'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel2.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    _this.btnCancel2.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, function (res) {
                    if (!res)
                        return;
                    if (_this.isNew) {
                        _this.fpDetail.clear();
                        _this.tabSelA.setState([]);
                        _this.tabAllA.clearSelection();
                        _this.tabSelC.setState([]);
                        _this.tabAllC.clearSelection();
                    }
                    else {
                        _this.onSelect();
                    }
                    _this.status = _this.iSTATUS_VIEW;
                    _this.fpDetail.enabled = false;
                    _this.btnDxA.enabled = false;
                    _this.btnSxA.enabled = false;
                    _this.btnPaA.enabled = false;
                    _this.btnDxC.enabled = false;
                    _this.btnSxC.enabled = false;
                    _this.btnPaC.enabled = false;
                    _this.selId = null;
                });
            });
            this.btnDelete2 = new WUX.WButton(this.subId('bd2'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete2.on('click', function (e) {
                _this.selId = null;
                _this.btnDelete2.blur();
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length)
                    return;
                var id = WUtil.getInt(rd[0], GUI.IPrestazione.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, function (res) {
                    if (!res)
                        return;
                    jrpc.execute('PRESTAZIONI.delete', [id], function (result) {
                        _this.btnFind.trigger('click');
                    });
                });
            });
            var rc = [
                ['Gruppo', GUI.IPrestazione.sDESC_GRUPPO, 's'],
                ['Descrizione', GUI.IPrestazione.sDESCRIZIONE, 's'],
                ['Durata', GUI.IPrestazione.sDURATA, 'i'],
                ['Tipo prezzo', GUI.IPrestazione.sTIPO_PREZZO, 's'],
                ['Prezzo Listino', GUI.IPrestazione.sPREZZO_LISTINO, 'c'],
                ['Sconto Ass.', GUI.IPrestazione.sSCONTO_ASS, 'c'],
                ['Sconto Perc.', GUI.IPrestazione.sSCONTO_PERC, 'i'],
                ['Prezzo Finale', GUI.IPrestazione.sPREZZO_FINALE, 'c'],
                ['Punti Coll.', GUI.IPrestazione.sPUNTI_COLL, 'i'],
                ['Pren. On Line', GUI.IPrestazione.sPREN_ONLINE, 'b']
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.css({ h: 220 });
            this.tabResult.types = WUtil.col(rc, 2);
            this.tabResult.exportFile = 'trattamenti';
            this.tabResult.onSelectionChanged(function (e) {
                _this.onSelect();
            });
            this.tabSelA = new WUX.WDXTable(this.subId('tbs'), ['Codice', 'Descrizione'], [GUI.IAttrezzatura.sCODICE, GUI.IAttrezzatura.sDESCRIZIONE]);
            this.tabSelA.selectionMode = 'multiple';
            this.tabSelA.css({ h: 200 });
            this.tabSelA.widths = [100];
            this.tabAllA = new WUX.WDXTable(this.subId('tba'), ['Codice', 'Descrizione'], [GUI.IAttrezzatura.sCODICE, GUI.IAttrezzatura.sDESCRIZIONE]);
            this.tabAllA.selectionMode = 'multiple';
            this.tabAllA.css({ h: 200 });
            this.tabAllA.widths = [100];
            this.btnSxA = new WUX.WButton(this.subId('bba'), '', GUI.ICO.LEFT, WUX.BTN.PRIMARY, { p: '1px 6px 1px 6px' });
            this.btnSxA.tooltip = 'Aggiungi cabine';
            this.btnSxA.enabled = false;
            this.btnSxA.on('click', function (e) {
                var dts = _this.tabSelA.getState();
                if (!dts)
                    dts = [];
                var srd = _this.tabAllA.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare una o pi&ugrave; cabine dall\'elenco disponibile.');
                    return;
                }
                var scr = false;
                for (var i = 0; i < srd.length; i++) {
                    var p = srd[i];
                    var pid = p[GUI.IAttrezzatura.sID];
                    var f = false;
                    for (var j = 0; j < dts.length; j++) {
                        var s = dts[j];
                        var sid = s[GUI.IAttrezzatura.sID];
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
                _this.tabSelA.setState(dts);
                if (scr) {
                    setTimeout(function () {
                        _this.tabSelA.scrollTo(999999);
                    }, 250);
                }
            });
            this.btnDxA = new WUX.WButton(this.subId('bbd'), '', GUI.ICO.DELETE, WUX.BTN.DANGER, { p: '1px 7px 1px 7px' });
            this.btnDxA.tooltip = 'Rimuovi cabine';
            this.btnDxA.enabled = false;
            this.btnDxA.on('click', function (e) {
                var dts = _this.tabSelA.getState();
                if (!dts)
                    dts = [];
                var srd = _this.tabSelA.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare una o pi&ugrave; cabine dall\'elenco delle assegnate.');
                    return;
                }
                var cpy = [];
                for (var i = 0; i < dts.length; i++) {
                    var p = dts[i];
                    var pid = p[GUI.IAttrezzatura.sID];
                    var f = false;
                    for (var j = 0; j < srd.length; j++) {
                        var s = srd[j];
                        var sid = s[GUI.IAttrezzatura.sID];
                        if (sid == pid) {
                            f = true;
                            break;
                        }
                    }
                    if (!f)
                        cpy.push(p);
                }
                _this.tabSelA.setState(cpy);
            });
            this.btnCpA = new WUX.WButton(this.subId('bbc'), '', GUI.ICO.COPY, WUX.BTN.SECONDARY, { p: '1px 7px 1px 7px' });
            this.btnCpA.tooltip = 'Copia cabine';
            this.btnCpA.on('click', function (e) {
                var items = _this.tabSelA.getState();
                if (!items || !items.length) {
                    WUX.showSuccess('Nessun elemento selezionato');
                    return;
                }
                GUI.cp_attrz = items;
                WUX.showSuccess('Cabine copiate nella clipboard');
            });
            this.btnPaA = new WUX.WButton(this.subId('bbp'), '', GUI.ICO.PASTE, WUX.BTN.WARNING, { p: '1px 7px 1px 7px' });
            this.btnPaA.tooltip = 'Incolla cabine';
            this.btnPaA.enabled = false;
            this.btnPaA.on('click', function (e) {
                if (!GUI.cp_attrz) {
                    WUX.showWarning('Non vi sono cabine nella clipboard');
                    return;
                }
                _this.tabSelA.setState(GUI.cp_attrz);
            });
            this.tabSelC = new WUX.WDXTable(this.subId('tbsc'), ['Nome'], [GUI.ICollaboratore.sNOME]);
            this.tabSelC.selectionMode = 'multiple';
            this.tabSelC.css({ h: 200 });
            this.tabAllC = new WUX.WDXTable(this.subId('tbac'), ['Nome'], [GUI.ICollaboratore.sNOME]);
            this.tabAllC.selectionMode = 'multiple';
            this.tabAllC.css({ h: 200 });
            this.btnSxC = new WUX.WButton(this.subId('bbac'), '', GUI.ICO.LEFT, WUX.BTN.PRIMARY, { p: '1px 6px 1px 6px' });
            this.btnSxC.tooltip = 'Aggiungi collaboratore';
            this.btnSxC.enabled = false;
            this.btnSxC.on('click', function (e) {
                var dts = _this.tabSelC.getState();
                if (!dts)
                    dts = [];
                var srd = _this.tabAllC.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare uno o pi&ugrave; collaboratori dall\'elenco disponibile.');
                    return;
                }
                var scr = false;
                for (var i = 0; i < srd.length; i++) {
                    var p = srd[i];
                    var pid = p[GUI.ICollaboratore.sID];
                    var f = false;
                    for (var j = 0; j < dts.length; j++) {
                        var s = dts[j];
                        var sid = s[GUI.ICollaboratore.sID];
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
                _this.tabSelC.setState(dts);
                if (scr) {
                    setTimeout(function () {
                        _this.tabSelC.scrollTo(999999);
                    }, 250);
                }
            });
            this.btnDxC = new WUX.WButton(this.subId('bbdc'), '', GUI.ICO.DELETE, WUX.BTN.DANGER, { p: '1px 7px 1px 7px' });
            this.btnDxC.tooltip = 'Rimuovi collaboratori';
            this.btnDxC.enabled = false;
            this.btnDxC.on('click', function (e) {
                var dts = _this.tabSelC.getState();
                if (!dts)
                    dts = [];
                var srd = _this.tabSelC.getSelectedRowsData();
                if (!srd || !srd.length) {
                    WUX.showWarning('Selezionare una o pi&ugrave; cabine dall\'elenco delle assegnate.');
                    return;
                }
                var cpy = [];
                for (var i = 0; i < dts.length; i++) {
                    var p = dts[i];
                    var pid = p[GUI.IAttrezzatura.sID];
                    var f = false;
                    for (var j = 0; j < srd.length; j++) {
                        var s = srd[j];
                        var sid = s[GUI.IAttrezzatura.sID];
                        if (sid == pid) {
                            f = true;
                            break;
                        }
                    }
                    if (!f)
                        cpy.push(p);
                }
                _this.tabSelC.setState(cpy);
            });
            this.btnCpC = new WUX.WButton(this.subId('bbcc'), '', GUI.ICO.COPY, WUX.BTN.SECONDARY, { p: '1px 7px 1px 7px' });
            this.btnCpC.tooltip = 'Copia collaboratori';
            this.btnCpC.on('click', function (e) {
                var items = _this.tabSelC.getState();
                if (!items || !items.length) {
                    WUX.showSuccess('Nessun elemento selezionato');
                    return;
                }
                GUI.cp_collb = items;
                WUX.showSuccess('Collaboratori copiati nella clipboard');
            });
            this.btnPaC = new WUX.WButton(this.subId('bbpc'), '', GUI.ICO.PASTE, WUX.BTN.WARNING, { p: '1px 7px 1px 7px' });
            this.btnPaC.tooltip = 'Incolla collaboratori';
            this.btnPaC.enabled = false;
            this.btnPaC.on('click', function (e) {
                if (!GUI.cp_collb) {
                    WUX.showWarning('Non vi sono collaboratori nella clipboard');
                    return;
                }
                _this.tabSelC.setState(GUI.cp_collb);
            });
            this.cntActions = new GUI.CFTableActions('ta');
            this.cntActions.left.add(this.btnOpen);
            this.cntActions.left.add(this.btnDelete);
            this.cntActions.left.add(this.btnSave);
            this.cntActions.left.add(this.btnCancel);
            this.cntActions.right.add(this.btnNew);
            this.cntActions2 = new GUI.CFTableActions('ta2');
            this.cntActions2.left.add(this.btnOpen2);
            this.cntActions2.left.add(this.btnDelete2);
            this.cntActions2.left.add(this.btnSave2);
            this.cntActions2.left.add(this.btnCancel2);
            this.tagsFilter = new WUX.WTags('tf');
            var cntTab0A = new WUX.WContainer(this.subId('ct0a'), '');
            cntTab0A
                .addRow()
                .addCol('11', { p: 0 })
                .add(this.tabSelA)
                .addCol('1', { p: 0 })
                .addStack(WUX.CSS.STACK_BTNS, this.btnSxA, this.btnDxA, this.btnCpA, this.btnPaA);
            var cntTab0C = new WUX.WContainer(this.subId('ct0c'), '');
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
            this.tcoDetail.on('statechange', function (e) {
                var itab = _this.tcoDetail.getState();
                switch (itab) {
                    case 0:
                        break;
                    case 1:
                        _this.tabSelA.refresh();
                        _this.tabAllA.refresh();
                        break;
                    case 2:
                        _this.tabSelC.refresh();
                        _this.tabAllC.refresh();
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
                .end()
                .addBox()
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, this.cntActions, this.tabResult, this.cntActions2)
                .end()
                .addRow()
                .addCol('12').section('Dettaglio')
                .add(this.tcoDetail);
            return this.container;
        };
        GUITrattamenti.prototype.collapseHandler = function (e) {
            var c = WUtil.getBoolean(e.data, 'collapsed');
            if (c) {
                this.tagsFilter.setState({});
            }
            else {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
            }
        };
        GUITrattamenti.prototype.onSelect = function () {
            var _this = this;
            var item = WUtil.getItem(this.tabResult.getSelectedRowsData(), 0);
            if (!item)
                return;
            var id = WUtil.getNumber(item, GUI.IPrestazione.sID);
            if (!id)
                return;
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
            var idf = WUtil.toNumber(this.selFar.getState(), 0);
            jrpc.execute('PRESTAZIONI.read', [id, idf], function (result) {
                _this.fpDetail.setState(result);
                _this.tabSelA.setState(WUtil.getArray(result, GUI.IPrestazione.sATTREZZATURE));
                _this.tabSelC.setState(WUtil.getArray(result, GUI.IPrestazione.sCOLLABORATORI));
                _this.status = _this.iSTATUS_VIEW;
            });
        };
        GUITrattamenti.prototype.calcPrezzi = function () {
            var pl = WUtil.toNumber(this.fpDetail.getValue(GUI.IPrestazione.sPREZZO_LISTINO));
            var sa = WUtil.toNumber(this.fpDetail.getValue(GUI.IPrestazione.sSCONTO_ASS));
            var sp = WUtil.toNumber(this.fpDetail.getValue(GUI.IPrestazione.sSCONTO_PERC));
            var pf = 0;
            if (sa) {
                pf = pl - sa;
            }
            else {
                pf = GUI.CFUtil.scontato(pl, sp);
            }
            if (pf < 0)
                pf = 0;
            var pt = Math.floor(Math.floor(pf / 5) * 2.5);
            this.fpDetail.setValue(GUI.IPrestazione.sPREZZO_FINALE, WUX.formatCurr(pf));
            this.fpDetail.setValue(GUI.IPrestazione.sPUNTI_COLL, pt);
        };
        GUITrattamenti.prototype.componentDidMount = function () {
            var idf = 0;
            if (GUI.strutture && GUI.strutture.length) {
                idf = GUI.strutture[0].id;
            }
            if (idf)
                this.selFar.setState(idf);
        };
        return GUITrattamenti;
    }(WUX.WComponent));
    GUI.GUITrattamenti = GUITrattamenti;
})(GUI || (GUI = {}));
var GUI;
(function (GUI) {
    var WUtil = WUX.WUtil;
    var GUIUtentiDesk = (function (_super) {
        __extends(GUIUtentiDesk, _super);
        function GUIUtentiDesk(id) {
            var _this = _super.call(this, id ? id : '*', 'GUIUtentiDesk') || this;
            _this.iSTATUS_STARTUP = 0;
            _this.iSTATUS_VIEW = 1;
            _this.iSTATUS_EDITING = 2;
            _this.status = _this.iSTATUS_STARTUP;
            return _this;
        }
        GUIUtentiDesk.prototype.render = function () {
            var _this = this;
            this.btnFind = new WUX.WButton(this.subId('bf'), GUI.TXT.FIND, '', WUX.BTN.SM_PRIMARY);
            this.btnFind.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var check = _this.fpFilter.checkMandatory(true, true, false);
                if (check) {
                    WUX.showWarning('Specificare i seguenti campi: ' + check);
                    return;
                }
                var box = WUX.getComponent('boxFilter');
                if (box instanceof WUX.WBox) {
                    _this.tagsFilter.setState(_this.fpFilter.getValues(true));
                    box.collapse();
                }
                jrpc.execute('UTENTI_DESK.find', [GUI.CFUtil.putUserInfo(_this.fpFilter.getState())], function (result) {
                    _this.tabResult.setState(result);
                    _this.fpDetail.clear();
                    _this.status = _this.iSTATUS_STARTUP;
                    if (_this.selId) {
                        var idx_20 = WUtil.indexOf(result, GUI.IUtenteDesk.sID, _this.selId);
                        if (idx_20 >= 0) {
                            setTimeout(function () {
                                _this.tabResult.select([idx_20]);
                            }, 100);
                        }
                        _this.selId = null;
                    }
                });
            });
            this.btnReset = new WUX.WButton(this.subId('br'), GUI.TXT.RESET, '', WUX.BTN.SM_SECONDARY);
            this.btnReset.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                _this.fpFilter.clear();
                _this.tagsFilter.setState({});
                _this.tabResult.setState([]);
                _this.fpDetail.clear();
                _this.status = _this.iSTATUS_STARTUP;
            });
            this.selFar = new GUI.CFSelectStruture();
            this.selFar.on('statechange', function (e) {
                _this.tabResult.setState([]);
                _this.fpDetail.clear();
            });
            this.fpFilter = new WUX.WFormPanel(this.subId('ff'));
            this.fpFilter.addRow();
            this.fpFilter.addComponent(GUI.IUtenteDesk.sID_FAR, 'Struttura', this.selFar);
            this.fpFilter.addTextField(GUI.IUtenteDesk.sUSERNAME, 'Username');
            this.fpFilter.setMandatory(GUI.IUtenteDesk.sID_FAR);
            this.fpDetail = new WUX.WFormPanel(this.subId('fpd'));
            this.fpDetail.addRow();
            this.fpDetail.addTextField(GUI.IUtenteDesk.sUSERNAME, 'Username');
            this.fpDetail.addTextField(GUI.IUtenteDesk.sPASSWORD, 'Password');
            this.fpDetail.addTextField(GUI.IUtenteDesk.sNOTE, 'Note');
            this.fpDetail.addBooleanField(GUI.IUtenteDesk.sABILITATO, 'Abilitato');
            this.fpDetail.addInternalField(GUI.IUtenteDesk.sID);
            this.fpDetail.enabled = false;
            this.fpDetail.setMandatory(GUI.IUtenteDesk.sUSERNAME, GUI.IUtenteDesk.sPASSWORD);
            this.fpFilter.onEnterPressed(function (e) {
                _this.btnFind.trigger('click');
            });
            this.btnNew = new WUX.WButton(this.subId('bn'), GUI.TXT.NEW, '', WUX.BTN.SM_INFO);
            this.btnNew.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING) {
                    _this.btnNew.blur();
                    return;
                }
                _this.isNew = true;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.tabResult.clearSelection();
                _this.fpDetail.enabled = true;
                _this.fpDetail.clear();
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnOpen = new WUX.WButton(this.subId('bo'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    _this.btnOpen.blur();
                    return;
                }
                var sr = _this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    _this.btnOpen.blur();
                    return;
                }
                _this.isNew = false;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.fpDetail.enabled = true;
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnSave = new WUX.WButton(this.subId('bs'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    WUX.showWarning('Cliccare su Modifica.');
                    _this.btnSave.blur();
                    return;
                }
                var check = _this.fpDetail.checkMandatory(true);
                if (check) {
                    _this.btnSave.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                var idf = WUtil.toNumber(_this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Selezionare la struttura di competenza');
                    return;
                }
                var values = _this.fpDetail.getState();
                values[GUI.IUtenteDesk.sID_FAR] = idf;
                var ck = jrpc.executeSync('UTENTI_DESK.exists', [values]);
                if (ck) {
                    WUX.showWarning(ck + ' gi&agrave; utilizzata.');
                    return;
                }
                if (_this.isNew) {
                    jrpc.execute('UTENTI_DESK.insert', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.selId = result[GUI.IUtenteDesk.sID];
                        _this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('UTENTI_DESK.update', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.selId = result[GUI.IUtenteDesk.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            _this.btnFind.trigger('click');
                        }
                        else {
                            var idx_21 = selRows[0];
                            var records = _this.tabResult.getState();
                            records[idx_21] = result;
                            _this.tabResult.refresh();
                            setTimeout(function () {
                                _this.tabResult.select([idx_21]);
                            }, 100);
                        }
                    });
                }
            });
            this.btnCancel = new WUX.WButton(this.subId('bc'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    _this.btnCancel.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, function (res) {
                    if (!res)
                        return;
                    if (_this.isNew) {
                        _this.fpDetail.clear();
                    }
                    else {
                        _this.onSelect();
                    }
                    _this.status = _this.iSTATUS_VIEW;
                    _this.fpDetail.enabled = false;
                    _this.selId = null;
                });
            });
            this.btnDelete = new WUX.WButton(this.subId('bd'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete.on('click', function (e) {
                _this.selId = null;
                _this.btnDelete.blur();
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length)
                    return;
                var id = WUtil.getInt(rd[0], GUI.IUtenteDesk.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, function (res) {
                    if (!res)
                        return;
                    jrpc.execute('UTENTI_DESK.delete', [id], function (result) {
                        _this.btnFind.trigger('click');
                    });
                });
            });
            this.btnOpen2 = new WUX.WButton(this.subId('bo2'), GUI.TXT.OPEN, GUI.ICO.OPEN, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnOpen2.on('click', function (e) {
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    _this.btnOpen2.blur();
                    return;
                }
                var sr = _this.tabResult.getSelectedRows();
                if (!sr || !sr.length) {
                    WUX.showWarning('Seleziona l\'elemento da modificare');
                    _this.btnOpen2.blur();
                    return;
                }
                _this.isNew = false;
                _this.status = _this.iSTATUS_EDITING;
                _this.selId = null;
                _this.fpDetail.enabled = true;
                setTimeout(function () { _this.fpDetail.focus(); }, 100);
            });
            this.btnSave2 = new WUX.WButton(this.subId('bs2'), GUI.TXT.SAVE, GUI.ICO.SAVE, WUX.BTN.ACT_OUTLINE_PRIMARY);
            this.btnSave2.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    WUX.showWarning('Cliccare su Modifica.');
                    _this.btnSave2.blur();
                    return;
                }
                var check = _this.fpDetail.checkMandatory(true);
                if (check) {
                    _this.btnSave2.blur();
                    WUX.showWarning('Specificare: ' + check);
                    return;
                }
                var idf = WUtil.toNumber(_this.selFar.getState());
                if (!idf) {
                    WUX.showWarning('Selezionare la struttura di competenza');
                    return;
                }
                var values = _this.fpDetail.getState();
                values[GUI.IUtenteDesk.sID_FAR] = idf;
                var ck = jrpc.executeSync('UTENTI_DESK.exists', [values]);
                if (ck) {
                    WUX.showWarning(ck + ' gi&agrave; utilizzata.');
                    return;
                }
                if (_this.isNew) {
                    jrpc.execute('UTENTI_DESK.insert', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.selId = result[GUI.IUtenteDesk.sID];
                        _this.btnFind.trigger('click');
                    });
                }
                else {
                    jrpc.execute('UTENTI_DESK.update', [GUI.CFUtil.putUserInfo(values)], function (result) {
                        _this.status = _this.iSTATUS_VIEW;
                        _this.fpDetail.enabled = false;
                        _this.selId = result[GUI.IUtenteDesk.sID];
                        var selRows = _this.tabResult.getSelectedRows();
                        if (!selRows || !selRows.length) {
                            _this.btnFind.trigger('click');
                        }
                        else {
                            var idx_22 = selRows[0];
                            var records = _this.tabResult.getState();
                            records[idx_22] = result;
                            _this.tabResult.refresh();
                            setTimeout(function () {
                                _this.tabResult.select([idx_22]);
                            }, 100);
                        }
                    });
                }
            });
            this.btnCancel2 = new WUX.WButton(this.subId('bc2'), GUI.TXT.CANCEL, GUI.ICO.CANCEL, WUX.BTN.ACT_OUTLINE_INFO);
            this.btnCancel2.on('click', function (e) {
                if (_this.status != _this.iSTATUS_EDITING) {
                    _this.btnCancel2.blur();
                    return;
                }
                WUX.confirm(GUI.MSG.CONF_CANCEL, function (res) {
                    if (!res)
                        return;
                    if (_this.isNew) {
                        _this.fpDetail.clear();
                    }
                    else {
                        _this.onSelect();
                    }
                    _this.status = _this.iSTATUS_VIEW;
                    _this.fpDetail.enabled = false;
                    _this.selId = null;
                });
            });
            this.btnDelete2 = new WUX.WButton(this.subId('bd2'), GUI.TXT.DELETE, GUI.ICO.DELETE, WUX.BTN.ACT_OUTLINE_DANGER);
            this.btnDelete2.on('click', function (e) {
                _this.selId = null;
                _this.btnDelete2.blur();
                if (_this.status == _this.iSTATUS_EDITING || _this.status == _this.iSTATUS_STARTUP) {
                    WUX.showWarning('Elemento in fase di modifica.');
                    return;
                }
                var rd = _this.tabResult.getSelectedRowsData();
                if (!rd || !rd.length)
                    return;
                var id = WUtil.getInt(rd[0], GUI.IUtenteDesk.sID);
                WUX.confirm(GUI.MSG.CONF_DELETE, function (res) {
                    if (!res)
                        return;
                    jrpc.execute('UTENTI_DESK.delete', [id], function (result) {
                        _this.btnFind.trigger('click');
                    });
                });
            });
            var rc = [
                ['Username', GUI.IUtenteDesk.sUSERNAME, 's'],
                ['Note', GUI.IUtenteDesk.sNOTE, 's'],
                ['Abilitato', GUI.IUtenteDesk.sABILITATO, 'b']
            ];
            this.tabResult = new WUX.WDXTable(this.subId('tr'), WUtil.col(rc, 0), WUtil.col(rc, 1));
            this.tabResult.types = WUtil.col(rc, 2);
            this.tabResult.css({ h: 220 });
            this.tabResult.widths = [100];
            this.tabResult.onSelectionChanged(function (e) {
                _this.onSelect();
            });
            this.cntActions = new GUI.CFTableActions('ta');
            this.cntActions.left.add(this.btnOpen);
            this.cntActions.left.add(this.btnDelete);
            this.cntActions.left.add(this.btnSave);
            this.cntActions.left.add(this.btnCancel);
            this.cntActions.right.add(this.btnNew);
            this.cntActions2 = new GUI.CFTableActions('ta2');
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
                .end()
                .addBox()
                .addGroup({ classStyle: 'search-actions-and-results-wrapper' }, this.cntActions, this.tabResult, this.cntActions2)
                .end()
                .addRow()
                .addCol('12').section('Dettaglio')
                .add(this.tcoDetail);
            return this.container;
        };
        GUIUtentiDesk.prototype.collapseHandler = function (e) {
            var c = WUtil.getBoolean(e.data, 'collapsed');
            if (c) {
                this.tagsFilter.setState({});
            }
            else {
                this.tagsFilter.setState(this.fpFilter.getValues(true));
            }
        };
        GUIUtentiDesk.prototype.onSelect = function () {
            var _this = this;
            var item = WUtil.getItem(this.tabResult.getSelectedRowsData(), 0);
            if (!item)
                return;
            var id = WUtil.getNumber(item, GUI.IUtenteDesk.sID);
            if (!id)
                return;
            this.fpDetail.clear();
            if (this.status == this.iSTATUS_EDITING) {
                WUX.showWarning('Modifiche annullate');
                this.fpDetail.enabled = false;
            }
            jrpc.execute('UTENTI_DESK.read', [id], function (result) {
                _this.fpDetail.setState(result);
                _this.status = _this.iSTATUS_VIEW;
            });
        };
        GUIUtentiDesk.prototype.componentDidMount = function () {
            var idf = 0;
            if (GUI.strutture && GUI.strutture.length) {
                idf = GUI.strutture[0].id;
            }
            if (idf)
                this.selFar.setState(idf);
        };
        return GUIUtentiDesk;
    }(WUX.WComponent));
    GUI.GUIUtentiDesk = GUIUtentiDesk;
})(GUI || (GUI = {}));
//# sourceMappingURL=bookme.js.map