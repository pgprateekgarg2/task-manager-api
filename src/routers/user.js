const express = require('express')
const Users = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const accounts = require('../emails/account')
// creating user
router.post('/users',async (req,res)=>{
    const user = new Users(req.body)
    try{
        await user.save()
        await accounts.sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()

        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
    
})

//logging user in
router.post('/users/login',async(req,res)=>{
    try{
        const user = await Users.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user: user, token})
    }catch(e){
        res.status(400).send()
    }
})

//loggin out
router.post('/users/logout',auth,async(req,res)=>{
    try{
        //create the array of tokens in which the last token is not present 
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})


// auth is the middleware which will run befor the function in the third argument runs.
router.get('/users/me',auth ,async (req,res)=>{
    res.send(req.user)
})



// updating user
router.patch('/users/me',auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    const validUpdates = ['name','age','password','email']
    const isValid = updates.every((update)=>validUpdates.includes(update))
    if(!isValid){
        return res.status(400).send('Invalid Update')
    }
    try{
        updates.forEach((update)=>req.user[update] = req.body[update])
        await req.user.save()        
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

//deleting user
router.delete('/users/me', auth ,async (req,res)=>{
    try{
        // const user = await Users.findByIdAndDelete(req.user._id)
        // // if(!user){
        // //     return res.status(404).send()
        // // }
        await req.user.remove()
        accounts.sendCancellationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

// uploading image to user

const upload = multer({
    limits:{
        fileSize: 1000000, //size limit 1mb
    },
    fileFilter(req,file,cb){
        // if not a pdf
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("please upload a word document"))
        }
        cb(undefined,true)

        // using callback cb
        // cb(new Error('File must a pdf')) // send error
        // cb(undefined,true) // accept the upload
        // cb(undefined,false) // silently reject the upload
    }
})

router.post('/users/me/upload',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
    req.user.avatar = buffer
    // req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{// to handle uncatch error
    res.status(400).send({error:error.message})
})

// deleting image uploaded

router.delete('/users/me/upload',auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//fetching image

router.get('/users/:id/avatar',async (req,res)=>{
    try{
        const user = await Users.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-type','image/jpg') //setting response header
        res.send(user.avatar)


    }catch(e){
        res.status(404).send()
    }
})



module.exports = router