//loads .env
const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

const mongoose = require('mongoose') 
const methodOverride = require('method-override') //for deleting
const morgan = require('morgan')
const session = require('express-session') //manage user sessions 
const { MongoStore } = require('connect-mongo')

//needed to check if user is signed in or not
const userIsSigned = require('./middleware/is-user-signed-in')

const authCtrl = require('./controllers/auth')
const bookCtrl = require('./controllers/books')

const port = process.env.PORT ? process.env.PORT : '3000'

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(session({ //handles the session
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}))

//auth  
//sign up
app.get('/auth/sign-up', authCtrl.signUpForm) 
app.post('/auth/sign-up', authCtrl.signUp)
//sign in
app.get('/auth/sign-in', authCtrl.signInForm)
app.post('/auth/sign-in', authCtrl.signIn)

//books
//adding book
// app.get('/book/new.ejs',)

app.get('/', (req, res) => {
    res.render('signed-home.ejs', {
        user: req.session.user
    })
})



app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})