/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  AccountBalance,
  TrendingUp,
  Paid,
  PointOfSale,
  AccountTree,
  Receipt,

  CalendarMonth,
  ShowChart
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

const IncomeStatisticsCard = ({ accountSummary }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const incomeData = accountSummary?.data?.income || {};
  
  // Extract income values
  const monthlyData = incomeData.monthly || {};
  const yearlyData = incomeData.yearly || {};
  const totalData = incomeData.total || {};

  return (
    <Box sx={{ p: isMobile ? 0 : 3 }}>
      {/* Income Statistics Section */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 3, color: "#2c3e50", textAlign: "center" }}
      >
        Income Statistics
      </Typography>

      <Grid container spacing={3}>
        {/* Monthly Income Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
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
                    Monthly Income
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#065f46" }}
                  >
                    ৳{monthlyData.totalAmount?.toLocaleString() || 0}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "#10b981",
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
                    Total Income:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#065f46" }}>
                    ৳{monthlyData.totalOtherIncome?.toLocaleString() || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Yearly Income Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
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
                    Yearly Income
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#1e40af" }}
                  >
                    ৳{yearlyData.totalAmount?.toLocaleString() || 0}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "#3b82f6",
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
                    Other Income:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e40af" }}>
                    ৳{yearlyData.totalOtherIncome?.toLocaleString() || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Income Card */}
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
                    Total Income
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "#b45309" }}
                  >
                    ৳{totalData.totalAmount?.toLocaleString() || 0}
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
                  <ShowChart />
                </Avatar>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Other Income:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#b45309" }}>
                    ৳{totalData.totalOtherIncome?.toLocaleString() || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

     
      
    </Box>
  );
};

export default IncomeStatisticsCard;