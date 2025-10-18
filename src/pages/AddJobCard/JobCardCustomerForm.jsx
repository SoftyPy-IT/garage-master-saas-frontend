/* eslint-disable react/prop-types */
import { Grid, TextField, } from "@mui/material";
import PhoneInput from "../../../components/form/PhoneInput";
const JobCardCustomerForm = ({ userDetails, register, errors, setValue }) => {
  return (
    <div>
      <h3 className="mb-5 text-xl font-bold">Customer Information</h3>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label={
              <>
                Customer Name (T)
                <span style={{ color: "red", fontSize: "25px" }}> *</span>
              </>
            }
            {...register("customer_name", {
              required: "Customer name is required!",
            })}
            focused={userDetails?.data?.customer_name || ""}
            error={!!errors.customer_name}
            helperText={errors.customer_name?.message}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Customer Email Address (T)"
            {...register("customer_email")}
            type="email"
            focused={userDetails?.data?.customer_email || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Customer Address (T)"
            {...register("customer_address")}
            focused={userDetails?.data?.customer_address || ""}
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
          <TextField
            fullWidth
            label="Vehicle User Name (T)"
            {...register("vehicle_username")}
            focused={userDetails?.data?.vehicle_username || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <PhoneInput
            register={register}
            name="customer_contact"
            label="Customer Contact Number (T)"
            required={true}
            countryCode={userDetails?.data?.customer_country_code}
            phone={userDetails?.data?.customer_contact}
            error={errors.customer_contact}
            helperText={errors.customer_contact?.message}
            setValue={setValue}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Customer Owner Name (T)"
            {...register("customerOwnerName")}
            focused={userDetails?.data?.customerOwnerName || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <PhoneInput
            register={register}
            name="customerOwnerPhone"
            label="Customer Owner Phone Number"
            countryCode={userDetails?.data?.customerOwnerCountryCode}
            phone={userDetails?.data?.customerOwnerPhone}
            setValue={setValue}
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

export default JobCardCustomerForm;