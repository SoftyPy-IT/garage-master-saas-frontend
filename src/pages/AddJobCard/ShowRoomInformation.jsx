/* eslint-disable react/prop-types */
import { Grid, TextField, Autocomplete } from "@mui/material";
import { requiredFields } from "../../config/jobCardFormConfig";

const ShowRoomInformation = ({
    userDetails,
    register,
    errors,
    countries,
    countryCode,
    setCountryCode,
    phoneNumber,
    handlePhoneNumberChange
}) => (
    <div>
        <h3 className="mb-5 text-xl font-bold">Show Room Information</h3>
        <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextField
                    fullWidth
                    label="Show Room Name (T)"
                    {...register("showRoom_name", { required: requiredFields.showRoom_name })}
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
                label="Company Contact No (N)"
                placeholder="Enter phone number"
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
    countries,
    countryCode,
    setCountryCode,
    phoneNumber,
    handlePhoneNumberChange,
    userDetails,
    fieldName,
    label,
    placeholder
}) => (
    <Grid item lg={12} md={12} sm={12} xs={12}>
        <div className="flex items-center my-1">
            <Autocomplete
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
                {...register(fieldName)}
                label={label}
                variant="outlined"
                fullWidth
                type="tel"
                value={phoneNumber || userDetails?.data?.[fieldName]}
                onChange={handlePhoneNumberChange}
                placeholder={placeholder}
                focused={userDetails?.data?.[fieldName] || ""}
            />
        </div>
    </Grid>
);

export default ShowRoomInformation;