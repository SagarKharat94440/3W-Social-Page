const Post = require('../models/Post');

// Get all posts with pagination
const getAllPosts = async (page = 1, limit = 10, sortBy = 'createdAt') => {
  const skip = (page - 1) * limit;

  let sortOptions = { createdAt: -1 }; // Default: newest first

  // Sorting options
  if (sortBy === 'likes') {
    sortOptions = { 'likes': -1, createdAt: -1 };
  } else if (sortBy === 'comments') {
    sortOptions = { 'comments': -1, createdAt: -1 };
  }

  const posts = await Post.find()
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .lean();

  // Add virtual counts
  const postsWithCounts = posts.map(post => ({
    ...post,
    likesCount: post.likes?.length || 0,
    commentsCount: post.comments?.length || 0
  }));

  const total = await Post.countDocuments();

  return {
    posts: postsWithCounts,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalPosts: total,
    hasMore: page * limit < total
  };
};

// Get single post by ID
const getPostById = async (postId) => {
  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  return post;
};

// Create a new post
const createPost = async (userId, username, text, imageUrl) => {
  // Validate: at least text or image required
  if (!text && !imageUrl) {
    const error = new Error('Post must have either text or an image');
    error.statusCode = 400;
    throw error;
  }

  const post = await Post.create({
    user: userId,
    username: username,
    text: text || '',
    image: imageUrl
  });

  return post;
};

// Delete a post
const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user owns the post
  if (post.user.toString() !== userId.toString()) {
    const error = new Error('Not authorized to delete this post');
    error.statusCode = 403;
    throw error;
  }

  await Post.findByIdAndDelete(postId);

  return { message: 'Post deleted successfully' };
};

// Like or unlike a post
const toggleLike = async (postId, userId, username) => {
  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user already liked
  const likeIndex = post.likes.findIndex(
    like => like.user.toString() === userId.toString()
  );

  if (likeIndex > -1) {
    // Unlike: remove the like
    post.likes.splice(likeIndex, 1);
  } else {
    // Like: add the like with username
    post.likes.push({
      user: userId,
      username: username
    });
  }

  await post.save();

  return {
    likes: post.likes,
    likesCount: post.likes.length,
    isLiked: likeIndex === -1 // If wasn't liked before, now it is
  };
};

// Get posts by username
const getPostsByUsername = async (username, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const posts = await Post.find({ username })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Post.countDocuments({ username });

  return {
    posts,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalPosts: total,
    hasMore: page * limit < total
  };
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  deletePost,
  toggleLike,
  getPostsByUsername
};
