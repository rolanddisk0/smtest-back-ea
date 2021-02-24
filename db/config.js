//Микросервис "БД"
//В разработке

//TODO: Как только сделаем архитектуру на деве и проде одинаковой, тернарный оператор для урла и путей должен быть упразднен
const ENVIRONMENT = process.env.REACT_APP_DIT_ENV || 'localhost'; //Устанавливаем среду (localhost или берем smproto из системной переменной)
const BASE_URL = ENVIRONMENT === 'localhost' ? '/sm/dev/db/' : '/smproto/sm/dev/db/';
const LOCALHOST_MONGO_PATH = 'Sasha'; //Чтобы в глубь кода не лезть, сразу тут определим
const DOCKER_MONGO_PATH = 'Nikolay'; //Если среда будет не локалхост, установим путь для Николая

//Поддерживаемые системы
const SYSTEM_URLS = new Map();
SYSTEM_URLS.set('DB_DEV5', '172.16.54.72');
SYSTEM_URLS.set('DB_DEV5_INT', '172.16.54.136');
SYSTEM_URLS.set('SM_DEV5', 'http://212.11.152.145:13083/SM/9/rest/ditMFSMAPI');
SYSTEM_URLS.set('SM_DEV5_INT', 'http://10.127.40.144:13083/SM/9/rest/ditMFSMAPI');

//Учетки для подключения к SM
const AUTH = new Map();
AUTH.set('ditSMI', 'Basic ZGl0U01JOnNlcjU2aWpodTg5Xg==');

//Paths
const PATHS = new Map();
PATHS.set('execSql', BASE_URL + 'execsql');
PATHS.set('getFields', BASE_URL + 'getFields/:tableName');

//Учетки для подключения к Mongo
const MONGO_URLS = new Map();
MONGO_URLS.set('Natasha', 'mongodb://localhost:27017/db?readPreference=primary');
MONGO_URLS.set('Sasha', 'mongodb://dba:mymongodb@127.0.0.1:27017/db?authSource=admin');
MONGO_URLS.set('Nikolay', 'mongodb://dba:mymongodb@mongo-srv:27017/db?authSource=admin');

const CONNECTION_PARAMS = {
   SM: {
      auth: AUTH.get('ditSMI'),
      url: ENVIRONMENT === 'localhost' ? SYSTEM_URLS.get('SM_DEV5') : SYSTEM_URLS.get('SM_DEV5_INT')
   },
   db: {
      user: 'sm93',
      password: 'Fg12#dPi',
      server: ENVIRONMENT === 'localhost' ? SYSTEM_URLS.get('DB_DEV5') : SYSTEM_URLS.get('DB_DEV5_INT'),
      database: 'sm96_dev5',
      connectionTimeout: 600000,
      requestTimeout: 600000,
      pool: {
          idleTimeoutMillis: 600000,
          max: 100
      }
   },
   mongoDB: {
      url: ENVIRONMENT === 'localhost' ? MONGO_URLS.get(LOCALHOST_MONGO_PATH) : MONGO_URLS.get(DOCKER_MONGO_PATH),
   },
   paths: PATHS
}

module.exports = CONNECTION_PARAMS;