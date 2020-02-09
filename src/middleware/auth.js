
// to register a new middleware function to run we use app.use()
// app.use((req,res,next)=>{
//     if(req.method === 'GET'){
//             res.send('get request are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     res.status(503).send("Site Under Maintenance")
// })

const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.AUTH_TOKEN_SECRETKEY)
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})
        if(!user){
            throw new Error()
        }
        // saving user on request
        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send({error:'Please authenticate Perfect'})
    }
}

module.exports = auth

