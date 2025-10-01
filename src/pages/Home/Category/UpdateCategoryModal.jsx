/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} from "../../../redux/api/categoryApi";
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
  alpha,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import GarageForm from "../../../components/form/Form";
import TASInput from "../../../components/form/Input";
import ImageUpload from "../../../components/form/ImageUpload";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

export const UpdateCategoryModal = ({ open, setOpen, categoryId }) => {
    const tenantDomain = useTenantDomain();

  const { data, isLoading } = useGetSingleCategoryQuery({
    tenantDomain,
    id:categoryId,
  })

  const [updateCategory, { isSuccess }] = useUpdateCategoryMutation();

  const [formData, setFormData] = useState({
    main_category: "",
    sub_category: "",
    image: "",
  });

  useEffect(() => {
    if (data?.data) {
      setFormData({
        main_category: data.data.main_category || "",
        sub_category: data.data.sub_category || "",
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

      const res = await updateCategory({
        ...formData,
        image: imageToSubmit,
        id: categoryId,
        tenantDomain,
      }).unwrap();

      if (res.success) {
        toast.success("Category updated successfully!");
        setOpen();
      }
    } catch (error) {
      toast.error(
        "Error updating brand: " + (error.message || "Something went wrong")
      );
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const defaultValues = {
    main_category: data?.data?.main_category || "",
    sub_category: data?.data?.sub_category || "",
    image: data?.data?.image ? data.data.image : "",
  };
  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && !isSuccess && setOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
    >
      <Fade in={isSuccess} timeout={700}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(255, 255, 255, 0.9)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Zoom in={isSuccess} timeout={500}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: alpha("#2e7d32", 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 50, color: "#2e7d32" }} />
            </Box>
          </Zoom>
          <Typography variant="h6" color="#2e7d32" fontWeight={600}>
            Category Updated Successfully!
          </Typography>
        </Box>
      </Fade>

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
            Update Category
          </Typography>
        </Box>
        <IconButton
          onClick={() => !isLoading && !isSuccess && setOpen(false)}
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
          <GarageForm onSubmit={handleSubmit} defaultValues={defaultValues}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ImageUpload
                  defaultValues={data?.data?.image}
                  fullWidth
                  name="image"
                  label="Upload Category Image"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography fontWeight="semi-bold" mb={1}>
                  Main Category
                </Typography>

                <TASInput
                  name="main_category"
                  label="Main Category"
                  placeholder="Main Category"
                  required
                  icon={CategoryIcon}
                  iconPosition="start"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography fontWeight="semi-bold" mb={1}>
                  Sub Category
                </Typography>

                <TASInput
                  name="sub_category"
                  label="Sub Category"
                  placeholder="Sub Category"
                  required
                  icon={CategoryIcon}
                  iconPosition="start"
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={
                    isLoading ||
                    isSuccess ||
                    !formData.main_category ||
                    !formData.sub_category
                  }
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  sx={{
                    borderRadius: 100,
                    background:
                      "linear-gradient(135deg, #6a1b9a 0%, #42A1DA 100%)",
                    boxShadow: "0 4px 10px rgba(106, 27, 154, 0.3)",
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    color: "white",
                  }}
                >
                  {isLoading ? "Updating..." : "Update Category"}
                </Button>
              </Grid>
            </Grid>
          </GarageForm>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
