const mongoose = require('mongoose')
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    },
    author: {
        type: String,
        required: true,
    },
    pages: {
        type: Number,
        required: true,
        min: 0,
    },
    readingStatus: {
        type: String,
        enum: ['Currently Reading', 'Done Reading', 'To Be Read'],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    favoriteByUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
})
const Book = mongoose.model('Book', bookSchema)
module.exports = Book