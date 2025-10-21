/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  TextField,
  InputAdornment,
  Tooltip,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  Grid,
} from "@mui/material";
import {
  LocalShipping,
  FilterList,
  Add,
  Visibility,
  Edit,
  MoreVert,
  Search,
  Sort,
  CheckCircle,
  Cancel,
  Pending,
  CalendarToday,
  Inventory,
  Timeline,
  ReceiptLong,
  AttachMoney,
  Numbers,
  Delete,
} from "@mui/icons-material";

import { GlassCard, StatusChip } from "./supplier";
import {
  AnimatedIconButton,
  StyledTableContainer,
} from "../../../../utils/customStyle";
import SupplierPurchaseModal from "./SupplierPurchaseModal";
import { useDeletePurchaseMutation } from "../../../../redux/api/purchaseApi";
import { useTenantDomain } from "../../../../hooks/useTenantDomain";
import Swal from "sweetalert2";

const SupplierPurchase = ({ purchaseData }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogAction, setDialogAction] = useState("");
  const [open, setOpen] = useState(false);
  const tenantDomain = useTenantDomain();
  const [deletePurchase, { isLoading: isDeleting }] =
    useDeletePurchaseMutation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrderForAction, setSelectedOrderForAction] = useState(null);
  const handleOpen = () => {
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);

    setOpen(true);
  };
  const handleClose = () => setOpen(false);

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenDialog = (action, order = null) => {
    setDialogAction(action);
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteOrder = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePurchase({
            tenantDomain,
            id: selectedOrderForAction._id,
          }).unwrap();
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
        }
      }
    });
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return theme.palette.success.main;
      case "Pending":
        return theme.palette.warning.main;
      case "Cancelled":
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <CheckCircle fontSize="small" />;
      case "Pending":
        return <Pending fontSize="small" />;
      case "Cancelled":
        return <Cancel fontSize="small" />;
      default:
        return null;
    }
  };

  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  // Calculate total items in order
  const calculateTotalItems = (products) => {
    return products.reduce((total, product) => total + product.quantity, 0);
  };

  // Calculate average product price in an order
  const calculateAveragePrice = (products) => {
    if (!products || products.length === 0) return 0;
    const total = products.reduce(
      (sum, product) => sum + product.productPrice,
      0
    );
    return total / products.length;
  };

  // Filter orders based on search term
  const filteredOrders = purchaseData?.filter(
    (order) =>
      order?.referenceNo
        ?.toString()
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase()) ||
      order?.purchaseStatus
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase()) ||
      order?.products?.some((product) =>
        product?.productName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
  );

  return (
    <GlassCard>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <LocalShipping sx={{ mr: 1, color: theme.palette.primary.main }} />
          Purchase Orders
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2, width: 200 }}
          />
          <Tooltip title="Filter orders">
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ mr: 1, borderRadius: 20 }}
              onClick={handleFilterMenuOpen}
            >
              Filter
            </Button>
          </Tooltip>
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={handleFilterMenuClose}
          >
            <MenuItem>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Paid"
              />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Pending"
              />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Cancelled"
              />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleFilterMenuClose}>Apply Filters</MenuItem>
          </Menu>
          <Tooltip title="Sort orders">
            <Button
              variant="outlined"
              startIcon={<Sort />}
              sx={{ mr: 1, borderRadius: 20 }}
              onClick={handleSortMenuOpen}
            >
              Sort
            </Button>
          </Tooltip>
          <Menu
            anchorEl={sortMenuAnchor}
            open={Boolean(sortMenuAnchor)}
            onClose={handleSortMenuClose}
          >
            <MenuItem onClick={handleSortMenuClose}>
              Date (Newest First)
            </MenuItem>
            <MenuItem onClick={handleSortMenuClose}>
              Date (Oldest First)
            </MenuItem>
            <MenuItem onClick={handleSortMenuClose}>
              Amount (High to Low)
            </MenuItem>
            <MenuItem onClick={handleSortMenuClose}>
              Amount (Low to High)
            </MenuItem>
          </Menu>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              borderRadius: 20,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              boxShadow: `0 3px 5px 2px ${alpha(
                theme.palette.primary.main,
                0.3
              )}`,
            }}
            onClick={handleOpen}
          >
            Create New Purchase
          </Button>
        </Box>
      </Box>

      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference No</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Avg. Price</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders?.map((order) => (
              <TableRow key={order._id}>
                <TableCell sx={{ fontWeight: "medium" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ReceiptLong
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    {order.referenceNo}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarToday
                      sx={{ mr: 1, color: theme.palette.text.secondary }}
                    />
                    {formatDate(order.date)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Inventory sx={{ mr: 1, color: theme.palette.info.main }} />
                    {calculateTotalItems(order.products)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    ৳{calculateAveragePrice(order.products).toFixed(2)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    ৳{order.grandTotal?.toLocaleString()}
                  </Box>
                </TableCell>
                <TableCell>
                  <StatusChip
                    icon={getStatusIcon(order.purchaseStatus)}
                    label={order.purchaseStatus}
                    size="small"
                    statuscolor={getStatusColor(order.purchaseStatus)}
                  />
                </TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View Order">
                    <AnimatedIconButton
                      size="small"
                      onClick={() => handleOpenDialog("view", order)}
                    >
                      <Visibility fontSize="small" />
                    </AnimatedIconButton>
                  </Tooltip>
                  <Tooltip title="Edit Order">
                    <AnimatedIconButton
                      size="small"
                      onClick={() =>
                        navigate(`/dashboard/update-purchase?id=${order._id}`)
                      }
                    >
                      <Edit fontSize="small" />
                    </AnimatedIconButton>
                  </Tooltip>
                  <Tooltip title="Delete Order">
                    <AnimatedIconButton
                      size="small"
                      onClick={(e) => {
                        setSelectedOrderForAction(order);
                        handleDeleteOrder();
                      }}
                    >
                      <Delete fontSize="small" />
                    </AnimatedIconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Order Action Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{dialogAction === "view" && "Order Details"}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    Reference No:
                  </Typography>
                  <Typography variant="body1">
                    {selectedOrder.referenceNo}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    Order Date:
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedOrder.date)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    Total Items:
                  </Typography>
                  <Typography variant="body1">
                    {calculateTotalItems(selectedOrder.products)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    Grand Total:
                  </Typography>
                  <Typography variant="body1">
                    ৳{selectedOrder.grandTotal.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    Status:
                  </Typography>
                  <StatusChip
                    icon={getStatusIcon(selectedOrder.purchaseStatus)}
                    label={selectedOrder.purchaseStatus}
                    size="small"
                    statuscolor={getStatusColor(selectedOrder.purchaseStatus)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="bold">
                    Payment Method:
                  </Typography>
                  <Typography variant="body1">
                    {selectedOrder.paymentMethod}
                  </Typography>
                </Grid>
              </Grid>

              {selectedOrder.note && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" fontWeight="bold">
                    Note:
                  </Typography>
                  <Typography variant="body1">{selectedOrder.note}</Typography>
                </Box>
              )}

              {selectedOrder.products && selectedOrder.products.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Products:
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.productName}</TableCell>
                          <TableCell>{product.productUnit}</TableCell>
                          <TableCell align="right">
                            {product.quantity}
                          </TableCell>
                          <TableCell align="right">
                            ৳{product.productPrice.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            ৳
                            {(product.productPrice * product.quantity).toFixed(
                              2
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {open && (
        <SupplierPurchaseModal open={handleOpen} setOpen={handleClose} />
      )}
    </GlassCard>
  );
};


export default SupplierPurchase;
