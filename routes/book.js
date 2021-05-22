var express = require('express');
const booksSchema = require('../public/javascripts/models/booksSchema');
var router = express.Router();
require('../public/javascripts/services/connection')

const multer = require('multer');
const bookService = require('../public/javascripts/services/bookService');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const fileFilter = (req, file, cb) =>{
  if(file.mimetype==="image/jpeg"||file.mimetype==="image/png"){
  cb(null,true);
  }else{
  cb(null, false);
  }
  }

  const upload = multer({
  storage: storage,
  limits: {
  fileSize: 1024*1024*5
  },
  fileFileter: fileFilter
  });

  router.route("/uploadmulter")
  .post(upload.single('imageData'), async (req, res, next) =>{
  console.log(req.body);
  const newBook = new booksSchema({
    bookid: req.body.bookid,
    title: req.body.title,
    author: req.body.author,
    coAuthor: req.body.coAuthor,
    categories: req.body.categories,
    pages: req.body.pages,
    publisher: req.body.publisher,
    keywords: req.body.keywords,
    language: req.body.language,
    Volume: req.body.volume,
    image : {
    imageName: req.body.imageName,  
    imageData: req.file.path
    }
  });

  var ress = await bookService.newBooks(newBook)
res.send(ress)
  });


module.exports = router;