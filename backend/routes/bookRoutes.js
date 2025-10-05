const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/books (with pagination support)
// @desc    Get all books
router.get('/', bookController.getAllBooks);

// @route   GET /api/books/:id
// @desc    Get single book details
router.get('/:id', bookController.getBookById);

// @route   POST /api/books
// @desc    Add a new book (Protected)
router.post('/', authMiddleware, bookController.createBook);

// @route   PUT /api/books/:id
// @desc    Update a book (Protected)
router.put('/:id', authMiddleware, bookController.updateBook);

// @route   DELETE /api/books/:id
// @desc    Delete a book (Protected)
router.delete('/:id', authMiddleware, bookController.deleteBook);

module.exports = router;
