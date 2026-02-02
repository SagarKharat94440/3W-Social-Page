const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const authService = require('../services/authService');

//register  a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.registerUser(username, email, password);
    res.status(201).json(result);
  } catch (error) {
    console.error('Register error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
});
// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
});

//  Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const result = await authService.getUserProfile(req.user._id);
    res.json(result);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
