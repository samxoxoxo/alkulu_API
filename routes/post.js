var express = require('express');
const postService = require('../public/javascripts/services/postService');
var router = express.Router();
require('../public/javascripts/services/connection')

router.post('/post', async (req, res, next)=>{
    var postId = req.body.postid
    var userId = req.body.userid
    var  title =  req.body.title
    var content =  req.body.content
    var likes = []
    var comment = []

    var ress = await postService.post(postId, userId, title, content, likes, comment)  
    res.send(ress)
})
router.post('/like', async (req, res, next)=>{
    
})

module.exports = router;