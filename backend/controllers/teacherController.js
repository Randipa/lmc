const Teacher = require('../models/Teacher');

exports.createTeacher = async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).json({ teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create teacher' });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const query = {};
    if (req.query.grade) query.grade = parseInt(req.query.grade, 10);

    const teachers = await Teacher.find(query).sort({ createdAt: -1 });
    res.json({ teachers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch teachers' });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch teacher' });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update teacher' });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ message: 'Teacher deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete teacher' });
  }
};
