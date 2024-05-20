import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, TextField, Button, AppBar, Toolbar } from "@mui/material";
import Notification from "./Notification";
import { diffWords } from "diff";

function App() {
  const [paragraph1, setParagraph1] = useState("");
  const [paragraph2, setParagraph2] = useState("");

  const handleCompare = () => {
    const diffResult = diffWords(paragraph1, paragraph2);
    let diffOutput = "";
    diffResult.forEach((part) => {
      if (part.added) {
        diffOutput += `<span style="background-color: #d4edda;">${part.value}</span>`;
      } else if (part.removed) {
        diffOutput += `<span style="text-decoration: line-through; color: #f8d7da;">${part.value}</span>`;
      } else {
        diffOutput += `<span>${part.value}</span>`;
      }
    });
    toast(<div dangerouslySetInnerHTML={{ __html: diffOutput }} />, {
      type: "info",
    });
  };

  return (
    <>
      <Box style={{ marginBottom: "50px" }}>
        <AppBar>
          <Toolbar>
            <Notification
              style={{ zIndex: "999" }}
              paragraph1={paragraph1}
              paragraph2={paragraph2}
            />
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
