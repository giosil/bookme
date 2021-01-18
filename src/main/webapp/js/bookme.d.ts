declare namespace GUI {
    let URL_DEV: string;
    let GRP_DEV: string;
    interface User {
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
    function getUserLogged(): User;
    function getConfig(): any;
    function getLocale(): string;
    function isDevMode(): boolean;
    class CFUtil {
        static putUserInfo(params: any): any;
        static addUserInfo(params: any[]): any[];
        static getUserInfo(): {
            '_usr': string;
            '_grp': number;
        };
        static scontato(costoBase: number, s1?: number, s2?: number, s3?: number, s4?: number, s5?: number): number;
    }
    class CFBookCfg {
        static CHECK_USER_DESK: boolean;
    }
    class IAttrezzatura {
        static sID: string;
        static sID_FAR: string;
        static sCODICE: string;
        static sDESCRIZIONE: string;
        static sUBICAZIONE: string;
        static sPRESTAZIONI: string;
    }
    class IComunicazione {
        static sID: string;
        static sID_FAR: string;
        static sOGGETTO: string;
        static sMESSAGGIO: string;
        static sMEZZO: string;
        static sCODA: string;
    }
    class IChiusura {
        static sID: string;
        static sID_FAR: string;
        static sDATA: string;
        static sMESE_GIORNO: string;
        static sDESCRIZIONE: string;
        static sANNUALE: string;
    }
    class ICollaboratore {
        static sID: string;
        static sID_FAR: string;
        static sNOME: string;
        static sCOLORE: string;
        static sORDINE: string;
        static sPREN_ONLINE: string;
        static sVISIBILE: string;
        static sPRESTAZIONI: string;
        static sAGENDA: string;
        static sVARIAZIONI: string;
    }
    class ICliente {
        static sID: string;
        static sCOGNOME: string;
        static sNOME: string;
        static sSESSO: string;
        static sDATA_NASCITA: string;
        static sCODICE_FISCALE: string;
        static sTELEFONO1: string;
        static sTELEFONO2: string;
        static sEMAIL: string;
        static sNOTE: string;
        static sPRENOTAZIONI: string;
        static sNOMINATIVO: string;
        static sREPUTAZIONE: string;
        static sETA_DA: string;
        static sETA_A: string;
        static sOPZIONI: string;
        static sDIS_PREN_ONLINE: string;
    }
    class IGruppoPrest {
        static sID: string;
        static sID_FAR: string;
        static sCODICE: string;
        static sDESCRIZIONE: string;
    }
    class IPrestazione {
        static sID: string;
        static sID_FAR: string;
        static sCODCSF: string;
        static sCODICE: string;
        static sDESCRIZIONE: string;
        static sDURATA: string;
        static sTIPO_PREZZO: string;
        static sPREN_ONLINE: string;
        static sFLAG_POSA: string;
        static sPREZZO_LISTINO: string;
        static sSCONTO_ASS: string;
        static sSCONTO_PERC: string;
        static sPREZZO_FINALE: string;
        static sAVVERTENZE: string;
        static sINDICAZIONI: string;
        static sGRUPPO: string;
        static sDESC_GRUPPO: string;
        static sTIPO: string;
        static sDESC_TIPO: string;
        static sATTREZZATURE: string;
        static sCOLLABORATORI: string;
        static sPUNTI_COLL: string;
    }
    class ICalendario {
        static sDATA: string;
        static sID_FAR: string;
        static sID_COLLABORATORE: string;
        static sRIGENERA: string;
        static sAGGIORNA: string;
        static sNO_APPUNTAMENTI: string;
        static sRISORSE: string;
        static sSLOTS: string;
        static sAPPUNTAMENTI: string;
        static sORARI: string;
        static sCHECK_USER_DESK: string;
    }
    class IPrenotazione {
        static sID: string;
        static sID_FAR: string;
        static sCOD_FAR: string;
        static sID_COLL: string;
        static sDESC_COLL: string;
        static sCOLORE: string;
        static sID_CLIENTE: string;
        static sDESC_CLIENTE: string;
        static sTELEFONO1: string;
        static sTELEFONO2: string;
        static sEMAIL: string;
        static sID_PREST: string;
        static sDESC_PREST: string;
        static sID_ATTR: string;
        static sDESC_ATTR: string;
        static sDATA_PREN: string;
        static sDATA_UPD: string;
        static sDATA_APP: string;
        static sORA_APP: string;
        static sORA_FINE: string;
        static sDURATA: string;
        static sSTATO: string;
        static sTIPO: string;
        static sPREZZO_FINALE: string;
        static sALLA_DATA: string;
        static sPREN_ONLINE: string;
        static sPAGATO: string;
        static sNOTE: string;
        static sNOTE_CLIENTE: string;
        static sOVERBOOKING: string;
        static sTIPO_PAG: string;
        static sPRESTAZIONI: string;
        static sDURATE: string;
        static sMESSAGGIO: string;
        static sPREFERENZE: string;
        static sIMP_PAGATO: string;
        static sCOD_COUPON: string;
        static sCAUSALE: string;
        static sUSERDESK: string;
        static sCHECK_USER_DESK: string;
        static sCAMBIO_ID_COLL: string;
        static sCAMBIO_DATA: string;
        static sCAMBIO_ORA: string;
        static sCAMBIO_DAL: string;
        static sCAMBIO_AL: string;
        static sMATTINO: string;
        static sPOMERIGGIO: string;
        static sIGNORE_CHECK: string;
    }
    class IUtenteDesk {
        static sID: string;
        static sID_FAR: string;
        static sUSERNAME: string;
        static sPASSWORD: string;
        static sNOTE: string;
        static sABILITATO: string;
    }
    interface AgendaModello {
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
    interface Agenda {
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
    interface Prenotazione {
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
    interface Calendario {
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
        prestCollab?: {
            [prestId: string]: string;
        };
    }
    function isBookOper(): boolean;
    function isBookDesk(): boolean;
    function getWeek2020(d?: Date): number;
    let __d: DlgCheckDesk;
    let __m: string;
    let __p: any[];
    let __s: (result: any) => void;
    function chkExecute(methodName: string, params: any[], successHandler?: (result: any) => void): void;
}
declare var jrpc: JRPC;
declare namespace GUI {
    class GUICabine extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected tagsFilter: WUX.WTags;
        protected fpFilter: WUX.WFormPanel;
        protected selFar: CFSelectStruture;
        protected btnFind: WUX.WButton;
        protected btnReset: WUX.WButton;
        protected btnNew: WUX.WButton;
        protected cntActions: CFTableActions;
        protected btnOpen: WUX.WButton;
        protected btnSave: WUX.WButton;
        protected btnCancel: WUX.WButton;
        protected btnDelete: WUX.WButton;
        protected cntActions2: CFTableActions;
        protected btnOpen2: WUX.WButton;
        protected btnSave2: WUX.WButton;
        protected btnCancel2: WUX.WButton;
        protected btnDelete2: WUX.WButton;
        protected tabResult: WUX.WDXTable;
        protected selId: any;
        protected tcoDetail: WUX.WTab;
        protected fpDetail: WUX.WFormPanel;
        protected tabSel: WUX.WDXTable;
        protected tabAll: WUX.WDXTable;
        protected btnSx: WUX.WButton;
        protected btnDx: WUX.WButton;
        protected btnCp: WUX.WButton;
        protected btnPa: WUX.WButton;
        protected isNew: boolean;
        protected status: number;
        readonly iSTATUS_STARTUP = 0;
        readonly iSTATUS_VIEW = 1;
        readonly iSTATUS_EDITING = 2;
        constructor(id?: string);
        protected render(): WUX.WContainer;
        collapseHandler(e: JQueryEventObject): void;
        protected onSelect(): void;
        protected componentDidMount(): void;
    }
}
declare namespace GUI {
    class GUICalendario extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected planning: CFPlanning;
        protected navCal: CFNavCalendar;
        protected txtSrc: WUX.WInput;
        protected lnkPrn: WUX.WLink;
        protected lnkTms: WUX.WLink;
        protected lnkNew: WUX.WLink;
        protected dlgOrariPers: DlgOrariPers;
        protected winBack: WUX.WWindow;
        constructor(id?: string);
        protected render(): WUX.WContainer;
        protected componentDidMount(): void;
    }
    class GUIChiusure extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected tagsFilter: WUX.WTags;
        protected fpFilter: WUX.WFormPanel;
        protected selFar: CFSelectStruture;
        protected btnFind: WUX.WButton;
        protected btnReset: WUX.WButton;
        protected btnNew: WUX.WButton;
        protected cntActions: CFTableActions;
        protected btnOpen: WUX.WButton;
        protected btnSave: WUX.WButton;
        protected btnCancel: WUX.WButton;
        protected btnDelete: WUX.WButton;
        protected cntActions2: CFTableActions;
        protected btnOpen2: WUX.WButton;
        protected btnSave2: WUX.WButton;
        protected btnCancel2: WUX.WButton;
        protected btnDelete2: WUX.WButton;
        protected tabResult: WUX.WDXTable;
        protected selId: any;
        protected fpDetail: WUX.WFormPanel;
        protected isNew: boolean;
        protected status: number;
        readonly iSTATUS_STARTUP = 0;
        readonly iSTATUS_VIEW = 1;
        readonly iSTATUS_EDITING = 2;
        constructor(id?: string);
        protected render(): WUX.WContainer;
        collapseHandler(e: JQueryEventObject): void;
        protected onSelect(): void;
        protected componentDidMount(): void;
    }
}
declare namespace GUI {
    class GUIClienti extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected tagsFilter: WUX.WTags;
        protected fpFilter: WUX.WFormPanel;
        protected btnFind: WUX.WButton;
        protected btnReset: WUX.WButton;
        protected btnNew: WUX.WButton;
        protected cntActions: CFTableActions;
        protected btnOpen: WUX.WButton;
        protected btnSave: WUX.WButton;
        protected btnCancel: WUX.WButton;
        protected btnDelete: WUX.WButton;
        protected btnMerge: WUX.WButton;
        protected btnSMS: WUX.WButton;
        protected btnComm: WUX.WButton;
        protected tabResult: WUX.WDXTable;
        protected selId: any;
        protected itemMrg: any;
        protected fpDetail: WUX.WFormPanel;
        protected tabStorico: WUX.WDXTable;
        protected dataRif: number;
        dlgMrgC: DlgClienti;
        dlgPren: DlgPrenotazione;
        dlgText: DlgSMSText;
        dlgComm: DlgComunicazione;
        protected isNew: boolean;
        protected status: number;
        readonly iSTATUS_STARTUP = 0;
        readonly iSTATUS_VIEW = 1;
        readonly iSTATUS_EDITING = 2;
        constructor(id?: string);
        protected render(): WUX.WContainer;
        collapseHandler(e: JQueryEventObject): void;
        protected onSelect(): void;
    }
}
declare namespace GUI {
    class GUICollaboratori extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected tagsFilter: WUX.WTags;
        protected fpFilter: WUX.WFormPanel;
        protected selFar: CFSelectStruture;
        protected btnFind: WUX.WButton;
        protected btnReset: WUX.WButton;
        protected btnNew: WUX.WButton;
        protected cntActions: CFTableActions;
        protected btnOpen: WUX.WButton;
        protected btnSave: WUX.WButton;
        protected btnCancel: WUX.WButton;
        protected btnDelete: WUX.WButton;
        protected btnVisible: WUX.WButton;
        protected cntActions2: CFTableActions;
        protected btnOpen2: WUX.WButton;
        protected btnSave2: WUX.WButton;
        protected btnCancel2: WUX.WButton;
        protected btnDelete2: WUX.WButton;
        protected btnVisible2: WUX.WButton;
        protected tabResult: WUX.WDXTable;
        protected selId: any;
        protected tcoDetail: WUX.WTab;
        protected fpDetail: WUX.WFormPanel;
        protected cmpAgenda: CFAgenda;
        protected lblVar: WUX.WLabel;
        protected tabVar: WUX.WDXTable;
        protected btnAddVar: WUX.WButton;
        protected btnAddAss: WUX.WButton;
        protected btnRemVar: WUX.WButton;
        protected dlgAgenda: DlgAgenda;
        protected dlgAssenze: DlgAssenze;
        protected dlgOrariPers: DlgOrariPers;
        protected tabSel: WUX.WDXTable;
        protected tabAll: WUX.WDXTable;
        protected btnSx: WUX.WButton;
        protected btnDx: WUX.WButton;
        protected btnCp: WUX.WButton;
        protected btnPa: WUX.WButton;
        protected isNew: boolean;
        protected status: number;
        readonly iSTATUS_STARTUP = 0;
        readonly iSTATUS_VIEW = 1;
        readonly iSTATUS_EDITING = 2;
        constructor(id?: string);
        protected render(): WUX.WContainer;
        collapseHandler(e: JQueryEventObject): void;
        protected onSelect(): void;
        protected componentDidMount(): void;
    }
}
declare namespace GUI {
    let strutture: WUX.WEntity[];
    let cp_orari: AgendaModello[];
    let cp_prest: any[];
    let cp_attrz: any[];
    let cp_collb: any[];
    class CFTableActions extends WUX.WComponent {
        left: WUX.WContainer;
        right: WUX.WContainer;
        constructor(id: string);
        protected componentDidMount(): void;
        setLeftVisible(v: boolean): void;
        setRightVisible(v: boolean): void;
    }
    class CFSelectMesi extends WUX.WSelect2 {
        constructor(id?: string, mesi?: number, pros?: number);
    }
    class CFSelectStruture extends WUX.WSelect2 {
        items: WUX.WEntity[];
        constructor(id?: string, multiple?: boolean);
        protected componentDidMount(): void;
    }
    class CFSelOpzClienti extends WUX.WSelect2 {
        items: WUX.WEntity[];
        strts: WUX.WEntity[];
        constructor(id?: string, multiple?: boolean);
        protected componentDidMount(): void;
    }
    class CFSelectTipoPrezzo extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean);
    }
    class CFSelectLav extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean);
    }
    class CFSelectStatiPren extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean);
    }
    class CFSelectTipoCom extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean);
    }
    class CFSelectAppTipoPag extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean);
    }
    class CFSelectTipoApp extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean);
        close(): void;
    }
    class CFSelectOrario extends WUX.WSelect2 {
        allSlots: WUX.WEntity[];
        constructor(id?: string, multiple?: boolean);
        setAppts(a: number[]): this;
        setAllSlots(): this;
    }
    class CFSelectGruppiPre extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean);
        protected componentDidMount(): void;
    }
    class CFSelectTipiPre extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean);
        protected componentDidMount(): void;
    }
    class CFSelectCabine extends WUX.WSelect2 {
        idFar: number;
        constructor(id?: string, multiple?: boolean);
        setIdFar(idf: number, val?: number): this;
        protected componentDidMount(): void;
    }
    class CFSelectCollab extends WUX.WSelect2 {
        idFar: number;
        onlyVis: boolean;
        constructor(id?: string, multiple?: boolean);
        setIdFar(idf: number, val?: number): this;
        protected componentDidMount(): void;
    }
    class CFSelectClienti extends WUX.WSelect2 {
        constructor(id?: string, multiple?: boolean);
        protected componentDidMount(): void;
    }
    class CFSelectColore extends WUX.WComponent<string, string> {
        colors: string[];
        items: JQuery[];
        constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object);
        protected updateState(nextState: string): void;
        clear(): void;
        protected componentDidMount(): void;
        protected updateView(): void;
        protected rgb2hex(bg: any): string;
    }
    class CFOrariSett extends WUX.WComponent<string, AgendaModello[]> {
        protected fp: WUX.WFormPanel;
        protected ck: WUX.WCheck;
        protected lc: WUX.WLink;
        protected lp: WUX.WLink;
        title: string;
        evenWeek: boolean;
        oddWeek: boolean;
        constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object);
        set enabled(b: boolean);
        protected updateState(nextState: AgendaModello[]): void;
        getState(): AgendaModello[];
        clear(): this;
        setDefaults(): this;
        isBlank(): boolean;
        isActivated(): boolean;
        protected render(): WUX.WFormPanel;
        protected descDay(d: number): "" | "Luned&igrave;" | "Marted&igrave;" | "Mercoled&igrave;" | "Gioved&igrave;" | "Venerd&igrave;" | "Sabato" | "Domenica";
    }
    class CFOrariPers extends WUX.WComponent<string, {
        [resId: string]: number[];
    }> {
        protected fp: WUX.WFormPanel;
        title: string;
        resources: WUX.WEntity[];
        values: any;
        constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object);
        protected updateState(nextState: {
            [resId: string]: number[];
        }): void;
        getState(): {
            [resId: string]: number[];
        };
        clear(): this;
        refresh(): this;
        protected render(): WUX.WFormPanel;
    }
    class CFAgenda extends WUX.WComponent<string, Agenda> {
        protected container: WUX.WContainer;
        protected cmpSx: CFOrariSett;
        protected cmpDx: CFOrariSett;
        protected dateRif: Date;
        constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object);
        set enabled(b: boolean);
        clear(): this;
        isBlank(): boolean;
        isActivated(): boolean;
        protected updateState(nextState: Agenda): void;
        getState(): Agenda;
        setDateRef(date: any): void;
        protected render(): WUX.WContainer;
    }
}
declare namespace GUI {
    class GUIComunicazioni extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected tagsFilter: WUX.WTags;
        protected fpFilter: WUX.WFormPanel;
        protected selFar: CFSelectStruture;
        protected btnFind: WUX.WButton;
        protected btnReset: WUX.WButton;
        protected btnNew: WUX.WButton;
        protected cntActions: CFTableActions;
        protected btnOpen: WUX.WButton;
        protected btnSave: WUX.WButton;
        protected btnCancel: WUX.WButton;
        protected btnDelete: WUX.WButton;
        protected tabResult: WUX.WDXTable;
        protected selId: any;
        protected tcoDetail: WUX.WTab;
        protected fpDetail: WUX.WFormPanel;
        protected tabList: WUX.WDXTable;
        protected btnRemOne: WUX.WButton;
        protected btnRemAll: WUX.WButton;
        protected isNew: boolean;
        protected status: number;
        readonly iSTATUS_STARTUP = 0;
        readonly iSTATUS_VIEW = 1;
        readonly iSTATUS_EDITING = 2;
        constructor(id?: string);
        protected render(): WUX.WContainer;
        collapseHandler(e: JQueryEventObject): void;
        protected onSelect(): void;
        protected componentDidMount(): void;
    }
}
declare namespace GUI {
    class DlgDataCal extends WUX.WDialog<string, Date> {
        cal: WUX.WDXCalendar;
        constructor(id: string);
        protected updateState(nextState: Date): void;
        getState(): Date;
        protected componentDidMount(): void;
    }
    class DlgSMSText extends WUX.WDialog<string, string> {
        protected tarea: WUX.WTextArea;
        constructor(id: string);
        protected updateState(nextState: string): void;
        getState(): string;
        protected onClickOk(): boolean;
        protected onShown(): void;
        protected componentDidMount(): void;
    }
    class DlgCheckDesk extends WUX.WDialog<string, string> {
        protected inp: WUX.WInput;
        constructor(id: string);
        protected updateState(nextState: string): void;
        getState(): string;
        protected onClickOk(): boolean;
        protected onShown(): void;
        protected componentDidMount(): void;
    }
    class DlgAppPag extends WUX.WDialog<any[], any> {
        protected table: WUX.WDXTable;
        protected fp: WUX.WFormPanel;
        protected selPag: CFSelectAppTipoPag;
        protected impPag: number;
        constructor(id: string);
        protected onShown(): void;
        updateProps(nextProps: any[]): void;
        getProps(): any[];
        updateState(nextState: any): void;
        getState(): any;
        protected onClickOk(): boolean;
    }
    class DlgPrenotazione extends WUX.WDialog<string, any> {
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
        _sdate: boolean;
        _idcol: number;
        _efind: boolean;
        constructor(id: string);
        protected doFind(fromDate?: Date, toDate?: Date): this;
        protected updateState(nextState: any): void;
        getState(): any;
        protected componentDidMount(): void;
    }
    class DlgOrariPers extends WUX.WDialog<Date, any> {
        protected cfOrariPers: CFOrariPers;
        constructor(id: string);
        protected updateState(nextState: any): void;
        getState(): any;
        refresh(): this;
        protected onShown(): void;
    }
    class DlgAssenze extends WUX.WDialog<string, Date[]> {
        protected fp: WUX.WFormPanel;
        constructor(id: string);
        getState(): Date[];
        protected onShown(): void;
        protected onClickOk(): boolean;
    }
    class DlgAgenda extends WUX.WDialog<string, Agenda> {
        protected cmpAgenda: CFAgenda;
        protected fp: WUX.WFormPanel;
        protected conf: boolean;
        constructor(id: string);
        getState(): Agenda;
        protected onClickOk(): boolean;
        protected onShown(): void;
        protected componentDidMount(): void;
    }
    class DlgCliente extends WUX.WDialog<string, any> {
        fp: WUX.WFormPanel;
        done: boolean;
        constructor(id: string);
        protected onShown(): void;
        protected onClickOk(): boolean;
        protected componentDidMount(): void;
    }
    class DlgClienti extends WUX.WDialog<number, any> {
        fpFilter: WUX.WFormPanel;
        btnFind: WUX.WButton;
        btnReset: WUX.WButton;
        tabResult: WUX.WDXTable;
        constructor(id: string);
        protected onClickOk(): boolean;
        protected onShown(): void;
    }
    class DlgAttrRis extends WUX.WDialog<Date, any[]> {
        tabAttr: WUX.WDXTable;
        constructor(id: string);
        protected updateState(nextState: any[]): void;
        getState(): any[];
        protected onShown(): void;
    }
    class DlgStoricoApp extends WUX.WDialog<string, any[]> {
        protected tabStorico: WUX.WDXTable;
        protected dataRif: number;
        constructor(id: string);
        protected updateState(nextState: any[]): void;
        protected onShown(): void;
        protected componentDidMount(): void;
    }
    class DlgStoricoColl extends WUX.WDialog<string, any[]> {
        protected label: WUX.WLabel;
        protected tabStorico: WUX.WDXTable;
        protected dataRif: number;
        constructor(id: string);
        protected updateState(nextState: any[]): void;
        protected updateProps(nextProps: string): void;
        protected onShown(): void;
        protected componentDidMount(): void;
    }
    class DlgComunicazione extends WUX.WDialog<WUX.WEntity, any[]> {
        tabCom: WUX.WDXTable;
        constructor(id: string);
        protected updateState(nextState: any[]): void;
        getState(): any[];
        getProps(): WUX.WEntity;
        protected onClickOk(): boolean;
        protected onShown(): void;
    }
    class DlgCambioAttr extends WUX.WDialog<WUX.WEntity, any[]> {
        tabAttr: WUX.WDXTable;
        constructor(id: string);
        protected updateState(nextState: any[]): void;
        getState(): any[];
        getProps(): WUX.WEntity;
        protected onClickOk(): boolean;
        protected onShown(): void;
    }
    class DlgCambioPrest extends WUX.WDialog<WUX.WEntity, any[]> {
        tabPrest: WUX.WDXTable;
        durata: number;
        done: boolean;
        constructor(id: string);
        protected updateState(nextState: any[]): void;
        getState(): any[];
        getProps(): WUX.WEntity;
        protected onClickOk(): boolean;
        protected onShown(): void;
    }
    class DlgOrgPrest extends WUX.WDialog<any, any[]> {
        tabPrestaz: WUX.WDXTable;
        btnUp: WUX.WButton;
        btnDw: WUX.WButton;
        constructor(id: string);
        protected updateState(nextState: any[]): void;
        getState(): any[];
        protected onShown(): void;
    }
    class DlgNuovoApp extends WUX.WDialog<string, any> {
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
        _sdate: boolean;
        _idcol: number;
        _efind: boolean;
        _count: number;
        constructor(id: string);
        getSelectedPrest(msg?: boolean): any[];
        setIdFar(idf: number, idc?: number): void;
        protected doFind(fromDate?: Date, toDate?: Date): this;
        protected onClickOk(): boolean;
        protected onClickCancel(): boolean;
        protected updateState(nextState: any): void;
        getState(): any;
        protected onShown(): void;
        protected componentDidMount(): void;
    }
}
declare namespace GUI {
    class GUILogOpPren extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected tagsFilter: WUX.WTags;
        protected fpFilter: WUX.WFormPanel;
        protected selFar: CFSelectStruture;
        protected selCol: CFSelectCollab;
        protected selCab: CFSelectCabine;
        protected btnFind: WUX.WButton;
        protected btnReset: WUX.WButton;
        protected cntActions: CFTableActions;
        protected tabResult: WUX.WDXTable;
        protected lblResult: WUX.WLabel;
        constructor(id?: string);
        protected render(): WUX.WContainer;
        collapseHandler(e: JQueryEventObject): void;
        protected componentDidMount(): void;
    }
}
declare namespace GUI {
    class CFPlanning extends WUX.WComponent<any, any> {
        resources: WUX.WEntity[];
        idFar: number;
        dateCal: Date;
        appts: {
            [resId_hhmm: string]: Prenotazione;
        };
        slots: {
            [resId_hhmm: string]: number;
        };
        alist: Prenotazione[];
        $body: JQuery;
        autoScroll: boolean;
        dlgPren: DlgPrenotazione;
        dlgNApp: DlgNuovoApp;
        navCal: CFNavCalendar;
        idCliente: number;
        _sync: boolean;
        _syncbk: boolean;
        _lstolb: number[];
        readonly COLOR_NA: string;
        readonly COLOR_AV: string;
        readonly COLOR_BK: string;
        readonly COLOR_EX: string;
        readonly COLOR_NE: string;
        readonly COLOR_SU: string;
        readonly COLOR_BK_OL: string;
        readonly COLOR_EX_OL: string;
        readonly COLOR_NE_OL: string;
        readonly COLOR_SU_OL: string;
        readonly COLOR_AP: string;
        readonly COLOR_HH: string;
        readonly COLOR_MM: string;
        readonly COLOR_MK: string;
        constructor(id?: string, classStyle?: string, style?: string | WUX.WStyle, attributes?: string | object);
        stopSync(): this;
        startSync(): this;
        suspendSync(): this;
        resumeSync(force?: boolean): this;
        showPren(id: number): void;
        onClick(hhmm: number, resIdx: number): void;
        newApp(): this;
        protected updateState(nextState: any): void;
        protected componentDidMount(): void;
        mark(a: string | number): Prenotazione[];
        scrollFirst(): number;
        scroll(hhmm: string | number): number;
    }
    class CFNavCalendar extends WUX.WComponent<number, Date> {
        container: WUX.WContainer;
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
        constructor(id: string);
        onClickPrev(h: (e: JQueryEventObject) => any): void;
        onClickNext(h: (e: JQueryEventObject) => any): void;
        prev(): void;
        next(): void;
        protected render(): WUX.WContainer;
        getProps(): number;
        protected updateState(nextState: Date): void;
        protected updateProps(nextProps: number): void;
        protected updateView(): void;
        isToday(): boolean;
        formatDate(d: Date, h?: boolean): string;
        protected componentDidMount(): void;
    }
}
declare namespace GUI {
    class GUIPrenotazioni extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected tagsFilter: WUX.WTags;
        protected fpFilter: WUX.WFormPanel;
        protected selFar: CFSelectStruture;
        protected selCol: CFSelectCollab;
        protected selCab: CFSelectCabine;
        protected btnFind: WUX.WButton;
        protected btnReset: WUX.WButton;
        protected cntActions: CFTableActions;
        protected tabResult: WUX.WDXTable;
        protected lblResult: WUX.WLabel;
        dlgPren: DlgPrenotazione;
        constructor(id?: string);
        protected render(): WUX.WContainer;
        collapseHandler(e: JQueryEventObject): void;
        protected componentDidMount(): void;
    }
}
declare namespace GUI {
    class GUIRepPro extends WUX.WComponent {
        container: WUX.WContainer;
        tagsFilter: WUX.WTags;
        fpFilter: WUX.WFormPanel;
        selFar: CFSelectStruture;
        selMese: CFSelectMesi;
        btnFind: WUX.WButton;
        btnReset: WUX.WButton;
        tabResult: WUX.WDXTable;
        dlgDet: DlgStoricoColl;
        constructor(id?: string);
        protected render(): WUX.WContainer;
        collapseHandler(e: JQueryEventObject): void;
        protected componentDidMount(): void;
    }
    class GUIRepMsg extends WUX.WComponent {
        container: WUX.WContainer;
        tagsFilter: WUX.WTags;
        fpFilter: WUX.WFormPanel;
        selFar: CFSelectStruture;
        selMese: CFSelectMesi;
        btnFind: WUX.WButton;
        btnReset: WUX.WButton;
        tabResult: WUX.WDXTable;
        constructor(id?: string);
        protected render(): WUX.WContainer;
        collapseHandler(e: JQueryEventObject): void;
        protected componentDidMount(): void;
    }
    class GUIChartsPro extends WUX.WComponent {
        container: WUX.WContainer;
        tagsFilter: WUX.WTags;
        fpFilter: WUX.WFormPanel;
        selFar: CFSelectStruture;
        selMese: CFSelectMesi;
        btnFind: WUX.WButton;
        btnReset: WUX.WButton;
        chrCE: WUX.WChartJS;
        chrCV: WUX.WChartJS;
        chrPE: WUX.WChartJS;
        chrPV: WUX.WChartJS;
        chrPP: WUX.WChartJS;
        chrGV: WUX.WChartJS;
        constructor(id?: string);
        protected render(): WUX.WContainer;
        collapseHandler(e: JQueryEventObject): void;
        protected fix(): void;
        protected componentDidMount(): void;
    }
}
declare namespace GUI {
    class GUIGruppiTrat extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected tagsFilter: WUX.WTags;
        protected fpFilter: WUX.WFormPanel;
        protected btnFind: WUX.WButton;
        protected btnReset: WUX.WButton;
        protected btnNew: WUX.WButton;
        protected cntActions: CFTableActions;
        protected btnOpen: WUX.WButton;
        protected btnSave: WUX.WButton;
        protected btnCancel: WUX.WButton;
        protected btnDelete: WUX.WButton;
        protected tabResult: WUX.WDXTable;
        protected selId: any;
        protected fpDetail: WUX.WFormPanel;
        protected isNew: boolean;
        protected status: number;
        readonly iSTATUS_STARTUP = 0;
        readonly iSTATUS_VIEW = 1;
        readonly iSTATUS_EDITING = 2;
        constructor(id?: string);
        protected render(): WUX.WContainer;
        collapseHandler(e: JQueryEventObject): void;
    }
    class GUITrattamenti extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected tagsFilter: WUX.WTags;
        protected fpFilter: WUX.WFormPanel;
        protected selFar: CFSelectStruture;
        protected btnFind: WUX.WButton;
        protected btnReset: WUX.WButton;
        protected btnNew: WUX.WButton;
        protected cntActions: CFTableActions;
        protected btnOpen: WUX.WButton;
        protected btnSave: WUX.WButton;
        protected btnCancel: WUX.WButton;
        protected btnDelete: WUX.WButton;
        protected cntActions2: CFTableActions;
        protected btnOpen2: WUX.WButton;
        protected btnSave2: WUX.WButton;
        protected btnCancel2: WUX.WButton;
        protected btnDelete2: WUX.WButton;
        protected tabResult: WUX.WDXTable;
        protected selId: any;
        protected tcoDetail: WUX.WTab;
        protected selGruppo: CFSelectGruppiPre;
        protected fpDetail: WUX.WFormPanel;
        protected tabSelA: WUX.WDXTable;
        protected tabAllA: WUX.WDXTable;
        protected btnSxA: WUX.WButton;
        protected btnDxA: WUX.WButton;
        protected btnCpA: WUX.WButton;
        protected btnPaA: WUX.WButton;
        protected tabSelC: WUX.WDXTable;
        protected tabAllC: WUX.WDXTable;
        protected btnSxC: WUX.WButton;
        protected btnDxC: WUX.WButton;
        protected btnCpC: WUX.WButton;
        protected btnPaC: WUX.WButton;
        protected isNew: boolean;
        protected status: number;
        readonly iSTATUS_STARTUP = 0;
        readonly iSTATUS_VIEW = 1;
        readonly iSTATUS_EDITING = 2;
        constructor(id?: string);
        protected render(): WUX.WContainer;
        collapseHandler(e: JQueryEventObject): void;
        protected onSelect(): void;
        protected calcPrezzi(): void;
        protected componentDidMount(): void;
    }
}
declare namespace GUI {
    class GUIUtentiDesk extends WUX.WComponent {
        protected container: WUX.WContainer;
        protected tagsFilter: WUX.WTags;
        protected fpFilter: WUX.WFormPanel;
        protected selFar: CFSelectStruture;
        protected btnFind: WUX.WButton;
        protected btnReset: WUX.WButton;
        protected btnNew: WUX.WButton;
        protected cntActions: CFTableActions;
        protected btnOpen: WUX.WButton;
        protected btnSave: WUX.WButton;
        protected btnCancel: WUX.WButton;
        protected btnDelete: WUX.WButton;
        protected cntActions2: CFTableActions;
        protected btnOpen2: WUX.WButton;
        protected btnSave2: WUX.WButton;
        protected btnCancel2: WUX.WButton;
        protected btnDelete2: WUX.WButton;
        protected tabResult: WUX.WDXTable;
        protected selId: any;
        protected tcoDetail: WUX.WTab;
        protected fpDetail: WUX.WFormPanel;
        protected isNew: boolean;
        protected status: number;
        readonly iSTATUS_STARTUP = 0;
        readonly iSTATUS_VIEW = 1;
        readonly iSTATUS_EDITING = 2;
        constructor(id?: string);
        protected render(): WUX.WContainer;
        collapseHandler(e: JQueryEventObject): void;
        protected onSelect(): void;
        protected componentDidMount(): void;
    }
}
