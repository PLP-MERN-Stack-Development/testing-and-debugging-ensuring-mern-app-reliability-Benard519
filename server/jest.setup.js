// Jest setup file for backend tests
// This file runs before each test suite

// Setup MongoDB Memory Server for testing
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Create an in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect mongoose to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  console.log('✅ Test database connected');
});

// Cleanup after all tests
afterAll(async () => {
  // Close mongoose connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  
  // Stop MongoDB Memory Server
  await mongoServer.stop();
  
  console.log('✅ Test database disconnected');
});

// Clear database between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Global test timeout
jest.setTimeout(30000);

