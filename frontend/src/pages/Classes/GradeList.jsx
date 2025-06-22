import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const GradeList = () => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    api
      .get('/courses/available-grades')
      .then(res => setGrades(res.data.grades || []))
      .catch(() => setGrades([]));
  }, []);

  return (
    <div className="container py-4">
      <h4>Choose a Grade</h4>
      <ul className="list-group">
        {grades.map(g => (
          <Link key={g} to={`/classes/${g}/teachers`} className="list-group-item">
            Grade {g}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default GradeList;
