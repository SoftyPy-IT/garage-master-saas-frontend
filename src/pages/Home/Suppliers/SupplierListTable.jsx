/* eslint-disable react/prop-types */
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  Tooltip,
  Typography,
  Fade,
  useTheme,
  alpha,
  Snackbar,
  LinearProgress,
  Checkbox,
} from "@mui/material";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";

import { Link } from "react-router-dom";
import {
  useGetAllSuppliersQuery,
  useMoveRecycledSupplierMutation,
} from "../../../redux/api/supplier";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import {
  AnimatedIconButton,
  GlassCard,
  GradientButton,
  StatusChip,
  SupplierAvatar,
} from "../../../utils/customStyle";
import swal from "sweetalert";

const WorldClassSupplierList = () => {
  const theme = useTheme();

  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("full_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const itemsPerPage = 5;
  const limit = 15;
  const tenantDomain = useTenantDomain();
  const [moveRecycledSupplier] = useMoveRecycledSupplierMutation();
  const {
    data: allSuppliers,
    isLoading,
  } = useGetAllSuppliersQuery({
    tenantDomain,
    limit,
    page: currentPage,
    isRecycled: false,
  });

  useEffect(() => {
    if (allSuppliers?.success && allSuppliers?.data?.suppliers) {
      const apiSuppliers = allSuppliers.data.suppliers;
      setSuppliers(apiSuppliers);
    }
  }, [allSuppliers]);

  // Apply sorting to suppliers
  const sortedSuppliers = [...suppliers].sort((a, b) => {
    let valueA = a[sortBy] || "";
    let valueB = b[sortBy] || "";

    if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Calculate pagination
  const totalPages = allSuppliers?.data?.meta?.totalPage || 1;
  const totalCount = allSuppliers?.data?.meta?.total || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

  // Handlers
  const handleSort = (property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSortBy(property);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const handleDeleteSupplier = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: " You want to move  this supplier recycle bin?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await moveRecycledSupplier({ tenantDomain, id }).unwrap();
        swal(
          "Move to Recycle bin!",
          "Move to Recycle bin successful.",
          "success"
        );
      } catch (error) {
        swal("Error", "An error occurred while deleting the card.", "error");
      }
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sortedSuppliers.map((supplier) => supplier._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircleIcon fontSize="small" />;
      case "inactive":
        return <CancelIcon fontSize="small" />;
      case "pending":
        return <WarningIcon fontSize="small" />;
      default:
        return null;
    }
  };


  return (
    <div className="w-full mt-5 px-0 md:px-0 ">
      <GlassCard className="p-5">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h2 className="text-xl md:text-2xl font-bold flex items-center">
            <BusinessIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            Supplier Management
          </h2>

          <div className="md:flex gap-2">
            <GradientButton
              to="/dashboard/add-supplier"
              component={Link}
              startIcon={<AddIcon />}
            >
              Add Supplier
            </GradientButton>
          </div>
        </div>

        {/* Selected items info */}
        {selectedRows.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              p: 1,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 1,
            }}
          >
            <Typography variant="body2">
              {selectedRows.length}{" "}
              {selectedRows.length === 1 ? "supplier" : "suppliers"} selected
            </Typography>
            <Button
              size="small"
              onClick={() => {
                setSelectedRows([]);
                setSelectAll(false);
              }}
            >
              Clear selection
            </Button>
          </Box>
        )}

        {/* Loading indicator */}
        {isLoading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Suppliers Table */}
        {suppliers.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No suppliers found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No suppliers available
            </Typography>
          </Box>
        ) : (
          <Fade in={!isLoading}>
            <Box
              sx={{
                width: "100%",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                "&::-webkit-scrollbar": {
                  height: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: theme.palette.divider,
                  borderRadius: "3px",
                },
              }}
            >
              <Table stickyHeader>
                <thead>
                  <tr
                    style={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <th style={{ padding: "16px 8px" }}>
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                        indeterminate={
                          selectedRows.length > 0 &&
                          selectedRows.length < sortedSuppliers.length
                        }
                      />
                    </th>
                    <th
                      style={{ padding: "16px", cursor: "pointer" }}
                      onClick={() => handleSort("supplierId")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        ID
                        {sortBy === "supplierId" && (
                          <Box sx={{ ml: 1 }}>
                            {sortOrder === "asc" ? (
                              <ArrowUpwardIcon fontSize="small" />
                            ) : (
                              <ArrowDownwardIcon fontSize="small" />
                            )}
                          </Box>
                        )}
                      </Box>
                    </th>
                    <th
                      style={{ padding: "16px", cursor: "pointer" }}
                      onClick={() => handleSort("full_name")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        Supplier
                        {sortBy === "full_name" && (
                          <Box sx={{ ml: 1 }}>
                            {sortOrder === "asc" ? (
                              <ArrowUpwardIcon fontSize="small" />
                            ) : (
                              <ArrowDownwardIcon fontSize="small" />
                            )}
                          </Box>
                        )}
                      </Box>
                    </th>
                    <th
                      style={{ padding: "16px", cursor: "pointer" }}
                      onClick={() => handleSort("shop_name")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        Company
                        {sortBy === "shop_name" && (
                          <Box sx={{ ml: 1 }}>
                            {sortOrder === "asc" ? (
                              <ArrowUpwardIcon fontSize="small" />
                            ) : (
                              <ArrowDownwardIcon fontSize="small" />
                            )}
                          </Box>
                        )}
                      </Box>
                    </th>
                    <th style={{ padding: "16px" }}>Contact</th>
                    <th
                      style={{ padding: "16px", cursor: "pointer" }}
                      onClick={() => handleSort("supplier_status")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        Status
                        {sortBy === "supplier_status" && (
                          <Box sx={{ ml: 1 }}>
                            {sortOrder === "asc" ? (
                              <ArrowUpwardIcon fontSize="small" />
                            ) : (
                              <ArrowDownwardIcon fontSize="small" />
                            )}
                          </Box>
                        )}
                      </Box>
                    </th>

                    <th style={{ padding: "16px", textAlign: "center" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSuppliers.map((supplier) => {
                    return (
                      <tr
                        key={supplier._id}
                        style={{
                          backgroundColor: selectedRows.includes(supplier._id)
                            ? alpha(theme.palette.primary.main, 0.1)
                            : "transparent",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (!selectedRows.includes(supplier._id)) {
                            e.currentTarget.style.backgroundColor = alpha(
                              theme.palette.action.hover,
                              0.5
                            );
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selectedRows.includes(supplier._id)) {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }
                        }}
                      >
                        <td
                          style={{ padding: "16px 8px" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={selectedRows.includes(supplier._id)}
                            onChange={() => handleRowSelect(supplier._id)}
                          />
                        </td>
                        <td style={{ padding: "16px" }}>
                          {supplier.supplierId || "N/A"}
                        </td>
                        <td style={{ padding: "16px" }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <SupplierAvatar
                              src={supplier.supplier_photo}
                              alt={supplier.full_name}
                            >
                              {supplier.full_name?.charAt(0) || "S"}
                            </SupplierAvatar>
                            <Box sx={{ ml: 2 }}>
                              <Typography variant="body2" fontWeight="medium">
                                {supplier.full_name || "Unknown"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {supplier.vendor || "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        </td>
                        <td style={{ padding: "16px" }}>
                          {supplier.shop_name || "N/A"}
                        </td>
                        <td style={{ padding: "16px" }}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 0.5,
                              }}
                            >
                              <PhoneIcon
                                fontSize="small"
                                sx={{
                                  mr: 0.5,
                                  color: theme.palette.text.secondary,
                                }}
                              />
                              {supplier.full_Phone_number ||
                                supplier.phone_number ||
                                "N/A"}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <EmailIcon
                                fontSize="small"
                                sx={{
                                  mr: 0.5,
                                  color: theme.palette.text.secondary,
                                }}
                              />
                              {supplier.email || "N/A"}
                            </Typography>
                          </Box>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <StatusChip
                            icon={getStatusIcon(supplier.supplier_status)}
                            label={supplier.supplier_status || "Active"}
                            size="small"
                            status={supplier.supplier_status}
                          />
                        </td>

                        <td
                          style={{ padding: "16px", textAlign: "center" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Tooltip title="View Details">
                            <AnimatedIconButton
                              size="small"
                              to={`/dashboard/supplier-profile?id=${supplier._id}`}
                              component={Link}
                            >
                              <VisibilityIcon fontSize="small" />
                            </AnimatedIconButton>
                          </Tooltip>
                          <Tooltip title="Edit Supplier">
                            <AnimatedIconButton
                              to={`/dashboard/update-supplier?id=${supplier._id}`}
                              component={Link}
                              size="small"
                            >
                              <EditIcon fontSize="small" />
                            </AnimatedIconButton>
                          </Tooltip>
                          <Tooltip title="Delete Supplier">
                            <AnimatedIconButton
                              size="small"
                              onClick={() => handleDeleteSupplier(supplier._id)}
                              sx={{ color: theme.palette.error.main }}
                            >
                              <DeleteIcon fontSize="small" />
                            </AnimatedIconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Box>
          </Fade>
        )}

        {/* Pagination */}
        {suppliers.length > 0 && (
          <div className="flex justify-between items-center mt-6 flex-wrap gap-y-2">
            <p className="text-xs md:text-sm text-gray-500">
              Showing {startIndex + 1} to {endIndex} of {totalCount} suppliers
            </p>
            <div className="flex items-center">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                size="small"
              >
                Previous
              </Button>
              <div className="mx-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageNum ? "contained" : "text"}
                      size="small"
                      onClick={() => setCurrentPage(pageNum)}
                      sx={{ minWidth: 30, mx: 0.5 }}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <Typography variant="body2" sx={{ mx: 1 }}>
                    ...
                  </Typography>
                )}
              </div>
              <Button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                size="small"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      ></Snackbar>
    </div>
  );
};

export default WorldClassSupplierList;
