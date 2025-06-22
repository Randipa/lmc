import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UploadCourseContent from '../../components/UploadCourseContent';
import AuthDebug from '../../components/AuthDebug';
import CourseDetailsForm from '../../components/CourseDetailsForm';

function CourseUploader() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [showDebug, setShowDebug] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Check authentication on component mount
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token) {
      alert('You must be logged in to access this page.');
      navigate('/login');
      return;
    }

    try {
      const parsedUser = user ? JSON.parse(user) : null;
      setUserInfo(parsedUser);
      
      // Check if user is admin
      if (parsedUser?.userRole !== 'admin') {
        alert('You must be an admin to upload videos.');
        navigate('/');
        return;
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
      navigate('/login');
    }
  }, [navigate]);

  if (!userInfo) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>🎬 Admin - Add Video by URL</h2>
          <p className="text-muted">Course ID: {courseId}</p>
          <p className="text-muted">Logged in as: {userInfo.firstName} {userInfo.lastName} ({userInfo.userRole})</p>
        </div>
        <button 
          className="btn btn-outline-secondary btn-sm" 
          onClick={() => setShowDebug(!showDebug)}
        >
          {showDebug ? 'Hide' : 'Show'} Debug Info
        </button>
      </div>

      {showDebug && <AuthDebug />}

      <CourseDetailsForm courseId={courseId} />

      <UploadCourseContent courseId={courseId} />
      
      <div className="mt-4">
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/admin/courses')}
        >
          ← Back to Courses
        </button>
      </div>
    </div>
  );
}

export default CourseUploader;
