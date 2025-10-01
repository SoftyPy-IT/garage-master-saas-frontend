/* eslint-disable react/prop-types */
import { Grid, Typography, Box } from "@mui/material";
import {
  LocalShippingOutlined,
  InventoryOutlined,
  ReceiptLongOutlined,
  AssessmentOutlined,
  ArrowUpward,
  CheckCircle as ReceivedIcon,
  Cancel as CancelledIcon,
  LocalShipping as ShippedIcon,
  Schedule as PendingIcon,
} from "@mui/icons-material";
import { GradientBox } from "./supplier";

const SupplierMetrics = ({ supplier, paymentStats }) => {
  console.log(supplier);

  // Format currency with Bangladeshi Taka symbol
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "৳0";
    return `৳${Number(value).toLocaleString()}`;
  };

  // Calculate total orders from order status summary
  const totalOrders = supplier?.orderStatusSummary 
    ? Object.values(supplier.orderStatusSummary).reduce((sum, count) => sum + count, 0)
    : (supplier?.orders?.length || 0);

  // Calculate total purchase amount
  const totalGrandTotal = supplier?.purchases?.reduce(
    (sum, purchase) => sum + (purchase?.grandTotal || 0),
    0
  );

  // Status configuration with icons and colors
  const statusConfig = {
    Received: {
      icon: <ReceivedIcon />,
      color: "#4CAF50", // Green
      bgColor: "rgba(76, 175, 80, 0.2)",
    },
    Cancelled: {
      icon: <CancelledIcon />,
      color: "#F44336", // Red
      bgColor: "rgba(244, 67, 54, 0.2)",
    },
    Shipped: {
      icon: <ShippedIcon />,
      color: "#2196F3", // Blue
      bgColor: "rgba(33, 150, 243, 0.2)",
    },
    Pending: {
      icon: <PendingIcon />,
      color: "#FF9800", // Orange
      bgColor: "rgba(255, 152, 0, 0.2)",
    },
  };



  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {/* Total Orders Card */}
      <Grid item xs={12} md={3}>
        <GradientBox gradientColors="#4CAF50 0%, #8BC34A 100%">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              Total Orders
            </Typography>
            <LocalShippingOutlined sx={{ fontSize: 40, opacity: 0.8 }} />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "white", my: 1 }}
          >
            {totalOrders}
          </Typography>
          
          {/* Order Status Summary */}
          <Box sx={{ mt: 1 }}>
            {supplier?.orderStatusSummary && (
              <Box sx={{ display: "flex", flexDirection: "row", flexWrap:'wrap', gap: 0.8 }}>
                {Object.entries(supplier.orderStatusSummary).map(([status, count]) => (
                  <Box
                    key={status}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 0.8,
                      borderRadius: 1,
                      backgroundColor: statusConfig[status]?.bgColor || "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          color: statusConfig[status]?.color || "white",
                          mr: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {statusConfig[status]?.icon || <PendingIcon />}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "white", fontWeight: "medium" }}
                      >
                        {status}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      {count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          
        
        </GradientBox>
      </Grid>

      {/* Products Card */}
      <Grid item xs={12} md={3}>
        <GradientBox gradientColors="#2196F3 0%, #03A9F4 100%">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              Products
            </Typography>
            <InventoryOutlined sx={{ fontSize: 40, opacity: 0.8 }} />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "white", my: 1 }}
          >
            {supplier?.products?.length || 0}
          </Typography>
         
        </GradientBox>
      </Grid>

      {/* Total Purchase Card */}
      <Grid item xs={12} md={3}>
        <GradientBox gradientColors="#FF9800 0%, #FFC107 100%">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              Total Purchase
            </Typography>
            <ReceiptLongOutlined sx={{ fontSize: 40, opacity: 0.8 }} />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "white", my: 1 }}
          >
            {supplier?.purchases?.length || 0}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ArrowUpward sx={{ color: "white", fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
              {formatCurrency(paymentStats?.paidAmount || 0)} paid
            </Typography>
          </Box>
        </GradientBox>
      </Grid>

      {/* Total Spent Card */}
      <Grid item xs={12} md={3}>
        <GradientBox gradientColors="#9C27B0 0%, #673AB7 100%">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              Total Spent
            </Typography>
            <AssessmentOutlined sx={{ fontSize: 40, opacity: 0.8 }} />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "white", my: 1 }}
          >
            {formatCurrency(totalGrandTotal)}
          </Typography>
        </GradientBox>
      </Grid>

    </Grid>
  );
};

export default SupplierMetrics;