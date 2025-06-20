import React, { useState } from 'react';
import axios from 'axios';

const BunnyFileUploader = ({ courseId }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [visibleFrom, setVisibleFrom] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
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

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('❌ You must be logged in to upload videos. Please log in first.');
      return;
    }

    // Validate token format
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      
      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setMessage('❌ Your session has expired. Please log in again.');
        return;
      }
    } catch (err) {
      console.error('Invalid token format:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setMessage('❌ Invalid authentication token. Please log in again.');
      return;
    }

    setLoading(true);
    setMessage('⏳ Uploading video... This may take a few minutes.');

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('isPublic', isPublic);
    formData.append('visibleFrom', visibleFrom);
    formData.append('subtitles', JSON.stringify(subtitles));

    try {
      console.log('Making upload request with token:', token.substring(0, 20) + '...');
      
      const res = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/upload-video`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          timeout: 300000, // 5 minute timeout for large files
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setMessage(`⏳ Uploading... ${percentCompleted}%`);
          }
        }
      );

      console.log('Upload successful:', res.data);
      setMessage('✅ Video uploaded to Bunny.net and added to course successfully!');
      
      // Reset form
      setTitle('');
      setFile(null);
      setVisibleFrom('');
      setIsPublic(false);
      setSubtitles([{ language: '', url: '' }]);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      console.error('Upload error:', err);
      
      let errorMessage = '❌ Upload failed.';
      
      if (err.response) {
        console.error('Error response:', err.response.data);
        
        switch (err.response.status) {
          case 401:
            // Distinguish between backend auth failure and Bunny API failure
            if (
              err.response.data?.message &&
              err.response.data.message.toLowerCase().includes('bunny')
            ) {
              // Bunny returned 401 (likely invalid API key). Do not logout.
              errorMessage = `❌ ${err.response.data.message}`;
            } else {
              errorMessage = '❌ Authentication failed. Please log in again.';
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
            break;
          case 403:
            errorMessage = '❌ You do not have permission to upload videos.';
            break;
          case 404:
            errorMessage = '❌ Course not found.';
            break;
          case 413:
            errorMessage = '❌ File too large. Please try a smaller video file.';
            break;
          case 500:
            errorMessage = err.response.data?.message || '❌ Server error occurred.';
            break;
          default:
            errorMessage = err.response.data?.message || `❌ Upload failed (${err.response.status}).`;
        }
      } else if (err.request) {
        errorMessage = '❌ Network error. Please check your connection and try again.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = '❌ Upload timeout. Please try again with a smaller file.';
      }
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded">
      <h4>📤 Upload Video to Bunny.net</h4>
      
      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : message.includes('⏳') ? 'alert-info' : 'alert-danger'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Video Title *</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Video File *</label>
          <input
            type="file"
            className="form-control"
            accept=".mp4,.mov,.avi,.mkv,.webm"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={loading}
            required
          />
          {file && (
            <small className="text-muted">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </small>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Visible From (Optional)</label>
          <input
            type="datetime-local"
            className="form-control"
            value={visibleFrom}
            onChange={(e) => setVisibleFrom(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            disabled={loading}
          />
          <label className="form-check-label" htmlFor="isPublic">
            Make Video Public
          </label>
        </div>

        <h6>📝 Subtitles (Optional):</h6>
        {subtitles.map((sub, idx) => (
          <div key={idx} className="mb-2">
            <input
              type="text"
              className="form-control mb-1"
              placeholder="Language (e.g., English, Sinhala)"
              value={sub.language}
              onChange={(e) => handleSubtitleChange(idx, 'language', e.target.value)}
              disabled={loading}
            />
            <input
              type="url"
              className="form-control"
              placeholder="Subtitle URL (.vtt file)"
              value={sub.url}
              onChange={(e) => handleSubtitleChange(idx, 'url', e.target.value)}
              disabled={loading}
            />
          </div>
        ))}
        
        <button 
          type="button" 
          className="btn btn-secondary mb-3" 
          onClick={addSubtitleField}
          disabled={loading}
        >
          + Add Subtitle
        </button>

        <button 
          type="submit" 
          className={`btn btn-primary w-100 ${loading ? 'disabled' : ''}`}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
};

export default BunnyFileUploader;