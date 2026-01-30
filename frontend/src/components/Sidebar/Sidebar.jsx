import { Link, useLocation } from 'react-router-dom';
import {
    FaChartPie,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaBook,
    FaClipboardList,
    FaSignOutAlt,
    FaUserPlus
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', icon: FaChartPie, label: 'Dashboard', roles: ['admin', 'teacher', 'student'] },
        { path: '/students', icon: FaUserGraduate, label: 'Students', roles: ['admin', 'teacher'] },
        { path: '/teachers', icon: FaChalkboardTeacher, label: 'Lecturers', roles: ['admin'] },
        { path: '/courses', icon: FaBook, label: 'Subjects', roles: ['admin'] },
        { path: '/attendance', icon: FaClipboardList, label: 'Attendance', roles: ['admin', 'teacher'] },
        { path: '/enrollment', icon: FaUserPlus, label: 'Enrollments', roles: ['admin', 'teacher'] },
    ].filter(item => !item.roles || item.roles.includes(user?.role));

    return (
        <aside className="sidebar glass-panel">
            <div className="sidebar-header">
                <h2>UniCMS</h2>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                            >
                                <item.icon className="nav-icon" />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button onClick={logout} className="logout-btn">
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
