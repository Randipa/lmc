import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';

function EditTeacher() {
  const { teacherId } = useParams();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', description: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/teachers/${teacherId}`)
      .then(res => setForm(res.data.teacher))
      .catch(() => navigate('/admin/teachers'));
  }, [teacherId, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/teachers/${teacherId}`, form);
      setMessage('Teacher updated');
      navigate('/admin/teachers');
    } catch (err) {
      setMessage('Update failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Teacher</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
        <input className="form-control mb-2" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
        <input className="form-control mb-2" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input className="form-control mb-2" name="phoneNumber" placeholder="Phone" value={form.phoneNumber} onChange={handleChange} />
        <textarea className="form-control mb-2" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <button className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}

export default EditTeacher;
