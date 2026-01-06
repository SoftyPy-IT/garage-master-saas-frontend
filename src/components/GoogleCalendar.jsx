/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-unused-vars */
// src/components/Calendar/GoogleCalendar.jsx
import {
  Add as AddIcon,
  Event as EventIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { addHours, format, parseISO } from "date-fns";
import { useState } from "react";

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

  // Google লগইন - Updated with better error handling
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/calendar",
    onSuccess: async (response) => {
      setLoading(true);
      setErrorDetails(null);
      const token = response.access_token;
      setAccessToken(token);
      localStorage.setItem("google_access_token", token);

      try {
        await fetchUserProfile(token);
        await fetchCalendarEvents(token);
        showNotification("সফলভাবে লগইন হয়েছে", "success");
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
    flow: "implicit", // Add this line
  });

  // Enhanced error handling
  const handleGoogleError = (error) => {
    console.error("Google API Error:", error);

    if (error.response) {
      // HTTP errors
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
      // Network errors
      setErrorDetails({
        type: "network_error",
        message: "Network error. Please check internet connection.",
        details: error.request,
      });
    } else {
      // Other errors
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

  // ক্যালেন্ডার ইভেন্ট ফেচ
  const fetchCalendarEvents = async (token) => {
    try {
      const now = new Date();
      const timeMin = now.toISOString();
      const timeMax = addHours(now, 168).toISOString();

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
      handleGoogleError(error);
      throw error;
    }
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
      });
    }
    setOpenDialog(true);
  };

  // Event creation and update functions remain same...

  return (
    <Box sx={{ p: 3 }}>
      {/* হেডার */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
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
              <Chip
                label={userProfile?.email || "User"}
                variant="outlined"
                color="primary"
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                নতুন মিটিং
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => fetchCalendarEvents(accessToken)}
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
              Google Console
            </Button>
            <Button variant="outlined" size="small" onClick={clearError}>
              Close
            </Button>
          </Box>
        </Alert>
      )}

      {/* Quick Fix Instructions */}
      {errorDetails?.type === "access_denied" && (
        <Card sx={{ mb: 3, border: "1px solid #ff9800" }}>
          <CardContent>
            <Typography variant="h6" color="warning.main" gutterBottom>
              🔧 Quick Fix Instructions
            </Typography>
            <Box component="ol" sx={{ pl: 2 }}>
              <li>
                <strong>Go to:</strong>
                <a
                  href="https://console.cloud.google.com/apis/credentials/consent"
                  target="_blank"
                  style={{ marginLeft: "5px" }}
                >
                  Google Cloud Console → OAuth consent screen
                </a>
              </li>
              <li>
                <strong>Scroll to Test users section</strong>
              </li>
              <li>
                <strong>Click ADD USERS</strong>
              </li>
              <li>
                <strong>Add this email:</strong> ibrahimsikder5033@gmail.com
              </li>
              <li>
                <strong>Click SAVE</strong>
              </li>
              <li>
                <strong>Wait 2-5 minutes</strong> then try again
              </li>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
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

      {/* Rest of the component remains same... */}
    </Box>
  );
};

export default GoogleCalendar;
