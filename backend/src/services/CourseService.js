const Course = require("../models/Course");

class CourseService {
    async create({ name, description }, teacherId) {
        return await Course.create({ name, description, teacher: teacherId });
    }

    async getCourseByIdWithTeacher(id) {
        return await Course.findById(id).populate("teacher", "firstname lastname email");
    }

    async getCourseByIdWithStudents(id) {
        return await Course.findById(id).populate("students", "firstname lastname email");
    }

    async getCoursesByTeacher(teacherId) {
        return await Course.find({ teacher: teacherId })
    }

    async getCoursesByStudent(studentId) {
        return await Course.find( {students: studentId });
    }

    async enrollStudent(courseId, studentId) {
        const course = await Course.findById(courseId);

        if(!course)
            return null;

        if(course.students.includes(studentId))
            throw new Error("Student is already enrolled")

        course.students.push(studentId);
        await course.save();

        return course;
    }
}

module.exports = new CourseService();