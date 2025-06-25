import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Recordings() {
  const { classId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now] = useState(new Date());
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:5000/api/courses/${classId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setCourse(res.data.course);
      setLoading(false);
    })
    .catch(() => setLoading(false));

    axios.get(`http://localhost:5000/api/notices?courseId=${classId}`)
      .then(res => setNotices(res.data.notices || []))
      .catch(() => setNotices([]));
  }, [classId]);

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!course) return <div className="container mt-5">Course not found</div>;

  return (
    <div className="container mt-4">
      <h3>{course.title} - Recordings</h3>

      {notices.length > 0 && (
        <div className="alert alert-warning">
          {notices.map(n => (
            <div key={n._id}>
              <strong>{n.title}:</strong> {n.message}
            </div>
          ))}
        </div>
      )}

      {course.courseContent?.length === 0 && <p>No videos available</p>}

      {course.courseContent?.map((video, index) => {
        const isVisible = video.isPublic || new Date(video.visibleFrom) <= now;

        return (
          <div key={index} className="mb-5 border p-3 rounded">
            <h5>{video.title}</h5>
            {!isVisible ? (
              <p className="text-danger">This video is not yet available.</p>
            ) : (
              <>
                <div className="ratio ratio-16x9 mb-2">
                  <iframe
                    src={video.videoUrl}
                    title={video.title}
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Subtitles */}
                {video.subtitles?.length > 0 && (
                  <div>
                    <strong>Subtitles:</strong>
                    <ul>
                      {video.subtitles.map((sub, idx) => (
                        <li key={idx}>
                          <a href={sub.url} target="_blank" rel="noreferrer">{sub.language}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Recordings;
