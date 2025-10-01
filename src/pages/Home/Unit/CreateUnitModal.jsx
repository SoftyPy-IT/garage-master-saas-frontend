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
} from "@mui/material";
import {
  Category as CategoryIcon,

  Save as SaveIcon,
  Close as CloseIcon,
  BrandingWatermark,
} from "@mui/icons-material";
import { useCreateUnitMutation } from "../../../redux/api/unitApi";
import GarageForm from "../../../components/form/Form";
import TASInput from "../../../components/form/Input";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

export const CreateUnitModal = ({ open, setOpen }) => {
  const [createUnit, { isLoading, isSuccess }] = useCreateUnitMutation();
  const tenantDomain = useTenantDomain();
 
  const handleSubmit = async (formData) => {
    try {
      

      const res = await createUnit({
        ...formData,
        tenantDomain
      }).unwrap();

      if (res.success) {
        toast.success("Unit created successfully!");

        setOpen();
      }
    } catch (error) {
      toast.error(
        "Error creating unit: " + (error.message || "Something went wrong")
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
            Create Unit
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
                <TASInput
                  name="unit"
                  label="Enter unit name"
                  placeholder="Enter unit name"
                  required
                  icon={BrandingWatermark}
                  iconPosition="start"
                />
              </Grid>
              <Grid item xs={12}>
                <TASInput
                  name="short_name"
                  label="Enter short name"
                  placeholder="Enter short name"
                  required
                  icon={BrandingWatermark}
                  iconPosition="start"
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
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
                  Create Unit
                </Button>
              </Grid>
            </Grid>
          </GarageForm>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
