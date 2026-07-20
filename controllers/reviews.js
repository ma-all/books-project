const Review = require('../models/review')
const Book = require('../models/book')

const reviewBook = async (req, res) => {
    const bookFound = await Book.findById(req.params.bookId)

    await Review.create ({
        comment: req.body.comment,
        rating: req.body.rating,
        userRev: req.session.user._id,
        book: req.params.bookId
    })

    res.redirect(`/books/${req.params.bookId}/reviews`)
}

const showReview = async (req, res) => {
    // const bookFound = await Book.findById(req.params.bookId)
    const allreviews = await Review.find({ userRev: req.session.user._id}).populate('book').populate('userRev')

    const reviews = allreviews.map(review => {
        const reviewObject = review.toObject()
        if(!reviewObject.book) {
            reviewObject.book = {title: 'Book title is unknow.'}
        }
        return reviewObject
    })

    res.render('books/reviewsPage.ejs', {
        // bookFound,
        reviews,
    })
}

module.exports = { 
    reviewBook, showReview,
}