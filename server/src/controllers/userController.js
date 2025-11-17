const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 * @param {string} userId - User ID
 * @returns {string} - JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Debug: Log registration attempt
  console.log('🔵 Register attempt:', { name, email });

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      error: 'User already exists with this email',
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate token
  const token = generateToken(user._id);

  // Debug: Log successful registration
  console.log('✅ User registered successfully:', user._id);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Debug: Log login attempt
  console.log('🔵 Login attempt:', { email });

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide email and password',
    });
  }

  // Check for user and include password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
    });
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
    });
  }

  // Generate token
  const token = generateToken(user._id);

  // Debug: Log successful login
  console.log('✅ User logged in successfully:', user._id);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/users/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by auth middleware
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Public (for testing purposes)
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Public (for testing purposes)
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Public (for testing purposes)
 */
const updateUser = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  // Update fields
  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Public (for testing purposes)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'User deleted successfully',
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

