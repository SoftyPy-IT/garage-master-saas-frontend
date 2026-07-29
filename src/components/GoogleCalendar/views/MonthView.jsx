import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { useMemo } from "react";
import { useCalendar } from "../../../context/CalendarContext";
import {
  getColorById,
  getEventsForDay,
} from "../../../utils/calendar/helpers";

export const MonthView = () => {
  const {
    currentDate,
    events,
    tasks,
    reminders,
    appointments,
    setCurrentDate,
    setViewMode,
  } = useCalendar();

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const weeks = [];
  for (let i = 0; i < monthDays.length; i += 7) {
    weeks.push(monthDays.slice(i, i + 7));
  }

  return (
    <Box>
      <Grid container spacing={1}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Grid item xs key={day}>
            <Typography align="center" fontWeight="bold">{day}</Typography>
          </Grid>
        ))}
      </Grid>

      {weeks.map((week, weekIndex) => (
        <Grid container spacing={1} key={weekIndex} sx={{ mb: 1 }}>
          {week.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(
              day,
              events,
              tasks,
              reminders,
              appointments,
            );
            return (
              <Grid item xs key={dayIndex}>
                <Card
                  sx={{
                    height: 120,
                    overflow: "auto",
                    bgcolor: isSameDay(day, new Date())
                      ? "primary.50"
                      : !isSameMonth(day, currentDate)
                        ? "grey.50"
                        : "white",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  onClick={() => {
                    setCurrentDate(day);
                    setViewMode("day");
                  }}
                >
                  <CardContent sx={{ p: 1 }}>
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        color: isSameDay(day, new Date())
                          ? "primary.main"
                          : !isSameMonth(day, currentDate)
                            ? "grey.400"
                            : "inherit",
                      }}
                    >
                      {format(day, "d")}
                    </Typography>

                    {dayEvents.slice(0, 3).map((event) => (
                      <Box
                        key={event.id}
                        sx={{
                          bgcolor:
                            getColorById(event.colorId) ||
                            event.colorHex ||
                            "#4285F4",
                          color: "white",
                          borderRadius: 1,
                          p: 0.5,
                          mb: 0.5,
                          fontSize: "10px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          border: "1px solid rgba(255,255,255,0.3)",
                        }}
                      >
                        {format(
                          new Date(
                            event.start?.dateTime ||
                              event.dueDate ||
                              event.reminderTime,
                          ),
                          "h:mm",
                        )}{" "}
                        - {event.summary.substring(0, 15)}
                        {event.summary.length > 15 ? "..." : ""}
                      </Box>
                    ))}

                    {dayEvents.length > 3 && (
                      <Typography variant="caption" color="textSecondary">
                        +{dayEvents.length - 3} more
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ))}
    </Box>
  );
};
