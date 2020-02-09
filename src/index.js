//express and database
const express = require('express')
require('./db/mongoose')
//express included
const app =express()
//port number 
const port = process.env.PORT
app.use(express.json()) // parse the incomming json data to an object
//routers
//user router
const userRouter = require('./routers/user')
app.use(userRouter)
//task router
const taskRouter = require('./routers/task')
app.use(taskRouter)

app.listen(port,()=>{
    console.log('server is up at '+port)
})