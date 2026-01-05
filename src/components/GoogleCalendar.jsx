// src/components/Calendar/GoogleCalendar.jsx
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Event as EventIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";
import { addHours, format, parseISO } from "date-fns";
import { useState, useEffect } from "react";

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

  // ফর্ম স্টেট
  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    customerEmail: "",
    customerPhone: "",
  });

  // Check if client ID is available
  const checkGoogleConfig = () => {
    // This will be checked by GoogleOAuthProvider
    return true;
  };

  // Google লগইন
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/calendar",
    onSuccess: async (response) => {
      setLoading(true);
      const token = response.access_token;
      setAccessToken(token);
      localStorage.setItem("google_access_token", token);

      try {
        await fetchUserProfile(token);
        await fetchCalendarEvents(token);
        showNotification("সফলভাবে লগইন হয়েছে", "success");
      } catch (error) {
        console.error("Login error:", error);
        showNotification("লগইন সম্পূর্ণ করতে সমস্যা হয়েছে", "error");
        logout();
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      showNotification("লগইন ব্যর্থ হয়েছে", "error");
      setLoading(false);
    },
    onNonOAuthError: (error) => {
      console.error("Non-OAuth error:", error);
      showNotification("সিস্টেমে সমস্যা হয়েছে", "error");
      setLoading(false);
    },
  });

  // লগআউট ফাংশন
  const logout = () => {
    googleLogout();
    setAccessToken(null);
    setUserProfile(null);
    setEvents([]);
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

  // ক্যালেন্ডার ইভেন্ট ফেচ
  const fetchCalendarEvents = async (token) => {
    try {
      const now = new Date();
      const timeMin = now.toISOString();
      const timeMax = addHours(now, 168).toISOString(); // পরের ১ সপ্তাহ

      const { data } = await axios.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: "startTime",
          },
        }
      );

      setEvents(data.items || []);
    } catch (error) {
      console.error("Events fetch error:", error);
      if (error.response?.status === 401) {
        // Token expired
        showNotification("সেশন শেষ হয়েছে, পুনরায় লগইন করুন", "warning");
        logout();
      } else {
        showNotification("ইভেন্ট লোড করতে সমস্যা হয়েছে", "error");
      }
      throw error;
    }
  };

  // নতুন ইভেন্ট তৈরি
  const createEvent = async () => {
    if (!accessToken) {
      showNotification("প্রথমে Google এ লগইন করুন", "warning");
      return;
    }

    if (!formData.summary || !formData.startTime || !formData.endTime) {
      showNotification("সময় এবং শিরোনাম পূরণ করুন", "warning");
      return;
    }

    try {
      const event = {
        summary: formData.summary,
        description: `${formData.description}\n\nগ্রাহক তথ্য:\nইমেইল: ${formData.customerEmail}\nফোন: ${formData.customerPhone}`,
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
      showNotification("মিটিং সফলভাবে বুক করা হয়েছে", "success");
    } catch (error) {
      console.error("Event creation error:", error);
      if (error.response?.status === 401) {
        showNotification("সেশন শেষ হয়েছে, পুনরায় লগইন করুন", "warning");
        logout();
      } else {
        showNotification("মিটিং বুক করতে সমস্যা হয়েছে", "error");
      }
    }
  };

  // ইভেন্ট আপডেট
  const updateEvent = async () => {
    if (!selectedEvent) return;

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
      showNotification("মিটিং আপডেট করা হয়েছে", "success");
    } catch (error) {
      console.error("Update error:", error);
      showNotification("আপডেট করতে সমস্যা হয়েছে", "error");
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
      showNotification("মিটিং ডিলিট করা হয়েছে", "success");
    } catch (error) {
      console.error("Delete error:", error);
      showNotification("ডিলিট করতে সমস্যা হয়েছে", "error");
    }
  };

  // ফর্ম রিসেট
  const resetForm = () => {
    setFormData({
      summary: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      customerEmail: "",
      customerPhone: "",
    });
    setSelectedEvent(null);
  };

  // নোটিফিকেশন শো
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // ডায়ালোগ ওপেন
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
      });
    } else {
      // Set default times for new event
      const now = new Date();
      const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 2 hours from now

      setFormData({
        ...formData,
        startTime: startTime.toISOString().slice(0, 16),
        endTime: endTime.toISOString().slice(0, 16),
      });
    }
    setOpenDialog(true);
  };

  // Load events on component mount if token exists
  useEffect(() => {
    if (accessToken) {
      fetchCalendarEvents(accessToken);
    }
  }, [accessToken]);

  return (
    <Box sx={{ p: 3 }}>
      {/* হেডার */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          মিটিং ক্যালেন্ডার
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {!accessToken ? (
            <Button
              variant="contained"
              startIcon={<EventIcon />}
              onClick={() => login()}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                "Google Calendar সংযুক্ত করুন"
              )}
            </Button>
          ) : (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {userProfile?.email}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ mr: 1 }}
              >
                নতুন মিটিং
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => fetchCalendarEvents(accessToken)}
                sx={{ mr: 1 }}
              >
                রিফ্রেশ
              </Button>
              <Button variant="outlined" color="error" onClick={logout}>
                লগআউট
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* কনফিগারেশন Error */}
      {!checkGoogleConfig() && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Google OAuth কনফিগার করা হয়নি। .env ফাইলে VITE_GOOGLE_CLIENT_ID যোগ
          করুন।
        </Alert>
      )}

      {/* লোডিং স্টেট */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* ইভেন্ট লিস্ট */}
      {accessToken && events.length === 0 && !loading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          কোন মিটিং পাওয়া যায়নি। নতুন মিটিং যোগ করুন।
        </Alert>
      )}

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" gutterBottom>
                    {event.summary}
                  </Typography>
                  <IconButton
                    onClick={(e) =>
                      setAnchorEl({
                        element: e.currentTarget,
                        eventId: event.id,
                      })
                    }
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Typography color="textSecondary" gutterBottom>
                  {format(parseISO(event.start.dateTime), "PPpp")}
                </Typography>

                {event.location && (
                  <Typography variant="body2" gutterBottom>
                    📍 {event.location}
                  </Typography>
                )}

                {event.description && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, whiteSpace: "pre-line" }}
                  >
                    {event.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* মেনু (Edit/Delete) */}
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
          <EditIcon sx={{ mr: 1 }} /> এডিট
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteEvent(anchorEl.eventId);
            setAnchorEl(null);
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon sx={{ mr: 1 }} /> ডিলিট
        </MenuItem>
      </Menu>

      {/* মিটিং ক্রিয়েট/এডিট ডায়ালোগ */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedEvent ? "মিটিং এডিট করুন" : "নতুন মিটিং বুক করুন"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="মিটিং টাইটেল"
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="বিস্তারিত"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="শুরুর সময়"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="শেষের সময়"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="লোকেশন"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              sx={{ mt: 2, mb: 2 }}
            />

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              গ্রাহক তথ্য (ঐচ্ছিক)
            </Typography>

            <TextField
              fullWidth
              type="email"
              label="গ্রাহকের ইমেইল"
              value={formData.customerEmail}
              onChange={(e) =>
                setFormData({ ...formData, customerEmail: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="গ্রাহকের ফোন নম্বর"
              value={formData.customerPhone}
              onChange={(e) =>
                setFormData({ ...formData, customerPhone: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>বাতিল</Button>
          <Button
            variant="contained"
            onClick={selectedEvent ? updateEvent : createEvent}
            disabled={
              !formData.summary || !formData.startTime || !formData.endTime
            }
          >
            {selectedEvent ? "আপডেট" : "বুক করুন"}
          </Button>
        </DialogActions>
      </Dialog>

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
