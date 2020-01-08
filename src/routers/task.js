const express = require('express')
const auth = require('../middlware/auth')
const router = new express.Router();
const Task = require('../models/task')




router.get('/tasks',auth,async(req,res)=>{
 //{{url}}/tasks?completed=value
    const match = {};
    if(req.query.completed){
        match.completed = req.query.completed === "true";
    }
//{{url}}/tasks?sortBy=property:asc||desc
    const sort={}

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(":")
        console.log(parts)
        sort[parts[0]] = parts[1]==="asc" ? 1 : -1;
    }

    try{
      // const tasks = await Task.find({author : req.user._id})  
     
      await req.user.populate({
          path : "tasks",
          match,
          options:{
              limit : parseInt(req.query.limit),
              skip : parseInt(req.query.skip),              
              sort
          }
      }
      ).execPopulate()
       
        res.send(req.user.tasks).status(200) 
    }catch (e){
        res.send(e).status(400);
        }

    })     




    router.get('/tasks/:id',auth,async (req,res)=>{
        const _id = req.params.id;
      try{
   const task = await Task.findOne({_id,author:req.user._id})
   if(! task){return res.send().status(404)}
   res.send(task).status(200)
      }catch(e){
        res.status(500).send()
      }
    })



router.post('/tasks',auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        author : req.user._id
    })
    try{  
        task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})
 
 
router.patch('/tasks/:id',auth,async (req,res)=>{

    const _id = req.params.id; 
const updates = Object.keys(req.body);
const allowedUpdates = ["description","completed"];
const allowed = updates.every((update)=>allowedUpdates.includes(update))

if(!allowed){ return  res.status(400).send({error : 'Invalid updates'}) }
try{
    const task = await Task.findOne({_id,author : req.user._id})

    if(!task){return send.status(404).send()}
   
    updates.forEach((update)=>task[update] = req.body[update])
    await task.save()
    res.send(task)

}catch(e){ 
res.status(400).send(e)
}
})


router.delete('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id;
    try{
    const task =await Task.findOneAndDelete({_id,author : req.user._id});
    if(!task){return res.status(404)}
    res.send(task)  
    }catch(e){ 
    res.status(500)
    }
})


module.exports = router;