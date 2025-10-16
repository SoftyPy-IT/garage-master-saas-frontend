/* eslint-disable react/prop-types */
"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Divider,
  IconButton,
  Chip,
  Paper,
} from "@mui/material"
import {
  Close as CloseIcon,
  CalendarMonth as CalendarMonthIcon,
  Inventory as InventoryIcon,
  MonetizationOn as MonetizationOnIcon,
  Label as LabelIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Business as BusinessIcon,
} from "@mui/icons-material"

export function StockDetailsDialog({ open, onClose, product }) {

  if (!product) {
   
    return null;
  }
  const {
    code = "N/A",
    name = "Unknown Product",
    category = "Uncategorized",
    brand = "N/A",
    unit = "unit",
    quantity = 0,
    initialStock = 0,
    stockIn = 0,
    stockOut = 0,
    stockAlert = 0,
    value = 0,
    originalData = {},
  } = product;

  // Safely access nested properties from originalData
  const {
    product_price = 0,
    product_tax = 0,
    discount = 0,
    manufacturingDate = "N/A",
    expiryDate = "N/A",
    warranty = "N/A",
    lastPurchaseDate,
    lastSoldDate,
    suppliers = {},
    productDescription = "N/A",
    specifications = "N/A",
    storageLocation = "N/A",
    product_type = {},
  } = originalData;

  // Safely handle arrays
  const tags = Array.isArray(originalData.tags) ? originalData.tags : [];

  // Safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          pb: 2,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          Product Details
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  width: "100%",
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  bgcolor: "rgba(0, 0, 0, 0.02)",
                }}
              >
                <img
                  src={originalData.image || "/placeholder.svg?height=200&width=200"}
                  alt={name}
                  width={150}
                  height={150}
                  style={{ objectFit: "contain" }}
                />
              </Paper>

              <Chip label={code} color="primary" sx={{ fontWeight: "bold", mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                {category} • {brand}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                <InventoryIcon sx={{ mr: 1, fontSize: 20 }} />
                Stock Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Current Stock:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {quantity} {unit}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Initial Stock:
                  </Typography>
                  <Typography variant="body1">
                    {initialStock} {unit}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Stock In:
                  </Typography>
                  <Typography variant="body1" color="success.main">
                    +{stockIn} {unit}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Stock Out:
                  </Typography>
                  <Typography variant="body1" color="error.main">
                    -{stockOut} {unit}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Alert Level:
                  </Typography>
                  <Typography variant="body1">
                    {stockAlert} {unit}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Location:
                  </Typography>
                  <Typography variant="body1">{storageLocation}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Batch Number:
                  </Typography>
                  <Typography variant="body1">{originalData.batchNumber || "N/A"}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Unit Type:
                  </Typography>
                  <Typography variant="body1">{unit}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                <MonetizationOnIcon sx={{ mr: 1, fontSize: 20 }} />
                Pricing Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Unit Price:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    ${product_price}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Tax Rate:
                  </Typography>
                  <Typography variant="body1">{product_tax}%</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Discount:
                  </Typography>
                  <Typography variant="body1">{discount}%</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Total Value:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    ${value.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                <CalendarMonthIcon sx={{ mr: 1, fontSize: 20 }} />
                Dates & Timeline
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Manufacturing Date:
                  </Typography>
                  <Typography variant="body1">{manufacturingDate}</Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Expiry Date:
                  </Typography>
                  <Typography variant="body1">{expiryDate}</Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Warranty:
                  </Typography>
                  <Typography variant="body1">{warranty} months</Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Last Purchase:
                  </Typography>
                  <Typography variant="body1">{formatDate(lastPurchaseDate)}</Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Last Sold:
                  </Typography>
                  <Typography variant="body1">{formatDate(lastSoldDate)}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                <DescriptionIcon sx={{ mr: 1, fontSize: 20 }} />
                Product Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Supplier:
                  </Typography>
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                    <BusinessIcon sx={{ mr: 0.5, fontSize: 16, color: "text.secondary" }} />
                    {suppliers.shop_name || suppliers.full_name || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Product Type:
                  </Typography>
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                    <CategoryIcon sx={{ mr: 0.5, fontSize: 16, color: "text.secondary" }} />
                    {product_type.product_type || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Specifications:
                  </Typography>
                  <Typography variant="body1">{specifications}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Description:
                  </Typography>
                  <Typography variant="body1">{productDescription}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Tags:
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {tags.length > 0 ? (
                      tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" sx={{ mr: 1, mb: 1 }} icon={<LabelIcon />} />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No tags available
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid rgba(0, 0, 0, 0.1)" }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button variant="contained" color="primary">
          Edit Product
        </Button>
      </DialogActions>
    </Dialog>
  )
}
