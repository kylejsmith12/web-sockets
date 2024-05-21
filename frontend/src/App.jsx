import React, { useState, useEffect } from "react";
import { Box, TextField, Button, AppBar, Toolbar } from "@mui/material";
import Notification from "./Notification";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [paragraph1, setParagraph1] = useState("");
  const [paragraph2, setParagraph2] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4001");
    setSocket(ws);

    return () => {
      // Commenting out the code to close the connection after 1 second
      // setTimeout(() => {
      //   ws.close();
      // }, 1000);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewComparison = (event) => {
      const data = JSON.parse(event.data);
      showToast(data.diff); // Show toast when a new comparison is received
    };

    socket.addEventListener("message", handleNewComparison);

    socket.addEventListener("open", function (event) {
      console.log("Connected to WebSocket server");
    });

    socket.addEventListener("message", function (event) {
      console.log("Message from server ", event.data);
    });

    socket.addEventListener("close", function (event) {
      console.log("Disconnected from WebSocket server");
    });

    socket.addEventListener("error", function (error) {
      console.error("WebSocket error observed:", error);
    });

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("message from server: ", data);
    };
    return () => {
      socket.removeEventListener("message", handleNewComparison);
    };
  }, [socket]);

  const handleCompare = async () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        paragraph1,
        paragraph2,
      });
      socket.send(message);
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  };

  const showToast = (diff) => {
    // Show toast notification
    // You can customize the toast message and options as needed
    console.log("Comparison Diff:", diff);
  };

  return (
    <>
      <Box style={{ marginBottom: "50px" }}>
        <AppBar>
          <Toolbar>
            <Notification />
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ p: 2 }}>
        <TextField
          label="Paragraph 1"
          multiline
          rows={4}
          value={paragraph1}
          onChange={(e) => setParagraph1(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Paragraph 2"
          multiline
          rows={4}
          value={paragraph2}
          onChange={(e) => setParagraph2(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={handleCompare}>
          Compare
        </Button>
      </Box>
    </>
  );
}

export default App;
