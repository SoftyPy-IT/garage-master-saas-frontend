import { Settings } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { CONFIG } from "../../../config/calendar";
import { useCalendar } from "../../../context/CalendarContext";

export const ConfigHelpDialog = () => {
  const { configHelpOpen, setConfigHelpOpen, login } = useCalendar();

  return (
    <Dialog
      open={configHelpOpen}
      onClose={() => setConfigHelpOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Settings /> Google Calendar API Configuration
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="h6">Required Configuration Steps</Typography>
          </Alert>

          <Typography variant="body1" gutterBottom>
            To use Google Calendar integration, ensure the following is configured
            in your Google Cloud Console:
          </Typography>

          <Box component="ol" sx={{ mt: 2, pl: 2 }}>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Enable the <strong>Google Calendar API</strong> for project{" "}
                {CONFIG.projectId}
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Add authorized JavaScript origins for your app URL (e.g.
                http://localhost:5173)
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Configure OAuth 2.0 Client ID: {CONFIG.clientId}
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Grant scopes: calendar, calendar.events, userinfo.email,
                userinfo.profile
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                If you see &quot;API has not been used&quot;, visit the Google
                Cloud Console and enable the Calendar API, then wait a few
                minutes before retrying.
              </Typography>
            </li>
          </Box>

          <Alert severity="warning" sx={{ mt: 3 }}>
            After updating configuration, logout and login again to grant all
            required permissions.
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfigHelpOpen(false)}>Close</Button>
        <Button onClick={login} variant="contained">
          Try Login Again
        </Button>
      </DialogActions>
    </Dialog>
  );
};
