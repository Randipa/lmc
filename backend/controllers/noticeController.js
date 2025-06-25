const Notice = require('../models/Notice');

exports.createNotice = async (req, res) => {
  try {
    const { title, message, courseId, teacherId } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    if (!courseId && !teacherId) {
      return res.status(400).json({ message: 'Course or teacher must be specified' });
    }

    const notice = new Notice({
      title,
      message,
      courseId,
      teacherId,
      createdBy: req.user?.userId
    });

    await notice.save();
    res.status(201).json({ notice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create notice' });
  }
};

exports.getNotices = async (req, res) => {
  try {
    const { courseId, teacherId } = req.query;
    const query = { isActive: true };
    if (courseId) query.courseId = courseId;
    if (teacherId) query.teacherId = teacherId;

    const notices = await Notice.find(query).sort({ createdAt: -1 });
    res.json({ notices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch notices' });
  }
};
