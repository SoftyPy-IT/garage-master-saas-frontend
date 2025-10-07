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
  const [editingPermissionId, setEditingPermissionId] = useState(null); // NEW: Store only the _id
  const { tenantDomain } = useTenantDomain();

  const { data: permissionsData, isLoading: permissionsLoading } = useGetAllPermissionsQuery({ tenantDomain });

  // Extract unique pages and roles from permissions data with safety checks
  const pages = permissionsData?.data?.permissions
    ? [...new Map(permissionsData.data?.permissions
      .filter(item => item?.page?._id)
      .map(item => [item.page._id, item.page])
    ).values()]
    : [];

  // FIXED: Extract roles properly from roleId array
  const roles = permissionsData?.data?.permissions
    ? [...new Map(permissionsData?.data?.permissions
      .flatMap(item => item.roleId || []) // Use flatMap to handle arrays
      .filter(role => role?._id)
      .map(role => [role._id, role])
    ).values()]
    : [];

  // Transform API data to match component format
  const transformPermissionData = (apiData) => {
    if (!apiData?.data) return [];

    return apiData.data.permissions?.flatMap(permission => {

      const roleArray = Array.isArray(permission.roleId) ? permission.roleId : [permission.roleId];

      return roleArray.map(role => ({
        id: permission._id,
        permissionId: permission._id,
        userId: permission.userId?._id || '',
        roleId: role?._id || '',
        pageId: permission.page?._id || '',
        create: permission.create || false,
        edit: permission.edit || false,
        view: permission.view || false,
        delete: permission.delete || false,
        userName: permission.userId?.name || 'System',
        roleName: role?.name || 'Unknown Role',
        pageName: permission.page?.name || 'Unknown Page',
        userEmail: permission.userId?.email || 'system@example.com'
      }));
    });
  };

  // Build permission matrix from API data with safety checks
  const buildPermissionMatrix = () => {
    if (!permissionsData?.data) return [];

    const matrix = [];
    const pageCategories = [...new Set(pages.map(page => page.category).filter(Boolean))];

    pageCategories.forEach(category => {
      const categoryPages = pages.filter(page => page.category === category);
      const categoryPermissions = [];

      categoryPages.forEach(page => {
        // Get permissions for this page across all roles
        const pagePermissions = permissionsData?.data?.permissions?.filter(p => p.page?._id === page._id);

        if (pagePermissions.length > 0) {
          // Create permission entry for each CRUD action
          const actions = ['view', 'create', 'edit', 'delete'];

          actions.forEach(action => {
            const permissionEntry = {
              name: `${action.charAt(0).toUpperCase() + action.slice(1)} ${page.name}`,
            };

            // Add permission status for each role with safety checks
            roles.forEach(role => {
              const roleKey = role?.name ? role.name.toLowerCase().replace(/\s+/g, '') : 'unknownrole';

              // Check if any permission for this page has this role with the action enabled
              const hasPermission = pagePermissions.some(permission => {
                const roleArray = Array.isArray(permission.roleId) ? permission.roleId : [permission.roleId];
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
      'Settings': <Settings />,
      'Permission': <Security />,
      'Role Management': <ManageAccounts />,
      'user-management': <Person />,
      'page-management': <ViewModule />,
      'Feature Access': <Star />,
      'All User List': <Group />,
      'Profile': <Person />,
      'Money Receipt Management': <Payments />
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

    const uniqueUsers = new Set(permissionsData?.data?.permissions?.map(p => p.userId?._id).filter(Boolean)).size;
    const uniqueRoles = new Set(permissionsData?.data?.permissions?.flatMap(p => p.roleId || []).map(role => role._id).filter(Boolean)).size;
    const uniquePages = new Set(permissionsData?.data?.permissions?.map(p => p.page?._id).filter(Boolean)).size;

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
    // Filter permissions based on search term with safety checks
    if (searchTerm === "") {
      setFilteredPermissions(permissions);
    } else {
      const filtered = permissions.filter(
        (perm) =>
          perm.userName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          perm.roleName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          perm.pageName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
      setFilteredPermissions(filtered);
    }
  }, [searchTerm, permissions]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // NEW: Updated dialog handlers - only pass _id
  const handleDialogOpen = (permissionId = null) => {
    setEditingPermissionId(permissionId);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setEditingPermissionId(null);
    setOpenDialog(false);
  };

  // NEW: Handle permission save
  const handleSavePermission = (savedPermission) => {
    // You can refresh the data or update local state here
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
              onClick={() => handleDialogOpen()} // Open dialog without permission id (for create)
              color="secondary"
              sx={{
                borderRadius: 2,
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
              handleDialogOpen={handleDialogOpen} // Pass the function
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
        permissionId={editingPermissionId} // Pass only the _id
        permissionType={editingPermissionId ? "edit" : "add"} // Determine if it's add or edit
        handleSavePermission={handleSavePermission} // Pass the save handler
      />

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add permission"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => handleDialogOpen()} // Open for create
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