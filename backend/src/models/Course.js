const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    classSchedule: String,
    classQuantity: Number,
    createdAt: { type: Date, default: Date.now },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    inProgress: {
        type: Boolean,
        default: true
    },
});

module.exports = mongoose.model("Course", courseSchema);
