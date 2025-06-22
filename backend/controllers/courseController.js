const Course = require('../models/Course');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, durationInDays, type, grade, subject, teacherName } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: 'Title and price are required' });
    }

    const newCourse = new Course({
      title,
      description,
      price: parseFloat(price),
      durationInDays: durationInDays || 30,
      type: type || 'class',
      grade,
      subject,
      teacherName,
      createdBy: req.user?.userId || null
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { type, grade, subject, teacherName, search, minPrice, maxPrice } = req.query;
    let query = {};

    if (type) query.type = type;
    if (grade) query.grade = grade;
    if (subject) query.subject = subject;
    if (teacherName) query.teacherName = teacherName;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.json({ message: 'Courses retrieved successfully', count: courses.length, courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error while fetching courses', error: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({ message: 'Course retrieved successfully', course });
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, durationInDays, type, grade, subject, teacherName } = req.body;

    const course = await Course.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price: parseFloat(price),
        durationInDays: durationInDays || 30,
        type: type || 'class',
        grade,
        subject,
        teacherName
      },
      { new: true, runValidators: true }
    );

    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({ message: 'Course deleted successfully', course });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};

// Add Bunny.net video to a course
exports.addCourseContent = async (req, res) => {
  try {
    const { title, videoId, videoUrl, isPublic, visibleFrom, subtitles } = req.body;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.courseContent.push({
      title,
      videoId,
      videoUrl,
      isPublic,
      visibleFrom,
      subtitles
    });

    await course.save();
    res.json({ message: 'Content added to course', course });
  } catch (error) {
    console.error('Add content error:', error);
    res.status(500).json({ message: 'Failed to add course content', error: error.message });
  }
};

// Course statistics
exports.getCourseStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const classCourses = await Course.countDocuments({ type: 'class' });
    const moduleCourses = await Course.countDocuments({ type: 'module' });

    const priceStats = await Course.aggregate([
      {
        $group: {
          _id: null,
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.json({
      message: 'Course statistics retrieved successfully',
      stats: {
        totalCourses,
        classCourses,
        moduleCourses,
        averagePrice: priceStats[0]?.averagePrice || 0,
        minPrice: priceStats[0]?.minPrice || 0,
        maxPrice: priceStats[0]?.maxPrice || 0
      }
    });
  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({ message: 'Failed to get stats', error: error.message });
  }
};

// Return distinct grades that have courses
exports.getAvailableGrades = async (req, res) => {
  try {
    const grades = await Course.distinct('grade');
    res.json({ grades });
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({ message: 'Failed to fetch grades' });
  }
};
