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

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({storage: storage, fileFileter: fileFilter});

router
    .route("/uploadmulter")
    .post(upload.array('imageData', 6), cors(), async(req, res, next) => {
        // console.log(req.body)
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
            volume: req.body.volume,
            image: {
                imageName: req.body.imageName,
                imageData: req.files
            },
            qrCode: "generated"
        });

        var ress = await bookService.newBooks(newBook)

        res
            .status(200)
            .send(ress)
    })

router.post('/getBookdata', async(req, res, next) => {

    var bookData = await bookService.getBook()
    res.send(bookData)
})
router.post('/getRegistration', async(req, res, next) => {
    var managerData = await bookService.getManger()
    res.send(managerData)
})

router.route('/action').post(upload.array('imageData', 6), async(req, res, next) => {
    
    var book = req.body.deleteid
    var type = req.body.type
    const newBook = {
        bookid: req.body.deleteid,
        title: req.body.title,
        author: req.body.author,
        coAuthor: req.body.coAuthor,
        categories: req.body.categories,
        pages: req.body.pages,
        publisher: req.body.publisher,
        keywords: req.body.keywords,
        language: req.body.language,
        volume: req.body.volume,
        image : { imageName: req.body.imageName, imageData: req.files }
    };
    
    if(req.body.type === "update" && req.files.length === 0) {
     newBook.image = "undefined"   
    }
    
    var book = await bookService.bookAction(book, type, newBook, res)

    res.send(book)

})

router.post('/getQR', cors(), async(req, res, next) => {
    var bookid = req.body.qrbookid;
    await bookService.getQR(bookid, res)
})                 

router.post('/issueBook', async(req, res, next) => {
    var bookid = req.body.issueid;
    var isadmin = req.body.isadmin;
    await bookService.issueBook(bookid, isadmin, res, req)
})
router.post("/chkIssue", async(req, res, next) => {
    var bookid = req.body.issueid;
    await bookService.chkIssue(bookid, res)
})
router.post("/getSpecBook", async (req, res,next) => {
    var id = req.body.specbookid
    await bookService.getSpecBook(id, res)
})
module.exports = router;