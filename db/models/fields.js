const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fieldsSchema = new Schema({
    tableName: {
        type: String,
        required: true
    },
    fields: {
        type: Object,
        default: []
    }
},{
    timestamps: true
});

exports.model = mongoose.model('fields', fieldsSchema);
exports.scheme = fieldsSchema;
