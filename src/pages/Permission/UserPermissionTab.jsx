/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Chip, Typography, Checkbox, Box, Tooltip, IconButton, useTheme, alpha, CircularProgress, Button } from "@mui/material";
import { Edit, Delete, LibraryBooks, Save } from "@mui/icons-material";
import { useState } from "react";

import Swal from "sweetalert2";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useUpdateMultiplePermissionsMutation } from '../../redux/api/permissionApi.js'
const UserPermissionsTab = ({ filteredPermissions, handleDialogOpen, handleDeletePermission, getRoleColor, loading }) => {
  const theme = useTheme();
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionChanges, setPermissionChanges] = useState({});
  const [updateMultiplePermissions, { isLoading: isUpdating }] = useUpdateMultiplePermissionsMutation();
  const { tenantDomain } = useTenantDomain();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={6}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const handleSelectPermission = (permissionId) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedPermissions(filteredPermissions.map(p => p.id));
    } else {
      setSelectedPermissions([]);
    }
  };

  const handlePermissionChange = (permissionId, permissionType) => {
    setPermissionChanges(prev => ({
      ...prev,
      [permissionId]: {
        ...prev[permissionId],
        [permissionType]: !prev[permissionId]?.[permissionType]
      }
    }));
  };

  const handleUpdateMultiplePermissions = async (e) => {

    if (e) e.preventDefault();

    try {

      const permissionUpdates = selectedPermissions.map(permissionId => {
        const changes = permissionChanges[permissionId] || {};
        return {
          permissionId,
          ...changes
        };
      });

      const result = await updateMultiplePermissions({
        tenantDomain,
        permissionUpdates
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Permissions have been updated successfully.",
        showConfirmButton: false,
        timer: 2000,
        background: "#fff",
      });

      // Clear selections
      setSelectedPermissions([]);
      setPermissionChanges({});
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error?.data?.message || "An error occurred while updating permissions.",
        confirmButtonColor: theme.palette.primary.main,
        background: "#fff",
      });
    }
  };

  const isAllSelected = filteredPermissions.length > 0 && selectedPermissions.length === filteredPermissions.length;

  return (
    <Box component="form" onSubmit={handleUpdateMultiplePermissions} noValidate>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Table>
          <TableHead sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.08),
          }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selectedPermissions.length > 0 && selectedPermissions.length < filteredPermissions.length}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Page</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Create</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Edit</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>View</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Delete</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPermissions.length > 0 ? (
              filteredPermissions.map((permission) => (
                <TableRow
                  key={permission.id}
                  hover
                  selected={selectedPermissions.includes(permission.id)}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handleSelectPermission(permission.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={permission.roleName}
                      size="small"
                      color={getRoleColor(permission.roleName)}
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 1,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          mr: 1.5,
                          bgcolor: alpha(theme.palette.info.main, 0.15),
                          color: theme.palette.info.main,
                          boxShadow: `0 2px 8px ${alpha(theme.palette.info.main, 0.2)}`,
                        }}
                      >
                        <LibraryBooks />
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>
                        {permission.pageName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Checkbox
                      checked={permissionChanges[permission.id]?.create !== undefined ? permissionChanges[permission.id].create : permission.create}
                      color="success"
                      size="small"
                      disabled={!selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id, 'create')}
                      sx={{
                        '&.Mui-disabled': {
                          opacity: 0.5,
                        },
                        '&.Mui-checked': {
                          color: theme.palette.success.main,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Checkbox
                      checked={permissionChanges[permission.id]?.edit !== undefined ? permissionChanges[permission.id].edit : permission.edit}
                      color="warning"
                      size="small"
                      disabled={!selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id, 'edit')}
                      sx={{
                        '&.Mui-disabled': {
                          opacity: 0.5,
                        },
                        '&.Mui-checked': {
                          color: theme.palette.warning.main,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Checkbox
                      checked={permissionChanges[permission.id]?.view !== undefined ? permissionChanges[permission.id].view : permission.view}
                      color="info"
                      size="small"
                      disabled={!selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id, 'view')}
                      sx={{
                        '&.Mui-disabled': {
                          opacity: 0.5,
                        },
                        '&.Mui-checked': {
                          color: theme.palette.info.main,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Checkbox
                      checked={permissionChanges[permission.id]?.delete !== undefined ? permissionChanges[permission.id].delete : permission.delete}
                      color="error"
                      size="small"
                      disabled={!selectedPermissions.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id, 'delete')}
                      sx={{
                        '&.Mui-disabled': {
                          opacity: 0.5,
                        },
                        '&.Mui-checked': {
                          color: theme.palette.error.main,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2 }}>
                    <Tooltip title="Edit Permission">
                      <IconButton
                        size="small"
                        onClick={() => handleDialogOpen(permission.id)}
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          }
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Permission">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeletePermission(permission.id)}
                        sx={{
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                          }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No permissions found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedPermissions.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}
        >
          <Typography variant="body2">
            {selectedPermissions.length} permission(s) selected
          </Typography>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={isUpdating}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
              boxShadow: '0 4px 10px rgba(156, 39, 176, 0.3)',
            }}
          >
            {isUpdating ? 'Updating...' : 'Update Permissions'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UserPermissionsTab;