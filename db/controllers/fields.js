const FieldsModel = require('../models/fields');


// получение списка полей
const getFields = async function (req, res) {
  const tableName = req.params.tableName;
  FieldsModel.model.find({ tableName: tableName })
    .then(data => {
      res.status(200).json(data[0].fields);
    })
    .catch(function (error) {
      res.status(500).json({ error: error });
    });
};


module.exports = {
  getFields: getFields
}
