/* eslint-disable react/prop-types */
import { Box, Grid, TextField, Autocomplete, Chip } from "@mui/material";
import InputMask from "react-input-mask";
import { cmDmOptions } from "../../constant";

const VehicleInfoForm = ({
  register,
  isEditMode,
  specificQuotation,
  getDataWithChassisNo,
  currentMileage,
  setCurrentMileage,
  setMileageChanged,
  errors,
  setSpecificQuotation,
  setGetDataWithChassisNo,
}) => {
  const handleMileageChange = (e) => {
    const newMileage = e.target.value;
    setCurrentMileage(newMileage);
    const lastMileage = isEditMode
      ? specificQuotation?.vehicle?.mileageHistory?.slice(-1)[0]?.mileage
      : getDataWithChassisNo?.mileageHistory?.slice(-1)[0]?.mileage;
    if (lastMileage && Number(newMileage) !== lastMileage) {
      setMileageChanged(true);
    } else if (!lastMileage && newMileage) {
      setMileageChanged(true);
    } else {
      setMileageChanged(false);
    }
  };

  const handleDeleteMileage = (index) => {
    if (isEditMode) {
      const updatedHistory = specificQuotation?.vehicle?.mileageHistory.filter(
        (_, i) => i !== index
      );
      setSpecificQuotation((prevState) => ({
        ...prevState,
        vehicle: {
          ...prevState.vehicle,
          mileageHistory: updatedHistory,
        },
      }));
    } else {
      const updatedHistory = getDataWithChassisNo?.mileageHistory.filter(
        (_, i) => i !== index
      );
      setGetDataWithChassisNo((prevState) => ({
        ...prevState,
        mileageHistory: updatedHistory,
      }));
    }
  };

  return (
    <Box>
      <h3 className="text-xl lg:text-3xl font-bold mb-5">Vehicle Info</h3>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Chassis No"
            {...register("chassis_no")}
            focused={
              isEditMode
                ? specificQuotation?.vehicle?.chassis_no
                : getDataWithChassisNo?.chassis_no
            }
            required
            InputProps={isEditMode ? { readOnly: true } : {}}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={3} md={4} sm={12} xs={12}>
              <Autocomplete
                sx={{ marginRight: "5px" }}
                freeSolo
                fullWidth
                id="free-solo-demo"
                options={cmDmOptions.map((option) => option.label)}
                value={
                  isEditMode
                    ? specificQuotation?.vehicle?.carReg_no
                    : getDataWithChassisNo?.carReg_no || ""
                }
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    label="Vehicle Reg No (New field)"
                    {...register("carReg_no")}
                  />
                )}
              />
            </Grid>
            <Grid item lg={9} md={8} sm={12} xs={12}>
              <InputMask
                mask="99-9999"
                maskChar={null}
                {...register("car_registration_no")}
                value={
                  isEditMode
                    ? specificQuotation?.vehicle?.car_registration_no
                    : getDataWithChassisNo?.car_registration_no || ""
                }
              >
                {(inputProps) => (
                  <TextField
                    fullWidth
                    {...inputProps}
                    {...register("car_registration_no")}
                    label="Car R (N)"
                    focused={
                      isEditMode
                        ? specificQuotation?.vehicle?.car_registration_no
                        : getDataWithChassisNo?.car_registration_no
                    }
                  />
                )}
              </InputMask>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Engine & CC"
            {...register("engine_no")}
            focused={
              isEditMode
                ? specificQuotation?.vehicle?.engine_no
                : getDataWithChassisNo?.engine_no
            }
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Vehicle Name"
            {...register("vehicle_name")}
            focused={
              isEditMode
                ? specificQuotation?.vehicle?.vehicle_name
                : getDataWithChassisNo?.vehicle_name
            }
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            {...register("mileage", {
              required: "Mileage is required!",
            })}
            label="Current Mileage (KM)"
            type="number"
            value={
              currentMileage ||
              (isEditMode
                ? specificQuotation?.vehicle?.mileageHistory?.length > 0
                  ? specificQuotation.vehicle.mileageHistory[
                      specificQuotation.vehicle.mileageHistory.length - 1
                    ].mileage
                  : specificQuotation?.vehicle?.mileage || ""
                : getDataWithChassisNo?.mileageHistory?.length > 0
                ? getDataWithChassisNo.mileageHistory[
                    getDataWithChassisNo.mileageHistory.length - 1
                  ].mileage
                : getDataWithChassisNo?.mileage || "")
            }
            onChange={handleMileageChange}
            error={!!errors.mileage}
            helperText={errors.mileage?.message}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <div className="mb-2">
            <strong>Mileage History:</strong>
            {(isEditMode
              ? specificQuotation?.vehicle?.mileageHistory
              : getDataWithChassisNo?.mileageHistory
            )?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {(isEditMode
                  ? specificQuotation.vehicle?.mileageHistory
                  : getDataWithChassisNo?.mileageHistory
                )?.map((entry, index) => (
                  <Chip
                    key={index}
                    label={`${entry.mileage} km (${new Date(
                      entry.date
                    ).toLocaleDateString()})`}
                    variant="outlined"
                    className="bg-gray-100 border-gray-300 text-gray-800"
                    onDelete={() => handleDeleteMileage(index)}
                    deleteIcon={
                      <span className="text-red-500 hover:text-red-700 cursor-pointer text-lg">
                        ×
                      </span>
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-1">No previous mileage records</p>
            )}
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VehicleInfoForm;
