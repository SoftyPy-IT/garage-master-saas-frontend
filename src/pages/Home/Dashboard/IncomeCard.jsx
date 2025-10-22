"use client";

/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  LinearProgress,
  alpha,
  Tooltip,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Fade,
  Zoom,
  keyframes,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Receipt,
  AccountBalance,
  AccountTree,
  Payments,
  VolunteerActivism,
  InfoOutlined,
  CalendarMonth,
  ShowChart,
  PieChart,
  StackedLineChart,
  AttachMoney,
  AccountBalanceWallet,
} from "@mui/icons-material";

// Define keyframes
const pulseKeyframes = keyframes`
  0%, 100% { 
    opacity: 0.5; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.8; 
    transform: scale(1.1); 
  }
`;

const floatAnimation = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-20px) rotate(180deg); 
  }
`;

const gradientAnimation = keyframes`
  0% { 
    background-position: 0% 50%; 
  }
  50% { 
    background-position: 100% 50%; 
  }
  100% { 
    background-position: 0% 50%; 
  }
`;

const DashboardSummary = ({ accountSummary }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [timeRange, setTimeRange] = useState("monthly");

  const getDataByTimeRange = (category, subCategory = null) => {
    if (!accountSummary?.data?.[category]) return subCategory ? 0 : {};

    const categoryData = accountSummary.data[category];

    // Handle direct number values (donation, salary, netProfit)
    if (typeof categoryData[timeRange] === "number") {
      return subCategory ? categoryData[timeRange] : categoryData[timeRange];
    }

    // Handle object values (income, expense)
    if (typeof categoryData[timeRange] === "object") {
      if (subCategory) {
        return categoryData[timeRange]?.[subCategory] || 0;
      }
      return categoryData[timeRange] || {};
    }

    return subCategory ? 0 : {};
  };

  // Get all data for the selected time range
  const incomeData = getDataByTimeRange("income");
  const expenseData = getDataByTimeRange("expense");
  const donationAmount = getDataByTimeRange("donation");
  const salaryAmount = getDataByTimeRange("salary");
  const netProfitAmount = getDataByTimeRange("netProfit");

  // Calculate values
  const totalIncome = incomeData.totalAmount || 0;
  const totalExpense = accountSummary?.data?.netTotalExpense?.total || 0;
  const netProfit = netProfitAmount || totalIncome - totalExpense;
  const profitColor = netProfit >= 0 ? "success" : "error";
  const profitIcon = netProfit >= 0 ? <TrendingUp /> : <TrendingDown />;
  const profitLabel = netProfit >= 0 ? "Profit" : "Loss";

  // Calculate percentages for progress indicators
  const maxValue = Math.max(totalIncome, totalExpense);
  const incomePercentage = maxValue > 0 ? (totalIncome / maxValue) * 100 : 0;
  const expensePercentage = maxValue > 0 ? (totalExpense / maxValue) * 100 : 0;

  // Time range selector with scrollable tabs for mobile
  const TimeRangeSelector = () => (
    <Fade in timeout={800}>
      <Paper
        sx={{
          p: 2,
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.05
          )} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background elements */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, transparent 70%)`,
            animation: `${floatAnimation} 6s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(
              theme.palette.secondary.main,
              0.1
            )} 0%, transparent 70%)`,
            animation: `${floatAnimation} 8s ease-in-out infinite reverse`,
          }}
        />

        <Tabs
          value={timeRange}
          onChange={(e, newValue) => setTimeRange(newValue)}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
          sx={{
            "& .MuiTab-root": {
              minWidth: "auto",
              px: 4,
              py: 1.5,
              fontSize: "0.9rem",
              fontWeight: "600",
              borderRadius: 3,
              margin: "0 4px",
              transition: "all 0.3s ease",
              "&:hover": {
                background: alpha(theme.palette.primary.main, 0.08),
                transform: "translateY(-2px)",
              },
            },
            "& .Mui-selected": {
              color: theme.palette.primary.main,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.12
              )} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
              fontWeight: "bold",
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
            "& .MuiTabs-scrollButtons": {
              color: theme.palette.primary.main,
              "&.Mui-disabled": {
                opacity: 0.3,
              },
            },
          }}
          centered={!isMobile}
        >
          <Tab
            icon={<CalendarMonth />}
            label="Monthly"
            value="monthly"
            sx={{ minHeight: 48 }}
          />
          <Tab
            icon={<StackedLineChart />}
            label="Yearly"
            value="yearly"
            sx={{ minHeight: 48 }}
          />
          <Tab
            icon={<PieChart />}
            label="Total"
            value="total"
            sx={{ minHeight: 48 }}
          />
        </Tabs>
      </Paper>
    </Fade>
  );

  // Enhanced StatCard component
  const StatCard = ({
    title,
    value,
    icon,
    color,
    subtitle,
    progress,
    index,
  }) => (
    <Zoom
      in
      timeout={800 + index * 100}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card
        sx={{
          height: "100%",
          transition: "all 0.3s ease-in-out",
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette[color].main, 0.08)} 0%, 
            ${alpha(theme.palette[color].main, 0.02)} 100%)`,
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette[color].main, 0.15)}`,
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 12px 28px ${alpha(theme.palette[color].main, 0.15)}`,
            border: `1px solid ${alpha(theme.palette[color].main, 0.3)}`,
            "& .card-border": {
              transform: "scaleX(1)",
            },
            "& .card-background-circle": {
              transform: "scale(1.3)",
            },
            "& .card-icon": {
              transform: "scale(1.1) rotate(5deg)",
              bgcolor: alpha(theme.palette[color].main, 0.25),
            },
          },
        }}
      >
        {/* Hover Border */}
        <Box
          className="card-border"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(90deg, 
              ${theme.palette[color].main}, 
              ${alpha(theme.palette[color].main, 0.5)})`,
            transform: "scaleX(0)",
            transition: "transform 0.3s ease",
            zIndex: 2,
          }}
        />

        <CardContent
          sx={{ p: { xs: 1, sm: 3 }, position: "relative", zIndex: 2 }}
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={2}
          >
            <Avatar
              className="card-icon"
              sx={{
                bgcolor: alpha(theme.palette[color].main, 0.15),
                width: 52,
                height: 52,
                border: `2px solid ${alpha(theme.palette[color].main, 0.2)}`,
                transition: "all 0.3s ease",
              }}
            >
              <Box sx={{ color: theme.palette[color].main, fontSize: 24 }}>
                {icon}
              </Box>
            </Avatar>
            <Tooltip title={title} arrow>
              <InfoOutlined
                sx={{
                  fontSize: 18,
                  color: alpha(theme.palette.text.secondary, 0.7),
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: theme.palette[color].main,
                  },
                }}
              />
            </Tooltip>
          </Box>

          {/* Value */}
          <Typography
            variant="h4"
            fontWeight="800"
            gutterBottom
            sx={{
              color: theme.palette[color].main,
              background: `linear-gradient(135deg, ${
                theme.palette[color].main
              }, ${alpha(theme.palette[color].main, 0.8)})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: `0 2px 10px ${alpha(theme.palette[color].main, 0.2)}`,
            }}
          >
            ৳ {value.toLocaleString()}
          </Typography>

          {/* Title and Subtitle */}
          <Typography
            variant="h6"
            fontWeight="600"
            color="text.primary"
            gutterBottom
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ opacity: 0.8 }}
            >
              {subtitle}
            </Typography>
          )}

          {/* Progress Bar */}
          {progress && (
            <Box mt={2}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette[color].main, 0.1),
                  "& .MuiLinearProgress-bar": {
                    background: `linear-gradient(90deg, 
                      ${theme.palette[color].main}, 
                      ${alpha(theme.palette[color].main, 0.7)})`,
                    borderRadius: 3,
                    transition: "transform 0.8s ease",
                  },
                }}
              />
            </Box>
          )}
        </CardContent>

        {/* Background Pattern */}
        <Box
          className="card-background-circle"
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: alpha(theme.palette[color].main, 0.03),
            transition: "all 0.4s ease",
          }}
        />
      </Card>
    </Zoom>
  );

  // Main Performance Card
  const PerformanceCard = () => (
    <Fade in timeout={600}>
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: alpha(theme.palette.primary.main, 0.03),
          borderRadius: 3,
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            sx={{ bgcolor: "primary.main", mr: 2, width: 50, height: 50 }}
          >
            <AccountBalance />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="primary.dark">
              Financial Performance
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {timeRange} summary
            </Typography>
          </Box>
        </Box>

        <Card
          sx={{
            flexGrow: 1,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette[profitColor].main,
              0.1
            )} 0%, ${alpha(theme.palette[profitColor].main, 0.05)} 100%)`,
            boxShadow: "none",
            border: `1px solid ${alpha(theme.palette[profitColor].main, 0.2)}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: 3,
            mb: 2,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              border: `1px solid ${alpha(
                theme.palette[profitColor].main,
                0.3
              )}`,
              boxShadow: `0 8px 24px ${alpha(
                theme.palette[profitColor].main,
                0.15
              )}`,
            },
          }}
        >
          {/* Animated Background */}
          <Box
            sx={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(
                theme.palette[profitColor].main,
                0.1
              )} 0%, transparent 70%)`,
              animation: `${pulseKeyframes} 4s ease-in-out infinite`,
            }}
          />

          <Box textAlign="center" position="relative" zIndex={2}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette[profitColor].main, 0.2),
                width: 70,
                height: 70,
                mx: "auto",
                mb: 2,
                border: `2px solid ${alpha(
                  theme.palette[profitColor].main,
                  0.3
                )}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1) rotate(5deg)",
                  bgcolor: alpha(theme.palette[profitColor].main, 0.3),
                },
              }}
            >
              <Box
                sx={{ color: theme.palette[profitColor].main, fontSize: 32 }}
              >
                {profitIcon}
              </Box>
            </Avatar>

            <Typography
              variant="h3"
              fontWeight="bold"
              color={`${profitColor}.main`}
              gutterBottom
              sx={{
                background: `linear-gradient(135deg, 
                  ${theme.palette[profitColor].main} 0%, 
                  ${alpha(theme.palette[profitColor].main, 0.8)} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: `0 4px 20px ${alpha(
                  theme.palette[profitColor].main,
                  0.3
                )}`,
              }}
            >
              ৳ {Math.abs(netProfit).toLocaleString()}
            </Typography>

            <Chip
              label={`Net ${profitLabel}`}
              color={profitColor}
              sx={{
                mb: 3,
                px: 2,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: "bold",
                background: `linear-gradient(135deg, 
                  ${theme.palette[profitColor].main} 0%, 
                  ${alpha(theme.palette[profitColor].main, 0.8)} 100%)`,
                color: "white",
                boxShadow: `0 4px 15px ${alpha(
                  theme.palette[profitColor].main,
                  0.3
                )}`,
              }}
            />

            <Box mt={3} px={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography
                  variant="body2"
                  color="success.main"
                  fontWeight="medium"
                >
                  Income
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="text.primary"
                >
                  ৳ {totalIncome.toLocaleString()}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="body2"
                  color="error.main"
                  fontWeight="medium"
                >
                  Expense
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="text.primary"
                >
                  ৳ {totalExpense.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Donations and Salary Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <StatCard
              title="Donations"
              value={donationAmount}
              icon={<VolunteerActivism />}
              color="primary"
              index={1}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StatCard
              title="Salary"
              value={salaryAmount}
              icon={<Payments />}
              color="warning"
              index={2}
            />
          </Grid>
        </Grid>
      </Paper>
    </Fade>
  );

  return (
    <Box
      sx={{
        p: isMobile ? 1 : 4,
        marginY: isMobile ? 2 : 4,
        borderRadius: "15px",
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
          #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)`,
        backgroundSize: "400% 400%",
        animation: `${gradientAnimation} 15s ease infinite`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            "#ffffff",
            0.1
          )} 0%, transparent 70%)`,
          animation: `${floatAnimation} 20s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "8%",
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            "#ffffff",
            0.08
          )} 0%, transparent 70%)`,
          animation: `${floatAnimation} 18s ease-in-out infinite reverse`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          left: "70%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            "#ffffff",
            0.06
          )} 0%, transparent 70%)`,
          animation: `${floatAnimation} 25s ease-in-out infinite`,
        }}
      />

      {/* Content Container with Glass Effect */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          p: { xs: 2, sm: 4 },
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Header */}
        <Fade in timeout={500}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            flexDirection={isMobile ? "column" : "row"}
            sx={{ textAlign: isMobile ? "center" : "left" }}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary"
                gutterBottom={isMobile}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Financial Overview
              </Typography>
            </Box>
            <Chip
              icon={<CalendarMonth />}
              label={`${
                timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
              } View`}
              color="primary"
              variant="filled"
              sx={{
                mt: isMobile ? 2 : 0,
                px: 3,
                py: 1,
                fontSize: "0.9rem",
                fontWeight: "600",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
              }}
            />
          </Box>
        </Fade>

        <TimeRangeSelector />

        <Grid container spacing={3}>
          {/* Financial Performance Highlight */}
          <Grid item xs={12} lg={4}>
            <PerformanceCard />
          </Grid>

          {/* Income Overview */}
          <Grid item xs={12} md={6} lg={4}>
            <Fade in timeout={700}>
              <Card
                sx={{
                  height: "100%",
                  background: `linear-gradient(135deg, 
                    ${alpha(theme.palette.success.main, 0.08)} 0%, 
                    ${alpha(theme.palette.success.main, 0.02)} 100%)`,
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
                  borderRadius: 4,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 12px 28px ${alpha(
                      theme.palette.success.main,
                      0.15
                    )}`,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar
                      sx={{
                        bgcolor: "success.main",
                        mr: 2,
                        width: 50,
                        height: 50,
                      }}
                    >
                      <AttachMoney />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="success.dark"
                      >
                        Income Overview
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {timeRange} income
                      </Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <StatCard
                        title="Total Income"
                        value={totalIncome}
                        icon={<AccountBalanceWallet />}
                        color="success"
                        progress={incomePercentage}
                        index={3}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StatCard
                        title="Service Income"
                        value={incomeData.serviceIncomeAmount || 0}
                        icon={<AccountTree />}
                        color="info"
                        index={4}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StatCard
                        title="Parts Income"
                        value={incomeData.partsIncomeAmount || 0}
                        icon={<Receipt />}
                        color="warning"
                        index={5}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StatCard
                        title="Other Income"
                        value={incomeData.totalOtherIncome || 0}
                        icon={<TrendingUp />}
                        color="secondary"
                        index={6}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Expense Overview */}
          <Grid item xs={12} md={6} lg={4}>
            <Fade in timeout={900}>
              <Card
                sx={{
                  height: "100%",
                  background: `linear-gradient(135deg, 
                    ${alpha(theme.palette.error.main, 0.08)} 0%, 
                    ${alpha(theme.palette.error.main, 0.02)} 100%)`,
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
                  borderRadius: 4,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 12px 28px ${alpha(
                      theme.palette.error.main,
                      0.15
                    )}`,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar
                      sx={{ bgcolor: "error.main", mr: 2, width: 50, height: 50 }}
                    >
                      <TrendingDown />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="error.dark"
                      >
                        Expense Overview
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {timeRange} expenses
                      </Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <StatCard
                        title="Total Expense"
                        value={totalExpense}
                        icon={<TrendingDown />}
                        color="error"
                        progress={expensePercentage}
                        index={7}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StatCard
                        title="Invoice Cost"
                        value={expenseData.invoiceCost || 0}
                        icon={<Receipt />}
                        color="error"
                        index={8}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StatCard
                        title="Other Expense"
                        value={expenseData.totalOtherExpense || 0}
                        icon={<Receipt />}
                        color="secondary"
                        index={9}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StatCard
                        title="Salary Expense"
                        value={salaryAmount}
                        icon={<Payments />}
                        color="warning"
                        index={10}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Summary Footer */}
        <Fade in timeout={1200}>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Chip
              icon={<ShowChart />}
              label={`Financial summary for ${timeRange} view`}
              variant="outlined"
              color="primary"
              sx={{
                px: 3,
                py: 2,
                fontSize: "0.9rem",
                fontWeight: "500",
                background: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            />
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default DashboardSummary;