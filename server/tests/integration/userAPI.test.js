const request = require('supertest');
const app = require('../../src/server');
const User = require('../../src/models/User');

/**
 * Integration Tests for User API Endpoints
 * Tests complete request/response cycle using Supertest
 */
describe('User API Integration Tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('name', 'John Doe');
      expect(response.body.data.user).toHaveProperty('email', 'john@example.com');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return 400 if user already exists', async () => {
      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if required fields are missing', async () => {
      const userData = {
        email: 'john@example.com',
        // Missing name and password
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
    });

    it('should login user with valid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email', 'john@example.com');
    });

    it('should return 401 with invalid email', async () => {
      const loginData = {
        email: 'wrong@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 401 with invalid password', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 400 if email or password is missing', async () => {
      const loginData = {
        email: 'john@example.com',
        // Missing password
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/users', () => {
    it('should get all users', async () => {
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

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('count', 2);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).not.toHaveProperty('password');
    });

    it('should return empty array if no users exist', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('count', 0);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by id', async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('name', 'John Doe');
      expect(response.body.data).toHaveProperty('email', 'john@example.com');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 404 if user not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user', async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const updateData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('name', 'Jane Doe');
      expect(response.body.data).toHaveProperty('email', 'jane@example.com');
    });

    it('should return 404 if user not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .put(`/api/users/${fakeId}`)
        .send({ name: 'Jane Doe' })
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user', async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'User deleted successfully');

      // Verify user is deleted
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 if user not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/users/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON in request body', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });

    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);
    });
  });
});

