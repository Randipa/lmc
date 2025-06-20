import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

function AllClasses() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    api.get('/courses')
      .then(res => setClasses(res.data.courses || []))
      .catch(() => setClasses([]));
  }, []);

  return (
    <div className="container py-4">
      <h4>All Classes</h4>
      <ul className="list-group">
        {classes.map(cls => (
          <Link key={cls._id} to={`/class/${cls._id}`} className="list-group-item">
            {cls.title} - Rs. {cls.price}
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default AllClasses;
