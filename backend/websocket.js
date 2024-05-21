const WebSocket = require("ws");

let wss;

function setupWebSocketServer(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("New client connected");
    ws.on("close", () => console.log("Client disconnected"));
  });
}

function notifyClients(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = { setupWebSocketServer, notifyClients };
