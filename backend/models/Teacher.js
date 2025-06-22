const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String },
  phoneNumber: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
