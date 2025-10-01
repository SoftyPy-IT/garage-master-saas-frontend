/* eslint-disable no-empty-pattern */

"use client"

import { useState, useEffect } from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  InputAdornment,
  Alert,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  CardHeader,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Container,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material"
import {
  Business,
  Domain,
  CheckCircle,
  ArrowForward,
  ArrowBack,
  Build,
  Payment,
  
  Person,
  Email,
  Lock,
} from "@mui/icons-material"
import { subscriptionPlans } from "../../data"
import { useCreateTenantMutation } from "../../redux/api/tenantApi"
import { toast } from "react-toastify"

const TenantRegisterPage = () => {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [createTenant] = useCreateTenantMutation()

  // Form state with all required fields
  const [tenantData, setTenantData] = useState({
    name: "",
    domain: "",
    businessType: "independent",
    contactEmail: "",
    phoneNumber: "",
    address: "",
    firstName: "",
    // lastName: "",
    userEmail: "",
    password: "",
    confirmPassword: "",
    selectedPlan: "HalfYearly",
    paymentMethod: "Manual",
    amount: 0,
    // Terms
    agreeToTerms: false,
  })

  const calculateAmount = (planId) => {
    const plan = subscriptionPlans.find((p) => p.id === planId)
    if (!plan) return 0
    const priceMatch = plan.price.match(/\$?(\d+(?:\.\d{2})?)/)
    return priceMatch ? Number.parseFloat(priceMatch[1]) : 0
  }


  useEffect(() => {
    setTenantData((prev) => ({
      ...prev,
      amount: calculateAmount(prev.selectedPlan),
    }))
  }, [])

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    let newValue = type === "checkbox" ? checked : value

    // Special handling for domain field - clean and validate
    if (name === "domain") {
      newValue = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "")                        
        .replace(/^-+|-+$/g, "")      
    }

  
    if (type === "text" || type === "email") {
      newValue = value.trim()
    }

    setTenantData((prev) => {
      const updated = {
        ...prev,
        [name]: newValue,
      }

      // Auto-calculate amount when plan changes
      if (name === "selectedPlan") {
        updated.amount = calculateAmount(value)
      }

      return updated
    })
  }

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const validateStep = () => {
    if (activeStep === 0) {
      return (
        tenantData.name.trim() !== "" &&
        tenantData.domain.trim() !== "" &&
        tenantData.domain.length >= 3 && 
        tenantData.contactEmail.trim() !== "" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantData.contactEmail)
      )
    } else if (activeStep === 1) {
      return (
        tenantData.firstName.trim() !== "" &&
        // tenantData.lastName.trim() !== "" &&
        tenantData.userEmail.trim() !== "" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantData.userEmail) &&
        tenantData.password.length >= 6 &&
        tenantData.password === tenantData.confirmPassword
      )
    } else if (activeStep === 2) {
      return tenantData.selectedPlan !== ""
    } else if (activeStep === 3) {
      return tenantData.paymentMethod !== ""
    } else if (activeStep === 4) {
      return tenantData.agreeToTerms
    }
    return true
  }

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const startDate = new Date();
    const endDate = new Date();

    if (tenantData.selectedPlan === "Monthly") {
      endDate.setMonth(startDate.getMonth() + 1);
    } else if (tenantData.selectedPlan === "HalfYearly") {
      endDate.setMonth(startDate.getMonth() + 6);
    } else if (tenantData.selectedPlan === "Yearly") {
      endDate.setFullYear(startDate.getFullYear() + 1);
    }

    const tenantPayload = {
      name: tenantData.name.trim(),
      domain: tenantData.domain.trim().toLowerCase(),
      businessType: tenantData.businessType,
      contactEmail: tenantData.contactEmail.trim().toLowerCase(),
      phoneNumber: tenantData.phoneNumber.trim(),
      address: tenantData.address.trim(),
      user: {
        firstName: tenantData.firstName.trim(),
        // lastName: tenantData.lastName.trim(),
        email: tenantData.userEmail.trim().toLowerCase(),
        password: tenantData.password,
      },
      subscription: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: "Pending",
        isPaid: false,
        isActive: false,
        paymentMethod: tenantData.paymentMethod,
        amount: tenantData.amount,
      },
    }

    const result = await createTenant({
      payload: tenantPayload,
      plan: tenantData.selectedPlan,
    });

    if ("error" in result) {
      throw new Error(result.error?.data?.message || "Failed to register tenant.");
    }

    if (result?.data?.success) {
      toast.success(result.data.message || "Tenant created successfully!");
      navigate("/login");
    } else {
      throw new Error("Unexpected response format from server");
    }
  } catch (err) {
    setError(err.message || "Failed to register tenant.");
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};


  const steps = ["Business Info", "User Account", "Choose Plan", "Payment Details", "Review & Confirm"]

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Business Information
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Business Name"
              name="name"
              autoComplete="organization"
              autoFocus
              value={tenantData.name}
              onChange={handleChange}
              error={tenantData.name.trim() === "" && activeStep > 0}
              helperText={tenantData.name.trim() === "" && activeStep > 0 ? "Business name is required" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="domain"
              label="Domain Name"
              name="domain"
              placeholder="your-garage"
              helperText={
                tenantData.domain.trim() === "" && activeStep > 0
                  ? "Domain name is required (minimum 3 characters)"
                  : "This will be your unique identifier: your-garage.ourplatform.com"
              }
              value={tenantData.domain}
              onChange={handleChange}
              error={(tenantData.domain.trim() === "" || tenantData.domain.length < 3) && activeStep > 0}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Domain color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="contactEmail"
              label="Business Contact Email"
              name="contactEmail"
              type="email"
              autoComplete="email"
              value={tenantData.contactEmail}
              onChange={handleChange}
              error={
                (tenantData.contactEmail.trim() === "" ||
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantData.contactEmail)) &&
                activeStep > 0
              }
              helperText={
                tenantData.contactEmail.trim() === "" && activeStep > 0
                  ? "Valid business contact email is required"
                  : "Primary contact email for your business"
              }
            />
            <TextField
              margin="normal"
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              value={tenantData.phoneNumber}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="address"
              label="Business Address"
              name="address"
              multiline
              rows={2}
              value={tenantData.address}
              onChange={handleChange}
            />
            <FormControl component="fieldset" sx={{ mt: 3 }}>
              <FormLabel component="legend">Business Type</FormLabel>
              <RadioGroup name="businessType" value={tenantData.businessType} onChange={handleChange}>
                <FormControlLabel value="independent" control={<Radio />} label="Independent Garage" />
                <FormControlLabel value="chain" control={<Radio />} label="Chain/Multiple Locations" />
                <FormControlLabel value="dealership" control={<Radio />} label="Dealership Service" />
              </RadioGroup>
            </FormControl>
          </Box>
        )

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Create Admin User Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This will be the main administrator account for your business
            </Typography>
            <TextField

                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  value={tenantData.firstName}
                  onChange={handleChange}
                  error={tenantData.firstName.trim() === "" && activeStep > 1}
                  helperText={tenantData.firstName.trim() === "" && activeStep > 1 ? "First name is required" : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
            <TextField
              margin="normal"
              required
              fullWidth
              id="userEmail"
              label="Admin Email"
              name="userEmail"
              type="email"
              autoComplete="username"
              value={tenantData.userEmail}
              onChange={handleChange}
              error={
                (tenantData.userEmail.trim() === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantData.userEmail)) &&
                activeStep > 1
              }
              helperText={
                tenantData.userEmail.trim() === "" && activeStep > 1
                  ? "Valid admin email is required"
                  : "This email will be used to log into the system"
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={tenantData.password}
              onChange={handleChange}
              error={tenantData.password.length < 6 && activeStep > 1}
              helperText={
                tenantData.password.length < 6 && activeStep > 1
                  ? "Password must be at least 6 characters"
                  : "Minimum 6 characters"
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={tenantData.confirmPassword}
              onChange={handleChange}
              error={tenantData.password !== tenantData.confirmPassword && tenantData.confirmPassword !== ""}
              helperText={
                tenantData.password !== tenantData.confirmPassword && tenantData.confirmPassword !== ""
                  ? "Passwords do not match"
                  : ""
              }
            />
          </Box>
        )

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select a Subscription Plan
            </Typography>
            <Box sx={{ mt: 2, maxHeight: "400px", overflowY: "auto" }}>
              {subscriptionPlans.map((plan) => (
                <Card
                  key={plan.id}
                  variant="outlined"
                  onClick={() => {
                    setTenantData((prev) => ({
                      ...prev,
                      selectedPlan: plan.id,
                      amount: calculateAmount(plan.id),
                    }))
                  }}
                  sx={{
                    mb: 2,
                    position: "relative",
                    border:
                      tenantData.selectedPlan === plan.id
                        ? "2px solid #1976d2"
                        : plan.recommended
                          ? "2px solid #1976d2"
                          : "1px solid rgba(0, 0, 0, 0.12)",
                    boxShadow:
                      tenantData.selectedPlan === plan.id
                        ? "0 0 10px rgba(25, 118, 210, 0.5)"
                        : plan.recommended
                          ? "0 0 10px rgba(25, 118, 210, 0.3)"
                          : "none",
                    transition: "all 0.2s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {plan.recommended && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        bgcolor: "primary.main",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                      }}
                    >
                      RECOMMENDED
                    </Box>
                  )}
                  <CardHeader
                    title={plan.name}
                    titleTypographyProps={{ align: "center", variant: "h6" }}
                    sx={{
                      bgcolor: tenantData.selectedPlan === plan.id ? "primary.light" : "grey.50",
                      color: tenantData.selectedPlan === plan.id ? "white" : "inherit",
                      transition: "all 0.2s ease-in-out",
                      py: 1,
                    }}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography component="h3" variant="h5">
                            {plan.price}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {plan.period}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={8}>
                        <Box>
                          {plan.features.slice(0, 3).map((feature) => (
                            <Box
                              key={feature}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 0.5,
                              }}
                            >
                              <CheckCircle fontSize="small" color="primary" sx={{ mr: 1, flexShrink: 0 }} />
                              <Typography variant="caption">{feature}</Typography>
                            </Box>
                          ))}
                          {plan.features.length > 3 && (
                            <Typography variant="caption" color="text.secondary">
                              +{plan.features.length - 3} more features
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Radio
                        checked={tenantData.selectedPlan === plan.id}
                        onChange={handleChange}
                        name="selectedPlan"
                        value={plan.id}
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" fontWeight={tenantData.selectedPlan === plan.id ? "bold" : "normal"}>
                        {tenantData.selectedPlan === plan.id ? "Selected" : "Select This Plan"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )

      case 3:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Paper variant="outlined" sx={{ p: 3, mt: 2, bgcolor: "grey.50" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                ৳
                <Typography variant="h6">Total Amount: ${tenantData.amount.toFixed(2)}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Selected Plan: {subscriptionPlans.find((p) => p.id === tenantData.selectedPlan)?.name}
              </Typography>
            </Paper>
            <FormControl component="fieldset" sx={{ mt: 3, width: "100%" }}>
              <FormLabel component="legend" sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Payment sx={{ mr: 1 }} />
                  Payment Method
                </Box>
              </FormLabel>
              <RadioGroup name="paymentMethod" value={tenantData.paymentMethod} onChange={handleChange}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ py: 2 }}>
                    <FormControlLabel
                      value="Manual"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            Manual Payment
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Pay via bank transfer or check. Account will be activated after payment verification.
                          </Typography>
                        </Box>
                      }
                    />
                  </CardContent>
                </Card>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ py: 2 }}>
                    <FormControlLabel
                      value="Gateway"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            Online Payment Gateway
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Pay instantly with credit/debit card or digital wallet. Immediate activation.
                          </Typography>
                          <Chip label="Coming Soon" size="small" color="secondary" sx={{ mt: 1 }} />
                        </Box>
                      }
                      disabled
                    />
                  </CardContent>
                </Card>
              </RadioGroup>
            </FormControl>
            {tenantData.paymentMethod === "Manual" && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Manual Payment Instructions:</strong>
                  <br />
                  After registration, you will receive payment instructions via email. Your account will be activated
                  within 24 hours of payment verification.
                </Typography>
              </Alert>
            )}
          </Box>
        )

      case 4:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Business Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Business Name
                  </Typography>
                  <Typography variant="body1">{tenantData.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Domain
                  </Typography>
                  <Typography variant="body1">{tenantData.domain}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact Email
                  </Typography>
                  <Typography variant="body1">{tenantData.contactEmail}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">{tenantData.phoneNumber || "Not provided"}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Business Type
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                    {tenantData?.businessType?.replace(/([A-Z])/g, " $1").trim()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                    Admin User
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {tenantData.firstName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{tenantData.userEmail}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                    Subscription Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Selected Plan
                  </Typography>
                  <Typography variant="body1">
                    {subscriptionPlans.find((p) => p.id === tenantData.selectedPlan)?.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ${tenantData.amount.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Method
                  </Typography>
                  <Typography variant="body1">
                    {tenantData.paymentMethod === "Manual" ? "Manual Payment" : "Online Payment Gateway"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    checked={tenantData.agreeToTerms}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{" "}
                    <Link component={RouterLink} to="/terms">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link component={RouterLink} to="/privacy">
                      Privacy Policy
                    </Link>
                    , and confirm that all information provided is accurate.
                  </Typography>
                }
              />
            </Box>
          </Box>
        )

      default:
        return "Unknown step"
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6} lg={7} sx={{ display: { xs: "none", md: "block" } }}>
            <Box sx={{ color: "white", p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Build sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                  Garage Master
                </Typography>
              </Box>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                Start Your Garage Business Journey
              </Typography>
              <Typography variant="h6" paragraph>
                Join thousands of garage owners who trust our platform to manage their operations efficiently and grow
                their business.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Typography variant="body1" paragraph>
                  • Multi-tenant architecture for scalability
                </Typography>
                <Typography variant="body1" paragraph>
                  • Complete business management suite
                </Typography>
                <Typography variant="body1" paragraph>
                  • Advanced reporting and analytics
                </Typography>
                <Typography variant="body1" paragraph>
                  • 24/7 customer support
                </Typography>
                <Typography variant="body1">• Secure cloud-based platform</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                borderRadius: 2,
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                maxHeight: "85vh",
                overflowY: "auto",
              }}
            >
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Register Your Business
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create your tenant account to get started
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                {getStepContent(activeStep)}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                  }}
                >
                  <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ArrowBack />}>
                    Back
                  </Button>

                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading || !validateStep()}
                      endIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
                    >
                      {loading ? "Creating..." : "Complete Registration"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={!validateStep()}
                      endIcon={<ArrowForward />}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>

              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="body2">
                  Already have a tenant account?{" "}
                  <Link component={RouterLink} to="/login" variant="body2">
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default TenantRegisterPage
