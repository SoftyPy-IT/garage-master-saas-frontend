/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext } from "react";
import { CircularProgress, Box, Typography, Button } from "@mui/material";
import { useTenantDomain } from "../hooks/useTenantDomain";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/feature/authSlice";
import { useGetUserPermissionQuery } from "../redux/api/userApi";

const PermissionContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within PermissionProvider");
  }
  return context;
};

export const PermissionProvider = ({ children }) => {
  const { tenantDomain } = useTenantDomain();
  const user = useSelector(selectCurrentUser);
  console.log(user)
  console.log(user)
  const { data: permissionData, isLoading, error, isError } = useGetUserPermissionQuery(
    { userId: user?.userId, tenantDomain },
    {
      skip: !user?.userId || !tenantDomain,
    }
  );
  console.log

  const permissions = permissionData?.data?.permissions || [];
  console.log(permissions)
  // check specific page permission
  const checkPermission = (pagePath, action = "view") => {
    if (!permissions || permissions.length === 0) {
      return false;
    }

    const permission = permissions.find((p) => {
      // check different path 
      const possiblePaths = [
        pagePath,
        pagePath.endsWith("/") ? pagePath.slice(0, -1) : pagePath + "/",
        pagePath.startsWith("/") ? pagePath : "/" + pagePath,
      ];

      return (
        possiblePaths.includes(p.page?.path) ||
        possiblePaths.includes(p.page?.route) ||
        possiblePaths.includes(p.route)
      );
    });

    if (!permission) {
      return false;
    }

    return permission[action] || false;
  };

  const hasPageAccess = (pagePath) => {
    return checkPermission(pagePath, "view");
  };

  // check before action
  const performActionWithPermission = (pagePath, action, callback, alertMessage) => {
    if (checkPermission(pagePath, action)) {
      callback();
    } else {
      alert(alertMessage || `You don't have permission to ${action} this item.`);
    }
  };

  const value = {
    permissions,
    loading: isLoading,
    error: isError ? error?.message || "Failed to fetch permissions" : null,
    checkPermission,
    hasPageAccess,
    performActionWithPermission,
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" mt={2}>
            Loading permissions...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Box textAlign="center">
          <Typography variant="h6" color="error">
            Error loading permissions: {error?.message || "Unknown error"}
          </Typography>
          <Button
            variant="contained"
            onClick={() => (window.location.href = "/login")}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Box>
      </Box>
    );
  }

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
};