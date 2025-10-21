/* eslint-disable react/prop-types */

import AccessDenied from '../components/AccessDenied';
import { usePermissions } from '../context/PermissionContext';
import {
  Box,
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

  const hasAccess = checkPermission(pagePath, action);

  if (!hasAccess) {
    return <AccessDenied pagePath={pagePath} />;
  }

  return children;
};

export default ProtectedRoute;