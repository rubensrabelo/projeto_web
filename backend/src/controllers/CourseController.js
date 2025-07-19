const CourseService = require("../services/CourseService");

class CourseController {
    async create(req, res) {
        try {
            const course = await CourseService.create(req.body, req.user.id);
            res.status(201).json(course);
        } catch (err) {
            res.status(500).json({ error: "Error creating course" });
        }
    }

    async getCourseByName(req, res) {
        const {name } = req.query;

        try {
            const courses = await CourseService.getByName(name);
            res.json(courses);
        } catch (err) {
            res.status(500).json({ error: "Error searching courses by name." });
        }
    }

    async getCourseByIdWithTeacher(req, res) {
        try {
            const course = await CourseService.getCourseByIdWithTeacher(req.params.id);

            if (!course)
                return res.status(404).json({ error: "Course not found." })

            res.json(course);
        } catch (err) {
            res.status(500).json({ error: "Error fetching course" });
        }
    }

    async getCourseByIdWithStudents(req, res) {
        try {
            const course = await CourseService.getCourseByIdWithStudents(req.params.id);

            if (!course)
                return res.status(404).json({ error: "Course not found." })

            res.json(course);
        } catch (err) {
            res.status(500).json({ error: "Error fetching course" });
        }
    }

    async getCourseByName(req, res) {
        try {
            const { name } = req.query;
            const courses = await CourseService.getCourseByName(name);
            res.json(courses);
        } catch (err) {
            res.status(500).json({ error: "Error searching courses" });
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

    async enroll(req, res) {
        const studentId = req.user.id;
        const { id: courseId } = req.params;

        try {
            const course = await CourseService.enrollStudent(courseId, studentId);

            if (!course)
                return res.status(404).json({ error: "Course not found." })

            res.json({ message: "Enrolled successfully.", course });
        } catch (err) {
            res.status(400).json({ error: err.message || "Enrollment failed." })
        }
    }
}

module.exports = new CourseController();