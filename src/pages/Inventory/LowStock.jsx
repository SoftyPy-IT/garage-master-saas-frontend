/* eslint-disable no-unused-vars */
"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Breadcrumbs,
  Link,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  Divider,
  LinearProgress,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Badge,
  Collapse,
  Alert,
  AlertTitle,
} from "@mui/material"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import SearchIcon from "@mui/icons-material/Search"
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"
import TrendingDownIcon from "@mui/icons-material/TrendingDown"
import VisibilityIcon from "@mui/icons-material/Visibility"
import FilterListIcon from "@mui/icons-material/FilterList"
import InventoryIcon from "@mui/icons-material/Inventory"
import WarningIcon from "@mui/icons-material/Warning"
import ErrorIcon from "@mui/icons-material/Error"
import InfoIcon from "@mui/icons-material/Info"
import StoreIcon from "@mui/icons-material/Store"
import BarChartIcon from "@mui/icons-material/BarChart"
import RefreshIcon from "@mui/icons-material/Refresh"
import CloseIcon from "@mui/icons-material/Close"
import SortIcon from "@mui/icons-material/Sort"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import { useGetAllStocksQuery } from "../../redux/api/stocksApi"
import { useTenantDomain } from "../../hooks/useTenantDomain"

export default function LowStocksPage() {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [openDialog, setOpenDialog] = useState(false)
  const [openOrderDialog, setOpenOrderDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [orderQuantity, setOrderQuantity] = useState(0)
  const [tabValue, setTabValue] = useState(0)
  const [alertOpen, setAlertOpen] = useState(true)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [processedProducts, setProcessedProducts] = useState([])
const tenantDomain = useTenantDomain();
  const queryParams = {tenantDomain, page: currentPage, limit: 100, searchTerm: searchTerm }
  const { data: stockData, isLoading: stockLoading, refetch } = useGetAllStocksQuery(queryParams)



  useEffect(() => {
    if (stockData && stockData.success && stockData.data) {
      const processed = stockData.data.map((stock) => {
        const product = stock.product || {}
        const currentStock = stock.stock || 0

        const criticalLevel = 5 
        const lowStockLevel = 20 
        const outOfStockLevel = 0 

        let status = "in-stock"
        if (currentStock === outOfStockLevel) {
          status = "out-of-stock"
        } else if (currentStock <= criticalLevel) {
          status = "critical"
        } else if (currentStock <= lowStockLevel) {
          status = "low-stock"
        }

        return {
          id: stock._id?.product || product._id || Math.random().toString(),
          code: product._id || "N/A",
          name: product.name || product.productName || "Unnamed Product",
          category: product.category?.main_category || product.category?.name || "Uncategorized",
          brand: product.brand?.brand || product.brand?.name || "N/A",
          currentStock: currentStock,
          minimumStock: criticalLevel,
          reorderLevel: lowStockLevel,
          status: status,
          supplier: "Auto Parts Supplier",
          lastOrderDate: new Date().toLocaleDateString(),
          image: product.image || product.brand?.image || "/placeholder.svg?height=120&width=120",
          warehouse: stock.warehouse?.name || "N/A",
          warehouseCode: stock.warehouse?.code || "N/A",
          avgPurchasePrice: stock.avgPurchasePrice || 0,
          avgSellingPrice: stock.avgSellingPrice || 0,
          lastPurchasePrice: stock.lastPurchasePrice || 0,
          lastSellingPrice: stock.lastSellingPrice || 0,
          totalPurchaseValue: stock.totalPurchaseValue || 0,
          totalSellingValue: stock.totalSellingValue || 0,
          inQuantity: stock.inQuantity || 0,
          outQuantity: stock.outQuantity || 0,

          originalData: stock,
        }
      })
      setProcessedProducts(processed)
      setLoading(false)
    }
  }, [stockData])

  const handleOpenDialog = (product) => {
    setSelectedProduct(product)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedProduct(null)
  }

  const handleOpenOrderDialog = (product) => {
    setSelectedProduct(product)
    setOrderQuantity(product.reorderLevel - product.currentStock)
    setOpenOrderDialog(true)
  }

  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false)
  }

  const handlePlaceOrder = () => {
    setOpenOrderDialog(false)
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const countByStatus = useMemo(() => {
    const allItems = processedProducts
    const outOfStock = allItems.filter((p) => p.status === "out-of-stock").length
    const critical = allItems.filter((p) => p.status === "critical").length
    const lowStock = allItems.filter((p) => p.status === "low-stock").length
    const inStock = allItems.filter((p) => p.status === "in-stock").length

    return {
      total: allItems.length,
      outOfStock: outOfStock,
      critical: critical,
      lowStock: lowStock,
      inStock: inStock,
      needsAttention: outOfStock + critical + lowStock,
    }
  }, [processedProducts])

  const filteredProducts = useMemo(() => {
    return processedProducts
      .filter((product) => {

        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.warehouse.toLowerCase().includes(searchTerm.toLowerCase())


        let matchesTab = true
        if (tabValue === 1) {
  
          matchesTab = product.status === "out-of-stock"
        } else if (tabValue === 2) {

          matchesTab = product.status === "critical"
        } else if (tabValue === 3) {

          matchesTab = product.status === "low-stock"
        }
        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "out-of-stock" && product.status === "out-of-stock") ||
          (filterStatus === "critical" && product.status === "critical") ||
          (filterStatus === "low-stock" && product.status === "low-stock")

        return matchesSearch && matchesTab && matchesStatus
      })
      .sort((a, b) => {
        let comparison = 0
        if (sortBy === "name") {
          comparison = a.name.localeCompare(b.name)
        } else if (sortBy === "currentStock") {
          comparison = a.currentStock - b.currentStock
        } else if (sortBy === "brand") {
          comparison = a.brand.localeCompare(b.brand)
        }
        return sortOrder === "asc" ? comparison : -comparison
      })
  }, [processedProducts, searchTerm, filterStatus, sortBy, sortOrder, tabValue])

  const getStatusChip = (status) => {
    switch (status) {
      case "out-of-stock":
        return (
          <Chip
            icon={<ErrorIcon />}
            label="Out of Stock"
            color="error"
            size="small"
            sx={{
              fontWeight: 600,
              boxShadow: `0 2px 5px ${alpha(theme.palette.error.main, 0.2)}`,
              background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
              "& .MuiChip-icon": { color: "white" },
            }}
          />
        )
      case "critical":
        return (
          <Chip
            icon={<WarningIcon />}
            label="Critical"
            color="warning"
            size="small"
            sx={{
              fontWeight: 600,
              boxShadow: `0 2px 5px ${alpha(theme.palette.warning.main, 0.2)}`,
              background: `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
              "& .MuiChip-icon": { color: "white" },
            }}
          />
        )
      case "low-stock":
        return (
          <Chip
            icon={<InfoIcon />}
            label="Low Stock"
            color="info"
            size="small"
            sx={{
              fontWeight: 600,
              boxShadow: `0 2px 5px ${alpha(theme.palette.info.main, 0.2)}`,
              background: `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
              "& .MuiChip-icon": { color: "white" },
            }}
          />
        )
      default:
        return <Chip label="Unknown" color="default" size="small" />
    }
  }

  const getStockPercentage = (current, minimum) => {
    if (minimum === 0) return 0
    const percentage = (current / minimum) * 100
    return Math.min(percentage, 100)
  }

  const getStockColor = (status) => {
    switch (status) {
      case "out-of-stock":
        return theme.palette.error.main
      case "critical":
        return theme.palette.warning.main
      case "low-stock":
        return theme.palette.info.main
      default:
        return theme.palette.success.main
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const isLoading = stockLoading || loading

  return (
    <Box
      sx={{
        background: `linear-gradient(to right, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(
          theme.palette.background.default,
          0.1,
        )})`,
        minHeight: "100vh",
        p: 3,
        borderRadius: 2,
      }}
    >
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/dashboard">
          Dashboard
        </Link>
        <Link color="inherit" href="/inventory">
          Inventory
        </Link>
        <Typography color="text.primary">Low Stock</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            textFillColor: "transparent",
            display: "inline-block",
          }}
        >
          <TrendingDownIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Low Stock Management
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddShoppingCartIcon />}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: `0 6px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                transform: "translateY(-2px)",
              },
            }}
          >
            Order All
          </Button>

          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refetch()} sx={{ borderRadius: 2 }}>
            Refresh
          </Button>
        </Box>
      </Box>

      <Collapse in={alertOpen}>
        <Alert
          severity={countByStatus.outOfStock > 0 ? "error" : countByStatus.critical > 0 ? "warning" : "info"}
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.15)}`,
            "& .MuiAlert-icon": { color: theme.palette.warning.main },
          }}
          action={
            <IconButton aria-label="close" color="inherit" size="small" onClick={() => setAlertOpen(false)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle sx={{ fontWeight: 600 }}>
            {countByStatus.outOfStock > 0
              ? "Critical Alert!"
              : countByStatus.critical > 0
                ? "Warning!"
                : "Stock Status"}
          </AlertTitle>
          {countByStatus.outOfStock > 0 && (
            <>
              Your inventory has <strong>{countByStatus.outOfStock}</strong> items completely out of stock.{" "}
            </>
          )}
          {countByStatus.critical > 0 && (
            <>
              You have <strong>{countByStatus.critical}</strong> items at critical stock levels.{" "}
            </>
          )}
          {countByStatus.lowStock > 0 && (
            <>
              Additionally, <strong>{countByStatus.lowStock}</strong> items are running low.{" "}
            </>
          )}
          Immediate attention recommended for {countByStatus.needsAttention} items.
        </Alert>
      </Collapse>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: `0 6px 16px ${alpha(theme.palette.error.main, 0.15)}`,
              background: `linear-gradient(135deg, ${alpha(theme.palette.error.light, 0.2)}, ${alpha(
                theme.palette.error.main,
                0.05,
              )})`,
              border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: `0 8px 20px ${alpha(theme.palette.error.main, 0.2)}`,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                    Stock Out
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                    {countByStatus.outOfStock}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Items
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.error.main, 0.2),
                    color: theme.palette.error.main,
                    width: 56,
                    height: 56,
                  }}
                >
                  <ErrorIcon fontSize="large" />
                </Avatar>
              </Box>
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ mt: 2, borderRadius: 5 }}
                startIcon={<AddShoppingCartIcon />}
                onClick={() => setTabValue(1)}
              >
                View Items
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: `0 6px 16px ${alpha(theme.palette.warning.main, 0.15)}`,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.light, 0.2)}, ${alpha(
                theme.palette.warning.main,
                0.05,
              )})`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: `0 8px 20px ${alpha(theme.palette.warning.main, 0.2)}`,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                    Critical Stock
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                    {countByStatus.critical}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Items
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.2),
                    color: theme.palette.warning.main,
                    width: 56,
                    height: 56,
                  }}
                >
                  <WarningIcon fontSize="large" />
                </Avatar>
              </Box>
              <Button
                variant="outlined"
                color="warning"
                size="small"
                sx={{ mt: 2, borderRadius: 5 }}
                startIcon={<AddShoppingCartIcon />}
                onClick={() => setTabValue(2)}
              >
                View Items
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: `0 6px 16px ${alpha(theme.palette.info.main, 0.15)}`,
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.2)}, ${alpha(
                theme.palette.info.main,
                0.05,
              )})`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: `0 8px 20px ${alpha(theme.palette.info.main, 0.2)}`,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                    Low Stock
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                    {countByStatus.lowStock}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Items
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.2),
                    color: theme.palette.info.main,
                    width: 56,
                    height: 56,
                  }}
                >
                  <InfoIcon fontSize="large" />
                </Avatar>
              </Box>
              <Button
                variant="outlined"
                color="info"
                size="small"
                sx={{ mt: 2, borderRadius: 5 }}
                startIcon={<AddShoppingCartIcon />}
                onClick={() => setTabValue(3)}
              >
                View Items
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: `0 6px 16px ${alpha(theme.palette.success.main, 0.15)}`,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.light, 0.2)}, ${alpha(
                theme.palette.success.main,
                0.05,
              )})`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: `0 8px 20px ${alpha(theme.palette.success.main, 0.2)}`,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                    Total Items
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                    {countByStatus.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    In System
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                    color: theme.palette.success.main,
                    width: 56,
                    height: 56,
                  }}
                >
                  <InventoryIcon fontSize="large" />
                </Avatar>
              </Box>
              <Button
                variant="outlined"
                color="success"
                size="small"
                sx={{ mt: 2, borderRadius: 5 }}
                startIcon={<BarChartIcon />}
                onClick={() => setTabValue(0)}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.primary.main,
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              minWidth: 100,
              transition: "all 0.2s",
              "&:hover": {
                color: theme.palette.primary.main,
              },
            },
            "& .Mui-selected": {
              color: `${theme.palette.primary.main} !important`,
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <InventoryIcon sx={{ mr: 1, fontSize: 20 }} />
                All Items
                <Badge badgeContent={countByStatus.total} color="primary" sx={{ ml: 1 }} />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ErrorIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.error.main }} />
                Out of Stock
                <Badge badgeContent={countByStatus.outOfStock} color="error" sx={{ ml: 1 }} />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <WarningIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.warning.main }} />
                Critical
                <Badge badgeContent={countByStatus.critical} color="warning" sx={{ ml: 1 }} />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <InfoIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.info.main }} />
                Low Stock
                <Badge badgeContent={countByStatus.lowStock} color="info" sx={{ ml: 1 }} />
              </Box>
            }
          />
        </Tabs>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { xs: "100%", sm: 400 } }}
          size="small"
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() =>
              setFilterStatus(
                filterStatus === "all"
                  ? "out-of-stock"
                  : filterStatus === "out-of-stock"
                    ? "critical"
                    : filterStatus === "critical"
                      ? "low-stock"
                      : "all",
              )
            }
            sx={{ borderRadius: 2 }}
          >
            {filterStatus === "all"
              ? "Show All"
              : filterStatus === "out-of-stock"
                ? "Out of Stock Only"
                : filterStatus === "critical"
                  ? "Critical Only"
                  : "Low Stock Only"}
          </Button>

          <Button
            variant="outlined"
            startIcon={<SortIcon />}
            onClick={() =>
              handleSort(sortBy === "name" ? "currentStock" : sortBy === "currentStock" ? "brand" : "name")
            }
            sx={{ borderRadius: 2 }}
          >
            {sortBy === "name" ? "Name" : sortBy === "currentStock" ? "Stock" : "Brand"}
            {sortOrder === "asc" ? " ⬆" : " ⬇"}
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ width: "100%", mb: 2 }}>
          <LinearProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  overflow: "visible",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow: `0 6px 16px ${alpha(getStockColor(product.status), 0.15)}`,
                  border: `1px solid ${alpha(getStockColor(product.status), 0.1)}`,
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: `0 8px 20px ${alpha(getStockColor(product.status), 0.25)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -15,
                    right: 20,
                    zIndex: 1,
                  }}
                >
                  {getStatusChip(product.status)}
                </Box>

                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Avatar
                    src={product.image}
                    alt={product.name}
                    variant="rounded"
                    sx={{
                      width: 60,
                      height: 60,
                      mr: 2,
                      boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.code} | {product.brand}
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Current Stock:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: getStockColor(product.status),
                        }}
                      >
                        {product.currentStock} pcs
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getStockPercentage(product.currentStock, product.minimumStock)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(getStockColor(product.status), 0.1),
                        "& .MuiLinearProgress-bar": {
                          bgcolor: getStockColor(product.status),
                        },
                      }}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Minimum Stock:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {product.minimumStock} pcs
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Reorder Level:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {product.reorderLevel} pcs
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Warehouse:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, display: "flex", alignItems: "center" }}>
                        <StoreIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.primary.main }} />
                        {product.warehouse}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Avg Purchase:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatCurrency(product.avgPurchasePrice)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Avg Selling:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatCurrency(product.avgSellingPrice)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>

                <Divider />

                <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleOpenDialog(product)}
                    sx={{ borderRadius: 2 }}
                  >
                    Details
                  </Button>
                  {/* <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleOpenOrderDialog(product)}
                    sx={{
                      borderRadius: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  >
                    Order
                  </Button> */}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {filteredProducts.length === 0 && !isLoading && (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
            border: `1px dashed ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No low stock items found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All items are well stocked or try changing your search criteria
          </Typography>
        </Paper>
      )}

      {/* Product Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.15)}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(to right, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(
              theme.palette.background.default,
              0.05,
            )})`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TrendingDownIcon
              sx={{
                mr: 1,
                color: selectedProduct ? getStockColor(selectedProduct.status) : theme.palette.primary.main,
              }}
            />
            <Typography variant="h6">Low Stock Product Details</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProduct && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    variant="rounded"
                    sx={{
                      width: "100%",
                      height: 200,
                      mb: 2,
                      boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
                    }}
                  />
                  <Box sx={{ position: "absolute", top: 10, right: 10 }}>{getStatusChip(selectedProduct.status)}</Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Stock Status:
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={getStockPercentage(selectedProduct.currentStock, selectedProduct.minimumStock)}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: alpha(getStockColor(selectedProduct.status), 0.1),
                        "& .MuiLinearProgress-bar": {
                          bgcolor: getStockColor(selectedProduct.status),
                        },
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        Current: {selectedProduct.currentStock}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        Minimum: {selectedProduct.minimumStock}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={() => {
                    handleCloseDialog()
                    handleOpenOrderDialog(selectedProduct)
                  }}
                  sx={{
                    borderRadius: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
                    py: 1.5,
                  }}
                >
                  Place Order
                </Button>
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  {selectedProduct.name}
                </Typography>

                <Box sx={{ display: "flex", mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                    Product Code:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedProduct.code}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                    Category:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedProduct.category}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                    Brand:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedProduct.brand}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: "center",
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Stock
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: getStockColor(selectedProduct.status),
                        }}
                      >
                        {selectedProduct.currentStock}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        pcs
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: "center",
                        bgcolor: alpha(theme.palette.warning.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Minimum Stock
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.warning.main,
                        }}
                      >
                        {selectedProduct.minimumStock}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        pcs
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: "center",
                        bgcolor: alpha(theme.palette.success.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Reorder Level
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.success.main,
                        }}
                      >
                        {selectedProduct.reorderLevel}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        pcs
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Warehouse
                  </Typography>
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                    <StoreIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.primary.main }} />
                    {selectedProduct.warehouse}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Order Date
                  </Typography>
                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.primary.main }} />
                    {selectedProduct.lastOrderDate}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Recommendation
                  </Typography>
                  <Alert severity="warning" sx={{ mt: 1, borderRadius: 2 }}>
                    <Typography variant="body2">
                      Immediate order of <strong>{selectedProduct.reorderLevel - selectedProduct.currentStock}</strong>{" "}
                      pcs is recommended.
                    </Typography>
                  </Alert>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: 2 }}>
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddShoppingCartIcon />}
            onClick={() => {
              handleCloseDialog()
              if (selectedProduct) handleOpenOrderDialog(selectedProduct)
            }}
            sx={{
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            Place Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Place Order Dialog */}
      <Dialog
        open={openOrderDialog}
        onClose={handleCloseOrderDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.15)}`,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(to right, ${alpha(theme.palette.primary.light, 0.1)}, ${alpha(
              theme.palette.background.default,
              0.05,
            )})`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AddShoppingCartIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6">Purchase Order</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProduct && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Avatar
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  variant="rounded"
                  sx={{
                    width: "100%",
                    height: 120,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  {selectedProduct.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedProduct.code} | {selectedProduct.brand}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Current Stock:
                  </Typography>
                  <Chip
                    label={`${selectedProduct.currentStock} pcs`}
                    size="small"
                    color={
                      selectedProduct.status === "out-of-stock"
                        ? "error"
                        : selectedProduct.status === "critical"
                          ? "warning"
                          : "info"
                    }
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Warehouse:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedProduct.warehouse}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Order Quantity</InputLabel>
                  <Select
                    value={orderQuantity}
                    label="Order Quantity"
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  >
                    {[...Array(20)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1} pcs
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                    borderRadius: 2,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Current Stock
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: getStockColor(selectedProduct.status),
                        }}
                      >
                        {selectedProduct.currentStock} pcs
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Stock After Order
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.success.main,
                        }}
                      >
                        {selectedProduct.currentStock + orderQuantity} pcs
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={handleCloseOrderDialog} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlaceOrder}
            sx={{
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
