import { useState } from 'react';
import api from '../../api';

const Register = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    education: '',
    address: ''
  });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      setMsg('Registered successfully! You can now login.');
    } catch (err) {
      setMsg('Registration failed.');
    }
  };

  return (
    <div className="container py-5">
      <h3>Register</h3>
      <form onSubmit={handleRegister}>
        {['firstName', 'lastName', 'phoneNumber', 'password', 'confirmPassword', 'education', 'address'].map(field => (
          <input
            key={field}
            name={field}
            className="form-control mb-2"
            type={field.includes('password') ? 'password' : 'text'}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            onChange={handleChange}
            required
          />
        ))}
        <button className="btn btn-success">Register</button>
        {msg && <div className="alert alert-info mt-3">{msg}</div>}
      </form>
    </div>
  );
};

export default Register;
