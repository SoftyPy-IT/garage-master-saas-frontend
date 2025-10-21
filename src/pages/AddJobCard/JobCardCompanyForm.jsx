/* eslint-disable react/prop-types */
import { Grid, TextField } from "@mui/material";
import PhoneInput from "../../../components/form/PhoneInput";

const JobCardCompanyForm = ({ userDetails, register, errors, setValue }) => {
  return (
    <div>
      <h3 className="mb-5 text-xl font-bold">Company Information</h3>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            {...register("company_name", {
              required: "Company name is required!",
            })}
            label="Company Name (T)"
            focused={userDetails?.data?.company_name || ""}
            error={!!errors.company_name}
            helperText={errors.company_name?.message}
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
            required={true}
            countryCode={userDetails?.data?.company_country_code}
            phone={userDetails?.data?.company_contact}
            error={errors.company_contact}
            helperText={errors.company_contact?.message}
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
            label="Company Owner Name (T)"
            {...register("companyOwnerName")}
            focused={userDetails?.data?.companyOwnerName || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <PhoneInput
            register={register}
            name="companyOwnerPhone"
            label="Company Owner Phone Number"
            countryCode={userDetails?.data?.companyOwnerCountryCode}
            phone={userDetails?.data?.companyOwnerPhone}
            setValue={setValue}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default JobCardCompanyForm;