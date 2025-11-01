/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import {
  Button,
  Grid,

  CircularProgress,
} from "@mui/material";
import {
  Save as SaveIcon,
  BrandingWatermark,
} from "@mui/icons-material";
import { useCreateUnitMutation, useGetSingleUnitQuery, useUpdateUnitMutation } from "../../redux/api/unitApi";
import GarageForm from "../../components/form/Form";
import TASInput from "../../components/form/Input";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { usePermissions } from "../../context/PermissionContext";
import Can from "../../components/Can";
import GarageModal from "../../components/Share/Modal/GarageModal";
import Loading from "../../components/Loading/Loading";

export const UnitModal = ({ open, setOpen, unitId }) => {
  const [createUnit, { isLoading, isSuccess }] = useCreateUnitMutation();
  const [updateUnit, { isLoading: updateLoading }] = useUpdateUnitMutation();
  const { tenantDomain } = useTenantDomain();

  const { data, isLoading: singleLoading } = useGetSingleUnitQuery({ tenantDomain, id: unitId });
  const { performActionWithPermission } = usePermissions();
  const handleSubmit = async (formData) => {
    performActionWithPermission('/dashboard/unit', unitId ? 'edit' : 'create',
      async () => {
        try {

          let res
          if (unitId) {
            res = await updateUnit({
              id: unitId,
              ...formData,
              tenantDomain
            }).unwrap();
          } else {
            res = await createUnit({
              ...formData,
              tenantDomain
            }).unwrap();
          }

          if (res.success) {
            toast.success("Unit created successfully!");

            setOpen();
          }
        } catch (error) {
          toast.error(
            (error.message || "Something went wrong")
          );
        }
      }, `You don't permission to ${unitId ? 'update' : 'create'} unit`
    )
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const defaultValue = {
    unit: data?.data?.unit || '',
    short_name: data?.data?.short_name || ''
  }
  const title = ` ${unitId ? 'Update' : 'Create'} Unit`

  return (
    <>
      {
        singleLoading ? (
          <Loading />

        ) : (
          <GarageModal
            open={open}
            setOpen={setOpen}
            title={title}
            maxWidth="sm"
          >
            <GarageForm onSubmit={handleSubmit} defaultValues={defaultValue}>
              <Grid container spacing={3} sx={{ padding: 2 }}>

                <Grid item xs={12}>
                  <TASInput
                    name="unit"
                    label="Enter unit name"
                    placeholder="Enter unit name"
                    required
                    icon={BrandingWatermark}
                    iconPosition="start"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TASInput
                    name="short_name"
                    label="Enter short name"
                    placeholder="Enter short name"
                    required
                    icon={BrandingWatermark}
                    iconPosition="start"
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Can action={unitId ? 'edit' : 'create'}
                    page="/dashboard/unit">
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      sx={{
                        borderRadius: 100,

                        boxShadow: "0 4px 10px rgba(106, 27, 154, 0.3)",
                        py: 1.5,
                        textTransform: "none",
                        fontSize: "1rem",
                        color: "white",
                      }}
                    >
                      Create Unit
                    </Button>

                  </Can>

                </Grid>
              </Grid>
            </GarageForm>
          </GarageModal>
        )
      }

    </>
  );
};
