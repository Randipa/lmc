import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

function CreateCourse() {
  const [step, setStep] = useState('info');
  const [courseId, setCourseId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    imageUrl: '',
    description: '',
    price: '',
    durationInDays: 30,
    grade: '',
    subject: '',
    teacherName: ''
  });
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState('');
  const [content, setContent] = useState([
    { title: '', videoUrl: '', isPublic: false }
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!form.grade) {
      setTeachers([]);
      setSubjects([]);
      return;
    }
    api
      .get(`/teachers/available-subjects?grade=${form.grade}`)
      .then(res => setSubjects(res.data.subjects || []))
      .catch(() => setSubjects([]));
  }, [form.grade]);

  useEffect(() => {
    if (!form.grade || !form.subject) {
      setTeachers([]);
      return;
    }
    api
      .get(`/teachers?grade=${form.grade}&subject=${encodeURIComponent(form.subject)}`)
      .then(res => setTeachers(res.data.teachers || []))
      .catch(() => setTeachers([]));
  }, [form.grade, form.subject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'grade') {
      setForm({ ...form, grade: value, subject: '', teacherName: '' });
    } else if (name === 'subject') {
      setForm({ ...form, subject: value, teacherName: '' });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const submitInfo = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/courses', form);
      setCourseId(res.data.course._id);
      setStep('content');
      setMessage('Course created. Now add content');
    } catch (err) {
      setMessage('Creation failed');
    }
  };

  const handleContentChange = (idx, field, value) => {
    const updated = [...content];
    updated[idx][field] = value;
    setContent(updated);
  };

  const addContent = () => {
    setContent([...content, { title: '', videoUrl: '', isPublic: false }]);
  };

  const removeContent = (idx) => {
    const updated = content.filter((_, i) => i !== idx);
    setContent(updated.length ? updated : [{ title: '', videoUrl: '', isPublic: false }]);
  };

  const submitContent = async (e) => {
    e.preventDefault();
    if (!courseId) return;
    try {
      await Promise.all(content.map(item => api.post(`/courses/${courseId}/content`, {
        title: item.title,
        videoUrl: item.videoUrl,
        isPublic: item.isPublic
      })));
      navigate('/admin/courses');
    } catch {
      setMessage('Failed to save content');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Course</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {step === 'info' && (
        <form onSubmit={submitInfo}>
          <input
            className="form-control mb-2"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-2"
            name="imageUrl"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={handleChange}
          />
          <textarea
            className="form-control mb-2"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            className="form-control mb-2"
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-2"
            name="durationInDays"
            type="number"
            placeholder="Duration in days"
            value={form.durationInDays}
            onChange={handleChange}
          />
          <select
            className="form-control mb-2"
            name="grade"
            value={form.grade}
            onChange={handleChange}
            required
          >
            <option value="">Select Grade</option>
            {[...Array(13)].map((_, i) => (
              <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
            ))}
          </select>
          <select
            className="form-control mb-2"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            className="form-control mb-2"
            name="teacherName"
            value={form.teacherName}
            onChange={handleChange}
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map(t => (
              <option key={t._id} value={`${t.firstName} ${t.lastName}`}>{t.firstName} {t.lastName}</option>
            ))}
          </select>
          <button className="btn btn-primary">Create &amp; Next</button>
        </form>
      )}

      {step === 'content' && (
        <form onSubmit={submitContent}>
          {content.map((c, idx) => (
            <div key={idx} className="border rounded p-3 mb-3">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Content Title"
                value={c.title}
                onChange={e => handleContentChange(idx, 'title', e.target.value)}
                required
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Video URL"
                value={c.videoUrl}
                onChange={e => handleContentChange(idx, 'videoUrl', e.target.value)}
                required
              />
              <select
                className="form-control mb-2"
                value={c.isPublic ? 'unpaid' : 'paid'}
                onChange={e => handleContentChange(idx, 'isPublic', e.target.value === 'unpaid')}
              >
                <option value="paid">Paid Students</option>
                <option value="unpaid">Unpaid Students</option>
              </select>
              {content.length > 1 && (
                <button type="button" className="btn btn-sm btn-danger" onClick={() => removeContent(idx)}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-secondary mb-3" onClick={addContent}>➕ Add Content</button>
          <div>
            <button type="submit" className="btn btn-success">Save</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CreateCourse;
