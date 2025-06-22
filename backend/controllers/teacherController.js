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
    if (req.query.subject) query.subject = req.query.subject;

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

// Get distinct subjects for a given grade
exports.getAvailableSubjects = async (req, res) => {
  try {
    const grade = parseInt(req.query.grade, 10);
    if (!grade) {
      return res.status(400).json({ message: 'Grade is required' });
    }
    const subjects = await Teacher.find({ grade }).distinct('subject');
    res.json({ subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch subjects' });
  }
};
