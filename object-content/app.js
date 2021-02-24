//Микросервис "Сущность СТП"
//Получает контент записи по клику по строке в левой части для его отображения в правой
const cfg = require('./config');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const authJwt = require('./middlewares/authJwt');
const getContentController = require('./controllers/getContent');
const createController = require('./controllers/create');
const updateController = require('./controllers/update');

//TODO: Обработчик ошибок нужно сделать
const port = cfg.port;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
   res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
   );
   next();
});

//TODO: Как-то объединить может все функции гет, пут? Они оч похожи. Надо подумать

//Получение Обращения
app.get(cfg.paths.get('sdItem'), authJwt.verifyToken, function (req, res) {
   getContentController.getSD(req, res);
});

//Получение Инцидента
app.get(cfg.paths.get('imItem'), authJwt.verifyToken, function (req, res) {
   getContentController.getIM(req, res);
});

//Получение Изменения
app.get(cfg.paths.get('cItem'), authJwt.verifyToken, function (req, res) {
   getContentController.getC(req, res);
});

//Получение Вложения
app.get(cfg.paths.get('getAtt'), authJwt.verifyToken, function (req, res) {
   getContentController.getAtt(req, res);
});

//Создание Обращения
app.post(cfg.paths.get('createSD'), authJwt.verifyToken, function (req, res) {
   createController.createSD(req, res);
});

//Инициировать нажатие кнопки или сохранение для Обращения
app.put(cfg.paths.get('sdItem'), authJwt.verifyToken, function (req, res) {
   if (req.body.action === 'execSmAction') { updateController.execSMActionSD(req, res); } else { updateController.updateSD(req, res); }
});

//Инициировать нажатие кнопки или сохранение для Инцидента
app.put(cfg.paths.get('imItem'), authJwt.verifyToken, function (req, res) {
   updateController.execSMActionIM(req, res);
});

//Инициировать нажатие кнопки или сохранение для Изменения
app.put(cfg.paths.get('cItem'), authJwt.verifyToken, function (req, res) {
   updateController.execSMActionC(req, res);
});

app.listen(port, () => {
   console.log('We are live on ' + port);
});