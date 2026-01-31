import { EVENT_TYPES, SERVICE_TYPES, CALENDAR_COLORS } from "./constants";

export const determineEventType = (event) => {
  const summary = (event.summary || "").toLowerCase();
  const description = (event.description || "").toLowerCase();

  if (summary.includes("reminder") || description.includes("reminder")) {
    return "reminder";
  }
  if (summary.includes("meeting") || description.includes("meeting")) {
    return "meeting";
  }
  if (summary.includes("appointment") || description.includes("appointment")) {
    return "appointment";
  }
  if (summary.includes("task") || description.includes("task")) {
    return "task";
  }
  return "event";
};

export const extractServiceType = (description) => {
  if (!description) return "General";
  const service = SERVICE_TYPES.find((service) =>
    description.toLowerCase().includes(service.name.toLowerCase())
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

export const getEventIcon = (eventType) => {
  const eventTypeObj = EVENT_TYPES.find((t) => t.id === eventType);
  return eventTypeObj?.icon || "EventIcon";
};

export const validateEventForm = (formData) => {
  const errors = {};

  if (!formData.summary || formData.summary.trim() === "") {
    errors.summary = "Title is required";
  }

  if (!formData.startTime) {
    errors.startTime = "Start time is required";
  }

  if (!formData.endTime) {
    errors.endTime = "End time is required";
  }

  if (formData.startTime && formData.endTime) {
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    if (end <= start) {
      errors.endTime = "End time must be after start time";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const buildEventDescription = (formData) => {
  let description = formData.description || "";

  switch (formData.type) {
    case "task":
      description += `\n\n--- Task Details ---\n`;
      description += `Status: ${formData.taskStatus}\n`;
      description += `Priority: ${formData.priority}\n`;
      if (formData.dueDate) description += `Due: ${formData.dueDate}\n`;

      if (formData.checklist?.length > 0) {
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
      break;

    case "reminder":
      description += `\n\n--- Reminder Details ---\n`;
      description += `Important: ${formData.important ? "Yes" : "No"}\n`;
      description += `Repeat: ${formData.repeatReminder}\n`;
      break;
  }

  description += `\nCreated via: Enhanced Calendar App`;
  return description.trim();
};
