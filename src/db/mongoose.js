import mongoose from "mongoose";
import 'dotenv/config';

console.log('mongodb key', process.env.MONGODB_CONNECT_KEY);

mongoose.connect(process.env.MONGODB_CONNECT_KEY, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
