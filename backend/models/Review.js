const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5, required: true },
  reviewText: { type: String, required: true },
});

module.exports = mongoose.model('Review', ReviewSchema);