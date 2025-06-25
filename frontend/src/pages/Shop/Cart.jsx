import { useEffect, useState } from 'react';
import api from '../../api';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const cart = localStorage.getItem('cart');
    if (cart) setItems(JSON.parse(cart));
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  const handleCheckout = async () => {
    try {
      const payload = items.map((i) => ({ productId: i._id, qty: i.qty || 1 }));
      const res = await api.post('/shop/checkout', { items: payload });
      const data = res.data.paymentData;

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.sandbox
        ? 'https://sandbox.payhere.lk/pay/checkout'
        : 'https://www.payhere.lk/pay/checkout';

      for (const key in data) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      form.remove();
    } catch (err) {
      setMsg('Checkout failed');
    }
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setItems([]);
  };

  return (
    <div className="container py-4">
      <h3>Your Cart</h3>
      {items.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {items.map((item, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between">
                {item.name} x {item.qty || 1}
                <span>Rs. {item.price * (item.qty || 1)}</span>
              </li>
            ))}
          </ul>
          <h5>Total: Rs. {total}</h5>
          <button className="btn btn-success me-2" onClick={handleCheckout}>Checkout</button>
          <button className="btn btn-outline-danger" onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
};

export default Cart;
