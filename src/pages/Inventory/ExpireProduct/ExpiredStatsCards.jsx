/* eslint-disable react/prop-types */
import { Grid, Box, Typography, Avatar, useTheme, alpha } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InventoryIcon from "@mui/icons-material/Inventory";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import { GlassCard, Zoom } from "../../../utils/customStyle";

export default function ExpiredStatsCards({
  totalExpired,
  totalExpiringSoon,
  totalQuantity,
  processedProducts,
}) {
  const theme = useTheme();

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Zoom in={true} style={{ transitionDelay: "100ms" }}>
          <GlassCard>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                    mr: 2,
                  }}
                >
                  <ErrorOutlineIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Expired
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: theme.palette.error.main }}
              >
                {totalExpired}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TrendingUpIcon
                  sx={{
                    color: theme.palette.error.main,
                    mr: 0.5,
                    fontSize: "1rem",
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Needs immediate attention
                </Typography>
              </Box>
            </Box>
          </GlassCard>
        </Zoom>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Zoom in={true} style={{ transitionDelay: "200ms" }}>
          <GlassCard>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    mr: 2,
                  }}
                >
                  <WarningAmberIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Expiring Soon
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.warning.main,
                }}
              >
                {totalExpiringSoon}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TrendingDownIcon
                  sx={{
                    color: theme.palette.success.main,
                    mr: 0.5,
                    fontSize: "1rem",
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Monitor closely
                </Typography>
              </Box>
            </Box>
          </GlassCard>
        </Zoom>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Zoom in={true} style={{ transitionDelay: "300ms" }}>
          <GlassCard>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    mr: 2,
                  }}
                >
                  <InventoryIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total Quantity
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: theme.palette.info.main }}
              >
                {totalQuantity}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <BarChartIcon
                  sx={{
                    color: theme.palette.info.main,
                    mr: 0.5,
                    fontSize: "1rem",
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Total of {processedProducts.length} products
                </Typography>
              </Box>
            </Box>
          </GlassCard>
        </Zoom>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Zoom in={true} style={{ transitionDelay: "400ms" }}>
          <GlassCard>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    mr: 2,
                  }}
                >
                  <CalendarMonthIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Average Expiry
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.success.main,
                }}
              >
                {Math.round(
                  processedProducts.reduce((sum, p) => sum + p.daysExpired, 0) /
                    processedProducts.length || 0
                )}{" "}
                days
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <PieChartIcon
                  sx={{
                    color: theme.palette.success.main,
                    mr: 0.5,
                    fontSize: "1rem",
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Time to take action
                </Typography>
              </Box>
            </Box>
          </GlassCard>
        </Zoom>
      </Grid>
    </Grid>
  );
}
