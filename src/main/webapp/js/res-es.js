WUX.RES.OK = 'OK';
WUX.RES.CLOSE = 'Cerca';
WUX.RES.CANCEL = 'Cancelar';
WUX.RES.ERR_DATE = 'Fecha invalida.';
WUX.RES.FILE_NAME = 'File';
WUX.RES.FILE_SIZE = 'Dim.';
WUX.RES.FILE_TYPE = 'Tipo';
WUX.RES.FILE_LMOD = 'Últ.Mod.';
var GUI;
(function (GUI) {
    var WIcon = WUX.WIcon;
    var TXT = (function () {
        function TXT() {
        }
        TXT.OK = 'OK';
        TXT.CLOSE = 'Cerca';
        TXT.NEW = 'Nuevo';
        TXT.OPEN = 'Modificar';
        TXT.DELETE = 'Eliminar';
        TXT.SAVE = 'Salvar';
        TXT.SEND = 'Enviar';
        TXT.SEND_EMAIL = 'Email';
        TXT.FIND = 'Encontrar';
        TXT.FORCE = 'Fuerza';
        TXT.SEARCH = 'Buscar';
        TXT.CANCEL = 'Cancelar';
        TXT.RESET = 'Reiniciar';
        TXT.PRINT = 'Impresión';
        TXT.PRINT_ALL = 'Imprimir todo';
        TXT.PREVIEW = 'Avance';
        TXT.EXPORT = 'Exportar';
        TXT.IMPORT = 'Importar';
        TXT.HELP = 'Ayuda';
        TXT.VIEW = 'Ver';
        TXT.ENABLE = 'Habilitar';
        TXT.DISABLE = 'Inhabilitar';
        TXT.ADD = 'Añadir';
        TXT.APPLY = 'Aplicar';
        TXT.REMOVE = 'Eliminar';
        TXT.REMOVE_ALL = 'El.todo';
        TXT.REFRESH = 'Actualizar';
        TXT.UNDO = 'Deshacer';
        TXT.SETTINGS = 'Configuraciones';
        TXT.COPY = 'Copiar';
        TXT.CUT = 'Cortar';
        TXT.PASTE = 'Pegar';
        TXT.CONFIRM = 'Confirmar';
        TXT.FORWARD = 'Adelante';
        TXT.BACKWARD = 'Hacia atrás';
        TXT.NEXT = 'Próximo';
        TXT.PREVIOUS = 'Previo';
        TXT.SELECT = 'Seleccione';
        TXT.SELECT_ALL = 'Sel.todo';
        TXT.WORK = 'Trabajar';
        TXT.AGGREGATE = 'Aggrega';
        TXT.SET = 'Establecer';
        TXT.DEFAULT = 'Default';
        TXT.REWORK = 'Rehacer';
        TXT.PUSH = 'Empujar';
        TXT.SUSPEND = 'Suspender';
        TXT.RESUME = 'Reasumir';
        TXT.CODE = 'Código';
        TXT.DESCRIPTION = 'Descripción';
        TXT.GROUP = 'Grupo';
        TXT.ROLE = 'Rol';
        TXT.TYPE = 'Tipo';
        TXT.HELLO = 'Hola';
        return TXT;
    }());
    GUI.TXT = TXT;
    var MSG = (function () {
        function MSG() {
        }
        MSG.CONF_DELETE = '¿Quieres eliminar el elemento seleccionado?';
        MSG.CONF_DISABLE = '¿Quieres deshabilitar el elemento seleccionado?';
        MSG.CONF_ENABLE = '¿Quieres habilitar el elemento seleccionado?';
        MSG.CONF_CANCEL = '¿Quieres deshacer los cambios?';
        MSG.CONF_PROCEED = '¿Quieres continuar con la operación?';
        MSG.CONF_OVERWRITE = '¿Quiere continuar con la sobrescritura?';
        MSG.MSG_COMPLETED = 'La operación se realizó con éxito.';
        MSG.MSG_ERRORS = 'Error durante el procesamiento.';
        return MSG;
    }());
    GUI.MSG = MSG;
    var ICO = (function () {
        function ICO() {
        }
        ICO.TRUE = WIcon.CHECK_SQUARE_O;
        ICO.FALSE = WIcon.SQUARE_O;
        ICO.CLOSE = WIcon.TIMES;
        ICO.OK = WIcon.CHECK;
        ICO.CALENDAR = WIcon.CALENDAR;
        ICO.AGGREGATE = WIcon.CHAIN;
        ICO.NEW = WIcon.PLUS_SQUARE_O;
        ICO.EDIT = WIcon.EDIT;
        ICO.OPEN = WIcon.EDIT;
        ICO.DELETE = WIcon.TRASH;
        ICO.DETAIL = WIcon.FILE_TEXT_O;
        ICO.SAVE = WIcon.CHECK;
        ICO.FIND = WIcon.SEARCH;
        ICO.FIND_DIFF = WIcon.SEARCH_MINUS;
        ICO.FIND_PLUS = WIcon.SEARCH_PLUS;
        ICO.FORCE = WIcon.CHECK_CIRCLE;
        ICO.FORCE_ALL = WIcon.CHECK_CIRCLE_O;
        ICO.SEARCH = WIcon.SEARCH;
        ICO.CANCEL = WIcon.UNDO;
        ICO.RESET = WIcon.TIMES_CIRCLE;
        ICO.PRINT = WIcon.PRINT;
        ICO.PREVIEW = WIcon.SEARCH_PLUS;
        ICO.EXPORT = WIcon.SHARE_SQUARE_O;
        ICO.IMPORT = WIcon.SIGN_IN;
        ICO.FILE = WIcon.FILE_O;
        ICO.HELP = WIcon.QUESTION_CIRCLE;
        ICO.VIEW = WIcon.FILE_TEXT_O;
        ICO.ENABLE = WIcon.THUMBS_O_UP;
        ICO.DISABLE = WIcon.THUMBS_O_DOWN;
        ICO.ADD = WIcon.PLUS;
        ICO.APPLY = WIcon.CHECK;
        ICO.REMOVE = WIcon.MINUS;
        ICO.REFRESH = WIcon.REFRESH;
        ICO.UNDO = WIcon.UNDO;
        ICO.SETTINGS = WIcon.COG;
        ICO.OPTIONS = WIcon.CHECK_SQUARE;
        ICO.PASSWORD = WIcon.UNDO;
        ICO.COPY = WIcon.COPY;
        ICO.CUT = WIcon.CUT;
        ICO.PASTE = WIcon.PASTE;
        ICO.FORWARD = WIcon.ANGLE_DOUBLE_RIGHT;
        ICO.BACKWARD = WIcon.ANGLE_DOUBLE_LEFT;
        ICO.NEXT = WIcon.FORWARD;
        ICO.PREVIOUS = WIcon.BACKWARD;
        ICO.CONFIRM = WIcon.CHECK;
        ICO.FILTER = WIcon.FILTER;
        ICO.SEND = WIcon.SEND;
        ICO.SEND_EMAIL = WIcon.ENVELOPE_O;
        ICO.WAIT = WIcon.COG;
        ICO.WORK = WIcon.COG;
        ICO.CONFIG = WIcon.COG;
        ICO.LEFT = WIcon.ARROW_CIRCLE_LEFT;
        ICO.RIGHT = WIcon.ARROW_CIRCLE_RIGHT;
        ICO.SELECT_ALL = WIcon.TH_LIST;
        ICO.REWORK = WIcon.REFRESH;
        ICO.PUSH = WIcon.TRUCK;
        ICO.AHEAD = WIcon.ANGLE_DOUBLE_RIGHT;
        ICO.SUSPEND = WIcon.TOGGLE_OFF;
        ICO.RESUME = WIcon.RECYCLE;
        ICO.PAIRING = WIcon.RANDOM;
        ICO.CHECK = WIcon.CHECK_SQUARE_O;
        ICO.EVENT = WIcon.BOLT;
        ICO.MESSAGE = WIcon.ENVELOPE_O;
        ICO.USER = WIcon.USER_O;
        ICO.GROUP = WIcon.USERS;
        ICO.TOOL = WIcon.WRENCH;
        ICO.DEMOGRAPHIC = WIcon.ADDRESS_CARD;
        ICO.DOCUMENT = WIcon.FILE_TEXT_O;
        ICO.LINKS = WIcon.CHAIN;
        ICO.WARNING = WIcon.WARNING;
        ICO.INFO = WIcon.INFO_CIRCLE;
        ICO.CRITICAL = WIcon.TIMES_CIRCLE;
        return ICO;
    }());
    GUI.ICO = ICO;
})(GUI || (GUI = {}));
//# sourceMappingURL=res-es.js.map