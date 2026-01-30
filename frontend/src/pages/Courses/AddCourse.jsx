import { useState, useEffect } from 'react';
import { courseService } from '../../services/courseService';
import { departmentService, teacherService } from '../../services/dataService';
import { FaBook, FaSave } from 'react-icons/fa';
import '../Students/Students.css';

const AddCourse = () => {
    const [departments, setDepartments] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        course_code: '',
        name: '',
        description: '',
        credits: '',
        department_id: '',
        teacher_id: '',
        semester: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const deptRes = await departmentService.getAll();
            const teachRes = await teacherService.getAll(1);
            setDepartments(deptRes.data);
            setTeachers(teachRes.data.data);
        } catch (error) {
            console.error('Failed to load data', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await courseService.create(formData);
            setMessage('Subject added successfully!');
            setFormData({
                course_code: '', name: '', description: '', credits: '',
                department_id: '', teacher_id: '', semester: ''
            });
        } catch (error) {
            setMessage('Error adding subject: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container glass-panel">
            <div className="page-header">
                <h2><FaBook /> Add New Subject</h2>
            </div>

            {message && <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>{message}</div>}

            <form onSubmit={handleSubmit} className="entry-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Course Code</label>
                        <input name="course_code" value={formData.course_code} onChange={handleChange} className="glass-input" required />
                    </div>
                    <div className="form-group">
                        <label>Subject Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="glass-input" required />
                    </div>
                    <div className="form-group">
                        <label>Credits</label>
                        <input name="credits" type="number" min="1" max="6" value={formData.credits} onChange={handleChange} className="glass-input" required />
                    </div>
                    <div className="form-group">
                        <label>Semester</label>
                        <input name="semester" type="number" min="1" max="8" value={formData.semester} onChange={handleChange} className="glass-input" required />
                    </div>
                    <div className="form-group">
                        <label>Department</label>
                        <select name="department_id" value={formData.department_id} onChange={handleChange} className="glass-input" required style={{ color: '#333' }}>
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Lecturer</label>
                        <select name="teacher_id" value={formData.teacher_id} onChange={handleChange} className="glass-input" style={{ color: '#333' }}>
                            <option value="">Select Lecturer (Optional)</option>
                            {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>{teacher.user?.name || teacher.teacher_id}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="glass-input" rows="3"></textarea>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        <FaSave /> {loading ? 'Saving...' : 'Save Subject'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCourse;
