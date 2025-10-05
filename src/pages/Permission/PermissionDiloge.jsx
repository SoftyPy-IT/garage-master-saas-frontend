/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Avatar,
  Typography,
  Box,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import { Security, Save } from "@mui/icons-material";
import GarageForm from "../../components/form/Form";
import AutocompleteSelect from "../../components/form/AutocompleteSelect";
import FormAutocomplete from "../../components/form/FormAutocomplete";
import FormCheckBox from "../../components/form/checkbox";
import { usePermissionFormData } from "../../hooks/usePermissionFormData";
import { useCreatePermissionMutation } from "../../redux/api/permissionApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/feature/authSlice";

const AddEditPermissionDialog = ({
  open,
  handleClose,
  permissionType,
  handleSavePermission,
}) => {
  const theme = useTheme();
  const { userOptions, pageOptions, tenantDomain, roleOptions } = usePermissionFormData();
  const [createPermission] = useCreatePermissionMutation();
  const user = useSelector(selectCurrentUser);
  const handleSubmit = async (data) => {
    try {

      const permissionData = {
        pageId: data.pageId,
        create: data.create || false,
        edit: data.edit || false,
        view: data.view || false,
        delete: data.delete || false,
      };
      console.log('Prepared permission data:', permissionData);

      // Use current user's ID (if that's what your backend expects)
      const result = await createPermission({
        userId: user.userId,
        tenantDomain,
        data: permissionData
      }).unwrap();

      console.log('Permission created successfully:', result);
      handleClose();

      if (handleSavePermission) {
        handleSavePermission(result);
      }

    } catch (error) {
      console.error('Error creating permission:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: "hidden" },
      }}
    >
      <GarageForm onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            py: 3,
          }}
        >
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                mr: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }}
            >
              <Security />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {permissionType === "edit"
                  ? "Edit Permission"
                  : "Add New Permission"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure access control for users and roles
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <AutocompleteSelect
                options={userOptions}
                name="userId"
                label="Select User"
                size="normal"
                margin="normal"

              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormAutocomplete
                options={pageOptions}
                name="pageId"
                label="Select Page"
                margin="normal"

              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormAutocomplete
                options={roleOptions}
                name="roleId"
                label="Select Role"
                margin="normal"

              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Permissions
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormCheckBox
                    name="create"
                    label="Create"
                    description="Ability to create new entries"
                    size="none"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormCheckBox
                    name="edit"
                    label="Edit"
                    description="Ability to modify existing entries"
                    size="none"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormCheckBox
                    name="view"
                    label="View"
                    description="Ability to view entries"
                    size="none"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormCheckBox
                    name="delete"
                    label="Delete"
                    description="Ability to remove entries"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            sx={{ borderRadius: 2 }}
          >
            Save Permission
          </Button>
        </DialogActions>
      </GarageForm>
    </Dialog>
  );
};

export default AddEditPermissionDialog;
