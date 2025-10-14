/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  InputAdornment,
  alpha,
  Stack,
  Pagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useDeleteProductMutation,
  useGetAllIProductQuery,
} from "../../../redux/api/productApi";
import Loading from "../../../components/Loading/Loading";
import { useAppOptions } from "../../../hooks/useAppOptions";
import { useFormController } from "../../../hooks/useFormController";
import { ProductCard } from "./ProductCard";




export default function ProductList() {

  const {
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    theme,
  } = useFormController();
  const navigate = useNavigate();
  const { tenantDomain, performActionWithPermission, } = useAppOptions();
  const queryParams = {
    tenantDomain,
    limit: 10,
    page: currentPage,
    searchTerm: search,
  };

  const { data, isLoading, refetch } = useGetAllIProductQuery(queryParams);
  const [deleteProduct] = useDeleteProductMutation();

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (productId) => {
    performActionWithPermission(
      '/dashboard/product-list',
      'delete',
      async () => {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: theme.palette.primary.main,
          showLoaderOnConfirm: true,
          preConfirm: async () => {
            try {
              await deleteProduct({
                tenantDomain,
                id: productId
              }).unwrap();
              return true;
            } catch (error) {
              Swal.showValidationMessage(
                `Delete failed: ${error?.data?.message || 'Unknown error'}`
              );
              return false;
            }
          }
        });

        if (result.isConfirmed && result.value) {
          Swal.fire({
            title: 'Deleted!',
            text: 'The product has been deleted successfully.',
            icon: 'success',
            confirmButtonColor: theme.palette.primary.main,
            timer: 2000,
            showConfirmButton: false
          });
          refetch();
        }
      },
      "You don't have permission to delete product"
    );
  };

  const products = data?.data?.products || [];
  const { meta } = data?.data || { meta: {} };
  const { totalPage = 10 } = meta || {};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: { md: "linear-gradient(to bottom, #f9f9f9, #f0f0f0)" },
        pt: 2,
        pb: 8,
      }}
    >
      <Box
        sx={{
          background: `${theme.palette.primary.main}`,
          color: "white",
          py: 3,
          mb: 4,
          borderRadius: { xs: "0 0 20px 20px", md: "0 0 20px 20px" },
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Product Inventory
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 700 }}>
            Manage your product inventory, track stock levels, and update product information.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ p: { xs: 0 } }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              All Products ({products.length})
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
              <Button
                component={Link}
                to="/dashboard/add-product"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: 100,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
                  px: 3,
                  color: "white",
                }}
              >
                Add Product
              </Button>
            </Stack>
          </Grid>
        </Grid>

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
                value={search}
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
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mb: 4 }}>
          {isLoading ? (
            <Loading />
          ) : products?.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 3,
                textAlign: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="h6" gutterBottom>
                No Products Found
              </Typography>
              <Button
                component={Link}
                to="/dashboard/add-product"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: 100,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`,
                  px: 3,
                }}
              >
                Add New Product
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {products?.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard
                    product={product}
                    onEdit={(id) => navigate(`/dashboard/update-product/?id=${id}`)}
                    onDelete={handleDelete}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {products.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPage}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      bgcolor: theme.palette.secondary.main,
                    },
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}