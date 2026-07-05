/*
  Allows server to handle requests to the /api/properties route.
*/

const express = require('express'); // Imports Express
const router = express.Router(); // A router is needed so server.js can use this file as a route
const pool = require('../db'); // Imports the MySQL connection pool from db.js

router.get('/', async (req, res) => {
  try {
    // Fields the query can accept, separated by type for validation
    const stringKeys = ["city", "zipcode"];
    const numericKeys = ["minPrice", "maxPrice", "beds", "baths"];

    // If fields exist, ensure they are the correct type 
    for (const key of stringKeys) {
        const field = req.query[key];
        if (field !== undefined && typeof field !== "string") return res.status(400).json({ error: `${key} must be a string.` });
    }
    for (const key of numericKeys) {
        const field = req.query[key];
        if (field !== undefined && isNaN(field)) return res.status(400).json({ error: `${key} must be a number.` });
    }

    /*
        Two queries are needed: one to get the results, and one to get the total count of results.
        The total count is needed for pagination, so the frontend knows how many pages of results exist.
        The standard sql query can be sorted/filtered and includes pagination.
        The sql count query purely sorts based on the filters to get the total count of matches.
        Params are not directly inserted into the SQL query to prevent SQL injection attacks.
        Instead, they are passed as an array to the pool.query() method, which safely escapes them.
    */

    let sql = "SELECT * FROM rets_property WHERE 1=1";
    let params = [];
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    let sqlCount = "SELECT COUNT(*) AS total FROM rets_property WHERE 1=1";
    let paramsCount = [];

    // Add query filters (if they exist) to the SQL query and the params array

    function addFilter(column, operator, key) {
        const field = req.query[key];
        if (field !== undefined) {
            sql += ` AND ${column} ${operator} ?`;
            sqlCount += ` AND ${column} ${operator} ?`;
            params.push(field);
            paramsCount.push(field);
        }
    }

    // Normalize city to lowercase and trim whitespace
    if (req.query.city !== undefined) {
    req.query.city = req.query.city.toLowerCase().trim();
    }
    addFilter("LOWER(TRIM(L_City))", "=", "city");

    addFilter("L_Zip", "=", "zipcode");
    addFilter("L_SystemPrice", ">=", "minPrice");
    addFilter("L_SystemPrice", "<=", "maxPrice");
    addFilter("L_Keyword2", ">=", "beds");
    addFilter("LM_Dec_3", ">=", "baths");

    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Execute the queries and return the results and total count

    const [rows] = await pool.query(sql, params);
    const [countRows] = await pool.query(sqlCount, paramsCount);
    const total = countRows[0].total;

    // Return correct response shape
    return res.json({
        total,
        limit,
        offset,
        results: rows
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
