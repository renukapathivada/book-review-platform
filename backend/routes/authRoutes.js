const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/auth/signup
// @desc    Register user
router.post('/signup', authController.signup);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
