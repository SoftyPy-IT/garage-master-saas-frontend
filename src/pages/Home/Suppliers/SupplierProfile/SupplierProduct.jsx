/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Visibility,
  Edit, // Added for edit action
  Delete, // Added delete icon
  Search,
  FilterList,
  Sort,
  AddCircle,
  Category,
  Inventory,
  CalendarToday,
  Star,
} from "@mui/icons-material";

import {
  StyledChip,
  StyledIconButton,
  StyledTableContainer,
} from "../../../../utils/customStyle";
import ProductForm from "../../Products/ProductForm";
import { useDeleteProductMutation } from "../../../../redux/api/productApi";
import { useTenantDomain } from "../../../../hooks/useTenantDomain";
import Swal from "sweetalert2";

const SupplierProduct = ({ productData }) => {
  const theme = useTheme();
  const navigate = useNavigate(); // Added navigation hook
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [deleteProduct] = useDeleteProductMutation();
  const tenantDomain = useTenantDomain();

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct({ tenantDomain, id }).unwrap();
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
    } 
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleProductAction = (action, product) => {
    if (action === "edit") {
      // Navigate to update-product page with product ID
      navigate(`/dashboard/update-product/?id=${product._id}`);
    } else if (action === "view") {
      // Log product details to console
      console.log("Product Details:", product);
      setSelectedProduct(product);
      setDialogAction(action);
      setOpenDialog(true);
    } else if (action === "delete") {
      // Show confirmation dialog before deleting
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          handleDelete(product._id); 
        }
      });
    } else {
      // For "add" action
      setSelectedProduct(product);
      setDialogAction(action);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const getStockStatus = (stock, alertLevel) => {
    if (stock === 0) return "out-of-stock";
    if (stock <= alertLevel) return "low-stock";
    return "in-stock";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const filteredProducts = productData?.filter(
    (product) =>
      product?.product_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      product?.product_code?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          Supplier Product Catalog
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircle />}
          onClick={() => handleProductAction("add")}
          sx={{
            borderRadius: 20,
            px: 3,
            py: 1,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
            boxShadow: `0 3px 5px 2px ${alpha(
              theme.palette.primary.main,
              0.3
            )}`,
          }}
        >
          Add New Product
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        <Box>
          <Tooltip title="Filter products">
            <StyledIconButton onClick={handleFilterClick}>
              <FilterList />
            </StyledIconButton>
          </Tooltip>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={handleFilterClose}>All Products</MenuItem>
            <MenuItem onClick={handleFilterClose}>In Stock</MenuItem>
            <MenuItem onClick={handleFilterClose}>Low Stock</MenuItem>
            <MenuItem onClick={handleFilterClose}>Out of Stock</MenuItem>
          </Menu>
          <Tooltip title="Sort products">
            <StyledIconButton onClick={handleSortClick}>
              <Sort />
            </StyledIconButton>
          </Tooltip>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={handleSortClose}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={handleSortClose}>Name (A-Z)</MenuItem>
            <MenuItem onClick={handleSortClose}>Name (Z-A)</MenuItem>
            <MenuItem onClick={handleSortClose}>Price (Low to High)</MenuItem>
            <MenuItem onClick={handleSortClose}>Price (High to Low)</MenuItem>
            <MenuItem onClick={handleSortClose}>Stock (Low to High)</MenuItem>
            <MenuItem onClick={handleSortClose}>Stock (High to Low)</MenuItem>
          </Menu>
        </Box>
      </Box>
      <StyledTableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell>Product Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Batch Number</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts?.map((product) => (
              <TableRow key={product._id}>
                <TableCell component="th" scope="row">
                  {product.product_code}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Category
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    />
                    {product.product_name}
                  </Box>
                </TableCell>
                <TableCell>{product.batchNumber}</TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    ৳
                    {product.sellingPrice.toFixed(2)}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Inventory sx={{ mr: 1, color: theme.palette.info.main }} />
                    <StyledChip
                      label={`${product.product_quantity} pcs`}
                      className={getStockStatus(
                        product.product_quantity,
                        product.stock_alert
                      )}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarToday
                      sx={{ mr: 1, color: theme.palette.secondary.main }}
                    />
                    {formatDate(product.expiryDate)}
                  </Box>
                </TableCell>
                <TableCell>
                  <StyledChip
                    label={product.productStatus}
                    className={product.productStatus}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <StyledIconButton
                      onClick={() => handleProductAction("view", product)}
                    >
                      <Visibility />
                    </StyledIconButton>
                  </Tooltip>
                  <Tooltip title="Edit Product">
                    <StyledIconButton
                      onClick={() => handleProductAction("edit", product)}
                    >
                      <Edit />
                    </StyledIconButton>
                  </Tooltip>
                  <Tooltip title="Delete Product">
                    <StyledIconButton
                      onClick={() => handleProductAction("delete", product)}
                      color="error"
                    >
                      <Delete />
                    </StyledIconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Product Action Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {dialogAction === "add" && "Add New Product"}
          {dialogAction === "view" && "Product Details"}
        </DialogTitle>
        <DialogContent>
          {dialogAction === "view" && selectedProduct && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Product Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Product Code:</strong> {selectedProduct.product_code}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Product Name:</strong> {selectedProduct.product_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Batch Number:</strong> {selectedProduct.batchNumber || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Price:</strong> ৳{selectedProduct.sellingPrice.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Stock:</strong> {selectedProduct.product_quantity} pcs
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Expiry Date:</strong> {formatDate(selectedProduct.expiryDate)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Status:</strong> {selectedProduct.productStatus}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Stock Alert:</strong> {selectedProduct.stock_alert}
                  </Typography>
                </Grid>
                {/* Add more fields as needed */}
              </Grid>
            </Box>
          )}
          {dialogAction === "add" && (
            <ProductForm />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {dialogAction === "add" && (
            <Button variant="contained" onClick={handleCloseDialog}>
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupplierProduct;