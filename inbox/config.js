//Микросервис "Сущность СТП"
//Получает контент записи по клику по строке в левой части для его отображения в правой
const ENVIRONMENT = process.env.REACT_APP_DIT_ENV || 'localhost'; //Устанавливаем среду (localhost или берем smproto из системной переменной)

const LOCALHOST_MONGO_PATH = 'Sasha'; //Чтобы в глубь кода не лезть, сразу тут определим
const DOCKER_MONGO_PATH = 'Nikolay'; //Если среда будет не локалхост, установим путь для Николая

const PORT = 4008;
const BASE_URL = ENVIRONMENT === 'localhost' ? '/sm/dev/view/' : '/smproto/sm/dev/view/';

//Поддерживаемые системы
const SYSTEM_URLS = new Map();
SYSTEM_URLS.set('SM_DEV5', 'http://212.11.152.145:13083/SM/9/rest/ditMFSMAPI');
SYSTEM_URLS.set('SM_DEV5_INT', 'http://10.127.40.144:13083/SM/9/rest/ditMFSMAPI');

//Микросервис db
const DB_URLS = new Map();
DB_URLS.set('DB_DEV', 'localhost:4005');
DB_URLS.set('DB_PROTO', 'smproto-db-srv:4005/smproto');

//Учетки для подключения к SM
const AUTH = new Map();
AUTH.set('ditSMI', 'Basic ZGl0U01JOnNlcjU2aWpodTg5Xg==');

//Paths
const SM_PATHS = new Map();
SM_PATHS.set('getFields', BASE_URL + 'getFields/:viewName');

const MONGO_PATHS = new Map();
MONGO_PATHS.set('setItem', BASE_URL + 'setItem');
MONGO_PATHS.set('getItem', BASE_URL + 'getItem/:id');
MONGO_PATHS.set('deleteItem', BASE_URL + 'deleteItem/:id'); 
//MONGO_PATHS.set('getDefaultItemData', BASE_URL + 'getDefaultItemData/:viewName/:filter');
MONGO_PATHS.set('getDefaultItemData', BASE_URL + 'getDefaultItemData/:viewName');
MONGO_PATHS.set('getDefaultItemId', BASE_URL + 'getDefaultItemId/:viewName/:user');
//MONGO_PATHS.set('getItemData',  BASE_URL + 'getItemData/:id/:contactName/:filter');
MONGO_PATHS.set('getItemData',  BASE_URL + 'getItemData/:id/:contactName');
MONGO_PATHS.set('getList',  BASE_URL + 'getList/:viewName/:user');
MONGO_PATHS.set('getMaxSysmodtime',  BASE_URL + 'getMaxSysmodtime/:id/:contactName');
MONGO_PATHS.set('getExcel',  BASE_URL + 'getExcel/:id/:contactName'); 


//Учетки для подключения к Mongo
const MONGO_URLS = new Map();
MONGO_URLS.set('Natasha', 'mongodb://localhost:27017/inbox?readPreference=primary');
MONGO_URLS.set('Sasha', 'mongodb://dba:mymongodb@127.0.0.1:27017/inbox?authSource=admin');
MONGO_URLS.set('Nikolay', 'mongodb://dba:mymongodb@mongo-srv:27017/inbox?authSource=admin');

const CONNECTION_PARAMS = {
   SM: {
      auth: AUTH.get('ditSMI'),
      url: ENVIRONMENT === 'localhost' ? SYSTEM_URLS.get('SM_DEV5') : SYSTEM_URLS.get('SM_DEV5_INT'),
      paths: SM_PATHS
   },
   mongoDB: {
      paths: MONGO_PATHS,
      url: ENVIRONMENT === 'localhost' ? MONGO_URLS.get(LOCALHOST_MONGO_PATH) : MONGO_URLS.get(DOCKER_MONGO_PATH),
   },
   DB: {
      url: ENVIRONMENT === 'localhost' ? DB_URLS.get('DB_DEV') : DB_URLS.get('DB_PROTO'),
   },
   port: PORT,
   secret: '$%ewgfIu0e&Fyuy#^Egfw47'
}

module.exports = CONNECTION_PARAMS;