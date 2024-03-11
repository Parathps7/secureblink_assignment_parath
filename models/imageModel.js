const mongoose = require('mongoose')

const imgSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    text: {
        type: String,
        
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Image',imgSchema)