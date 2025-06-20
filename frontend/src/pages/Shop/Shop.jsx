import { useState } from 'react';
import { Link } from 'react-router-dom';

const sampleItems = [
  { _id: 'i1', name: 'Math Book', price: 1200 },
  { _id: 'i2', name: 'Science Kit', price: 2500 },
  { _id: 'i3', name: 'Notebook Set', price: 800 }
];

const Shop = () => {
  const [cart, setCart] = useState(() => {
    const existing = localStorage.getItem('cart');
    return existing ? JSON.parse(existing) : [];
  });

  const addToCart = (item) => {
    const newCart = [...cart, item];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  return (
    <div className="container py-4">
      <h3>Shop Items</h3>
      <div className="row">
        {sampleItems.map(item => (
          <div className="col-md-4" key={item._id}>
            <div className="card mb-3">
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
