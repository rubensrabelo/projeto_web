const Course = require("../models/Course");

class CourseService {
    async create({ name, description }, teacherId) {
        return await Course.create({ name, description, teacher: teacherId });
    }

    async getCourseByIdWithTeacher(id) {
        return await Course.findById(id).populate("teacher", "name email");
    }

    async getCourseByIdWithStudents(id) {
        return await Course.findById(id).populate("students", "name email");
    }

    async getCoursesByTeacher(teacherId) {
        return await Course.find({ teacher: teacherId })
    }

    async getCoursesByStudent(studentId) {
        return await Course.find( {students: studentId });
    }
}

module.exports = new CourseService();