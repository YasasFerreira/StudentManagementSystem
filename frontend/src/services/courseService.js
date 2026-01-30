import api from './api';

export const courseService = {
    getAll: (page = 1) => api.get(`/courses?page=${page}`),
    create: (data) => api.post('/courses', data),
    update: (id, data) => api.put(`/courses/${id}`, data),
    delete: (id) => api.delete(`/courses/${id}`),
    getStudents: (id) => api.get(`/courses/${id}/students`),
    enrollStudent: (id, studentId, date) => api.post(`/courses/${id}/enroll`, {
        student_id: studentId,
        enrollment_date: date
    }),
};
