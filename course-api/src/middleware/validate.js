const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * validate(rules, { partial })
 * rules: { field: { required, type: 'string'|'number'|'email'|'objectId', min, max, minLength, maxLength } }
 * partial = true -> used for updates (fields optional, but at least one must be sent)
 */
const validate = (rules, { partial = false } = {}) => (req, res, next) => {
  const body = req.body || {};
  const errors = [];

  if (partial && !Object.keys(rules).some((f) => body[f] !== undefined)) {
    return next(
      new ApiError(400, 'Validation failed', [{ field: 'body', message: 'Provide at least one field to update' }])
    );
  }

  for (const [field, rule] of Object.entries(rules)) {
    const value = body[field];
    const missing = value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

    if (missing) {
      if (rule.required && !partial) errors.push({ field, message: `${field} is required` });
      else if (rule.required && partial && value !== undefined) errors.push({ field, message: `${field} cannot be empty` });
      continue;
    }

    switch (rule.type) {
      case 'string':
        if (typeof value !== 'string') errors.push({ field, message: `${field} must be a string` });
        else {
          if (rule.minLength && value.trim().length < rule.minLength)
            errors.push({ field, message: `${field} must be at least ${rule.minLength} characters` });
          if (rule.maxLength && value.trim().length > rule.maxLength)
            errors.push({ field, message: `${field} must be at most ${rule.maxLength} characters` });
        }
        break;
      case 'email':
        if (typeof value !== 'string' || !EMAIL_RE.test(value))
          errors.push({ field, message: `${field} must be a valid email` });
        break;
      case 'number':
        if (typeof value !== 'number' || Number.isNaN(value)) errors.push({ field, message: `${field} must be a number` });
        else {
          if (rule.min !== undefined && value < rule.min) errors.push({ field, message: `${field} must be >= ${rule.min}` });
          if (rule.max !== undefined && value > rule.max) errors.push({ field, message: `${field} must be <= ${rule.max}` });
        }
        break;
      case 'objectId':
        if (!mongoose.isValidObjectId(value)) errors.push({ field, message: `${field} must be a valid ID` });
        break;
    }
  }

  if (errors.length) return next(new ApiError(400, 'Validation failed', errors));
  next();
};

module.exports = validate;
