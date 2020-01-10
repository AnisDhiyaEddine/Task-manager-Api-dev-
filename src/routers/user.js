const express = require('express');
const router =new express.Router() 
const User = require('../models/user')
const Task = require('../models/task')

const auth = require('../middlware/auth');
const upload = require('../middlware/upload');
const  Jimp = require('jimp')
const mail = require('../emails/account')

router.get('/users/me',auth,async (req,res)=>{
res.send(req.user)
})   



router.post('/users',async (req, res) => {
    const user =  new User(req.body)
    try{
        const token = await user.generateAuthToken(); 
         await user.save();
         mail.sendWelcomeEmail(user); 
    res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)  
    }
    })
  
 

    router.get('/users/:id/avatar', async (req, res) => {
        try {
            const user = await User.findById(req.params.id)

            if (!user || !user.avatar) {
                throw new Error()
            }

    
    
            res.set('Content-Type', 'image/jpg')
            res.send(user.avatar)
        } catch (e) {
            res.status(404).send()
        }
    })


router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    //Basic usage of Jimp       "feel blessed"
    const image = await Jimp.read(req.file.buffer);
    image.resize(250,250)
    req.user.avatar = await image.getBufferAsync(Jimp.MIME_PNG);
    await req.user.save()
  res.send()
},(error,req,res,next)=> {
    res.status(400).send({error : error.message})
})


router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar = undefined;
    await req.user.save()
    res.status(200).send() 
  
})


    router.patch('/users/me',auth,async (req,res)=>{
        const _id = req.user._id;
        const updates = Object.keys(req.body);
        const allowedUpdates = ["name","email","password","age"]
        const allowed = updates.every((update)=>allowedUpdates.includes(update))
        if(!allowed){ return  res.status(400).send({error : 'Invalid updates'}) }
      
        try{
          
            updates.forEach((update)=>req.user[update]=req.body[update])
           await  req.user.save()
            res.send(req.user)
           
        }catch(e){
        res.status(400).send(e)       
        }
    })
        
    router.delete('/users/me', auth, async (req, res) => {
        try {
            await req.user.remove()
            mail.sendCancelationEmail(req.user)   
            res.send(req.user)
        } catch (e) {
            res.status(500).send()
        }
    })
    

        router.post('/users/login',async (req,res)=>{
            try{
             const user =await  User.findBycredentials(req.body.email,req.body.password);
             const token = await user.generateAuthToken()
          
             await user.save()
             res.send({user,token})
            }catch(e){
                res.status(400).send()
            }
        })


        router.post('/users/logout',auth,async (req,res)=>{

            try{
                // We did not pop the last element because we may login with multiple devices

                req.user.tokens = req.user.tokens.filter((token)=>{
                    return token.token !== req.token
                })
                await req.user.save()
                res.send() 
            }catch(e){
                res.status(500).send()
            }
        })

        router.post('/users/logoutAll',auth, async (req,res)=>{
            try {
                req.user.tokens = [];
                await req.user.save()
                res.send() 
            } catch (e) { 
                res.status(500).send()
            }
        })
 
 
module.exports = router; 