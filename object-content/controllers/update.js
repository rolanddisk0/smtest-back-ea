const axios = require('axios');
const cfg = require('../config');

const execSMActionSD = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'execSMAction',
         Filename: 'Обращение',
         Key: req.params.id,
         ParamsNames: req.body.paramsNames,
         ParamsValues: req.body.paramsValues,
      }
   }, { headers: { 'Authorization': req.authToken } })
      .then(function (response) {
         res.send(response.data);
      })
      .catch(function (error) {
         console.log('error: ' + JSON.stringify(error));
         res.send(error);
      });
};

const execSMActionIM = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'execSMAction',
         Filename: 'Инцидент',
         Key: req.params.id,
         ParamsNames: req.body.paramsNames,
         ParamsValues: req.body.paramsValues,
      }
   }, { headers: { 'Authorization': req.authToken } })
      .then(function (response) {
         res.send(response.data);
      })
      .catch(function (error) {
         console.log('error: ' + JSON.stringify(error));
         res.send(error);;
      });
};

const execSMActionC = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'execSMAction',
         Filename: 'Изменение',
         Key: req.params.id,
         ParamsNames: req.body.paramsNames,
         ParamsValues: req.body.paramsValues,
      }
   }, { headers: { 'Authorization': req.authToken } })
      .then(function (response) {
         res.send(response.data);
      })
      .catch(function (error) {
         console.log('error: ' + JSON.stringify(error));
         res.send(error);;
      });
};

const updateSD = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_update',
         Filename: 'Обращение',
         Key: req.params.id,
         ParamsNames: req.body.paramsNames,
         ParamsValues: req.body.paramsValues,
      }
   }, { headers: { 'Authorization': req.authToken } })
      .then(function (response) {
         res.send(response.data);
      })
      .catch(function (error) {
         console.log('error: ' + JSON.stringify(error));
         res.send(error);
      });
};

module.exports = {
   execSMActionSD, execSMActionIM, execSMActionC, updateSD
}