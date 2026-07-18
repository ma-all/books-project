const User = require('../models/user')
const bcrypt = require('bcrypt')

const signUpForm = (req, res) => {
    res.render('auth/sign-up.ejs')
}

const signUp = async (req, res) => {
    const addUserData = await User.findOne({
        username: req.body.username
    })
    if(addUserData){
        return res.send('Username is taken.')
    }

    let dataOfUser = {}
    dataOfUser.username = req.body.username

    const hidePass = await bcrypt.hashSync(req.body.password, 10)
    dataOfUser.password = hidePass

    const user = await User.create(dataOfUser)

    req.session.user = {
        username: user.username,
        _id: user._id
    }
    req.session.save(()=>{
        res.redirect('signed-home.ejs')
    })
}

const signInForm = (req, res) => {
    res.render('auth/sign-in.ejs')
}

const signIn = async (req, res) => {
    const allowUser = await User.findOne({
        username: req.body.username
    })
    if (!allowUser) {
        return res.send('User does not exits')
    }

    const validPass = bcrypt.compareSync(req.body.password, allowUser.password) 
    if (!validPass) {
        return res.send('Incorrect Passowrd.')
    }

    req.session.user = {
        username: allowUser.username,
        _id: allowUser._id
    }
    req.session.save(()=> {
        res.redirect('/signed-home.ejs')
    })

}

module.exports = {
    signUpForm, signUp, signInForm, signIn,
}