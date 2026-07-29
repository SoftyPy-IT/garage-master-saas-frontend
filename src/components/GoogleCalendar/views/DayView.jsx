import { DragIndicator, Event as EventIcon } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import {
  differenceInMinutes,
  format,
  getHours,
  getMinutes,
} from "date-fns";
import { EVENT_TYPES, TIME_SLOTS } from "../../../constant/calendar";
import { useCalendar } from "../../../context/CalendarContext";
import {
  getColorById,
  getEventsForDay,
} from "../../../utils/calendar/helpers";
import { DroppableCalendarSlot } from "../DroppableCalendarSlot";

export const DayView = () => {
  const {
    currentDate,
    events,
    tasks,
    reminders,
    appointments,
    dragDropEnabled,
    handleDrop,
    handleOpenDialog,
  } = useCalendar();

  const dayEvents = getEventsForDay(
    currentDate,
    events,
    tasks,
    reminders,
    appointments,
  );

  return (
    <Box sx={{ height: "calc(100vh - 300px)", overflow: "auto" }}>
      <Grid container>
        <Grid item xs={2}>
          <Box sx={{ borderRight: 1, borderColor: "divider" }}>
            {TIME_SLOTS.map((time) => (
              <Box
                key={time}
                sx={{
                  height: 60,
                  borderBottom: 1,
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Typography variant="caption">{time}</Typography>
                {dragDropEnabled && (
                  <DroppableCalendarSlot
                    date={format(currentDate, "yyyy-MM-dd")}
                    time={time}
                    onDrop={handleDrop}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Box sx={{ position: "relative", height: "100%" }}>
            {TIME_SLOTS.map((time) => (
              <Box
                key={time}
                sx={{
                  height: 60,
                  borderBottom: 1,
                  borderColor: "divider",
                  position: "relative",
                }}
              >
                {dragDropEnabled && (
                  <DroppableCalendarSlot
                    date={format(currentDate, "yyyy-MM-dd")}
                    time={time}
                    onDrop={handleDrop}
                  />
                )}
              </Box>
            ))}

            {dayEvents.map((event) => {
              const startTime = event.start?.dateTime
                ? new Date(event.start.dateTime)
                : new Date(event.dueDate || event.reminderTime || new Date());
              const endTime = event.end?.dateTime
                ? new Date(event.end.dateTime)
                : new Date(startTime.getTime() + 60 * 60000);

              const startMinutes =
                getHours(startTime) * 60 + getMinutes(startTime);
              const durationMinutes = differenceInMinutes(endTime, startTime);
              const top = startMinutes * 1;
              const height = Math.max(durationMinutes, 30);

              return (
                <Box
                  key={event.id}
                  sx={{
                    position: "absolute",
                    top: `${top}px`,
                    left: "10px",
                    right: "10px",
                    height: `${height}px`,
                    bgcolor:
                      getColorById(event.colorId) ||
                      event.colorHex ||
                      "#4285F4",
                    color: "white",
                    borderRadius: 1,
                    p: 1,
                    overflow: "hidden",
                    cursor: "pointer",
                    border: "1px solid rgba(255,255,255,0.3)",
                    "&:hover": { opacity: 0.9, boxShadow: 2 },
                  }}
                  onClick={() => handleOpenDialog(event)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {EVENT_TYPES.find((t) => t.id === event.type)?.icon || (
                      <EventIcon sx={{ fontSize: 14 }} />
                    )}
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{ fontWeight: "bold", flex: 1 }}
                    >
                      {format(startTime, "h:mm a")} - {event.summary}
                    </Typography>
                    {event.priority === "high" && (
                      <span style={{ fontSize: "10px" }}>⚠️</span>
                    )}
                  </Box>
                  {event.location && (
                    <Typography
                      variant="caption"
                      sx={{ display: "block", opacity: 0.8 }}
                    >
                      {event.location}
                    </Typography>
                  )}
                  {dragDropEnabled && (
                    <DragIndicator
                      sx={{
                        position: "absolute",
                        right: 4,
                        top: 4,
                        fontSize: 16,
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
