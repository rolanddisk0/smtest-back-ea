
const InboxModel = require('../models/inbox');
const mapping = require('./../mapping');
const axios = require('axios');
const cfg = require('./../config');
const Excel = require('exceljs');

const getRecords = async function (query, uniqueKey) {
    try {
        const response = await axios.post(`http://${cfg.DB.url}/sm/dev/db/execsql`, {
            query: query
        });
        //const response = await axios.get(`http://${cfg.DB.url}/sm/dev/db/getsql/` + query);
        const data = response.data.data;

        //уникальный ключ должен всегда присутствовать
        if (uniqueKey) {
            formattedData = data.map((record) => {
                if (typeof record[uniqueKey] == 'object') {
                    return {
                        ...record,
                        [uniqueKey]: record[uniqueKey][0]
                    }
                } else {
                    return record
                }
            })
            return formattedData;
        } else {
            return data;
        }
    } catch (error) {
        console.log('getRecords error: ' + JSON.stringify(error), error);
    };
}

// TODO разобраться с БД
const getFields = async function (viewName) {
    try {
        const response = await axios.get(`http://${cfg.DB.url}/sm/dev/db/getFields/${mapping.viewNameMapping[viewName]}`);
        const data = response.data;

        return data;
    } catch (error) {
        console.log('getFields error: ' + JSON.stringify(error), error);
    };
}

/*const getFields = async function (viewName) {
    try {
        const response = await axios.post(cfg.SM.url, {
            ditMFSMAPI: {
                Action: 'frontend_getFields',
                Filename: mapping.viewNameMapping[viewName],
            }
        }, { headers: { 'Authorization': cfg.SM.auth } })
        let data = JSON.parse(response.data.ditMFSMAPI.Response[0]);
        const retObj = utils.getReactRespObj(data);

        // Проверка на предмет возврата данных
        if (!retObj || Object.keys(retObj).length === 0 && retObj.constructor === Object) {
            throw ('No data returned');
        }

        //console.log('retObj.fields=', retObj.fields);
        return retObj.fields;
    } catch (error) {
        console.log('getFields error: ' + JSON.stringify(error), error);
    };
}*/

const updateAttribute = async function (viewName, attribute, user) {
    inboxes = await InboxModel.model.find({ [attribute]: true, viewName: viewName, type: { $ne: 'system' }, user: user });
    inboxes.forEach(async inbox => {
        inbox[attribute] = false;
        await inbox.save({ checkKeys: false });
    });
}

// создание обьекта представления
const setItem = async function (req, res) {
    let id = req.body._id;
    let inbox = null;
    let changeDefault = false;
    //let changeCurrent = false;

    if (id) {
        inbox = await InboxModel.model.findOne({ _id: id });

        if (inbox) {
            // if (inbox.isCurrent != req.body.isCurrent && req.body.isCurrent == true) {
            //     changeCurrent = true;
            // }

            if (inbox.isDefault != req.body.isDefault && req.body.isDefault == true) {
                changeDefault = true;
            }

            inbox.name = req.body.name,
                inbox.viewName = req.body.viewName,
                inbox.queryTree = req.body.queryTree,
                inbox.queryConfig = req.body.queryConfig,
                inbox.sql = req.body.sql,
                inbox.columns = req.body.columns,
                inbox.type = req.body.type,
                inbox.user = req.body.user,
                inbox.coloring = req.body.coloring,
                //inbox.isCurrent = req.body.isCurrent,
                inbox.isActive = req.body.isActive,
                inbox.isDefault = req.body.isDefault
        } else {
            res.status(404).json({ error: 'Представление не найдено' });
        }
    } else {
        inbox = new InboxModel.model({
            name: req.body.name,
            viewName: req.body.viewName,
            queryTree: req.body.queryTree,
            queryConfig: req.body.queryConfig,
            sql: req.body.sql,
            columns: req.body.columns,
            type: req.body.type,
            user: req.body.user,
            coloring: req.body.coloring,
            //isCurrent: req.body.isCurrent,
            isActive: req.body.isActive,
            isDefault: req.body.isDefault
        });

        // if (req.body.isCurrent == true) {
        //     changeCurrent = true;
        // }

        if (req.body.isDefault == true) {
            changeDefault = true;
        }
    }

    if (inbox) {
        try {
            if (changeDefault) {
                await updateAttribute(req.body.viewName, 'isDefault', req.body.user)
            }

            // if (changeCurrent) {
            //     await updateAttribute(req.body.viewName, 'isCurrent')
            // }

            await inbox.save({ checkKeys: false });

            res.status(201).json({ success: true, data: inbox });
        } catch (e) {
            console.log('e=', e);
            res.status(404).json({ error: 'Ошибка добавления представления' });
        }
    }
};

// const getColumns = function (viewName, columns) {
//     const uniqueKey = mapping.unuqueKeys[viewName];
//     let result = 'm1.' + uniqueKey;

//     columns.forEach(column => {
//         result += column.id == uniqueKey ? '' : ' ,' + column.id; // Исключить код записи на фронте?
//     })

//     return result;
// }

// получение обьекта-представления
const getItem = async function (req, res) {
    const id = req.params.id;
    const inbox = await InboxModel.model.findOne({ _id: id });

    if (inbox) {
        res.status(200).json(inbox);
    } else {
        res.status(404).json({ error: 'inbox not found' }); // TODO Ошибки
    }
};

// удаление обьекта-представления
const deleteItem = async function (req, res) {
    const id = req.params.id;
    InboxModel.model.remove({ _id: id }, function (err, result) {
        if (err) {
            res.status(404).json({ error: err });
        } else {
            res.status(200).json(true);
        }
    })
};

const getDefaultItemId = async function (req, res) {
    const viewName = req.params.viewName;
    const user = req.params.user;
    // сначала ищем представления пользователя по умолчанию
    let inbox = await InboxModel.model.findOne({ viewName: viewName, type: 'user', isDefault: true, user: user });

    if (inbox) {
        res.status(200).json({
            id: inbox._id,
        });
    } else {
        // если нет, то системное представление по умолчанию
        inbox = await InboxModel.model.findOne({ viewName: viewName, type: 'system', isDefault: true });

        if (inbox) {
            res.status(200).json({
                id: inbox._id,
            });
        } else {
            res.status(404).json({ error: 'default inbox not found' }); // TODO Ошибки
        }
    }
};

const getRelatedRecord = function (screlation, uniqueKey) {
    let relatedRecord = {
        [uniqueKey]: screlation.DEPEND,
    }
    const desc = screlation.DESC.split('\n');
    switch (screlation.SOURCE_FILENAME) {
        case 'cm3r':
            relatedRecord['CURRENT_PHASE'] = screlation.DEPEND_FILENAME == 'cm3r' ? desc[1] : desc[0];
            break;
        case 'problem':
        case 'incidents':
            relatedRecord['HPC_STATUS'] = screlation.DEPEND_FILENAME == 'cm3r' ? desc[1] : desc[0];
            break;
    }

    return relatedRecord;
}

// получение данных из обьекта-представления
const getItemData = async function (req, res) {
    const id = req.params.id;
    const filter = req.body.filter;
    const contactName = req.params.contactName; // name, инициатор
    const inbox = await InboxModel.model.findOne({ _id: id });
    const page = req.query.page || 1;
    //console.log('filter=', filter);

    if (inbox) {
        //const columns = getColumns(inbox.viewName, inbox.columns);
        const uniqueKey = mapping.unuqueKeys[inbox.viewName];
        let query = '';
        const sql = getSqlString(inbox, filter, contactName);
        console.log('sql=', sql);

        // общее кол-во записей
        const countData = await getRecords(`select count (*) as count from ${mapping.todoMapping[inbox.viewName]} where ${sql}`);
        const count = countData[0]['count'];
        console.log('count=', count);

        if (page) {
            const limit = req.query.limit || 500;
            const sortByField = req.query.sortByField == uniqueKey ? `m1.${uniqueKey}` : req.query.sortByField || `m1.${uniqueKey}`;
            const sortByOrder = req.query.sortByOrder || 'ASC';
            console.log('page=', page, 'limit=', limit, sortByField, sortByOrder);
            /*const offset = page * limit;
            const firstTable = `${mapping.viewNameMapping[inbox.viewName]}m1`;
            query = `SELECT TOP ${limit} m1.${uniqueKey}, * FROM ${mapping.todoMapping[inbox.viewName]} where ${sql}` +
                ` and  m1.${uniqueKey} not in (SELECT TOP ${offset - limit} off1.${uniqueKey} FROM ${firstTable} off1 where ${sql} ORDER BY off1.${uniqueKey}) ` +
                ` ORDER BY m1.${uniqueKey}`;*/
            /*query = `DECLARE @offset int, @batch_size int;
                SELECT @offset = ${page}, @batch_size = ${limit};
                DECLARE @order_id varchar(60);
                SET ROWCOUNT @offset;
                SELECT @order_id=m1.${uniqueKey}
                    FROM ${mapping.todoMapping[inbox.viewName]}
                      where ${sql} ORDER BY ${sortByField} ${sortByOrder};
                SET ROWCOUNT @batch_size;
                SELECT m1.${uniqueKey}, * FROM ${mapping.todoMapping[inbox.viewName]} where ${sql} and m1.${uniqueKey} >= @order_id
                ORDER BY ${sortByField} ${sortByOrder}
                SET ROWCOUNT 0;`*/
            query = `SELECT m1.${uniqueKey}, * FROM ${mapping.todoMapping[inbox.viewName]} 
                where ${sql} 
                ORDER BY ${sortByField} ${sortByOrder}
                OFFSET ${(page - 1) * limit} ROWS FETCH NEXT ${limit} ROWS ONLY`
        } else {
            query = `select top 1000 * from ${mapping.todoMapping[inbox.viewName]} where ${sql}`; //top 400
        }

        console.log('query=', query);
        const data = await getRecords(query, uniqueKey);
        const fields = await getFields(inbox.viewName); // TODO убрать!!!
        const maxTable = inbox.viewName == 'dit_p_cm3_all' ? 'm2' : 'm1';
        const maxSysmodtime = await getRecords(`SELECT max(${maxTable}.sysmodtime) as value FROM ${mapping.todoMapping[inbox.viewName]} where ${sql}`);
        console.log('getInbox completed page=', page);

        for (let i = 0; i < data.length; i++) {
            let related = await getRecords(`SELECT * FROM SCRELATIONM1 SC WHERE SC.SOURCE='${data[i][uniqueKey]}'`);

            let subRows = [];
            for (let r = 0; r < related.length; r++) {
                /* let relatedRecordData = await getRecords(`SELECT m1.${mapping.unuqueKeysRelation[related[r].DEPEND_FILENAME]}, 
                * FROM ${mapping.relationMapping[related[r].DEPEND_FILENAME]} and m1.${mapping.unuqueKeysRelation[related[r].DEPEND_FILENAME]}='${related[r].DEPEND}'`);
                if (relatedRecordData.length > 0) {
                    let relatedRecord = {
                        ...relatedRecordData[0],
                        [uniqueKey]: related[r].DEPEND
                    }
                    subRows.push(relatedRecord);
                }*/
                subRows.push(getRelatedRecord(related[r], uniqueKey));
            }

            if (subRows.length > 0) {
                data[i].subRows = subRows;
            }
        }

        res.status(200).json({
            records: data,
            columns: inbox.columns,
            uniqueKey: uniqueKey,
            coloring: inbox.coloring,
            name: inbox.name,
            viewName: inbox.viewName,
            id: inbox._id,
            fields: fields,
            itemsCount: count,
            maxSysmodtime: maxSysmodtime[0].value
        });
    } else {
        res.status(404).json({ error: 'inbox not found' }); // TODO Ошибки
    }
};

// получение максимального времени изменения
const getMaxSysmodtime = async function (req, res) {
    const id = req.params.id;
    const filter = req.body.filter;
    const contactName = req.params.contactName; // name, инициатор
    const inbox = await InboxModel.model.findOne({ _id: id });

    if (inbox) {
        const sql = getSqlString(inbox, filter, contactName);
        const maxTable = inbox.viewName == 'dit_p_cm3_all' ? 'm2' : 'm1';
        const maxSysmodtime = await getRecords(`SELECT max(${maxTable}.sysmodtime) as value FROM ${mapping.todoMapping[inbox.viewName]} where ${sql}`);
        console.log('maxSysmodtime=', maxSysmodtime);

        res.status(200).json({
            maxSysmodtime: maxSysmodtime[0].value
        });
    } else {
        res.status(404).json({ error: 'inbox not found' }); // TODO Ошибки
    }
};


// получение списка представлений
const getList = async function (req, res) {
    let result = {};
    const user = req.params.user;
    const viewName = req.params.viewName;
    result.otherInboxData = [];

    try {
        InboxModel.model.find({ viewName: viewName, type: 'system' }, ['name', 'isCurrent', 'isDefault', 'isActive'])
            .then(data => {
                result.systemInboxData = data;

                InboxModel.model.find({ viewName: viewName, user: user, type: 'user' }, ['name', 'isCurrent', 'isDefault', 'isActive'])
                    .then(data => {
                        result.myInboxData = data;
                        res.status(200).json(result);
                    })
                    .catch(function (error) {
                        res.status(500).json({ error: error });
                    });
            })
            .catch(function (error) {
                res.status(500).json({ error: error });
            });

        /* // представления других пользователей
        InboxModel.model.find({viewName: viewName, user: user, type: 'user'},  ['name', 'isCurrent', 'isDefault', 'isActive'], function(err, data){
         result.myInboxData = data;
        });*/
    } catch (error) {
        res.status(500).json({ error: error }); // TODO Ошибки
    }
};

const getSqlString = (inbox, filter, contactName) => {
    let result = inbox.sql;
    const addFilter = filter && filter != 'true' && filter != true ? ' and (' + filter + ')' : '';
    result += addFilter;

    if (inbox.viewName == 'dit_p_sd_all' && inbox.name == 'Мои обращения') {
        result += ' and contact_name=\'' + contactName + '\'';
    }

    return result;
}

const clientCancelledRequest = 'clientCancelledRequest';

// генерация excel-файла
// прогресс бар нужен с возможностью прерывания
const getExcel = async function (req, res) {
    const id = req.params.id;
    const clientId = req.body.clientId;
    const socketId =  global.idToConnectionHash[clientId];
    const filter = req.body.filter;
    const contactName = req.params.contactName; // name, инициатор
    const inbox = await InboxModel.model.findOne({ _id: id });

    if (inbox) {
        const uniqueKey = mapping.unuqueKeys[inbox.viewName];
        const sql = getSqlString(inbox, filter, contactName);
        const sortByField = req.query.sortByField == uniqueKey ? `m1.${uniqueKey}` : req.query.sortByField || `m1.${uniqueKey}`;
        const sortByOrder = req.query.sortByOrder || 'ASC';
        let cancelRequest = false;

        // req.io.on('closeExcel', function (err){
        //    cancelRequest = true;
        //    console.log('closeExcel received');
        // });

        req.connection.on('close',function(){
            cancelRequest = true;
            console.log('close received');
        })

        try {
            const countData = await getRecords(`select count (*) as count from ${mapping.todoMapping[inbox.viewName]} where ${sql}`);
            const count = countData[0]['count'];
            const options = {
                useStyles: true,
                useSharedStrings: true,
                stream: res
            };
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=' + 'export.xlsx');

            const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
            const worksheet = workbook.addWorksheet('export');
            const columns = [];
            inbox.columns.forEach((column) => {
                columns.push({
                    header: column.label,
                    key: column.id,
                    width: 10
                });
            })
            worksheet.columns = columns;

            let page = 1;
            let step;
            if (count > 3000) {
                step = 1000;
            } else if (count > 1000) {
                step = 500;
            } else if (count > 200) {
                step = 100;
            } else if (count > 100) {
                step = 50;
            } else {
                step = 10;
            }

            for (let i = 0; i < count; i = i + step) {
                if (cancelRequest) {
                    throw {type: clientCancelledRequest};
                }
                let offset = (page - 1) * step;
                let query = `SELECT m1.${uniqueKey}, * FROM ${mapping.todoMapping[inbox.viewName]} where ${sql} ORDER BY ${sortByField} ${sortByOrder}
                    OFFSET ${offset} ROWS FETCH NEXT ${step} ROWS ONLY`
                let data = await getRecords(query, uniqueKey);
                if (cancelRequest) {
                    throw {type: clientCancelledRequest};
                }
                req.io.to(socketId).emit('excelProgress', { count: offset });
                data.forEach((row) => {
                    let rowObj = {};
                    inbox.columns.forEach((column) => {
                        rowObj[column.id] = row[column.id]
                    })
                    worksheet.addRow(rowObj).commit();
                })
                page++;
            }

            workbook.commit().then(()=>{
                console.log('File write done........');
            })
        } catch (error) {
            console.log('error=', error);
            if (error.type !== clientCancelledRequest) {
                res.status(500).json({ error: error });
            }
        }
    }
};


module.exports = {
    getList: getList,
    getItemData: getItemData,
    //getDefaultItemData: getDefaultItemData,
    getDefaultItemId: getDefaultItemId,
    deleteItem: deleteItem,
    getItem: getItem,
    setItem: setItem,
    getFields: getFields,
    getMaxSysmodtime: getMaxSysmodtime,
    getExcel: getExcel
}

// получение данных из обьекта-представления по умолчанию, уже не нужно
/*const getDefaultItemData = async function (req, res) {
    const viewName = req.params.viewName;
    const filter = req.body.filter;
    const inbox = await InboxModel.model.findOne({ viewName: viewName, type: 'system' });
    const page = req.query.page || 1;
    console.log('page=', page);

    if (inbox) {
        //const columns = getColumns(viewName, inbox.columns);
        let sql = inbox.sql;
        const uniqueKey = mapping.unuqueKeys[viewName];
        let query = '';
        const addFilter = filter && filter != 'true' ? ' and (' + filter + ')' : '';
        sql += addFilter;

        if (inbox.viewName == 'dit_p_sd_all' && inbox.name == 'Мои обращения') {
            sql = 'contact_name=\'' + contactName + '\''; // and (' + sql + ')
        }

        // общее кол-во записей
        const countData = await getRecords(`select count (*) as count from ${mapping.todoMapping[inbox.viewName]} where ${sql}`);
        const count = countData[0]['count'];

        if (page) {
            const limit = 500;
            //const offset = page * limit;
            //const firstTable = `${mapping.viewNameMapping[viewName]}m1`;

            query = `DECLARE @offset int, @batch_size int;
                SELECT @offset = ${page}, @batch_size = ${limit};
                DECLARE @order_id varchar(60);
                SET ROWCOUNT @offset;
                SELECT @order_id=m1.${uniqueKey}
                    FROM ${mapping.todoMapping[viewName]}
                    where ${sql} ORDER BY m1.${uniqueKey} ASC;
                SET ROWCOUNT @batch_size;
                SELECT m1.${uniqueKey}, * FROM ${mapping.todoMapping[viewName]} where ${sql} and m1.${uniqueKey} >= @order_id
                ORDER BY m1.${uniqueKey} ASC
                SET ROWCOUNT 0;`;
        } else {
            query = `select top 1000 * from ${mapping.todoMapping[viewName]} where ${sql}`;
        }
        const data = await getRecords(query, uniqueKey, res);
        const fields = await getFields(viewName);

        res.status(200).json({
            records: data,
            columns: inbox.columns,
            uniqueKey: uniqueKey,
            coloring: inbox.coloring,
            name: inbox.name,
            viewName: inbox.viewName,
            id: inbox._id,
            fields: fields,
            itemsCount: count
        });
    } else {
        res.status(404).json({ error: 'default inbox not found' }); // TODO Ошибки
    }
};*/

// query = `SELECT TOP ${limit} m1.${uniqueKey}, * FROM ${mapping.todoMapping[viewName]} where ${sql}` +
//     ` and  m1.${uniqueKey} not in (SELECT TOP ${offset - limit} off1.${uniqueKey} FROM ${firstTable} off1 where ${sql} ORDER BY off1.${uniqueKey}) ` +
//     ` ORDER BY m1.${uniqueKey}`;*/
// query = `SELECT TOP ${limit} m1.${uniqueKey}, * FROM ${mapping.todoMapping[viewName]} where ${sql}` +
// ` and  m1.${uniqueKey} not in (SELECT TOP ${offset - limit} off1.${uniqueKey} FROM ${firstTable} off1 where ${sql} and ${addFilter} ORDER BY off1.${uniqueKey}) ` +
// (filter && filter != 'true' ? ' and (' + filter + ')' : '') +
// ` ORDER BY m1.${uniqueKey}`;
// query = `SELECT TOP ${offset} m1.${uniqueKey}, * FROM ${mapping.todoMapping[viewName]} where ${sql}` +
//     ` and  m1.${uniqueKey} not in (SELECT TOP ${offset - limit} m1.${uniqueKey} FROM ${firstTable} where ${addFilter}) ` +
//     (filter && filter != 'true' ? ' and (' + filter + ')' : '') +
//     ` ORDER BY m1.${uniqueKey}`;*/
// query = `WITH num_row AS (` + 
//     `SELECT row_number() OVER (ORDER BY m1.${uniqueKey}) as nom, * ` +
//     `FROM ${mapping.todoMapping[viewName]}) ` +
//     `SELECT * FROM num_row ` + 
//     `WHERE nom BETWEEN ${offset - limit} AND ${offset}`;