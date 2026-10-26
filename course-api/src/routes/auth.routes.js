const router = require('express').Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post(
  '/register',
  validate({
    name: { required: true, type: 'string', minLength: 2 },
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string', minLength: 6 },
  }),
  register
);

router.post(
  '/login',
  validate({
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string' },
  }),
  login
);

router.get('/me', protect, getMe);

module.exports = router;
