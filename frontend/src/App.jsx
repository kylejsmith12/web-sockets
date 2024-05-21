import React, { useState, useEffect } from "react";
import { Box, TextField, Button, AppBar, Toolbar } from "@mui/material";
import Notification from "./Notification";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { compareAndNotify } from "./utils";

function App() {
  const [paragraph1, setParagraph1] = useState("");
  const [paragraph2, setParagraph2] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4001");

    ws.addEventListener("open", () => {
      console.log("Connected to WebSocket server");
    });

    ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      showToast(data.diff);
    });

    return () => {
      ws.close();
    };
  }, []);

  const handleCompare = async () => {
    const diff = compareAndNotify(paragraph1, paragraph2);
    showToast(diff);

    try {
      const response = await axios.post("http://localhost:4001/api/compare", {
        paragraph1,
        paragraph2,
      });
      console.log("Comparison saved:", response.data);
    } catch (error) {
      console.error("Error saving comparison:", error);
      toast.error("Error saving comparison. Please check the server logs.");
    }
  };

  const showToast = (message) => {
    toast.info(message);
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
