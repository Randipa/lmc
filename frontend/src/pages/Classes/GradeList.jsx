import { Link } from 'react-router-dom';

const grades = [
  { _id: 'grade-1', name: 'Grade 6' },
  { _id: 'grade-2', name: 'Grade 7' },
  { _id: 'grade-3', name: 'Grade 8' },
];

const GradeList = () => (
  <div className="container py-4">
    <h4>Choose a Grade</h4>
    <ul className="list-group">
      {grades.map(grade => (
        <Link key={grade._id} to={`/classes/${grade._id}/subjects`} className="list-group-item">
          {grade.name}
        </Link>
      ))}
    </ul>
  </div>
);

export default GradeList;
