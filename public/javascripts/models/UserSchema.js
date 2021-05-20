var mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },    
    password: {
        type: String,
        require: true
    },
    id : {
        type: Number,
        require: true
    }
})

module.exports = mongoose.model('User', UserSchema, 'User');