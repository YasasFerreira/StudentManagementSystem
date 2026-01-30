import { useState, useEffect } from 'react';
import { studentService } from '../../services/dataService';
import { courseService } from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';
import { FaUserPlus, FaTrash } from 'react-icons/fa';
import './Enrollment.css';

const Enrollment = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        student_id: '',
        course_id: '',
        enrollment_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, coursesRes, enrollmentsRes] = await Promise.all([
                    studentService.getAll(),
                    courseService.getAll(),
                    enrollmentService.getEnrollments()
                ]);

                setStudents(studentsRes.data.data || []);
                setCourses(coursesRes.data.data || []);
                setEnrollments(enrollmentsRes.data || []);
            } catch (err) {
                console.error("Failed to fetch data", err);
                setError("Could not load data. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            await enrollmentService.enroll(
                formData.student_id,
                formData.course_id,
                formData.enrollment_date
            );

            setSuccess("Student enrolled successfully!");
            setFormData({ ...formData, student_id: '', course_id: '' });

            // Refresh enrollments list
            const updated = await enrollmentService.getEnrollments();
            setEnrollments(updated.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to enroll student.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this enrollment?")) return;

        try {
            await enrollmentService.deleteEnrollment(id);
            setEnrollments(enrollments.filter(e => e.id !== id));
        } catch (err) {
            alert("Failed to delete enrollment.");
        }
    };

    if (loading) return <div className="loading-container">Loading Enrollment Data...</div>;

    return (
        <div className="enrollment-container">
            <h1 className="page-title">Manage Enrollments</h1>

            <div className="enrollment-grid">
                {/* Enrollment Form */}
                <div className="glass-panel enrollment-form-container">
                    <h3>Enroll Student in Subject</h3>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit} className="enrollment-form">
                        <div className="form-group">
                            <label>Select Student</label>
                            <select
                                name="student_id"
                                value={formData.student_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Choose Student --</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.user.name} ({s.student_id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Select Subject</label>
                            <select
                                name="course_id"
                                value={formData.course_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Choose Subject --</option>
                                {courses.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.course_code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Enrollment Date</label>
                            <input
                                type="date"
                                name="enrollment_date"
                                value={formData.enrollment_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={submitting}
                        >
                            <FaUserPlus /> {submitting ? "Enrolling..." : "Enroll Student"}
                        </button>
                    </form>
                </div>

                {/* Enrollment List */}
                <div className="glass-panel enrollment-list-container">
                    <h3>Recent Enrollments</h3>
                    <div className="table-responsive">
                        <table className="enrollment-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Subject</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.length > 0 ? (
                                    enrollments.map((e) => (
                                        <tr key={e.id}>
                                            <td>{e.student?.user?.name}</td>
                                            <td>{e.course?.name}</td>
                                            <td>{new Date(e.enrollment_date).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(e.id)}
                                                    className="delete-btn"
                                                    title="Remove Enrollment"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center' }}>No enrollments found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Enrollment;
