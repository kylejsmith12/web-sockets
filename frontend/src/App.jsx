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
      setTimeout(() => {
        ws.close();
      }, 1000); // Delay closing the connection by 1 second
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewComparison = (event) => {
      const data = JSON.parse(event.data);
      showToast(data.diff); // Show toast when a new comparison is received
    };

    socket.addEventListener("message", handleNewComparison);

    return () => {
      socket.removeEventListener("message", handleNewComparison);
    };
  }, [socket]);

  const handleCompare = async () => {
    try {
      const response = await axios.post("http://localhost:4001/compare", {
        paragraph1,
        paragraph2,
      });
      toast.success(response.data.diff); // Show toast when comparison is successful
    } catch (error) {
      console.error("Error submitting comparison", error);
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
