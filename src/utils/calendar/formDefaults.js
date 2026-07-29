import { addDays, addHours } from "date-fns";
import { CALENDAR_COLORS } from "../../constant/calendar";
import { formatForDateTimeLocal } from "../date";

export const createDefaultFormData = () => {
  const now = new Date();
  const startTime = addHours(now, 1);
  const endTime = addHours(startTime, 1);

  return {
    type: "event",
    summary: "",
    description: "",
    startTime: formatForDateTimeLocal(startTime),
    endTime: formatForDateTimeLocal(endTime),
    location: "",
    taskStatus: "not_started",
    checklist: [],
    dueDate: formatForDateTimeLocal(addDays(now, 1)),
    completionDate: "",
    subtasks: [],
    reminderTime: formatForDateTimeLocal(addHours(now, 1)),
    repeatReminder: "none",
    important: false,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    serviceType: "",
    serviceNotes: "",
    vehicleInfo: { type: "car", model: "", year: "", license: "" },
    agenda: "",
    attendees: [],
    meetingType: "in_person",
    conferenceLink: "",
    priority: "medium",
    status: "scheduled",
    category: "personal",
    tags: [],
    attachments: [],
    color: CALENDAR_COLORS[0].id,
    calendarId: "primary",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    allDay: false,
    private: false,
    busy: true,
    notifications: [
      { type: "popup", minutes: 30, sent: false },
      { type: "email", minutes: 60, sent: false },
    ],
    recurrence: "none",
    recurrenceEndDate: "",
    recurrenceCount: 1,
    guestsCanModify: false,
    guestsCanInviteOthers: false,
    guestsCanSeeOtherGuests: true,
    visibility: "default",
    estimatedDuration: 60,
    actualDuration: 0,
    progress: 0,
    notes: "",
    locationDetails: { lat: null, lng: null, address: "", link: "" },
    conferenceData: {
      type: "hangoutsMeet",
      link: "",
      phoneNumber: "",
      pin: "",
    },
    sendEmail: false,
  };
};
