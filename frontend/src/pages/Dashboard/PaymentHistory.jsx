import { useEffect, useState } from 'react';
import api from '../../api';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get('/payment/history')
      .then(res => setPayments(res.data.payments || []))
      .catch(() => setPayments([]));
  }, []);

  return (
    <div className="container py-4">
      <h4>Payment History</h4>
      <ul className="list-group">
        {payments.map((p) => (
          <li key={p._id} className="list-group-item">
            Order: {p.orderId} – Rs. {p.amount} – {new Date(p.createdAt).toLocaleDateString()} – {p.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentHistory;
