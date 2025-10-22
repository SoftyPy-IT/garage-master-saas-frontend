/* eslint-disable no-unused-vars */
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs,
  Link as MuiLink,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  LinearProgress,
  Button,
  Divider,
  TablePagination,
  Menu,
  ListItemIcon,
  ListItemText,
  Stack,
  Alert,
  Tabs,
  Tab,
  Snackbar,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  NavigateNext as NavigateNextIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  MonetizationOn as MonetizationOnIcon,
  WarningAmber as WarningAmberIcon,
  ErrorOutline as ErrorOutlineIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  History as HistoryIcon,
  LocalShipping as LocalShippingIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Inventory2 as Inventory2Icon,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
} from "@mui/icons-material";

import { Link } from "react-router-dom";
import { StockChart } from "./StockManagement/StockTransper";
import { StockDetailsDialog } from "./StockManagement/StockDetailsDialog";
import { StockMovementDialog } from "./StockManagement/StockMovementDialog";
import { StockHistoryDialog } from "./StockManagement/StockHistoryDialog";
import { useGetAllStocksQuery } from "../../redux/api/stocksApi";
import { useAppOptions } from "../../hooks/useAppOptions";
import Can from "../../components/Can";
export default function StockManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openStockMovement, setOpenStockMovement] = useState(false);
  const [openStockDetails, setOpenStockDetails] = useState(false);
  const [openStockHistory, setOpenStockHistory] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [processedProducts, setProcessedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const theme = useTheme();
  const { tenantDomain } = useAppOptions()


  const queryParams = { tenantDomain, page: currentPage, limit: 100, searchTerm: searchTerm };

  const {
    data: stockData,
    isLoading: productLoading,
    isFetching,
    refetch,
  } = useGetAllStocksQuery(queryParams);

  useEffect(() => {
    if (stockData && stockData.success && stockData.data) {
      const processed = stockData.data.map((stock) => {
        const product = stock.product || {};
        let status = "in-stock";
        const currentStock = stock.stock || 0;
        const reorderLevel = product.reorderLevel || 10;

        if (currentStock === 0) {
          status = "out-of-stock";
        } else if (currentStock <= 5) {
          status = "low-stock";
        } else if (currentStock <= reorderLevel) {
          status = "low-stock";
        }

        const totalPurchaseValue = stock.totalPurchaseValue || 0;
        const totalSellingValue = stock.totalSellingValue || 0;
        const purchasePrice = product.purchasePrice || 0;
        const sellingPrice = product.sellingPrice || 0;
        const minimumSalePrice = product.minimumSalePrice || 0;

        return {
          id: stock._id?.product || stock._id || Math.random().toString(),
          code: product.product_code || "N/A",
          name: product.product_name || "Unnamed Product",
          category: product.category?.main_category || "Uncategorized",

          unit: product.unit?.unit || "pcs",
          inQuantity: stock.inQuantity || 0,
          outQuantity: stock.outQuantity || 0,
          currentStock: stock.stock || 0,
          purchasePrice: purchasePrice,
          sellingPrice: sellingPrice,
          minimumSalePrice: minimumSalePrice,
          avgPurchasePrice: stock.avgPurchasePrice || 0,
          avgSellingPrice: stock.avgSellingPrice || 0,
          lastPurchasePrice: stock.lastPurchasePrice || 0,
          lastSellingPrice: stock.lastSellingPrice || 0,
          totalPurchaseValue: totalPurchaseValue,
          totalSellingValue: totalSellingValue,
          warehouse: stock.warehouse?.name || "N/A",
          warehouseCode: stock.warehouse?.code || "N/A",
          status: status,
          reorderLevel: product.reorderLevel || 10,
          minimumStock: product.stock_alert || 5,
          image: product.image || "/placeholder.svg?height=60&width=60",
          productDescription: product.productDescription || "",

          // Store all original data for details view
          originalData: {
            ...stock,
            product: {
              ...product,
              purchasePrice,
              sellingPrice,
              minimumSalePrice
            }
          },
        };
      });
      const uniqueCategories = new Set(["All"]);
      processed.forEach((item) => {
        if (item.category) {
          uniqueCategories.add(item.category);
        }
      });

      setProcessedProducts(processed);
      setCategories(Array.from(uniqueCategories));
    }
  }, [stockData]);

  const selectedProduct = useMemo(() => {
    return processedProducts.find(
      (product) => product.id === selectedProductId
    );
  }, [selectedProductId, processedProducts]);

  const filteredProducts = useMemo(() => {
    if (!processedProducts) return [];

    return processedProducts.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||

        item.warehouse.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [processedProducts, statusFilter, searchTerm, categoryFilter]);

  const summaryStats = useMemo(() => {
    if (!processedProducts || processedProducts.length === 0) {
      return {
        totalItems: 0,
        totalPurchaseValue: 0,
        totalSellingValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
      };
    }

    const totalItems = processedProducts.reduce(
      (sum, item) => sum + item.currentStock,
      0
    );
    const totalPurchaseValue = processedProducts.reduce(
      (sum, item) => sum + item.totalPurchaseValue,
      0
    );
    const totalSellingValue = processedProducts.reduce(
      (sum, item) => sum + item.totalSellingValue,
      0
    );

    return {
      totalItems: totalItems,
      totalPurchaseValue: totalPurchaseValue,
      totalSellingValue: totalSellingValue,
      lowStockItems: processedProducts.filter(
        (item) => item.status === "low-stock"
      ).length,
      outOfStockItems: processedProducts.filter(
        (item) => item.status === "out-of-stock"
      ).length,
    };
  }, [processedProducts]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredProducts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProducts, currentPage, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const refreshData = () => {
    refetch();
    showSnackbar("Data refreshed successfully", "success");
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenStockMovement = () => {
    setOpenStockMovement(true);
    handleMenuClose();
  };

  const handleOpenStockDetails = () => {
    setOpenStockDetails(true);
    handleMenuClose();
  };

  const handleOpenStockHistory = () => {
    setOpenStockHistory(true);
    handleMenuClose();
  };

  const handleCloseDialogs = () => {
    setOpenStockMovement(false);
    setOpenStockDetails(false);
    setOpenStockHistory(false);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setStatusFilter("all");
    setCurrentPage(1);
    refreshData();
  };

  const getStockLevelColor = (quantity, stockAlert) => {
    if (quantity === 0) return theme.palette.error.main;
    if (stockAlert && quantity <= stockAlert) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-US") + " ৳";
  };


  const isLoading = productLoading || isFetching;

  return (
    <Box sx={{ margin: { xs: 0, md: "30px" } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3, mt: 3 }}
      >
        <MuiLink
          color="inherit"
          component={Link}
          to="/"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <DashboardIcon sx={{ mr: 0.5, fontSize: 18 }} />
          <Typography variant="body2">Dashboard</Typography>
        </MuiLink>
        <MuiLink
          color="inherit"
          component={Link}
          to="/inventory"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <InventoryIcon sx={{ mr: 0.5, fontSize: 18 }} />
          <Typography variant="body2">Inventory</Typography>
        </MuiLink>
        <Typography
          color="text.primary"
          variant="body2"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Inventory2Icon sx={{ mr: 0.5, fontSize: 18 }} />
          Stock Management
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: { md: "flex" },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              mb: 1,
            }}
          >
            Stock Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all your product inventory and monitor stock levels
          </Typography>
        </Box>
        <div className="grid grid-cols-1 md:grid-cols-2 space-x-2 mt-3 md:mt-0">
          <div className="flex gap-2 mb-2">
            <div>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FileUploadIcon />}
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
                }}
              >
                Import
              </Button>
            </div>
            <div>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FileDownloadIcon />}
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
                }}
              >
                Export
              </Button>
            </div>
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 2,
                boxShadow: "0 4px 10px rgba(25, 118, 210, 0.2)",
                px: 3,
              }}
            >
              Add New Product
            </Button>
          </div>
        </div>
      </Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#1976d2",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px rgba(25, 118, 210, 0.3)",
                  }}
                >
                  <InventoryIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                  Total Stock
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {isLoading ? (
                  <LinearProgress sx={{ my: 2 }} />
                ) : (
                  summaryStats.totalItems.toLocaleString()
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total items in inventory
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#4caf50",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px rgba(76, 175, 80, 0.3)",
                  }}
                >
                  <MonetizationOnIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                  Purchase Value
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {isLoading ? (
                  <LinearProgress sx={{ my: 2 }} />
                ) : (




                  formatCurrency(summaryStats.totalPurchaseValue)


                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total purchase value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#ff9800",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px rgba(255, 152, 0, 0.3)",
                  }}
                >
                  <WarningAmberIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                  Low Stock
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {isLoading ? (
                  <LinearProgress sx={{ my: 2 }} />
                ) : (
                  summaryStats.lowStockItems
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items with low stock
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#f44336",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px rgba(244, 67, 54, 0.3)",
                  }}
                >
                  <ErrorOutlineIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                  Out of Stock
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {isLoading ? (
                  <LinearProgress sx={{ my: 2 }} />
                ) : (
                  summaryStats.outOfStockItems
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items out of stock
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              minHeight: 64,
              py: 2,
            },
          }}
        >
          <Tab
            icon={<Inventory2Icon />}
            label="Stock Overview"
            iconPosition="start"
            sx={{ fontWeight: "medium" }}
          />
          <Tab
            icon={<TrendingUpIcon />}
            label="Stock In"
            iconPosition="start"
            sx={{ fontWeight: "medium" }}
          />
          <Tab
            icon={<TrendingDownIcon />}
            label="Stock Out"
            iconPosition="start"
            sx={{ fontWeight: "medium" }}
          />
          <Tab
            icon={<BarChartIcon />}
            label="Analytics"
            iconPosition="start"
            sx={{ fontWeight: "medium" }}
          />
          <Tab
            icon={<SettingsIcon />}
            label="Settings"
            iconPosition="start"
            sx={{ fontWeight: "medium" }}
          />
        </Tabs>
      </Paper>

      {/* Stock Movement Chart */}
      {tabValue === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1, md: 3 },
            mb: 4,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Stock Movement Overview
          </Typography>
          <StockChart />
        </Paper>
      )}

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: "linear-gradient(to right, #f5f7fa, #e4e7eb)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 0,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Filters and Search
          </Typography>
          <div>
            <Tooltip title="Show/Hide Filters">
              <IconButton onClick={() => setShowFilters(!showFilters)}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={refreshData}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Box>

        <TextField
          variant="outlined"
          placeholder="Search products by name, code, brand or warehouse..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{
            mb: 0,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "white",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
              transition: "box-shadow 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              },
              "&.Mui-focused": {
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Fade in={showFilters}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "white",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "white",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {[
                    { value: "all", label: "All" },
                    { value: "in-stock", label: "In Stock" },
                    { value: "low-stock", label: "Low Stock" },
                    { value: "out-of-stock", label: "Out of Stock" },
                  ].map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Fade>
      </Paper>

      {/* Products Table */}
      {isLoading ? (
        <Paper sx={{ p: 5, borderRadius: 2, textAlign: "center" }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Loading inventory data...</Typography>
        </Paper>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <Paper sx={{ p: 5, borderRadius: 2, textAlign: "center" }}>
              <Box sx={{ mb: 3 }}>
                <InventoryIcon
                  sx={{
                    fontSize: 60,
                    color: alpha(theme.palette.primary.main, 0.3),
                  }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search or filter criteria
              </Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            </Paper>
          ) : (
            <Paper
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }}
                    >
                      <TableCell sx={{ fontWeight: "bold" }}>Picture</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Purchase Price
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Selling Price
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Min Sale Price
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        In Quantity
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Out Quantity
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Stock
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Stock P.P.
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Stock S.P.
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedProducts.map((item, index) => (
                      <TableRow
                        key={item.id}
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.04
                            ),
                          },
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <TableCell>
                          <Avatar
                            src={item.image}
                            alt={item.name}
                            variant="rounded"
                            sx={{ width: 40, height: 40 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {item.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.code}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          {formatCurrency(item.purchasePrice)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.sellingPrice)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.minimumSalePrice)}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${item.inQuantity} ${item.unit}`}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${item.outQuantity} ${item.unit}`}
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "bold",
                              color: getStockLevelColor(
                                item.currentStock,
                                item.minimumStock
                              ),

                            }}
                          >
                            {item.currentStock} {item.unit}
                          </Typography>

                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "medium" }}>
                          {formatCurrency(item.totalPurchaseValue)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "medium" }}>
                          {formatCurrency(item.totalSellingValue)}
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              justifyContent: "center",
                            }}
                          >
                            <Tooltip
                              title="View Details"
                              TransitionComponent={Zoom}
                            >
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedProductId(item.id);
                                  handleOpenStockDetails();
                                }}
                                sx={{
                                  color: theme.palette.primary.main,
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                  "&:hover": {
                                    backgroundColor: alpha(
                                      theme.palette.primary.main,
                                      0.2
                                    ),
                                  },
                                }}
                              >
                                <Can page='/dashboard/stock' action='view'>
                                  <VisibilityIcon fontSize="small" />
                                </Can>
                              </IconButton>
                            </Tooltip>

                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider />

              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Showing {paginatedProducts.length} of{" "}
                  {filteredProducts.length} products
                </Typography>
                <TablePagination
                  component="div"
                  count={filteredProducts.length}
                  page={currentPage - 1}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage="Products per page:"
                  sx={{
                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      margin: 0,
                    },
                  }}
                />
              </Box>
            </Paper>
          )}
        </>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleOpenStockDetails}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handleOpenStockHistory}>
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Stock History</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleOpenStockMovement}>
          <ListItemIcon>
            <LocalShippingIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Adjust Stock</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Print Barcode</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export Data</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "error.main" }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Product</ListItemText>
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      {openStockMovement && selectedProduct && (
        <StockMovementDialog
          open={openStockMovement}
          onClose={handleCloseDialogs}
          product={selectedProduct}
          onSuccess={(message) => showSnackbar(message, "success")}
        />
      )}
      {openStockDetails && selectedProduct && (
        <StockDetailsDialog
          setOpen={setOpenStockDetails}
          open={openStockDetails}
          onClose={handleCloseDialogs}
          product={selectedProduct}
          tenantDomain={tenantDomain}
        />
      )}
      {openStockHistory && selectedProduct && (
        <StockHistoryDialog
          open={openStockHistory}
          onClose={handleCloseDialogs}
          product={selectedProduct}
        />
      )}


    </Box>
  );
}