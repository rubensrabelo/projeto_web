const express = require("express"); 
const mongoose = require("mongoose"); 
const dotenv = require("dotenv"); 
const authRoutes = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");

dotenv.config();

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRouter);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB!");
    app.listen(process.env.PORT, () => {
        console.log(`API running on the port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log("Erro ao conectar no MongoDB:", err);
});