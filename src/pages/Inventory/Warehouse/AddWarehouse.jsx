/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Warehouse as WarehouseIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  Storage as CapacityIcon,
} from "@mui/icons-material";
import GarageForm from "../../../components/form/Form";
import TASInput from "../../../components/form/Input";
import TASSelect from "../../../components/form/Select";
import { cityOptions, warehouseTypes } from "../../../utils/options";
import TASAutocomplete from "../../../components/form/Autocomplete";
import FormTextArea from "../../../components/form/FormTextArea";
import {
  useCreateWarehouseMutation,
  useGetSingleWarehouseQuery,
  useUpdateWarehouseMutation,
} from "../../../redux/api/warehouseApi";
import { toast } from "react-toastify";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import { labelStyle } from "../../../utils/customStyle";

const AddWarehouseModal = ({ open, onClose, warehouseId }) => {
  const tenantDomain = useTenantDomain();
  const theme = useTheme();

  const [createWarehouse] = useCreateWarehouseMutation();
  const [updateWarehouse] = useUpdateWarehouseMutation();
  const { data: singleWarehouse, isLoading } = useGetSingleWarehouseQuery(
    { tenantDomain, id: warehouseId },
    { skip: !warehouseId }
  );

  const handleClose = () => {
    onClose(false);
  };

  const handleSubmit = async (data) => {
    const modifiedData = {
      ...data,
      city: data.city?.[0] || "",
    };

    try {
      if (warehouseId) {
        const res = await updateWarehouse({
          id: warehouseId,
          data: { ...modifiedData, tenantDomain },
        }).unwrap();
        if (res.success) {
          toast.success("Warehouse updated successfully!");
          handleClose();
        }
      } else {
        const res = await createWarehouse({
          tenantDomain,
          ...modifiedData,
        }).unwrap();
        if (res.success) {
          toast.success("Warehouse added successfully!");
          handleClose();
        }
      }
    } catch (error) {
      const apiError = error?.data || error;
      if (apiError?.errorSources?.length > 0) {
        apiError.errorSources.forEach((source) => {
          toast.error(`${source.path}: ${source.message}`);
        });
      } else if (apiError?.message) {
        toast.error(apiError.message);
      } else {
        toast.error("Failed to save warehouse");
      }
    }
  };

  const defaultValue = {
    name: singleWarehouse?.data?.name || "",
    address: singleWarehouse?.data?.address || "",
    city: [singleWarehouse?.data?.city] || [],
    manager: singleWarehouse?.data?.manager || "",
    phone: singleWarehouse?.data?.phone || "",
    type: singleWarehouse?.data?.type || "",
    capacity: singleWarehouse?.data?.capacity || "",
    openingDate: singleWarehouse?.data?.openingDate || "",
    status: singleWarehouse?.data?.status || "active",
    note: singleWarehouse?.data?.note || "",
  };

  return (
    <>
      {isLoading ? (
        <h3>Loading...</h3>
      ) : (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <GarageForm onSubmit={handleSubmit} defaultValues={defaultValue}>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {warehouseId ? "Update" : "Add New"} Warehouse
              </Typography>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pb: 4 }}>
              <Grid container spacing={3} sx={{ mt: 0 }}>
                {/* Warehouse Name (Required) */}
                <Grid item xs={12}>
                  <TASInput
                    name="name"
                    label={
                      <>
                        Warehouse Name
                        <span style={labelStyle}> *</span>
                      </>
                    }
                    icon={WarehouseIcon}
                    fullWidth
                    
                    placeholder="Main Warehouse"
                  />
                </Grid>

                {/* Address */}
                <Grid item xs={12}>
                  <TASInput
                    name="address"
                    label="Address"
                    icon={LocationOnIcon}
                    fullWidth
                    placeholder="123 Industrial Area"
                  />
                </Grid>

                {/* City */}
                <Grid item xs={12} md={6}>
                  <TASAutocomplete
                    name="city"
                    label="City"
                    options={cityOptions}
                    icon={LocationOnIcon}
                  />
                </Grid>

                {/* Store Manager */}
                <Grid item xs={12} md={6}>
                  <TASInput
                    name="manager"
                    label="Store Manager"
                    icon={PersonIcon}
                    fullWidth
                    placeholder="John Doe"
                  />
                </Grid>

                {/* Store Manager Phone */}
                <Grid item xs={12} md={6}>
                  <TASInput
                    name="phone"
                    label="Store Manager Phone"
                    icon={PhoneIcon}
                    fullWidth
                    placeholder="+1 234 567 890"
                  />
                </Grid>

                {/* Warehouse Type */}
                <Grid item xs={12} md={6}>
                  <TASSelect
                    name="type"
                    label="Warehouse Type"
                    items={warehouseTypes}
                    icon={BusinessIcon}
                  />
                </Grid>

                {/* Capacity */}
                <Grid item xs={12} md={6}>
                  <TASInput
                    name="capacity"
                    label="Capacity"
                    icon={CapacityIcon}
                    fullWidth
                    placeholder="5000 Units"
                  />
                </Grid>

                {/* Opening Date */}
                <Grid item xs={12} md={6}>
                  <TASInput
                    name="openingDate"
                    label="Opening Date"
                    type="date"
                    icon={EventIcon}
                    fullWidth
                  />
                </Grid>

                {/* Status */}
                <Grid item xs={12} md={6}>
                  <TASSelect
                    name="status"
                    label="Status"
                    items={["active", "inactive"]}
                    icon={BusinessIcon}
                  />
                </Grid>

                {/* Notes */}
                <Grid item xs={12}>
                  <FormTextArea
                    name="note"
                    label="Notes"
                    icon={DescriptionIcon}
                    fullWidth
                    placeholder="Special storage requirements or other notes..."
                    rows={4}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 3,
                  borderWidth: 2,
                  "&:hover": { borderWidth: 2 },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 3,
                  color: "white",
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.light} 90%)`,
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 40%, ${theme.palette.primary.light} 90%)`,
                  },
                }}
              >
                {warehouseId ? "Update Warehouse" : "Create Warehouse"}
              </Button>
            </DialogActions>
          </GarageForm>
        </Dialog>
      )}
    </>
  );
};

export default AddWarehouseModal;
