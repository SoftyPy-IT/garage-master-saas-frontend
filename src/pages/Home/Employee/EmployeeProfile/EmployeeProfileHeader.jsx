/* eslint-disable react/prop-types */
import {
  Box,
  Grid,
  Avatar,
  Button,
  Chip,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import SendIcon from "@mui/icons-material/Send"
import EditIcon from "@mui/icons-material/Edit"
import { AnimatedAvatar } from "../../../../utils/customStyle"
import avatar from "../../../../../public/assets/chat3.jpg"

const EmployeeProfileHeader = ({
  employee,
  totalOvertime,
  totalSalary,
  attendancePercentage,
  attendanceCount,
  daysInMonth,
  monthName,
  currentYear,
}) => {
  return (
    <Box sx={{ mt: -12, px: 4, pb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ position: "relative" }}>
              <AnimatedAvatar
                src={employee?.image || avatar}
                alt={employee?.full_name}
                className="profile-image-pulse"
                sx={{
                  width: 160,
                  height: 160,
                  border: "6px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2), 0 0 0 4px rgba(255,255,255,0.1)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "linear-gradient(45deg, #4CAF50, #8BC34A)",
                  border: "3px solid white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              />
            </Box>

            <Typography
              variant="h4"
              fontWeight="bold"
              mt={3}
              sx={{
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center",
              }}
            >
              {employee?.full_name}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#666",
                fontWeight: 500,
                textAlign: "center",
                mt: 1,
              }}
            >
              {employee?.designation}
            </Typography>

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                sx={{
                  borderRadius: "25px",
                  textTransform: "none",
                  px: 3,
                  py: 1.5,
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #764ba2, #667eea)",
                    boxShadow: "0 12px 25px rgba(102, 126, 234, 0.6)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Message
              </Button>
              <IconButton
                sx={{
                  background: "linear-gradient(45deg, #f093fb, #f5576c)",
                  color: "white",
                  width: 50,
                  height: 50,
                  boxShadow: "0 8px 20px rgba(240, 147, 251, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #f5576c, #f093fb)",
                    boxShadow: "0 12px 25px rgba(240, 147, 251, 0.6)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              p: 3,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderRadius: "12px",
                    background: "rgba(102, 126, 234, 0.1)",
                  }}
                >
                  <Chip
                    icon={<CalendarTodayIcon />}
                    label={`Joined: ${employee?.join_date}`}
                    sx={{
                      borderRadius: "20px",
                      px: 2,
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderRadius: "12px",
                    background: "rgba(240, 147, 251, 0.1)",
                  }}
                >
                  <EmailIcon sx={{ mr: 2, color: "#f093fb", fontSize: 28 }} />
                  <Typography fontWeight="500">{employee?.email}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderRadius: "12px",
                    background: "rgba(118, 75, 162, 0.1)",
                  }}
                >
                  <PhoneIcon sx={{ mr: 2, color: "#764ba2", fontSize: 28 }} />
                  <Typography fontWeight="500">{employee?.phone}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderRadius: "12px",
                    background: "rgba(245, 87, 108, 0.1)",
                  }}
                >
                  <LocationOnIcon sx={{ mr: 2, color: "#f5576c", fontSize: 28 }} />
                  <Typography fontWeight="500">{employee?.address}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 4, display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Box
              sx={{
                flex: 1,
                minWidth: 200,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "20px",
                p: 3,
                color: "white",
                boxShadow: "0 15px 35px rgba(102, 126, 234, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 20px 40px rgba(102, 126, 234, 0.4)",
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Overtime
                </Typography>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 50, height: 50 }}>
                  <AccessTimeIcon sx={{ fontSize: 28 }} />
                </Avatar>
              </Box>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {totalOvertime || 0} hrs
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {monthName}, {currentYear}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: 200,
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                borderRadius: "20px",
                p: 3,
                color: "white",
                boxShadow: "0 15px 35px rgba(240, 147, 251, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 20px 40px rgba(240, 147, 251, 0.4)",
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Total Salary
                </Typography>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 50, height: 50 }}>
                 ৳
                </Avatar>
              </Box>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                ৳ {totalSalary || 0}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: 200,
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                borderRadius: "20px",
                p: 3,
                color: "white",
                boxShadow: "0 15px 35px rgba(79, 172, 254, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 20px 40px rgba(79, 172, 254, 0.4)",
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Attendance
                </Typography>
                <CircularProgress
                  variant="determinate"
                  value={attendancePercentage}
                  size={50}
                  thickness={6}
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    "& .MuiCircularProgress-circle": {
                      strokeLinecap: "round",
                    },
                  }}
                />
              </Box>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {attendancePercentage}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {attendanceCount} / {daysInMonth} days
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default EmployeeProfileHeader