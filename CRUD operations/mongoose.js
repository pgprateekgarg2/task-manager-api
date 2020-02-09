//read validation docs in mongoose docs
// read validator library in npm

const mongoose = require('mongoose')
const validator = require('validator')
// url syntax =  url/databaseName
const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api'
mongoose.connect(connectionURL,{ //connecting to database if already created otherwise this command will create the database
    useNewUrlParser : true,
    useCreateIndex: true
 })

 const  User = mongoose.model('User',{ // creating model 
    name : {
        type: String,
        required:true,
        trim: true

    },
    email:{
        type:String,
        required:true,//this field is required without this function will not run
        trim:true, // removes all the spaces from text
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }

    },
    age: {
        type: Number,
        default:0,//default value
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    password:{
        type:String,//type of value
        required:true,
        minlength: 7,//decides minimum length
        trim:true, //trim removes extra spaces from beginning and end of the string
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain password')
            }
        }

    }
 })


//  const newUser = new User({
//    name:'  mitch  ' ,
//    email:'  mitch@gmail.com',
//    age:20,
//    password:'strongone    '

//  })

//  newUser.save().then((userData)=>{
//     console.log(userData) // will return the objId, name value age value and version of the document(__v)
//  }).catch((error)=>{
//     console.log('Error!', error)
//  })

const Task = mongoose.model('Task',{
    description:{
        type: String,
        trim:true,
        required:true
    },
    completed :{
        type: Boolean,
        default:false
    }
})


const newTask = new Task({
    description:'    Hey!! i am a task and i am not completed and i am added first',
    completed:true

}) 

newTask.save().then((taskData)=>{
    console.log(taskData)
}).catch((error)=>{
    console.log(error)
})