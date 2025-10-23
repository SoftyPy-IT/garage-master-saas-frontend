/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,

  LinearProgress,
} from "@mui/material";

const ExpenseBreakDown = ({accountSummary}) => {
      // Extract expense data from account summary
  const expenseData = accountSummary?.data?.expense || {};

  const totalExpense = expenseData.total?.totalAmount || 0;
  const invoiceCost = expenseData.monthly?.invoiceCost || 0;
  const otherExpense = expenseData.monthly?.totalOtherExpense || 0;

  // Calculate expense percentages for visualization
  const invoicePercentage = totalExpense > 0 ? (invoiceCost / totalExpense) * 100 : 0;
  const otherExpensePercentage = totalExpense > 0 ? (otherExpense / totalExpense) * 100 : 0;

    return (
          <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          mb: 4,
          background: "linear-gradient(to right, #ffffff, #f8fafc)",
        }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid #e2e8f0" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
            Expense Breakdown
          </Typography>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
                  Expense Distribution
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ width: '70%' }}>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Invoice Costs
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={invoicePercentage} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: "#d1fae5",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#10b981",
                          borderRadius: 5
                        }
                      }} 
                    />
                  </Box>
                  <Box sx={{ width: '30%', textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#059669" }}>
                      ৳{invoiceCost.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '70%' }}>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Other Expenses
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={otherExpensePercentage} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: "#f3e8ff",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#a855f7",
                          borderRadius: 5
                        }
                      }} 
                    />
                  </Box>
                  <Box sx={{ width: '30%', textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#a855f7" }}>
                      ৳{otherExpense.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#374151", mb: 2 }}>
                Expense Summary
              </Typography>
              <Box sx={{ 
                p: 2, 
                backgroundColor: "#f1f5f9", 
                borderRadius: 2,
                borderLeft: '4px solid #0ea5e9'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Total Expenses:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    ৳{totalExpense.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Invoice Costs:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#059669" }}>
                    ৳{invoiceCost.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Other Expenses:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#a855f7" }}>
                    ৳{otherExpense.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid #e2e8f0' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748b" }}>
                    Net Profit:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: accountSummary?.data?.netProfit?.monthly < 0 ? "#ef4444" : "#059669" 
                    }}
                  >
                    ৳{accountSummary?.data?.netProfit?.monthly?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
};

export default ExpenseBreakDown;