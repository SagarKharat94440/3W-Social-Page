const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Register a new user
const registerUser = async (username, email, password) => {
  // Validate input
  if (!username || !email || !password) {
    const error = new Error('Please provide all required fields');
    error.statusCode = 400;
    throw error;
  }

  // Check if user already exists
  const userExists = await User.findOne({ 
    $or: [{ email }, { username }] 
  });

  if (userExists) {
    const error = new Error(
      userExists.email === email 
        ? 'Email already registered' 
        : 'Username already taken'
    );
    error.statusCode = 400;
    throw error;
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password
  });

  // Return user with token
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    token: generateToken(user._id)
  };
};

// Login user
const loginUser = async (email, password) => {
  // Validate input
  if (!email || !password) {
    const error = new Error('Please provide email and password');
    error.statusCode = 400;
    throw error;
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Return user with token
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    token: generateToken(user._id)
  };
};

// Get user profile
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt
  };
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
