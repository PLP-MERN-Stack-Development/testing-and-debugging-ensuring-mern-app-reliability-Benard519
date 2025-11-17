const User = require('../../src/models/User');
const mongoose = require('mongoose');

/**
 * Unit Tests for User Model
 * Tests model validation, methods, and middleware
 */
describe('User Model', () => {
  // Test data
  const validUserData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  describe('User Creation', () => {
    it('should create a new user with valid data', async () => {
      const user = await User.create(validUserData);

      expect(user).toBeDefined();
      expect(user.name).toBe(validUserData.name);
      expect(user.email).toBe(validUserData.email.toLowerCase());
      expect(user.password).not.toBe(validUserData.password); // Should be hashed
      expect(user.role).toBe('user'); // Default role
      expect(user.createdAt).toBeDefined();
    });

    it('should hash password before saving', async () => {
      const user = await User.create(validUserData);

      expect(user.password).not.toBe(validUserData.password);
      expect(user.password.length).toBeGreaterThan(20); // Bcrypt hash is long
    });

    it('should not hash password if not modified', async () => {
      const user = await User.create(validUserData);
      const originalPassword = user.password;

      // Update non-password field
      user.name = 'Jane Doe';
      await user.save();

      expect(user.password).toBe(originalPassword);
    });
  });

  describe('User Validation', () => {
    it('should require name field', async () => {
      const userData = { ...validUserData };
      delete userData.name;

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should require email field', async () => {
      const userData = { ...validUserData };
      delete userData.email;

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should require password field', async () => {
      const userData = { ...validUserData };
      delete userData.password;

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const userData = { ...validUserData, email: 'invalid-email' };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should enforce minimum name length', async () => {
      const userData = { ...validUserData, name: 'A' };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should enforce minimum password length', async () => {
      const userData = { ...validUserData, password: '12345' };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should enforce maximum name length', async () => {
      const userData = {
        ...validUserData,
        name: 'A'.repeat(51),
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      await User.create(validUserData);

      await expect(User.create(validUserData)).rejects.toThrow();
    });

    it('should convert email to lowercase', async () => {
      const userData = { ...validUserData, email: 'JOHN@EXAMPLE.COM' };
      const user = await User.create(userData);

      expect(user.email).toBe('john@example.com');
    });
  });

  describe('User Methods', () => {
    it('should compare password correctly', async () => {
      const user = await User.create(validUserData);

      const isMatch = await user.comparePassword(validUserData.password);
      expect(isMatch).toBe(true);

      const isNotMatch = await user.comparePassword('wrongpassword');
      expect(isNotMatch).toBe(false);
    });

    it('should exclude password from toJSON', async () => {
      const user = await User.create(validUserData);
      const userJSON = user.toJSON();

      expect(userJSON.password).toBeUndefined();
      expect(userJSON.name).toBe(validUserData.name);
      expect(userJSON.email).toBe(validUserData.email.toLowerCase());
    });
  });

  describe('User Defaults', () => {
    it('should set default role to user', async () => {
      const user = await User.create(validUserData);

      expect(user.role).toBe('user');
    });

    it('should set createdAt timestamp', async () => {
      const beforeCreation = new Date();
      const user = await User.create(validUserData);
      const afterCreation = new Date();

      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });
  });
});

