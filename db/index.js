const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const sql = require('mssql')
const cfg = require('./config');
const app = express();
const schedule = require('node-schedule');
const utils = require('./utils.js');
const mongoose = require('mongoose');
const fieldsModel = require('./models/fields');
const fieldsController = require('./controllers/fields');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//app.get(cfg.paths.get('getSql'), async (req, res) => {
app.post(cfg.paths.get('execSql'), async (req, res) => {
    try {
        await sql.connect(cfg.db);
        //let querySql = req.params.querySql;
        let querySql = req.body.query;
        //console.log('querySql=', querySql);
        const result = await sql.query(querySql);
        res.set('Access-Control-Allow-Origin', '*');
        res.send({ data: result.recordset });
    } catch (err) {
        console.log('err=', err)
    }
});

const handleEvent = async (type, data) => {
    if (type === 'query') {
        const { querySql } = data;
        try {
            await sql.connect(config);
            const result = await sql.query(querySql);
            res.send({ data: result.recordset });
        } catch (err) {
            console.log('err=', err)
        }
    }
};


app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(4005, async () => {
    console.log('Listening on 4005');

    fieldsModel.model.findOne({})
    .exec((err, fieldsConfig) => {
        if (!fieldsConfig) {
            console.log('fieldsConfig not found, call updateFields');
            updateFields();
        }
    })

    const res = await axios.get('http://localhost:4000/events'); //event-bus-srv

    for (let event of res.data) {
        console.log('Processing event:', event.type);

        handleEvent(event.type, event.data);
    }
});

mongoose.connect(cfg.mongoDB.url, {
    useUnifiedTopology: true
})
    .then(client => {
        // получение полей
        app.get(cfg.paths.get('getFields'), (req, res) => {
            fieldsController.getFields(req, res);
        });
    })
    .catch(console.error)
//mongoose.Promise = global.Promise;
//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const updateFields = () => {
    console.log('updateFields');
    const files = ['incidents', 'probsummary', 'cm3r'];
    files.forEach(file => {
        try {
            axios.post(cfg.SM.url, {
                ditMFSMAPI: {
                    Action: 'frontend_getFields',
                    Filename: file,
                }
            }, { headers: { 'Authorization': cfg.SM.auth } })
                .then(response => {
                    let data = JSON.parse(response.data.ditMFSMAPI.Response[0]);
                    const retObj = utils.getReactRespObj(data);

                    // Проверка на предмет возврата данных
                    if (!retObj || Object.keys(retObj).length === 0 && retObj.constructor === Object) {
                        throw ('No data returned');
                    }

                    const fields = retObj.fields;

                    fieldsModel.model.findOne({ 'tableName': file })
                        .exec((err, fieldsConfig) => {
                            if (fieldsConfig) {
                                fieldsConfig.fields = fields;
                                fieldsConfig.save();
                            } else {
                                if (!err) {
                                    let newFieldsConfig = new fieldsModel.model({
                                        tableName: file,
                                        fields: fields
                                    });

                                    try {
                                        newFieldsConfig.save();
                                    } catch (e) {
                                        console.log(file, 'save error e=', e);
                                    }
                                }
                            }
                        })
                })
        } catch (error) {
            console.log('getFields error: ' + JSON.stringify(error), error);
        };
    });
}

var j = schedule.scheduleJob({ hour: 00, minute: 00 }, function () {
    updateFields();
});


/*var query = 'SELECT * FROM HPCSERVICECONDM1 WHERE ID=\'1\'';
request = new Request('SELECT TOP 10 incident_id, last_next_breach FROM INCIDENTSM5 WHERE INCIDENT_ID=\'SD10387932\'', function(err) {

var Connection = require('tedious').Connection;
var config = {
    server: '172.16.54.72',
    authentication: {
        type: 'default',
        options: {
            userName: 'sm93',
            password: 'Fg12#dPi'
        }
    },
    options: {
        encrypt: true,
        database: 'sm96_dev5'
    }
};

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var connection = new Connection(config);
connection.on('connect', function(err) {
    console.log('err=', err);
    console.log("Connected");
    sql = req.params.querySql;
    console.log('sql=', sql);
    result = [];

    request = new Request(sql, function(err) {
        if (err) {
            console.log(err);
        }
    });

    request.on('row', function(columns) {
        let row = {};
        columns.forEach(function(column) {
            row[column.metadata.colName] = column.value;
        });
        result.push(row);
    });

    request.on('done', function(rowCount, more) {
        console.log(' rows returned');
        console.log(rowCount + ' rows returned');
        res.send({ data: result });
    });
    connection.execSql(request);
    console.log('result=', result);
    res.send({ data: result });
});
*/