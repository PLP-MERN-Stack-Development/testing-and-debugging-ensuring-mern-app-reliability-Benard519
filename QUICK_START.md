# Quick Start Guide

## 🚀 Installation & Setup (5 minutes)

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 3. Create Environment Files

**server/.env**:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-testing
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

**client/.env** (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Running Tests

### Backend Tests
```bash
cd server
npm test              # All tests with coverage
npm run test:unit     # Unit tests only
npm run test:integration  # Integration tests only
```

### Frontend Tests
```bash
cd client
npm test              # All tests with coverage
npm run test:unit     # Unit tests only
npm run test:integration  # Integration tests only
```

### E2E Tests (Cypress)
```bash
cd client

# First, start both servers:
# Terminal 1: cd server && npm start
# Terminal 2: cd client && npm start

# Then run Cypress:
npm run cypress:open  # Interactive mode
# OR
npm run cypress:run   # Headless mode
```

## 🏃 Running the Application

### Start Backend
```bash
cd server
npm start        # Production mode
# OR
npm run dev      # Development mode with nodemon
```

### Start Frontend
```bash
cd client
npm start        # Opens http://localhost:3000
```

## 📊 Test Coverage

After running tests, view coverage reports:
- **Backend**: Open `server/coverage/index.html` in browser
- **Frontend**: Open `client/coverage/index.html` in browser

## 🐛 Debugging

### Backend Debugging
```bash
cd server
node --inspect src/server.js
# Then open chrome://inspect in Chrome
```

### Test Debugging
```bash
cd server
npm run test:debug
# Then open chrome://inspect in Chrome
```

## ✅ Verification Checklist

- [ ] All dependencies installed (`npm install` in both directories)
- [ ] Environment files created (`.env` files)
- [ ] Backend tests passing (`cd server && npm test`)
- [ ] Frontend tests passing (`cd client && npm test`)
- [ ] Coverage above 70% (check coverage reports)
- [ ] E2E tests passing (run Cypress)
- [ ] Application runs successfully (both servers start)

## 📚 Documentation

- **README.md**: Complete project documentation
- **DEBUGGING_GUIDE.md**: Comprehensive debugging techniques
- **This file**: Quick start reference

## 🎯 Key Features Demonstrated

✅ Unit Tests (Models, Controllers, Components)
✅ Integration Tests (API Endpoints, Component + API)
✅ E2E Tests (Cypress - Registration, Login, CRUD)
✅ Error Handling (Global error handler, Error boundaries)
✅ Debugging (Console logs, Node.js inspector)
✅ Test Coverage (70%+ threshold)
✅ MongoDB Memory Server (for testing)
✅ Jest Configuration (separate unit/integration tests)

## 🆘 Troubleshooting

**Issue**: MongoDB connection error
- **Solution**: Tests use MongoDB Memory Server automatically. For server, ensure MongoDB is running or update MONGODB_URI.

**Issue**: Port already in use
- **Solution**: Change PORT in `.env` or kill the process using the port.

**Issue**: Tests failing
- **Solution**: Make sure all dependencies are installed and environment is set up correctly.

**Issue**: Cypress tests failing
- **Solution**: Ensure both backend and frontend servers are running before executing Cypress tests.

---


