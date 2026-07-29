import { Box, Grid, Paper } from "@mui/material";
import { useCalendar } from "../../../context/CalendarContext";
import { CalendarNavigation } from "./CalendarNavigation";
import { CalendarSidebar } from "./CalendarSidebar";
import { StatsGrid } from "./StatsGrid";
import { CalendarViewRouter } from "../views/CalendarViewRouter";

export const CalendarMainContent = () => {
  const { sidebarOpen, stats } = useCalendar();

  if (sidebarOpen) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <CalendarSidebar />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <CalendarNavigation />
            <CalendarViewRouter />
          </Paper>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box>
      <StatsGrid stats={stats} limit={4} />
      <Paper sx={{ p: 2, mb: 3 }}>
        <CalendarNavigation showSidebarToggle />
        <CalendarViewRouter />
      </Paper>
    </Box>
  );
};
