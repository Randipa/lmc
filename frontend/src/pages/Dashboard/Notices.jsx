import { useEffect, useState } from 'react';
import api from '../../api';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get('/notices/my')
      .then(res => {
        setNotices(res.data.notices || []);
        setLoaded(true);
        if ((res.data.notices || []).length > 0) {
          // simple notification
          alert('You have new notices');
        }
      })
      .catch(() => {
        setLoaded(true);
        setNotices([]);
      });
  }, []);

  if (!loaded) return <div className="container py-4">Loading...</div>;

  return (
    <div className="container py-4">
      <h4>Notices</h4>
      {notices.length === 0 && <p className="text-muted">No notices</p>}
      <ul className="list-group">
        {notices.map(n => (
          <li key={n._id} className="list-group-item">
            <strong>{n.title}</strong> – {n.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notices;
