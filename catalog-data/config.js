//Микросервис "Справочники"
//Получает контент записи по клику по строке в левой части для его отображения в правой

//TODO: Как только сделаем архитектуру на деве и проде одинаковой, тернарный оператор для урла и путей должен быть упразднен
const ENVIRONMENT = process.env.REACT_APP_DIT_ENV || 'localhost'; //Устанавливаем среду (localhost или берем smproto из системной переменной)
const PORT = 4006;
const BASE_URL = ENVIRONMENT === 'localhost' ? '/sm/dev/hlp/' : '/smproto/sm/dev/hlp/';

//Поддерживаемые системы
const SYSTEM_URLS = new Map();
SYSTEM_URLS.set('SM_DEV5', 'http://212.11.152.145:13083/SM/9/rest/ditMFSMAPI');
SYSTEM_URLS.set('SM_DEV5_INT', 'http://10.127.40.144:13083/SM/9/rest/ditMFSMAPI');

//Учетки для подключения к SM
const AUTH = new Map();
AUTH.set('Disp_Inj', 'Basic RGlzcF9Jbmo6UXdlcnR5MTIz');
AUTH.set('ditSMI', 'Basic ZGl0U01JOnNlcjU2aWpodTg5Xg==');

//Paths
const PATHS = new Map();

PATHS.set('getDirection', BASE_URL + 'direction/getItem/:id');
PATHS.set('getGroupAffectedItem', BASE_URL + 'svcgrp/getItem/:id');
PATHS.set('getCI', BASE_URL + 'svc/getItem/:id');
PATHS.set('getService', BASE_URL + 'func/getItem/:id');

PATHS.set('getDirectionList', BASE_URL + 'direction/getList');
PATHS.set('getGroupAffectedItemList', BASE_URL + 'svcgrp/getList');
PATHS.set('getAffectedItemList', BASE_URL + 'svc/getList');
PATHS.set('getServiceList', BASE_URL + 'func/getList');
PATHS.set('getDataListWithPagination', BASE_URL + 'data/getList');

PATHS.set('getDatadict', BASE_URL + 'datadict/getItem/:id');
PATHS.set('getContact', BASE_URL + 'contact/getItem/:contactName');
PATHS.set('getKC', BASE_URL + 'kc/getItem/:kc');
PATHS.set('getCK', BASE_URL + 'ck/getItem/:ck');

PATHS.set('getSMActionFieldsData', BASE_URL + 'smaction/fdata/:recordId/:smAction/:additionalParams?');
PATHS.set('getGlobalVars', BASE_URL + 'globalVars');
PATHS.set('preloadEditModeLists', BASE_URL + 'preloadEditModeLists/:recordId');
PATHS.set('sdTplData', BASE_URL + 'sdTplData/:tplName');
PATHS.set('lastCreatedSdList', BASE_URL + 'lastCreatedSdList');
PATHS.set('getWorkflowMeta', BASE_URL + 'workflowMeta/:recordId');

const CONNECTION_PARAMS = {
   auth: AUTH.get('ditSMI'),
   url: ENVIRONMENT === 'localhost' ? SYSTEM_URLS.get('SM_DEV5') : SYSTEM_URLS.get('SM_DEV5_INT'),
   paths: PATHS,
   port: PORT,
   secret: '$%ewgfIu0e&Fyuy#^Egfw47'
}

module.exports = CONNECTION_PARAMS;