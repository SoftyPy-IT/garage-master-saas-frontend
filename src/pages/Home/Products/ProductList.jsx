/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Divider,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Tabs,
  Tab,
  alpha,
  Stack,
  Pagination,
  Skeleton,
  Backdrop,
  ListItemIcon,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  CloudDownload as CloudDownloadIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  ShoppingBag,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Block as BlockIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  QrCode as QrCodeIcon,
  Storefront as StorefrontIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeleteProductMutation,
  useGetAllIProductQuery,
} from "../../../redux/api/productApi";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import Loading from "../../../components/Loading/Loading";

// Status component with appropriate colors
const StatusChip = ({ status }) => {
  let color, icon, label;

  switch (status) {
    case "active":
      color = "#2e7d32";
      icon = <CheckCircleIcon fontSize="small" />;
      label = "Active";
      break;
    case "low_stock":
      color = "#ed6c02";
      icon = <WarningIcon fontSize="small" />;
      label = "Low Stock";
      break;
    case "out_of_stock":
      color = "#d32f2f";
      icon = <ErrorIcon fontSize="small" />;
      label = "Out of Stock";
      break;
    case "discontinued":
      color = "#616161";
      icon = <BlockIcon fontSize="small" />;
      label = "Discontinued";
      break;
    default:
      color = "#2e7d32";
      icon = <CheckCircleIcon fontSize="small" />;
      label = "Active";
  }

  return (
    <Chip
      icon={icon}
      label={label}
      size="small"
      sx={{
        bgcolor: alpha(color, 0.1),
        color: color,
        fontWeight: 500,
        "& .MuiChip-icon": {
          color: color,
        },
      }}
    />
  );
};

// Product card component for grid view
const ProductCard = ({ product, onEdit, onDelete, onFavorite, isFavorite }) => {
  const [elevation, setElevation] = useState(1);

  return (
    <Card
      elevation={elevation}
      onMouseEnter={() => setElevation(3)}
      onMouseLeave={() => setElevation(1)}
      sx={{
        borderRadius: 2,
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "visible",
        "&:hover": {
          transform: "translateY(-5px)",
        },
      }}
    >
      {/* Favorite button */}
      <IconButton
        size="small"
        onClick={() => onFavorite(product.id)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          bgcolor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          "&:hover": {
            bgcolor: "white",
          },
        }}
      >
        {isFavorite ? (
          <BookmarkIcon fontSize="small" sx={{ color: "#6a1b9a" }} />
        ) : (
          <BookmarkBorderIcon
            fontSize="small"
            sx={{ color: "text.secondary" }}
          />
        )}
      </IconButton>

      {/* Product image */}
      <Box
        sx={{
          height: 140,
          bgcolor: alpha("#6a1b9a", 0.05),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {product.image ? (
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.product_name}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
              padding: "8px",
            }}
          />
        ) : (
          <ShoppingBag sx={{ fontSize: 60, color: alpha("#6a1b9a", 0.2) }} />
        )}

        {/* QR Code overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            bgcolor: "white",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <QrCodeIcon fontSize="small" sx={{ color: "#6a1b9a" }} />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Box
          sx={{
            mb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            noWrap
            title={product.product_name}
          >
            {product.product_name}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Chip
            label={product.category || "Uncategorized"}
            size="small"
            sx={{
              bgcolor: alpha("#6a1b9a", 0.1),
              color: "#6a1b9a",
              fontWeight: 500,
              fontSize: "0.7rem",
              height: 20,
            }}
          />
          {product.brand && (
            <Chip
              label={product.brand}
              size="small"
              sx={{
                ml: 0.5,
                bgcolor: alpha("#6a1b9a", 0.05),
                color: "text.secondary",
                fontWeight: 500,
                fontSize: "0.7rem",
                height: 20,
              }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Code:{" "}
            <Typography component="span" variant="body2" fontWeight={500}>
              {product.product_code}
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unit:{" "}
            <Typography component="span" variant="body2" fontWeight={500}>
              {product.unit}
            </Typography>
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6" color="#6a1b9a" fontWeight={600}>
            ৳ {product?.purchasePrice}
          </Typography>
          <StatusChip status={product.status || "active"} />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Added: {product.date}
          </Typography>
          <Box>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(product.id)}
                sx={{
                  bgcolor: alpha("#6a1b9a", 0.1),
                  color: "#6a1b9a",
                  mr: 1,
                  "&:hover": {
                    bgcolor: alpha("#6a1b9a", 0.2),
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete(product.id)}
                sx={{
                  bgcolor: alpha("#d32f2f", 0.1),
                  color: "#d32f2f",
                  "&:hover": {
                    bgcolor: alpha("#d32f2f", 0.2),
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};


const ProductListItem = ({
  product,
  onEdit,
  onDelete,
  onFavorite,
  isFavorite,
}) => {
  const [elevation, setElevation] = useState(1);

  return (
    <Card
      elevation={elevation}
      onMouseEnter={() => setElevation(3)}
      onMouseLeave={() => setElevation(1)}
      sx={{
        borderRadius: 2,
        transition: "all 0.3s ease",
        mb: 2,
        "&:hover": {
          transform: "translateX(5px)",
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Grid container alignItems="center" spacing={2}>
          {/* Product image/icon */}
          <Grid item xs={12} sm={1}>
            <Box
              sx={{
                width: 50,
                height: 50,
                bgcolor: alpha("#6a1b9a", 0.05),
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {product.image ? (
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.product_name}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    padding: "4px",
                  }}
                />
              ) : (
                <ShoppingBag
                  sx={{ fontSize: 24, color: alpha("#6a1b9a", 0.5) }}
                />
              )}
            </Box>
          </Grid>

          {/* Product name and code */}
          <Grid item xs={12} sm={3}>
            <div className="flex justify-center">
              <IconButton
                size="small"
                onClick={() => onFavorite(product.id)}
                sx={{ mr: 1, p: 0.5 }}
              >
                {isFavorite ? (
                  <BookmarkIcon fontSize="small" sx={{ color: "#6a1b9a" }} />
                ) : (
                  <BookmarkBorderIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                )}
              </IconButton>
              <div>
                <Typography variant="subtitle2" fontWeight={600}>
                  {product.product_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Code: {product.product_code}
                </Typography>
              </div>
            </div>
          </Grid>

          {/* Category and brand */}
          <Grid item xs={6} sm={2}>
            <div>
              <Typography variant="body2" color="text.secondary">
                Category
              </Typography>
              <Chip
                label={product.category || "Uncategorized"}
                size="small"
                sx={{
                  bgcolor: alpha("#6a1b9a", 0.1),
                  color: "#6a1b9a",
                  fontWeight: 500,
                  fontSize: "0.7rem",
                  height: 20,
                }}
              />
            </div>
          </Grid>

          <Grid item xs={6} sm={1}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Brand
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {product.brand || "—"}
              </Typography>
            </Box>
          </Grid>

          {/* Price and unit */}
          <Grid item xs={6} sm={1}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Price
              </Typography>
              <Typography variant="body2" fontWeight={600} color="#6a1b9a">
                {product.product_price}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={1}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Unit
              </Typography>
              <Typography variant="body2">{product.unit}</Typography>
            </Box>
          </Grid>

          {/* Status */}
          <Grid item xs={6} sm={1}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <StatusChip status={product.status || "active"} />
            </Box>
          </Grid>

          {/* Date */}
          <Grid item xs={6} sm={1}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Added
              </Typography>
              <Typography variant="body2">{product.date}</Typography>
            </Box>
          </Grid>

          {/* Actions */}
          <Grid item xs={12} sm={1}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => onEdit(product.id)}
                  sx={{
                    bgcolor: alpha("#6a1b9a", 0.1),
                    color: "#6a1b9a",
                    mr: 1,
                    "&:hover": {
                      bgcolor: alpha("#6a1b9a", 0.2),
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={() => onDelete(product.id)}
                  sx={{
                    bgcolor: alpha("#d32f2f", 0.1),
                    color: "#d32f2f",
                    "&:hover": {
                      bgcolor: alpha("#d32f2f", 0.2),
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  // const search = new URLSearchParams(location.search).get("search");
  const [filterType, setFilterType] = useState("");
  // Query parameters
  const tenantDomain = useTenantDomain();

  const queryParams = {
    tenantDomain,
    limit: 10,
    page: currentPage,
    searchTerm: filterType,
  };

  const { data, isLoading } = useGetAllIProductQuery(queryParams);
  const [deleteProduct] = useDeleteProductMutation();

  // Mock categories for filter
  const categories = [
    "Lubricants",
    "Brakes",
    "Filters",
    "Ignition",
    "Exterior",
    "Interior",
    "Electrical",
    "Engine",
    "Transmission",
  ];

  const statuses = ["active", "low_stock", "out_of_stock", "discontinued"];

  // Handle filter menu
  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  // Handle sort menu
  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    handleSortMenuClose();
  };

  // Handle filter change
  const handleCategoryFilterChange = (category) => {
    setFilterCategory(category);
    handleFilterMenuClose();
  };

  const handleStatusFilterChange = (status) => {
    setFilterStatus(status);
    handleFilterMenuClose();
  };

  // Handle search
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle pagination
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (productId) => {
    if (favoriteProducts.includes(productId)) {
      setFavoriteProducts(favoriteProducts.filter((id) => id !== productId));
    } else {
      setFavoriteProducts([...favoriteProducts, productId]);
    }
  };

  // Handle delete
  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct({ tenantDomain, id: productToDelete }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The product has been deleted successfully.",
        showConfirmButton: false,
        timer: 2000,
        background: "#fff",
        customClass: {
          title: "text-purple-800 font-medium",
          content: "text-gray-600",
        },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred while deleting the product.",
        confirmButtonColor: "#6a1b9a",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Prepare data for rendering
  const products = data?.data?.products || [];
  const { meta } = data?.data || { meta: {} };
  const { totalPage = 10 } = meta || {};

  // Add status and image to products (mock data for demonstration)
  const enhancedProducts = products.map((product, index) => {
    // Mock statuses based on index for demonstration
    const statuses = ["active", "low_stock", "out_of_stock", "discontinued"];
    const status = statuses[index % statuses.length];

    return {
      ...product,
      id: product._id,
      date: new Date(product.createdAt).toLocaleDateString(),
      product_name: product.product_name,
      brand: product?.brand?.brand || "Generic",
      category: product?.category?.main_category || "Uncategorized",
      discount: product.discount,
      expense: product.expense,
      product_code: product.product_code,
      unit: product?.unit?.unit || "Piece",
      product_price: `$${product.product_price}`,
      status,
    };
  });

  const filteredProducts = enhancedProducts.filter((product) => {
    if (activeTab === 1) {
      return favoriteProducts.includes(product.id);
    }
    return true;
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: { md: "linear-gradient(to bottom, #f9f9f9, #f0f0f0)" },
        pt: 2,
        pb: 8,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #6a1b9a 0%, #42A1DA 100%)",
          color: "white",
          py: 3,
          mb: 4,
          borderRadius: { xs: "0 0 20px 20px", md: "0 0 20px 20px" },
          boxShadow: "0 4px 20px rgba(106, 27, 154, 0.4)",
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <InventoryIcon sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Product Inventory
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 700 }}>
            Manage your product inventory, track stock levels, and update
            product information.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ p: { xs: 0 } }}>
        {/* Tabs and Actions */}
        <div className="mb-3">
          <div className=" md:hidden flex justify-end mb-4 md:mb-0">
            <Button
              component={Link}
              to="/dashboard/add-product"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 100,
                background: "linear-gradient(135deg, #6a1b9a 0%, #42A1DA 100%)",
                boxShadow: "0 4px 10px rgba(106, 27, 154, 0.3)",
                px: 3,
                color: "white",
              }}
            >
              Add Product
            </Button>
          </div>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <div className="border-b-2 ">
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  sx={{
                    "& .MuiTab-root": {
                      minHeight: 48,
                      borderRadius: "8px 8px 0 0",
                      transition: "all 0.3s",
                      "&.Mui-selected": {
                        color: "#6a1b9a",
                        fontWeight: 600,
                      },
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#6a1b9a",
                      height: 3,
                      borderRadius: "3px 3px 0 0",
                    },
                  }}
                >
                  <Tab
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <InventoryIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography>All Products</Typography>
                        <Chip
                          label={products.length}
                          size="small"
                          sx={{
                            ml: 1,
                            bgcolor: alpha("#6a1b9a", 0.1),
                            color: "#6a1b9a",
                            fontWeight: 600,
                            height: 20,
                          }}
                        />
                      </Box>
                    }
                  />
                  <Tab
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <BookmarkIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography>Favorites</Typography>
                        <Chip
                          label={favoriteProducts.length}
                          size="small"
                          sx={{
                            ml: 1,
                            bgcolor: alpha("#6a1b9a", 0.1),
                            color: "#6a1b9a",
                            fontWeight: 600,
                            height: 20,
                          }}
                        />
                      </Box>
                    }
                  />
                </Tabs>
              </div>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack
                direction="row"
                spacing={1}
                justifyContent={{ xs: "flex-start", md: "flex-end" }}
              >
                <div className="hidden md:block">
                  <Button
                    component={Link}
                    to="/dashboard/add-product"
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: 100,
                      background:
                        "linear-gradient(135deg, #6a1b9a 0%, #42A1DA 100%)",
                      boxShadow: "0 4px 10px rgba(106, 27, 154, 0.3)",
                      px: 3,
                      color: "white",
                    }}
                  >
                    Add Product
                  </Button>
                </div>
              </Stack>
            </Grid>
          </Grid>
        </div>

        {/* Search and Filters */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1, md: 2 },
            mb: 3,
            borderRadius: 3,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search products by name, code, or category..."
                // value={search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 100, pr: 1 },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(0, 0, 0, 0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(106, 27, 154, 0.3)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#6a1b9a",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack
                direction="row"
                spacing={1}
                justifyContent={{ xs: "flex-start", md: "flex-end" }}
              >
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={handleFilterMenuOpen}
                  sx={{
                    borderRadius: 100,
                    borderColor: "rgba(0,0,0,0.12)",
                    color:
                      filterCategory || filterStatus
                        ? "#6a1b9a"
                        : "text.secondary",
                    bgcolor:
                      filterCategory || filterStatus
                        ? alpha("#6a1b9a", 0.05)
                        : "transparent",
                    "&:hover": {
                      bgcolor: alpha("#6a1b9a", 0.1),
                      borderColor: "#6a1b9a",
                    },
                  }}
                >
                  {filterCategory || filterStatus
                    ? "Filters Applied"
                    : "Filter"}
                </Button>
                <Menu
                  anchorEl={filterAnchorEl}
                  open={Boolean(filterAnchorEl)}
                  onClose={handleFilterMenuClose}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      width: 250,
                    },
                  }}
                >
                  <MenuItem sx={{ opacity: 0.7 }} disabled>
                    <Typography variant="subtitle2">
                      Filter by Category
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleCategoryFilterChange("")}
                    sx={{
                      bgcolor:
                        filterCategory === ""
                          ? alpha("#6a1b9a", 0.05)
                          : "transparent",
                    }}
                  >
                    <ListItemIcon>
                      {filterCategory === "" && (
                        <CheckCircleIcon
                          fontSize="small"
                          sx={{ color: "#6a1b9a" }}
                        />
                      )}
                    </ListItemIcon>
                    All Categories
                  </MenuItem>
                  <Divider />
                  {categories.map((category) => (
                    <MenuItem
                      key={category}
                      onClick={() => handleCategoryFilterChange(category)}
                      sx={{
                        bgcolor:
                          filterCategory === category
                            ? alpha("#6a1b9a", 0.05)
                            : "transparent",
                      }}
                    >
                      <ListItemIcon>
                        {filterCategory === category && (
                          <CheckCircleIcon
                            fontSize="small"
                            sx={{ color: "#6a1b9a" }}
                          />
                        )}
                      </ListItemIcon>
                      {category}
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem sx={{ opacity: 0.7 }} disabled>
                    <Typography variant="subtitle2">
                      Filter by Status
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleStatusFilterChange("")}
                    sx={{
                      bgcolor:
                        filterStatus === ""
                          ? alpha("#6a1b9a", 0.05)
                          : "transparent",
                    }}
                  >
                    <ListItemIcon>
                      {filterStatus === "" && (
                        <CheckCircleIcon
                          fontSize="small"
                          sx={{ color: "#6a1b9a" }}
                        />
                      )}
                    </ListItemIcon>
                    All Statuses
                  </MenuItem>
                  {statuses.map((status) => (
                    <MenuItem
                      key={status}
                      onClick={() => handleStatusFilterChange(status)}
                      sx={{
                        bgcolor:
                          filterStatus === status
                            ? alpha("#6a1b9a", 0.05)
                            : "transparent",
                      }}
                    >
                      <ListItemIcon>
                        {filterStatus === status && (
                          <CheckCircleIcon
                            fontSize="small"
                            sx={{ color: "#6a1b9a" }}
                          />
                        )}
                      </ListItemIcon>
                      {status.replace("_", " ").charAt(0).toUpperCase() +
                        status.replace("_", " ").slice(1)}
                    </MenuItem>
                  ))}
                </Menu>

                <Button
                  variant="outlined"
                  startIcon={<SortIcon />}
                  onClick={handleSortMenuOpen}
                  sx={{
                    borderRadius: 100,
                    borderColor: "rgba(0,0,0,0.12)",
                    color: "text.secondary",
                    "&:hover": {
                      bgcolor: alpha("#6a1b9a", 0.1),
                      borderColor: "#6a1b9a",
                    },
                  }}
                >
                  Sort
                </Button>
                <Menu
                  anchorEl={sortAnchorEl}
                  open={Boolean(sortAnchorEl)}
                  onClose={handleSortMenuClose}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      width: 200,
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => handleSortChange("product_name")}
                    sx={{
                      bgcolor:
                        sortField === "product_name"
                          ? alpha("#6a1b9a", 0.05)
                          : "transparent",
                    }}
                  >
                    <ListItemIcon>
                      {sortField === "product_name" &&
                        (sortDirection === "asc" ? (
                          <ArrowUpwardIcon
                            fontSize="small"
                            sx={{ color: "#6a1b9a" }}
                          />
                        ) : (
                          <ArrowDownwardIcon
                            fontSize="small"
                            sx={{ color: "#6a1b9a" }}
                          />
                        ))}
                    </ListItemIcon>
                    Name
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSortChange("product_price")}
                    sx={{
                      bgcolor:
                        sortField === "product_price"
                          ? alpha("#6a1b9a", 0.05)
                          : "transparent",
                    }}
                  >
                    <ListItemIcon>
                      {sortField === "product_price" &&
                        (sortDirection === "asc" ? (
                          <ArrowUpwardIcon
                            fontSize="small"
                            sx={{ color: "#6a1b9a" }}
                          />
                        ) : (
                          <ArrowDownwardIcon
                            fontSize="small"
                            sx={{ color: "#6a1b9a" }}
                          />
                        ))}
                    </ListItemIcon>
                    Price
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSortChange("date")}
                    sx={{
                      bgcolor:
                        sortField === "date"
                          ? alpha("#6a1b9a", 0.05)
                          : "transparent",
                    }}
                  >
                    <ListItemIcon>
                      {sortField === "date" &&
                        (sortDirection === "asc" ? (
                          <ArrowUpwardIcon
                            fontSize="small"
                            sx={{ color: "#6a1b9a" }}
                          />
                        ) : (
                          <ArrowDownwardIcon
                            fontSize="small"
                            sx={{ color: "#6a1b9a" }}
                          />
                        ))}
                    </ListItemIcon>
                    Date Added
                  </MenuItem>
                </Menu>

                <Tooltip title="Refresh">
                  <IconButton
                    sx={{
                      bgcolor: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      "&:hover": {
                        bgcolor: "white",
                      },
                    }}
                  >
                    {isRefreshing ? (
                      <CircularProgress size={20} sx={{ color: "#6a1b9a" }} />
                    ) : (
                      <RefreshIcon />
                    )}
                  </IconButton>
                </Tooltip>

                <Tooltip
                  title={viewMode === "grid" ? "List View" : "Grid View"}
                >
                  <IconButton
                    onClick={() =>
                      handleViewModeChange(
                        viewMode === "grid" ? "list" : "grid"
                      )
                    }
                    sx={{
                      bgcolor: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      "&:hover": {
                        bgcolor: "white",
                      },
                    }}
                  >
                    {viewMode === "grid" ? (
                      <ViewListIcon />
                    ) : (
                      <ViewModuleIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Product List */}
        <Box sx={{ mb: 4 }}>
          {isLoading ? (
            <>
              <Loading />
            </>
          ) : filteredProducts.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 3,
                textAlign: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  bgcolor: alpha("#6a1b9a", 0.05),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <InventoryIcon
                  sx={{ fontSize: 40, color: alpha("#6a1b9a", 0.5) }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                No Products Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {activeTab === 1
                  ? "You haven't added any products to your favorites yet."
                  : "No products match your current filters. Try adjusting your search or filters."}
              </Typography>
              {activeTab === 0 && (
                <Button
                  component={Link}
                  to="/dashboard/add-product"
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: 100,
                    background:
                      "linear-gradient(135deg, #6a1b9a 0%, #42A1DA 100%)",
                    boxShadow: "0 4px 10px rgba(106, 27, 154, 0.3)",
                    px: 3,
                  }}
                >
                  Add New Product
                </Button>
              )}
            </Paper>
          ) : viewMode === "grid" ? (
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard
                    product={product}
                    onEdit={(id) =>
                      navigate(`/dashboard/update-product/?id=${id}`)
                    }
                    onDelete={handleDeleteClick}
                    onFavorite={handleFavoriteToggle}
                    isFavorite={favoriteProducts.includes(product.id)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box>
              {filteredProducts.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  onEdit={(id) =>
                    navigate(`/dashboard/update-product/?id=${id}`)
                  }
                  onDelete={handleDeleteClick}
                  onFavorite={handleFavoriteToggle}
                  isFavorite={favoriteProducts.includes(product.id)}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPage}
              page={currentPage}
              onChange={handlePageChange}
              color="secondary"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: "#6a1b9a",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#42A1DA",
                    },
                  },
                },
              }}
            />
          </Box>
        )}

        {/* Stats Card */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mt: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <StorefrontIcon sx={{ color: "#2e7d32", mt: 0.5 }} />
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ color: "#2e7d32", fontWeight: 600 }}
            >
              Inventory Status
            </Typography>
            <Typography variant="body2" sx={{ color: "#1b5e20" }}>
              Your inventory contains {products.length} products. Keep your
              inventory up to date to ensure accurate stock levels and pricing
              in quotations and invoices.
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Confirm Deletion
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{
              borderRadius: 100,
              px: 3,
              color: "text.secondary",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 100,
              px: 3,
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isExporting || isPrinting}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "white",
            p: 4,
            borderRadius: 4,
            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
          }}
        >
          <CircularProgress color="secondary" sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.primary">
            {isExporting ? "Exporting Products..." : "Preparing Print..."}
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
}
