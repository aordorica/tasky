import express from 'express';
import Task from '../models/tasks.js';
import auth from '../middleware/auth.js';

const router = new express.Router()

//______________________________________________________________        GET Task

router.get('/tasks', auth, async (req, res) => {
    const match =
        req.query.completed === undefined
            ? {}
            : { completed: req.query.completed };

    const sort = {}
    
    if (req.query.sortBy) {
        const part = req.query.sortBy.split('_')
        sort[part[0]] = part[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'userTasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(201).send(req.user.userTasks)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try { const task = await Task.findOne({
            _id, 
            user: req.user._id
        })
        if(!task) {
            res.status(404).send({ error: "Task not found!" });
        }

        res.status(201).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/temp', auth, async (req, res) => {
    await req.user.populate('userTasks').execPopulate()
    res.send(req.user.userTasks)
})

//______________________________________________________________        POST Task

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        user: req.user._id,
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})


//______________________________________________________________        PATCH Task

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isAllowedUpdates = updates.every((update) => allowedUpdates.includes(update))

    if(!isAllowedUpdates) {
        return res.status(400).send({ error: 'Invalid Update!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id})

        if(!task) {
            return res.status(404).send({ error: "Task not found!" });
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})


//______________________________________________________________        DELETE Task

router.delete('/tasks/:id', auth, async (req, res) => {
    try {

        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        })

        if(!task) {
            return res.status(404).send({ error: 'Task not found!' })
        }

        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

export default router