// src/components/Calendar/GoogleCalendar.jsx
import {
  AccessTime,
  Add as AddIcon,
  CalendarToday,
  Close,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Event as EventIcon,
  LocationOn,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Save,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  addHours,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfWeek,
} from "date-fns";
import { useEffect, useState } from "react";

const GoogleCalendar = () => {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("google_access_token") || null
  );
  const [userProfile, setUserProfile] = useState(
    JSON.parse(localStorage.getItem("google_user_profile") || "null")
  );
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'week'
  const [currentDate] = useState(new Date());

  // ফর্ম স্টেট
  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    customerEmail: "",
    customerPhone: "",
    customerName: "",
  });

  // সপ্তাহের দিনগুলো
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  });

  // Google লগইন - All scopes included
  const login = useGoogleLogin({
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/calendar.readonly",
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    onSuccess: async (response) => {
      setLoading(true);
      setErrorDetails(null);
      const token = response.access_token;
      setAccessToken(token);
      localStorage.setItem("google_access_token", token);

      try {
        await fetchUserProfile(token);
        await fetchCalendarEvents(token);
        showNotification("সফলভাবে লগইন হয়েছে!", "success");
      } catch (error) {
        console.error("Login error:", error);
        handleGoogleError(error);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setErrorDetails({
        type: "login_error",
        message: "Login failed. Please check your Google Console settings.",
        details: error,
      });
      showNotification("লগইন ব্যর্থ হয়েছে", "error");
      setLoading(false);
    },
    flow: "implicit",
  });

  // Enhanced error handling
  const handleGoogleError = (error) => {
    console.error("Google API Error:", error);

    if (error.response) {
      switch (error.response.status) {
        case 400:
          setErrorDetails({
            type: "bad_request",
            message: "Invalid request to Google API",
            details: error.response.data,
          });
          break;
        case 401:
          setErrorDetails({
            type: "unauthorized",
            message: "Token expired or invalid. Please login again.",
            details: error.response.data,
          });
          logout();
          break;
        case 403:
          setErrorDetails({
            type: "access_denied",
            message: "Access denied. Please check:",
            details: [
              "1. Add ibrahimsikder5033@gmail.com as Test User",
              "2. Verify domains in Google Console",
              "3. Check OAuth consent screen status",
            ],
          });
          break;
        default:
          setErrorDetails({
            type: "server_error",
            message: "Google API error occurred",
            details: error.response.data,
          });
      }
    } else if (error.request) {
      setErrorDetails({
        type: "network_error",
        message: "Network error. Please check internet connection.",
        details: error.request,
      });
    } else {
      setErrorDetails({
        type: "unknown_error",
        message: "An unknown error occurred",
        details: error.message,
      });
    }
  };

  // লগআউট ফাংশন
  const logout = () => {
    googleLogout();
    setAccessToken(null);
    setUserProfile(null);
    setEvents([]);
    setErrorDetails(null);
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("google_user_profile");
    showNotification("সফলভাবে লগআউট হয়েছে", "info");
  };

  // ইউজার প্রোফাইল ফেচ
  const fetchUserProfile = async (token) => {
    try {
      const { data } = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserProfile(data);
      localStorage.setItem("google_user_profile", JSON.stringify(data));
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw error;
    }
  };

  // ক্যালেন্ডার ইভেন্ট ফেচ - ALL EVENTS (6 মাসের)
  const fetchCalendarEvents = async (token) => {
    try {
      const now = new Date();
      const timeMin = addHours(now, -720).toISOString(); // 30 days ago
      const timeMax = addHours(now, 2160).toISOString(); // 90 days ahead

      const { data } = await axios.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: "startTime",
            maxResults: 100,
          },
        }
      );

      setEvents(data.items || []);
      showNotification(`${data.items?.length || 0} events loaded`, "info");
    } catch (error) {
      console.error("Events fetch error:", error);
      handleGoogleError(error);
      throw error;
    }
  };

  // নতুন ইভেন্ট তৈরি
  const createEvent = async () => {
    if (!accessToken) {
      showNotification("প্রথমে Google এ লগইন করুন", "warning");
      return;
    }

    try {
      const event = {
        summary: formData.summary,
        description: `${
          formData.description || ""
        }\n\n--- Customer Details ---\nName: ${
          formData.customerName || "N/A"
        }\nPhone: ${formData.customerPhone || "N/A"}\nEmail: ${
          formData.customerEmail || "N/A"
        }\nCreated via: Trust Auto Solution`,
        start: {
          dateTime: formData.startTime,
          timeZone: "Asia/Dhaka",
        },
        end: {
          dateTime: formData.endTime,
          timeZone: "Asia/Dhaka",
        },
        location: formData.location,
        attendees: formData.customerEmail
          ? [{ email: formData.customerEmail }]
          : [],
      };

      await axios.post(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        event,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchCalendarEvents(accessToken);
      setOpenDialog(false);
      resetForm();
      showNotification("✅ Meeting successfully booked!", "success");
    } catch (error) {
      console.error("Event creation error:", error);
      showNotification("❌ Failed to book meeting", "error");
    }
  };

  // ইভেন্ট আপডেট
  const updateEvent = async () => {
    try {
      const event = {
        ...selectedEvent,
        summary: formData.summary,
        description: formData.description,
        start: { dateTime: formData.startTime, timeZone: "Asia/Dhaka" },
        end: { dateTime: formData.endTime, timeZone: "Asia/Dhaka" },
        location: formData.location,
      };

      await axios.put(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${selectedEvent.id}`,
        event,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchCalendarEvents(accessToken);
      setOpenDialog(false);
      resetForm();
      showNotification("✅ Meeting updated successfully!", "success");
    } catch (error) {
      console.error("Update error:", error);
      showNotification("❌ Failed to update meeting", "error");
    }
  };

  // ইভেন্ট ডিলিট
  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      await fetchCalendarEvents(accessToken);
      showNotification("🗑️ Meeting deleted successfully!", "success");
    } catch (error) {
      console.error("Delete error:", error);
      showNotification("❌ Failed to delete meeting", "error");
    }
  };

  // Quick notes/events
  const quickCreateEvent = (type) => {
    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 2 hours from now

    const templates = {
      meeting: {
        summary: "Team Meeting",
        description: "Weekly team sync up",
        location: "Office",
      },
      service: {
        summary: "Car Service Appointment",
        description: "Regular maintenance service",
        location: "Garage Workshop",
      },
      reminder: {
        summary: "Important Reminder",
        description: "Set a reminder for important task",
        location: "",
      },
      note: {
        summary: "Quick Note",
        description: "Add your notes here...",
        location: "",
      },
    };

    const template = templates[type];

    setFormData({
      ...formData,
      ...template,
      startTime: startTime.toISOString().slice(0, 16),
      endTime: endTime.toISOString().slice(0, 16),
    });

    setOpenDialog(true);
  };

  // Clear error
  const clearError = () => {
    setErrorDetails(null);
  };

  // Show notification
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      summary: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      customerEmail: "",
      customerPhone: "",
      customerName: "",
    });
    setSelectedEvent(null);
  };

  // Open dialog
  const handleOpenDialog = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setFormData({
        summary: event.summary || "",
        description: event.description || "",
        startTime: event.start?.dateTime || "",
        endTime: event.end?.dateTime || "",
        location: event.location || "",
        customerEmail: "",
        customerPhone: "",
        customerName: "",
      });
    } else {
      // Set default times for new event
      const now = new Date();
      const startTime = new Date(now.getTime() + 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      setFormData({
        ...formData,
        startTime: startTime.toISOString().slice(0, 16),
        endTime: endTime.toISOString().slice(0, 16),
      });
    }
    setOpenDialog(true);
  };

  // Format date for display
  const formatEventDate = (dateString) => {
    try {
      return format(parseISO(dateString), "PPpp");
    } catch {
      return dateString;
    }
  };

  // Get events for specific day
  const getEventsForDay = (day) => {
    return events.filter((event) => {
      if (!event.start?.dateTime) return false;
      const eventDate = parseISO(event.start.dateTime);
      return isSameDay(eventDate, day);
    });
  };

  // Auto fetch events when token exists
  useEffect(() => {
    if (accessToken) {
      fetchCalendarEvents(accessToken);
    }
  }, [accessToken]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            📅 Meeting Calendar
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage your appointments and meetings
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {!accessToken ? (
            <Button
              variant="contained"
              startIcon={<EventIcon />}
              onClick={() => login()}
              disabled={loading}
              size="large"
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                "Connect Google Calendar"
              )}
            </Button>
          ) : (
            <>
              <Chip
                avatar={<Avatar src={userProfile?.picture} />}
                label={userProfile?.email || "User"}
                variant="outlined"
                color="primary"
              />

              {/* Quick Actions */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  New Meeting
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => fetchCalendarEvents(accessToken)}
                >
                  Refresh
                </Button>
                <Button variant="outlined" color="error" onClick={logout}>
                  Logout
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* User Info */}
      {userProfile && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={userProfile.picture} />
            <Box>
              <Typography variant="subtitle1">
                Connected as: {userProfile.name} ({userProfile.email})
              </Typography>
              <Typography variant="caption">
                Total Events: {events.length} | Last sync: Just now
              </Typography>
            </Box>
          </Box>
        </Alert>
      )}

      {/* Error Display */}
      {errorDetails && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          icon={<WarningIcon />}
          onClose={clearError}
        >
          <Typography variant="h6" gutterBottom>
            {errorDetails.message}
          </Typography>

          {Array.isArray(errorDetails.details) ? (
            <Box component="ul" sx={{ mt: 1, pl: 2 }}>
              {errorDetails.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Error Type: {errorDetails.type}
            </Typography>
          )}

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              size="small"
              href="https://console.cloud.google.com/apis/credentials/consent"
              target="_blank"
              sx={{ mr: 1 }}
            >
              Go to Google Console
            </Button>
            <Button variant="outlined" size="small" onClick={clearError}>
              Close
            </Button>
          </Box>
        </Alert>
      )}

      {/* Quick Create Section */}
      {accessToken && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ⚡ Quick Create
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                startIcon={<EventIcon />}
                onClick={() => quickCreateEvent("meeting")}
              >
                Team Meeting
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarToday />}
                onClick={() => quickCreateEvent("service")}
              >
                Service Appointment
              </Button>
              <Button
                variant="outlined"
                startIcon={<AccessTime />}
                onClick={() => quickCreateEvent("reminder")}
              >
                Set Reminder
              </Button>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => quickCreateEvent("note")}
              >
                Quick Note
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* View Toggle */}
      {accessToken && events.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant={viewMode === "list" ? "contained" : "outlined"}
            onClick={() => setViewMode("list")}
            sx={{ mr: 1 }}
          >
            List View
          </Button>
          <Button
            variant={viewMode === "week" ? "contained" : "outlined"}
            onClick={() => setViewMode("week")}
          >
            Week View
          </Button>
        </Box>
      )}

      {/* Week View */}
      {accessToken && viewMode === "week" && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {weekDays.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            return (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        color: isSameDay(day, new Date())
                          ? "primary.main"
                          : "inherit",
                      }}
                    >
                      {format(day, "EEE, MMM d")}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    {dayEvents.length > 0 ? (
                      <Box sx={{ mt: 1 }}>
                        {dayEvents.slice(0, 3).map((event) => (
                          <Box
                            key={event.id}
                            sx={{
                              p: 1,
                              mb: 1,
                              bgcolor: "primary.light",
                              borderRadius: 1,
                              cursor: "pointer",
                              "&:hover": { bgcolor: "primary.main" },
                            }}
                            onClick={() => handleOpenDialog(event)}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "white" }}
                            >
                              {format(parseISO(event.start.dateTime), "h:mm a")}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "white", fontWeight: "bold" }}
                            >
                              {event.summary}
                            </Typography>
                          </Box>
                        ))}
                        {dayEvents.length > 3 && (
                          <Typography variant="caption" color="textSecondary">
                            +{dayEvents.length - 3} more
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        align="center"
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
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {accessToken && events.length === 0 && !loading && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <CalendarToday
              sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              No meetings found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Start by creating your first appointment or meeting
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Create First Meeting
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Events List */}
      {accessToken && events.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            📋 All Meetings ({events.length})
          </Typography>
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} md={6} lg={4} key={event.id}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {event.summary}
                        </Typography>
                        <Chip
                          size="small"
                          label={event.status || "confirmed"}
                          color={
                            event.status === "confirmed" ? "success" : "default"
                          }
                          sx={{ mb: 1 }}
                        />
                      </Box>
                      <IconButton
                        onClick={(e) =>
                          setAnchorEl({
                            element: e.currentTarget,
                            eventId: event.id,
                          })
                        }
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {formatEventDate(event.start.dateTime)}
                        </Typography>
                      </Box>

                      {event.location && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2">
                            {event.location}
                          </Typography>
                        </Box>
                      )}

                      {event.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 2,
                            p: 1,
                            bgcolor: "grey.50",
                            borderRadius: 1,
                            whiteSpace: "pre-line",
                            maxHeight: "100px",
                            overflow: "auto",
                          }}
                        >
                          {event.description}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Menu (Edit/Delete) */}
      <Menu
        anchorEl={anchorEl?.element}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            handleOpenDialog(events.find((e) => e.id === anchorEl.eventId));
            setAnchorEl(null);
          }}
        >
          <EditIcon sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteEvent(anchorEl.eventId);
            setAnchorEl(null);
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Meeting Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {selectedEvent ? <EditIcon /> : <AddIcon />}
            {selectedEvent ? "Edit Meeting" : "Create New Meeting"}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meeting Title *"
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Add meeting details, agenda, notes..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Start Time *"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="End Time *"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Office, Garage, Online Meeting, etc."
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>
                  <Typography variant="subtitle2">Customer Details</Typography>
                </Divider>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="email"
                  label="Customer Email"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Customer Phone"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  This meeting will be saved to your Google Calendar and sync
                  across all devices.
                </Alert>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<Close />}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={selectedEvent ? updateEvent : createEvent}
            startIcon={<Save />}
            disabled={
              !formData.summary || !formData.startTime || !formData.endTime
            }
          >
            {selectedEvent ? "Update Meeting" : "Save to Calendar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GoogleCalendar;
