"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  CircularProgress,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import { FaTrash } from "react-icons/fa";
import { Search as SearchIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { 
  useDeleteContactUserMutation,
  useGetAllContactUserQuery 
} from "../../../redux/api/userApi";
import { StyledPaper } from "../../../utils";
import { StyledTableContainer } from "../../../utils/customStyle";

const ContactUserList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: userData, isLoading, refetch } = useGetAllContactUserQuery({});
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteContactUserMutation();

  const users = userData?.data?.users || [];

  const handleDeleteUser = async (userId) => {
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
        await deleteUser({id:userId}).unwrap();
        toast.success("Contact deleted successfully");
        refetch();
      } catch {
        toast.error("Failed to delete contact");
      }
    }
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

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const searchContent = `${user.garageName} ${user.email} ${user.phone} ${user.message}`.toLowerCase();
    return searchContent.includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1600, mx: "auto", p: 3, minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Contact Submissions
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Manage customer contact requests
          </Typography>
        </Paper>
      </motion.div>

      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Search contacts..."
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

      <StyledPaper elevation={4} sx={{ borderRadius: 3 }}>
        <StyledTableContainer sx={{
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
          }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.main" }}>
                {["Garage", "Email", "Phone", "Message", "Created", "Actions"].map(
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
                      <Typography fontWeight="medium">
                        {user.garageName}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Tooltip title={user.message}>
                        <Box sx={{ 
                          maxWidth: 200, 
                          whiteSpace: "nowrap", 
                          overflow: "hidden", 
                          textOverflow: "ellipsis" 
                        }}>
                          {user.message}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <Tooltip title="Delete Contact">
                        <IconButton
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={deleteLoading}
                          sx={{ color: "#f44336" }}
                        >
                          <FaTrash />
                        </IconButton>
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
    </Box>
  );
};

export default ContactUserList;