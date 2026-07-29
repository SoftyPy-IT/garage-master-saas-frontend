import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { differenceInHours } from "date-fns";
import { useEffect, useState } from "react";
import { useCalendar } from "../../../context/CalendarContext";
import { getColorById } from "../../../utils/calendar/helpers";
import { StatsGrid } from "./StatsGrid";

export const CalendarSidebar = () => {
  const {
    calendars,
    selectedCalendar,
    setSelectedCalendar,
    stats,
    events,
    tasks,
    reminders,
    appointments,
  } = useCalendar();

  const [localCalendars, setLocalCalendars] = useState(calendars);

  useEffect(() => {
    setLocalCalendars(calendars);
  }, [calendars]);

  const getUpcomingEvents = () => {
    const now = new Date();
    const allItems = [...events, ...tasks, ...reminders, ...appointments];
    return allItems
      .filter((item) => {
        if (!item.start?.dateTime && !item.dueDate && !item.reminderTime)
          return false;
        const itemTime = new Date(
          item.start?.dateTime || item.dueDate || item.reminderTime,
        );
        return itemTime > now && differenceInHours(itemTime, now) <= 24;
      })
      .sort((a, b) => {
        const aTime = new Date(
          a.start?.dateTime || a.dueDate || a.reminderTime,
        );
        const bTime = new Date(
          b.start?.dateTime || b.dueDate || b.reminderTime,
        );
        return aTime - bTime;
      })
      .slice(0, 5);
  };

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Calendars</Typography>
          <List>
            {localCalendars.map((calendar) => (
              <ListItem key={calendar.id} disablePadding>
                <ListItemButton
                  selected={selectedCalendar === calendar.id}
                  onClick={() => setSelectedCalendar(calendar.id)}
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: getColorById(calendar.color),
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={calendar.name} />
                  <Switch
                    size="small"
                    checked={calendar.visible}
                    onChange={(e) => {
                      e.stopPropagation();
                      setLocalCalendars(
                        localCalendars.map((c) =>
                          c.id === calendar.id
                            ? { ...c, visible: !c.visible }
                            : c,
                        ),
                      );
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <StatsGrid stats={stats} />

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Upcoming</Typography>
          <List dense>
            {getUpcomingEvents().map((event) => (
              <ListItem key={event.id}>
                <ListItemText
                  primary={event.summary}
                  secondary={format(
                    new Date(
                      event.start?.dateTime ||
                        event.dueDate ||
                        event.reminderTime,
                    ),
                    "MMM d, h:mm a",
                  )}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </>
  );
};
