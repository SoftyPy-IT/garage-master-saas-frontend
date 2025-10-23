/* eslint-disable react/prop-types */

"use client";

import {
  FaEye,
  FaCreditCard,
  FaDatabase,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaGlobe,
  FaUser,
  FaMoneyBillWave,
  FaSync,
} from "react-icons/fa";

import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardContent,
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import { useState } from "react";
import { InfoCard, StatusCard } from "../../utils/customStyle";

const ViewDetailsModal = ({
  open,
  tenant,
  onClose,
  onRenewSubscription,
  renewLoading,
}) => {
  const [selectedPlan, setSelectedPlan] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handleRenewSubscription = () => {
    if (selectedPlan && tenant) {
      onRenewSubscription(tenant._id, selectedPlan);
      setSelectedPlan("");
    }
  };

  const getPlanPrice = (plan) => {
    const prices = {
      Monthly: 99,
      HalfYearly: 499,
      Yearly: 899,
    };
    return prices[plan] || 0;
  };

  if (!tenant) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: tenant.isActive ? "#4CAF50" : "#f44336",
              width: 56,
              height: 56,
            }}
          >
            {tenant.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              <FaEye style={{ marginRight: 8 }} />
              {tenant.name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Tenant Details & Information
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <FaBuilding />
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <FaUser />
                    </ListItemIcon>
                    <ListItemText primary="Name" secondary={tenant.name} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FaGlobe />
                    </ListItemIcon>
                    <ListItemText
                      primary="Domain"
                      secondary={`${tenant.domain}.app`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FaBuilding />
                    </ListItemIcon>
                    <ListItemText
                      primary="Business Type"
                      secondary={tenant.businessType || "N/A"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FaDatabase />
                    </ListItemIcon>
                    <ListItemText
                      primary="Database Status"
                      secondary={
                        <Chip
                          label={tenant.dbUri ? "Connected" : "Not Connected"}
                          size="small"
                          color={tenant.dbUri ? "success" : "error"}
                          sx={{ mt: 0.5 }}
                        />
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Status Information */}
          <Grid item xs={12} md={6}>
            <StatusCard status={tenant.isActive ? "active" : "blocked"}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  {tenant.isActive ? (
                    <FaCheckCircle />
                  ) : (
                    <FaExclamationTriangle />
                  )}
                  Current Status
                </Typography>
                <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.3)" }} />
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                    {tenant.isActive ? "ACTIVE" : "BLOCKED"}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Tenant is currently{" "}
                    {tenant.isActive
                      ? "active and accessible"
                      : "blocked and restricted"}
                  </Typography>
                </Box>
              </CardContent>
            </StatusCard>
          </Grid>

          {/* Subscription Details */}
          <Grid item xs={12}>
            <InfoCard>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <FaCreditCard />
                  Subscription Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 2,
                        bgcolor: "#f5f5f5",
                        borderRadius: "12px",
                      }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="primary"
                      >
                        {tenant.subscription?.plan || "No Plan"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Subscription Plan
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 2,
                        bgcolor: "#f5f5f5",
                        borderRadius: "12px",
                      }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="success.main"
                      >
                        ${tenant.subscription?.amount || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Amount
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 2,
                        bgcolor: "#f5f5f5",
                        borderRadius: "12px",
                      }}
                    >
                      <Chip
                        label={tenant.subscription?.status || "No Status"}
                        color={
                          tenant.subscription?.status === "Active"
                            ? "success"
                            : tenant.subscription?.status === "Expired"
                              ? "error"
                              : "warning"
                        }
                        sx={{ fontSize: "1rem", fontWeight: "bold" }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Status
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 2,
                        bgcolor: "#f5f5f5",
                        borderRadius: "12px",
                      }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="warning.main"
                      >
                        {getDaysRemaining(tenant.subscription?.endDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Days Remaining
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Renew Subscription Section */}
                <Box
                  sx={{ mt: 3, p: 2, bgcolor: "#f8f9fa", borderRadius: "12px" }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <FaSync />
                    Renew Subscription
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Select Plan</InputLabel>
                        <Select
                          value={selectedPlan}
                          onChange={(e) => setSelectedPlan(e.target.value)}
                          sx={{ borderRadius: "8px" }}
                        >
                          <MenuItem value="Monthly">Monthly - ৳2000</MenuItem>
                          <MenuItem value="HalfYearly">
                            Half Yearly - $৳12,000
                          </MenuItem>
                          <MenuItem value="Yearly">Yearly - ৳24,000</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="contained"
                        onClick={handleRenewSubscription}
                        disabled={!selectedPlan || renewLoading}
                        startIcon={
                          renewLoading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <FaSync />
                          )
                        }
                        sx={{
                          borderRadius: "8px",
                          background:
                            "linear-gradient(45deg, #4CAF50, #45a049)",
                          "&:hover": {
                            background:
                              "linear-gradient(45deg, #45a049, #4CAF50)",
                          },
                        }}
                        fullWidth
                      >
                        {renewLoading ? "Renewing..." : "Renew Subscription"}
                      </Button>
                    </Grid>
                  </Grid>
                  {selectedPlan && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        bgcolor: "#e8f5e8",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography variant="body2" color="success.main">
                        <strong>Selected Plan:</strong> {selectedPlan} - $
                        {getPlanPrice(selectedPlan)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        This will extend the subscription from today for the
                        selected duration.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Payment Information */}
          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <FaMoneyBillWave />
                  Payment Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      {tenant.subscription?.isPaid ? (
                        <FaCheckCircle color="#4CAF50" />
                      ) : (
                        <FaExclamationTriangle color="#f44336" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Payment Status"
                      secondary={
                        <Chip
                          label={
                            tenant.subscription?.isPaid ? "Paid" : "Unpaid"
                          }
                          size="small"
                          color={
                            tenant.subscription?.isPaid ? "success" : "error"
                          }
                          sx={{ mt: 0.5 }}
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FaCreditCard />
                    </ListItemIcon>
                    <ListItemText
                      primary="Payment Method"
                      secondary={tenant.subscription?.paymentMethod || "N/A"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FaCalendarAlt />
                    </ListItemIcon>
                    <ListItemText
                      primary="Subscription Active"
                      secondary={
                        <Chip
                          label={tenant.subscription?.isActive ? "Yes" : "No"}
                          size="small"
                          color={
                            tenant.subscription?.isActive ? "success" : "error"
                          }
                          sx={{ mt: 0.5 }}
                        />
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Timeline Information */}
          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <FaCalendarAlt />
                  Timeline Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <FaCalendarAlt />
                    </ListItemIcon>
                    <ListItemText
                      primary="Subscription Start"
                      secondary={formatDate(tenant.subscription?.startDate)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FaCalendarAlt />
                    </ListItemIcon>
                    <ListItemText
                      primary="Subscription End"
                      secondary={formatDate(tenant.subscription?.endDate)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FaCalendarAlt />
                    </ListItemIcon>
                    <ListItemText
                      primary="Created At"
                      secondary={formatDate(
                        tenant.subscription?.createdAt || tenant.createdAt
                      )}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FaCalendarAlt />
                    </ListItemIcon>
                    <ListItemText
                      primary="Last Updated"
                      secondary={formatDate(
                        tenant.subscription?.updatedAt || tenant.updatedAt
                      )}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </InfoCard>
          </Grid>

          {/* Database Information */}
          <Grid item xs={12}>
            <InfoCard>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <FaDatabase />
                  Database Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                    fontSize: "0.9rem",
                    wordBreak: "break-all",
                  }}
                >
                  {tenant.dbUri || "No database URI configured"}
                </Box>
              </CardContent>
            </InfoCard>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ borderRadius: "12px", minWidth: 120 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDetailsModal;
