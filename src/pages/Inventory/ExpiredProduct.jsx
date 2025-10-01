/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Avatar,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Badge,
  Fade,
  Zoom,
  useTheme,
  alpha,
  Tabs,
  Tab,
  CircularProgress,
  Menu,
  MenuItem,
  Collapse,
  Alert,
  AlertTitle,
  Snackbar,
  TablePagination,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SortIcon from "@mui/icons-material/Sort";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArchiveIcon from "@mui/icons-material/Archive";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  useDeleteProductMutation,
  useGetAllIProductQuery,
} from "../../redux/api/productApi";
import { AnimatedChip, GlassCard, GradientBreadcrumbs, GradientButton, StyledDialogTitle, StyledTableHead, StyledTableRow } from "../../utils/customStyle";
import { useTenantDomain } from "../../hooks/useTenantDomain";

// Styled components for enhanced UI


export default function ExpiredProductsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [alertOpen, setAlertOpen] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("daysExpired");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [disposalDialogOpen, setDisposalDialogOpen] = useState(false);
  const [disposalLoading, setDisposalLoading] = useState(false);
  const [disposalSuccess, setDisposalSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
const tenantDomain = useTenantDomain();

  // Query parameters for API
  const queryParams = {
    tenantDomain,
    page: currentPage,
    searchTerm: search,
    limit: 100,
  };

  // Fetch products from API
  const {
    data: productData,
    isLoading,
    refetch,
  } = useGetAllIProductQuery(queryParams);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
 
  // Process products to add expiry status
  const processedProducts = useMemo(() => {
    if (!productData?.data?.products) return [];

    const today = new Date();
    const alertDays = 30;

    return productData.data.products
      .map((product) => {
        // Check if product has expiry date
        if (!product.expiryDate) return null;

        const expiryDate = new Date(product.expiryDate);
        const timeDiff = expiryDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // Determine status based on days difference
        let status = "active";
        let daysExpired = 0;

        if (daysDiff < 0) {
          // Product is expired
          status = "expired";
          daysExpired = Math.abs(daysDiff);
        } else if (daysDiff <= (product.expiryAlertDays || alertDays)) {
          // Product is expiring soon
          status = "expiring-soon";
          daysExpired = daysDiff;
        } else {
          // Product is not expired or expiring soon
          return null;
        }

        return {
          id: product._id,
          code: product.product_code || "N/A",
          name: product.product_name || "N/A",
          category: product.category?.main_category || "N/A",
          brand: product.brand?.brand || "N/A",
          expiryDate: product.expiryDate,
          quantity: product.product_quantity || 0,
          daysExpired,
          status,
          image: product.image || "/placeholder.svg?height=50&width=50",
          location: product.storageLocation || "N/A",
          batchNumber: product.batchNumber || "N/A",
          purchaseDate: product.createdAt
            ? new Date(product.createdAt).toISOString().split("T")[0]
            : "N/A",
          supplier: product.suppliers?.full_name || "N/A",
          disposalMethod: "Return to Supplier",
          productDescription: product.productDescription,
          price: product.product_price,
          originalData: product,
        };
      })
      .filter(Boolean);
  }, [productData]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    refetch().then(() => {
      setRefreshing(false);
      setSnackbar({
        open: true,
        message: "Product list refreshed",
        severity: "info",
      });
    });
  };

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      refetch();
      setSnackbar({
        open: true,
        message: "Product successfully deleted",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete product",
        severity: "error",
      });
    }
  };

  const handleDeleteAll = async () => {
    setDisposalLoading(true);
    try {
      const expiredProducts = processedProducts.filter(
        (p) => p.status === "expired"
      );
      for (const product of expiredProducts) {
        await deleteProduct(product.id).unwrap();
      }

      setDisposalLoading(false);
      setDisposalSuccess(true);
      setTimeout(() => {
        setDisposalDialogOpen(false);
        setDisposalSuccess(false);
        refetch();
        setSnackbar({
          open: true,
          message: "All expired products successfully deleted",
          severity: "success",
        });
      }, 1500);
    } catch (error) {
      setDisposalLoading(false);
      setSnackbar({
        open: true,
        message: "Failed to delete all products",
        severity: "error",
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFilterStatus(
      newValue === 0 ? "all" : newValue === 1 ? "expired" : "expiring-soon"
    );
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(column);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleBrandFilter = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleCategoryFilter = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setFilterMenuAnchor(null);
  };

  const handleOpenDisposalDialog = () => {
    setDisposalDialogOpen(true);
  };

  const handleCloseDisposalDialog = () => {
    setDisposalDialogOpen(false);
    setDisposalSuccess(false);
  };

  const handleDisposeAll = () => {
    handleDeleteAll();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredProducts = processedProducts
    .filter((product) => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand &&
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "expired" && product.status === "expired") ||
        (filterStatus === "expiring-soon" &&
          product.status === "expiring-soon");

      // Brand filter
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      return matchesSearch && matchesStatus && matchesBrand && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "daysExpired":
          comparison = a.daysExpired - b.daysExpired;
          break;
        case "quantity":
          comparison = a.quantity - b.quantity;
          break;
        case "expiryDate":
          comparison = new Date(a.expiryDate) - new Date(b.expiryDate);
          break;
        default:
          comparison = a.daysExpired - b.daysExpired;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Get unique brands and categories for filters
  const uniqueBrands = [
    ...new Set(
      processedProducts.map((product) => product.brand).filter(Boolean)
    ),
  ];
  const uniqueCategories = [
    ...new Set(
      processedProducts.map((product) => product.category).filter(Boolean)
    ),
  ];

  // Calculate summary stats
  const totalExpired = processedProducts.filter(
    (p) => p.status === "expired"
  ).length;
  const totalExpiringSoon = processedProducts.filter(
    (p) => p.status === "expiring-soon"
  ).length;
  const totalQuantity = processedProducts.reduce(
    (sum, p) => sum + p.quantity,
    0
  );

  const getStatusChip = (status, daysExpired) => {
    switch (status) {
      case "expired":
        return (
          <AnimatedChip
            icon={<ErrorOutlineIcon />}
            label={`Expired ${daysExpired} days ago`}
            color="error"
            size="small"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`,
              color: "white",
              fontWeight: 500,
              boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.4)}`,
            }}
          />
        );
      case "expiring-soon":
        return (
          <AnimatedChip
            icon={<WarningAmberIcon />}
            label={`Expires in ${daysExpired} days`}
            color="warning"
            size="small"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.warning.dark}, ${theme.palette.warning.main})`,
              color: "white",
              fontWeight: 500,
              boxShadow: `0 2px 8px ${alpha(theme.palette.warning.main, 0.4)}`,
            }}
          />
        );
      default:
        return <Chip label="Unknown" color="default" size="small" />;
    }
  };

  return (
    <div
      className={`bg-gradient-to-br from-[rgba(var(--background-default),0.9)] to-[rgba(var(--background-paper),0.8)] bg-no-repeat bg-center bg-cover  min-h-screen  p-0 md:p-3 rounded-lg mt-2 md:mt-0`}
    >
      <Fade in={true} timeout={800}>
        <div>
          <GradientBreadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 3 }}
          >
            <Link
              color="inherit"
              href="/dashboard"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <InventoryIcon fontSize="small" sx={{ mr: 0.5 }} />
              Dashboard
            </Link>
            <Link
              color="inherit"
              href="/inventory"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <LocalShippingIcon fontSize="small" sx={{ mr: 0.5 }} />
              Inventory
            </Link>
            <Typography
              color="text.primary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <WarningAmberIcon
                fontSize="small"
                sx={{ mr: 0.5, color: theme.palette.error.main }}
              />
              Expired Products
            </Typography>
          </GradientBreadcrumbs>

          <Collapse in={alertOpen}>
            <Alert
              severity="warning"
              variant="filled"
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => setAlertOpen(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.warning.main,
                  0.2
                )}`,
              }}
            >
              <AlertTitle>Warning</AlertTitle>
              There are {totalExpired} expired and {totalExpiringSoon}{" "}
              soon-to-expire products in your inventory. Please dispose of them
              promptly.
            </Alert>
          </Collapse>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              mb: 3,
              gap: 2,
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                backgroundClip: "text",
                textFillColor: "transparent",
                display: "inline-block",
              }}
            >
              <WarningAmberIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Expired Products
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <GradientButton
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={refreshing || isLoading}
              >
                {refreshing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Refresh"
                )}
              </GradientButton>

              <GradientButton
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleOpenDisposalDialog}
                disabled={processedProducts.length === 0}
              >
                Dispose
              </GradientButton>

              <IconButton
                color="primary"
                onClick={handleMenuOpen}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Zoom in={true} style={{ transitionDelay: "100ms" }}>
                <GlassCard>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                          color: theme.palette.error.main,
                          mr: 2,
                        }}
                      >
                        <ErrorOutlineIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Expired
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: theme.palette.error.main }}
                    >
                      {totalExpired}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <TrendingUpIcon
                        sx={{
                          color: theme.palette.error.main,
                          mr: 0.5,
                          fontSize: "1rem",
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Needs immediate attention
                      </Typography>
                    </Box>
                  </CardContent>
                </GlassCard>
              </Zoom>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                <GlassCard>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          color: theme.palette.warning.main,
                          mr: 2,
                        }}
                      >
                        <WarningAmberIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Expiring Soon
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.warning.main,
                      }}
                    >
                      {totalExpiringSoon}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <TrendingDownIcon
                        sx={{
                          color: theme.palette.success.main,
                          mr: 0.5,
                          fontSize: "1rem",
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Monitor closely
                      </Typography>
                    </Box>
                  </CardContent>
                </GlassCard>
              </Zoom>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Zoom in={true} style={{ transitionDelay: "300ms" }}>
                <GlassCard>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          color: theme.palette.info.main,
                          mr: 2,
                        }}
                      >
                        <InventoryIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Total Quantity
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: theme.palette.info.main }}
                    >
                      {totalQuantity}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <BarChartIcon
                        sx={{
                          color: theme.palette.info.main,
                          mr: 0.5,
                          fontSize: "1rem",
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Total of {processedProducts.length} products
                      </Typography>
                    </Box>
                  </CardContent>
                </GlassCard>
              </Zoom>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Zoom in={true} style={{ transitionDelay: "400ms" }}>
                <GlassCard>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                          mr: 2,
                        }}
                      >
                        <CalendarMonthIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Average Expiry
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.success.main,
                      }}
                    >
                      {Math.round(
                        processedProducts.reduce(
                          (sum, p) => sum + p.daysExpired,
                          0
                        ) / processedProducts.length || 0
                      )}{" "}
                      days
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <PieChartIcon
                        sx={{
                          color: theme.palette.success.main,
                          mr: 0.5,
                          fontSize: "1rem",
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Time to take action
                      </Typography>
                    </Box>
                  </CardContent>
                </GlassCard>
              </Zoom>
            </Grid>
          </Grid>

          <div className="mb-4">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 2,
                "& .MuiTab-root": {
                  minWidth: 120,
                  fontWeight: 500,
                  borderRadius: "8px 8px 0 0",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                },
                "& .Mui-selected": {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: 1.5,
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ReceiptLongIcon sx={{ mr: 1 }} />
                    All Products ({processedProducts.length})
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ErrorOutlineIcon
                      sx={{ mr: 1, color: theme.palette.error.main }}
                    />
                    Expired ({totalExpired})
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <WarningAmberIcon
                      sx={{ mr: 1, color: theme.palette.warning.main }}
                    />
                    Expiring Soon ({totalExpiringSoon})
                  </Box>
                }
              />
            </Tabs>
            <div className="flex gap-2 mb-3 flex-wrap">
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
                sx={{
                  maxWidth: { xs: "100%", sm: 300 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: "blur(8px)",
                    transition: "all 0.3s",
                    "&:hover": {
                      boxShadow: `0 4px 12px ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                    },
                    "&.Mui-focused": {
                      boxShadow: `0 4px 12px ${alpha(
                        theme.palette.primary.main,
                        0.2
                      )}`,
                    },
                  },
                }}
              />

              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={handleFilterMenuOpen}
                sx={{
                  borderRadius: 2,
                  borderWidth: 1.5,
                  transition: "all 0.3s",
                  "&:hover": {
                    borderWidth: 1.5,
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                  },
                }}
              >
                Filter
                {(selectedBrands.length > 0 ||
                  selectedCategories.length > 0) && (
                  <Badge
                    badgeContent={
                      selectedBrands.length + selectedCategories.length
                    }
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Button>

              <Button
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={(e) =>
                  handleSort(sortBy === "daysExpired" ? "name" : "daysExpired")
                }
                sx={{
                  borderRadius: 2,
                  borderWidth: 1.5,
                  transition: "all 0.3s",
                  "&:hover": {
                    borderWidth: 1.5,
                    boxShadow: `0 4px 12px ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                  },
                }}
              >
                {sortBy === "daysExpired" ? "Sort by Expiry" : "Sort by Name"}
              </Button>
            </div>

            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
                <CircularProgress />
              </Box>
            ) : filteredProducts.length === 0 ? (
              <GlassCard sx={{ p: 5, textAlign: "center" }}>
                <WarningAmberIcon
                  sx={{
                    fontSize: 60,
                    color: alpha(theme.palette.text.secondary, 0.5),
                    mb: 2,
                  }}
                />
                <Typography variant="h6" gutterBottom>
                  No Expired Products Found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  No products match your search or filter criteria, or there are
                  no expired products in your inventory.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                >
                  Refresh
                </Button>
              </GlassCard>
            ) : (
              <div>
                <TableContainer
                  sx={{
                    mb: 2,
                    "& .MuiTab-root": {
                      minWidth: 120,
                      fontWeight: 500,
                      borderRadius: "8px 8px 0 0",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    },
                    "& .Mui-selected": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    },
                    "& .MuiTabs-indicator": {
                      height: 3,
                      borderRadius: 1.5,
                    },
                  }}
                >
                  <Table sx={{ minWidth: 650 }}>
                    <StyledTableHead>
                      <TableRow>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => handleSort("code")}
                          >
                            Code
                            {sortBy === "code" && (
                              <SortIcon
                                fontSize="small"
                                sx={{
                                  ml: 0.5,
                                  transform:
                                    sortOrder === "desc"
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => handleSort("name")}
                          >
                            Name
                            {sortBy === "name" && (
                              <SortIcon
                                fontSize="small"
                                sx={{
                                  ml: 0.5,
                                  transform:
                                    sortOrder === "desc"
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        {!isMobile && (
                          <>
                            <TableCell>Category</TableCell>
                            <TableCell>Brand</TableCell>
                          </>
                        )}
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => handleSort("expiryDate")}
                          >
                            Expiry Date
                            {sortBy === "expiryDate" && (
                              <SortIcon
                                fontSize="small"
                                sx={{
                                  ml: 0.5,
                                  transform:
                                    sortOrder === "desc"
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              cursor: "pointer",
                            }}
                            onClick={() => handleSort("quantity")}
                          >
                            Quantity
                            {sortBy === "quantity" && (
                              <SortIcon
                                fontSize="small"
                                sx={{
                                  ml: 0.5,
                                  transform:
                                    sortOrder === "desc"
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => handleSort("daysExpired")}
                          >
                            Status
                            {sortBy === "daysExpired" && (
                              <SortIcon
                                fontSize="small"
                                sx={{
                                  ml: 0.5,
                                  transform:
                                    sortOrder === "desc"
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {filteredProducts
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((product) => (
                          <StyledTableRow
                            key={product.id}
                            className={product.status}
                          >
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Avatar
                                  src={product.image}
                                  alt={product.name}
                                  variant="rounded"
                                  sx={{ width: 32, height: 32, mr: 1 }}
                                />
                                {product.code}
                              </Box>
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            {!isMobile && (
                              <>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.brand}</TableCell>
                              </>
                            )}
                            <TableCell>{product.expiryDate}</TableCell>
                            <TableCell align="right">
                              <Chip
                                label={product.quantity}
                                size="small"
                                sx={{
                                  fontWeight: "bold",
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {getStatusChip(
                                product.status,
                                product.daysExpired
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="View Details">
                                <IconButton
                                  color="primary"
                                  onClick={() => handleOpenDialog(product)}
                                  sx={{
                                    bgcolor: alpha(
                                      theme.palette.primary.main,
                                      0.1
                                    ),
                                    "&:hover": {
                                      bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.2
                                      ),
                                    },
                                    transition: "all 0.2s",
                                  }}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  sx={{
                                    ml: 1,
                                    bgcolor: alpha(
                                      theme.palette.error.main,
                                      0.1
                                    ),
                                    "&:hover": {
                                      bgcolor: alpha(
                                        theme.palette.error.main,
                                        0.2
                                      ),
                                    },
                                    transition: "all 0.2s",
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredProducts.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Rows per page"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} / ${count}`
                  }
                />
              </div>
            )}
          </div>

          {/* Product Detail Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
            TransitionComponent={Zoom}
            PaperProps={{
              sx: {
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: `0 8px 32px ${alpha(
                  theme.palette.text.primary,
                  0.2
                )}`,
              },
            }}
          >
            <StyledDialogTitle>
              <Typography
                variant="h6"
                component="div"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <WarningAmberIcon sx={{ mr: 1 }} />
                Expired Product Details
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </StyledDialogTitle>
            <DialogContent dividers>
              {selectedProduct && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                        border: `1px solid ${alpha(
                          theme.palette.divider,
                          0.1
                        )}`,
                      }}
                    >
                      <Avatar
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        variant="rounded"
                        sx={{
                          width: 120,
                          height: 120,
                          mb: 2,
                          boxShadow: `0 8px 24px ${alpha(
                            theme.palette.text.primary,
                            0.15
                          )}`,
                        }}
                      />
                      <Typography variant="h6" gutterBottom align="center">
                        {selectedProduct.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        gutterBottom
                      >
                        {selectedProduct.code}
                      </Typography>
                      <Box sx={{ mt: 2, width: "100%" }}>
                        {getStatusChip(
                          selectedProduct.status,
                          selectedProduct.daysExpired
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Category
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          sx={{ fontWeight: 500 }}
                        >
                          {selectedProduct.category}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Brand
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          sx={{ fontWeight: 500 }}
                        >
                          {selectedProduct.brand}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Expiry Date
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          sx={{
                            fontWeight: 500,
                            color: theme.palette.error.main,
                          }}
                        >
                          {selectedProduct.expiryDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Quantity
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          sx={{ fontWeight: 500 }}
                        >
                          {selectedProduct.quantity} units
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          sx={{ fontWeight: 500 }}
                        >
                          {selectedProduct.location}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Batch Number
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          sx={{ fontWeight: 500 }}
                        >
                          {selectedProduct.batchNumber}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Purchase Date
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          sx={{ fontWeight: 500 }}
                        >
                          {selectedProduct.purchaseDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Supplier
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          sx={{ fontWeight: 500 }}
                        >
                          {selectedProduct.supplier}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                          Disposal Method
                        </Typography>
                        <Typography
                          variant="body1"
                          gutterBottom
                          sx={{ fontWeight: 500 }}
                        >
                          {selectedProduct.disposalMethod}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Alert
                          severity="error"
                          variant="outlined"
                          sx={{
                            mt: 2,
                            borderRadius: 2,
                            borderWidth: 1.5,
                          }}
                        >
                          <AlertTitle>Warning</AlertTitle>
                          This product has expired. It should be disposed of
                          immediately. Using expired products is not safe.
                        </Alert>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={handleCloseDialog} variant="outlined">
                Close
              </Button>
              <GradientButton
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  handleDeleteProduct(selectedProduct.id);
                  handleCloseDialog();
                }}
              >
                Dispose
              </GradientButton>
            </DialogActions>
          </Dialog>

          {/* Disposal Confirmation Dialog */}
          <Dialog
            open={disposalDialogOpen}
            onClose={handleCloseDisposalDialog}
            maxWidth="sm"
            fullWidth
            TransitionComponent={Zoom}
            PaperProps={{
              sx: {
                borderRadius: 3,
                overflow: "hidden",
              },
            }}
          >
            <DialogTitle
              sx={{
                bgcolor: theme.palette.error.main,
                color: theme.palette.common.white,
                display: "flex",
                alignItems: "center",
              }}
            >
              <WarningAmberIcon sx={{ mr: 1 }} />
              Dispose All Expired Products
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              {disposalSuccess ? (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <CheckCircleOutlineIcon
                    color="success"
                    sx={{ fontSize: 60, mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Successfully Disposed!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All expired products have been successfully disposed.
                  </Typography>
                </Box>
              ) : (
                <>
                  <Typography variant="body1" gutterBottom>
                    Are you sure you want to dispose of all expired products?
                  </Typography>
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ mt: 1, fontWeight: 500 }}
                  >
                    Warning: This action is irreversible. Once disposed, these
                    products cannot be recovered.
                  </Typography>

                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      bgcolor: alpha(theme.palette.warning.light, 0.1),
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      To be disposed:
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        • {totalExpired} expired products
                      </Typography>
                      <Typography variant="body2">
                        • {totalExpiringSoon} soon-to-expire products
                      </Typography>
                      <Typography variant="body2">
                        • Total of {totalQuantity} units
                      </Typography>
                    </Stack>
                  </Box>
                </>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                onClick={handleCloseDisposalDialog}
                disabled={disposalLoading}
              >
                {disposalSuccess ? "Close" : "Cancel"}
              </Button>
              {!disposalSuccess && (
                <GradientButton
                  variant="contained"
                  color="error"
                  startIcon={
                    disposalLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <DeleteIcon />
                    )
                  }
                  onClick={handleDisposeAll}
                  disabled={disposalLoading}
                >
                  {disposalLoading ? "Processing..." : "Confirm Disposal"}
                </GradientButton>
              )}
            </DialogActions>
          </Dialog>

          {/* Filter Menu */}
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={handleFilterMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: 2,
                boxShadow: `0 8px 32px ${alpha(
                  theme.palette.text.primary,
                  0.1
                )}`,
                width: 280,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Brand Filter
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {uniqueBrands.map((brand) => (
                  <Chip
                    key={brand}
                    label={brand}
                    size="small"
                    onClick={() => handleBrandFilter(brand)}
                    color={
                      selectedBrands.includes(brand) ? "primary" : "default"
                    }
                    variant={
                      selectedBrands.includes(brand) ? "filled" : "outlined"
                    }
                  />
                ))}
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Category Filter
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {uniqueCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    size="small"
                    onClick={() => handleCategoryFilter(category)}
                    color={
                      selectedCategories.includes(category)
                        ? "primary"
                        : "default"
                    }
                    variant={
                      selectedCategories.includes(category)
                        ? "filled"
                        : "outlined"
                    }
                  />
                ))}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button size="small" onClick={handleClearFilters}>
                  Reset Filters
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleFilterMenuClose}
                  sx={{ ml: 1 }}
                >
                  OK
                </Button>
              </Box>
            </Box>
          </Menu>

          {/* More Options Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: 2,
                boxShadow: `0 8px 32px ${alpha(
                  theme.palette.text.primary,
                  0.1
                )}`,
              },
            }}
          >
            <MenuItem
              onClick={handleMenuClose}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <PrintIcon fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2">Print</Typography>
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <FileDownloadIcon fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2">Export (CSV)</Typography>
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <ArchiveIcon fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2">Archive</Typography>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleDeleteAll}
              sx={{
                display: "flex",
                alignItems: "center",
                color: theme.palette.error.main,
              }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2">Delete All</Typography>
            </MenuItem>
          </Menu>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: "100%", borderRadius: 2 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </div>
      </Fade>
    </div>
  );
}
