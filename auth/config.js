//Микросервис "Сущность СТП"
//Получает контент записи по клику по строке в левой части для его отображения в правой
const ENVIRONMENT = process.env.REACT_APP_DIT_ENV || 'localhost'; //Устанавливаем среду (localhost или берем smproto из системной переменной)

const LOCALHOST_MONGO_PATH = 'Sasha'; //Чтобы в глубь кода не лезть, сразу тут определим
const DOCKER_MONGO_PATH = 'Nikolay'; //Если среда будет не локалхост, установим путь для Николая

const PORT = 4001;
const BASE_URL = ENVIRONMENT === 'localhost' ? '/sm/dev/api/auth/' : '/smproto/sm/dev/api/auth/';

//Поддерживаемые системы
const SYSTEM_URLS = new Map();
SYSTEM_URLS.set('SM_DEV5', 'http://212.11.152.145:13083/SM/9/rest');
SYSTEM_URLS.set('SM_DEV5_INT', 'http://10.127.40.144:13083/SM/9/rest');
//212.11.152.145

const SM_WS = new Map();
SM_WS.set('operator', 'ditOperators');
SM_WS.set('scaccess', 'ditScaccess');
SM_WS.set('mfsmapi', 'ditMFSMAPI');

/*
    hpsmConnect: {
      restBaseUrl: 'http://10.127.41.27:13082/SM/9/rest',
      contactSvc: 'contactssmall',
      collection: 'ContactSmall',
      user: 'integrrest1',
      password: '123QWEasd'
    },*/

//Микросервис db
const DB_URLS = new Map();
DB_URLS.set('DB_DEV', 'localhost:4005');
DB_URLS.set('DB_PROTO', 'smproto-db-srv:4005/smproto');

//Учетки для подключения к SM
//Теперь не учавствуют в логике. Можно использовать для дебага разве что
const AUTH = new Map();
AUTH.set('ditSMI', 'Basic ZGl0U01JOnNlcjU2aWpodTg5Xg==');

//Paths
const SM_PATHS = new Map();
SM_PATHS.set('getFields', BASE_URL + 'getFields/:viewName');

const MONGO_PATHS = new Map();
MONGO_PATHS.set('signup', BASE_URL + 'signup');
MONGO_PATHS.set('signin', BASE_URL + 'signin');
MONGO_PATHS.set('signout', BASE_URL + 'signout');
MONGO_PATHS.set('getUser', BASE_URL + 'getUser/:id');


//Учетки для подключения к SM
const MONGO_URLS = new Map();
MONGO_URLS.set('Natasha', 'mongodb://localhost:27017/auth?readPreference=primary');
MONGO_URLS.set('Sasha', 'mongodb://dba:mymongodb@127.0.0.1:27017/auth?authSource=admin');
MONGO_URLS.set('Nikolay', 'mongodb://dba:mymongodb@mongo-srv:27017/auth?authSource=admin');

const CONNECTION_PARAMS = {
   SM: {
      auth: AUTH.get('ditSMI'),
      url: ENVIRONMENT === 'localhost' ? SYSTEM_URLS.get('SM_DEV5') : SYSTEM_URLS.get('SM_DEV5_INT'),
      paths: SM_PATHS,
      ws: SM_WS
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