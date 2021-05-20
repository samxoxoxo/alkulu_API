var PostSchema = require('../models/PostSchema')

module.exports = {
post : async function(postid, userid, title, content, likeCount, comment)  {
  
  var query = {
        postId: postid
    }

    var Post = new PostSchema({
        postId: postid,
        userId: userid,
        title: title,
        content: content,
        likes: likeCount,
        comments: comment
    })

 await PostSchema.findOne(query)
    .then(async chk => {
        if(!chk)  {
            await Post
            .save()
            .then(()=>{
                return respons = Post
            })
        } else {
            return respons = "Server Error"
        }
    })
    return respons;
}

}
