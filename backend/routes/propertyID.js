/*
  Allows server to handle requests to the /api/properties/:id route.
  Returns a single property's information or its open house information based on the listing ID.
*/

const express = require('express'); // Imports Express
const router = express.Router(); // A router is needed so server.js can use this file as a route
const pool = require('../db'); // Imports the MySQL connection pool from db.js

function validateId(id) {
    // Exists, is a string, is alphanumeric, and is no longer than 20 characters.
    return id && typeof id === 'string' && /^[A-Za-z0-9]+$/.test(id) && id.length <= 20;
}

/*
    GET request to /api/properties/:id/openhouses.
    Must come before the request to a property by id, or "openhouses" will be treated as the id.
*/
router.get('/:id/openhouses', async (req, res) => {
    const id = req.params.id;
    if (!validateId(id)) { return res.status(400).json({ error: "Invalid listing ID." }); }
    try {
        // Ensures the property exists before finding an openhouse for it. Returns an empty array otherwise.
        const [propertyRows] = await pool.query("SELECT 1 FROM rets_property WHERE L_ListingID = ? LIMIT 1", [id]);
        if (propertyRows.length === 0) { return res.json([]); }
        /*
            Returns all open houses for a property based on the listing ID, sorted by date and start time.
            Destructures only the rows (actual data) from the query. Await is used to wait for MySQl,
            parametrization prevents SQL injection attacks, res.json() sends data to the client in JSON format.
        */
        const sql = `
            SELECT *
            FROM rets_openhouse
            WHERE L_ListingID = ?
            ORDER BY OH_StartDate ASC, OH_StartTime ASC
        `;
        const [rows] = await pool.query(sql, [id]);
        return res.json(rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/*
    GET request to /api/properties/:id.
    Draws from rets_property to return a property data based on ID.
*/
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!validateId(id)) { return res.status(400).json({ error: "Invalid listing ID." }); }
    try {
        // Searches for all properties with this id; returns the first match or 404.
        const sql = `
            SELECT *
            FROM rets_property
            WHERE L_ListingID = ?
            LIMIT 1
        `;
        const [rows] = await pool.query(sql, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Property not found." });
        }
        return res.json(rows[0]);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;