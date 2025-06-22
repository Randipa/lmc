import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

function TeacherList() {
  const [teachers, setTeachers] = useState([]);

  const load = () => {
    api.get('/teachers')
      .then(res => setTeachers(res.data.teachers || []))
      .catch(() => setTeachers([]));
  };

  useEffect(() => { load(); }, []);

  const deleteTeacher = async (id) => {
    if (!window.confirm('Delete this teacher?')) return;
    try {
      await api.delete(`/teachers/${id}`);
      load();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Teachers</h2>
        <Link className="btn btn-success" to="/admin/teachers/create">New Teacher</Link>
      </div>
      <ul className="list-group">
        {teachers.map(t => (
          <li key={t._id} className="list-group-item d-flex justify-content-between">
            <span>{t.firstName} {t.lastName}</span>
            <span>
              <Link className="btn btn-sm btn-outline-primary me-2" to={`/admin/teachers/${t._id}/edit`}>Edit</Link>
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTeacher(t._id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeacherList;
