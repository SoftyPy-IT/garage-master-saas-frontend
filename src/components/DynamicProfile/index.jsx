/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { HiMiniPhone } from "react-icons/hi2";
import { ImUserTie } from "react-icons/im";
import "../Customer.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import Message from "../../../../shared/Message/Message";
import Loading from "../../../../components/Loading/Loading";
import { Person } from "@mui/icons-material";
import { tabsStyles, tabStyles } from "../../../../utils/customStyle";
import CustomerNote from "./CustomerNote";
import { useGetCompanyProfileQuery } from "../../../../redux/api/companyProfile";
import { useAppOptions } from "../../../../hooks/useAppOptions";

// Import all tab components
import CustomerAccount from "./CustomerAccount";
import ShowRoomAccount from "../ShowRoom/ShowRoomProfile/ShowRoomAccount";
import CompanyAccount from "../Company/CompanyProfile/CompanyAccount";
import VehicleDetails from "./VehicleDetails";
import CustomerJobCardList from "./CustomerJobCardList";
import CustomerQoutationList from "./CustomerQoutationList";
import CustomerInvoiceList from "./CustomerInvoiceList";
import CustomerMoneyList from "./CustomerMoneyList";
import SupplierPaymentList from "../../Suppliers/SupplierPaymentList";

// Profile type configuration
const PROFILE_CONFIG = {
    customer: {
        queryHook: 'useGetSingleCustomerQuery',
        idKey: 'customerId',
        nameKey: 'customer_name',
        phoneKey: 'fullCustomerNum',
        localStorageKey: 'customer-tab',
        accountComponent: CustomerAccount,
        tabs: [
            { label: "Account", component: CustomerAccount },
            { label: "Vehicle List", component: VehicleDetails },
            { label: "Jobs Card", component: CustomerJobCardList },
            { label: "Quotation", component: CustomerQoutationList },
            { label: "Invoice", component: CustomerInvoiceList },
            { label: "Money Receipt", component: CustomerMoneyList },
            { label: "Message", component: Message },
            { label: "Note", component: CustomerNote }
        ]
    },
    showroom: {
        queryHook: 'useGetSingleShowRoomQuery',
        idKey: 'showRoomId',
        nameKey: 'company_name',
        phoneKey: 'fullCompanyNum',
        localStorageKey: 'showroom-tab',
        accountComponent: ShowRoomAccount,
        tabs: [
            { label: "Account", component: ShowRoomAccount },
            { label: "Vehicle List", component: VehicleDetails },
            { label: "Job Card", component: CustomerJobCardList },
            { label: "Quotation", component: CustomerQoutationList },
            { label: "Invoice", component: CustomerInvoiceList },
            { label: "Money Receipt", component: CustomerMoneyList },
            { label: "Message", component: Message },
            { label: "Note", component: CustomerNote }
        ]
    },
    company: {
        queryHook: 'useGetSingleCompanyQuery',
        idKey: 'companyId',
        nameKey: 'company_name',
        phoneKey: 'fullCompanyNum',
        localStorageKey: 'company-tab',
        accountComponent: CompanyAccount,
        tabs: [
            { label: "Account", component: CompanyAccount },
            { label: "Vehicle List", component: VehicleDetails },
            { label: "Jobs Card", component: CustomerJobCardList },
            { label: "Quotation", component: CustomerQoutationList },
            { label: "Invoice", component: CustomerInvoiceList },
            { label: "Money Receipt", component: CustomerMoneyList },
            { label: "Payment", component: SupplierPaymentList },
            { label: "Message", component: Message },
            { label: "Note", component: CustomerNote }
        ]
    }
};

// Import hooks dynamically (you'll need to adjust this based on your actual hook imports)
import { useGetSingleCustomerQuery } from "../../../../redux/api/customerApi";
import { useGetSingleShowRoomQuery } from "../../../../redux/api/showRoomApi";
import { useGetSingleCompanyQuery } from "../../../../redux/api/companyApi";

const QUERY_HOOKS = {
    useGetSingleCustomerQuery,
    useGetSingleShowRoomQuery,
    useGetSingleCompanyQuery
};

const DynamicProfile = ({ profileType = "customer" }) => {
    const location = useLocation();
    const id = new URLSearchParams(location.search).get("id");
    const { tenantDomain, performActionWithPermission } = useAppOptions();

    const config = PROFILE_CONFIG[profileType];

    if (!config) {
        throw new Error(`Invalid profile type: ${profileType}`);
    }

    // Get the appropriate query hook
    const useQueryHook = QUERY_HOOKS[config.queryHook];

    const {
        data: profileData,
        isLoading,
        error: profileError,
    } = useQueryHook({ id, tenantDomain });

    const { data: companyProfileData } = useGetCompanyProfileQuery({ tenantDomain });

    // Tab state management
    const [value, setValue] = useState(() => {
        const savedTab = localStorage.getItem(`${config.localStorageKey}-${id}`);
        return savedTab !== null ? Number.parseInt(savedTab, 10) : 0;
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
        localStorage.setItem(`${config.localStorageKey}-${id}`, newValue.toString());
    };

    useEffect(() => {
        localStorage.setItem(`${config.localStorageKey}-${id}`, value.toString());
    }, [value, id, config.localStorageKey]);

    // Loading and error states
    if (isLoading) {
        return <Loading />;
    }

    if (profileError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-2">⚠️</div>
                    <p className="text-gray-600">Something went wrong while loading the profile.</p>
                </div>
            </div>
        );
    }

    // Calculate financial metrics
    const calculateFinancialMetrics = () => {
        const invoices = profileData?.data?.invoices || [];

        const filteredInvoices = profileType === 'customer'
            ? invoices.filter(invoice => !invoice?.isRecycled)
            : invoices.filter(invoice => invoice?.isRecycled === false);

        return {
            totalAmount: filteredInvoices.reduce((sum, receipt) => sum + (receipt?.net_total || 0), 0),
            discount: filteredInvoices.reduce((sum, receipt) => sum + (receipt?.discount || 0), 0),
            totalDue: filteredInvoices.reduce((sum, receipt) => sum + (receipt?.due || 0), 0),
            totalAdvance: filteredInvoices.reduce((sum, receipt) => sum + (receipt?.advance || 0), 0)
        };
    };

    const { totalAmount, discount, totalDue, totalAdvance } = calculateFinancialMetrics();

    // Financial cards data
    const financialCards = [
        { label: "Total Amount", value: totalAmount, gradient: "from-[#528AFA] to-[#FEBF17]" },
        { label: "Advance", value: totalAdvance, gradient: "from-[#2F7EDD] to-[#15C193]" },
        { label: "Discount", value: discount, gradient: "from-[#998AFD] to-[#998AFD]" },
        { label: "Due", value: totalDue, gradient: "from-[#FE331D] to-[#fe5d1df5]" }
    ];

    return (
        <div>
            {/* Header Section */}
            <div className="w-full lg:h-52 mt-5 lg:bg-gradient-to-r from-[#FE4728] via-[#9A8BFD] to-[#15C294] text-white flex items-center">
                <div className="singleCustomerProfileWrap">
                    {/* Profile Card */}
                    <div className="bg-gradient-to-r from-[#15C294] via-[#568DFA] to-[#2B8AE0] border rounded-md py-5 px-5 relative w-[300px] singleCustomerProfileCard">
                        <div className="flex flex-col flex-wrap gap-3 items-center py-5">
                            <div className="md:w-24 md:h-24 bg-[#42A1DA] border rounded-full p-3 absolute -top-14">
                                <ImUserTie size="70" className="text-white" />
                            </div>

                            <div className="text-sm mt-3">
                                <div className="flex items-center">
                                    <span>{profileType === 'customer' ? 'Customer ID' : 'Company ID'} :</span>
                                    <span className="ml-3 font-semibold">
                                        {profileData?.data?.[config.idKey]}
                                    </span>
                                </div>

                                <div className="flex items-center mt-3">
                                    <Person size="20" className="mr-2" />
                                    <span className="capitalize">
                                        {profileData?.data?.[config.nameKey]}
                                    </span>
                                </div>

                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center">
                                        <HiMiniPhone size="20" className="mr-2" />
                                        <span>{profileData?.data?.[config.phoneKey]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Cards */}
                    <div className="flex flex-wrap gap-3 items-center relative gap-x-3 customerSingleRightCard">
                        {financialCards.map((card, index) => (
                            <div
                                key={index}
                                className={`bg-gradient-to-r ${card.gradient} border h-16 w-32 rounded-md relative`}
                            >
                                <div className="flex mt-2 flex-col items-center justify-center">
                                    <p className="text-xs">{card.label}</p>
                                    <b>{card.value} ৳</b>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Section */}
            <div className="mt-32 text-black tabClass">
                <Box sx={{ width: "100%", overflowX: "auto" }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="profile tabs"
                        sx={tabsStyles}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {config.tabs.map((tab, index) => (
                            <Tab key={index} sx={tabStyles} label={tab.label} />
                        ))}
                    </Tabs>
                </Box>

                {/* Tab Panels */}
                {config.tabs.map((tab, index) => (
                    <TabPanel key={index} value={value} index={index}>
                        {React.createElement(tab.component, {
                            tenantDomain,
                            performActionWithPermission,
                            companyProfileData: {
                                companyName: companyProfileData?.data?.companyName,
                                address: companyProfileData?.data?.address,
                                website: companyProfileData?.data?.website,
                                phone: companyProfileData?.data?.phone,
                                email: companyProfileData?.data?.email,
                                logo: companyProfileData?.data?.logo?.[0],
                                companyNameBN: companyProfileData?.data?.companyNameBN,
                            },
                            profileData,
                            id,
                            customerId: profileData?.data?.[config.idKey],
                            user_type: profileData?.data?.user_type,
                            ...(tab.label === "Payment" && profileType === "company" ? {} : {})
                        })}
                    </TabPanel>
                ))}

                {/* Footer */}
                <div>
                    <p className="my-5 text-center">
                        © Copyright 2024 | Garage Master | All Rights Reserved
                    </p>
                </div>
            </div>
        </div>
    );
};

// TabPanel Component
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

export default DynamicProfile;