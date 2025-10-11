/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
} from "@mui/material";
import {
  ControlPoint,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

import {
  useDeleteBrandMutation,
  useGetAllIBrandQuery,
} from "../../../redux/api/brandApi";
import { CreateBrandModal } from "./CreateBrandModal";
import { UpdateBrand } from "./UpdateBrand";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

export default function BrandList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(12);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const tenantDomain = useTenantDomain();

  const { data, isLoading, refetch } = useGetAllIBrandQuery({
    tenantDomain,
    limit: pageSize,
    page: currentPage,
    searchTerm: search,
  });

  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();
  const brands = data?.data?.brands || [];
  const meta = data?.data?.meta || {};
  const totalPage = meta.totalPage || 1;
  const total = meta.total || 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteConfirm = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const handleDeleteCancel = () => {
    setConfirmDelete({ open: false, id: null });
  };

  const handleDeleteBrand = async () => {
    if (!confirmDelete.id) return;
    try {
      await deleteBrand({ tenantDomain, id: confirmDelete.id }).unwrap();
      Swal.fire("Deleted!", "Brand deleted successfully.", "success");
    } catch {
      Swal.fire("Error!", "Failed to delete brand.", "error");
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  return (
    <>
      <div className="my-2">
        <Fade in timeout={500}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                Brand Manager
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create and manage brands for your inventory.
              </Typography>
            </Box>

            <Box
              sx={{
                display: { sm: "flex" },
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <TextField
                placeholder="Search brands..."
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <div className="mt-2 flex justify-end ">
                <Button
                  sx={{ color: "#fff" }}
                  variant="contained"
                  startIcon={<ControlPoint />}
                  onClick={() => setOpen(true)}
                >
                  Create Brand
                </Button>
              </div>
            </Box>

            {isInitialLoad || isLoading ? (
              <Typography>Loading...</Typography>
            ) : brands.length === 0 ? (
              <Typography>No brands found.</Typography>
            ) : (
              <Box>
                {brands.map((brand) => (
                  <Box
                    key={brand._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      borderBottom: "1px solid #f1f5f9",
                      "&:hover": { backgroundColor: "#f9fafb" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar src={brand.image} variant="rounded" />
                      <Typography fontWeight={600}>{brand.brand}</Typography>
                    </Box>
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => setUpdateOpen(brand._id)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDeleteConfirm(brand._id)}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {open && <CreateBrandModal open={open} setOpen={setOpen} />}
            {updateOpen && (
              <UpdateBrand
                open={Boolean(updateOpen)}
                setOpen={() => setUpdateOpen(null)}
                brandId={updateOpen}
              />
            )}

            <Dialog open={confirmDelete.open} onClose={handleDeleteCancel}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete this brand?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteCancel}>Cancel</Button>
                <Button
                  onClick={handleDeleteBrand}
                  color="error"
                  variant="contained"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Fade>
      </div>
    </>
  );
}
