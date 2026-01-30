import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <Sidebar />
            <main className="main-content">
                <Navbar />
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
