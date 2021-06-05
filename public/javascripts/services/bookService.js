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
      
        return data
    },

    bookAction: async function(deleteid, types, newBook) {
        var obj = {
            res: [],
            action: ""
        }   
      
        
        var deleteIDS = JSON.parse("[" + deleteid + "]");
        if(types === "delete") {
            await booksSchema.deleteMany({bookid: {
                $in: deleteIDS
            }}, function(err, result) {
                if (err) {
                    obj.action("Book not found or already Deleted")
                    return obj
                } else {
                  obj.res = result;
                  obj.action = "Deleted Successfully"
                  return obj
                }
              })
          
        } else if(types === "update") {
                  
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
        console.log(id)
        await booksSchema.findOne({bookid: id})
        .then(async(chk) => {
            if(!chk) return res.send("Book not available with given id")
            else {
                res.send({qr: chk.qrCode, name: chk.title})
            }
        })
    },
}