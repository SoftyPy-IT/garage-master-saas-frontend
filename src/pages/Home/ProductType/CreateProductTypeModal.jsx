/* eslint-disable no-unused-vars */
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
} from "@mui/material";

import {
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import GarageForm from "../../../components/form/Form";
import TASInput from "../../../components/form/Input";
import { useCreateProductTypeMutation } from "../../../redux/api/productTypeApi";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
export const CreateProductTypeModal = ({ open, setOpen }) => {
  const tenantDomain = useTenantDomain();
  const [productType] = useCreateProductTypeMutation();

  const handleSubmit = async (formData) => {
    try {
      const res = await productType({ tenantDomain, data: formData }).unwrap();
      if (res.success) {
        toast.success("Product Type created successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #6a1b9a 0%, #42A1DA 100%)",
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CategoryIcon sx={{ color: "white", mr: 1.5, fontSize: 28 }} />
          <Typography
            variant="h6"
            component="h2"
            sx={{ color: "white", fontWeight: 600 }}
          >
            Create Brand
          </Typography>
        </Box>
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            color: "white",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <GarageForm onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography fontWeight="semi-bold" mb={1}>
                  Product Type
                </Typography>
                <TASInput
                  size="medium"
                  fullWidth
                  name="product_type"
                  label="Product Type "
                />
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Button type="submit" sx={{ color: "white" }}>
                  Create Product Type
                </Button>
              </Grid>
            </Grid>
          </GarageForm>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
