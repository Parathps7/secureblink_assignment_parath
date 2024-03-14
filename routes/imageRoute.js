const express = require('express')
const router = express.Router()
const validateToken = require('../middlewares/validateTokenHandler')
const userAuth = require('../middlewares/userAuth')
const {add,del,view} =require('../controllers/imageControllers')
const multer = require('multer')
const randomstring = require('randomstring')
const path = require('path')
const csrf = require('csurf')
const bodyparser = require('body-parser')

// CSRF attack security
var csrfProtection = csrf({ cookie: true })
var parseForm = bodyparser.urlencoded({ extended: false })



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,  path.join(__dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
      cb(null,(new Date().toDateString().split(' ').join('')) + '-' + file.originalname )
    }
  })
  

const uploads = multer({ storage: storage })


// add image - admin only
router.post('/add',parseForm,validateToken,userAuth('admin'),uploads.single('file'),add);

//delete image - admin only
router.delete('/delete/:id',parseForm,validateToken,userAuth('admin'),del);

//view images - user & admin
router.get('/view',csrfProtection,validateToken,userAuth('user','admin'),view);



module.exports = router