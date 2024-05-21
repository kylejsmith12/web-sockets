const express = require("express");
const pool = require("../db");
const { v4: uuidv4 } = require("uuid");
const compareUtils = require("../utils/compareUtils");
const { notifyClients } = require("../websocket");

const router = express.Router();

router.post("/compare", async (req, res) => {
  const { paragraph1, paragraph2 } = req.body;
  const id = uuidv4();

  // Compare paragraphs using compareUtils
  const diff = compareUtils.compareAndNotify(paragraph1, paragraph2);

  const query = `
    INSERT INTO comparisons (id, paragraph1, paragraph2, diff, created_at)
    VALUES ($1, $2, $3, $4, NOW()) RETURNING *;
  `;
  const values = [id, paragraph1, paragraph2, diff];

  try {
    const result = await pool.query(query, values);
    notifyClients(result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error processing comparison:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

router.get("/notifications", async (req, res) => {
  // Fetch recent comparisons from the database and return them
  const query = `
    SELECT * FROM comparisons
    WHERE created_at >= NOW() - INTERVAL '1 day'
    ORDER BY created_at DESC;
  `;
  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
