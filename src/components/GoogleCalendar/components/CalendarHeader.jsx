import {
  ChevronLeft,
  DarkMode,
  Event as EventIcon,
  LightMode,
  Notifications,
  Settings,
} from "@mui/icons-material";
import { Badge, Box, IconButton, TextField, Typography } from "@mui/material";
import { useRef } from "react";
import { useCalendar } from "../../../context/CalendarContext";
import { AuthButton } from "./AuthButton";

export const CalendarHeader = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    themeMode,
    toggleTheme,
    setAnchorEl,
    setSettingsOpen,
    notifications,
  } = useCalendar();

  const searchRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {sidebarOpen && (
          <IconButton onClick={() => setSidebarOpen(false)}>
            <ChevronLeft />
          </IconButton>
        )}
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <EventIcon /> Google Calendar
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Complete calendar solution with events, tasks, meetings,
            appointments, reminders, and notifications
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 200 }}
          inputRef={searchRef}
        />

        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ position: "relative" }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        <IconButton onClick={() => setSettingsOpen(true)}>
          <Settings />
        </IconButton>

        <IconButton onClick={toggleTheme}>
          {themeMode === "light" ? <DarkMode /> : <LightMode />}
        </IconButton>

        <AuthButton />
      </Box>
    </Box>
  );
};
