import express from "express";
import User from "../models/users.js";
import auth from '../middleware/auth.js';
import multer from 'multer';
import sharp from "sharp";
import {sendWelcomeEmail, sendGoodbyeEmail } from "../emails/account.js";

const router = new express.Router()
const avatar = multer({
    limits: {
        fileSize: 1000000,

    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File type not supported! Please upload JPG, JPEG, or PNG file types'))
        }

        cb(undefined, true)
    }
});

//______________________________________________________________        GET Requests

// Get user profile
router.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
});


// Get user avatar 
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id })
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send(error)
    }
})

//______________________________________________________________        POST Requests


// Create new User
router.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken()
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

// User login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

// User logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})

// User logout from all authorized devices
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

// Upload avatar image to user profile
router.post('/users/me/avatar', auth, avatar.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 300, height: 300 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//______________________________________________________________        PATCH Requests

//  Update user profile info
router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Update!" });
    }

    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save()
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

//______________________________________________________________        DELETE Requests

// Delete User profile
router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove()
        const emailResult = await sendGoodbyeEmail(req.user.email, req.user.name)
        console.log(emailResult);
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

// Delete user profile image
router.delete('/users/me/avatar', auth, avatar.single('avatarPic'), async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send() 
}, (error, req, res, next) => {
    res.status(500).send({ error: error.message })
})

export default router