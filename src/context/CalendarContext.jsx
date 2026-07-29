/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  differenceInHours,
  differenceInMinutes,
  format,
  isAfter,
  isSameDay,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { CONFIG } from "../config/calendar";
import { CALENDAR_COLORS } from "../constant/calendar";
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
  verifyTokenValidity,
} from "../utils/auth";
import { createDefaultFormData } from "../utils/calendar/formDefaults";
import {
  buildEventDescription,
  categorizeStoredEvents,
  computeStats,
  DEFAULT_CALENDARS,
  determineEventType,
  extractCustomerInfo,
  extractServiceType,
  getEventDateTime,
} from "../utils/calendar/helpers";
import { EmailTemplates } from "../utils/email";
import { fixDateTimeFormat, formatForDateTimeLocal } from "../utils/date";

export const CalendarContext = createContext(null);

export const CalendarProvider = ({ children }) => {
  const savedSession = useMemo(() => loadAuthSession(), []);
  const notificationSoundRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [calendars, setCalendars] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [configHelpOpen, setConfigHelpOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [viewMode, setViewMode] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState(0);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState("synced");
  const [searchQuery, setSearchQuery] = useState("");
  const [dragDropEnabled, setDragDropEnabled] = useState(true);
  const [selectedCalendar, setSelectedCalendar] = useState("primary");
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("calendar_theme") || "light",
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    popup: true,
    sound: true,
    vibrate: false,
    desktop: false,
    mobile: true,
    web: true,
    browser: true,
  });
  const [emailSettings, setEmailSettings] = useState({
    sendEmails: true,
    sendUpdates: true,
    sendReminders: true,
    sendInvitations: true,
    sendCancellations: true,
    includeDetails: true,
    signature: "Sent from Enhanced Calendar",
    defaultReminder: 30,
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [eventMenuAnchor, setEventMenuAnchor] = useState(null);
  const [selectedEventForMenu, setSelectedEventForMenu] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailContent, setEmailContent] = useState({
    to: "",
    subject: "",
    body: "",
  });

  const [accessToken, setAccessToken] = useState(savedSession?.token || null);
  const [userProfile, setUserProfile] = useState(savedSession?.profile || null);
  const [isTokenValidated, setIsTokenValidated] = useState(false);

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

  const [formData, setFormData] = useState(createDefaultFormData);

  const showNotification = useCallback((message, severity = "info") => {
    setNotification({ open: true, message, severity });
  }, []);

  const updateStats = useCallback((eventsList, tasksList, remindersList, appointmentsList) => {
    setStats(computeStats(eventsList, tasksList, remindersList, appointmentsList));
  }, []);

  const fetchUserProfile = async (token) => {
    const { data } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { alt: "json" },
      },
    );
    return data;
  };

  const testCalendarAccess = async (token) => {
    await axios.get(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { maxResults: 1 },
      },
    );
  };

  const handleLogout = useCallback(async () => {
    try {
      if (accessToken) {
        await axios
          .post("https://oauth2.googleapis.com/revoke", null, {
            params: { token: accessToken },
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          })
          .catch(() => {});
      }
    } catch (error) {
      console.warn("Error during logout:", error);
    } finally {
      clearAuthSession();
      googleLogout();
      setAccessToken(null);
      setUserProfile(null);
      setIsTokenValidated(false);
      setEvents([]);
      setTasks([]);
      setReminders([]);
      setAppointments([]);
      setErrorDetails(null);
      showNotification("Logged out successfully", "info");
    }
  }, [accessToken, showNotification]);

  const handleGoogleError = useCallback(
    (error) => {
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
                "Ensure end time is after start time",
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
            handleLogout();
            break;
          case 403: {
            const errorMsg = data.error?.message || "";
            if (errorMsg.includes("has not been used in project")) {
              setErrorDetails({
                type: "config_required",
                message: "Configuration Required",
                details: [
                  "Please enable Calendar API in Google Cloud Console",
                  "Add your email as a test user",
                ],
              });
              setConfigHelpOpen(true);
            }
            break;
          }
          default:
            setErrorDetails({
              type: "server_error",
              message: "Server Error",
              details: `Status: ${status}`,
            });
        }
      }
      showNotification("Operation failed. Check error details.", "error");
    },
    [handleLogout, showNotification],
  );

  const fetchCalendarEvents = useCallback(
    async (token, calendarId = "primary") => {
      try {
        setLoading(true);
        const now = new Date();
        const { data } = await axios.get(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              timeMin: subDays(now, 30).toISOString(),
              timeMax: addDays(now, 90).toISOString(),
              singleEvents: true,
              orderBy: "startTime",
              maxResults: 250,
              showDeleted: false,
            },
          },
        );

        const formattedEvents = (data.items || []).map((event) => ({
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
          type: determineEventType(event),
          isGarageEvent: event.description?.includes("Trust Auto Solution"),
          serviceType: extractServiceType(event.description),
          customerInfo: extractCustomerInfo(event.description),
          calendarId,
          created: event.created,
          updated: event.updated,
          notifications: event.notifications || [],
        }));

        const eventsList = formattedEvents.filter((e) => e.type === "event");
        const tasksList = formattedEvents.filter((e) => e.type === "task");
        const remindersList = formattedEvents.filter((e) => e.type === "reminder");
        const appointmentsList = formattedEvents.filter(
          (e) => e.type === "appointment",
        );

        setEvents(eventsList);
        setTasks(tasksList);
        setReminders(remindersList);
        setAppointments(appointmentsList);

        const allEvents = [
          ...eventsList,
          ...tasksList,
          ...remindersList,
          ...appointmentsList,
        ];
        localStorage.setItem("calendar_events", JSON.stringify(allEvents));
        updateStats(eventsList, tasksList, remindersList, appointmentsList);
        return formattedEvents;
      } catch (error) {
        if (error.response?.status === 401) {
          handleLogout();
          showNotification("Session expired. Please login again.", "warning");
        }
        handleGoogleError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleGoogleError, handleLogout, showNotification, updateStats],
  );

  const login = useGoogleLogin({
    scope: CONFIG.scopes,
    onSuccess: async (response) => {
      setLoading(true);
      setErrorDetails(null);
      const token = response.access_token;

      try {
        const profile = await fetchUserProfile(token);
        await testCalendarAccess(token);
        saveAuthSession(token, profile);
        setAccessToken(token);
        setUserProfile(profile);
        setIsTokenValidated(true);
        await fetchCalendarEvents(token);
        showNotification("✅ Connected to Google Calendar!", "success");
      } catch (error) {
        if (
          error.response?.status === 403 &&
          error.response?.data?.error?.message?.includes(
            "insufficient authentication scopes",
          )
        ) {
          setErrorDetails({
            type: "scope_error",
            message: "Insufficient Permissions",
            details: [
              "The app requires additional permissions to access Google Calendar.",
              "Please ensure you grant all requested permissions during login.",
              "Try logging out and logging in again.",
            ],
          });
          showNotification("Please grant all requested permissions", "error");
        } else {
          handleGoogleError(error);
        }
        clearAuthSession();
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => handleGoogleError(error),
    flow: "implicit",
  });

  const sendEmailNotification = async (item, notif) => {
    if (!emailSettings.sendEmails || !item.customerEmail) return;

    setIsSendingEmail(true);
    try {
      switch (item.type) {
        case "event":
          EmailTemplates.eventReminder(item, notif.minutes);
          break;
        case "appointment":
          EmailTemplates.appointmentConfirmed(item, {
            name: item.customerName,
          });
          break;
        case "task":
          EmailTemplates.taskAssigned(item, item.assignedTo);
          break;
        default:
          break;
      }
      showNotification("Email notification sent", "success");
    } catch (error) {
      console.error("Failed to send email:", error);
      showNotification("Failed to send email", "error");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const triggerNotification = useCallback(
    (item, notif) => {
      const notificationObj = {
        id: uuidv4(),
        type: "reminder",
        title: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Reminder`,
        message: `${item.summary} - ${format(
          new Date(getEventDateTime(item)),
          "h:mm a",
        )}`,
        data: item,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [notificationObj, ...prev.slice(0, 99)]);

      if (notificationSettings.browser && Notification.permission === "granted") {
        new Notification(notificationObj.title, {
          body: notificationObj.message,
          icon: "/calendar-icon.png",
          tag: item.id,
        });
      }

      if (notificationSettings.sound && notificationSoundRef.current) {
        notificationSoundRef.current.currentTime = 0;
        notificationSoundRef.current.play().catch(console.error);
      }

      if (notif.type === "email" && emailSettings.sendReminders) {
        sendEmailNotification(item, notif);
      }

      showNotification(
        `Reminder: ${item.summary} at ${format(
          new Date(getEventDateTime(item)),
          "h:mm a",
        )}`,
        "info",
      );
    },
    [emailSettings.sendReminders, notificationSettings, showNotification],
  );

  const triggerOverdueNotification = useCallback((item) => {
    const notificationObj = {
      id: uuidv4(),
      type: "overdue",
      title: `Overdue ${item.type}`,
      message: `${item.summary} is overdue`,
      data: item,
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [notificationObj, ...prev.slice(0, 99)]);
  }, []);

  const checkForScheduledNotifications = useCallback(() => {
    const now = new Date();
    const allItems = [...events, ...tasks, ...reminders, ...appointments];

    allItems.forEach((item) => {
      if (!getEventDateTime(item)) return;

      const eventTime = new Date(getEventDateTime(item));
      const timeDiff = differenceInMinutes(eventTime, now);

      if (item.notifications) {
        item.notifications.forEach((notif) => {
          if (!notif.sent && timeDiff > 0 && timeDiff <= notif.minutes) {
            triggerNotification(item, notif);
            notif.sent = true;
          }
        });
      }

      if (timeDiff < 0 && !item.notifiedOverdue) {
        if (item.type === "task" && item.status !== "completed") {
          triggerOverdueNotification(item);
          item.notifiedOverdue = true;
        }
      }
    });
  }, [
    appointments,
    events,
    reminders,
    tasks,
    triggerNotification,
    triggerOverdueNotification,
  ]);

  const resetForm = useCallback(() => {
    setFormData(createDefaultFormData());
    setSelectedEvent(null);
  }, []);

  const createEvent = async () => {
    if (!accessToken && !formData.customerEmail) {
      showNotification("Please login or provide customer email", "warning");
      return;
    }

    try {
      setLoading(true);

      if (!formData.summary || !formData.startTime) {
        showNotification("Please fill required fields", "warning");
        return;
      }

      const startDateTime = fixDateTimeFormat(formData.startTime);
      const endDateTime = formData.endTime
        ? fixDateTimeFormat(formData.endTime, true)
        : new Date(new Date(startDateTime).getTime() + 60 * 60000).toISOString();

      if (new Date(endDateTime) <= new Date(startDateTime)) {
        showNotification("End time must be after start time", "error");
        return;
      }

      const description = buildEventDescription(formData);
      const eventPayload = {
        summary: formData.summary,
        description,
        start: { dateTime: startDateTime, timeZone: formData.timeZone },
        end: { dateTime: endDateTime, timeZone: formData.timeZone },
        location: formData.location || "",
        colorId: formData.color,
        reminders: {
          useDefault: false,
          overrides: formData.notifications.map((notif) => ({
            method: notif.type === "email" ? "email" : "popup",
            minutes: notif.minutes,
          })),
        },
        attendees: formData.customerEmail
          ? [{ email: formData.customerEmail }]
          : [],
        guestsCanModify: formData.guestsCanModify,
        guestsCanInviteOthers: formData.guestsCanInviteOthers,
        guestsCanSeeOtherGuests: formData.guestsCanSeeOtherGuests,
        visibility: formData.private ? "private" : "default",
        transparency: formData.busy ? "opaque" : "transparent",
      };

      let response;
      if (accessToken) {
        response = await axios.post(
          `https://www.googleapis.com/calendar/v3/calendars/${formData.calendarId}/events`,
          eventPayload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          },
        );
      } else {
        response = {
          data: {
            ...eventPayload,
            id: uuidv4(),
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            status: "confirmed",
            creator: { email: "local@user.com" },
            organizer: { email: "local@user.com" },
          },
        };
      }

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
        taskStatus: formData.taskStatus,
        checklist: formData.checklist,
        dueDate: formData.dueDate,
        priority: formData.priority,
        notifications: formData.notifications,
        important: formData.important,
        repeatReminder: formData.repeatReminder,
      };

      switch (formData.type) {
        case "task":
          setTasks((prev) => [newEvent, ...prev]);
          break;
        case "reminder":
          setReminders((prev) => [newEvent, ...prev]);
          break;
        case "appointment":
          setAppointments((prev) => [newEvent, ...prev]);
          break;
        default:
          setEvents((prev) => [newEvent, ...prev]);
      }

      const allEvents = [...events, ...tasks, ...reminders, ...appointments];
      localStorage.setItem(
        "calendar_events",
        JSON.stringify([newEvent, ...allEvents]),
      );

      if (formData.customerEmail && emailSettings.sendEmails) {
        sendEmailNotification(newEvent, { type: "email", minutes: 0 });
      }

      setOpenDialog(false);
      resetForm();
      showNotification(`${formData.type} created successfully!`, "success");
      updateStats([...events, newEvent], tasks, reminders, appointments);
    } catch (error) {
      console.error("Event creation error:", error);
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async () => {
    if (!selectedEvent) return;

    try {
      setLoading(true);
      const startDateTime = fixDateTimeFormat(formData.startTime);
      const endDateTime = formData.endTime
        ? fixDateTimeFormat(formData.endTime, true)
        : new Date(new Date(startDateTime).getTime() + 60 * 60000).toISOString();

      const eventUpdate = {
        ...selectedEvent,
        summary: formData.summary,
        description: formData.description,
        start: { dateTime: startDateTime, timeZone: formData.timeZone },
        end: { dateTime: endDateTime, timeZone: formData.timeZone },
        location: formData.location,
        colorId: formData.color,
      };

      if (accessToken) {
        await axios.put(
          `https://www.googleapis.com/calendar/v3/calendars/${
            selectedEvent.calendarId || "primary"
          }/events/${selectedEvent.id}`,
          eventUpdate,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          },
        );
        await fetchCalendarEvents(
          accessToken,
          selectedEvent.calendarId || "primary",
        );
      } else {
        const updateState = (state, setState) => {
          setState(
            state.map((item) =>
              item.id === selectedEvent.id ? { ...item, ...eventUpdate } : item,
            ),
          );
        };

        switch (selectedEvent.type) {
          case "task":
            updateState(tasks, setTasks);
            break;
          case "reminder":
            updateState(reminders, setReminders);
            break;
          case "appointment":
            updateState(appointments, setAppointments);
            break;
          default:
            updateState(events, setEvents);
        }
      }

      if (emailSettings.sendUpdates && selectedEvent.customerEmail) {
        sendEmailNotification(selectedEvent, { type: "email", minutes: 0 });
      }

      setOpenDialog(false);
      resetForm();
      showNotification("Event updated successfully!", "success");
    } catch (error) {
      console.error("Update error:", error);
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId, calendarId = "primary") => {
    try {
      if (accessToken) {
        await axios.delete(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      }

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      setTasks((prev) => prev.filter((event) => event.id !== eventId));
      setReminders((prev) => prev.filter((event) => event.id !== eventId));
      setAppointments((prev) => prev.filter((event) => event.id !== eventId));

      const allEvents = [...events, ...tasks, ...reminders, ...appointments];
      localStorage.setItem(
        "calendar_events",
        JSON.stringify(allEvents.filter((e) => e.id !== eventId)),
      );

      showNotification("Event deleted successfully!", "success");
    } catch (error) {
      console.error("Delete error:", error);
      handleGoogleError(error);
    }
  };

  const syncCalendar = async () => {
    if (!accessToken || !isTokenValidated) return;

    try {
      setSyncStatus("syncing");
      setLoading(true);
      await fetchCalendarEvents(accessToken, "primary");
      setSyncStatus("synced");
      showNotification("Calendar synced successfully!", "success");
    } catch (error) {
      setSyncStatus("error");
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (item, dropLocation) => {
    try {
      setLoading(true);
      const { date, time } = dropLocation;
      const [hours, minutes] = time.split(":").map(Number);
      const newStartTime = new Date(date);
      newStartTime.setHours(hours, minutes, 0, 0);
      const newEndTime = new Date(newStartTime.getTime() + 60 * 60000);

      const eventToUpdate = [...events, ...tasks, ...reminders, ...appointments].find(
        (e) => e.id === item.id,
      );
      if (!eventToUpdate) return;

      const updatedEvent = {
        ...eventToUpdate,
        start: {
          dateTime: newStartTime.toISOString(),
          timeZone: eventToUpdate.start.timeZone || formData.timeZone,
        },
        end: {
          dateTime: newEndTime.toISOString(),
          timeZone: eventToUpdate.end.timeZone || formData.timeZone,
        },
      };

      if (accessToken) {
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
          },
        );
        await fetchCalendarEvents(
          accessToken,
          eventToUpdate.calendarId || "primary",
        );
      } else {
        const updateState = (state, setState) => {
          setState(
            state.map((entry) =>
              entry.id === eventToUpdate.id ? { ...entry, ...updatedEvent } : entry,
            ),
          );
        };

        switch (eventToUpdate.type) {
          case "task":
            updateState(tasks, setTasks);
            break;
          case "reminder":
            updateState(reminders, setReminders);
            break;
          case "appointment":
            updateState(appointments, setAppointments);
            break;
          default:
            updateState(events, setEvents);
        }
      }

      showNotification("Event moved successfully!", "success");
    } catch (error) {
      console.error("Drag and drop error:", error);
      handleGoogleError(error);
    } finally {
      setLoading(false);
    }
  };

  const quickCreate = (type) => {
    const now = new Date();
    const startTime = addHours(now, 1);
    const endTime = addHours(startTime, 1);

    let template = {
      type,
      summary: "",
      description: "",
      startTime: formatForDateTimeLocal(startTime),
      endTime: formatForDateTimeLocal(endTime),
      dueDate: formatForDateTimeLocal(addDays(now, 1)),
      reminderTime: formatForDateTimeLocal(addHours(now, 1)),
      color:
        CALENDAR_COLORS[Math.floor(Math.random() * CALENDAR_COLORS.length)].id,
    };

    switch (type) {
      case "meeting":
        template = {
          ...template,
          summary: "Team Meeting",
          description: "Weekly team sync",
          agenda: "1. Project updates\n2. Roadmap discussion\n3. Action items",
        };
        break;
      case "task":
        template = {
          ...template,
          summary: "Complete project report",
          description: "Finish the quarterly project report",
          taskStatus: "not_started",
          checklist: [
            { id: uuidv4(), text: "Gather data", completed: false },
            { id: uuidv4(), text: "Write draft", completed: false },
            { id: uuidv4(), text: "Review with team", completed: false },
          ],
        };
        break;
      case "event":
        template = {
          ...template,
          summary: "Company Event",
          description: "Annual company gathering",
        };
        break;
      case "appointment":
        template = {
          ...template,
          summary: "Client Meeting",
          description: "Project kickoff meeting",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          customerPhone: "+1234567890",
          serviceType: "Consultation",
        };
        break;
      case "reminder":
        template = {
          ...template,
          summary: "Submit timesheet",
          description: "Weekly timesheet submission",
          important: true,
          repeatReminder: "weekly",
        };
        break;
      default:
        break;
    }

    setFormData((prev) => ({ ...prev, ...template }));
    setOpenDialog(true);
  };

  const handleOpenDialog = (event = null, type = "event") => {
    if (event) {
      setSelectedEvent(event);
      const customerInfo = extractCustomerInfo(event.description);
      const formatISOToInput = (isoDate) => {
        try {
          return formatForDateTimeLocal(new Date(isoDate));
        } catch {
          return "";
        }
      };

      setFormData((prev) => ({
        ...prev,
        type: event.type || "event",
        summary: event.summary || "",
        description: event.description || "",
        startTime: event.start?.dateTime
          ? formatISOToInput(event.start.dateTime)
          : "",
        endTime: event.end?.dateTime ? formatISOToInput(event.end.dateTime) : "",
        location: event.location || "",
        customerEmail: customerInfo.email || "",
        customerPhone: customerInfo.phone || "",
        customerName: customerInfo.name || "",
        serviceType: extractServiceType(event.description),
        color: event.colorId || CALENDAR_COLORS[0].id,
        calendarId: event.calendarId || "primary",
        status: event.status || "scheduled",
        priority: event.priority || "medium",
        taskStatus: event.taskStatus || "not_started",
        checklist: event.checklist || [],
        dueDate: event.dueDate ? formatISOToInput(event.dueDate) : "",
        important: event.important || false,
        repeatReminder: event.repeatReminder || "none",
        notifications: event.notifications || [
          { type: "popup", minutes: 30, sent: false },
          { type: "email", minutes: 60, sent: false },
        ],
      }));
    } else {
      resetForm();
      setFormData((prev) => ({
        ...prev,
        type,
        color:
          CALENDAR_COLORS[Math.floor(Math.random() * CALENDAR_COLORS.length)].id,
      }));
    }
    setOpenDialog(true);
  };

  const sendCustomEmail = async () => {
    setIsSendingEmail(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showNotification("Email sent successfully", "success");
      setEmailDialogOpen(false);
    } catch {
      showNotification("Failed to send email", "error");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = themeMode === "light" ? "dark" : "light";
    setThemeMode(newTheme);
    localStorage.setItem("calendar_theme", newTheme);
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const clearError = () => setErrorDetails(null);

  const goToToday = () => setCurrentDate(new Date());
  const goToPrevious = () => {
    if (viewMode === "week") setCurrentDate((prev) => subWeeks(prev, 1));
    else if (viewMode === "month") setCurrentDate((prev) => subMonths(prev, 1));
    else setCurrentDate((prev) => subDays(prev, 1));
  };
  const goToNext = () => {
    if (viewMode === "week") setCurrentDate((prev) => addWeeks(prev, 1));
    else if (viewMode === "month") setCurrentDate((prev) => addMonths(prev, 1));
    else setCurrentDate((prev) => addDays(prev, 1));
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const clearAllNotifications = () => setNotifications([]);

  const getUnreadNotificationCount = () =>
    notifications.filter((n) => !n.read).length;

  const getUpcomingEvents = () => {
    const now = new Date();
    const allItems = [...events, ...tasks, ...reminders, ...appointments];
    return allItems
      .filter((item) => {
        const itemTime = getEventDateTime(item);
        if (!itemTime) return false;
        return (
          new Date(itemTime) > now && differenceInHours(new Date(itemTime), now) <= 24
        );
      })
      .sort((a, b) => new Date(getEventDateTime(a)) - new Date(getEventDateTime(b)))
      .slice(0, 5);
  };

  const filteredEvents = useMemo(() => {
    const allItems = [...events, ...tasks, ...reminders, ...appointments];
    let filtered = [...allItems];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.summary || "").toLowerCase().includes(query) ||
          (item.description || "").toLowerCase().includes(query) ||
          (item.location || "").toLowerCase().includes(query) ||
          (item.customerInfo?.name || "").toLowerCase().includes(query) ||
          (item.serviceType || "").toLowerCase().includes(query),
      );
    }

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

    if (!filterSettings.showCompleted) {
      filtered = filtered.filter(
        (item) =>
          item.status !== "completed" && item.taskStatus !== "completed",
      );
    }

    if (!filterSettings.showCancelled) {
      filtered = filtered.filter((item) => item.status !== "cancelled");
    }

    if (!filterSettings.showPast) {
      const now = new Date();
      filtered = filtered.filter((item) => {
        const itemDate = new Date(getEventDateTime(item));
        return isAfter(itemDate, now) || isSameDay(itemDate, now);
      });
    }

    return filtered;
  }, [events, tasks, reminders, appointments, searchQuery, filterSettings]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setCalendars(DEFAULT_CALENDARS);

        const savedEvents = localStorage.getItem("calendar_events");
        if (savedEvents) {
          try {
            const parsedEvents = JSON.parse(savedEvents);
            const categorized = categorizeStoredEvents(parsedEvents);
            setEvents(categorized.events);
            setTasks(categorized.tasks);
            setReminders(categorized.reminders);
            setAppointments(categorized.appointments);
          } catch (e) {
            console.error("Error parsing saved events:", e);
          }
        }

        if (accessToken && userProfile) {
          setLoading(true);
          try {
            const isValid = await verifyTokenValidity(accessToken);
            if (isValid) {
              await testCalendarAccess(accessToken);
              await fetchCalendarEvents(accessToken);
              setIsTokenValidated(true);
              showNotification("Welcome back!", "success");
            } else {
              handleLogout();
              showNotification("Session expired. Please login again.", "info");
            }
          } catch (error) {
            if (
              error.response?.status === 403 &&
              error.response?.data?.error?.message?.includes(
                "insufficient authentication scopes",
              )
            ) {
              setErrorDetails({
                type: "scope_error",
                message: "Session Expired - Permissions Changed",
                details: [
                  "Your previous session doesn't have the required permissions.",
                  "Please login again to grant all necessary permissions.",
                ],
              });
              handleLogout();
              showNotification("Please login again with all permissions", "warning");
            } else if (error.response?.status === 401) {
              handleLogout();
              showNotification("Session expired. Please login again.", "info");
            } else {
              setIsTokenValidated(true);
              showNotification("Restored session with limited access", "warning");
            }
          } finally {
            setLoading(false);
          }
        } else {
          setIsTokenValidated(true);
        }

        checkForScheduledNotifications();
      } catch (error) {
        console.error("Error during app initialization:", error);
        showNotification("Error initializing app", "error");
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (accessToken && isTokenValidated) {
        syncCalendar();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [accessToken, isTokenValidated]);

  useEffect(() => {
    const notificationInterval = setInterval(() => {
      checkForScheduledNotifications();
    }, 30000);
    return () => clearInterval(notificationInterval);
  }, [checkForScheduledNotifications]);

  const value = {
    events,
    tasks,
    reminders,
    appointments,
    calendars,
    setCalendars,
    loading,
    errorDetails,
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    dragDropEnabled,
    setDragDropEnabled,
    selectedCalendar,
    setSelectedCalendar,
    themeMode,
    setThemeMode,
    toggleTheme,
    toggleSidebar,
    notifications,
    notificationSettings,
    setNotificationSettings,
    emailSettings,
    setEmailSettings,
    stats,
    formData,
    setFormData,
    openDialog,
    setOpenDialog,
    selectedEvent,
    settingsOpen,
    setSettingsOpen,
    quickAddOpen,
    setQuickAddOpen,
    emailDialogOpen,
    setEmailDialogOpen,
    configHelpOpen,
    setConfigHelpOpen,
    notification,
    setNotification,
    anchorEl,
    setAnchorEl,
    eventMenuAnchor,
    setEventMenuAnchor,
    selectedEventForMenu,
    setSelectedEventForMenu,
    emailContent,
    setEmailContent,
    userProfile,
    accessToken,
    isTokenValidated,
    syncStatus,
    isOnline,
    isSendingEmail,
    filterSettings,
    setFilterSettings,
    filteredEvents,
    notificationSoundRef,
    login,
    handleLogout,
    createEvent,
    updateEvent,
    deleteEvent,
    syncCalendar,
    resetForm,
    handleOpenDialog,
    showNotification,
    goToToday,
    goToPrevious,
    goToNext,
    handleDrop,
    quickCreate,
    sendCustomEmail,
    clearError,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    getUnreadNotificationCount,
    getUpcomingEvents,
  };

  return (
    <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
