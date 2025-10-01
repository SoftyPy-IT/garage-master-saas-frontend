/* eslint-disable react/prop-types */
import { Inventory } from "@mui/icons-material";
import { Grid, Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { CheckIcon, ShoppingCartIcon } from "lucide-react";

const SummaryCards = ({ purchaseOrderData }) => {
  const theme = useTheme();

  const summaryData = [
    {
      title: "Total Orders",
      value: purchaseOrderData?.data?.meta?.total || 0,
      icon: <ShoppingCartIcon />,
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.primary.main, 0.05)})`,
    },
    {
      title: "Pending Orders",
      value: purchaseOrderData?.data?.orders?.filter(order => order.status === "Pending").length || 0,
      icon: <ShoppingCartIcon/>,
      color: theme.palette.warning.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.warning.light, 0.2)}, ${alpha(theme.palette.warning.main, 0.05)})`,
    },
    {
      title: "Confirmed Orders",
      value: purchaseOrderData?.data?.orders?.filter(order => order.status === "Approved").length || 0,
      icon: <CheckIcon />,
      color: theme.palette.info.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.2)}, ${alpha(theme.palette.info.main, 0.05)})`,
    },
    {
      title: "Shipped Orders",
      value: purchaseOrderData?.data?.orders?.filter(order => order.status === "Shipped").length || 0,
      icon: <Inventory/>,
      color: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.success.light, 0.2)}, ${alpha(theme.palette.success.main, 0.05)})`,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {summaryData.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", background: item.gradient, p: 3 }}>
              <Avatar sx={{ bgcolor: item.color, width: 56, height: 56, boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>
                {item.icon}
              </Avatar>
              <Box sx={{ ml: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {item.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "medium" }}>
                  {item.title}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;