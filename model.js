const mongoose=require('mongoose')

const newsch= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    skills:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model("Devdata",newsch)