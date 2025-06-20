const BankPaymentRequest = require('../models/BankPaymentRequest');
const UserCourseAccess = require('../models/UserCourseAccess');

exports.submitBankPayment = async (req, res) => {
  const { courseId, zipUrl } = req.body;
  const userId = req.user.userId;

  const existing = await UserCourseAccess.findOne({ userId, courseId, expiresAt: { $gt: new Date() } });
  if (existing) return res.status(400).json({ message: 'You already have access to this course until 8th.' });

  const request = new BankPaymentRequest({ userId, courseId, zipUrl });
  await request.save();
  res.status(201).json({ message: 'Bank payment submitted', request });
};

exports.approveBankPayment = async (req, res) => {
  const { requestId } = req.params;
  const request = await BankPaymentRequest.findById(requestId);
  if (!request || request.status !== 'pending') return res.status(404).json({ message: 'Request not found' });

  request.status = 'approved';
  await request.save();

  await UserCourseAccess.create({ userId: request.userId, courseId: request.courseId });
  res.json({ message: 'Payment approved and access granted' });
};

