"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs,
  Link,
  Chip,
  Grid,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  useTheme,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  NavigateNext as NavigateNextIcon,
  Search as SearchIcon,
  Warehouse as WarehouseIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

import {
  useDeleteWarehouseMutation,
  useGetAllWarehousesQuery,
} from "../../../redux/api/warehouseApi";
import swal from "sweetalert";
import ViewWarehouseDetails from "./WarehouseDetailsModal";
import {
  wareHouseButton,
  wareHouseCard,
  wareHouseInput,
} from "../../../utils/customStyle";
import { warehouseTypes } from "../../../data";
import WarehouseModal from "./WarehouseModal";
import { useAppOptions } from "../../../hooks/useAppOptions";
import Can from "../../../components/Can";
import ActionIconButton from "../../../components/ActionIconButton";
import { formatDate } from "../../../utils/formateDate";

export default function WarehouseManagement() {
  const theme = useTheme();
  const [warehouses, setWarehouses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editWarehouseId, setEditWarehouseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { tenantDomain, performActionWithPermission } = useAppOptions()

  const {
    data: warehouseData,
    isLoading: isDataLoading,
    refetch,
  } = useGetAllWarehousesQuery({ tenantDomain });

  const [deleteWarehouse] = useDeleteWarehouseMutation();

  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  useEffect(() => {
    setLoading(isDataLoading);
  }, [isDataLoading]);

  useEffect(() => {
    if (warehouseData?.data?.warehouses) {
      setWarehouses(warehouseData.data.warehouses);
    }
  }, [warehouseData]);

  const handleClickOpen = () => {
    setEditWarehouseId(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditWarehouseId(null);
  };

  const handleEditOpen = (id) => {
    setEditWarehouseId(id);
    setOpen(true);
  };

  const handleViewDetails = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setViewDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setViewDetailsOpen(false);
    setSelectedWarehouse(null);
  };

  const handleDeleteWarehouse = async (id) => {
    performActionWithPermission('/dashboard/warehouse', 'delete',
      async () => {
        const willDelete = await swal({
          title: "Are you sure?",
          text: "You want to move this warehouse to Recycle bin?",
          icon: "warning",
          dangerMode: true,
        });

        if (willDelete) {
          try {
            await deleteWarehouse({ tenantDomain, id }).unwrap();
            swal(
              "Move to Recycle bin!",
              "Move to Recycle bin successful.",
              "success"
            );
            refetch();
          } catch (error) {
            swal(
              "Error",
              "An error occurred while deleting the warehouse.",
              "error"
            );
          }
        }

      }, `You don't have permission to delete warehouse`
    )
  };


  const getStatusChip = (status) => {
    switch (status) {
      case "active":
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Active"
            color="success"
            size="small"
            sx={{
              fontWeight: "bold",
              background: alpha(theme.palette.success.main, 0.1),
              "& .MuiChip-icon": { color: theme.palette.success.main },
            }}
          />
        );
      case "inactive":
        return (
          <Chip
            icon={<CancelIcon />}
            label="Inactive"
            color="error"
            size="small"
            sx={{
              fontWeight: "bold",
              background: alpha(theme.palette.error.main, 0.1),
              "& .MuiChip-icon": { color: theme.palette.error.main },
            }}
          />
        );
      default:
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Active"
            color="success"
            size="small"
            sx={{
              fontWeight: "bold",
              background: alpha(theme.palette.success.main, 0.1),
              "& .MuiChip-icon": { color: theme.palette.success.main },
            }}
          />
        );
    }
  };

  const getTypeChip = (type) => {
    const typeObj = warehouseTypes.find((t) => t.value === type) || {
      value: type,
      label: type,
    };

    let color;
    switch (type) {
      case "primary":
        color = "primary";
        break;
      case "secondary":
        color = "secondary";
        break;
      case "showroom":
        color = "info";
        break;
      case "service":
        color = "warning";
        break;
      case "distribution":
        color = "success";
        break;
      default:
        color = "default";
    }

    return <Chip label={typeObj.label} color={color} size="small" />;
  };

  return (
    <Box>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3, mt: 3, boxShadow: 2, p: 3 }}
      >
        <Link
          color="inherit"
          href="/dashboard"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography variant="body2">Dashboard</Typography>
        </Link>
        <Link
          color="inherit"
          href="/inventory"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Typography variant="body2">Inventory</Typography>
        </Link>
        <Typography color="text.primary" variant="body2">
          Warehouse Management
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #006a4e 30%, #00a651 90%)",
            backgroundClip: "text",
            textFillColor: "transparent",
            mb: 1,
          }}
        >
          Warehouse Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage your warehouses, showrooms, and service centers
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={wareHouseCard}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#006a4e",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px rgba(0, 106, 78, 0.3)",
                  }}
                >
                  <WarehouseIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                  Total Warehouses
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {loading ? (
                  <LinearProgress sx={{ my: 2 }} />
                ) : (
                  warehouses.length
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total number of warehouses and locations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={wareHouseCard}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#4caf50",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px rgba(76, 175, 80, 0.3)",
                  }}
                >
                  <CheckCircleIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                  Active Warehouses
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                {loading ? (
                  <LinearProgress sx={{ my: 2 }} />
                ) : (
                  warehouses.filter((w) => w.status === "active").length
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Number of active warehouses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Warehouse List
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          sx={wareHouseButton}
        >
          Add New Warehouse
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: "linear-gradient(to right, #f5f7fa, #e4e7eb)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Filters and Search
          </Typography>
        </Box>

        <TextField
          variant="outlined"
          placeholder="Search warehouses by name, address, or manager..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={wareHouseInput}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {loading ? (
        <Paper sx={{ p: 5, borderRadius: 2, textAlign: "center" }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography>Loading warehouse data...</Typography>
        </Paper>
      ) : (
        <Paper
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }}
                >
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Manager</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Capacity</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Opening Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {warehouses.map((warehouse) => (
                  <TableRow
                    key={warehouse?._id}
                    sx={{
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.04
                        ),
                      },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <TableCell sx={{ fontWeight: "medium" }}>
                      {warehouse?.warehouseId || "N/A"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>
                      {warehouse?.name}
                    </TableCell>
                    <TableCell>{getTypeChip(warehouse?.type)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LocationOnIcon
                          fontSize="small"
                          sx={{ mr: 0.5, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {warehouse?.city}
                          {warehouse?.address && `, ${warehouse.address}`}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PersonIcon
                          fontSize="small"
                          sx={{ mr: 0.5, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {warehouse?.manager || "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {warehouse?.capacity
                        ? `${warehouse.capacity} sq ft`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {warehouse?.openingDate
                        ? formatDate(warehouse.openingDate)
                        : "N/A"}
                    </TableCell>
                    <TableCell>{getStatusChip(warehouse?.status)}</TableCell>
                    <TableCell align="center">
                      <ActionIconButton
                        title="View Details"
                        colorVariant="primary"
                        icon={<VisibilityIcon fontSize="small" />}
                        onClick={() => handleViewDetails(warehouse)}
                      />

                      <ActionIconButton
                        title="Edit"
                        colorVariant="warning"
                        icon={<EditIcon fontSize="small" />}
                        onClick={() => handleEditOpen(warehouse._id)}
                      />

                      <ActionIconButton
                        title="Delete"
                        colorVariant="error"
                        icon={
                          <Can page="/dashboard/warehouse" action="delete">
                            <DeleteIcon fontSize="small" />
                          </Can>
                        }
                        onClick={() => handleDeleteWarehouse(warehouse._id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Add/Edit Warehouse Dialog */}
      <WarehouseModal
        open={open}
        onClose={handleClose}
        warehouseId={editWarehouseId}
      />

      {/* View Warehouse Details Dialog */}
      <ViewWarehouseDetails
        open={viewDetailsOpen}
        onClose={handleCloseDetails}
        warehouse={selectedWarehouse}
        getTypeChip={getTypeChip}
        getStatusChip={getStatusChip}
        onEdit={handleEditOpen}
      />



    </Box>
  );
}
