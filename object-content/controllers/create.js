const axios = require('axios');
const cfg = require('../config');

const createSD = async function (req, res) {
  let ParamsNames = ['Шаблон', 'fieldValues']
  let ParamsValues = [req.body.sdTplName, JSON.stringify(req.body)]

  axios.post(cfg.url, {
     ditMFSMAPI: {
        Action: 'frontend_create',
        Filename: 'Обращение',
        ParamsNames: ParamsNames,
        ParamsValues: ParamsValues
     }
   }, { headers: { 'Authorization': req.authToken } })
     .then(function (response) {
        //Проверка на предмет возврата данных
        if (!response.data.ditMFSMAPI.Response) {
           throw ('No data returned');
        }
        
        res.send(response.data);
     })
     .catch(function (error) {
        console.log('error: ' + JSON.stringify(error));
        error === 'No data returned' ? res.status(204).send('No data returned') : res.send(error);;
     });
};

module.exports = {
  createSD,
}