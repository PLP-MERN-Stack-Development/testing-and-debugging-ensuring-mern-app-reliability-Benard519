const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

/**
 * User Routes
 * All routes are prefixed with /api/users
 */

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Protected routes (would normally require auth middleware)
router.get('/me/profile', getMe);

module.exports = router;

