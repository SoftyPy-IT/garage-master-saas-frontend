/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Typography,
  Checkbox,
  Box,
  Tooltip,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Button,
} from "@mui/material";
import { Edit, Delete, LibraryBooks, Save, Person } from "@mui/icons-material";
import { useState } from "react";

import Swal from "sweetalert2";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import {
  useUpdateMultiplePermissionsMutation,
  useCreateMultiplePermissionsMutation,
} from "../../redux/api/permissionApi.js";
import { useGetAllUserQuery } from "../../redux/api/userApi.js";

const MultipleAccess = ({
  handleDialogOpen,
  handleDeletePermission,
  getRoleColor,
  loading,
}) => {
  const theme = useTheme();
  const [selectedRows, setSelectedRows] = useState([]);
  const [permissionChanges, setPermissionChanges] = useState({});
  const [updateMultiplePermissions, { isLoading: isUpdating }] =
    useUpdateMultiplePermissionsMutation();
  const [createOrUpdateMultiplePermissions, { isLoading: isCreating }] =
    useCreateMultiplePermissionsMutation();
  const { tenantDomain } = useTenantDomain();
  const { data: userData } = useGetAllUserQuery({ tenantDomain });

  const getAllPages = () => {
    if (!userData || !userData.data) return [];

    const allPages = new Set();

    userData.data.forEach((user) => {
      if (user.permission && user.permission.length > 0) {
        user.permission.forEach((perm) => {
          if (perm.pageId && perm.pageId.length > 0) {
            perm.pageId.forEach((page) => {
              allPages.add(JSON.stringify(page));
            });
          }
        });
      }
    });

    return Array.from(allPages).map((pageStr) => JSON.parse(pageStr));
  };

  const allPages = getAllPages();

  // Transform userData to a format compatible with the existing table
  const transformUserDataToPermissions = () => {
    if (!userData || !userData.data) return [];

    const permissions = [];

    userData.data.forEach((user) => {
      // Create a map of user's permissions by page ID for quick lookup
      const userPermissionsMap = {};

      if (user.permission && user.permission.length > 0) {
        user.permission.forEach((perm) => {
          if (perm.pageId && perm.pageId.length > 0) {
            perm.pageId.forEach((page) => {
              const pageId = page._id;
              userPermissionsMap[pageId] = {
                permissionId: perm._id,
                create: perm.create || false,
                edit: perm.edit || false,
                view: perm.view || false,
                delete: perm.delete || false,
                roleId: perm.roleId || [],
              };
            });
          }
        });
      }

      // For each page in the system, create a permission entry for this user
      allPages.forEach((page) => {
        const pageId = page._id;
        const userPermission = userPermissionsMap[pageId];

        const roleName =
          userPermission &&
          userPermission.roleId &&
          userPermission.roleId.length > 0
            ? userPermission.roleId[0].name
            : user.role || "Unknown";

        permissions.push({
          id: userPermission
            ? userPermission.permissionId
            : `new-${user._id}-${pageId}`,
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          roleName: roleName,
          pageName: page.name,
          pagePath: page.path,
          pageId: pageId,
          create: userPermission ? userPermission.create : false,
          edit: userPermission ? userPermission.edit : false,
          view: userPermission ? userPermission.view : false,
          delete: userPermission ? userPermission.delete : false,
          hasPermission: !!userPermission,
          originalPermission: userPermission,
        });
      });
    });

    return permissions;
  };

  const userPermissions = transformUserDataToPermissions();

  // Group permissions by user for better organization
  const groupedPermissions = userPermissions.reduce((acc, permission) => {
    if (!acc[permission.userId]) {
      acc[permission.userId] = {
        user: {
          id: permission.userId,
          name: permission.userName,
          email: permission.userEmail,
          role: permission.roleName,
        },
        permissions: [],
      };
    }
    acc[permission.userId].permissions.push(permission);
    return acc;
  }, {});

  const usersArray = Object.values(groupedPermissions);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={6}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const handleSelectRow = (permissionId) => {
    setSelectedRows((prev) => {
      if (prev.includes(permissionId)) {
        // If row is already selected, deselect it
        return prev.filter((id) => id !== permissionId);
      } else {
        // If row is not selected, select it
        return [...prev, permissionId];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Select all rows
      setSelectedRows(userPermissions.map((p) => p.id));
      // Set all permissions to true
      const allChanges = {};
      userPermissions.forEach((permission) => {
        allChanges[permission.id] = {
          create: true,
          edit: true,
          view: true,
          delete: true,
        };
      });
      setPermissionChanges(allChanges);
    } else {
      // Deselect all rows
      setSelectedRows([]);
      // Reset all permission changes
      setPermissionChanges({});
    }
  };

  const handlePermissionChange = (permissionId, permissionType) => {
    setPermissionChanges((prev) => {
      const currentChanges = prev[permissionId] || {};
      const currentValue =
        currentChanges[permissionType] !== undefined
          ? currentChanges[permissionType]
          : userPermissions.find((p) => p.id === permissionId)[permissionType];

      return {
        ...prev,
        [permissionId]: {
          ...currentChanges,
          [permissionType]: !currentValue,
        },
      };
    });
  };

  // MultipleAccess component e ei function ta use koro
  const handleUpdateMultiplePermissions = async (e) => {
    if (e) e.preventDefault();

    try {
      // Prepare all permissions data
      const allPermissionsData = [];

      // Combine selected rows and permission changes
      const allPermissionIds = new Set([
        ...selectedRows,
        ...Object.keys(permissionChanges),
      ]);

      allPermissionIds.forEach((permissionId) => {
        const permission = userPermissions.find((p) => p.id === permissionId);
        const changes = permissionChanges[permissionId] || {};

        allPermissionsData.push({
          userId: permission.userId,
          pageId: permission.pageId,
          create:
            changes.create !== undefined ? changes.create : permission.create,
          edit: changes.edit !== undefined ? changes.edit : permission.edit,
          view: changes.view !== undefined ? changes.view : permission.view,
          delete:
            changes.delete !== undefined ? changes.delete : permission.delete,
        });
      });

      // Single API call for both create and update
      const result = await createOrUpdateMultiplePermissions({
        tenantDomain,
        permissionData: allPermissionsData,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `${result.length} permissions processed successfully.`,
        showConfirmButton: false,
        timer: 2000,
        background: "#fff",
      });

      setSelectedRows([]);
      setPermissionChanges({});

      // Optional: Refresh data
      // refetch user data here if needed
    } catch (error) {
      console.error("Error processing permissions:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error?.data?.message ||
          "An error occurred while processing permissions.",
        confirmButtonColor: theme.palette.primary.main,
        background: "#fff",
      });
    }
  };

  const isAllSelected =
    userPermissions.length > 0 &&
    selectedRows.length === userPermissions.length;
  const isIndeterminate =
    selectedRows.length > 0 && selectedRows.length < userPermissions.length;

  return (
    <Box component="form" onSubmit={handleUpdateMultiplePermissions} noValidate>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          width: "100%",
          overflowX: "auto",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Table>
          <TableHead
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={isIndeterminate}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Page</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Create</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Edit</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>View</TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Delete</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userPermissions.length > 0 ? (
              userPermissions.map((permission) => (
                <TableRow
                  key={permission.id}
                  hover
                  selected={selectedRows.includes(permission.id)}
                  sx={{
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                    },
                    "&.Mui-selected": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                    // Highlight rows for users without permissions
                    backgroundColor: !permission.hasPermission
                      ? alpha(theme.palette.warning.main, 0.02)
                      : "inherit",
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selectedRows.includes(permission.id)}
                      onChange={() => handleSelectRow(permission.id)}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          mr: 1.5,
                          bgcolor: alpha(theme.palette.secondary.main, 0.15),
                          color: theme.palette.secondary.main,
                          boxShadow: `0 2px 8px ${alpha(
                            theme.palette.secondary.main,
                            0.2
                          )}`,
                        }}
                      >
                        <Person fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {permission.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {permission.userEmail}
                        </Typography>
                      </Box>
                    </Box>
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
                          boxShadow: `0 2px 8px ${alpha(
                            theme.palette.info.main,
                            0.2
                          )}`,
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
                      checked={
                        selectedRows.includes(permission.id)
                          ? true
                          : permissionChanges[permission.id]?.create !==
                            undefined
                          ? permissionChanges[permission.id].create
                          : permission.create
                      }
                      color="success"
                      size="small"
                      onChange={() =>
                        handlePermissionChange(permission.id, "create")
                      }
                      sx={{
                        "&.Mui-checked": {
                          color: theme.palette.success.main,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Checkbox
                      checked={
                        selectedRows.includes(permission.id)
                          ? true
                          : permissionChanges[permission.id]?.edit !== undefined
                          ? permissionChanges[permission.id].edit
                          : permission.edit
                      }
                      color="warning"
                      size="small"
                      onChange={() =>
                        handlePermissionChange(permission.id, "edit")
                      }
                      sx={{
                        "&.Mui-checked": {
                          color: theme.palette.warning.main,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Checkbox
                      checked={
                        selectedRows.includes(permission.id)
                          ? true
                          : permissionChanges[permission.id]?.view !== undefined
                          ? permissionChanges[permission.id].view
                          : permission.view
                      }
                      color="info"
                      size="small"
                      onChange={() =>
                        handlePermissionChange(permission.id, "view")
                      }
                      sx={{
                        "&.Mui-checked": {
                          color: theme.palette.info.main,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Checkbox
                      checked={
                        selectedRows.includes(permission.id)
                          ? true
                          : permissionChanges[permission.id]?.delete !==
                            undefined
                          ? permissionChanges[permission.id].delete
                          : permission.delete
                      }
                      color="error"
                      size="small"
                      onChange={() =>
                        handlePermissionChange(permission.id, "delete")
                      }
                      sx={{
                        "&.Mui-checked": {
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
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                          },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {permission.hasPermission && (
                      <Tooltip title="Delete Permission">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeletePermission(permission.id)}
                          sx={{
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.1
                              ),
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No user permissions found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {(selectedRows.length > 0 ||
        Object.keys(permissionChanges).length > 0) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Typography variant="body2">
            {selectedRows.length} row(s) and{" "}
            {Object.keys(permissionChanges).length} permission(s) selected
          </Typography>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={isUpdating || isCreating}
            sx={{
              borderRadius: 2,
              background: "linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)",
              boxShadow: "0 4px 10px rgba(156, 39, 176, 0.3)",
            }}
          >
            {isUpdating || isCreating ? "Updating..." : "Update Permissions"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MultipleAccess;
