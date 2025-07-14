const express = require("express");
const CourseController = require("../controllers/CourseController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth("teacher"), CourseController.create);
router.post("/:id/enroll", auth("student"), CourseController.enroll);

router.get("/teacher", auth("teacher"), CourseController.getByTeacher);
router.get("/student", auth("student"), CourseController.getByStudent);

router.get("/:id/teacher", auth(), CourseController.getCourseByIdWithTeacher);
router.get("/:id/students", auth(), CourseController.getCourseByIdWithStudents);

module.exports = router;