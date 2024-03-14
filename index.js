const express = require('express')
const dotenv = require('dotenv').config()
const bodyparser = require('body-parser')
var cookieParser = require('cookie-parser')
const userRoute = require('./routes/userRoute')
const imageRoute = require('./routes/imageRoute')
const app = express();
const connectdb = require('./config/dbConnection')
const logger = require('./config/loggerModel')
var cors = require('cors')
const xss = require("xss-clean")
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')

// Limiting body size
app.use(express.json({limit:'50kb'}));
app.use(bodyparser.json())
app.use(cors());
app.use(cookieParser())
connectdb();


// setup route middlewares


// Security Methods

//1. middleware for csrf attacks protection -- in routes implemented
// app.use(csrfProtection)

//2. Data sanitization against XSS attacks
app.use(xss())

//3.Rate limiting - prevent DOS
const rateLimiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: "Too many message,please try again"
})
app.use(rateLimiter)


//4.HTTP Security headers security
app.use(helmet())


//5.Prevent NoSQL query injection
app.use(mongoSanitize())

// routes setup

//test
app.get('/',(req,res)=>{res.status(200).send("It's working")})

//user register,login,forget password
app.use('/api/users',userRoute);

//image and blog portal
app.use('/api/images',imageRoute);

//error handling
const errorHandle = require('./middlewares/errorHandling')
// app.use(errorHandle)

const server = app.listen(process.env.PORT,()=>{logger.error(`info`,`Server is runnning on port ${process.env.PORT}`)})

module.exports=server