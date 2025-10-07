// pages/PermissionManagement.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  InputAdornment,
  Tooltip,
  IconButton,
  Badge,
  useTheme,
  alpha,
  Alert,
  CircularProgress,
  Fab,
} from "@mui/material";
import {
  Security,
  Person,
  Group,
  Pageview,
  Edit,
  Delete,
  Add,
  CheckCircle,
  Cancel,
  Visibility,
  Settings,
  FilterList,
  Search,
  Close,
  Save,
  AssignmentTurnedIn,
  AccountTree,
  LibraryBooks,
  AdminPanelSettings,
  PersonPin,
  ManageAccounts,
  GppGood,
  GppBad,
  VerifiedUser,
  NoAccounts,
  Dashboard,
  Description,
  Payments,
  Inventory as InventoryIcon,
  ShoppingCart,
  AccountBalance,
  Assessment,
  Star,
  StarBorder,
  Lock,
  LockOpen,
  ViewModule,
  ViewList,
  ViewComfy,
  ViewColumn,
  ViewAgenda,
} from "@mui/icons-material";

const PermissionManagement = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCheckDialog, setOpenCheckDialog] = useState(false);
  const [permissionType, setPermissionType] = useState("user");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [permissionForm, setPermissionForm] = useState({
    userId: "",
    roleId: "",
    pageId: "",
    create: false,
    edit: false,
    view: false,
    delete: false,
  });
  const [checkPermissionForm, setCheckPermissionForm] = useState({
    userId: "",
    pageId: "",
    action: "view",
  });
  const [permissionResult, setPermissionResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("matrix");
  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    pages: 0,
    permissions: 0,
  });

  // Static data for demonstration
  const users = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Accountant" },
    { id: "3", name: "Robert Johnson", email: "robert@example.com", role: "User" },
    { id: "4", name: "Emily Davis", email: "emily@example.com", role: "Manager" },
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
    { id: "7", name: "Supplier Management", icon: <InventoryIcon /> },
    { id: "8", name: "Inventory", icon: <ViewModule /> },
    { id: "9", name: "Purchase", icon: <ShoppingCart /> },
    { id: "10", name: "HRM", icon: <Group /> },
    { id: "11", name: "Accounts", icon: <AccountBalance /> },
    { id: "12", name: "Reports", icon: <Assessment /> },
    { id: "13", name: "Settings", icon: <Settings /> },
  ];

  // Mock permissions data
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

  // Permission matrix data
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

  const handleDialogOpen = (type, id = null) => {
    setPermissionType(type);
    if (id) {
      // Edit existing permission
      const permission = permissions.find((p) => p.id === id);
      if (permission) {
        setPermissionForm({
          userId: permission.userId,
          roleId: permission.roleId,
          pageId: permission.pageId,
          create: permission.create,
          edit: permission.edit,
          view: permission.view,
          delete: permission.delete,
        });
      }
    } else {
      // Create new permission
      setPermissionForm({
        userId: "",
        roleId: "",
        pageId: "",
        create: false,
        edit: false,
        view: false,
        delete: false,
      });
    }
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
  };

  const handleCheckDialogClose = () => {
    setOpenCheckDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value, checked } = e.target;
    setPermissionForm({
      ...permissionForm,
      [name]: name === "create" || name === "edit" || name === "view" || name === "delete" ? checked : value,
    });
  };

  const handleCheckFormChange = (e) => {
    const { name, value } = e.target;
    setCheckPermissionForm({
      ...checkPermissionForm,
      [name]: value,
    });
  };

  const handleSavePermission = () => {
    // Simulate API call to save permission
    setLoading(true);
    setTimeout(() => {

      // Update local state for demo
      const newPermission = {
        id: (permissions.length + 1).toString(),
        userId: permissionForm.userId,
        roleId: permissionForm.roleId,
        pageId: permissionForm.pageId,
        create: permissionForm.create,
        edit: permissionForm.edit,
        view: permissionForm.view,
        delete: permissionForm.delete,
        userName: users.find(u => u.id === permissionForm.userId)?.name || "",
        roleName: roles.find(r => r.id === permissionForm.roleId)?.name || "",
        pageName: pages.find(p => p.id === permissionForm.pageId)?.name || "",
      };

      setPermissions([...permissions, newPermission]);
      setLoading(false);
      setOpenDialog(false);
    }, 800);
  };

  const handleCheckPermission = () => {
    // Simulate API call to check permission
    setLoading(true);
    setTimeout(() => {
      const hasPermission = Math.random() > 0.3;
      setPermissionResult(hasPermission);
      setShowResult(true);
      setLoading(false);
    }, 800);
  };

  const handleDeletePermission = (id) => {
    // Simulate API call to delete permission
    setLoading(true);
    setTimeout(() => {
      // Update local state for demo
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
      <Card
        elevation={0}
        sx={{
          mb: 2,
          p: 2,


        }}
      >
        <Box position="absolute" top={-20} right={-20} width={200} height={200} borderRadius="50%"
          sx={{ background: alpha(theme.palette.primary.light, 0.1) }} />
        <Box position="absolute" bottom={-30} left={-30} width={250} height={250} borderRadius="50%"
          sx={{ background: alpha(theme.palette.primary.light, 0.1) }} />

        <Box position="relative" zIndex={1}>
          <Typography variant="h3" fontWeight="bold" mb={1}>
            Permission Management
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
            Advanced permission control and access management system
          </Typography>
        </Box>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.dark, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mr: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  color: theme.palette.primary.main,
                }}
              >
                <Person />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.users}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.secondary.dark, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mr: 2,
                  bgcolor: alpha(theme.palette.secondary.main, 0.2),
                  color: theme.palette.secondary.main,
                }}
              >
                <Group />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Roles
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.roles}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)}, ${alpha(theme.palette.info.dark, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mr: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.2),
                  color: theme.palette.info.main,
                }}
              >
                <LibraryBooks />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Pages
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.pages}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.success.dark, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mr: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.2),
                  color: theme.palette.success.main,
                }}
              >
                <Security />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Permissions
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.permissions}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

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
          <Tab
            label="Role Permissions"
            icon={<Group />}
            iconPosition="start"
          />
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
            <Box>
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableRow>
                      <TableCell>Permission</TableCell>
                      {roles.map((role) => (
                        <TableCell key={role.id} align="center">
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 1,
                                bgcolor: alpha(theme.palette[role.color].main, 0.1),
                                color: theme.palette[role.color].main,
                              }}
                            >
                              {role.icon}
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>
                              {role.name}
                            </Typography>
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {permissionMatrix.map((category, catIndex) => (
                      <React.Fragment key={catIndex}>
                        <TableRow>
                          <TableCell
                            colSpan={roles.length + 1}
                            sx={{ py: 1, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}
                          >
                            <Box display="flex" alignItems="center">
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  mr: 2,
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main,
                                }}
                              >
                                {category.icon}
                              </Avatar>
                              <Typography variant="body1" fontWeight={600}>
                                {category.category}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                        {category.permissions.map((permission, permIndex) => (
                          <TableRow key={permIndex}>
                            <TableCell sx={{ pl: 4 }}>
                              <Typography variant="body2">
                                {permission.name}
                              </Typography>
                            </TableCell>
                            {roles.map((role) => (
                              <TableCell key={role.id} align="center">
                                <Checkbox
                                  checked={permission[role.name.toLowerCase()]}
                                  color="primary"
                                  inputProps={{
                                    "aria-label": `${permission.name} for ${role.name}`,
                                  }}
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* User Permissions Tab */}
          {tabValue === 1 && (
            <Box>
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Page</TableCell>
                      <TableCell>Create</TableCell>
                      <TableCell>Edit</TableCell>
                      <TableCell>View</TableCell>
                      <TableCell>Delete</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPermissions.length > 0 ? (
                      filteredPermissions.map((permission) => (
                        <TableRow key={permission.id} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  mr: 2,
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main,
                                }}
                              >
                                <Person />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {permission.userName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {users.find(u => u.id === permission.userId)?.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={permission.roleName}
                              size="small"
                              color={getRoleColor(permission.roleName)}
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  mr: 1,
                                  bgcolor: alpha(theme.palette.info.main, 0.1),
                                  color: theme.palette.info.main,
                                }}
                              >
                                {pages.find(p => p.name === permission.pageName)?.icon || <LibraryBooks />}
                              </Avatar>
                              <Typography variant="body2">
                                {permission.pageName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={permission.create}
                              color="success"
                              size="small"
                              disabled
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={permission.edit}
                              color="warning"
                              size="small"
                              disabled
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={permission.view}
                              color="info"
                              size="small"
                              disabled
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={permission.delete}
                              color="error"
                              size="small"
                              disabled
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit Permission">
                              <IconButton
                                size="small"
                                onClick={() => handleDialogOpen("edit", permission.id)}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Permission">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeletePermission(permission.id)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No permissions found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Role Permissions Tab */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              {roles.map((role) => (
                <Grid item xs={12} md={6} key={role.id}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      height: "100%",
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette[role.color].main, 0.2)}`,
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={3}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          mr: 2,
                          bgcolor: alpha(theme.palette[role.color].main, 0.1),
                          color: theme.palette[role.color].main,
                        }}
                      >
                        {role.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight={600}>
                        {role.name}
                      </Typography>
                    </Box>

                    <List dense>
                      {permissionMatrix.map((category, catIndex) => (
                        <div key={catIndex}>
                          <Typography
                            variant="body1"
                            fontWeight={500}
                            mt={1}
                            mb={1}
                            color={theme.palette[role.color].main}
                          >
                            {category.category}
                          </Typography>
                          {category.permissions.map((permission, permIndex) => (
                            <ListItem key={permIndex} disablePadding>
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={permission[role.name.toLowerCase()]}
                                  tabIndex={-1}
                                  disableRipple
                                  color={role.color}
                                />
                              </ListItemIcon>
                              <ListItemText primary={permission.name} />
                            </ListItem>
                          ))}
                          {catIndex < permissionMatrix.length - 1 && (
                            <Divider component="li" sx={{ my: 1 }} />
                          )}
                        </div>
                      ))}
                    </List>

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Button
                        variant="outlined"
                        size="small"
                        color={role.color}
                        onClick={() => handleDialogOpen("role")}
                      >
                        Edit Permissions
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Card>

      {/* Permission Templates */}
      <Card elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Permission Templates
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  <VerifiedUser />
                </Avatar>
                <Typography variant="h6" fontWeight={600}>
                  Admin Template
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Full access to all system features and configurations
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                <Chip label="Manage Users" size="small" />
                <Chip label="System Settings" size="small" />
                <Chip label="All Permissions" size="small" />
              </Box>
              <Button variant="contained" fullWidth sx={{ borderRadius: 2 }}>
                Apply to Role
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 2,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                  }}
                >
                  <ManageAccounts />
                </Avatar>
                <Typography variant="h6" fontWeight={600}>
                  Manager Template
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Access to operations with limited system configuration
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                <Chip label="Manage Clients" size="small" />
                <Chip label="View Reports" size="small" />
                <Chip label="Process Payments" size="small" />
              </Box>
              <Button variant="contained" fullWidth color="secondary" sx={{ borderRadius: 2 }}>
                Apply to Role
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                  }}
                >
                  <PersonPin />
                </Avatar>
                <Typography variant="h6" fontWeight={600}>
                  User Template
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Basic access to view and perform assigned tasks
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                <Chip label="View Data" size="small" />
                <Chip label="Create Entries" size="small" />
                <Chip label="Limited Access" size="small" />
              </Box>
              <Button variant="contained" fullWidth color="info" sx={{ borderRadius: 2 }}>
                Apply to Role
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Card>

      {/* Add/Edit Permission Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, overflow: "hidden" },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            py: 3,
          }}
        >
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                mr: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              <Security />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {permissionType === "edit" ? "Edit Permission" : "Add New Permission"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure access control for users and roles
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            {permissionType !== "role" && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>User</InputLabel>
                  <Select
                    name="userId"
                    value={permissionForm.userId}
                    onChange={handleFormChange}
                    label="User"
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              mr: 2,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                            }}
                          >
                            <Person fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{user.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {permissionType !== "user" && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="roleId"
                    value={permissionForm.roleId}
                    onChange={handleFormChange}
                    label="Role"
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              mr: 2,
                              bgcolor: alpha(theme.palette[role.color].main, 0.1),
                              color: theme.palette[role.color].main,
                            }}
                          >
                            {role.icon}
                          </Avatar>
                          {role.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Page</InputLabel>
                <Select
                  name="pageId"
                  value={permissionForm.pageId}
                  onChange={handleFormChange}
                  label="Page"
                >
                  {pages.map((page) => (
                    <MenuItem key={page.id} value={page.id}>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            mr: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                          }}
                        >
                          {page.icon}
                        </Avatar>
                        {page.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Permissions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                      bgcolor: alpha(theme.palette.success.main, 0.02),
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={1}>
                      <Checkbox
                        name="create"
                        checked={permissionForm.create}
                        onChange={handleFormChange}
                        color="success"
                      />
                      <Typography variant="body2" fontWeight={500}>
                        Create
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Ability to create new entries
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                      bgcolor: alpha(theme.palette.warning.main, 0.02),
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={1}>
                      <Checkbox
                        name="edit"
                        checked={permissionForm.edit}
                        onChange={handleFormChange}
                        color="warning"
                      />
                      <Typography variant="body2" fontWeight={500}>
                        Edit
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Ability to modify existing entries
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                      bgcolor: alpha(theme.palette.info.main, 0.02),
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={1}>
                      <Checkbox
                        name="view"
                        checked={permissionForm.view}
                        onChange={handleFormChange}
                        color="info"
                      />
                      <Typography variant="body2" fontWeight={500}>
                        View
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Ability to view entries
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                      bgcolor: alpha(theme.palette.error.main, 0.02),
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={1}>
                      <Checkbox
                        name="delete"
                        checked={permissionForm.delete}
                        onChange={handleFormChange}
                        color="error"
                      />
                      <Typography variant="body2" fontWeight={500}>
                        Delete
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Ability to remove entries
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSavePermission}
            startIcon={<Save />}
            sx={{ borderRadius: 2 }}
          >
            Save Permission
          </Button>
        </DialogActions>
      </Dialog>

      {/* Check Permission Dialog */}
      <Dialog
        open={openCheckDialog}
        onClose={handleCheckDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, overflow: "hidden" },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: alpha(theme.palette.secondary.main, 0.05),
            py: 3,
          }}
        >
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                mr: 2,
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                color: theme.palette.secondary.main,
              }}
            >
              <Pageview />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Check Permission
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verify if a user has permission to perform an action
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>User</InputLabel>
                <Select
                  name="userId"
                  value={checkPermissionForm.userId}
                  onChange={handleCheckFormChange}
                  label="User"
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            mr: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          }}
                        >
                          <Person fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Page</InputLabel>
                <Select
                  name="pageId"
                  value={checkPermissionForm.pageId}
                  onChange={handleCheckFormChange}
                  label="Page"
                >
                  {pages.map((page) => (
                    <MenuItem key={page.id} value={page.id}>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            mr: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                          }}
                        >
                          {page.icon}
                        </Avatar>
                        {page.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Action</InputLabel>
                <Select
                  name="action"
                  value={checkPermissionForm.action}
                  onChange={handleCheckFormChange}
                  label="Action"
                >
                  <MenuItem value="create">
                    <Box display="flex" alignItems="center">
                      <Add fontSize="small" sx={{ mr: 1 }} />
                      Create
                    </Box>
                  </MenuItem>
                  <MenuItem value="edit">
                    <Box display="flex" alignItems="center">
                      <Edit fontSize="small" sx={{ mr: 1 }} />
                      Edit
                    </Box>
                  </MenuItem>
                  <MenuItem value="view">
                    <Box display="flex" alignItems="center">
                      <Visibility fontSize="small" sx={{ mr: 1 }} />
                      View
                    </Box>
                  </MenuItem>
                  <MenuItem value="delete">
                    <Box display="flex" alignItems="center">
                      <Delete fontSize="small" sx={{ mr: 1 }} />
                      Delete
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {showResult && (
            <Alert
              severity={permissionResult ? "success" : "error"}
              sx={{ mt: 3 }}
              icon={permissionResult ? <GppGood /> : <GppBad />}
            >
              <Typography variant="body1" fontWeight={500}>
                {permissionResult
                  ? "Permission Granted"
                  : "Permission Denied"}
              </Typography>
              <Typography variant="body2">
                {permissionResult
                  ? "The user has permission to perform this action."
                  : "The user does not have permission to perform this action."}
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCheckDialogClose}>Close</Button>
          <Button
            variant="contained"
            onClick={handleCheckPermission}
            startIcon={<Pageview />}
            sx={{ borderRadius: 2 }}
          >
            Check Permission
          </Button>
        </DialogActions>
      </Dialog>

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

export default PermissionManagement;