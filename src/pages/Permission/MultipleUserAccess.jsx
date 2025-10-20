"use client";

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
  Typography,
  Checkbox,
  Box,
  Tooltip,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Button,
  Grid,
} from "@mui/material";
import { Edit, Delete, LibraryBooks, Save } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useCreateMultiplePermissionsMutation } from "../../redux/api/permissionApi.js";
import { usePermissionFormData } from "../../hooks/usePermissionFormData.js";
import GarageAutoCompleted from "../../components/form/Autocomplete.jsx";
import GarageForm from "../../components/form/Form.jsx";
import { purchaseBtn } from "../../utils/customStyle.js";
import { useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";

const MultipleUserAccess = ({
  handleDialogOpen,
  handleDeletePermission,
  getRoleColor,
  loading,
}) => {
  const theme = useTheme();
  const [createOrUpdateMultiplePermissions, { isLoading: isCreating }] =
    useCreateMultiplePermissionsMutation();
  const { roleOptions, pageData, userOptions } = usePermissionFormData();

  const methods = useForm({
    defaultValues: {
      user: [],
      role: [],
      permissions: {},
    },
  });

  const { watch, setValue, handleSubmit, control } = methods;

  // Watch for changes in form values
  const selectedUsers = watch("user") || [];
  const selectedRoles = watch("role") || [];
  const permissions = watch("permissions") || {};

  // Initialize form data when pageData changes
  useEffect(() => {
    if (pageData?.data) {
      const initialPermissions = {};

      pageData.data.forEach((permission) => {
        initialPermissions[permission.pageId] = {
          create: false,
          edit: false,
          view: false,
          delete: false,
        };
      });

      setValue("permissions", initialPermissions);
    }
  }, [pageData, setValue]);

  const getRowCheckboxState = (pageId) => {
    const perms = permissions[pageId];
    if (!perms) return { checked: false, indeterminate: false };

    const checkedCount = Object.values(perms).filter(Boolean).length;
    const totalPerms = 4; // create, edit, view, delete

    if (checkedCount === totalPerms) {
      return { checked: true, indeterminate: false };
    } else if (checkedCount > 0) {
      return { checked: false, indeterminate: true };
    } else {
      return { checked: false, indeterminate: false };
    }
  };

  const getHeaderCheckboxState = useMemo(() => {
    if (!pageData?.data || pageData.data.length === 0) {
      return { checked: false, indeterminate: false };
    }

    let fullyCheckedRows = 0;
    let partiallyCheckedRows = 0;

    pageData.data.forEach((permission) => {
      const rowState = getRowCheckboxState(permission.pageId);
      if (rowState.checked) {
        fullyCheckedRows++;
      } else if (rowState.indeterminate) {
        partiallyCheckedRows++;
      }
    });

    const totalRows = pageData.data.length;

    if (fullyCheckedRows === totalRows) {
      return { checked: true, indeterminate: false };
    } else if (fullyCheckedRows > 0 || partiallyCheckedRows > 0) {
      return { checked: false, indeterminate: true };
    } else {
      return { checked: false, indeterminate: false };
    }
  }, [permissions, pageData]);

  const handleSelectAll = (checked) => {
    const newPermissions = {};

    pageData?.data.forEach((permission) => {
      newPermissions[permission.pageId] = {
        create: checked,
        edit: checked,
        view: checked,
        delete: checked,
      };
    });

    setValue("permissions", newPermissions);
  };

  const handleRowSelect = (pageId, checked) => {
    const newPermissions = { ...permissions };

    newPermissions[pageId] = {
      create: checked,
      edit: checked,
      view: checked,
      delete: checked,
    };

    setValue("permissions", newPermissions);
  };

  const handlePermissionChange = (pageId, permissionType, checked) => {
    const newPermissions = { ...permissions };

    if (!newPermissions[pageId]) {
      newPermissions[pageId] = {
        create: false,
        edit: false,
        view: false,
        delete: false,
      };
    }

    newPermissions[pageId][permissionType] = checked;
    setValue("permissions", newPermissions);
  };

  // Check if any permission is selected
  const hasSelectedPermissions = () => {
    return Object.values(permissions).some((perms) =>
      Object.values(perms).some(Boolean)
    );
  };

  const handleMultiplePermission = async (data) => {
    try {
      const users = data.user || [];
      const roles = data.role || [];

      // Get pages that have at least one permission selected
      const selectedPages = Object.keys(data.permissions || {}).filter(
        (pageId) => {
          const perms = data.permissions[pageId];
          return Object.values(perms).some(Boolean);
        }
      );

      if (selectedPages.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "No Permissions Selected",
          text: "Please select at least one permission for a page.",
        });
        return;
      }

      if (users.length === 0 && roles.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "No Users or Roles Selected",
          text: "Please select at least one user or role to assign permissions.",
        });
        return;
      }

      // Prepare permission data for each selected page
      const permissionData = selectedPages.map((pageId) => {
        const pagePermissions = data.permissions?.[pageId] || {};
        return {
          pageId,
          create: pagePermissions.create || false,
          edit: pagePermissions.edit || false,
          view: pagePermissions.view || false,
          delete: pagePermissions.delete || false,
        };
      });

      // Create permissions for each user
      for (const user of users) {
        await createOrUpdateMultiplePermissions({
          tenantDomain: window.location.hostname,
          permissionData: {
            userId: user,
            permissions: permissionData,
          },
        }).unwrap();
      }

      // Create permissions for each role
      for (const role of roles) {
        await createOrUpdateMultiplePermissions({
          tenantDomain: window.location.hostname,
          permissionData: {
            roleId: role,
            permissions: permissionData,
          },
        }).unwrap();
      }

      Swal.fire({
        icon: "success",
        title: "Permissions Created",
        text: "Multiple permissions have been created successfully.",
      });

      // Reset form
      setValue("user", []);
      setValue("role", []);
      const resetPermissions = {};
      pageData?.data?.forEach((permission) => {
        resetPermissions[permission.pageId] = {
          create: false,
          edit: false,
          view: false,
          delete: false,
        };
      });
      setValue("permissions", resetPermissions);
    } catch (error) {
      console.error("Error creating permissions:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create permissions. Please try again.",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <GarageForm onSubmit={handleSubmit(handleMultiplePermission)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <GarageAutoCompleted
              fullWidth
              name="user"
              label="Select User"
              options={userOptions}
              multiple
              freeSolo
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <GarageAutoCompleted
              fullWidth
              name="role"
              label="Select Role"
              options={roleOptions}
              multiple
              freeSolo
            />
          </Grid>
        </Grid>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ 
            width: "100%",
            overflowX: "auto",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            mt: 2,
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
                    checked={getHeaderCheckboxState.checked}
                    indeterminate={getHeaderCheckboxState.indeterminate}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    sx={{
                      color: theme.palette.primary.main,
                      "&.Mui-checked": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                </TableCell>
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
              {pageData?.data?.map((permission) => {
                const rowState = getRowCheckboxState(permission.pageId);
                return (
                  <TableRow
                    key={permission.pageId}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.02
                        ),
                      },
                      backgroundColor: !permission.hasPermission
                        ? alpha(theme.palette.warning.main, 0.02)
                        : "inherit",
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={rowState.checked}
                        indeterminate={rowState.indeterminate}
                        onChange={(e) =>
                          handleRowSelect(permission.pageId, e.target.checked)
                        }
                        sx={{
                          color: theme.palette.primary.main,
                          "&.Mui-checked": {
                            color: theme.palette.primary.main,
                          },
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
                          {permission.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Checkbox
                        checked={
                          permissions[permission.pageId]?.create || false
                        }
                        onChange={(e) =>
                          handlePermissionChange(
                            permission.pageId,
                            "create",
                            e.target.checked
                          )
                        }
                        sx={{
                          color: theme.palette.success.main,
                          "&.Mui-checked": {
                            color: theme.palette.success.main,
                          },
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Checkbox
                        checked={permissions[permission.pageId]?.edit || false}
                        onChange={(e) =>
                          handlePermissionChange(
                            permission.pageId,
                            "edit",
                            e.target.checked
                          )
                        }
                        sx={{
                          color: theme.palette.warning.main,
                          "&.Mui-checked": {
                            color: theme.palette.warning.main,
                          },
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Checkbox
                        checked={permissions[permission.pageId]?.view || false}
                        onChange={(e) =>
                          handlePermissionChange(
                            permission.pageId,
                            "view",
                            e.target.checked
                          )
                        }
                        sx={{
                          color: theme.palette.info.main,
                          "&.Mui-checked": {
                            color: theme.palette.info.main,
                          },
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Checkbox
                        checked={
                          permissions[permission.pageId]?.delete || false
                        }
                        onChange={(e) =>
                          handlePermissionChange(
                            permission.pageId,
                            "delete",
                            e.target.checked
                          )
                        }
                        sx={{
                          color: theme.palette.error.main,
                          "&.Mui-checked": {
                            color: theme.palette.error.main,
                          },
                        }}
                        size="small"
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
                            onClick={() =>
                              handleDeletePermission(permission.id)
                            }
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
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            my: 2,
            width: "100%",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={isCreating || !hasSelectedPermissions()}
            sx={purchaseBtn}
          >
            {isCreating ? (
              <CircularProgress size={24} />
            ) : (
              "Create Multiple User Permission"
            )}
          </Button>
        </Box>
      </GarageForm>
    </FormProvider>
  );
};

export default MultipleUserAccess;
