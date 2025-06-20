const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/initiate-payment', authenticateToken, paymentController.initiatePayment);
router.get('/return', paymentController.handlePaymentReturn);
router.get('/cancel', paymentController.handlePaymentCancel);
router.post('/notify', paymentController.handlePaymentNotify);
router.post('/verify-payment', authenticateToken, paymentController.verifyPayment);
router.get('/history', authenticateToken, paymentController.getPaymentHistory);

module.exports = router;
