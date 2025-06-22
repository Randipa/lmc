import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api';

const SubjectList = () => {
  const { gradeId } = useParams();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    api
      .get(`/teachers/available-subjects?grade=${gradeId}`)
      .then((res) => setSubjects(res.data.subjects || []))
      .catch(() => setSubjects([]));
  }, [gradeId]);

  return (
    <div className="container py-4">
      <h4>Select a Subject</h4>
      <ul className="list-group">
        {subjects.map((subject) => (
          <Link
            key={subject}
            to={`/classes/${gradeId}/subjects/${encodeURIComponent(subject)}/teachers`}
            className="list-group-item"
          >
            {subject}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default SubjectList;
