import React, { useEffect, useState } from 'react';
import api from '../api';

function UploadCourseContent({ courseId }) {
  const [contents, setContents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    videoId: '',
    videoUrl: '',
    isPublic: false,
    visibleFrom: '',
    subtitles: []
  });
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState('');
  const [subtitleUrls, setSubtitleUrls] = useState({
    english: '',
    sinhala: '',
    tamil: ''
  });
  const [message, setMessage] = useState('');

  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  // Load existing course content
  useEffect(() => {
    api
      .get(`/courses/${courseId}`)
      .then((res) => setContents(res.data.course?.courseContent || []))
      .catch(() => setContents([]));
  }, [courseId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubtitleUrlChange = (lang, value) => {
    setSubtitleUrls({ ...subtitleUrls, [lang]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showSubtitles) {
        if (!selectedSubtitle) {
          setMessage('Please select a subtitle language');
          return;
        }
        const url = subtitleUrls[selectedSubtitle];
        if (!url) {
          setMessage('Subtitle URL is required');
          return;
        }
        if (!isValidUrl(url) || !url.endsWith('.vtt')) {
          setMessage('Subtitle URL must be a valid link ending with .vtt');
          return;
        }
        form.subtitles = [
          { language: selectedSubtitle, url }
        ];
      } else {
        form.subtitles = [];
      }
      if (editingId) {
        await api.put(`/courses/${courseId}/content/${editingId}`, form);
        setMessage('Video updated.');
      } else {
        await api.post(`/courses/${courseId}/content`, form);
        setMessage('Video metadata uploaded successfully.');
      }
      setForm({
        title: '',
        videoId: '',
        videoUrl: '',
        isPublic: false,
        visibleFrom: '',
        subtitles: []
      });
      setSelectedSubtitle('');
      setSubtitleUrls({ english: '', sinhala: '', tamil: '' });
      setShowSubtitles(false);
      setEditingId(null);
      const res = await api.get(`/courses/${courseId}`);
      setContents(res.data.course?.courseContent || []);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleEdit = (content) => {
    setEditingId(content._id);
    setForm({
      title: content.title || '',
      videoId: content.videoId || '',
      videoUrl: content.videoUrl || '',
      isPublic: !!content.isPublic,
      visibleFrom: content.visibleFrom
        ? new Date(content.visibleFrom).toISOString().slice(0, 16)
        : '',
      subtitles: content.subtitles && content.subtitles.length > 0 ? content.subtitles : []
    });
    if (content.subtitles && content.subtitles.length > 0) {
      setShowSubtitles(true);
      setSelectedSubtitle(content.subtitles[0].language || '');
      setSubtitleUrls({
        english: content.subtitles[0].language === 'english' ? content.subtitles[0].url : '',
        sinhala: content.subtitles[0].language === 'sinhala' ? content.subtitles[0].url : '',
        tamil: content.subtitles[0].language === 'tamil' ? content.subtitles[0].url : ''
      });
    } else {
      setShowSubtitles(false);
      setSelectedSubtitle('');
      setSubtitleUrls({ english: '', sinhala: '', tamil: '' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await api.delete(`/courses/${courseId}/content/${id}`);
      const res = await api.get(`/courses/${courseId}`);
      setContents(res.data.course?.courseContent || []);
    } catch (err) {
      setMessage('Delete failed');
    }
  };

  const handleTogglePublic = async (id, current) => {
    try {
      await api.put(`/courses/${courseId}/content/${id}`, { isPublic: !current });
      const res = await api.get(`/courses/${courseId}`);
      setContents(res.data.course?.courseContent || []);
    } catch (err) {
      setMessage('Update failed');
    }
  };

  return (
    <div className="mt-5 border p-4 rounded">
      <h4>📤 Add Video by URL</h4>
      {message && <div className="alert alert-info">{message}</div>}
      {contents.length > 0 && (
        <ul className="list-group mb-3">
          {contents.map((c) => (
            <li key={c._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{c.title || c.videoId}</span>
              <div className="d-flex align-items-center">
                <div className="form-check form-switch me-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={c.isPublic}
                    onChange={() => handleTogglePublic(c._id, c.isPublic)}
                  />
                </div>
                <button type="button" className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(c)}>
                  Edit
                </button>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={form.title} onChange={handleChange}
               className="form-control mb-2" placeholder="Video Title" />
        <input type="text" name="videoId" value={form.videoId} onChange={handleChange}
               className="form-control mb-2" placeholder="Bunny Video ID" />
        <input
          type="text"
          name="videoUrl"
          value={form.videoUrl}
          onChange={handleChange}
          className="form-control mb-2"
          placeholder="Video Embed URL (https://...)"
        />
        <input type="datetime-local" name="visibleFrom" value={form.visibleFrom} onChange={handleChange}
               className="form-control mb-2" />
        <div className="mb-2">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="isPublic"
              id="isPublicYes"
              checked={form.isPublic}
              onChange={() => setForm({ ...form, isPublic: true })}
            />
            <label className="form-check-label" htmlFor="isPublicYes">
              Allow access for unpaid students
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="isPublic"
              id="isPublicNo"
              checked={!form.isPublic}
              onChange={() => setForm({ ...form, isPublic: false })}
            />
            <label className="form-check-label" htmlFor="isPublicNo">
              Restrict to paid students
            </label>
          </div>
        </div>

        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="toggleSubtitles"
            checked={showSubtitles}
            onChange={(e) => setShowSubtitles(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="toggleSubtitles">
            Show Subtitles
          </label>
        </div>

        {showSubtitles && (
          <>
            <h6>📝 Subtitles:</h6>
            {['english', 'sinhala', 'tamil'].map((lang) => (
              <div className="mb-2 form-check" key={lang}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="subtitleLang"
                  id={`lang-${lang}`}
                  value={lang}
                  checked={selectedSubtitle === lang}
                  onChange={() => setSelectedSubtitle(lang)}
                />
                <label className="form-check-label me-2" htmlFor={`lang-${lang}`}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </label>
                <input
                  type="text"
                  className="form-control d-inline-block w-auto ms-2"
                  placeholder="Subtitle URL (.vtt)"
                  value={subtitleUrls[lang]}
                  onChange={(e) => handleSubtitleUrlChange(lang, e.target.value)}
                />
              </div>
            ))}
          </>
        )}

        <button type="submit" className="btn btn-primary w-100">Save Video URL</button>
      </form>
    </div>
  );
}

export default UploadCourseContent;
