import mongoose from 'mongoose';
import validator from 'validator';

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const Task = new mongoose.model("Task", taskSchema);

export default Task