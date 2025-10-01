/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
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
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  alpha,
  Zoom,
  Fade,
} from "@mui/material";
import {
  Category as CategoryIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Help as HelpIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  useCreateProductTypeMutation,
  useDeleteProductTypeMutation,
  useGetAllIProductTypeQuery,
} from "../../../redux/api/productTypeApi";
import TASForm from "../../../components/form/Form";
import TASInput from "../../../components/form/Input";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

// Enhanced ProductTypeForm component
const ProductTypeForm = () => {
  const [productType, { isLoading }] = useCreateProductTypeMutation();
  const [formValue, setFormValue] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const tenantDomain = useTenantDomain();

  const handleSubmit = async (data) => {
    try {
      await productType({ ...data, tenantDomain }).unwrap();
      setIsSuccess(true);
      setFormValue("");
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);

      toast.success("Product Type created successfully!");
    } catch (error) {
      toast.error(
        "Error creating Product Type: " + error.message ||
          "Something went wrong!"
      );
    }
  };

  const handleInputChange = (e) => {
    setFormValue(e.target.value);
  };

  return (
    <Card>
      <Box
        sx={{
          background: "linear-gradient(135deg, #6a1b9a 0%, #42A1DA 100%)",
          py: 2,
          px: 3,
          borderRadius: "12px 12px 0 0",
          display: "flex",
          alignItems: "center",
        }}
      >
        <CategoryIcon sx={{ color: "white", mr: 1.5, fontSize: 28 }} />
        <Typography
          variant="h6"
          component="h2"
          sx={{ color: "white", fontWeight: 600 }}
        >
          Add New Product Type
        </Typography>
      </Box>

      <CardContent sx={{ p: { xs: 1, md: 3 } }}>
        <TASForm onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography fontWeight={500} mb={1} color="text.secondary">
                Product Type Name
              </Typography>
              <TASInput
                size="medium"
                fullWidth
                name="product_type"
                label="Enter product type"
                placeholder="e.g., Electronics, Automotive, Clothing"
                value={formValue}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha("#6a1b9a", 0.2),
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: alpha("#6a1b9a", 0.5),
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#6a1b9a",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                sx={{
                  borderRadius: 100,
                  background:
                    "linear-gradient(135deg, #6a1b9a 0%, #42A1DA 100%)",
                  boxShadow: "0 4px 10px rgba(106, 27, 154, 0.3)",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  color: "white",
                }}
              >
                {isLoading ? "Creating..." : "Create Product Type"}
              </Button>
            </Grid>
          </Grid>
        </TASForm>
      </CardContent>
    </Card>
  );
};

// Enhanced ProductTypeTable component
const ProductTypeTable = () => {
const tenantDomain = useTenantDomain();
  const [deleteProductType, { isLoading: isDeleting }] =
    useDeleteProductTypeMutation();
  const { isLoading, data, refetch } = useGetAllIProductTypeQuery({
    tenantDomain,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productTypeToDelete, setProductTypeToDelete] = useState(null);

  const productTypes = data?.data?.productTypes || [];
  // Filter product types based on search term
  const filteredProductTypes = productTypes.filter((type) =>
    type.product_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rows = filteredProductTypes.map((productType) => ({
    id: productType._id,
    product_type: productType.product_type,
    createdAt: new Date(productType.createdAt).toLocaleDateString(),
  }));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch().then(() => {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    });
  };

  const handleDeleteClick = (id) => {
    setProductTypeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProductType({ productTypeToDelete }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The Product Type has been deleted successfully.",
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
        text: "An error occurred while deleting the product type.",
        confirmButtonColor: "#6a1b9a",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setProductTypeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setProductTypeToDelete(null);
  };

  const columns = [
    {
      field: "product_type",
      headerName: "Product Type",
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CategoryIcon
            sx={{ color: alpha("#6a1b9a", 0.7), mr: 1, fontSize: 20 }}
          />
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: alpha("#6a1b9a", 0.1),
            color: "#6a1b9a",
            fontWeight: 500,
            fontSize: "0.75rem",
          }}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              sx={{
                bgcolor: alpha("#6a1b9a", 0.1),
                color: "#6a1b9a",
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
              onClick={() => handleDeleteClick(params.id)}
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
      ),
    },
  ];

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #6a1b9a 0%, #42A1DA 100%)",
          py: 1.5,
          px: 3,
          borderRadius: "12px 12px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CategoryIcon sx={{ color: "white", mr: 1.5, fontSize: 28 }} />
          <Typography
            variant="h6"
            component="h2"
            sx={{ color: "white", fontWeight: 600 }}
          >
            Product Types
          </Typography>
          <Chip
            label={productTypes.length}
            size="small"
            sx={{
              ml: 1.5,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 600,
            }}
          />
        </Box>
        <Box>
          <Tooltip title="Refresh">
            <IconButton
              onClick={handleRefresh}
              sx={{
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              {isRefreshing ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                <RefreshIcon />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ p: 3, pb: 0 }}>
        <TextField
          fullWidth
          placeholder="Search product types..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 100,
              bgcolor: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha("#6a1b9a", 0.2),
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha("#6a1b9a", 0.5),
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#6a1b9a",
              },
            },
          }}
          sx={{
            mb: 2,
          }}
        />
      </Box>

      <CardContent
        sx={{
          p: 3,
          pt: 0,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flexGrow: 1, width: "100%", mt: 2 }}>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px",
              }}
            >
              <CircularProgress sx={{ color: "#6a1b9a" }} />
            </Box>
          ) : rows.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "300px",
                bgcolor: alpha("#6a1b9a", 0.03),
                borderRadius: 2,
                border: `1px dashed ${alpha("#6a1b9a", 0.2)}`,
              }}
            >
              <CategoryIcon
                sx={{ fontSize: 48, color: alpha("#6a1b9a", 0.2), mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Product Types Found
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ maxWidth: 300, mb: 2 }}
              >
                {searchTerm
                  ? "No product types match your search criteria."
                  : "You haven't added any product types yet."}
              </Typography>
              {searchTerm && (
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={() => setSearchTerm("")}
                  sx={{
                    borderRadius: 100,
                    borderColor: alpha("#6a1b9a", 0.5),
                    color: "#6a1b9a",
                    "&:hover": {
                      borderColor: "#6a1b9a",
                      bgcolor: alpha("#6a1b9a", 0.05),
                    },
                  }}
                >
                  Clear Search
                </Button>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%", // Takes full width of parent
                overflow: "auto", // Enables horizontal scrolling
                "& .MuiDataGrid-root": {
                  minWidth: "800px", // Ensures columns can overflow (adjust as needed)
                },
                "& .MuiDataGrid-columnHeaders": {
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "white", // Prevents transparency on scroll
                },
                "& .MuiDataGrid-virtualScroller": {
                  overflow: "visible", // Allows horizontal overflow
                },
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                slots={{
                  toolbar: GridToolbar,
                }}
                checkboxSelection
                disableRowSelectionOnClick
                autoHeight={false} // Disable autoHeight for controlled scrolling
                sx={{
                  border: "none",
                  "& .MuiDataGrid-cell": {
                    borderColor: alpha("#6a1b9a", 0.1),
                    whiteSpace: "nowrap", // Prevents text wrapping
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor: alpha("#6a1b9a", 0.05),
                  },
                  "& .MuiDataGrid-toolbarContainer": {
                    bgcolor: alpha("#6a1b9a", 0.02),
                    borderRadius: 1,
                    p: 1,
                    mb: 1,
                  },
                  "& .MuiDataGrid-row:hover": {
                    bgcolor: alpha("#6a1b9a", 0.05),
                  },
                  "& .MuiCheckbox-root.Mui-checked": {
                    color: "#6a1b9a",
                  },
                  "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
                    color: alpha("#6a1b9a", 0.7),
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </CardContent>

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
            Are you sure you want to delete this product type? This action
            cannot be undone.
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
    </Card>
  );
};

const ProductType = () => {
  return (
    <div className="min-h-[100vh] bg-[linear-gradient(to bottom, #f9f9f9, #f0f0f0)] py-2">
      {/* Header */}
      <Container maxWidth="xl" sx={{ p: { xs: 0 } }}>
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
              <CategoryIcon sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Product Types
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 700 }}>
              Manage your product types to better organize and categorize your
              inventory.
            </Typography>
          </Container>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <ProductTypeForm />
          </Grid>
          <Grid item xs={12} md={7}>
            <ProductTypeTable />
          </Grid>
        </Grid>

        {/* Help Card */}
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
          <HelpIcon sx={{ color: "#2e7d32", mt: 0.5 }} />
          <div>
            <Typography
              variant="subtitle1"
              sx={{ color: "#2e7d32", fontWeight: 600 }}
            >
              Using Product Types Effectively
            </Typography>
            <Typography variant="body2" sx={{ color: "#1b5e20" }}>
              Product types help you organize your inventory and make it easier
              to find products. Create specific product types that make sense
              for your business, such as "Electronics," "Automotive Parts," or
              "Office Supplies." You can then assign these types to products
              when creating or editing them.
            </Typography>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default ProductType;
