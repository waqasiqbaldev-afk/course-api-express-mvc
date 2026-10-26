const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'title is required'], trim: true },
    description: { type: String, required: [true, 'description is required'], trim: true },
    price: { type: Number, required: [true, 'price is required'], min: 0 },
    duration: { type: String, trim: true, default: '' }, // e.g. "8 weeks"
    instructor: { type: String, required: [true, 'instructor is required'], trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'category is required'] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
