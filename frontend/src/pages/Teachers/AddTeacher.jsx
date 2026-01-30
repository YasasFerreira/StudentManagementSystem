import { useState, useEffect } from 'react';
import { teacherService, departmentService } from '../../services/dataService';
import { FaChalkboardTeacher, FaSave } from 'react-icons/fa';
import '../Students/Students.css'; // Reuse styles

const AddTeacher = () => {
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'password123',
        teacher_id: '',
        department_id: '',
        qualification: '',
        specialization: '',
        hire_date: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await departmentService.getAll();
            setDepartments(response.data);
        } catch (error) {
            console.error('Failed to load departments', error);
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
            await teacherService.create(formData);
            setMessage('Lecturer added successfully!');
            setFormData({
                name: '', email: '', password: 'password123', teacher_id: '',
                department_id: '', qualification: '', specialization: '',
                hire_date: '', phone: ''
            });
        } catch (error) {
            setMessage('Error adding lecturer: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container glass-panel">
            <div className="page-header">
                <h2><FaChalkboardTeacher /> Add New Lecturer</h2>
            </div>

            {message && <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>{message}</div>}

            <form onSubmit={handleSubmit} className="entry-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Lecturer Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="glass-input" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} className="glass-input" required />
                    </div>
                    <div className="form-group">
                        <label>Lecturer ID</label>
                        <input name="teacher_id" value={formData.teacher_id} onChange={handleChange} className="glass-input" required />
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
                        <label>Qualification</label>
                        <input name="qualification" value={formData.qualification} onChange={handleChange} className="glass-input" required />
                    </div>
                    <div className="form-group">
                        <label>Specialization</label>
                        <input name="specialization" value={formData.specialization} onChange={handleChange} className="glass-input" required />
                    </div>
                    <div className="form-group">
                        <label>Hire Date</label>
                        <input name="hire_date" type="date" value={formData.hire_date} onChange={handleChange} className="glass-input" required />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} className="glass-input" required />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        <FaSave /> {loading ? 'Saving...' : 'Save Lecturer'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTeacher;
