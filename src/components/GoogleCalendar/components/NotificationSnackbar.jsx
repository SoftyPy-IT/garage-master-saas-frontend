import { Alert, Snackbar } from "@mui/material";
import { useCalendar } from "../../../context/CalendarContext";

export const NotificationSnackbar = () => {
  const { notification, setNotification } = useCalendar();

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={notification.severity} onClose={handleClose} sx={{ width: "100%" }}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
};
