/* eslint-disable react/prop-types */
import {
  CalendarToday,
  Cancel,
  CheckCircle,
  Inventory,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Typography,
  Divider,
  Grid,
  InputAdornment,
  Button,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import { useUpdatePurchaseOrderMutation } from "../../../redux/api/purchaseOrderApi";
import GarageForm from "../../../components/form/Form";
import FormInput from "../../../components/form/Input";
import FormDatePicker from "../../../components/form/Datepicker";
import TASSelect from "../../../components/form/Select";
import { useAppOptions } from "../../../hooks/useAppOptions";
import { purchaseBtn } from "../../../utils/customStyle";
import Can from "../../../components/Can";

const ReceiveDialog = ({ open, purchaseId, onClose }) => {
  const theme = useTheme();
  const [updatePurchaseOrder, { isLoading }] = useUpdatePurchaseOrderMutation();
  const { performActionWithPermission, tenantDomain } = useAppOptions()

  const handleReceiveOrder = async (data) => {
    performActionWithPermission('dashboard/purchase-order', 'edit',
      async () => {
        try {
          const res = await updatePurchaseOrder({
            tenantDomain,
            id: purchaseId,
            ...data,
          }).unwrap();

          if (res.success) {
            toast.success("Order received successfully!");
            onClose();
          }
        } catch (error) {
          const errorMessage =
            error.data?.errorSources?.[0]?.message ||
            error.data?.err?.issues?.[0]?.message ||
            error.data?.message ||
            "Failed to receive order";

          toast.error(errorMessage);
        }

      }, "You don't have permission to update order"
    )
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* ✅ wrap form inside Dialog */}
      <GarageForm onSubmit={handleReceiveOrder}>
        <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.success.main,
              mr: 2,
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
            }}
          >
            <Inventory />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Receive Order
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormDatePicker
                fullWidth
                name="receiveDate"
                label="Receive Date"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TASSelect
                size="normal"
                name="status"
                items={["Pending", "Cancelled", "Shipped", "Received"]}
                label="Receive Status"
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                fullWidth
                label="Notes"
                multiline
                rows={3}
                name="note"
                InputProps={{ sx: { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            startIcon={<Cancel />}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Can action='edit'
            page="/dashboard/purchase-order">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              startIcon={<CheckCircle />}
              sx={purchaseBtn}
            >
              {isLoading ? "Processing..." : "Confirm Receipt"}
            </Button>
          </Can>

        </DialogActions>
      </GarageForm>
    </Dialog>
  );
};

export default ReceiveDialog;
