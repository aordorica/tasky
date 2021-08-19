// const mongoose = require("mongoose");
import mongoose from "mongoose"
import validator from "validator";

mongoose.connect("mongodb://127.0.0.1:27017/tasky_app_api", {
    useNewUrlParser: true,
    useCreateIndex: true,
});

// const Task = new mongoose.model('Task', {
//     description: {
//         type: String,
//     }, 
//     completed: {
//         type: Boolean
//     }
// })

// const task  = new Task({
//     description: 'Buy more food',
//     completed: false
// })

// task.save().then((task) => {
//     console.log(task);
// }).catch((error) => {
//     console.log(error);
// })

const User = mongoose.model("User", {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
});


const me = new User({
    name: 'Alan',
    age: 27,
    email: 'alan@yahoo.com'
})

me.save().then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
})