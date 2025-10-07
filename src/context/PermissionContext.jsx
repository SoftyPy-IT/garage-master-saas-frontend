/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useState, useEffect } from "react";
import { CircularProgress, Box, Typography, Button } from "@mui/material";
import { useTenantDomain } from "../hooks/useTenantDomain";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../redux/feature/authSlice";
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


  const { data: permissionData, isLoading, error, isError } = useGetUserPermissionQuery(
    { userId: user?.userId, tenantDomain },
    {
      skip: !user?.userId || !tenantDomain,
    }
  );

  // পারমিশন ডেটা এক্সট্র্যাক্ট করুন
  const permissions = permissionData?.data?.permissions || [];
  console.log('permission', permissions)
  // নির্দিষ্ট পেজের জন্য পারমিশন চেক করার ফাংশন
  const checkPermission = (pagePath, action = "view") => {
    if (!permissions || permissions.length === 0) {
      return false;
    }

    const permission = permissions.find((p) => {
      // বিভিন্ন পথ ফরম্যাট চেক করুন
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

  // নির্দিষ্ট পেজে অ্যাক্সেস আছে কিনা চেক করার ফাংশন
  const hasPageAccess = (pagePath) => {
    return checkPermission(pagePath, "view");
  };

  // অ্যাকশন সম্পাদন করার আগে পারমিশন চেক করার ফাংশন
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