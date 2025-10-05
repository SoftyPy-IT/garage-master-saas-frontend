/* eslint-disable react/prop-types */
import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Typography, Checkbox, Box, useTheme, alpha } from "@mui/material";
import { AccountBalance, ManageAccounts, Person, Security, Star } from "@mui/icons-material";

const PermissionMatrixTab = ({ permissionMatrix, roles }) => {
  const theme = useTheme();

  return (
    <Box>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <TableRow>
              <TableCell>Permission</TableCell>
              {roles.map((role) => (
                <TableCell key={role._id} align="center">
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
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      {getRoleIcon(role.name)}
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
            {permissionMatrix.length > 0 ? (
              permissionMatrix.map((category, catIndex) => (
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
                        <TableCell key={role._id} align="center">
                          <Checkbox
                            checked={permission[role.name.toLowerCase().replace(' ', '')] || false}
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={roles.length + 1} align="center" sx={{ py: 4 }}>
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

// Helper function to get role icons
const getRoleIcon = (roleName) => {
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
