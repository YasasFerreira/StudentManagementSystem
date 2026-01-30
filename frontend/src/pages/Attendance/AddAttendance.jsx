import { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { attendanceService } from '../../services/attendanceService';
import { FaClipboardList, FaCheck } from 'react-icons/fa';
import '../Students/Students.css';

const AddAttendance = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [attendanceData, setAttendanceData] = useState({});

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const response = await courseService.getAll();
            setCourses(response.data.data);
        } catch (error) {
            console.error('Failed to load courses', error);
        }
    };

    const handleCourseChange = async (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        if (courseId) {
            setLoading(true);
            try {
                // Fetch students enrolled in this course
                const response = await courseService.getStudents(courseId);
                setStudents(response.data);
                // Reset attendance data
                const initialData = {};
                response.data.forEach(student => {
                    initialData[student.id] = 'present';
                });
                setAttendanceData(initialData);
            } catch (error) {
                console.error('Failed to load students', error);
            } finally {
                setLoading(false);
            }
        } else {
            setStudents([]);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Send requests for each student (Ideally backend should accept bulk, but our API is single for now)
            // We'll prioritize bulk endpoint in future. For now, we loop.
            const promises = students.map(student => {
                return attendanceService.mark({
                    student_id: student.id,
                    course_id: selectedCourse,
                    date: date,
                    status: attendanceData[student.id]
                });
            });

            await Promise.all(promises);
            setMessage('Attendance marked successfully!');
        } catch (error) {
            setMessage('Error marking attendance: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container glass-panel">
            <div className="page-header">
                <h2><FaClipboardList /> Mark Attendance</h2>
            </div>

            {message && <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>{message}</div>}

            <div className="form-grid" style={{ marginBottom: '2rem' }}>
                <div className="form-group">
                    <label>Select Subject</label>
                    <select value={selectedCourse} onChange={handleCourseChange} className="glass-input" style={{ color: '#333' }}>
                        <option value="">Choose a Subject...</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.course_code} - {course.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="glass-input" />
                </div>
            </div>

            {selectedCourse && students.length > 0 && (
                <form onSubmit={handleSubmit}>
                    <div className="student-list glass-panel" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Student Name</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{student.user?.name}</td>
                                        <td style={{ padding: '1rem' }}>{student.student_id}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                {['present', 'absent', 'late', 'excused'].map(status => (
                                                    <label key={status} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textTransform: 'capitalize' }}>
                                                        <input
                                                            type="radio"
                                                            name={`status-${student.id}`}
                                                            checked={attendanceData[student.id] === status}
                                                            onChange={() => handleStatusChange(student.id, status)}
                                                            style={{ marginRight: '5px' }}
                                                        />
                                                        {status}
                                                    </label>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={loading}>
                            <FaCheck /> {loading ? 'Saving...' : 'Submit Attendance'}
                        </button>
                    </div>
                </form>
            )}

            {selectedCourse && students.length === 0 && !loading && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No students enrolled in this course yet.</p>
            )}
        </div>
    );
};

export default AddAttendance;
