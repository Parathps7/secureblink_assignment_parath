const express = require('express')
const router = express.Router()
const {register,login,forgetpassword,resetpassword} =require('../controllers/userControllers')
const csrf = require('csurf')
const bodyparser = require('body-parser')


// CSRF attack security
var csrfProtection = csrf({ cookie: true })
var parseForm = bodyparser.urlencoded({ extended: false })

// sign up
router.post('/register',parseForm,register);

//sign in
router.post('/login',parseForm,login);

//forgot password
router.post('/forget-password',parseForm,forgetpassword);


//reset password
router.post('/reset-password/:token',parseForm,resetpassword);

module.exports=router