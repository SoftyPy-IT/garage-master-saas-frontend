/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineChevronDown, HiOutlinePlus } from "react-icons/hi";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useGetAllCustomersQuery } from "../../../redux/api/customerApi";
import { useGetAllCompaniesQuery } from "../../../redux/api/companyApi";
import { useGetAllShowRoomsQuery } from "../../../redux/api/showRoomApi";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

const UserSelectionSection = ({
  idType,
  userId,
  showId,
  onIdTypeChange,
  onUserIdChange,
}) => {
  const tenantDomain = useTenantDomain();
  const jobCardLimit = 500000;
  const currentPage = 1;

  const { data: customerData } = useGetAllCustomersQuery({
    tenantDomain,
    limit: jobCardLimit,
    page: currentPage,
  });

  const { data: companyData } = useGetAllCompaniesQuery({
    tenantDomain,
    limit: jobCardLimit,
    page: currentPage,
  });

  const { data: showroomData } = useGetAllShowRoomsQuery({
    tenantDomain,
    limit: jobCardLimit,
    page: currentPage,
  });

  const getIdWithIdType = (userType) => {
    onIdTypeChange(userType);

    switch (userType) {
      case "customer":
        return customerData?.data?.customers?.map((option) => option.customerId);
      case "company":
        return companyData?.data?.companies?.map((option) => option.companyId);
      case "showRoom":
        return showroomData?.data?.showrooms?.map((option) => option.showRoomId);
      default:
        return [];
    }
  };

  useEffect(() => {
    if (idType) {
      const ids = getIdWithIdType(idType);
      onUserIdChange(ids[0] || "");
    }
  }, [idType, customerData, companyData, showroomData]);

  return (
    <div className="flex lg:flex-row flex-col items-center justify-between my-5 lg:text-left text-center">
      <div>
        <div>
          <b>
            Job No: <span className="requiredStart">*</span>
          </b>
          <span> {userId ? userId : "....."}</span>
        </div>
        <div>
          <span>
            {idType === "company" && <b>Company Id :</b>}
            {idType === "customer" && <b>Customer Id :</b>}
            {idType === "showRoom" && <b>Show room Id :</b>}
            {idType === null && <b>Select Id :</b>}
          </span>
        </div>
        <div className="md:flex items-center mt-2">
          <FormControl sx={{ m: 1, minWidth: 170 }} size="small">
            <InputLabel id="demo-select-small-label">
              Select Customer
            </InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              className="py-1"
              label="Select Customer"
              value={idType || ""}
              onChange={(e) => onIdTypeChange(e.target.value)}
            >
              <MenuItem value="company">Company ID</MenuItem>
              <MenuItem value="customer">Customer ID</MenuItem>
              <MenuItem value="showRoom">Show Room ID</MenuItem>
            </Select>
          </FormControl>

          <Autocomplete
            sx={{ m: 1, minWidth: 170 }}
            className="w-40"
            id="free-solo-demo"
            options={showId.map((option) => option)}
            value={userId || ""}
            onChange={(_, newValue) => onUserIdChange(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Id" className="w-40" />
            )}
          />
        </div>
      </div>
      <div>
        <div className="vehicleCard">Vehicle Job Card</div>
      </div>
      <div>
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
      </div>
    </div>
  );
};

export default UserSelectionSection;