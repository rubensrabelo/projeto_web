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

    async getCourseByIdWithTeacher(req, res) {
        try {
            const course = await CourseService.getCourseByIdWithTeacher(req.params.id);
            
            if(!course)
                return res.status(404).json({ error: "Course not found." })

            res.json(course);
        } catch (err) {
            res.status(500).json({ error: "Error fetching course" });
        }
    }

    async getCourseByIdWithStudents(req, res) {
        try {
            const course = await CourseService.getCourseByIdWithStudents(req.params.id);
            
            if(!course)
                return res.status(404).json({ error: "Course not found." })

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