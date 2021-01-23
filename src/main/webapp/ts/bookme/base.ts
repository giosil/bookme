namespace GUI {

    import WUtil = WUX.WUtil;

    export let URL_DEV = 'http://localhost:8080/bookme';
    export let GRP_DEV = '3';

    export interface User {
        id: number;
        userName: string;

        currLogin: Date;
        tokenId: string;

        lastName?: string;
        firstName?: string;
        email?: string;
        mobile?: string;
        role?: string;
        reference?: string;
        locale?: string;

        groups?: string[];
        structures?: string[];
    }

    /**
     * See below
     */
    export function getUserLogged(): User {
        let userLogged = window ? window['_userLogged'] : undefined;
        if (userLogged && typeof userLogged == 'object') return userLogged as User;
        return { id: 1, userName: 'dew', currLogin: new Date(), role: 'admin', groups: [GRP_DEV], structures:[], email: 'test@dew.org', mobile: '3491234567', tokenId: 'KURJPghMTJ'};
    }

    export function getConfig(): any {
        let config = window ? window['_config'] : undefined;
        if (config && typeof config == 'object') return config;
        return {};
    }

    export function getLocale(): string {
        let u = getUserLogged();
        if(u != null && u.locale) return u.locale;
        return WUX.WUtil.getString(getConfig(), 'locale', '');
    }

    export function isDevMode(): boolean {
        let userLogged = window ? window['_userLogged'] : undefined;
        if (userLogged && typeof userLogged == 'object') return false;
        return true;
    }

    export class AppUtil {
        static putUserInfo(params: any): any {
            let user = getUserLogged();
            if (!params) {
                return { '_usr': user.userName, '_grp': WUtil.toNumber(WUtil.getFirst(GUI.getUserLogged().groups, GRP_DEV)) };
            }
            if (Array.isArray(params)) {
                params.push(user.userName);
                params.push(WUtil.toNumber(WUtil.getFirst(GUI.getUserLogged().groups, GRP_DEV)) );
                return params;
            }
            params._usr = user.userName;
            params._grp = WUtil.toNumber(WUtil.getFirst(GUI.getUserLogged().groups, GRP_DEV));
            return params;
        }

        static addUserInfo(params: any[]): any[] {
            let user = getUserLogged();
            if (!params) {
                return [ user.userName, WUtil.toNumber(WUtil.getFirst(GUI.getUserLogged().groups, GRP_DEV)) ];
            }
            params.push(user.userName);
            params.push(WUtil.toNumber(WUtil.getFirst(GUI.getUserLogged().groups, GRP_DEV)));
            return params;
        }

        static getUserInfo(): { '_usr': string, '_grp': number } {
            let user = getUserLogged();
            return { '_usr': user.userName, '_grp': WUtil.toNumber(WUtil.getFirst(GUI.getUserLogged().groups, GRP_DEV)) };
        }

        static scontato(costoBase: number, s1: number = 0, s2: number = 0, s3: number = 0, s4: number = 0, s5: number = 0): number {
            if (!costoBase || costoBase < 0) return 0;
            let r = costoBase;
            if (s1) r = WUX.WUtil.round2(r * ((100 - s1) / 100));
            if (s2) r = WUX.WUtil.round2(r * ((100 - s2) / 100));
            if (s3) r = WUX.WUtil.round2(r * ((100 - s3) / 100));
            if (s4) r = WUX.WUtil.round2(r * ((100 - s4) / 100));
            if (s5) r = WUX.WUtil.round2(r * ((100 - s5) / 100));
            if (r < 0) return 0;
            return r;
        }
    }

    export class BookmeCfg {

        /** Se abilitato viene richiesta la password ad ogni operazione di prenotazione / aggiornamento */
        static CHECK_USER_DESK = false;

    }

    export class IAttrezzatura {
        static sID = 'id';
        static sID_FAR = 'idFar';
        static sCODICE = 'codice';
        static sDESCRIZIONE = 'descrizione';
        static sUBICAZIONE = 'ubicazione';
        static sPRESTAZIONI = 'prestazioni';
    }

    export class IComunicazione {
        static sID = 'id';
        static sID_FAR = 'idFar';
        static sOGGETTO = 'oggetto';
        static sMESSAGGIO = 'messaggio';
        static sMEZZO = 'mezzo';
        static sCODA = 'coda';
    }

    export class IChiusura {
        static sID = 'id';
        static sID_FAR = 'idFar';
        static sDATA = 'data';
        static sMESE_GIORNO = 'meseGiorno';
        static sDESCRIZIONE = 'descrizione';
        static sANNUALE = 'annuale';
    }

    export class ICollaboratore {
        static sID = 'id';
        static sID_FAR = 'idFar';
        static sNOME = 'nome';
        static sCOLORE = 'colore';
        static sORDINE = 'ordine';
        static sPREN_ONLINE = 'prenOnLine';
        static sVISIBILE = 'visibile';
        static sPRESTAZIONI = 'prestazioni';
        static sAGENDA = 'agenda';
        static sVARIAZIONI = 'variazioni';
    }

    export class ICliente {
        static sID = 'id';
        static sCOGNOME = 'cognome';
        static sNOME = 'nome';
        static sSESSO = 'sesso';
        static sDATA_NASCITA = 'dataNascita';
        static sCODICE_FISCALE = 'codiceFiscale';
        static sTELEFONO1 = 'telefono1';
        static sTELEFONO2 = 'telefono2';
        static sEMAIL = 'email';
        static sNOTE = 'note';
        static sPRENOTAZIONI = 'prenotazioni';
        static sNOMINATIVO = 'nominativo';
        static sREPUTAZIONE = 'reputazione';
        static sETA_DA = 'etaDa';
        static sETA_A = 'etaA';
        static sOPZIONI = 'opzioni'
        static sDIS_PREN_ONLINE = 'disPrenOnLine';
    }

    export class IGruppoPrest {
        static sID = 'id';
        static sID_FAR = 'idFar';
        static sCODICE = 'codice';
        static sDESCRIZIONE = 'descrizione';
    }

    export class IPrestazione {
        static sID = 'id';
        static sID_FAR = 'idFar';
        static sCODCSF = 'codCsf';
        static sCODICE = 'codice';
        static sDESCRIZIONE = 'descrizione';
        static sDURATA = 'durata';
        static sTIPO_PREZZO = 'tipoPrezzo';
        static sPREN_ONLINE = 'prenOnLine';
        static sFLAG_POSA = 'flagPosa';
        static sPREZZO_LISTINO = 'prezzoListino';
        static sSCONTO_ASS = 'scontoAss';
        static sSCONTO_PERC = 'scontoPerc';
        static sPREZZO_FINALE = 'prezzoFinale';
        static sAVVERTENZE = 'avvertenze';
        static sINDICAZIONI = 'indicazioni';
        static sGRUPPO = 'gruppo';
        static sDESC_GRUPPO = 'descGruppo';
        static sTIPO = 'tipo';
        static sDESC_TIPO = 'descTipo';
        static sATTREZZATURE = 'attrezzature';
        static sCOLLABORATORI = 'collaboratori';
        static sPUNTI_COLL = 'puntiColl';
    }

    export class ICalendario {
        static sDATA = 'data';
        static sID_FAR = 'id_far';
        static sID_COLLABORATORE = 'id_collaboratore';

        static sRIGENERA = 'rigenera';
        static sAGGIORNA = 'aggiorna';
        static sNO_APPUNTAMENTI = 'no_appts';


        static sRISORSE = 'resources';
        static sSLOTS = 'slots';
        static sAPPUNTAMENTI = 'appts';
        static sORARI = 'times';

        static sCHECK_USER_DESK = 'ckUserDesk';
    }

    export class IPrenotazione {
        static sID = 'id';
        static sID_FAR = 'idFar';
        static sCOD_FAR = 'codFar';
        static sID_COLL = 'idColl';
        static sDESC_COLL = 'descColl';
        static sCOLORE = 'colore';
        static sID_CLIENTE = 'idCliente';
        static sDESC_CLIENTE = 'descCliente';
        static sTELEFONO1 = 'tel1';
        static sTELEFONO2 = 'tel2';
        static sEMAIL = 'email';
        static sID_PREST = 'idPrest';
        static sDESC_PREST = 'descPrest';
        static sID_ATTR = 'idAttr';
        static sDESC_ATTR = 'descAttr';
        static sDATA_PREN = 'dataPren';
        static sDATA_UPD = 'dataUpd';
        static sDATA_APP = 'dataApp';
        static sORA_APP = 'oraApp';
        static sORA_FINE = 'oraFine';
        static sDURATA = 'durata';
        static sSTATO = 'stato';
        static sTIPO = 'tipo';
        static sPREZZO_FINALE = 'prezzoFinale';
        static sALLA_DATA = 'allaData';
        static sPREN_ONLINE = 'prenOnLine';
        static sPAGATO = 'pagato';
        static sNOTE = 'note';
        static sNOTE_CLIENTE = 'noteCliente';
        static sOVERBOOKING = 'overbooking';
        static sTIPO_PAG = 'tipoPag';
        static sPRESTAZIONI = 'prestazioni';
        static sDURATE = 'durate';
        static sMESSAGGIO = 'messaggio';
        static sPREFERENZE = 'preferenze';
        static sIMP_PAGATO = 'impPagato';
        static sCOD_COUPON = 'codCoupon';
        static sCAUSALE = 'causale';
        static sUSERDESK = 'userDesk';
        static sCHECK_USER_DESK = 'ckUserDesk';

        static sCAMBIO_ID_COLL = 'cambioIdColl';
        static sCAMBIO_DATA = 'cambioData';
        static sCAMBIO_ORA = 'cambioOra';
        static sCAMBIO_DAL = 'cambioDal';
        static sCAMBIO_AL = 'cambioAl';

        // Extra
        static sMATTINO = 'mattino';
        static sPOMERIGGIO = 'pomeriggio';
        static sIGNORE_CHECK = 'ignoreCheck';
    }

    export class IUtenteDesk {
        static sID = 'id';
        static sID_FAR = 'idFar';
        static sUSERNAME = 'username';
        static sPASSWORD = 'password';
        static sNOTE = 'note';
        static sABILITATO = 'abilitato';
    }

    export interface AgendaModello {
        id?: number;
        idAgenda?: number;
        settDispari?: boolean;
        settPari?: boolean;
        giorno?: number;
        progressivo?: number;
        oraInizio?: number;
        oraFine?: number;
        tipologia?: string;
        valore?: number;
        prenOnLine?: boolean;
        attivo?: boolean;
    }

    export interface Agenda {
        id?: number;
        idCollaboratore?: number;
        descrizione?: string;
        giorni?: string;
        settimaneAlt?: boolean;
        inizioValidita?: Date;
        fineValidita?: Date;
        fasceOrarie?: AgendaModello[];
        attivo?: boolean;
    }

    export interface Prenotazione {
        id?: number;
        codice?: string;
        idCliente?: number;
        descCliente?: string;
        idColl?: number;
        idAttr?: number;
        idPrest?: number;
        descPrest?: string;
        dataApp?: Date;
        oraApp?: string;
        durata?: number;
        stato?: string;
        tipo?: string;
    }

    export interface Calendario {
        id?: number;
        idAgenda?: number;
        idAgendaMod?: number;
        idCollaboratore?: number;
        nomeCollab?: string;
        data?: Date;
        giorno?: number;
        progressivo?: number;
        oraInizio?: number;
        oraFine?: number;
        tipologia?: string;
        altriCollab?: string;
        prestCollab?: { [prestId: string]: string };
    }

    export function isBookOper(): boolean {
        let user = getUserLogged();
        if (!user) return false;
        if (user.userName && user.userName.indexOf('_oper') >= 0) return true;
        if (user.reference && user.reference.toLowerCase().indexOf('oper') >= 0) return true;
        return false;
    }

    export function isBookDesk(): boolean {
        let user = getUserLogged();
        if (!user) return false;
        if (user.userName && user.userName.indexOf('_desk') >= 0) return true;
        if (user.reference && user.reference.toLowerCase().indexOf('desk') >= 0) return true;
        return false;
    }

    // Dopo l'anno bisestile si passa da una settimana dispari (ad es. il 3/01/2021 e' 53a settimana)
	// ad una settimana dispari (ad es. il 04/01/2021 e' 1a settimana).
	// Tale problema sfasa l'alternanza delle settimane.
	// Utilizzare getWeek2020 che usa come riferimento il 2020: non serve il numero della settimana in
	// se' ma e' necessario preservare l'alternanza pari / dispari.
    export function getWeek2020(d?: Date): number {
        if (!d) d = new Date();
        return Math.floor(WUX.WUtil.diffDays(d, new Date(2019, 11, 30)) / 7) + 1;
    }

    export let __d: DlgCheckDesk;
    export let __m: string;
    export let __p: any[];
    export let __s: (result: any) => void;

    export function chkExecute(methodName: string, params: any[], successHandler?: (result: any) => void): void {
        if (!BookmeCfg.CHECK_USER_DESK) {
            jrpc.execute(methodName, params, successHandler);
            return;
        }
        __m = methodName;
        __p = params;
        __s = successHandler;
        if (!__d) {
            __d = new DlgCheckDesk('dlgckdesk');
            __d.onHiddenModal((e: JQueryEventObject) => {
                if (!__d.ok) {
                    WUX.showWarning('Operazione annullata.');
                    return;
                }
                let c = __d.getState();
                if (!c) {
                    WUX.showWarning('Password non corretta. Operazione annullata.');
                    return;
                }
                let r = jrpc.executeSync('UTENTI_DESK.check', [c]);
                if (!r) {
                    WUX.showWarning('Password non valida. Operazione annullata.');
                    return;
                }
                if (!__p) __p = [];
                let p0 = __p.length ? __p[0] : null;
                if (typeof p0 === 'object' && p0 !== null) {
                    p0[IPrenotazione.sUSERDESK] = r;
                }
                else if (p0 === null) {
                    __p[0] = r;
                }
                else {
                    __p.push(r);
                }
                if (!__m) {
                    WUX.showWarning('Riferimento operazione assente.');
                    return;
                }
                jrpc.execute(__m, __p, __s);
            });
        }
        __d.show();
    }
}

WUX.global.locale = GUI.getLocale();

var jrpc = new JRPC("/bookme/rpc");

jrpc.setUserName(GUI.getUserLogged().userName);
jrpc.setPassword('' + WUX.WUtil.getFirst(GUI.getUserLogged().groups, GUI.GRP_DEV));
