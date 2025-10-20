// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Chip, Typography, Box, Tooltip, IconButton, useTheme, alpha, CircularProgress, Pagination, Checkbox, FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment } from "@mui/material";
// import { Edit, Delete, LibraryBooks, Person, Search, FilterList } from "@mui/icons-material";
// import { useState, useEffect } from "react";

// const UserPermissionsTab = ({ permissionData, handleDialogOpen, handleDeletePermission, getRoleColor, loading, onPageChange, onFilterChange, filters }) => {
//   const theme = useTheme();
//   const [selectedRole, setSelectedRole] = useState(filters.role || '');
//   const [selectedUser, setSelectedUser] = useState(filters.user || '');
//   const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
//   const [roles, setRoles] = useState([]);
//   const [users, setUsers] = useState([]);

//   const { permissions = [], pagination = {} } = permissionData || {};
//   const { total = 0, page = 1, limit = 10, pages = 0 } = pagination;

//   // Extract unique roles and users from permissions
//   useEffect(() => {
//     if (permissions && permissions.length > 0) {
//       const uniqueRoles = [...new Set(
//         permissions
//           .map(p => p.roleId && p.roleId.length > 0 ? p.roleId[0].name : '')
//           .filter(name => name !== '')
//       )];
//       setRoles(uniqueRoles);

//       const uniqueUsers = [...new Set(
//         permissions
//           .map(p => {
//             if (p.userId && p.userId.length > 0) {
//               const user = p.userId[0];
//               return user.name || user.email || '';
//             }
//             return '';
//           })
//           .filter(name => name !== '')
//       )];
//       setUsers(uniqueUsers);
//     }
//   }, [permissions]);

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" py={6}>
//         <CircularProgress size={60} thickness={4} />
//       </Box>
//     );
//   }

//   const handlePageChange = (event, newPage) => {
//     if (onPageChange) {
//       onPageChange(newPage);
//     }
//   };

//   const handleRoleFilterChange = (event) => {
//     const role = event.target.value;
//     setSelectedRole(role);
//     if (onFilterChange) {
//       onFilterChange({ role, user: selectedUser, searchTerm });
//     }
//   };

//   const handleUserFilterChange = (event) => {
//     const user = event.target.value;
//     setSelectedUser(user);
//     if (onFilterChange) {
//       onFilterChange({ role: selectedRole, user, searchTerm });
//     }
//   };

//   const handleSearchChange = (event) => {
//     const term = event.target.value;
//     setSearchTerm(term);
//     if (onFilterChange) {
//       onFilterChange({ role: selectedRole, user: selectedUser, searchTerm: term });
//     }
//   };

//   // Helper function to extract data from arrays
//   const getFirstItem = (arr) => {
//     return Array.isArray(arr) && arr.length > 0 ? arr[0] : {};
//   };

//   return (
//     <Box>
//       {/* Filters */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
//           <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
//             <InputLabel id="role-filter-label">Filter by Role</InputLabel>
//             <Select
//               labelId="role-filter-label"
//               id="role-filter"
//               value={selectedRole}
//               onChange={handleRoleFilterChange}
//               label="Filter by Role"
//               startAdornment={
//                 <InputAdornment position="start">
//                   <FilterList fontSize="small" />
//                 </InputAdornment>
//               }
//             >
//               <MenuItem value="">
//                 <em>All Roles</em>
//               </MenuItem>
//               {roles.map((role) => (
//                 <MenuItem key={role} value={role}>{role}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
//             <InputLabel id="user-filter-label">Filter by User</InputLabel>
//             <Select
//               labelId="user-filter-label"
//               id="user-filter"
//               value={selectedUser}
//               onChange={handleUserFilterChange}
//               label="Filter by User"
//               startAdornment={
//                 <InputAdornment position="start">
//                   <Person fontSize="small" />
//                 </InputAdornment>
//               }
//             >
//               <MenuItem value="">
//                 <em>All Users</em>
//               </MenuItem>
//               {users.map((user) => (
//                 <MenuItem key={user} value={user}>{user}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <TextField
//             size="small"
//             placeholder="Search permissions..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             variant="outlined"
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search fontSize="small" />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ minWidth: 250 }}
//           />
//         </Box>

//         <Typography variant="body2" color="text.secondary">
//           {total} permissions found
//         </Typography>
//       </Box>

//       <TableContainer
//         component={Paper}
//         elevation={0}
//         sx={{
//           borderRadius: 3,
//           overflow: 'hidden',
//           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
//         }}
//       >
//         <Table>
//           <TableHead sx={{
//             bgcolor: alpha(theme.palette.primary.main, 0.08),
//           }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 600, py: 2 }}>User</TableCell>
//               <TableCell sx={{ fontWeight: 600, py: 2 }}>Role</TableCell>
//               <TableCell sx={{ fontWeight: 600, py: 2 }}>Page</TableCell>
//               <TableCell sx={{ fontWeight: 600, py: 2 }}>Category</TableCell>
//               <TableCell sx={{ fontWeight: 600, py: 2 }}>Create</TableCell>
//               <TableCell sx={{ fontWeight: 600, py: 2 }}>Edit</TableCell>
//               <TableCell sx={{ fontWeight: 600, py: 2 }}>View</TableCell>
//               <TableCell sx={{ fontWeight: 600, py: 2 }}>Delete</TableCell>
//               <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {permissions.length > 0 ? (
//               permissions.map((permission) => {
//                 const page = getFirstItem(permission.pageId);
//                 const role = getFirstItem(permission.roleId);
//                 const user = getFirstItem(permission.userId);

//                 return (
//                   <TableRow
//                     key={permission._id}
//                     hover
//                     sx={{
//                       '&:hover': {
//                         backgroundColor: alpha(theme.palette.primary.main, 0.02),
//                       },
//                     }}
//                   >
//                     <TableCell sx={{ py: 2 }}>
//                       <Box display="flex" alignItems="center">
//                         <Avatar
//                           sx={{
//                             width: 36,
//                             height: 36,
//                             mr: 1.5,
//                             bgcolor: alpha(theme.palette.secondary.main, 0.15),
//                             color: theme.palette.secondary.main,
//                             boxShadow: `0 2px 8px ${alpha(theme.palette.secondary.main, 0.2)}`,
//                           }}
//                         >
//                           <Person />
//                         </Avatar>
//                         <Box>
//                           <Typography variant="body2" fontWeight={500}>
//                             {user.name || user.email || 'N/A'}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             {user.email || 'N/A'}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </TableCell>
//                     <TableCell sx={{ py: 2 }}>
//                       <Chip
//                         label={role.name || 'N/A'}
//                         size="small"
//                         color={getRoleColor(role.name)}
//                         sx={{
//                           fontWeight: 600,
//                           borderRadius: 2,
//                           px: 1,
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ py: 2 }}>
//                       <Box display="flex" alignItems="center">
//                         <Avatar
//                           sx={{
//                             width: 36,
//                             height: 36,
//                             mr: 1.5,
//                             bgcolor: alpha(theme.palette.info.main, 0.15),
//                             color: theme.palette.info.main,
//                             boxShadow: `0 2px 8px ${alpha(theme.palette.info.main, 0.2)}`,
//                           }}
//                         >
//                           <LibraryBooks />
//                         </Avatar>
//                         <Box>
//                           <Typography variant="body2" fontWeight={500}>
//                             {page.name || 'N/A'}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             {page.path || 'N/A'}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </TableCell>
//                     <TableCell sx={{ py: 2 }}>
//                       <Chip
//                         label={page.category || 'N/A'}
//                         size="small"
//                         variant="outlined"
//                         color="primary"
//                       />
//                     </TableCell>
//                     <TableCell sx={{ py: 2 }}>
//                       <Checkbox
//                         checked={permission.create || false}
//                         color="success"
//                         size="small"
//                         disabled
//                         sx={{
//                           '&.Mui-disabled': {
//                             opacity: 0.7,
//                           },
//                           '&.Mui-checked': {
//                             color: theme.palette.success.main,
//                           },
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ py: 2 }}>
//                       <Checkbox
//                         checked={permission.edit || false}
//                         color="warning"
//                         size="small"
//                         disabled
//                         sx={{
//                           '&.Mui-disabled': {
//                             opacity: 0.7,
//                           },
//                           '&.Mui-checked': {
//                             color: theme.palette.warning.main,
//                           },
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ py: 2 }}>
//                       <Checkbox
//                         checked={permission.view || false}
//                         color="info"
//                         size="small"
//                         disabled
//                         sx={{
//                           '&.Mui-disabled': {
//                             opacity: 0.7,
//                           },
//                           '&.Mui-checked': {
//                             color: theme.palette.info.main,
//                           },
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ py: 2 }}>
//                       <Checkbox
//                         checked={permission.delete || false}
//                         color="error"
//                         size="small"
//                         disabled
//                         sx={{
//                           '&.Mui-disabled': {
//                             opacity: 0.7,
//                           },
//                           '&.Mui-checked': {
//                             color: theme.palette.error.main,
//                           },
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell align="right" sx={{ py: 2 }}>
//                       <Tooltip title="Edit Permission">
//                         <IconButton
//                           size="small"
//                           onClick={() => handleDialogOpen(permission._id)}
//                           sx={{
//                             color: theme.palette.primary.main,
//                             '&:hover': {
//                               backgroundColor: alpha(theme.palette.primary.main, 0.1),
//                             }
//                           }}
//                         >
//                           <Edit fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                       <Tooltip title="Delete Permission">
//                         <IconButton
//                           size="small"
//                           color="error"
//                           onClick={() => handleDeletePermission(permission._id)}
//                           sx={{
//                             '&:hover': {
//                               backgroundColor: alpha(theme.palette.error.main, 0.1),
//                             }
//                           }}
//                         >
//                           <Delete fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
//                   <Typography variant="body2" color="text.secondary">
//                     No permissions found
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Pagination */}
//       {pages > 1 && (
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             mt: 3,
//             p: 2,
//           }}
//         >
//           <Typography variant="body2">
//             Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} permissions
//           </Typography>
//           <Pagination
//             count={pages}
//             page={page}
//             onChange={handlePageChange}
//             color="primary"
//             showFirstButton
//             showLastButton
//           />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default UserPermissionsTab;