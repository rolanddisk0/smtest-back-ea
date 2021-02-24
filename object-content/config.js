//Микросервис "Сущность СТП"
//Получает контент записи по клику по строке в левой части для его отображения в правой

//TODO: Как только сделаем архитектуру на деве и проде одинаковой, тернарный оператор для урла и путей должен быть упразднен
const ENVIRONMENT = process.env.REACT_APP_DIT_ENV || 'localhost'; //Устанавливаем среду (localhost или берем smproto из системной переменной)
const BASE_URL = ENVIRONMENT === 'localhost' ? '/sm/dev/rec/' : '/smproto/sm/dev/rec/';
const PORT = 4004;

//MONGO
const LOCALHOST_MONGO_PATH = 'Sasha'; //Чтобы в глубь кода не лезть, сразу тут определим
const DOCKER_MONGO_PATH = 'Nikolay'; //Если среда будет не локалхост, установим путь для Николая

//Учетки для подключения к MONGO
const MONGO_URLS = new Map();
MONGO_URLS.set('Natasha', 'mongodb://localhost:27017/auth?readPreference=primary');
MONGO_URLS.set('Sasha', 'mongodb://dba:mymongodb@127.0.0.1:27017/auth?authSource=admin');
MONGO_URLS.set('Nikolay', 'mongodb://dba:mymongodb@mongo-srv:27017/auth?authSource=admin');

//Поддерживаемые системы
const SYSTEM_URLS = new Map();
SYSTEM_URLS.set('SM_DEV5', 'http://212.11.152.145:13083/SM/9/rest/ditMFSMAPI');
SYSTEM_URLS.set('SM_DEV5_INT', 'http://10.127.40.144:13083/SM/9/rest/ditMFSMAPI');

//Поддерживаемые сервисы для получения вложений
const ATTACH_BASE_URLS = new Map();
ATTACH_BASE_URLS.set('SM_DEV5_ATTACH', 'http://212.11.152.145:13083/SM/9/rest/ditMFSMAPIGetAtt');
ATTACH_BASE_URLS.set('SM_DEV5_INT_ATTACH', 'http://10.127.40.144:13083/SM/9/rest/ditMFSMAPIGetAtt');

//Учетки для подключения к SM
const AUTH = new Map();
AUTH.set('Disp_Inj', 'Basic RGlzcF9Jbmo6UXdlcnR5MTIz');
AUTH.set('ditSMI', 'Basic ZGl0U01JOnNlcjU2aWpodTg5Xg==');

//Paths
const PATHS = new Map();
PATHS.set('sdItem', BASE_URL + 'sd/item/:id');
PATHS.set('imItem', BASE_URL + 'im/item/:id');
PATHS.set('cItem', BASE_URL + 'cm3/item/:id');
PATHS.set('createSD', BASE_URL + 'sd/item/');
PATHS.set('getAtt', BASE_URL + 'att/:area/:recordId/:uid');

const CONNECTION_PARAMS = {
   auth: AUTH.get('ditSMI'),
   url: ENVIRONMENT === 'localhost' ? SYSTEM_URLS.get('SM_DEV5') : SYSTEM_URLS.get('SM_DEV5_INT'),
   attachBaseUrl: ENVIRONMENT === 'localhost' ? ATTACH_BASE_URLS.get('SM_DEV5_ATTACH') : ATTACH_BASE_URLS.get('SM_DEV5_INT_ATTACH'),
   paths: PATHS,
   port: PORT,
   secret: '$%ewgfIu0e&Fyuy#^Egfw47',
   mongoDB: {
      url: ENVIRONMENT === 'localhost' ? MONGO_URLS.get(LOCALHOST_MONGO_PATH) : MONGO_URLS.get(DOCKER_MONGO_PATH),
   },
}

module.exports = CONNECTION_PARAMS;
