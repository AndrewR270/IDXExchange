const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Routers
const propertyRouter = require('./routes/properties');
const propertyIDRouter = require('./routes/propertyID');

app.use('/api/properties', propertyRouter);
app.use('/api/properties', propertyIDRouter);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS result');
    res.json({
      status: 'ok',
      database: rows[0].result === 1 ? 'connected' : 'unknown'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

module.exports = app;
