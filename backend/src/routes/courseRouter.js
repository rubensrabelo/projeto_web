const express = require("express");
const CourseController = require("../controllers/CourseController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth("teacher"), CourseController.create);
router.get("/:id", auth(), CourseController.getById);
router.get("/teacher", auth("teacher"), CourseController.getByTeacher);
router.get("/student", auth("student"), CourseController.getById);

module.exports = router;