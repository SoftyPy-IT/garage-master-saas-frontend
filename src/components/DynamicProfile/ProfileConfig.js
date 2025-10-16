

import CustomerAccount from "../../pages/Home/Customer/CustomerProfile/CustomerAccount";
import CustomerInvoiceList from "../../pages/Home/Customer/CustomerProfile/CustomerInvoiceList";
import CustomerJobCardList from "../../pages/Home/Customer/CustomerProfile/CustomerJobCardList";
import VehicleDetails from "../../pages/Home/Customer/CustomerProfile/VehicleDetails";
import CustomerQoutationList from "../../pages/Home/Customer/CustomerProfile/CustomerQoutationList";
import CustomerMoneyList from "../../pages/Home/Customer/CustomerProfile/CustomerMoneyList";
import CustomerNote from "../../pages/Home/Customer/CustomerProfile/CustomerNote";
import Message from "../../shared/Message/Message";
import ShowRoomAccount from "../../pages/Home/ShowRoom/ShowRoomProfile/ShowRoomAccount";
import CompanyAccount from "../../pages/Home/Company/CompanyProfile/CompanyAccount";
import SupplierPaymentList from "../../pages/Home/Suppliers/SupplierPaymentList";

export const PROFILE_CONFIG = {
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
