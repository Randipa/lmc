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
  const [hasAccess, setHasAccess] = useState(false);
  const [now] = useState(new Date());

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    api.get(`/courses/${classId}`)
      .then(res => {
        setClassData(res.data.course);
        setHasAccess(res.data.hasAccess || false);
        setLoading(false);
      })
      .catch(() => {
        setMessage('Failed to fetch class details');
        setLoading(false);
      });
  }, [classId]);

  // Double-check access from user's enrolled courses
  useEffect(() => {
    if (!token) return;
    if (hasAccess) return;
    api.get('/users/my-courses')
      .then(res => {
        const enrolled = res.data.classes?.some(c => c._id === classId);
        if (enrolled) setHasAccess(true);
      })
      .catch(() => {});
  }, [classId, token, hasAccess]);

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

      <hr />
      <h5>Class Content</h5>
      {classData.courseContent?.length === 0 && <p>No videos available</p>}

      {!hasAccess && classData.courseContent?.length > 0 && (
        <div className="alert alert-warning">Please purchase this class to watch the videos.</div>
      )}

      {hasAccess &&
        classData.courseContent?.map((video, index) => {
          const isVisible = video.isPublic || new Date(video.visibleFrom) <= now;
          return (
            <div key={index} className="mb-5 border p-3 rounded">
              <h6>{video.title}</h6>
              {!isVisible ? (
                <p className="text-danger">This video is not yet available.</p>
              ) : (
                <div className="ratio ratio-16x9 mb-2">
                  <iframe
                    src={video.videoUrl}
                    title={video.title}
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ClassDetail;
