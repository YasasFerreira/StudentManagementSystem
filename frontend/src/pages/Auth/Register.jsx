import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaLock, FaEnvelope, FaIdCard } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await register(formData);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel" style={{ width: '450px' }}>
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join the university portal</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="input-icon"><FaUser /></div>
                        <input
                            name="name" type="text"
                            className="glass-input with-icon" placeholder="Full Name"
                            value={formData.name} onChange={handleChange} required
                        />
                    </div>

                    <div className="form-group">
                        <div className="input-icon"><FaEnvelope /></div>
                        <input
                            name="email" type="email"
                            className="glass-input with-icon" placeholder="Email Address"
                            value={formData.email} onChange={handleChange} required
                        />
                    </div>

                    <div className="form-group">
                        <div className="input-icon"><FaLock /></div>
                        <input
                            name="password" type="password"
                            className="glass-input with-icon" placeholder="Password"
                            value={formData.password} onChange={handleChange} required
                        />
                    </div>

                    <div className="form-group">
                        <div className="input-icon"><FaLock /></div>
                        <input
                            name="password_confirmation" type="password"
                            className="glass-input with-icon" placeholder="Confirm Password"
                            value={formData.password_confirmation} onChange={handleChange} required
                        />
                    </div>

                    <div className="form-group">
                        <select
                            name="role"
                            className="glass-input"
                            value={formData.role}
                            onChange={handleChange}
                            style={{ paddingLeft: '16px' }}
                        >
                            <option value="student" style={{ color: 'black' }}>Student</option>
                            <option value="teacher" style={{ color: 'black' }}>Lecturer</option>
                            <option value="admin" style={{ color: 'black' }}>Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary auth-btn">Register</button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
