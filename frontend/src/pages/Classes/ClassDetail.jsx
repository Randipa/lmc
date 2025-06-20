import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api';

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slipUrl, setSlipUrl] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    api.get(`/courses/${classId}`)
      .then(res => {
        setClassData(res.data.course);
        setLoading(false);
      })
      .catch(() => {
        setMessage('Failed to fetch class details');
        setLoading(false);
      });
  }, [classId]);

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    if (!token) return navigate('/login');
    if (!slipUrl) return setMessage('Please provide the slip URL.');

    try {
      await api.post('/bank-payment/submit', {
        courseId: classId,
        zipUrl: slipUrl
      });
      setMessage('Slip submitted! Awaiting admin approval.');
      setSlipUrl('');
    } catch (err) {
      setMessage('Upload failed.');
    }
  };

  const handlePayHere = async () => {
    if (!token) return navigate('/login');

    try {
      const res = await api.post('/payment/initiate-payment', {
        courseId: classId,
        amount: classData.price,
        phoneNumber: user.phoneNumber
      });

      const data = res.data.paymentData;
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.sandbox
        ? 'https://sandbox.payhere.lk/pay/checkout'
        : 'https://www.payhere.lk/pay/checkout';

      Object.entries(data).forEach(([k, v]) => {
        if (k === 'sandbox') return;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = v;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to initiate online payment.';
      setMessage(msg);
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!classData) return <div className="container mt-5">Class not found</div>;

  return (
    <div className="container py-4">
      <h4>{classData.title}</h4>
      <p>{classData.description}</p>
      <p><strong>Fee:</strong> Rs. {classData.price}</p>

      {!token && (
        <div className="alert alert-warning">
          Please <a href="/login">log in</a> to enroll.
        </div>
      )}

      {token && (
        <>
          <h5>📤 Submit Bank Slip</h5>
          <form onSubmit={handleBankSubmit} className="mb-4">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Slip URL"
              value={slipUrl}
              onChange={(e) => setSlipUrl(e.target.value)}
            />
            <button className="btn btn-outline-secondary">Submit Slip</button>
          </form>

          <h5>💳 Pay Online</h5>
          <button className="btn btn-primary" onClick={handlePayHere}>Pay with PayHere</button>
        </>
      )}

      {message && <div className="alert alert-info mt-4">{message}</div>}
    </div>
  );
};

export default ClassDetail;
