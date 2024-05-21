const WebSocket = require("ws");

const setupWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (message) => {
      console.log(`Received message: ${message}`);
      // Handle incoming messages from clients
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send("something");
        }
      });
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      // Handle WebSocket errors
    });
  });

  console.log("WebSocket server initialized");
  return wss;
};

module.exports = { setupWebSocketServer };
