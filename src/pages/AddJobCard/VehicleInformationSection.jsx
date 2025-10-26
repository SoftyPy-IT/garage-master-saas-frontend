/* eslint-disable react/prop-types */
import { Box, Grid, TextField, Autocomplete, Chip } from "@mui/material";
import InputMask from "react-input-mask";
import { filterVehicleModels, filterVehiclesByBrand } from "../../constant/jobCard";
import { carBrands, cmDmOptions, countries, fuelType, vehicleTypes } from "../../constant/Vehicle.constant";
import { requiredFields } from "../../config/jobCardFormConfig";

const VehicleInformationSection = ({
    userDetails,
    getDataWithChassisNo,
    register,
    errors,
    handleChassisChange,
    filteredVehicles,
    setFilteredVehicles,
    yearSelectInput,
    setYearSelectInput,
    filteredOptions,
    setFilteredOptions,
    setVModelValue,
    currentMileage,
    setCurrentMileage,
    setMileageChanged,
    driverCountryCode,
    setDriverCountryCode,
    driverPhoneNumber,
    handleDriverPhoneNumberChange
}) => {
    const handleBrandChange = (_, newValue) => {
        const filtered = filterVehiclesByBrand(newValue);
        setFilteredVehicles(filtered);
    };

    const handleYearSelectInput = (event) => {
        const value = event.target.value;
        if (/^\d{0,4}$/.test(value)) {
            setYearSelectInput(value);
            const filtered = filterVehicleModels(value);
            setFilteredOptions(filtered);
        }
    };

    const handleOptionClick = (option) => {
        setYearSelectInput(option.label);
        setFilteredOptions([]);
        setVModelValue("vehicle_model", option.label);
    };

    const handleMileageChange = (e) => {
        const newMileage = e.target.value;
        setCurrentMileage(newMileage);

        const lastMileage = getDataWithChassisNo?.mileageHistory?.slice(-1)[0]?.mileage;

        if (lastMileage && Number(newMileage) !== lastMileage) {
            setMileageChanged(true);
        } else if (!lastMileage && newMileage) {
            setMileageChanged(true);
        } else {
            setMileageChanged(false);
        }
    };

    return (
        <Box>
            <h3 className="mb-5 text-xl font-bold">Vehicle Information</h3>
            <Grid container spacing={2}>
                <ChassisNumberField
                    userDetails={userDetails}
                    getDataWithChassisNo={getDataWithChassisNo}
                    register={register}
                    errors={errors}
                    handleChassisChange={handleChassisChange}
                />

                <VehicleRegistrationFields
                    getDataWithChassisNo={getDataWithChassisNo}
                    register={register}
                />

                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                        fullWidth
                        {...register("engine_no")}
                        label="ENGINE NO & CC (T&N)"
                        focused={getDataWithChassisNo?.engine_no || ""}
                    />
                </Grid>

                <VehicleBrandField
                    getDataWithChassisNo={getDataWithChassisNo}
                    register={register}
                    carBrands={carBrands}
                    handleBrandChange={handleBrandChange}
                />

                <VehicleNameField
                    getDataWithChassisNo={getDataWithChassisNo}
                    register={register}
                    errors={errors}
                    filteredVehicles={filteredVehicles}
                />

                <VehicleModelField
                    yearSelectInput={yearSelectInput}
                    handleYearSelectInput={handleYearSelectInput}
                    filteredOptions={filteredOptions}
                    handleOptionClick={handleOptionClick}
                    register={register}
                />

                <VehicleCategoryField
                    getDataWithChassisNo={getDataWithChassisNo}
                    register={register}
                    vehicleTypes={vehicleTypes}
                />

                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <TextField
                        fullWidth
                        {...register("color_code")}
                        label="Color & Code (T&N)"
                        focused={getDataWithChassisNo?.color_code || ""}
                    />
                </Grid>

                <MileageField
                    register={register}
                    errors={errors}
                    currentMileage={currentMileage}
                    handleMileageChange={handleMileageChange}
                />

                <MileageHistory getDataWithChassisNo={getDataWithChassisNo} />

                <FuelTypeField
                    getDataWithChassisNo={getDataWithChassisNo}
                    register={register}
                    fuelType={fuelType}
                />

                <DriverInformation
                    userDetails={userDetails}
                    register={register}
                    countries={countries}
                    driverCountryCode={driverCountryCode}
                    setDriverCountryCode={setDriverCountryCode}
                    driverPhoneNumber={driverPhoneNumber}
                    handleDriverPhoneNumberChange={handleDriverPhoneNumberChange}
                />
            </Grid>
        </Box>
    );
};

const ChassisNumberField = ({ userDetails, getDataWithChassisNo, register, errors, handleChassisChange }) => (
    <Grid item lg={12} md={12} sm={12} xs={12}>
        {userDetails?.data?.vehicles ? (
            <Autocomplete
                fullWidth
                disableClearable
                freeSolo
                onChange={handleChassisChange}
                options={userDetails.data.vehicles.map(option => option?.chassis_no)}
                renderInput={(params) => (
                    <TextField
                        fullWidth
                        {...params}
                        label={<RequiredLabel text="Select Chassis no (N)" />}
                        {...register("chassis_no", { required: requiredFields.chassis_no })}
                        error={!!errors.chassis_no}
                        helperText={errors.chassis_no?.message}
                        inputProps={{
                            ...params.inputProps,
                            maxLength: getDataWithChassisNo?.chassis_no?.length || 30,
                        }}
                    />
                )}
            />
        ) : (
            <TextField
                fullWidth
                {...register("chassis_no", { required: requiredFields.chassis_no })}
                label="Chassis no"
                focused={getDataWithChassisNo?.chassis_no || ""}
                error={!!errors.chassis_no}
                helperText={errors.chassis_no?.message}
            />
        )}
    </Grid>
);

const VehicleRegistrationFields = ({ getDataWithChassisNo, register }) => (
    <Grid item lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={1}>
            <Grid item lg={2} md={12} sm={12} xs={12}>
                <Autocomplete
                    sx={{ marginRight: "5px" }}
                    freeSolo
                    fullWidth
                    value={getDataWithChassisNo?.carReg_no || ""}
                    options={cmDmOptions.map(option => option?.label)}
                    renderInput={(params) => (
                        <TextField
                            fullWidth
                            {...params}
                            label="Vehicle Reg No"
                            {...register("carReg_no")}
                            focused={getDataWithChassisNo?.carReg_no || ""}
                        />
                    )}
                />
            </Grid>
            <Grid item lg={10} md={12} sm={12} xs={12}>
                <InputMask
                    mask="99-9999"
                    maskChar={null}
                    {...register("car_registration_no")}
                >
                    {(inputProps) => (
                        <TextField
                            {...inputProps}
                            {...register("car_registration_no")}
                            fullWidth
                            label={<RequiredLabel text="Car R (N)" />}
                            focused={getDataWithChassisNo?.car_registration_no || ""}
                        />
                    )}
                </InputMask>
            </Grid>
        </Grid>
    </Grid>
);

const VehicleBrandField = ({ getDataWithChassisNo, register, carBrands, handleBrandChange }) => (
    <Grid item lg={12} md={12} sm={12} xs={12}>
        <Autocomplete
            fullWidth
            freeSolo
            onChange={handleBrandChange}
            value={getDataWithChassisNo?.vehicle_brand || ""}
            options={carBrands.map(option => option.label)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Vehicle Brand"
                    {...register("vehicle_brand")}
                />
            )}
        />
    </Grid>
);

const VehicleNameField = ({ getDataWithChassisNo, register, errors, filteredVehicles }) => (
    <Grid item lg={12} md={12} sm={12} xs={12}>
        <Autocomplete
            fullWidth
            freeSolo
            value={getDataWithChassisNo?.vehicle_name || ""}
            options={filteredVehicles.map(option => option.value)}
            renderInput={(params) => (
                <TextField
                    fullWidth
                    {...params}
                    label="Vehicle Name"
                    {...register("vehicle_name")}
                    error={!!errors.vehicle_name}
                    helperText={errors.vehicle_name?.message}
                />
            )}
            getOptionLabel={(option) => option || ""}
        />
    </Grid>
);

const VehicleModelField = ({ yearSelectInput, handleYearSelectInput, filteredOptions, handleOptionClick, register }) => (
    <Grid item lg={12} md={12} sm={12} xs={12}>
        <div className="mt-3 relative">
            <input
                onInput={handleYearSelectInput}
                {...register("vehicle_model")}
                type="text"
                className="border border-[#11111163] mb-5 w-[100%] h-14 p-3 rounded-md"
                placeholder="Vehicle Model"
                value={yearSelectInput}
            />
            {yearSelectInput && (
                <ul className="options-list">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </Grid>
);

const VehicleCategoryField = ({ getDataWithChassisNo, register, vehicleTypes }) => (
    <Grid item lg={12} md={12} sm={12} xs={12}>
        <Autocomplete
            fullWidth
            freeSolo
            value={getDataWithChassisNo?.vehicle_category || ""}
            options={vehicleTypes.map(option => option.label)}
            renderInput={(params) => (
                <TextField
                    fullWidth
                    {...params}
                    label="Vehicle Categories"
                    {...register("vehicle_category")}
                    focused={getDataWithChassisNo?.vehicle_category || ""}
                />
            )}
        />
    </Grid>
);

const MileageField = ({ register, errors, currentMileage, handleMileageChange }) => (
    <Grid item lg={12} md={12} sm={12} xs={12}>
        <TextField
            fullWidth
            {...register("mileage", { required: requiredFields.mileage })}
            label="Current Mileage (KM)"
            type="number"
            value={currentMileage}
            onChange={handleMileageChange}
            error={!!errors.mileage}
            helperText={errors.mileage?.message}
        />
    </Grid>
);

const MileageHistory = ({ getDataWithChassisNo }) => (
    <Grid item lg={12} md={12} sm={12} xs={12}>
        <div className="mb-2">
            <strong>Mileage History:</strong>
            {getDataWithChassisNo?.mileageHistory?.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                    {getDataWithChassisNo.mileageHistory.map((entry, index) => (
                        <Chip
                            key={index}
                            label={`${entry.mileage} km (${new Date(entry.date).toLocaleDateString()})`}
                            variant="outlined"
                            className="bg-gray-100 border-gray-300 text-gray-800"
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 mt-1">No previous mileage records</p>
            )}
        </div>
    </Grid>
);

const FuelTypeField = ({ getDataWithChassisNo, register, fuelType }) => (
    <Grid item lg={12} md={12} sm={12} xs={12}>
        <Autocomplete
            fullWidth
            freeSolo
            value={getDataWithChassisNo?.fuel_type || ""}
            options={fuelType.map(option => option.label)}
            renderInput={(params) => (
                <TextField
                    fullWidth
                    {...params}
                    label="Fuel Type"
                    {...register("fuel_type")}
                    focused={getDataWithChassisNo?.fuel_type || ""}
                />
            )}
        />
    </Grid>
);

const DriverInformation = ({ userDetails, register, countries, driverCountryCode, setDriverCountryCode, driverPhoneNumber, handleDriverPhoneNumberChange }) => (
    <>
        <Grid item lg={12} md={12} sm={12} xs={12}>
            <TextField
                fullWidth
                label="Driver Name (T)"
                {...register("driver_name")}
                focused={userDetails?.data?.driver_name || ""}
            />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={1}>
                <Grid item lg={2} md={12} sm={12} xs={12}>
                    <Autocomplete
                        sx={{ marginRight: "2px" }}
                        fullWidth
                        freeSolo
                        options={countries}
                        getOptionLabel={(option) => option.label}
                        value={driverCountryCode || userDetails?.data?.driver_country_code}
                        onChange={(event, newValue) => {
                            setDriverCountryCode(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                                fullWidth
                                {...params}
                                label="Select Country Code"
                                {...register("driver_country_code")}
                                variant="outlined"
                            />
                        )}
                    />
                </Grid>
                <Grid item lg={10} md={12} sm={12} xs={12}>
                    <TextField
                        {...register("driver_contact")}
                        label="Driver Contact Number (N)"
                        variant="outlined"
                        fullWidth
                        type="tel"
                        value={driverPhoneNumber || userDetails?.data?.driver_contact}
                        onChange={handleDriverPhoneNumberChange}
                        placeholder="Driver Contact Number"
                        focused={userDetails?.data?.driver_contact || ""}
                    />
                </Grid>
            </Grid>
        </Grid>
    </>
);

const RequiredLabel = ({ text }) => (
    <>
        {text}
        <span style={{ color: "red", fontSize: "25px" }}> *</span>
    </>
);

export default VehicleInformationSection;