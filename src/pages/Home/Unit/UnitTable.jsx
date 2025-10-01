/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Pagination,
  alpha,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FileDownload as ExportIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import {
  useDeleteUnitMutation,
  useGetAllIUnitQuery,
} from "../../../redux/api/unitApi";
import { UpdateUnitModal } from "./UpdateUnitModal";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

const UnitTable = ({ handleUpdateOpen }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
 const tenantDomain = useTenantDomain();

  const { data, isLoading, refetch } = useGetAllIUnitQuery({
    tenantDomain,
    limit: 10,
    page: currentPage,
    searchTerm: search,
  });

  const [deleteUnit, { isLoading: isDeleting }] = useDeleteUnitMutation();

  const units = data?.data?.units || [];
  const meta = data?.data?.meta || {};
  const totalPage = meta.totalPage || 1;

  const handleMenuOpen = (event, unit) => {
    setAnchorEl(event.currentTarget);
    setSelectedUnit(unit);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenUpdateModal = () => {
    setOpenUpdateModal(true);
    handleMenuClose();
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const handleOpenViewDetails = () => {
    setViewDetailsModal(true);
    handleMenuClose();
  };

  const handleCloseViewDetails = () => {
    setViewDetailsModal(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      customClass: {
        title: "text-gray-800 text-xl font-bold",
        content: "text-gray-700",
        confirmButton: "rounded-lg text-white font-medium px-5 py-2",
        cancelButton: "rounded-lg text-white font-medium px-5 py-2",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUnit({tenantDomain, id}).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "The unit has been deleted successfully.",
            icon: "success",
            confirmButtonColor: "#6366f1",
            background: "#ffffff",
            customClass: {
              title: "text-gray-800 text-xl font-bold",
              content: "text-gray-700",
              confirmButton: "rounded-lg text-white font-medium px-5 py-2",
            },
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the unit.",
            icon: "error",
            confirmButtonColor: "#6366f1",
            background: "#ffffff",
            customClass: {
              title: "text-gray-800 text-xl font-bold",
              content: "text-gray-700",
              confirmButton: "rounded-lg text-white font-medium px-5 py-2",
            },
          });
        }
      }
    });
  };

  // Get random color for unit cards
  const getRandomColor = (id) => {
    if (!id) return "#6366f1"; 

    const colors = [
      "#6366f1",
      "#8b5cf6", 
      "#ec4899",
      "#f43f5e", 
      "#f97316", 
      "#eab308",
      "#10b981", 
      "#06b6d4",
      "#3b82f6",
    ];

    try {

      const index =
        id
          .toString()
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
      return colors[index];
    } catch (error) {
      console.error("Error generating color:", error);
      return "#6366f1"; 
    }
  };

  return (
    <>
   
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
        }}
      >
        <TextField
          placeholder="Search units..."
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearch}
          sx={{
            minWidth: { xs: "100%", sm: "300px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#fff",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              "&:hover": {
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Filter">
            <IconButton
              size="small"
              sx={{
                backgroundColor: "#f1f5f9",
                "&:hover": { backgroundColor: "#e2e8f0" },
              }}
            >
              <FilterIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton
              onClick={() => refetch()}
              size="small"
              sx={{
                backgroundColor: "#f1f5f9",
                "&:hover": { backgroundColor: "#e2e8f0" },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export">
            <IconButton
              size="small"
              sx={{
                backgroundColor: "#f1f5f9",
                "&:hover": { backgroundColor: "#e2e8f0" },
              }}
            >
              <ExportIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Units Table */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 5,
          }}
        >
          <CircularProgress size={40} sx={{ color: "#6366f1" }} />
        </Box>
      ) : units.length === 0 ? (
        <Box sx={{ p: 5, textAlign: "center" }}>
          <Typography variant="h6" color="#64748b" gutterBottom>
            No units found
          </Typography>
          <Typography variant="body2" color="#94a3b8">
            Try changing your search or add a new unit
          </Typography>
        </Box>
      ) : (
        <Box sx={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#475569",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  Image
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#475569",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  Unit Name
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#475569",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  Short Name
                </th>
                <th
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    fontWeight: 600,
                    color: "#475569",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {units.map((unit, index) => (
                  <motion.tr
                    key={unit._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    style={{ borderBottom: "1px solid #e2e8f0" }}
                  >
                    <td style={{ padding: "16px" }}>
                      <Avatar
                        src={unit.image}
                        alt={unit.unit}
                        variant="rounded"
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                          border: "2px solid #fff",
                          backgroundColor: alpha(getRandomColor(unit._id), 0.1),
                        }}
                      />
                    </td>
                    <td style={{ padding: "16px" }}>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        color="#1e293b"
                      >
                        {unit.unit}
                      </Typography>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <Chip
                        label={unit.short_name}
                        size="small"
                        sx={{
                          backgroundColor: alpha(getRandomColor(unit._id), 0.1),
                          color: getRandomColor(unit._id),
                          fontWeight: 600,
                          borderRadius: "8px",
                        }}
                      />
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, unit)}
                            sx={{
                              backgroundColor: alpha("#6366f1", 0.1),
                              color: "#6366f1",
                              "&:hover": {
                                backgroundColor: alpha("#6366f1", 0.2),
                              },
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateOpen(unit._id)}
                            sx={{
                              backgroundColor: alpha("#3b82f6", 0.1),
                              color: "#3b82f6",
                              "&:hover": {
                                backgroundColor: alpha("#3b82f6", 0.2),
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(unit._id)}
                            sx={{
                              backgroundColor: alpha("#ef4444", 0.1),
                              color: "#ef4444",
                              "&:hover": {
                                backgroundColor: alpha("#ef4444", 0.2),
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </Box>
      )}

      {/* Pagination */}
      {units.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Pagination
            count={totalPage}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "8px",
                "&.Mui-selected": {
                  backgroundColor: "#6366f1",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#4f46e5",
                  },
                },
              },
            }}
          />
        </Box>
      )}

      {/* Unit Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: "12px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            minWidth: "180px",
          },
        }}
      >
        <MenuItem onClick={handleOpenViewDetails} sx={{ color: "#6366f1" }}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleOpenUpdateModal} sx={{ color: "#3b82f6" }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => handleDelete(selectedUnit?._id)}
          sx={{ color: "#ef4444" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Update Unit Modal */}
      {selectedUnit && openUpdateModal && (
        <UpdateUnitModal
          unit={selectedUnit}
          open={openUpdateModal}
          handleClose={handleCloseUpdateModal}
        />
      )}

      {/* View Details Modal */}
      <Dialog
        open={viewDetailsModal}
        onClose={handleCloseViewDetails}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 3,
            background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight="700">
            Unit Details
          </Typography>
          <IconButton
            onClick={handleCloseViewDetails}
            size="small"
            sx={{
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedUnit && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Avatar
                  src={selectedUnit.image}
                  alt={selectedUnit.unit}
                  variant="rounded"
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    border: "4px solid #fff",
                    backgroundColor: alpha(
                      getRandomColor(selectedUnit._id),
                      0.1
                    ),
                  }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="#64748b" gutterBottom>
                  Unit Name
                </Typography>
                <Typography variant="h6" fontWeight="700" color="#1e293b">
                  {selectedUnit.unit}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="#64748b" gutterBottom>
                  Short Name
                </Typography>
                <Chip
                  label={selectedUnit.short_name}
                  sx={{
                    backgroundColor: alpha(
                      getRandomColor(selectedUnit._id),
                      0.1
                    ),
                    color: getRandomColor(selectedUnit._id),
                    fontWeight: 600,
                    borderRadius: "8px",
                    fontSize: "1rem",
                    py: 1,
                  }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="#64748b" gutterBottom>
                  ID
                </Typography>
                <Typography
                  variant="body1"
                  color="#1e293b"
                  sx={{ wordBreak: "break-all" }}
                >
                  {selectedUnit._id}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseViewDetails}
            variant="outlined"
            sx={{
              borderRadius: "12px",
              color: "#64748b",
              borderColor: "#cbd5e1",
              "&:hover": {
                borderColor: "#94a3b8",
                backgroundColor: "#f8fafc",
              },
              px: 3,
              py: 1,
            }}
          >
            Close
          </Button>
          <Button
            onClick={handleOpenUpdateModal}
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#6366f1",
              boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
              "&:hover": {
                backgroundColor: "#4f46e5",
                boxShadow: "0 15px 20px -3px rgba(99, 102, 241, 0.4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease",
              px: 3,
              py: 1,
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UnitTable;
