import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

function CreateCourse() {
  const [form, setForm] = useState({ title: '', description: '', price: '', durationInDays: 30 });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/courses', form);
      setMessage('Course created!');
      navigate(`/admin/courses/${res.data.course._id}/upload`);
    } catch (err) {
      setMessage('Creation failed.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Course</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
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
        <button className="btn btn-primary">Create</button>
      </form>
    </div>
  );
}

export default CreateCourse;
