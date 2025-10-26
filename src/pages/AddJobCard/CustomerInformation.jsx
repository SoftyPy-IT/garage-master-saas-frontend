/* eslint-disable react/prop-types */
import { Grid, TextField, Autocomplete } from "@mui/material";
import { requiredFields } from "../../config/jobCardFormConfig";

const CustomerInformation = ({
    userDetails,
    register,
    errors,
    countries,
    countryCode,
    setCountryCode,
    phoneNumber,
    handlePhoneNumberChange,
    customerOwnerCountryCode,
    setCustomerOwnerCountryCode,
    ownerPhoneNumber,
    handleOwnerPhoneNumberChange
}) => (
    <div>
        <h3 className="mb-5 text-xl font-bold">Customer Information</h3>
        <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextField
                    fullWidth
                    label={<RequiredLabel text="Customer Name (T)" />}
                    {...register("customer_name", { required: requiredFields.customer_name })}
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

            <PhoneNumberField
                register={register}
                errors={errors}
                countries={countries}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                phoneNumber={phoneNumber}
                handlePhoneNumberChange={handlePhoneNumberChange}
                userDetails={userDetails}
                fieldName="customer_contact"
                label="Customer Contact Number (T)"
                placeholder="Customer Contact No (N)"
                required
            />

            <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextField
                    fullWidth
                    label="Customer Owner Name (T)"
                    {...register("customerOwnerName")}
                    focused={userDetails?.data?.customerOwnerName || ""}
                />
            </Grid>

            <PhoneNumberField
                register={register}
                errors={errors}
                countries={countries}
                countryCode={customerOwnerCountryCode}
                setCountryCode={setCustomerOwnerCountryCode}
                phoneNumber={ownerPhoneNumber}
                handlePhoneNumberChange={handleOwnerPhoneNumberChange}
                userDetails={userDetails}
                fieldName="customerOwnerPhone"
                label=""
                placeholder="Customer Owner Phone Number"
                showLabel={false}
            />

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

const PhoneNumberField = ({
    register,
    errors,
    countries,
    countryCode,
    setCountryCode,
    phoneNumber,
    handlePhoneNumberChange,
    userDetails,
    fieldName,
    label,
    placeholder,
    required = false,
    showLabel = true
}) => (
    <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={1}>
            <Grid item lg={2} md={12} sm={12} xs={12}>
                <Autocomplete
                    sx={{ marginRight: "2px" }}
                    fullWidth
                    freeSolo
                    options={countries}
                    getOptionLabel={(option) => option.label}
                    value={countryCode || userDetails?.data?.[`${fieldName}_country_code`]}
                    onChange={(event, newValue) => {
                        setCountryCode(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            fullWidth
                            {...params}
                            label="Select Country Code"
                            variant="outlined"
                            {...register(`${fieldName}_country_code`)}
                        />
                    )}
                />
            </Grid>
            <Grid item lg={10} md={12} sm={12} xs={12}>
                <TextField
                    {...register(fieldName, {
                        required: required ? requiredFields[fieldName] : false
                    })}
                    label={showLabel ? <RequiredLabel text={label} required={required} /> : ""}
                    variant="outlined"
                    fullWidth
                    type="tel"
                    value={phoneNumber || userDetails?.data?.[fieldName]}
                    onChange={handlePhoneNumberChange}
                    placeholder={placeholder}
                    focused={userDetails?.data?.[fieldName] || ""}
                    error={!!errors[fieldName]}
                    helperText={errors[fieldName]?.message}
                />
            </Grid>
        </Grid>
    </Grid>
);

const RequiredLabel = ({ text, required = true }) => (
    <>
        {text}
        {required && <span style={{ color: "red", fontSize: "25px" }}> *</span>}
    </>
);

export default CustomerInformation;