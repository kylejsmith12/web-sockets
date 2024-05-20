const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const WebSocket = require("ws");
const routes = require("./routes/api"); // Changed path

const app = express();
const port = 4001;

const pool = require("./utils/db");

app.use(cors());
app.use(bodyParser.json());
app.use(routes(pool)); // Pass pool as a parameter to routes

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const wss = new WebSocket.Server({ server });

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

module.exports = { notifyClients };
