const mongoose=require('mongoose')

const revsch= new mongoose.Schema({
    taskprovider:{
        type:String,
        required:true
    },
    taskdone:{
        type:String,
        required:true
    },
    rating:{
        type:String,
        required:true
    }
})

module.exports= mongoose.model("Reviews",revsch)