/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Add,
  CalendarMonth,
  Delete,
  FilterAlt,
  Info,
  Inventory,
  Search,
  SortByAlpha,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import {
  useDeleteAdjustmentMutation,
  useGetAllIAdjustmentQuery,
} from "../../../redux/api/adjustmentApi";
import { Link } from "react-router-dom";

export default function QuantityAdjustment() {
  const theme = useTheme();
  const [params, setParams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  

  const { data: adjustmentData, isLoading } = useGetAllIAdjustmentQuery([
    ...params,
  ]);
  const [deleteAdjustment] = useDeleteAdjustmentMutation();

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.palette.error.main,
      cancelButtonColor: theme.palette.grey[500],
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAdjustment(id).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "Adjustment has been deleted.",
            icon: "success",
            confirmButtonColor: theme.palette.primary.main,
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the Adjustment.",
            icon: "error",
            confirmButtonColor: theme.palette.error.main,
          });
        }
      }
    });
  };

  const adjustments = adjustmentData?.data?.adjustments || [];

  // Filter adjustments based on search term
  const filteredAdjustments = adjustments.filter(
    (adjustment) =>
      adjustment.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.products.some((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const rows = filteredAdjustments.map((adjustment) => ({
    id: adjustment._id,
    date: adjustment.date,
    referenceNo: adjustment.referenceNo,
    products: adjustment.products,
    note: adjustment.note,
    productCount: adjustment.products.length,
    totalQuantity: adjustment.products.reduce(
      (sum, product) => sum + product.quantity,
      0
    ),
  }));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const columns = [
    {
      field: "date",
      headerName: "Date",
      flex: 0.8,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <CalendarMonth fontSize="small" color="primary" />
          <Typography variant="body2">{formatDate(params.value)}</Typography>
        </Stack>
      ),
    },
    {
      field: "referenceNo",
      headerName: "Reference No",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="primary"
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "productCount",
      headerName: "Items",
      width: 80,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="secondary"
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      ),
    },
    {
      field: "totalQuantity",
      headerName: "Total Qty",
      width: 100,
      renderCell: (params) => (
        <Typography
          variant="body2"
          fontWeight="bold"
          sx={{
            color: params.value > 0 ? "success.main" : "error.main",
          }}
        >
          {params.value > 0 ? `+${params.value}` : params.value}
        </Typography>
      ),
    },
    {
      field: "products",
      headerName: "Products",
      flex: 2.5,
      renderCell: (params) => (
        <Box sx={{ width: "100%" }}>
          {params.value.slice(0, 2).map((product, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{
                mb: 1,
                borderLeft: `4px solid ${
                  product.type === "addition"
                    ? theme.palette.success.main
                    : theme.palette.error.main
                }`,
              }}
            >
              <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" fontWeight="bold">
                    {product.productName}
                  </Typography>
                  <Chip
                    label={product.type}
                    size="small"
                    color={product.type === "addition" ? "success" : "error"}
                    sx={{ height: 20 }}
                  />
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ mt: 0.5, fontSize: "0.75rem" }}
                >
                  <Typography variant="caption">
                    Code: <b>{product.productCode}</b>
                  </Typography>
                  <Typography variant="caption">
                    Qty: <b>{product.quantity}</b>
                  </Typography>
                  {product.serialNumber && (
                    <Typography variant="caption">
                      S/N: <b>{product.serialNumber}</b>
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
          {params.value.length > 2 && (
            <Tooltip
              title={
                <Box>
                  {params.value.slice(2).map((product, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="caption" fontWeight="bold">
                        {product.productName}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Code: {product.productCode}, Qty: {product.quantity}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              }
            >
              <Chip
                label={`+${params.value.length - 2} more`}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ mt: 0.5 }}
              />
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      field: "note",
      headerName: "Note",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value || "No notes"}>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
              color: params.value ? "text.primary" : "text.secondary",
              fontStyle: params.value ? "normal" : "italic",
            }}
          >
            {params.value || "No notes"}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<Delete />}
          onClick={() => handleDelete(params.row.id)}
          sx={{
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "error.main",
              color: "white",
            },
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          background: "linear-gradient(to right, #42A1DA, #5BBAE5)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold" color="white">
              Quantity Adjustment
            </Typography>
            <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
              Product &gt; Quantity Adjustment
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/dashboard/add-adjustment"
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: "white",
              color: "#42A1DA",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            New Adjustment
          </Button>
        </Stack>
      </Paper>

      {/* Main Content */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Search and Filter Bar */}
        <Box
          sx={{
            p: 1,
            bgcolor: "#f8f9fa",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <TextField
              placeholder="Search by reference, product name or note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ width: { xs: "100%", md: "40%" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<FilterAlt />}
                sx={{ borderRadius: 2 }}
              >
                Filter
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<SortByAlpha />}
                sx={{ borderRadius: 2 }}
              >
                Sort
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Inventory />}
                sx={{ borderRadius: 2 }}
              >
                Export
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Data Grid */}
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            disableSelectionOnClick
            getRowHeight={() => "auto"}
            checkboxSelection
            components={{
              Toolbar: GridToolbar,
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: false,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f1f8fe",
                color: "#42A1DA",
                fontSize: "0.9rem",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
                padding: "8px 16px",
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: "#fafafa",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f1f8fe",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: "#f8f9fa",
              },
              "& .MuiCheckbox-root": {
                color: "#42A1DA",
              },
              "& .MuiDataGrid-virtualScroller": {
                minHeight: "200px",
              },
            }}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
          />
        </Box>

        {/* Summary Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e0e0e0",
            bgcolor: "#f8f9fa",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {rows.length} of {rows.length} adjustments
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Info fontSize="small" color="primary" />
              <Typography variant="body2" color="text.secondary">
                Total Items:{" "}
                {rows.reduce((sum, row) => sum + row.productCount, 0)}
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body2" color="text.secondary">
                Net Quantity Change:{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    color:
                      rows.reduce((sum, row) => sum + row.totalQuantity, 0) >= 0
                        ? "success.main"
                        : "error.main",
                  }}
                >
                  {rows.reduce((sum, row) => sum + row.totalQuantity, 0)}
                </Box>
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
