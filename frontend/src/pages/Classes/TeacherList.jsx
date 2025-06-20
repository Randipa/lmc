import { useParams, Link } from 'react-router-dom';

const teachers = [
  { _id: 't1', name: 'Mr. Perera' },
  { _id: 't2', name: 'Ms. Silva' },
];

const TeacherList = () => {
  const { gradeId, subjectId } = useParams();

  return (
    <div className="container py-4">
      <h4>Select a Teacher</h4>
      <ul className="list-group">
        {teachers.map(t => (
          <Link
            key={t._id}
            to={`/class/${t._id}`}
            className="list-group-item"
          >
            {t.name}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default TeacherList;
