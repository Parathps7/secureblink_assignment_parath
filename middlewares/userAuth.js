const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const userAuth = (...role) =>{
    return async(req,res,next)=>{
        const user = await User.findOne({ _id: req.user.id }, 'role');
        if( !role.includes(user.role) ){
            res.status(401)
            const error = new Error(`The ${user.role} is Unauthorized`)
            next(error);
        }
        
        next();
    }
}

module.exports = userAuth;