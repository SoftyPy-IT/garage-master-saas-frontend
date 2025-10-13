/* eslint-disable react/prop-types */
import { Dialog, DialogContent, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function GarageModal({
  open,
  setOpen,
  title,
  icon,
  children,
  maxWidth = "sm",
}) {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #499ccc 0%, #499ccc 100%)",
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {icon && <Box sx={{ mr: 1.5 }}>{icon}</Box>}
          <Typography
            variant="h6"
            component="h2"
            sx={{ color: "white", fontWeight: 600 }}
          >
            {title}
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

      {/* Body */}
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>{children}</Box>
      </DialogContent>
    </Dialog>
  );
}
