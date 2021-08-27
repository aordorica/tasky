import express from 'express';
import './db/mongoose.js';
import userRouter from './routers/users.js';
import tasksRouter from './routers/tasks.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(userRouter)
app.use(tasksRouter)

// Express server

app.listen(port, () => {
    console.log('Server is up and running on on port ' + port);
})

// import User from './models/users.js';
// import Task from './models/tasks.js';

// const main = async () => {
//     const user = await User.findById("6127ee53cafb8b42fa185b66");
//     await user.populate('userTasks').execPopulate()
//     console.log(user.userTasks);
// }

// main()