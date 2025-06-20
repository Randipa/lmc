import { useEffect, useState } from 'react';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const cart = localStorage.getItem('cart');
    if (cart) setItems(JSON.parse(cart));
  }, []);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    // Example PayHere form submission logic (same as Step 4)
    alert(`Redirecting to PayHere for Rs. ${total}`);
    // You could send items to backend and get a PayHere session
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
                {item.name}
                <span>Rs. {item.price}</span>
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
