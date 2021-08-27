import mongoose from "mongoose"

mongoose.connect("mongodb://127.0.0.1:27017/tasky_app_api", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
