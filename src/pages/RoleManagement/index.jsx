// src/pages/RoleManagement.js
import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Tab,
  Tabs,
  Divider,

} from '@mui/material';
import {
  Add as AddIcon,

} from '@mui/icons-material';
import { SaveIcon } from 'lucide-react';
import { usePermissions } from '../../context/PermissionContext';

const RoleManagement = () => {
  const { checkPermission } = usePermissions();
  const [roles, setRoles] = useState([]);
  const [pages, setPages] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', type: '', description: '' });
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchRoles();
    fetchPages();
  }, []);

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

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/pages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setPages(data.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch pages', severity: 'error' });
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    const perms = {};
    role.permissions.forEach(perm => {
      perms[perm.pageId] = {
        create: perm.create,
        edit: perm.edit,
        view: perm.view,
        delete: perm.delete,
      };
    });
    setPermissions(perms);
    setTabValue(0);
  };

  const handlePermissionChange = (pageId, action) => {
    setPermissions(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [action]: !prev[pageId]?.[action],
      },
    }));
  };

  const savePermissions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const permissionsArray = Object.keys(permissions).map(pageId => ({
        pageId,
        ...permissions[pageId],
      }));

      const response = await fetch(`/api/permissions/role/${selectedRole._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ permissions: permissionsArray }),
      });

      const data = await response.json();
      if (data.success) {
        setSnackbar({ open: true, message: 'Permissions saved successfully!', severity: 'success' });
        fetchRoles();
      } else {
        setSnackbar({ open: true, message: 'Failed to save permissions', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save permissions', severity: 'error' });
    }
  };

  const handleCreateRole = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newRole,
          createdBy: 'admin',
          permissions: []
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSnackbar({ open: true, message: 'Role created successfully!', severity: 'success' });
        fetchRoles();
        setOpenDialog(false);
        setNewRole({ name: '', type: '', description: '' });
      } else {
        setSnackbar({ open: true, message: 'Failed to create role', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create role', severity: 'error' });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const groupedPages = pages.reduce((acc, page) => {
    if (!acc[page.category]) acc[page.category] = [];
    acc[page.category].push(page);
    return acc;
  }, {});

  if (!checkPermission('/dashboard/role-management', 'view')) {
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
          Role Management
        </Typography>
        {checkPermission('/dashboard/role-management', 'create') && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add New Role
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Role List */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Roles
              </Typography>
              <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                {roles.map(role => (
                  <Card 
                    key={role._id} 
                    variant="outlined" 
                    sx={{ 
                      mb: 1, 
                      cursor: 'pointer',
                      border: selectedRole?._id === role._id ? '2px solid' : '1px solid',
                      borderColor: selectedRole?._id === role._id ? 'primary.main' : 'divider'
                    }}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <CardContent sx={{ py: 1.5 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight="medium">
                          {role.name}
                        </Typography>
                        <Chip 
                          label={role.type} 
                          size="small" 
                          color={role.type === 'admin' ? 'secondary' : 'primary'}
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {role.description || 'No description'}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Permission Settings */}
        <Grid item xs={12} md={8}>
          {selectedRole ? (
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Permissions for: {selectedRole.name}
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<SaveIcon />}
                    onClick={savePermissions}
                    disabled={!checkPermission('/dashboard/role-management', 'edit')}
                  >
                    Save Permissions
                  </Button>
                </Box>

                <Tabs value={tabValue} onChange={handleTabChange} aria-label="permission categories">
                  {Object.keys(groupedPages).map(category => (
                    <Tab key={category} label={category} />
                  ))}
                </Tabs>
                <Divider sx={{ mb: 2 }} />

                {Object.values(groupedPages)[tabValue]?.map(page => (
                  <Card key={page._id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        {page.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {page.path}
                      </Typography>
                      <Box display="flex" gap={3} mt={1}>
                        {['create', 'edit', 'view', 'delete'].map(action => (
                          <Box key={action} display="flex" alignItems="center">
                            <Checkbox
                              checked={permissions[page._id]?.[action] || false}
                              onChange={() => handlePermissionChange(page._id, action)}
                              disabled={!checkPermission('/dashboard/role-management', 'edit')}
                            />
                            <Typography variant="body2">
                              {action.charAt(0).toUpperCase() + action.slice(1)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
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
                  <Typography variant="h6" color="textSecondary">
                    Select a role to manage permissions
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Choose a role from the list to view and edit its permissions
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Create Role Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Role</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Role Name"
            fullWidth
            variant="outlined"
            value={newRole.name}
            onChange={(e) => setNewRole({...newRole, name: e.target.value})}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role Type</InputLabel>
            <Select
              value={newRole.type}
              onChange={(e) => setNewRole({...newRole, type: e.target.value})}
              label="Role Type"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newRole.description}
            onChange={(e) => setNewRole({...newRole, description: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateRole} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      {snackbar.open && (
        <Alert 
          severity={snackbar.severity} 
          onClose={handleCloseSnackbar}
          sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}
        >
          {snackbar.message}
        </Alert>
      )}
    </Box>
  );
};

export default RoleManagement;