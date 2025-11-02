/* eslint-disable react/prop-types */
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  alpha,
  Box,
  CircularProgress,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { GradientButton } from "../../../utils/customStyle";

export default function ExpiredHeader({
  handleRefresh,
  handleOpenDisposalDialog,
  handleMenuOpen,
  refreshing,
  isLoading,
  processedProducts,
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "center" },
        mb: 3,
        gap: 2,
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontWeight: 700,
          background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
          backgroundClip: "text",
          textFillColor: "transparent",
          display: "inline-block",
        }}
      >
        <WarningAmberIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Expired Products
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <GradientButton
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={refreshing || isLoading}
        >
          {refreshing ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Refresh"
          )}
        </GradientButton>

        <GradientButton
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleOpenDisposalDialog}
          disabled={processedProducts.length === 0}
        >
          Dispose
        </GradientButton>

        <IconButton
          color="primary"
          onClick={handleMenuOpen}
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.2),
            },
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
