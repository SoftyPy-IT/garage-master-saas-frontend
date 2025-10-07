/* eslint-disable react/prop-types */
import { Grid, Card, Avatar, Typography, Box, useTheme, alpha } from "@mui/material";
import { Person, Group, LibraryBooks, Security } from "@mui/icons-material";

const StatsCards = ({ stats }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.dark, 0.08)})`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            transition: "all 0.3s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
              transform: 'translate(30%, -30%)',
            }}
          />
          <Box display="flex" alignItems="center" position="relative" zIndex={1}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mr: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.2),
                color: theme.palette.primary.main,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <Person fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Total Users
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {stats.users}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.15)}, ${alpha(theme.palette.secondary.dark, 0.08)})`,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
            transition: "all 0.3s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.2)} 0%, transparent 70%)`,
              transform: 'translate(30%, -30%)',
            }}
          />
          <Box display="flex" alignItems="center" position="relative" zIndex={1}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mr: 2,
                bgcolor: alpha(theme.palette.secondary.main, 0.2),
                color: theme.palette.secondary.main,
                boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
              }}
            >
              <Group fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Total Roles
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="secondary.main">
                {stats.roles}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.15)}, ${alpha(theme.palette.info.dark, 0.08)})`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            transition: "all 0.3s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.info.main, 0.2)} 0%, transparent 70%)`,
              transform: 'translate(30%, -30%)',
            }}
          />
          <Box display="flex" alignItems="center" position="relative" zIndex={1}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mr: 2,
                bgcolor: alpha(theme.palette.info.main, 0.2),
                color: theme.palette.info.main,
                boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.3)}`,
              }}
            >
              <LibraryBooks fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Total Pages
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {stats.pages}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)}, ${alpha(theme.palette.success.dark, 0.08)})`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            transition: "all 0.3s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.success.main, 0.2)} 0%, transparent 70%)`,
              transform: 'translate(30%, -30%)',
            }}
          />
          <Box display="flex" alignItems="center" position="relative" zIndex={1}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mr: 2,
                bgcolor: alpha(theme.palette.success.main, 0.2),
                color: theme.palette.success.main,
                boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.3)}`,
              }}
            >
              <Security fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Permissions
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.permissions}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatsCards;