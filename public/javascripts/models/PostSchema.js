var mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    postId: Number,
    userId: Number,
    title: String,
    content: String,
    likes: Array,
    comments: Array
})

module.exports = mongoose.model('Post', PostSchema, 'Post');