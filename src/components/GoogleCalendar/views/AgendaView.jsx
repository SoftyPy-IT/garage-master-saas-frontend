import { Event as EventIcon, MoreVert as MoreVertIcon } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { format, isAfter, isSameDay } from "date-fns";
import { useMemo } from "react";
import { EVENT_TYPES } from "../../../constant/calendar";
import { useCalendar } from "../../../context/CalendarContext";

export const AgendaView = () => {
  const {
    events,
    tasks,
    reminders,
    appointments,
    searchQuery,
    setEventMenuAnchor,
    setSelectedEventForMenu,
  } = useCalendar();

  const filteredEvents = useMemo(() => {
    const allItems = [...events, ...tasks, ...reminders, ...appointments];
    let filtered = [...allItems];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.summary || "").toLowerCase().includes(query) ||
          (item.description || "").toLowerCase().includes(query) ||
          (item.location || "").toLowerCase().includes(query) ||
          (item.customerInfo?.name || "").toLowerCase().includes(query) ||
          (item.serviceType || "").toLowerCase().includes(query),
      );
    }

    const now = new Date();
    filtered = filtered.filter((item) => {
      const itemDate = new Date(
        item.start?.dateTime || item.dueDate || item.reminderTime,
      );
      return isAfter(itemDate, now) || isSameDay(itemDate, now);
    });

    return filtered;
  }, [events, tasks, reminders, appointments, searchQuery]);

  const groupedEvents = {};
  filteredEvents.forEach((event) => {
    const date = event.start?.dateTime
      ? format(new Date(event.start.dateTime), "yyyy-MM-dd")
      : event.dueDate
        ? format(new Date(event.dueDate), "yyyy-MM-dd")
        : event.reminderTime
          ? format(new Date(event.reminderTime), "yyyy-MM-dd")
          : "unscheduled";
    if (!groupedEvents[date]) groupedEvents[date] = [];
    groupedEvents[date].push(event);
  });

  return (
    <Box>
      {Object.entries(groupedEvents)
        .sort()
        .map(([date, dateEvents]) => (
          <Box key={date} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {date === "unscheduled"
                ? "Unscheduled"
                : format(new Date(date), "EEEE, MMMM d, yyyy")}
            </Typography>
            <Grid container spacing={2}>
              {dateEvents.map((event) => (
                <Grid item xs={12} key={event.id}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            {EVENT_TYPES.find((t) => t.id === event.type)
                              ?.icon || <EventIcon />}
                            <Typography variant="h6">{event.summary}</Typography>
                            <Chip
                              size="small"
                              label={event.type || "event"}
                              color="primary"
                              sx={{ ml: 1 }}
                            />
                            {event.priority === "high" && (
                              <Chip
                                size="small"
                                label="High Priority"
                                color="error"
                              />
                            )}
                          </Box>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                          >
                            {event.start?.dateTime
                              ? format(
                                  new Date(event.start.dateTime),
                                  "h:mm a",
                                )
                              : event.dueDate
                                ? `Due: ${format(
                                    new Date(event.dueDate),
                                    "h:mm a",
                                  )}`
                                : event.reminderTime
                                  ? `Reminder: ${format(
                                      new Date(event.reminderTime),
                                      "h:mm a",
                                    )}`
                                  : "No time specified"}{" "}
                            • {event.location || "No location"}
                          </Typography>
                          {event.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {event.description.substring(0, 200)}
                              {event.description.length > 200 ? "..." : ""}
                            </Typography>
                          )}
                        </Box>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setEventMenuAnchor(e.currentTarget);
                            setSelectedEventForMenu(event);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
    </Box>
  );
};
