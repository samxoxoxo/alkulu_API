var booksSchema = require('../models/booksSchema')
const QRcodes = require('qrcode')


module.exports = {
    
    newBooks: async function(book) {
        let data = `https://alkulu.netlify.app/partBook/bookid=${book.bookid}`
        
//* generating QR code in base64 and storing it in var base64QR
        //  let stringdata = JSON.stringify(data)
         var base64QR ;
     
          QRcodes.toDataURL(data, async function (err, code) {
 
        if(err){ 
                return base64QR = err
            }
            else
            {
                console.log(code)
                base64QR = code
            return base64QR
        }
        })
     
        var send = {
            bookid: null,
            status: ""
        }
      
        await booksSchema.findOne({bookid: book.bookid})
        .then(async (chk) => {
            if(!chk) {        
               
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
    image : {
    imageName: book.image.imageName,  
    imageData: book.image.imageData
    },
    qrCode: base64QR
  })
  var id;
                await newBook.save()
                .then((result)=>{
                   console.log(result.bookid)
                    id = result.bookid
                   
                }).catch((err)=>next(err));
            send.bookid = id
            send.status = "Book added Successfully"
            return send
            }
            else {
                send.bookid = undefined;
                send.status = "Book already exist with same id"
                return send
            }
        })    
        console.log(send)
        return send;    
},
    getBook: async function() {
        var data = []
        await booksSchema.find( {} )
        .then(async (result)=>{
            for(let i=0;i<result.length;i++) {
                data.push(result[i])
              }
        })
        console.log(data)
        return data
    },

    bookAction: async function(bookid, type, newBook) {
        var obj = {
            res: [],
            action: ""
        }
        if(type === "delete") {
            await booksSchema.findOneAndDelete({bookid: bookid})
            .then(async (result) => {
                if(!result) {
                    obj.action = "Book already deleted or not found"
                    return obj
                } else {
                    obj.res = result
                    obj.action = "Deleted successfully"
                    return obj
                }
            })
        } else if(type === "update") {
                  
            await booksSchema.findOneAndUpdate({bookid: bookid}, newBook, (err, result)=>{
                if(err) {
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
    getQR: async (id, res) => {
        await booksSchema.findOne({bookid: id})
        .then(async(chk) => {
            if(!chk) return res.send("Book not available with given id")
            else {
                res.send({qr: chk.qrCode, name: chk.title})
            }
        })
    },
}