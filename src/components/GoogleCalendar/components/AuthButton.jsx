import {
  Add as AddIcon,
  Event as EventIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useCalendar } from "../../../context/CalendarContext";

export const AuthButton = () => {
  const {
    accessToken,
    userProfile,
    loading,
    syncStatus,
    login,
    handleLogout,
    syncCalendar,
    setQuickAddOpen,
  } = useCalendar();

  if (accessToken && userProfile) {
    return (
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Chip
          avatar={<Avatar src={userProfile?.picture} />}
          label={userProfile?.name || userProfile?.email || "User"}
          variant="outlined"
          color="primary"
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setQuickAddOpen(true)}
        >
          Quick Add
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={syncCalendar}
          disabled={loading || !accessToken}
        >
          {syncStatus === "syncing" ? "Syncing..." : "Sync"}
        </Button>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    );
  }

  return (
    <Button
      variant="contained"
      startIcon={<EventIcon />}
      onClick={() => login()}
      disabled={loading}
      size="large"
      color="primary"
    >
      {loading ? <CircularProgress size={24} /> : "Connect Google Calendar"}
    </Button>
  );
};
