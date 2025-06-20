const PaymentHistory = () => {
  const payments = [
    { orderId: 'ORD123', amount: 2500, date: '2025-06-01' },
    { orderId: 'ORD124', amount: 2500, date: '2025-07-01' }
  ];

  return (
    <div className="container py-4">
      <h4>Payment History</h4>
      <ul className="list-group">
        {payments.map((p, i) => (
          <li key={i} className="list-group-item">
            Order: {p.orderId} – Rs. {p.amount} – {p.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentHistory;
