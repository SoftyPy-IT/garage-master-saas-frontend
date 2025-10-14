// StockTransferPage.js
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Breadcrumbs,
  Link,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  Zoom,
  LinearProgress,
  useTheme,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import { alpha } from "@mui/material/styles";

import {
  useDeleteStockTransferMutation,
  useGetAllStockTransfersQuery,
} from "../../redux/api/stocktransferApi";
import Swal from "sweetalert2";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import StockTransferModal from "./StockManagement/StockTransfer/StockTransferModal";
import { useAppOptions } from "../../hooks/useAppOptions";
import Can from "../../components/Can";

const employees = [
  "John Smith",
  "Robert Johnson",
  "Michael Brown",
  "David Wilson",
  "James Taylor",
];

export default function StockTransferPage() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { tenantDomain, performActionWithPermission } = useAppOptions()


  const queryParams = {
    tenantDomain,
    page: currentPage,
    limit: 100,
    searchTerm: searchTerm,
  };

  const { data: stockTransferData, refetch } =
    useGetAllStockTransfersQuery(queryParams);
  const [deleteStockTransfer] = useDeleteStockTransferMutation();

  // Get transfers from API data
  const transfers = stockTransferData?.data || [];

  useEffect(() => {
    if (stockTransferData) {
      setLoading(false);
    }
  }, [stockTransferData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Update status filter based on tab
    switch (newValue) {
      case 0:
        setStatusFilter("all");
        break;
      case 1:
        setStatusFilter("pending");
        break;
      case 2:
        setStatusFilter("in-transit");
        break;
      case 3:
        setStatusFilter("completed");
        break;
      default:
        setStatusFilter("all");
    }
  };

  // Update the handleSubmit function to properly handle the result
  const handleSubmit = (data) => {
    // The modal is already closed by the modal component
    // Just refresh the data
    refetch(); // Refresh data after adding new transfer
  };

  const handleDeleteTransfer = async (id) => {
    performActionWithPermission('/dashboard/stock-transfer', 'delete',
      async () => {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "This will permanently delete the stock transfer record.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          try {
            await deleteStockTransfer({ tenantDomain, id }).unwrap();
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Stock transfer has been deleted successfully.",
              showConfirmButton: false,
              timer: 2000,
              background: "#fff",
              customClass: {
                title: "text-purple-800 font-medium",
                content: "text-gray-600",
              },
            });
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "An error occurred while deleting the stock transfer.",
              confirmButtonColor: "#6a1b9a",
            });
          }
        }
      }, "You don't have permission to delete stock transfer"
    )
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "pending":
        return (
          <Chip
            icon={<PendingIcon />}
            label="Pending"
            color="warning"
            size="small"
            sx={{
              fontWeight: "bold",
              background: alpha(theme.palette.warning.main, 0.1),
              "& .MuiChip-icon": { color: theme.palette.warning.main },
            }}
          />
        );
      case "completed":
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Completed"
            color="success"
            size="small"
            sx={{
              fontWeight: "bold",
              background: alpha(theme.palette.success.main, 0.1),
              "& .MuiChip-icon": { color: theme.palette.success.main },
            }}
          />
        );
      case "in-transit":
        return (
          <Chip
            icon={<LocalShippingIcon />}
            label="In-Transit"
            color="info"
            size="small"
            sx={{
              fontWeight: "bold",
              background: alpha(theme.palette.info.main, 0.1),
              "& .MuiChip-icon": { color: theme.palette.info.main },
            }}
          />
        );
      case "cancelled":
        return (
          <Chip
            icon={<CancelIcon />}
            label="Cancelled"
            color="error"
            size="small"
            sx={{
              fontWeight: "bold",
              background: alpha(theme.palette.error.main, 0.1),
              "& .MuiChip-icon": { color: theme.palette.error.main },
            }}
          />
        );
      default:
        return (
          <Chip
            icon={<PendingIcon />}
            label="Pending"
            color="warning"
            size="small"
            sx={{
              fontWeight: "bold",
              background: alpha(theme.palette.warning.main, 0.1),
              "& .MuiChip-icon": { color: theme.palette.warning.main },
            }}
          />
        );
    }
  };

  const filteredTransfers = transfers.filter((transfer) => {
    // Search filter
    const matchesSearch =
      transfer.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.fromWarehouse?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transfer.toWarehouse?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transfer.product?.product_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" || transfer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const refreshData = () => {
    setLoading(true);
    refetch();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status counts
  const getStatusCount = (status) => {
    return transfers.filter((t) => t.status === status).length;
  };

  // Extract unique products for modal
  const products = transfers
    .map((transfer) => ({
      id: transfer.product?._id,
      code: transfer.product?.product_code,
      name: transfer.product?.product_name,
      category: transfer.product?.category,
      currentStock: transfer.product?.product_quantity,
      unit: transfer.product?.unit,
      location: transfer.fromWarehouse?.name,
    }))
    .filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );

  return (
    <Box>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3, mt: 3, p: 3 }}
        className="shadow-lg"
      >
        <Link
          color="inherit"
          href="/dashboard"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography variant="body2">Dashboard</Typography>
        </Link>
        <Link
          color="inherit"
          href="/inventory"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography variant="body2">Inventory</Typography>
        </Link>
        <Typography color="text.primary" variant="body2">
          Stock Transfer
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)",
            backgroundClip: "text",
            textFillColor: "transparent",
            mb: 1,
          }}
        >
          Stock Transfer
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Transfer stock between different locations and view transfer history
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)",
              },
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#2196f3",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px rgba(33, 150, 243, 0.3)",
                  }}
                >
                  <SwapHorizIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                  Total Transfers
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {loading ? <LinearProgress sx={{ my: 2 }} /> : transfers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total number of stock transfers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)",
              },
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#4caf50",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px rgba(76, 175, 80, 0.3)",
                  }}
                >
                  <CheckCircleIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                  Completed
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {loading ? (
                  <LinearProgress sx={{ my: 2 }} />
                ) : (
                  getStatusCount("completed")
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Number of completed transfers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)",
              },
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#ff9800",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px rgba(255, 152, 0, 0.3)",
                  }}
                >
                  <PendingIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                  Pending
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {loading ? (
                  <LinearProgress sx={{ my: 2 }} />
                ) : (
                  getStatusCount("pending")
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Number of pending transfers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)",
              },
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#00bcd4",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px rgba(0, 188, 212, 0.3)",
                  }}
                >
                  <LocalShippingIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                  In-Transit
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {loading ? (
                  <LinearProgress sx={{ my: 2 }} />
                ) : (
                  getStatusCount("in-transit")
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Number of in-transit transfers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: { sm: "flex" },
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <div className="md:hidden flex justify-end">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
            sx={{
              borderRadius: 2,
              py: 1,
              px: 3,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 6px 20px ${alpha(
                  theme.palette.primary.main,
                  0.6
                )}`,
              },
            }}
          >
            New Transfer
          </Button>
        </div>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.primary.main,
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              minWidth: 100,
              "&.Mui-selected": {
                color: theme.palette.primary.main,
              },
            },
          }}
        >
          <Tab label="All Transfers" />
          <Tab label="Pending" />
          <Tab label="In-Transit" />
          <Tab label="Completed" />
        </Tabs>

        <div className="hidden md:flex">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
            sx={{
              borderRadius: 2,
              py: 1,
              px: 3,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 6px 20px ${alpha(
                  theme.palette.primary.main,
                  0.6
                )}`,
              },
            }}
          >
            New Transfer
          </Button>
        </div>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: "linear-gradient(to right, #f5f7fa, #e4e7eb)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Filters and Search
          </Typography>
          <Box>
            <Tooltip title="Show/Hide Filters">
              <IconButton onClick={() => setShowFilters(!showFilters)}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={refreshData}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <TextField
          variant="outlined"
          placeholder="Search transfers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "white",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
              transition: "box-shadow 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              },
              "&.Mui-focused": {
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {showFilters && (
          <FormControl
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "white",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-transit">In-Transit</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        )}
      </Paper>

      {loading ? (
        <Paper sx={{ p: 5, borderRadius: 2, textAlign: "center" }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Loading...</Typography>
        </Paper>
      ) : (
        <Paper
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }}
                >
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Batch Number
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>From</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>To</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Quantity
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="subtitle1" color="text.secondary">
                        No transfers found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransfers.map((transfer) => (
                    <TableRow
                      key={transfer._id}
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.04
                          ),
                        },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <TableCell>{formatDate(transfer.createdAt)}</TableCell>
                      <TableCell>
                        <Chip
                          label={transfer.batchNumber}
                          size="small"
                          sx={{
                            fontWeight: "medium",
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                            color: theme.palette.primary.main,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {transfer.product?.product_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {transfer.product?.product_code}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {transfer.fromWarehouse?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {transfer.fromWarehouse?.code}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {transfer.toWarehouse?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {transfer.toWarehouse?.code}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{transfer.quantity}</TableCell>
                      <TableCell>{getStatusChip(transfer.status)}</TableCell>
                      <TableCell align="center">
                        <Can page='/dashboard/stock-transfer' action='delete'>
                          <Tooltip title="Delete" TransitionComponent={Zoom}>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteTransfer(transfer._id)}
                              sx={{
                                color: theme.palette.error.main,
                                backgroundColor: alpha(
                                  theme.palette.error.main,
                                  0.1
                                ),
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.error.main,
                                    0.2
                                  ),
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Can>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <StockTransferModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        employees={employees}
        products={products}
        tenantDomain={tenantDomain}
        performActionWithPermission={performActionWithPermission}
      />
    </Box>
  );
}
