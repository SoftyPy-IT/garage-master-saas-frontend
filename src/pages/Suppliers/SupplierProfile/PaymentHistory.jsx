/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  useTheme,
  alpha,
  Snackbar,
  Alert,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  Smartphone as MobileIcon
} from "@mui/icons-material";
import { format } from "date-fns";

const PaymentHistoryModal = ({ open, onClose, supplier, onUpdatePayment, onDeletePayment, onAddPayment }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [editFormData, setEditFormData] = useState({
    amount: "",
    method: "",
    transactionId: "",
    accountNumber: "",
    note: "",
    date: "",
  });
  const [newPayment, setNewPayment] = useState({
    amount: "",
    method: "Cash",
    transactionId: "",
    accountNumber: "",
    note: "",
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });
  const theme = useTheme();

  const handleEditClick = (payment) => {
    setCurrentPayment(payment);
    setEditFormData({
      amount: payment.amount.toString(),
      method: payment.method,
      transactionId: payment.transactionId || "",
      accountNumber: payment.accountNumber || "",
      note: payment.note || "",
      date: format(new Date(payment.date), "yyyy-MM-dd'T'HH:mm"),
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    onUpdatePayment(supplier._id, currentPayment._id, {
      ...editFormData,
      amount: parseFloat(editFormData.amount),
      date: new Date(editFormData.date).toISOString(),
    });
    setEditModalOpen(false);
  };

  const handleAddPaymentSubmit = () => {
    onAddPayment(supplier._id, {
      ...newPayment,
      amount: parseFloat(newPayment.amount),
      date: new Date(newPayment.date).toISOString(),
    });
    setAddModalOpen(false);
    setNewPayment({
      amount: "",
      method: "Cash",
      transactionId: "",
      accountNumber: "",
      note: "",
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    });
  };

  const handleDeleteClick = (paymentId) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      onDeletePayment(supplier._id, paymentId);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "PPpp");
  };

  const getMethodIcon = (method) => {
    const icons = {
      Cash: <MoneyIcon />,
      "Bank Transfer": <BankIcon />,
      Card: <CreditCardIcon />,
      Bkash: <MobileIcon />,
      Nagad: <MobileIcon />,
      Rocket: <MobileIcon />,
      Other: <PaymentIcon />,
    };
    return icons[method] || <PaymentIcon />;
  };

  const getMethodColor = (method) => {
    const colors = {
      Cash: "success",
      "Bank Transfer": "primary",
      Card: "secondary",
      Bkash: "info",
      Nagad: "warning",
      Rocket: "error",
      Other: "default",
    };
    return colors[method] || "default";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ 
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box display="flex" alignItems="center">
          <PaymentIcon sx={{ mr: 1 }} />
          Payment History - {supplier?.name}
        </Box>
       
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ mt: 2 }}>
          {(!supplier?.payments || supplier.payments.length === 0) ? (
            <Typography variant="body2" color="textSecondary" sx={{ py: 2, textAlign: 'center' }}>
              No payment history available
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Account Number</TableCell>
                    <TableCell>Note</TableCell>
                    {/* <TableCell>Actions</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {supplier.payments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell>৳{payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getMethodIcon(payment.method)}
                          label={payment.method}
                          color={getMethodColor(payment.method)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{payment.transactionId || "-"}</TableCell>
                      <TableCell>{payment.accountNumber || "-"}</TableCell>
                      <TableCell>{payment.note || "-"}</TableCell>
                      {/* <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(payment)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(payment._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>

      {/* Edit Payment Dialog */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <EditIcon /> Edit Payment
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={editFormData.amount}
                onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={editFormData.method}
                  label="Payment Method"
                  onChange={(e) => setEditFormData({ ...editFormData, method: e.target.value })}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="Bkash">Bkash</MenuItem>
                  <MenuItem value="Nagad">Nagad</MenuItem>
                  <MenuItem value="Rocket">Rocket</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Transaction ID"
                value={editFormData.transactionId}
                onChange={(e) => setEditFormData({ ...editFormData, transactionId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Account Number"
                value={editFormData.accountNumber}
                onChange={(e) => setEditFormData({ ...editFormData, accountNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date & Time"
                type="datetime-local"
                value={editFormData.date}
                onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Note"
                value={editFormData.note}
                onChange={(e) => setEditFormData({ ...editFormData, note: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Update Payment
          </Button>
        </DialogActions>
      </Dialog>

     
    </Dialog>
  );
};

export default PaymentHistoryModal;