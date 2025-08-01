const Course = require("../models/Course");

class CourseService {
    async create({ name, description, classSchedule, classQuantity }, teacherId) {
        return await Course.create({
            name,
            description,
            classSchedule,
            classQuantity,
            teacher: teacherId
        });
    }

    async getByName(name) {
        return await Course.find({
            name: { $regex: new RegExp(name, "i") }
        });
    }

    async getCourseByIdWithTeacher(id) {
        return await Course.findById(id).populate("teacher", "firstname lastname email");
    }

    async getCourseByIdWithStudents(id) {
        return await Course.findById(id).populate("students", "firstname lastname email");
    }

    async getCourseByName(partialName) {
        if (!partialName) {
            return await Course.find();
        }
        const regex = new RegExp(partialName, "i");
        return await Course.find({ name: regex });
    }

    async getCoursesByTeacher(teacherId) {
        return await Course.find({ teacher: teacherId })
    }

    async getCoursesByStudent(studentId) {
        return await Course.find({ students: studentId });
    }

    async enrollStudent(courseId, studentId) {
        const course = await Course.findById(courseId);

        if (!course)
            return null;

        if (course.students.includes(studentId))
            throw new Error("Student is already enrolled")

        course.students.push(studentId);
        await course.save();

        return course;
    }
}

module.exports = new CourseService();