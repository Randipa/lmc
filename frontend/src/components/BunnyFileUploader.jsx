import React, { useState } from 'react';
import axios from 'axios';

const BunnyFileUploader = ({ courseId }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [visibleFrom, setVisibleFrom] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [message, setMessage] = useState('');
  const [subtitles, setSubtitles] = useState([{ language: '', url: '' }]);

  const handleSubtitleChange = (index, field, value) => {
    const updated = [...subtitles];
    updated[index][field] = value;
    setSubtitles(updated);
  };

  const addSubtitleField = () => {
    setSubtitles([...subtitles, { language: '', url: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setMessage('Please provide a title and select a video file.');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('isPublic', isPublic);
    formData.append('visibleFrom', visibleFrom);
    formData.append('subtitles', JSON.stringify(subtitles));

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/upload-video`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setMessage('✅ Video uploaded to Bunny.net and added to course!');
      setTitle('');
      setFile(null);
      setVisibleFrom('');
      setIsPublic(false);
      setSubtitles([{ language: '', url: '' }]);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Upload failed.');
    }
  };

  return (
    <div className="mt-4 p-4 border rounded">
      <h4>📤 Upload Video to Bunny.net</h4>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          className="form-control mb-2"
          accept=".mp4,.mov,.avi"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <input
          type="datetime-local"
          className="form-control mb-2"
          value={visibleFrom}
          onChange={(e) => setVisibleFrom(e.target.value)}
        />

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label className="form-check-label">Make Video Public</label>
        </div>

        <h6>📝 Subtitles:</h6>
        {subtitles.map((sub, idx) => (
          <div key={idx} className="mb-2">
            <input
              type="text"
              className="form-control mb-1"
              placeholder="Language"
              value={sub.language}
              onChange={(e) => handleSubtitleChange(idx, 'language', e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Subtitle URL (.vtt)"
              value={sub.url}
              onChange={(e) => handleSubtitleChange(idx, 'url', e.target.value)}
            />
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={addSubtitleField}>
          + Add Subtitle
        </button>

        <button type="submit" className="btn btn-primary w-100">Upload Video</button>
      </form>
    </div>
  );
};

export default BunnyFileUploader;
