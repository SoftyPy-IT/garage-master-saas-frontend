/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Container,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add,
  ViewModule,
  Person,
  Security,
} from "@mui/icons-material";
import PermissionHeader from "./PermissionHeader";
import UserPermissionsTab from "./UserPermissionTab";
import AddEditPermissionDialog from "./PermissionDiloge";
import { useDeletePermissionMutation, useDeleteMultiplePermissionsMutation, useGetAllUserPermissionsQuery } from "../../redux/api/permissionApi";
import Swal from "sweetalert2";
import { selectCurrentUser } from "../../redux/feature/authSlice";
import { useSelector } from "react-redux";
import AddRoleModal from "../RoleManagement/AddRoleModal";
import PageForm from "../PageManagement/PageForm";
import Loading from "../../components/Loading/Loading";
import AddUserModal from "../Home/Tenant/AddUserModal";
import MultipleAccess from "./MultipleAccess";
import { useAppOptions } from "../../hooks/useAppOptions";

const Permission = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPermissionId, setEditingPermissionId] = useState(null);
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const user = useSelector(selectCurrentUser);
  const [pageOpen, setPageOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    role: '',
    user: '',
    searchTerm: ''
  });
  const { data: permissionData, isLoading: permissionsLoading, refetch } = useGetAllUserPermissionsQuery({
    tenantDomain,
    ...filters
  })

  const [deletePermission] = useDeletePermissionMutation()
  const [deleteMultiplePermissions] = useDeleteMultiplePermissionsMutation()

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  // Refetch data when filters change
  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  useEffect(() => {
    if (permissionData?.data?.permissions) {
      setPermissions(permissionData.data.permissions);
      setFilteredPermissions(permissionData.data.permissions);
    }
  }, [permissionData]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPermissions(permissions);
    } else {
      const filtered = permissions.filter(
        (perm) => {
          const page = perm.pageId && perm.pageId.length > 0 ? perm.pageId[0] : {};
          const role = perm.roleId && perm.roleId.length > 0 ? perm.roleId[0] : {};
          const user = perm.userId && perm.userId.length > 0 ? perm.userId[0] : {};

          return (
            role.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
            page.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
            page.path?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
            user.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
            user.email?.toLowerCase()?.includes(searchTerm?.toLowerCase())
          );
        }
      );
      setFilteredPermissions(filtered);
    }
  }, [searchTerm, permissions]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDialogOpen = (permissionId = null) => {
    setEditingPermissionId(permissionId);
    setOpenDialog(true);
  };

  const handlePageOpen = () => setPageOpen(true)
  const handlePageClose = () => setPageOpen(false)
  const handleRoleOpen = () => setRoleOpen(true)
  const handleRoleClose = () => setRoleOpen(false)
  const handleUserOpen = () => setUserOpen(true)
  const handleUserClose = () => setUserOpen(false)

  const handleDialogClose = () => {
    setEditingPermissionId(null);
    setOpenDialog(false);
  };

  const handleDeletePermission = async (id) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: theme.palette.error.main,
      confirmButtonText: "Yes, delete it!",
      background: "#fff",
    });

    if (confirmResult.isConfirmed) {
      try {
        await deletePermission({
          userId: user?.userId,
          tenantDomain,
          id,
        }).unwrap();

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The permission has been deleted successfully.",
          showConfirmButton: false,
          timer: 2000,
          background: "#fff",
        });

        // Refetch data to update the table
        refetch();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error?.data?.message || "An error occurred while deleting the permission.",
          confirmButtonColor: theme.palette.primary.main,
          background: "#fff",
        });
      }
    }
  };

  const handleDeleteMultiplePermissions = async (permissionIds) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${permissionIds.length} permission(s). You won't be able to revert this!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.palette.primary.main,
      cancelButtonColor: theme.palette.error.main,
      confirmButtonText: "Yes, delete them!",
      background: "#fff",
    });

    if (confirmResult.isConfirmed) {
      try {
        const result = await deleteMultiplePermissions({
          userId: user?.userId,
          tenantDomain,
          permissionIds,
        }).unwrap();

        const { successful, failed } = result.data;

        Swal.fire({
          icon: successful > 0 ? "success" : "error",
          title: successful > 0 ? "Deleted!" : "Error!",
          html: `
            <div>
              ${successful > 0 ? `<p>${successful} permission(s) deleted successfully.</p>` : ''}
              ${failed > 0 ? `<p>${failed} permission(s) could not be deleted.</p>` : ''}
            </div>
          `,
          showConfirmButton: true,
          confirmButtonColor: theme.palette.primary.main,
          background: "#fff",
        });

        // Refetch data to update the table
        refetch();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error?.data?.message || "An error occurred while deleting the permissions.",
          confirmButtonColor: theme.palette.primary.main,
          background: "#fff",
        });
      }
    }
  };

  const getRoleColor = (roleName) => {
    const roleColors = {
      'Super Admin': 'primary',
      'Admin': 'secondary',
      'Accountant': 'info',
      'Manager': 'warning',
      'User': 'success'
    };
    return roleColors[roleName] || 'default';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
      py: 3
    }}>
      <Container maxWidth="xl">
        <PermissionHeader />
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            flexWrap="wrap"
            gap={2}
          >
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              Permission Controls
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<Person />}
                onClick={handleUserOpen}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.2,
                  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                  boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
                }}
              >
                Create User
              </Button>

              <Button
                variant="contained"
                startIcon={<ViewModule />}
                onClick={handlePageOpen}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.2,
                  background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                  boxShadow: '0 4px 10px rgba(76, 175, 80, 0.3)',
                }}
              >
                Create Page
              </Button>

              <Button
                variant="contained"
                startIcon={<Security />}
                onClick={handleRoleOpen}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.2,
                  background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
                  boxShadow: '0 4px 10px rgba(255, 152, 0, 0.3)',
                }}
              >
                Create Role
              </Button>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleDialogOpen()}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.2,
                  background: 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
                  boxShadow: '0 4px 10px rgba(156, 39, 176, 0.3)',
                }}
              >
                Add Permission
              </Button>
            </Box>
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="permission tabs"
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                minHeight: 48,
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main,
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 3,
              }
            }}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >

            <Tab
              label="Multiple User Permission "
              icon={<Person />}
              iconPosition="start"
            />

            <Tab
              label="User Permissions "
              icon={<ViewModule />}
              iconPosition="start"
            />

          </Tabs>

          <Box>

            {tabValue === 0 && (
              <div>
                <MultipleAccess
                  filteredPermissions={filteredPermissions}
                  handleDialogOpen={handleDialogOpen}
                  handleDeletePermission={handleDeletePermission}
                  getRoleColor={getRoleColor}
                  loading={permissionsLoading}
                />
              </div>
            )}

            {tabValue === 1 && (
              <div>

                <UserPermissionsTab
                  permissionData={permissionData?.data || {}}
                  loading={permissionsLoading}
                  onPageChange={handlePageChange}
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  handleDialogOpen={handleDialogOpen}
                  handleDeletePermission={handleDeletePermission}
                  handleDeleteMultiplePermissions={handleDeleteMultiplePermissions}
                  getRoleColor={getRoleColor}
                />
              </div>
            )}

          </Box>
        </Paper>

        <AddEditPermissionDialog
          setOpen={setOpenDialog}
          open={openDialog}
          handleClose={handleDialogClose}
          permissionId={editingPermissionId}
          permissionType={editingPermissionId ? "edit" : "add"}
        />


        <AddRoleModal
          open={roleOpen}
          onClose={handleRoleClose}
        />

        <PageForm
          setOpen={setOpenDialog}
          open={pageOpen}
          onClose={handlePageClose}
          tenantDomain={tenantDomain}
        />

        <AddUserModal
          performActionWithPermission={performActionWithPermission}
          tenantDomain={tenantDomain}
          open={userOpen}
          onClose={handleUserClose}
        />



        {permissionsLoading && (
          <Loading />
        )}
      </Container>
    </Box>
  );
};

export default Permission;