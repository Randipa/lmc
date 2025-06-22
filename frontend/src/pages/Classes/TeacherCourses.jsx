import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';

const TeacherCourses = () => {
  const { gradeId, teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get(`/teachers/${teacherId}`)
      .then(res => setTeacher(res.data.teacher))
      .catch(() => setTeacher(null));
  }, [teacherId]);

  useEffect(() => {
    if (!teacher) return;
    const name = `${teacher.firstName} ${teacher.lastName}`;
    api.get(`/courses?grade=${gradeId}&teacherName=${encodeURIComponent(name)}`)
      .then(res => setCourses(res.data.courses || []))
      .catch(() => setCourses([]));
  }, [gradeId, teacher]);

  if (!teacher) return <div className="container py-4">Loading...</div>;

  return (
    <div className="container py-4">
      <h4>{teacher.firstName} {teacher.lastName}</h4>
      {teacher.description && <p>{teacher.description}</p>}
      <h5>Courses</h5>
      <ul className="list-group">
        {courses.map(c => (
          <Link key={c._id} to={`/class/${c._id}`} className="list-group-item">
            {c.title} - Rs. {c.price}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default TeacherCourses;
