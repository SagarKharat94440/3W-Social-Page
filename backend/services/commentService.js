const Post = require('../models/Post');

// Add a comment to a post
const addComment = async (postId, userId, username, text) => {
  if (!text || !text.trim()) {
    const error = new Error('Comment text is required');
    error.statusCode = 400;
    throw error;
  }

  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  const newComment = {
    user: userId,
    username: username,
    text: text.trim()
  };

  post.comments.unshift(newComment);
  await post.save();

  return {
    comments: post.comments,
    commentsCount: post.comments.length
  };
};

// Delete a comment from a post
const deleteComment = async (postId, commentId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  // Find the comment
  const comment = post.comments.find(
    c => c._id.toString() === commentId
  );

  if (!comment) {
    const error = new Error('Comment not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if user owns the comment
  if (comment.user.toString() !== userId.toString()) {
    const error = new Error('Not authorized to delete this comment');
    error.statusCode = 403;
    throw error;
  }

  // Remove the comment
  post.comments = post.comments.filter(
    c => c._id.toString() !== commentId
  );

  await post.save();

  return {
    comments: post.comments,
    commentsCount: post.comments.length
  };
};

module.exports = {
  addComment,
  deleteComment
};
