import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const Shop = () => {
  const [cart, setCart] = useState(() => {
    const existing = localStorage.getItem('cart');
    return existing ? JSON.parse(existing) : [];
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get('/products')
      .then((res) => setItems(res.data.products || []))
      .catch(() => setItems([]));
  }, []);

  const addToCart = (item) => {
    const newCart = [...cart, { ...item, qty: 1 }];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  return (
    <div className="container py-4">
      <h3>Shop Items</h3>
      <div className="row">
        {items.map(item => (
          <div className="col-md-4" key={item._id}>
            <div className="card mb-3">
              {item.imageUrl && <img src={item.imageUrl} className="card-img-top" alt={item.name} />}
              <div className="card-body">
                <h5>{item.name}</h5>
                <p>Rs. {item.price}</p>
                <button className="btn btn-sm btn-primary" onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link to="/shop/cart" className="btn btn-dark mt-3">Go to Cart</Link>
    </div>
  );
};

export default Shop;
