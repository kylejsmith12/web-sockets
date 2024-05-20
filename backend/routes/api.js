const express = require("express");
const compareUtils = require("../utils/utils"); // Changed path

const routes = (pool, notifyClients) => {
  // Accept notifyClients as a parameter
  const router = express.Router();

  router.post("/compare", async (req, res) => {
    const { paragraph1, paragraph2 } = req.body;
    const diffOutput = compareUtils.compareAndNotify(paragraph1, paragraph2); // Use compareUtils

    const query = `
      INSERT INTO comparisons (paragraph1, paragraph2, diff, created_at)
      VALUES ($1, $2, $3, NOW()) RETURNING *;
    `;
    const values = [paragraph1, paragraph2, diffOutput];

    try {
      const result = await pool.query(query, values);
      notifyClients(result.rows[0]);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/notifications", async (req, res) => {
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

  return router;
};

module.exports = routes;
