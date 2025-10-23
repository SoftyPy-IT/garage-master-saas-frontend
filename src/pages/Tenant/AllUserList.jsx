"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  FaTrash,
  FaUsers,
  FaCheckCircle,
  FaLock,
  FaUserShield,
} from "react-icons/fa";
import { Search as SearchIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import AddUserModal from "./AddUserModal";
import {
  useDeleteUserMutation,
  useGetAllUserQuery,
} from "../../redux/api/userApi";
import { StatusChip, StyledTableContainer } from "../../utils/customStyle";
import { StyledPaper } from "../../utils";
import { useAppOptions } from "../../hooks/useAppOptions";
import Loading from "../../components/Loading/Loading";
import Can from "../../components/Can";

const AllUserList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const { tenantDomain, performActionWithPermission } = useAppOptions();

  const {
    data: userData,
    isLoading,
    refetch,
  } = useGetAllUserQuery({ tenantDomain });
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();
  const users = userData?.data || [];
  const filteredUsers = users.filter((user) =>
    [user.name, user.email].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDeleteUser = async (userId) => {
    performActionWithPermission(
      "/dashboard/all-user-list",
      "delete",
      async () => {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "This action cannot be undone!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        });
        if (result.isConfirmed) {
          try {
            await deleteUser({ tenantDomain, id: userId }).unwrap();
            toast.success("User deleted successfully");
            refetch();
          } catch {
            toast.error("Failed to delete user");
          }
        }
      },
      "You don't have permission to delete user."
    );
  };

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      : "N/A";

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    blocked: users.filter((u) => u.status === "blocked").length,
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        maxWidth: 1600,
        mx: "auto",
        paddingX: { xs: 0, md: 3 },
        paddingY: 2,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 4 },
            mb: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <FaUserShield size={40} />
              <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {/* User Management */}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Manage your team members and their permissions
                </Typography>
              </Box>
            </Box>
            <Box>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddUserOpen(true)}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Add User
              </motion.button>
            </Box>
          </Box>
        </Paper>
      </motion.div>

      <Grid container spacing={3} mb={4}>
        {[
          {
            label: "Total Users",
            count: stats.total,
            icon: <FaUsers />,
            color: "#764ba2",
          },
          {
            label: "Active Users",
            count: stats.active,
            icon: <FaCheckCircle />,
            color: "#45a049",
          },
          {
            label: "Blocked Users",
            count: stats.blocked,
            icon: <FaLock />,
            color: "#d32f2f",
          },
        ].map(({ label, count, icon, color }, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  color: "white",
                  background: color,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {count}
                  </Typography>
                  <Typography variant="body1">{label}</Typography>
                </Box>
                <Box>{icon}</Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <StyledPaper elevation={4} sx={{ borderRadius: 3, p: { xs: 1, md: 3 } }}>
        <StyledTableContainer
          sx={{
            width: "100%",
            overflowX: "auto",
            borderRadius: 2,
            "&::-webkit-scrollbar": {
              height: 6,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#999",
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.main" }}>
                {["Name", "Email", "Role", "Status", "Created", "Actions"].map(
                  (head, i) => (
                    <TableCell
                      key={i}
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      {head}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography>{user.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusChip
                        label={user.status === "active" ? "Active" : "Blocked"}
                        status={user.status}
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Tooltip title="Delete User">
                        <Can page="/dashboard/all-user-list" action="delete">
                          <IconButton
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={deleteLoading}
                            sx={{ color: "#f44336" }}
                          >
                            <FaTrash />
                          </IconButton>
                        </Can>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>

      <AddUserModal
        tenantDomain={tenantDomain}
        performActionWithPermission={performActionWithPermission}
        open={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSuccess={refetch}
      />
    </Box>
  );
};

export default AllUserList;
