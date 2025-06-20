import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Class Navigation
import GradeList from './pages/Classes/GradeList';
import SubjectList from './pages/Classes/SubjectList';
import TeacherList from './pages/Classes/TeacherList';
import ClassDetail from './pages/Classes/ClassDetail';

// Shop
import Shop from './pages/Shop/Shop';
import Cart from './pages/Shop/Cart';

// Student Dashboard
import MyClasses from './pages/Dashboard/MyClasses';
import LiveClasses from './pages/Dashboard/LiveClasses';
import Recordings from './pages/Dashboard/Recordings';
import Assignments from './pages/Dashboard/Assignments';
import Marks from './pages/Dashboard/Marks';
import Attendance from './pages/Dashboard/Attendance';
import PaymentHistory from './pages/Dashboard/PaymentHistory';
import ELibrary from './pages/ELibrary/ELibrary';

// Admin Pages
import CourseUploader from './pages/Admin/CourseUploader'; // Bunny uploader

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Classes Flow */}
        <Route path="/classes" element={<GradeList />} />
        <Route path="/classes/:gradeId/subjects" element={<SubjectList />} />
        <Route path="/classes/:gradeId/:subjectId/teachers" element={<TeacherList />} />
        <Route path="/class/:classId" element={<ClassDetail />} />

        {/* Shop */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/cart" element={<Cart />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<MyClasses />} />
        <Route path="/dashboard/live/:classId" element={<LiveClasses />} />
        <Route path="/dashboard/recordings/:classId" element={<Recordings />} />
        <Route path="/dashboard/assignments/:classId" element={<Assignments />} />
        <Route path="/dashboard/marks/:classId" element={<Marks />} />
        <Route path="/dashboard/attendance" element={<Attendance />} />
        <Route path="/dashboard/payments" element={<PaymentHistory />} />

        {/* Library */}
        <Route path="/e-library" element={<ELibrary />} />

        {/* Admin Upload Bunny.net Video */}
        <Route path="/admin/courses/:courseId/upload" element={<CourseUploader />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
