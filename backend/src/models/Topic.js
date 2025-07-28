const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["lecture", "activity"],
        required: true
    },
    dueDateTime: {
        type: Date
    },
    submissionLimit: {
        type: Number,
        default: 1
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Topic", topicSchema);
