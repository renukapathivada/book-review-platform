const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/reviews
// @desc    Add a new review (Protected)
router.post('/', authMiddleware, reviewController.addReview);

// @route   PUT /api/reviews/:id
// @desc    Update a review (Protected)
router.put('/:id', authMiddleware, reviewController.updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete a review (Protected)
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
