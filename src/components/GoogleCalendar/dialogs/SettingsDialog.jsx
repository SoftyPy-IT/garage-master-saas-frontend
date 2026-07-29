import { Settings } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { REMINDER_TIMINGS } from "../../../constant/calendar";
import { useCalendar } from "../../../context/CalendarContext";
import { getColorById } from "../../../utils/calendar/helpers";

export const SettingsDialog = () => {
  const {
    settingsOpen,
    setSettingsOpen,
    themeMode,
    toggleTheme,
    sidebarOpen,
    setSidebarOpen,
    dragDropEnabled,
    setDragDropEnabled,
    notificationSettings: ctxNotificationSettings,
    emailSettings: ctxEmailSettings,
    calendars,
  } = useCalendar();

  const [activeTab, setActiveTab] = useState(0);
  const [notificationSettings, setNotificationSettings] = useState(
    ctxNotificationSettings,
  );
  const [emailSettings, setEmailSettings] = useState(ctxEmailSettings);
  const [localCalendars, setLocalCalendars] = useState(calendars);

  useEffect(() => {
    setNotificationSettings(ctxNotificationSettings);
    setEmailSettings(ctxEmailSettings);
    setLocalCalendars(calendars);
  }, [ctxNotificationSettings, ctxEmailSettings, calendars, settingsOpen]);

  return (
    <Dialog
      open={settingsOpen}
      onClose={() => setSettingsOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Settings /> Calendar Settings
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="General" />
          <Tab label="Notifications" />
          <Tab label="Email" />
          <Tab label="Calendars" />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>Appearance</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={themeMode === "dark"}
                  onChange={toggleTheme}
                />
              }
              label="Dark Mode"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={sidebarOpen}
                  onChange={() => setSidebarOpen(!sidebarOpen)}
                />
              }
              label="Show Sidebar"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={dragDropEnabled}
                  onChange={() => setDragDropEnabled(!dragDropEnabled)}
                />
              }
              label="Enable Drag & Drop"
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(notificationSettings).map(([key, value]) => (
                <Grid item xs={6} key={key}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [key]: e.target.checked,
                          })
                        }
                      />
                    }
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Default Reminders
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Default Reminder Time</InputLabel>
              <Select
                value={emailSettings.defaultReminder || 30}
                onChange={(e) =>
                  setEmailSettings({
                    ...emailSettings,
                    defaultReminder: e.target.value,
                  })
                }
                label="Default Reminder Time"
              >
                {REMINDER_TIMINGS.map((timing) => (
                  <MenuItem key={timing.value} value={timing.value}>
                    {timing.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>Email Settings</Typography>
            <Grid container spacing={2}>
              {Object.entries(emailSettings).map(([key, value]) => {
                if (typeof value === "boolean") {
                  return (
                    <Grid item xs={12} key={key}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={value}
                            onChange={(e) =>
                              setEmailSettings({
                                ...emailSettings,
                                [key]: e.target.checked,
                              })
                            }
                          />
                        }
                        label={key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^\w/, (c) => c.toUpperCase())}
                      />
                    </Grid>
                  );
                }
                return null;
              })}
            </Grid>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Email Signature"
              value={emailSettings.signature}
              onChange={(e) =>
                setEmailSettings({
                  ...emailSettings,
                  signature: e.target.value,
                })
              }
              sx={{ mt: 3 }}
            />
          </Box>
        )}

        {activeTab === 3 && (
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>Manage Calendars</Typography>
            <List>
              {localCalendars.map((calendar) => (
                <ListItem key={calendar.id} disablePadding>
                  <ListItemButton>
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
                      checked={calendar.visible}
                      onChange={() => {
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
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        <Button onClick={() => setSettingsOpen(false)} variant="contained">
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
};
