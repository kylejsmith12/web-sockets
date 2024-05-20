import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, TextField, Button, AppBar, Toolbar } from "@mui/material";
import Notification from "./Notification";
import { showToastWithDiff } from "./utils";

function App() {
  const [paragraph1, setParagraph1] = useState("");
  const [paragraph2, setParagraph2] = useState("");

  const handleCompare = () => {
    showToastWithDiff(paragraph1, paragraph2);
  };

  return (
    <>
      <Box style={{ marginBottom: "50px" }}>
        <AppBar>
          <Toolbar>
            <Notification />
            <ToastContainer position="bottom-right" newestOnTop />
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
