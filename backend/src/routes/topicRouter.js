const express = require("express");
const TopicController = require("../controllers/TopicController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:courseId", auth("teacher"), TopicController.create);

router.put("/:topicId", auth("teacher"), TopicController.update);

router.get("/course/:courseId", auth(), TopicController.getByCourse);

module.exports = router;
