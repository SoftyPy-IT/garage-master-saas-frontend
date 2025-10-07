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
  CircularProgress,
} from "@mui/material";
import { Security, Save } from "@mui/icons-material";
import GarageForm from "../../components/form/Form";
import FormCheckBox from "../../components/form/checkbox";
import FormAutoCompleted from "../../components/form/FormAutoCompleted";
import { usePermissionFormData } from "../../hooks/usePermissionFormData";
import { useCreatePermissionMutation, useUpdatePermissionMutation, useGetSinglePermissionQuery } from "../../redux/api/permissionApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/feature/authSlice";
import { toast } from "react-toastify";

const AddEditPermissionDialog = ({
  open,
  handleClose,
  permissionId,
  permissionType = "add",
}) => {
  const theme = useTheme();
  const { userOptions, pageOptions, tenantDomain, roleOptions } = usePermissionFormData();
  const [createPermission] = useCreatePermissionMutation();
  const [updatePermission] = useUpdatePermissionMutation();
  const user = useSelector(selectCurrentUser);

  const { data: singlePermissionData, isLoading: permissionLoading } = useGetSinglePermissionQuery(
    { tenantDomain, id: permissionId },
    { skip: !permissionId || permissionType !== "edit" }
  );

  const handleSubmit = async (data) => {
    try {
      const pageId = data.pageId?.value || data.pageId;
      const userId = data.userId?.value || data.userId;
      const roleId = data.roleId?.value || data.roleId;

      const permissionData = {
        pageId: [pageId],
        userId: [userId],
        roleId: [roleId],
        create: data.create || false,
        edit: data.edit || false,
        view: data.view || false,
        delete: data.delete || false,
      };

      let result;
      if (permissionType === "edit" && permissionId) {
        result = await updatePermission({
          userId: user.userId,
          id: permissionId,
          tenantDomain,
          data: permissionData,
        }).unwrap();
      } else {
        result = await createPermission({
          userId: user.userId,
          tenantDomain,
          data: permissionData,
        }).unwrap();
      }

      console.log('result', result)
      if (result.success) {
        toast.success(result.message || 'Permission successfully !')
        handleClose();

      }



    } catch (error) {
      console.error(
        `Error ${permissionType === "edit" ? "updating" : "creating"} permission:`,
        error
      );
    }
  };

  const defaultValues = permissionType === "edit" && singlePermissionData?.data?.hasPermission
    ? {
      userId: singlePermissionData.data.hasPermission.userId[0]
        ? {
          value: singlePermissionData.data.hasPermission.userId[0]._id || singlePermissionData.data.hasPermission.userId[0].id,
          label: singlePermissionData.data.hasPermission.userId[0].name,
        }
        : null,
      roleId: singlePermissionData.data.hasPermission.roleId[0]
        ? {
          value: singlePermissionData.data.hasPermission.roleId[0]._id,
          label: singlePermissionData.data.hasPermission.roleId[0].name,
        }
        : null,
      pageId: singlePermissionData.data.hasPermission.pageId[0]
        ? {
          value: singlePermissionData.data.hasPermission.pageId[0]._id,
          label: singlePermissionData.data.hasPermission.pageId[0].name,
        }
        : null,
      create: singlePermissionData.data.hasPermission.create || false,
      edit: singlePermissionData.data.hasPermission.edit || false,
      view: singlePermissionData.data.hasPermission.view || false,
      delete: singlePermissionData.data.hasPermission.delete || false,
    }
    : {
      userId: null,
      roleId: null,
      pageId: null,
      create: false,
      edit: false,
      view: false,
      delete: false,
    };

  // Loading state
  if (permissionType === "edit" && permissionLoading) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Loading permission data...
          </Typography>
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
    >
      <GarageForm onSubmit={handleSubmit} defaultValues={defaultValues}>
        <DialogTitle sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), py: 3 }}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
              <Security />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {permissionType === "edit" ? "Edit Permission" : "Add New Permission"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {permissionType === "edit"
                  ? "Update permission settings"
                  : "Configure access control for users and roles"}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormAutoCompleted
                options={userOptions}
                name="userId"
                label="Select User"
                size="normal"
                margin="normal"
                multiple={false}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormAutoCompleted
                options={pageOptions}
                name="pageId"
                label="Select Page"
                margin="normal"
                multiple={false}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormAutoCompleted
                options={roleOptions}
                name="roleId"
                label="Select Role"
                margin="normal"
                multiple={false}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Permissions
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormCheckBox name="create" label="Create" description="Ability to create new entries" size="none" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormCheckBox name="edit" label="Edit" description="Ability to modify existing entries" size="none" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormCheckBox name="view" label="View" description="Ability to view entries" size="none" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormCheckBox name="delete" label="Delete" description="Ability to remove entries" />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" startIcon={<Save />} sx={{ borderRadius: 2 }}>
            {permissionType === "edit" ? "Update Permission" : "Save Permission"}
          </Button>
        </DialogActions>
      </GarageForm>
    </Dialog>
  );
};

export default AddEditPermissionDialog;
