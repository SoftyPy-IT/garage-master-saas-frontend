/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Chip,
  Pagination,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import {
  useDeleteUnitMutation,
  useGetAllIUnitQuery,
} from "../../../redux/api/unitApi";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import { usePermissions } from "../../../context/PermissionContext";

const UnitTable = ({ handleUpdateOpen }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const { performActionWithPermission } = usePermissions();
  const { tenantDomain } = useTenantDomain();
  const { data, isLoading, refetch } = useGetAllIUnitQuery({
    tenantDomain,
    limit: 10,
    page: currentPage,
    searchTerm: search,
  });

  const [deleteUnit] = useDeleteUnitMutation();

  const units = data?.data?.units || [];
  const meta = data?.data?.meta || {};
  const totalPage = meta.totalPage || 1;

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    performActionWithPermission('/dashboard/unit', 'delete',
      async () => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#6366f1",
          cancelButtonColor: "#ef4444",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
          background: "#ffffff",
          customClass: {
            title: "text-gray-800 text-xl font-bold",
            content: "text-gray-700",
            confirmButton: "rounded-lg text-white font-medium px-5 py-2",
            cancelButton: "rounded-lg text-white font-medium px-5 py-2",
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await deleteUnit({ tenantDomain, id }).unwrap();
              Swal.fire({
                title: "Deleted!",
                text: "The unit has been deleted successfully.",
                icon: "success",
                confirmButtonColor: "#6366f1",
                background: "#ffffff",
                customClass: {
                  title: "text-gray-800 text-xl font-bold",
                  content: "text-gray-700",
                  confirmButton: "rounded-lg text-white font-medium px-5 py-2",
                },
              });
            } catch (error) {
              Swal.fire({
                title: "Error!",
                text: "An error occurred while deleting the unit.",
                icon: "error",
                confirmButtonColor: "#6366f1",
                background: "#ffffff",
                customClass: {
                  title: "text-gray-800 text-xl font-bold",
                  content: "text-gray-700",
                  confirmButton: "rounded-lg text-white font-medium px-5 py-2",
                },
              });
            }
          }
        });
      }, "You don't permission to delete unit"
    )
  };

  const getRandomColor = (id) => {
    if (!id) return "#6366f1";

    const colors = [
      "#6366f1",
      "#8b5cf6",
      "#ec4899",
      "#f43f5e",
      "#f97316",
      "#eab308",
      "#10b981",
      "#06b6d4",
      "#3b82f6",
    ];

    try {

      const index =
        id
          .toString()
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
      return colors[index];
    } catch (error) {
      console.error("Error generating color:", error);
      return "#6366f1";
    }
  };

  return (
    <>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
        }}
      >
        <TextField
          placeholder="Search units..."
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearch}
          sx={{
            minWidth: { xs: "100%", sm: "300px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#fff",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              "&:hover": {
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />

      </Box>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 5,
          }}
        >
          <CircularProgress size={40} sx={{ color: "#6366f1" }} />
        </Box>
      ) : units.length === 0 ? (
        <Box sx={{ p: 5, textAlign: "center" }}>
          <Typography variant="h6" color="#64748b" gutterBottom>
            No units found
          </Typography>
          <Typography variant="body2" color="#94a3b8">
            Try changing your search or add a new unit
          </Typography>
        </Box>
      ) : (
        <Box sx={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>

                <th>
                  Unit Name
                </th>
                <th>
                  Short Name
                </th>
                <th>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <>
                {units.map((unit, index) => (
                  <tr
                    key={unit._id}

                  >

                    <td style={{ padding: "16px" }}>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        color="#1e293b"
                      >
                        {unit.unit}
                      </Typography>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <Chip
                        label={unit.short_name}
                        size="small"
                        sx={{
                          backgroundColor: alpha(getRandomColor(unit._id), 0.1),
                          color: getRandomColor(unit._id),
                          fontWeight: 600,
                          borderRadius: "8px",
                        }}
                      />
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >

                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateOpen(unit._id)}
                            sx={{
                              backgroundColor: alpha("#3b82f6", 0.1),
                              color: "#3b82f6",
                              "&:hover": {
                                backgroundColor: alpha("#3b82f6", 0.2),
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(unit._id)}
                            sx={{
                              backgroundColor: alpha("#ef4444", 0.1),
                              color: "#ef4444",
                              "&:hover": {
                                backgroundColor: alpha("#ef4444", 0.2),
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </td>
                  </tr>
                ))}
              </>
            </tbody>
          </table>
        </Box>
      )}

      {/* Pagination */}
      {units.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Pagination
            count={totalPage}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "8px",
                "&.Mui-selected": {
                  backgroundColor: "#6366f1",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#4f46e5",
                  },
                },
              },
            }}
          />
        </Box>
      )}

    </>
  );
};

export default UnitTable;
