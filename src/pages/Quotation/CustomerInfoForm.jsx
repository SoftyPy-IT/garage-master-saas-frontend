/* eslint-disable react/prop-types */
import { Box, Grid, TextField, Autocomplete } from "@mui/material";
import { countries } from "../../constant";

const CustomerInfoForm = ({
  register,
  isEditMode,
  specificQuotation,
  jobCardData,
  countryCode,
  setCountryCode,
  phoneNumber,
  handlePhoneNumberChange,
  setPhoneNumber,
}) => {
  return (
    <Box>
      <h3 className="text-xl lg:text-3xl font-bold mb-5">Customer Info</h3>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Job Card No"
            required
            focused={
              isEditMode ? specificQuotation?.job_no : jobCardData?.data?.job_no
            }
            defaultValue={
              isEditMode
                ? specificQuotation?.job_no
                : jobCardData?.data?.job_no || ""
            }
            InputProps={isEditMode ? { readOnly: true } : {}}
            {...register("job_no")}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Customer Id"
            {...register("Id")}
            focused={isEditMode ? specificQuotation?.Id : jobCardData?.data?.Id}
            required
            InputProps={isEditMode ? { readOnly: true } : {}}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Company"
            focused={
              isEditMode
                ? specificQuotation?.customer?.company_name ||
                  specificQuotation?.company?.company_name ||
                  specificQuotation?.showRoom?.company_name
                : jobCardData?.data?.customer?.company_name ||
                  jobCardData?.data?.company?.company_name ||
                  jobCardData?.data?.showRoom?.company_name
            }
            {...register("company_name")}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {!isEditMode && !jobCardData?.data && (
            <TextField
              fullWidth
              label="Customer"
              focused={jobCardData?.data?.customer?.customer_name}
              {...register("customer_name")}
            />
          )}
          {(!isEditMode && jobCardData?.data?.user_type === "customer") ||
          (isEditMode && specificQuotation?.user_type === "customer") ? (
            <TextField
              fullWidth
              label="Customer"
              focused={
                isEditMode
                  ? specificQuotation?.customer?.customer_name
                  : jobCardData?.data?.customer?.customer_name
              }
              {...register("customer_name")}
            />
          ) : null}
          {(!isEditMode &&
            (jobCardData?.data?.user_type === "company" ||
              jobCardData?.data?.user_type === "showRoom")) ||
          (isEditMode &&
            (specificQuotation?.user_type === "company" ||
              specificQuotation?.user_type === "showRoom")) ? (
            <TextField
              fullWidth
              label="Customer"
              focused={
                isEditMode
                  ? specificQuotation?.company?.vehicle_username ||
                    specificQuotation?.showRoom?.vehicle_username
                  : jobCardData?.data?.company?.vehicle_username ||
                    jobCardData?.data?.showRoom?.vehicle_username
              }
              {...register("vehicle_username")}
            />
          ) : null}
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid container spacing={1}>
            <Grid item lg={3} md={4} sm={12} xs={12}>
              <Autocomplete
                fullWidth
                freeSolo
                options={countries}
                getOptionLabel={(option) => option.label}
                value={countryCode}
                onChange={(event, newValue) => {
                  setCountryCode(newValue);
                  setPhoneNumber("");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    {...register("customer_country_code")}
                    label="Select Country Code"
                    variant="outlined"
                    focused={
                      isEditMode
                        ? specificQuotation?.customer?.customer_country_code ||
                          specificQuotation?.company?.company_country_code ||
                          specificQuotation?.showRoom?.company_country_code
                        : jobCardData?.data?.customer?.customer_country_code
                    }
                  />
                )}
              />
            </Grid>
            <Grid item lg={9} md={8} sm={12} xs={12}>
              {!isEditMode && !jobCardData?.data && (
                <TextField
                  {...register("customer_contact")}
                  variant="outlined"
                  fullWidth
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="Customer Contact No (N)"
                />
              )}
              {(!isEditMode && jobCardData?.data?.user_type === "customer") ||
              (isEditMode && specificQuotation?.user_type === "customer") ? (
                <TextField
                  {...register("customer_contact")}
                  variant="outlined"
                  fullWidth
                  type="tel"
                  value={
                    phoneNumber
                      ? phoneNumber
                      : isEditMode
                      ? specificQuotation?.customer?.customer_contact
                      : jobCardData?.data?.customer?.customer_contact
                  }
                  onChange={handlePhoneNumberChange}
                  placeholder="Customer Contact No (N)"
                  focused={
                    isEditMode
                      ? specificQuotation?.customer?.customer_contact
                      : jobCardData?.data?.customer?.customer_contact
                  }
                />
              ) : null}
              {(!isEditMode &&
                (jobCardData?.data?.user_type === "company" ||
                  jobCardData?.data?.user_type === "showRoom")) ||
              (isEditMode &&
                (specificQuotation?.user_type === "company" ||
                  specificQuotation?.user_type === "showRoom")) ? (
                <TextField
                  {...register("company_contact")}
                  variant="outlined"
                  fullWidth
                  type="tel"
                  value={
                    phoneNumber
                      ? phoneNumber
                      : isEditMode
                      ? specificQuotation?.company?.company_contact ||
                        specificQuotation?.showRoom?.company_contact
                      : jobCardData?.data?.company?.company_contact
                  }
                  onChange={handlePhoneNumberChange}
                  placeholder="Company Contact No (N)"
                  focused={
                    isEditMode
                      ? specificQuotation?.company?.company_contact ||
                        specificQuotation?.showRoom?.company_contact
                      : jobCardData?.data?.company?.company_contact
                  }
                />
              ) : null}
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {!isEditMode && !jobCardData?.data && (
            <TextField
              fullWidth
              label="Address"
              {...register("customer_address")}
            />
          )}
          {(!isEditMode && jobCardData?.data?.user_type === "customer") ||
          (isEditMode && specificQuotation?.user_type === "customer") ? (
            <TextField
              fullWidth
              label="Address"
              {...register("customer_address")}
              focused={
                isEditMode
                  ? specificQuotation?.customer?.customer_address
                  : jobCardData?.data?.customer?.customer_address
              }
            />
          ) : null}
          {(!isEditMode && jobCardData?.data?.user_type === "company") ||
          (isEditMode && specificQuotation?.user_type === "company") ? (
            <TextField
              fullWidth
              label="Address"
              {...register("company_address")}
              focused={
                isEditMode
                  ? specificQuotation?.company?.company_address
                  : jobCardData?.data?.company?.company_address
              }
            />
          ) : null}
          {(!isEditMode && jobCardData?.data?.user_type === "showRoom") ||
          (isEditMode && specificQuotation?.user_type === "showRoom") ? (
            <TextField
              fullWidth
              label="Address"
              {...register("showRoom_address")}
              focused={
                isEditMode
                  ? specificQuotation?.showRoom?.showRoom_address
                  : jobCardData?.data?.showRoom?.showRoom_address
              }
            />
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerInfoForm;
