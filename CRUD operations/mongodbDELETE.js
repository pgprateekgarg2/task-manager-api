const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL,{useUnifiedTopology:true, useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('Failure!!')
    }

    db = client.db(databaseName)
    
    // db.collection('users').deleteMany({
    //    const age:27
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    db.collection('Challenge data').deleteOne({
        _id:ObjectID('5e32b48e28adac25e85a61f5')
    }).then((result)=>{
        console.log(result.deletedCount)
    }).catch((error)=>{
        console.log(error)
    })
})




