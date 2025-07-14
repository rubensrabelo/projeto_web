const Course = require("../models/Course");

class CourseService {
    async create({ name, description }, teacherId) {
        return await Course.create({ name, description, teacher: teacherId });
    }

    // Pensar em pegar esses dados em conjunto com o professor e outro com alunos
    async getCourseById(id) {
        return await Course.findById(id);
    }

    async getCoursesByTeacher(teacherId) {
        return await Course.find({ teacher: teacherId })
    }

    async getCoursesByStudent(studentId) {
        return await Course.find( {students: studentId });
    }
}

module.exports = new CourseService();