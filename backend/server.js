const express = require("express");
const http = require("http");
const cors = require("cors");
const routes = require("./routes/api");
const pool = require("./db");
const { setupWebSocketServer } = require("./websocket");

const app = express();
const port = 4001;

app.use(cors());
app.use(express.json());
app.use("/api", routes); // Use routes with /api prefix

const server = http.createServer(app);
const wss = setupWebSocketServer(server); // Initialize WebSocket server

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
