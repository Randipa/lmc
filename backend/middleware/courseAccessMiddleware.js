const UserCourseAccess = require('../models/UserCourseAccess');

exports.checkCourseAccess = async (req, res, next) => {
  const userId = req.user.userId;
  const { courseId } = req.params;

  const access = await UserCourseAccess.findOne({
    userId,
    courseId,
    expiresAt: { $gt: new Date() }
  });

  if (!access) {
    return res.status(403).json({ message: 'Course access denied. Please purchase this course.' });
  }

  next();
};