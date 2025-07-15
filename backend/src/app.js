const express = require("express"); 
const mongoose = require("mongoose"); 
const dotenv = require("dotenv");
const cors = require("cors");

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const courseRouter = require("./routes/courseRouter");
const topicRouter = require("./routes/topic.router");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/courses", courseRouter);
app.use("/topics", topicRouter);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB!");
    app.listen(process.env.PORT, () => {
        console.log(`API running on the port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log("Error connecting to MongoDB:", err);
});