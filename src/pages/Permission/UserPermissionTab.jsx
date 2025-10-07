/* eslint-disable react/prop-types */
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Chip, Typography, Checkbox, Box, Tooltip, IconButton, useTheme, alpha, CircularProgress } from "@mui/material";
import { Edit, Delete, Person, LibraryBooks } from "@mui/icons-material";

const UserPermissionsTab = ({ filteredPermissions, handleDialogOpen, handleDeletePermission, getRoleColor, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
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
              filteredPermissions.map((permission) => {
                return (
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
                            {permission.userEmail}
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
                          <LibraryBooks />
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
                          onClick={() => handleDialogOpen(permission.id)} // Pass only the _id
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
                )
              })
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
  );
};

export default UserPermissionsTab;