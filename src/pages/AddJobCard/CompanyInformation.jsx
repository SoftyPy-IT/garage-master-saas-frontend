/* eslint-disable react/prop-types */
import { Grid, TextField, Autocomplete } from "@mui/material";
import { requiredFields } from "../../config/jobCardFormConfig";

const CompanyInformation = ({
    userDetails,
    register,
    errors,
    countries,
    countryCode,
    setCountryCode,
    phoneNumber,
    handlePhoneNumberChange,
    companyOwnerCountryCode,
    setCompanyOwnerCountryCode,
    ownerPhoneNumber,
    handleOwnerPhoneNumberChange
}) => (
    <div>
        <h3 className="mb-5 text-xl font-bold">Company Information</h3>
        <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextField
                    fullWidth
                    {...register("company_name", { required: requiredFields.company_name })}
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

            <PhoneNumberField
                register={register}
                errors={errors}
                countries={countries}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                phoneNumber={phoneNumber}
                handlePhoneNumberChange={handlePhoneNumberChange}
                userDetails={userDetails}
                fieldName="company_contact"
                label=""
                placeholder="Company Contact No"
                required
                showLabel={false}
            />

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

            <PhoneNumberField
                register={register}
                errors={errors}
                countries={countries}
                countryCode={companyOwnerCountryCode}
                setCountryCode={setCompanyOwnerCountryCode}
                phoneNumber={ownerPhoneNumber}
                handlePhoneNumberChange={handleOwnerPhoneNumberChange}
                userDetails={userDetails}
                fieldName="companyOwnerPhone"
                label=""
                placeholder="Company Owner Phone Number"
                showLabel={false}
            />
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
        <div className="flex items-center">
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
            <TextField
                {...register(fieldName, {
                    required: required ? requiredFields[fieldName] : false
                })}
                label={showLabel ? label : ""}
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
        </div>
    </Grid>
);

export default CompanyInformation;