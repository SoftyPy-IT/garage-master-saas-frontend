/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Fab,
  Container,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add,
  Search,
  Close,
  FilterList,
  ViewModule,
  Person,
  Group,
  Star,
  Security,
  AccountBalance,
  ManageAccounts,
  Dashboard,
  PersonPin,
  AssignmentTurnedIn,
  LibraryBooks,
  Description,
  Payments,
  Inventory,
  ShoppingCart,
  Assessment,
  Settings,
} from "@mui/icons-material";
import PermissionHeader from "./PermissionHeader";
import StatsCards from "./StatsCards";
import PermissionMatrixTab from "./PermissionMetrixTab";
import UserPermissionsTab from "./UserPermissionTab";
import AddEditPermissionDialog from "./PermissionDiloge";
import { useDeletePermissionMutation, useGetAllPermissionsQuery } from "../../redux/api/permissionApi";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import Swal from "sweetalert2";
import { selectCurrentUser } from "../../redux/feature/authSlice";
import { useSelector } from "react-redux";
import AddRoleModal from "../RoleManagement/AddRoleModal";
import PageForm from "../PageManagement/PageForm";
import Loading from "../../components/Loading/Loading";
import AddUserModal from "../Home/Tenant/AddUserModal";
import MultipleAccess from "./MultipleAccess";


const Permission = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPermissionId, setEditingPermissionId] = useState(null);
  const { tenantDomain } = useTenantDomain();
  const user = useSelector(selectCurrentUser);
  const [pageOpen, setPageOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const { data: permissionsData, isLoading: permissionsLoading } = useGetAllPermissionsQuery({ tenantDomain });
  const [deletePermission] = useDeletePermissionMutation()

  const pages = permissionsData?.data?.permissions
    ? [...new Map(permissionsData.data?.permissions
      .filter(item => item?.page?._id)
      .map(item => [item.page._id, item.page])
    ).values()]
    : [];

  const roles = permissionsData?.data?.permissions
    ? [...new Map(permissionsData?.data?.permissions
      .flatMap(item => item.roles || [])
      .filter(role => role?._id)
      .map(role => [role._id, role])
    ).values()]
    : [];

  // Use summary data from backend instead of calculating
  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    pages: 0,
    permissions: 0,
  });

  const transformPermissionData = (apiData) => {
    if (!apiData?.data) return [];

    return apiData.data.permissions?.flatMap(permission => {
      const roleArray = Array.isArray(permission.roles) ? permission.roles : [permission.roles];

      return roleArray.map(role => ({
        id: permission._id,
        permissionId: permission._id,
        roleId: role?._id || '',
        pageId: permission.page?._id || '',
        create: permission.create || false,
        edit: permission.edit || false,
        view: permission.view || false,
        delete: permission.delete || false,
        roleName: role?.name || 'Unknown Role',
        pageName: permission.page?.name || 'Unknown Page',
      }));
    });
  };

  const buildPermissionMatrix = () => {
    if (!permissionsData?.data) return [];

    const matrix = [];
    const pageCategories = [...new Set(pages.map(page => page.category).filter(Boolean))];

    pageCategories.forEach(category => {
      const categoryPages = pages.filter(page => page.category === category);
      const categoryPermissions = [];

      categoryPages.forEach(page => {
        const pagePermissions = permissionsData?.data?.permissions?.filter(p => p.page?._id === page._id);

        if (pagePermissions.length > 0) {
          const actions = ['view', 'create', 'edit', 'delete'];

          actions.forEach(action => {
            const permissionEntry = {
              name: `${action.charAt(0).toUpperCase() + action.slice(1)} ${page.name}`,
            };

            roles.forEach(role => {
              const roleKey = role?.name ? role.name.toLowerCase().replace(/\s+/g, '') : 'unknownrole';

              const hasPermission = pagePermissions.some(permission => {
                const roleArray = Array.isArray(permission.roles) ? permission.roles : [permission.roles];
                const roleMatch = roleArray.some(r => r._id === role._id);
                return roleMatch && permission[action];
              });

              permissionEntry[roleKey] = hasPermission;
            });

            categoryPermissions.push(permissionEntry);
          });
        }
      });

      if (categoryPermissions.length > 0) {
        matrix.push({
          category: category,
          icon: getCategoryIcon(category),
          permissions: categoryPermissions
        });
      }
    });

    return matrix;
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Main': <Dashboard />,
      'Client': <PersonPin />,
      'Jobcard': <AssignmentTurnedIn />,
      'Invoice': <LibraryBooks />,
      'Quotation': <Description />,
      'Payment': <Payments />,
      'Inventory': <Inventory />,
      'Purchase': <ShoppingCart />,
      'HRM': <Group />,
      'Accounts': <AccountBalance />,
      'Reports': <Assessment />,
      'Settings': <Settings />,
      'Permission': <Security />,
      'Role Management': <ManageAccounts />,
      'user-management': <Person />,
      'page-management': <ViewModule />,
      'Feature Access': <Star />,
      'All User List': <Group />,
      'Profile': <Person />,
      'Money Receipt Management': <Payments />,
      'Brand': <ViewModule />
    };

    return iconMap[category] || <ViewModule />;
  };

  useEffect(() => {
    if (permissionsData?.data) {
      const transformedPermissions = transformPermissionData(permissionsData);
      setPermissions(transformedPermissions);
      setFilteredPermissions(transformedPermissions);
      if (permissionsData.data.summary) {
        setStats({
          users: permissionsData.data.summary.totalUsers || 0,
          roles: permissionsData.data.summary.totalRoles || 0,
          pages: permissionsData.data.summary.totalPages || 0,
          permissions: permissionsData.data.summary.totalPermissions || 0,
        });
      }
    }
  }, [permissionsData]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPermissions(permissions);
    } else {
      const filtered = permissions.filter(
        (perm) =>
          perm.roleName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          perm.pageName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
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
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "An error occurred while deleting the permission.",
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

  const permissionMatrix = buildPermissionMatrix();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
      py: 3
    }}>
      <Container maxWidth="xl">
        <PermissionHeader />
        <StatsCards stats={stats} />

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
              label="User Permissions"
              icon={<Person />}
              iconPosition="start"
            />
            <Tab
              label="Permission Matrix"
              icon={<ViewModule />}
              iconPosition="start"
            />
            <Tab
              label="Multiple User Permission "
              icon={<ViewModule />}
              iconPosition="start"
            />
          </Tabs>

          <Box sx={{ mb: 3, display: "flex" }}>
            <TextField
              placeholder="Search permissions..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                borderRadius: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  '&:hover fieldset': {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <Close />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Tooltip title="Advanced Filters">
              <IconButton
                sx={{
                  ml: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                <FilterList />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>

            {tabValue === 0 && (
              <div>
                <UserPermissionsTab
                  filteredPermissions={filteredPermissions}
                  pages={pages}
                  roles={roles}
                  handleDialogOpen={handleDialogOpen}
                  handleDeletePermission={handleDeletePermission}
                  getRoleColor={getRoleColor}
                  loading={permissionsLoading}
                />
              </div>
            )}
            {tabValue === 1 && (
              <div>
                <PermissionMatrixTab
                  permissionMatrix={permissionMatrix}
                  roles={roles}
                />
              </div>
            )}
            {tabValue === 2 && (
              <div>
                <MultipleAccess
                  filteredPermissions={filteredPermissions}
                  pages={pages}
                  roles={roles}
                  handleDialogOpen={handleDialogOpen}
                  handleDeletePermission={handleDeletePermission}
                  getRoleColor={getRoleColor}
                  loading={permissionsLoading}
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
          open={userOpen}
          onClose={handleUserClose}
        />

        <Fab
          color="primary"
          aria-label="add permission"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
            boxShadow: '0 6px 20px rgba(156, 39, 176, 0.4)',
            width: 56,
            height: 56,
          }}
          onClick={() => handleDialogOpen()}
        >
          <Add />
        </Fab>

        {permissionsLoading && (
          <Loading />
        )}
      </Container>
    </Box>
  );
};

export default Permission;