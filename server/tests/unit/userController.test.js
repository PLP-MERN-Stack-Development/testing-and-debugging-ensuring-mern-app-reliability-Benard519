const mongoose = require('mongoose');
const User = require('../../src/models/User');
const {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../../src/controllers/userController');

/**
 * Unit Tests for User Controller
 * Tests controller functions in isolation
 */
describe('User Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: expect.objectContaining({
              name: 'John Doe',
              email: 'john@example.com',
            }),
            token: expect.any(String),
          }),
        })
      );
    });

    it('should return error if user already exists', async () => {
      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'User already exists with this email',
        })
      );
    });
  });

  describe('loginUser', () => {
    beforeEach(async () => {
      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
    });

    it('should login user with valid credentials', async () => {
      req.body = {
        email: 'john@example.com',
        password: 'password123',
      };

      await loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: expect.objectContaining({
              email: 'john@example.com',
            }),
            token: expect.any(String),
          }),
        })
      );
    });

    it('should return error with invalid email', async () => {
      req.body = {
        email: 'wrong@example.com',
        password: 'password123',
      };

      await loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Invalid credentials',
        })
      );
    });

    it('should return error with invalid password', async () => {
      req.body = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      await loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Invalid credentials',
        })
      );
    });

    it('should return error if email or password is missing', async () => {
      req.body = {
        email: 'john@example.com',
      };

      await loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Please provide email and password',
        })
      );
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      await User.create([
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
        {
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
        },
      ]);

      await getUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          count: 2,
          data: expect.arrayContaining([
            expect.objectContaining({
              name: 'John Doe',
            }),
            expect.objectContaining({
              name: 'Jane Doe',
            }),
          ]),
        })
      );
    });

    it('should return empty array if no users exist', async () => {
      await getUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          count: 0,
          data: [],
        })
      );
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      req.params.id = user._id.toString();

      await getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            name: 'John Doe',
            email: 'john@example.com',
          }),
        })
      );
    });

    it('should return error if user not found', async () => {
      req.params.id = new mongoose.Types.ObjectId().toString();

      await getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'User not found',
        })
      );
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      req.params.id = user._id.toString();
      req.body = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      await updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            name: 'Jane Doe',
            email: 'jane@example.com',
          }),
        })
      );
    });

    it('should return error if user not found', async () => {
      req.params.id = new mongoose.Types.ObjectId().toString();
      req.body = {
        name: 'Jane Doe',
      };

      await updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'User not found',
        })
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      req.params.id = user._id.toString();

      await deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'User deleted successfully',
        })
      );

      // Verify user is deleted
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    it('should return error if user not found', async () => {
      req.params.id = new mongoose.Types.ObjectId().toString();

      await deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'User not found',
        })
      );
    });
  });
});

