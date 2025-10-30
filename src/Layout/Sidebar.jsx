/* eslint-disable react/prop-types */
"use client";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Layout.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import {
  ExpandLess,
  Logout,
  Receipt,
  CurrencyExchange,
  ShoppingBag,
  Recycling,
  DirectionsCar,
  RequestQuote,
  MonetizationOn,
  Inventory,
  Inventory2,
  Category,
  LocalShipping,
  ShoppingCart,
  Storefront,
  LocalOffer,
  Widgets,
  Difference,
  AddShoppingCart,
  PointOfSale,
  AccountBalance,
  MoneyOff,
  PersonAdd,
  Business,
  Store,
  EventNote,
  CalendarToday,
  Group,
  DeleteForever,
  Assignment,
  Add,
  List,
  Savings,
  Payments,
  ReceiptLong,
  Settings,
  Backup,
  Restore,
  Security,
  AdminPanelSettings,
  Star,
  ContactMail,
  BrandingWatermark,
  Report,
  VolunteerActivism,
} from "@mui/icons-material";

import {
  FaUsers,
  FaHospitalUser,
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaMoneyBill,
  FaMoneyBillAlt,
  FaProjectDiagram,
  FaUserPlus,
  FaCalendarAlt,
  FaClipboardList,
  FaTrash,
  FaTrashRestore,
  FaTruck,
  FaTags,
  FaBarcode,
  FaExclamationTriangle,
  FaUserFriends,
  FaRunning,
  FaCheckCircle,
  FaDatabase,
  FaShieldAlt,
  FaUserCog,
} from "react-icons/fa";
import {
  HiOutlineHome,
  HiOutlineUserAdd,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineDocumentDuplicate,
  HiOutlineReceiptRefund,
  HiOutlineOfficeBuilding,
  HiOutlineTrash,
  HiOutlineExclamation,
  HiOutlineShieldCheck,
  HiOutlineSwitchHorizontal,
} from "react-icons/hi";
import { TbAdjustmentsCheck, TbTransformFilled } from "react-icons/tb";
import { MdOutlineInventory, MdOutlineWarehouse } from "react-icons/md";


import LeftHoberSidebar from "../components/Appbar/LeftHoberSidebar";
import { useDispatch } from "react-redux";
import { useTenantLogoutMutation } from "../redux/api/authApi";
import { logout } from "../redux/feature/authSlice";
import { toast } from "react-toastify";
const Sidebar = ({ toggle }) => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const [tenantLogout] = useTenantLogoutMutation();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await tenantLogout().unwrap();
      dispatch(logout());
      if (res.success) {
        toast.success("Logged out successfully!");
        navigate("/");
      }
    } catch (err) {
      toast.error("Logout failed!");
    }
  };
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Menu configuration data
  const menuItems = [
    {
      id: "dashboard",
      type: "single",
      icon: <HiOutlineHome size={35} />,
      text: "Dashboard",
      link: "/dashboard",
    },
    {
      id: "panel12",
      type: "accordion",
      title: "Client",
      icon: <HiOutlineUserGroup size={22} />,
      items: [
        {
          icon: <HiOutlineUserAdd className="h-5 w-5" />,
          text: "Customer Add",
          link: "/dashboard/add-customer",
        },
        {
          icon: <FaUserFriends className="h-5 w-5" />,
          text: "Customer List",
          link: "/dashboard/customer-list",
        },
        {
          icon: <Business className="h-5 w-5" />,
          text: "Company Add",
          link: "/dashboard/add-company",
        },
        {
          icon: <HiOutlineOfficeBuilding className="h-5 w-5" />,
          text: "Company List",
          link: "/dashboard/company-list",
        },
        {
          icon: <Store className="h-5 w-5" />,
          text: "Show Room Add",
          link: "/dashboard/add-show-room",
        },
        {
          icon: <Storefront className="h-5 w-5" />,
          text: "Show Room List",
          link: "/dashboard/show-room-list",
        },
      ],
    },
    {
      id: "panel1",
      type: "accordion",
      title: "Vehicle Job Card",
      icon: <DirectionsCar />,
      items: [
        {
          icon: <Assignment className="h-5 w-5" />,
          text: "Job Card Add",
          link: "/dashboard/create-job-card",
        },
        {
          icon: <FaClipboardList className="h-5 w-5" />,
          text: "Job Card List",
          link: "/dashboard/jobcard-list",
        },
      ],
    },
    {
      id: "panel2",
      type: "accordion",
      title: "Quotation",
      icon: <RequestQuote />,
      items: [
        {
          icon: <HiOutlineDocumentText className="h-6 w-6" />,
          text: "Quotation Add",
          link: "/dashboard/create-quotation",
        },
        {
          icon: <HiOutlineDocumentDuplicate className="h-6 w-6" />,
          text: "Quotation List",
          link: "/dashboard/quotation-list",
        },
      ],
    },
    {
      id: "panel3",
      type: "accordion",
      title: "Invoice Card",
      icon: <Receipt />,
      items: [
        {
          icon: <FaFileInvoice className="h-5 w-5" />,
          text: "Invoice Add",
          link: "/dashboard/create-invoice",
        },
        {
          icon: <FaFileInvoiceDollar className="h-5 w-5" />,
          text: "Invoice List",
          link: "/dashboard/invoice-list",
        },
      ],
    },
    {
      id: "panel4",
      type: "accordion",
      title: "Money receipt",
      icon: <CurrencyExchange />,
      items: [
        {
          icon: <FaMoneyBillWave className="h-5 w-5" />,
          text: "Money Receipt Add",
          link: "/dashboard/money-receive-create",
        },
        {
          icon: <FaMoneyBill className="h-5 w-5" />,
          text: "Money Receipt List",
          link: "/dashboard/money-receipt-list",
        },
      ],
    },
    {
      id: "panel5",
      type: "accordion",
      title: "Projects",
      icon: <FaProjectDiagram size={22} />,
      items: [
        {
          icon: <FaRunning size={22} className="h-5 w-5" />,
          text: "Running Project",
          link: "/dashboard/running-project",
        },
        {
          icon: <FaCheckCircle size={22} className="h-5 w-5" />,
          text: "Complete Project",
          link: "/dashboard/complete-project",
        },
      ],
    },
    {
      id: "panel17",
      type: "accordion",
      title: "Suppliers",
      icon: <LocalShipping />,
      items: [
        {
          icon: <PersonAdd className="h-5 w-5" />,
          text: "Add Supplier",
          link: "/dashboard/add-supplier",
        },
        {
          icon: <FaTruck className="h-5 w-5" />,
          text: "Supplier List",
          link: "/dashboard/supplier-list",
        },
      ],
    },
    {
      id: "panel-product",
      type: "accordion",
      title: "Product",
      icon: <Inventory />,
      items: [
        {
          icon: <Add className="h-5 w-5" />,
          text: "Product Add",
          link: "/dashboard/add-product",
        },
        {
          icon: <List className="h-5 w-5" />,
          text: "Product List",
          link: "/dashboard/product-list",
        },
        {
          icon: <Category className="h-5 w-5" />,
          text: "Product Type",
          link: "/dashboard/product-type",
        },
        {
          icon: <HiOutlineExclamation className="h-5 w-5" />,
          text: "Expired Product",
          link: "/dashboard/expired-products",
        },
        {
          icon: <FaTags className="h-5 w-5" />,
          text: "Category",
          link: "/dashboard/category",
        },
        {
          icon: <LocalOffer className="h-5 w-5" />,
          text: "Brand",
          link: "/dashboard/brand",
        },
        {
          icon: <Widgets className="h-5 w-5" />,
          text: "Unit",
          link: "/dashboard/unit",
        },
        {
          icon: <Difference className="h-5 w-5" />,
          text: "Variant Attributes",
          link: "/dashboard/variants",
        },
        {
          icon: <FaBarcode className="h-5 w-5" />,
          text: "Generate Barcode",
          link: "/dashboard/barcode",
        },
      ],
    },
    {
      id: "panel18",
      type: "accordion",
      title: "Purchase",
      icon: <ShoppingCart />,
      items: [
        {
          icon: <PointOfSale className="h-5 w-5" />,
          text: "Purchase Order",
          link: "/dashboard/purchase-order",
        },
        {
          icon: <AddShoppingCart className="h-5 w-5" />,
          text: "Purchase Add",
          link: "/dashboard/add-purchase",
        },
        {
          icon: <FaTruck className="h-5 w-5" />,
          text: "Purchase List",
          link: "/dashboard/purchase-list",
        },
        {
          icon: <HiOutlineReceiptRefund className="h-5 w-5" />,
          text: "Purchase Return",
          link: "/dashboard/purchase-return",
        },
      ],
    },
    {
      id: "panel6",
      type: "accordion",
      title: "Inventory",
      icon: <ShoppingBag />,
      items: [
        { icon: <Inventory2 className="h-5 w-5"/>, text: "Mange Stock", link: "/dashboard/stock" },
        {
          icon: <MdOutlineWarehouse className="h-6 w-6"/>,
          text: "Warehouse Stock",
          link: "/dashboard/warehouse-stock",
        },
        {
          icon: <MdOutlineInventory className="h-6 w-6"/>,
          text: "Manage Warehouse",
          link: "/dashboard/warehouse",
        },
        {
          icon: <HiOutlineSwitchHorizontal className="h-6 w-6"/>,
          text: "Stock Transfer",
          link: "/dashboard/stock-transfer",
        },
        {
          icon: <TbAdjustmentsCheck className="h-6 w-6"/>,
          text: "Quantity Adjustment",
          link: "/dashboard/quantity-adjustment",
        },
        {
          icon: <HiOutlineShieldCheck className="h-6 w-6"/>,
          text: "Warranties",
          link: "/dashboard/warranties",
        },
        {
          icon: <FaExclamationTriangle className="h-6 w-6"/>,
          text: "Low Stock Alert",
          link: "/dashboard/low-stocks",
        },
        {
          icon: <TbTransformFilled className="h-5 w-5"/>,
          text: "Stock Transaction",
          link: "/dashboard/stock-transaction",
        },
      ],
    },
    {
      id: "panel10",
      type: "accordion",
      title: "Finance",
      icon: <AccountBalance size={22} />,
      items: [
        {
          icon: <Payments className="h-5 w-5" />,
          text: "Add Income",
          link: "/dashboard/add-income",
        },
        {
          icon: <MonetizationOn className="h-5 w-5" />,
          text: "Income List",
          link: "/dashboard/income-list",
        },
        {
          icon: <MoneyOff className="h-5 w-5" />,
          text: "Expense Add",
          link: "/dashboard/add-expense",
        },
        {
          icon: <FaMoneyBillAlt className="h-5 w-5" />,
          text: "Expense List",
          link: "/dashboard/expense-list",
        },
        {
          icon: <Category className="h-5 w-5" />,
          text: "Expense Categories",
          link: "/dashboard/expense-categories",
        },
        {
          icon: <Savings className="h-5 w-5" />,
          text: "Donation Add",
          link: "/dashboard/create-donation",
        },
        {
          icon: <ReceiptLong className="h-5 w-5" />,
          text: "Donation List",
          link: "/dashboard/donation-list",
        },
      ],
    },
    {
      id: "panel13",
      type: "accordion",
      title: "HRM",
      icon: <FaUsers size={22} />,
      items: [
        {
          icon: <FaUserPlus className="h-5 w-5" />,
          text: "Employee Add",
          link: "/dashboard/add-employee",
        },
        {
          icon: <Group className="h-5 w-5" />,
          text: "Employee List",
          link: "/dashboard/employee-list",
        },
        {
          icon: <CalendarToday className="h-5 w-5" />,
          text: "Attendance Add",
          link: "/dashboard/add-attendance",
        },
        {
          icon: <FaCalendarAlt className="h-5 w-5" />,
          text: "Attendance List",
          link: "/dashboard/attendance-list",
        },
        {
          icon: <EventNote className="h-5 w-5" />,
          text: "Leave",
          link: "/dashboard/employee-leave",
        },
        {
          icon: <Payments className="h-5 w-5" />,
          text: "Salary",
          link: "/dashboard/employee-salary",
        },
      ],
    },
    {
      id: "panel30",
      type: "accordion",
      title: "Tenant & UI Management",
      icon: <AdminPanelSettings size={22} />,
      items: [
        {
          icon: <Business className="h-5 w-5" />,
          text: "All Tenant List",
          link: "/dashboard/all-tenant-list",
        },
        {
          icon: <ContactMail className="h-5 w-5" />,
          text: "Contact Customer List",
          link: "/dashboard/contact-customer",
        },
        {
          icon: <BrandingWatermark className="h-5 w-5" />,
          text: "Company Brand",
          link: "/dashboard/company-brand",
        },
        {
          icon: <Star className="h-5 w-5" />,
          text: "Client Review",
          link: "/dashboard/review",
        },
      ],
      condition: user.role === "superadmin",
    },
    {
      id: "all-user-list",
      type: "single",
      icon: <Group size={22} />,
      text: "All User List",
      link: "/dashboard/all-user-list",
    },
    {
      id: "panel27",
      type: "accordion",
      title: "Report",
      icon: <Report />,
      items: [
        {
          icon: <RequestQuote className="h-5 w-5" />,
          text: "Income Report",
          link: "/dashboard/income-report",
        },
        {
          icon: <CurrencyExchange className="h-5 w-5" />,
          text: "Expense Report",
          link: "/dashboard/expense-report",
        },
        {
          icon: <VolunteerActivism className="h-5 w-5" />,
          text: "Donation Report",
          link: "/dashboard/donation-report",
        },
        {
          icon: <Receipt className="h-5 w-5" />,
          text: "Invoice Report",
          link: "/dashboard/invoice-report",
        },
      ],
    },
    {
      id: "panel27-permission",
      type: "accordion",
      title: "Permission",
      icon: <Security />,
      items: [
        {
          icon: <FaUserCog className="h-5 w-5" />,
          text: "User Permission",
          link: "/dashboard/user-permission",
        },
        {
          icon: <FaShieldAlt className="h-5 w-5" />,
          text: "Role Management",
          link: "/dashboard/role-management",
        },
        {
          icon: <Settings className="h-5 w-5" />,
          text: "Page Management",
          link: "/dashboard/page-management",
        },
      ],
    },
    {
      id: "panel16",
      type: "accordion",
      title: "Recycle Bin",
      icon: <Recycling />,
      items: [
        {
          icon: <DeleteForever className="h-5 w-5" />,
          text: "Jobcard List",
          link: "/dashboard/recycle-bin-jobcard-list",
        },
        {
          icon: <FaTrash className="h-5 w-5" />,
          text: "Quotation List",
          link: "/dashboard/recycle-bin-quotation-list",
        },
        {
          icon: <HiOutlineTrash className="h-5 w-5" />,
          text: "Invoice List",
          link: "/dashboard/recycle-bin-invoice-list",
        },
        {
          icon: <FaTrashRestore className="h-5 w-5" />,
          text: "Money Receipt List",
          link: "/dashboard/recycle-bin-moneyreceipt-list",
        },
        {
          icon: <HiOutlineUserGroup className="h-5 w-5" />,
          text: "Customer List",
          link: "/dashboard/recycle-bin-customer-list",
        },
        {
          icon: <HiOutlineOfficeBuilding className="h-5 w-5" />,
          text: "Company List",
          link: "/dashboard/recycle-bin-company-list",
        },
        {
          icon: <Storefront className="h-5 w-5" />,
          text: "Show Room List",
          link: "/dashboard/recycle-bin-showroom-list",
        },
        {
          icon: <FaUsers className="h-5 w-5" />,
          text: "Employee List",
          link: "/dashboard/recycle-bin-employee-list",
        },
        {
          icon: <FaHospitalUser className="h-5 w-5" />,
          text: "Supplier List",
          link: "/dashboard/recycle-bin-supplier-list",
        },
      ],
    },
    {
      id: "panel15",
      type: "accordion",
      title: "Database Backup",
      icon: <FaDatabase size={22} />,
      items: [
        {
          icon: <Backup className="h-5 w-5" />,
          text: "Backup Database",
          link: "/dashboard/backup",
        },
        {
          icon: <Restore className="h-5 w-5" />,
          text: "Restore Database",
          link: "/dashboard/restore",
        },
      ],
    },
    {
      id: "logout",
      type: "single",
      icon: <Logout size={22} />,
      text: "Log Out",
      action: handleLogout,
    },
  ];

  const renderSingleItem = (item) => {
    if (item.condition === false) return null;

    if (item.action) {
      return (
        <div key={item.id} className="pl-4 space-y-3 mt-3 mb-20">
          <div
            onClick={item.action}
            className="flex items-center dashboardItems cursor-pointer"
          >
            {item.icon}
            <span className="ml-2">{item.text}</span>
          </div>
        </div>
      );
    }

    return (
      <div
        key={item.id}
        className={item.id === "dashboard" ? "" : "pl-4 space-y-3 mt-3"}
      >
        {item.id === "dashboard" ? (
          <NavLink to={item.link} className="z-10 flex p-4 items-center">
            {item.icon}
            <h3 className="text-xl font-semibold ml-2">{item.text}</h3>
          </NavLink>
        ) : (
          <Link to={item.link}>
            <div className="flex items-center dashboardItems cursor-pointer">
              {item.icon}
              <span className="ml-2">{item.text}</span>
            </div>
          </Link>
        )}
      </div>
    );
  };

  const renderAccordionItem = (item) => {
    if (item.condition === false) return null;

    return (
      <Accordion
        key={item.id}
        sx={{ paddingBottom: "10px" }}
        className="dashboardAccordion"
        expanded={expanded === item.id}
        onChange={handleChange(item.id)}
      >
        <AccordionSummary
          sx={{ marginBottom: "-10px" }}
          expandIcon={<ExpandLess className="accordionExpandIcon" />}
          aria-controls={`${item.id}-content`}
          id={`${item.id}-header`}
          className={
            item.id === "panel12" || item.id === "panel2"
              ? "dashboardAccordionSummary"
              : ""
          }
        >
          <Typography>
            <div className="flex items-center justify-center">
              {item.icon}
              <span className="ml-2">{item.title}</span>
            </div>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {item.items.map((subItem, index) => (
            <NavLink
              key={index}
              to={subItem.link}
              className="flex items-center content-center gap-3 p-2 pl-6 hover:bg-[#3a3f45] rounded transition-colors duration-200"
            >
              <div className="">{subItem.icon}</div>
              <div className="text-sm font-normal">{subItem.text}</div>
            </NavLink>
          ))}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <aside className="flex">
      <div
        className={`${
          toggle
            ? `fixed overflow-y-scroll overflow-x-hidden drawwerLeftSide h-screen text-lg font-semibold bg-[#2C3136] text-white`
            : `fixed overflow-y-scroll overflow-x-hidden sideBarActive h-screen text-lg font-semibold bg-[#2C3136] text-white`
        }`}
      >
        {menuItems.map((item) =>
          item.type === "single"
            ? renderSingleItem(item)
            : renderAccordionItem(item)
        )}
      </div>
      <div
        className={`${toggle ? `rightSideBarWrap` : `activeRightSideBarWrap`}`}
      >
        <LeftHoberSidebar />
      </div>
    </aside>
  );
};

export default Sidebar;
