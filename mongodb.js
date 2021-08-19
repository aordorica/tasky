const { ObjectId, MongoClient } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'tasky_app'

MongoClient.connect(connectionURL, { useNewURLParser: true }, (error, client) => {
    if(error) {
        return console.log('Unable to connect to Database!');
    }

    const db = client.db(databaseName)

    // const updatePromise  = db.collection("users").updateOne({
    //     _id: new ObjectId("611c5733725310f096a3e9f7"),
    // }, {
    //     $inc: {
    //         age: 1
    //     }
    // });

    // updatePromise.then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    // db.collection('tasks').updateMany({ 
    //     completed: true
    // }, {
    //     $unset: {
    //         priority: '', 
    //         color: ''
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    // db.collection('users').deleteMany({
    //     age: 27
    // }).then((result) => {
    //     console.log(result.deletedCount);
    // }).catch((error) => {
    //     console.log(error);
    // })


    db.collection("tasks").deleteOne({
        description: "Take Out the Trash".toLowerCase()
    }).then((result) => {
        console.log(result.deletedCount);
    }).catch((error) => {
        console.log(error);
    });
})
