var Posts = require('../public/javascripts/models/Post') 

function postData() {
    var review = []
    var likeCount = []
    var Post = new Posts({
        postId: req.body.postId,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
        likes: likeCount,
        comments: review,
        timestamp: req.body.timestamp
    })
return Post
}

module.exports = {postData}