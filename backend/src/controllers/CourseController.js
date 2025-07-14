const CourseService = require("../services/CourseService");

class CouseController {
    async create(req, res) {
        try {
            const course = await CourseService.create(req.body, req.user.id);
            res.status(201).json(course);
        } catch (err) {
            res.status(500).json({ error: "Error creating course" });
        }
    }

    async getById(req, res) {
        try {
            const course = await CourseService.getCourseById(req.params.id);
            res.json(course);
        } catch (err) {
            res.status(500).json({ error: "Error fetching course" });
        }
    }

    async getByTeacher(req, res) {
        try {
            const courses = await CourseService.getCoursesByTeacher(req.user.id);
            res.json(courses);
        } catch (err) {
            res.status(500).json({ error: "Error fetching professor courses" });
        }
    }
    async getByStudent(req, res) {
        try {
            const courses = await CourseService.getCoursesByStudent(req.user.id);
            res.json(courses);
        } catch (err) {
            res.status(500).json({ error: "Error fetching student courses" });
        }
    }
}

module.exports = new CouseController();