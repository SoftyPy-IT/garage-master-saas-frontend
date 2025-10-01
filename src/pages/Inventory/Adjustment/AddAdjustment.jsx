"use client";

import { motion } from "framer-motion";
import { Box, Typography, Breadcrumbs, Link, Paper } from "@mui/material";
import {
  Home as HomeIcon,
  Inventory as InventoryIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import AddAdjustmentForm from "./AddJustmentForm";

const AddAdjustment = () => {
  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
      {/* Header with animated elements */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight="800"
            sx={{
              background:
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
              textShadow: "0px 2px 5px rgba(0,0,0,0.1)",
              letterSpacing: "-0.5px",
            }}
          >
            Add Inventory Adjustment
          </Typography>

          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
            sx={{
              "& .MuiBreadcrumbs-separator": {
                mx: 1,
                color: "#94a3b8",
              },
            }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="/dashboard"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "#64748b",
                "&:hover": { color: "#6366f1" },
              }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Dashboard
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="/dashboard/product"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "#64748b",
                "&:hover": { color: "#6366f1" },
              }}
            >
              <InventoryIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Product
            </Link>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                color: "#6366f1",
                fontWeight: 600,
              }}
            >
              <AddIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Add Adjustment
            </Typography>
          </Breadcrumbs>
        </Box>
      </motion.div>

      {/* Main content with animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: "24px",
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 4 } }}>
            <AddAdjustmentForm />
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default AddAdjustment;
