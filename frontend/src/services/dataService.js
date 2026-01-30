import api from './api';

export const studentService = {
    getAll: (page = 1) => api.get(`/students?page=${page}`),
    get: (id) => api.get(`/students/${id}`),
    create: (data) => api.post('/students', data),
    update: (id, data) => api.put(`/students/${id}`, data),
    delete: (id) => api.delete(`/students/${id}`),
    getCourses: (id) => api.get(`/students/${id}/courses`),
    getGrades: (id) => api.get(`/students/${id}/grades`),
    getAttendance: (id) => api.get(`/students/${id}/attendance`),
};

export const teacherService = {
    getAll: (page = 1) => api.get(`/teachers?page=${page}`),
    get: (id) => api.get(`/teachers/${id}`),
    create: (data) => api.post('/teachers', data),
    update: (id, data) => api.put(`/teachers/${id}`, data),
    delete: (id) => api.delete(`/teachers/${id}`),
    getCourses: (id) => api.get(`/teachers/${id}/courses`),
};

export const departmentService = {
    getAll: () => api.get('/departments'),
};
