const Notice = require('../models/Notice');
const UserCourseAccess = require('../models/UserCourseAccess');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');

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

exports.getMyNotices = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Active course access for this user
    const accesses = await UserCourseAccess.find({
      userId,
      expiresAt: { $gt: new Date() }
    }).populate('courseId');

    const courseIds = accesses.map((a) => a.courseId?._id).filter(Boolean);
    const teacherNames = accesses
      .map((a) => a.courseId?.teacherName)
      .filter(Boolean);

    // Map teacher names to teacher IDs
    const teachers = await Teacher.find({});
    const teacherIdMap = new Map();
    teachers.forEach((t) => {
      teacherIdMap.set(`${t.firstName} ${t.lastName}`, t._id.toString());
    });
    const teacherIds = teacherNames
      .map((name) => teacherIdMap.get(name))
      .filter(Boolean);

    const query = { isActive: true, $or: [] };
    if (courseIds.length > 0) query.$or.push({ courseId: { $in: courseIds } });
    if (teacherIds.length > 0) query.$or.push({ teacherId: { $in: teacherIds } });

    if (query.$or.length === 0) {
      return res.json({ notices: [] });
    }

    const notices = await Notice.find(query).sort({ createdAt: -1 });
    res.json({ notices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch notices' });
  }
};
