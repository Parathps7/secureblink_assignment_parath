const User = require('../models/userModel')
const nodemailer = require('nodemailer')
const randomstring = require('randomstring')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const sendresetemail = async(name,email,token) => {
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
             user: process.env.EMAIL_USER,
             pass: process.env.EMAIL_PASSWORD,
            },
            from: process.env.EMAIL_USER
           });

        const mailOptions = {
            from : process.env.EMAIL_USER,
            to: email,
            subject: "For Reset Password",
            html: `<p>Hi ${name}, Please copy the <a href="http://localhost:${process.env.PORT}/api/users/reset-password/${token}">link</a> to reset your password</p>`
        }

        transporter.sendMail(mailOptions,function(error,infor){
            if(error){
                // console.log(error)
            }
            else{
                console.log("Message has been sent!",info.response);
            }
        })
    }
    catch(e){
        res.status(400).send({success: false,msg: e.message});
    }
}


const login = asyncHandler(async(req,res) => {
    const {email,password}=req.body
    if(!email||!password){
        res.status(422).send({success:false,msg:"All fields are mandatory"}) 
    }
    const user = await User.findOne({email});
    //compare password with hashed passowrd
    if(user!==null){
        const verify_password = await bcrypt.compare(password,user.password);
        if(verify_password){
            const accessToken = jwt.sign({
            user:{
                username: user.username,
                email:user.email,
                id: user.id
            }
        },process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '1d'});
        res.status(200).json({accessToken})
        }
        else{
            res.status(401).send({success:false,msg:"Password invalid"})
        }
    }else{
        res.status(403)
        throw new Error("email or password not valid");
    }
});

//register
const register = asyncHandler(async(req,res) => {
    const {username,email,password,adminpass} = req.body;
    if( !username || !email || !password ){
        res.status(422).send({success:false,msg:"Please enter all credentials(username,email,password)"});
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(409).send("user already registered")
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password,10);
    if( adminpass && adminpass !== process.env.ADMIN_PASS ){
        res.status(401).send("Wrong admin password.To register as user keep adminpass empty")
        throw new Error(`Wrong admin password`);
    }
    else if( !adminpass || adminpass == '' || adminpass == null ){
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: "user"
        });
        if(user){
            res.status(200).json({_id: user.id,email:user.email,role:user.role});
        }else{
            res.status(422);
            throw new Error("User data not valid")
        }
    }
    else
    {
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: "admin"
        });
        if(user){
            res.status(200).json({_id: user.id,email:user.email,role:user.role});            
        }else{
            res.status(422);
            throw new Error("User data not valid")
        }
    }
});

const forgetpassword = asyncHandler(async(req,res) => {
    const {email} = req.body;
    if(!email){res.status(404).send({success:false,msg:"Please enter email"})}
    const userData = await User.findOne({email});
    if( !userData ){
        res.status(404);
        throw new Error("No given email found!");
    }
    const Token = jwt.sign({id: userData._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn: "1d"});
    const data = await User.updateOne({email:email},{$set:{token: Token}});
    sendresetemail(userData.name,userData.email,Token);
    // We are returning token in response here just to run tests,in real world scenerio token will only be sent via email
    res.status(200).send({token:Token,success:true,msg:`Reset email sent to ${req.body.email}.Please check Inbox!.Make POST request with "password"=<new_password> in body`})

});


const resetpassword = asyncHandler(async(req,res) => {
    const {password} = req.body;
    const token = req.params.token;
    console.log(password)
    if(password === undefined || password.length < 8 ){res.status(404).send({success:false,msg:"Please enter a password and also > 8 letters"})}
    const userData =await User.findOne({token});
    if(!userData){
        res.status(401).send({msg:"Link expired!"})
        throw new Error("Link expired")
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,decoded) => {
        if( err )res.status(401).send({msg:"Error with token!"})
        else{
            const hashedPassword = await bcrypt.hash(password,10);
            const data = await User.updateOne({token:token},{$set:{password: hashedPassword}});
            if( !data ){
                res.status(400).send({msg:"Not updated!!Try again!"})
            }
            else{
                res.status(200).send({msg:"Password was successfully updated!"})
                // To change token in database so that someone can't reuse jwt token to reset password again before it expires 
                const randToken = randomstring.generate();
                await User.updateOne({password:hashedPassword},{$set:{token: randToken}});
            }
        }
    })
});

module.exports = {register,login,forgetpassword,resetpassword};
