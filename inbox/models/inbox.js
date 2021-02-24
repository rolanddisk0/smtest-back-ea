const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inboxSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    viewName: {
        type: String,
        required: true
    },
    queryTree: {
        type: Object,
        required: true
    },
    sql: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    type: { // system, user
        type: String,
        required: true
    },
    columns: {
        type: Object,
        required: true
    },
    isCurrent: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    coloring: {
        type: Object,
        default: []
    }
},{
    timestamps: true
});

exports.model = mongoose.model('inbox', inboxSchema);
exports.scheme = inboxSchema;
