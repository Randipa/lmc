const express = require('express');
const router = express.Router();
const bunnyController = require('../controllers/bunnyController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Get list of videos from Bunny.net (Admin only)
router.get('/videos', authenticateToken, requireAdmin, bunnyController.listVideos);

module.exports = router;
