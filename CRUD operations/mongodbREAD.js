const {MongoClient,ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL,{useNewUrlParser:true, useUnifiedTopology: true},(error,client)=>{
    if(error){
        return console.log('Unable to connect')
    }
        const db = client.db(databaseName)
            
        //fetching data where ObjectID = the given one
        db.collection('users').findOne({ _id: new ObjectID("5e32d956a3f7a01d6070dec5")},(error,users)=>{
            if(error){
                return console.log('Unable to fetch data')
            }
            console.log(users) // this will return the first document with name jen
        })
            //find is used to fetch many documents at a time
            //dont take any callback function as argument
            //returns a cursor/pointer which provides several functionalities and prevent unnecessary loading of data into memory
            //by using cursor we can fetch data, find the count of fields satisfying the search criteria and many more(refer to the documentation)

            //fetching data where age = 27
            db.collection('users').find({ age:27 }).toArray((error, users)=>{
                console.log(users)
            })

            //fetching the count of documents in which age is 27
            db.collection('users').find({ age:27 }).count((error, users)=>{
                console.log(users)
            })

            db.collection('Challenge data').findOne({_id:new ObjectID('5e32b48e28adac25e85a61f7')},(error,ChallengeData)=>{
                if(error){
                    return console.log('Unable to fetch')
                }
                console.log(ChallengeData)
            })

            //fetching all the tasks which are completed
            db.collection('Challenge data').find({completed:false}).toArray((error,ChallengeData)=>{
                if(error){
                    return console.log('Unable to fetch')
                }
                console.log(ChallengeData)
            })
})

