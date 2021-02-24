//Микросервис "Сущность СТП"
//Получает контент записи по клику по строке в левой части для его отображения в правой
const cfg = require('./config');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const authJwt = require('./middlewares/authJwt');
const catalogDataController = require('./controllers/catalogData');

//TODO: Обработчик ошибок нужно сделать
const port = cfg.port;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//TODO: Почти все методы практически одинаковые, надо подумать как избавиться от дублирующего кода

//Получить данные по Направлению
app.get(cfg.paths.get('getDirection'), authJwt.verifyToken, function (req, res) {
   catalogDataController.getDirection(req, res);
});

//Получить данные по Группе услуг
app.get(cfg.paths.get('getGroupAffectedItem'), authJwt.verifyToken, function (req, res) {
   catalogDataController.getGroupAffectedItem(req, res);
});

//Получить данные по КЕ
app.get(cfg.paths.get('getCI'), authJwt.verifyToken, function (req, res) {
   catalogDataController.getCI(req, res);
});

//Получить данные по Сервису
app.get(cfg.paths.get('getService'), authJwt.verifyToken, function (req, res) {
   catalogDataController.getService(req, res);
});

//Получить данные по Контакту
app.get(cfg.paths.get('getContact'), authJwt.verifyToken, function (req, res) {
   catalogDataController.getContact(req, res);
});

//Получить данные по КЦ
app.get(cfg.paths.get('getKC'), authJwt.verifyToken, function (req, res) {
   catalogDataController.getKC(req, res);
});

//Получить данные по ЦК
app.get(cfg.paths.get('getCK'), authJwt.verifyToken, function (req, res) {
   catalogDataController.getCK(req, res);
});

//Получить список записей справочников с поддержкой пагинации
app.get(cfg.paths.get('getDataListWithPagination'), authJwt.verifyToken, function (req, res) {
   catalogDataController.getDataListWithPagination(req, res);
});

//Получить списки данных для полей
app.get(cfg.paths.get('getSMActionFieldsData'), authJwt.verifyToken, function (req, res) {
   catalogDataController.getSMActionFieldsData(req, res);
});

//Получить глобальные переменные
app.get(cfg.paths.get('getGlobalVars'), authJwt.verifyToken, function (req, res) {
   catalogDataController.getGlobalVars(req, res);
});

//Получение начальных небольших списков для editMode для конкретной записи
app.get(cfg.paths.get('preloadEditModeLists'), authJwt.verifyToken, function (req, res) {
   catalogDataController.preloadEditModeLists(req, res);
});

//Получение данных шаблона Обращения
app.get(cfg.paths.get('sdTplData'), authJwt.verifyToken, function (req, res) {
   catalogDataController.sdTplData(req, res);
});

//Предзагрузка списка последних Обращений для создания повторной заявки
app.get(cfg.paths.get('lastCreatedSdList'), authJwt.verifyToken, function (req, res) {
   catalogDataController.getLastCreatedSdList(req, res);
});

//Получение информации и истории по воркфлоу
app.get(cfg.paths.get('getWorkflowMeta'), authJwt.verifyToken, function (req, res) {
   catalogDataController.getWorkflowMeta(req, res);
});

app.listen(port);