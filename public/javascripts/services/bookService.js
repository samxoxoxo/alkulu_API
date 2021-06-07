var booksSchema = require('../models/booksSchema')
const QRcodes = require('qrcode');
const ManagerSchema = require('../models/managerSchema');
const fun = require('../normalFunction');


module.exports = {
    //add new book with generated qr code converted into base 64
    newBooks: async function (book) {
        let data = `https://alkulu.netlify.app/partBook/bookid=${book.bookid}`

        // * generating QR code in base64 and storing it in var base64QR  let stringdata
        // = JSON.stringify(data)
        var base64QR;
        QRcodes.toDataURL(data, async function (err, code) {
            if (err) {
                return base64QR = err
            } else {
                base64QR = code
                return base64QR
            }
        })
        var send = {
            bookid: null,
            status: ""
        }

        await booksSchema
            .findOne({bookid: book.bookid})
            .then(async(chk) => {
                if (!chk) {

                    const newBook = new booksSchema({
                        bookid: book.bookid,
                        title: book.title,
                        author: book.author,
                        coAuthor: book.coAuthor,
                        categories: book.categories,
                        pages: book.pages,
                        publisher: book.publisher,
                        keywords: book.keywords,
                        language: book.language,
                        volume: book.volume,
                        image: {
                            imageName: book.image.imageName,
                            imageData: book.image.imageData
                        },
                        qrCode: base64QR
                    })
                    var id;
                    await newBook
                        .save()
                        .then((result) => {

                            id = result.bookid

                        })
                        .catch((err) => next(err));
                    send.bookid = id
                    send.status = "Book added Successfully"
                    return send
                } else {
                    send.bookid = undefined;
                    send.status = "Book already exist with same id"
                    return send
                }
            })

        return send;
    },
    //get all book in the database
    getBook: async function () {
        var data = []
        await booksSchema
            .find({})
            .then(async(result) => {
                for (let i = 0; i < result.length; i++) {
                    data.push(result[i])
                }
            })

        return data
    },
    //get all registration issued data of all books
    getManger: async function() {
        var data = []
        await ManagerSchema
        .find({})
        .then(async (result) => {
            for (let i = 0; i < result.length; i++) {
                data.push(result[i])
            }
        })
        return data
    },
    // book actions for delete and update --> update still pending!!1!!!!!!
    bookAction: async function (deleteid, types, newBook) {
        var obj = {
            res: [],
            action: ""
        }

        var deleteIDS = JSON.parse("[" + deleteid + "]");
        if (types === "delete") {
            await booksSchema
                .deleteMany({
                    bookid: {
                        $in: deleteIDS
                    }
                }, function (err, result) {
                    if (err) {
                        obj.action("Book not found or already Deleted")
                        return obj
                    } else {
                        obj.res = result;
                        obj.action = "Deleted Successfully"
                        return obj
                    }
                })

        } else if (types === "update") {

            await booksSchema.findOneAndUpdate({
                bookid: bookid
            }, newBook, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    obj.action = "Updated"
                    obj.res = result
                    return obj
                }
            })
        }
        return obj
    },
    // get qr with book id
    getQR: async(id, res) => {
        // console.log(id)
        await booksSchema
            .findOne({bookid: id})
            .then(async(chk) => {
                if (!chk) 
                    return res.send({status: "Book not available with given id"})
                else {
                    res.send({qr: chk.qrCode, name: chk.title})
                }
            })
    },
    // change issue status true false depending on scanned by admin or issued by
    // user
    issueBook: async(issueid, isadmin, res, req) => {
        await booksSchema
            .findOne({bookid: issueid})
            .then(async(chk) => {
                if (chk.issued === true) {
                    if (isadmin === "true") {
                        await booksSchema.findOneAndUpdate({
                            bookid: issueid
                        }, {
                            $set: {
                                issued: false
                            }
                        }, async(err, doc) => {
                            if (err) {
                                res.send({status: "server side error"})
                            }
                            await ManagerSchema
                                .findOneAndUpdate({bookid: issueid, status: true}, {
                                    $set: {
                                        status: false
                                    }
                                },(err, doc) => {
                                    res.send({status: "received"})
                                    if (err) {
                                        res.send({status: "server side error"})
                                    }
                                } )
                        })
                    } else {
                        res.send({status: "The book is already issued"})
                    }
                } else {
                    if (isadmin === "true") {
                        res.send({status: "The book is available"})
                    } else {
                        await booksSchema.findOneAndUpdate({
                            bookid: issueid
                        }, {
                            $set: {
                                issued: true,
                                issueCount: ++chk.issueCount
                            }
                        }, async(err, doc) => {
                            if(err) res.send({status: "server error"})
                            else {
                                const newmanager = new ManagerSchema({
                                    bookid: req.body.issueid,
                                    username: req.body.username,
                                    bookname: chk.title,
                                    author: chk.author,
                                    publisher: chk.publisher,
                                    issuedate: fun.convertDate(0),
                                    duedate: fun.convertDate(15),
                                    contact: req.body.number
                                })
                                await newmanager
                                    .save()
                                    .then(() => {
                                        res.send({status: "Issued successfully"})
                                    })
                            }
                        })
                    }
                }
            })
    },
    // check if book issued or not
    chkIssue: async(chk, res) => {
        await booksSchema
            .findOne({bookid: chk})
            .then((result) => {
                if (result.issued === true) {
                    res.send({status: "issued"})
                } else {
                    res.send({status: "not issued"})
                }
            })
    }
}