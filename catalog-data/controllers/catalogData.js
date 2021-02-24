const axios = require('axios');
const cfg = require('../config');
const utils = require('../utils.js');

const getDirection = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_getDirection',
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
         error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);
      });
};

const getGroupAffectedItem = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_getGroupAffectedItem',
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
         error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      });
};

const getCI = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_getAffectedItem',
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
         error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      });
};

const getService = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_getService',
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
         error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      });
};

const getContact = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_getContact',
         Key: req.params.contactName,
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
         error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      });
};

const getKC = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_getKC',
         Key: req.params.kc,
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
         error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      });
};

const getCK = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_getCK',
         Key: req.params.ck,
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
         error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      });
};

const getDataListWithPagination = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_getDataListWithPagination',
         ParamsNames: ['area', 'paginationStep', 'maxCount', 'startFromRecord', 'page', 'recordNewVals'],
         ParamsValues: [req.query.area, req.query.paginationStep || 0, req.query.maxCount || 0, req.query.startFromRecord || null, req.query.page || 1, 
            req.query.recordNewVals || {}],
         Key: req.query.recordId,
         Filename: req.query.filename || null,
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
         error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      });
};

const getSMActionFieldsData = async function (req, res) {
   let paramNames = ['SMAction'];
   let paramsValues = [req.params.smAction];
   
   if (req.params.additionalParams) {
      const additionalParams = JSON.parse(req.params.additionalParams);
      paramNames = [...paramNames, ...additionalParams.paramsNames];
      paramsValues = [...paramsValues, ...additionalParams.paramsValues];
   }

   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_getSMActionFieldsData',
         Key: req.params.recordId,
         ParamsNames: paramNames,
         ParamsValues: paramsValues,
      }
   }, { headers: { 'Authorization': cfg.auth } })
      .then(function (response) {
         let data = utils.parseJsonString(response.data.ditMFSMAPI.Response[0]);

         //Проверка на предмет возврата данных
         if (!data || typeof data !== 'object' || Object.keys(data).length === 0 && data.constructor === Object) {
            throw ('No data returned');
         }

         res.send(utils.getReactRespObj(data));
      })
      .catch(function (error) {
         //console.log(error);
         error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      });
};

const getGlobalVars = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_getGlobalVars'
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
         error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      });
};

const preloadEditModeLists = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_preloadEditModeLists',
         Key: req.params.recordId,
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
         error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      });
};

const sdTplData = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_getSdTplData',
         Key: req.params.tplName,
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
         error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      });
};

const getLastCreatedSdList = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_getCreateRepeatRequestLastSDList',
         Key: req.params.tplName,
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
         error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      });
};

const getWorkflowMeta = async function (req, res) {
   axios.post(cfg.url, {
      ditMFSMAPI: {
         Action: 'frontend_getWorkflowMeta',
         Key: req.params.recordId,
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
         error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
      });
};

module.exports = {
   getDirection, getGroupAffectedItem, getCI, getService, getContact, getKC, getCK, getDataListWithPagination, getSMActionFieldsData, getGlobalVars, preloadEditModeLists, 
   sdTplData, getLastCreatedSdList, getWorkflowMeta
}