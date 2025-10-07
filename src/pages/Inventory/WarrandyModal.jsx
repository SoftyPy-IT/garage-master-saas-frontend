/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useEffect } from "react";
import {
  useCreateWarrantyMutation,
  useUpdateWarrantyMutation,
  useGetSingleWarrantyQuery,
} from "../../redux/api/warrantyApi";
import { toast } from "react-toastify";
import GarageForm from "../../components/form/Form";
import FormInput from "../../components/form/Input";
import TASSelect from "../../components/form/Select";
import Loading from "../../components/Loading/Loading";
import { useTenantDomain } from "../../hooks/useTenantDomain";

const CreateWarrantyModal = ({ open, onClose, editingWarranty }) => {
  const [createWarranty] = useCreateWarrantyMutation();
  const [updateWarranty] = useUpdateWarrantyMutation();
  const { data: singleWarranty, isLoading } = useGetSingleWarrantyQuery(
    editingWarranty?._id,
    { skip: !editingWarranty?._id }
  );
  const tenantDomain = useTenantDomain();
  useEffect(() => {
    if (singleWarranty && editingWarranty) {
      // If you need to prefill form with fetched data
    }
  }, [singleWarranty, editingWarranty]);

  const handleSubmit = async (data) => {
    try {
      let res;
      if (editingWarranty) {
        res = await updateWarranty({
          id: editingWarranty._id,
          tenantDomain,
          ...data,
        }).unwrap();
      } else {
        res = await createWarranty({
          ...data,
          tenantDomain,
        }).unwrap();
      }

      if (res.success) {
        toast.success(
          `Warranty ${editingWarranty ? "updated" : "created"} successfully!`
        );
        onClose();
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const formatDurationTypeForSelect = (type) => {
    if (!type) return "";
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  const defaultValues = {
    name: editingWarranty?.name || "",
    terms: editingWarranty?.terms || "",
    duration: editingWarranty?.duration || "",
    durationType:
      formatDurationTypeForSelect(editingWarranty?.durationType) || "",
    description: editingWarranty?.description || "",
  };

  // Convert select values back to lowercase for database
  const formatDurationTypeForDatabase = (type) => {
    return type.toLowerCase();
  };

  const handleFormSubmit = (data) => {
    const formattedData = {
      ...data,
      durationType: formatDurationTypeForDatabase(data.durationType),
    };
    handleSubmit(formattedData);
  };


  return (
    <>
      {isLoading && <Loading />}
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <VerifiedUserIcon />
            <Typography variant="h6" sx={{ ml: 1 }}>
              {editingWarranty ? "Update Warranty" : "Add New Warranty"}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <GarageForm onSubmit={handleFormSubmit} defaultValues={defaultValues}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormInput
                  name="name"
                  label={
                    <>
                      Warranty Name
                      <span style={{ color: "red", fontSize: "25px" }}> *</span>
                    </>
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormInput
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <FormInput
                  name="duration"
                  label={
                    <>
                      Duration
                      <span style={{ color: "red", fontSize: "25px" }}> *</span>
                    </>
                  }
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TASSelect
                  label={
                    <>
                      Duration Type
                      <span style={{ color: "red", fontSize: "25px" }}> *</span>
                    </>
                  }
                  name="durationType"
                  fullWidth
                  size="medium"
                  items={["Days", "Months", "Years"]}
                />
              </Grid>
              <Grid item xs={12}>
                <FormInput
                  name="terms"
                  label="Terms & Conditions"
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingWarranty ? "Update" : "Save"}
              </Button>
            </DialogActions>
          </GarageForm>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateWarrantyModal;
