import { useEffect, useState } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';

const MyClasses = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    api.get('/users/my-courses')
      .then(res => setClasses(res.data.classes || []))
      .catch(err => console.error('Failed to load classes:', err));
  }, []);

  const now = new Date();

  return (
    <div className="container py-4">
      <h4>📘 My Enrolled Classes</h4>

      {classes.length === 0 && <p className="text-muted">No classes enrolled yet.</p>}

      <ul className="list-group">
        {classes.map((cls) => {
          const isExpired = cls.expiresAt && new Date(cls.expiresAt) < now;

          return (
            <li key={cls._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{cls.title}</strong>
                {isExpired && <span className="badge bg-danger ms-2">Expired</span>}
              </div>
              <Link
                to={`/dashboard/recordings/${cls._id}`}
                className="btn btn-sm btn-outline-primary"
              >
                Enter Class
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyClasses;
