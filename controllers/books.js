const Book = require('../models/book')

const addBookForm = (req, res) => {
    res.render('books/new.ejs')
}

const addBook = async (req, res) => {
    const bookData = {}
    bookData.title = req.body.title
    bookData.author = req.body.author
    bookData.pages = req.body.pages
    bookData.readingStatus = req.body.readingStatus
    // bookData.image

    let bookadded = await Book.addBook(bookData)
    res.redirect('/books')
}

module.exports = {
    addBookForm,
}