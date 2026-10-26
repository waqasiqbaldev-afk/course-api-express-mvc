const router = require('express').Router();
const c = require('../controllers/course.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const rules = {
  title: { required: true, type: 'string', minLength: 3, maxLength: 120 },
  description: { required: true, type: 'string', minLength: 10 },
  price: { required: true, type: 'number', min: 0 },
  duration: { type: 'string', maxLength: 50 },
  instructor: { required: true, type: 'string', minLength: 2 },
  category: { required: true, type: 'objectId' },
};

router.route('/')
  .get(c.getCourses)                                      // public
  .post(protect, validate(rules), c.createCourse);        // protected

router.route('/:id')
  .get(c.getCourse)
  .put(protect, validate(rules, { partial: true }), c.updateCourse)
  .delete(protect, c.deleteCourse);

module.exports = router;
