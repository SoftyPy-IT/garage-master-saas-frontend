/* eslint-disable react/prop-types */
"use client"

import {
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Divider,
  Chip,
  Paper,
} from "@mui/material"
import {
  CalendarMonth as CalendarMonthIcon,
  Inventory as InventoryIcon,
  MonetizationOn as MonetizationOnIcon,
  Label as LabelIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  Business as BusinessIcon,
} from "@mui/icons-material"
import GarageModal from "../../../components/Share/Modal/GarageModal";

export function StockDetailsDialog({ open, onClose, product, setOpen }) {

  if (!product) {
    return null;
  }

  const {
    code = "N/A",
    name = "Unknown Product",
    category = "Uncategorized",
    image,
    currentStock = 0,
    inQuantity = 0,
    outQuantity = 0,
    minimumStock = 0,
    purchasePrice = 0,
    sellingPrice = 0,
    minimumSalePrice = 0,
    unit = "unit",
    warehouse = "N/A",
    warehouseCode = "N/A",
    status = "N/A",
    productDescription = "",
    originalData = {},
  } = product;

  console.log('products details:', product)

  // Extract data from originalData with fallbacks
  const {
    totalPurchaseValue = 0,
    totalSellingValue = 0,
    avgPurchasePrice = 0,
    avgSellingPrice = 0,
    lastPurchasePrice = 0,
    lastSellingPrice = 0,
    manufacturingDate = "N/A",
    expiryDate = "N/A",
    warranty = "N/A",
    lastPurchaseDate,
    lastSoldDate,
    suppliers = {},
    specifications = "N/A",
    storageLocation = "N/A",
    product_type = {},
    batchNumber = "N/A",
    tags = [],
  } = originalData;

  // Calculate total value based on current stock and purchase price
  const totalValue = currentStock * purchasePrice;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "N/A";
    }
  };

  const title = 'Product Details'

  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title={title}
      maxWidth="md"
    >

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
                src={image || "/placeholder.svg?height=200&width=200"}
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
              {category}
            </Typography>
            <Chip
              label={status}
              color={
                status === "low-stock" ? "error" :
                  status === "in-stock" ? "success" : "default"
              }
              size="small"
              sx={{ mt: 1 }}
            />
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
                  {currentStock} {unit}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Stock In:
                </Typography>
                <Typography variant="body1" color="success.main">
                  +{inQuantity} {unit}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Stock Out:
                </Typography>
                <Typography variant="body1" color="error.main">
                  -{outQuantity} {unit}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Minimum Stock:
                </Typography>
                <Typography variant="body1">
                  {minimumStock} {unit}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Warehouse:
                </Typography>
                <Typography variant="body1">{warehouse}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Warehouse Code:
                </Typography>
                <Typography variant="body1">{warehouseCode}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Batch Number:
                </Typography>
                <Typography variant="body1">{batchNumber}</Typography>
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
                  Purchase Price:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  ৳ {purchasePrice}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Selling Price:
                </Typography>
                <Typography variant="body1" color="success.main">
                  ৳ {sellingPrice}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Minimum Sale Price:
                </Typography>
                <Typography variant="body1">৳ {minimumSalePrice}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Total Value:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  ৳ {totalValue.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Avg Purchase Price:
                </Typography>
                <Typography variant="body1">৳ {avgPurchasePrice}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Avg Selling Price:
                </Typography>
                <Typography variant="body1"> ৳ {avgSellingPrice}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Last Purchase Price:
                </Typography>
                <Typography variant="body1">৳ {lastPurchasePrice}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Last Selling Price:
                </Typography>
                <Typography variant="body1">৳ {lastSellingPrice}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Total Purchase Value:
                </Typography>
                <Typography variant="body1">৳ {totalPurchaseValue.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Total Selling Value:
                </Typography>
                <Typography variant="body1">৳ {totalSellingValue.toLocaleString()}</Typography>
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
                <Typography variant="body1">{warranty}</Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Last Purchase:
                </Typography>
                <Typography variant="body1">{formatDate(lastPurchaseDate)}</Typography>
              </Grid>
              <Grid item xs={6} md={6}>
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
                  Storage Location:
                </Typography>
                <Typography variant="body1">{storageLocation}</Typography>
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
                <Typography variant="body1">
                  {productDescription || "No description available"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Tags:
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {tags && tags.length > 0 ? (
                    tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                        icon={<LabelIcon />}
                      />
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
      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid rgba(0, 0, 0, 0.1)" }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button variant="contained" color="primary">
          Edit Product
        </Button>
      </DialogActions>
    </GarageModal>
  )
}