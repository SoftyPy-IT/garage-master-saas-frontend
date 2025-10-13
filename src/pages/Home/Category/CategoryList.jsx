"use client";

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

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
  InputAdornment,
  Tooltip,
  Dialog,
  DialogContent,
  CircularProgress,
  alpha,
  Stack,
  Skeleton,
  Avatar,
  ListItemIcon,
  Pagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Category as CategoryIcon,
  CloudDownload as CloudDownloadIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import {
  useDeleteCategoryMutation,
  useGetAllICategoryQuery,
} from "../../../redux/api/categoryApi";
import { DataGrid } from "@mui/x-data-grid";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import { usePermissions } from "../../../context/PermissionContext";
import Can from "../../../components/Can";
export default function CategoryList() {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = usePermissions();
  const { data, isLoading, refetch } = useGetAllICategoryQuery({
    tenantDomain,
    limit: 10,
    page: currentPage,
    searchTerm: search,
  });
  const [deleteCategory] = useDeleteCategoryMutation();
  const categories = data?.data?.categories || [];


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  const handleOpen = () => setOpen(true);
  const handleUpdateOpen = (id) => setUpdateOpen(id);
  const handleClose = () => setOpen(false);
  const handleDeleteClick = (id) => {

    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory({ tenantDomain, id: categoryToDelete }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The category has been deleted successfully.",
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
        text: "An error occurred while deleting the category.",
        confirmButtonColor: "#6a1b9a",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };
  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch().then(() => {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    });
  };

  const { meta } = data?.data || { meta: {} };
  const { totalPage = 10 } = meta || {};

  const columns = [
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          alt={params.row.main_category}
          variant="rounded"
          sx={{
            width: 50,
            height: 50,
            borderRadius: 2,
            bgcolor: alpha("#6a1b9a", 0.1),
          }}
        >
          <CategoryIcon sx={{ color: alpha("#6a1b9a", 0.7) }} />
        </Avatar>
      ),
    },
    {
      field: "main_category",
      headerName: "Main Category",
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "sub_category",
      headerName: "Sub Category",
      flex: 2,
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
              onClick={() => handleUpdateOpen(params.row.id)}
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

  const rows = categories.map((category) => ({
    id: category._id,
    image: category.image,
    main_category: category.main_category,
    sub_category: category.sub_category,
  }));


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f9f9f9, #f0f0f0)",
        pt: 2,
        pb: 8,
      }}
    >
      {/* Header */}
      <div className="bg-[#42A1DA] to-[#42A1DA] text-white py-6 mb-6 rounded-b-[20px] shadow-[0_4px_20px_rgba(106,27,154,0.4)]">
        <Container maxWidth="xl">
          <div className="flex items-center mb-4">
            <CategoryIcon className="text-[40px] mr-4" />
            <h1 className="md:text-3xl font-bold">Category Management</h1>
          </div>
          <p className="opacity-90 max-w-[700px] mb-6">
            Manage your product categories to better organize your inventory and
            improve searchability.
          </p>
        </Container>
      </div>

      <Container maxWidth="xl" sx={{ p: { xs: 0, md: 2 } }}>
        {/* Search and Actions */}
        <div className="md:flex items-center justify-between p-4 mb-4 rounded-xl shadow-md bg-white">
          <div className="mb-2 md:mb-0">
            <TextField
              fullWidth
              placeholder="Search categories by name..."
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
                    borderColor: "rgba(106, 27, 154, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6a1b9a",
                  },
                },
              }}
            />
          </div>

          <div className="space-x-2">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              sx={{
                borderRadius: 100,
                background: "#42A1DA",
                boxShadow: "0 4px 10px rgba(106, 27, 154, 0.3)",
                px: 2,
                color: "white",
              }}
            >
              Create Category
            </Button>

            <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
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

          </div>
        </div>

        <Box
          sx={{
            width: "100%",
            overflow: "auto",
            "& .MuiDataGrid-root": {
              minWidth: "800px",
            },
            "& .MuiDataGrid-columnHeaders": {
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "white",
            },
            "& .MuiDataGrid-virtualScroller": {
              overflow: "visible",
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              border: 0,
              borderRadius: 2,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          />
        </Box>

        {categories.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <Pagination
              count={totalPage}
              page={currentPage}
              onChange={handlePageChange}
              color="secondary"
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

        <Dialog open={isDeleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Confirm Delete
            </Typography>
            <Typography variant="body1">
              Are you sure you want to delete this category?
            </Typography>
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
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
              <Can page='/dashboard/category' action='delete'>
                <Button
                  onClick={handleDeleteConfirm}
                  color="error"
                  variant="contained"
                  sx={{
                    borderRadius: 100,
                    px: 3,
                  }}
                  autoFocus
                >
                  Delete
                </Button>
              </Can>
            </Box>
          </DialogContent>
        </Dialog>

        {open && <CreateCategoryModal categoryId={updateOpen} open={open} setOpen={handleClose} />}

      </Container>
    </Box>
  );
}
