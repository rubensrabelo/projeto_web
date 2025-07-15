const Topic = require("../models/Topic");

class TopicService {
    async create({ title, type, dueDateTime, submissionLimit }, courseId) {
        return await Topic.create({
            title,
            type,
            dueDateTime,
            submissionLimit,
            course: courseId
        });
    }

    async getByCourse(courseId) {
        return await Topic.find({ course: courseId });
    }
}

module.exports = new TopicService();
