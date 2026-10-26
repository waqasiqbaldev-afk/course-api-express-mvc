const Course = require('../models/Course');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const populate = [
  { path: 'category', select: 'name' },
  { path: 'createdBy', select: 'name email' },
];

const ensureCategoryExists = async (id) => {
  if (!(await Category.exists({ _id: id }))) throw new ApiError(404, 'Category not found');
};

// POST /api/courses
exports.createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, duration, instructor, category } = req.body;
  await ensureCategoryExists(category);

  const course = await Course.create({
    title, description, price, duration, instructor, category, createdBy: req.user._id,
  });
  await course.populate(populate);

  res.status(201).json({ success: true, message: 'Course created', data: course });
});

// GET /api/courses   (optional: ?category=<id>&search=<text>)
exports.getCourses = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    const escaped = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.title = { $regex: escaped, $options: 'i' };
  }

  const courses = await Course.find(filter).populate(populate).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: courses.length, data: courses });
});

// GET /api/courses/:id
exports.getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate(populate);
  if (!course) throw new ApiError(404, 'Course not found');
  res.status(200).json({ success: true, data: course });
});

// PUT /api/courses/:id
exports.updateCourse = asyncHandler(async (req, res) => {
  const { title, description, price, duration, instructor, category } = req.body;
  if (category) await ensureCategoryExists(category);

  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { title, description, price, duration, instructor, category },
    { new: true, runValidators: true, omitUndefined: true }
  ).populate(populate);

  if (!course) throw new ApiError(404, 'Course not found');
  res.status(200).json({ success: true, message: 'Course updated', data: course });
});

// DELETE /api/courses/:id
exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  res.status(200).json({ success: true, message: 'Course deleted' });
});
