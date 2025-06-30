const Product = require('../models/Product');
const User = require('../models/User');
const crypto = require('crypto');

const generatePayHereHash = (merchantId, orderId, amount, currency, secret) => {
  const formattedAmount = parseFloat(amount).toFixed(2);
  const hashedSecret = crypto.createHash('md5').update(secret).digest('hex').toUpperCase();
  const hashString = merchantId + orderId + formattedAmount + currency + hashedSecret;
  return crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

exports.initiateCheckout = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, qty }]
    const userId = req.user?.userId;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }

    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    let total = 0;
    products.forEach(p => {
      const cartItem = items.find(i => i.productId === p._id.toString());
      const qty = cartItem ? parseInt(cartItem.qty, 10) || 0 : 0;
      total += qty * p.price;
    });

    if (total <= 0) {
      return res.status(400).json({ message: 'Invalid total' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const orderId = `SHOP${Date.now()}`;
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const currency = 'LKR';
    const amount = total.toFixed(2);
    const hash = generatePayHereHash(merchantId, orderId, amount, currency, merchantSecret);

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.BASE_URL || 'http://localhost:5000';

    const paymentData = {
      sandbox: process.env.PAYHERE_SANDBOX === 'true',
      merchant_id: merchantId,
      return_url: `${baseUrl}/api/payment/return`,
      cancel_url: `${baseUrl}/api/payment/cancel`,
      notify_url: `${baseUrl}/api/payment/notify`,
      order_id: orderId,
      items: 'Shop Order',
      amount,
      currency,
      hash,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email || `user${user.phoneNumber}@example.com`,
      phone: user.phoneNumber,
      address: user.address,
      city: user.city || 'Colombo',
      country: 'Sri Lanka'
    };

    res.json({ success: true, paymentData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Checkout failed' });
  }
};
