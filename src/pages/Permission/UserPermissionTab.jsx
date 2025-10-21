/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { alpha, Box, Button, Typography } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Loading from "../../components/Loading/Loading";
import PermissionFilters from "./PermissionFilters";
import PermissionsTable from "./PermissionTable";
import PermissionsPagination from "./PermissionPagination";

const UserPermissionsTab = ({
  permissionData,
  handleDialogOpen,
  handleDeletePermission,
  handleDeleteMultiplePermissions,
  getRoleColor,
  loading,
  onPageChange,
  onFilterChange,
  filters
}) => {
  const [selectedRole, setSelectedRole] = useState(filters.role || '');
  const [selectedUser, setSelectedUser] = useState(filters.user || '');
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const { permissions = [], pagination = {} } = permissionData || {};
  const { total = 0, page = 1, limit = 10, pages = 0 } = pagination;

  // Extract unique roles and users from permissions
  useEffect(() => {
    if (permissions && permissions.length > 0) {
      const uniqueRoles = [...new Set(
        permissions
          .map(p => p.roleId && p.roleId.length > 0 ? p.roleId[0].name : '')
          .filter(name => name !== '')
      )];
      setRoles(uniqueRoles);

      const uniqueUsers = [...new Set(
        permissions
          .map(p => {
            if (p.userId && p.userId.length > 0) {
              const user = p.userId[0];
              return user.name || user.email || '';
            }
            return '';
          })
          .filter(name => name !== '')
      )];
      setUsers(uniqueUsers);
    }
  }, [permissions]);

  // Memoized event handlers to prevent unnecessary re-renders
  const handlePageChange = useCallback((event, newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  }, [onPageChange]);

  const handleRoleFilterChange = useCallback((event) => {
    const role = event.target.value;
    setSelectedRole(role);
    if (onFilterChange) {
      onFilterChange({ role, user: selectedUser, searchTerm });
    }
  }, [onFilterChange, selectedUser, searchTerm]);

  const handleUserFilterChange = useCallback((event) => {
    const user = event.target.value;
    setSelectedUser(user);
    if (onFilterChange) {
      onFilterChange({ role: selectedRole, user, searchTerm });
    }
  }, [onFilterChange, selectedRole, searchTerm]);

  const handleSearchChange = useCallback((event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (onFilterChange) {
      onFilterChange({ role: selectedRole, user: selectedUser, searchTerm: term });
    }
  }, [onFilterChange, selectedRole, selectedUser]);

  const handleSelectPermission = useCallback((permissionId) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  }, []);

  const handleSelectAllPermissions = useCallback((event) => {
    if (event.target.checked) {
      setSelectedPermissions(permissions.map(p => p._id));
    } else { 
      setSelectedPermissions([]);
    }
  }, [permissions]);

  const isAllSelected = permissions.length > 0 && selectedPermissions.length === permissions.length;

  // Render loading state
  if (loading) {
    return <Loading />;
  }

  return (
    <Box> 
      <PermissionFilters
        selectedRole={selectedRole}
        selectedUser={selectedUser}
        searchTerm={searchTerm}
        roles={roles}
        users={users}
        total={total}
        onRoleFilterChange={handleRoleFilterChange}
        onUserFilterChange={handleUserFilterChange}
        onSearchChange={handleSearchChange}
      /> 
      {selectedPermissions.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha('#f44336', 0.05),
            border: '1px solid rgba(244, 67, 54, 0.2)'
          }}
        >
          <Typography variant="body2">
            {selectedPermissions.length} permission(s) selected
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteMultiplePermissions(selectedPermissions)}
            sx={{
              borderRadius: 2,
            }}
          >
            Delete Selected
          </Button>
        </Box>
      )}

      <PermissionsTable
        permissions={permissions}
        getRoleColor={getRoleColor}
        handleDialogOpen={handleDialogOpen}
        handleDeletePermission={handleDeletePermission}
        selectedPermissions={selectedPermissions}
        handleSelectPermission={handleSelectPermission}
        handleSelectAllPermissions={handleSelectAllPermissions}
        isAllSelected={isAllSelected}
      />

      {pages > 1 && (
        <PermissionsPagination
          page={page}
          pages={pages}
          total={total}
          limit={limit}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

export default UserPermissionsTab;