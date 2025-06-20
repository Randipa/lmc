import { useParams, Link } from 'react-router-dom';

const subjects = [
  { _id: 'sub-math', name: 'Mathematics' },
  { _id: 'sub-science', name: 'Science' },
  { _id: 'sub-english', name: 'English' },
];

const SubjectList = () => {
  const { gradeId } = useParams();

  return (
    <div className="container py-4">
      <h4>Select a Subject</h4>
      <ul className="list-group">
        {subjects.map(subject => (
          <Link
            key={subject._id}
            to={`/classes/${gradeId}/${subject._id}/teachers`}
            className="list-group-item"
          >
            {subject.name}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default SubjectList;
