/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
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
  Fade,
} from "@mui/material";
import {
  Category as CategoryIcon,
  CheckCircle as CheckCircleIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useCreateCategoryMutation } from "../../../redux/api/categoryApi";
import GarageForm from "../../../components/form/Form";
import ImageUpload from "../../../components/form/ImageUpload";
import TASInput from "../../../components/form/Input";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

export const CreateCategoryModal = ({ open, setOpen, categoryId }) => {
  const [createCategory, { isLoading, isSuccess }] =
    useCreateCategoryMutation();
  const tenantDomain = useTenantDomain();

  const handleSubmit = async (data) => {
    try {
      const imageUrl =
        data.image && data.image.length > 0 ? data.image[0] : data?.data?.image;
      const res = await createCategory({
        ...data,
        image: imageUrl,
        tenantDomain
      }).unwrap();

      if (res.success) {
        toast.success("Category create successfully!");
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
        ></Box>
      </Fade>

      <Box
        sx={{
          background: "#42A1DA",
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
            Create Category
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
          <GarageForm onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ImageUpload
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
                  // disabled={
                  //   isLoading ||
                  //   isSuccess ||
                  //   !formData.main_category ||
                  //   !formData.sub_category
                  // }
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
                      "#42A1DA",
                    boxShadow: "0 4px 10px rgba(106, 27, 154, 0.3)",
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    color: "white",
                  }}
                >
                  Create Category
                </Button>
              </Grid>
            </Grid>
          </GarageForm>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
