/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Box,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

import Swal from "sweetalert2";
import LeaveRequestForm from "./LeaveRequestForm";

import { Pencil, Trash2 } from "lucide-react";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import { useDeleteLeaveRequestMutation } from "../../../redux/api/leaveRequestApi";
import Loading from "../../../components/Loading/Loading";
import {
  deleteIconStyle,
  editIconStyle,
  tableCellStyle,
  tableContainerStyle,
  tableHeaderStyle,
  tableStyle,
} from "../../../style/tableStyle";


const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "success";
    case "Rejected":
      return "error";
    case "Pending":
      return "warning";
    default:
      return "default";
  }
};

export default function EmployeeLeaveTable({
  setCurrentPage,
  SetSearch,
  data,
  isLoading,
  currentPage,
  performActionWithPermission
}) {
  const [open, setOpen] = useState(false);
  const [leaveRequestId, setLeaveRequestId] = useState(null);
  const { tenantDomain } = useTenantDomain();

  const handleOpen = (id) => {
    setLeaveRequestId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setLeaveRequestId(null);
  };

  const [deleteLeaveRequest] = useDeleteLeaveRequestMutation();

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteLeaveRequest(id).unwrap();
          Swal.fire(
            "Deleted!",
            "The leave request has been deleted.",
            "success"
          );
        } catch (error) {
          Swal.fire(
            "Error!",
            "An error occurred while deleting the leave request.",
            "error"
          );
        }
      }
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    SetSearch(value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const { meta, leaveRequests } = data?.data || { meta: {}, leaveRequests: [] };
  const { totalPage = 1 } = meta || {};

  const [columns, setColumns] = useState([
    "Employee Name",
    "Leave Type",
    "From",
    "To",
    "No of Days",
    "Reason",
    "Status",
    "Actions",
  ]);
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: { xs: 1.5, md: 3 } }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight="bold"
        sx={{
          fontSize: {
            xs: "24px",
            sm: "28px",
            md: "32px",
          },
          fontWeight: "bold",
        }}
      >
        Employee Leave Requests
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search leave requests..."
        onChange={handleSearch}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer sx={tableContainerStyle}>
        <section className="tableContainer overflow-x-auto">
          <Table
            className="customTable"
            sx={tableStyle}
            aria-label="employee leave table"
          >
            <TableHead>
              <TableRow sx={tableHeaderStyle}>
                {columns.map((column, index) => (
                  <TableCell sx={tableCellStyle} key={index}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRequests.map((row) => {
                return (
                  <TableRow
                    key={row._id}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "white" },
                      "&:nth-of-type(even)": { backgroundColor: "#F8F8F8" },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row?.employee?.full_name}
                    </TableCell>
                    <TableCell>{row.leaveType}</TableCell>
                    <TableCell>
                      {new Date(row.fromDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(row.toDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        color="primary"
                        label={`${row.noOfDays} days`}
                        variant="outlined"
                      ></Chip>
                    </TableCell>
                    <TableCell>{row.reason}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={getStatusColor(row.status)}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Box
                        component="span"
                        sx={editIconStyle}
                        onClick={() => handleOpen(row._id)}
                      >
                        <Pencil size={18} />
                      </Box>
                      <Box
                        component="span"
                        sx={deleteIconStyle}
                        onClick={() => handleDelete(row._id)}
                      >
                        <Trash2 size={18} />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </section>
      </TableContainer>
      <Pagination
        count={totalPage}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />

      {open && (
        <LeaveRequestForm
          open={open}
          setOpen={setOpen}
          performActionWithPermission={performActionWithPermission}
          onClose={handleClose}
          id={leaveRequestId}
          tenantDomain={tenantDomain}
        />
      )}
    </Paper>
  );
}
