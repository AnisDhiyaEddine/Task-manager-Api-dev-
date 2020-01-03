const express = require('express')
const router = new express.Router();
const Task = require('../models/task'
)
router.get('/tasks',async (req,res)=>{

    try{
        const tasks = await Task.find({})
        res.send(tasks).status(200) 
    }catch (e){
        res.send(e).status(400);
    }
    })




    router.get('/tasks/:id',async (req,res)=>{
        const _id = req.params.id;
      try{
   const task = await Task.findById(_id)
   if(! task){return res.send().status(404)}
   res.send(task).status(200)
      }catch(e){
        res.status(500).send()
      }
    })


 


router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try{
        task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

 
router.patch('/tasks/:id',async (req,res)=>{
const _id = req.params.id; 
const updates = Object.keys(req.body);
const allowedUpdates = ["description","completed"];
const allowed = updates.every((update)=>allowedUpdates.includes(update))
if(!allowed){ return  res.status(400).send({error : 'Invalid updates'}) }
try{
    const task = await Task.findById(_id)
    console.log(task)
    if(!task){return send.status(404).send()}
   
    updates.forEach((update)=>task[update] = req.body[update])
    await task.save()
    res.send(task)
}catch(e){ 
res.status(400).send(e)
}
})



router.delete('/tasks/:id',async (req,res)=>{
    const _id = req.params.id;
    try{
    const task =await Task.findByIdAndDelete(_id);
    if(!task){return res.status(404)}
    res.send(task)  
    }catch(e){ 
    res.status(500)
    }
})


module.exports = router;