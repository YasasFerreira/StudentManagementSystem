import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaUsers, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import dashboardService from '../../services/dashboardService';
import './Dashboard.css';

const IconMap = {
    FaUserGraduate: FaUserGraduate,
    FaChalkboardTeacher: FaChalkboardTeacher,
    FaBook: FaBook,
    FaUsers: FaUsers,
};

const StatCard = ({ title, count, icon, color }) => {
    const Icon = IconMap[icon] || FaBook;
    return (
        <div className="stat-card glass-panel">
            <div className="stat-icon" style={{ background: color }}>
                <Icon />
            </div>
            <div className="stat-info">
                <h3>{count}</h3>
                <p>{title}</p>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats(data.stats);
                setActivities(data.recentActivity);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="loading-container">Loading Dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1 className="page-title">Dashboard Overview</h1>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="dashboard-content-grid">
                <div className="glass-panel recent-activity">
                    <h3>Recent Activity</h3>
                    <ul className="activity-list">
                        {activities.length > 0 ? (
                            activities.map((activity, index) => (
                                <li key={index}>
                                    <span className="dot" style={{ background: activity.color }}></span>
                                    <div>
                                        <p dangerouslySetInnerHTML={{ __html: activity.message }}></p>
                                        <span className="time">{activity.time}</span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li>No recent activity to show.</li>
                        )}
                    </ul>
                </div>

                {user?.role !== 'student' && (
                    <div className="glass-panel quick-actions">
                        <h3>Quick Actions</h3>
                        <div className="action-buttons">
                            {(user?.role === 'admin' || user?.role === 'teacher') && (
                                <>
                                    <button onClick={() => navigate('/add-student')} className="btn-primary">Add Student</button>
                                    <button onClick={() => navigate('/enrollment')} className="btn-primary" style={{ background: 'linear-gradient(135deg, #FF9F43 0%, #FF9F43!important 100%)' }}>
                                        <FaUserPlus style={{ marginRight: '8px' }} /> Enroll Student
                                    </button>
                                    <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)' }}>Add Grade</button>
                                </>
                            )}
                            {user?.role === 'admin' && (
                                <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>Mark Attendance</button>
                            )}
                            {user?.role === 'teacher' && (
                                <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>Mark Attendance</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
