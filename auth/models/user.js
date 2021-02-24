const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const userSchema = new Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    hpsmLogin: {
        type: String,
        required: true
    },
    hpsmPassword: {
        type: String,
        required: true
    },
},{
    timestamps: true
});

exports.model = mongoose.model('user', userSchema);
exports.scheme = userSchema;
