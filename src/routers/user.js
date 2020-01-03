const express = require('express');
const router =new express.Router() 
const User = require('../models/user')
const auth = require('../middlware/auth')




router.get('/users/me',auth,async (req,res)=>{
res.send(req.user)

})   




router.post('/users',async (req, res) => {
    const user =  new User(req.body)
    try{
        const token = await user.generateAuthToken(); 
         await user.save();
    res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)  
    }
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
        


    router.delete('/users/me',auth,async (req,res)=>{
        const _id = req.user._id;
        try{        
          await req.user.remove() 
          res.send(req.user)
        }catch(e){
        res.status(500).send(e) 
        }
        })


        router.post('/users/login',async (req,res)=>{
            try{
             const user =await  User.findBycredentials(req.body.email,req.body.password);
             const token = await user.generateAuthToken()

             await user.save()
             res.send({user,token})
            }catch(e){
                res.status(400)
            }
        })


        router.post('/users/logout',auth,async (req,res)=>{

            try{

                req.user.tokens = req.user.tokens.filter((token)=>{
                    return token.token !== req.token
                })
                await req.user.save()
                res.send() 
            }catch(e){
                res.status(500)
            }
        })

        router.post('/users/logoutAll',auth, async (req,res)=>{
            try {
                req.user.tokens = [];
                await req.user.save()
                res.send() 
            } catch (e) { 
                res.status(500)
            }
        })
 
 
module.exports = router; 