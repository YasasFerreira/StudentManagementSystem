import { useState, useEffect } from 'react';
import { studentService, departmentService } from '../../services/dataService';
import { FaUserPlus, FaSave } from 'react-icons/fa';
import './Students.css';

const AddStudent = () => {
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'password123', // Default password for now
        student_id: '',
        department_id: '',
        enrollment_date: '',
        date_of_birth: '',
        phone: '',
        address: '',
        guardian_name: '',
        guardian_phone: ''
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
            await studentService.create(formData);
            setMessage('Student added successfully!');
            setFormData({
                name: '', email: '', password: 'password123', student_id: '',
                department_id: '', enrollment_date: '', date_of_birth: '',
                phone: '', address: '', guardian_name: '', guardian_phone: ''
            });
        } catch (error) {
            setMessage('Error adding student: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container glass-panel">
            <div className="page-header">
                <h2><FaUserPlus /> Add New Student</h2>
            </div>

            {message && <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>{message}</div>}

            <form onSubmit={handleSubmit} className="entry-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Student Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="glass-input" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} className="glass-input" required />
                    </div>
                    <div className="form-group">
                        <label>Student ID</label>
                        <input name="student_id" value={formData.student_id} onChange={handleChange} className="glass-input" required />
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
                        <label>Enrollment Date</label>
                        <input name="enrollment_date" type="date" value={formData.enrollment_date} onChange={handleChange} className="glass-input" required />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} className="glass-input" required />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} className="glass-input" required />
                    </div>
                    <div className="form-group">
                        <label>Guardian Name</label>
                        <input name="guardian_name" value={formData.guardian_name} onChange={handleChange} className="glass-input" />
                    </div>
                    <div className="form-group">
                        <label>Guardian Phone</label>
                        <input name="guardian_phone" value={formData.guardian_phone} onChange={handleChange} className="glass-input" />
                    </div>
                    <div className="form-group full-width">
                        <label>Address</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} className="glass-input" rows="3"></textarea>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        <FaSave /> {loading ? 'Saving...' : 'Save Student'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStudent;
