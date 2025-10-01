// src/pages/UserManagement.js
import  { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { usePermissions } from '../context/PermissionContext';

const UserManagement = () => {
  const { checkPermission } = usePermissions();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setUsers(data.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch users', severity: 'error' });
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/roles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setRoles(data.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch roles', severity: 'error' });
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.roleId || '');
  };

  const assignRole = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roleId: selectedRole }),
      });

      const data = await response.json();
      if (data.success) {
        setSnackbar({ open: true, message: 'Role assigned successfully!', severity: 'success' });
        fetchUsers();
        setSelectedUser(null);
      } else {
        setSnackbar({ open: true, message: 'Failed to assign role', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to assign role', severity: 'error' });
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (roleType) => {
    switch (roleType) {
      case 'superadmin': return 'error';
      case 'admin': return 'secondary';
      case 'manager': return 'primary';
      case 'employee': return 'info';
      default: return 'default';
    }
  };

  if (!checkPermission('/dashboard/all-user-list', 'view')) {
    return (
      <Box p={3}>
        <Alert severity="error">You dont have permission to view this page.</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          User Management
        </Typography>
        {checkPermission('/dashboard/all-user-list', 'create') && (
          <Button 
            variant="contained" 
            startIcon={<PersonAddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add New User
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* User List */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Users ({filteredUsers.length})
                </Typography>
                <TextField
                  placeholder="Search users..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <TableRow 
                        key={user._id} 
                        hover
                        selected={selectedUser?._id === user._id}
                        onClick={() => handleUserSelect(user)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar src={user.image} sx={{ mr: 2 }}>
                              {user.name.charAt(0)}
                            </Avatar>
                            <Typography variant="subtitle2">
                              {user.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.roleId && roles.find(r => r._id === user.roleId) ? (
                            <Chip 
                              label={roles.find(r => r._id === user.roleId).name}
                              color={getRoleColor(roles.find(r => r._id === user.roleId).type)}
                              size="small"
                            />
                          ) : (
                            <Chip label="No Role" size="small" variant="outlined" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.status} 
                            color={user.status === 'active' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit User">
                            <IconButton size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Role Assignment */}
        <Grid item xs={12} md={4}>
          {selectedUser ? (
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                  <Avatar src={selectedUser.image} sx={{ width: 80, height: 80, mb: 2 }}>
                    {selectedUser.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6">
                    {selectedUser.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedUser.email}
                  </Typography>
                </Box>

                <Typography variant="h6" gutterBottom>
                  Assign Role
                </Typography>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Select Role</InputLabel>
                  <Select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    label="Select Role"
                    disabled={!checkPermission('/dashboard/all-user-list', 'edit')}
                  >
                    <MenuItem value="">No Role</MenuItem>
                    {roles.map(role => (
                      <MenuItem key={role._id} value={role._id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box display="flex" gap={2} mt={3}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    startIcon={<CheckCircleIcon />}
                    onClick={assignRole}
                    disabled={!selectedRole || !checkPermission('/dashboard/all-user-list', 'edit')}
                  >
                    Assign Role
                  </Button>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    startIcon={<CancelIcon />}
                    onClick={() => setSelectedUser(null)}
                  >
                    Cancel
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card elevation={3}>
              <CardContent>
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  justifyContent="center" 
                  alignItems="center" 
                  minHeight={300}
                  textAlign="center"
                >
                  <PersonAddIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    Select a user to manage
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Choose a user from the list to assign or change their role
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Add User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Full Name"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Email Address"
            fullWidth
            variant="outlined"
            type="email"
          />
          <TextField
            margin="dense"
            label="Password"
            fullWidth
            variant="outlined"
            type="password"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select label="Role">
              {roles.map(role => (
                <MenuItem key={role._id} value={role._id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained">Create User</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      {snackbar.open && (
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({...snackbar, open: false})}
          sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}
        >
          {snackbar.message}
        </Alert>
      )}
    </Box>
  );
};

export default UserManagement;