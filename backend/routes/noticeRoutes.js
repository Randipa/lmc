const express = require('express');
const router = express.Router();
const controller = require('../controllers/noticeController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, requireAdmin, controller.createNotice);
router.get('/', controller.getNotices);
router.get('/my', authenticateToken, controller.getMyNotices);

module.exports = router;
