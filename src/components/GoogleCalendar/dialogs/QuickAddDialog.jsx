import {
  alpha,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { EVENT_TYPES } from "../../../constant/calendar";
import { useCalendar } from "../../../context/CalendarContext";

export const QuickAddDialog = () => {
  const { quickAddOpen, setQuickAddOpen, quickCreate } = useCalendar();

  return (
    <Dialog
      open={quickAddOpen}
      onClose={() => setQuickAddOpen(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Quick Add</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            What would you like to add?
          </Typography>
          <Grid container spacing={2}>
            {EVENT_TYPES.map((type) => (
              <Grid item xs={6} key={type.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    textAlign: "center",
                    p: 2,
                    "&:hover": {
                      backgroundColor: alpha(type.color, 0.1),
                      transform: "translateY(-2px)",
                      transition: "transform 0.2s",
                    },
                  }}
                  onClick={() => {
                    quickCreate(type.id);
                    setQuickAddOpen(false);
                  }}
                >
                  <Box sx={{ color: type.color, mb: 1, fontSize: 32 }}>
                    {type.icon}
                  </Box>
                  <Typography variant="body2" fontWeight="medium">
                    {type.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {type.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setQuickAddOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
