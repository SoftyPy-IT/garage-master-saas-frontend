/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Fab,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  Pageview,
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
import RolePermissionsTab from "./RolePermissionTab";
import PermissionTemplates from "./PermissionTemplate";
import AddEditPermissionDialog from "./PermissionDiloge";
import CheckPermissionDialog from "./CheckPermissionDiloge";
import { useGetAllPermissionsQuery } from "../../redux/api/permissionApi";
import { useTenantDomain } from "../../hooks/useTenantDomain";

const Permission = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCheckDialog, setOpenCheckDialog] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkPermissionForm, setCheckPermissionForm] = useState({
    userId: "",
    pageId: "",
    action: "view",
  });
  const [permissionResult, setPermissionResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const { tenantDomain } = useTenantDomain();

  const { data: permissionsData, isLoading: permissionsLoading } = useGetAllPermissionsQuery({ tenantDomain });

  // Extract unique pages and roles from permissions data
  const pages = permissionsData?.data
    ? [...new Map(permissionsData.data.map(item => [item.page._id, item.page])).values()]
    : [];

  const roles = permissionsData?.data
    ? [...new Map(permissionsData.data.map(item => [item.roleId._id, item.roleId])).values()]
    : [];

  // Transform API data to match component format
  const transformPermissionData = (apiData) => {
    if (!apiData?.data) return [];

    return apiData.data.map(permission => ({
      id: permission._id,
      userId: permission.userId?._id || '',
      roleId: permission.roleId._id,
      pageId: permission.page._id,
      create: permission.create,
      edit: permission.edit,
      view: permission.view,
      delete: permission.delete,
      userName: permission.userId?.name || 'System',
      roleName: permission.roleId.name,
      pageName: permission.page.name,
      userEmail: permission.userId?.email || 'system@example.com'
    }));
  };

  // Build permission matrix from API data
  const buildPermissionMatrix = () => {
    if (!permissionsData?.data) return [];

    const matrix = [];
    const pageCategories = [...new Set(pages.map(page => page.category))];

    pageCategories.forEach(category => {
      const categoryPages = pages.filter(page => page.category === category);
      const categoryPermissions = [];

      categoryPages.forEach(page => {
        // Get permissions for this page across all roles
        const pagePermissions = permissionsData.data.filter(p => p.page._id === page._id);

        if (pagePermissions.length > 0) {
          // Create permission entry for each CRUD action
          const actions = ['view', 'create', 'edit', 'delete'];

          actions.forEach(action => {
            const permissionEntry = {
              name: `${action.charAt(0).toUpperCase() + action.slice(1)} ${page.name}`,
            };

            // Add permission status for each role
            roles.forEach(role => {
              const rolePermission = pagePermissions.find(p => p.roleId._id === role._id);
              permissionEntry[role.name.toLowerCase().replace(' ', '')] = rolePermission ? rolePermission[action] : false;
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

  // Helper function to get icons for categories
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
      'Settings': <Settings />
    };

    return iconMap[category] || <ViewModule />;
  };

  // Calculate stats from actual data
  const calculateStats = () => {
    if (!permissionsData?.data) {
      return {
        users: 0,
        roles: 0,
        pages: 0,
        permissions: 0,
      };
    }

    const uniqueUsers = new Set(permissionsData.data.map(p => p.userId?._id).filter(Boolean)).size;
    const uniqueRoles = new Set(permissionsData.data.map(p => p.roleId._id)).size;
    const uniquePages = new Set(permissionsData.data.map(p => p.page._id)).size;

    return {
      users: uniqueUsers,
      roles: uniqueRoles,
      pages: uniquePages,
      permissions: permissionsData.data.length,
    };
  };

  const [stats, setStats] = useState(calculateStats());

  useEffect(() => {
    if (permissionsData?.data) {
      const transformedPermissions = transformPermissionData(permissionsData);
      setPermissions(transformedPermissions);
      setFilteredPermissions(transformedPermissions);
      setStats(calculateStats());
    }
  }, [permissionsData]);

  useEffect(() => {
    // Filter permissions based on search term
    if (searchTerm === "") {
      setFilteredPermissions(permissions);
    } else {
      const filtered = permissions.filter(
        (perm) =>
          perm.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          perm.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          perm.pageName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPermissions(filtered);
    }
  }, [searchTerm, permissions]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleCheckDialogOpen = () => {
    setCheckPermissionForm({
      userId: "",
      pageId: "",
      action: "view",
    });
    setPermissionResult(null);
    setShowResult(false);
    setOpenCheckDialog(true);
  }

  const handleCheckDialogClose = () => {
    setOpenCheckDialog(false);
  };

  const handleCheckFormChange = (e) => {
    const { name, value } = e.target;
    setCheckPermissionForm({
      ...checkPermissionForm,
      [name]: value,
    });
  };

  const handleCheckPermission = () => {
    setLoading(true);
    setTimeout(() => {
      // Check permission against actual data
      const hasPermission = permissionsData?.data?.some(permission =>
        permission.userId?._id === checkPermissionForm.userId &&
        permission.page._id === checkPermissionForm.pageId &&
        permission[checkPermissionForm.action] === true
      ) || false;

      setPermissionResult(hasPermission);
      setShowResult(true);
      setLoading(false);
    }, 800);
  };

  const handleDeletePermission = (id) => {
    setLoading(true);
    setTimeout(() => {
      setPermissions(permissions.filter((p) => p.id !== id));
      setLoading(false);
    }, 800);
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
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <PermissionHeader />

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Content */}
      <Card elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight="bold">
            Permission Controls
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleDialogOpen("user")}
              sx={{
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              Add Permission
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Pageview />}
              onClick={handleCheckDialogOpen}
              sx={{
                borderRadius: 2,
              }}
            >
              Check Permission
            </Button>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="permission tabs"
          sx={{ mb: 3 }}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            label="Permission Matrix"
            icon={<ViewModule />}
            iconPosition="start"
          />
          <Tab
            label="User Permissions"
            icon={<Person />}
            iconPosition="start"
          />
          <Tab label="Role Permissions" icon={<Group />} iconPosition="start" />
        </Tabs>

        {/* Search Bar */}
        <Box sx={{ mb: 3, display: "flex", }}>
          <TextField
            placeholder="Search permissions..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
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
            <IconButton sx={{ ml: 1 }}>
              <FilterList />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Tab Content */}
        <Box>
          {/* Permission Matrix Tab */}
          {tabValue === 0 && (
            <PermissionMatrixTab
              permissionMatrix={permissionMatrix}
              roles={roles}
            />
          )}

          {/* User Permissions Tab */}
          {tabValue === 1 && (
            <UserPermissionsTab
              filteredPermissions={filteredPermissions}
              pages={pages}
              roles={roles}
              handleDialogOpen={handleDialogOpen}
              handleDeletePermission={handleDeletePermission}
              getRoleColor={getRoleColor}
              loading={permissionsLoading}
            />
          )}

          {/* Role Permissions Tab */}
          {tabValue === 2 && (
            <RolePermissionsTab
              roles={roles}
              permissionMatrix={permissionMatrix}
              handleDialogOpen={handleDialogOpen}
            />
          )}
        </Box>
      </Card>

      {/* Permission Templates */}
      <PermissionTemplates />

      {/* Add/Edit Permission Dialog */}
      <AddEditPermissionDialog
        open={openDialog}
        handleClose={handleDialogClose}
      />

      {/* Check Permission Dialog */}
      <CheckPermissionDialog
        open={openCheckDialog}
        handleClose={handleCheckDialogClose}
        checkPermissionForm={checkPermissionForm}
        handleCheckFormChange={handleCheckFormChange}
        handleCheckPermission={handleCheckPermission}
        users={permissions.map(p => ({ id: p.userId, name: p.userName, email: p.userEmail }))}
        pages={pages}
        showResult={showResult}
        permissionResult={permissionResult}
      />

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add permission"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => handleDialogOpen("user")}
      >
        <Add />
      </Fab>

      {/* Loading Overlay */}
      {(loading || permissionsLoading) && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
    </Box>
  );
};

export default Permission;
