import express from "express";
import "./db/mongoose.js";
import userRouter from "./routers/users.js";
import tasksRouter from "./routers/tasks.js";

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(tasksRouter);

export default app