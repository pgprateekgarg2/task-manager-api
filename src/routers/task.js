const express = require('express')
const router = new express.Router()
const Tasks = require('../models/tasks')
const auth = require('../middleware/auth')
//creating tasks
router.post('/tasks',auth,async (req,res)=>{
    // const tasks = new Tasks(req.body)
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send()
    }

})

//reading all tasks together
// filter
// /tasks?completed=true  done by using match

//pagination
// /tasks?limit=2&skip=2 done by using options
// values from query string are available in string which are to be 
// coverted from string to int or boolean or any other datatype so we use methods to convert the data
// parseInt convert string to int and parseFloat convert string to float 

//sorting
// /task?sortBy=createdAt:asc (asc for assending order and desc for descending order) 
// for ascending set createdAt = 1 and for descending set createdAt = -1
router.get('/tasks',auth,async (req,res)=>{
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true' // as the value is in string, this is done to receive value in boolean as this statement will return a boolean value
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        // nameOfThePropertyFromParts
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    //async await
    try{
        // const tasks = await Tasks.find({owner:req.user._id})
        //alternative way
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch(e){
        res.status(404).send()
    }
    // promise chaining
    // Tasks.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(404).send(e)
    // })
})



//reading only one tasks 
router.get('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id

    //async await
    try{
        // const user = await Tasks.findById(_id)
        const task = await Tasks.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }

    // promise chaining
    // Tasks.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(404).send(e)
    // })
})


//updating tasks
router.patch('/tasks/:id',auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    const updatesAllowed = ['description','completed']
    const isValidUpdate = updates.every((update)=>updatesAllowed.includes(update))
    const _id = req.params.id
    if(!isValidUpdate){
        return res.status(400).send('Invalid updates made')
    }
    try{
        const task = await Tasks.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>task[update] = req.body[update])
        await task.save()
        res.send(task)

    }catch(e){
        res.status(500).send(e)
    }
})

//deleting task

router.delete('/tasks/:id', auth,async(req,res)=>{
    _id = req.params.id
    try{
        const deleteTask = await Tasks.findOneAndDelete({_id,owner:req.user._id})
        if(!deleteTask){
            return res.status(404).send()
        }
        res.send(deleteTask)
    }catch(e){
        res.status(500).send(e)
    }
})


module.exports = router