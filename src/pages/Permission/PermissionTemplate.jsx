
import { Grid, Card, Avatar, Typography, Chip, Button, Box, useTheme, alpha } from "@mui/material";
import { VerifiedUser, ManageAccounts, PersonPin } from "@mui/icons-material";

const PermissionTemplates = () => {
  const theme = useTheme();

  return (
    <Card elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Permission Templates
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mr: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                <VerifiedUser />
              </Avatar>
              <Typography variant="h6" fontWeight={600}>
                Admin Template
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Full access to all system features and configurations
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              <Chip label="Manage Users" size="small" />
              <Chip label="System Settings" size="small" />
              <Chip label="All Permissions" size="small" />
            </Box>
            <Button variant="contained" fullWidth sx={{ borderRadius: 2 }}>
              Apply to Role
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mr: 2,
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                }}
              >
                <ManageAccounts />
              </Avatar>
              <Typography variant="h6" fontWeight={600}>
                Manager Template
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Access to operations with limited system configuration
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              <Chip label="Manage Clients" size="small" />
              <Chip label="View Reports" size="small" />
              <Chip label="Process Payments" size="small" />
            </Box>
            <Button variant="contained" fullWidth color="secondary" sx={{ borderRadius: 2 }}>
              Apply to Role
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mr: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                }}
              >
                <PersonPin />
              </Avatar>
              <Typography variant="h6" fontWeight={600}>
                User Template
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Basic access to view and perform assigned tasks
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              <Chip label="View Data" size="small" />
              <Chip label="Create Entries" size="small" />
              <Chip label="Limited Access" size="small" />
            </Box>
            <Button variant="contained" fullWidth color="info" sx={{ borderRadius: 2 }}>
              Apply to Role
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
};

export default PermissionTemplates;