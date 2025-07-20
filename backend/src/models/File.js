const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  savedName: { type: String, required: true },
  url: { type: String, required: true },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("File", fileSchema);
