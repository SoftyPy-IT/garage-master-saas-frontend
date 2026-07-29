import {
  Add as AddIcon,
  Close,
  Edit as EditIcon,
  Save,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { addHours } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import {
  CALENDAR_COLORS,
  EVENT_STATUSES,
  EVENT_TYPES,
  NOTIFICATION_TYPES,
  PRIORITY_LEVELS,
  RECURRENCE_PATTERNS,
  REMINDER_TIMINGS,
  SERVICE_TYPES,
  TASK_STATUSES,
} from "../../../constant/calendar";
import { useCalendar } from "../../../context/CalendarContext";
import {
  formatForDateTimeLocal,
  TaskChecklistItem,
} from "../../../utils/date";

export const EventDialog = () => {
  const {
    openDialog,
    setOpenDialog,
    selectedEvent,
    formData,
    setFormData,
    calendars,
    loading,
    createEvent,
    updateEvent,
  } = useCalendar();

  const isTimeInvalid =
    formData.endTime &&
    new Date(formData.endTime) <= new Date(formData.startTime);

  return (
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
          {selectedEvent ? "Edit Event" : `Create New ${formData.type}`}
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
                error={!formData.summary}
                helperText={!formData.summary ? "Title is required" : ""}
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

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Start Time *"
                value={formData.startTime}
                onChange={(e) => {
                  const newStartTime = e.target.value;
                  setFormData({
                    ...formData,
                    startTime: newStartTime,
                    endTime:
                      !formData.endTime ||
                      new Date(newStartTime) >= new Date(formData.endTime)
                        ? formatForDateTimeLocal(
                            addHours(new Date(newStartTime), 1),
                          )
                        : formData.endTime,
                  });
                }}
                InputLabelProps={{ shrink: true }}
                required
                error={!formData.startTime}
                helperText={
                  !formData.startTime ? "Start time is required" : ""
                }
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
                error={!formData.endTime || isTimeInvalid}
                helperText={
                  !formData.endTime
                    ? "End time is required"
                    : isTimeInvalid
                      ? "End time must be after start time"
                      : ""
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.allDay}
                    onChange={(e) =>
                      setFormData({ ...formData, allDay: e.target.checked })
                    }
                  />
                }
                label="All Day Event"
              />
            </Grid>

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
                    setFormData({ ...formData, calendarId: e.target.value })
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

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Color</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {CALENDAR_COLORS.map((color) => (
                  <Tooltip key={color.id} title={color.name}>
                    <IconButton
                      sx={{
                        bgcolor: color.hex,
                        width: 32,
                        height: 32,
                        "&:hover": { bgcolor: color.hex, opacity: 0.8 },
                        border:
                          formData.color === color.id
                            ? "2px solid white"
                            : "none",
                        boxShadow:
                          formData.color === color.id
                            ? `0 0 0 2px ${color.hex}`
                            : "none",
                      }}
                      onClick={() =>
                        setFormData({ ...formData, color: color.id })
                      }
                    />
                  </Tooltip>
                ))}
              </Box>
            </Grid>

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
                      value={formData.taskStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          taskStatus: e.target.value,
                        })
                      }
                      label="Status"
                    >
                      {TASK_STATUSES.map((status) => (
                        <MenuItem key={status.id} value={status.id}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Due Date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Checklist
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflow: "auto" }}>
                    {formData.checklist.map((item, index) => (
                      <TaskChecklistItem
                        key={item.id || index}
                        item={item}
                        index={index}
                        onToggle={(idx) => {
                          const newChecklist = [...formData.checklist];
                          newChecklist[idx].completed =
                            !newChecklist[idx].completed;
                          setFormData({
                            ...formData,
                            checklist: newChecklist,
                          });
                        }}
                        onEdit={(idx, updatedItem) => {
                          const newChecklist = [...formData.checklist];
                          newChecklist[idx] = updatedItem;
                          setFormData({
                            ...formData,
                            checklist: newChecklist,
                          });
                        }}
                        onDelete={(idx) => {
                          const newChecklist = formData.checklist.filter(
                            (_, i) => i !== idx,
                          );
                          setFormData({
                            ...formData,
                            checklist: newChecklist,
                          });
                        }}
                      />
                    ))}
                  </Box>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        checklist: [
                          ...formData.checklist,
                          {
                            id: uuidv4(),
                            text: "New item",
                            completed: false,
                          },
                        ],
                      });
                    }}
                    sx={{ mt: 1 }}
                  >
                    Add Item
                  </Button>
                </Grid>
              </>
            )}

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
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Service Type</InputLabel>
                    <Select
                      value={formData.serviceType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serviceType: e.target.value,
                        })
                      }
                      label="Service Type"
                    >
                      <MenuItem value="">Select a service</MenuItem>
                      {SERVICE_TYPES.map((service) => (
                        <MenuItem key={service.id} value={service.name}>
                          {service.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Vehicle Model"
                    value={formData.vehicleInfo.model}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicleInfo: {
                          ...formData.vehicleInfo,
                          model: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>
              </>
            )}

            {formData.type === "reminder" && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="h6">Reminder Settings</Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Reminder Time"
                    value={formData.reminderTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reminderTime: e.target.value,
                      })
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Repeat</InputLabel>
                    <Select
                      value={formData.repeatReminder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          repeatReminder: e.target.value,
                        })
                      }
                      label="Repeat"
                    >
                      {RECURRENCE_PATTERNS.map((pattern) => (
                        <MenuItem key={pattern.id} value={pattern.id}>
                          {pattern.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.important}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            important: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Important Reminder"
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
                    multiline
                    rows={3}
                    label="Agenda"
                    value={formData.agenda}
                    onChange={(e) =>
                      setFormData({ ...formData, agenda: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Meeting Link"
                    value={formData.conferenceLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        conferenceLink: e.target.value,
                      })
                    }
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="h6">Priority & Status</Typography>
              </Divider>
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
                  {PRIORITY_LEVELS.map((level) => (
                    <MenuItem key={level.id} value={level.id}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <span>{level.icon}</span>
                        {level.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  {EVENT_STATUSES.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="h6">Notifications</Typography>
              </Divider>
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
                      const current = formData.notifications;
                      const exists = current.some((n) => n.type === type.id);
                      const newTypes = exists
                        ? current.filter((n) => n.type !== type.id)
                        : [
                            ...current,
                            { type: type.id, minutes: 30, sent: false },
                          ];
                      setFormData({ ...formData, notifications: newTypes });
                    }}
                    color={
                      formData.notifications.some((n) => n.type === type.id)
                        ? "primary"
                        : "default"
                    }
                    variant={
                      formData.notifications.some((n) => n.type === type.id)
                        ? "filled"
                        : "outlined"
                    }
                  />
                ))}
              </Box>
            </Grid>

            {formData.notifications.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Notification Timing
                </Typography>
                <Grid container spacing={1}>
                  {formData.notifications.map((notif, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Typography variant="body2" sx={{ minWidth: 80 }}>
                          {
                            NOTIFICATION_TYPES.find(
                              (t) => t.id === notif.type,
                            )?.name
                          }
                        </Typography>
                        <FormControl size="small" sx={{ flex: 1 }}>
                          <Select
                            value={notif.minutes}
                            onChange={(e) => {
                              const newNotifications = [
                                ...formData.notifications,
                              ];
                              newNotifications[index].minutes =
                                e.target.value;
                              setFormData({
                                ...formData,
                                notifications: newNotifications,
                              });
                            }}
                          >
                            {REMINDER_TIMINGS.map((timing) => (
                              <MenuItem
                                key={timing.value}
                                value={timing.value}
                              >
                                {timing.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            {isTimeInvalid && (
              <Grid item xs={12}>
                <Alert severity="error">
                  End time must be after start time. Please adjust the end time.
                </Alert>
              </Grid>
            )}
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
            if (selectedEvent) {
              updateEvent();
            } else {
              createEvent();
            }
          }}
          startIcon={selectedEvent ? <Save /> : <AddIcon />}
          disabled={
            !formData.summary ||
            !formData.startTime ||
            !formData.endTime ||
            isTimeInvalid ||
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
  );
};
