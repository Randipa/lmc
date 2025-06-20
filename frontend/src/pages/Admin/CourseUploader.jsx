import React from 'react';
import { useParams } from 'react-router-dom';
import BunnyFileUploader from '../../components/BunnyFileUploader';

function CourseUploader() {
  const { courseId } = useParams();
  return (
    <div className="container mt-4">
      <h2>🎬 Admin - Upload Video to Course</h2>
      <BunnyFileUploader courseId={courseId} />
    </div>
  );
}

export default CourseUploader;
