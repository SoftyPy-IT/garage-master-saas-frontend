"use client";

/* eslint-disable no-unused-vars */

import ReceiptIcon from "@mui/icons-material/Receipt";
import SearchIcon from "@mui/icons-material/Search";
import NoteIcon from "@mui/icons-material/Note";

import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import {
  useDeleteIncomeMutation,
  useGetAllIncomesQuery,
} from "../../redux/api/income";
import Loading from "../../components/Loading/Loading";
import { Pencil, Trash2 } from "lucide-react";
import { deleteIconStyle, editIconStyle } from "../../style/tableStyle";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useAccountSummaryQuery } from "../../redux/api/meta.api";
import IncomeStatisticsCard from "./IncomeStatisticsCard";

// Payment method icons
const getPaymentMethodIcon = (method) => {
  switch (method.toLowerCase()) {
    case "cash":
      return "💵";
    case "credit_card":
      return "💳";
    case "bank_transfer":
      return "🏦";
    case "check":
      return "📝";
    case "bkash":
    case "mobile_payment":
      return "📱";
    case "nagad":
      return "📲";
    default:
      return "💰";
  }
};

const IncomeList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 15;
  const tenantDomain = useTenantDomain();
  const { data: accountSummary } = useAccountSummaryQuery({ tenantDomain });

  const { data: allIncomes, isLoading: incomeLoading } = useGetAllIncomesQuery({
    tenantDomain,
    limit,
    page: currentPage,
    search: searchTerm,
  });

  const [deleteIncome, { isLoading: deleteLoading }] =
    useDeleteIncomeMutation();

  const deletePackage = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this income record?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await deleteIncome({ tenantDomain, id }).unwrap();
        swal("Deleted!", "Income record deleted successfully.", "success");
      } catch (error) {
        swal("Error", "An error occurred while deleting the record.", "error");
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (incomeLoading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        bgcolor: "white",
        padding: 3,
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <IncomeStatisticsCard accountSummary={accountSummary} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ReceiptIcon sx={{ fontSize: 28, color: "#42A1DA", mr: 1.5 }} />
          <Typography variant="h5" fontWeight="bold">
            Income History
          </Typography>
        </Box>

        <Link to="/dashboard/add-income">
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #42A1DA 0%, #2980b9 100%)",
              boxShadow: "0 4px 12px rgba(66, 161, 218, 0.3)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(135deg, #2980b9 0%, #1e6091 100%)",
              },
            }}
          >
            Add New Income
          </Button>
        </Link>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search by invoice, amount, or method..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flexGrow: 1, minWidth: "200px", maxWidth: "400px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#42A1DA" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        className="tableContainer"
        sx={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          borderRadius: 2,
          overflowX:"auto" 
          
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="income table">
          <TableHead
            sx={{
              background: "linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%)",
            }}
          >
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                SL
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Invoice
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Type
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Amount
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Payment Method
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Transaction
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Details
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Date
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allIncomes?.data?.incomes?.map((row, index) => {
              const globalIndex = (currentPage - 1) * limit + (index + 1);
              const hasNote = row.note && row.note.trim() !== "";

              // Determine income type
              let incomeType = "Other";
              if (row.serviceIncomeAmount > 0 && row.partsIncomeAmount > 0) {
                incomeType = "Service & Parts";
              } else if (row.serviceIncomeAmount > 0) {
                incomeType = "Service";
              } else if (row.partsIncomeAmount > 0) {
                incomeType = "Parts";
              }

              return (
                <TableRow
                  key={row._id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: "rgba(66, 161, 218, 0.04)" },
                    transition: "background-color 0.2s",
                  }}
                >
                  <TableCell align="center">{globalIndex}</TableCell>

                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", fontWeight: "medium" }}
                    >
                      {row.invoice_id?.invoice_no || "N/A"}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={incomeType}
                      size="small"
                      sx={{
                        backgroundColor: "#e6f2ff",
                        color: "#42A1DA",
                        fontWeight: "medium",
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          color: "#2980b9",
                        }}
                      >
                     ৳
                        {Number(row.totalAmount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Typography>

                      <Box sx={{ mt: 0.5, fontSize: "0.75rem" }}>
                       
                      
                        <Box fontWeight="bold">
                          Total Income: ${row.totalOtherIncome}
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ marginRight: "4px", fontSize: "1.2rem" }}>
                        {getPaymentMethodIcon(row.payment_method)}
                      </span>
                      <Typography
                        variant="body2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {row.payment_method}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Box>
                      <Typography variant="body2">
                        {row.transactionNumber || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        A/C: {row.accountNumber || "N/A"}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    {hasNote && (
                      <Tooltip title={row.note} arrow>
                        <NoteIcon fontSize="small" sx={{ color: "#42A1DA" }} />
                      </Tooltip>
                    )}
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="caption">
                        {row.income_items?.length || 0} items
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {new Date(row.date || row.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(row.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Link to={`/dashboard/update-income?id=${row?._id}`}>
                        <Tooltip title="Edit">
                          <Box sx={editIconStyle}>
                            <Pencil size={18} />
                          </Box>
                        </Tooltip>
                      </Link>

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          disabled={deleteLoading}
                          onClick={() => deletePackage(row?._id)}
                        >
                          <Box component="span" sx={deleteIconStyle}>
                            <Trash2 size={18} />
                          </Box>
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {allIncomes?.data?.incomes?.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 5,
          }}
        >
          <ReceiptIcon sx={{ fontSize: 48, color: "#d1d5db", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No income records found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Try changing your search or filter criteria
          </Typography>
          <Link to="/dashboard/add-income">
            <Button
              variant="outlined"
              sx={{
                borderColor: "#42A1DA",
                color: "#42A1DA",
                "&:hover": {
                  borderColor: "#2980b9",
                  backgroundColor: "rgba(66, 161, 218, 0.04)",
                },
              }}
            >
              Add Your First Income
            </Button>
          </Link>
        </Box>
      )}

      {allIncomes?.data?.incomes?.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {Math.min(currentPage * limit, allIncomes?.data?.meta?.total || 0)}{" "}
            of {allIncomes?.data?.meta?.total || 0} entries
          </Typography>

          <Pagination
            count={allIncomes?.data?.meta?.totalPage || 1}
            page={currentPage}
            color="primary"
            onChange={(_, page) => setCurrentPage(page)}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#42A1DA",
              },
              "& .Mui-selected": {
                backgroundColor: "rgba(66, 161, 218, 0.1) !important",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default IncomeList;
