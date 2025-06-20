const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const videoController = require('../controllers/uploadCourseVideo');
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/authMiddleware');

// Course CRUD
router.post('/courses', authenticateToken, courseController.createCourse);
router.get('/courses', courseController.getAllCourses);
router.get('/courses/stats', courseController.getCourseStats);
router.get('/courses/:id', courseController.getCourseById);
router.put('/courses/:id', authenticateToken, courseController.updateCourse);
router.delete('/courses/:id', authenticateToken, courseController.deleteCourse);

// Add course content (manual embed or Bunny.net metadata)
router.post('/courses/:id/content', authenticateToken, courseController.addCourseContent);

// Upload video file directly to Bunny.net and attach to course
router.post('/courses/:id/upload-video', authenticateToken, upload.single('video'), videoController.uploadCourseVideo);

module.exports = router;
