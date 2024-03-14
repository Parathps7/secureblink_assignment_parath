const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user","admin"],
        required: true
    },
    token: {
        type: String,
        default: ''
    }
},{
    timestamps: true
});

module.exports = mongoose.model('User',userSchema);