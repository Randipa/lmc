import { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const [form, setForm] = useState({ name: '', imageUrl: '', price: '', quantity: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', form);
      setMessage('Product added!');
      setTimeout(() => navigate('/admin/products/create'), 1000);
    } catch (err) {
      setMessage('Failed to add product');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Product</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          name="name"
          placeholder="Name"
          value={form.name}
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
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
        />
        <button className="btn btn-primary">Add</button>
      </form>
    </div>
  );
};

export default CreateProduct;
