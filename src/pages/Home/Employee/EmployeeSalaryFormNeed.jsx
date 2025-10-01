// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react/prop-types */
// /* eslint-disable react-refresh/only-export-components */
// /* eslint-disable no-unused-vars */
// "use client";

// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import "react-circular-progressbar/dist/styles.css";
// import "./Employee.css";
// import { useGetAllEmployeesQuery } from "../../../redux/api/employee";
// import {
//   useCreateSalaryMutation,
//   useGetSingleSalaryQuery,
//   useUpateSalaryMutation,
// } from "../../../redux/api/salary";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   Container,
//   FormControl,
//   Grid,
//   InputAdornment,
//   InputLabel,
//   MenuItem,
//   Paper,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
//   useTheme,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import {
//   CalendarMonth,
//   CheckCircle,
//   MonetizationOn,
//   Person,
//   Save,
//   TimerOutlined,
//   Warning,
//   Edit,
//   Add,
// } from "@mui/icons-material";
// import { allMonths } from "../../../utils/month";
// import { useLocation, useNavigate } from "react-router-dom";
// // import { TimePicker } from "@mui/x-date-pickers/TimePicker"
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
// // import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
// // import dayjs from "dayjs"

// // Constants
// const years = [{ value: "Select Year", label: "Select Year" }];
// for (let year = 2024; year <= 2030; year++) {
//   years.push({ value: String(year), label: String(year) });
// }

// const initialSelectedOption = allMonths[new Date().getMonth()];
// const currentYear = new Date().getFullYear().toString();

// const EmployeeSalaryForm = ({ tenantDomain }) => {
//   const theme = useTheme();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filterType, setFilterType] = useState(initialSelectedOption);
//   const limit = 100;
//   const location = useLocation();
//   const id = new URLSearchParams(location.search).get("id");
//   const navigate = useNavigate();
//   const isEditMode = Boolean(id);
//   const { data: getAllEmployee, isLoading: employeesLoading } =
//     useGetAllEmployeesQuery({
//       tenantDomain,
//       limit,
//       page: currentPage,
//     });

//   const {
//     data: singleSalary,
//     isLoading: singleSalaryLoading,
//     error: singleSalaryError,
//   } = useGetSingleSalaryQuery(id, {
//     skip: !id,
//   });
//   const [createSalary, { isLoading: createLoading, error: createError }] =
//     useCreateSalaryMutation();
//   const [updateSalary, { isLoading: updateLoading, error: updateError }] =
//     useUpateSalaryMutation();

//   const [selectedOption, setSelectedOption] = useState([]);
//   const [selectedYear, setSelectedYear] = useState([]);
//   const [bonus, setBonus] = useState([]);
//   const [overtimeHours, setOvertimeHours] = useState([]);
//   const [overtimeAmount, setOvertimeAmount] = useState([]);
//   const [salaryAmount, setSalaryAmount] = useState([]);
//   const [previousDue, setPreviousDue] = useState([]);
//   const [salaryCut, setSalaryCut] = useState([]);
//   const [totalPayment, setTotalPayment] = useState([]);
//   const [advance, setAdvance] = useState([]);
//   const [pay, setPay] = useState([]);
//   const [due, setDue] = useState([]);
//   const [paid, setPaid] = useState([]);

//   const [dataInitialized, setDataInitialized] = useState(false);

//   useEffect(() => {
//     if (getAllEmployee?.data?.employees && !dataInitialized) {
//       const employeeCount = getAllEmployee.data.employees.length;

//       if (isEditMode && singleSalary?.data) {
//         initializeWithAllSalaryData(employeeCount);
//       } else {
//         initializeWithDefaults(employeeCount);
//       }

//       setDataInitialized(true);
//     }
//   }, [
//     getAllEmployee?.data?.employees,
//     singleSalary?.data,
//     isEditMode,
//     dataInitialized,
//   ]);
//   const initializeWithDefaults = (employeeCount) => {
//     setSelectedOption(new Array(employeeCount).fill(initialSelectedOption));
//     setSelectedYear(new Array(employeeCount).fill(currentYear));
//     setBonus(new Array(employeeCount).fill(0));
//     setOvertimeAmount(new Array(employeeCount).fill(0));
//     setOvertimeHours(new Array(employeeCount).fill(0));
//     setSalaryAmount(new Array(employeeCount).fill(0));
//     setPreviousDue(new Array(employeeCount).fill(0));
//     setSalaryCut(new Array(employeeCount).fill(0));
//     setTotalPayment(new Array(employeeCount).fill(0));
//     setAdvance(new Array(employeeCount).fill(0));
//     setPay(new Array(employeeCount).fill(0));
//     setDue(new Array(employeeCount).fill(0));
//     setPaid(new Array(employeeCount).fill(false));
//   };

//   // Initialize with ALL salary data for edit mode
//   const initializeWithAllSalaryData = (employeeCount) => {
//     try {
//       const salariesArray = singleSalary.data?.salaries;

//       if (
//         !salariesArray ||
//         !Array.isArray(salariesArray) ||
//         salariesArray.length === 0
//       ) {
//         console.error("No salary data found in salaries array");
//         initializeWithDefaults(employeeCount);
//         return;
//       }

//       const employees = getAllEmployee.data.employees;

//       // Initialize arrays with default values
//       const monthArray = new Array(employeeCount).fill(initialSelectedOption);
//       const yearArray = new Array(employeeCount).fill(currentYear);
//       const bonusArray = new Array(employeeCount).fill(0);
//       const overtimeAmountArray = new Array(employeeCount).fill(0);
//       const overtimeHoursArray = new Array(employeeCount).fill(0);
//       const salaryAmountArray = new Array(employeeCount).fill(0);
//       const previousDueArray = new Array(employeeCount).fill(0);
//       const salaryCutArray = new Array(employeeCount).fill(0);
//       const totalPaymentArray = new Array(employeeCount).fill(0);
//       const advanceArray = new Array(employeeCount).fill(0);
//       const payArray = new Array(employeeCount).fill(0);
//       const dueArray = new Array(employeeCount).fill(0);
//       const paidArray = new Array(employeeCount).fill(false);

//       // Process ALL salary records and populate corresponding employee data
//       salariesArray.forEach((salaryData) => {
//         let targetEmployeeId = null;

//         if (
//           salaryData.employee &&
//           typeof salaryData.employee === "object" &&
//           salaryData.employee._id
//         ) {
//           targetEmployeeId = salaryData.employee._id;
//         } else if (typeof salaryData.employee === "string") {
//           targetEmployeeId = salaryData.employee;
//         } else if (salaryData.employeeId) {
//           const foundEmployee = employees.find(
//             (emp) => emp.employeeId === salaryData.employeeId
//           );
//           targetEmployeeId = foundEmployee?._id;
//         }

//         const targetEmployeeIndex = targetEmployeeId
//           ? employees.findIndex((emp) => emp._id === targetEmployeeId)
//           : -1;

//         // Set the specific employee's data if found
//         if (targetEmployeeIndex !== -1) {
//           monthArray[targetEmployeeIndex] =
//             salaryData.month_of_salary || initialSelectedOption;
//           yearArray[targetEmployeeIndex] =
//             salaryData.year_of_salary || currentYear;
//           bonusArray[targetEmployeeIndex] = salaryData.bonus || 0;
//           overtimeAmountArray[targetEmployeeIndex] =
//             salaryData.overtime_rate || salaryData.overtime_amount || 0;
//           overtimeHoursArray[targetEmployeeIndex] =
//             salaryData.total_overtime || 0;
//           salaryAmountArray[targetEmployeeIndex] =
//             salaryData.salary_amount || 0;
//           previousDueArray[targetEmployeeIndex] = salaryData.previous_due || 0;
//           salaryCutArray[targetEmployeeIndex] = salaryData.cut_salary || 0;
//           totalPaymentArray[targetEmployeeIndex] =
//             salaryData.total_payment || 0;
//           advanceArray[targetEmployeeIndex] = salaryData.advance || 0;
//           payArray[targetEmployeeIndex] = salaryData.pay || 0;
//           dueArray[targetEmployeeIndex] =
//             salaryData.due_amount || salaryData.due || 0;
//           paidArray[targetEmployeeIndex] =
//             salaryData.payment_status === "completed";
//         } else {
//           console.warn(`Employee not found for salary data:`, salaryData);
//         }
//       });

//       // Set all state arrays
//       setSelectedOption(monthArray);
//       setSelectedYear(yearArray);
//       setBonus(bonusArray);
//       setOvertimeAmount(overtimeAmountArray);
//       setOvertimeHours(overtimeHoursArray);
//       setSalaryAmount(salaryAmountArray);
//       setPreviousDue(previousDueArray);
//       setSalaryCut(salaryCutArray);
//       setTotalPayment(totalPaymentArray);
//       setAdvance(advanceArray);
//       setPay(payArray);
//       setDue(dueArray);
//       setPaid(paidArray);
//     } catch (error) {
//       console.error("Error initializing with salary data:", error);
//       toast.error("Error loading salary data");
//       initializeWithDefaults(employeeCount);
//     }
//   };

//   useEffect(() => {
//     setDataInitialized(false);
//   }, [id]);

//   const handleChange = (index, value) => {
//     const newMonth = [...selectedOption];
//     newMonth[index] = value;
//     setSelectedOption(newMonth);
//   };

//   const handleYearChange = (index, value) => {
//     const newYear = [...selectedYear];
//     newYear[index] = value;
//     setSelectedYear(newYear);
//   };

//   const handleBonus = (index, value) => {
//     const newBonus = [...bonus];
//     newBonus[index] = Number.parseInt(value) || 0;
//     setBonus(newBonus);
//     updateTotalPayment(
//       index,
//       newBonus[index],
//       overtimeAmount[index],
//       salaryAmount[index],
//       previousDue[index],
//       salaryCut[index]
//     );
//   };

//   const handleOvertimeAmount = (index, value) => {
//     const newOvertimeAmount = [...overtimeAmount];
//     newOvertimeAmount[index] = Number.parseInt(value) || 0;
//     setOvertimeAmount(newOvertimeAmount);
//     updateTotalPayment(
//       index,
//       bonus[index],
//       newOvertimeAmount[index],
//       salaryAmount[index],
//       previousDue[index],
//       salaryCut[index]
//     );
//   };

//   const handleSalaryAmount = (index, value) => {
//     const newSalaryAmount = [...salaryAmount];
//     newSalaryAmount[index] = Number.parseInt(value) || 0;
//     setSalaryAmount(newSalaryAmount);
//     updateTotalPayment(
//       index,
//       bonus[index],
//       overtimeAmount[index],
//       newSalaryAmount[index],
//       previousDue[index],
//       salaryCut[index]
//     );
//   };

//   const handlePreviousDue = (index, value) => {
//     const newPreviousDue = [...previousDue];
//     newPreviousDue[index] = Number.parseInt(value) || 0;
//     setPreviousDue(newPreviousDue);
//     updateTotalPayment(
//       index,
//       bonus[index],
//       overtimeAmount[index],
//       salaryAmount[index],
//       newPreviousDue[index],
//       salaryCut[index]
//     );
//   };

//   const handleSalaryCut = (index, value) => {
//     const newSalaryCut = [...salaryCut];
//     newSalaryCut[index] = Number.parseInt(value) || 0;
//     setSalaryCut(newSalaryCut);
//     updateTotalPayment(
//       index,
//       bonus[index],
//       overtimeAmount[index],
//       salaryAmount[index],
//       previousDue[index],
//       newSalaryCut[index]
//     );
//   };

//   const calculateOvertimePayment = (hours, rate) => {
//     return hours * rate;
//   };

//   const updateTotalPayment = (
//     index,
//     bonusVal,
//     overtimeRate,
//     salaryVal,
//     previousDueVal,
//     salaryCutVal
//   ) => {
//     const newTotalPayment = [...totalPayment];
//     const overtimeHoursVal = getOvertimeHours(
//       getAllEmployee?.data?.employees[index],
//       index
//     );
//     const overtimePayment = calculateOvertimePayment(
//       overtimeHoursVal,
//       overtimeRate
//     );

//     newTotalPayment[index] =
//       bonusVal + overtimePayment + salaryVal + previousDueVal - salaryCutVal;
//     setTotalPayment(newTotalPayment);
//     updateDue(index, newTotalPayment[index], advance[index], pay[index]);
//   };

//   const handleAdvance = (index, value) => {
//     const newAdvance = [...advance];
//     newAdvance[index] = Number.parseInt(value) || 0;
//     setAdvance(newAdvance);
//     updateDue(index, totalPayment[index], newAdvance[index], pay[index]);
//   };

//   const handlePay = (index, value) => {
//     const newPay = [...pay];
//     newPay[index] = Number.parseInt(value) || 0;
//     setPay(newPay);
//     updateDue(index, totalPayment[index], advance[index], newPay[index]);
//   };

//   const updateDue = (index, totalPaymentVal, advanceVal, payVal) => {
//     const newDue = [...due];
//     newDue[index] = totalPaymentVal - (advanceVal + payVal);
//     setDue(newDue);

//     const newPaid = [...paid];
//     newPaid[index] = newDue[index] <= 0;
//     setPaid(newPaid);
//   };

//   const handlePaid = (index, value) => {
//     const newPaid = [...paid];
//     newPaid[index] = value === "true";
//     setPaid(newPaid);
//   };

//   const handleDue = (index, value) => {
//     const newDue = [...due];
//     newDue[index] = Number.parseInt(value) || 0;
//     setDue(newDue);
//   };
//   const getPaymentStatus = (totalPayment, paidAmount) => {
//     if (paidAmount <= 0) return "pending";
//     if (paidAmount >= totalPayment) return "completed";
//     return "partial";
//   };

//   const handleSubmitSalary = async () => {
//     if (isEditMode) {
//       await handleUpdateAllSalaries();
//     } else {
//       await handleCreateSalary();
//     }
//   };

//   const handleOvertimeHours = (index, value) => {
//     const newOvertimeHours = [...overtimeHours];
//     newOvertimeHours[index] = Number.parseFloat(value) || 0;
//     setOvertimeHours(newOvertimeHours);

//     // Recalculate total payment when overtime hours change
//     updateTotalPayment(
//       index,
//       bonus[index],
//       overtimeAmount[index],
//       salaryAmount[index],
//       previousDue[index],
//       salaryCut[index]
//     );
//   };

//   const getOvertimeHours = (employee, index) => {
//     if (overtimeHours[index] !== undefined && overtimeHours[index] !== null) {
//       return overtimeHours[index];
//     }
//     return calculateOvertimeHours(employee);
//   };

// const handleCreateSalary = async () => {
//   const newSalaryData = getAllEmployee?.data?.employees?.map((employee, index) => {
//     const overtimeHoursVal = getOvertimeHours(employee, index);
//     const overtimePayment = calculateOvertimePayment(overtimeHoursVal, overtimeAmount[index] || 0);
//     const totalPaymentAmount = totalPayment[index] || 0;
//     const paidAmount = (advance[index] || 0) + (pay[index] || 0);
//     const dueAmount = totalPaymentAmount - paidAmount;
//     const paymentStatus = getPaymentStatus(totalPaymentAmount, paidAmount);

//     return {
//       employee: employee._id,
//       full_name: employee.full_name,
//       employeeId: employee.employeeId,
//       month_of_salary: selectedOption[index] || initialSelectedOption,
//       year_of_salary: selectedYear[index] || currentYear,
//       bonus: bonus[index] || 0,
//       total_overtime: overtimeHoursVal,
//       overtime_rate: overtimeAmount[index] || 0,
//       overtime_amount: overtimePayment,
//       salary_amount: salaryAmount[index] || 0,
//       previous_due: previousDue[index] || 0,
//       cut_salary: salaryCut[index] || 0,
//       total_payment: totalPaymentAmount,
//       advance: advance[index] || 0,
//       pay: pay[index] || 0,
//       due: dueAmount,
//       paid: paidAmount,
//       paid_amount: paidAmount,
//       due_amount: dueAmount,
//       payment_status: paymentStatus,
//     };
//   }) || [];

//   try {
//     const response = await createSalary({
//       tenantDomain,
//       salaries: newSalaryData, // ✅ correctly wrapped
//     }).unwrap();

//     if (response.success) {
//       toast.success(response.message);
//       navigate("/dashboard/employee-salary");
//     }
//   } catch (error) {
//     handleApiError(error);
//   }
// };


//   const handleUpdateAllSalaries = async () => {
//     try {
//       const salariesArray = singleSalary.data?.salaries;

//       if (!salariesArray || !Array.isArray(salariesArray)) {
//         toast.error("Invalid salary data structure");
//         return;
//       }

//       const employees = getAllEmployee.data.employees;

//       const updatePromises = salariesArray.map(async (salaryData) => {
//         let targetEmployeeId = null;

//         if (
//           salaryData.employee &&
//           typeof salaryData.employee === "object" &&
//           salaryData.employee._id
//         ) {
//           targetEmployeeId = salaryData.employee._id;
//         } else if (typeof salaryData.employee === "string") {
//           targetEmployeeId = salaryData.employee;
//         } else if (salaryData.employeeId) {
//           const foundEmployee = employees.find(
//             (emp) => emp.employeeId === salaryData.employeeId
//           );
//           targetEmployeeId = foundEmployee?._id;
//         }

//         const targetEmployeeIndex = targetEmployeeId
//           ? employees.findIndex((emp) => emp._id === targetEmployeeId)
//           : -1;

//         if (targetEmployeeIndex === -1) {
//           return null;
//         }

//         const totalPaymentAmount = totalPayment[targetEmployeeIndex] || 0;
//         const paidAmount =
//           (advance[targetEmployeeIndex] || 0) + (pay[targetEmployeeIndex] || 0);
//         const dueAmount = totalPaymentAmount - paidAmount;
//         const paymentStatus = getPaymentStatus(totalPaymentAmount, paidAmount);

//         const updateData = {
//           month_of_salary:
//             selectedOption[targetEmployeeIndex] || initialSelectedOption,
//           year_of_salary: selectedYear[targetEmployeeIndex] || currentYear,
//           bonus: bonus[targetEmployeeIndex] || 0,
//           total_overtime: getOvertimeHours(
//             employees[targetEmployeeIndex],
//             targetEmployeeIndex
//           ),
//           overtime_rate: overtimeAmount[targetEmployeeIndex] || 0,
//           overtime_amount: calculateOvertimePayment(
//             getOvertimeHours(
//               employees[targetEmployeeIndex],
//               targetEmployeeIndex
//             ),
//             overtimeAmount[targetEmployeeIndex] || 0
//           ),
//           salary_amount: salaryAmount[targetEmployeeIndex] || 0,
//           previous_due: previousDue[targetEmployeeIndex] || 0,
//           cut_salary: salaryCut[targetEmployeeIndex] || 0,
//           total_payment: totalPaymentAmount,
//           advance: advance[targetEmployeeIndex] || 0,
//           pay: pay[targetEmployeeIndex] || 0,
//           due: dueAmount,
//           paid: paidAmount,
//           paid_amount: paidAmount,
//           due_amount: dueAmount,
//           payment_status: paymentStatus,
//         };

//         return updateSalary({
//           tenantDomain,
//           id: salaryData._id,
//           data: updateData,
//         }).unwrap();
//       });

//       const results = await Promise.allSettled(updatePromises.filter(Boolean));

//       const successCount = results.filter(
//         (result) => result.status === "fulfilled"
//       ).length;
//       const errorCount = results.filter(
//         (result) => result.status === "rejected"
//       ).length;

//       if (successCount > 0) {
//         toast.success(`Successfully updated ${successCount} salary record(s)`);
//         navigate("/dashboard/employee-salary");
//       }

//       if (errorCount > 0) {
//         toast.error(`Failed to update ${errorCount} salary record(s)`);
//       }
//     } catch (error) {
//       handleApiError(error);
//     }
//   };

//   const handleApiError = (error) => {
//     if (error.data && error.data.message) {
//       toast.error(error.data.message);
//     } else if (error.message) {
//       toast.error(error.message);
//     } else {
//       toast.error(
//         `An error occurred while ${isEditMode ? "updating" : "adding"} salary`
//       );
//     }

//     if (
//       error.data &&
//       error.data.errorSources &&
//       error.data.errorSources.length > 0
//     ) {
//       error.data.errorSources.forEach((errorSource) => {
//         if (errorSource.message) {
//           toast.error(errorSource.message);
//         }
//       });
//     }
//   };

//   const calculateOvertimeHours = (employee) => {
//     let totalOvertime = 0;
//     if (employee && employee.attendance && Array.isArray(employee.attendance)) {
//       employee.attendance.forEach((attendanceRecord) => {
//         if (
//           attendanceRecord.overtime &&
//           typeof attendanceRecord.overtime === "number"
//         ) {
//           totalOvertime += attendanceRecord.overtime;
//         }
//       });
//     }
//     return totalOvertime;
//   };

//   const getEmployeesWithSalaryData = () => {
//     if (!isEditMode || !singleSalary?.data?.salaries) return [];

//     const salariesArray = singleSalary.data.salaries;
//     const employees = getAllEmployee?.data?.employees || [];

//     return salariesArray
//       .map((salaryData) => {
//         let targetEmployeeId = null;

//         if (
//           salaryData.employee &&
//           typeof salaryData.employee === "object" &&
//           salaryData.employee._id
//         ) {
//           targetEmployeeId = salaryData.employee._id;
//         } else if (typeof salaryData.employee === "string") {
//           targetEmployeeId = salaryData.employee;
//         } else if (salaryData.employeeId) {
//           const foundEmployee = employees.find(
//             (emp) => emp.employeeId === salaryData.employeeId
//           );
//           targetEmployeeId = foundEmployee?._id;
//         }

//         return targetEmployeeId;
//       })
//       .filter(Boolean);
//   };

//   if (employeesLoading || (isEditMode && singleSalaryLoading)) {
//     return (
//       <Container maxWidth="7xl">
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             minHeight: "400px",
//           }}
//         >
//           <CircularProgress size={60} />
//         </Box>
//       </Container>
//     );
//   }

//   // Error state for single salary
//   if (isEditMode && singleSalaryError) {
//     return (
//       <Container maxWidth="7xl">
//         <Alert severity="error" sx={{ mt: 4 }}>
//           Error loading salary data. Please try again.
//         </Alert>
//       </Container>
//     );
//   }

//   // Check if we have the required data
//   if (!getAllEmployee?.data?.employees) {
//     return (
//       <Container maxWidth="7xl">
//         <Alert severity="warning" sx={{ mt: 4 }}>
//           No employee data available. Please ensure employees are loaded.
//         </Alert>
//       </Container>
//     );
//   }

//   const employeesWithSalaryData = getEmployeesWithSalaryData();

//   return (
//     <Container maxWidth="7xl">
//       <Box sx={{ pt: 4, pb: 8 }}>
//         <Paper
//           elevation={3}
//           sx={{
//             p: 3,
//             mb: 4,
//             borderRadius: 2,
//             background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.background.paper})`,
//           }}
//         >
//           <Grid container alignItems="center" spacing={2}>
//             <Grid item>
//               <MonetizationOn fontSize="large" color="primary" />
//             </Grid>
//             <Grid item xs>
//               <Typography variant="h4" fontWeight="bold" color="primary">
//                 {isEditMode
//                   ? "Update Employee Salaries"
//                   : "Employee Salary Management"}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Dashboard / Employee Salary {isEditMode ? "/ Update" : ""}
//               </Typography>
//               {isEditMode && singleSalary?.data?.salaries && (
//                 <Chip
//                   icon={<Edit />}
//                   label={`Editing ${singleSalary.data.salaries.length} salary record(s)`}
//                   color="warning"
//                   variant="outlined"
//                   sx={{ mt: 1 }}
//                 />
//               )}
//             </Grid>
//             <Grid item>
//               <Chip
//                 icon={isEditMode ? <Edit /> : <Add />}
//                 label={isEditMode ? "Edit Mode" : "Create Mode"}
//                 color={isEditMode ? "warning" : "primary"}
//                 variant="outlined"
//               />
//             </Grid>
//           </Grid>
//         </Paper>

//         {isEditMode && singleSalary?.data?.salaries && (
//           <Alert severity="info" sx={{ mb: 3 }}>
//             You are editing{" "}
//             <strong>
//               {singleSalary.data.salaries.length} salary record(s)
//             </strong>{" "}
//             for{" "}
//             <strong>
//               {singleSalary.data.salaries[0]?.month_of_salary}{" "}
//               {singleSalary.data.salaries[0]?.year_of_salary}
//             </strong>
//             . All loaded salary data will be updated.
//           </Alert>
//         )}

//         <Card elevation={4} sx={{ mb: 4, borderRadius: 2, overflow: "auto" }}>
//           <CardContent sx={{ p: 0 }}>
//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 "& .MuiTableCell-root": {
//                   padding: "8px",
//                   whiteSpace: "nowrap",
//                 },
//               }}
//             >
//               <Table sx={{ minWidth: 1400 }}>
//                 <TableHead>
//                   <TableRow
//                     sx={{ backgroundColor: theme.palette.primary.main }}
//                   >
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "180px",
//                       }}
//                     >
//                       Employee
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "120px",
//                       }}
//                     >
//                       Employee ID
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "150px",
//                       }}
//                     >
//                       Month of Salary
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "120px",
//                       }}
//                     >
//                       Year
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "120px",
//                       }}
//                     >
//                       Salary Amount
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "120px",
//                       }}
//                     >
//                       Bonus
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "140px",
//                       }}
//                     >
//                       Overtime Hours
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "120px",
//                       }}
//                     >
//                       Overtime Rate (per hour)
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "120px",
//                       }}
//                     >
//                       Total Overtime Payment
//                     </TableCell>

//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "120px",
//                       }}
//                     >
//                       Previous Due
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "120px",
//                       }}
//                     >
//                       Cut Salary
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "120px",
//                       }}
//                     >
//                       Total Payment
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "120px",
//                       }}
//                     >
//                       Advance
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "120px",
//                       }}
//                     >
//                       Pay
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "120px",
//                       }}
//                     >
//                       Due
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         width: "120px",
//                       }}
//                     >
//                       Status
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {Array.isArray(getAllEmployee?.data?.employees) &&
//                     getAllEmployee?.data?.employees?.map((employee, index) => {
//                       const overtimeHoursValue = getOvertimeHours(
//                         employee,
//                         index
//                       );
//                       const currentDue = due[index] || 0;
//                       const currentPaid = paid[index];

//                       // Highlight the row if this employee has salary data
//                       const hasExistingSalaryData =
//                         employeesWithSalaryData.includes(employee._id);

//                       return (
//                         <TableRow
//                           key={employee._id}
//                           sx={{
//                             "&:nth-of-type(odd)": {
//                               backgroundColor: theme.palette.action.hover,
//                             },
//                             "&:hover": {
//                               backgroundColor: theme.palette.action.selected,
//                             },
//                             ...(hasExistingSalaryData && {
//                               backgroundColor:
//                                 theme.palette.success.light + "15",
//                               border: `1px solid ${theme.palette.success.main}`,
//                             }),
//                           }}
//                         >
//                           <TableCell>
//                             <Box sx={{ display: "flex", alignItems: "center" }}>
//                               <Person color="primary" sx={{ mr: 1 }} />
//                               <Typography variant="body2" fontWeight="medium">
//                                 {employee.full_name}
//                                 {hasExistingSalaryData && (
//                                   <Chip
//                                     size="small"
//                                     label="HAS DATA"
//                                     color="success"
//                                     sx={{ ml: 1, fontSize: "0.7rem" }}
//                                   />
//                                 )}
//                               </Typography>
//                             </Box>
//                           </TableCell>

//                           <TableCell>
//                             <Chip
//                               size="small"
//                               label={employee.employeeId}
//                               variant="outlined"
//                               color="primary"
//                             />
//                           </TableCell>

//                           <TableCell>
//                             <FormControl fullWidth size="small">
//                               <InputLabel>Month</InputLabel>
//                               <Select
//                                 value={
//                                   selectedOption[index] || initialSelectedOption
//                                 }
//                                 label="Month"
//                                 onChange={(e) =>
//                                   handleChange(index, e.target.value)
//                                 }
//                                 startAdornment={
//                                   <InputAdornment position="start">
//                                     <CalendarMonth fontSize="small" />
//                                   </InputAdornment>
//                                 }
//                               >
//                                 {allMonths.map((month) => (
//                                   <MenuItem value={month} key={month}>
//                                     {month}
//                                   </MenuItem>
//                                 ))}
//                               </Select>
//                             </FormControl>
//                           </TableCell>

//                           <TableCell>
//                             <FormControl fullWidth size="small">
//                               <InputLabel>Year</InputLabel>
//                               <Select
//                                 value={selectedYear[index] || currentYear}
//                                 label="Year"
//                                 onChange={(e) =>
//                                   handleYearChange(index, e.target.value)
//                                 }
//                               >
//                                 {years.slice(1).map((year) => (
//                                   <MenuItem value={year.value} key={year.value}>
//                                     {year.label}
//                                   </MenuItem>
//                                 ))}
//                               </Select>
//                             </FormControl>
//                           </TableCell>
//                           <TableCell>
//                             <TextField
//                               size="small"
//                               type="number"
//                               placeholder="0"
//                               value={salaryAmount[index] || ""}
//                               onChange={(e) =>
//                                 handleSalaryAmount(index, e.target.value)
//                               }
//                               InputProps={{
//                                 startAdornment: (
//                                   <InputAdornment position="start">
//                                     <Typography
//                                       variant="body2"
//                                       fontWeight="medium"
//                                     >
//                                       ৳
//                                     </Typography>
//                                   </InputAdornment>
//                                 ),
//                               }}
//                               sx={{
//                                 width: "120px",
//                                 "& input": {
//                                   textAlign: "right",
//                                   paddingRight: "8px",
//                                 },
//                               }}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <TextField
//                               size="small"
//                               type="number"
//                               placeholder="0"
//                               value={bonus[index] || ""}
//                               onChange={(e) =>
//                                 handleBonus(index, e.target.value)
//                               }
//                               InputProps={{
//                                 startAdornment: (
//                                   <InputAdornment position="start">
//                                     <Typography
//                                       variant="body2"
//                                       fontWeight="medium"
//                                     >
//                                       ৳
//                                     </Typography>
//                                   </InputAdornment>
//                                 ),
//                               }}
//                               sx={{
//                                 width: "120px",
//                                 "& input": {
//                                   textAlign: "right",
//                                   paddingRight: "8px",
//                                 },
//                               }}
//                             />
//                           </TableCell>

//                           <TableCell>
//                             <TextField
//                               size="small"
//                               type="number"
//                               placeholder="0"
//                               label="Hours"
//                               value={overtimeHours[index] || ""}
//                               onChange={(e) =>
//                                 handleOvertimeHours(index, e.target.value)
//                               }
//                               inputProps={{
//                                 step: "0.5",
//                                 min: "0",
//                                 max: "24",
//                               }}
//                               InputProps={{
//                                 startAdornment: (
//                                   <InputAdornment position="start">
//                                     <TimerOutlined fontSize="small" />
//                                   </InputAdornment>
//                                 ),
//                                 endAdornment: (
//                                   <InputAdornment position="end">
//                                     <Typography
//                                       variant="caption"
//                                       color="text.secondary"
//                                     >
//                                       hrs
//                                     </Typography>
//                                   </InputAdornment>
//                                 ),
//                               }}
//                               helperText="e.g., 5.5 for 5½ hours"
//                               sx={{
//                                 width: "140px",
//                                 "& input": {
//                                   textAlign: "center",
//                                 },
//                               }}
//                             />
//                           </TableCell>

//                           <TableCell>
//                             <TextField
//                               size="small"
//                               type="number"
//                               placeholder="0"
//                               value={overtimeAmount[index] || ""}
//                               onChange={(e) =>
//                                 handleOvertimeAmount(index, e.target.value)
//                               }
//                               InputProps={{
//                                 startAdornment: (
//                                   <InputAdornment position="start">
//                                     <Typography
//                                       variant="body2"
//                                       fontWeight="medium"
//                                     >
//                                       ৳
//                                     </Typography>
//                                   </InputAdornment>
//                                 ),
//                               }}
//                               sx={{
//                                 width: "120px",
//                                 "& input": {
//                                   textAlign: "right",
//                                   paddingRight: "8px",
//                                 },
//                               }}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <TextField
//                               size="small"
//                               type="number"
//                               placeholder="0"
//                               value={calculateOvertimePayment(
//                                 getOvertimeHours(employee, index),
//                                 overtimeAmount[index] || 0
//                               )}
//                               InputProps={{
//                                 readOnly: true,
//                                 startAdornment: (
//                                   <InputAdornment position="start">
//                                     <Typography
//                                       variant="body2"
//                                       fontWeight="medium"
//                                     >
//                                       ৳
//                                     </Typography>
//                                   </InputAdornment>
//                                 ),
//                               }}
//                               sx={{
//                                 width: "120px",
//                                 "& input": {
//                                   textAlign: "right",
//                                   paddingRight: "8px",
//                                   fontWeight: "bold",
//                                   color: theme.palette.info.main,
//                                 },
//                               }}
//                             />
//                           </TableCell>

//                           <TableCell>
//                             <TextField
//                               size="small"
//                               type="number"
//                               placeholder="0"
//                               value={previousDue[index] || ""}
//                               onChange={(e) =>
//                                 handlePreviousDue(index, e.target.value)
//                               }
//                               InputProps={{
//                                 startAdornment: (
//                                   <InputAdornment position="start">
//                                     <Typography
//                                       variant="body2"
//                                       fontWeight="medium"
//                                     >
//                                       ৳
//                                     </Typography>
//                                   </InputAdornment>
//                                 ),
//                               }}
//                               sx={{
//                                 width: "120px",
//                                 "& input": {
//                                   textAlign: "right",
//                                   paddingRight: "8px",
//                                 },
//                               }}
//                             />
//                           </TableCell>

//                           <TableCell>
//                             <TextField
//                               size="small"
//                               type="number"
//                               placeholder="0"
//                               value={salaryCut[index] || ""}
//                               onChange={(e) =>
//                                 handleSalaryCut(index, e.target.value)
//                               }
//                               InputProps={{
//                                 startAdornment: (
//                                   <InputAdornment position="start">
//                                     <Typography
//                                       variant="body2"
//                                       fontWeight="medium"
//                                     >
//                                       ৳
//                                     </Typography>
//                                   </InputAdornment>
//                                 ),
//                               }}
//                               sx={{
//                                 width: "120px",
//                                 "& input": {
//                                   textAlign: "right",
//                                   paddingRight: "8px",
//                                 },
//                               }}
//                             />
//                           </TableCell>

//                           <TableCell>
//                             <TextField
//                               size="small"
//                               type="number"
//                               placeholder="0"
//                               value={totalPayment[index] || ""}
//                               InputProps={{
//                                 readOnly: true,
//                                 startAdornment: (
//                                   <InputAdornment position="start">
//                                     <Typography
//                                       variant="body2"
//                                       fontWeight="medium"
//                                     >
//                                       ৳
//                                     </Typography>
//                                   </InputAdornment>
//                                 ),
//                               }}
//                               sx={{
//                                 width: "120px",
//                                 "& input": {
//                                   textAlign: "right",
//                                   paddingRight: "8px",
//                                   fontWeight: "bold",
//                                   color: theme.palette.success.main,
//                                 },
//                               }}
//                             />
//                           </TableCell>

//                           <TableCell>
//                             <TextField
//                               size="small"
//                               type="number"
//                               placeholder="0"
//                               value={advance[index] || ""}
//                               onChange={(e) =>
//                                 handleAdvance(index, e.target.value)
//                               }
//                               InputProps={{
//                                 startAdornment: (
//                                   <InputAdornment position="start">
//                                     <Typography
//                                       variant="body2"
//                                       fontWeight="medium"
//                                     >
//                                       ৳
//                                     </Typography>
//                                   </InputAdornment>
//                                 ),
//                               }}
//                               sx={{
//                                 width: "120px",
//                                 "& input": {
//                                   textAlign: "right",
//                                   paddingRight: "8px",
//                                 },
//                               }}
//                             />
//                           </TableCell>

//                           <TableCell>
//                             <TextField
//                               size="small"
//                               type="number"
//                               placeholder="0"
//                               value={pay[index] || ""}
//                               onChange={(e) => handlePay(index, e.target.value)}
//                               InputProps={{
//                                 startAdornment: (
//                                   <InputAdornment position="start">
//                                     <Typography
//                                       variant="body2"
//                                       fontWeight="medium"
//                                     >
//                                       ৳
//                                     </Typography>
//                                   </InputAdornment>
//                                 ),
//                               }}
//                               sx={{
//                                 width: "120px",
//                                 "& input": {
//                                   textAlign: "right",
//                                   paddingRight: "8px",
//                                 },
//                               }}
//                             />
//                           </TableCell>

//                           <TableCell>
//                             <TextField
//                               size="small"
//                               type="number"
//                               placeholder="0"
//                               value={due[index] || ""}
//                               InputProps={{
//                                 readOnly: true,
//                                 startAdornment: (
//                                   <InputAdornment position="start">
//                                     <Typography
//                                       variant="body2"
//                                       fontWeight="medium"
//                                     >
//                                       ৳
//                                     </Typography>
//                                   </InputAdornment>
//                                 ),
//                               }}
//                               sx={{
//                                 width: "120px",
//                                 "& input": {
//                                   textAlign: "right",
//                                   paddingRight: "8px",
//                                   fontWeight: "bold",
//                                   color:
//                                     currentDue > 0
//                                       ? theme.palette.error.main
//                                       : theme.palette.success.main,
//                                 },
//                               }}
//                             />
//                           </TableCell>

//                           <TableCell>
//                             <Chip
//                               size="small"
//                               icon={
//                                 currentDue <= 0 ? <CheckCircle /> : <Warning />
//                               }
//                               label={currentDue <= 0 ? "Paid" : "Due"}
//                               color={currentDue <= 0 ? "success" : "error"}
//                               variant={currentDue <= 0 ? "filled" : "outlined"}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </CardContent>
//         </Card>

//         <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//           <Button
//             variant="contained"
//             color={isEditMode ? "warning" : "primary"}
//             size="large"
//             disabled={createLoading || updateLoading}
//             onClick={handleSubmitSalary}
//             startIcon={isEditMode ? <Edit /> : <Save />}
//             sx={{
//               px: 4,
//               py: 1.5,
//               borderRadius: 2,
//               boxShadow: 3,
//             }}
//           >
//             {createLoading || updateLoading
//               ? isEditMode
//                 ? "Updating..."
//                 : "Submitting..."
//               : isEditMode
//               ? "Update All Salaries"
//               : "Submit Salary"}
//           </Button>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default EmployeeSalaryForm;
