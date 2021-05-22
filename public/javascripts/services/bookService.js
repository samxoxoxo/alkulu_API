var booksSchema = require('../models/booksSchema')

module.exports = {
    
    newBooks: async function(book) {
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
    Volume: book.volume,
    image : {
    imageName: book.image.imageName,  
    imageData: book.image.imageData
    }
  });
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
        return send    
}
}