""/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import {
  Category as CategoryIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  BrandingWatermark,
} from "@mui/icons-material";
import GarageForm from "../../../components/form/Form";
import TASInput from "../../../components/form/Input";
import {
  useGetSingleBrandQuery,
  useUpdateBrandMutation,
} from "../../../redux/api/brandApi";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

export const UpdateBrand = ({ open, setOpen, brandId }) => {
  const [updateBrand, { isSuccess, isLoading: isUpdating }] = useUpdateBrandMutation();
  const tenantDomain = useTenantDomain();

  const { data, isLoading } = useGetSingleBrandQuery({ tenantDomain, id: brandId });
  const [formData, setFormData] = useState({ brand: "", image: "" });

  useEffect(() => {
    if (data?.data) {
      setFormData({
        brand: data.data.brand || "",
        image: data.data.image || "",
      });
    }
  }, [data]);

  const handleSubmit = async (formData) => {
    try {
      const imageToSubmit =
        formData.image && formData.image.length > 0
          ? formData.image[0]
          : data?.data?.image;

      const res = await updateBrand({
        ...formData,
        image: imageToSubmit,
        id: brandId,
        tenantDomain,
      }).unwrap();

      if (res.success) {
        toast.success("Brand updated successfully!");
        setOpen();
      }
    } catch (error) {
      toast.error("Error updating brand: " + (error.message || "Something went wrong"));
    }
  };

  if (isLoading) return <p>Loading...</p>;

  const defaultValues = {
    brand: data?.data?.brand || "",
    image: data?.data?.image || "",
  };

  return (
    <Dialog
      open={open}
      onClose={() => !isUpdating && !isSuccess && setOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: "hidden", boxShadow: 8 } }}
    >
      <Box
        sx={{
          background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CategoryIcon sx={{ color: "white", mr: 1 }} />
          <Typography variant="h6" color="white" fontWeight={700}>
            Update Brand
          </Typography>
        </Box>
        <IconButton
          onClick={() => !isUpdating && !isSuccess && setOpen(false)}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        <GarageForm onSubmit={handleSubmit} defaultValues={defaultValues}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography fontWeight={600} mb={1}>
                Brand Name
              </Typography>
              <TASInput
                name="brand"
                label="Brand Name"
                placeholder="Enter brand name"
                required
                icon={BrandingWatermark}
                iconPosition="start"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={
                  isUpdating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />
                }
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  textTransform: "none",
                  borderRadius: 3,
                  background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: "0px 8px 16px rgba(99, 102, 241, 0.2)",
                  color: "white",
                  '&:hover': {
                    background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
                  },
                }}
              >
                {isUpdating ? "Updating..." : "Update Brand"}
              </Button>
            </Grid>
          </Grid>
        </GarageForm>
      </DialogContent>
    </Dialog>
  );
};
