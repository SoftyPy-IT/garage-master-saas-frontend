/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { HiMiniPhone } from "react-icons/hi2";
import { ImUserTie } from "react-icons/im";
import "../../Customer/Customer.css";
import SupplierPaymentList from "../../Suppliers/SupplierPaymentList";
import CompanyAccount from "./CompanyAccount";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import Message from "../../../../shared/Message/Message";
import VehicleDetails from "../../Customer/CustomerProfile/VehicleDetails";
import { useGetSingleCompanyQuery } from "../../../../redux/api/companyApi";
import Loading from "../../../../components/Loading/Loading";
import CustomerJobCardList from "../../Customer/CustomerProfile/CustomerJobCardList";
import CustomerQoutationList from "../../Customer/CustomerProfile/CustomerQoutationList";
import CustomerInvoiceList from "../../Customer/CustomerProfile/CustomerInvoiceList";
import CustomerMoneyList from "../../Customer/CustomerProfile/CustomerMoneyList";
import { Person } from "@mui/icons-material";
import { tabsStyles, tabStyles } from "../../../../utils/customStyle";
import CustomerNote from "../../Customer/CustomerProfile/CustomerNote";
import { useGetCompanyProfileQuery } from "../../../../redux/api/companyProfile";
import { useAppOptions } from "../../../../hooks/useAppOptions";
const CompanyProfile = () => {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const { tenantDomain } = useAppOptions();

  const {
    data: profileData,
    isLoading,
    error: companyError,
  } = useGetSingleCompanyQuery({ tenantDomain, id });

  const { data } = useGetCompanyProfileQuery({
    tenantDomain,
  });

  const companyProfileData = {
    companyName: data?.data?.companyName,
    address: data?.data?.address,
    website: data?.data?.website,
    phone: data?.data?.phone,
    email: data?.data?.email,
    logo: data?.data?.logo[0],
    companyNameBN: data?.data?.companyNameBN,
  };
  const [value, setValue] = useState(() => {
    const savedTab = localStorage.getItem(`company-tab-${id}`);
    return savedTab !== null ? Number.parseInt(savedTab, 10) : 0;
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem(`company-tab-${id}`, newValue.toString());
  };

  useEffect(() => {
    localStorage.setItem(`company-tab-${id}`, value.toString());
  }, [value, id]);

  if (isLoading) {
    return <Loading />;
  }

  if (companyError) {
    return <div>Something went wrong</div>;
  }
  const totalAmount = profileData?.data?.invoices?.reduce((sum, receipt) => {
    return sum + (receipt?.isRecycled === false ? receipt?.net_total || 0 : 0);
  }, 0);

  const discount = profileData?.data?.invoices?.reduce((sum, receipt) => {
    return sum + (receipt?.isRecycled === false ? receipt?.discount || 0 : 0);
  }, 0);

  const totalDue = profileData?.data?.invoices?.reduce((sum, receipt) => {
    return sum + (receipt?.isRecycled === false ? receipt?.due || 0 : 0);
  }, 0);

  const totalAdvance = profileData?.data?.invoices?.reduce((sum, receipt) => {
    return sum + (receipt?.isRecycled === false ? receipt?.advance || 0 : 0);
  }, 0);

  return (
    <div>
      <div className="w-full lg:h-52 mt-5 lg:bg-gradient-to-r from-[#FE4728] via-[#9A8BFD] to-[#15C294] text-white flex items-center">
        <div className="singleCustomerProfileWrap ">
          <div className="bg-gradient-to-r from-[#15C294] via-[#568DFA] to-[#2B8AE0] border rounded-md py-5 px-5 relative w-[300px] singleCustomerProfileCard ">
            <div className="flex flex-col flex-wrap gap-3 items-center  py-5">
              <div className="md:w-24 md:h-24 bg-[#42A1DA] border rounded-full p-3 absolute -top-14">
                <ImUserTie size="70" className="text-white" />
              </div>

              <div className="text-sm mt-4">
                <div className="flex items-center">
                  <span>Company ID :</span>{" "}
                  <span className="ml-3 font-semibold">
                    {profileData?.data?.companyId}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center mt-3">
                    <Person size="20" className="mr-2" />
                    <span className="capitalize">
                      {profileData?.data?.company_name}{" "}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <HiMiniPhone size="20" className="mr-2" />
                    <span>{profileData?.data?.fullCompanyNum} </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center relative    gap-x-3 customerSingleRightCard">
            <div className="bg-gradient-to-r from-[#528AFA] to-[#FEBF17] border h-16 w-32 rounded-md  relative   ">
              <div className="flex mt-2 flex-col items-center justify-center">
                <p>Total Amount </p>
                <b>{totalAmount} ৳ </b>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#2F7EDD] to-[#15C193] border h-16 w-32 rounded-md  relative   ">
              <div className="flex mt-2 flex-col items-center justify-center">
                <p>Advance </p>
                <b>{totalAdvance} ৳ </b>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#998AFD] to-[#998AFD] border h-16 w-32 rounded-md  relative   ">
              <div className="flex mt-2 flex-col items-center justify-center">
                <p>Discount </p>
                <b>{discount} ৳ </b>
              </div>
            </div>
            <div className=" bg-gradient-to-r from-[#FE331D] to-[#fe5d1df5] border h-16 w-32 rounded-md  relative ">
              <div className="flex mt-2 flex-col items-center justify-center">
                <p>Due </p>
                <b>{totalDue} ৳</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-32 text-black tabClass">
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={tabsStyles}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab sx={tabStyles} label="Account" />
            <Tab sx={tabStyles} label="Vehicle List" />
            <Tab sx={tabStyles} label="Jobs Card" />
            <Tab sx={tabStyles} label="Quotation" />
            <Tab sx={tabStyles} label="Invoice" />
            <Tab sx={tabStyles} label="Money Receipt" />
            <Tab sx={tabStyles} label="Payment" />
            <Tab sx={tabStyles} label="Message" />
            <Tab sx={tabStyles} label="Note" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <CompanyAccount
            tenantDomain={tenantDomain}
            profileData={profileData}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <VehicleDetails tenantDomain={tenantDomain} id={id} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CustomerJobCardList
            companyProfileData={companyProfileData}
            tenantDomain={tenantDomain}
            id={id}
            customerId={profileData?.data?.companyId}
            user_type={profileData?.data?.user_type}
          />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <CustomerQoutationList
            companyProfileData={companyProfileData}
            tenantDomain={tenantDomain}
            id={id}
            user_type={profileData?.data?.user_type}
          />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <CustomerInvoiceList
            companyProfileData={companyProfileData}
            tenantDomain={tenantDomain}
            id={id}
            user_type={profileData?.data?.user_type}
          />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <CustomerMoneyList
            companyProfileData={companyProfileData}
            tenantDomain={tenantDomain}
            id={id}
            user_type={profileData?.data?.user_type}
          />
        </TabPanel>
        <TabPanel value={value} index={6}>
          <SupplierPaymentList tenantDomain={tenantDomain} />
        </TabPanel>
        <TabPanel value={value} index={7}>
          <Message data={profileData?.data} tenantDomain={tenantDomain} />
        </TabPanel>
        <TabPanel value={value} index={8}>
          <CustomerNote tenantDomain={tenantDomain} id={id} />
        </TabPanel>
      </div>

      <div>
        <p className="my-5 text-center">
          © Copyright 2024 | Garage Master | All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default CompanyProfile;

// Define TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
