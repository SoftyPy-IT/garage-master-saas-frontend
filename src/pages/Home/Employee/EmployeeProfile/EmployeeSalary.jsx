// EmployeeSalary.jsx
/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import { useGetSalaryForProfileQuery } from "../../../../redux/api/salary";
import {
  Box,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  useTheme,
  Pagination,
  Grid,
  Chip,
} from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import Loading from "../../../../components/Loading/Loading";
import PartialPaymentModal from "../PartialSalaryPaymentModal";
import PaymentHistoryModal from "./PaymentHistoryModal.jsx";
import EmployeeSalaryFilters from "./EmployeeSalaryFilters";
import EmployeeSalaryTableRow from "./EmployeeSalaryTableRow";
import EmployeeSalaryEmptyState from "./EmployeeSalaryEmptyState";

const EmployeeSalary = ({ id, tenantDomain }) => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterDay, setFilterDay] = useState("");
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [selectedPaymentHistory, setSelectedPaymentHistory] = useState(null);
  const limit = 10;

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  const { data, isLoading, refetch } = useGetSalaryForProfileQuery({
    tenantDomain,
    id,
    limit,
    page: currentPage,
    month: filterMonth,
    year: filterYear,
    day: filterDay,
  });

  const handleMonthChange = (event) => {
    setFilterMonth(event.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (event) => {
    setFilterYear(event.target.value);
    setCurrentPage(1);
  };

  const handleDayChange = (event) => {
    setFilterDay(event.target.value);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setFilterMonth("");
    setFilterYear(currentYear);
    setFilterDay("");
    setCurrentPage(1);
  };

  const handleOpenPaymentModal = (salary) => {
    const transformedSalary = {
      _id: salary._id,
      month_of_salary: salary.month_of_salary,
      year_of_salary: salary.year_of_salary,
      total_payment: salary.total_payment,
      paid_amount: salary.paid_amount,
      due_amount: salary.due_amount,
      payment_status: salary.payment_status,
      payment_history: salary.payment_history || [],
    };

    const employee = {
      _id: salary.employee?._id || id,
      full_name: salary.full_name,
      employeeId: salary.employeeId,
    };

    setSelectedSalary({ ...transformedSalary, employee });
    setModalOpen(true);
  };

  const handleOpenPaymentHistory = (salary) => {
    setSelectedPaymentHistory({
      paymentHistory: salary.payment_history || [],
      employeeName: salary.full_name,
      employeeId: salary.employeeId,
      month: salary.month_of_salary,
      year: salary.year_of_salary,
    });
    setPaymentHistoryOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSalary(null);
  };

  const handleClosePaymentHistory = () => {
    setPaymentHistoryOpen(false);
    setSelectedPaymentHistory(null);
  };

  const handlePaymentSuccess = async () => {
    await refetch();
    handleCloseModal();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box sx={{ pt: 2, pb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.background.paper})`,
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>৳</Grid>
          <Grid item xs>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Salary History with Payment Management
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              icon={<CalendarMonth />}
              label={`${currentMonth} ${currentYear}`}
              color="primary"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      <EmployeeSalaryFilters
        filterMonth={filterMonth}
        filterYear={filterYear}
        filterDay={filterDay}
        currentYear={currentYear}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onDayChange={handleDayChange}
        onResetFilters={handleResetFilter}
      />

      <Card elevation={4} sx={{ mb: 4, borderRadius: 2, overflow: "auto" }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              "& .MuiTableCell-root": {
                padding: "12px",
                whiteSpace: "nowrap",
              },
            }}
          >
            <Table sx={{ minWidth: 1400 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", width: "120px" }}
                  >
                    Employee ID
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", width: "150px" }}
                  >
                    Month of Salary
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", width: "120px" }}
                  >
                    Bonus
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", width: "120px" }}
                  >
                    Overtime
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", width: "120px" }}
                  >
                    Salary Amount
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", width: "120px" }}
                  >
                    Total Payment
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", width: "120px" }}
                  >
                    Paid Amount
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", width: "120px" }}
                  >
                    Due Amount
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", width: "120px" }}
                  >
                    Payment Date
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", width: "150px" }}
                  >
                    Payment Progress
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", width: "120px" }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", fontWeight: "bold", width: "150px" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data?.salaries?.length > 0 ? (
                  data.data.salaries.map((salary) => (
                    <EmployeeSalaryTableRow
                      key={salary._id}
                      salary={salary}
                      theme={theme}
                      onOpenPaymentModal={handleOpenPaymentModal}
                      onOpenPaymentHistory={handleOpenPaymentHistory}
                    />
                  ))
                ) : (
                  <EmployeeSalaryEmptyState
                    filterMonth={filterMonth}
                    filterYear={filterYear}
                    filterDay={filterDay}
                    currentYear={currentYear}
                  />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {data?.data?.salaries?.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={data?.data?.meta?.totalPages}
            page={currentPage}
            color="primary"
            onChange={(_, page) => setCurrentPage(page)}
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {selectedSalary && (
        <PartialPaymentModal
          tenantDomain={tenantDomain}
          open={modalOpen}
          onClose={handleCloseModal}
          employee={selectedSalary.employee}
          salaryRecord={selectedSalary}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {selectedPaymentHistory && (
        <PaymentHistoryModal
          open={paymentHistoryOpen}
          onClose={handleClosePaymentHistory}
          paymentHistory={selectedPaymentHistory.paymentHistory}
          employeeName={selectedPaymentHistory.employeeName}
          employeeId={selectedPaymentHistory.employeeId}
          month={selectedPaymentHistory.month}
          year={selectedPaymentHistory.year}
        />
      )}
    </Box>
  );
};

export default EmployeeSalary;
