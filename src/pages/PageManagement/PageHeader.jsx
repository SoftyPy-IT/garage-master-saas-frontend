/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
} from "@mui/icons-material";

const PageHeader = ({ pageData }) => {
  const theme = useTheme();
  const activePages = pageData?.data?.filter(page => page.status === "active")?.length || 0;
  const inactivePages = pageData?.data?.filter(page => page.status === "inactive")?.length || 0;

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          Page Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage and configure pages for your garage management system
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                <DashboardIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {pageData?.data?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Pages
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              bgcolor: alpha(theme.palette.success.main, 0.05),
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                <ActiveIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {activePages}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Pages
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              bgcolor: alpha(theme.palette.error.main, 0.05),
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: theme.palette.error.main, mr: 2 }}>
                <InactiveIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {inactivePages}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inactive Pages
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PageHeader;