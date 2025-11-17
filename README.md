# MERN Testing and Debugging Assignment - Week 6

A complete MERN stack application demonstrating comprehensive testing strategies and debugging techniques.

## 📋 Project Overview

This project implements a full-stack MERN application with:
- **Backend**: Express.js + MongoDB with comprehensive test coverage
- **Frontend**: React with component testing and E2E tests
- **Testing**: Unit tests, integration tests, and end-to-end tests
- **Debugging**: Console logging, error handling, and Node.js inspector setup

## 🏗️ Project Structure

```
.
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   │   └── User.js
│   │   ├── controllers/   # Route controllers
│   │   │   └── userController.js
│   │   ├── routes/        # API routes
│   │   │   └── userRoutes.js
│   │   ├── middleware/    # Express middleware
│   │   │   ├── errorHandler.js
│   │   │   └── asyncHandler.js
│   │   └── server.js      # Express server entry point
│   ├── tests/
│   │   ├── unit/          # Unit tests
│   │   │   ├── userModel.test.js
│   │   │   ├── userController.test.js
│   │   │   └── errorHandler.test.js
│   │   └── integration/   # Integration tests
│   │       └── userAPI.test.js
│   ├── jest.config.js     # Jest configuration
│   ├── jest.setup.js      # Jest setup file
│   └── package.json
│
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── services/      # API service layer
│   │   │   └── api.js
│   │   ├── tests/
│   │   │   ├── unit/      # Unit tests
│   │   │   │   ├── Button.test.jsx
│   │   │   │   ├── Card.test.jsx
│   │   │   │   └── ErrorBoundary.test.jsx
│   │   │   └── integration/  # Integration tests
│   │   │       ├── ButtonAPI.test.jsx
│   │   │       └── App.test.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   ├── cypress/
│   │   ├── e2e/           # End-to-end tests
│   │   │   └── userFlows.spec.js
│   │   ├── support/       # Cypress support files
│   │   │   ├── commands.js
│   │   │   └── e2e.js
│   │   └── fixtures/
│   ├── jest.config.js     # Jest configuration
│   ├── jest.setup.js      # Jest setup file
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (or use MongoDB Memory Server for tests)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd week-6-assignment
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern-testing
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

   Create `client/.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

## 🧪 Running Tests

### Backend Tests

```bash
cd server

# Run all tests with coverage
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Run tests with Node.js inspector (for debugging)
npm run test:debug
```

### Frontend Tests

```bash
cd client

# Run all tests with coverage
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in watch mode
npm run test:watch
```

### End-to-End Tests (Cypress)

```bash
cd client

# Open Cypress Test Runner (interactive)
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run
```

**Note**: Make sure both backend and frontend servers are running before running E2E tests:
- Backend: `cd server && npm start` (or `npm run dev`)
- Frontend: `cd client && npm start`

## 🐛 Debugging Techniques

### Backend Debugging

1. **Console Logging**
   - Check `server/src/controllers/userController.js` for `console.log` examples
   - Logs are prefixed with emojis for easy identification:
     - 🔵 = Info/Request
     - ✅ = Success
     - ❌ = Error

2. **Node.js Inspector**
   ```bash
   # Start server with inspector
   node --inspect server/src/server.js

   # Or for tests
   npm run test:debug
   ```
   Then open Chrome DevTools and go to `chrome://inspect`

3. **Error Handling**
   - Global error handler in `server/src/middleware/errorHandler.js`
   - Logs errors with stack traces in development mode
   - Returns appropriate HTTP status codes

### Frontend Debugging

1. **Console Logging**
   - Check component files for `console.log` examples
   - Logs component renders, clicks, and API calls
   - Only active in development mode

2. **React DevTools**
   - Install React DevTools browser extension
   - Inspect component props, state, and hooks

3. **Error Boundaries**
   - `ErrorBoundary` component catches React errors
   - Displays fallback UI instead of crashing
   - Shows error details in development mode

4. **Browser DevTools**
   - Network tab for API requests/responses
   - Console for JavaScript errors
   - Application tab for localStorage

## 📊 Test Coverage

### Coverage Goals

- **Unit Tests**: 70%+ coverage
- **Integration Tests**: All API endpoints covered
- **E2E Tests**: Critical user flows covered

### Viewing Coverage Reports

After running tests, coverage reports are generated in:
- Backend: `server/coverage/`
- Frontend: `client/coverage/`

Open `index.html` in a browser to view detailed coverage reports.

## 📝 Testing Strategy

### Unit Tests

**Backend:**
- Model validation and methods
- Controller functions in isolation
- Middleware error handling

**Frontend:**
- Component rendering
- Props handling
- User interactions (clicks, form inputs)

### Integration Tests

**Backend:**
- Complete API request/response cycles
- Database operations
- Error scenarios

**Frontend:**
- Component interactions with API
- Form submissions
- Error handling

### End-to-End Tests

- User registration flow
- User login flow
- CRUD operations
- Error handling
- Component interactions

## 🔧 Technologies Used

### Backend
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **Jest**: Testing framework
- **Supertest**: HTTP assertions
- **MongoDB Memory Server**: In-memory MongoDB for tests

### Frontend
- **React**: UI library
- **React Testing Library**: Component testing
- **Jest**: Testing framework
- **Cypress**: E2E testing
- **Axios**: HTTP client

## 📚 Key Features

### Backend Features
- ✅ User model with validation
- ✅ User registration and login
- ✅ CRUD operations for users
- ✅ Password hashing with bcrypt
- ✅ JWT token generation
- ✅ Global error handling
- ✅ Request logging middleware
- ✅ MongoDB Memory Server for testing

### Frontend Features
- ✅ Reusable Button component
- ✅ Reusable Card component
- ✅ Error Boundary for error handling
- ✅ API service layer
- ✅ User registration form
- ✅ Users list display
- ✅ Loading and error states

## 🎯 Test Scenarios Covered

### Backend Tests
- ✅ User model validation
- ✅ Password hashing
- ✅ User registration
- ✅ User login
- ✅ Get all users
- ✅ Get user by ID
- ✅ Update user
- ✅ Delete user
- ✅ Error handling

### Frontend Tests
- ✅ Button component variants and sizes
- ✅ Button disabled and loading states
- ✅ Card component rendering
- ✅ Error Boundary error catching
- ✅ Form submission
- ✅ API integration
- ✅ Error display

### E2E Tests
- ✅ User registration
- ✅ User login
- ✅ Create user (CRUD)
- ✅ Read users (CRUD)
- ✅ Update user (CRUD)
- ✅ Delete user (CRUD)
- ✅ Error handling
- ✅ Form validation

## 🚨 Common Issues and Solutions

### Issue: MongoDB Connection Error
**Solution**: Make sure MongoDB is running, or tests will use MongoDB Memory Server automatically.

### Issue: Port Already in Use
**Solution**: Change the PORT in `.env` file or kill the process using the port.

### Issue: Cypress Tests Failing
**Solution**: Ensure both backend and frontend servers are running before executing Cypress tests.

### Issue: Test Coverage Below 70%
**Solution**: Review coverage report and add tests for uncovered code paths.

## 📖 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Cypress Documentation](https://docs.cypress.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

## 📄 License

This project is created for educational purposes as part of the MERN Stack Development course.


