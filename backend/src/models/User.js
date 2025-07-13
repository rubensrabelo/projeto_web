const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        enum: ["student", "teacher"],
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);