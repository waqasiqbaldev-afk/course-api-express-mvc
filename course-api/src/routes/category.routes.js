const router = require('express').Router();
const c = require('../controllers/category.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const rules = {
  name: { required: true, type: 'string', minLength: 2, maxLength: 60 },
  description: { type: 'string', maxLength: 500 },
};

router.route('/')
  .get(c.getCategories)                                   // public
  .post(protect, validate(rules), c.createCategory);      // protected

router.route('/:id')
  .get(c.getCategory)
  .put(protect, validate(rules, { partial: true }), c.updateCategory)
  .delete(protect, c.deleteCategory);

module.exports = router;
