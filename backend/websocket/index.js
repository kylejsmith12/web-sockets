// websocket/index.js
const WebSocket = require("ws");

const setupWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("New client connected");
  });

  return wss;
};

module.exports = setupWebSocketServer;
