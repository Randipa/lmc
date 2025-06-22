import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

function CreateTeacher() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', description: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teachers', form);
      setMessage('Teacher created');
      navigate('/admin/teachers');
    } catch (err) {
      setMessage('Creation failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Teacher</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
        <input className="form-control mb-2" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
        <input className="form-control mb-2" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input className="form-control mb-2" name="phoneNumber" placeholder="Phone" value={form.phoneNumber} onChange={handleChange} />
        <textarea className="form-control mb-2" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <button className="btn btn-primary">Create</button>
      </form>
    </div>
  );
}

export default CreateTeacher;
