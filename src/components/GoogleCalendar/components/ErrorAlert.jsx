import { Warning as WarningIcon } from "@mui/icons-material";
import { Alert, Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useCalendar } from "../../../context/CalendarContext";

export const ErrorAlert = () => {
  const { errorDetails, setConfigHelpOpen } = useCalendar();
  const [dismissed, setDismissed] = useState(false);

  if (!errorDetails || dismissed) return null;

  return (
    <Alert
      severity={
        errorDetails.type === "config_required" ? "warning" : "error"
      }
      sx={{ mb: 3 }}
      icon={<WarningIcon />}
      onClose={() => setDismissed(true)}
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
  );
};
