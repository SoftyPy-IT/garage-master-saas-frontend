/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
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
  CircularProgress,
  Menu,
  MenuItem,
  Collapse,
  Alert,
  AlertTitle,
  Snackbar,
  useMediaQuery,
  Stack,
} from "@mui/material";
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
} from "../../../redux/api/productApi";
import {
  AnimatedChip,
  GlassCard,
  GradientBreadcrumbs,
  GradientButton,
  StyledDialogTitle,
} from "../../../utils/customStyle";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import Table from "../../../components/Table";

export default function ExpiredProduct() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [alertOpen, setAlertOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [disposalDialogOpen, setDisposalDialogOpen] = useState(false);
  const [disposalLoading, setDisposalLoading] = useState(false);
  const [disposalSuccess, setDisposalSuccess] = useState(false);
  const { tenantDomain } = useTenantDomain();

  const queryParams = {
    tenantDomain,
    page: currentPage,
    searchTerm: search,
    limit: 100,
  };
  const {
    data: productData,
    isLoading,
    refetch,
  } = useGetAllIProductQuery(queryParams);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const processedProducts = useMemo(() => {
    if (!productData?.data?.products) return [];

    const today = new Date();
    const alertDays = 30;

    return productData.data.products
      .map((product) => {
        if (!product.expiryDate) return null;

        const expiryDate = new Date(product.expiryDate);
        const timeDiff = expiryDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        let status = "active";
        let daysExpired = 0;

        if (daysDiff < 0) {
          status = "expired";
          daysExpired = Math.abs(daysDiff);
        } else if (daysDiff <= (product.expiryAlertDays || alertDays)) {
          status = "expiring-soon";
          daysExpired = daysDiff;
        } else {
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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredProducts = processedProducts.filter((product) => {
    // Search filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.brand &&
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()));

    // Brand filter
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);

    // Category filter
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    return matchesSearch && matchesBrand && matchesCategory;
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

  // Define columns for the reusable Table component
  const tableColumns = [
    {
      key: "code",
      label: "Code",
      render: (item) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={item.image}
            alt={item.name}
            variant="rounded"
            sx={{ width: 32, height: 32, mr: 1 }}
          />
          {item.code}
        </Box>
      ),
    },
    {
      key: "name",
      label: "Name",
    },
    ...(!isMobile
      ? [
          {
            key: "category",
            label: "Category",
          },
          {
            key: "brand",
            label: "Brand",
          },
        ]
      : []),
    {
      key: "expiryDate",
      label: "Expiry Date",
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (item) => (
        <Chip
          label={item.quantity}
          size="small"
          sx={{
            fontWeight: "bold",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          }}
        />
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => getStatusChip(item.status, item.daysExpired),
    },
  ];

  // Define actions for the reusable Table component
  const tableActions = [
    {
      key: "view",
      icon: VisibilityIcon,
      tooltip: "View Details",
      color: theme.palette.primary.main,
      onClick: (item) => handleOpenDialog(item),
    },
    {
      key: "delete",
      icon: DeleteIcon,
      tooltip: "Delete",
      color: theme.palette.error.main,
      onClick: (item) => handleDeleteProduct(item.id),
    },
  ];

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

          <Table
            title="Expired Products"
            columns={tableColumns}
            data={filteredProducts}
            actions={tableActions}
            loading={isLoading}
            currentPage={currentPage}
            totalPages={Math.ceil(filteredProducts.length / 10)}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            searchPlaceholder="Search expired products..."
            emptyMessage="No expired products found"
            getRowClass={(item) => item.status}
          />
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
        </div>
      </Fade>
    </div>
  );
}
