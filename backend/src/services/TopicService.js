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

    async getById(id) {
        return await Topic.findById(id);
    }

    async getByCourse(courseId) {
        return await Topic.find({ course: courseId });
    }

    async update(topicId, data, teacherId) {
        const topic = await Topic.findById(topicId).populate("course");

        if (!topic)
            throw { status: 404, message: "Topic not found." };

        if (topic.course.teacher.toString() !== teacherId)
            throw { status: 403, message: "You are not allowed to update this topic." };

        Object.assign(topic, data)
        await topic.save();
        return topic;
    }
}

module.exports = new TopicService();
