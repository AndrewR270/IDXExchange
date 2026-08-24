/*
  Allows server to handle requests to the /api/properties route.
*/

const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    // Query-string values arrive as strings (or arrays), so validate the
    // expected types before they are normalized or passed to MySQL.
    const stringKeys = ["city", "zipcode"];
    const numericKeys = ["minPrice", "maxPrice", "beds", "baths"];

    for (const key of stringKeys) {
      const field = req.query[key];
      if (field !== undefined && typeof field !== "string") {
        return res.status(400).json({ error: `${key} must be a string.` });
      }
    }

    for (const key of numericKeys) {
      const field = req.query[key];
      if (field !== undefined && isNaN(field)) {
        return res.status(400).json({ error: `${key} must be a number.` });
      }
    }

    let sql = "SELECT * FROM rets_property WHERE 1=1";
    let params = [];

    let sqlCount = "SELECT COUNT(*) AS total FROM rets_property WHERE 1=1";
    let paramsCount = [];

    // Pagination is expressed as SQL OFFSET/LIMIT. Number() also gives the
    // API stable numeric values in its response, with 20/0 as defaults.
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    function addFilter(column, operator, key) {
      const field = req.query[key];
      if (field !== undefined) {
        // Column names are internal constants, while values use placeholders;
        // this keeps user input out of the SQL text and prevents injection.
        sql += ` AND ${column} ${operator} ?`;
        sqlCount += ` AND ${column} ${operator} ?`;
        params.push(field);
        paramsCount.push(field);
      }
    }

    if (req.query.city !== undefined) {
      // Match cities case-insensitively and ignore accidental surrounding
      // whitespace, consistent with the SQL expression used below.
      req.query.city = req.query.city.toLowerCase().trim();
    }

    addFilter("LOWER(TRIM(L_City))", "=", "city");
    addFilter("L_Zip", "=", "zipcode");
    addFilter("L_SystemPrice", ">=", "minPrice");
    addFilter("L_SystemPrice", "<=", "maxPrice");
    addFilter("L_Keyword2", ">=", "beds");
    addFilter("LM_Dec_3", ">=", "baths");

    /*
      Sorting Support
    */

    const whitelist = {
      L_SystemPrice: true,
      ListingContractDate: true,
      LM_Int2_3: true,
      L_Keyword2: true,
    };

    function parseSortArray(prefix) {
      // Express represents sortBy[0], sortBy[1], etc. as separate keys. Sort
      // numerically by the bracket index so multi-column priority is retained.
      const entries = Object.entries(req.query)
      .filter(([key]) => key.startsWith(prefix + "["))
      .sort(([a], [b]) => {
        const ai = Number(a.match(/\[(\d+)\]/)[1]);
        const bi = Number(b.match(/\[(\d+)\]/)[1]);
        return ai - bi;
      })
      .map(([_, value]) => value);
      return entries;
    }

    const sortBy = parseSortArray("sortBy");
    const sortOrder = parseSortArray("sortOrder");

    let orderClause = "";

    if (sortBy.length > 0 && sortOrder.length > 0) {
      const parts = [];

      for (let i = 0; i < sortBy.length; i++) {
        const field = sortBy[i];
        const order = sortOrder[i] === "desc" ? "DESC" : "ASC";

        if (!whitelist[field]) {
          return res.status(400).json({ error: `Invalid sort field: ${field}` });
        }

        // Only whitelisted column names and fixed ASC/DESC values are allowed
        // into ORDER BY because SQL parameters cannot represent identifiers.
        parts.push(`${field} ${order}`);
      }

      orderClause = " ORDER BY " + parts.join(", ");
    }

    sql += orderClause;

    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    // Run the count without LIMIT/OFFSET so clients can calculate total pages.
    const [countRows] = await pool.query(sqlCount, paramsCount);
    const total = countRows[0].total;

    return res.json({
      total,
      limit,
      offset,
      results: rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
