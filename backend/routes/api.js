// routes/api.js
const express = require("express");
const pool = require("../db");
const compareUtils = require("../utils/compareUtils");
const WebSocket = require("ws");

const router = express.Router();
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("New client connected");
});

const notifyClients = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

router.post("/compare", async (req, res) => {
  const { id, paragraph1, paragraph2 } = req.body;
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
    res.status(500).json({ error: "Internal Server Error" });
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

module.exports = router;
