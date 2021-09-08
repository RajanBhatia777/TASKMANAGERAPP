const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail ,sendCancelationEmail}= require('../emails/account')
const router = new express.Router()


router.post('/users',async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token =await  user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e.message)
    }

    // user.save().then(()=>{
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)

    // })
})
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user: user, token })
    } catch (e) {
        res.status(400).send()
    }
})
router.post('/user/logout', auth , async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send('User Logout Successfully')
    }catch(e){
        res.status(500).send()
    }
})
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens= []
        await req.user.save()
        res.send()

    }catch(e){
        res.status(500).send()
    }
})

const upload = multer({
    limits:{
        fileSize:5000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload THE IMAGES'))
        }
        cb(undefined,true)
    }
})
router.post('/user/me/avatar', auth , upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width:250,height:250 }).png().toBuffer()

    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
    // try{
    //     const getuser=await User.find({})
    //     res.status(200).send(getuser)
    // }catch(e){
    //     res.status(400).send(e)
    // }
})

router.get('/user/:id', async(req,res)=>{
    const _id=  req.params.id 
    try{

       const getUserById =await User.findById(_id)
       if(!getUserById){
           return res.status(404).send()
       }
           res.send(getUserById)

    }catch(e){
        res.status(400).send(e)
    }

})
router.patch('/user/me/update', auth , async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdate= ['name','email','password','age']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdate.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error: 'invalid updates!!'})
    }
    try{

        updates.forEach((update)=>{
            req.user[update]= req.body[update]
        })
        await req.user.save()
        //const updateUserById = await User.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true })
        res.send(req.user)
    }catch(e){
        res.status(401).send(e)
    }
})
router.delete('/user/me/remove',auth, async(req,res)=>{
    try{
        // const deleteUserById = await User.findByIdAndDelete(req.deleteUserById._id)
        // if(!deleteUserById){
        //     return res.status(404).send()

        // }
            await req.user.remove()
            sendCancelationEmail(req.user.email, req.user.name)
            res.send(req.user)
    }catch(e){
        res.status(401).send(e)

    }
})

router.delete('/user/me/avatar',auth , async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/user/:id/avatar', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user|| !user.avatar){
            throw new Error()
        }

        res.set('Content-Type',' image/jpg ')
        console.log('hie')

        res.send(user.avatar)
    }catch(e){
        res.status(404).send
    }
})

module.exports = router