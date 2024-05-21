// In routes/api.js

const express = require("express");
const pool = require("../db");
const WebSocket = require("ws");
const { setupWebSocketServer } = require("../websocket");
const compareUtils = require("../utils/compareUtils");

const router = express.Router();
let wss; // Declare wss variable here

router.use((req, res, next) => {
  // Ensure WebSocket server is initialized before setting up routes
  if (!wss) {
    const server = req.app.get("server");
    wss = setupWebSocketServer(server);
  }
  next();
});

router.post("/compare", async (req, res) => {
  const { id, paragraph1, paragraph2 } = req.body;

  // Compare paragraphs using compareUtils
  const diff = compareUtils.compareAndNotify(paragraph1, paragraph2);

  // Insert comparison into database
  const query = `
    INSERT INTO comparisons (id, paragraph1, paragraph2, diff, created_at)
    VALUES ($1, $2, $3, $4, NOW()) RETURNING *;
  `;
  const values = [id, paragraph1, paragraph2, diff];

  try {
    const result = await pool.query(query, values);

    // Notify clients about the comparison
    notifyClients(result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error processing comparison:", err);
    res.status(500).json({ error: "Internal Server Error" });
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

// Function to notify clients
const notifyClients = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

module.exports = router;
