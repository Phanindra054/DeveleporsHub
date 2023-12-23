const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const app=express()
const jwt=require('jsonwebtoken')
const sch= require('./model')
const middle=require('./middlewar')
app.use(express.json())
app.use(cors({
    origin:'*'
}))
const revschema=require('./reviewmodel')
mongoose.connect('mongodb://0.0.0.0/devdata',{
    useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>console.log("Db connected succesfully"))
app.post('/register',async(req,res)=>{
    
    
    try{
         const {name,email,password,confirmpassword,mobile,dob,skills}=req.body
         const exists= await sch.findOne({email})
        if(exists)
        {
            return res.status(401).send("This User Email Already Exists")
        }
        if(password != confirmpassword)
        {
           return  res.status(402).send("Password and ConfirmPassword Must be Same")
        }
          let data=new sch({
            name,email,password,confirmpassword,mobile,dob,skills
            })
            data.save()
            return res.send("Succesfull")
        
    }
    catch(err)
    {
        console.log(err)
        return res.send(err)
    }
})
app.post('/login',async(req,res)=>{
    const {email,password}=req.body
    const exists=await sch.findOne({email})
    
    if(!exists)
    {
        return res.status(401).send('User Not Exists')
    }
    if(exists.password!==password)
    {
        return res.status(402).send('Invalid Password')
    }
    const payload={
        user:{
            id: exists._id
        }
    }
    jwt.sign(payload,'qwerty',{expiresIn:3600000},(err,token)=>{
        if(err)
        {
            return res.send(err)
        }
        else
        {
            return res.json({token})
        }
    })
})
app.get('/allprofiles',middle,async(req,res)=>{
    try{
        const notMineProfiles = await sch.find({ _id: { $ne: req.user.id } });

        return res.json(notMineProfiles)
    }
    catch(err){
        return res.send(err)
    }
})
app.get('/myprofile',middle,async(req,res)=>{
    const mypro = await sch.findById(req.user.id);
    return res.json(mypro)
})
app.post('/addreview',middle,async(req,res)=>{
    try{
        const {taskdone,rating}=req.body
        let provided= await sch.findById(req.user.id)
        const revdata=new revschema({
             taskprovider:provided.name,
             taskdone,rating
        })
        revdata.save()
        return res.json(revdata)
    }
    catch(err)
    {
        return res.send(err)
    }
})
app.get('/myreviews',middle,async(req,res)=>{
    try{
         const allrev=await revschema.find()
         const myrev= await allrev.filter(e => e.taskdone.toString() === req.user.id.toString())
        return  res.json(myrev)
    }
    catch(err){
        return res.send(err)
    }
})
app.get('/allreviews/:id', async (req, res) => {
    try {
        const {id}= req.params
      const allrev = await revschema.find();
      const myrev = allrev.filter((e) => e.taskdone.toString() === id.toString());
      return res.json(myrev);
    } catch (err) {
      return res.send(err);
    }
  });
  
app.listen(4000,()=>console.log("server running....."))