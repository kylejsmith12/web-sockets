const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const routes = require("./routes/api");
const pool = require("./db");

const app = express();
const port = 4001;

app.use(cors());
app.use(express.json());
app.use("/api", routes); // Use routes with /api prefix

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    // Handle incoming messages from clients
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    // Handle WebSocket errors
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on("error", (error) => {
  console.error("Server error:", error);
  // Handle server startup errors
});

server.on("listening", () => {
  console.log("Server listening on port", server.address().port);
});
