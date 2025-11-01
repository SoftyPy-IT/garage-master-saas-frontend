/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import { USER_TYPES } from "@/config/jobCardFormConfig";
import CustomerInformation from "./CustomerInformation";
import CompanyInformation from "./CompanyInformation";
import ShowRoomInformation from "./ShowRoomInformation";

const UserInformationSection = ({
    mode = 'create',
    newId,
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
    companyOwnerCountryCode,
    setCompanyOwnerCountryCode,
    ownerPhoneNumber,
    handleOwnerPhoneNumberChange
}) => {
    if (!newId) return null;

    const userComponents = {
        [USER_TYPES.CUSTOMER]: (
            <CustomerInformation
                mode={mode}
                userDetails={userDetails}
                register={register}
                errors={errors}
                countries={countries}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                phoneNumber={phoneNumber}
                handlePhoneNumberChange={handlePhoneNumberChange}
                customerOwnerCountryCode={customerOwnerCountryCode}
                setCustomerOwnerCountryCode={setCustomerOwnerCountryCode}
                ownerPhoneNumber={ownerPhoneNumber}
                handleOwnerPhoneNumberChange={handleOwnerPhoneNumberChange}
            />
        ),
        [USER_TYPES.COMPANY]: (
            <CompanyInformation
                mode={mode}
                userDetails={userDetails}
                register={register}
                errors={errors}
                countries={countries}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                phoneNumber={phoneNumber}
                handlePhoneNumberChange={handlePhoneNumberChange}
                companyOwnerCountryCode={companyOwnerCountryCode}
                setCompanyOwnerCountryCode={setCompanyOwnerCountryCode}
                ownerPhoneNumber={ownerPhoneNumber}
                handleOwnerPhoneNumberChange={handleOwnerPhoneNumberChange}
            />
        ),
        [USER_TYPES.SHOWROOM]: (
            <ShowRoomInformation
                mode={mode}
                userDetails={userDetails}
                register={register}
                errors={errors}
                countries={countries}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                phoneNumber={phoneNumber}
                handlePhoneNumberChange={handlePhoneNumberChange}
            />
        )
    };

    return <Box>{userComponents[newId]}</Box>;
};

export default UserInformationSection;