var mongoose = require('mongoose');

const ManagerSchema = new mongoose.Schema({
    bookid: Number,
    author: String,
    username: String,
    bookname: String,
    issuedate: Date,
    duedate: Date,
    contact: Number,
    publisher: String,
    status: {
        type: Boolean,
        default: true
    }    
})

module.exports = mongoose.model('Manager', ManagerSchema, 'Manager');