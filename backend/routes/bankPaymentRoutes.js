const express = require('express');
const router = express.Router();
const controller = require('../controllers/bankPaymentController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/submit', authenticateToken, controller.submitBankPayment);
router.put('/approve/:requestId', authenticateToken, requireAdmin, controller.approveBankPayment);

module.exports = router;
