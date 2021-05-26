var booksSchema = require('../models/booksSchema')
const QRcodes = require('qrcode')


module.exports = {
    
    newBooks: async function(book) {
        let data = {
            id: book.bookid
        }
//* generating QR code in base64 and storing it in var base64QR
         let stringdata = JSON.stringify(data)
         var base64QR ;
     
          QRcodes.toDataURL(stringdata, async function (err, code) {
 
        if(err){ 
                return base64QR = err
            }
            else
            {
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
                console.log(base64QR)
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
    Volume: book.volume,
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
}
}