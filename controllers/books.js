const Book = require('../models/book')
const cloudinary = require('../config/cloudinary')
const uploadimages = require('../config/multer')

const addBookForm = (req, res) => {
    res.render('books/new.ejs')
}

const addImg = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadimages = cloudinary.uploader.upload_stream({
            folder: 'books-project/books',
            resource_type: 'image'
        },
        (error, result) => {
            if(error) {
                reject(error)
            } else {
                resolve(result)
            }
        }
    )
    uploadimages.end(fileBuffer)
    })
}

const addBook = async (req, res) => {
    
    const addedImg = await addImg(req.file.buffer)

    const bookData = {}
    bookData.user = req.session.user._id
    bookData.title = req.body.title
    bookData.author = req.body.author
    bookData.pages = req.body.pages
    bookData.readingStatus = req.body.readingStatus
    bookData.image = {
        url: addedImg.secure_url,
        publicId: addedImg.public_id,
    }

    if(req.body.image) {
        bookData.image = req.body.image
    }

    let bookadded = await Book.create(bookData)
    res.redirect('books/show.ejs')
}

const index = async (req, res) => {
    const allBooks = await Book.find().populate('user')
    res.render('books/index.ejs', {allBooks})
}

const showBook = async (req, res) => {
    const bookFound = await Book.findById(req.params.bookId).populate('user')

    res.render('books/show.ejs', {
        bookFound,
    })
}

const editBook = async (req, res) => {
    const bookFound = await Book.findById(req.params.bookId)
    res.render('books/edit.ejs', {
        bookFound,
    })
}

const updateBook = async (req, res) => {
    const bookFound = await Book.findById(req.params.bookId)
    const oldPublicId = bookFound.image?.publicId

    bookFound.user = req.session.user._id
    bookFound.title = req.body.title
    bookFound.author = req.body.author
    bookFound.pages = req.body.pages
    bookFound.readingStatus = req.body.readingStatus

    if(req.file) {
        const addedImg = await uploadimages(req.file.buffer)
        bookFound.image = {
            url: addedImg.secure_url,
            publicId: addedImg.public_id,
        }
    }

    await bookFound.save()
    res.redirect(`/books/${req.params.bookId}`)
}

const removeBook = async (req, res) => {
    const bookFound = await Book.findById(req.params.bookId)

    if(bookFound.user.equals(req.session.user._id)) {
        await Book.findByIdAndDelete(req.params.bookId)
        res.redirect('/books')
    } else {
        res.send('no removing')
    }
}

module.exports = {
    addBookForm, addBook, index, showBook, editBook, updateBook, removeBook,
}

//CODE GRAVEYARD
//Update Book Function:
    // let bookData = {}
    // bookData.user = req.session.user._id
    // bookData.title = req.body.title
    // bookData.author = req.body.author
    // bookData.pages = req.body.pages
    // bookData.readingStatus = req.body.readingStatus
    // await Book.findByIdAndUpdate(req.params.bookId, bookData)