/* eslint-disable react/prop-types */
import { Grid, TextField } from "@mui/material";
import PhoneInput from "../../../components/form/PhoneInput";

const JobCardShowroomForm = ({ userDetails, register, errors, setValue }) => {
  return (
    <div>
      <h3 className="mb-5 text-xl font-bold">Show Room Information</h3>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Show Room Name (T)"
            {...register("showRoom_name", {
              required: "Show room name is required!",
            })}
            focused={userDetails?.data?.showRoom_name || ""}
            error={!!errors.showRoom_name}
            helperText={errors.showRoom_name?.message}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Vehicle User Name (T)"
            {...register("vehicle_username")}
            focused={userDetails?.data?.vehicle_username || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Show Room Address (T)"
            {...register("showRoom_address")}
            focused={userDetails?.data?.showRoom_address || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            {...register("company_name")}
            label="Company Name (T)"
            focused={userDetails?.data?.company_name || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Company Address (T)"
            {...register("company_address")}
            focused={userDetails?.data?.company_address || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <PhoneInput
            register={register}
            name="company_contact"
            label="Company Contact Number"
            countryCode={userDetails?.data?.company_country_code}
            phone={userDetails?.data?.company_contact}
            setValue={setValue}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Company Email Address"
            {...register("company_email")}
            type="email"
            focused={userDetails?.data?.company_email || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Reference Name (T)"
            {...register("reference_name")}
            focused={userDetails?.data?.reference_name || ""}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default JobCardShowroomForm;