var mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    bookid: Number,
    title: String,
    author: String,
    coAuthor: String,
    categories: Array,
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
            type: String,
        }
    }
})

module.exports = mongoose.model('Book', BookSchema, 'Book');