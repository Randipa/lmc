const Course = require('../models/Course');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;

// Upload video file to Bunny.net
exports.uploadCourseVideo = async (req, res) => {
  try {
    const { title, isPublic, visibleFrom, subtitles } = req.body;
    const courseId = req.params.id;
    const file = req.file;

    if (!BUNNY_API_KEY || !BUNNY_LIBRARY_ID) {
      return res
        .status(500)
        .json({ message: 'Bunny API credentials missing' });
    }

    if (!file) return res.status(400).json({ message: 'Video file is required' });

    // 1. Create video in Bunny library
    const createRes = await axios.post(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
      { title },
      { headers: { AccessKey: BUNNY_API_KEY } }
    );

    const videoId = createRes.data.guid;

    // 2. Upload file to Bunny
    const filePath = file.path;
    const uploadRes = await axios.put(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${videoId}`,
      fs.readFileSync(filePath),
      {
        headers: {
          AccessKey: BUNNY_API_KEY,
          'Content-Type': 'application/octet-stream'
        },
        // Large video files easily exceed axios' default 10MB body limit
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    fs.unlinkSync(filePath); // Clean up local file

    // 3. Save to course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const videoUrl = `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}`;
    const contentItem = {
      title,
      videoId,
      videoUrl,
      isPublic: isPublic === 'true',
      visibleFrom: visibleFrom ? new Date(visibleFrom) : null,
      subtitles: subtitles ? JSON.parse(subtitles) : []
    };

    course.courseContent.push(contentItem);
    await course.save();

    res.status(200).json({ message: 'Video uploaded and added to course', videoUrl, course });
  } catch (error) {
    // If Bunny.net returns an error (e.g. invalid API key) the status code is
    // available on error.response. Propagate that status code to the client so
    // the frontend can show a more meaningful message.
    let status = error.response?.status || 500;
    let msg =
      error.response?.data?.message ||
      error.message ||
      'Video upload failed';

    if (status === 401) {
      msg = 'Invalid Bunny API credentials';
    }

    console.error('Upload error:', msg);
    res.status(status).json({ message: msg });
  }
};
