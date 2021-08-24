import express from 'express';
import User from './models/users.js';
import Task from './models/tasks.js';
import './db/mongoose.js';
import { ObjectID } from 'bson';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())


//                                                  GET Requests

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(201).send(users)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if(!user) {
            res.status(404).send()
        }
        res.status(201).send(user);
    } catch (error) {
        res.status(404).send(error)
    }
})

app.get('/tasks', async (req, res) => {

    try {
        const tasks = Task.find({});
        res.status(201)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id


    try {
        const task = await Task.findById(_id)
        if(!task) {
            res.status(404).send()
        }

        res.status(201).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

//                                                  POST Requests
app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
    
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})


// Express server

app.listen(port, () => {
    console.log('Server is up and running on on port ' + port);
})

