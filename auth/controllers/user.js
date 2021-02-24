const UserModel = require('../models/user');
const axios = require('axios');
const cfg = require('./../config');
const errorHandler = require('../errorHandler.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const utils = require('./../utils.js');


// создание (регистрация) пользователя
const signupUser = async function (req, res) {
  let hpsmLogin = req.body.hpsmLogin;
  let hpsmPassword = req.body.hpsmPassword;

  UserModel.model.findOne({ $or:[ {'hpsmLogin': hpsmLogin}, {'login': req.body.login} ]})
  .exec((err, user) => {
    if (user) {
      return res.status(401).send({ messageText: 'Пользователь уже существует' });
    }
  })

  axios.get(`${cfg.SM.url}/${cfg.SM.ws.get('operator')}?view=expand&query="name=\\"${hpsmLogin}\\""`,
    {
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${hpsmLogin}:${hpsmPassword}`).toString('base64')
      }
    })
    .then(async resData => {
      if (resData.ReturnCode && resData.Messages) {
        if (resData.Messages[0] == 'Not Authorized') {
          return res.status(401).json({ err: resData.Messages[0] })
        } else {
          return res.status(400).json({ err: 'Unhandled error' })
        }
      }
      if (resData.data.content) {// регистрируем пользователя
        const salt = bcrypt.genSaltSync(10);
        let user = new UserModel.model({
          login: req.body.login,
          password: bcrypt.hashSync(req.body.password, salt),
          hpsmLogin: hpsmLogin,
          hpsmPassword: hpsmPassword
        });

        try {
          await user.save();

          res.status(201).json({ success: true, user: user });
        } catch (e) {
          errorHandler(res, e)
        }
      } else { // если пользователь не найден
        errorHandler(res, e)
      }
    })
    .catch(e => {
      errorHandler(res, e)
    });
};

const getSCaccess = async function(operator, authToken) {
  try {
      const response = await axios.post(`${cfg.SM.url}/${cfg.SM.ws.get('mfsmapi')}`, {
          ditMFSMAPI: {
              Action: 'frontend_getSCaccess',
              Key: operator
          }
      }, { headers: { 'Authorization': authToken } }) //cfg.SM.auth

      let data = JSON.parse(response.data.ditMFSMAPI.Response[0]);
      const retObj = utils.getReactRespObj(data);
      //console.log('retObj=', retObj.scaccess);

      // Проверка на предмет возврата данных
      if (!retObj || Object.keys(retObj).length === 0 && retObj.constructor === Object) {
          throw ('No data returned');
      }

      return retObj.scaccess;
  } catch (error) {
      console.log('getSCaccess error: ' + JSON.stringify(error), error);
  };
}

// авторизация пользователя
const signinUser = async function (req, res) {
  //логин\пароль к порталу
  const { login, password, userId } = req.body;

  if (!userId && (!login || !password)) {
    errorHandler(res, 'Ошибка входа: Не получена информация о пользователе');
  }

  //Если произошла перезагрузка страницы или открытие в новой вкладке, сюда придет только userId
  const findInMongoParam = login && password ? { login } : userId;

  const findUser = login && password 
    ? (findParam) => UserModel.model.findOne(findParam) 
    : (findParam) => UserModel.model.findById(findParam);

  findUser(findInMongoParam)
  .exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ messageText: 'Пользователь не найден' });
    }

    if (login && password) {
      const passwordIsValid = bcrypt.compareSync(
        password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          messageText: 'Некорректный логин/пароль на портале'
        });
      }
    }

    const hpsmLogin = user.hpsmLogin;
    const hpsmPassword = user.hpsmPassword;

    //axios.get(`${cfg.SM.url}/${cfg.SM.ws.get('operator')}?view=expand&query="name=\\"${hpsmLogin}\\""`,
    axios.get(`${cfg.SM.url}/${cfg.SM.ws.get('operator')}?view=expand&query=name="${hpsmLogin}"`,
      {
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(`${hpsmLogin}:${hpsmPassword}`).toString('base64')
        }
      })
      .then(async resData => {
        if (resData.ReturnCode && resData.Messages) {
          if (resData.Messages[0] == 'Not Authorized') {
            return res.status(401).json({ err: resData.Messages[0] })
          } else {
            return res.status(400).json({ err: 'Unhandled error' })
          }
        }
        if (resData.data.content && resData.data.content[0]) {// оператор
          const operator = resData.data.content[0].Operator;
          // const token = jwt.sign({ id: user._id }, cfg.secret, {
          //   expiresIn: 86400 // 24 hours
          // });


          const authString = 'Basic ' + Buffer.from(`${hpsmLogin}:${hpsmPassword}`).toString('base64');
          //Шифруем в токене строку для подключения к SM
          const authSMToken = 'Basic ' + Buffer.from(`${hpsmLogin}:${hpsmPassword}`).toString('base64');
          const authToken = jwt.sign({ authToken: authSMToken }, cfg.secret, {
            expiresIn: 86400 // 24 hours
          });

          //console.log('token=', token);
          //console.log('operator=', operator);

          /*if (operator.SecurityGroup) {
            try {
            let scaccessQuery = `security.id=\\"'${operator.SecurityGroup.join('\\" or security.id=\\"')}\\"`;
            let scaccessURL = encodeURI(`${cfg.SM.url}/${cfg.SM.ws.get('scaccess')}?view=expand&query="${scaccessQuery}"`);
            let scaccessResult = await axios.get(scaccessURL,
              {
                headers: {
                  'Content-type': 'application/json',
                  'Authorization': 'Basic ' + Buffer.from(`${hpsmLogin}:${hpsmPassword}`).toString('base64')
                }
              })
              if (scaccessResult.data.content) {
                //console.log('scaccessResult.data.content=', scaccessResult.data.content);
              }
            } catch (e) {
              console.log('e=', e);
            }
          }*/

          let scaccessFilters = await getSCaccess(hpsmLogin, authSMToken);
          //console.log('scaccessFilters=', scaccessFilters);

          req.session = {
            jwt: authToken
          };

          res.status(200).send({
            success: true,
            id: user._id,
            login: user.login,
            email: operator.Email,
            scaccess: operator.SecurityGroup,
            scaccessFilters: scaccessFilters,
            accessToken: authToken,
            name: operator.ContactName,
            role: operator.Role,
          });
        } else { // если пользователь не найден
          errorHandler(res, e)
        }
      })
      .catch(e => {
        errorHandler(res, e)
      });
  });
};


// выход пользователя, пока заглушка
const signoutUser = async function (req, res) {
  req.session = null;
  
  res.status(200).send({
    success: true
  });
};


//проверка прав в hpsm
module.exports = {
  signupUser: signupUser,
  signinUser: signinUser,
  signoutUser: signoutUser
}