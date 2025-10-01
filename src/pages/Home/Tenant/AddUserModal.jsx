/* eslint-disable react/prop-types */
"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Alert,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Lock,
} from "@mui/icons-material";
import { useState, forwardRef, useEffect } from "react";
import Slide from "@mui/material/Slide";
import { useCreateUserMutation } from "../../../redux/api/userApi";
import { useGetAllTenantQuery } from "../../../redux/api/tenantApi";
import { toast } from "react-toastify";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const mockRoles = [
  { id: "admin", name: "admin" },
  { id: "manager", name: "manager" },
  { id: "employee", name: "employee" },
];

const defaultFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  tenantDomain: "",
  role: "",
  agreeTerms: false,
};

const AddUserModal = ({ open, onClose, onSuccess }) => {
  const currentTenantDomain = useTenantDomain();
  const [formData, setFormData] = useState(defaultFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const [createUser, { isLoading }] = useCreateUserMutation();
  const { data: tenantData, isLoading: isTenantLoading } =
    useGetAllTenantQuery();

  // Reset form and set tenant domain when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        ...defaultFormData,
        tenantDomain: currentTenantDomain || "",
      });
      setErrors({});
      setApiError("");
    }
  }, [open, currentTenantDomain]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.length < 3)
      newErrors.name = "Name must be at least 3 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.tenantDomain)
      newErrors.tenantDomain = "Please select a tenant";
    if (!formData.role) newErrors.role = "Please select a role";
    if (!formData.agreeTerms)
      newErrors.agreeTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      const result = await createUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        createdBy: "system",
        status: "active",
        tenantDomain: formData.tenantDomain,
      }).unwrap();

      if (result.success) {
        toast.success("User created successfully");
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      const message = error?.data?.message || "Failed to create user";
      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, maxHeight: "90vh" } }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <AddIcon color="primary" />
            <Typography variant="h5" fontWeight="bold">
              Create New User
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Add a new team member to your organization
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}
        {isTenantLoading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Loading tenant data...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Name"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                required
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.tenantDomain}>
                <InputLabel>Select Tenant</InputLabel>
                <Select
                  name="tenantDomain"
                  value={formData.tenantDomain}
                  onChange={handleChange}
                  label="Select Tenant"
                  disabled
                >
                  {tenantData?.data?.tenants?.map((tenant) => (
                    <MenuItem key={tenant._id} value={tenant.domain}>
                      {tenant.name} ({tenant.domain})
                    </MenuItem>
                  ))}
                </Select>
                {errors.tenantDomain && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.tenantDomain}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.role}>
                <InputLabel>Select Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Select Role"
                >
                  {mockRoles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.role && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.role}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={formData.password}
                onChange={handleChange}
                required
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{" "}
                    <a href="/terms" style={{ color: "#1976d2" }}>
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" style={{ color: "#1976d2" }}>
                      Privacy Policy
                    </a>
                  </Typography>
                }
              />
              {errors.agreeTerms && (
                <Typography variant="caption" color="error" display="block">
                  {errors.agreeTerms}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          sx={{ minWidth: 140 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Create User"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;