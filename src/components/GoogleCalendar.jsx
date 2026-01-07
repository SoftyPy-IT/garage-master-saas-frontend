/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-case-declarations */
/* eslint-disable no-useless-catch */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-unused-vars */
// src/components/Calendar/GoogleCalendar.jsx
import {
  Add as AddIcon,
  Build,
  CalendarToday,
  Call,
  CarRepair,
  ChevronLeft,
  ChevronRight,
  Close,
  Delete as DeleteIcon,
  DirectionsCar,
  Download,
  Edit as EditIcon,
  Email,
  Event as EventIcon,
  LocalGasStation,
  LocationOn,
  MoreVert as MoreVertIcon,
  Notifications,
  Person,
  Print,
  Refresh as RefreshIcon,
  Save,
  Settings,
  Share,
  Today as TodayIcon,
  ViewList,
  ViewWeek,
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
  Fab,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Switch,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import { useEffect, useState } from "react";

// Service types for garage management
const SERVICE_TYPES = [
  {
    id: 1,
    name: "Oil Change",
    icon: <LocalGasStation />,
    duration: 1,
    color: "#4CAF50",
  },
  {
    id: 2,
    name: "Brake Service",
    icon: <DirectionsCar />,
    duration: 2,
    color: "#FF9800",
  },
  {
    id: 3,
    name: "Engine Repair",
    icon: <Build />,
    duration: 4,
    color: "#F44336",
  },
  {
    id: 4,
    name: "Tire Replacement",
    icon: <DirectionsCar />,
    duration: 2,
    color: "#2196F3",
  },
  { id: 5, name: "AC Service", icon: <Build />, duration: 3, color: "#9C27B0" },
  {
    id: 6,
    name: "Battery Check",
    icon: <Build />,
    duration: 1,
    color: "#FFEB3B",
  },
  {
    id: 7,
    name: "Wheel Alignment",
    icon: <DirectionsCar />,
    duration: 2,
    color: "#795548",
  },
  {
    id: 8,
    name: "Full Service",
    icon: <CarRepair />,
    duration: 6,
    color: "#607D8B",
  },
];

const GoogleCalendar = () => {
  // State Management
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
  const [viewMode, setViewMode] = useState("list");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [configHelpOpen, setConfigHelpOpen] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 0,
    todayEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
  });

  // Form State
  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    customerEmail: "",
    customerPhone: "",
    customerName: "",
    customerAddress: "",
    vehicleType: "car",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
    serviceType: "",
    serviceNotes: "",
    priority: "medium",
    reminder: "30",
    sendEmail: true,
    status: "scheduled",
    assignedTo: "",
    estimatedCost: "",
  });

  // Calendar Navigation
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  });

  // Configuration details
  const CONFIG = {
    projectId: "731493911262",
    clientId:
      "731493911262-b4vutijvnt9bgdvgu6m1ai7g0nsno7vl.apps.googleusercontent.com",
    adminEmail: "softypyit@gmail.com",
    userEmail: "ibrahimsikder5033@gmail.com",
    domains: ["trustautosolution.com", "worldautosolution.com"],
    redirectUris: [
      "https://garage.trustautosolution.com",
      "https://garage.worldautosolution.com",
      "https://trustautosolution.com",
    ],
  };

  // Google Login with all required scopes
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
      console.log("✅ Login successful, token received");
      setLoading(true);
      setErrorDetails(null);
      const token = response.access_token;
      setAccessToken(token);
      localStorage.setItem("google_access_token", token);

      try {
        console.log("Fetching user profile...");
        await fetchUserProfile(token);
        console.log("Fetching calendar events...");
        await fetchCalendarEvents(token);
        showNotification(
          "✅ Successfully connected to Google Calendar!",
          "success"
        );
      } catch (error) {
        console.error("Login process error:", error);
        handleGoogleError(error);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("❌ Google login error:", error);

      // Check specific error types
      if (error.error === "access_denied") {
        setErrorDetails({
          type: "test_user_required",
          message: "Your email needs to be added as a Test User",
          details: [
            `Please ask ${CONFIG.adminEmail} to add your email as a test user`,
            "Then wait 5 minutes and try again",
          ],
        });
        setConfigHelpOpen(true);
      } else {
        setErrorDetails({
          type: "login_error",
          message: "Login failed",
          details: error.message || "Unknown error",
        });
      }

      showNotification("❌ Login failed. Check configuration.", "error");
      setLoading(false);
    },
    flow: "implicit",
  });

  // Handle Google API Errors
  const handleGoogleError = (error) => {
    console.error("Google API Error:", error);

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          setErrorDetails({
            type: "bad_request",
            message: "Invalid request",
            details: data.error?.message || "Bad request",
          });
          break;

        case 401:
          setErrorDetails({
            type: "unauthorized",
            message: "Session expired",
            details: "Please login again",
          });
          logout();
          break;

        case 403:
          const errorMsg = data.error?.message || "";
          if (
            errorMsg.includes(
              "has not completed the Google verification process"
            )
          ) {
            setErrorDetails({
              type: "test_user_required",
              message: "Test User Configuration Required",
              details: [
                `Your email (${CONFIG.userEmail}) is not in test users list`,
                `Please contact ${CONFIG.adminEmail} to add your email`,
              ],
            });
            setConfigHelpOpen(true);
          } else if (errorMsg.includes("access_denied")) {
            setErrorDetails({
              type: "access_denied",
              message: "Access Denied",
              details: [
                "Your email is not authorized",
                "Please make sure it's added as a test user",
              ],
            });
            setConfigHelpOpen(true);
          } else {
            setErrorDetails({
              type: "forbidden",
              message: "Access Forbidden",
              details: errorMsg,
            });
          }
          break;

        case 404:
          setErrorDetails({
            type: "not_found",
            message: "Resource not found",
            details: "The requested calendar resource was not found",
          });
          break;

        default:
          setErrorDetails({
            type: "server_error",
            message: "Server Error",
            details: `Status: ${status}, Message: ${errorMsg}`,
          });
      }
    } else if (error.request) {
      setErrorDetails({
        type: "network_error",
        message: "Network Error",
        details: "No response received from Google API",
      });
    } else {
      setErrorDetails({
        type: "unknown_error",
        message: "Unknown Error",
        details: error.message || "Something went wrong",
      });
    }
  };

  // Logout Function
  const logout = () => {
    googleLogout();
    setAccessToken(null);
    setUserProfile(null);
    setEvents([]);
    setErrorDetails(null);
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("google_user_profile");
    showNotification("Logged out successfully", "info");
  };

  // Fetch User Profile
  const fetchUserProfile = async (token) => {
    try {
      const { data } = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("User profile fetched:", data.email);
      setUserProfile(data);
      localStorage.setItem("google_user_profile", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw error;
    }
  };

  // Fetch Calendar Events
  const fetchCalendarEvents = async (token) => {
    try {
      console.log("Fetching calendar events...");
      const now = new Date();
      const timeMin = addDays(now, -30).toISOString();
      const timeMax = addDays(now, 90).toISOString();

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

      console.log(`Found ${data.items?.length || 0} events`);

      const formattedEvents =
        data.items?.map((event) => ({
          ...event,
          isGarageEvent:
            event.description?.includes("Created via: Trust Auto Solution") ||
            false,
          serviceType: extractServiceType(event.description),
          customerInfo: extractCustomerInfo(event.description),
        })) || [];

      setEvents(formattedEvents);
      updateStats(formattedEvents);
      return formattedEvents;
    } catch (error) {
      console.error("Events fetch error:", error);
      handleGoogleError(error);
      throw error;
    }
  };

  // Extract Service Type from Description
  const extractServiceType = (description) => {
    if (!description) return "General";
    const service = SERVICE_TYPES.find((service) =>
      description.toLowerCase().includes(service.name.toLowerCase())
    );
    return service?.name || "General";
  };

  // Extract Customer Info from Description
  const extractCustomerInfo = (description) => {
    if (!description) return {};
    const lines = description.split("\n");
    const info = {};
    lines.forEach((line) => {
      if (line.includes("Name:")) info.name = line.split("Name:")[1]?.trim();
      if (line.includes("Phone:")) info.phone = line.split("Phone:")[1]?.trim();
      if (line.includes("Email:")) info.email = line.split("Email:")[1]?.trim();
      if (line.includes("Vehicle:"))
        info.vehicle = line.split("Vehicle:")[1]?.trim();
    });
    return info;
  };

  // Update Statistics
  const updateStats = (eventsList) => {
    const now = new Date();
    const today = format(now, "yyyy-MM-dd");

    const totalEvents = eventsList.length;
    const todayEvents = eventsList.filter((event) =>
      event.start?.dateTime?.includes(today)
    ).length;
    const upcomingEvents = eventsList.filter(
      (event) => new Date(event.start?.dateTime) > now
    ).length;
    const completedEvents = eventsList.filter(
      (event) => new Date(event.end?.dateTime) < now
    ).length;

    setStats({
      totalEvents,
      todayEvents,
      upcomingEvents,
      completedEvents,
    });
  };

  // Create Event
  const createEvent = async () => {
    if (!accessToken) {
      showNotification("Please login first", "warning");
      return;
    }

    if (!formData.summary || !formData.startTime || !formData.endTime) {
      showNotification("Please fill all required fields", "warning");
      return;
    }

    try {
      setLoading(true);

      // Build event description
      let description = formData.description || "";

      // Add customer details
      description += `\n\n--- Customer Details ---\n`;
      if (formData.customerName)
        description += `Name: ${formData.customerName}\n`;
      if (formData.customerPhone)
        description += `Phone: ${formData.customerPhone}\n`;
      if (formData.customerEmail)
        description += `Email: ${formData.customerEmail}\n`;
      if (formData.customerAddress)
        description += `Address: ${formData.customerAddress}\n`;

      // Add vehicle details
      description += `\n--- Vehicle Details ---\n`;
      description += `Type: ${formData.vehicleType}\n`;
      if (formData.vehicleModel)
        description += `Model: ${formData.vehicleModel}\n`;
      if (formData.vehicleYear)
        description += `Year: ${formData.vehicleYear}\n`;
      if (formData.licensePlate)
        description += `License Plate: ${formData.licensePlate}\n`;

      // Add service details
      description += `\n--- Service Details ---\n`;
      if (formData.serviceType)
        description += `Service: ${formData.serviceType}\n`;
      if (formData.serviceNotes)
        description += `Notes: ${formData.serviceNotes}\n`;
      if (formData.priority) description += `Priority: ${formData.priority}\n`;
      if (formData.estimatedCost)
        description += `Estimated Cost: $${formData.estimatedCost}\n`;

      description += `\nCreated via: Trust Auto Solution`;
      description += `\nStatus: ${formData.status}`;
      if (formData.assignedTo)
        description += `\nAssigned To: ${formData.assignedTo}`;

      const event = {
        summary: formData.summary,
        description: description,
        start: {
          dateTime: formData.startTime,
          timeZone: "Asia/Dhaka",
        },
        end: {
          dateTime: formData.endTime,
          timeZone: "Asia/Dhaka",
        },
        location: formData.location || "Trust Auto Solution Garage",
        attendees: formData.customerEmail
          ? [{ email: formData.customerEmail }]
          : [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: parseInt(formData.reminder) || 30 },
            { method: "popup", minutes: 10 },
          ],
        },
      };

      console.log("Creating event:", event);

      const response = await axios.post(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        event,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Event created:", response.data);

      // Add to local state
      const newEvent = {
        ...response.data,
        isGarageEvent: true,
        serviceType: formData.serviceType,
        customerInfo: {
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail,
        },
      };

      setEvents((prev) => [newEvent, ...prev]);
      updateStats([newEvent, ...events]);

      setOpenDialog(false);
      resetForm();
      showNotification("✅ Appointment booked successfully!", "success");
    } catch (error) {
      console.error("Event creation error:", error);
      handleGoogleError(error);
      showNotification("❌ Failed to create appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update Event
  const updateEvent = async () => {
    if (!selectedEvent) return;

    try {
      setLoading(true);

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
      showNotification("✅ Appointment updated successfully!", "success");
    } catch (error) {
      console.error("Update error:", error);
      showNotification("❌ Failed to update appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete Event
  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      updateStats(events.filter((event) => event.id !== eventId));
      showNotification("🗑️ Appointment deleted successfully!", "success");
    } catch (error) {
      console.error("Delete error:", error);
      showNotification("❌ Failed to delete appointment", "error");
    }
  };

  // Quick Create Templates
  const quickCreateEvent = (type) => {
    const now = new Date();
    let startTime, endTime, template;

    switch (type) {
      case "oil_change":
        startTime = new Date(now.getTime() + 60 * 60 * 1000);
        endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        template = {
          summary: "Oil Change Service",
          description: "Regular oil change and filter replacement",
          serviceType: "Oil Change",
          vehicleType: "car",
          priority: "medium",
        };
        break;
      case "brake_service":
        startTime = new Date(now.getTime() + 120 * 60 * 1000);
        endTime = new Date(startTime.getTime() + 120 * 60 * 1000);
        template = {
          summary: "Brake Service",
          description: "Brake pad replacement and inspection",
          serviceType: "Brake Service",
          vehicleType: "car",
          priority: "high",
        };
        break;
      case "full_service":
        startTime = new Date(now.getTime() + 180 * 60 * 1000);
        endTime = new Date(startTime.getTime() + 360 * 60 * 1000);
        template = {
          summary: "Full Vehicle Service",
          description: "Complete vehicle inspection and servicing",
          serviceType: "Full Service",
          vehicleType: "car",
          priority: "medium",
        };
        break;
      default:
        startTime = new Date(now.getTime() + 60 * 60 * 1000);
        endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        template = {
          summary: "Vehicle Service Appointment",
          description: "General vehicle service",
          serviceType: "General",
          vehicleType: "car",
          priority: "medium",
        };
    }

    setFormData({
      ...formData,
      ...template,
      startTime: startTime.toISOString().slice(0, 16),
      endTime: endTime.toISOString().slice(0, 16),
    });

    setOpenDialog(true);
  };

  // Export Events
  const exportEvents = () => {
    if (events.length === 0) {
      showNotification("No events to export", "warning");
      return;
    }

    const exportData = events.map((event) => ({
      Title: event.summary,
      Date: event.start?.dateTime
        ? format(parseISO(event.start.dateTime), "PPpp")
        : "N/A",
      Location: event.location || "N/A",
      Description: event.description || "N/A",
      Status: event.status || "scheduled",
      Service: event.serviceType || "General",
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(","),
      ...exportData.map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `garage-appointments-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();

    showNotification("📥 Events exported successfully!", "success");
  };

  // Print Schedule
  const printSchedule = () => {
    if (events.length === 0) {
      showNotification("No events to print", "warning");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Garage Appointment Schedule</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .stats { background: #f8f9fa; padding: 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Trust Auto Solution - Appointment Schedule</h1>
            <div class="stats">
              <p>Generated: ${format(new Date(), "PPpp")}</p>
              <p>Total Appointments: ${stats.totalEvents}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Service</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${events
                .map(
                  (event) => `
                <tr>
                  <td>${
                    event.start?.dateTime
                      ? format(parseISO(event.start.dateTime), "PPpp")
                      : "N/A"
                  }</td>
                  <td>${event.summary}</td>
                  <td>${event.customerInfo?.name || "N/A"}</td>
                  <td>${event.customerInfo?.vehicle || "N/A"}</td>
                  <td>${event.status || "scheduled"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Reset Form
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
      customerAddress: "",
      vehicleType: "car",
      vehicleModel: "",
      vehicleYear: "",
      licensePlate: "",
      serviceType: "",
      serviceNotes: "",
      priority: "medium",
      reminder: "30",
      sendEmail: true,
      status: "scheduled",
      assignedTo: "",
      estimatedCost: "",
    });
    setSelectedEvent(null);
  };

  // Show Notification
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Open Dialog
  const handleOpenDialog = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      const customerInfo = extractCustomerInfo(event.description);
      setFormData({
        ...formData,
        summary: event.summary || "",
        description: event.description || "",
        startTime: event.start?.dateTime || "",
        endTime: event.end?.dateTime || "",
        location: event.location || "",
        customerEmail: customerInfo.email || "",
        customerPhone: customerInfo.phone || "",
        customerName: customerInfo.name || "",
        serviceType: extractServiceType(event.description),
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

  // Clear Error
  const clearError = () => {
    setErrorDetails(null);
  };

  // Navigation Functions
  const goToToday = () => setCurrentDate(new Date());
  const goToPrevious = () => {
    if (viewMode === "week") setCurrentDate((prev) => subDays(prev, 7));
    else if (viewMode === "month") setCurrentDate((prev) => subMonths(prev, 1));
    else setCurrentDate((prev) => subDays(prev, 1));
  };
  const goToNext = () => {
    if (viewMode === "week") setCurrentDate((prev) => addDays(prev, 7));
    else if (viewMode === "month") setCurrentDate((prev) => addMonths(prev, 1));
    else setCurrentDate((prev) => addDays(prev, 1));
  };

  // Get Events for Day
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

  // Configuration Help Component
  const ConfigHelpDialog = () => (
    <Dialog
      open={configHelpOpen}
      onClose={() => setConfigHelpOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Settings /> Configuration Help
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ pt: 2 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6">
              Test User Configuration Required
            </Typography>
          </Alert>

          <Typography variant="h6" gutterBottom>
            📋 Your Configuration Details:
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Project ID
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {CONFIG.projectId}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Client ID
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                    {CONFIG.clientId}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Admin Email
                  </Typography>
                  <Typography variant="body1">{CONFIG.adminEmail}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Your Email
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    {CONFIG.userEmail}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            📝 Step-by-Step Fix:
          </Typography>

          <Box component="ol" sx={{ pl: 2, mb: 3 }}>
            <Box component="li" sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Step 1: Login to Google Cloud Console
              </Typography>
              <Typography variant="body2">
                Use: <strong>{CONFIG.adminEmail}</strong>
              </Typography>
            </Box>

            <Box component="li" sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Step 2: Go to OAuth consent screen
              </Typography>
              <Typography variant="body2">
                Project: <strong>{CONFIG.projectId}</strong>
              </Typography>
            </Box>

            <Box component="li" sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Step 3: Scroll to Test users section
              </Typography>
              <Typography variant="body2">
                Click <strong>ADD USERS</strong>
              </Typography>
            </Box>

            <Box component="li" sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Step 4: Add these emails:
              </Typography>
              <Box sx={{ pl: 2, mt: 1 }}>
                <Typography variant="body2" color="primary">
                  • {CONFIG.userEmail}
                </Typography>
                <Typography variant="body2">• {CONFIG.adminEmail}</Typography>
              </Box>
            </Box>

            <Box component="li" sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Step 5: Save and wait</Typography>
              <Typography variant="body2">
                Click <strong>SAVE</strong> and wait 5 minutes
              </Typography>
            </Box>

            <Box component="li">
              <Typography variant="subtitle1">
                Step 6: Come back and try again
              </Typography>
              <Typography variant="body2">
                Refresh this page and click Connect Google Calendar
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              href={`https://console.cloud.google.com/apis/credentials/consent?project=${CONFIG.projectId}`}
              target="_blank"
              startIcon={<Settings />}
            >
              Open Google Console
            </Button>

            <Button
              variant="outlined"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              Clear Cache & Refresh
            </Button>

            <Button variant="outlined" onClick={() => setConfigHelpOpen(false)}>
              Close
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
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
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <CarRepair /> Garage Appointment Calendar
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage vehicle service appointments and customer meetings
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
              color="primary"
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

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  New Appointment
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

      {/* User Info Card */}
      {userProfile && (
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
                <Avatar
                  src={userProfile.picture}
                  sx={{ width: 60, height: 60 }}
                />
                <Box>
                  <Typography variant="h6">
                    Welcome, {userProfile.name}!
                  </Typography>
                  <Typography variant="body2">
                    {userProfile.email} | Connected to Google Calendar
                  </Typography>
                </Box>
              </Box>
              <Chip
                label="Connected"
                color="success"
                sx={{ color: "white", bgcolor: "success.main" }}
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      {accessToken && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="primary">
                  {stats.totalEvents}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="success.main">
                  {stats.todayEvents}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Todays Appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="warning.main">
                  {stats.upcomingEvents}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Upcoming Appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h3" color="info.main">
                  {stats.completedEvents}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Completed Services
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Error Display */}
      {errorDetails && (
        <Alert
          severity={
            errorDetails.type === "test_user_required" ? "warning" : "error"
          }
          sx={{ mb: 3 }}
          icon={<WarningIcon />}
          onClose={clearError}
          action={
            errorDetails.type === "test_user_required" && (
              <Button
                color="inherit"
                size="small"
                onClick={() => setConfigHelpOpen(true)}
              >
                Fix Now
              </Button>
            )
          }
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
              {errorDetails.details}
            </Typography>
          )}
        </Alert>
      )}

      {/* Configuration Help Button */}
      {!accessToken && (
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Button
            variant="text"
            onClick={() => setConfigHelpOpen(true)}
            startIcon={<Settings />}
            sx={{ textDecoration: "underline" }}
          >
            Need help with configuration? Click here
          </Button>
        </Box>
      )}

      {/* Quick Actions */}
      {accessToken && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">⚡ Quick Service Booking</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<Download />}
                  onClick={exportEvents}
                  disabled={events.length === 0}
                >
                  Export
                </Button>
                <Button
                  size="small"
                  startIcon={<Print />}
                  onClick={printSchedule}
                  disabled={events.length === 0}
                >
                  Print
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2}>
              {SERVICE_TYPES.slice(0, 8).map((service) => (
                <Grid item xs={6} sm={4} md={3} lg={2.4} key={service.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      border: "2px solid",
                      borderColor:
                        selectedService?.id === service.id
                          ? service.color
                          : "transparent",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        transition: "transform 0.2s",
                      },
                    }}
                    onClick={() => {
                      setSelectedService(service);
                      quickCreateEvent(
                        service.name.toLowerCase().replace(" ", "_")
                      );
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 2 }}>
                      <Box sx={{ color: service.color, mb: 1 }}>
                        {service.icon}
                      </Box>
                      <Typography variant="body2" fontWeight="medium">
                        {service.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {service.duration} hour{service.duration > 1 ? "s" : ""}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Calendar Navigation */}
      {accessToken && (
        <Paper sx={{ p: 2, mb: 3 }}>
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

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="day">Day</ToggleButton>
              <ToggleButton value="week">
                <ViewWeek />
              </ToggleButton>
              <ToggleButton value="month">Month</ToggleButton>
              <ToggleButton value="list">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Week View */}
          {viewMode === "week" && (
            <Grid container spacing={1}>
              {weekDays.map((day, index) => {
                const dayEvents = getEventsForDay(day);
                return (
                  <Grid item xs key={index}>
                    <Card
                      sx={{
                        height: "300px",
                        overflow: "auto",
                        bgcolor: isSameDay(day, new Date())
                          ? "primary.50"
                          : "white",
                      }}
                    >
                      <CardContent sx={{ p: 1 }}>
                        <Typography
                          variant="subtitle2"
                          align="center"
                          sx={{
                            fontWeight: "bold",
                            color: isSameDay(day, new Date())
                              ? "primary.main"
                              : "inherit",
                          }}
                        >
                          {format(day, "EEE")}
                        </Typography>
                        <Typography
                          variant="body2"
                          align="center"
                          sx={{
                            color: isSameDay(day, new Date())
                              ? "primary.main"
                              : "text.secondary",
                          }}
                        >
                          {format(day, "d")}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        {dayEvents.length > 0 ? (
                          <Box>
                            {dayEvents.map((event) => (
                              <Card
                                key={event.id}
                                sx={{
                                  p: 1,
                                  mb: 1,
                                  bgcolor: event.isGarageEvent
                                    ? "primary.light"
                                    : "grey.100",
                                  cursor: "pointer",
                                  "&:hover": {
                                    bgcolor: event.isGarageEvent
                                      ? "primary.main"
                                      : "grey.200",
                                  },
                                }}
                                onClick={() => handleOpenDialog(event)}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{ color: "white" }}
                                >
                                  {format(
                                    parseISO(event.start.dateTime),
                                    "h:mm a"
                                  )}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: "bold",
                                    color: event.isGarageEvent
                                      ? "white"
                                      : "inherit",
                                  }}
                                >
                                  {event.summary}
                                </Typography>
                                {event.isGarageEvent && (
                                  <Chip
                                    size="small"
                                    label={event.serviceType || "Service"}
                                    sx={{
                                      mt: 0.5,
                                      color: "white",
                                      bgcolor: "primary.dark",
                                    }}
                                  />
                                )}
                              </Card>
                            ))}
                          </Box>
                        ) : (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            align="center"
                            sx={{ mt: 2 }}
                          >
                            No appointments
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* List View (Default) */}
          {viewMode === "list" && (
            <>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{ mb: 2 }}
              >
                <Tab label="All Appointments" />
                <Tab label="Today" />
                <Tab label="Upcoming" />
                <Tab label="Completed" />
              </Tabs>

              {events.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CalendarToday
                    sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    No appointments found
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 3 }}
                  >
                    Create your first vehicle service appointment
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                  >
                    Create First Appointment
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {events
                    .filter((event) => {
                      const now = new Date();
                      const eventDate = new Date(event.start?.dateTime);
                      if (activeTab === 1) return isSameDay(eventDate, now);
                      if (activeTab === 2) return eventDate > now;
                      if (activeTab === 3) return eventDate < now;
                      return true;
                    })
                    .map((event) => (
                      <Grid item xs={12} key={event.id}>
                        <Card>
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                              }}
                            >
                              <Box sx={{ flex: 1 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="h6">
                                    {event.summary}
                                  </Typography>
                                  {event.isGarageEvent && (
                                    <Chip
                                      size="small"
                                      label="Garage Service"
                                      color="primary"
                                      icon={<CarRepair />}
                                    />
                                  )}
                                  <Chip
                                    size="small"
                                    label={event.status || "scheduled"}
                                    color={
                                      event.status === "completed"
                                        ? "success"
                                        : event.status === "cancelled"
                                        ? "error"
                                        : "default"
                                    }
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    flexWrap: "wrap",
                                    mb: 1,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <CalendarToday
                                      fontSize="small"
                                      color="action"
                                    />
                                    <Typography variant="body2">
                                      {format(
                                        parseISO(event.start.dateTime),
                                        "PPpp"
                                      )}
                                    </Typography>
                                  </Box>

                                  {event.location && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                      }}
                                    >
                                      <LocationOn
                                        fontSize="small"
                                        color="action"
                                      />
                                      <Typography variant="body2">
                                        {event.location}
                                      </Typography>
                                    </Box>
                                  )}

                                  {event.serviceType && (
                                    <Chip
                                      size="small"
                                      label={event.serviceType}
                                      variant="outlined"
                                    />
                                  )}
                                </Box>

                                {event.customerInfo?.name && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      mb: 1,
                                    }}
                                  >
                                    <Person fontSize="small" color="action" />
                                    <Typography variant="body2">
                                      Customer: {event.customerInfo.name}
                                      {event.customerInfo.phone &&
                                        ` | ${event.customerInfo.phone}`}
                                      {event.customerInfo.email &&
                                        ` | ${event.customerInfo.email}`}
                                    </Typography>
                                  </Box>
                                )}

                                {event.description && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mt: 1,
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
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              )}
            </>
          )}
        </Paper>
      )}

      {/* Appointment Creation/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {selectedEvent ? <EditIcon /> : <AddIcon />}
            {selectedEvent ? "Edit Appointment" : "Create New Appointment"}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ pt: 2 }}>
            <Stepper activeStep={0} sx={{ mb: 3 }}>
              <Step>
                <StepLabel>Appointment Details</StepLabel>
              </Step>
              <Step>
                <StepLabel>Customer Information</StepLabel>
              </Step>
              <Step>
                <StepLabel>Service Details</StepLabel>
              </Step>
            </Stepper>

            <Grid container spacing={2}>
              {/* Appointment Details */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <EventIcon /> Appointment Details
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Appointment Title *"
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  required
                  placeholder="e.g., Oil Change Service, Brake Repair"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description & Notes"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the service needed, special instructions, notes..."
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
                  placeholder="Garage location, workshop, or online meeting link"
                />
              </Grid>

              {/* Customer Information */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Person /> Customer Information
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Customer Phone"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Customer Address"
                  value={formData.customerAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customerAddress: e.target.value,
                    })
                  }
                />
              </Grid>

              {/* Vehicle Details */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <DirectionsCar /> Vehicle Details
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Vehicle Type</InputLabel>
                  <Select
                    value={formData.vehicleType}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleType: e.target.value })
                    }
                    label="Vehicle Type"
                  >
                    <MenuItem value="car">Car</MenuItem>
                    <MenuItem value="motorcycle">Motorcycle</MenuItem>
                    <MenuItem value="truck">Truck</MenuItem>
                    <MenuItem value="bus">Bus</MenuItem>
                    <MenuItem value="van">Van</MenuItem>
                    <MenuItem value="suv">SUV</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Vehicle Model"
                  value={formData.vehicleModel}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleModel: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Vehicle Year"
                  value={formData.vehicleYear}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleYear: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="License Plate"
                  value={formData.licensePlate}
                  onChange={(e) =>
                    setFormData({ ...formData, licensePlate: e.target.value })
                  }
                />
              </Grid>

              {/* Service Details */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Build /> Service Details
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    value={formData.serviceType}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceType: e.target.value })
                    }
                    label="Service Type"
                  >
                    <MenuItem value="">Select Service</MenuItem>
                    {SERVICE_TYPES.map((service) => (
                      <MenuItem key={service.id} value={service.name}>
                        {service.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Service Notes"
                  value={formData.serviceNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceNotes: e.target.value })
                  }
                  placeholder="Specific issues, parts needed, special requirements..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Estimated Cost"
                  value={formData.estimatedCost}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedCost: e.target.value })
                  }
                  type="number"
                  InputProps={{ startAdornment: <Typography>$</Typography> }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Reminder</InputLabel>
                  <Select
                    value={formData.reminder}
                    onChange={(e) =>
                      setFormData({ ...formData, reminder: e.target.value })
                    }
                    label="Reminder"
                  >
                    <MenuItem value="10">10 minutes before</MenuItem>
                    <MenuItem value="30">30 minutes before</MenuItem>
                    <MenuItem value="60">1 hour before</MenuItem>
                    <MenuItem value="1440">1 day before</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Status & Notifications */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Notifications /> Status & Notifications
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    label="Status"
                  >
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Assigned To"
                  value={formData.assignedTo}
                  onChange={(e) =>
                    setFormData({ ...formData, assignedTo: e.target.value })
                  }
                  placeholder="Mechanic/Staff name"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.sendEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sendEmail: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Send email notification to customer"
                />
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info">
                  This appointment will be saved to Google Calendar and will
                  sync across all your devices. Customer will receive email
                  confirmation if enabled.
                </Alert>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            startIcon={<Close />}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={selectedEvent ? updateEvent : createEvent}
            startIcon={<Save />}
            disabled={
              !formData.summary ||
              !formData.startTime ||
              !formData.endTime ||
              loading
            }
            color="primary"
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : selectedEvent ? (
              "Update Appointment"
            ) : (
              "Save to Calendar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
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
            const event = events.find((e) => e.id === anchorEl.eventId);
            if (event) {
              navigator.clipboard.writeText(`
                Appointment: ${event.summary}
                Date: ${format(parseISO(event.start.dateTime), "PPpp")}
                Location: ${event.location || "N/A"}
                Details: ${event.description || "N/A"}
              `);
              showNotification("Copied to clipboard", "success");
            }
            setAnchorEl(null);
          }}
        >
          <Share sx={{ mr: 1 }} /> Copy Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            const event = events.find((e) => e.id === anchorEl.eventId);
            if (event?.customerInfo?.phone) {
              window.open(`tel:${event.customerInfo.phone}`, "_blank");
            }
            setAnchorEl(null);
          }}
        >
          <Call sx={{ mr: 1 }} /> Call Customer
        </MenuItem>
        <MenuItem
          onClick={() => {
            const event = events.find((e) => e.id === anchorEl.eventId);
            if (event?.customerInfo?.email) {
              window.open(
                `mailto:${event.customerInfo.email}?subject=Appointment: ${event.summary}`,
                "_blank"
              );
            }
            setAnchorEl(null);
          }}
        >
          <Email sx={{ mr: 1 }} /> Email Customer
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

      {/* Configuration Help Dialog */}
      <ConfigHelpDialog />

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
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Floating Action Button */}
      {accessToken && (
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 24, right: 24 }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default GoogleCalendar;
