import { FaUserCircle, FaBell } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="navbar glass-panel">
            <div className="navbar-search">
                <input type="text" placeholder="Search..." className="glass-input" />
            </div>

            <div className="navbar-actions">
                <button className="icon-btn">
                    <FaBell />
                    <span className="badge">3</span>
                </button>

                <div className="user-profile">
                    <FaUserCircle className="user-avatar" />
                    <div className="user-info">
                        <span className="user-name">{user?.name || 'User'}</span>
                        <span className="user-role">{user?.role || 'Guest'}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
