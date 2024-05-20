const WebSocket = require("ws");

const setupWebSocketServer = (app) => {
  const server = app.listen(4001, () => {
    console.log(`WebSocket server running on port 4001`);
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

  return notifyClients;
};

module.exports = setupWebSocketServer;
