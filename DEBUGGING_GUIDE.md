# Debugging Guide

This document provides comprehensive debugging techniques and examples used in this MERN Testing and Debugging assignment.

## Table of Contents

1. [Backend Debugging](#backend-debugging)
2. [Frontend Debugging](#frontend-debugging)
3. [Testing Debugging](#testing-debugging)
4. [Common Debugging Scenarios](#common-debugging-scenarios)

## Backend Debugging

### 1. Console Logging

Console logging is the simplest debugging technique. We use emoji prefixes for easy identification:

```javascript
// Info/Request logging
console.log('🔵 Register attempt:', { name, email });

// Success logging
console.log('✅ User registered successfully:', user._id);

// Error logging
console.error('❌ Error:', {
  message: err.message,
  stack: err.stack,
  url: req.originalUrl,
  method: req.method,
});
```

**Location**: `server/src/controllers/userController.js`, `server/src/middleware/errorHandler.js`

### 2. Request Logging Middleware

A middleware that logs all incoming requests:

```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    params: req.params,
  });
  next();
});
```

**Location**: `server/src/server.js`

### 3. Node.js Inspector

Use Node.js built-in inspector for advanced debugging:

#### Starting Server with Inspector

```bash
# Start server with inspector
node --inspect server/src/server.js

# Or with breakpoint on start
node --inspect-brk server/src/server.js
```

#### Starting Tests with Inspector

```bash
npm run test:debug
```

This runs: `node --inspect-brk node_modules/.bin/jest --runInBand`

#### Connecting Chrome DevTools

1. Open Chrome browser
2. Navigate to `chrome://inspect`
3. Click "Open dedicated DevTools for Node"
4. Set breakpoints in your code
5. Execute the code path that triggers the breakpoint

**Example**: Set a breakpoint in `userController.js` registerUser function, then make a POST request to `/api/users/register`.

### 4. Error Handling Middleware

Global error handler that logs errors with context:

```javascript
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });
  // ... error handling logic
};
```

**Location**: `server/src/middleware/errorHandler.js`

### 5. MongoDB Debugging

Enable Mongoose debug mode to see all database queries:

```javascript
// In server.js or during development
mongoose.set('debug', true);
```

This will log all MongoDB queries to the console.

## Frontend Debugging

### 1. Component Console Logging

Components log their render and interaction events:

```javascript
// In Button.jsx
if (process.env.NODE_ENV === 'development') {
  console.log('🔵 Button rendered:', { variant, size, disabled, loading });
  console.log('🟢 Button clicked:', { variant, type });
}
```

**Location**: `client/src/components/Button.jsx`, `client/src/components/Card.jsx`

### 2. API Request/Response Logging

Axios interceptors log all API calls:

```javascript
// Request interceptor
api.interceptors.request.use((config) => {
  console.log('🔵 API Request:', {
    method: config.method.toUpperCase(),
    url: config.url,
    data: config.data,
  });
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.error || error.message,
    });
    return Promise.reject(error);
  }
);
```

**Location**: `client/src/services/api.js`

### 3. React DevTools

Install React DevTools browser extension:
- Chrome: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- Firefox: [React Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

Features:
- Inspect component tree
- View props and state
- Monitor hooks
- Performance profiling

### 4. Browser DevTools

#### Network Tab
- Monitor API requests
- Check request/response headers and bodies
- Identify slow requests
- Debug CORS issues

#### Console Tab
- View console.log outputs
- Check JavaScript errors
- Execute JavaScript commands

#### Application Tab
- View localStorage/sessionStorage
- Check cookies
- Inspect service workers

### 5. Error Boundaries

Error boundaries catch React component errors:

```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('❌ Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }
  // ... rest of component
}
```

**Location**: `client/src/components/ErrorBoundary.jsx`

In development mode, error boundaries show detailed error information including stack traces.

## Testing Debugging

### 1. Jest Debugging

#### Run Tests with Node Inspector

```bash
npm run test:debug
```

Then connect Chrome DevTools at `chrome://inspect` to debug tests.

#### Verbose Output

```bash
npm test -- --verbose
```

Shows detailed test output including which tests are running.

#### Watch Mode

```bash
npm run test:watch
```

Automatically re-runs tests when files change.

### 2. Test Isolation Issues

If tests are interfering with each other:

```javascript
// Clear database between tests
afterEach(async () => {
  await User.deleteMany({});
});

// Reset mocks
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 3. Cypress Debugging

#### Cypress Test Runner

```bash
npm run cypress:open
```

Interactive test runner with:
- Time-travel debugging
- DOM inspection
- Network request monitoring
- Console output

#### Debugging Commands

```javascript
// Pause test execution
cy.pause();

// Debug current state
cy.debug();

// Log values
cy.log('Current user:', user);
```

#### Screenshots and Videos

Cypress automatically captures:
- Screenshots on test failure
- Videos of test runs

Location: `cypress/screenshots/` and `cypress/videos/`

## Common Debugging Scenarios

### Scenario 1: API Request Failing

**Symptoms**: 404 or 500 errors in network tab

**Debugging Steps**:
1. Check backend console for error logs
2. Verify route exists in `server/src/routes/userRoutes.js`
3. Check request URL in browser Network tab
4. Verify request body format
5. Check CORS configuration

**Example Debug Output**:
```
🔵 API Request: { method: 'POST', url: '/users/register', data: {...} }
❌ API Error: { status: 400, url: '/users/register', message: 'Validation failed' }
```

### Scenario 2: Component Not Rendering

**Symptoms**: Component doesn't appear on screen

**Debugging Steps**:
1. Check React DevTools component tree
2. Look for console errors
3. Verify props are being passed correctly
4. Check conditional rendering logic
5. Inspect DOM in browser DevTools

**Example Debug Output**:
```
🔵 Button rendered: { variant: 'primary', size: 'medium', disabled: false, loading: false }
```

### Scenario 3: Database Operation Failing

**Symptoms**: Data not saving or retrieving

**Debugging Steps**:
1. Enable Mongoose debug mode
2. Check MongoDB connection status
3. Verify model schema matches data
4. Check validation errors
5. Inspect database directly (MongoDB Compass)

**Example Debug Output**:
```
✅ Test database connected
Mongoose: users.insertOne({ name: 'John', email: 'john@example.com', ... })
```

### Scenario 4: Test Failing Intermittently

**Symptoms**: Tests pass sometimes, fail other times

**Debugging Steps**:
1. Check for race conditions
2. Verify test isolation (cleanup between tests)
3. Add delays for async operations
4. Check for shared state
5. Run tests in isolation: `jest --testNamePattern="specific test"`

### Scenario 5: Authentication Issues

**Symptoms**: 401 Unauthorized errors

**Debugging Steps**:
1. Check token in localStorage
2. Verify token format in request headers
3. Check token expiration
4. Verify JWT_SECRET matches
5. Check auth middleware logic

## Debugging Best Practices

1. **Use Descriptive Log Messages**: Include context (user ID, request path, etc.)
2. **Log at Appropriate Levels**: Use console.log for info, console.error for errors
3. **Remove Debug Code in Production**: Use environment checks (`process.env.NODE_ENV === 'development'`)
4. **Use Breakpoints Strategically**: Set breakpoints at entry points and error handlers
5. **Document Debugging Steps**: Keep notes on common issues and solutions
6. **Use Source Maps**: Ensure source maps are enabled for easier debugging
7. **Monitor Performance**: Use performance profiling tools
8. **Error Tracking**: Consider integrating error tracking services (Sentry, LogRocket)

## Tools and Resources

- **Chrome DevTools**: https://developer.chrome.com/docs/devtools/
- **React DevTools**: https://react.dev/learn/react-developer-tools
- **Node.js Inspector**: https://nodejs.org/en/docs/guides/debugging-getting-started/
- **Jest Debugging**: https://jestjs.io/docs/troubleshooting
- **Cypress Debugging**: https://docs.cypress.io/guides/guides/debugging

## Summary

This project demonstrates multiple debugging techniques:

✅ **Console Logging**: Simple, effective for development
✅ **Node.js Inspector**: Advanced debugging with breakpoints
✅ **Error Handling**: Comprehensive error logging and handling
✅ **React DevTools**: Component inspection and debugging
✅ **Browser DevTools**: Network, console, and application debugging
✅ **Test Debugging**: Jest and Cypress debugging tools

All debugging code is production-ready with environment checks to disable in production builds.

