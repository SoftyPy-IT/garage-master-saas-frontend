/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Category as CategoryIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import UnitTable from "./UnitTable";
import { CreateUnitModal } from "./CreateUnitModal";
import { UpdateUnitModal } from "./UpdateUnitModal";
const Unit = () => {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleUpdateOpen = (id) => setUpdateOpen(id);
  const handleClose = () => setOpen(false);
  const handleUpdateClose = () => setUpdateOpen(null);

  return (
    <div
      className="py-6 md:px-4"
    >
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="800"
          sx={{
            mb: 1,
            background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Value/Unit Management
        </Typography>

        <Breadcrumbs
          separator={
            <NavigateNextIcon fontSize="small" sx={{ color: "#94a3b8" }} />
          }
          aria-label="breadcrumb"
        >
          <Link
            underline="hover"
            color="#64748b"
            href="/dashboard"
            sx={{
              display: "flex",
              alignItems: "center",
              "&:hover": { color: "#6366f1" },
            }}
          >
            <DashboardIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Dashboard
          </Link>
          <Link
            underline="hover"
            color="#64748b"
            href="/dashboard/products"
            sx={{
              display: "flex",
              alignItems: "center",
              "&:hover": { color: "#6366f1" },
            }}
          >
            <CategoryIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Product
          </Link>
          <Typography
            color="#1e293b"
            fontWeight="600"
            sx={{ display: "flex", alignItems: "center" }}
          >
            Value/Unit
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Main Content */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="700" color="#1e293b">
            Unit List
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#6366f1",
              px: 2,
              py: 1,
              boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
              "&:hover": {
                backgroundColor: "#4f46e5",
                boxShadow: "0 15px 20px -3px rgba(99, 102, 241, 0.4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease",
            }}
          >
           + Add New Unit
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
            }}
          >
            <UnitTable handleUpdateOpen={handleUpdateOpen} />
          </Paper>
        </Box>
      </Paper>

      {/* Create Unit Modal */}
      <CreateUnitModal open={open} setOpen={setOpen} />
      {updateOpen && (
        <UpdateUnitModal
          open={Boolean(updateOpen)}
          setOpen={handleUpdateClose}
          unitId={updateOpen}
        />
      )}
    </div>
  );
};

export default Unit;
