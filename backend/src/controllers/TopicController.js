const Course = require("../models/Course");
const TopicService = require("../services/TopicService");

class TopicController {
    async create(req, res) {
        const { title, type, dueDateTime, submissionLimit } = req.body;
        const { courseId } = req.params;
        const teacherId = req.user.id;

        try {
            const course = await Course.findById(courseId);
            if (!course)
                return res.status(404).json({ error: "Course not found." });

            if (course.teacher.toString() !== teacherId)
                return res.status(403).json({ error: "You are not the teacher of this course." });

            const topicData = { title, type, dueDateTime, submissionLimit };
            const topic = await TopicService.create(topicData, courseId);

            res.status(201).json(topic);
        } catch (err) {
            res.status(500).json({ error: "Error creating topic." });
        }
    }

    async getByCourse(req, res) {
        const { courseId } = req.params;
        try {
            const topics = await TopicService.getByCourse(courseId);
            res.json(topics);
        } catch (err) {
            res.status(500).json({ error: "Error fetching topics" });
        }
    }

    async update(req, res) {
        const { topicId } = req.params;
        const { teacherId } = req.user.id;
        const data = req.body;

        try {
            const updated = await TopicService.update(topicId, data, teacherId);

            res.json(updated)
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message || "Error updating topic." });
        }
    }
}

module.exports = new TopicController();
