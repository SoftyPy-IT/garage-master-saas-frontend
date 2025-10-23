/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
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
} from "@mui/material";
import {
  LocalShipping,
  FilterList,
  Add,
  MoreVert,
  Search,
  CheckCircle,
  Cancel,
  Pending,
  CalendarToday,
  Inventory,
  Timeline,
  ReceiptLong,
} from "@mui/icons-material";
import { GlassCard, StatusChip } from "./supplier";

import PurchaseOrderModal from "../../Inventory/PurchaseOrder/PurchaseOrderModal";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import { useDeletePurchaseOrderMutation } from "../../../redux/api/purchaseOrderApi";
import { AnimatedIconButton, StyledTableContainer } from "../../../utils/customStyle";
import ActionMenu from "../../Inventory/PurchaseOrder/ActionMenu";
import ReceiveDialog from "../../Inventory/PurchaseOrder/ReceiveDialog";
import UpdatePurchaseOrderModal from "../../Inventory/UpdatePurchaseOrderModal";

const OrderTable = ({ orderData, refetch }) => {
  const theme = useTheme();
  const tenantDomain = useTenantDomain();

  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [setSortMenuAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [setDialogAction] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrderForAction, setSelectedOrderForAction] = useState(null);

  // State for receive dialog
  const [openReceiveDialog, setOpenReceiveDialog] = useState(false);
  const [receivingOrderId, setReceivingOrderId] = useState(null);

  // State for update modal
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  // Delete mutation
  const [deletePurchase] = useDeletePurchaseOrderMutation();

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

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  // Action menu handlers
  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderForAction(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewOrder = () => {
    handleMenuClose();
  };

  const handleEditOrder = () => {
    setSelectedOrder(selectedOrderForAction);
    setOpenUpdateModal(true);
    handleMenuClose();
  };

  const handleOpenReceiveDialog = () => {
    setReceivingOrderId(selectedOrderForAction._id);
    setOpenReceiveDialog(true);
    handleMenuClose();
  };

  const handleCloseReceiveDialog = () => {
    setOpenReceiveDialog(false);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrderForAction) return;

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
          const res = await deletePurchase({
            tenantDomain,
            id: selectedOrderForAction._id,
          }).unwrap();

          if (res.success) {
            toast.success("Purchase order deleted successfully!");
            refetch();

            Swal.fire(
              "Deleted!",
              "The purchase order has been deleted.",
              "success"
            );
          }
        } catch (error) {
          Swal.fire("Error", "Failed to delete purchase order", "error");
          console.error(error);
        }
      }
    });

    handleMenuClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return theme.palette.success.main;
      case "Pending":
        return theme.palette.warning.main;
      case "Cancelled":
        return theme.palette.error.main;
      case "Paid":
        return theme.palette.success.main;
      case "Unpaid":
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
      case "Paid":
        return <CheckCircle fontSize="small" />;
      case "Pending":
      case "Unpaid":
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

  // Filter orders based on search term
  const filteredOrders = orderData?.filter(
    (order) =>
      order?.referenceNo
        ?.toString()
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase()) ||
      order?.status?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      order?.paymentStatus?.toLowerCase()?.includes(searchTerm?.toLowerCase())
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
                label="Delivered"
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
            Create Order
          </Button>
        </Box>
      </Box>

      <StyledTableContainer sx={{
        width: "100%",
        overflowX: "auto",
        borderRadius: 2,
        "&::-webkit-scrollbar": {
          height: 6,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ccc",
          borderRadius: 3,
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#999",
        },
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference No</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Delivery Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
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
                    {formatDate(order.orderDate)}
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
                    ৳{order.grandTotal.toLocaleString()}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Timeline
                      sx={{ mr: 1, color: theme.palette.secondary.main }}
                    />
                    {formatDate(order.expectedDeliveryDate)}
                  </Box>
                </TableCell>
                <TableCell>
                  <StatusChip
                    icon={getStatusIcon(order.status)}
                    label={order.status}
                    size="small"
                    statuscolor={getStatusColor(order.status)}
                  />
                </TableCell>
                <TableCell>
                  <StatusChip
                    icon={getStatusIcon(order.paymentStatus)}
                    label={order.paymentStatus}
                    size="small"
                    statuscolor={getStatusColor(order.paymentStatus)}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="More Options">
                    <AnimatedIconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, order)}
                    >
                      <MoreVert fontSize="small" />
                    </AnimatedIconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <ActionMenu
        anchorEl={anchorEl}
        selectedOrder={selectedOrderForAction}
        onMenuClose={handleMenuClose}
        onViewOrder={handleViewOrder}
        onEditOrder={handleEditOrder}
        onOpenReceiveDialog={handleOpenReceiveDialog}
        onDeleteOrder={handleDeleteOrder}
      />
      <ReceiveDialog
        open={openReceiveDialog}
        purchaseId={receivingOrderId}
        onClose={handleCloseReceiveDialog}
      />
      {openUpdateModal && selectedOrder && (
        <UpdatePurchaseOrderModal
          tenantDomain={tenantDomain}
          onClose={() => setOpenUpdateModal(false)}
          open={openUpdateModal}
          orderId={selectedOrder._id}
        />
      )}
      {open && (
        <PurchaseOrderModal
          tenantDomain={tenantDomain}
          onClose={handleClose}
          open={handleOpen}
        />
      )}


    </GlassCard>
  );
};

export default OrderTable;
