var express = require('express');
const booksSchema = require('./public/javascripts/models/booksSchema')
var router = express.Router();
const mongoose = require('mongoose')
const app = express()
const path = require('path')
var multer = require('multer')

const upload = multer({dest: 'uploadss/'})

app.use(express.static('public'))

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{

        cb(null, 'uploads')
    },
    filename: (req, file, cb) =>{
        const ext = path.extname(file.originalname);
        const filePath = `images/${ext}`
        booksSchema.create({filePath})
        .then(()=>{
            cb(null, filePath)
        })  
    }
})

const upload = multer({storage: storage,

limits: 1024 * 1024 * 5

})



router.post('/addBook', upload.array('avatar'), async (req, res, next)=>{

  console.log('here')
  console.log(url)
  var newBook = new booksSchema({
    bookid : req.body.bookid,
     title : req.body.title,
     author : req.body.author,
     coAuthor : req.body.coauthor,
     categories : req.body.categories,
     pages : req.body.pages,
     publisher : req.body.publisher,
     keywords : req.body.keywords,
     language : req.body.language,
     volume: req.body.volume,
     image: req.file.filename
})  
 
await newBook 
.save()
.then((data)=>{
    res.send({
      id: data.bookid,
      image: data.image,
    })
}).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            }); })

})

module.exports = router;