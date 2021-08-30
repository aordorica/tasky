import express from 'express';
import './db/mongoose.js';
import userRouter from './routers/users.js';
import tasksRouter from './routers/tasks.js';

const app = express();
const port = process.env.PORT;

app.use(express.json())
app.use(userRouter)
app.use(tasksRouter)

console.log(process.env.PORT);
// Express server

app.listen(port, () => {
    console.log('Server is up and running on on port ' + port);
})