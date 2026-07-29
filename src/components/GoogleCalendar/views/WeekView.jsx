import { DragIndicator, Event as EventIcon } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
} from "date-fns";
import { EVENT_TYPES } from "../../../constant/calendar";
import { useCalendar } from "../../../context/CalendarContext";
import {
  getColorById,
  getEventsForDay,
} from "../../../utils/calendar/helpers";

export const WeekView = () => {
  const {
    currentDate,
    events,
    tasks,
    reminders,
    appointments,
    dragDropEnabled,
    handleOpenDialog,
  } = useCalendar();

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  });

  return (
    <Grid container spacing={1}>
      {weekDays.map((day, index) => {
        const dayEvents = getEventsForDay(
          day,
          events,
          tasks,
          reminders,
          appointments,
        );
        return (
          <Grid item xs key={index}>
            <Card
              sx={{
                height: "600px",
                overflow: "auto",
                bgcolor: isSameDay(day, new Date()) ? "primary.50" : "white",
              }}
            >
              <CardContent sx={{ p: 1 }}>
                <Typography
                  variant="subtitle2"
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    color: isSameDay(day, new Date())
                      ? "primary.main"
                      : "inherit",
                  }}
                >
                  {format(day, "EEE")}
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    color: isSameDay(day, new Date())
                      ? "primary.main"
                      : "text.secondary",
                  }}
                >
                  {format(day, "d")}
                </Typography>
                <Divider sx={{ my: 1 }} />

                {dayEvents.length > 0 ? (
                  <Box>
                    {dayEvents.map((event) => (
                      <Card
                        key={event.id}
                        sx={{
                          p: 1,
                          mb: 1,
                          bgcolor:
                            getColorById(event.colorId) ||
                            event.colorHex ||
                            "#4285F4",
                          color: "white",
                          cursor: "pointer",
                          border: "1px solid rgba(255,255,255,0.3)",
                          "&:hover": { opacity: 0.9, boxShadow: 2 },
                        }}
                        onClick={() => handleOpenDialog(event)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            {EVENT_TYPES.find((t) => t.id === event.type)
                              ?.icon || <EventIcon sx={{ fontSize: 14 }} />}
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: "bold" }}
                            >
                              {format(
                                new Date(
                                  event.start?.dateTime ||
                                    event.dueDate ||
                                    event.reminderTime,
                                ),
                                "h:mm a",
                              )}
                            </Typography>
                          </Box>
                          {dragDropEnabled && (
                            <DragIndicator sx={{ fontSize: 16 }} />
                          )}
                        </Box>
                        <Typography variant="body2" fontWeight="bold" noWrap>
                          {event.summary}
                        </Typography>
                        <Chip
                          size="small"
                          label={event.type || "event"}
                          sx={{
                            mt: 0.5,
                            color: "white",
                            bgcolor: "rgba(255,255,255,0.2)",
                          }}
                        />
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                    sx={{ mt: 2 }}
                  >
                    No events
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
