/*
    Creates a MySQL connection pool module.
*/

const mysql = require('mysql2/promise'); // Returns promise; a value we don't have yet but will
require('dotenv').config(); // Loads .env from Node directory (backend)

/*
  A connection pool maintains a set of database connections that can be reused.
  Instead of verifying each new connection, a set is used so that the SQL database can be
  easily accessed.
*/
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// In Node.js, every file is a module. When this file is required in another file, the pool object will be returned
module.exports = pool;
