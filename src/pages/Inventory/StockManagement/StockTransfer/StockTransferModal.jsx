// StockManagement/StockTransfer/StockTransferModal.js
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";
import {  useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Button,
  LinearProgress,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useTenantDomain } from "../../../../hooks/useTenantDomain";
import { useGetAllStocksQuery } from "../../../../redux/api/stocksApi";
import { useGetAllWarehousesQuery } from "../../../../redux/api/warehouseApi";

import StockTransferForm from "./StockTransferForm";
import useStockTransfer from "../../../../hooks/useStockTransfer";

function StockTransferModal({
  open,
  onClose,
  onSubmit,
  employees,
}) {
  const theme = useTheme();
  const tenantDomain = useTenantDomain();

  const { data: stockData, isLoading: stockLoading } =
    useGetAllStocksQuery({
      tenantDomain,
      page: 1,
      limit: 100,
      searchTerm: "",
    });
  const { data: warehouseResponse, isLoading: warehouseLoading } =
    useGetAllWarehousesQuery({
      tenantDomain,
      page: 1,
      limit: 100,
      searchTerm: "",
    });
  const {
    formData,
    transferItems,
    errors,
    warehouses,
    availableProducts,
    formSubmitting,
    handleInputChange,
    handleSelectChange,
    handleAddItem,
    handleRemoveItem,
    handleProductChange,
    handleQuantityChange,
    handleNoteChange,
    handleSubmit,
    getWarehouseName,
    resetForm,
  } = useStockTransfer({ employees, stockData, warehouseResponse, tenantDomain });

  // Safe close function to prevent errors
  const handleSafeClose = useCallback(() => {
    resetForm();
    if (onClose && typeof onClose === "function") {
      setTimeout(() => {
        onClose();
      }, 0);
    }
  }, [onClose, resetForm]);


  const handleFormSubmit = async () => {
    try {

      await handleSubmit((result) => {
        if (result.success) {
          handleSafeClose();
          if (onSubmit && typeof onSubmit === "function") {
            onSubmit(result.data);
          }
        }
      });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const isLoading = stockLoading || warehouseLoading || formSubmitting;

  return (
    <Dialog
      open={open}
      onClose={handleSafeClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          New Stock Transfer
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pb: 4 }}>
        {isLoading ? (
          <LinearProgress sx={{ my: 4 }} />
        ) : (
          <StockTransferForm
            formData={formData}
            transferItems={transferItems}
            errors={errors}
            warehouses={warehouses}
            availableProducts={availableProducts}
            formSubmitting={formSubmitting}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleAddItem={handleAddItem}
            handleRemoveItem={handleRemoveItem}
            handleProductChange={handleProductChange}
            handleQuantityChange={handleQuantityChange}
            handleNoteChange={handleNoteChange}
            handleSubmit={handleSubmit}
            getWarehouseName={getWarehouseName}
            theme={theme}
          />
        )}
        {formSubmitting && <LinearProgress sx={{ mt: 3 }} />}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleSafeClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            py: 1,
            px: 3,
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleFormSubmit} 
          variant="contained"
          disabled={
            isLoading ||
            formSubmitting ||
            !formData.fromLocation ||
            !formData.toLocation ||
            !formData.transferredBy ||
            !transferItems ||
            transferItems.length === 0 ||
            transferItems.some((item) => !item || !item.product) ||
            transferItems.some(
              (item) => item && item.product && item.quantity <= 0
            ) ||
            Object.keys(errors).length > 0
          }
          sx={{
            borderRadius: 2,
            py: 1,
            px: 3,
            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          }}
        >
          Complete Transfer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StockTransferModal;