/* eslint-disable react/prop-types */
import {
    Autocomplete,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { HiOutlineChevronDown, HiOutlinePlus } from "react-icons/hi";
import { requiredFields, USER_TYPES } from "../../config/jobCardFormConfig";
import { useState } from "react";

const FormTopSection = ({
    mode = 'create',
    idType,
    userId,
    paddedJobNumber,
    customerData,
    companyData,
    showroomData,
    setIdType,
    setNewId,
    setShowId,
    showId,
    handleIdChange,
    register,
    errors,
    initialData
}) => {
    const getIdWithIdType = (userType) => {
        setIdType(userType);
        setNewId(userType);

        const idMap = {
            [USER_TYPES.CUSTOMER]: customerData?.data?.customers?.map(option => option.customerId),
            [USER_TYPES.COMPANY]: companyData?.data?.companies?.map(option => option.companyId),
            [USER_TYPES.SHOWROOM]: showroomData?.data?.showrooms?.map(option => option.showRoomId)
        };

        setShowId(idMap[userType] || []);
    };

    const getDisplayText = () => {
        if (idType === USER_TYPES.COMPANY) return "Company Id :";
        if (idType === USER_TYPES.CUSTOMER) return "Customer Id :";
        if (idType === USER_TYPES.SHOWROOM) return "Show room Id :";
        return "Select Id :";
    };

    return (
        <div className="flex lg:flex-row flex-col items-center justify-between my-5 lg:text-left text-center">
            <div>
                <div>
                    <b>Job No: <span className="requiredStart">*</span></b>
                    <span> {paddedJobNumber}</span>
                </div>

                {mode === 'update' && (
                    <>
                        <div className="py-1">
                            <b>User type: </b>
                            {initialData?.user_type}
                        </div>
                        <div>
                            <b>User Id: </b>
                            {initialData?.Id}
                        </div>
                    </>
                )}

                {mode === 'create' && (
                    <div>
                        <span>
                            <b>{getDisplayText()}</b>
                            {userId ? userId : "....."}
                        </span>
                    </div>
                )}

                {mode === 'create' && (
                    <div className="md:flex items-center mt-2">
                        <FormControl sx={{ m: 1, minWidth: 170 }} size="small">
                            <InputLabel>Select Customer</InputLabel>
                            <Select
                                label="Select Customer"
                                onChange={(e) => getIdWithIdType(e.target.value)}
                            >
                                <MenuItem value={USER_TYPES.COMPANY}>Company ID</MenuItem>
                                <MenuItem value={USER_TYPES.CUSTOMER}>Customer ID</MenuItem>
                                <MenuItem value={USER_TYPES.SHOWROOM}>Show Room ID</MenuItem>
                            </Select>
                        </FormControl>

                        <Autocomplete
                            size="small"
                            sx={{ m: 1, minWidth: 170 }}
                            options={showId}
                            onChange={handleIdChange}
                            renderInput={(params) => (
                                <TextField {...params} label="Select Id" />
                            )}
                        />
                    </div>
                )}
            </div>

            <div>
                <div className="vehicleCard">Vehicle Job Card</div>
            </div>

            <div>
                <DateField
                    mode={mode}
                    register={register}
                    errors={errors}
                    initialData={initialData}
                />
                {mode === 'create' && <AddCustomerDropdown />}
            </div>
        </div>
    );
};

const DateField = ({ mode, register, errors, initialData }) => {
    const [dateChange, setDateChange] = useState(false);
    const currentDate = new Date().toISOString().split("T")[0];

    if (mode === 'update') {
        return (
            <div className="cursor-pointer">
                <b>Date <span className="requiredStart">*</span></b>
                {dateChange ? (
                    <input
                        className="outline-none curs"
                        autoComplete="off"
                        type="date"
                        placeholder="Date"
                        max={currentDate}
                        defaultValue={currentDate}
                        {...register("date")}
                    />
                ) : (
                    <p
                        onClick={() => setDateChange(!dateChange)}
                        className="border border-gray-600 rounded-md px-4 py-2"
                    >
                        {initialData?.date}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="cursor-pointer">
            <b>Date <span className="requiredStart">*</span></b>
            <input
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                {...register("date", { required: requiredFields.date })}
            />
            {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
        </div>
    );
};

const AddCustomerDropdown = () => (
    <div className="addCustomerRelative">
        <div className="flex justify-center">
            <div className="flex items-center w-40 h-10 mt-2 p-2 rounded-sm bg-[#42A1DA] text-white">
                <p>Add Customer</p>
                <HiOutlineChevronDown className="ml-1" size={20} />
            </div>
        </div>
        <div className="space-y-2 addCustomerDropDown">
            <Link to="/dashboard/add-customer">
                <span className="flex items-center">
                    <HiOutlinePlus size={20} /> Add Customer
                </span>
            </Link>
            <Link to="/dashboard/add-company">
                <span className="flex items-center">
                    <HiOutlinePlus size={20} /> Add Company
                </span>
            </Link>
            <Link to="/dashboard/add-show-room">
                <span className="flex items-center">
                    <HiOutlinePlus size={20} /> Add Show Room
                </span>
            </Link>
        </div>
    </div>
);

export default FormTopSection;