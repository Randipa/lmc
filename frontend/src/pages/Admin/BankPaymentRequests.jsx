import { useEffect, useState } from 'react';
import api from '../../api';

function BankPaymentRequests() {
  const [requests, setRequests] = useState([]);

  const loadRequests = () => {
    api.get('/bank-payment/requests')
      .then(res => setRequests(res.data.requests || []))
      .catch(() => setRequests([]));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approve = async (id) => {
    try {
      await api.put(`/bank-payment/approve/${id}`);
      loadRequests();
    } catch (err) {
      console.error('Approve failed', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Bank Payment Requests</h2>
      <ul className="list-group">
        {requests.map(r => (
          <li key={r._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {r.userId?.firstName} {r.userId?.lastName} - {r.courseId?.title}
            </span>
            <button
              className="btn btn-sm btn-success"
              onClick={() => approve(r._id)}
            >
              Approve
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BankPaymentRequests;
