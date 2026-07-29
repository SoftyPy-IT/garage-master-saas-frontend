import { Cloud, CloudOff } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import { useCalendar } from "../../../context/CalendarContext";

export const UserInfoCard = () => {
  const { userProfile, isOnline, stats } = useCalendar();

  if (!userProfile) return null;

  return (
    <Card sx={{ mb: 3, bgcolor: "primary.light", color: "white" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar src={userProfile.picture} sx={{ width: 60, height: 60 }} />
            <Box>
              <Typography variant="h6">Welcome, {userProfile.name}!</Typography>
              <Typography variant="body2">
                {userProfile.email} | Connected to Google Calendar
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              icon={isOnline ? <Cloud /> : <CloudOff />}
              label={isOnline ? "Online" : "Offline"}
              color={isOnline ? "success" : "default"}
              sx={{ color: "white" }}
            />
            <Chip
              label={`${stats.totalEvents} Events`}
              color="info"
              sx={{ color: "white" }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
