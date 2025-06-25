import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import Tile from '../../components/Tile';

const DashboardHome = () => {
  const [classes, setClasses] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    api.get('/users/my-courses')
      .then(res => setClasses(res.data.classes || []))
      .catch(() => setClasses([]));
  }, []);

  const now = new Date();

  return (
    <div className="container py-4">
      <div className="mb-4 text-center">
        <h2 className="fw-bold">Welcome back{user ? `, ${user.firstName}` : ''}!</h2>
        <p className="text-muted mb-0">Here’s your quick overview.</p>
      </div>

      <div className="row gy-4 mb-4">
        <Tile title="My Classes" icon="🎓" link="/dashboard/classes" />
        <Tile title="Notices" icon="📢" link="/dashboard/notices" />
        <Tile title="Attendance" icon="📝" link="/dashboard/attendance" />
        <Tile title="Payments" icon="💳" link="/dashboard/payments" />
      </div>

      <h4 className="fw-semibold mb-3">Enrolled Classes</h4>
      {classes.length === 0 && (
        <p className="text-muted">You have not enrolled in any classes yet.</p>
      )}
      <div className="row g-3">
        {classes.map(cls => {
          const isExpired = cls.expiresAt && new Date(cls.expiresAt) < now;
          return (
            <div key={cls._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm dashboard-card">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{cls.title}</h5>
                  {isExpired && (
                    <p className="text-danger small mb-2">Expired</p>
                  )}
                  <div className="mt-auto">
                    <Link
                      to={`/dashboard/recordings/${cls._id}`}
                      className="btn btn-primary btn-sm me-2"
                    >
                      Videos
                    </Link>
                    <Link
                      to={`/dashboard/live/${cls._id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Live
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardHome;
