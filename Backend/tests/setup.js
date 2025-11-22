// FILE: backend/tests/setup.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Use a separate test database to avoid clearing production/dev data
const TEST_DB_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/stockmaster_test';

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_DB_URI);
  }
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};

const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

module.exports = { connectDB, clearDatabase, closeDatabase };