import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Task from '../models/tasks.js';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid!");
            }
        },
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number");
            }
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password cannot contain 'password'");
            }
        },
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer,
    }
}, {
    timestamps: true
});

userSchema.virtual('userTasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'user'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject();

    delete userObject.tokens
    delete userObject.password
    delete userObject.avatar

    return userObject

}

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign(
        { _id: this._id.toString() },
        process.env.JWT_SECRET
    );
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};

userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({ email })
    if (!user) {
        console.log('No User!');
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        console.log('Bad Password');
        throw new Error('Unable to login!')
    }

    return user
}

// Hash plain text password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    } 
    next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({
        user: user._id
    })

    next()

})
const User = mongoose.model("User", userSchema);

export default User 