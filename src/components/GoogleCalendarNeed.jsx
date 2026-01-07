// /* eslint-disable react/prop-types */
// /* eslint-disable no-case-declarations */
// /* eslint-disable no-useless-catch */
// /* eslint-disable react/jsx-no-target-blank */
// /* eslint-disable no-unused-vars */
// import {
//   AccessTime,
//   Add as AddIcon,
//   Alarm,
//   CalendarToday,
//   CheckBox,
//   ChevronLeft,
//   ChevronRight,
//   ColorLens,
//   DarkMode,
//   Delete as DeleteIcon,
//   Description,
//   DragIndicator,
//   Edit as EditIcon,
//   Event as EventIcon,
//   Group,
//   LightMode,
//   Link,
//   LocationOn,
//   Menu,
//   MoreVert as MoreVertIcon,
//   Notifications,
//   Person,
//   Search,
//   Settings,
//   Subject,
//   TaskAlt,
//   Timelapse,
//   Today as TodayIcon,
//   VideoCall,
//   VideoCameraFront,
//   ViewAgenda,
//   ViewDay,
//   ViewWeek,
// } from "@mui/icons-material";
// import {
//   Alert,
//   alpha,
//   AppBar,
//   Avatar,
//   Backdrop,
//   Box,
//   Button,
//   Card,
//   Checkbox,
//   Chip,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   Drawer,
//   Fab,
//   FormControl,
//   FormControlLabel,
//   FormGroup,
//   FormLabel,
//   Grid,
//   IconButton,
//   InputAdornment,
//   InputLabel,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   MenuItem,
//   Paper,
//   Radio,
//   RadioGroup,
//   Select,
//   Snackbar,
//   Switch,
//   TextField,
//   ToggleButton,
//   ToggleButtonGroup,
//   Toolbar,
//   Tooltip,
//   Typography,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { googleLogout, useGoogleLogin } from "@react-oauth/google";
// import axios from "axios";
// import {
//   addDays,
//   addHours,
//   addMonths,
//   addWeeks,
//   differenceInMinutes,
//   eachDayOfInterval,
//   endOfMonth,
//   endOfWeek,
//   format,
//   formatDistanceToNow,
//   getHours,
//   getMinutes,
//   isSameDay,
//   isSameMonth,
//   startOfMonth,
//   startOfWeek,
//   subDays,
//   subMonths,
//   subWeeks,
// } from "date-fns";
// import { useEffect, useMemo, useState } from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";

// // ==================== CONFIGURATION ====================
// const CONFIG = {
//   projectId: "731493911262",
//   clientId:
//     "731493911262-b4vutijvnt9bgdvgu6m1ai7g0nsno7vl.apps.googleusercontent.com",
//   adminEmail: "softypyit@gmail.com",
//   userEmail: "ibrahimsikder5033@gmail.com",
//   scopes: [
//     "https://www.googleapis.com/auth/calendar",
//     "https://www.googleapis.com/auth/calendar.events",
//     "https://www.googleapis.com/auth/calendar.readonly",
//     "openid",
//     "https://www.googleapis.com/auth/userinfo.email",
//     "https://www.googleapis.com/auth/userinfo.profile",
//   ].join(" "),
// };

// // ==================== EVENT TYPES WITH UNIQUE FORMS ====================
// const EVENT_TYPES = [
//   {
//     id: "event",
//     name: "Event",
//     icon: <EventIcon />,
//     color: "#4285F4",
//     description: "General event or activity",
//     formComponent: "EventForm",
//   },
//   {
//     id: "meeting",
//     name: "Meeting",
//     icon: <VideoCall />,
//     color: "#DB4437",
//     description: "Video or in-person meeting",
//     formComponent: "MeetingForm",
//   },
//   {
//     id: "task",
//     name: "Task",
//     icon: <TaskAlt />,
//     color: "#0F9D58",
//     description: "To-do item or checklist",
//     formComponent: "TaskForm",
//   },
//   {
//     id: "appointment",
//     name: "Appointment",
//     icon: <Person />,
//     color: "#F4B400",
//     description: "Client or service appointment",
//     formComponent: "AppointmentForm",
//   },
//   {
//     id: "reminder",
//     name: "Reminder",
//     icon: <Notifications />,
//     color: "#AB47BC",
//     description: "Time-based reminder",
//     formComponent: "ReminderForm",
//   },
// ];

// // ==================== CALENDAR VIEWS ====================
// const CALENDAR_VIEWS = [
//   { id: "day", name: "Day", icon: <ViewDay /> },
//   { id: "week", name: "Week", icon: <ViewWeek /> },
//   { id: "month", name: "Month", icon: <CalendarToday /> },
//   { id: "agenda", name: "Agenda", icon: <ViewAgenda /> },
//   { id: "schedule", name: "Schedule", icon: <Timelapse /> },
// ];

// // ==================== CALENDAR COLORS (GOOGLE CALENDAR COLORS) ====================
// const CALENDAR_COLORS = [
//   { id: "1", name: "Lavender", hex: "#7986CB" },
//   { id: "2", name: "Sage", hex: "#33B679" },
//   { id: "3", name: "Grape", hex: "#8E24AA" },
//   { id: "4", name: "Flamingo", hex: "#E67C73" },
//   { id: "5", name: "Banana", hex: "#F6BF26" },
//   { id: "6", name: "Tangerine", hex: "#F4511E" },
//   { id: "7", name: "Peacock", hex: "#039BE5" },
//   { id: "8", name: "Graphite", hex: "#616161" },
//   { id: "9", name: "Blueberry", hex: "#3F51B5" },
//   { id: "10", name: "Basil", hex: "#0B8043" },
//   { id: "11", name: "Tomato", hex: "#D50000" },
// ];

// // ==================== TIME SLOTS ====================
// const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
//   const hour = Math.floor(i / 2);
//   const minute = i % 2 === 0 ? "00" : "30";
//   return `${hour.toString().padStart(2, "0")}:${minute}`;
// });

// // ==================== DRAG & DROP TYPES ====================
// const ItemTypes = {
//   EVENT: "event",
//   TASK: "task",
//   APPOINTMENT: "appointment",
//   MEETING: "meeting",
//   REMINDER: "reminder",
// };

// // ==================== DRAGGABLE EVENT COMPONENT ====================
// const DraggableEvent = ({ event, onDragStart, onDragEnd }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: ItemTypes.EVENT,
//     item: { type: "event", id: event.id, event },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//     end: (item, monitor) => {
//       if (onDragEnd && monitor.didDrop()) {
//         onDragEnd(item, monitor);
//       }
//     },
//   }));

//   const eventType =
//     EVENT_TYPES.find((t) => t.id === event.type) || EVENT_TYPES[0];

//   return (
//     <div
//       ref={drag}
//       style={{
//         opacity: isDragging ? 0.5 : 1,
//         cursor: "move",
//         padding: "6px 10px",
//         margin: "3px 0",
//         borderRadius: "6px",
//         backgroundColor: eventType.color,
//         color: "white",
//         fontSize: "13px",
//         overflow: "hidden",
//         textOverflow: "ellipsis",
//         whiteSpace: "nowrap",
//         border: "1px solid rgba(255,255,255,0.3)",
//         boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
//         display: "flex",
//         alignItems: "center",
//         gap: "4px",
//       }}
//     >
//       <DragIndicator sx={{ fontSize: 14, opacity: 0.7 }} />
//       <span style={{ flex: 1 }}>{event.summary}</span>
//       <eventType.icon sx={{ fontSize: 14 }} />
//     </div>
//   );
// };

// // ==================== DROPPABLE CALENDAR SLOT ====================
// const DroppableCalendarSlot = ({ date, time, onDrop, children }) => {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: [
//       ItemTypes.EVENT,
//       ItemTypes.TASK,
//       ItemTypes.APPOINTMENT,
//       ItemTypes.MEETING,
//       ItemTypes.REMINDER,
//     ],
//     drop: (item, monitor) => {
//       if (onDrop && monitor.didDrop()) {
//         onDrop(item, { date, time });
//       }
//       return { date, time };
//     },
//     collect: (monitor) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   return (
//     <div
//       ref={drop}
//       style={{
//         backgroundColor: isOver ? "rgba(66, 133, 244, 0.1)" : "transparent",
//         height: "100%",
//         width: "100%",
//         border: isOver
//           ? "2px dashed #4285F4"
//           : "1px solid rgba(224, 224, 224, 0.5)",
//         position: "relative",
//         borderRadius: isOver ? "4px" : "0",
//       }}
//     >
//       {children}
//     </div>
//   );
// };

// // ==================== UTILITY FUNCTIONS ====================
// const fixDateTimeFormat = (dateTimeString, isEndTime = false) => {
//   try {
//     if (dateTimeString.includes("Z")) {
//       return dateTimeString;
//     }

//     if (dateTimeString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
//       return dateTimeString + ":00.000Z";
//     }

//     if (dateTimeString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
//       return dateTimeString + ".000Z";
//     }

//     const date = new Date(dateTimeString);
//     if (isNaN(date.getTime())) {
//       throw new Error("Invalid date");
//     }

//     if (isEndTime) {
//       return new Date(date.getTime() + 60 * 60000).toISOString();
//     }

//     return date.toISOString();
//   } catch (error) {
//     console.error("Date format error:", error);
//     const now = new Date();
//     if (isEndTime) {
//       return new Date(now.getTime() + 60 * 60000).toISOString();
//     }
//     return now.toISOString();
//   }
// };

// const formatForDateTimeLocal = (date) => {
//   const pad = (num) => num.toString().padStart(2, "0");
//   return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
//     date.getDate()
//   )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
// };

// const getColorById = (colorId) => {
//   const color =
//     CALENDAR_COLORS.find((c) => c.id === colorId) || CALENDAR_COLORS[0];
//   return color.hex;
// };

// // ==================== FORM COMPONENTS FOR EACH EVENT TYPE ====================

// // Event Form (General Event)
// const EventForm = ({ formData, setFormData, errors }) => {
//   return (
//     <>
//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="Event Title *"
//           value={formData.summary}
//           onChange={(e) =>
//             setFormData({ ...formData, summary: e.target.value })
//           }
//           error={!!errors.summary}
//           helperText={errors.summary}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Subject />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           multiline
//           rows={3}
//           label="Description"
//           value={formData.description}
//           onChange={(e) =>
//             setFormData({ ...formData, description: e.target.value })
//           }
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Description />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <TextField
//           fullWidth
//           type="datetime-local"
//           label="Start Time *"
//           value={formData.startTime}
//           onChange={(e) => {
//             const newStartTime = e.target.value;
//             setFormData({
//               ...formData,
//               startTime: newStartTime,
//               endTime:
//                 !formData.endTime ||
//                 new Date(newStartTime) >= new Date(formData.endTime)
//                   ? formatForDateTimeLocal(addHours(new Date(newStartTime), 1))
//                   : formData.endTime,
//             });
//           }}
//           InputLabelProps={{ shrink: true }}
//           error={!!errors.startTime}
//           helperText={errors.startTime}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <AccessTime />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <TextField
//           fullWidth
//           type="datetime-local"
//           label="End Time *"
//           value={formData.endTime}
//           onChange={(e) =>
//             setFormData({ ...formData, endTime: e.target.value })
//           }
//           InputLabelProps={{ shrink: true }}
//           error={!!errors.endTime}
//           helperText={errors.endTime}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <AccessTime />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="Location"
//           value={formData.location}
//           onChange={(e) =>
//             setFormData({ ...formData, location: e.target.value })
//           }
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <LocationOn />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <FormControl fullWidth>
//           <InputLabel>Color</InputLabel>
//           <Select
//             value={formData.color}
//             onChange={(e) =>
//               setFormData({ ...formData, color: e.target.value })
//             }
//             label="Color"
//             startAdornment={
//               <InputAdornment position="start">
//                 <ColorLens />
//               </InputAdornment>
//             }
//           >
//             {CALENDAR_COLORS.map((color) => (
//               <MenuItem key={color.id} value={color.id}>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                   <Box
//                     sx={{
//                       width: 20,
//                       height: 20,
//                       borderRadius: "50%",
//                       backgroundColor: color.hex,
//                     }}
//                   />
//                   <span>{color.name}</span>
//                 </Box>
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Grid>

//       <Grid item xs={12}>
//         <FormControlLabel
//           control={
//             <Switch
//               checked={formData.allDay}
//               onChange={(e) =>
//                 setFormData({ ...formData, allDay: e.target.checked })
//               }
//             />
//           }
//           label="All day event"
//         />
//       </Grid>
//     </>
//   );
// };

// // Meeting Form
// const MeetingForm = ({ formData, setFormData, errors }) => {
//   const [meetingType, setMeetingType] = useState("video");

//   return (
//     <>
//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="Meeting Title *"
//           value={formData.summary}
//           onChange={(e) =>
//             setFormData({ ...formData, summary: e.target.value })
//           }
//           error={!!errors.summary}
//           helperText={errors.summary}
//           placeholder="e.g., Team Standup, Client Review"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <VideoCameraFront />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           multiline
//           rows={2}
//           label="Agenda"
//           value={formData.description}
//           onChange={(e) =>
//             setFormData({ ...formData, description: e.target.value })
//           }
//           placeholder="Meeting agenda, topics to discuss..."
//         />
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <TextField
//           fullWidth
//           type="datetime-local"
//           label="Start Time *"
//           value={formData.startTime}
//           onChange={(e) => {
//             const newStartTime = e.target.value;
//             setFormData({
//               ...formData,
//               startTime: newStartTime,
//               endTime:
//                 !formData.endTime ||
//                 new Date(newStartTime) >= new Date(formData.endTime)
//                   ? formatForDateTimeLocal(addHours(new Date(newStartTime), 1))
//                   : formData.endTime,
//             });
//           }}
//           InputLabelProps={{ shrink: true }}
//           error={!!errors.startTime}
//           helperText={errors.startTime}
//         />
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <TextField
//           fullWidth
//           type="datetime-local"
//           label="End Time *"
//           value={formData.endTime}
//           onChange={(e) =>
//             setFormData({ ...formData, endTime: e.target.value })
//           }
//           InputLabelProps={{ shrink: true }}
//           error={!!errors.endTime}
//           helperText={errors.endTime}
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <FormControl component="fieldset">
//           <FormLabel component="legend">Meeting Type</FormLabel>
//           <RadioGroup
//             row
//             value={meetingType}
//             onChange={(e) => setMeetingType(e.target.value)}
//           >
//             <FormControlLabel
//               value="video"
//               control={<Radio />}
//               label="Video Call"
//             />
//             <FormControlLabel
//               value="in-person"
//               control={<Radio />}
//               label="In Person"
//             />
//             <FormControlLabel
//               value="hybrid"
//               control={<Radio />}
//               label="Hybrid"
//             />
//           </RadioGroup>
//         </FormControl>
//       </Grid>

//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="Meeting Link"
//           value={formData.conferenceData?.link || ""}
//           onChange={(e) =>
//             setFormData({
//               ...formData,
//               conferenceData: {
//                 ...formData.conferenceData,
//                 link: e.target.value,
//               },
//             })
//           }
//           placeholder="https://meet.google.com/xxx-xxxx-xxx"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Link />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="Attendees (comma separated)"
//           value={formData.attendees?.join(", ") || ""}
//           onChange={(e) =>
//             setFormData({
//               ...formData,
//               attendees: e.target.value.split(",").map((email) => email.trim()),
//             })
//           }
//           placeholder="email1@example.com, email2@example.com"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Group />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Grid>
//     </>
//   );
// };

// // Task Form
// const TaskForm = ({ formData, setFormData, errors }) => {
//   const [subTasks, setSubTasks] = useState([]);
//   const [newSubTask, setNewSubTask] = useState("");

//   const addSubTask = () => {
//     if (newSubTask.trim()) {
//       setSubTasks([
//         ...subTasks,
//         { id: Date.now(), text: newSubTask, completed: false },
//       ]);
//       setNewSubTask("");
//     }
//   };

//   return (
//     <>
//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="Task Title *"
//           value={formData.summary}
//           onChange={(e) =>
//             setFormData({ ...formData, summary: e.target.value })
//           }
//           error={!!errors.summary}
//           helperText={errors.summary}
//           placeholder="What needs to be done?"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <CheckBox />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           multiline
//           rows={2}
//           label="Description"
//           value={formData.description}
//           onChange={(e) =>
//             setFormData({ ...formData, description: e.target.value })
//           }
//           placeholder="Task details, notes..."
//         />
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <TextField
//           fullWidth
//           type="datetime-local"
//           label="Due Date"
//           value={formData.startTime}
//           onChange={(e) =>
//             setFormData({ ...formData, startTime: e.target.value })
//           }
//           InputLabelProps={{ shrink: true }}
//         />
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <FormControl fullWidth>
//           <InputLabel>Priority</InputLabel>
//           <Select
//             value={formData.priority || "medium"}
//             onChange={(e) =>
//               setFormData({ ...formData, priority: e.target.value })
//             }
//             label="Priority"
//           >
//             <MenuItem value="low">Low</MenuItem>
//             <MenuItem value="medium">Medium</MenuItem>
//             <MenuItem value="high">High</MenuItem>
//             <MenuItem value="urgent">Urgent</MenuItem>
//           </Select>
//         </FormControl>
//       </Grid>

//       <Grid item xs={12}>
//         <FormControl fullWidth>
//           <InputLabel>Status</InputLabel>
//           <Select
//             value={formData.status || "todo"}
//             onChange={(e) =>
//               setFormData({ ...formData, status: e.target.value })
//             }
//             label="Status"
//           >
//             <MenuItem value="todo">To Do</MenuItem>
//             <MenuItem value="in-progress">In Progress</MenuItem>
//             <MenuItem value="review">In Review</MenuItem>
//             <MenuItem value="completed">Completed</MenuItem>
//           </Select>
//         </FormControl>
//       </Grid>

//       <Grid item xs={12}>
//         <Typography variant="subtitle2" gutterBottom>
//           Subtasks
//         </Typography>
//         <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
//           <TextField
//             fullWidth
//             size="small"
//             value={newSubTask}
//             onChange={(e) => setNewSubTask(e.target.value)}
//             placeholder="Add a subtask"
//             onKeyPress={(e) => e.key === "Enter" && addSubTask()}
//           />
//           <Button onClick={addSubTask} variant="contained" size="small">
//             Add
//           </Button>
//         </Box>
//         <List dense>
//           {subTasks.map((task) => (
//             <ListItem key={task.id}>
//               <Checkbox
//                 checked={task.completed}
//                 onChange={(e) =>
//                   setSubTasks(
//                     subTasks.map((t) =>
//                       t.id === task.id
//                         ? { ...t, completed: e.target.checked }
//                         : t
//                     )
//                   )
//                 }
//                 size="small"
//               />
//               <ListItemText
//                 primary={task.text}
//                 sx={{
//                   textDecoration: task.completed ? "line-through" : "none",
//                   opacity: task.completed ? 0.6 : 1,
//                 }}
//               />
//               <IconButton
//                 size="small"
//                 onClick={() =>
//                   setSubTasks(subTasks.filter((t) => t.id !== task.id))
//                 }
//               >
//                 <DeleteIcon fontSize="small" />
//               </IconButton>
//             </ListItem>
//           ))}
//         </List>
//       </Grid>
//     </>
//   );
// };

// // Appointment Form
// const AppointmentForm = ({ formData, setFormData, errors }) => {
//   const [services] = useState([
//     "Consultation",
//     "Follow-up",
//     "Check-up",
//     "Procedure",
//     "Therapy",
//     "Test",
//     "Screening",
//   ]);

//   return (
//     <>
//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="Appointment Title *"
//           value={formData.summary}
//           onChange={(e) =>
//             setFormData({ ...formData, summary: e.target.value })
//           }
//           error={!!errors.summary}
//           helperText={errors.summary}
//           placeholder="e.g., Annual Check-up, Dental Cleaning"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Person />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <FormControl fullWidth>
//           <InputLabel>Service Type</InputLabel>
//           <Select
//             value={formData.serviceType || ""}
//             onChange={(e) =>
//               setFormData({ ...formData, serviceType: e.target.value })
//             }
//             label="Service Type"
//           >
//             <MenuItem value="">Select a service</MenuItem>
//             {services.map((service) => (
//               <MenuItem key={service} value={service}>
//                 {service}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <TextField
//           fullWidth
//           type="datetime-local"
//           label="Appointment Time *"
//           value={formData.startTime}
//           onChange={(e) => {
//             const newStartTime = e.target.value;
//             setFormData({
//               ...formData,
//               startTime: newStartTime,
//               endTime:
//                 !formData.endTime ||
//                 new Date(newStartTime) >= new Date(formData.endTime)
//                   ? formatForDateTimeLocal(addHours(new Date(newStartTime), 1))
//                   : formData.endTime,
//             });
//           }}
//           InputLabelProps={{ shrink: true }}
//           error={!!errors.startTime}
//           helperText={errors.startTime}
//         />
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <TextField
//           fullWidth
//           type="datetime-local"
//           label="End Time *"
//           value={formData.endTime}
//           onChange={(e) =>
//             setFormData({ ...formData, endTime: e.target.value })
//           }
//           InputLabelProps={{ shrink: true }}
//           error={!!errors.endTime}
//           helperText={errors.endTime}
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
//           Customer Information
//         </Typography>
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <TextField
//           fullWidth
//           label="Customer Name"
//           value={formData.customerName || ""}
//           onChange={(e) =>
//             setFormData({ ...formData, customerName: e.target.value })
//           }
//           placeholder="John Doe"
//         />
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <TextField
//           fullWidth
//           label="Phone Number"
//           value={formData.customerPhone || ""}
//           onChange={(e) =>
//             setFormData({ ...formData, customerPhone: e.target.value })
//           }
//           placeholder="+1 (555) 123-4567"
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="Email Address"
//           type="email"
//           value={formData.customerEmail || ""}
//           onChange={(e) =>
//             setFormData({ ...formData, customerEmail: e.target.value })
//           }
//           placeholder="customer@example.com"
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           multiline
//           rows={2}
//           label="Notes"
//           value={formData.serviceNotes || ""}
//           onChange={(e) =>
//             setFormData({ ...formData, serviceNotes: e.target.value })
//           }
//           placeholder="Any special requirements or notes..."
//         />
//       </Grid>
//     </>
//   );
// };

// // Reminder Form
// const ReminderForm = ({ formData, setFormData, errors }) => {
//   const reminderOptions = [
//     { value: "5", label: "5 minutes before" },
//     { value: "10", label: "10 minutes before" },
//     { value: "30", label: "30 minutes before" },
//     { value: "60", label: "1 hour before" },
//     { value: "1440", label: "1 day before" },
//     { value: "10080", label: "1 week before" },
//   ];

//   return (
//     <>
//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           label="Reminder *"
//           value={formData.summary}
//           onChange={(e) =>
//             setFormData({ ...formData, summary: e.target.value })
//           }
//           error={!!errors.summary}
//           helperText={errors.summary}
//           placeholder="What do you want to be reminded about?"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Alarm />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <TextField
//           fullWidth
//           multiline
//           rows={2}
//           label="Details"
//           value={formData.description}
//           onChange={(e) =>
//             setFormData({ ...formData, description: e.target.value })
//           }
//           placeholder="Additional details about this reminder..."
//         />
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <TextField
//           fullWidth
//           type="datetime-local"
//           label="Remind me at *"
//           value={formData.startTime}
//           onChange={(e) =>
//             setFormData({ ...formData, startTime: e.target.value })
//           }
//           InputLabelProps={{ shrink: true }}
//           error={!!errors.startTime}
//           helperText={errors.startTime}
//         />
//       </Grid>

//       <Grid item xs={12} md={6}>
//         <FormControl fullWidth>
//           <InputLabel>Repeat</InputLabel>
//           <Select
//             value={formData.recurrence || "none"}
//             onChange={(e) =>
//               setFormData({ ...formData, recurrence: e.target.value })
//             }
//             label="Repeat"
//           >
//             <MenuItem value="none">Does not repeat</MenuItem>
//             <MenuItem value="daily">Daily</MenuItem>
//             <MenuItem value="weekly">Weekly</MenuItem>
//             <MenuItem value="monthly">Monthly</MenuItem>
//             <MenuItem value="yearly">Yearly</MenuItem>
//             <MenuItem value="weekdays">Every weekday (Mon-Fri)</MenuItem>
//           </Select>
//         </FormControl>
//       </Grid>

//       <Grid item xs={12}>
//         <FormControl fullWidth>
//           <InputLabel>Notification Type</InputLabel>
//           <Select
//             value={formData.notificationTypes?.[0] || "popup"}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 notificationTypes: [e.target.value],
//               })
//             }
//             label="Notification Type"
//             multiple={false}
//           >
//             <MenuItem value="popup">Popup Notification</MenuItem>
//             <MenuItem value="email">Email</MenuItem>
//             <MenuItem value="sms">SMS</MenuItem>
//             <MenuItem value="push">Push Notification</MenuItem>
//           </Select>
//         </FormControl>
//       </Grid>

//       <Grid item xs={12}>
//         <FormControl component="fieldset" fullWidth>
//           <FormLabel component="legend">Reminder Options</FormLabel>
//           <FormGroup>
//             {reminderOptions.map((option) => (
//               <FormControlLabel
//                 key={option.value}
//                 control={
//                   <Checkbox
//                     checked={formData.reminder === option.value}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         reminder: e.target.checked ? option.value : "30",
//                       })
//                     }
//                   />
//                 }
//                 label={option.label}
//               />
//             ))}
//           </FormGroup>
//         </FormControl>
//       </Grid>

//       <Grid item xs={12}>
//         <FormControlLabel
//           control={
//             <Switch
//               checked={formData.sendEmail || false}
//               onChange={(e) =>
//                 setFormData({ ...formData, sendEmail: e.target.checked })
//               }
//             />
//           }
//           label="Send email reminder"
//         />
//       </Grid>
//     </>
//   );
// };

// // ==================== MAIN COMPONENT ====================
// const EnhancedGoogleCalendar = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   // State Management
//   const [events, setEvents] = useState([]);
//   const [calendars, setCalendars] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [notification, setNotification] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const [accessToken, setAccessToken] = useState(
//     localStorage.getItem("google_access_token") || null
//   );
//   const [userProfile, setUserProfile] = useState(
//     JSON.parse(localStorage.getItem("google_user_profile") || "null")
//   );
//   const [loading, setLoading] = useState(false);
//   const [errorDetails, setErrorDetails] = useState(null);
//   const [viewMode, setViewMode] = useState("week");
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [searchQuery, setSearchQuery] = useState("");
//   const [settingsOpen, setSettingsOpen] = useState(false);
//   const [quickAddOpen, setQuickAddOpen] = useState(false);
//   const [dragDropEnabled, setDragDropEnabled] = useState(true);
//   const [selectedCalendar, setSelectedCalendar] = useState("primary");
//   const [themeMode, setThemeMode] = useState(
//     localStorage.getItem("calendar_theme") || "light"
//   );
//   const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
//   const [notifications, setNotifications] = useState([]);
//   const [selectedEventType, setSelectedEventType] = useState("event");
//   const [formErrors, setFormErrors] = useState({});

//   // Form State
//   const [formData, setFormData] = useState({
//     type: "event",
//     summary: "",
//     description: "",
//     startTime: "",
//     endTime: "",
//     location: "",
//     customerEmail: "",
//     customerPhone: "",
//     customerName: "",
//     serviceType: "",
//     serviceNotes: "",
//     priority: "medium",
//     reminder: "30",
//     sendEmail: true,
//     status: "scheduled",
//     color: CALENDAR_COLORS[0].id,
//     calendarId: "primary",
//     attendees: [],
//     recurrence: "none",
//     timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//     allDay: false,
//     private: false,
//     busy: true,
//     notificationTypes: ["popup"],
//     conferenceData: {
//       link: "",
//     },
//   });

//   // Calendar Navigation
//   const weekDays = eachDayOfInterval({
//     start: startOfWeek(currentDate),
//     end: endOfWeek(currentDate),
//   });

//   const monthDays = useMemo(() => {
//     const start = startOfMonth(currentDate);
//     const end = endOfMonth(currentDate);
//     return eachDayOfInterval({ start, end });
//   }, [currentDate]);

//   // Initialize Calendars
//   useEffect(() => {
//     const defaultCalendars = [
//       {
//         id: "primary",
//         name: "Primary Calendar",
//         color: CALENDAR_COLORS[0].id,
//         selected: true,
//         visible: true,
//         type: "personal",
//       },
//       {
//         id: "work",
//         name: "Work Calendar",
//         color: CALENDAR_COLORS[1].id,
//         selected: false,
//         visible: true,
//         type: "work",
//       },
//       {
//         id: "personal",
//         name: "Personal Calendar",
//         color: CALENDAR_COLORS[2].id,
//         selected: false,
//         visible: true,
//         type: "personal",
//       },
//     ];
//     setCalendars(defaultCalendars);
//   }, []);

//   // Google Login
//   const login = useGoogleLogin({
//     scope: CONFIG.scopes,
//     onSuccess: async (response) => {
//       console.log("✅ Login successful");
//       setLoading(true);
//       const token = response.access_token;
//       setAccessToken(token);
//       localStorage.setItem("google_access_token", token);

//       try {
//         await fetchUserProfile(token);
//         await fetchCalendarEvents(token);
//         showNotification("✅ Connected to Google Calendar!", "success");
//       } catch (error) {
//         handleGoogleError(error);
//       } finally {
//         setLoading(false);
//       }
//     },
//     onError: (error) => {
//       console.error("❌ Login error:", error);
//       handleGoogleError(error);
//     },
//     flow: "implicit",
//   });

//   // Fetch User Profile
//   const fetchUserProfile = async (token) => {
//     try {
//       const { data } = await axios.get(
//         "https://www.googleapis.com/oauth2/v1/userinfo",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { alt: "json" },
//         }
//       );
//       setUserProfile(data);
//       localStorage.setItem("google_user_profile", JSON.stringify(data));
//       return data;
//     } catch (error) {
//       console.error("Profile fetch error:", error);
//       throw error;
//     }
//   };

//   // Fetch Calendar Events
//   const fetchCalendarEvents = async (token, calendarId = "primary") => {
//     try {
//       setLoading(true);
//       const now = new Date();
//       const timeMin = subDays(now, 30).toISOString();
//       const timeMax = addDays(now, 90).toISOString();

//       const { data } = await axios.get(
//         `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           params: {
//             timeMin,
//             timeMax,
//             singleEvents: true,
//             orderBy: "startTime",
//             maxResults: 100,
//             showDeleted: false,
//           },
//         }
//       );

//       const formattedEvents = (data.items || []).map((event) => ({
//         ...event,
//         id: event.id,
//         summary: event.summary || "No Title",
//         description: event.description || "",
//         start: event.start,
//         end: event.end,
//         location: event.location || "",
//         colorId: event.colorId || "1",
//         status: event.status || "confirmed",
//         type: determineEventType(event),
//         calendarId: calendarId,
//       }));

//       setEvents(formattedEvents);
//       return formattedEvents;
//     } catch (error) {
//       console.error("Events fetch error:", error);
//       handleGoogleError(error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const determineEventType = (event) => {
//     const summary = (event.summary || "").toLowerCase();
//     const description = (event.description || "").toLowerCase();

//     if (summary.includes("reminder") || description.includes("reminder")) {
//       return "reminder";
//     }
//     if (summary.includes("meeting") || description.includes("meeting")) {
//       return "meeting";
//     }
//     if (
//       summary.includes("appointment") ||
//       description.includes("appointment")
//     ) {
//       return "appointment";
//     }
//     if (summary.includes("task") || description.includes("task")) {
//       return "task";
//     }
//     return "event";
//   };

//   // Create Event
//   const createEvent = async () => {
//     if (!accessToken) {
//       showNotification("Please login first", "warning");
//       return;
//     }

//     // Validate form
//     const errors = {};
//     if (!formData.summary) errors.summary = "Title is required";
//     if (!formData.startTime) errors.startTime = "Start time is required";
//     if (!formData.endTime) errors.endTime = "End time is required";
//     if (
//       formData.endTime &&
//       new Date(formData.endTime) <= new Date(formData.startTime)
//     ) {
//       errors.endTime = "End time must be after start time";
//     }

//     setFormErrors(errors);
//     if (Object.keys(errors).length > 0) {
//       showNotification("Please fix the errors in the form", "error");
//       return;
//     }

//     try {
//       setLoading(true);

//       const startDateTime = fixDateTimeFormat(formData.startTime);
//       const endDateTime = fixDateTimeFormat(formData.endTime, true);

//       // Build event description based on type
//       let description = formData.description || "";

//       if (formData.type === "appointment") {
//         description += `\n\n--- Customer Details ---\n`;
//         if (formData.customerName)
//           description += `Name: ${formData.customerName}\n`;
//         if (formData.customerPhone)
//           description += `Phone: ${formData.customerPhone}\n`;
//         if (formData.customerEmail)
//           description += `Email: ${formData.customerEmail}\n`;
//         if (formData.serviceType)
//           description += `Service: ${formData.serviceType}\n`;
//         if (formData.serviceNotes)
//           description += `Notes: ${formData.serviceNotes}\n`;
//       }

//       description += `\nCreated via: Enhanced Calendar App`;

//       const eventPayload = {
//         summary: formData.summary,
//         description: description.trim(),
//         start: {
//           dateTime: startDateTime,
//           timeZone: formData.timeZone,
//         },
//         end: {
//           dateTime: endDateTime,
//           timeZone: formData.timeZone,
//         },
//         location: formData.location || "",
//         colorId: formData.color,
//         reminders: {
//           useDefault: false,
//           overrides: formData.notificationTypes.map((type) => ({
//             method: type,
//             minutes: parseInt(formData.reminder) || 30,
//           })),
//         },
//       };

//       // Add conference data for meetings
//       if (formData.type === "meeting" && formData.conferenceData?.link) {
//         eventPayload.conferenceData = {
//           createRequest: {
//             requestId: `meet-${Date.now()}`,
//             conferenceSolutionKey: { type: "hangoutsMeet" },
//           },
//         };
//       }

//       // Add attendees if provided
//       if (formData.attendees && formData.attendees.length > 0) {
//         eventPayload.attendees = formData.attendees.map((email) => ({
//           email,
//           responseStatus: "needsAction",
//         }));
//       }

//       if (formData.customerEmail) {
//         eventPayload.attendees = [
//           ...(eventPayload.attendees || []),
//           { email: formData.customerEmail, responseStatus: "needsAction" },
//         ];
//       }

//       const response = await axios.post(
//         `https://www.googleapis.com/calendar/v3/calendars/${formData.calendarId}/events`,
//         eventPayload,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const newEvent = {
//         ...response.data,
//         type: formData.type,
//         colorId: formData.color,
//       };

//       setEvents((prev) => [newEvent, ...prev]);
//       setOpenDialog(false);
//       resetForm();
//       showNotification(`✅ ${formData.type} created successfully!`, "success");
//     } catch (error) {
//       console.error("❌ Event creation error:", error);
//       handleGoogleError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Drag and Drop
//   const handleDrop = async (item, dropLocation) => {
//     try {
//       setLoading(true);

//       const { date, time } = dropLocation;
//       const [hours, minutes] = time.split(":").map(Number);
//       const newStartTime = new Date(date);
//       newStartTime.setHours(hours, minutes, 0, 0);
//       const newEndTime = new Date(newStartTime.getTime() + 60 * 60000);

//       const eventToUpdate = events.find((e) => e.id === item.id);
//       if (!eventToUpdate) return;

//       const updatedEvent = {
//         ...eventToUpdate,
//         start: {
//           dateTime: newStartTime.toISOString(),
//           timeZone: eventToUpdate.start.timeZone || formData.timeZone,
//         },
//         end: {
//           dateTime: newEndTime.toISOString(),
//           timeZone: eventToUpdate.end.timeZone || formData.timeZone,
//         },
//       };

//       await axios.put(
//         `https://www.googleapis.com/calendar/v3/calendars/${
//           eventToUpdate.calendarId || "primary"
//         }/events/${eventToUpdate.id}`,
//         updatedEvent,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       await fetchCalendarEvents(
//         accessToken,
//         eventToUpdate.calendarId || "primary"
//       );
//       showNotification("✅ Event moved successfully!", "success");
//     } catch (error) {
//       console.error("Drag and drop error:", error);
//       handleGoogleError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset Form
//   const resetForm = () => {
//     const now = new Date();
//     const startTime = addHours(now, 1);
//     const endTime = addHours(startTime, 1);

//     setFormData({
//       type: "event",
//       summary: "",
//       description: "",
//       startTime: formatForDateTimeLocal(startTime),
//       endTime: formatForDateTimeLocal(endTime),
//       location: "",
//       customerEmail: "",
//       customerPhone: "",
//       customerName: "",
//       serviceType: "",
//       serviceNotes: "",
//       priority: "medium",
//       reminder: "30",
//       sendEmail: true,
//       status: "scheduled",
//       color: CALENDAR_COLORS[0].id,
//       calendarId: "primary",
//       attendees: [],
//       recurrence: "none",
//       timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//       allDay: false,
//       private: false,
//       busy: true,
//       notificationTypes: ["popup"],
//       conferenceData: {
//         link: "",
//       },
//     });
//     setFormErrors({});
//     setSelectedEvent(null);
//   };

//   // Handle Google Errors
//   const handleGoogleError = (error) => {
//     console.error("Google API Error:", error);

//     if (error.response) {
//       const status = error.response.status;
//       const data = error.response.data;

//       switch (status) {
//         case 400:
//           setErrorDetails({
//             type: "bad_request",
//             message: "Invalid request",
//             details: data.error?.message || "Bad Request",
//           });
//           break;
//         case 401:
//           setErrorDetails({
//             type: "unauthorized",
//             message: "Session expired",
//             details: "Please login again",
//           });
//           // logout();
//           break;
//         case 403:
//           setErrorDetails({
//             type: "config_required",
//             message: "Configuration Required",
//             details: "Please enable Calendar API in Google Cloud Console",
//           });
//           break;
//         default:
//           setErrorDetails({
//             type: "server_error",
//             message: "Server Error",
//             details: `Status: ${status}`,
//           });
//       }
//     }

//     showNotification("❌ Operation failed", "error");
//   };

//   // Show Notification
//   const showNotification = (message, severity = "info") => {
//     setNotification({ open: true, message, severity });
//   };

//   // Navigation Functions
//   const goToToday = () => setCurrentDate(new Date());
//   const goToPrevious = () => {
//     if (viewMode === "week") setCurrentDate((prev) => subWeeks(prev, 1));
//     else if (viewMode === "month") setCurrentDate((prev) => subMonths(prev, 1));
//     else setCurrentDate((prev) => subDays(prev, 1));
//   };
//   const goToNext = () => {
//     if (viewMode === "week") setCurrentDate((prev) => addWeeks(prev, 1));
//     else if (viewMode === "month") setCurrentDate((prev) => addMonths(prev, 1));
//     else setCurrentDate((prev) => addDays(prev, 1));
//   };

//   // Get Events for Day
//   const getEventsForDay = (day) => {
//     return events.filter((event) => {
//       if (!event.start?.dateTime) return false;
//       const eventDate = new Date(event.start.dateTime);
//       return isSameDay(eventDate, day);
//     });
//   };

//   // Open Dialog for specific event type
//   const handleOpenDialog = (event = null, type = "event") => {
//     if (event) {
//       setSelectedEvent(event);
//       setSelectedEventType(event.type);
//       setFormData({
//         ...formData,
//         type: event.type,
//         summary: event.summary || "",
//         description: event.description || "",
//         startTime: event.start?.dateTime
//           ? formatForDateTimeLocal(new Date(event.start.dateTime))
//           : "",
//         endTime: event.end?.dateTime
//           ? formatForDateTimeLocal(new Date(event.end.dateTime))
//           : "",
//         location: event.location || "",
//         color: event.colorId || CALENDAR_COLORS[0].id,
//         calendarId: event.calendarId || "primary",
//       });
//     } else {
//       const now = new Date();
//       const startTime = addHours(now, 1);
//       const endTime = addHours(startTime, 1);

//       setSelectedEventType(type);
//       setFormData({
//         ...formData,
//         type: type,
//         summary: "",
//         description: "",
//         startTime: formatForDateTimeLocal(startTime),
//         endTime: formatForDateTimeLocal(endTime),
//         location: "",
//         color:
//           CALENDAR_COLORS[Math.floor(Math.random() * CALENDAR_COLORS.length)]
//             .id,
//       });
//       setSelectedEvent(null);
//     }
//     setOpenDialog(true);
//   };

//   // Render Form based on selected event type
//   const renderForm = () => {
//     const formProps = {
//       formData,
//       setFormData,
//       errors: formErrors,
//     };

//     switch (selectedEventType) {
//       case "event":
//         return <EventForm {...formProps} />;
//       case "meeting":
//         return <MeetingForm {...formProps} />;
//       case "task":
//         return <TaskForm {...formProps} />;
//       case "appointment":
//         return <AppointmentForm {...formProps} />;
//       case "reminder":
//         return <ReminderForm {...formProps} />;
//       default:
//         return <EventForm {...formProps} />;
//     }
//   };

//   // Render Calendar View
//   const renderCalendarView = () => {
//     switch (viewMode) {
//       case "day":
//         return renderDayView();
//       case "week":
//         return renderWeekView();
//       case "month":
//         return renderMonthView();
//       case "agenda":
//         return renderAgendaView();
//       case "schedule":
//         return renderScheduleView();
//       default:
//         return renderWeekView();
//     }
//   };

//   const renderDayView = () => {
//     const dayEvents = getEventsForDay(currentDate);

//     return (
//       <Box sx={{ height: "calc(100vh - 300px)", overflow: "auto" }}>
//         <Grid container>
//           <Grid item xs={2}>
//             <Box sx={{ borderRight: 1, borderColor: "divider" }}>
//               {TIME_SLOTS.map((time) => (
//                 <Box
//                   key={time}
//                   sx={{
//                     height: 60,
//                     borderBottom: 1,
//                     borderColor: "divider",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     position: "relative",
//                     bgcolor: "background.paper",
//                   }}
//                 >
//                   <Typography variant="caption" color="text.secondary">
//                     {time}
//                   </Typography>
//                   {dragDropEnabled && (
//                     <DroppableCalendarSlot
//                       date={format(currentDate, "yyyy-MM-dd")}
//                       time={time}
//                       onDrop={handleDrop}
//                     />
//                   )}
//                 </Box>
//               ))}
//             </Box>
//           </Grid>
//           <Grid item xs={10}>
//             <Box sx={{ position: "relative", height: "100%" }}>
//               {TIME_SLOTS.map((time) => (
//                 <Box
//                   key={time}
//                   sx={{
//                     height: 60,
//                     borderBottom: 1,
//                     borderColor: "divider",
//                     position: "relative",
//                     bgcolor: "background.paper",
//                   }}
//                 >
//                   {dragDropEnabled && (
//                     <DroppableCalendarSlot
//                       date={format(currentDate, "yyyy-MM-dd")}
//                       time={time}
//                       onDrop={handleDrop}
//                     />
//                   )}
//                 </Box>
//               ))}

//               {dayEvents.map((event) => {
//                 const startTime = event.start?.dateTime
//                   ? new Date(event.start.dateTime)
//                   : new Date();
//                 const endTime = event.end?.dateTime
//                   ? new Date(event.end.dateTime)
//                   : new Date(startTime.getTime() + 60 * 60000);

//                 const startMinutes =
//                   getHours(startTime) * 60 + getMinutes(startTime);
//                 const durationMinutes = differenceInMinutes(endTime, startTime);
//                 const top = startMinutes * 1;
//                 const height = Math.max(durationMinutes, 30);
//                 const eventType =
//                   EVENT_TYPES.find((t) => t.id === event.type) ||
//                   EVENT_TYPES[0];

//                 return (
//                   <Box
//                     key={event.id}
//                     sx={{
//                       position: "absolute",
//                       top: `${top}px`,
//                       left: "10px",
//                       right: "10px",
//                       height: `${height}px`,
//                       bgcolor: eventType.color,
//                       color: "white",
//                       borderRadius: 1,
//                       p: 1,
//                       overflow: "hidden",
//                       cursor: "pointer",
//                       border: "1px solid rgba(255,255,255,0.3)",
//                       boxShadow: 1,
//                       "&:hover": {
//                         opacity: 0.9,
//                         boxShadow: 3,
//                       },
//                     }}
//                     onClick={() => handleOpenDialog(event)}
//                   >
//                     <Typography
//                       variant="caption"
//                       noWrap
//                       sx={{
//                         fontWeight: "bold",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 0.5,
//                       }}
//                     >
//                       {eventType.icon}
//                       {format(startTime, "h:mm a")} - {event.summary}
//                     </Typography>
//                     {event.location && (
//                       <Typography
//                         variant="caption"
//                         sx={{ display: "block", opacity: 0.8, mt: 0.5 }}
//                       >
//                         {event.location}
//                       </Typography>
//                     )}
//                     {dragDropEnabled && (
//                       <DragIndicator
//                         sx={{
//                           position: "absolute",
//                           right: 4,
//                           top: 4,
//                           fontSize: 16,
//                           opacity: 0.7,
//                         }}
//                       />
//                     )}
//                   </Box>
//                 );
//               })}
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     );
//   };

//   const renderWeekView = () => {
//     return (
//       <Grid container spacing={0.5}>
//         {weekDays.map((day, index) => {
//           const dayEvents = getEventsForDay(day);
//           return (
//             <Grid item xs key={index}>
//               <Paper
//                 elevation={0}
//                 sx={{
//                   height: "calc(100vh - 250px)",
//                   overflow: "auto",
//                   bgcolor: isSameDay(day, new Date())
//                     ? "primary.50"
//                     : "background.paper",
//                   border: "1px solid",
//                   borderColor: "divider",
//                   borderRadius: 1,
//                 }}
//               >
//                 <Box sx={{ p: 1 }}>
//                   <Typography
//                     variant="subtitle2"
//                     align="center"
//                     sx={{
//                       fontWeight: "bold",
//                       color: isSameDay(day, new Date())
//                         ? "primary.main"
//                         : "text.primary",
//                     }}
//                   >
//                     {format(day, "EEE")}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     align="center"
//                     sx={{
//                       color: isSameDay(day, new Date())
//                         ? "primary.main"
//                         : "text.secondary",
//                     }}
//                   >
//                     {format(day, "d")}
//                   </Typography>
//                   <Divider sx={{ my: 1 }} />

//                   {dayEvents.length > 0 ? (
//                     <Box>
//                       {dayEvents.map((event) => {
//                         const eventType =
//                           EVENT_TYPES.find((t) => t.id === event.type) ||
//                           EVENT_TYPES[0];
//                         return (
//                           <Paper
//                             key={event.id}
//                             elevation={1}
//                             sx={{
//                               p: 1,
//                               mb: 1,
//                               bgcolor: eventType.color,
//                               color: "white",
//                               cursor: "pointer",
//                               border: "1px solid rgba(255,255,255,0.3)",
//                               "&:hover": {
//                                 opacity: 0.9,
//                                 boxShadow: 3,
//                               },
//                             }}
//                             onClick={() => handleOpenDialog(event)}
//                           >
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                               }}
//                             >
//                               <Typography
//                                 variant="caption"
//                                 sx={{
//                                   fontWeight: "bold",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   gap: 0.5,
//                                 }}
//                               >
//                                 {eventType.icon}
//                                 {format(
//                                   new Date(event.start?.dateTime || new Date()),
//                                   "h:mm a"
//                                 )}
//                               </Typography>
//                               {dragDropEnabled && (
//                                 <DragIndicator
//                                   sx={{ fontSize: 14, opacity: 0.7 }}
//                                 />
//                               )}
//                             </Box>
//                             <Typography
//                               variant="body2"
//                               fontWeight="bold"
//                               noWrap
//                             >
//                               {event.summary}
//                             </Typography>
//                             <Chip
//                               size="small"
//                               label={event.type}
//                               sx={{
//                                 mt: 0.5,
//                                 color: "white",
//                                 bgcolor: "rgba(255,255,255,0.2)",
//                                 fontSize: "10px",
//                               }}
//                             />
//                           </Paper>
//                         );
//                       })}
//                     </Box>
//                   ) : (
//                     <Typography
//                       variant="body2"
//                       color="textSecondary"
//                       align="center"
//                       sx={{ mt: 2 }}
//                     >
//                       No events
//                     </Typography>
//                   )}
//                 </Box>
//               </Paper>
//             </Grid>
//           );
//         })}
//       </Grid>
//     );
//   };

//   const renderMonthView = () => {
//     const weeks = [];
//     for (let i = 0; i < monthDays.length; i += 7) {
//       weeks.push(monthDays.slice(i, i + 7));
//     }

//     return (
//       <Box>
//         <Grid container spacing={0.5}>
//           {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//             <Grid item xs key={day}>
//               <Typography
//                 align="center"
//                 fontWeight="bold"
//                 color="text.secondary"
//               >
//                 {day}
//               </Typography>
//             </Grid>
//           ))}
//         </Grid>

//         {weeks.map((week, weekIndex) => (
//           <Grid container spacing={0.5} key={weekIndex} sx={{ mb: 0.5 }}>
//             {week.map((day, dayIndex) => {
//               const dayEvents = getEventsForDay(day);
//               return (
//                 <Grid item xs key={dayIndex}>
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       height: 120,
//                       overflow: "hidden",
//                       bgcolor: isSameDay(day, new Date())
//                         ? "primary.50"
//                         : !isSameMonth(day, currentDate)
//                         ? "grey.50"
//                         : "background.paper",
//                       border: "1px solid",
//                       borderColor: "divider",
//                       borderRadius: 1,
//                       cursor: "pointer",
//                       "&:hover": {
//                         bgcolor: "action.hover",
//                       },
//                     }}
//                     onClick={() => {
//                       setCurrentDate(day);
//                       setViewMode("day");
//                     }}
//                   >
//                     <Box sx={{ p: 0.5 }}>
//                       <Typography
//                         variant="body2"
//                         align="center"
//                         sx={{
//                           fontWeight: "bold",
//                           color: isSameDay(day, new Date())
//                             ? "primary.main"
//                             : !isSameMonth(day, currentDate)
//                             ? "grey.400"
//                             : "text.primary",
//                         }}
//                       >
//                         {format(day, "d")}
//                       </Typography>

//                       {dayEvents.slice(0, 3).map((event) => {
//                         const eventType =
//                           EVENT_TYPES.find((t) => t.id === event.type) ||
//                           EVENT_TYPES[0];
//                         return (
//                           <Box
//                             key={event.id}
//                             sx={{
//                               bgcolor: eventType.color,
//                               color: "white",
//                               borderRadius: 0.5,
//                               p: 0.25,
//                               mb: 0.25,
//                               fontSize: "9px",
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                               whiteSpace: "nowrap",
//                               border: "1px solid rgba(255,255,255,0.3)",
//                             }}
//                           >
//                             {format(new Date(event.start.dateTime), "h:mm")} -{" "}
//                             {event.summary.substring(0, 12)}
//                             {event.summary.length > 12 ? "..." : ""}
//                           </Box>
//                         );
//                       })}

//                       {dayEvents.length > 3 && (
//                         <Typography variant="caption" color="textSecondary">
//                           +{dayEvents.length - 3} more
//                         </Typography>
//                       )}
//                     </Box>
//                   </Paper>
//                 </Grid>
//               );
//             })}
//           </Grid>
//         ))}
//       </Box>
//     );
//   };

//   const renderAgendaView = () => {
//     const groupedEvents = {};
//     events.forEach((event) => {
//       const date = event.start?.dateTime
//         ? format(new Date(event.start.dateTime), "yyyy-MM-dd")
//         : "unscheduled";
//       if (!groupedEvents[date]) groupedEvents[date] = [];
//       groupedEvents[date].push(event);
//     });

//     return (
//       <Box>
//         {Object.entries(groupedEvents)
//           .sort()
//           .map(([date, dateEvents]) => (
//             <Box key={date} sx={{ mb: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 {date === "unscheduled"
//                   ? "Unscheduled"
//                   : format(new Date(date), "EEEE, MMMM d, yyyy")}
//               </Typography>
//               {dateEvents.map((event) => {
//                 const eventType =
//                   EVENT_TYPES.find((t) => t.id === event.type) ||
//                   EVENT_TYPES[0];
//                 return (
//                   <Paper key={event.id} sx={{ mb: 1, overflow: "hidden" }}>
//                     <Box
//                       sx={{
//                         p: 2,
//                         borderLeft: `4px solid ${eventType.color}`,
//                         bgcolor: "background.paper",
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "flex-start",
//                         }}
//                       >
//                         <Box>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: 1,
//                               mb: 1,
//                             }}
//                           >
//                             {eventType.icon}
//                             <Typography
//                               variant="h6"
//                               sx={{ color: eventType.color }}
//                             >
//                               {event.summary}
//                             </Typography>
//                           </Box>
//                           <Typography
//                             variant="body2"
//                             color="text.secondary"
//                             sx={{ mb: 1 }}
//                           >
//                             {format(new Date(event.start.dateTime), "h:mm a")} -{" "}
//                             {event.location || "No location"}
//                           </Typography>
//                           <Box
//                             sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
//                           >
//                             <Chip
//                               size="small"
//                               label={event.type}
//                               sx={{ bgcolor: eventType.color, color: "white" }}
//                             />
//                             <Chip
//                               size="small"
//                               label={event.status || "scheduled"}
//                               variant="outlined"
//                             />
//                           </Box>
//                         </Box>
//                         <IconButton
//                           size="small"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setAnchorEl({
//                               element: e.currentTarget,
//                               eventId: event.id,
//                             });
//                           }}
//                         >
//                           <MoreVertIcon />
//                         </IconButton>
//                       </Box>
//                       {event.description && (
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             mt: 2,
//                             p: 1,
//                             bgcolor: "grey.50",
//                             borderRadius: 1,
//                           }}
//                         >
//                           {event.description}
//                         </Typography>
//                       )}
//                     </Box>
//                   </Paper>
//                 );
//               })}
//             </Box>
//           ))}
//       </Box>
//     );
//   };

//   const renderScheduleView = () => {
//     const now = new Date();
//     const upcomingEvents = events
//       .filter((event) => {
//         const eventDate = event.start?.dateTime
//           ? new Date(event.start.dateTime)
//           : null;
//         return eventDate && eventDate >= now;
//       })
//       .sort(
//         (a, b) => new Date(a.start?.dateTime) - new Date(b.start?.dateTime)
//       );

//     return (
//       <Box>
//         <Typography variant="h6" gutterBottom>
//           Upcoming Schedule
//         </Typography>
//         {upcomingEvents.slice(0, 10).map((event) => {
//           const eventDate = new Date(event.start.dateTime);
//           const timeUntil = formatDistanceToNow(eventDate, {
//             addSuffix: true,
//           });
//           const eventType =
//             EVENT_TYPES.find((t) => t.id === event.type) || EVENT_TYPES[0];

//           return (
//             <Paper key={event.id} sx={{ mb: 1, overflow: "hidden" }}>
//               <Box
//                 sx={{
//                   p: 2,
//                   borderLeft: `4px solid ${eventType.color}`,
//                   bgcolor: "background.paper",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                     <Avatar sx={{ bgcolor: eventType.color }}>
//                       {eventType.icon}
//                     </Avatar>
//                     <Box>
//                       <Typography variant="subtitle1" fontWeight="bold">
//                         {event.summary}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {format(eventDate, "PPPPpp")}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {timeUntil} • {event.location || "No location"}
//                       </Typography>
//                     </Box>
//                   </Box>
//                   <Button
//                     variant="outlined"
//                     size="small"
//                     onClick={() => handleOpenDialog(event)}
//                   >
//                     View Details
//                   </Button>
//                 </Box>
//               </Box>
//             </Paper>
//           );
//         })}
//       </Box>
//     );
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <Box
//         sx={{
//           display: "flex",
//           minHeight: "100vh",
//           bgcolor: "background.default",
//         }}
//       >
//         {/* Sidebar */}
//         <Drawer
//           variant={isMobile ? "temporary" : "persistent"}
//           open={sidebarOpen}
//           onClose={() => setSidebarOpen(false)}
//           sx={{
//             width: 280,
//             flexShrink: 0,
//             "& .MuiDrawer-paper": {
//               width: 280,
//               boxSizing: "border-box",
//               borderRight: "1px solid",
//               borderColor: "divider",
//             },
//           }}
//         >
//           <Box sx={{ p: 2 }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
//               <Avatar
//                 src={userProfile?.picture}
//                 sx={{ width: 40, height: 40 }}
//               />
//               <Box>
//                 <Typography variant="subtitle1" fontWeight="bold">
//                   {userProfile?.name || "Guest"}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   {userProfile?.email || "Not logged in"}
//                 </Typography>
//               </Box>
//             </Box>

//             <Button
//               variant="contained"
//               fullWidth
//               startIcon={<AddIcon />}
//               onClick={() => setQuickAddOpen(true)}
//               sx={{ mb: 3 }}
//             >
//               Create
//             </Button>

//             <Typography
//               variant="subtitle2"
//               color="text.secondary"
//               sx={{ mb: 1 }}
//             >
//               CALENDARS
//             </Typography>
//             <List dense>
//               {calendars.map((calendar) => (
//                 <ListItem key={calendar.id} disablePadding>
//                   <ListItemButton
//                     selected={selectedCalendar === calendar.id}
//                     onClick={() => setSelectedCalendar(calendar.id)}
//                     sx={{ borderRadius: 1 }}
//                   >
//                     <ListItemIcon sx={{ minWidth: 36 }}>
//                       <Box
//                         sx={{
//                           width: 12,
//                           height: 12,
//                           borderRadius: "50%",
//                           bgcolor: getColorById(calendar.color),
//                         }}
//                       />
//                     </ListItemIcon>
//                     <ListItemText primary={calendar.name} />
//                   </ListItemButton>
//                 </ListItem>
//               ))}
//             </List>

//             <Divider sx={{ my: 2 }} />

//             <Typography
//               variant="subtitle2"
//               color="text.secondary"
//               sx={{ mb: 1 }}
//             >
//               EVENT TYPES
//             </Typography>
//             <List dense>
//               {EVENT_TYPES.map((type) => (
//                 <ListItem key={type.id} disablePadding>
//                   <ListItemButton
//                     onClick={() => handleOpenDialog(null, type.id)}
//                     sx={{ borderRadius: 1 }}
//                   >
//                     <ListItemIcon sx={{ minWidth: 36, color: type.color }}>
//                       {type.icon}
//                     </ListItemIcon>
//                     <ListItemText primary={type.name} />
//                   </ListItemButton>
//                 </ListItem>
//               ))}
//             </List>

//             <Divider sx={{ my: 2 }} />

//             <Typography
//               variant="subtitle2"
//               color="text.secondary"
//               sx={{ mb: 1 }}
//             >
//               QUICK STATS
//             </Typography>
//             <Grid container spacing={1}>
//               <Grid item xs={6}>
//                 <Paper sx={{ p: 1, textAlign: "center" }}>
//                   <Typography variant="h6" color="primary">
//                     {events.length}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     Total Events
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={6}>
//                 <Paper sx={{ p: 1, textAlign: "center" }}>
//                   <Typography variant="h6" color="success.main">
//                     {
//                       events.filter(
//                         (e) => new Date(e.start?.dateTime) > new Date()
//                       ).length
//                     }
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     Upcoming
//                   </Typography>
//                 </Paper>
//               </Grid>
//             </Grid>
//           </Box>
//         </Drawer>

//         {/* Main Content */}
//         <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
//           {/* App Bar */}
//           <AppBar
//             position="static"
//             color="default"
//             elevation={0}
//             sx={{
//               borderBottom: "1px solid",
//               borderColor: "divider",
//               bgcolor: "background.paper",
//             }}
//           >
//             <Toolbar>
//               <IconButton
//                 edge="start"
//                 onClick={() => setSidebarOpen(!sidebarOpen)}
//                 sx={{ mr: 2 }}
//               >
//                 <Menu />
//               </IconButton>

//               <Box
//                 sx={{
//                   flexGrow: 1,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 2,
//                 }}
//               >
//                 <IconButton onClick={goToPrevious} size="small">
//                   <ChevronLeft />
//                 </IconButton>
//                 <Button
//                   variant="outlined"
//                   size="small"
//                   startIcon={<TodayIcon />}
//                   onClick={goToToday}
//                 >
//                   Today
//                 </Button>
//                 <IconButton onClick={goToNext} size="small">
//                   <ChevronRight />
//                 </IconButton>
//                 <Typography variant="h6" sx={{ ml: 1 }}>
//                   {format(currentDate, "MMMM yyyy")}
//                 </Typography>
//               </Box>

//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <TextField
//                   size="small"
//                   placeholder="Search events..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Search />
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx={{ width: 200 }}
//                 />

//                 <ToggleButtonGroup
//                   value={viewMode}
//                   exclusive
//                   onChange={(e, newMode) => newMode && setViewMode(newMode)}
//                   size="small"
//                 >
//                   {CALENDAR_VIEWS.map((view) => (
//                     <Tooltip key={view.id} title={view.name}>
//                       <ToggleButton value={view.id}>{view.icon}</ToggleButton>
//                     </Tooltip>
//                   ))}
//                 </ToggleButtonGroup>

//                 <IconButton onClick={() => setSettingsOpen(true)}>
//                   <Settings />
//                 </IconButton>

//                 {!accessToken ? (
//                   <Button
//                     variant="contained"
//                     onClick={() => login()}
//                     disabled={loading}
//                     startIcon={<EventIcon />}
//                   >
//                     {loading ? <CircularProgress size={20} /> : "Sign In"}
//                   </Button>
//                 ) : (
//                   <Button
//                     variant="outlined"
//                     onClick={() => {
//                       googleLogout();
//                       setAccessToken(null);
//                       setUserProfile(null);
//                       setEvents([]);
//                       localStorage.removeItem("google_access_token");
//                       localStorage.removeItem("google_user_profile");
//                       showNotification("Logged out successfully", "info");
//                     }}
//                   >
//                     Sign Out
//                   </Button>
//                 )}
//               </Box>
//             </Toolbar>
//           </AppBar>

//           {/* Calendar View */}
//           <Box sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
//             {renderCalendarView()}
//           </Box>
//         </Box>

//         {/* Event Creation Dialog */}
//         <Dialog
//           open={openDialog}
//           onClose={() => setOpenDialog(false)}
//           maxWidth="md"
//           fullWidth
//           scroll="paper"
//         >
//           <DialogTitle>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//               {EVENT_TYPES.find((t) => t.id === selectedEventType)?.icon}
//               {selectedEvent ? "Edit " : "Create New "}
//               {EVENT_TYPES.find((t) => t.id === selectedEventType)?.name}
//             </Box>
//           </DialogTitle>
//           <DialogContent dividers>
//             <Grid container spacing={2} sx={{ pt: 2 }}>
//               {renderForm()}
//             </Grid>
//           </DialogContent>
//           <DialogActions sx={{ p: 2 }}>
//             <Button
//               onClick={() => setOpenDialog(false)}
//               color="inherit"
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               onClick={createEvent}
//               disabled={loading}
//               startIcon={selectedEvent ? <EditIcon /> : <AddIcon />}
//             >
//               {loading ? (
//                 <CircularProgress size={24} />
//               ) : selectedEvent ? (
//                 "Update"
//               ) : (
//                 "Create"
//               )}
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Quick Add Dialog */}
//         <Dialog
//           open={quickAddOpen}
//           onClose={() => setQuickAddOpen(false)}
//           maxWidth="xs"
//           fullWidth
//         >
//           <DialogTitle>Quick Add</DialogTitle>
//           <DialogContent>
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               {EVENT_TYPES.map((type) => (
//                 <Grid item xs={6} key={type.id}>
//                   <Card
//                     sx={{
//                       cursor: "pointer",
//                       textAlign: "center",
//                       p: 3,
//                       border: "2px solid transparent",
//                       "&:hover": {
//                         borderColor: type.color,
//                         bgcolor: alpha(type.color, 0.05),
//                         transform: "translateY(-4px)",
//                         transition: "all 0.2s",
//                       },
//                     }}
//                     onClick={() => {
//                       handleOpenDialog(null, type.id);
//                       setQuickAddOpen(false);
//                     }}
//                   >
//                     <Box sx={{ color: type.color, mb: 2, fontSize: 40 }}>
//                       {type.icon}
//                     </Box>
//                     <Typography variant="subtitle1" fontWeight="bold">
//                       {type.name}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {type.description}
//                     </Typography>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setQuickAddOpen(false)}>Cancel</Button>
//           </DialogActions>
//         </Dialog>

//         {/* Settings Dialog */}
//         <Dialog
//           open={settingsOpen}
//           onClose={() => setSettingsOpen(false)}
//           maxWidth="sm"
//           fullWidth
//         >
//           <DialogTitle>Settings</DialogTitle>
//           <DialogContent dividers>
//             <Box sx={{ pt: 2 }}>
//               <Typography variant="h6" gutterBottom>
//                 Appearance
//               </Typography>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={themeMode === "dark"}
//                     onChange={() =>
//                       setThemeMode(themeMode === "light" ? "dark" : "light")
//                     }
//                   />
//                 }
//                 label="Dark Mode"
//               />
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={dragDropEnabled}
//                     onChange={() => setDragDropEnabled(!dragDropEnabled)}
//                   />
//                 }
//                 label="Enable Drag & Drop"
//               />

//               <Divider sx={{ my: 3 }} />

//               <Typography variant="h6" gutterBottom>
//                 Calendar Settings
//               </Typography>
//               <FormControl fullWidth sx={{ mb: 2 }}>
//                 <InputLabel>Default View</InputLabel>
//                 <Select
//                   value={viewMode}
//                   onChange={(e) => setViewMode(e.target.value)}
//                   label="Default View"
//                 >
//                   {CALENDAR_VIEWS.map((view) => (
//                     <MenuItem key={view.id} value={view.id}>
//                       {view.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <FormControl fullWidth>
//                 <InputLabel>Default Calendar</InputLabel>
//                 <Select
//                   value={selectedCalendar}
//                   onChange={(e) => setSelectedCalendar(e.target.value)}
//                   label="Default Calendar"
//                 >
//                   {calendars.map((calendar) => (
//                     <MenuItem key={calendar.id} value={calendar.id}>
//                       {calendar.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setSettingsOpen(false)}>Close</Button>
//             <Button onClick={() => setSettingsOpen(false)} variant="contained">
//               Save
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Floating Action Button */}
//         {accessToken && (
//           <Fab
//             color="primary"
//             sx={{
//               position: "fixed",
//               bottom: 24,
//               right: 24,
//               zIndex: 1000,
//             }}
//             onClick={() => setQuickAddOpen(true)}
//           >
//             <AddIcon />
//           </Fab>
//         )}

//         {/* Notification Snackbar */}
//         <Snackbar
//           open={notification.open}
//           autoHideDuration={4000}
//           onClose={() => setNotification({ ...notification, open: false })}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         >
//           <Alert
//             severity={notification.severity}
//             onClose={() => setNotification({ ...notification, open: false })}
//             sx={{ width: "100%" }}
//           >
//             {notification.message}
//           </Alert>
//         </Snackbar>

//         {/* Loading Backdrop */}
//         <Backdrop
//           sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
//           open={loading}
//         >
//           <CircularProgress color="inherit" />
//         </Backdrop>
//       </Box>
//     </DndProvider>
//   );
// };

// export default EnhancedGoogleCalendar;
