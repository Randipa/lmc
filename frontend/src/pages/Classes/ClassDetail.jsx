import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api';

const ClassDetail = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slip, setSlip] = useState(null);
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
    if (!slip) return setMessage('Please choose a slip file.');

    const formData = new FormData();
    formData.append('courseId', classId);
    formData.append('slip', slip);

    try {
      await api.post('/payment/bank-upload', formData);
      setMessage('Slip uploaded! Awaiting admin approval.');
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
      form.action = 'https://sandbox.payhere.lk/pay/checkout';

      Object.entries(data).forEach(([k, v]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = v;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setMessage('Failed to initiate online payment.');
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
          <h5>📤 Upload Bank Slip</h5>
          <form onSubmit={handleBankSubmit} className="mb-4">
            <input type="file" className="form-control mb-2" onChange={(e) => setSlip(e.target.files[0])} />
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
