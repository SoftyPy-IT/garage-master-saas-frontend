/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Chip,
  Grid,
  Tooltip,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaCrown,
  FaEdit,
  FaExclamationTriangle,
  FaGlobe,
  FaLock,
  FaUnlock,
  FaCamera,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { GradientCard } from "../../../utils/customStyle";
import toast from "react-hot-toast";
import { useUpdateUserMutation } from "../../../redux/api/userApi";
import uploadFile from "../../../helper/uploadFile";

const EditProfileModal = ({
  open,
  onClose,
  userData,
  tenantInfo,
  onUpdate,
  isLoading = false,

}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        password: "",
        confirmPassword: ""
      });
    }
    setErrors({});
  }, [userData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    const updateData = {};
    
    if (formData.name !== userData.name) {
      updateData.name = formData.name;
    }
    
    if (formData.email !== userData.email) {
      updateData.email = formData.email;
    }
    
    if (formData.password) {
      updateData.password = formData.password;
    }

    // If no changes were made
    if (Object.keys(updateData).length === 0) {
      toast.error("No changes made");
      return;
    }

    onUpdate(updateData);
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      
    >
      <div
        
      >
        <DialogTitle sx={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          Edit Profile Information
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <FaTimes />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Update your personal information. Leave password fields blank to keep current password.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password || "Leave blank to keep current password"}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>

              {/* Tenant Information (Read-only) */}
              <Grid item xs={12}>
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  <strong>Organization:</strong> {tenantInfo?.name || "N/A"}<br />
                  <strong>Domain:</strong> {tenantInfo?.domain || "N/A"}<br />
                  <strong>Business Type:</strong> {tenantInfo?.businessType || "N/A"}
                </Alert>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={isLoading}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                fontWeight: "bold"
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 2,
                px: 4,
                py: 1,
                fontWeight: "bold",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                }
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={16} sx={{ color: "white", mr: 1 }} />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </DialogActions>
        </form>
      </div>
    </Dialog>
  );
};

// Main ProfileHeader Component
const ProfileHeader = ({
  userData,
  tenantInfo,
  subscription,
  getSubscriptionStatusColor,
  tenantDomain
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const fileInputRef = useRef(null);

  // Debugging effect
  useEffect(() => {
    console.log("Modal state changed:", isEditing);
  }, [isEditing]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    const uploadToast = toast.loading("Uploading image...");

    try {
      // Upload to Cloudinary using your reusable function
      const uploadResponse = await uploadFile(file);

      if (!uploadResponse.secure_url) {
        throw new Error("Upload failed - no URL returned");
      }

      const imageUrl = uploadResponse.secure_url;

      // Update user profile with the Cloudinary URL
      const updateData = {
        image: imageUrl,
      };

      await updateUser({
        tenantDomain,
        id: userData?._id,
        data: updateData,
      }).unwrap();

      toast.success("Profile image updated successfully!", {
        id: uploadToast,
      });

      setTimeout(() => {
        setPreviewImage(null);
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.message || "Failed to upload image. Please try again.",
        {
          id: uploadToast,
        }
      );
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUpdateProfile = async (updateData) => {
    const updateToast = toast.loading("Updating profile...");
    
    try {
      await updateUser({
        tenantDomain,
        id: userData?._id,
        data: updateData,
      }).unwrap();

      toast.success("Profile updated successfully!", {
        id: updateToast,
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error?.data?.message || "Failed to update profile. Please try again.",
        {
          id: updateToast,
        }
      );
    }
  };

  const getCurrentProfileImage = () => {
    if (previewImage) return previewImage;
    if (userData?.image) return userData.image;
    return "/placeholder.svg?height=120&width=120";
  };

  const handleEditClick = () => {
    console.log("Edit button clicked - opening modal");
    setIsEditing(true);
  };

  return (
    <>
      <div
       
      >
        <GradientCard sx={{ mb: 4, overflow: "visible" }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={getCurrentProfileImage()}
                      alt={userData?.name}
                      sx={{
                        width: 140,
                        height: 140,
                        border: "4px solid rgba(255,255,255,0.3)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                        },
                      }}
                      onClick={handleAvatarClick}
                    />

                    {/* Upload Overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        cursor: "pointer",
                        "&:hover": {
                          opacity: 1,
                        },
                      }}
                      onClick={handleAvatarClick}
                    >
                      {isUploading ? (
                        <CircularProgress size={30} sx={{ color: "white" }} />
                      ) : (
                        <FaCamera size={30} color="white" />
                      )}
                    </Box>

                    {/* Upload Progress Indicator */}
                    {isUploading && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -10,
                          left: -10,
                          right: -10,
                          bottom: -10,
                          borderRadius: "50%",
                          border: "3px solid rgba(59, 130, 246, 0.3)",
                          borderTop: "3px solid #3b82f6",
                          animation: "spin 1s linear infinite",
                          "@keyframes spin": {
                            "0%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(360deg)" },
                          },
                        }}
                      />
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </Box>
                </motion.div>

                {/* Upload Status */}
                {isUploading && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "center",
                      mt: 1,
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: "bold",
                    }}
                  >
                    Uploading...
                  </Typography>
                )}
              </Grid>

              <Grid item xs>
                <Box>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {userData?.name || "User Name"}
                    <Tooltip title="Verified Account">
                      <FaCheckCircle style={{ color: "#4CAF50" }} />
                    </Tooltip>
                    {!subscription?.isPaid && (
                      <Tooltip title="Payment Required">
                        <FaExclamationTriangle style={{ color: "#FF9800" }} />
                      </Tooltip>
                    )}
                  </Typography>

                  <Typography variant="h5" sx={{ opacity: 0.9, mb: 1 }}>
                    {userData.role || "User"} •{" "}
                    {tenantInfo.name || "Organization"}
                  </Typography>

                  <Typography variant="h6" sx={{ opacity: 0.8, mb: 2 }}>
                    {userData.email}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      icon={<FaCrown />}
                      label={`${subscription?.plan || "Free"} Plan`}
                      sx={{
                        background: "linear-gradient(45deg, #FFD700, #FFA500)",
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      }}
                    />

                    <Chip
                      icon={
                        subscription?.status === "Expired" ? (
                          <FaExclamationTriangle />
                        ) : (
                          <FaCalendarAlt />
                        )
                      }
                      label={`${subscription?.status || "Unknown"}`}
                      sx={{
                        bgcolor: getSubscriptionStatusColor(subscription?.status),
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />

                    <Chip
                      icon={subscription?.isPaid ? <FaUnlock /> : <FaLock />}
                      label={subscription?.isPaid ? "Paid" : "Unpaid"}
                      sx={{
                        bgcolor: subscription?.isPaid ? "#4CAF50" : "#f44336",
                        color: "white",
                        fontWeight: "bold",
                        animation: !subscription?.isPaid
                          ? "pulse 2s infinite"
                          : "none",
                      }}
                    />

                    <Chip
                      icon={<FaGlobe />}
                      label={`${tenantInfo?.domain || "domain"}.app`}
                      color="secondary"
                      variant="outlined"
                      sx={{
                        borderColor: "rgba(255,255,255,0.5)",
                        color: "white",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<FaEdit />}
                    onClick={handleEditClick}
                    disabled={isUploading}
                    sx={{
                     
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "white",
                      px: 3,
                      py: 1.5,
                      borderRadius: "12px",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.3)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                      },
                      "&:disabled": {
                        bgcolor: "rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.5)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Edit Profile
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </CardContent>
        </GradientCard>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={isEditing}
        onClose={() => {
          console.log("Closing modal");
          setIsEditing(false);
        }}
        userData={userData}
        tenantInfo={tenantInfo}
        onUpdate={handleUpdateProfile}
        isLoading={isUpdating}
        tenantDomain={tenantDomain}
      />
    </>
  );
};

export default ProfileHeader;