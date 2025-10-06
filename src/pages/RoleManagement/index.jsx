/* eslint-disable no-unused-vars */
// pages/RoleManagement.js
import { useState } from "react";
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
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Badge,
  TextField,
  InputAdornment,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Person,
  Search,
  FilterList,
} from "@mui/icons-material";
import AddRoleModal from "./AddRoleModal";
import { useGetAllRolesQuery, useDeleteRoleMutation } from "../../redux/api/roleApi";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import swal from "sweetalert";

const RoleManagement = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const { tenantDomain } = useTenantDomain();
  const { data: rolesData, isLoading, error, refetch } = useGetAllRolesQuery({ tenantDomain });
  const [deleteRole] = useDeleteRoleMutation();

  const roles = rolesData?.data || [];

  const handleMenuClick = (event, role) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };

  const handleOpenDialog = () => {
    setEditMode(false);
    setSelectedRole(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRole(null);
    setEditMode(false);
  };

  const handleEditRole = () => {
    setEditMode(true);
    setOpenDialog(true);
    handleMenuClose();
  };


  const handleDeleteRole = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: " You want to move  this supplier recycle bin?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await deleteRole({ id: selectedRole._id, tenantDomain, }).unwrap();
        swal(
          "Move to Recycle bin!",
          "Move to Recycle bin successful.",
          "success"
        );
      } catch (error) {
        swal("Error", "An error occurred while deleting the card.", "error");
      }
    }
  };



  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const getRoleColor = (type) => {
    const colors = {
      admin: "error",
      manager: "warning",
      employee: "info",
      user: "success",
      superadmin: "secondary",
    };
    return colors[type] || "default";
  };

  const getRoleIcon = (type) => {
    const icons = {
      admin: "👑",
      manager: "💼",
      employee: "👨‍💼",
      user: "👤",
      superadmin: "🌟",
    };
    return icons[type] || "⚙️";
  };

  const filteredRoles = roles.filter(role =>
    role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === "active" ? "success" : "error";
  };

  // Stats calculations
  const totalRoles = roles.length;
  const activeRoles = roles.filter(r => r.status === 'active').length;
  const totalUsers = roles.reduce((sum, role) => sum + (role.users || 0), 0);
  const roleTypes = [...new Set(roles.map(role => role.type))].length;

  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Loading roles...</Typography>
      </Box>
    );
  }


  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Role Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Create and manage user roles with specific permissions and access levels
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h3" fontWeight="bold">
                {totalRoles}
              </Typography>
              <Typography variant="body1">Total Roles</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
              <Typography variant="h3" fontWeight="bold">
                {activeRoles}
              </Typography>
              <Typography variant="body1">Active Roles</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
              <Typography variant="h3" fontWeight="bold">
                {totalUsers}
              </Typography>
              <Typography variant="body1">Total Users</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
              <Typography variant="h3" fontWeight="bold">
                {roleTypes}
              </Typography>
              <Typography variant="body1">Role Types</Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content */}
      <Card elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        {/* Toolbar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Role List
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenDialog}
            sx={{ borderRadius: 2 }}
          >
            Add New Role
          </Button>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search roles..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ borderRadius: 2 }}
          >
            Filter
          </Button>
        </Box>


        {/* Roles Table */}
        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Users</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Created By</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow
                  key={role._id}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    transition: 'all 0.2s'
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: `${getRoleColor(role.type)}.main`,
                          mr: 2,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {getRoleIcon(role.type)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {role.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Created: {new Date(role.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={role.type?.charAt(0).toUpperCase() + role.type?.slice(1)}
                      size="small"
                      color={getRoleColor(role.type)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {role.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Badge
                      badgeContent={role.users || 0}
                      color="primary"
                      sx={{ mr: 2 }}
                    >
                      <Person />
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {role.createdBy || 'System'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={role.status === "active"}
                            color="success"
                            size="small"
                          />
                        }
                        label=""
                      />
                      <Chip
                        label={role.status}
                        size="small"
                        color={getStatusColor(role.status)}
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => handleMenuClick(e, role)}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'primary.main', color: 'white' }
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredRoles.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No roles found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search or create a new role
            </Typography>
          </Box>
        )}
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditRole}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit Role
        </MenuItem>
        <MenuItem onClick={handleDeleteRole} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Role
        </MenuItem>
      </Menu>

      {/* Role Dialog */}
      <AddRoleModal
        open={openDialog}
        onClose={handleCloseDialog}
        editMode={editMode}
        roleData={selectedRole}
        refetchRoles={refetch}
        isLoading={isLoading}
      />


    </Box>
  );
};

export default RoleManagement;
