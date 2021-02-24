const axios = require('axios');
const cfg = require('../config');
const utils = require('../utils.js');

const getSD = async function (req, res) {
  axios.post(cfg.url, {
    ditMFSMAPI: {
      Action: 'frontend_getContent',
      Filename: 'Обращение',
      Key: req.params.id,
    }
  }, { headers: { 'Authorization': req.authToken } })
    .then(function (response) {
      let data = utils.parseJsonString(response.data.ditMFSMAPI.Response[0]);

      //Проверка на предмет возврата данных
      if (!data || typeof data !== 'object' || Object.keys(data).length === 0 && data.constructor === Object) {
        throw ('No data returned');
      }
      
      res.send(utils.getReactRespObj(data));
    })
    .catch(function (error) {
      console.log('error=', error);
      if (error.message === 'Request failed with status code 401') {
        res.status(204).send(error.message)
      } else {
        error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      }
    });
};

const getIM = async function (req, res) {
  axios.post(cfg.url, {
    ditMFSMAPI: {
      Action: 'frontend_getContent',
      Filename: 'Инцидент',
      Key: req.params.id,
    }
  }, { headers: { 'Authorization': req.authToken } })
    .then(function (response) {
      let data = utils.parseJsonString(response.data.ditMFSMAPI.Response[0]);

      //Проверка на предмет возврата данных
      if (!data || typeof data !== 'object' || Object.keys(data).length === 0 && data.constructor === Object) {
        throw ('No data returned');
      }

      res.send(utils.getReactRespObj(data));
    })
    .catch(function (error) {
      if (error.message === 'Request failed with status code 401') {
        res.status(204).send(error.message)
      } else {
        error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      }
    });
};

const getC = async function (req, res) {
  axios.post(cfg.url, {
    ditMFSMAPI: {
      Action: 'frontend_getContent',
      Filename: 'Изменение',
      Key: req.params.id,
    }
  }, { headers: { 'Authorization': req.authToken } })
    .then(function (response) {
      let data = utils.parseJsonString(response.data.ditMFSMAPI.Response[0]);

      //Проверка на предмет возврата данных
      if (!data || typeof data !== 'object' || Object.keys(data).length === 0 && data.constructor === Object) {
        throw ('No data returned');
      }

      res.send(utils.getReactRespObj(data));
    })
    .catch(function (error) {
      if (error.message === 'Request failed with status code 401') {
        res.status(204).send(error.message)
      } else {
        error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      }
    });
};

const getAtt = async function (req, res) {
  axios.get(`${cfg.attachBaseUrl}${req.params.area}/${req.params.recordId}/attachments/${req.params.uid}`,
    {
      responseType: 'arraybuffer',
      headers: { 'Authorization': req.authToken }
    })
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.log('error: ' + JSON.stringify(error));
      error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
    });
};

module.exports = {
  getSD, getIM, getC, getAtt
}