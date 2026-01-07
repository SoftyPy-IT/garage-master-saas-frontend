/* eslint-disable react/prop-types */
/* eslint-disable no-case-declarations */
/* eslint-disable no-useless-catch */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-unused-vars */
import {
  Add as AddIcon,
  Badge,
  Build,
  CalendarToday,
  Call,
  CarRepair,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Close,
  Code,
  DarkMode,
  DateRange,
  Delete as DeleteIcon,
  DirectionsCar,
  Download,
  DragIndicator,
  Edit as EditIcon,
  Email,
  Event as EventIcon,
  LightMode,
  LocalGasStation,
  MoreVert as MoreVertIcon,
  Notifications,
  Person,
  Phone,
  Print,
  Refresh as RefreshIcon,
  Save,
  Search,
  Settings,
  Share,
  TaskAlt,
  Timelapse,
  Today as TodayIcon,
  VideoCall,
  ViewAgenda,
  ViewDay,
  ViewWeek,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Backdrop,
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
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Popover,
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
  alpha,
} from "@mui/material";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  differenceInHours,
  differenceInMinutes,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  formatDistanceToNow,
  getHours,
  getMinutes,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Service types for garage management
const SERVICE_TYPES = [
  {
    id: 1,
    name: "Oil Change",
    icon: <LocalGasStation />,
    duration: 1,
    color: "#4CAF50",
    category: "maintenance",
    price: "$50-$80",
  },
  {
    id: 2,
    name: "Brake Service",
    icon: <DirectionsCar />,
    duration: 2,
    color: "#FF9800",
    category: "safety",
    price: "$100-$300",
  },
  {
    id: 3,
    name: "Engine Repair",
    icon: <Build />,
    duration: 4,
    color: "#F44336",
    category: "repair",
    price: "$500-$2000",
  },
  {
    id: 4,
    name: "Tire Replacement",
    icon: <DirectionsCar />,
    duration: 2,
    color: "#2196F3",
    category: "maintenance",
    price: "$80-$200",
  },
  {
    id: 5,
    name: "AC Service",
    icon: <Build />,
    duration: 3,
    color: "#9C27B0",
    category: "comfort",
    price: "$150-$400",
  },
  {
    id: 6,
    name: "Battery Check",
    icon: <Build />,
    duration: 1,
    color: "#FFEB3B",
    category: "electrical",
    price: "$20-$50",
  },
  {
    id: 7,
    name: "Wheel Alignment",
    icon: <DirectionsCar />,
    duration: 2,
    color: "#795548",
    category: "maintenance",
    price: "$80-$120",
  },
  {
    id: 8,
    name: "Full Service",
    icon: <CarRepair />,
    duration: 6,
    color: "#607D8B",
    category: "comprehensive",
    price: "$300-$600",
  },
];

// Event Types for Google Calendar
const EVENT_TYPES = [
  {
    id: "event",
    name: "Event",
    icon: <EventIcon />,
    color: "#4285F4",
    defaultDuration: 60,
  },
  {
    id: "task",
    name: "Task",
    icon: <TaskAlt />,
    color: "#0F9D58",
    defaultDuration: 0,
  },
  {
    id: "meeting",
    name: "Meeting",
    icon: <VideoCall />,
    color: "#DB4437",
    defaultDuration: 30,
  },
  {
    id: "appointment",
    name: "Appointment",
    icon: <Person />,
    color: "#F4B400",
    defaultDuration: 45,
  },
  {
    id: "reminder",
    name: "Reminder",
    icon: <Notifications />,
    color: "#AB47BC",
    defaultDuration: 0,
  },
];

// Calendar Views
const CALENDAR_VIEWS = [
  { id: "day", name: "Day", icon: <ViewDay /> },
  { id: "week", name: "Week", icon: <ViewWeek /> },
  { id: "month", name: "Month", icon: <CalendarToday /> },
  { id: "agenda", name: "Agenda", icon: <ViewAgenda /> },
  { id: "year", name: "Year", icon: <DateRange /> },
  { id: "schedule", name: "Schedule", icon: <Timelapse /> },
];

// Notification Types
const NOTIFICATION_TYPES = [
  { id: "email", name: "Email", icon: <Email /> },
  { id: "popup", name: "Popup", icon: <Notifications /> },
  { id: "sms", name: "SMS", icon: <Phone /> },
  { id: "push", name: "Push", icon: <Notifications /> },
];

// Calendar Colors
const CALENDAR_COLORS = [
  "#4285F4", // Blue
  "#EA4335", // Red
  "#FBBC05", // Yellow
  "#34A853", // Green
  "#F4B400", // Amber
  "#AB47BC", // Purple
  "#00ACC1", // Cyan
  "#FF7043", // Orange
  "#9E9E9E", // Grey
  "#5C6BC0", // Indigo
  "#26A69A", // Teal
  "#D4E157", // Lime
  "#FF9800", // Orange
  "#795548", // Brown
  "#607D8B", // Blue Grey
];

// Utility function to fix date format
const fixDateTimeFormat = (dateTimeString) => {
  try {
    // If it's already in ISO format with Z
    if (dateTimeString.includes("Z")) {
      return dateTimeString;
    }

    // If it's in format "2026-01-07T08:39" (missing seconds)
    if (dateTimeString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
      return dateTimeString + ":00.000Z";
    }

    // If it's in format "2026-01-07T08:39:00"
    if (dateTimeString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
      return dateTimeString + ".000Z";
    }

    // Try to parse and format
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return date.toISOString();
  } catch (error) {
    console.error("Date format error:", error);
    // Return current time as fallback
    return new Date().toISOString();
  }
};

// Generate Time Slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  return slots;
};

// Drag and Drop Item Types
const ItemTypes = {
  EVENT: "event",
  TASK: "task",
  APPOINTMENT: "appointment",
};

// Draggable Event Component
const DraggableEvent = ({ event, onDragStart, onDragEnd }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.EVENT,
    item: { type: "event", id: event.id, event },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (onDragEnd) onDragEnd(item, monitor);
    },
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        padding: "4px 8px",
        margin: "2px 0",
        borderRadius: "4px",
        backgroundColor: event.color || "#4285F4",
        color: "white",
        fontSize: "12px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {event.summary}
    </div>
  );
};

// Droppable Calendar Slot
const DroppableCalendarSlot = ({ date, time, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [ItemTypes.EVENT, ItemTypes.TASK, ItemTypes.APPOINTMENT],
    drop: (item) => {
      if (onDrop) onDrop(item, { date, time });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        backgroundColor: isOver ? "#e3f2fd" : "transparent",
        height: "100%",
        width: "100%",
        border: isOver ? "2px dashed #1976d2" : "1px solid #e0e0e0",
      }}
    />
  );
};

const EnhancedGoogleCalendar = () => {
  // State Management
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [calendars, setCalendars] = useState([]);
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
  const [viewMode, setViewMode] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [configHelpOpen, setConfigHelpOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState("synced");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSettings, setFilterSettings] = useState({
    showTasks: true,
    showEvents: true,
    showMeetings: true,
    showAppointments: true,
    showReminders: true,
    showCompleted: false,
    showCancelled: false,
    showPast: false,
    showFuture: true,
    minPriority: "low",
    category: "all",
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [dragDropEnabled, setDragDropEnabled] = useState(true);
  const [selectedCalendar, setSelectedCalendar] = useState("primary");
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("calendar_theme") || "light"
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [miniMode, setMiniMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    popup: true,
    sound: true,
    vibrate: false,
    desktop: false,
    mobile: true,
    web: true,
  });
  const [stats, setStats] = useState({
    totalEvents: 0,
    todayEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    overdueTasks: 0,
    pendingReminders: 0,
    meetingsToday: 0,
    appointmentsToday: 0,
  });

  // Form State
  const [formData, setFormData] = useState({
    type: "event",
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
    color: CALENDAR_COLORS[0],
    calendarId: "primary",
    attendees: [],
    attachments: [],
    recurrence: "none",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    allDay: false,
    private: false,
    busy: true,
    guestsCanModify: false,
    guestsCanInviteOthers: false,
    guestsCanSeeOtherGuests: true,
    notificationTypes: ["email", "popup"],
    tags: [],
    categories: [],
    project: "",
    subTasks: [],
    dependencies: [],
    estimatedTime: "",
    actualTime: "",
    progress: 0,
    checklist: [],
    notes: "",
    locationDetails: {
      lat: null,
      lng: null,
      address: "",
      link: "",
    },
    conferenceData: {
      type: "hangoutsMeet",
      link: "",
      phoneNumber: "",
      pin: "",
    },
  });

  // Refs
  const calendarRef = useRef(null);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  // Calendar Navigation
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  });

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // Configuration details - FIXED based on URL errors
  const CONFIG = {
    projectId: "731493911262",
    clientId:
      "731493911262-b4vutijvnt9bgdvgu6m1ai7g0nsno7vl.apps.googleusercontent.com",
    adminEmail: "softypyit@gmail.com",
    userEmail: "ibrahimsikder5033@gmail.com",
    apiKey: "", // Add your API key here
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/calendar.settings.readonly",
      "https://www.googleapis.com/auth/tasks",
      "https://www.googleapis.com/auth/tasks.readonly",
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
  };

  // Initialize Calendars
  useEffect(() => {
    const defaultCalendars = [
      {
        id: "primary",
        name: "Primary Calendar",
        color: CALENDAR_COLORS[0],
        selected: true,
        visible: true,
        type: "personal",
      },
      {
        id: "work",
        name: "Work Calendar",
        color: CALENDAR_COLORS[1],
        selected: false,
        visible: true,
        type: "work",
      },
      {
        id: "personal",
        name: "Personal Calendar",
        color: CALENDAR_COLORS[2],
        selected: false,
        visible: true,
        type: "personal",
      },
      {
        id: "tasks",
        name: "Tasks",
        color: CALENDAR_COLORS[3],
        selected: false,
        visible: true,
        type: "tasks",
      },
      {
        id: "reminders",
        name: "Reminders",
        color: CALENDAR_COLORS[4],
        selected: false,
        visible: true,
        type: "reminders",
      },
    ];
    setCalendars(defaultCalendars);
  }, []);

  // Handle Online/Offline Status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && accessToken) {
      syncCalendar();
    }
  }, [isOnline, accessToken]);

  // Check for notifications periodically
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const upcomingNotifications = events
        .filter((event) => {
          if (!event.start?.dateTime) return false;
          const eventTime = new Date(event.start.dateTime);
          const timeDiff = differenceInMinutes(eventTime, now);
          return timeDiff > 0 && timeDiff <= 30; // Notify 30 minutes before
        })
        .map((event) => ({
          id: `notif-${event.id}`,
          eventId: event.id,
          title: event.summary,
          message: `Starts at ${format(
            new Date(event.start.dateTime),
            "h:mm a"
          )}`,
          time: new Date(event.start.dateTime),
          type: "event",
          read: false,
        }));

      // Add to notifications if not already present
      setNotifications((prev) => {
        const newNotifs = upcomingNotifications.filter(
          (notif) => !prev.some((p) => p.eventId === notif.eventId)
        );
        return [...prev, ...newNotifs];
      });
    };

    const interval = setInterval(checkNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [events]);

  // Google Login with all required scopes
  const login = useGoogleLogin({
    scope: CONFIG.scopes,
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
        await fetchTasks(token);
        await fetchReminders(token);
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
      handleGoogleError(error);
    },
    flow: "implicit",
  });

  // Enhanced Google Error Handler
  const handleGoogleError = (error) => {
    console.error("Google API Error:", error);

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          setErrorDetails({
            type: "bad_request",
            message: "Invalid request data format",
            details: [
              "Check date/time format",
              "Ensure all required fields are filled",
              data.error?.message || "Bad Request",
            ],
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
            errorMsg.includes("has not been used in project") ||
            errorMsg.includes("not authorized")
          ) {
            setErrorDetails({
              type: "config_required",
              message: "Configuration Required",
              details: [
                "Please enable Calendar API in Google Cloud Console",
                "Add your email as a test user",
                "Ensure OAuth consent screen is configured",
              ],
            });
            setConfigHelpOpen(true);
          }
          break;

        case 404:
          setErrorDetails({
            type: "not_found",
            message: "Resource not found",
            details: "The requested calendar or event does not exist",
          });
          break;

        case 429:
          setErrorDetails({
            type: "rate_limit",
            message: "Rate limit exceeded",
            details: "Too many requests. Please try again later.",
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
        details: "No response from Google API. Check internet connection.",
      });
    } else {
      setErrorDetails({
        type: "unknown_error",
        message: "Unknown Error",
        details: error.message || "Something went wrong",
      });
    }

    showNotification("❌ Operation failed. Check error details.", "error");
  };

  // Enhanced Logout Function
  const logout = () => {
    googleLogout();
    setAccessToken(null);
    setUserProfile(null);
    setEvents([]);
    setTasks([]);
    setReminders([]);
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
          params: { alt: "json" },
        }
      );
      console.log("User profile fetched:", data);
      setUserProfile(data);
      localStorage.setItem("google_user_profile", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw error;
    }
  };

  // Fetch Calendar Events with Enhanced Features
  const fetchCalendarEvents = async (token, calendarId = "primary") => {
    try {
      setLoading(true);
      const now = new Date();
      const timeMin = subMonths(now, 3).toISOString();
      const timeMax = addMonths(now, 6).toISOString();

      const { data } = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: "startTime",
            maxResults: 250,
            showDeleted: false,
            timeZone: "Asia/Dhaka",
          },
        }
      );

      console.log(`Found ${data.items?.length || 0} events`);

      const formattedEvents = data.items?.map((event) => ({
        ...event,
        id: event.id,
        summary: event.summary || "No Title",
        description: event.description || "",
        start: event.start,
        end: event.end,
        location: event.location || "",
        colorId: event.colorId || "1",
        status: event.status || "confirmed",
        creator: event.creator,
        organizer: event.organizer,
        attendees: event.attendees || [],
        reminders: event.reminders,
        recurrence: event.recurrence || [],
        isGarageEvent:
          event.description?.includes("Created via: Trust Auto Solution") ||
          false,
        serviceType: extractServiceType(event.description),
        customerInfo: extractCustomerInfo(event.description),
        calendarId: calendarId,
        created: event.created,
        updated: event.updated,
        visibility: event.visibility || "default",
        guestsCanModify: event.guestsCanModify || false,
        guestsCanInviteOthers: event.guestsCanInviteOthers || false,
        guestsCanSeeOtherGuests: event.guestsCanSeeOtherGuests || true,
        anyoneCanAddSelf: event.anyoneCanAddSelf || false,
        privateCopy: event.privateCopy || false,
        locked: event.locked || false,
        source: event.source,
        attachments: event.attachments || [],
        conferenceData: event.conferenceData,
        hangoutLink: event.hangoutLink,
      }));

      setEvents(formattedEvents);
      updateStats(formattedEvents, tasks, reminders);
      return formattedEvents;
    } catch (error) {
      console.error("Events fetch error:", error);
      handleGoogleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch Google Tasks
  const fetchTasks = async (token) => {
    try {
      const { data } = await axios.get(
        "https://www.googleapis.com/tasks/v1/users/@me/lists",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const taskLists = data.items || [];
      const allTasks = [];

      for (const list of taskLists) {
        const tasksResponse = await axios.get(
          `https://www.googleapis.com/tasks/v1/lists/${list.id}/tasks`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              showCompleted: false,
              showHidden: false,
              maxResults: 100,
            },
          }
        );

        const listTasks =
          tasksResponse.data.items?.map((task) => ({
            ...task,
            listId: list.id,
            listName: list.title,
            type: "task",
          })) || [];

        allTasks.push(...listTasks);
      }

      setTasks(allTasks);
      updateStats(events, allTasks, reminders);
      return allTasks;
    } catch (error) {
      console.error("Tasks fetch error:", error);
      // Tasks API might not be enabled, continue without tasks
      return [];
    }
  };

  // Fetch Reminders
  const fetchReminders = async (token) => {
    try {
      // Note: Google Reminders API is limited, using calendar for reminders
      const now = new Date();
      const timeMin = now.toISOString();
      const timeMax = addDays(now, 7).toISOString();

      const { data } = await axios.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            timeMin,
            timeMax,
            singleEvents: true,
            q: "reminder",
            maxResults: 50,
          },
        }
      );

      const reminderEvents =
        data.items
          ?.filter((event) => event.summary?.toLowerCase().includes("reminder"))
          .map((event) => ({
            ...event,
            type: "reminder",
            due: event.start?.dateTime || event.start?.date,
          })) || [];

      setReminders(reminderEvents);
      updateStats(events, tasks, reminderEvents);
      return reminderEvents;
    } catch (error) {
      console.error("Reminders fetch error:", error);
      return [];
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
  const updateStats = (eventsList, tasksList, remindersList) => {
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
    const overdueTasks = tasksList.filter(
      (task) => task.due && new Date(task.due) < now && !task.completed
    ).length;
    const pendingReminders = remindersList.filter(
      (reminder) => new Date(reminder.due) > now
    ).length;
    const meetingsToday = eventsList.filter(
      (event) =>
        event.start?.dateTime?.includes(today) &&
        event.summary?.toLowerCase().includes("meeting")
    ).length;
    const appointmentsToday = eventsList.filter(
      (event) =>
        event.start?.dateTime?.includes(today) &&
        event.summary?.toLowerCase().includes("appointment")
    ).length;

    setStats({
      totalEvents,
      todayEvents,
      upcomingEvents,
      completedEvents,
      overdueTasks,
      pendingReminders,
      meetingsToday,
      appointmentsToday,
    });
  };

  // Create Event - Enhanced Version
  const createEvent = async () => {
    if (!accessToken) {
      showNotification("Please login first", "warning");
      return;
    }

    // Validate form
    if (!formData.summary || !formData.startTime || !formData.endTime) {
      showNotification("Please fill all required fields", "warning");
      return;
    }

    try {
      setLoading(true);

      // Build enhanced event description
      let description = formData.description || "";

      // Add customer details if it's a garage event
      if (formData.type === "appointment") {
        if (
          formData.customerName ||
          formData.customerPhone ||
          formData.customerEmail ||
          formData.customerAddress
        ) {
          description += `\n\n--- Customer Details ---\n`;
          if (formData.customerName)
            description += `Name: ${formData.customerName}\n`;
          if (formData.customerPhone)
            description += `Phone: ${formData.customerPhone}\n`;
          if (formData.customerEmail)
            description += `Email: ${formData.customerEmail}\n`;
          if (formData.customerAddress)
            description += `Address: ${formData.customerAddress}\n`;
        }

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
        if (formData.priority)
          description += `Priority: ${formData.priority}\n`;
        if (formData.estimatedCost)
          description += `Estimated Cost: $${formData.estimatedCost}\n`;
      }

      description += `\nCreated via: Enhanced Calendar App`;
      description += `\nStatus: ${formData.status}`;
      if (formData.assignedTo)
        description += `\nAssigned To: ${formData.assignedTo}`;

      // Add tags and categories
      if (formData.tags.length > 0) {
        description += `\nTags: ${formData.tags.join(", ")}`;
      }
      if (formData.categories.length > 0) {
        description += `\nCategories: ${formData.categories.join(", ")}`;
      }

      // Convert date format
      const startDateTime = fixDateTimeFormat(formData.startTime);
      const endDateTime = fixDateTimeFormat(formData.endTime);

      // Build attendees array
      const attendees = [];
      if (formData.customerEmail) {
        attendees.push({
          email: formData.customerEmail,
          responseStatus: "needsAction",
        });
      }
      if (formData.attendees && formData.attendees.length > 0) {
        formData.attendees.forEach((email) => {
          attendees.push({ email, responseStatus: "needsAction" });
        });
      }

      // Build event object
      const event = {
        summary: formData.summary,
        description: description.trim(),
        start: {
          dateTime: formData.allDay ? undefined : startDateTime,
          date: formData.allDay
            ? format(new Date(startDateTime), "yyyy-MM-dd")
            : undefined,
          timeZone: formData.timeZone,
        },
        end: {
          dateTime: formData.allDay ? undefined : endDateTime,
          date: formData.allDay
            ? format(new Date(endDateTime), "yyyy-MM-dd")
            : undefined,
          timeZone: formData.timeZone,
        },
        location: formData.location || "",
        attendees: attendees.length > 0 ? attendees : undefined,
        reminders: {
          useDefault: false,
          overrides: formData.notificationTypes.map((type) => ({
            method: type,
            minutes: parseInt(formData.reminder) || 30,
          })),
        },
        colorId: getColorId(formData.priority, formData.color),
        transparency: formData.busy ? "opaque" : "transparent",
        visibility: formData.private ? "private" : "default",
        guestsCanModify: formData.guestsCanModify,
        guestsCanInviteOthers: formData.guestsCanInviteOthers,
        guestsCanSeeOtherGuests: formData.guestsCanSeeOtherGuests,
        anyoneCanAddSelf: false,
        recurrence:
          formData.recurrence !== "none" ? [formData.recurrence] : undefined,
        attachments:
          formData.attachments.length > 0 ? formData.attachments : undefined,
        conferenceData: formData.conferenceData?.link
          ? {
              createRequest: {
                requestId: `meet-${Date.now()}`,
                conferenceSolutionKey: { type: "hangoutsMeet" },
              },
            }
          : undefined,
        extendedProperties: {
          private: {
            type: formData.type,
            priority: formData.priority,
            project: formData.project,
            progress: formData.progress.toString(),
          },
        },
      };

      console.log("Creating event:", event);

      const response = await axios.post(
        `https://www.googleapis.com/calendar/v3/calendars/${formData.calendarId}/events`,
        event,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Event created successfully:", response.data);

      // Add to local state
      const newEvent = {
        ...response.data,
        type: formData.type,
        isGarageEvent: formData.type === "appointment",
        serviceType: formData.serviceType,
        customerInfo: {
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail,
        },
      };

      if (formData.type === "task") {
        setTasks((prev) => [newEvent, ...prev]);
      } else if (formData.type === "reminder") {
        setReminders((prev) => [newEvent, ...prev]);
      } else {
        setEvents((prev) => [newEvent, ...prev]);
      }

      updateStats(
        formData.type === "event" ||
          formData.type === "meeting" ||
          formData.type === "appointment"
          ? [newEvent, ...events]
          : events,
        formData.type === "task" ? [newEvent, ...tasks] : tasks,
        formData.type === "reminder" ? [newEvent, ...reminders] : reminders
      );

      setOpenDialog(false);
      resetForm();
      showNotification(
        `✅ ${
          formData.type.charAt(0).toUpperCase() + formData.type.slice(1)
        } created successfully!`,
        "success"
      );

      // Send notifications
      if (formData.sendEmail && formData.customerEmail) {
        await sendEmailNotification(formData.customerEmail, newEvent);
      }
    } catch (error) {
      console.error("❌ Event creation error:", error);
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Update Event
  const updateEvent = async () => {
    if (!selectedEvent) return;

    try {
      setLoading(true);

      const startDateTime = fixDateTimeFormat(formData.startTime);
      const endDateTime = fixDateTimeFormat(formData.endTime);

      const event = {
        ...selectedEvent,
        summary: formData.summary,
        description: formData.description,
        start: {
          dateTime: startDateTime,
          timeZone: formData.timeZone,
        },
        end: {
          dateTime: endDateTime,
          timeZone: formData.timeZone,
        },
        location: formData.location,
        colorId: getColorId(formData.priority, formData.color),
      };

      await axios.put(
        `https://www.googleapis.com/calendar/v3/calendars/${
          selectedEvent.calendarId || "primary"
        }/events/${selectedEvent.id}`,
        event,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchCalendarEvents(
        accessToken,
        selectedEvent.calendarId || "primary"
      );
      setOpenDialog(false);
      resetForm();
      showNotification("✅ Event updated successfully!", "success");
    } catch (error) {
      console.error("Update error:", error);
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Event
  const deleteEvent = async (eventId, calendarId = "primary") => {
    try {
      await axios.delete(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      updateStats(
        events.filter((event) => event.id !== eventId),
        tasks,
        reminders
      );
      showNotification("🗑️ Event deleted successfully!", "success");
    } catch (error) {
      console.error("Delete error:", error);
      handleGoogleError(error);
    }
  };

  // Create Task
  const createTask = async () => {
    if (!accessToken) {
      showNotification("Please login first", "warning");
      return;
    }

    try {
      setLoading(true);

      const task = {
        title: formData.summary,
        notes: formData.description,
        due: formData.startTime ? fixDateTimeFormat(formData.startTime) : null,
        status: formData.status === "completed" ? "completed" : "needsAction",
      };

      // First, get or create a task list
      const listsResponse = await axios.get(
        "https://www.googleapis.com/tasks/v1/users/@me/lists",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      let taskListId = listsResponse.data.items?.[0]?.id;
      if (!taskListId) {
        // Create a default task list
        const createListResponse = await axios.post(
          "https://www.googleapis.com/tasks/v1/users/@me/lists",
          { title: "My Tasks" },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        taskListId = createListResponse.data.id;
      }

      // Create the task
      const response = await axios.post(
        `https://www.googleapis.com/tasks/v1/lists/${taskListId}/tasks`,
        task,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newTask = {
        ...response.data,
        type: "task",
        listId: taskListId,
      };

      setTasks((prev) => [newTask, ...prev]);
      updateStats(events, [newTask, ...tasks], reminders);
      setOpenDialog(false);
      resetForm();
      showNotification("✅ Task created successfully!", "success");
    } catch (error) {
      console.error("Task creation error:", error);
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Create Reminder
  const createReminder = async () => {
    if (!accessToken) {
      showNotification("Please login first", "warning");
      return;
    }

    try {
      setLoading(true);

      const reminderEvent = {
        summary: formData.summary,
        description: formData.description,
        start: {
          dateTime: fixDateTimeFormat(formData.startTime),
          timeZone: formData.timeZone,
        },
        end: {
          dateTime: fixDateTimeFormat(formData.endTime),
          timeZone: formData.timeZone,
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "popup", minutes: parseInt(formData.reminder) || 30 },
          ],
        },
        colorId: "8", // Grey color for reminders
      };

      const response = await axios.post(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        reminderEvent,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newReminder = {
        ...response.data,
        type: "reminder",
      };

      setReminders((prev) => [newReminder, ...prev]);
      updateStats(events, tasks, [newReminder, ...reminders]);
      setOpenDialog(false);
      resetForm();
      showNotification("✅ Reminder created successfully!", "success");
    } catch (error) {
      console.error("Reminder creation error:", error);
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Send Email Notification
  const sendEmailNotification = async (email, event) => {
    try {
      const subject = `New ${event.type}: ${event.summary}`;
      const body = `
        You have a new ${event.type} scheduled:
        
        Title: ${event.summary}
        Date: ${format(new Date(event.start.dateTime), "PPPPpppp")}
        Location: ${event.location || "Not specified"}
        Description: ${event.description || "No description"}
        
        This is an automated notification from Enhanced Calendar App.
      `;

      // In a real app, you would send this via your backend
      // For now, we'll just show a notification
      showNotification(
        `📧 Email notification would be sent to ${email}`,
        "info"
      );
    } catch (error) {
      console.error("Email notification error:", error);
    }
  };

  // Sync Calendar
  const syncCalendar = async () => {
    if (!accessToken) return;

    try {
      setSyncStatus("syncing");
      setLoading(true);

      await Promise.all([
        fetchCalendarEvents(accessToken, "primary"),
        fetchTasks(accessToken),
        fetchReminders(accessToken),
      ]);

      setSyncStatus("synced");
      showNotification("✅ Calendar synced successfully!", "success");
    } catch (error) {
      setSyncStatus("error");
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Drag and Drop
  const handleDrop = async (item, dropLocation) => {
    try {
      setLoading(true);

      const { date, time } = dropLocation;
      const newStartTime = new Date(`${date}T${time}`);
      const newEndTime = addHours(newStartTime, 1);

      const eventToUpdate = events.find((e) => e.id === item.id);
      if (!eventToUpdate) return;

      const updatedEvent = {
        ...eventToUpdate,
        start: {
          dateTime: newStartTime.toISOString(),
          timeZone: eventToUpdate.start.timeZone,
        },
        end: {
          dateTime: newEndTime.toISOString(),
          timeZone: eventToUpdate.end.timeZone,
        },
      };

      await axios.put(
        `https://www.googleapis.com/calendar/v3/calendars/${
          eventToUpdate.calendarId || "primary"
        }/events/${eventToUpdate.id}`,
        updatedEvent,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchCalendarEvents(
        accessToken,
        eventToUpdate.calendarId || "primary"
      );
      showNotification("✅ Event moved successfully!", "success");
    } catch (error) {
      console.error("Drag and drop error:", error);
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Quick Create Templates
  const quickCreate = (type) => {
    const now = new Date();
    let template = {
      type: type,
      summary: "",
      description: "",
      startTime: formatForDateTimeLocal(addHours(now, 1)),
      endTime: formatForDateTimeLocal(addHours(now, 2)),
      color:
        CALENDAR_COLORS[Math.floor(Math.random() * CALENDAR_COLORS.length)],
    };

    switch (type) {
      case "meeting":
        template.summary = "Team Meeting";
        template.description = "Weekly team sync";
        break;
      case "task":
        template.summary = "New Task";
        template.description = "Task description";
        break;
      case "event":
        template.summary = "Social Event";
        template.description = "Friends gathering";
        break;
      case "appointment":
        template.summary = "Doctor Appointment";
        template.description = "Annual checkup";
        break;
      case "reminder":
        template.summary = "Important Reminder";
        template.description = "Don't forget!";
        break;
    }

    setFormData((prev) => ({ ...prev, ...template }));
    setOpenDialog(true);
  };

  // Export Events
  const exportData = (format = "csv") => {
    const data = [...events, ...tasks, ...reminders];

    if (data.length === 0) {
      showNotification("No data to export", "warning");
      return;
    }

    let exportContent;
    let fileName;
    let mimeType;

    if (format === "csv") {
      const csvData = data.map((item) => ({
        Type: item.type || "event",
        Title: item.summary || item.title || "No Title",
        Date: item.start?.dateTime
          ? format(new Date(item.start.dateTime), "yyyy-MM-dd HH:mm")
          : item.due
          ? format(new Date(item.due), "yyyy-MM-dd HH:mm")
          : "N/A",
        End: item.end?.dateTime
          ? format(new Date(item.end.dateTime), "yyyy-MM-dd HH:mm")
          : "N/A",
        Location: item.location || "N/A",
        Description: item.description || item.notes || "N/A",
        Status: item.status || "N/A",
        Priority: item.priority || "N/A",
        Calendar: item.calendarId || "primary",
      }));

      const headers = Object.keys(csvData[0]).join(",");
      const rows = csvData.map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(",")
      );

      exportContent = [headers, ...rows].join("\n");
      fileName = `calendar-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
      mimeType = "text/csv";
    } else if (format === "json") {
      exportContent = JSON.stringify(data, null, 2);
      fileName = `calendar-export-${format(new Date(), "yyyy-MM-dd")}.json`;
      mimeType = "application/json";
    } else if (format === "ical") {
      // Simple iCal format
      exportContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Enhanced Calendar//EN
${data
  .map((item) => {
    const start = item.start?.dateTime
      ? format(new Date(item.start.dateTime), "yyyyMMdd'T'HHmmss'Z'")
      : "";
    const end = item.end?.dateTime
      ? format(new Date(item.end.dateTime), "yyyyMMdd'T'HHmmss'Z'")
      : "";
    return `BEGIN:VEVENT
UID:${item.id}
DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}
DTSTART:${start}
DTEND:${end}
SUMMARY:${item.summary || item.title}
DESCRIPTION:${item.description || item.notes}
LOCATION:${item.location || ""}
END:VEVENT`;
  })
  .join("\n")}
END:VCALENDAR`;

      fileName = `calendar-export-${format(new Date(), "yyyy-MM-dd")}.ics`;
      mimeType = "text/calendar";
    }

    const blob = new Blob([exportContent], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification(
      `📥 Exported ${data.length} items as ${format.toUpperCase()}`,
      "success"
    );
  };

  // Import Data
  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        // Parse and handle imported data
        showNotification("✅ Data imported successfully!", "success");
      } catch (error) {
        showNotification("❌ Failed to import data", "error");
      }
    };
    reader.readAsText(file);
  };

  // Print Schedule
  const printSchedule = () => {
    const printWindow = window.open("", "_blank");
    const now = new Date();

    printWindow.document.write(`
      <html>
        <head>
          <title>Calendar Schedule - ${format(now, "PPPP")}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #4285F4; padding-bottom: 10px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .stats { background: #f8f9fa; padding: 15px; border-radius: 8px; display: flex; gap: 20px; }
            .stat-item { text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; color: #4285F4; }
            .stat-label { font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #4285F4; color: white; padding: 12px; text-align: left; }
            td { border: 1px solid #ddd; padding: 10px; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .event-type { display: inline-block; padding: 2px 8px; border-radius: 4px; color: white; font-size: 12px; }
            .event-event { background: #4285F4; }
            .event-task { background: #0F9D58; }
            .event-meeting { background: #DB4437; }
            .event-appointment { background: #F4B400; }
            .event-reminder { background: #AB47BC; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Enhanced Calendar - Schedule Report</h1>
            <div class="stats">
              <div class="stat-item">
                <div class="stat-value">${stats.totalEvents}</div>
                <div class="stat-label">Total Events</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${stats.todayEvents}</div>
                <div class="stat-label">Today</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${stats.upcomingEvents}</div>
                <div class="stat-label">Upcoming</div>
              </div>
            </div>
          </div>
          <p><strong>Generated:</strong> ${format(now, "PPPPpppp")}</p>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Date & Time</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${[...events, ...tasks, ...reminders]
                .slice(0, 50) // Limit to 50 items for printing
                .map(
                  (item) => `
                  <tr>
                    <td>
                      <span class="event-type event-${item.type || "event"}">
                        ${(item.type || "event").toUpperCase()}
                      </span>
                    </td>
                    <td>${item.summary || item.title || "No Title"}</td>
                    <td>${
                      item.start?.dateTime
                        ? format(new Date(item.start.dateTime), "PPpp")
                        : item.due
                        ? format(new Date(item.due), "PPpp")
                        : "N/A"
                    }</td>
                    <td>${item.location || "N/A"}</td>
                    <td>${item.status || "scheduled"}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
          <div class="footer">
            <p>Generated by Enhanced Calendar App</p>
            <p>Total items: ${
              events.length + tasks.length + reminders.length
            }</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      type: "event",
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
      color: CALENDAR_COLORS[0],
      calendarId: "primary",
      attendees: [],
      attachments: [],
      recurrence: "none",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      allDay: false,
      private: false,
      busy: true,
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: true,
      notificationTypes: ["email", "popup"],
      tags: [],
      categories: [],
      project: "",
      subTasks: [],
      dependencies: [],
      estimatedTime: "",
      actualTime: "",
      progress: 0,
      checklist: [],
      notes: "",
      locationDetails: {
        lat: null,
        lng: null,
        address: "",
        link: "",
      },
      conferenceData: {
        type: "hangoutsMeet",
        link: "",
        phoneNumber: "",
        pin: "",
      },
    });
    setSelectedEvent(null);
  };

  // Show Notification
  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  // Format date for datetime-local input
  const formatForDateTimeLocal = (date) => {
    const pad = (num) => num.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // Open Dialog
  const handleOpenDialog = (event = null, type = "event") => {
    if (event) {
      setSelectedEvent(event);
      const customerInfo = extractCustomerInfo(event.description);

      // Convert ISO date to datetime-local format
      const formatISOToInput = (isoDate) => {
        try {
          const date = new Date(isoDate);
          return formatForDateTimeLocal(date);
        } catch {
          return "";
        }
      };

      setFormData({
        ...formData,
        type: event.type || "event",
        summary: event.summary || "",
        description: event.description || "",
        startTime: event.start?.dateTime
          ? formatISOToInput(event.start.dateTime)
          : "",
        endTime: event.end?.dateTime
          ? formatISOToInput(event.end.dateTime)
          : "",
        location: event.location || "",
        customerEmail: customerInfo.email || "",
        customerPhone: customerInfo.phone || "",
        customerName: customerInfo.name || "",
        serviceType: extractServiceType(event.description),
        color: event.color || CALENDAR_COLORS[0],
        calendarId: event.calendarId || "primary",
        status: event.status || "scheduled",
        priority: event.priority || "medium",
      });
    } else {
      // Set default times for new event
      const now = new Date();
      const startTime = addHours(now, 1);
      const endTime = addHours(startTime, 1);

      setFormData({
        ...formData,
        type: type,
        summary: "",
        description: "",
        startTime: formatForDateTimeLocal(startTime),
        endTime: formatForDateTimeLocal(endTime),
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
        color:
          CALENDAR_COLORS[Math.floor(Math.random() * CALENDAR_COLORS.length)],
        calendarId: "primary",
        attendees: [],
        attachments: [],
        recurrence: "none",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        allDay: false,
        private: false,
        busy: true,
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: true,
        notificationTypes: ["email", "popup"],
        tags: [],
        categories: [],
        project: "",
        subTasks: [],
        dependencies: [],
        estimatedTime: "",
        actualTime: "",
        progress: 0,
        checklist: [],
        notes: "",
        locationDetails: {
          lat: null,
          lng: null,
          address: "",
          link: "",
        },
        conferenceData: {
          type: "hangoutsMeet",
          link: "",
          phoneNumber: "",
          pin: "",
        },
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
    if (viewMode === "week") setCurrentDate((prev) => subWeeks(prev, 1));
    else if (viewMode === "month") setCurrentDate((prev) => subMonths(prev, 1));
    else if (viewMode === "year") setCurrentDate((prev) => subMonths(prev, 12));
    else setCurrentDate((prev) => subDays(prev, 1));
  };
  const goToNext = () => {
    if (viewMode === "week") setCurrentDate((prev) => addWeeks(prev, 1));
    else if (viewMode === "month") setCurrentDate((prev) => addMonths(prev, 1));
    else if (viewMode === "year") setCurrentDate((prev) => addMonths(prev, 12));
    else setCurrentDate((prev) => addDays(prev, 1));
  };

  // Get Events for Day
  const getEventsForDay = (day) => {
    return events.filter((event) => {
      if (!event.start?.dateTime) return false;
      const eventDate = new Date(event.start.dateTime);
      return isSameDay(eventDate, day);
    });
  };

  // Get Tasks for Day
  const getTasksForDay = (day) => {
    return tasks.filter((task) => {
      if (!task.due) return false;
      const dueDate = new Date(task.due);
      return isSameDay(dueDate, day);
    });
  };

  // Get Reminders for Day
  const getRemindersForDay = (day) => {
    return reminders.filter((reminder) => {
      if (!reminder.start?.dateTime) return false;
      const reminderDate = new Date(reminder.start.dateTime);
      return isSameDay(reminderDate, day);
    });
  };

  // Filter Events based on search and filters
  const filteredEvents = useMemo(() => {
    let filtered = [...events, ...tasks, ...reminders];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.summary || item.title || "").toLowerCase().includes(query) ||
          (item.description || item.notes || "")
            .toLowerCase()
            .includes(query) ||
          (item.location || "").toLowerCase().includes(query)
      );
    }

    // Apply type filters
    filtered = filtered.filter((item) => {
      const type = item.type || "event";
      switch (type) {
        case "task":
          return filterSettings.showTasks;
        case "event":
          return filterSettings.showEvents;
        case "meeting":
          return filterSettings.showMeetings;
        case "appointment":
          return filterSettings.showAppointments;
        case "reminder":
          return filterSettings.showReminders;
        default:
          return true;
      }
    });

    // Apply status filters
    if (!filterSettings.showCompleted) {
      filtered = filtered.filter((item) => item.status !== "completed");
    }
    if (!filterSettings.showCancelled) {
      filtered = filtered.filter((item) => item.status !== "cancelled");
    }

    // Apply time filters
    const now = new Date();
    if (!filterSettings.showPast) {
      filtered = filtered.filter((item) => {
        const itemDate = item.start?.dateTime
          ? new Date(item.start.dateTime)
          : item.due
          ? new Date(item.due)
          : now;
        return itemDate >= now;
      });
    }
    if (!filterSettings.showFuture) {
      filtered = filtered.filter((item) => {
        const itemDate = item.start?.dateTime
          ? new Date(item.start.dateTime)
          : item.due
          ? new Date(item.due)
          : now;
        return itemDate <= now;
      });
    }

    return filtered;
  }, [events, tasks, reminders, searchQuery, filterSettings]);

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = themeMode === "light" ? "dark" : "light";
    setThemeMode(newTheme);
    localStorage.setItem("calendar_theme", newTheme);
  };

  // Toggle Sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle Mini Mode
  const toggleMiniMode = () => {
    setMiniMode(!miniMode);
  };

  // Mark Notification as Read
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  // Mark All Notifications as Read
  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  // Clear All Notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Get Unread Notification Count
  const getUnreadNotificationCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  // Get Upcoming Events
  const getUpcomingEvents = () => {
    const now = new Date();
    return events
      .filter((event) => {
        if (!event.start?.dateTime) return false;
        const eventTime = new Date(event.start.dateTime);
        return eventTime > now && differenceInHours(eventTime, now) <= 24;
      })
      .slice(0, 5);
  };

  // Get Overdue Tasks
  const getOverdueTasks = () => {
    const now = new Date();
    return tasks
      .filter(
        (task) =>
          task.due && new Date(task.due) < now && task.status !== "completed"
      )
      .slice(0, 5);
  };

  // Test Event Creation Function
  const testEventCreation = async () => {
    if (!accessToken) {
      showNotification("Please login first", "warning");
      return;
    }

    try {
      setLoading(true);

      // Create a simple test event with correct format
      const now = new Date();
      const startTime = new Date(now.getTime() + 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const testEvent = {
        summary: "Test Event - Enhanced Calendar",
        description:
          "This is a test event created via Enhanced Calendar App\n\nCreated via: Enhanced Calendar App",
        start: {
          dateTime: startTime.toISOString(),
          timeZone: "Asia/Dhaka",
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: "Asia/Dhaka",
        },
        location: "Test Location",
        colorId: "1",
      };

      const response = await axios.post(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        testEvent,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Test event created successfully:", response.data);
      showNotification("✅ Test event created successfully!", "success");

      // Refresh events
      await fetchCalendarEvents(accessToken);
    } catch (error) {
      console.error("❌ Test event creation error:", error);
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get color ID
  const getColorId = (priority, color) => {
    // Map colors to Google Calendar color IDs
    const colorMap = {
      "#4285F4": "1", // Blue
      "#EA4335": "2", // Red
      "#FBBC05": "3", // Yellow
      "#34A853": "4", // Green
      "#F4B400": "5", // Amber
      "#AB47BC": "6", // Purple
      "#00ACC1": "7", // Cyan
      "#FF7043": "8", // Orange
      "#9E9E9E": "9", // Grey
      "#5C6BC0": "10", // Indigo
    };

    return colorMap[color] || "1";
  };

  // Auto fetch events when token exists
  useEffect(() => {
    if (accessToken) {
      syncCalendar();
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
          <Settings /> Google Calendar API Configuration
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="h6">Required Configuration Steps</Typography>
          </Alert>

          <Typography variant="h6" gutterBottom>
            📋 Step-by-Step Guide:
          </Typography>

          <Stepper orientation="vertical" sx={{ mb: 3 }}>
            <Step>
              <StepLabel>Create Google Cloud Project</StepLabel>
            </Step>
            <Step>
              <StepLabel>Enable Calendar API</StepLabel>
            </Step>
            <Step>
              <StepLabel>Configure OAuth Consent Screen</StepLabel>
            </Step>
            <Step>
              <StepLabel>Create OAuth 2.0 Credentials</StepLabel>
            </Step>
            <Step>
              <StepLabel>Add Test Users</StepLabel>
            </Step>
          </Stepper>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Your Current Client ID
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
                  <Typography variant="body1" fontWeight="bold">
                    {CONFIG.adminEmail}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            href="https://console.cloud.google.com/apis/dashboard"
            target="_blank"
            startIcon={<Settings />}
            fullWidth
            sx={{ mb: 2 }}
          >
            Open Google Cloud Console
          </Button>

          <Button
            variant="outlined"
            href="https://developers.google.com/calendar/api/quickstart/js"
            target="_blank"
            startIcon={<Code />}
            fullWidth
          >
            View Google Calendar API Documentation
          </Button>
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

  // Settings Dialog Component
  const SettingsDialog = () => (
    <Dialog
      open={settingsOpen}
      onClose={() => setSettingsOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Settings /> Calendar Settings
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ pt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Appearance
          </Typography>
          <FormControlLabel
            control={
              <Switch checked={themeMode === "dark"} onChange={toggleTheme} />
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

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Notifications
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

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Calendar Views
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            fullWidth
          >
            {CALENDAR_VIEWS.map((view) => (
              <ToggleButton key={view.id} value={view.id}>
                {view.icon}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Export & Import
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              onClick={() => exportData("csv")}
              startIcon={<Download />}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              onClick={() => exportData("json")}
              startIcon={<Download />}
            >
              Export JSON
            </Button>
            <Button
              variant="outlined"
              onClick={() => exportData("ical")}
              startIcon={<Download />}
            >
              Export iCal
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        <Button onClick={() => setSettingsOpen(false)} variant="contained">
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Quick Add Dialog
  const QuickAddDialog = () => (
    <Dialog
      open={quickAddOpen}
      onClose={() => setQuickAddOpen(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Quick Add</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            What would you like to add?
          </Typography>
          <Grid container spacing={2}>
            {EVENT_TYPES.map((type) => (
              <Grid item xs={6} key={type.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    textAlign: "center",
                    p: 2,
                    "&:hover": {
                      backgroundColor: alpha(type.color, 0.1),
                    },
                  }}
                  onClick={() => {
                    quickCreate(type.id);
                    setQuickAddOpen(false);
                  }}
                >
                  <Box sx={{ color: type.color, mb: 1 }}>{type.icon}</Box>
                  <Typography variant="body2">{type.name}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setQuickAddOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

  // Notifications Panel
  const NotificationsPanel = () => (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box sx={{ width: 360, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Notifications</Typography>
          <Box>
            <IconButton
              size="small"
              onClick={markAllNotificationsAsRead}
              title="Mark all as read"
            >
              <CheckCircle />
            </IconButton>
            <IconButton
              size="small"
              onClick={clearAllNotifications}
              title="Clear all"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {notifications.length === 0 ? (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ py: 4 }}
          >
            No notifications
          </Typography>
        ) : (
          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {notifications.slice(0, 10).map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  bgcolor: notification.read ? "transparent" : "action.hover",
                  mb: 1,
                  borderRadius: 1,
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <CheckCircle />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <Notifications />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(notification.time), {
                          addSuffix: true,
                        })}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        {notifications.length > 10 && (
          <Button fullWidth sx={{ mt: 1 }}>
            View All Notifications
          </Button>
        )}
      </Box>
    </Popover>
  );

  // Render Calendar View based on viewMode
  const renderCalendarView = () => {
    switch (viewMode) {
      case "day":
        return renderDayView();
      case "week":
        return renderWeekView();
      case "month":
        return renderMonthView();
      case "agenda":
        return renderAgendaView();
      case "schedule":
        return renderScheduleView();
      default:
        return renderWeekView();
    }
  };

  const renderDayView = () => {
    const timeSlots = generateTimeSlots();
    const dayEvents = getEventsForDay(currentDate);
    const dayTasks = getTasksForDay(currentDate);
    const dayReminders = getRemindersForDay(currentDate);

    return (
      <Box sx={{ height: "calc(100vh - 300px)", overflow: "auto" }}>
        <Grid container>
          <Grid item xs={2}>
            <Box sx={{ borderRight: 1, borderColor: "divider" }}>
              {timeSlots.map((time) => (
                <Box
                  key={time}
                  sx={{
                    height: 60,
                    borderBottom: 1,
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption">{time}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={10}>
            <Box sx={{ position: "relative", height: "100%" }}>
              {timeSlots.map((time) => (
                <Box
                  key={time}
                  sx={{
                    height: 60,
                    borderBottom: 1,
                    borderColor: "divider",
                    position: "relative",
                  }}
                >
                  {dragDropEnabled && (
                    <DroppableCalendarSlot
                      date={format(currentDate, "yyyy-MM-dd")}
                      time={time}
                      onDrop={handleDrop}
                    />
                  )}
                </Box>
              ))}

              {/* Render events on timeline */}
              {[...dayEvents, ...dayTasks, ...dayReminders].map((item) => {
                const startTime = item.start?.dateTime
                  ? new Date(item.start.dateTime)
                  : new Date();
                const top =
                  (getHours(startTime) * 60 + getMinutes(startTime)) * 1;
                const height = item.duration ? item.duration * 60 : 60; // Default 1 hour

                return (
                  <Box
                    key={item.id}
                    sx={{
                      position: "absolute",
                      top: `${top}px`,
                      left: "10px",
                      right: "10px",
                      height: `${height}px`,
                      bgcolor: item.color || "#4285F4",
                      color: "white",
                      borderRadius: 1,
                      p: 1,
                      overflow: "hidden",
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.9,
                      },
                    }}
                    onClick={() => handleOpenDialog(item)}
                  >
                    <Typography variant="caption" noWrap>
                      {format(startTime, "h:mm a")} - {item.summary}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderWeekView = () => {
    return (
      <Grid container spacing={1}>
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const dayTasks = getTasksForDay(day);
          const dayReminders = getRemindersForDay(day);
          const allItems = [...dayEvents, ...dayTasks, ...dayReminders];

          return (
            <Grid item xs key={index}>
              <Card
                sx={{
                  height: "600px",
                  overflow: "auto",
                  bgcolor: isSameDay(day, new Date()) ? "primary.50" : "white",
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

                  {allItems.length > 0 ? (
                    <Box>
                      {allItems.map((item) => (
                        <Card
                          key={item.id}
                          sx={{
                            p: 1,
                            mb: 1,
                            bgcolor: item.color || "primary.light",
                            color: "white",
                            cursor: "pointer",
                            "&:hover": {
                              opacity: 0.9,
                            },
                          }}
                          onClick={() => handleOpenDialog(item)}
                        >
                          {dragDropEnabled && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <DragIndicator sx={{ mr: 1, fontSize: 16 }} />
                              <Typography variant="caption">
                                {format(
                                  new Date(item.start?.dateTime || item.due),
                                  "h:mm a"
                                )}
                              </Typography>
                            </Box>
                          )}
                          <Typography variant="body2" fontWeight="bold">
                            {item.summary || item.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={item.type || "event"}
                            sx={{
                              mt: 0.5,
                              color: "white",
                              bgcolor: "primary.dark",
                            }}
                          />
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
                      No events
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderMonthView = () => {
    const weeks = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      weeks.push(monthDays.slice(i, i + 7));
    }

    return (
      <Box>
        <Grid container spacing={1}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Grid item xs key={day}>
              <Typography align="center" fontWeight="bold">
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {weeks.map((week, weekIndex) => (
          <Grid container spacing={1} key={weekIndex} sx={{ mb: 1 }}>
            {week.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);
              return (
                <Grid item xs key={dayIndex}>
                  <Card
                    sx={{
                      height: 120,
                      overflow: "auto",
                      bgcolor: isSameDay(day, new Date())
                        ? "primary.50"
                        : !isSameMonth(day, currentDate)
                        ? "grey.50"
                        : "white",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                    onClick={() => {
                      setCurrentDate(day);
                      setViewMode("day");
                    }}
                  >
                    <CardContent sx={{ p: 1 }}>
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          color: isSameDay(day, new Date())
                            ? "primary.main"
                            : !isSameMonth(day, currentDate)
                            ? "grey.400"
                            : "inherit",
                        }}
                      >
                        {format(day, "d")}
                      </Typography>

                      {dayEvents.slice(0, 3).map((event) => (
                        <Box
                          key={event.id}
                          sx={{
                            bgcolor: event.color || "primary.main",
                            color: "white",
                            borderRadius: 1,
                            p: 0.5,
                            mb: 0.5,
                            fontSize: "10px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {format(new Date(event.start.dateTime), "h:mm")} -{" "}
                          {event.summary.substring(0, 15)}
                          {event.summary.length > 15 ? "..." : ""}
                        </Box>
                      ))}

                      {dayEvents.length > 3 && (
                        <Typography variant="caption" color="textSecondary">
                          +{dayEvents.length - 3} more
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ))}
      </Box>
    );
  };

  const renderAgendaView = () => {
    const groupedEvents = {};
    filteredEvents.forEach((event) => {
      const date = event.start?.dateTime
        ? format(new Date(event.start.dateTime), "yyyy-MM-dd")
        : event.due
        ? format(new Date(event.due), "yyyy-MM-dd")
        : "unscheduled";
      if (!groupedEvents[date]) groupedEvents[date] = [];
      groupedEvents[date].push(event);
    });

    return (
      <Box>
        {Object.entries(groupedEvents)
          .sort()
          .map(([date, dateEvents]) => (
            <Box key={date} sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {date === "unscheduled"
                  ? "Unscheduled"
                  : format(new Date(date), "EEEE, MMMM d, yyyy")}
              </Typography>
              <Grid container spacing={2}>
                {dateEvents.map((event) => (
                  <Grid item xs={12} key={event.id}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography variant="h6">
                              {event.summary || event.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {event.description || event.notes}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                              <Chip
                                size="small"
                                label={event.type || "event"}
                                color="primary"
                              />
                              <Chip
                                size="small"
                                label={event.status || "scheduled"}
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setAnchorEl({
                                element: e.currentTarget,
                                eventId: event.id,
                              });
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
      </Box>
    );
  };

  const renderScheduleView = () => {
    const now = new Date();
    const upcomingEvents = filteredEvents
      .filter((event) => {
        const eventDate = event.start?.dateTime
          ? new Date(event.start.dateTime)
          : event.due
          ? new Date(event.due)
          : null;
        return eventDate && eventDate >= now;
      })
      .sort(
        (a, b) =>
          new Date(a.start?.dateTime || a.due) -
          new Date(b.start?.dateTime || b.due)
      );

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Upcoming Schedule
        </Typography>
        <List>
          {upcomingEvents.slice(0, 20).map((event) => {
            const eventDate = event.start?.dateTime
              ? new Date(event.start.dateTime)
              : new Date(event.due);
            const timeUntil = formatDistanceToNow(eventDate, {
              addSuffix: true,
            });

            return (
              <ListItem
                key={event.id}
                sx={{
                  mb: 1,
                  borderLeft: `4px solid ${event.color || "#4285F4"}`,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleOpenDialog(event)}
                  >
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: event.color || "#4285F4" }}>
                    {EVENT_TYPES.find((t) => t.id === event.type)?.icon || (
                      <EventIcon />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={event.summary || event.title}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary">
                        {format(eventDate, "PPPPpppp")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {timeUntil} • {event.location || "No location"}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          p: 3,
          bgcolor: "background.default",
          color: "text.primary",
          minHeight: "100vh",
        }}
      >
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {sidebarOpen && (
              <IconButton onClick={toggleSidebar}>
                <ChevronLeft />
              </IconButton>
            )}
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <EventIcon /> Enhanced Google Calendar
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Complete calendar solution with events, tasks, meetings, and
                more
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Search Bar */}
            <TextField
              size="small"
              placeholder="Search events, tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 200 }}
            />

            {/* Notification Bell */}
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ position: "relative" }}
            >
              <Badge badgeContent={getUnreadNotificationCount()} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* Settings */}
            <IconButton onClick={() => setSettingsOpen(true)}>
              <Settings />
            </IconButton>

            {/* Theme Toggle */}
            <IconButton onClick={toggleTheme}>
              {themeMode === "light" ? <DarkMode /> : <LightMode />}
            </IconButton>

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
                    onClick={() => setQuickAddOpen(true)}
                  >
                    Quick Add
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={syncCalendar}
                    disabled={loading}
                  >
                    {syncStatus === "syncing" ? "Syncing..." : "Sync"}
                  </Button>
                  <Button variant="outlined" color="error" onClick={logout}>
                    Logout
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* Sidebar */}
        {sidebarOpen && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Calendars
                  </Typography>
                  <List>
                    {calendars.map((calendar) => (
                      <ListItem key={calendar.id} disablePadding>
                        <ListItemButton
                          selected={selectedCalendar === calendar.id}
                          onClick={() => setSelectedCalendar(calendar.id)}
                        >
                          <ListItemIcon>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: calendar.color,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText primary={calendar.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>
                    Filters
                  </Typography>
                  {Object.entries(filterSettings).map(([key, value]) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Switch
                          size="small"
                          checked={value}
                          onChange={(e) =>
                            setFilterSettings({
                              ...filterSettings,
                              [key]: e.target.checked,
                            })
                          }
                        />
                      }
                      label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Upcoming
                  </Typography>
                  <List dense>
                    {getUpcomingEvents().map((event) => (
                      <ListItem key={event.id}>
                        <ListItemText
                          primary={event.summary}
                          secondary={format(
                            new Date(event.start.dateTime),
                            "MMM d, h:mm a"
                          )}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>
                    Overdue Tasks
                  </Typography>
                  <List dense>
                    {getOverdueTasks().map((task) => (
                      <ListItem key={task.id}>
                        <ListItemText
                          primary={task.title}
                          secondary="Overdue"
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={9}>
              {/* Main Content */}
              {/* Statistics Cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {Object.entries(stats).map(([key, value]) => (
                  <Grid item xs={6} sm={4} md={3} key={key}>
                    <Card>
                      <CardContent sx={{ textAlign: "center", p: 2 }}>
                        <Typography variant="h3" color="primary">
                          {value}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .toLowerCase()
                            .replace(/^\w/, (c) => c.toUpperCase())}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Calendar Navigation */}
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
                    {CALENDAR_VIEWS.map((view) => (
                      <ToggleButton key={view.id} value={view.id}>
                        {view.icon}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>

                {/* Calendar View */}
                {renderCalendarView()}
              </Paper>
            </Grid>
          </Grid>
        )}

        {!sidebarOpen && (
          <Box>
            {/* Statistics Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {Object.entries(stats).map(([key, value]) => (
                <Grid item xs={6} sm={4} md={3} key={key}>
                  <Card>
                    <CardContent sx={{ textAlign: "center", p: 2 }}>
                      <Typography variant="h3" color="primary">
                        {value}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .toLowerCase()
                          .replace(/^\w/, (c) => c.toUpperCase())}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Calendar Navigation */}
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
                  <IconButton onClick={toggleSidebar}>
                    <ChevronRight />
                  </IconButton>
                </Box>
              </Box>

              {/* Calendar View */}
              {renderCalendarView()}
            </Paper>
          </Box>
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
              errorDetails.type === "config_required" && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setConfigHelpOpen(true)}
                >
                  Fix Configuration
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

        {/* Quick Actions Bar */}
        {accessToken && (
          <Box
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              zIndex: 1000,
            }}
          >
            <Fab
              color="primary"
              onClick={() => setQuickAddOpen(true)}
              sx={{ boxShadow: 3 }}
            >
              <AddIcon />
            </Fab>
            <Fab
              color="secondary"
              onClick={() => setSettingsOpen(true)}
              size="small"
              sx={{ boxShadow: 2 }}
            >
              <Settings />
            </Fab>
            <Fab
              color="default"
              onClick={printSchedule}
              size="small"
              sx={{ boxShadow: 2 }}
            >
              <Print />
            </Fab>
          </Box>
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
              {selectedEvent ? "Edit Item" : `Create New ${formData.type}`}
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ pt: 2 }}>
              <Tabs
                value={formData.type}
                onChange={(e, newType) =>
                  setFormData({ ...formData, type: newType })
                }
                sx={{ mb: 3 }}
              >
                {EVENT_TYPES.map((type) => (
                  <Tab
                    key={type.id}
                    value={type.id}
                    icon={type.icon}
                    label={type.name}
                  />
                ))}
              </Tabs>

              <Grid container spacing={2}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title *"
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
                    rows={3}
                    label="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </Grid>

                {/* Date & Time */}
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
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.allDay}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            allDay: e.target.checked,
                          })
                        }
                      />
                    }
                    label="All Day Event"
                  />
                </Grid>

                {/* Location & Calendar */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Calendar</InputLabel>
                    <Select
                      value={formData.calendarId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          calendarId: e.target.value,
                        })
                      }
                      label="Calendar"
                    >
                      {calendars.map((calendar) => (
                        <MenuItem key={calendar.id} value={calendar.id}>
                          {calendar.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Color */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Color
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {CALENDAR_COLORS.map((color) => (
                      <IconButton
                        key={color}
                        sx={{
                          bgcolor: color,
                          width: 32,
                          height: 32,
                          "&:hover": { bgcolor: color, opacity: 0.8 },
                          border:
                            formData.color === color
                              ? "2px solid white"
                              : "none",
                          boxShadow:
                            formData.color === color
                              ? `0 0 0 2px ${color}`
                              : "none",
                        }}
                        onClick={() =>
                          setFormData({ ...formData, color: color })
                        }
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Additional Fields based on Type */}
                {formData.type === "appointment" && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Typography variant="h6">Customer Details</Typography>
                      </Divider>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Customer Name"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerName: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Customer Phone"
                        value={formData.customerPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerPhone: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Customer Email"
                        value={formData.customerEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customerEmail: e.target.value,
                          })
                        }
                      />
                    </Grid>
                  </>
                )}

                {formData.type === "task" && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Typography variant="h6">Task Details</Typography>
                      </Divider>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.value,
                            })
                          }
                          label="Status"
                        >
                          <MenuItem value="needsAction">To Do</MenuItem>
                          <MenuItem value="inProgress">In Progress</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Progress"
                        type="number"
                        value={formData.progress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            progress: parseInt(e.target.value) || 0,
                          })
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </>
                )}

                {formData.type === "meeting" && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Typography variant="h6">Meeting Details</Typography>
                      </Divider>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Meeting Link"
                        value={formData.conferenceData?.link}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            conferenceData: {
                              ...formData.conferenceData,
                              link: e.target.value,
                            },
                          })
                        }
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      />
                    </Grid>
                  </>
                )}

                {/* Notifications */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="h6">Notifications</Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12}>
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

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Notification Methods
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {NOTIFICATION_TYPES.map((type) => (
                      <Chip
                        key={type.id}
                        icon={type.icon}
                        label={type.name}
                        onClick={() => {
                          const current = formData.notificationTypes;
                          const newTypes = current.includes(type.id)
                            ? current.filter((t) => t !== type.id)
                            : [...current, type.id];
                          setFormData({
                            ...formData,
                            notificationTypes: newTypes,
                          });
                        }}
                        color={
                          formData.notificationTypes.includes(type.id)
                            ? "primary"
                            : "default"
                        }
                        variant={
                          formData.notificationTypes.includes(type.id)
                            ? "filled"
                            : "outlined"
                        }
                      />
                    ))}
                  </Box>
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
                    label="Send email notification"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              startIcon={<Close />}
              color="inherit"
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                if (formData.type === "task") {
                  createTask();
                } else if (formData.type === "reminder") {
                  createReminder();
                } else {
                  createEvent();
                }
              }}
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
                "Update"
              ) : (
                "Create"
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
              const event = filteredEvents.find(
                (e) => e.id === anchorEl.eventId
              );
              if (event) handleOpenDialog(event);
              setAnchorEl(null);
            }}
          >
            <EditIcon sx={{ mr: 1 }} /> Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              const event = filteredEvents.find(
                (e) => e.id === anchorEl.eventId
              );
              if (event) {
                navigator.clipboard.writeText(`
                  ${event.type || "Event"}: ${event.summary || event.title}
                  Date: ${
                    event.start?.dateTime
                      ? format(new Date(event.start.dateTime), "PPpp")
                      : event.due
                      ? format(new Date(event.due), "PPpp")
                      : "N/A"
                  }
                  Location: ${event.location || "N/A"}
                  Description: ${event.description || event.notes || "N/A"}
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
              const event = filteredEvents.find(
                (e) => e.id === anchorEl.eventId
              );
              if (event?.customerInfo?.phone) {
                window.open(`tel:${event.customerInfo.phone}`, "_blank");
              }
              setAnchorEl(null);
            }}
          >
            <Call sx={{ mr: 1 }} /> Call
          </MenuItem>
          <MenuItem
            onClick={() => {
              const event = filteredEvents.find(
                (e) => e.id === anchorEl.eventId
              );
              if (event?.customerInfo?.email) {
                window.open(
                  `mailto:${event.customerInfo.email}?subject=${event.summary}`,
                  "_blank"
                );
              }
              setAnchorEl(null);
            }}
          >
            <Email sx={{ mr: 1 }} /> Email
          </MenuItem>
          <MenuItem
            onClick={() => {
              const event = filteredEvents.find(
                (e) => e.id === anchorEl.eventId
              );
              if (event) deleteEvent(event.id, event.calendarId);
              setAnchorEl(null);
            }}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>

        {/* Configuration Help Dialog */}
        <ConfigHelpDialog />

        {/* Settings Dialog */}
        <SettingsDialog />

        {/* Quick Add Dialog */}
        <QuickAddDialog />

        {/* Notifications Panel */}
        <NotificationsPanel />

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

        {/* Loading Backdrop */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </DndProvider>
  );
};

export default EnhancedGoogleCalendar;
