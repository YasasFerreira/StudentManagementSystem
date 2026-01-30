import api from './api';

const enrollmentService = {
    getEnrollments: async (page = 1) => {
        const response = await api.get(`/enrollments?page=${page}`);
        return response.data;
    },
    enroll: async (studentId, courseId, enrollmentDate) => {
        const response = await api.post('/enrollments', {
            student_id: studentId,
            course_id: courseId,
            enrollment_date: enrollmentDate,
            status: 'enrolled'
        });
        return response.data;
    },
    deleteEnrollment: async (id) => {
        const response = await api.delete(`/enrollments/${id}`);
        return response.data;
    }
};

export default enrollmentService;
