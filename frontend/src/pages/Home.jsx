import { Link } from 'react-router-dom';
import Tile from '../components/Tile';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Welcome to the Learning Platform</h2>
          {user && (
            <p className="text-muted mb-0">Hello, {user.firstName} {user.lastName}</p>
          )}
        </div>
        <div>
          {user ? (
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary btn-sm me-2">Login</Link>
              <Link to="/register" className="btn btn-outline-success btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>

      <div className="row gy-4">
        <Tile title="Classes" icon="🎓" link="/classes" />
        <Tile title="Shop" icon="🛒" link="/shop" />
        <Tile title="Student Dashboard" icon="📊" link="/dashboard" />
        <Tile title="E-Library" icon="📚" link="/e-library" />
        {user?.userRole === 'admin' && (
          <>
          <Tile title="Admin" icon="⚙️" link="/admin/courses" />
          <Tile title="Payments" icon="💳" link="/admin/payments" />
          <Tile title="Videos" icon="🎞️" link="/admin/videos" />
          <Tile title="Teachers" icon="🧑‍🏫" link="/admin/teachers" />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
