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
    admin: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('User', UserSchema, 'User');