/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  AccountBalance,
  TrendingUp,
  Payment,
  Receipt,
  AccountTree,
  CalendarMonth,
  ShowChart,
  MoneyOff
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  useTheme,
  useMediaQuery
} from "@mui/material";

const ExpenseStatisticsCard = ({ accountSummary }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Extract expense data
  const expenseData = accountSummary?.data?.expense || {};
  const donationData = accountSummary?.data?.donation || {};
  const salaryData = accountSummary?.data?.salary || {};
  
  // Extract expense values
  const monthlyData = expenseData.monthly || {};
  const yearlyData = expenseData.yearly || {};
  const totalData = expenseData.total || {};

  // Direct values (not nested objects)
  const monthlyDonation = donationData.monthly || 0;
  const monthlySalary = salaryData.monthly || 0;

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Expense Statistics Section */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 3, color: "#2c3e50", textAlign: "center" }}
      >
        Expense Statistics
      </Typography>

      <Grid container spacing={3}>
        {/* Monthly Expense Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ color: "#64748b", mb: 0.5 }}>
                    Monthly Expense
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#dc2626" }}
                  >
                    ৳{monthlyData.totalAmount?.toLocaleString() || 0}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "#ef4444",
                    color: "white",
                    width: 48,
                    height: 48,
                  }}
                >
                  <CalendarMonth />
                </Avatar>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Invoice Costs:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#dc2626" }}>
                    ৳{monthlyData.invoiceCost?.toLocaleString() || 0}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Other Expenses:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#dc2626" }}>
                    ৳{monthlyData.totalOtherExpense?.toLocaleString() || 0}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Salary Expenses:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#dc2626" }}>
                    ৳{monthlySalary.toLocaleString()}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Donations:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#dc2626" }}>
                    ৳{monthlyDonation.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Yearly Expense Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ color: "#64748b", mb: 0.5 }}>
                    Yearly Expense
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#b45309" }}
                  >
                    ৳{yearlyData.totalAmount?.toLocaleString() || 0}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "#f59e0b",
                    color: "white",
                    width: 48,
                    height: 48,
                  }}
                >
                  <AccountBalance />
                </Avatar>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Invoice Costs:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#b45309" }}>
                    ৳{yearlyData.invoiceCost?.toLocaleString() || 0}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Other Expenses:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#b45309" }}>
                    ৳{yearlyData.totalOtherExpense?.toLocaleString() || 0}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Salary Expenses:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#b45309" }}>
                    ৳{salaryData.yearly?.toLocaleString() || 0}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Donations:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#b45309" }}>
                    ৳{donationData.yearly?.toLocaleString() || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Expense Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ color: "#64748b", mb: 0.5 }}>
                    Total Expense
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#3730a3" }}
                  >
                    ৳{totalData.totalAmount?.toLocaleString() || 0}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "#4f46e5",
                    color: "white",
                    width: 48,
                    height: 48,
                  }}
                >
                  <ShowChart />
                </Avatar>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Invoice Costs:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#3730a3" }}>
                    ৳{totalData.invoiceCost?.toLocaleString() || 0}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Other Expenses:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#3730a3" }}>
                    ৳{totalData.totalOtherExpense?.toLocaleString() || 0}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Salary Expenses:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#3730a3" }}>
                    ৳{salaryData.total?.toLocaleString() || 0}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Donations:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#3730a3" }}>
                    ৳{donationData.total?.toLocaleString() || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Expense Breakdown Section */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 3, mt: 5, color: "#2c3e50", textAlign: "center" }}
      >
        Expense Breakdown
      </Typography>

      <Grid container spacing={3}>
        {/* Invoice Costs Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: "#f59e0b",
                  color: "white",
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 2
                }}
              >
                <Receipt />
              </Avatar>
              <Typography variant="h6" sx={{ color: "#64748b", mb: 1 }}>
                Invoice Costs
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "#b45309", mb: 1 }}
              >
                ৳{monthlyData.invoiceCost?.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Monthly
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Other Expenses Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: "#ef4444",
                  color: "white",
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 2
                }}
              >
                <MoneyOff />
              </Avatar>
              <Typography variant="h6" sx={{ color: "#64748b", mb: 1 }}>
                Other Expenses
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "#dc2626", mb: 1 }}
              >
                ৳{monthlyData.totalOtherExpense?.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Monthly
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Salary Expenses Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: "#f43f5e",
                  color: "white",
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 2
                }}
              >
                <Payment />
              </Avatar>
              <Typography variant="h6" sx={{ color: "#64748b", mb: 1 }}>
                Salary Expenses
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "#e11d48", mb: 1 }}
              >
                ৳{monthlySalary.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Monthly
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Donations Card */}
        <Grid item xs={12} md={6} lg={3}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: "#22c55e",
                  color: "white",
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 2
                }}
              >
                <AccountTree />
              </Avatar>
              <Typography variant="h6" sx={{ color: "#64748b", mb: 1 }}>
                Donations
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "#166534", mb: 1 }}
              >
                ৳{monthlyDonation.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Monthly
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpenseStatisticsCard;