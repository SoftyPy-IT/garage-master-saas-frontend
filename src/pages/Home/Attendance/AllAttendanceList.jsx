import { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Grid,
  Button,
  useTheme,
  alpha,
  Tooltip,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert,
  Menu,
} from "@mui/material";
import {
  Search,
  FilterList,
  Visibility,
  Edit,
  Delete,
  Refresh,
  CalendarToday,
  Person,
  Schedule,
  CheckCircle,
  Cancel,
  WatchLater,
  TrendingUp,
  DateRange,
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  useDeleteAttendanceMutation,
  useGetAllEmployeeAttendancesQuery,
} from "../../../redux/api/attendance";
import swal from "sweetalert";
import Loading from "../../../components/Loading/Loading";
import { Link } from "react-router-dom";
import { useAppOptions } from "../../../hooks/useAppOptions";
import Can from "../../../components/Can";
import { AttendanceDetails } from "./AttendanceDetails";
const AttendanceListPage = () => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("none");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const limit = 10;
  const { tenantDomain, performActionWithPermission } = useAppOptions()
  const [deleteAttendance] = useDeleteAttendanceMutation();
  const buildQueryParams = () => {
    let queryParams = {
      tenantDomain,
      limit,
      page,
    };

    if (searchTerm) queryParams.searchTerm = searchTerm;

    if (filterType === "daily" && startDate && endDate) {
      queryParams.startDate = startDate.format("YYYY-MM-DD");
      queryParams.endDate = endDate.format("YYYY-MM-DD");
    } else if (filterType === "monthly" && selectedMonth) {
      queryParams.month = selectedMonth;
    } else if (filterType === "yearly" && selectedYear) {
      queryParams.year = selectedYear;
    }

    if (filterStatus && filterStatus !== "all") {
      queryParams.status = filterStatus;
    }

    return queryParams;
  };

  const {
    data: attendanceData,
    isLoading,
    error,
    refetch,
  } = useGetAllEmployeeAttendancesQuery(buildQueryParams());

  // FIXED: Handle delete attendance with date parameter
  const handleDeleteAttendance = async (id, date) => {

    performActionWithPermission('/dashboard/attendance-list', 'delete',
      async () => {
        const formattedDate = dayjs(date, ["DD-MM-YYYY", "DD-MM-YY"]).format(
          "YYYY-MM-DD"
        );
        const willDelete = await swal({
          title: "Are you sure?",
          text: `You want to delete attendance for ${formattedDate}?`,
          icon: "warning",
          dangerMode: true,
          buttons: ["Cancel", "Yes, Delete"],
        });

        if (willDelete) {
          try {
            const response = await deleteAttendance({
              tenantDomain,
              id,
              date: formattedDate,
            }).unwrap();

            if (response.success) {
              swal(
                "Deleted!",
                `Attendance record has been deleted successfully.`,
                "success"
              );
              refetch();
            } else {
              swal(
                "Error",
                response.message || "Failed to delete attendance",
                "error"
              );
            }
          } catch (error) {
            console.error("Delete error:", error);
            swal("Error", error.message || "Failed to delete attendance", "error");
          }
        }
      }, "You don't have permission to delete attendance records."
    )
  };

  // Calculate statistics from API data
  const calculateStats = () => {
    if (!attendanceData || !attendanceData?.data?.attendances)
      return { present: 0, absent: 0, late: 0, total: 0 };

    const present = attendanceData?.data?.attendances.filter(
      (record) => record.present
    ).length;

    const absent = attendanceData?.data?.attendances.filter(
      (record) => record.absent
    ).length;

    const late = attendanceData?.data?.attendances.filter(
      (record) => record.late_status
    ).length;

    const total = attendanceData?.data?.attendances.length;

    return { present, absent, late, total };
  };

  const stats = calculateStats();

  const handleViewDetails = (attendance) => {
    setSelectedAttendance(attendance);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedAttendance(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getStatusChip = (attendance) => {
    if (attendance.absent) {
      return (
        <Chip
          icon={<Cancel />}
          label="Absent"
          color="error"
          variant="outlined"
        />
      );
    } else if (attendance.late_status) {
      return (
        <Chip
          icon={<WatchLater />}
          label="Late"
          color="warning"
          variant="outlined"
        />
      );
    } else {
      return (
        <Chip
          icon={<CheckCircle />}
          label="Present"
          color="success"
          variant="outlined"
        />
      );
    }
  };

  const calculateWorkingHours = (inTime, outTime) => {
    if (!inTime || !outTime) return "N/A";

    const [inHours, inMinutesPart] = inTime.split(":");
    const [inMinutes, inPeriod] = inMinutesPart.split(" ");
    const [outHours, outMinutesPart] = outTime.split(":");
    const [outMinutes, outPeriod] = outMinutesPart.split(" ");

    let inTotalMinutes = parseInt(inHours) * 60 + parseInt(inMinutes);
    if (inPeriod === "PM" && inHours !== "12") inTotalMinutes += 12 * 60;

    let outTotalMinutes = parseInt(outHours) * 60 + parseInt(outMinutes);
    if (outPeriod === "PM" && outHours !== "12") outTotalMinutes += 12 * 60;

    const duration = outTotalMinutes - inTotalMinutes;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return `${hours}h ${minutes}m`;
  };

  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setPage(1);
    handleFilterMenuClose();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterType("none");
    setStartDate(null);
    setEndDate(null);
    setSelectedMonth(null);
    setSelectedYear(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Attendance data not found. Try again! {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Box
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
            boxShadow: theme.shadows[4],
          }}
        >
          <Typography variant="h4" fontWeight="600" gutterBottom>
            Attendance Management
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            View and manage all attendance records in your system
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: theme.shadows[4],
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.success.main,
                  0.9
                )} 0%, ${theme.palette.success.dark} 100%)`,
                color: "white",
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {stats.present}
                    </Typography>
                    <Typography variant="body2">Present</Typography>
                  </Box>
                  <CheckCircle sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: theme.shadows[4],
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.error.main,
                  0.9
                )} 0%, ${theme.palette.error.dark} 100%)`,
                color: "white",
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {stats.absent}
                    </Typography>
                    <Typography variant="body2">Absent</Typography>
                  </Box>
                  <Cancel sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: theme.shadows[4],
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.warning.main,
                  0.9
                )} 0%, ${theme.palette.warning.dark} 100%)`,
                color: "white",
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {stats.late}
                    </Typography>
                    <Typography variant="body2">Late</Typography>
                  </Box>
                  <WatchLater sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: theme.shadows[4],
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.info.main,
                  0.9
                )} 0%, ${theme.palette.info.dark} 100%)`,
                color: "white",
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {stats.total}
                    </Typography>
                    <Typography variant="body2">Total Records</Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
            <TextField
              placeholder="Search by employee name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250, flexGrow: 1 }}
            />

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="late">Late</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<DateRange />}
              onClick={handleFilterMenuOpen}
            >
              {filterType === "none"
                ? "Date Filter"
                : filterType === "daily"
                  ? "Date Range"
                  : filterType === "monthly"
                    ? "Monthly"
                    : "Yearly"}
            </Button>

            <Menu
              anchorEl={filterMenuAnchor}
              open={Boolean(filterMenuAnchor)}
              onClose={handleFilterMenuClose}
            >
              <MenuItem
                onClick={() => handleFilterTypeChange("none")}
                selected={filterType === "none"}
              >
                No Date Filter
              </MenuItem>
              <MenuItem
                onClick={() => handleFilterTypeChange("daily")}
                selected={filterType === "daily"}
              >
                Date Range
              </MenuItem>
              <MenuItem
                onClick={() => handleFilterTypeChange("monthly")}
                selected={filterType === "monthly"}
              >
                Monthly
              </MenuItem>
              <MenuItem
                onClick={() => handleFilterTypeChange("yearly")}
                selected={filterType === "yearly"}
              >
                Yearly
              </MenuItem>
            </Menu>

            {filterType === "daily" && (
              <Box display="flex" gap={1}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                />
              </Box>
            )}

            {filterType === "monthly" && (
              <TextField
                label="Month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            )}

            {filterType === "yearly" && (
              <TextField
                label="Year"
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                inputProps={{ min: 2000, max: 2100 }}
              />
            )}

            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={clearFilters}
            >
              Clear Filters
            </Button>

            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={refetch}
              sx={{ ml: "auto" }}
            >
              Refresh
            </Button>
          </Box>
        </Paper>

        {/* Tabs for different views */}
        <Paper sx={{ mb: 2, borderRadius: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab icon={<Schedule />} label="Daily View" />
            <Tab icon={<CalendarToday />} label="Monthly Summary" />
            <Tab icon={<Person />} label="Employee Reports" />
          </Tabs>
        </Paper>

        {/* Attendance Table */}
        <Paper sx={{ width: "100%", borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }}
                >
                  <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    In Time
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Out Time
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Working Hours
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Overtime
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData?.data?.attendances?.map((attendance) => (
                  <TableRow
                    key={attendance._id}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.03
                        ),
                      },
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: theme.palette.primary.main,
                          }}
                        >
                          {attendance.full_name?.charAt(0) || "E"}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            {attendance.full_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {attendance.employeeId} • {attendance.designation}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {dayjs(attendance.date, "DD-MM-YYYY").format(
                          "MMM DD, YYYY"
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(attendance.date, "DD-MM-YYYY").format("dddd")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {getStatusChip(attendance)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={attendance.in_time || "N/A"}
                        color={attendance.in_time ? "primary" : "default"}
                        variant={attendance.in_time ? "filled" : "outlined"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={attendance.out_time || "N/A"}
                        color={attendance.out_time ? "primary" : "default"}
                        variant={attendance.out_time ? "filled" : "outlined"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="500">
                        {calculateWorkingHours(
                          attendance.in_time,
                          attendance.out_time
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={
                          attendance.overtime
                            ? `${attendance.overtime}h`
                            : "N/A"
                        }
                        color={attendance.overtime ? "secondary" : "default"}
                        variant={attendance.overtime ? "filled" : "outlined"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton
                            // component={Link}
                            //  to={`/dashboard/view-attendance?date=${attendance?.date}`}

                            color="primary"
                            onClick={() => handleViewDetails(attendance)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <Can page="/dashboard/attendance-list" action="edit">
                            <IconButton
                              component={Link}
                              to={`/dashboard/update-attendance?date=${attendance?.date}`}
                              color="secondary"
                            >
                              <Edit />
                            </IconButton>
                          </Can>

                        </Tooltip>
                        <Tooltip title="Delete">
                          <Can page="/dashboard/attendance-list" action="delete">
                            <IconButton
                              color="error"
                              onClick={() =>
                                handleDeleteAttendance(
                                  attendance._id,
                                  attendance.date
                                )
                              }
                            >
                              <Delete />
                            </IconButton>
                          </Can>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {(!attendanceData?.attendances ||
            attendanceData.attendances.length === 0) && (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  No attendance records found
                </Typography>
              </Box>
            )}
        </Paper>

        {/* Pagination */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * limit + 1}-
            {Math.min(page * limit, attendanceData?.totalRecords || 0)} of{" "}
            {attendanceData?.totalRecords || 0} records
          </Typography>
          <Pagination
            count={attendanceData?.totalPages || 1}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="large"
          />
        </Box>

        {/* Attendance Detail Dialog */}
        <AttendanceDetails calculateWorkingHours={calculateWorkingHours} open={viewDialogOpen}
          onClose={handleCloseDialog} selectedAttendance={selectedAttendance} getStatusChip={getStatusChip} />
      </Box>
    </LocalizationProvider>
  );
};

export default AttendanceListPage;
