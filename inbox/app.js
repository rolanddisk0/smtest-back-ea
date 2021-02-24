//Микросервис "Сущность СТП"
//Получает контент записи по клику по строке в левой части для его отображения в правой
const cfg = require('./config');
const express = require('express');
const cors = require('cors');
var http = require('http');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const inboxController = require('./controllers/inbox');
const port = cfg.port;
const authJwt = require('./middlewares/authJwt');
//var http = require('http').Server(app);
//var io   = require('socket.io')(http);

var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(function (req, res, next) {
   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-user-id');
   res.header('Access-Control-Allow-Credentials', true)
   req.io = io;
   next();
})

//app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get(cfg.SM.paths.get('getFields'), function (req, res) {
   inboxController.getFields(req.params.viewName)
      .then(fields => {
         res.send(fields);
      })
      .catch(function (error) {
         console.log('error: ', error);
         res.send(error);
      });
});

// this should be a database or a cache
const idToConnectionHash = {};

io.on('connection', (socket) => {
   let id = socket.handshake.query.clientId;
   console.log('socket.id=', socket.id, 'id=', id);
   idToConnectionHash[id] = socket.id;
   global.idToConnectionHash = idToConnectionHash
});



mongoose.connect(cfg.mongoDB.url, {
   useUnifiedTopology: true
})
   .then(client => {
      // создание\обновление обьекта-представления
      app.post(cfg.mongoDB.paths.get('setItem'), (req, res) => {
         inboxController.setItem(req, res);
      });

      // получение обьекта-представления
      app.get(cfg.mongoDB.paths.get('getItem'), (req, res) => {
         inboxController.getItem(req, res);
      });

      // удаление обьекта-представления
      app.delete(cfg.mongoDB.paths.get('deleteItem'), (req, res) => { // [authJwt.verifyToken], ???
         inboxController.deleteItem(req, res);
      });

      // получение данных из обьекта-представления по умолчанию
      app.post(cfg.mongoDB.paths.get('getDefaultItemData'), authJwt.verifyToken, (req, res) => {
         //app.get(cfg.mongoDB.paths.get('getDefaultItemData'), [authJwt.verifyToken], (req, res) => {
         inboxController.getDefaultItemData(req, res);
      });

      // получение id обьекта-представления по умолчанию
      app.get(cfg.mongoDB.paths.get('getDefaultItemId'), authJwt.verifyToken, (req, res) => {
         inboxController.getDefaultItemId(req, res);
      });

      // получение данных из обьекта-представления
      app.post(cfg.mongoDB.paths.get('getItemData'), authJwt.verifyToken, (req, res) => {
         console.log('getItemData');
         inboxController.getItemData(req, res);
      });

      // получение максимального времени изменения
      app.post(cfg.mongoDB.paths.get('getMaxSysmodtime'), authJwt.verifyToken, (req, res) => {
         inboxController.getMaxSysmodtime(req, res);
      });

      // получение списка обьектов представлений
      app.get(cfg.mongoDB.paths.get('getList'), (req, res) => {
         inboxController.getList(req, res);
      });

      // получение excel
      app.post(cfg.mongoDB.paths.get('getExcel'), (req, res) => {
         inboxController.getExcel(req, res);
      });

      server.listen(port, () => {
         console.log('We are live on ' + port);
      });

      //app.listen(port, () => {
      //  console.log('We are live on ' + port);
      //});
   })
   .catch(console.error)

