/* eslint-disable react/prop-types */
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Checkbox,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import { AccountBalance, ManageAccounts, Person, Security, Star } from "@mui/icons-material";

const PermissionMatrixTab = ({ permissionMatrix, roles }) => {
  const theme = useTheme();

  const getRoleKey = (role) => {
    if (!role?.name) return 'unknownrole';
    return role.name.toLowerCase().replace(/\s+/g, '');
  };

  const getPermissionStatus = (permission, role) => {
    const roleKey = getRoleKey(role);
    return permission[roleKey] || false;
  };

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Table>
          <TableHead sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.08),
          }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>Permission</TableCell>
              {roles.map((role) => (
                <TableCell key={role._id} align="center" sx={{ fontWeight: 600, py: 2 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        mr: 1.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                        color: theme.palette.primary.main,
                        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                      }}
                    >
                      {getRoleIcon(role.name)}
                    </Avatar>
                    <Typography variant="body2" fontWeight={600}>
                      {role?.name || 'Unknown Role'}
                    </Typography>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {permissionMatrix && permissionMatrix.length > 0 ? (
              permissionMatrix.map((category, catIndex) => (
                <React.Fragment key={catIndex}>
                  <TableRow>
                    <TableCell
                      colSpan={roles.length + 1}
                      sx={{
                        py: 2,
                        backgroundColor: alpha(theme.palette.primary.main, 0.03),
                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            mr: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: theme.palette.primary.main,
                            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
                          }}
                        >
                          {category.icon}
                        </Avatar>
                        <Typography variant="body1" fontWeight={600} color="primary.main">
                          {category.category}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  {category.permissions && category.permissions.map((permission, permIndex) => (
                    <TableRow
                      key={`${catIndex}-${permIndex}`}
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.02),
                        },
                      }}
                    >
                      <TableCell sx={{ pl: 5, py: 1.5 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {permission.name}
                        </Typography>
                      </TableCell>
                      {roles.map((role) => (
                        <TableCell key={`${role._id}-${permIndex}`} align="center" sx={{ py: 1.5 }}>
                          <Checkbox
                            checked={getPermissionStatus(permission, role)}
                            color="primary"
                            inputProps={{
                              "aria-label": `${permission.name} for ${role.name}`,
                            }}
                            disabled
                            sx={{
                              '&.Mui-disabled': {
                                opacity: 0.7,
                              },
                              '&.Mui-checked': {
                                color: theme.palette.primary.main,
                              },
                            }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={roles.length + 1} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    No permission matrix data available
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

const getRoleIcon = (roleName) => {
  if (!roleName) return <Person />;

  const iconMap = {
    'Super Admin': <Star />,
    'Admin': <Security />,
    'Accountant': <AccountBalance />,
    'Manager': <ManageAccounts />,
    'User': <Person />
  };
  return iconMap[roleName] || <Person />;
};

export default PermissionMatrixTab;