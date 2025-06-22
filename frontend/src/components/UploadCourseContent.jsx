import React, { useState } from 'react';
import axios from 'axios';

function UploadCourseContent({ courseId }) {
  const [form, setForm] = useState({
    title: '',
    videoId: '',
    videoUrl: '',
    isPublic: false,
    visibleFrom: '',
    subtitles: [{ language: '', url: '' }]
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubtitleChange = (index, field, value) => {
    const updated = [...form.subtitles];
    updated[index][field] = value;
    setForm({ ...form, subtitles: updated });
  };

  const addSubtitleField = () => {
    setForm({ ...form, subtitles: [...form.subtitles, { language: '', url: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/content`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Video metadata uploaded successfully.');
      setForm({
        title: '',
        videoId: '',
        videoUrl: '',
        isPublic: false,
        visibleFrom: '',
        subtitles: [{ language: '', url: '' }]
      });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div className="mt-5 border p-4 rounded">
      <h4>📤 Add Bunny.net Video URL</h4>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={form.title} onChange={handleChange}
               className="form-control mb-2" placeholder="Video Title" />
        <input type="text" name="videoId" value={form.videoId} onChange={handleChange}
               className="form-control mb-2" placeholder="Bunny Video ID" />
        <input type="text" name="videoUrl" value={form.videoUrl} onChange={handleChange}
               className="form-control mb-2" placeholder="Video Embed URL" />
        <input type="datetime-local" name="visibleFrom" value={form.visibleFrom} onChange={handleChange}
               className="form-control mb-2" />
        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" name="isPublic"
                 checked={form.isPublic} onChange={(e) =>
            setForm({ ...form, isPublic: e.target.checked })} />
          <label className="form-check-label">Public Video</label>
        </div>

        <h6>📝 Subtitles:</h6>
        {form.subtitles.map((sub, idx) => (
          <div className="mb-2" key={idx}>
            <input type="text" placeholder="Language" className="form-control mb-1"
                   value={sub.language}
                   onChange={(e) => handleSubtitleChange(idx, 'language', e.target.value)} />
            <input type="text" placeholder="Subtitle URL (.vtt)" className="form-control"
                   value={sub.url}
                   onChange={(e) => handleSubtitleChange(idx, 'url', e.target.value)} />
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={addSubtitleField}>+ Add Subtitle</button>

        <button type="submit" className="btn btn-primary w-100">Save Video URL</button>
      </form>
    </div>
  );
}

export default UploadCourseContent;
