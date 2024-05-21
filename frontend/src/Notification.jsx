import React, { useState, useEffect } from "react";
import {
  Badge,
  Box,
  IconButton,
  Popper,
  Fade,
  Typography,
  Stack,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Alert,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4001/api/notifications"
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4001");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prevNotifications) => [data, ...prevNotifications]);
      showToast(data.diff);
    };

    return () => {
      ws.close();
    };
  }, []);

  const toggleNotificationCenter = (event) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(!isOpen);
  };

  const toggleFilter = () => {
    setShowUnreadOnly(!showUnreadOnly);
  };

  const showToast = (diff) => {
    toast.info(diff);
  };

  return (
    <Box sx={{ margin: "8px" }}>
      <IconButton size="large" onClick={toggleNotificationCenter}>
        <Badge
          badgeContent={
            notifications.filter((notification) => !notification.read).length
          }
          color="primary"
        >
          <MailIcon color="action" />
        </Badge>
      </IconButton>

      <Popper
        style={{ zIndex: 999 }}
        open={isOpen}
        anchorEl={anchorEl}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Box>
              <Box
                sx={{
                  background: "#666",
                  padding: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" color="#fff">
                  Notification center
                </Typography>
                <FormGroup sx={{ color: "#fff" }}>
                  <FormControlLabel
                    control={
                      <Switch
                        color="secondary"
                        onChange={toggleFilter}
                        checked={showUnreadOnly}
                      />
                    }
                    label="Show unread only"
                  />
                </FormGroup>
              </Box>
              <Stack
                sx={{
                  height: "400px",
                  width: "min(60ch, 100ch)",
                  padding: "12px",
                  background: "#f1f1f1",
                  borderRadius: "8px",
                  overflowY: "auto",
                }}
                spacing={2}
              >
                {(!notifications.length ||
                  (notifications.length === 0 && showUnreadOnly)) && (
                  <h4>
                    Your queue is empty! You are all set{" "}
                    <span role="img" aria-label="celebration">
                      🎉
                    </span>
                  </h4>
                )}
                {(showUnreadOnly
                  ? notifications.filter((v) => !v.read)
                  : notifications
                ).map((notification, index) => (
                  <Alert
                    key={index}
                    severity="info"
                    action={
                      <IconButton
                        color="primary"
                        aria-label="mark as read"
                        component="span"
                      >
                        <MarkChatReadIcon />
                      </IconButton>
                    }
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: notification.diff }}
                    />
                  </Alert>
                ))}
              </Stack>
              <Box
                sx={{
                  background: "#666",
                  padding: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button variant="contained">Clear All</Button>
                <Button variant="contained">Mark all as read</Button>
              </Box>
            </Box>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default Notification;
