const Review = require('../models/Review');
const Book = require('../models/Book');
const mongoose = require('mongoose');

// @route   POST /api/reviews
// @desc    Add a new review (Protected)
exports.addReview = async (req, res) => {
  const { bookId, rating, reviewText } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ msg: 'Invalid book ID' });
  }
  
  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    // Check if the user has already reviewed this book
    const existingReview = await Review.findOne({ bookId, userId: req.user.id });
    if (existingReview) {
      return res.status(400).json({ msg: 'You have already reviewed this book. Please edit your existing review.' });
    }

    const newReview = new Review({
      bookId,
      userId: req.user.id,
      rating: parseInt(rating),
      reviewText,
    });
    
    const review = await newReview.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during review creation');
  }
};

// @route   PUT /api/reviews/:id
// @desc    Update an existing review (Protected - must be the creator)
exports.updateReview = async (req, res) => {
  const { rating, reviewText } = req.body;
  try {
    let review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ msg: 'Review not found' });

    // Authorization check: ensure user owns the review
    if (review.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to update this review' });
    }

    // Apply updates only if provided
    if (rating !== undefined) review.rating = parseInt(rating);
    if (reviewText !== undefined) review.reviewText = reviewText;
    
    await review.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during review update');
  }
};


// @route   DELETE /api/reviews/:id
// @desc    Delete a review (Protected - must be the creator)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ msg: 'Review not found' });

    // Authorization check: ensure user owns the review
    if (review.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this review' });
    }
    
    await review.deleteOne();
    res.json({ msg: 'Review removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during review deletion');
  }
};
