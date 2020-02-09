// CRUD create read update delete

//importing mongodb
// const mongodb = require('mongodb')
// initializing Mongo Client which handles connecting and interacting with a Mongodb database
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID } = require("mongodb")

const id = new ObjectID()

/*
Returns a new ObjectId value. The 12-byte ObjectId value consists of:

a 4-byte timestamp value, representing the ObjectId’s creation, measured in seconds since the Unix epoch
a 5-byte random value
a 3-byte incrementing counter, initialized to a random value
object ids are stored as binary to reduce the size of object id to half 
the randomly denerated key is passed to the Objectid('') which converts it into binary
*/ 
console.log(id)
console.log(id.id) //this will return the raw binary object key
console.log(id.getTimestamp()) //to get when the object id is created
console.log(id.id.length) // length of id 
console.log(id.toHexString().length) // this length is 24 and the binary length is 12 which is half of this.


//url to which database id needed to be connected
const connectionURL = 'mongodb://127.0.0.1:27017'
// name of database
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology:true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }
    // get the connection for the specific database and if the database is not there then it will we created automatically by mongodb.
    const db = client.db(databaseName)

    // this will create collection in database and insert a document in that collection which will have three fields 2 of which we created and one is created by mongodb which is object_id(which is the unique id for the particular document and everytime we create a document this object id will be created automatically).
    // collections(collectionName).insertOne({dataToBeInserted},callBackfunction which will return the error if any or the result that what data was inserted including _id)
    db.collection('users').insertOne({
        // _id:id, // assigning object id to document which is generated here in the program
        name: 'Vikram',
        age: 23
    }, (error, result) => {
        // this function will run after the previous work has completed
        // this function takes 2 arguments error if something went bad and result if everything went good
        // result will contain operation result which contains the data and object id as well
        if (error) {
            return console.log('Unable to insert User')
        }
        // ops is an array of documents in a collection
        console.log(result.ops)
    })
    // db.collection('users').insertMany([
    //     {
    //         name:'Prateek',
    //         age: 21
    //     },
    //     {
    //         name:'Andrew',
    //         age:27
    //     },{
    //         name:'Jen',
    //         age: 25
    //     }
    // ],(error,result)=>{
    //     if(error){
    //         return console.log('Unable to insert')
    //     }
    //     console.log(result.ops)
    //     console.log('Number of Documents: '+result.insertedCount)
    // })
    // db.collection('Challenge data').insertMany([
    //     {
    //         description: "this is the first note",
    //         completed: true
    //     },
    //     {
    //         description: "this is the second note",
    //         completed: false
    //     },
    //     {
    //         description: "this is the third note",
    //         completed: true
    //     }
    // ],(error,result)=>{
    //     if(error){
    //         return console.log('Unable to insert')
    //     } 
    //     console.log(result.ops)
    // })
})
