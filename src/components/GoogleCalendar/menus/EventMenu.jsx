import { Call, Delete as DeleteIcon, Edit as EditIcon, Email } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import { useCalendar } from "../../../context/CalendarContext";

export const EventMenu = () => {
  const {
    eventMenuAnchor,
    setEventMenuAnchor,
    selectedEventForMenu,
    handleOpenDialog,
    setEmailContent,
    setEmailDialogOpen,
    deleteEvent,
    userProfile,
  } = useCalendar();

  return (
    <Menu
      anchorEl={eventMenuAnchor}
      open={Boolean(eventMenuAnchor)}
      onClose={() => setEventMenuAnchor(null)}
    >
      <MenuItem
        onClick={() => {
          if (selectedEventForMenu) {
            handleOpenDialog(selectedEventForMenu);
            setEventMenuAnchor(null);
          }
        }}
      >
        <EditIcon sx={{ mr: 1 }} /> Edit
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (selectedEventForMenu) {
            setEmailContent({
              to: selectedEventForMenu.customerInfo?.email || "",
              subject: `Regarding: ${selectedEventForMenu.summary}`,
              body: `Hello,\n\nRegarding your ${selectedEventForMenu.type}: ${
                selectedEventForMenu.summary
              }\n\nBest regards,\n${userProfile?.name || "Calendar System"}`,
            });
            setEmailDialogOpen(true);
            setEventMenuAnchor(null);
          }
        }}
      >
        <Email sx={{ mr: 1 }} /> Send Email
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (selectedEventForMenu?.customerInfo?.phone) {
            window.open(
              `tel:${selectedEventForMenu.customerInfo.phone}`,
              "_blank",
            );
          }
          setEventMenuAnchor(null);
        }}
      >
        <Call sx={{ mr: 1 }} /> Call
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (selectedEventForMenu) {
            deleteEvent(
              selectedEventForMenu.id,
              selectedEventForMenu.calendarId,
            );
            setEventMenuAnchor(null);
          }
        }}
        sx={{ color: "error.main" }}
      >
        <DeleteIcon sx={{ mr: 1 }} /> Delete
      </MenuItem>
    </Menu>
  );
};
