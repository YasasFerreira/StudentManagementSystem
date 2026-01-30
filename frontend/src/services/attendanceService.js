import api from './api';

export const attendanceService = {
    getAll: (filters = {}) => api.get('/attendance', { params: filters }),
    mark: (data) => api.post('/attendance', data), // For single student
    getReport: (courseId) => api.get(`/attendance/report?course_id=${courseId}`),
};
