import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';

const TeacherList = () => {
  const { gradeId } = useParams();
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    api
      .get(`/teachers?grade=${gradeId}`)
      .then(res => setTeachers(res.data.teachers || []))
      .catch(() => setTeachers([]));
  }, [gradeId]);

  return (
    <div className="container py-4">
      <h4>Select a Teacher</h4>
      <ul className="list-group">
        {teachers.map(t => (
          <Link
            key={t._id}
            to={`/classes/${gradeId}/teachers/${t._id}`}
            className="list-group-item"
          >
            {t.firstName} {t.lastName}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default TeacherList;
