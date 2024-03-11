const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const validateToken = asyncHandler(async (req,res,next)=>{
    let token;
    // const {text,email,password,adminpass} = req.body;
    // console.log(req.body);
  
    let authHeader = req.headers.Authorization||req.headers.authorization //|| req.headers.auth
    // console.log(authHeader)
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
            if(err){
                res.status(401);
                throw new Error("User is not verified");
            }
            req.user = decoded.user;
            // req.text = text;
            next();
        });
        if(!token){
            res.status(401);
            throw new Error("User is not authorized or token is missing in request")
        }
    }else{
        res.status(401);
        throw new Error("token not passed with Bearer tag")
    }
});

module.exports = validateToken;