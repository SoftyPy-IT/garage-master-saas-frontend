// /* eslint-disable no-unused-vars */
// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   FaCheckCircle,
//   FaCloudUploadAlt,
//   FaEdit,
//   FaCog,
//   FaChartLine,
//   FaCalendarAlt,
//   FaUserCog,
//   FaCrown,
//   FaRocket,
//   FaUserFriends,
//   FaExclamationTriangle,
//   FaShieldAlt,
//   FaDatabase,
//   FaGlobe,
//   FaBuilding,
//   FaCreditCard,
//   FaHistory,
//   FaTimes,
//   FaMoneyBillWave,
//   FaLock,
//   FaUnlock,
// } from "react-icons/fa";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Avatar,
//   Chip,
//   Grid,
//   Paper,
//   Tooltip,
//   CircularProgress,
//   Tabs,
//   Tab,
//   Card,
//   CardContent,
//   Alert,
//   Fade,
// } from "@mui/material";
// import { motion, AnimatePresence } from "framer-motion";
// import { useGetAllUserQuery } from "../../../redux/api/userApi";
// import {
//   GlowingBadge,
//   GradientCard,
//   PaymentStatusCard,
//   VisuallyHiddenInput,
// } from "../../../utils/customStyle";
// import { StyledPaper } from "../../../utils";
// import { useTenantDomain } from "../../../hooks/useTenantDomain";

// const Profile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileImage, setProfileImage] = useState(
//     "/placeholder.svg?height=120&width=120"
//   );
//   const [activeTab, setActiveTab] = useState(0);
//   const [progress, setProgress] = useState(0);
// const tenantDomain = useTenantDomain();

//   const { data, isLoading } = useGetAllUserQuery({ tenantDomain });

//   const userData = data?.data?.[0] || {};
//   const tenantInfo = userData.tenantInfo || {};
//   const subscription = tenantInfo.subscription || {};
//   // Format dates
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   // Calculate subscription progress
//   const getSubscriptionProgress = () => {
//     if (!subscription.startDate || !subscription.endDate) return 0;
//     const start = new Date(subscription.startDate);
//     const end = new Date(subscription.endDate);
//     const now = new Date();
//     const total = end - start;
//     const elapsed = now - start;
//     return Math.max(0, Math.min(100, (elapsed / total) * 100));
//   };

//   // Calculate days remaining
//   const getDaysRemaining = () => {
//     if (!subscription.endDate) return 0;
//     const end = new Date(subscription.endDate);
//     const now = new Date();
//     const diffTime = end - now;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return Math.max(0, diffDays);
//   };

//   // Enhanced achievements based on user data
//   const achievements = [
//     {
//       icon: <FaShieldAlt />,
//       title: "Account Verified",
//       description: `${userData.status} account status`,
//       color: userData.status === "active" ? "#4CAF50" : "#FF9800",
//       earned: userData.status === "active",
//     },
//     {
//       icon: <FaDatabase />,
//       title: "Database Connected",
//       description: "MongoDB integration active",
//       color: "#2196F3",
//       earned: !!tenantInfo.dbUri,
//     },
//     {
//       icon: <FaBuilding />,
//       title: "Business Setup",
//       description: `${tenantInfo.businessType} business type`,
//       color: "#FF9800",
//       earned: !!tenantInfo.businessType,
//     },
//     {
//       icon: <FaMoneyBillWave />,
//       title: "Payment Status",
//       description: subscription.isPaid
//         ? "Payment completed"
//         : "Payment pending",
//       color: subscription.isPaid ? "#4CAF50" : "#f44336",
//       earned: subscription.isPaid,
//     },
//   ];

//   // Enhanced recent activity
//   const recentActivity = [
//     {
//       action: "Account created",
//       date: formatDate(userData.createdAt),
//       icon: <FaUserCog />,
//       status: "completed",
//     },
//     {
//       action: "Subscription activated",
//       date: formatDate(subscription.startDate),
//       icon: <FaCreditCard />,
//       status: subscription.isActive ? "active" : "expired",
//     },
//     {
//       action: "Payment status",
//       date: formatDate(subscription.startDate),
//       icon: <FaMoneyBillWave />,
//       status: subscription.isPaid ? "paid" : "pending",
//     },
//     {
//       action: "Last profile update",
//       date: formatDate(userData.updatedAt),
//       icon: <FaHistory />,
//       status: "completed",
//     },
//   ];

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setProgress((prevProgress) =>
//         prevProgress >= 100 ? 0 : prevProgress + 10
//       );
//     }, 800);
//     return () => clearInterval(timer);
//   }, []);

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => setProfileImage(e.target.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setIsEditing(false);
//   };

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };

//   const getSubscriptionStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "active":
//         return "#4CAF50";
//       case "expired":
//         return "#f44336";
//       case "pending":
//         return "#FF9800";
//       default:
//         return "#9E9E9E";
//     }
//   };

//   const getActivityStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "completed":
//       case "active":
//       case "paid":
//         return "#4CAF50";
//       case "expired":
//       case "pending":
//         return "#f44336";
//       default:
//         return "#FF9800";
//     }
//   };

//   if (isLoading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="400px"
//       >
//         <CircularProgress size={60} />
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{ maxWidth: 1400, margin: "auto", padding: 3, minHeight: "100vh" }}
//     >
//       {/* Enhanced Header Section */}
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <GradientCard sx={{ mb: 4, overflow: "visible" }}>
//           <CardContent sx={{ p: 4 }}>
//             <Grid container spacing={4} alignItems="center">
//               <Grid item>
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                 >
//                   <GlowingBadge
//                     overlap="circular"
//                     anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//                     variant="dot"
//                   >
//                     <Avatar
//                       src={profileImage}
//                       alt={userData?.name}
//                       sx={{
//                         width: 140,
//                         height: 140,
//                         border: "4px solid rgba(255,255,255,0.3)",
//                         boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
//                       }}
//                     />
//                   </GlowingBadge>
//                 </motion.div>
//               </Grid>

//               <Grid item xs>
//                 <Box>
//                   <Typography
//                     variant="h3"
//                     fontWeight="bold"
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 2,
//                       textShadow: "0 2px 4px rgba(0,0,0,0.3)",
//                     }}
//                   >
//                     {userData?.name || "User Name"}
//                     <Tooltip title="Verified Account">
//                       <FaCheckCircle style={{ color: "#4CAF50" }} />
//                     </Tooltip>
//                     {!subscription?.isPaid && (
//                       <Tooltip title="Payment Required">
//                         <FaExclamationTriangle style={{ color: "#FF9800" }} />
//                       </Tooltip>
//                     )}
//                   </Typography>

//                   <Typography variant="h5" sx={{ opacity: 0.9, mb: 1 }}>
//                     {userData.role || "User"} •{" "}
//                     {tenantInfo.name || "Organization"}
//                   </Typography>

//                   <Typography variant="h6" sx={{ opacity: 0.8, mb: 2 }}>
//                     {userData.email}
//                   </Typography>

//                   <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                     <Chip
//                       icon={<FaCrown />}
//                       label={`${subscription?.plan || "Free"} Plan`}
//                       sx={{
//                         background: "linear-gradient(45deg, #FFD700, #FFA500)",
//                         color: "black",
//                         fontWeight: "bold",
//                         fontSize: "0.9rem",
//                       }}
//                     />

//                     <Chip
//                       icon={
//                         subscription?.status === "Expired" ? (
//                           <FaExclamationTriangle />
//                         ) : (
//                           <FaCalendarAlt />
//                         )
//                       }
//                       label={`${subscription?.status || "Unknown"}`}
//                       sx={{
//                         bgcolor: getSubscriptionStatusColor(
//                           subscription?.status
//                         ),
//                         color: "white",
//                         fontWeight: "bold",
//                       }}
//                     />

//                     <Chip
//                       icon={subscription?.isPaid ? <FaUnlock /> : <FaLock />}
//                       label={subscription?.isPaid ? "Paid" : "Unpaid"}
//                       sx={{
//                         bgcolor: subscription?.isPaid ? "#4CAF50" : "#f44336",
//                         color: "white",
//                         fontWeight: "bold",
//                         animation: !subscription?.isPaid
//                           ? "pulse 2s infinite"
//                           : "none",
//                       }}
//                     />

//                     <Chip
//                       icon={<FaGlobe />}
//                       label={`${tenantInfo?.domain || "domain"}.app`}
//                       color="secondary"
//                       variant="outlined"
//                       sx={{
//                         borderColor: "rgba(255,255,255,0.5)",
//                         color: "white",
//                       }}
//                     />
//                   </Box>
//                 </Box>
//               </Grid>

//               <Grid item>
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <Button
//                     variant="contained"
//                     size="large"
//                     startIcon={<FaEdit />}
//                     onClick={() => setIsEditing(!isEditing)}
//                     sx={{
//                       bgcolor: "rgba(255,255,255,0.2)",
//                       backdropFilter: "blur(10px)",
//                       border: "1px solid rgba(255,255,255,0.3)",
//                       color: "white",
//                       px: 3,
//                       py: 1.5,
//                       borderRadius: "12px",
//                       "&:hover": {
//                         bgcolor: "rgba(255,255,255,0.3)",
//                         transform: "translateY(-2px)",
//                         boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
//                       },
//                       transition: "all 0.3s ease",
//                     }}
//                   >
//                     {isEditing ? "Cancel" : "Edit Profile"}
//                   </Button>
//                 </motion.div>
//               </Grid>
//             </Grid>
//           </CardContent>
//         </GradientCard>
//       </motion.div>

//       {/* Payment Status Alert */}
//       {!subscription.isPaid && (
//         <Fade in timeout={1000}>
//           <Alert
//             severity="error"
//             icon={<FaMoneyBillWave />}
//             action={
//               <Button color="inherit" size="small" startIcon={<FaCreditCard />}>
//                 Pay Now
//               </Button>
//             }
//             sx={{
//               mb: 3,
//               borderRadius: "12px",
//               "& .MuiAlert-message": { fontSize: "1.1rem" },
//               background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
//             }}
//           >
//             Payment Required: Your subscription payment of $
//             {subscription?.amount} is pending. Please complete payment to
//             continue using all features.
//           </Alert>
//         </Fade>
//       )}

//       {/* Subscription Alert */}
//       {subscription.status === "Expired" && (
//         <Fade in timeout={1000}>
//           <Alert
//             severity="warning"
//             icon={<FaExclamationTriangle />}
//             sx={{
//               mb: 3,
//               borderRadius: "12px",
//               "& .MuiAlert-message": { fontSize: "1.1rem" },
//             }}
//           >
//             Your subscription has expired on {formatDate(subscription?.endDate)}
//             . Please renew to continue using all features.
//           </Alert>
//         </Fade>
//       )}

//       {/* Main Content Grid */}
//       <Grid container spacing={4}>
//         {/* Left Column */}
//         <Grid item xs={12} lg={8}>
//           <StyledPaper>
//             <Tabs
//               value={activeTab}
//               onChange={handleTabChange}
//               sx={{
//                 mb: 3,
//                 "& .MuiTab-root": {
//                   fontSize: "1.1rem",
//                   fontWeight: "600",
//                 },
//               }}
//             >
//               <Tab label="Profile Details" />
//               <Tab label="Achievements" />
//               <Tab label="Recent Activity" />
//             </Tabs>

//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={activeTab}
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {activeTab === 0 && (
//                   <Box>
//                     <Typography variant="h4" fontWeight="bold" gutterBottom>
//                       Profile Information
//                     </Typography>

//                     {isEditing ? (
//                       <form onSubmit={handleSubmit}>
//                         <Grid container spacing={3}>
//                           <Grid item xs={12} sm={6}>
//                             <TextField
//                               fullWidth
//                               label="Name"
//                               defaultValue={userData?.name}
//                               variant="outlined"
//                             />
//                           </Grid>
//                           <Grid item xs={12} sm={6}>
//                             <TextField
//                               fullWidth
//                               label="Email"
//                               defaultValue={userData?.email}
//                               variant="outlined"
//                             />
//                           </Grid>
//                           <Grid item xs={12}>
//                             <TextField
//                               fullWidth
//                               multiline
//                               rows={4}
//                               label="About"
//                               defaultValue="Professional garage management specialist"
//                               variant="outlined"
//                             />
//                           </Grid>
//                           <Grid item xs={12}>
//                             <Button
//                               component="label"
//                               variant="outlined"
//                               startIcon={<FaCloudUploadAlt />}
//                               sx={{ mr: 2 }}
//                             >
//                               Upload New Picture
//                               <VisuallyHiddenInput
//                                 type="file"
//                                 onChange={handleImageUpload}
//                               />
//                             </Button>
//                             <Button
//                               type="submit"
//                               variant="contained"
//                               color="primary"
//                               size="large"
//                             >
//                               Save Changes
//                             </Button>
//                           </Grid>
//                         </Grid>
//                       </form>
//                     ) : (
//                       <Grid container spacing={3}>
//                         <Grid item xs={12} sm={6}>
//                           <Paper
//                             sx={{
//                               p: 3,
//                               borderRadius: "12px",
//                               background:
//                                 "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
//                             }}
//                           >
//                             <Typography
//                               variant="h6"
//                               color="primary"
//                               gutterBottom
//                             >
//                               <FaUserCog style={{ marginRight: 8 }} />
//                               Account Details
//                             </Typography>
//                             <Typography sx={{ mb: 1 }}>
//                               <strong>User ID:</strong> {userData?._id}
//                             </Typography>
//                             <Typography sx={{ mb: 1 }}>
//                               <strong>Status:</strong>
//                               <Chip
//                                 label={userData.status}
//                                 size="small"
//                                 sx={{
//                                   ml: 1,
//                                   bgcolor:
//                                     userData.status === "active"
//                                       ? "#4CAF50"
//                                       : "#f44336",
//                                   color: "white",
//                                 }}
//                               />
//                             </Typography>
//                             <Typography sx={{ mb: 1 }}>
//                               <strong>Role:</strong> {userData?.role}
//                             </Typography>
//                             <Typography sx={{ mb: 1 }}>
//                               <strong>Created:</strong>{" "}
//                               {formatDate(userData?.createdAt)}
//                             </Typography>
//                             <Typography>
//                               <strong>Last Login:</strong>{" "}
//                               {userData.lastLogin
//                                 ? formatDate(userData?.lastLogin)
//                                 : "Never"}
//                             </Typography>
//                           </Paper>
//                         </Grid>

//                         <Grid item xs={12} sm={6}>
//                           <Paper
//                             sx={{
//                               p: 3,
//                               borderRadius: "12px",
//                               background:
//                                 "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
//                             }}
//                           >
//                             <Typography
//                               variant="h6"
//                               color="primary"
//                               gutterBottom
//                             >
//                               <FaBuilding style={{ marginRight: 8 }} />
//                               Organization
//                             </Typography>
//                             <Typography sx={{ mb: 1 }}>
//                               <strong>Name:</strong> {tenantInfo?.name}
//                             </Typography>
//                             <Typography sx={{ mb: 1 }}>
//                               <strong>Domain:</strong> {tenantInfo?.domain}
//                             </Typography>
//                             <Typography sx={{ mb: 1 }}>
//                               <strong>Type:</strong> {tenantInfo?.businessType}
//                             </Typography>
//                             <Typography sx={{ mb: 1 }}>
//                               <strong>Active:</strong>
//                               <Chip
//                                 label={tenantInfo.isActive ? "Yes" : "No"}
//                                 size="small"
//                                 sx={{
//                                   ml: 1,
//                                   bgcolor: tenantInfo?.isActive
//                                     ? "#4CAF50"
//                                     : "#f44336",
//                                   color: "white",
//                                 }}
//                               />
//                             </Typography>
//                             <Typography>
//                               <strong>Tenant ID:</strong> {userData.tenantId}
//                             </Typography>
//                           </Paper>
//                         </Grid>
//                       </Grid>
//                     )}
//                   </Box>
//                 )}

//                 {activeTab === 1 && (
//                   <Box>
//                     <Typography variant="h4" fontWeight="bold" gutterBottom>
//                       Achievements & Badges
//                     </Typography>
//                     <Grid container spacing={3}>
//                       {achievements.map((achievement, index) => (
//                         <Grid item xs={12} sm={6} md={3} key={index}>
//                           <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.1 }}
//                           >
//                             <Card
//                               sx={{
//                                 height: "100%",
//                                 borderRadius: "16px",
//                                 background: achievement.earned
//                                   ? `linear-gradient(135deg, ${achievement?.color}15, ${achievement?.color}05)`
//                                   : "linear-gradient(135deg, #f5f5f5, #eeeeee)",
//                                 border: `2px solid ${
//                                   achievement?.earned
//                                     ? achievement?.color + "30"
//                                     : "#e0e0e0"
//                                 }`,
//                                 transition: "all 0.3s ease",
//                                 opacity: achievement?.earned ? 1 : 0.6,
//                                 "&:hover": {
//                                   transform: "translateY(-5px)",
//                                   boxShadow: `0 10px 30px ${
//                                     achievement.earned
//                                       ? achievement?.color + "30"
//                                       : "#00000020"
//                                   }`,
//                                 },
//                               }}
//                             >
//                               <CardContent sx={{ textAlign: "center", p: 3 }}>
//                                 <Box
//                                   sx={{
//                                     display: "inline-flex",
//                                     p: 2,
//                                     borderRadius: "50%",
//                                     bgcolor: achievement?.earned
//                                       ? achievement?.color
//                                       : "#bdbdbd",
//                                     color: "white",
//                                     mb: 2,
//                                   }}
//                                 >
//                                   {React.cloneElement(achievement?.icon, {
//                                     size: 24,
//                                   })}
//                                 </Box>
//                                 <Typography
//                                   variant="h6"
//                                   fontWeight="bold"
//                                   gutterBottom
//                                 >
//                                   {achievement?.title}
//                                   {achievement?.earned && (
//                                     <FaCheckCircle
//                                       style={{
//                                         marginLeft: 8,
//                                         color: "#4CAF50",
//                                       }}
//                                     />
//                                   )}
//                                 </Typography>
//                                 <Typography
//                                   variant="body2"
//                                   color="text.secondary"
//                                 >
//                                   {achievement.description}
//                                 </Typography>
//                               </CardContent>
//                             </Card>
//                           </motion.div>
//                         </Grid>
//                       ))}
//                     </Grid>
//                   </Box>
//                 )}

//                 {activeTab === 2 && (
//                   <Box>
//                     <Typography variant="h4" fontWeight="bold" gutterBottom>
//                       Recent Activity
//                     </Typography>
//                     {recentActivity.map((activity, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: index * 0.1 }}
//                       >
//                         <Paper
//                           sx={{
//                             p: 3,
//                             mb: 2,
//                             borderRadius: "12px",
//                             display: "flex",
//                             alignItems: "center",
//                             transition: "all 0.3s ease",
//                             borderLeft: `4px solid ${getActivityStatusColor(
//                               activity?.status
//                             )}`,
//                             "&:hover": {
//                               transform: "translateX(10px)",
//                               boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
//                             },
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               width: 48,
//                               height: 48,
//                               borderRadius: "12px",
//                               bgcolor: getActivityStatusColor(activity?.status),
//                               color: "white",
//                               mr: 3,
//                             }}
//                           >
//                             {activity?.icon}
//                           </Box>
//                           <Box sx={{ flexGrow: 1 }}>
//                             <Typography variant="h6" fontWeight="600">
//                               {activity?.action}
//                             </Typography>
//                             <Typography variant="body2" color="text.secondary">
//                               {activity?.date}
//                             </Typography>
//                           </Box>
//                           <Chip
//                             label={activity?.status}
//                             size="small"
//                             sx={{
//                               bgcolor: getActivityStatusColor(activity?.status),
//                               color: "white",
//                               fontWeight: "bold",
//                             }}
//                           />
//                         </Paper>
//                       </motion.div>
//                     ))}
//                   </Box>
//                 )}
//               </motion.div>
//             </AnimatePresence>
//           </StyledPaper>
//         </Grid>

//         {/* Right Column */}
//         <Grid item xs={12} lg={4}>
//           {/* Payment Status Card */}
//           <PaymentStatusCard ispaid={subscription?.isPaid?.toString()}>
//             <CardContent>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   mb: 2,
//                 }}
//               >
//                 <Typography variant="h6" fontWeight="bold">
//                   <FaMoneyBillWave style={{ marginRight: 8 }} />
//                   Payment Status
//                 </Typography>
//                 {subscription?.isPaid ? <FaCheckCircle /> : <FaTimes />}
//               </Box>
//               <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
//                 ${subscription?.amount || 0}
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 2 }}>
//                 {subscription?.isPaid
//                   ? "Payment Completed"
//                   : "Payment Required"}
//               </Typography>
//               <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                 Method: {subscription?.paymentMethod || "N/A"}
//               </Typography>
//             </CardContent>
//           </PaymentStatusCard>

//           {/* Subscription Status */}
//           <StyledPaper>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>
//               <FaCreditCard style={{ marginRight: 8 }} />
//               Subscription Status
//             </Typography>

//             <Box sx={{ textAlign: "center", mb: 3 }}>
//               <Box sx={{ position: "relative", display: "inline-flex" }}>
//                 <CircularProgress
//                   variant="determinate"
//                   value={getSubscriptionProgress()}
//                   size={120}
//                   thickness={6}
//                   sx={{
//                     color: getSubscriptionStatusColor(subscription?.status),
//                     "& .MuiCircularProgress-circle": {
//                       strokeLinecap: "round",
//                     },
//                   }}
//                 />
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     bottom: 0,
//                     right: 0,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <Typography variant="h6" fontWeight="bold">
//                     {Math.round(getSubscriptionProgress())}%
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     {getDaysRemaining()} days left
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>

//             <Box sx={{ mb: 3 }}>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 <strong>Plan:</strong> {subscription?.plan || "Free"}
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 <strong>Status:</strong>
//                 <Chip
//                   label={subscription?.status || "Unknown"}
//                   size="small"
//                   sx={{
//                     ml: 1,
//                     bgcolor: getSubscriptionStatusColor(subscription?.status),
//                     color: "white",
//                   }}
//                 />
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 <strong>Amount:</strong> ${subscription?.amount || 0}
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 <strong>Started:</strong> {formatDate(subscription?.startDate)}
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 1 }}>
//                 <strong>Expires:</strong> {formatDate(subscription?.endDate)}
//               </Typography>
//               <Typography variant="body1">
//                 <strong>Active:</strong>
//                 <Chip
//                   label={subscription?.isActive ? "Yes" : "No"}
//                   size="small"
//                   sx={{
//                     ml: 1,
//                     bgcolor: subscription?.isActive ? "#4CAF50" : "#f44336",
//                     color: "white",
//                   }}
//                 />
//               </Typography>
//             </Box>

//             <Button
//               variant="contained"
//               startIcon={
//                 subscription?.status === "Expired" ? <FaRocket /> : <FaCog />
//               }
//               fullWidth
//               size="large"
//               sx={{
//                 background:
//                   subscription?.status === "Expired"
//                     ? "linear-gradient(45deg, #FF6B6B, #4ECDC4)"
//                     : "linear-gradient(45deg, #667eea, #764ba2)",
//                 borderRadius: "12px",
//                 py: 1.5,
//                 fontSize: "1.1rem",
//                 fontWeight: "bold",
//                 "&:hover": {
//                   background:
//                     subscription?.status === "Expired"
//                       ? "linear-gradient(45deg, #FF5252, #26C6DA)"
//                       : "linear-gradient(45deg, #5a67d8, #6b46c1)",
//                   transform: "translateY(-2px)",
//                   boxShadow: "0 8px 25px rgba(255,107,107,0.3)",
//                 },
//               }}
//             >
//               {subscription?.status === "Expired"
//                 ? "Renew Subscription"
//                 : "Manage Subscription"}
//             </Button>
//           </StyledPaper>

//           {/* Quick Stats */}
//           <StyledPaper>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>
//               <FaChartLine style={{ marginRight: 8 }} />
//               Quick Stats
//             </Typography>

//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <Paper
//                   sx={{
//                     p: 2,
//                     textAlign: "center",
//                     borderRadius: "12px",
//                     background: "linear-gradient(135deg, #e8f5e8, #c8e6c9)",
//                   }}
//                 >
//                   <Typography
//                     variant="h4"
//                     color="success.main"
//                     fontWeight="bold"
//                   >
//                     {tenantInfo?.isActive ? "1" : "0"}
//                   </Typography>
//                   <Typography variant="body2">Active Tenants</Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={6}>
//                 <Paper
//                   sx={{
//                     p: 2,
//                     textAlign: "center",
//                     borderRadius: "12px",
//                     background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
//                   }}
//                 >
//                   <Typography variant="h4" color="primary" fontWeight="bold">
//                     {userData?.status === "active" ? "100" : "0"}%
//                   </Typography>
//                   <Typography variant="body2">Account Health</Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={6}>
//                 <Paper
//                   sx={{
//                     p: 2,
//                     textAlign: "center",
//                     borderRadius: "12px",
//                     background: "linear-gradient(135deg, #fff3e0, #ffcc02)",
//                   }}
//                 >
//                   <Typography
//                     variant="h4"
//                     color="warning.main"
//                     fontWeight="bold"
//                   >
//                     {getDaysRemaining()}
//                   </Typography>
//                   <Typography variant="body2">Days Remaining</Typography>
//                 </Paper>
//               </Grid>
//               <Grid item xs={6}>
//                 <Paper
//                   sx={{
//                     p: 2,
//                     textAlign: "center",
//                     borderRadius: "12px",
//                     background: subscription?.isPaid
//                       ? "linear-gradient(135deg, #e8f5e8, #c8e6c9)"
//                       : "linear-gradient(135deg, #ffebee, #ffcdd2)",
//                   }}
//                 >
//                   <Typography
//                     variant="h4"
//                     color={subscription?.isPaid ? "success.main" : "error.main"}
//                     fontWeight="bold"
//                   >
//                     {subscription?.isPaid ? "✓" : "✗"}
//                   </Typography>
//                   <Typography variant="body2">Payment Status</Typography>
//                 </Paper>
//               </Grid>
//             </Grid>
//           </StyledPaper>

//           {/* Quick Actions */}
//           <StyledPaper>
//             <Typography variant="h5" fontWeight="bold" gutterBottom>
//               Quick Actions
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <Button
//                   fullWidth
//                   variant={!subscription?.isPaid ? "contained" : "outlined"}
//                   startIcon={<FaCreditCard />}
//                   sx={{
//                     mb: 2,
//                     borderRadius: "12px",
//                     py: 1.5,
//                     ...(!subscription?.isPaid && {
//                       background: "linear-gradient(45deg, #f44336, #d32f2f)",
//                       color: "white",
//                       "&:hover": {
//                         background: "-gradient(45deg, #d32f2f, #b71c1c)",
//                       },
//                     }),
//                   }}
//                 >
//                   {subscription?.isPaid
//                     ? "Payment History"
//                     : "Complete Payment"}
//                 </Button>
//               </Grid>
//               <Grid item xs={12}>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   startIcon={<FaCog />}
//                   sx={{ mb: 2, borderRadius: "12px", py: 1.5 }}
//                 >
//                   Account Settings
//                 </Button>
//               </Grid>
//               <Grid item xs={6}>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   startIcon={<FaUserFriends />}
//                   sx={{ borderRadius: "12px" }}
//                 >
//                   Invite Users
//                 </Button>
//               </Grid>
//               <Grid item xs={6}>
//                 <Button
//                   fullWidth
//                   variant="outlined"
//                   startIcon={<FaDatabase />}
//                   sx={{ borderRadius: "12px" }}
//                 >
//                   Database
//                 </Button>
//               </Grid>
//             </Grid>
//           </StyledPaper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Profile;
