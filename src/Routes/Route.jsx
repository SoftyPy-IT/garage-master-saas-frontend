// src/Routes/Route.jsx
import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/Home";
import JobCardList from "../pages/Home/AddJobCard/JobCardList";
import AddEmployee from "../pages/Home/Employee/AddEmployee";
import Detail from "../pages/Home/Invoice/Detail";
import UpdateInvoice from "../pages/Home/Invoice/UpdateInvoice";
import Invoice from "../pages/Home/Invoice/Invoice";
import AddRole from "../pages/Home/Role/AddRole";
import Role from "../pages/Home/Role/Role";
import UpdateCustomer from "../pages/Home/Customer/UpdateCustomer";
import AddExpense from "../pages/Home/Expense/AddExpense";
import AddCustomer from "../pages/Home/Customer/AddCustomer";
import AddProduct from "../pages/Home/Products/AddProduct";
import Profile from "../pages/Home/Profile/Profile";
import UpdateJobCard from "../pages/Home/AddJobCard/UpdateJobCard";
import AddJobCard from "../pages/Home/AddJobCard/AddJobCard";
import PreviewJobCard from "../pages/Home/AddJobCard/PreviewJobCard/PreviewJobCard";
import UpdateProduct from "../pages/Home/Products/UpdateProduct";
import UpdateRole from "../pages/Home/Role/UpdateRole";
import DashboardLayout from "../Layout/DashboardLayout";
import MoneyReceived from "../pages/Home/MoneyReceived/MoneyReceived";
import MoneyReceiptList from "../pages/Home/MoneyReceived/MoneyReceiptList";
import MoneyReceiptView from "../pages/Home/MoneyReceived/MoneyReceiptView";
import UpdateMoneyReceipt from "../pages/Home/MoneyReceived/UpdateMoneyReceipt";
import AddQuotation from "../pages/Home/Quotation/AddQuotation";
import QuotationView from "../pages/Home/Quotation/QuotationView";
import QuotationList from "../pages/Home/Quotation/QuotationList";
import UpdateQuotation from "../pages/Home/Quotation/UpdateQuotation";
import CustomerList from "../pages/Home/Customer/CustomerList";
import CustomerProfile from "../pages/Home/Customer/CustomerProfile";
import EmployeeList from "../pages/Home/Employee/EmployeeList";
import UpdateEmployee from "../pages/Home/Employee/UpdateEmployee";
import EmployeeProfile from "../pages/Home/Employee/EmployeeProfile";
import AddSuppliers from "../pages/Home/Suppliers/AddSuppliers";
import SupplierList from "../pages/Home/Suppliers/SupplierList";
import UpdateSupplier from "../pages/Home/Suppliers/UpdateSupplier";
import SupplierProfile from "../pages/Home/Suppliers/SupplierProfile";
import AddPurchase from "../pages/Home/Parchase/AddPurchase";
import UpdatePurchase from "../pages/Home/Parchase/UpdatePurchase";
import CompanyList from "../pages/Home/Company/CompanyList";
import AddCompany from "../pages/Home/Company/AddCompany";
import CompanyProfile from "../pages/Home/Company/CompanyProfile";
import AddShowRoom from "../pages/Home/ShowRoom/AddShowRoom";
import ShowRoomList from "../pages/Home/ShowRoom/ShowRoomList";
import UpdateCompany from "../pages/Home/Company/UpdateCompany";
import UpdateShowRoom from "../pages/Home/ShowRoom/UpdateShowRoom";
import ShowRoomProfile from "../pages/Home/ShowRoom/ShowRoomProfile";
import EmployeeLeave from "../pages/Home/Employee/EmployeeProfile/EmployeeLeave";
import Attendance from "../pages/Home/Employee/EmployeeProfile/Attendance";
import AddAttendance from "../pages/Home/Attendance/AddAttendance";
import AttendanceList from "../pages/Home/Attendance/AttendanceList";
import UpdateExpense from "../pages/Home/Expense/UpdateExpense";
import ViewExpense from "../pages/Home/Expense/ViewExpense";
import UpdateAttendance from "../pages/Home/Attendance/UpdateAttendance";
import EmployeeSalary from "../pages/Home/Employee/EmployeeSalary";
import EmployeeOvertime from "../pages/Home/Employee/EmployeeOvertime";
import RunningProject from "../pages/Home/Projects/RunningProject";
import CompletedProject from "../pages/Home/Projects/CompletedProject";
import ViewEmployeeAttendance from "../pages/Home/Attendance/ViewEmployeeAttendance";
import EmployeeHoliday from "../pages/Holiday/Holiday";
import UpdateBillPay from "../pages/BillPay/UpdateBillPay";
import BillPayInvoice from "../pages/BillPay/BillPayInvoice";
import PurchaseList from "../pages/Home/Parchase/PurchasList";
import Income from "../pages/Income/Income";
import IncomeList from "../pages/Income/IncomeList";
import UpdateIncome from "../pages/Income/UpdateIncome";
import Donation from "../pages/Donation/Donation";
import Brand from "../pages/Home/Brand/Brand";
import Unit from "../pages/Home/Unit/Unit";
import Barcode from "../pages/Home/Barcode/Barcode";
import ProductList from "../pages/Home/Products/ProductList";
import ExpenseList from "../pages/Home/Expense/ExpenseList";
import ProductType from "../pages/Home/ProductType/ProductType";
import CategoryList from "../pages/Home/Category/CategoryList";
import DuemoneyReceiptList from "../pages/Home/MoneyReceived/DuemoneyReceiptList";
import RecyclebinJobcardList from "../pages/Home/Recyclebin/RecyclebinJobcardList";
import RecycledQuotationList from "../pages/Home/Recyclebin/RecycledQuotationList";
import RecycledMoneyReceipt from "../pages/Home/Recyclebin/RecycledMoneyReceipt";
import RecycledbinCustomerList from "../pages/Home/Recyclebin/RecycledbinCustomerList";
import RecycledbinCompanyList from "../pages/Home/Recyclebin/RecycledbinCompanyList";
import RecycledbinShowRoomList from "../pages/Home/Recyclebin/RecycledbinShowRoomList";
import RecycledbinEmployeeList from "../pages/Home/Recyclebin/RecycledbinEmployeeList";
import RecyclebinSupplierList from "../pages/Home/Recyclebin/RecyclebinSupplierList";
import RecycledbinInvoiceList from "../pages/Home/Recyclebin/RecycledbinInvoiceList";
import ExpenseCategoryList from "../pages/Home/Expense/ExpenseCategoryList";
import AllCustomerList from "../pages/Home/Customer/AllCustomerList";
import Backup from "../pages/Backup/Backup";
import RestoreDatabase from "../pages/Backup/RestoreDatabase";
import CreateHoliday from "../pages/Holiday/CreateHoliday";
import CreateEmployeeOverTime from "../pages/Home/Employee/CreateEmployeeOverTime";
import UpdateHoliday from "../pages/Holiday/UpdateHoliday";
import AddPaybill from "../pages/BillPay/AddPaybill";
import BillPayList from "../pages/BillPay/BillPayList";
import BillPayHistory from "../pages/BillPay/BillPayHistory";
import UpdateEmployeeSalary from "../pages/Home/Employee/UpdateEmployeeSalary";
import InventoryDashboard from "../pages/Inventory/InventoryDashboard";
import ExpiredProduct from "../pages/Inventory/ExpiredProduct";
import LowStock from "../pages/Inventory/LowStock";
import Variants from "../pages/Inventory/Variants";
import StockPage from "../pages/Inventory/Stock";
import RemoveStock from "../pages/Inventory/RemoveStock";
import PurchaseReturn from "../pages/Inventory/PurchaseReturn";
import StockTransferPage from "../pages/Inventory/StockTransper";
import ExpiredProductsReportPage from "../pages/Reports/ExpiredProductReport";
import LowStockReportPage from "../pages/Reports/LowStockReport";
import ProductStockReportPage from "../pages/Reports/ProductStockReport";
import DailyStockMovementReportPage from "../pages/Reports/DailyStockReport";
import ReportsPage from "../pages/Reports/Report";
import PurchaseReturnUpdate from "../pages/Inventory/PurchaseReturnUpdate";
import WarehouseManagement from "../pages/Inventory/WarehouseManagement";
import StockAdjustment from "../pages/Inventory/Adjustment/AdjustmentList";
import AddAdjustment from "../pages/Inventory/Adjustment/AddAdjustment";
import QuantityAdjustment from "../pages/Inventory/Adjustment/AdjustmentList";
import CreateTenant from "../pages/Tenant/CreateTenant";
import LandingPage from "../pages/Login/LandingPage";
import Login from "../pages/Login/Login";
import AdminUserListPage from "../pages/Home/Profile/AllUserList";
import UpdateProfile from "../pages/Home/Profile/UpdateProfile";
import AllTenantList from "../pages/Home/Tenant/AllTenantList";
import AllUserList from "../pages/Home/Tenant/AllUserList";
import ContactUserList from "../pages/Home/Tenant/ContactUserList";
import CompanyBrand from "../pages/CompanyBrand/CompanyBrand";
import Review from "../pages/Review/Review";
import DonationList from "../pages/Donation/DonationList";
import UpdateDonation from "../pages/Donation/UpdateDonation";
import PurchaseOrder from "../pages/Inventory/PurchaseOrder/PurchaseOrder";
import PurchaseReturnList from "../pages/Inventory/PurchaseReturn/PurchaseReturnList";
import WarrantiesPage from "../pages/Inventory/Warranty/WarrantiesPage";
import StockTransaction from "../pages/Inventory/StockTransaction/StockTransaction";
import InvoiceList from "../pages/Home/Invoice/ViewInvoice";
import ProtectedRoute from "./PrivateRoute";
import FeatureAccess from "../pages/PermissionDashboard/FeatureAccess";
import UserManagement from "../pages/PermissionDashboard/UserManagement";
import PageManagement from "../pages/PageManagement/PageManagement";
import RoleManagement from "../pages/RoleManagement";
import Permission from "../pages/Permission/Permission";
import Unauthorized from "../pages/UnAuthorized";

const createProtectedRoute = (path, element, pagePath, action = "view") => {
  return {
    path,
    element: (
      <ProtectedRoute pagePath={pagePath} action={action}>
        {element}
      </ProtectedRoute>
    ),
  };
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "create-tenant",
        element: <CreateTenant />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized/>,
      },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      createProtectedRoute("", <Home />, "/dashboard"),
      createProtectedRoute(
        "addjob",
        <AddJobCard />,
        "/dashboard/addjob",
        "create"
      ),
      createProtectedRoute(
        "role-management",
        <RoleManagement/>,
        "/dashboard/role-management",
        "create"
      ),
      createProtectedRoute(
        "user-permission",
        <Permission />,
        "/dashboard/user-permission",
        "create"
      ),
      createProtectedRoute(
        "feature-access",
        <FeatureAccess />,
        "/dashboard/feature-access",
        "create"
      ),
      createProtectedRoute(
        "user-management",
        <UserManagement />,
        "/dashboard/user-management",
        "create"
      ),
      createProtectedRoute(
        "page-management",
        <PageManagement />,
        "/dashboard/page-management",
        "create"
      ),
      createProtectedRoute("preview", <PreviewJobCard />, "/dashboard/preview"),
      createProtectedRoute(
        "update-jobcard",
        <UpdateJobCard />,
        "/dashboard/update-jobcard",
        "edit"
      ),
      createProtectedRoute("profile", <Profile />, "/dashboard/profile"),
      createProtectedRoute("invoice", <Invoice />, "/dashboard/invoice"),
      createProtectedRoute(
        "product-list",
        <ProductList />,
        "/dashboard/product-list"
      ),
      createProtectedRoute(
        "adjustment",
        <StockAdjustment />,
        "/dashboard/adjustment"
      ),
      createProtectedRoute(
        "add-product",
        <AddProduct />,
        "/dashboard/add-product",
        "create"
      ),
      createProtectedRoute(
        "update-product",
        <UpdateProduct />,
        "/dashboard/update-product",
        "edit"
      ),
      createProtectedRoute(
        "customer-list",
        <CustomerList />,
        "/dashboard/customer-list"
      ),
      createProtectedRoute(
        "update-customer",
        <UpdateCustomer />,
        "/dashboard/update-customer",
        "edit"
      ),
      createProtectedRoute(
        "add-customer",
        <AddCustomer />,
        "/dashboard/add-customer",
        "create"
      ),
      createProtectedRoute(
        "customer-profile",
        <CustomerProfile />,
        "/dashboard/customer-profile"
      ),
      createProtectedRoute(
        "company-profile",
        <CompanyProfile />,
        "/dashboard/company-profile"
      ),
      createProtectedRoute(
        "add-company",
        <AddCompany />,
        "/dashboard/add-company",
        "create"
      ),
      createProtectedRoute(
        "update-company",
        <UpdateCompany />,
        "/dashboard/update-company",
        "edit"
      ),
      createProtectedRoute(
        "company-list",
        <CompanyList />,
        "/dashboard/company-list"
      ),
      createProtectedRoute(
        "add-show-room",
        <AddShowRoom />,
        "/dashboard/add-show-room",
        "create"
      ),
      createProtectedRoute(
        "update-show-room",
        <UpdateShowRoom />,
        "/dashboard/update-show-room",
        "edit"
      ),
      createProtectedRoute(
        "show-room-list",
        <ShowRoomList />,
        "/dashboard/show-room-list"
      ),
      createProtectedRoute(
        "show-room-profile",
        <ShowRoomProfile />,
        "/dashboard/show-room-profile"
      ),
      createProtectedRoute(
        "expense-list",
        <ExpenseList />,
        "/dashboard/expense-list"
      ),
      createProtectedRoute(
        "add-expense",
        <AddExpense />,
        "/dashboard/add-expense",
        "create"
      ),
      createProtectedRoute(
        "add-employee",
        <AddEmployee />,
        "/dashboard/add-employee",
        "create"
      ),
      createProtectedRoute(
        "employee-list",
        <EmployeeList />,
        "/dashboard/employee-list"
      ),
      createProtectedRoute(
        "update-employee",
        <UpdateEmployee />,
        "/dashboard/update-employee",
        "edit"
      ),
      createProtectedRoute(
        "employee-profile",
        <EmployeeProfile />,
        "/dashboard/employee-profile"
      ),
      createProtectedRoute(
        "employee-leave",
        <EmployeeLeave />,
        "/dashboard/employee-leave"
      ),
      createProtectedRoute(
        "employee-attendance",
        <Attendance />,
        "/dashboard/employee-attendance"
      ),
      createProtectedRoute(
        "add-supplier",
        <AddSuppliers />,
        "/dashboard/add-supplier",
        "create"
      ),
      createProtectedRoute(
        "supplier-list",
        <SupplierList />,
        "/dashboard/supplier-list"
      ),
      createProtectedRoute(
        "supplier-profile",
        <SupplierProfile />,
        "/dashboard/supplier-profile"
      ),
      createProtectedRoute(
        "update-supplier",
        <UpdateSupplier />,
        "/dashboard/update-supplier",
        "edit"
      ),
      createProtectedRoute(
        "purchase-list",
        <PurchaseList />,
        "/dashboard/purchase-list"
      ),
      createProtectedRoute(
        "add-purchase",
        <AddPurchase />,
        "/dashboard/add-purchase",
        "create"
      ),
      createProtectedRoute(
        "update-purchase",
        <UpdatePurchase />,
        "/dashboard/update-purchase",
        "edit"
      ),
      createProtectedRoute(
        "update-purchase-return",
        <PurchaseReturnUpdate />,
        "/dashboard/update-purchase-return",
        "edit"
      ),
      createProtectedRoute("role", <Role />, "/dashboard/role"),
      createProtectedRoute(
        "add-role",
        <AddRole />,
        "/dashboard/add-role",
        "create"
      ),
      createProtectedRoute(
        "update-role",
        <UpdateRole />,
        "/dashboard/update-role",
        "edit"
      ),
      createProtectedRoute(
        "qutation",
        <AddQuotation />,
        "/dashboard/qutation",
        "create"
      ),
      createProtectedRoute(
        "update-quotation",
        <UpdateQuotation />,
        "/dashboard/update-quotation",
        "edit"
      ),
      createProtectedRoute(
        "quotation-view",
        <QuotationView />,
        "/dashboard/quotation-view"
      ),
      createProtectedRoute(
        "quotation-list",
        <QuotationList />,
        "/dashboard/quotation-list"
      ),
      createProtectedRoute(
        "update-invoice",
        <UpdateInvoice />,
        "/dashboard/update-invoice",
        "edit"
      ),
      createProtectedRoute("detail", <Detail />, "/dashboard/detail"),
      createProtectedRoute(
        "invoice-list",
        <InvoiceList />,
        "/dashboard/invoice-list"
      ),
      createProtectedRoute(
        "jobcard-list",
        <JobCardList />,
        "/dashboard/jobcard-list"
      ),
      createProtectedRoute(
        "money-receive",
        <MoneyReceived />,
        "/dashboard/money-receive",
        "create"
      ),
      createProtectedRoute(
        "money-receipt-list",
        <MoneyReceiptList />,
        "/dashboard/money-receipt-list"
      ),
      createProtectedRoute(
        "money-receipt-view",
        <MoneyReceiptView />,
        "/dashboard/money-receipt-view"
      ),
      createProtectedRoute(
        "money-receipt-update",
        <UpdateMoneyReceipt />,
        "/dashboard/money-receipt-update",
        "edit"
      ),
      createProtectedRoute(
        "money-receipt-due",
        <DuemoneyReceiptList />,
        "/dashboard/money-receipt-due"
      ),
      createProtectedRoute(
        "add-expanse",
        <AddExpense />,
        "/dashboard/add-expanse",
        "create"
      ),
      createProtectedRoute(
        "expanse-list",
        <ExpenseList />,
        "/dashboard/expanse-list"
      ),
      createProtectedRoute(
        "update-expense",
        <UpdateExpense />,
        "/dashboard/update-expense",
        "edit"
      ),
      createProtectedRoute(
        "view-expense",
        <ViewExpense />,
        "/dashboard/view-expense"
      ),
      createProtectedRoute(
        "expense-categories",
        <ExpenseCategoryList />,
        "/dashboard/expense-categories"
      ),
      createProtectedRoute(
        "add-attendance",
        <AddAttendance />,
        "/dashboard/add-attendance",
        "create"
      ),
      createProtectedRoute(
        "attendance-list",
        <AttendanceList />,
        "/dashboard/attendance-list"
      ),
      createProtectedRoute(
        "update-attendance",
        <UpdateAttendance />,
        "/dashboard/update-attendance",
        "edit"
      ),
      createProtectedRoute(
        "employee-salary",
        <EmployeeSalary />,
        "/dashboard/employee-salary"
      ),
      createProtectedRoute(
        "employee-salary-update",
        <UpdateEmployeeSalary />,
        "/dashboard/employee-salary-update",
        "edit"
      ),
      createProtectedRoute(
        "employee-overtime",
        <EmployeeOvertime />,
        "/dashboard/employee-overtime"
      ),
      createProtectedRoute(
        "create-overtime",
        <CreateEmployeeOverTime />,
        "/dashboard/create-overtime",
        "create"
      ),
      createProtectedRoute(
        "running-project",
        <RunningProject />,
        "/dashboard/running-project"
      ),
      createProtectedRoute(
        "complete-project",
        <CompletedProject />,
        "/dashboard/complete-project"
      ),
      createProtectedRoute(
        "view-attendance",
        <ViewEmployeeAttendance />,
        "/dashboard/view-attendance"
      ),
      createProtectedRoute("paybill", <BillPayList />, "/dashboard/paybill"),
      createProtectedRoute(
        "add-paybill",
        <AddPaybill />,
        "/dashboard/add-paybill",
        "create"
      ),
      createProtectedRoute(
        "update-paybill",
        <UpdateBillPay />,
        "/dashboard/update-paybill",
        "edit"
      ),
      createProtectedRoute(
        "paybill-view",
        <BillPayInvoice />,
        "/dashboard/paybill-view"
      ),
      createProtectedRoute(
        "bill-pay-history",
        <BillPayHistory />,
        "/dashboard/bill-pay-history"
      ),
      createProtectedRoute(
        "holiday",
        <EmployeeHoliday />,
        "/dashboard/holiday"
      ),
      createProtectedRoute(
        "create-holiday",
        <CreateHoliday />,
        "/dashboard/create-holiday",
        "create"
      ),
      createProtectedRoute(
        "update-holiday",
        <UpdateHoliday />,
        "/dashboard/update-holiday",
        "edit"
      ),
      createProtectedRoute(
        "add-income",
        <Income />,
        "/dashboard/add-income",
        "create"
      ),
      createProtectedRoute(
        "income-list",
        <IncomeList />,
        "/dashboard/income-list"
      ),
      createProtectedRoute(
        "update-income",
        <UpdateIncome />,
        "/dashboard/update-income",
        "edit"
      ),
      createProtectedRoute(
        "donation",
        <Donation />,
        "/dashboard/donation",
        "create"
      ),
      createProtectedRoute(
        "donation-list",
        <DonationList />,
        "/dashboard/donation-list"
      ),
      createProtectedRoute(
        "update-donation",
        <UpdateDonation />,
        "/dashboard/update-donation",
        "edit"
      ),
      createProtectedRoute("category", <CategoryList />, "/dashboard/category"),
      createProtectedRoute("brand", <Brand />, "/dashboard/brand"),
      createProtectedRoute("unit", <Unit />, "/dashboard/unit"),
      createProtectedRoute("barcode", <Barcode />, "/dashboard/barcode"),
      createProtectedRoute(
        "product-type",
        <ProductType />,
        "/dashboard/product-type"
      ),
      createProtectedRoute(
        "inventory-dashboard",
        <InventoryDashboard />,
        "/dashboard/inventory-dashboard"
      ),
      createProtectedRoute(
        "expired-products",
        <ExpiredProduct />,
        "/dashboard/expired-products"
      ),
      createProtectedRoute(
        "add-adjustment",
        <AddAdjustment />,
        "/dashboard/add-adjustment",
        "create"
      ),
      createProtectedRoute(
        "quantity-adjustment",
        <QuantityAdjustment />,
        "/dashboard/quantity-adjustment"
      ),
      createProtectedRoute("low-stocks", <LowStock />, "/dashboard/low-stocks"),
      createProtectedRoute(
        "warehouse",
        <WarehouseManagement />,
        "/dashboard/warehouse"
      ),
      createProtectedRoute("variants", <Variants />, "/dashboard/variants"),
      createProtectedRoute(
        "stock-transaction",
        <StockTransaction />,
        "/dashboard/stock-transaction"
      ),
      createProtectedRoute(
        "warranties",
        <WarrantiesPage />,
        "/dashboard/warranties"
      ),
      createProtectedRoute(
        "stock-transfer",
        <StockTransferPage />,
        "/dashboard/stock-transfer"
      ),
      createProtectedRoute(
        "remove-stock",
        <RemoveStock />,
        "/dashboard/remove-stock",
        "delete"
      ),
      createProtectedRoute(
        "expired-product-report",
        <ExpiredProductsReportPage />,
        "/dashboard/expired-product-report"
      ),
      createProtectedRoute(
        "low-stock-report",
        <LowStockReportPage />,
        "/dashboard/low-stock-report"
      ),
      createProtectedRoute(
        "product-stock-report",
        <ProductStockReportPage />,
        "/dashboard/product-stock-report"
      ),
      createProtectedRoute(
        "daily-stock-movement",
        <DailyStockMovementReportPage />,
        "/dashboard/daily-stock-movement"
      ),
      createProtectedRoute("report", <ReportsPage />, "/dashboard/report"),
      createProtectedRoute(
        "purchase-return",
        <PurchaseReturnList />,
        "/dashboard/purchase-return"
      ),
      createProtectedRoute(
        "purchase-order",
        <PurchaseOrder />,
        "/dashboard/purchase-order"
      ),
      createProtectedRoute(
        "purchase-return-add",
        <PurchaseReturn />,
        "/dashboard/purchase-return-add",
        "create"
      ),
      createProtectedRoute("stock", <StockPage />, "/dashboard/stock"),
      createProtectedRoute(
        "recycle-bin-jobcard-list",
        <RecyclebinJobcardList />,
        "/dashboard/recycle-bin-jobcard-list"
      ),
      createProtectedRoute(
        "recycle-bin-quotation-list",
        <RecycledQuotationList />,
        "/dashboard/recycle-bin-quotation-list"
      ),
      createProtectedRoute(
        "recycle-bin-moneyreceipt-list",
        <RecycledMoneyReceipt />,
        "/dashboard/recycle-bin-moneyreceipt-list"
      ),
      createProtectedRoute(
        "recycle-bin-customer-list",
        <RecycledbinCustomerList />,
        "/dashboard/recycle-bin-customer-list"
      ),
      createProtectedRoute(
        "recycle-bin-company-list",
        <RecycledbinCompanyList />,
        "/dashboard/recycle-bin-company-list"
      ),
      createProtectedRoute(
        "recycle-bin-showroom-list",
        <RecycledbinShowRoomList />,
        "/dashboard/recycle-bin-showroom-list"
      ),
      createProtectedRoute(
        "recycle-bin-employee-list",
        <RecycledbinEmployeeList />,
        "/dashboard/recycle-bin-employee-list"
      ),
      createProtectedRoute(
        "recycle-bin-supplier-list",
        <RecyclebinSupplierList />,
        "/dashboard/recycle-bin-supplier-list"
      ),
      createProtectedRoute(
        "recycle-bin-invoice-list",
        <RecycledbinInvoiceList />,
        "/dashboard/recycle-bin-invoice-list"
      ),
      createProtectedRoute(
        "all-customer",
        <AllCustomerList />,
        "/dashboard/all-customer"
      ),
      createProtectedRoute(
        "all-user",
        <AdminUserListPage />,
        "/dashboard/all-user"
      ),
      // ডুপ্লিকেট রাউট রিমুভ করা হয়েছে
      // createProtectedRoute("all-user", <UserProfilePage />, "/dashboard/all-user"),
      createProtectedRoute(
        "profile-update",
        <UpdateProfile />,
        "/dashboard/profile-update",
        "edit"
      ),
      createProtectedRoute(
        "all-tenant-list",
        <AllTenantList />,
        "/dashboard/all-tenant-list"
      ),
      createProtectedRoute(
        "all-user-list",
        <AllUserList />,
        "/dashboard/all-user-list"
      ),
      createProtectedRoute(
        "contact-customer",
        <ContactUserList />,
        "/dashboard/contact-customer"
      ),
      createProtectedRoute(
        "company-brand",
        <CompanyBrand />,
        "/dashboard/company-brand"
      ),
      createProtectedRoute("review", <Review />, "/dashboard/review"),
      createProtectedRoute("backup", <Backup />, "/dashboard/backup"),
      createProtectedRoute(
        "restore",
        <RestoreDatabase />,
        "/dashboard/restore"
      ),
    ],
  },
]);
