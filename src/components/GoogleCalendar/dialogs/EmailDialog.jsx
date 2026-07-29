import { Send } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useCalendar } from "../../../context/CalendarContext";

export const EmailDialog = () => {
  const {
    emailDialogOpen,
    setEmailDialogOpen,
    emailContent,
    setEmailContent,
    showNotification,
  } = useCalendar();

  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const sendCustomEmail = async (to, subject, body) => {
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

  return (
    <Dialog
      open={emailDialogOpen}
      onClose={() => setEmailDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Send Email</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="To"
            value={emailContent.to}
            onChange={(e) =>
              setEmailContent({ ...emailContent, to: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Subject"
            value={emailContent.subject}
            onChange={(e) =>
              setEmailContent({ ...emailContent, subject: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Message"
            value={emailContent.body}
            onChange={(e) =>
              setEmailContent({ ...emailContent, body: e.target.value })
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
        <Button
          onClick={() =>
            sendCustomEmail(
              emailContent.to,
              emailContent.subject,
              emailContent.body,
            )
          }
          variant="contained"
          disabled={isSendingEmail}
          startIcon={
            isSendingEmail ? <CircularProgress size={20} /> : <Send />
          }
        >
          {isSendingEmail ? "Sending..." : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
