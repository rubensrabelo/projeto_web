const mongoose = require("mongoose");

const disciplineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    classSchedule: String,
    classQuantity: Number,
    createdAt: { type: Date, default: Date.now },
    professor: {
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

module.exports = mongoose.model("Discipline", disciplineSchema);
