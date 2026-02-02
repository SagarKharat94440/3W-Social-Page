const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const postService = require('../services/postService');
const commentService = require('../services/commentService');

// @route   GET /api/posts
// @desc    Get all posts (public feed) with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';

    const result = await postService.getAllPosts(page, limit, sortBy);
    res.json(result);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
});

// @route   GET /api/posts/user/:username
// @desc    Get posts by username
// @access  Public
router.get('/user/:username', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await postService.getPostsByUsername(req.params.username, page, limit);
    res.json(result);
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const result = await postService.getPostById(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Get post error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    const imageUrl = req.file ? req.file.path : '';

    const result = await postService.createPost(req.user._id, req.user.username, text, imageUrl);
    res.status(201).json(result);
  } catch (error) {
    console.error('Create post error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
});

//   Delete a post
router.delete('/:id', protect, async (req, res) => {
  try {
    const result = await postService.deletePost(req.params.id, req.user._id);
    res.json(result);
  } catch (error) {
    console.error('Delete post error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
});

// Like or unlike a post

router.put('/:id/like', protect, async (req, res) => {
  try {
    const result = await postService.toggleLike(req.params.id, req.user._id, req.user.username);
    res.json(result);
  } catch (error) {
    console.error('Like post error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
});

// Add a comment to a post
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;
    const result = await commentService.addComment(req.params.id, req.user._id, req.user.username, text);
    res.status(201).json(result);
  } catch (error) {
    console.error('Comment error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
});

//  Delete a comment from a post

router.delete('/:id/comment/:commentId', protect, async (req, res) => {
  try {
    const result = await commentService.deleteComment(req.params.id, req.params.commentId, req.user._id);
    res.json(result);
  } catch (error) {
    console.error('Delete comment error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
