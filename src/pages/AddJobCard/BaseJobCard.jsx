/* eslint-disable react/prop-types */
import "./AddJobCard.css";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { USER_TYPES } from "../../config/jobCardFormConfig";
import { countries } from "../../constant/Vehicle.constant";
import { getDefaultMileage } from "../../constant/jobCard";
import { usePhoneHandlers } from "../../hooks/usePhoneHandlers";
import FormHeader from "./FormHeader";
import FormTopSection from "./FormTopSection";
import VehicleInformationSection from "./VehicleInformationSection";
import VehicleReportSection from "./VehicleReportSection";
import FormFooter from "./FormFooter";
import UserInformationSection from "./UserInformationSection";

const BaseJobCard = ({
    mode = 'create',
    initialData = null,
    onSubmit,
    loading = false,
    CompanyInfoData,
    jobCardData,
    onIdChange,
    onChassisChange
}) => {
    const [idType, setIdType] = useState(null);
    const [showId, setShowId] = useState([]);
    const [userId, setUserId] = useState(initialData?.Id || "");
    const [newId, setNewId] = useState(initialData?.user_type || USER_TYPES.CUSTOMER);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [driverPhoneNumber, setDriverPhoneNumber] = useState("");
    const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("");
    const [countryCode, setCountryCode] = useState(countries[0]);
    const [driverCountryCode, setDriverCountryCode] = useState(countries[0]);
    const [customerOwnerCountryCode, setCustomerOwnerCountryCode] = useState(countries[0]);
    const [companyOwnerCountryCode, setCompanyOwnerCountryCode] = useState(countries[0]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [yearSelectInput, setYearSelectInput] = useState("");
    const [currentMileage, setCurrentMileage] = useState("");
    const [mileageChanged, setMileageChanged] = useState(false);
    const [getDataWithChassisNo, setGetDataWithChassisNo] = useState(initialData?.vehicle || "");

    const formRef = useRef();
    const {
        register,
        handleSubmit,
        reset,
        setValue: setVModelValue,
        formState: { errors },
    } = useForm();

    const phoneHandlers = usePhoneHandlers({
        setPhoneNumber,
        setDriverPhoneNumber,
        setOwnerPhoneNumber
    });

    useEffect(() => {
        if (initialData) {
            resetFormBasedOnInitialData();
        }
    }, [initialData]);

    useEffect(() => {
        setCurrentMileage(getDefaultMileage(getDataWithChassisNo));
    }, [getDataWithChassisNo]);

    useEffect(() => {
        if (getDataWithChassisNo?.vehicle_model) {
            setYearSelectInput(getDataWithChassisNo.vehicle_model.toString());
            setVModelValue("vehicle_model", getDataWithChassisNo.vehicle_model);
        } else {
            setYearSelectInput("");
        }
    }, [getDataWithChassisNo?.vehicle_model, setVModelValue]);

    const handleIdChange = (_, newValue) => {
        setUserId(newValue);
        onIdChange?.(newValue);
    };

    const handleChassisChange = (_, newValue) => {
        if (jobCardData?.userDetails?.data?.vehicles) {
            const filtered = jobCardData.userDetails.data.vehicles.find(
                (vehicle) => vehicle.chassis_no === newValue
            );
            setGetDataWithChassisNo(filtered);
            onChassisChange?.(filtered);
        }
    };

    const resetFormBasedOnInitialData = () => {
        if (!initialData) return;

        const resetData = {
            carReg_no: getDataWithChassisNo?.carReg_no,
            car_registration_no: getDataWithChassisNo?.car_registration_no,
            engine_no: getDataWithChassisNo?.engine_no,
            vehicle_brand: getDataWithChassisNo?.vehicle_brand,
            vehicle_name: getDataWithChassisNo?.vehicle_name,
            vehicle_model: getDataWithChassisNo?.vehicle_model,
            vehicle_category: getDataWithChassisNo?.vehicle_category,
            color_code: getDataWithChassisNo?.color_code,
            mileage: getDataWithChassisNo?.mileage,
            fuel_type: getDataWithChassisNo?.fuel_type,
            vehicle_interior_parts: initialData?.vehicle_interior_parts,
            reported_defect: initialData?.reported_defect,
            reported_action: initialData?.reported_action,
            note: initialData?.note,
            vehicle_body_report: initialData?.vehicle_body_report,
            technician_name: initialData?.technician_name,
            technician_date: initialData?.technician_date,
        };

        // Add user-specific data based on user type
        const userType = initialData.user_type;

        if (userType === USER_TYPES.CUSTOMER && initialData.customer) {
            Object.assign(resetData, {
                company_name: initialData.customer.company_name,
                vehicle_username: initialData.customer.vehicle_username,
                company_address: initialData.customer.company_address,
                customer_name: initialData.customer.customer_name,
                customer_country_code: initialData.customer.customer_country_code,
                customer_contact: initialData.customer.customer_contact,
                customer_email: initialData.customer.customer_email,
                customer_address: initialData.customer.customer_address,
                driver_name: initialData.customer.driver_name,
                driver_country_code: initialData.customer.driver_country_code,
                driver_contact: initialData.customer.driver_contact,
                reference_name: initialData.customer.reference_name,
                customerOwnerName: initialData.customer.customerOwnerName,
                customerOwnerCountryCode: initialData.customer.customerOwnerCountryCode,
                customerOwnerPhone: initialData.customer.customerOwnerPhone,
            });
        }
        else if (userType === USER_TYPES.COMPANY && initialData.company) {
            Object.assign(resetData, {
                company_name: initialData.company.company_name,
                vehicle_username: initialData.company.vehicle_username,
                company_address: initialData.company.company_address,
                company_contact: initialData.company.company_contact,
                company_country_code: initialData.company.company_country_code,
                company_email: initialData.company.company_email,
                customer_address: initialData.company.customer_address,
                driver_name: initialData.company.driver_name,
                driver_country_code: initialData.company.driver_country_code,
                driver_contact: initialData.company.driver_contact,
                reference_name: initialData.company.reference_name,
                companyOwnerName: initialData.company.companyOwnerName,
                companyOwnerCountryCode: initialData.company.companyOwnerCountryCode,
                companyOwnerPhone: initialData.company.companyOwnerPhone,
            });
        }
        else if (userType === USER_TYPES.SHOWROOM && initialData.showRoom) { // Fixed: showRoom (capital R)
            Object.assign(resetData, {
                showRoom_name: initialData.showRoom.showRoom_name,
                vehicle_username: initialData.showRoom.vehicle_username,
                showRoom_address: initialData.showRoom.showRoom_address,
                company_name: initialData.showRoom.company_name,
                company_contact: initialData.showRoom.company_contact,
                company_country_code: initialData.showRoom.company_country_code,
                company_email: initialData.showRoom.company_email,
                company_address: initialData.showRoom.company_address,
                driver_name: initialData.showRoom.driver_name,
                driver_country_code: initialData.showRoom.driver_country_code,
                driver_contact: initialData.showRoom.driver_contact,
                reference_name: initialData.showRoom.reference_name,
            });
        }

        reset(resetData);
    };

    // Set phone numbers based on initial data
    useEffect(() => {
        if (initialData) {
            const userType = initialData.user_type;

            if (userType === USER_TYPES.CUSTOMER && initialData.customer) {
                setPhoneNumber(initialData.customer.customer_contact || "");
                setDriverPhoneNumber(initialData.customer.driver_contact || "");
                setOwnerPhoneNumber(initialData.customer.customerOwnerPhone || "");

                // Set country codes
                if (initialData.customer.customer_country_code) {
                    const customerCountry = countries.find(c => c.code === initialData.customer.customer_country_code);
                    if (customerCountry) setCountryCode(customerCountry);
                }
                if (initialData.customer.driver_country_code) {
                    const driverCountry = countries.find(c => c.code === initialData.customer.driver_country_code);
                    if (driverCountry) setDriverCountryCode(driverCountry);
                }
                if (initialData.customer.customerOwnerCountryCode) {
                    const ownerCountry = countries.find(c => c.code === initialData.customer.customerOwnerCountryCode);
                    if (ownerCountry) setCustomerOwnerCountryCode(ownerCountry);
                }
            }
            else if (userType === USER_TYPES.COMPANY && initialData.company) {
                setPhoneNumber(initialData.company.company_contact || "");
                setDriverPhoneNumber(initialData.company.driver_contact || "");
                setOwnerPhoneNumber(initialData.company.companyOwnerPhone || "");

                // Set country codes
                if (initialData.company.company_country_code) {
                    const companyCountry = countries.find(c => c.code === initialData.company.company_country_code);
                    if (companyCountry) setCountryCode(companyCountry);
                }
                if (initialData.company.driver_country_code) {
                    const driverCountry = countries.find(c => c.code === initialData.company.driver_country_code);
                    if (driverCountry) setDriverCountryCode(driverCountry);
                }
                if (initialData.company.companyOwnerCountryCode) {
                    const ownerCountry = countries.find(c => c.code === initialData.company.companyOwnerCountryCode);
                    if (ownerCountry) setCompanyOwnerCountryCode(ownerCountry);
                }
            }
            else if (userType === USER_TYPES.SHOWROOM && initialData.showRoom) { // Fixed: showRoom (capital R)
                setPhoneNumber(initialData.showRoom.company_contact || "");
                setDriverPhoneNumber(initialData.showRoom.driver_contact || "");

                // Set country codes
                if (initialData.showRoom.company_country_code) {
                    const companyCountry = countries.find(c => c.code === initialData.showRoom.company_country_code);
                    if (companyCountry) setCountryCode(companyCountry);
                }
                if (initialData.showRoom.driver_country_code) {
                    const driverCountry = countries.find(c => c.code === initialData.showRoom.driver_country_code);
                    if (driverCountry) setDriverCountryCode(driverCountry);
                }
            }
        }
    }, [initialData]);

    // Get the correct user data based on user type
    const getUserDetailsData = () => {
        if (!initialData) return { data: null };

        const userType = initialData.user_type;
        if (userType === USER_TYPES.CUSTOMER) {
            return { data: initialData.customer };
        } else if (userType === USER_TYPES.COMPANY) {
            return { data: initialData.company };
        } else if (userType === USER_TYPES.SHOWROOM) {
            return { data: initialData.showRoom }; // Fixed: showRoom (capital R)
        }
        return { data: null };
    };

    return (
        <div className="addJobCardWraps">
            <FormHeader CompanyInfoData={CompanyInfoData} />

            <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                <div>
                    <FormTopSection
                        mode={mode}
                        idType={idType}
                        userId={userId}
                        paddedJobNumber={jobCardData?.paddedJobNumber || initialData?.job_no}
                        customerData={jobCardData?.customerData}
                        companyData={jobCardData?.companyData}
                        showroomData={jobCardData?.showroomData}
                        setIdType={setIdType}
                        setNewId={setNewId}
                        setShowId={setShowId}
                        showId={showId}
                        handleIdChange={handleIdChange}
                        register={register}
                        errors={errors}
                        initialData={initialData}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <UserInformationSection
                            mode={mode}
                            newId={newId}
                            userDetails={jobCardData?.userDetails || getUserDetailsData()}
                            register={register}
                            errors={errors}
                            countries={countries}
                            countryCode={countryCode}
                            setCountryCode={setCountryCode}
                            phoneNumber={phoneNumber}
                            handlePhoneNumberChange={phoneHandlers.handlePhoneNumberChange}
                            customerOwnerCountryCode={customerOwnerCountryCode}
                            setCustomerOwnerCountryCode={setCustomerOwnerCountryCode}
                            companyOwnerCountryCode={companyOwnerCountryCode}
                            setCompanyOwnerCountryCode={setCompanyOwnerCountryCode}
                            ownerPhoneNumber={ownerPhoneNumber}
                            handleOwnerPhoneNumberChange={phoneHandlers.handleOwnerPhoneNumberChange}
                        />

                        <VehicleInformationSection
                            mode={mode}
                            userDetails={jobCardData?.userDetails}
                            getDataWithChassisNo={getDataWithChassisNo}
                            register={register}
                            errors={errors}
                            handleChassisChange={handleChassisChange}
                            filteredVehicles={filteredVehicles}
                            setFilteredVehicles={setFilteredVehicles}
                            yearSelectInput={yearSelectInput}
                            setYearSelectInput={setYearSelectInput}
                            filteredOptions={filteredOptions}
                            setFilteredOptions={setFilteredOptions}
                            setVModelValue={setVModelValue}
                            currentMileage={currentMileage}
                            setCurrentMileage={setCurrentMileage}
                            mileageChanged={mileageChanged}
                            setMileageChanged={setMileageChanged}
                            driverCountryCode={driverCountryCode}
                            setDriverCountryCode={setDriverCountryCode}
                            driverPhoneNumber={driverPhoneNumber}
                            handleDriverPhoneNumberChange={phoneHandlers.handleDriverPhoneNumberChange}
                        />
                    </div>

                    <VehicleReportSection register={register} />

                    <FormFooter
                        mode={mode}
                        register={register}
                        errors={errors}
                        loading={loading}
                        initialData={initialData}
                    />
                </div>
            </form>
        </div>
    );
};

export default BaseJobCard;