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
  console.log("permissionsData", permissionsData);
  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    pages: 0,
    permissions: 0,
  });


  const users = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Accountant",
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert@example.com",
      role: "User",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@example.com",
      role: "Manager",
    },
  ];

  const roles = [
    { id: "1", name: "Super Admin", color: "primary", icon: <Star /> },
    { id: "2", name: "Admin", color: "secondary", icon: <Security /> },
    { id: "3", name: "Accountant", color: "info", icon: <AccountBalance /> },
    { id: "4", name: "Manager", color: "warning", icon: <ManageAccounts /> },
    { id: "5", name: "User", color: "success", icon: <Person /> },
  ];

  const pages = [
    { id: "1", name: "Dashboard", icon: <Dashboard /> },
    { id: "2", name: "Client Management", icon: <PersonPin /> },
    { id: "3", name: "Jobcard Management", icon: <AssignmentTurnedIn /> },
    { id: "4", name: "Invoice Management", icon: <LibraryBooks /> },
    { id: "5", name: "Quotation Management", icon: <Description /> },
    { id: "6", name: "Money Receipt", icon: <Payments /> },
    { id: "7", name: "Supplier Management", icon: <Inventory /> },
    { id: "8", name: "Inventory", icon: <ViewModule /> },
    { id: "9", name: "Purchase", icon: <ShoppingCart /> },
    { id: "10", name: "HRM", icon: <Group /> },
    { id: "11", name: "Accounts", icon: <AccountBalance /> },
    { id: "12", name: "Reports", icon: <Assessment /> },
    { id: "13", name: "Settings", icon: <Settings /> },
  ];

  const mockPermissions = [
    {
      id: "1",
      userId: "1",
      roleId: "2",
      pageId: "2",
      create: true,
      edit: true,
      view: true,
      delete: false,
      userName: "John Doe",
      roleName: "Admin",
      pageName: "Client Management",
    },
    {
      id: "2",
      userId: "2",
      roleId: "3",
      pageId: "4",
      create: true,
      edit: true,
      view: true,
      delete: false,
      userName: "Jane Smith",
      roleName: "Accountant",
      pageName: "Invoice Management",
    },
    {
      id: "3",
      userId: "3",
      roleId: "5",
      pageId: "3",
      create: false,
      edit: false,
      view: true,
      delete: false,
      userName: "Robert Johnson",
      roleName: "User",
      pageName: "Jobcard Management",
    },
    {
      id: "4",
      userId: "4",
      roleId: "4",
      pageId: "6",
      create: true,
      edit: true,
      view: true,
      delete: false,
      userName: "Emily Davis",
      roleName: "Manager",
      pageName: "Money Receipt",
    },
  ];

  const permissionMatrix = [
    {
      category: "Client Management",
      icon: <PersonPin />,
      permissions: [
        {
          name: "View Clients",
          superadmin: true,
          admin: true,
          accountant: true,
          manager: true,
          user: true,
        },
        {
          name: "Create Client",
          superadmin: true,
          admin: true,
          accountant: false,
          manager: true,
          user: false,
        },
        {
          name: "Edit Client",
          superadmin: true,
          admin: true,
          accountant: false,
          manager: true,
          user: false,
        },
        {
          name: "Delete Client",
          superadmin: true,
          admin: false,
          accountant: false,
          manager: false,
          user: false,
        },
      ],
    },
    {
      category: "Jobcard Management",
      icon: <AssignmentTurnedIn />,
      permissions: [
        {
          name: "View Jobcards",
          superadmin: true,
          admin: true,
          accountant: true,
          manager: true,
          user: true,
        },
        {
          name: "Create Jobcard",
          superadmin: true,
          admin: true,
          accountant: false,
          manager: true,
          user: true,
        },
        {
          name: "Edit Jobcard",
          superadmin: true,
          admin: true,
          accountant: false,
          manager: true,
          user: false,
        },
        {
          name: "Delete Jobcard",
          superadmin: true,
          admin: false,
          accountant: false,
          manager: false,
          user: false,
        },
      ],
    },
    {
      category: "Invoice Management",
      icon: <LibraryBooks />,
      permissions: [
        {
          name: "View Invoices",
          superadmin: true,
          admin: true,
          accountant: true,
          manager: true,
          user: true,
        },
        {
          name: "Create Invoice",
          superadmin: true,
          admin: true,
          accountant: true,
          manager: true,
          user: false,
        },
        {
          name: "Edit Invoice",
          superadmin: true,
          admin: true,
          accountant: true,
          manager: true,
          user: false,
        },
        {
          name: "Delete Invoice",
          superadmin: true,
          admin: false,
          accountant: false,
          manager: false,
          user: false,
        },
      ],
    },
    {
      category: "Quotation Management",
      icon: <Description />,
      permissions: [
        {
          name: "View Quotations",
          superadmin: true,
          admin: true,
          accountant: true,
          manager: true,
          user: true,
        },
        {
          name: "Create Quotation",
          superadmin: true,
          admin: true,
          accountant: false,
          manager: true,
          user: false,
        },
        {
          name: "Edit Quotation",
          superadmin: true,
          admin: true,
          accountant: false,
          manager: true,
          user: false,
        },
        {
          name: "Delete Quotation",
          superadmin: true,
          admin: false,
          accountant: false,
          manager: false,
          user: false,
        },
      ],
    },
    {
      category: "Money Receipt Management",
      icon: <Payments />,
      permissions: [
        {
          name: "View Money Receipts",
          superadmin: true,
          admin: true,
          accountant: true,
          manager: true,
          user: true,
        },
        {
          name: "Create Money Receipt",
          superadmin: true,
          admin: true,
          accountant: true,
          manager: true,
          user: false,
        },
        {
          name: "Edit Money Receipt",
          superadmin: true,
          admin: true,
          accountant: true,
          manager: true,
          user: false,
        },
        {
          name: "Delete Money Receipt",
          superadmin: true,
          admin: false,
          accountant: false,
          manager: false,
          user: false,
        },
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call to fetch permissions
    setLoading(true);
    setTimeout(() => {
      setPermissions(mockPermissions);
      setFilteredPermissions(mockPermissions);
      setStats({
        users: users.length,
        roles: roles.length,
        pages: pages.length,
        permissions: mockPermissions.length,
      });
      setLoading(false);
    }, 800);
  }, []);

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


      const hasPermission = Math.random() > 0.3;
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
    const role = roles.find((r) => r.name === roleName);
    return role ? role.color : "default";
  };

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
        <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
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
              users={users}
              pages={pages}
              roles={roles}
              handleDialogOpen={handleDialogOpen}
              handleDeletePermission={handleDeletePermission}
              getRoleColor={getRoleColor}
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
        users={users}
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
      {loading && (
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
