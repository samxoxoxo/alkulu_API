var express = require('express');
const booksSchema = require('../public/javascripts/models/booksSchema');
var router = express.Router();
require('../public/javascripts/services/connection')
var cors = require('cors')
const multer = require('multer');
const bookService = require('../public/javascripts/services/bookService');

// storage of image on server with name as Date of upload

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
  .post(upload.array('imageData', 6),cors(), async (req, res, next) =>{
    console.log(req.body)
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
    imageData: req.files
    },
    qrCode: "generated"
  });

  var ress = await bookService.newBooks(newBook)
 
  res.status(200).send(ress)
  })

  router.post('/getBookdata', async (req,res,next) => {
 
    var bookData = await bookService.getBook()
    res.send(bookData)   
  })

  router.post('/action', async (req, res, next) =>{

    var book = req.body.bookid
    var type = req.body.type
    var book = await bookService.bookAction(book, type)

    res.send(book)

  })



module.exports = router;