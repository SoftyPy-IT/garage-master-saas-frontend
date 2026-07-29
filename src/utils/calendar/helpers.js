import { format, isSameDay } from "date-fns";
import { CALENDAR_COLORS } from "../../constant/calendar";
import { SERVICE_TYPES } from "../../constant/calendar";

export const DEFAULT_CALENDARS = [
  {
    id: "primary",
    name: "Primary Calendar",
    color: CALENDAR_COLORS[0].id,
    selected: true,
    visible: true,
    type: "personal",
  },
  {
    id: "work",
    name: "Work Calendar",
    color: CALENDAR_COLORS[1].id,
    selected: false,
    visible: true,
    type: "work",
  },
  {
    id: "personal",
    name: "Personal Calendar",
    color: CALENDAR_COLORS[2].id,
    selected: false,
    visible: true,
    type: "personal",
  },
  {
    id: "tasks",
    name: "Tasks",
    color: CALENDAR_COLORS[3].id,
    selected: false,
    visible: true,
    type: "task",
  },
  {
    id: "reminders",
    name: "Reminders",
    color: CALENDAR_COLORS[4].id,
    selected: false,
    visible: true,
    type: "reminder",
  },
];

export const determineEventType = (event) => {
  const summary = (event.summary || "").toLowerCase();
  const description = (event.description || "").toLowerCase();

  if (summary.includes("reminder") || description.includes("reminder")) {
    return "reminder";
  }
  if (summary.includes("meeting") || description.includes("meeting")) {
    return "meeting";
  }
  if (
    summary.includes("appointment") ||
    description.includes("appointment")
  ) {
    return "appointment";
  }
  if (summary.includes("task") || description.includes("task")) {
    return "task";
  }
  return "event";
};

export const extractServiceType = (description) => {
  if (!description) return "General";
  const service = SERVICE_TYPES.find((s) =>
    description.toLowerCase().includes(s.name.toLowerCase()),
  );
  return service?.name || "General";
};

export const extractCustomerInfo = (description) => {
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

export const getColorById = (colorId) => {
  const color =
    CALENDAR_COLORS.find((c) => c.id === colorId) || CALENDAR_COLORS[0];
  return color.hex;
};

export const getEventsForDay = (day, events, tasks, reminders, appointments) => {
  const allItems = [...events, ...tasks, ...reminders, ...appointments];
  return allItems.filter((item) => {
    if (!item.start?.dateTime && !item.dueDate && !item.reminderTime) {
      return false;
    }
    const itemDate = new Date(
      item.start?.dateTime || item.dueDate || item.reminderTime,
    );
    return isSameDay(itemDate, day);
  });
};

export const formatStatLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());

export const getEventDateTime = (item) =>
  item.start?.dateTime || item.dueDate || item.reminderTime;

export const categorizeStoredEvents = (parsedEvents) => ({
  events: parsedEvents.filter((e) => e.type === "event" || !e.type),
  tasks: parsedEvents.filter((e) => e.type === "task"),
  reminders: parsedEvents.filter((e) => e.type === "reminder"),
  appointments: parsedEvents.filter((e) => e.type === "appointment"),
});

export const buildEventDescription = (formData) => {
  let description = formData.description || "";

  switch (formData.type) {
    case "task":
      description += `\n\n--- Task Details ---\n`;
      description += `Status: ${formData.taskStatus}\n`;
      description += `Priority: ${formData.priority}\n`;
      description += `Due: ${formData.dueDate}\n`;
      if (formData.checklist.length > 0) {
        description += `Checklist:\n`;
        formData.checklist.forEach((item, idx) => {
          description += `  ${idx + 1}. ${item.text} ${
            item.completed ? "[✓]" : "[ ]"
          }\n`;
        });
      }
      break;
    case "appointment":
      description += `\n\n--- Appointment Details ---\n`;
      if (formData.customerName)
        description += `Customer: ${formData.customerName}\n`;
      if (formData.customerPhone)
        description += `Phone: ${formData.customerPhone}\n`;
      if (formData.customerEmail)
        description += `Email: ${formData.customerEmail}\n`;
      if (formData.serviceType)
        description += `Service: ${formData.serviceType}\n`;
      if (formData.serviceNotes)
        description += `Notes: ${formData.serviceNotes}\n`;
      break;
    case "reminder":
      description += `\n\n--- Reminder Details ---\n`;
      description += `Important: ${formData.important ? "Yes" : "No"}\n`;
      description += `Repeat: ${formData.repeatReminder}\n`;
      break;
    case "meeting":
      description += `\n\n--- Meeting Details ---\n`;
      if (formData.agenda) description += `Agenda: ${formData.agenda}\n`;
      if (formData.conferenceLink)
        description += `Join: ${formData.conferenceLink}\n`;
      break;
    default:
      break;
  }

  description += `\nCreated via: Enhanced Calendar App`;
  return description.trim();
};

export const computeStats = (eventsList, tasksList, remindersList, appointmentsList) => {
  const now = new Date();
  const today = format(now, "yyyy-MM-dd");

  const allItems = [
    ...eventsList,
    ...tasksList,
    ...remindersList,
    ...appointmentsList,
  ];

  const todayItems = allItems.filter((item) => {
    const itemDate = getEventDateTime(item);
    return itemDate && format(new Date(itemDate), "yyyy-MM-dd") === today;
  });

  const upcomingItems = allItems.filter((item) => {
    const itemDate = getEventDateTime(item);
    return itemDate && new Date(itemDate) > now;
  });

  const overdueTasks = tasksList.filter((task) => {
    if (task.taskStatus === "completed") return false;
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    return dueDate && dueDate < now;
  });

  return {
    totalEvents: allItems.length,
    todayEvents: todayItems.length,
    upcomingEvents: upcomingItems.length,
    completedEvents: eventsList.filter((e) => e.status === "completed").length,
    overdueTasks: overdueTasks.length,
    pendingReminders: remindersList.filter((r) => !r.notified).length,
    meetingsToday: eventsList.filter(
      (e) =>
        e.type === "meeting" &&
        e.start?.dateTime &&
        format(new Date(e.start.dateTime), "yyyy-MM-dd") === today,
    ).length,
    appointmentsToday: appointmentsList.filter(
      (a) =>
        a.start?.dateTime &&
        format(new Date(a.start.dateTime), "yyyy-MM-dd") === today,
    ).length,
  };
};
