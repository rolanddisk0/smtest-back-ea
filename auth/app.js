//Микросервис "Авторизация"
const cookieSession = require('cookie-session');
const cfg = require('./config');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userController = require('./controllers/user');
const port = cfg.port;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('trust proxy', true);
app.use(
   cookieSession({
     signed: false,
     secure: false //true TODO разобраться с этим
   })
 );

// получение scaccess
/*app.get(cfg.SM.paths.get('getFields'), function (req, res) {
   inboxController.(req.params.viewName)
      .then(fields => {
         res.send(fields);
      })
      .catch(function (error) {
         console.log('error: ', error);
         res.send(error);
      });
});*/

//добавление ко вьюхе scaccess для пользователя?
//профиль посмотреть должно быть можно (и список ограничений с названиями)

mongoose.connect(cfg.mongoDB.url, {
   useUnifiedTopology: true
})
   .then(client => {
      // регистрация пользователя
      app.post(cfg.mongoDB.paths.get('signup'), (req, res) => {
         userController.signupUser(req, res);
      });

      // авторизация пользователя
      app.post(cfg.mongoDB.paths.get('signin'), (req, res) => {
         userController.signinUser(req, res);
      });

      // выход пользователя
      app.post(cfg.mongoDB.paths.get('signout'), (req, res) => {
         userController.signoutUser(req, res);
      });

      app.listen(port, () => {
         console.log('We are live on ' + port);
      });
   })
   .catch(console.error)