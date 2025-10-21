/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  FaUsers,
  FaSearch,
  FaEdit,
  FaLock,
  FaUnlock,
  FaTrash,
  FaEye,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUserShield,
  FaDownload,
  FaSync,
  FaPlus,
} from "react-icons/fa";
import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Checkbox,
  Menu,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  useDeleteTenantMutation,
  useGetAllTenantQuery,
  useRenewSubscriptionMutation,
  useUpdateTenantMutation,
} from "../../../redux/api/tenantApi";
import { StatusChip, StyledTableContainer } from "../../../utils/customStyle";
import { StyledPaper } from "../../../utils";
import ViewDetailsModal from "./ViewTenantModal";
import { toast } from "react-toastify";
import UpdateTenantModal from "./UpdateTenantModal";
import CreateTenantModal from "./CreateTenantModal";
import Swal from "sweetalert2";

const AllTenantList = () => {
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTenants, setSelectedTenants] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createTenantModalOpen, setCreateTenantModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const { data: tenantData, isLoading, refetch } = useGetAllTenantQuery({});
  const [updateTenant, { isLoading: updateLoading }] =
    useUpdateTenantMutation();
  const [renewSubscription, { isLoading: renewLoading }] =
    useRenewSubscriptionMutation();
  const [deleteTenant, { isLoading: deleteLoading }] =
    useDeleteTenantMutation();

  // Extract tenants from API response
  const tenants = tenantData?.data?.tenants || [];

  useEffect(() => {
    const filtered = tenants.filter((tenant) => {
      const matchesSearch =
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.businessType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && tenant.isActive) ||
        (filterStatus === "blocked" && !tenant.isActive);

      const matchesPayment =
        filterPayment === "all" ||
        (filterPayment === "paid" && tenant.subscription?.isPaid) ||
        (filterPayment === "unpaid" && !tenant.subscription?.isPaid);

      return matchesSearch && matchesStatus && matchesPayment;
    });
    setFilteredTenants(filtered);
    setPage(0);
  }, [searchTerm, filterStatus, filterPayment, tenants]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectTenant = (tenantId) => {
    setSelectedTenants((prev) =>
      prev.includes(tenantId)
        ? prev.filter((id) => id !== tenantId)
        : [...prev, tenantId]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = filteredTenants.map((tenant) => tenant._id);
      setSelectedTenants(newSelected);
    } else {
      setSelectedTenants([]);
    }
  };

  const handleBlockTenant = async (tenantId, block = true) => {
    try {
      const result = await updateTenant({
        id: tenantId,
        data: { isActive: !block },
      }).unwrap();
      setSnackbar({
        open: true,
        message: `Tenant ${block ? "blocked" : "unblocked"} successfully`,
        severity: "success",
      });
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to ${block ? "block" : "unblock"} tenant`,
        severity: "error",
      });
    }
  };

  const handleEditTenant = (tenant) => {
    setSelectedTenant(tenant);
    setEditModalOpen(true);
  };

  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant);
    setViewModalOpen(true);
  };

  const handleUpdateTenant = async (updatedTenant) => {
    try {
      const result = await updateTenant({
        id: updatedTenant._id,
        data: updatedTenant,
      }).unwrap();
      setSnackbar({
        open: true,
        message: "Tenant updated successfully",
        severity: "success",
      });
      setEditModalOpen(false);
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update tenant",
        severity: "error",
      });
    }
  };

  const handleRenewSubscription = async (tenantId, plan) => {
    try {
      const result = await renewSubscription({
        id: tenantId,
        plan: plan,
      }).unwrap();
      if (result) {
        toast.success(
          `🎉 Subscription renewed successfully! New ${plan} plan is now active.`
        );
      }
      
      // Close the view modal and refresh data
      setViewModalOpen(false);
      refetch();
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        "Failed to renew subscription. Please try again.";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteTenant({ id: tenantId }).unwrap();
        Swal.fire("Deleted!", "Your tenant has been deleted.", "success");
        refetch();
      } catch (error) {
        const errorMessage = error?.data?.message || "Failed to delete tenant.";
        Swal.fire("Error!", errorMessage, "error");
      }
    }
  };

  const handleBulkAction = async (action) => {
    setBulkActionAnchor(null);
    try {
      if (action === "block") {
        await Promise.all(
          selectedTenants.map((id) =>
            updateTenant({
              id,
              data: { isActive: false },
            }).unwrap()
          )
        );
      } else if (action === "unblock") {
        await Promise.all(
          selectedTenants.map((id) =>
            updateTenant({
              id,
              data: { isActive: true },
            }).unwrap()
          )
        );
      } else if (action === "delete") {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: `You are about to delete ${selectedTenants.length} tenants. This action cannot be undone!`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete them!",
        });

        if (result.isConfirmed) {
          await Promise.all(
            selectedTenants.map((id) => deleteTenant(id).unwrap())
          );
          Swal.fire(
            "Deleted!",
            "Selected tenants have been deleted.",
            "success"
          );
        } else {
          return; // Do not proceed with bulk action if cancelled
        }
      }
      setSnackbar({
        open: true,
        message: `Bulk ${action} applied to ${selectedTenants.length} tenants`,
        severity: "success",
      });
      setSelectedTenants([]);
      refetch();
    } catch (error) {
      const errorMessage =
        error?.data?.message || `Failed to apply bulk ${action}`;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleUserCreated = (newUser) => {
    // Optionally refresh tenant data or show success message
    refetch();
    toast.success(`User ${newUser.name} created successfully!`);
  };

  const handleTenantCreated = (newTenant) => {
    // Refresh tenant data and show success message
    refetch();
    toast.success(`Tenant ${newTenant.name} created successfully!`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (isActive) => {
    return isActive ? "#4CAF50" : "#f44336";
  };

  const getExpiryInfo = (endDateString) => {
    if (!endDateString) return { text: "N/A", color: "text.secondary" };

    const endDate = new Date(endDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day
    endDate.setHours(0, 0, 0, 0); // Normalize end date to start of day

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let text = "";
    let color = "text.secondary";

    if (diffDays < 0) {
      text = `Expired ${Math.abs(diffDays)} days ago`;
      color = "#f44336"; // Red
    } else if (diffDays === 0) {
      text = "Expires today!";
      color = "#f44336"; // Red
    } else if (diffDays <= 7) {
      text = `Expires in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
      color = "#f44336"; // Red
    } else if (diffDays <= 30) {
      text = `Expires in ${diffDays} days`;
      color = "#FFC107"; // Yellow
    } else {
      text = `Expires in ${diffDays} days`;
      color = "#4CAF50"; // Green
    }

    return { text, color };
  };

  const stats = {
    total: tenants.length,
    active: tenants.filter((t) => t.isActive).length,
    blocked: tenants.filter((t) => !t.isActive).length,
    unpaid: tenants.filter((t) => !t.subscription?.isPaid).length,
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1600, margin: "auto", padding: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            <FaUserShield style={{ marginRight: 16, color: "#667eea" }} />
            Tenant Management Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage all tenant users, subscriptions, and access controls
          </Typography>
        </Box>
      </motion.div>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <CardContent sx={{ color: "white", textAlign: "center" }}>
              <FaUsers size={32} style={{ marginBottom: 8 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.total}
              </Typography>
              <Typography variant="body1">Total Tenants</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
            }}
          >
            <CardContent sx={{ color: "white", textAlign: "center" }}>
              <FaCheckCircle size={32} style={{ marginBottom: 8 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.active}
              </Typography>
              <Typography variant="body1">Active Tenants</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
            }}
          >
            <CardContent sx={{ color: "white", textAlign: "center" }}>
              <FaLock size={32} style={{ marginBottom: 8 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.blocked}
              </Typography>
              <Typography variant="body1">Blocked Tenants</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
            }}
          >
            <CardContent sx={{ color: "white", textAlign: "center" }}>
              <FaExclamationTriangle size={32} style={{ marginBottom: 8 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.unpaid}
              </Typography>
              <Typography variant="body1">Unpaid Tenants</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <StyledPaper>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <FaSearch style={{ marginRight: 8, color: "#666" }} />
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{ borderRadius: "12px" }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Payment</InputLabel>
              <Select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                sx={{ borderRadius: "12px" }}
              >
                <MenuItem value="all">All Payments</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="unpaid">Unpaid</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={<FaPlus />}
                sx={{
                  borderRadius: "12px",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  color: "#fff",
                }}
                onClick={() => setCreateTenantModalOpen(true)}
              >
                Add Tenant
              </Button>
              <Button
                variant="outlined"
                startIcon={<FaDownload />}
                sx={{ borderRadius: "12px" }}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<FaSync />}
                sx={{ borderRadius: "12px" }}
                onClick={() => refetch()}
              >
                Refresh
              </Button>
              {selectedTenants.length > 0 && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={(e) => setBulkActionAnchor(e.currentTarget)}
                  sx={{ borderRadius: "12px" }}
                >
                  Actions ({selectedTenants.length})
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Tenants Table */}
      <StyledPaper>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedTenants.length > 0 &&
                      selectedTenants.length < filteredTenants.length
                    }
                    checked={
                      filteredTenants.length > 0 &&
                      selectedTenants.length === filteredTenants.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Tenant</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Subscription</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTenants
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((tenant) => {
                  const expiryInfo = getExpiryInfo(
                    tenant.subscription?.endDate
                  );
                  return (
                    <TableRow key={tenant._id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedTenants.includes(tenant._id)}
                          onChange={() => handleSelectTenant(tenant._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{ bgcolor: getStatusColor(tenant.isActive) }}
                          >
                            {tenant.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {tenant.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {tenant.businessType || "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {tenant.domain}.app
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Database:{" "}
                            {tenant.dbUri ? "Connected" : "Not Connected"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {tenant.subscription?.plan || "No Plan"} - $
                            {tenant.subscription?.amount || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Expires: {formatDate(tenant.subscription?.endDate)}
                          </Typography>
                          <br />
                          <Typography
                            variant="caption"
                            sx={{ color: expiryInfo.color, fontWeight: "bold" }}
                          >
                            {expiryInfo.text}
                          </Typography>
                          <br />
                          <StatusChip
                            label={tenant.subscription?.status || "No Status"}
                            size="small"
                            status={
                              tenant.subscription?.status?.toLowerCase() ||
                              "pending"
                            }
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {tenant.subscription?.isPaid ? (
                            <Chip
                              icon={<FaCheckCircle />}
                              label="Paid"
                              size="small"
                              sx={{ bgcolor: "#4CAF50", color: "white" }}
                            />
                          ) : (
                            <Chip
                              icon={<FaExclamationTriangle />}
                              label="Unpaid"
                              size="small"
                              sx={{ bgcolor: "#f44336", color: "white" }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <StatusChip
                          label={tenant.isActive ? "Active" : "Blocked"}
                          size="small"
                          status={tenant.isActive ? "active" : "blocked"}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(
                            tenant.subscription?.createdAt || tenant.createdAt
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Tooltip title="Edit Tenant">
                            <IconButton
                              size="small"
                              onClick={() => handleEditTenant(tenant)}
                              sx={{ color: "#2196F3" }}
                            >
                              <FaEdit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={
                              tenant.isActive
                                ? "Block Tenant"
                                : "Unblock Tenant"
                            }
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleBlockTenant(tenant._id, tenant.isActive)
                              }
                              sx={{
                                color: tenant.isActive ? "#f44336" : "#4CAF50",
                              }}
                              disabled={updateLoading}
                            >
                              {tenant.isActive ? <FaLock /> : <FaUnlock />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Tenant">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteTenant(tenant._id)}
                              sx={{ color: "#f44336" }}
                              disabled={deleteLoading}
                            >
                              <FaTrash />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewTenant(tenant)}
                              sx={{ color: "#FF9800" }}
                            >
                              <FaEye />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredTenants.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>

      {/* Edit Tenant Modal */}
      <UpdateTenantModal
        open={editModalOpen}
        tenant={selectedTenant}
        onClose={() => setEditModalOpen(false)}
        onUpdate={handleUpdateTenant}
        loading={updateLoading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* View Details Modal */}
      <ViewDetailsModal
        open={viewModalOpen}
        tenant={selectedTenant}
        onClose={() => setViewModalOpen(false)}
        onRenewSubscription={handleRenewSubscription}
        renewLoading={renewLoading}
      />

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkActionAnchor}
        open={Boolean(bulkActionAnchor)}
        onClose={() => setBulkActionAnchor(null)}
      >
        <MenuItem onClick={() => handleBulkAction("block")}>
          <ListItemIcon>
            <FaLock />
          </ListItemIcon>
          <ListItemText>Block Selected</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction("unblock")}>
          <ListItemIcon>
            <FaUnlock />
          </ListItemIcon>
          <ListItemText>Unblock Selected</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction("delete")}>
          <ListItemIcon>
            <FaTrash />
          </ListItemIcon>
          <ListItemText>Delete Selected</ListItemText>
        </MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Create Tenant Modal */}
      <CreateTenantModal
        open={createTenantModalOpen}
        onClose={() => setCreateTenantModalOpen(false)}
        onTenantCreated={handleTenantCreated}
      />
    </Box>
  );
};

export default AllTenantList;
