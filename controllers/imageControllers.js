const asyncHandler = require('express-async-handler')
const Image = require('../models/imageModel')

// add image and caption
const add = asyncHandler(async(req,res) => {
    const imagedata = req.file.filename;
    const Caption = (req.body.text) ;
    // console.log(Caption)
    if( !req.file ){
        res.status(409).send("File not uploaded");
        throw new Error("File not uploaded");
    }
    
    const data = await Image.create({
        image: imagedata,
        text: Caption
    })
    if( !data ){
        res.status(409).send("Not uploaded to database")
        return new Error("Database not uploaded")
    }
    //changed from 200 to 201
    res.status(201).send({msg:"image and text uploaded",id: data._id});
});

//delete image and caption
const del = asyncHandler(async(req,res) => {
    const todelete = await Image.findById(req.params.id);
    // console.log(todelete._id.toString())
    if(todelete==null){
        console.log(todelete)
        res.status(404)
        throw new Error("_id not found")
    }
    if(todelete._id.toString() !== req.params.id){
        res.status(403);
        throw new Error("ID not found!!!")
    }
    await todelete.deleteOne({_id: req.params.id});
    res.status(200).json({message:`This Image with id=${req.params.id} is Deleted`, Stock: todelete});
});

//view image and caption
const view = asyncHandler(async(req,res) => {
    const images = await Image.find();
    if( !images )
    {
        res.status(500).json({ error: err.message });
        throw new Error("Database access error!")
    }
    res.status(200).json(images);
});



module.exports = {add,del,view};