const errorHandler = require('../../src/middleware/errorHandler');

/**
 * Unit Tests for Error Handler Middleware
 * Tests error handling and response formatting
 */
describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      originalUrl: '/api/users',
      method: 'GET',
      body: {},
      query: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should handle generic errors', () => {
    const err = new Error('Something went wrong');
    err.statusCode = 500;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Something went wrong',
      })
    );
  });

  it('should handle Mongoose CastError (invalid ObjectId)', () => {
    const err = new Error('Cast to ObjectId failed');
    err.name = 'CastError';

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Resource not found',
      })
    );
  });

  it('should handle Mongoose duplicate key error', () => {
    const err = new Error('Duplicate key error');
    err.code = 11000;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Duplicate field value entered',
      })
    );
  });

  it('should handle Mongoose validation errors', () => {
    const err = new Error('Validation failed');
    err.name = 'ValidationError';
    err.errors = {
      email: { message: 'Email is required' },
      password: { message: 'Password is required' },
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Email is required, Password is required',
      })
    );
  });

  it('should handle JWT errors', () => {
    const err = new Error('Invalid token');
    err.name = 'JsonWebTokenError';

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Invalid token',
      })
    );
  });

  it('should handle expired JWT tokens', () => {
    const err = new Error('Token expired');
    err.name = 'TokenExpiredError';

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Token expired',
      })
    );
  });

  it('should include stack trace in development mode', () => {
    process.env.NODE_ENV = 'development';
    const err = new Error('Test error');
    err.stack = 'Error stack trace';

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: 'Error stack trace',
      })
    );

    delete process.env.NODE_ENV;
  });
});

