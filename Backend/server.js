// FILE: backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const { errorResponse } = require('./src/utils/response');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Basic route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'StockMaster API is running' });
});

const routes = require('./src/routes');
app.use('/', routes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';
  const errorCode = err.code || 'SERVER_ERROR';

  errorResponse(res, statusCode, errorCode, message);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});