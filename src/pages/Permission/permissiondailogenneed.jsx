// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, FormControl, InputLabel, Select, MenuItem, Avatar, Typography, Box, Button, Card, Checkbox, useTheme, alpha } from "@mui/material";
// import { Security, Person, Save, } from "@mui/icons-material";
// import { useTenantDomain } from "../../hooks/useTenantDomain";
// import { useGetAllUserQuery } from "../../redux/api/userApi";
// import { useGetAllPagesQuery } from "../../redux/api/pageApi";
// import GarageForm from "../../components/form/Form";
// import { useMemo } from "react";

// const AddEditPermissionDialog = ({
//     open,
//     handleClose,
//     permissionType,
//     permissionForm,
//     handleFormChange,
//     handleSavePermission,
//     users,
//     roles,
//     pages
// }) => {
//     const theme = useTheme();

//     const {
//         tenantDomain
//     } = useTenantDomain();

//     const {
//         data: userData
//     } = useGetAllUserQuery({
//         tenantDomain
//     });
//     const {
//         data: pageData
//     } = useGetAllPagesQuery({
//         tenantDomain
//     });

//     const pageOption = useMemo(() => {
//         if (!pageData?.data) return [];
//         return pageData.data.map((page) => ({
//             label: page.name,
//             value: page._id,
//         }));
//     }, [pageData?.data]);

//     console.log(pageOption)

//     const handleSubmit = async (data) => {
//         console.log(data)
//     }

//     return (
//         <Dialog
//             open={open}
//             onClose={handleClose}
//             maxWidth="md"
//             fullWidth
//             PaperProps={{
//                 sx: { borderRadius: 3, overflow: "hidden" },
//             }}
//         >
//             <GarageForm onSubmit={handleSubmit}>
//                 <DialogTitle
//                     sx={{
//                         bgcolor: alpha(theme.palette.primary.main, 0.05),
//                         py: 3,
//                     }}
//                 >
//                     <Box display="flex" alignItems="center">
//                         <Avatar
//                             sx={{
//                                 width: 56,
//                                 height: 56,
//                                 mr: 2,
//                                 bgcolor: alpha(theme.palette.primary.main, 0.1),
//                                 color: theme.palette.primary.main,
//                             }}
//                         >
//                             <Security />
//                         </Avatar>
//                         <Box>
//                             <Typography variant="h6" fontWeight={600}>
//                                 {permissionType === "edit" ? "Edit Permission" : "Add New Permission"}
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                                 Configure access control for users and roles
//                             </Typography>
//                         </Box>
//                     </Box>
//                 </DialogTitle>
//                 <DialogContent sx={{ pt: 3 }}>
//                     <Grid container spacing={3}>
//                         {permissionType !== "role" && (
//                             <Grid item xs={12} md={6}>
//                                 <FormControl fullWidth>
//                                     <InputLabel>User</InputLabel>
//                                     <Select
//                                         name="userId"
//                                         value={permissionForm.userId}
//                                         onChange={handleFormChange}
//                                         label="User"
//                                     >
//                                         {users.map((user) => (
//                                             <MenuItem key={user.id} value={user.id}>
//                                                 <Box display="flex" alignItems="center">
//                                                     <Avatar
//                                                         sx={{
//                                                             width: 32,
//                                                             height: 32,
//                                                             mr: 2,
//                                                             bgcolor: alpha(theme.palette.primary.main, 0.1),
//                                                             color: theme.palette.primary.main,
//                                                         }}
//                                                     >
//                                                         <Person fontSize="small" />
//                                                     </Avatar>
//                                                     <Box>
//                                                         <Typography variant="body2">{user.name}</Typography>
//                                                         <Typography variant="caption" color="text.secondary">
//                                                             {user.email}
//                                                         </Typography>
//                                                     </Box>
//                                                 </Box>
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                             </Grid>
//                         )}
//                         {permissionType !== "user" && (
//                             <Grid item xs={12} md={6}>
//                                 <FormControl fullWidth>
//                                     <InputLabel>Role</InputLabel>
//                                     <Select
//                                         name="roleId"
//                                         value={permissionForm.roleId}
//                                         onChange={handleFormChange}
//                                         label="Role"
//                                     >
//                                         {roles.map((role) => (
//                                             <MenuItem key={role.id} value={role.id}>
//                                                 <Box display="flex" alignItems="center">
//                                                     <Avatar
//                                                         sx={{
//                                                             width: 32,
//                                                             height: 32,
//                                                             mr: 2,
//                                                             bgcolor: alpha(theme.palette[role.color].main, 0.1),
//                                                             color: theme.palette[role.color].main,
//                                                         }}
//                                                     >
//                                                         {role.icon}
//                                                     </Avatar>
//                                                     {role.name}
//                                                 </Box>
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>
//                             </Grid>
//                         )}
//                         <Grid item xs={12}>
//                             <FormControl fullWidth>
//                                 <InputLabel>Page</InputLabel>
//                                 <Select
//                                     name="pageId"
//                                     value={permissionForm.pageId}
//                                     onChange={handleFormChange}
//                                     label="Page"
//                                 >
//                                     {pages.map((page) => (
//                                         <MenuItem key={page.id} value={page.id}>
//                                             <Box display="flex" alignItems="center">
//                                                 <Avatar
//                                                     sx={{
//                                                         width: 32,
//                                                         height: 32,
//                                                         mr: 2,
//                                                         bgcolor: alpha(theme.palette.info.main, 0.1),
//                                                         color: theme.palette.info.main,
//                                                     }}
//                                                 >
//                                                     {page.icon}
//                                                 </Avatar>
//                                                 {page.name}
//                                             </Box>
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Typography variant="h6" fontWeight={600} mb={2}>
//                                 Permissions
//                             </Typography>
//                             <Grid container spacing={2}>
//                                 <Grid item xs={12} sm={6} md={3}>
//                                     <Card
//                                         elevation={0}
//                                         sx={{
//                                             p: 2,
//                                             borderRadius: 2,
//                                             border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
//                                             bgcolor: alpha(theme.palette.success.main, 0.02),
//                                             transition: "all 0.3s",
//                                             "&:hover": {
//                                                 boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//                                             },
//                                         }}
//                                     >
//                                         <Box display="flex" alignItems="center" mb={1}>
//                                             <Checkbox
//                                                 name="create"
//                                                 checked={permissionForm.create}
//                                                 onChange={handleFormChange}
//                                                 color="success"
//                                             />
//                                             <Typography variant="body2" fontWeight={500}>
//                                                 Create
//                                             </Typography>
//                                         </Box>
//                                         <Typography variant="caption" color="text.secondary">
//                                             Ability to create new entries
//                                         </Typography>
//                                     </Card>
//                                 </Grid>
//                                 <Grid item xs={12} sm={6} md={3}>
//                                     <Card
//                                         elevation={0}
//                                         sx={{
//                                             p: 2,
//                                             borderRadius: 2,
//                                             border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
//                                             bgcolor: alpha(theme.palette.warning.main, 0.02),
//                                             transition: "all 0.3s",
//                                             "&:hover": {
//                                                 boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//                                             },
//                                         }}
//                                     >
//                                         <Box display="flex" alignItems="center" mb={1}>
//                                             <Checkbox
//                                                 name="edit"
//                                                 checked={permissionForm.edit}
//                                                 onChange={handleFormChange}
//                                                 color="warning"
//                                             />
//                                             <Typography variant="body2" fontWeight={500}>
//                                                 Edit
//                                             </Typography>
//                                         </Box>
//                                         <Typography variant="caption" color="text.secondary">
//                                             Ability to modify existing entries
//                                         </Typography>
//                                     </Card>
//                                 </Grid>
//                                 <Grid item xs={12} sm={6} md={3}>
//                                     <Card
//                                         elevation={0}
//                                         sx={{
//                                             p: 2,
//                                             borderRadius: 2,
//                                             border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
//                                             bgcolor: alpha(theme.palette.info.main, 0.02),
//                                             transition: "all 0.3s",
//                                             "&:hover": {
//                                                 boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//                                             },
//                                         }}
//                                     >
//                                         <Box display="flex" alignItems="center" mb={1}>
//                                             <Checkbox
//                                                 name="view"
//                                                 checked={permissionForm.view}
//                                                 onChange={handleFormChange}
//                                                 color="info"
//                                             />
//                                             <Typography variant="body2" fontWeight={500}>
//                                                 View
//                                             </Typography>
//                                         </Box>
//                                         <Typography variant="caption" color="text.secondary">
//                                             Ability to view entries
//                                         </Typography>
//                                     </Card>
//                                 </Grid>
//                                 <Grid item xs={12} sm={6} md={3}>
//                                     <Card
//                                         elevation={0}
//                                         sx={{
//                                             p: 2,
//                                             borderRadius: 2,
//                                             border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
//                                             bgcolor: alpha(theme.palette.error.main, 0.02),
//                                             transition: "all 0.3s",
//                                             "&:hover": {
//                                                 boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//                                             },
//                                         }}
//                                     >
//                                         <Box display="flex" alignItems="center" mb={1}>
//                                             <Checkbox
//                                                 name="delete"
//                                                 checked={permissionForm.delete}
//                                                 onChange={handleFormChange}
//                                                 color="error"
//                                             />
//                                             <Typography variant="body2" fontWeight={500}>
//                                                 Delete
//                                             </Typography>
//                                         </Box>
//                                         <Typography variant="caption" color="text.secondary">
//                                             Ability to remove entries
//                                         </Typography>
//                                     </Card>
//                                 </Grid>
//                             </Grid>
//                         </Grid>
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions sx={{ px: 3, pb: 3 }}>
//                     <Button onClick={handleClose}>Cancel</Button>
//                     <Button
//                         variant="contained"
//                         onClick={handleSavePermission}
//                         startIcon={<Save />}
//                         sx={{ borderRadius: 2 }}
//                     >
//                         Save Permission
//                     </Button>
//                 </DialogActions>

//             </GarageForm>
//         </Dialog>
//     );
// };

// export default AddEditPermissionDialog;