/* eslint-disable react/prop-types */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Skeleton,
  alpha,
  useTheme,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Badge,
  Breadcrumbs,
  Link as MuiLink,
  Grid,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileDownload as ExportIcon,
  Print as PrintIcon,
  Sort as SortIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Payments as PaymentsIcon,
  Receipt as ReceiptIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  FilterAlt as FilterAltIcon,
  ClearAll as ClearAllIcon,
  MoreHoriz as MoreHorizIcon,
  Visibility as VisibilityIcon,
  LocalShipping as ShippingIcon,
  Discount as DiscountIcon,
  AccountBalance as PaymentIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeletePurchaseMutation,
  useGetAllPurchasesQuery,
} from "../../redux/api/purchaseApi";
import { formatCurrency } from "../../utils/formatter";
import { formatDate } from "../../utils/formateDate";
import { useAppOptions } from "../../hooks/useAppOptions";
import { purchaseBtn } from "../../utils/customStyle";
import Can from "../../components/Can";

const statusColors = {
  Received: { bg: "#10b981", color: "#fff" },
  Pending: { bg: "#f59e0b", color: "#fff" },
  Ordered: { bg: "#3b82f6", color: "#fff" },
  Canceled: { bg: "#ef4444", color: "#fff" },
  Partial: { bg: "#8b5cf6", color: "#fff" },
  Paid: { bg: "#10b981", color: "#fff" },
};


function PurchaseDetailsModal({ open, onClose, purchase }) {
  const theme = useTheme();

  const getSupplierName = (supplier) => {
    if (!supplier) return "N/A";
    if (typeof supplier === "string") return supplier;
    if (Array.isArray(supplier)) {
      if (supplier.length === 0) return "N/A";
      const firstSupplier = supplier[0];
      if (typeof firstSupplier === "string") return firstSupplier;
      if (typeof firstSupplier === "object" && firstSupplier !== null) {
        return (
          firstSupplier.full_name ||
          firstSupplier.name ||
          `Supplier ${firstSupplier._id?.substring(0, 6) || "Unknown"}`
        );
      }
      return "N/A";
    }
    if (typeof supplier === "object" && supplier !== null) {
      return (
        supplier.full_name ||
        supplier.name ||
        `Supplier ${supplier._id?.substring(0, 6) || "Unknown"}`
      );
    }
    return "N/A";
  };

  const supplierName = getSupplierName(purchase?.suppliers);
  const statusColor = statusColors[purchase?.purchaseStatus] || {
    bg: "#64748b",
    color: "#fff",
  };

  if (!purchase) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
          pt: 3,
          px: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="700">
            Purchase Details
          </Typography>
          <Typography variant="body2" color="#64748b">
            Reference: {purchase.referenceNo}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ px: 3, py: 2 }}>
        {/* Header Info */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Purchase Information
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Date:
                </Typography>
                <Typography variant="body2" fontWeight="500">
                  {purchase.date ? formatDate(purchase.date) : "No date"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Status:
                </Typography>
                <Chip
                  label={purchase.purchaseStatus || "N/A"}
                  size="small"
                  sx={{
                    backgroundColor: statusColor.bg,
                    color: statusColor.color,
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Supplier:
                </Typography>
                <Typography variant="body2" fontWeight="500">
                  {supplierName}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Payment Information
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Payment Method:
                </Typography>
                <Typography variant="body2" fontWeight="500">
                  {purchase.paymentMethod || "N/A"}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Paid Amount:
                </Typography>
                <Typography variant="body2" fontWeight="500" color="#10b981">
                  {formatCurrency(purchase.paidAmount || 0)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Due Amount:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="500"
                  color={purchase.dueAmount > 0 ? "#ef4444" : "#10b981"}
                >
                  {formatCurrency(purchase.dueAmount || 0)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Product Details Table */}
        <Typography variant="h6" gutterBottom>
          Products
        </Typography>
        <TableContainer sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchase.products?.map((product, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 1.5,
                          backgroundColor: alpha("#6366f1", 0.1),
                          color: "#6366f1",
                          fontSize: "0.875rem",
                        }}
                      >
                        {product.productName?.charAt(0).toUpperCase() || "P"}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="500">
                          {product.productName || "Unknown Product"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Unit: {product.productUnit || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{product.quantity || 0}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(product.productPrice || 0)}
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="600">
                      {formatCurrency(
                        (product.productPrice || 0) * (product.quantity || 0)
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary Section */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Order Summary
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Subtotal:
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(purchase.totalAmount || 0)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Discount:
                </Typography>
                <Typography variant="body2" color="#ef4444">
                  -{formatCurrency(purchase.totalDiscount || 0)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Tax:
                </Typography>
                <Typography variant="body2">
                  +{formatCurrency(purchase.totalTax || 0)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Shipping:
                </Typography>
                <Typography variant="body2">
                  +{formatCurrency(purchase.shipping || 0)}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" fontWeight="600">
                  Grand Total:
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {formatCurrency(purchase.grandTotal || 0)}
                </Typography>
              </Box>
              {purchase.note && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Notes:
                  </Typography>
                  <Typography variant="body2">{purchase.note}</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "8px",
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
      </DialogActions>
    </Dialog>
  );
}

export default function PurchaseList() {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { tenantDomain, performActionWithPermission } = useAppOptions()

  const { data, isLoading, refetch } = useGetAllPurchasesQuery({
    tenantDomain,
    limit: rowsPerPage,
    page: page + 1,
    searchTerm: search,
    payment: filterPayment,
  });

  const [deletePurchase, { isLoading: isDeleting }] =
    useDeletePurchaseMutation();

  // Safely extract purchases, purchaseSummary and meta data with fallbacks
  const purchases = data?.data?.purchases || [];
  const purchaseSummary = data?.data?.purchaseSummary || {};
  const meta = data?.data?.meta || {};
  const total = meta.total || 0;

  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleSortMenuOpen = (event) => {
    setSortMenuAnchor(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchor(null);
  };

  const handleDeleteConfirm = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const handleDeleteCancel = () => {
    setConfirmDelete({ open: false, id: null });
  };

  const handleDeletePurchase = async () => {
    performActionWithPermission('/dashboard/purchase-list', 'delete',
      async () => {
        if (!confirmDelete.id) return;

        try {
          await deletePurchase({ tenantDomain, id: confirmDelete.id }).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "The purchase has been deleted successfully.",
            icon: "success",
            confirmButtonColor: "#6366f1",
            iconColor: "#6366f1",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the purchase.",
            icon: "error",
            confirmButtonColor: "#ef4444",
          });
        } finally {
          setConfirmDelete({ open: false, id: null });
          refetch();
        }

      }, "You don't have permission to delete purchase"
    )
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    handleSortMenuClose();
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status === filterStatus ? "" : status);
    handleFilterMenuClose();
  };

  const handleFilterPayment = (payment) => {
    setFilterPayment(payment === filterPayment ? "" : payment);
    handleFilterMenuClose();
  };

  const clearFilters = () => {
    setFilterStatus("");
    setFilterPayment("");
    setSearch("");
    setSortField("date");
    setSortDirection("desc");
  };

  const handleEditPurchase = (purchase) => {
    navigate(`/dashboard/update-purchase?id=${purchase._id}`);
  };

  const handleViewPurchase = (purchase) => {
    setSelectedPurchase(purchase);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedPurchase(null);
  };

  const getSupplierName = (supplier) => {
    if (!supplier) return "N/A";
    if (typeof supplier === "string") return supplier;
    if (Array.isArray(supplier)) {
      if (supplier.length === 0) return "N/A";
      const firstSupplier = supplier[0];
      if (typeof firstSupplier === "string") return firstSupplier;
      if (typeof firstSupplier === "object" && firstSupplier !== null) {
        return (
          firstSupplier.full_name ||
          firstSupplier.name ||
          `Supplier ${firstSupplier._id?.substring(0, 6) || "Unknown"}`
        );
      }
      return "N/A";
    }
    if (typeof supplier === "object" && supplier !== null) {
      return (
        supplier.full_name ||
        supplier.name ||
        `Supplier ${supplier._id?.substring(0, 6) || "Unknown"}`
      );
    }
    return "N/A";
  };

  // Stats Cards
  const StatsCards = () => {
    const totalPurchases = meta.total || 0;
    const totalAmount = purchaseSummary.grandTotal || 0;
    const totalPaid = purchaseSummary.paidAmount || 0;
    const totalDue = purchaseSummary.dueAmount || 0;

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <Card
          elevation={0}
          sx={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#fff",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                  color: "#6366f1",
                  width: 48,
                  height: 48,
                }}
              >
                <ShoppingCartIcon />
              </Avatar>
            </Box>
            <Typography variant="h5" fontWeight="700" color="#1e293b">
              {isLoading ? <Skeleton width={60} /> : totalPurchases}
            </Typography>
            <Typography variant="body2" color="#64748b">
              Total Purchases
            </Typography>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#fff",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  color: "#8b5cf6",
                  width: 48,
                  height: 48,
                }}
              >
                <InventoryIcon />
              </Avatar>
            </Box>
            <Typography variant="h5" fontWeight="700" color="#1e293b">
              {isLoading ? (
                <Skeleton width={60} />
              ) : (
                formatCurrency(totalAmount)
              )}
            </Typography>
            <Typography variant="body2" color="#64748b">
              Total Amount
            </Typography>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#fff",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  color: "#10b981",
                  width: 48,
                  height: 48,
                }}
              >
                <PaymentsIcon />
              </Avatar>
            </Box>
            <Typography variant="h5" fontWeight="700" color="#1e293b">
              {isLoading ? <Skeleton width={60} /> : formatCurrency(totalPaid)}
            </Typography>
            <Typography variant="body2" color="#64748b">
              Total Paid
            </Typography>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#fff",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  width: 48,
                  height: 48,
                }}
              >
                <ReceiptIcon />
              </Avatar>
            </Box>
            <Typography variant="h5" fontWeight="700" color="#1e293b">
              {isLoading ? <Skeleton width={60} /> : formatCurrency(totalDue)}
            </Typography>
            <Typography variant="body2" color="#64748b">
              Total Due
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  };

  return (
    <Fade in={true} timeout={300}>
      <Box sx={{ padding: { xs: "16px", md: "24px" } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 3, color: "#64748b" }}
        >
          <MuiLink
            component={Link}
            to="/dashboard"
            underline="hover"
            sx={{ display: "flex", alignItems: "center", color: "inherit" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Dashboard
          </MuiLink>
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ShoppingCartIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Purchases
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="800" color="#1e293b" mb={1}>
              Purchase Management
            </Typography>
            <Typography variant="body1" color="#64748b">
              Track and manage your inventory purchases
            </Typography>
          </Box>
          <Button
            variant="contained"
            component={Link}
            to="/dashboard/add-purchase"
            startIcon={<AddIcon />}
            sx={{
              mt: { xs: 2, md: 0 },
              borderRadius: "8px",
              backgroundColor: "#6366f1",
              px: 3,
              py: 1.5,
              boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.2)",
              "&:hover": {
                backgroundColor: "#4f46e5",
                boxShadow: "0 4px 12px -1px rgba(99, 102, 241, 0.3)",
              },
            }}
          >
            Add Purchase
          </Button>
        </Box>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content */}
        <Card
          elevation={0}
          sx={{
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            backgroundColor: "#fff",
          }}
        >
          {/* Toolbar */}
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
              placeholder="Search purchases..."
              variant="outlined"
              size="small"
              value={search}
              onChange={handleSearch}
              sx={{
                minWidth: { xs: "100%", sm: "300px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
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
                <Button
                  variant="outlined"
                  startIcon={<FilterAltIcon />}
                  onClick={handleFilterMenuOpen}
                  size="small"
                  sx={{
                    borderRadius: "8px",
                    borderColor:
                      filterStatus || filterPayment ? "#6366f1" : "#e2e8f0",
                    color:
                      filterStatus || filterPayment ? "#6366f1" : "#64748b",
                    backgroundColor:
                      filterStatus || filterPayment
                        ? alpha("#6366f1", 0.05)
                        : "transparent",
                    "&:hover": {
                      borderColor:
                        filterStatus || filterPayment ? "#4f46e5" : "#cbd5e1",
                      backgroundColor:
                        filterStatus || filterPayment
                          ? alpha("#6366f1", 0.1)
                          : "#f8fafc",
                    },
                  }}
                >
                  {filterStatus || filterPayment ? "Filtered" : "Filter"}
                  {(filterStatus || filterPayment) && (
                    <Badge
                      badgeContent={
                        (filterStatus ? 1 : 0) + (filterPayment ? 1 : 0)
                      }
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Button>
              </Tooltip>
              <Tooltip title="Sort">
                <Button
                  variant="outlined"
                  startIcon={<SortIcon />}
                  onClick={handleSortMenuOpen}
                  size="small"
                  sx={{
                    borderRadius: "8px",
                    borderColor: "#e2e8f0",
                    color: "#64748b",
                    "&:hover": {
                      borderColor: "#cbd5e1",
                      backgroundColor: "#f8fafc",
                    },
                  }}
                >
                  Sort
                </Button>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton
                  onClick={() => refetch()}
                  size="small"
                  sx={{
                    borderRadius: "8px",
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
                    borderRadius: "8px",
                    backgroundColor: "#f1f5f9",
                    "&:hover": { backgroundColor: "#e2e8f0" },
                  }}
                >
                  <ExportIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton
                  size="small"
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#f1f5f9",
                    "&:hover": { backgroundColor: "#e2e8f0" },
                  }}
                >
                  <PrintIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Filter Chips */}
          {(filterStatus || filterPayment || search) && (
            <Box
              sx={{
                p: 2,
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              {filterStatus && (
                <Chip
                  label={`Status: ${filterStatus}`}
                  onDelete={() => setFilterStatus("")}
                  sx={{ borderRadius: "6px" }}
                />
              )}
              {filterPayment && (
                <Chip
                  label={`Payment: ${filterPayment}`}
                  onDelete={() => setFilterPayment("")}
                  sx={{ borderRadius: "6px" }}
                />
              )}
              {search && (
                <Chip
                  label={`Search: ${search}`}
                  onDelete={() => setSearch("")}
                  sx={{ borderRadius: "6px" }}
                />
              )}
              {(filterStatus || filterPayment || search) && (
                <Button
                  variant="text"
                  size="small"
                  startIcon={<ClearAllIcon />}
                  onClick={clearFilters}
                  sx={{ ml: "auto", color: "#64748b" }}
                >
                  Clear All
                </Button>
              )}
            </Box>
          )}

          {/* Content */}
          <Box>
            <TableContainer>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: "#f8fafc",
                        fontWeight: 600,
                        color: "#475569",
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
                      Reference
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#f8fafc",
                        fontWeight: 600,
                        color: "#475569",
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#f8fafc",
                        fontWeight: 600,
                        color: "#475569",
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
                      Supplier
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#f8fafc",
                        fontWeight: 600,
                        color: "#475569",
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: "#f8fafc",
                        fontWeight: 600,
                        color: "#475569",
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: "#f8fafc",
                        fontWeight: 600,
                        color: "#475569",
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
                      Paid
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: "#f8fafc",
                        fontWeight: 600,
                        color: "#475569",
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
                      Due
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        backgroundColor: "#f8fafc",
                        fontWeight: 600,
                        color: "#475569",
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchases.map((purchase) => {
                    const supplierName = getSupplierName(purchase.suppliers);
                    const statusColor = statusColors[purchase.purchaseStatus] || {
                      bg: "#64748b",
                      color: "#fff",
                    };

                    return (
                      <TableRow
                        key={purchase._id}
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha("#6366f1", 0.02),
                          },
                        }}
                      >
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="600">
                            {purchase.referenceNo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {purchase.date
                              ? formatDate(purchase.date)
                              : "No date"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 1.5,
                                backgroundColor: alpha("#6366f1", 0.1),
                                color: "#6366f1",
                                fontSize: "0.875rem",
                              }}
                            >
                              {supplierName.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" fontWeight="500">
                              {supplierName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={purchase.purchaseStatus || "Pending"}
                            size="small"
                            sx={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.color,
                              fontWeight: 600,
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="600">
                            {formatCurrency(purchase.grandTotal || 0)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="600" color="#10b981">
                            {formatCurrency(purchase.paidAmount || 0)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color={purchase.dueAmount > 0 ? "#ef4444" : "#10b981"}
                          >
                            {formatCurrency(purchase.dueAmount || 0)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewPurchase(purchase)}
                                sx={{
                                  backgroundColor: alpha("#3b82f6", 0.1),
                                  color: "#3b82f6",
                                  "&:hover": {
                                    backgroundColor: alpha("#3b82f6", 0.2),
                                  },
                                }}
                              >
                                <Can page='dashboard/purchase-list' action='view'>
                                  <VisibilityIcon fontSize="small" />
                                </Can>

                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEditPurchase(purchase)}
                                sx={{
                                  backgroundColor: alpha("#6366f1", 0.1),
                                  color: "#6366f1",
                                  "&:hover": {
                                    backgroundColor: alpha("#6366f1", 0.2),
                                  },
                                }}
                              >
                                <Can page='dashboard/purchase-list' action='edit'>
                                  <EditIcon fontSize="small" />
                                </Can>

                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteConfirm(purchase._id)}
                                sx={{
                                  backgroundColor: alpha("#ef4444", 0.1),
                                  color: "#ef4444",
                                  "&:hover": {
                                    backgroundColor: alpha("#ef4444", 0.2),
                                  },
                                }}
                              >
                                <Can page='dashboard/purchase-list' action='delete'>
                                  <DeleteIcon fontSize="small" />
                                </Can>
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Pagination */}
            {purchases.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: "1px solid #e2e8f0",
                  "& .MuiTablePagination-select": {
                    borderRadius: "6px",
                  },
                }}
              />
            )}
          </Box>
        </Card>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={handleFilterMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: "10px",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              minWidth: "200px",
              overflow: "hidden",
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              backgroundColor: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <Typography variant="subtitle2" fontWeight="600" color="#1e293b">
              Filter Purchases
            </Typography>
          </Box>
          <MenuItem
            onClick={handleFilterMenuClose}
            sx={{ fontWeight: "bold", color: "#1e293b" }}
          >
            Status
          </MenuItem>
          <MenuItem
            onClick={() => handleFilterStatus("Received")}
            sx={{
              color: filterStatus === "Received" ? "#6366f1" : "#64748b",
              fontWeight: filterStatus === "Received" ? "600" : "normal",
              pl: 3,
            }}
          >
            Received
          </MenuItem>
          <MenuItem
            onClick={() => handleFilterStatus("Pending")}
            sx={{
              color: filterStatus === "Pending" ? "#6366f1" : "#64748b",
              fontWeight: filterStatus === "Pending" ? "600" : "normal",
              pl: 3,
            }}
          >
            Pending
          </MenuItem>
          <MenuItem
            onClick={() => handleFilterStatus("Ordered")}
            sx={{
              color: filterStatus === "Ordered" ? "#6366f1" : "#64748b",
              fontWeight: filterStatus === "Ordered" ? "600" : "normal",
              pl: 3,
            }}
          >
            Ordered
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={handleFilterMenuClose}
            sx={{ fontWeight: "bold", color: "#1e293b" }}
          >
            Payment
          </MenuItem>
          <MenuItem
            onClick={() => handleFilterPayment("Paid")}
            sx={{
              color: filterPayment === "Paid" ? "#6366f1" : "#64748b",
              fontWeight: filterPayment === "Paid" ? "600" : "normal",
              pl: 3,
            }}
          >
            Paid
          </MenuItem>
          <MenuItem
            onClick={() => handleFilterPayment("Unpaid")}
            sx={{
              color: filterPayment === "Unpaid" ? "#6366f1" : "#64748b",
              fontWeight: filterPayment === "Unpaid" ? "600" : "normal",
              pl: 3,
            }}
          >
            Unpaid
          </MenuItem>
          <MenuItem
            onClick={() => handleFilterPayment("Partial")}
            sx={{
              color: filterPayment === "Partial" ? "#6366f1" : "#64748b",
              fontWeight: filterPayment === "Partial" ? "600" : "normal",
              pl: 3,
            }}
          >
            Partial
          </MenuItem>
          <Divider />
          <Box sx={{ p: 1.5, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              size="small"
              onClick={clearFilters}
              sx={{
                borderRadius: "6px",
                borderColor: "#e2e8f0",
                color: "#64748b",
                mr: 1,
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleFilterMenuClose}
              sx={{
                borderRadius: "6px",
                backgroundColor: "#6366f1",
              }}
            >
              Apply
            </Button>
          </Box>
        </Menu>

        {/* Sort Menu */}
        <Menu
          anchorEl={sortMenuAnchor}
          open={Boolean(sortMenuAnchor)}
          onClose={handleSortMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: "10px",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              minWidth: "200px",
              overflow: "hidden",
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              backgroundColor: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <Typography variant="subtitle2" fontWeight="600" color="#1e293b">
              Sort By
            </Typography>
          </Box>
          <MenuItem
            onClick={() => handleSort("date")}
            sx={{
              color: sortField === "date" ? "#6366f1" : "#64748b",
              fontWeight: sortField === "date" ? "600" : "normal",
            }}
          >
            Date{" "}
            {sortField === "date" &&
              (sortDirection === "asc" ? (
                <ArrowUpIcon fontSize="small" />
              ) : (
                <ArrowDownIcon fontSize="small" />
              ))}
          </MenuItem>
          <MenuItem
            onClick={() => handleSort("referenceNo")}
            sx={{
              color: sortField === "referenceNo" ? "#6366f1" : "#64748b",
              fontWeight: sortField === "referenceNo" ? "600" : "normal",
            }}
          >
            Reference No{" "}
            {sortField === "referenceNo" &&
              (sortDirection === "asc" ? (
                <ArrowUpIcon fontSize="small" />
              ) : (
                <ArrowDownIcon fontSize="small" />
              ))}
          </MenuItem>
          <MenuItem
            onClick={() => handleSort("total")}
            sx={{
              color: sortField === "total" ? "#6366f1" : "#64748b",
              fontWeight: sortField === "total" ? "600" : "normal",
            }}
          >
            Total{" "}
            {sortField === "total" &&
              (sortDirection === "asc" ? (
                <ArrowUpIcon fontSize="small" />
              ) : (
                <ArrowDownIcon fontSize="small" />
              ))}
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={confirmDelete.open}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              maxWidth: "400px",
              width: "100%",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
            <Typography variant="h5" fontWeight="700">
              Delete Purchase
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ px: 3 }}>
            <Typography variant="body1" color="#475569">
              Are you sure you want to delete this purchase? This action cannot
              be undone and will remove all associated data.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button
              onClick={handleDeleteCancel}
              variant="outlined"
              sx={{
                borderRadius: "8px",
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
              Cancel
            </Button>
            <Can page='dashboard/purchase-list' action='delete'>
              <Button
                onClick={handleDeletePurchase}
                variant="contained"
                disabled={isDeleting}
                sx={purchaseBtn}
              >
                {isDeleting ? "Deleting..." : "Delete Purchase"}
              </Button>
            </Can>
          </DialogActions>
        </Dialog>

        {/* Purchase Details Modal */}
        <PurchaseDetailsModal
          open={detailsModalOpen}
          onClose={handleCloseDetailsModal}
          purchase={selectedPurchase}
        />
      </Box>
    </Fade>
  );
}