/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Box, Typography, Grid, Divider, Chip, useTheme } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DateRangeIcon from "@mui/icons-material/DateRange";
import WeekendIcon from "@mui/icons-material/Weekend";
import "../Employee.css";
import { StyledPaper } from "../../../utils";
import { GlowingBorder, IconWrapper } from "../../../utils/customStyle";
import { motion } from "framer-motion";

const EmployeeOvertime = ({ accountInfo, tenantDomain, id }) => {
  const theme = useTheme();

  // Extract overtime data from accountInfo
  const overtimeData = accountInfo?.attendance
    ?.filter(att => att.overtime > 0)
    .map(att => ({
      id: att._id,
      day: getDayName(new Date(convertToISO(att.date))),
      date: att.date,
      hours: att.overtime
    })) || [];

  // Convert date string to ISO format (dd-mm-yyyy to yyyy-mm-dd)
  function convertToISO(dateString) {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  }

  // Get day name from Date object
  function getDayName(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  // Calculate total overtime
  const totalOvertime = overtimeData.reduce((total, entry) => total + entry.hours, 0);

  // Color variants for different days
  const dayColors = {
    Monday: theme.palette.primary.main,
    Tuesday: theme.palette.secondary.main,
    Wednesday: "#9c27b0",
    Thursday: "#f57c00",
    Friday: "#4caf50",
    Saturday: "#2196f3",
    Sunday: "#e91e63"
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        className="gradient-text"
        sx={{
          textAlign: 'center',
          textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
          letterSpacing: '1px'
        }}
      >
        Employee Overtime
      </Typography>

      {overtimeData.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: '12px',
            background: theme.palette.background.paper
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No overtime records available
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {overtimeData.map((entry, index) => (
              <Grid item xs={12} md={4} key={entry.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <StyledPaper
                    elevation={5}
                    sx={{
                      height: "100%",
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)'
                      }
                    }}
                  >
                    <GlowingBorder bgcolor={dayColors[entry.day] || theme.palette.primary.main} />
                    <Box sx={{ p: 3, position: 'relative' }}>
                      <Chip
                        label={`${entry.hours} ${entry.hours > 1 ? 'hours' : 'hour'}`}
                        color="secondary"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      />

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <IconWrapper sx={{ bgcolor: dayColors[entry.day] || theme.palette.primary.main }}>
                            <WeekendIcon sx={{ fontSize: 30, color: 'white' }} />
                          </IconWrapper>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                              color: dayColors[entry.day] || theme.palette.primary.main,
                              mt: 1
                            }}
                          >
                            {entry.day}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <DateRangeIcon sx={{ mr: 1, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              Date
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight="medium">
                            {entry.date}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <AccessTimeIcon sx={{ mr: 1, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              Hours
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight="medium">
                            {entry.hours} {entry.hours > 1 ? 'hours' : 'hour'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </StyledPaper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box mt={4}>
            <Divider sx={{ borderColor: theme.palette.divider }} />
            <Box
              mt={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #1a2027 30%, #2c3e50 90%)'
                  : 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
                p: 3,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}
            >
              <Typography variant="h5" fontWeight="medium">
                Total Overtime Hours
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ fontSize: 32, mr: 1, color: theme.palette.secondary.main }} />
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  className="gradient-text"
                  sx={{ fontSize: '2.5rem' }}
                >
                  {totalOvertime}
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default EmployeeOvertime;