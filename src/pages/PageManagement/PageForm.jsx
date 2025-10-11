/* eslint-disable react/prop-types */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Grid,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import GarageForm from "../../components/form/Form";
import FormInput from "../../components/form/Input";
import FormSelect from "../../components/form/Select";
import {
  useCreatePageMutation,
  useUpdatePageMutation,
} from "../../redux/api/pageApi";
import { toast } from "react-toastify";

const PageForm = ({ open, onClose, pageData, mode, tenantDomain }) => {
  const [createPage] = useCreatePageMutation();
  const [updatePage] = useUpdatePageMutation();
  const isEditMode = mode === "edit" && pageData;
  const defaultValues = {
    name: pageData?.name || "",
    path: pageData?.path || "",
    category: pageData?.category || '',
    route: pageData?.route || "",
    status: pageData?.status || "",
  };

  const handleSubmit = async (formData) => {
    try {
      let res;

      if (isEditMode) {
        res = await updatePage({
          id: pageData._id,
          tenantDomain,
          ...formData,
        }).unwrap();

        if (res.success) {
          toast.success(res.message || "Form updated successfully");
          onClose();
        }
      } else {
        res = await createPage({
          tenantDomain,
          data: formData,
        }).unwrap();

        if (res.success) {
          toast.success(res.message || "Form created successfully");
          onClose();
        }
      }
    } catch (error) {
      toast.error(
        error.data?.message || error.message || "Something went wrong!"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <GarageForm onSubmit={handleSubmit} defaultValues={defaultValues}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>{isEditMode ? "Edit Page" : "Add New Page"}</Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {!tenantDomain && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Tenant domain not found. Please try logging in again.
            </Alert>
          )}

          <Grid container spacing={2}>

            <Grid item xs={12}>
              <FormInput
                fullWidth
                label="Page Category"
                name="category"
                defaultValue={isEditMode ? pageData.category : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                fullWidth
                label="Page Name"
                name="name"
                defaultValue={isEditMode ? pageData.name : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                fullWidth
                label="Path"
                name="path"
                placeholder="/example-path"
                required
                defaultValue={isEditMode ? pageData.path : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                fullWidth
                label="Route"
                name="route"
                placeholder="example-route"
                required
                defaultValue={isEditMode ? pageData.route : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <FormSelect
                size="normal"
                label="Status"
                items={["Active", "Inactive"]}
                name="status"
                defaultValue={isEditMode ? pageData.status : "Active"}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!tenantDomain}
          >
            {isEditMode ? "Update Page" : "Create Page"}
          </Button>
        </DialogActions>
      </GarageForm>
    </Dialog>
  );
};

export default PageForm;