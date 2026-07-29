import {
  CheckCircle,
  Delete as DeleteIcon,
  Notifications,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { useCalendar } from "../../../context/CalendarContext";

export const NotificationsPanel = () => {
  const { anchorEl, setAnchorEl, notifications } = useCalendar();
  const [localNotifications, setLocalNotifications] = useState(notifications);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const markNotificationAsRead = (id) => {
    setLocalNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllNotificationsAsRead = () => {
    setLocalNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true })),
    );
  };

  const clearAllNotifications = () => {
    setLocalNotifications([]);
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Box sx={{ width: 360, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Notifications</Typography>
          <Box>
            <IconButton
              size="small"
              onClick={markAllNotificationsAsRead}
              title="Mark all as read"
            >
              <CheckCircle />
            </IconButton>
            <IconButton
              size="small"
              onClick={clearAllNotifications}
              title="Clear all"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {localNotifications.length === 0 ? (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ py: 4 }}
          >
            No notifications
          </Typography>
        ) : (
          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {localNotifications.slice(0, 10).map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  bgcolor: notification.read ? "transparent" : "action.hover",
                  mb: 1,
                  borderRadius: 1,
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <CheckCircle />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <Notifications />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(
                          new Date(notification.timestamp),
                          { addSuffix: true },
                        )}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        {localNotifications.length > 10 && (
          <Button fullWidth sx={{ mt: 1 }}>
            View All Notifications
          </Button>
        )}
      </Box>
    </Popover>
  );
};
