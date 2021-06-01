var mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    bookid: Number,
    title: String,
    author: String,
    coAuthor: String,
    categories: String,
    pages: Number,
    publisher: String,
    keywords: Array,
    language: String,
    Volume: Number,
    image: {
        imageName: {
            type: String,
            default: "true"
        },
        imageData: {
            type: Array,
        }
    },
    qrCode: {
        type: String
    },
    issued: {
        type: Boolean
    }
})

module.exports = mongoose.model('Book', BookSchema, 'Book');