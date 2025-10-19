/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  Category as CategoryIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import SupplierForm from "./SupplierForm";

export const AddSupplierModal = ({ open, setOpen }) => {


  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="xl"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #6a1b9a 0%, #42A1DA 100%)",
          py: 2,
          px: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CategoryIcon sx={{ color: "white", mr: 1, fontSize: 28 }} />
          <Typography
            variant="h6"
            component="h2"
            sx={{ color: "white", fontWeight: 600 }}
          >
            Create Supplier
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
        {/* <Box sx={{ p: 3 }}> */}
          <SupplierForm/>
        {/* </Box> */}
      </DialogContent>
    </Dialog>
  );
};
