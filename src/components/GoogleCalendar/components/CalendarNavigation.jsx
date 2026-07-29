import {
  ChevronLeft,
  ChevronRight,
  Today as TodayIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { CALENDAR_VIEWS } from "../../../constant/calendar";
import { useCalendar } from "../../../context/CalendarContext";

export const CalendarNavigation = ({ showSidebarToggle = false }) => {
  const {
    viewMode,
    setViewMode,
    currentDate,
    goToToday,
    goToPrevious,
    goToNext,
    setSidebarOpen,
  } = useCalendar();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton onClick={goToPrevious}>
          <ChevronLeft />
        </IconButton>
        <Button
          variant="outlined"
          startIcon={<TodayIcon />}
          onClick={goToToday}
        >
          Today
        </Button>
        <IconButton onClick={goToNext}>
          <ChevronRight />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 2 }}>
          {format(currentDate, "MMMM yyyy")}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => newMode && setViewMode(newMode)}
          size="small"
        >
          {CALENDAR_VIEWS.map((view) => (
            <ToggleButton key={view.id} value={view.id}>
              {view.icon}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {showSidebarToggle && (
          <IconButton onClick={() => setSidebarOpen(true)}>
            <ChevronRight />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
