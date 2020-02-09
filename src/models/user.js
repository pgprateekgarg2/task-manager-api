const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')
// creating schema
const userSchema = new mongoose.Schema({
    name:{
        type : String,
        trim:true,
        required:true
    },
    email:{
        unique:true, // to prevent the duplicacy in email i.e., one email can't be used again to create user
        type:String,
        trim:true,
        lowercase:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Enter a valid email')
            }
        }

    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('enter another password')
            }
        }

    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age can\'t be negative')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps: true
})

// virtual property
// this is not actual data stored in the database. its a relationship between two entities
userSchema.virtual('tasks',{
    ref: 'Tasks',
    localField:'_id', // user id in user model
    foreignField:'owner' // name of the field on the other thing(in this case on the task)
})

// hiding private data
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject  
}


// static functins are accessible on the models and are called model methods
// by setting the credential on schema.statics we are setting up as something we can access directly on the model
userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await Users.findOne({email})
    if(!user){
        throw new Error('Unable to Login')
    }
    const isMatch = await bcrypt.compareSync(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

// methods are accessible on instances called instance method
userSchema.methods.generateAuthToken = async function(){
    const user = this

    const token = jwt.sign({_id:user._id.toString()},process.env.AUTH_TOKEN_SECRETKEY)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

//setting up the middleware for userSchema
// we have two methods pre and post 
// pre is executed before the event is saved and post is executed after the event is saved
// takes two arguments pre('eventName',notArrowfunctionButAStandardFunction())

//hashing the password before saving
userSchema.pre('save',async function(next){
    //next will be used in the end when we are done with out function execution
    // this refers to the value which is being saved
    //this gives us access to the user which is about to be saved
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// delete user tak when user is removed
userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})

const Users = mongoose.model('users',userSchema)


module.exports = Users