const {MongoClient, ObjectID} = require('mongodb')

connectionURL = 'mongodb://127.0.0.1:27017'
databaseName = 'task-manager'

MongoClient.connect(connectionURL,{useNewUrlParser:true, useUnifiedTopology:true},(error,client)=>{
    if(error){
        return console.log('Error in connecting')
    }
    const db = client.db(databaseName)

    // db.collection('users').updateOne({
    //     _id:new ObjectID('5e32d956a3f7a01d6070dec5')
    // },{ //set the value of name to mike
    //     // $set:{
    //     //     name:'Mike'
    //     // }
    //     //increment age by 1
    //     $inc:{
    //         age:1
    //     }
    // }).then((result)=>{

    //     console.log(result)
    //     console.log(result.matchedCount)

    // }).catch((error)=>{
    //     console.log(error)
    // })

    db.collection('Challenge data').updateMany({completed:false},{
        $set:{
            completed:true
        }
    }).then((result)=>{
        console.log(result.modifiedCount)
        console.log(result.matchedCount)

    }).catch((error)=>{
        console.log(error)
    })
    
})
