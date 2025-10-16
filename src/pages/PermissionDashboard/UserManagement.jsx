// pages/UserManagement.js
import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  InputAdornment,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Person,
  Email,
  Phone,
  Business,
  Shield,

} from '@mui/icons-material';

const UserManagement = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@abcmotors.com',
      phone: '+1 (555) 123-4567',
      role: 'Admin',
      client: 'ABC Motors',
      status: 'Active',
      lastLogin: '2023-05-15 10:30 AM',
      permissions: ['Client Management', 'Jobcard', 'Invoice', 'Quotation']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@xyzgarage.com',
      phone: '+1 (555) 987-6543',
      role: 'Accountant',
      client: 'XYZ Garage',
      status: 'Active',
      lastLogin: '2023-05-14 3:45 PM',
      permissions: ['Invoice', 'Quotation', 'Money Receipt']
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@quickauto.com',
      phone: '+1 (555) 456-7890',
      role: 'User',
      client: 'Quick Auto',
      status: 'Active',
      lastLogin: '2023-05-13 9:15 AM',
      permissions: ['Client Management', 'Jobcard']
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily@superauto.com',
      phone: '+1 (555) 234-5678',
      role: 'Accountant',
      client: 'Super Auto',
      status: 'Inactive',
      lastLogin: '2023-05-10 2:20 PM',
      permissions: ['Invoice', 'Account Management']
    },
  ];

  const roles = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'accountant', label: 'Accountant' },
    { value: 'user', label: 'User' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role.toLowerCase().includes(filterRole.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    return role === 'Admin' ? 'primary' :
      role === 'Accountant' ? 'secondary' : 'info';
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        User Management
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Manage system users, roles, and permissions across all clients
      </Typography>

      <Card elevation={0} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Users
          </Typography>
          <Box display="flex" gap={2}>
            <TextField
              placeholder="Search users..."
              size="small"
              sx={{ width: 250 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={filterRole}
                label="Filter by Role"
                onChange={(e) => setFilterRole(e.target.value)}
              >
                {roles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleDialogOpen}
            >
              Add User
            </Button>
          </Box>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} aria-label="user tabs">
          <Tab label="All Users" />
          <Tab label="Active" />
          <Tab label="Inactive" />
        </Tabs>

        <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>{user.name.charAt(0)}</Avatar>
                      <Typography variant="body1" fontWeight={500}>
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <Email fontSize="small" color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">{user.email}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Phone fontSize="small" color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2">{user.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<Business />}
                      label={user.client}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<Shield />}
                      label={user.role}
                      size="small"
                      color={getRoleColor(user.role)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {user.permissions.slice(0, 2).map((permission, idx) => (
                        <Chip
                          key={idx}
                          label={permission}
                          size="small"
                          variant="outlined"
                          color={getRoleColor(user.role)}
                        />
                      ))}
                      {user.permissions.length > 2 && (
                        <Chip
                          label={`+${user.permissions.length - 2} more`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      color={user.status === 'Active' ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={handleMenuClick}>
                      <MoreVert />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleMenuClose}>
                        <Visibility fontSize="small" sx={{ mr: 1 }} /> View
                      </MenuItem>
                      <MenuItem onClick={handleMenuClose}>
                        <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
                      </MenuItem>
                      <MenuItem onClick={handleMenuClose}>
                        <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>
              <Select
                label="Client"
                defaultValue=""
              >
                <MenuItem value="abc">ABC Motors</MenuItem>
                <MenuItem value="xyz">XYZ Garage</MenuItem>
                <MenuItem value="quick">Quick Auto</MenuItem>
                <MenuItem value="super">Super Auto</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                defaultValue=""
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="accountant">Accountant</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogClose}>Add User</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;