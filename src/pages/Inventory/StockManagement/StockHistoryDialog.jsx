/* eslint-disable react/prop-types */
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material"
import {
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material"
import { alpha } from "@mui/material/styles"

// Mock stock history data
const mockStockHistory = [
  {
    id: 1,
    date: "2025-05-06T10:30:00.000Z",
    type: "in",
    quantity: 10,
    reason: "purchase",
    reference: "PO-2025-0123",
    notes: "Regular stock replenishment",
    user: "John Smith",
  },
  {
    id: 2,
    date: "2025-05-05T14:15:00.000Z",
    type: "out",
    quantity: 5,
    reason: "sale",
    reference: "INV-2025-0456",
    notes: "Customer order #45678",
    user: "Jane Doe",
  },
  {
    id: 3,
    date: "2025-05-03T09:45:00.000Z",
    type: "out",
    quantity: 2,
    reason: "damage",
    reference: "ADJ-2025-0078",
    notes: "Items damaged during handling",
    user: "Mike Johnson",
  },
  {
    id: 4,
    date: "2025-05-01T11:20:00.000Z",
    type: "in",
    quantity: 15,
    reason: "purchase",
    reference: "PO-2025-0120",
    notes: "Bulk order from supplier",
    user: "John Smith",
  },
  {
    id: 5,
    date: "2025-04-28T16:05:00.000Z",
    type: "out",
    quantity: 8,
    reason: "sale",
    reference: "INV-2025-0442",
    notes: "Customer order #45612",
    user: "Jane Doe",
  },
]

export function StockHistoryDialog({ open, onClose, product }) {
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  })
  if (!product) {
    return null
  }

  const { name = "Unknown Product", unit = "unit", originalData = {} } = product

  const unitDisplay = originalData.unit?.unit || unit

  // Apply filters
  const filteredHistory = mockStockHistory.filter((item) => {
    // Type filter
    const matchesType = typeFilter === "all" || item.type === typeFilter

    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      item.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchTerm.toLowerCase())

    // Date range filter
    let matchesDateRange = true
    if (dateRange.from) {
      matchesDateRange = matchesDateRange && new Date(item.date) >= new Date(dateRange.from)
    }
    if (dateRange.to) {
      matchesDateRange = matchesDateRange && new Date(item.date) <= new Date(dateRange.to)
    }

    return matchesType && matchesSearch && matchesDateRange
  })

  // Calculate summary
  const summary = {
    totalIn: filteredHistory.filter((item) => item.type === "in").reduce((sum, item) => sum + item.quantity, 0),
    totalOut: filteredHistory.filter((item) => item.type === "out").reduce((sum, item) => sum + item.quantity, 0),
  }

  const getReasonText = (reason) => {
    const reasonMap = {
      purchase: "Purchase",
      return: "Customer Return",
      adjustment: "Inventory Adjustment",
      transfer: "Transfer In",
      sale: "Sale",
      damage: "Damaged/Defective",
      loss: "Lost/Stolen",
      expired: "Expired",
    }
    return reasonMap[reason] || reason
  }

  // Safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleString()
    } catch (error) {
      return "N/A"
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          pb: 2,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          Stock History: {name}
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by reference, notes, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Movement Type</InputLabel>
                <Select value={typeFilter} label="Movement Type" onChange={(e) => setTypeFilter(e.target.value)}>
                  <MenuItem value="all">All Movements</MenuItem>
                  <MenuItem value="in">Stock In</MenuItem>
                  <MenuItem value="out">Stock Out</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2.5}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                InputLabelProps={{ shrink: true }}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} md={2.5}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                InputLabelProps={{ shrink: true }}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
          <Paper
            sx={{
              p: 2,
              flex: 1,
              display: "flex",
              alignItems: "center",
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
            }}
          >
            <TrendingUpIcon sx={{ color: "success.main", mr: 1, fontSize: 28 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Stock In
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "success.main" }}>
                +{summary.totalIn} {unitDisplay}
              </Typography>
            </Box>
          </Paper>

          <Paper
            sx={{
              p: 2,
              flex: 1,
              display: "flex",
              alignItems: "center",
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
            }}
          >
            <TrendingDownIcon sx={{ color: "error.main", mr: 1, fontSize: 28 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Stock Out
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "error.main" }}>
                -{summary.totalOut} {unitDisplay}
              </Typography>
            </Box>
          </Paper>

          <Paper
            sx={{
              p: 2,
              flex: 1,
              display: "flex",
              alignItems: "center",
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Net Change
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: summary.totalIn - summary.totalOut >= 0 ? "success.main" : "error.main",
                }}
              >
                {summary.totalIn - summary.totalOut > 0 ? "+" : ""}
                {summary.totalIn - summary.totalOut} {unitDisplay}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Reference</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Notes</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No stock movement history found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>
                      {item.type === "in" ? (
                        <Chip
                          icon={<TrendingUpIcon />}
                          label="Stock In"
                          size="small"
                          color="success"
                          sx={{
                            fontWeight: "medium",
                            bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                            color: "success.main",
                          }}
                        />
                      ) : (
                        <Chip
                          icon={<TrendingDownIcon />}
                          label="Stock Out"
                          size="small"
                          color="error"
                          sx={{
                            fontWeight: "medium",
                            bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                            color: "error.main",
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "medium",
                        color: item.type === "in" ? "success.main" : "error.main",
                      }}
                    >
                      {item.type === "in" ? "+" : "-"}
                      {item.quantity} {unitDisplay}
                    </TableCell>
                    <TableCell>{getReasonText(item.reason)}</TableCell>
                    <TableCell>{item.reference}</TableCell>
                    <TableCell>{item.notes}</TableCell>
                    <TableCell>{item.user}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid rgba(0, 0, 0, 0.1)" }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button variant="contained" color="primary" startIcon={<FilterListIcon />}>
          Export History
        </Button>
      </DialogActions>
    </Dialog>
  )
}
