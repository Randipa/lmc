import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UploadCourseContent from '../../components/UploadCourseContent';
import AuthDebug from '../../components/AuthDebug';
import CourseDetailsForm from '../../components/CourseDetailsForm';
import api from '../../api';

function CourseUploader() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [showDebug, setShowDebug] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [courseContent, setCourseContent] = useState({
    paidContent: [],
    unpaidContent: [],
    subtitles: []
  });

  useEffect(() => {
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
      if (parsedUser?.userRole !== 'admin') {
        alert('You must be an admin to upload videos.');
        navigate('/');
        return;
      }
      loadCourseContent();
    } catch (err) {
      console.error('Error parsing user data:', err);
      navigate('/login');
    }
  }, [navigate, courseId]);

  const loadCourseContent = async () => {
    try {
      const { data } = await api.get(`/courses/${courseId}/content`);
      setCourseContent(data);
    } catch (error) {
      console.error('Error loading course content:', error);
    }
  };

  const handleContentUpload = (newItem, contentType) => {
    setCourseContent(prev => ({
      ...prev,
      [`${contentType}Content`]: [...prev[`${contentType}Content`], newItem]
    }));
    alert(`${contentType} content uploaded successfully!`);
  };

  const handleSubtitleUpload = async ({ file, language, videoId }) => {
    try {
      const formData = new FormData();
      formData.append('subtitleFile', file);
      formData.append('language', language);
      formData.append('videoId', videoId);
      const { data } = await api.post(`/courses/${courseId}/subtitles`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCourseContent(prev => ({
        ...prev,
        subtitles: [...prev.subtitles, data]
      }));
      alert('Subtitle uploaded successfully!');
    } catch (error) {
      console.error('Error uploading subtitle:', error);
      alert('Error uploading subtitle');
    }
  };

  const deleteContent = async (contentId, contentType) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    try {
      await api.delete(`/courses/${courseId}/content/${contentId}`);
      setCourseContent(prev => ({
        ...prev,
        [`${contentType}Content`]: prev[`${contentType}Content`].filter(c => c._id !== contentId)
      }));
      alert('Content deleted successfully!');
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Failed to delete content');
    }
  };

  const deleteSubtitle = async (subtitleId) => {
    if (!window.confirm('Are you sure you want to delete this subtitle?')) return;
    try {
      await api.delete(`/courses/${courseId}/subtitles/${subtitleId}`);
      setCourseContent(prev => ({
        ...prev,
        subtitles: prev.subtitles.filter(s => (s._id || s.id) !== subtitleId)
      }));
      alert('Subtitle deleted successfully!');
    } catch (error) {
      console.error('Error deleting subtitle:', error);
      alert('Failed to delete subtitle');
    }
  };

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
          <h2>🎬 Admin - Course Content Manager</h2>
          <p className="text-muted">Course ID: {courseId}</p>
          <p className="text-muted">Logged in as: {userInfo.firstName} {userInfo.lastName} ({userInfo.userRole})</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowDebug(!showDebug)}>
          {showDebug ? 'Hide' : 'Show'} Debug Info
        </button>
      </div>

      {showDebug && <AuthDebug />}

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>
            📝 Course Details
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'paid' ? 'active' : ''}`} onClick={() => setActiveTab('paid')}>
            💰 Paid Content ({courseContent.paidContent.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'unpaid' ? 'active' : ''}`} onClick={() => setActiveTab('unpaid')}>
            🆓 Free Content ({courseContent.unpaidContent.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'subtitles' ? 'active' : ''}`} onClick={() => setActiveTab('subtitles')}>
            📄 Subtitles ({courseContent.subtitles.length})
          </button>
        </li>
      </ul>

      {activeTab === 'details' && (
        <div className="tab-pane">
          <CourseDetailsForm courseId={courseId} />
        </div>
      )}

      {activeTab === 'paid' && (
        <div className="tab-pane">
          <div className="card mb-4">
            <div className="card-header">
              <h5>💰 Add Paid Content</h5>
              <small className="text-muted">This content will only be visible to students who have paid for the course</small>
            </div>
            <div className="card-body">
              <UploadCourseContent courseId={courseId} onUpload={(d) => handleContentUpload(d, 'paid')} initialIsPublic={false} />
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h5>Existing Paid Content</h5></div>
            <div className="card-body">
              {courseContent.paidContent.length === 0 ? (
                <p className="text-muted">No paid content uploaded yet.</p>
              ) : (
                <div className="list-group">
                  {courseContent.paidContent.map((content) => (
                    <div key={content._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{content.title}</h6>
                        <p className="mb-1 text-muted">{content.description}</p>
                        <small>Duration: {content.duration}</small>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteContent(content._id, 'paid')}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'unpaid' && (
        <div className="tab-pane">
          <div className="card mb-4">
            <div className="card-header">
              <h5>🆓 Add Free Content</h5>
              <small className="text-muted">This content will be visible to all students (free preview/demo content)</small>
            </div>
            <div className="card-body">
              <UploadCourseContent courseId={courseId} onUpload={(d) => handleContentUpload(d, 'unpaid')} initialIsPublic={true} />
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h5>Existing Free Content</h5></div>
            <div className="card-body">
              {courseContent.unpaidContent.length === 0 ? (
                <p className="text-muted">No free content uploaded yet.</p>
              ) : (
                <div className="list-group">
                  {courseContent.unpaidContent.map((content) => (
                    <div key={content._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{content.title}</h6>
                        <p className="mb-1 text-muted">{content.description}</p>
                        <small>Duration: {content.duration}</small>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteContent(content._id, 'unpaid')}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subtitles' && (
        <div className="tab-pane">
          <div className="card mb-4">
            <div className="card-header">
              <h5>📄 Upload Subtitles</h5>
              <small className="text-muted">Upload subtitle files (.srt, .vtt) for your videos</small>
            </div>
            <div className="card-body">
              <SubtitleUploader onUpload={handleSubtitleUpload} videos={[...courseContent.paidContent, ...courseContent.unpaidContent]} />
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h5>Existing Subtitles</h5></div>
            <div className="card-body">
              {courseContent.subtitles.length === 0 ? (
                <p className="text-muted">No subtitles uploaded yet.</p>
              ) : (
                <div className="list-group">
                  {courseContent.subtitles.map((subtitle) => (
                    <div key={subtitle.id || subtitle._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{subtitle.videoTitle}</h6>
                        <p className="mb-1 text-muted">Language: {subtitle.language}</p>
                        <small>File: {subtitle.filename}</small>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteSubtitle(subtitle.id || subtitle._id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 d-flex gap-2">
        <button className="btn btn-secondary" onClick={() => navigate('/admin/courses')}>← Back to Courses</button>
        <button className="btn btn-success" onClick={() => navigate(`/courses/${courseId}`)}>👁️ Preview Course</button>
      </div>
    </div>
  );
}

function SubtitleUploader({ onUpload, videos }) {
  const [selectedVideo, setSelectedVideo] = useState('');
  const [language, setLanguage] = useState('');
  const [subtitleFile, setSubtitleFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedVideo || !language || !subtitleFile) {
      alert('Please fill all fields and select a subtitle file');
      return;
    }
    onUpload({ videoId: selectedVideo, language, file: subtitleFile });
    setSelectedVideo('');
    setLanguage('');
    setSubtitleFile(null);
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-4">
          <label className="form-label">Select Video</label>
          <select className="form-select" value={selectedVideo} onChange={(e) => setSelectedVideo(e.target.value)} required>
            <option value="">Choose video...</option>
            {videos.map((v) => (
              <option key={v._id} value={v.videoId || v._id}>{v.title}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Language</label>
          <select className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)} required>
            <option value="">Select language...</option>
            <option value="en">English</option>
            <option value="si">Sinhala</option>
            <option value="ta">Tamil</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Subtitle File</label>
          <input type="file" className="form-control" accept=".srt,.vtt" onChange={(e) => setSubtitleFile(e.target.files[0])} required />
        </div>
        <div className="col-md-2">
          <label className="form-label">&nbsp;</label>
          <button type="submit" className="btn btn-primary d-block w-100">Upload</button>
        </div>
      </div>
    </form>
  );
}

export default CourseUploader;
