const express = require("express");
const WebSocket = require("ws");
const app = require("./server"); // Import the app from server.js

const wss = new WebSocket.Server({ server: app.server }); // Use app.server

wss.on("connection", (ws) => {
  console.log("New client connected");
});

const notifyClients = app.notifyClients; // Export notifyClients

module.exports = { notifyClients };
