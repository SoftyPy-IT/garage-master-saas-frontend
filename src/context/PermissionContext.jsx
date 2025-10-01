/* eslint-disable react/prop-types */
// src/context/PermissionContext.js
import  { createContext, useContext, useState, useEffect } from 'react';
import { CircularProgress, Box, Typography, Button } from '@mui/material';

const PermissionContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider');
  }
  return context;
};

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPermissions = async (token) => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:7000/api/v1/permission/my-permissions?tenantDomain=trustautosolution.com', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }
      
      const data = await response.json();
      if (data.success) {
        setPermissions(data.data);
      } else {
        setError(data.message || 'Unknown error');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = (pagePath, action = 'view') => {
    if (!permissions) return false;
    return permissions.permissions[pagePath]?.[action] || false;
  };

  // Initialize permissions on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchPermissions(token);
  }, []);

  const value = {
    permissions,
    loading,
    error,
    checkPermission,
    fetchPermissions
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" mt={2}>
            Loading permissions...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        <Box textAlign="center">
          <Typography variant="h6" color="error">
            Error loading permissions: {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.href = '/login'}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};