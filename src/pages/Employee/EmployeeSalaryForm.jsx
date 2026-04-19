/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-circular-progressbar/dist/styles.css";
import "./Employee.css";
import { useGetAllEmployeesQuery } from "../../redux/api/employee";
import {
  useCreateSalaryMutation,
  useGetSalaryByMonthQuery,
  useUpdateSalaryMutation,
} from "../../redux/api/salary";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  Alert,
  Autocomplete,
  Avatar,
} from "@mui/material";
import {
  CalendarMonth,
  CheckCircle,
  MonetizationOn,
  Person,
  Save,
  TimerOutlined,
  Warning,
  Edit,
  Add,
  FilterList,
  Clear,
  Group,
} from "@mui/icons-material";
import { allMonths } from "../../utils/month";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import Can from "../../components/Can";

const years = [{ value: "Select Year", label: "Select Year" }];
for (let year = 2024; year <= 2030; year++) {
  years.push({ value: String(year), label: String(year) });
}

const initialSelectedOption = allMonths[new Date().getMonth()];
const currentYear = new Date().getFullYear().toString();

const EmployeeSalaryForm = ({ id, performActionWithPermission, tenantDomain }) => {
  const location = useLocation();
  const month = new URLSearchParams(location.search).get("month");

  const theme = useTheme();
  const [currentPage] = useState(1);
  const limit = 100;

  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: getAllEmployee, isLoading: employeesLoading } =
    useGetAllEmployeesQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: searchTerm,
    });


  const { data: singleSalary, isLoading: singleSalaryLoading } =
    useGetSalaryByMonthQuery({ tenantDomain, month });

  const [createSalary, { isLoading: createLoading, }] =
    useCreateSalaryMutation();
  const [updateSalary, { isLoading: updateLoading, }] = useUpdateSalaryMutation();
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);
  const [bonus, setBonus] = useState([]);
  const [overtimeHours, setOvertimeHours] = useState([]);
  const [overtimeAmount, setOvertimeAmount] = useState([]);
  const [salaryAmount, setSalaryAmount] = useState([]);
  const [previousDue, setPreviousDue] = useState([]);
  const [salaryCut, setSalaryCut] = useState([]);
  const [totalPayment, setTotalPayment] = useState([]);
  const [advance, setAdvance] = useState([]);
  const [pay, setPay] = useState([]);
  const [due, setDue] = useState([]);
  const [paid, setPaid] = useState([]);
  const [dataInitialized, setDataInitialized] = useState(false);

  const getFilteredEmployees = () => {
    if (!getAllEmployee?.data?.employees) return [];

    if (selectedEmployees.length === 0) {
      return getAllEmployee.data.employees;
    }

    return getAllEmployee.data.employees.filter((employee) =>
      selectedEmployees.some((selected) => selected._id === employee._id)
    );
  };

  const filteredEmployees = getFilteredEmployees();

  useEffect(() => {
    if (getAllEmployee?.data?.employees && !dataInitialized) {
      const employeeCount = getAllEmployee.data.employees.length;
      if (isEditMode && singleSalary?.data) {
        initializeWithAllSalaryData(employeeCount);
      } else {
        initializeWithDefaults(employeeCount);
      }
      setDataInitialized(true);
    }
  }, [
    getAllEmployee?.data?.employees,
    singleSalary?.data,
    isEditMode,
    dataInitialized,
  ]);

  const initializeWithDefaults = (employeeCount) => {
    const newOvertimeHours = [];

    getAllEmployee.data.employees.forEach((employee) => {
      const summary = employee.overtimeSummary?.find(
        item => item.month === initialSelectedOption && item.year === parseInt(currentYear)
      );
      newOvertimeHours.push(summary ? parseFloat(summary.totalOvertime) : 0);
    });

    setSelectedOption(new Array(employeeCount).fill(initialSelectedOption));
    setSelectedYear(new Array(employeeCount).fill(currentYear));
    setBonus(new Array(employeeCount).fill(0));
    setOvertimeAmount(new Array(employeeCount).fill(0));
    setOvertimeHours(newOvertimeHours);
    setSalaryAmount(new Array(employeeCount).fill(0));
    setPreviousDue(new Array(employeeCount).fill(0));
    setSalaryCut(new Array(employeeCount).fill(0));
    setTotalPayment(new Array(employeeCount).fill(0));
    setAdvance(new Array(employeeCount).fill(0));
    setPay(new Array(employeeCount).fill(0));
    setDue(new Array(employeeCount).fill(0));
    setPaid(new Array(employeeCount).fill(false));
  };

  const initializeWithAllSalaryData = (employeeCount) => {
    try {
      const salariesArray = singleSalary.data;
      if (
        !salariesArray ||
        !Array.isArray(salariesArray) ||
        salariesArray.length === 0
      ) {
        console.error("No salary data found in salaries array");
        initializeWithDefaults(employeeCount);
        return;
      }
      const employees = getAllEmployee.data.employees;
      const monthArray = new Array(employeeCount).fill(initialSelectedOption);
      const yearArray = new Array(employeeCount).fill(currentYear);
      const bonusArray = new Array(employeeCount).fill(0);
      const overtimeAmountArray = new Array(employeeCount).fill(0);
      const overtimeHoursArray = [];
      const salaryAmountArray = new Array(employeeCount).fill(0);
      const previousDueArray = new Array(employeeCount).fill(0);
      const salaryCutArray = new Array(employeeCount).fill(0);
      const totalPaymentArray = new Array(employeeCount).fill(0);
      const advanceArray = new Array(employeeCount).fill(0);
      const payArray = new Array(employeeCount).fill(0);
      const dueArray = new Array(employeeCount).fill(0);
      const paidArray = new Array(employeeCount).fill(false);

      // Create a map for quick lookup of salary data by employee ID
      const salaryMap = {};
      salariesArray.forEach((salaryData) => {
        let employeeId = null;

        // Extract employee ID from different possible formats
        if (
          salaryData.employee &&
          typeof salaryData.employee === "object" &&
          salaryData.employee._id
        ) {
          employeeId = salaryData.employee._id;
        } else if (typeof salaryData.employee === "string") {
          employeeId = salaryData.employee;
        } else if (salaryData.employeeId) {
          // Find employee by employeeId if _id is not available
          const foundEmployee = employees.find(
            (emp) => emp.employeeId === salaryData.employeeId
          );
          employeeId = foundEmployee?._id;
        }

        if (employeeId) {
          salaryMap[employeeId] = salaryData;
        }
      });

      // Process each employee and set their salary data if available
      employees.forEach((employee, index) => {
        const salaryData = salaryMap[employee._id];
        if (salaryData) {
          monthArray[index] =
            salaryData.month_of_salary || initialSelectedOption;
          yearArray[index] = salaryData.year_of_salary || currentYear;
          bonusArray[index] = salaryData.bonus || 0;
          overtimeAmountArray[index] = salaryData.overtime_rate || 0;
          overtimeHoursArray[index] = salaryData.total_overtime || 0;
          salaryAmountArray[index] = salaryData.salary_amount || 0;
          previousDueArray[index] = salaryData.previous_due || 0;
          salaryCutArray[index] = salaryData.cut_salary || 0;
          totalPaymentArray[index] = salaryData.total_payment || 0;
          advanceArray[index] = salaryData.advance || 0;
          payArray[index] = salaryData.pay || 0;
          dueArray[index] = salaryData.due_amount || salaryData.due || 0;
          paidArray[index] = salaryData.payment_status === "completed";
        } else {
          // If no salary data, try to get from overtimeSummary
          const summary = employee.overtimeSummary?.find(
            item => item.month === initialSelectedOption && item.year === parseInt(currentYear)
          );
          overtimeHoursArray[index] = summary ? parseFloat(summary.totalOvertime) : 0;
        }
      });

      // Set all state arrays
      setSelectedOption(monthArray);
      setSelectedYear(yearArray);
      setBonus(bonusArray);
      setOvertimeAmount(overtimeAmountArray);
      setOvertimeHours(overtimeHoursArray);
      setSalaryAmount(salaryAmountArray);
      setPreviousDue(previousDueArray);
      setSalaryCut(salaryCutArray);
      setTotalPayment(totalPaymentArray);
      setAdvance(advanceArray);
      setPay(payArray);
      setDue(dueArray);
      setPaid(paidArray);
    } catch (error) {
      console.error("Error loading salary data:", error);
      toast.error("Error loading salary data");
      initializeWithDefaults(employeeCount);
    }
  };

  useEffect(() => {
    setDataInitialized(false);
  }, [id]);

  const handleEmployeeFilterChange = (event, newValue) => {
    setSelectedEmployees(newValue);
  };

  const clearEmployeeFilter = () => {
    setSelectedEmployees([]);
  };

  const getOriginalEmployeeIndex = (employee) => {
    return (
      getAllEmployee?.data?.employees?.findIndex(
        (emp) => emp._id === employee._id
      ) || 0
    );
  };

  const handleChange = (employee, value) => {
    const originalIndex = getOriginalEmployeeIndex(employee);
    const newMonth = [...selectedOption];
    newMonth[originalIndex] = value;
    setSelectedOption(newMonth);
  };

  const handleYearChange = (employee, value) => {
    const originalIndex = getOriginalEmployeeIndex(employee);
    const newYear = [...selectedYear];
    newYear[originalIndex] = value;
    setSelectedYear(newYear);
  };

  const handleBonus = (employee, value) => {
    const originalIndex = getOriginalEmployeeIndex(employee);
    const newBonus = [...bonus];
    newBonus[originalIndex] = Number.parseInt(value) || 0;
    setBonus(newBonus);
    updateTotalPayment(
      originalIndex,
      newBonus[originalIndex],
      overtimeAmount[originalIndex],
      salaryAmount[originalIndex],
      previousDue[originalIndex],
      salaryCut[originalIndex]
    );
  };
  const handleOvertimeAmount = (employee, value) => {
    const originalIndex = getOriginalEmployeeIndex(employee);
    const newOvertimeAmount = [...overtimeAmount];
    newOvertimeAmount[originalIndex] = Number.parseInt(value) || 0;
    setOvertimeAmount(newOvertimeAmount);
    updateTotalPayment(
      originalIndex,
      bonus[originalIndex],
      newOvertimeAmount[originalIndex],
      salaryAmount[originalIndex],
      previousDue[originalIndex],
      salaryCut[originalIndex]
    );
  };
  const handleSalaryAmount = (employee, value) => {
    const originalIndex = getOriginalEmployeeIndex(employee);
    const newSalaryAmount = [...salaryAmount];
    newSalaryAmount[originalIndex] = Number.parseInt(value) || 0;
    setSalaryAmount(newSalaryAmount);
    updateTotalPayment(
      originalIndex,
      bonus[originalIndex],
      overtimeAmount[originalIndex],
      newSalaryAmount[originalIndex],
      previousDue[originalIndex],
      salaryCut[originalIndex]
    );
  };
  const handleSalaryCut = (employee, value) => {
    const originalIndex = getOriginalEmployeeIndex(employee);
    const newSalaryCut = [...salaryCut];
    newSalaryCut[originalIndex] = Number.parseInt(value) || 0;
    setSalaryCut(newSalaryCut);
    updateTotalPayment(
      originalIndex,
      bonus[originalIndex],
      overtimeAmount[originalIndex],
      salaryAmount[originalIndex],
      previousDue[originalIndex],
      newSalaryCut[originalIndex]
    );
  };

  const calculateOvertimePayment = (hours, rate) => {
    return hours * rate;
  };

  const updateTotalPayment = (
    index,
    bonusVal,
    overtimeRate,
    salaryVal,
    previousDueVal,
    salaryCutVal
  ) => {
    const newTotalPayment = [...totalPayment];
    const overtimeHoursVal = getOvertimeHours(
      getAllEmployee?.data?.employees[index],
      index
    );
    const overtimePayment = calculateOvertimePayment(
      overtimeHoursVal,
      overtimeRate
    );
    newTotalPayment[index] =
      bonusVal + overtimePayment + salaryVal + previousDueVal - salaryCutVal;
    setTotalPayment(newTotalPayment);
    updateDue(index, newTotalPayment[index], advance[index], pay[index]);
  };

  const handleAdvance = (employee, value) => {
    const originalIndex = getOriginalEmployeeIndex(employee);
    const newAdvance = [...advance];
    newAdvance[originalIndex] = Number.parseInt(value) || 0;
    setAdvance(newAdvance);
    updateDue(
      originalIndex,
      totalPayment[originalIndex],
      newAdvance[originalIndex],
      pay[originalIndex]
    );
  };
  const handlePay = (employee, value) => {
    const originalIndex = getOriginalEmployeeIndex(employee);
    const newPay = [...pay];
    newPay[originalIndex] = Number.parseInt(value) || 0;
    setPay(newPay);
    updateDue(
      originalIndex,
      totalPayment[originalIndex],
      advance[originalIndex],
      newPay[originalIndex]
    );
  };
  const updateDue = (index, totalPaymentVal, advanceVal, payVal) => {
    const newDue = [...due];
    newDue[index] = totalPaymentVal - (advanceVal + payVal);
    setDue(newDue);
    const newPaid = [...paid];
    newPaid[index] = newDue[index] <= 0;
    setPaid(newPaid);
  };
  const getPaymentStatus = (totalPayment, paidAmount) => {
    if (paidAmount <= 0) return "pending";
    if (paidAmount >= totalPayment) return "completed";
    return "partial";
  };
  const handleSubmitSalary = async () => {
    performActionWithPermission("/dashboard/employee-salary", isEditMode ? "edit" : "create",
      async () => {
        if (isEditMode) {
          await handleUpdateAllSalaries();
        } else {
          await handleCreateSalary();
        }

      }, `You don't have permission to ${isEditMode ? 'edit' : 'create'} salary`
    );
  };

  const handleOvertimeHours = (employee, value) => {
    const originalIndex = getOriginalEmployeeIndex(employee);
    const newOvertimeHours = [...overtimeHours];
    newOvertimeHours[originalIndex] = Number.parseFloat(value) || 0;
    setOvertimeHours(newOvertimeHours);
    updateTotalPayment(
      originalIndex,
      bonus[originalIndex],
      overtimeAmount[originalIndex],
      salaryAmount[originalIndex],
      previousDue[originalIndex],
      salaryCut[originalIndex]
    );
  };

  const getOvertimeHours = (employee, index) => {
    // First check if we have a user-modified value in state
    if (overtimeHours[index] !== undefined && overtimeHours[index] !== null) {
      return overtimeHours[index];
    }

    // Then check for overtimeSummary data
    const selectedMonth = selectedOption[index];
    const selectedYearValue = parseInt(selectedYear[index]);

    // Find matching overtime summary
    const summary = employee.overtimeSummary?.find(
      item => item.month === selectedMonth && item.year === selectedYearValue
    );

    // Return value from summary if found, otherwise calculate from attendance
    if (summary) {
      return parseFloat(summary.totalOvertime);
    }

    return calculateOvertimeHours(employee);
  };

  const calculateOvertimeHours = (employee) => {
    let totalOvertime = 0;
    if (employee && employee.attendance && Array.isArray(employee.attendance)) {
      employee.attendance.forEach((attendanceRecord) => {
        if (
          attendanceRecord.overtime &&
          typeof attendanceRecord.overtime === "number"
        ) {
          totalOvertime += attendanceRecord.overtime;
        }
      });
    }
    return totalOvertime;
  };

  const getEmployeesWithSalaryData = () => {
    if (!isEditMode || !singleSalary?.data) return [];
    const salariesArray = singleSalary.data;
    const employees = getAllEmployee?.data?.employees || [];
    return salariesArray
      .map((salaryData) => {
        let targetEmployeeId = null;
        if (
          salaryData.employee &&
          typeof salaryData.employee === "object" &&
          salaryData.employee._id
        ) {
          targetEmployeeId = salaryData.employee._id;
        } else if (typeof salaryData.employee === "string") {
          targetEmployeeId = salaryData.employee;
        } else if (salaryData.employeeId) {
          const foundEmployee = employees.find(
            (emp) => emp.employeeId === salaryData.employeeId
          );
          targetEmployeeId = foundEmployee?._id;
        }
        return targetEmployeeId;
      })
      .filter(Boolean);
  };

  const handleCreateSalary = async () => {
    const newSalaryData =
      filteredEmployees?.map((employee, index) => {
        const originalIndex = getOriginalEmployeeIndex(employee);
        const overtimeHoursVal = getOvertimeHours(employee, originalIndex);
        const overtimeRate = overtimeAmount[originalIndex] || 0;
        const overtimePayment = calculateOvertimePayment(
          overtimeHoursVal,
          overtimeRate
        );
        const totalPaymentAmount = totalPayment[originalIndex] || 0;
        const paidAmount =
          (advance[originalIndex] || 0) + (pay[originalIndex] || 0);
        const dueAmount = totalPaymentAmount - paidAmount;
        const paymentStatus = getPaymentStatus(totalPaymentAmount, paidAmount);

        return {
          employee: employee._id,
          full_name: employee.full_name,
          employeeId: employee.employeeId,
          month_of_salary:
            selectedOption[originalIndex] || initialSelectedOption,
          year_of_salary: selectedYear[originalIndex] || currentYear,
          bonus: bonus[originalIndex] || 0,
          total_overtime: overtimeHoursVal,
          overtime_rate: overtimeRate,
          overtime_amount: overtimePayment,
          salary_amount: salaryAmount[originalIndex] || 0,
          previous_due: previousDue[originalIndex] || 0,
          cut_salary: salaryCut[originalIndex] || 0,
          total_payment: totalPaymentAmount,
          advance: advance[originalIndex] || 0,
          pay: pay[originalIndex] || 0,
          due: dueAmount,
          paid: paidAmount,
          paid_amount: paidAmount,
          due_amount: dueAmount,
          payment_status: paymentStatus,
        };
      }) || [];

    try {
      const response = await createSalary({
        tenantDomain,
        salaries: newSalaryData,
      }).unwrap();

      if (response.success) {
        toast.success(response.message);
        navigate("/dashboard/employee-salary");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleUpdateAllSalaries = async () => {
    try {
      const salariesArray = singleSalary.data;

      if (!salariesArray || !Array.isArray(salariesArray)) {
        toast.error("Invalid salary data structure");
        return;
      }

      const employees = getAllEmployee.data.employees;

      const updatePromises = salariesArray.map(async (salaryData) => {
        let targetEmployeeId = null;

        if (
          salaryData.employee &&
          typeof salaryData.employee === "object" &&
          salaryData.employee._id
        ) {
          targetEmployeeId = salaryData.employee._id;
        } else if (typeof salaryData.employee === "string") {
          targetEmployeeId = salaryData.employee;
        } else if (salaryData.employeeId) {
          const foundEmployee = employees.find(
            (emp) => emp.employeeId === salaryData.employeeId
          );
          targetEmployeeId = foundEmployee?._id;
        }

        if (!targetEmployeeId) {
          console.warn(
            "Could not find employee ID for salary record:",
            salaryData
          );
          return null;
        }

        const targetEmployeeIndex = employees.findIndex(
          (emp) => emp._id === targetEmployeeId
        );

        if (targetEmployeeIndex === -1) {
          console.warn("Employee not found for salary record:", salaryData);
          return null;
        }

        const totalPaymentAmount = totalPayment[targetEmployeeIndex] || 0;
        const paidAmount =
          (advance[targetEmployeeIndex] || 0) + (pay[targetEmployeeIndex] || 0);
        const dueAmount = totalPaymentAmount - paidAmount;
        const paymentStatus = getPaymentStatus(totalPaymentAmount, paidAmount);

        const updateData = {
          month_of_salary:
            selectedOption[targetEmployeeIndex] || initialSelectedOption,
          year_of_salary: selectedYear[targetEmployeeIndex] || currentYear,
          bonus: bonus[targetEmployeeIndex] || 0,
          total_overtime: getOvertimeHours(
            employees[targetEmployeeIndex],
            targetEmployeeIndex
          ),
          overtime_rate: overtimeAmount[targetEmployeeIndex] || 0,
          overtime_amount: calculateOvertimePayment(
            getOvertimeHours(
              employees[targetEmployeeIndex],
              targetEmployeeIndex
            ),
            overtimeAmount[targetEmployeeIndex] || 0
          ),
          salary_amount: salaryAmount[targetEmployeeIndex] || 0,
          previous_due: previousDue[targetEmployeeIndex] || 0,
          cut_salary: salaryCut[targetEmployeeIndex] || 0,
          total_payment: totalPaymentAmount,
          advance: advance[targetEmployeeIndex] || 0,
          pay: pay[targetEmployeeIndex] || 0,
          due: dueAmount,
          paid: paidAmount,
          paid_amount: paidAmount,
          due_amount: dueAmount,
          payment_status: paymentStatus,
        };

        return updateSalary({
          tenantDomain,
          id: salaryData._id,
          data: updateData,
        }).unwrap();
      });

      const results = await Promise.allSettled(updatePromises.filter(Boolean));

      const successCount = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const errorCount = results.filter(
        (result) => result.status === "rejected"
      ).length;

      if (successCount > 0) {
        toast.success(`Successfully updated ${successCount} salary record(s)`);
        navigate("/dashboard/employee-salary");
      }

      if (errorCount > 0) {
        toast.error(`Failed to update ${errorCount} salary record(s)`);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error) => {
    if (error.data && error.data.message) {
      toast.error(error.data.message);
    } else if (error.message) {
      toast.error(error.message);
    } else {
      toast.error(
        `An error occurred while ${isEditMode ? "updating" : "adding"} salary`
      );
    }
    if (
      error.data &&
      error.data.errorSources &&
      error.data.errorSources.length > 0
    ) {
      error.data.errorSources.forEach((errorSource) => {
        if (errorSource.message) {
          toast.error(errorSource.message);
        }
      });
    }
  };

  if (employeesLoading || (isEditMode && singleSalaryLoading)) {
    return <Loading />;
  }

  // Check if we have the required data
  if (!getAllEmployee?.data?.employees) {
    return (
      <Container maxWidth="7xl">
        <Alert severity="warning" sx={{ mt: 4 }}>
          No employee data available. Please ensure employees are loaded.
        </Alert>
      </Container>
    );
  }

  const employeesWithSalaryData = getEmployeesWithSalaryData();
  const tableCellStyle = {
    color: "white",
    fontWeight: "bold",
    width: "180px",
    backgroundColor: theme.palette.primary.main,
    position: "sticky",
    top: 0,
    zIndex: 1,
  };

  return (
    <Container maxWidth="7xl" sx={{ p: 0 }}>
      <Box sx={{ pt: 4, pb: 8, }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 1.5, md: 3 },
            mb: 4,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.background.paper})`,
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <MonetizationOn fontSize="large" color="primary" />
            </Grid>
            <Grid item xs>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {isEditMode
                  ? "Update Employee Salaries"
                  : "Employee Salary Management"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dashboard / Employee Salary {isEditMode ? "/ Update" : ""}
              </Typography>
              {isEditMode && singleSalary?.data && (
                <Chip
                  icon={<Edit />}
                  label={`Editing ${singleSalary.data.length} salary record(s)`}
                  color="warning"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>
            <Grid item>
              <Chip
                icon={isEditMode ? <Edit /> : <Add />}
                label={isEditMode ? "Edit Mode" : "Create Mode"}
                color={isEditMode ? "warning" : "primary"}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Employee Filter Section */}
        <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <FilterList color="primary" />
              </Grid>
              <Grid item xs={12} md={8}>
                <Autocomplete
                  multiple
                  id="employee-filter"
                  options={getAllEmployee?.data?.employees || []}
                  getOptionLabel={(option) =>
                    `${option.full_name} (${option.employeeId})`
                  }
                  value={selectedEmployees}
                  onChange={handleEmployeeFilterChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Filter Employees"
                      placeholder="Select employees to add salary for..."
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Group color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Avatar
                        sx={{ mr: 2, bgcolor: theme.palette.primary.main }}
                      >
                        {option.full_name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {option.full_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {option.employeeId}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option._id}
                        label={`${option.full_name} (${option.employeeId})`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  }
                  sx={{ minWidth: 300 }}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Clear />}
                  onClick={clearEmployeeFilter}
                  disabled={selectedEmployees.length === 0}
                >
                  Clear Filter
                </Button>
              </Grid>
              <Grid item>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing:
                  </Typography>
                  <Chip
                    label={`${filteredEmployees.length} of ${getAllEmployee?.data?.employees?.length || 0
                      } employees`}
                    size="small"
                    color={selectedEmployees.length > 0 ? "primary" : "default"}
                    variant="outlined"
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {isEditMode && singleSalary?.data && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You are editing{" "}
            <strong>{singleSalary.data.length} salary record(s)</strong> for{" "}
            <strong>
              {singleSalary.data[0]?.month_of_salary}{" "}
              {singleSalary.data[0]?.year_of_salary}
            </strong>
            . All loaded salary data will be updated.
          </Alert>
        )}

        {selectedEmployees.length > 0 && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Filter Active:</strong> You are working with{" "}
              {selectedEmployees.length} selected employee(s). Only these
              employees will be processed when you submit the form.
            </Typography>
          </Alert>
        )}

        <Card elevation={4} sx={{ mb: 4, borderRadius: 2, overflow: "auto" }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                "& .MuiTableCell-root": {
                  padding: "8px",
                  whiteSpace: "nowrap",
                },

                maxHeight: 600,
                overflow: "auto",
              }}
            >
              <Table sx={{ minWidth: 1400 }} stickyHeader>
                <TableHead>
                  <TableRow
                    sx={{ backgroundColor: theme.palette.primary.main }}
                  >
                    <TableCell sx={tableCellStyle}>Employee</TableCell>
                    <TableCell sx={tableCellStyle}>Employee ID</TableCell>
                    <TableCell sx={tableCellStyle}>Month of Salary</TableCell>
                    <TableCell sx={tableCellStyle}>Year</TableCell>
                    <TableCell sx={tableCellStyle}>Basic Amount</TableCell>
                    <TableCell sx={tableCellStyle}>Bonus</TableCell>
                    <TableCell sx={tableCellStyle}>Overtime Hours</TableCell>
                    <TableCell sx={tableCellStyle}>
                      Overtime Rate (per hour)
                    </TableCell>
                    <TableCell sx={tableCellStyle}>
                      Total Overtime Payment
                    </TableCell>
                    <TableCell sx={tableCellStyle}>Cut Salary</TableCell>
                    <TableCell sx={tableCellStyle}>Total Payment</TableCell>
                    <TableCell sx={tableCellStyle}>Advance</TableCell>
                    <TableCell sx={tableCellStyle}>Pay</TableCell>
                    <TableCell sx={tableCellStyle}>Due</TableCell>
                    <TableCell sx={tableCellStyle}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(filteredEmployees) &&
                    filteredEmployees?.map((employee) => {
                      const originalIndex = getOriginalEmployeeIndex(employee);
                      const overtimeHoursValue = getOvertimeHours(
                        employee,
                        originalIndex
                      );
                      const currentDue = due[originalIndex] || 0;
                      const currentPaid = paid[originalIndex];
                      const hasExistingSalaryData =
                        employeesWithSalaryData.includes(employee._id);

                      return (
                        <TableRow
                          key={employee._id}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: theme.palette.action.hover,
                            },
                            "&:hover": {
                              backgroundColor: theme.palette.action.selected,
                            },
                            ...(hasExistingSalaryData && {
                              backgroundColor:
                                theme.palette.success.light + "15",
                              border: `1px solid ${theme.palette.success.main}`,
                            }),
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Person color="primary" sx={{ mr: 1 }} />
                              <Typography variant="body2" fontWeight="medium">
                                {employee.full_name}
                                {hasExistingSalaryData && (
                                  <Chip
                                    size="small"
                                    label="HAS DATA"
                                    color="success"
                                    sx={{ ml: 1, fontSize: "0.7rem" }}
                                  />
                                )}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={employee.employeeId}
                              variant="outlined"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth size="small">
                              <InputLabel>Month</InputLabel>
                              <Select
                                value={
                                  selectedOption[originalIndex] ||
                                  initialSelectedOption
                                }
                                label="Month"
                                onChange={(e) =>
                                  handleChange(employee, e.target.value)
                                }
                                startAdornment={
                                  <InputAdornment position="start">
                                    <CalendarMonth fontSize="small" />
                                  </InputAdornment>
                                }
                              >
                                {allMonths.map((month) => (
                                  <MenuItem value={month} key={month}>
                                    {month}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth size="small">
                              <InputLabel>Year</InputLabel>
                              <Select
                                value={
                                  selectedYear[originalIndex] || currentYear
                                }
                                label="Year"
                                onChange={(e) =>
                                  handleYearChange(employee, e.target.value)
                                }
                              >
                                {years.slice(1).map((year) => (
                                  <MenuItem value={year.value} key={year.value}>
                                    {year.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              placeholder="0"
                              value={salaryAmount[originalIndex] || ""}
                              onChange={(e) =>
                                handleSalaryAmount(employee, e.target.value)
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      ৳
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                width: "120px",
                                "& input": {
                                  textAlign: "right",
                                  paddingRight: "8px",
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              placeholder="0"
                              value={bonus[originalIndex] || ""}
                              onChange={(e) =>
                                handleBonus(employee, e.target.value)
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      ৳
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                width: "120px",
                                "& input": {
                                  textAlign: "right",
                                  paddingRight: "8px",
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              placeholder="0"
                              label="Hours"
                              value={overtimeHoursValue}
                              onChange={(e) =>
                                handleOvertimeHours(employee, e.target.value)
                              }
                              inputProps={{
                                step: "0.5",
                                min: "0",
                                max: "24",
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <TimerOutlined fontSize="small" />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      hrs
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                              helperText="e.g., 5.5 for 5½ hours"
                              sx={{
                                width: "140px",
                                "& input": {
                                  textAlign: "center",
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              placeholder="0"
                              value={overtimeAmount[originalIndex] || ""}
                              onChange={(e) =>
                                handleOvertimeAmount(employee, e.target.value)
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      ৳
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                width: "120px",
                                "& input": {
                                  textAlign: "right",
                                  paddingRight: "8px",
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              placeholder="0"
                              value={calculateOvertimePayment(
                                getOvertimeHours(employee, originalIndex),
                                overtimeAmount[originalIndex] || 0
                              )}
                              InputProps={{
                                readOnly: true,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      ৳
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                width: "120px",
                                "& input": {
                                  textAlign: "right",
                                  paddingRight: "8px",
                                  fontWeight: "bold",
                                  color: theme.palette.info.main,
                                },
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              placeholder="0"
                              value={salaryCut[originalIndex] || ""}
                              onChange={(e) =>
                                handleSalaryCut(employee, e.target.value)
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      ৳
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                width: "120px",
                                "& input": {
                                  textAlign: "right",
                                  paddingRight: "8px",
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              placeholder="0"
                              value={totalPayment[originalIndex] || ""}
                              InputProps={{
                                readOnly: true,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      ৳
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                width: "120px",
                                "& input": {
                                  textAlign: "right",
                                  paddingRight: "8px",
                                  fontWeight: "bold",
                                  color: theme.palette.success.main,
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              placeholder="0"
                              value={advance[originalIndex] || ""}
                              onChange={(e) =>
                                handleAdvance(employee, e.target.value)
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      ৳
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                width: "120px",
                                "& input": {
                                  textAlign: "right",
                                  paddingRight: "8px",
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              placeholder="0"
                              value={pay[originalIndex] || ""}
                              onChange={(e) =>
                                handlePay(employee, e.target.value)
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      ৳
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                width: "120px",
                                "& input": {
                                  textAlign: "right",
                                  paddingRight: "8px",
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              placeholder="0"
                              value={due[originalIndex] || ""}
                              InputProps={{
                                readOnly: true,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      ৳
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                width: "120px",
                                "& input": {
                                  textAlign: "right",
                                  paddingRight: "8px",
                                  fontWeight: "bold",
                                  color:
                                    currentDue > 0
                                      ? theme.palette.error.main
                                      : theme.palette.success.main,
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              icon={
                                currentDue <= 0 ? <CheckCircle /> : <Warning />
                              }
                              label={currentDue <= 0 ? "Paid" : "Due"}
                              color={currentDue <= 0 ? "success" : "error"}
                              variant={currentDue <= 0 ? "filled" : "outlined"}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Can page='/dashboard/employee-salary' action={isEditMode ? "edit" : "add"}>
            <Button
              variant="contained"
              color={isEditMode ? "warning" : "primary"}
              size="large"
              disabled={createLoading || updateLoading}
              onClick={handleSubmitSalary}
              startIcon={isEditMode ? <Edit /> : <Save />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              {createLoading || updateLoading
                ? isEditMode
                  ? "Updating..."
                  : "Submitting..."
                : isEditMode
                  ? "Update All Salaries"
                  : `Submit Salary ${selectedEmployees.length > 0
                    ? `(${selectedEmployees.length} employees)`
                    : ""
                  }`}
            </Button>
          </Can>
        </Box>
      </Box>
    </Container>
  );
};

export default EmployeeSalaryForm;