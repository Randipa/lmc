const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/products', authenticateToken, requireAdmin, productController.createProduct);
router.get('/products', productController.getProducts);
router.post('/shop/checkout', authenticateToken, productController.initiateCheckout);

module.exports = router;
