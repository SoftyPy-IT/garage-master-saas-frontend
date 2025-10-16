/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { usePermissions } from '../context/PermissionContext';
import {
  Box,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';

const ProtectedRoute = ({ children, pagePath, action = 'view' }) => {
  const { checkPermission, loading, permissions } = usePermissions();
  if (loading || permissions.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }
  const hasAccess = checkPermission(pagePath, "view");

  if (!hasAccess) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        textAlign="center"
        p={3}
      >
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          You don't have permission to view this page.
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Required permission: view for {pagePath}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.history.back()}
          sx={{ mr: 2 }}
        >
          Go Back
        </Button>
        <Button
          variant="outlined"
          onClick={() => window.location.href = '/dashboard'}
        >
          Dashboard
        </Button>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;