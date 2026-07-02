/*
  Boots the Express app, configures essential middleware, verifies database connectivity, 
  exposes a health check route, and starts listening for incoming requests.
*/

const express = require('express'); // Needed to create an HTTP server and define API routes
const cors = require('cors'); // Allows frontend to call backend
require('dotenv').config(); // Loads .env from Node directory (backend)
const pool = require('./db'); // Import the MySQL connection pool from db.js

// Creates & configures an Express application instance
const app = express();
app.use(cors());
app.use(express.json());

// Allows server to handle requests to the /api/properties route
const propertiesRoute = require('./routes/properties');
app.use('/api/properties', propertiesRoute);

// Defines an HTTP GET route in Express as /api/health
app.get('/api/health', async (req, res) => {
  try {
    // Returns promise of [rows, fields], destructured to rows
    const [rows] = await pool.query('SELECT 1 AS result');
    res.json({
      status: 'ok',
      database: rows[0].result === 1 ? 'connected' : 'unknown'
    });
  } catch (err) { // Runs if await pool.query() fails
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

/*
    Starts the Express server and listens for incoming requests on the specified port.
    The health check link is printed to the console for easy access.
*/
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

