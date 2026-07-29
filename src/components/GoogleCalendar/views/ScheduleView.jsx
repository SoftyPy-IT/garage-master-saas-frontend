import { Edit as EditIcon, Event as EventIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { format, formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import { EVENT_TYPES } from "../../../constant/calendar";
import { useCalendar } from "../../../context/CalendarContext";
import { getColorById } from "../../../utils/calendar/helpers";

export const ScheduleView = () => {
  const {
    events,
    tasks,
    reminders,
    appointments,
    searchQuery,
    handleOpenDialog,
  } = useCalendar();

  const upcomingEvents = useMemo(() => {
    const allItems = [...events, ...tasks, ...reminders, ...appointments];
    let filtered = [...allItems];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.summary || "").toLowerCase().includes(query) ||
          (item.description || "").toLowerCase().includes(query) ||
          (item.location || "").toLowerCase().includes(query),
      );
    }

    const now = new Date();
    return filtered
      .filter((item) => {
        const itemDate = new Date(
          item.start?.dateTime || item.dueDate || item.reminderTime,
        );
        return itemDate && itemDate >= now;
      })
      .sort((a, b) => {
        const aTime = new Date(
          a.start?.dateTime || a.dueDate || a.reminderTime,
        );
        const bTime = new Date(
          b.start?.dateTime || b.dueDate || b.reminderTime,
        );
        return aTime - bTime;
      });
  }, [events, tasks, reminders, appointments, searchQuery]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upcoming Schedule ({upcomingEvents.length})
      </Typography>
      <List>
        {upcomingEvents.slice(0, 20).map((event) => {
          const eventDate = new Date(
            event.start?.dateTime || event.dueDate || event.reminderTime,
          );
          const timeUntil = formatDistanceToNow(eventDate, {
            addSuffix: true,
          });

          return (
            <ListItem
              key={event.id}
              sx={{
                mb: 1,
                borderLeft: `4px solid ${
                  getColorById(event.colorId) || event.colorHex || "#4285F4"
                }`,
                bgcolor: "background.paper",
                borderRadius: 1,
              }}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleOpenDialog(event)}
                >
                  <EditIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor:
                      getColorById(event.colorId) ||
                      event.colorHex ||
                      "#4285F4",
                  }}
                >
                  {EVENT_TYPES.find((t) => t.id === event.type)?.icon || (
                    <EventIcon />
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body1" fontWeight="bold">
                      {event.summary}
                    </Typography>
                    {event.priority === "high" && (
                      <Chip size="small" label="High" color="error" />
                    )}
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.primary">
                      {format(eventDate, "PPPPp")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {timeUntil} • {event.location || "No location"} •{" "}
                      {event.type}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
