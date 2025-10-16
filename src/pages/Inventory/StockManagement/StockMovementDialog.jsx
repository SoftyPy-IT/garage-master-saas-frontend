/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  Divider,
  IconButton,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export function StockMovementDialog({ open, onClose, product, onSuccess }) {
  if (!product) {
    return null;
  }

  const {
    name = "Unknown Product",
    code = "N/A",
    category = "Uncategorized",
    quantity = 0,
    unit = "unit",
    originalData = {},
  } = product;

  const location = originalData.storageLocation || "N/A";
  const unitDisplay = originalData.unit?.unit || unit;

  const [movementType, setMovementType] = useState("in");
  const [movementQuantity, setMovementQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // Validate
    if (movementQuantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (!reason) {
      setError("Please select a reason for the stock movement");
      return;
    }
    setTimeout(() => {
      onSuccess(
        `Stock ${movementType === "in" ? "added" : "removed"} successfully`
      );
      onClose();
      resetForm();
    }, 500);
  };

  const resetForm = () => {
    setMovementType("in");
    setMovementQuantity(1);
    setReason("");
    setReference("");
    setNotes("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          Adjust Stock: {name}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Product Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Product Code:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {code}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Current Stock:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {quantity} {unitDisplay}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Category:
                  </Typography>
                  <Typography variant="body1">{category}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Location:
                  </Typography>
                  <Typography variant="body1">{location}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Stock Movement Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Movement Type</InputLabel>
                <Select
                  value={movementType}
                  label="Movement Type"
                  onChange={(e) => setMovementType(e.target.value)}
                >
                  <MenuItem value="in">Stock In</MenuItem>
                  <MenuItem value="out">Stock Out</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Quantity"
                type="number"
                fullWidth
                value={movementQuantity}
                onChange={(e) =>
                  setMovementQuantity(Number.parseInt(e.target.value) || 0)
                }
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2">{unitDisplay}</Typography>
                  ),
                }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Reason</InputLabel>
                <Select
                  value={reason}
                  label="Reason"
                  onChange={(e) => setReason(e.target.value)}
                >
                  {movementType === "in" ? (
                    <>
                      <MenuItem value="purchase">Purchase</MenuItem>
                      <MenuItem value="return">Customer Return</MenuItem>
                      <MenuItem value="adjustment">
                        Inventory Adjustment
                      </MenuItem>
                      <MenuItem value="transfer">Transfer In</MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem value="sale">Sale</MenuItem>
                      <MenuItem value="damage">Damaged/Defective</MenuItem>
                      <MenuItem value="loss">Lost/Stolen</MenuItem>
                      <MenuItem value="transfer">Transfer Out</MenuItem>
                      <MenuItem value="expired">Expired</MenuItem>
                    </>
                  )}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Additional Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Reference Number"
                  fullWidth
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Invoice, PO, or other reference"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  fullWidth
                  multiline
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes or comments"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{ px: 3, py: 2, borderTop: "1px solid rgba(0, 0, 0, 0.1)" }}
      >
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color={movementType === "in" ? "success" : "primary"}
        >
          {movementType === "in" ? "Add Stock" : "Remove Stock"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
