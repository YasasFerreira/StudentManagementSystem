import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import AddStudent from './pages/Students/AddStudent';
import AddTeacher from './pages/Teachers/AddTeacher';
import AddCourse from './pages/Courses/AddCourse';
import AddAttendance from './pages/Attendance/AddAttendance';
import Enrollment from './pages/Enrollment/Enrollment';

// Placeholder components for list views
const Students = () => <AddStudent />;
const Teachers = () => <AddTeacher />;
const Courses = () => <AddCourse />;
const Attendance = () => <AddAttendance />;
const Enrollments = () => <Enrollment />;

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
            </Route>

            {/* Admin & Teacher Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'teacher']} />}>
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/students" element={<Students />} />
                <Route path="/add-attendance" element={<AddAttendance />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/enrollment" element={<Enrollment />} />
                <Route path="/enrollments" element={<Enrollments />} />
            </Route>

            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/add-teacher" element={<AddTeacher />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/add-course" element={<AddCourse />} />
                <Route path="/courses" element={<Courses />} />
            </Route>
        </Routes>
    );
}

export default App;
