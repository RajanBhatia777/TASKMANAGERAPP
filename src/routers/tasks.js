const express = require('express')
const router = new express.Router()
const Task = require('../models/tasks')
const auth = require('../middleware/auth')



router.post('/tasks',auth, async (req,res)=>{
   // const addTask =  new Task(req.body)
   const task = new Task({
       ...req.body,
       owner: req.user._id
   })
    try{
            await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
    
})

//GET /Task?completed=false
// GET / Tasks?limit&skip=20
router.get('/tasks', auth ,async (req,res)=>{
    const match ={}
    const sort={}
    if(req.query.completed){
        match.completed=req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1]=== 'desc'? -1: 1
    }
    try{
        //const getAllTAsk =await Task.find({})
        await req.user.populate({path:'tasks', match,options:{limit:parseInt(req.query.limit)},skip:parseInt(req.query.skip),sort })
        res.send(req.user.tasks)
    }catch(e){
        res.status(400).send(e)
    }
})
router.get('/task/:id', auth , async (req,res)=>{
    const _id =  req.params.id
    try{
    
       //const getTaskById = await Task.findById(_id)
        const task = await Task.findOne({_id , owner:req.user._id})
            if(!task){
                return res.status(404).send()
            }
                res.send(task)
    }catch(e){
        res.status(401).send(e)
    }

})

router.patch('/tasks/:id', auth ,async (req,res)=>{

   const updateKeys  =Object.keys(req.body)
   const  validUpdateTask = ['description','completed']
   const isValidOperation = updateKeys.every((update)=>{
    return validUpdateTask.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error: 'invalid updates!!'})
    }
    try{
        //const updateTaskById = await Task.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators:true })
        //const updateTaskById = await Task.findById(req.params.id)
        const task= await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        updateKeys.forEach((update)=>{
            task[update]= req.body[update]
        })
        await task.save()
        res.send(task)
    }catch(e){
        res.status(401).send(e)
    }
})


router.delete('/task/:id', async (req,res)=>{
    try{
        //const deleteTaskById = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id:req.params.id, owner:req.user._id })
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})
module.exports = router