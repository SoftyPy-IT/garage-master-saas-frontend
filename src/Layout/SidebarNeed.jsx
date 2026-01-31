// /* eslint-disable react/prop-types */
// /* eslint-disable no-unused-vars */
// // src/components/Sidebar.js
// import React from 'react';
// import { usePermissions } from '../context/PermissionContext';
// import { 
//   List, 
//   ListItem, 
//   ListItemButton, 
//   ListItemIcon, 
//   ListItemText,
//   Collapse,
//   Tooltip,
//   Badge
// } from '@mui/material';
// import { 
//   ExpandLess, 
//   ExpandMore,
//   Dashboard as DashboardIcon,
//   People as PeopleIcon,
//   Assignment as AssignmentIcon,
//   Receipt as ReceiptIcon,
//   AttachMoney as MoneyIcon,
//   ShoppingCart as CartIcon,
//   Inventory as InventoryIcon,
//   AccountBalance as FinanceIcon,
//   Person as PersonIcon,
//   Settings as SettingsIcon,
//   Delete as DeleteIcon,
//   Backup as BackupIcon,
//   Business as BusinessIcon
// } from '@mui/icons-material';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { styled } from '@mui/material/styles';

// const StyledListItem = styled(ListItem)(({ theme }) => ({
//   '&:hover': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   '&.active': {
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.primary.contrastText,
//     '& .MuiListItemIcon-root': {
//       color: theme.palette.primary.contrastText,
//     },
//   },
// }));

// const menuItems = [
//   {
//     path: '/dashboard',
//     title: 'Dashboard',
//     icon: <DashboardIcon />,
//     permission: 'view'
//   },
//   {
//     title: 'Client Management',
//     icon: <PeopleIcon />,
//     children: [
//       { path: '/dashboard/add-customer', title: 'Add Customer', permission: 'create' },
//       { path: '/dashboard/customer-list', title: 'Customer List', permission: 'view' },
//       { path: '/dashboard/update-customer', title: 'Update Customer', permission: 'edit' },
//       { path: '/dashboard/customer-profile', title: 'Customer Profile', permission: 'view' },
//       { path: '/dashboard/all-customer', title: 'All Customers', permission: 'view' },
//       { path: '/dashboard/add-company', title: 'Add Company', permission: 'create' },
//       { path: '/dashboard/company-list', title: 'Company List', permission: 'view' },
//       { path: '/dashboard/update-company', title: 'Update Company', permission: 'edit' },
//       { path: '/dashboard/company-profile', title: 'Company Profile', permission: 'view' },
//       { path: '/dashboard/add-show-room', title: 'Add Show Room', permission: 'create' },
//       { path: '/dashboard/show-room-list', title: 'Show Room List', permission: 'view' },
//       { path: '/dashboard/update-show-room', title: 'Update Show Room', permission: 'edit' },
//       { path: '/dashboard/show-room-profile', title: 'Show Room Profile', permission: 'view' },
//     ]
//   },
//   {
//     title: 'Job Management',
//     icon: <AssignmentIcon />,
//     children: [
//       { path: '/dashboard/create-job-card', title: 'Add Job Card', permission: 'create' },
//       { path: '/dashboard/jobcard-list', title: 'Job Card List', permission: 'view' },
//       { path: '/dashboard/update-jobcard', title: 'Update Job Card', permission: 'edit' },
//       { path: '/dashboard/preview', title: 'Preview Job Card', permission: 'view' },
//     ]
//   },
//   {
//     title: 'Quotations',
//     icon: <ReceiptIcon />,
//     children: [
//       { path: '/dashboard/create-quotation', title: 'Create Quotation', permission: 'create' },
//       { path: '/dashboard/quotation-list', title: 'Quotation List', permission: 'view' },
//       { path: '/dashboard/update-quotation', title: 'Update Quotation', permission: 'edit' },
//       { path: '/dashboard/quotation-view', title: 'Quotation View', permission: 'view' },
//     ]
//   },
//   {
//     title: 'Invoices',
//     icon: <ReceiptIcon />,
//     children: [
//       { path: '/dashboard/create-invoice', title: 'Create Invoice', permission: 'create' },
//       { path: '/dashboard/create-invoice-list', title: 'Invoice List', permission: 'view' },
//       { path: '/dashboard/update-invoice', title: 'Update Invoice', permission: 'edit' },
//       { path: '/dashboard/detail', title: 'Invoice Detail', permission: 'view' },
//     ]
//   },
//   {
//     title: 'Money Receipts',
//     icon: <MoneyIcon />,
//     children: [
//       { path: '/dashboard/money-receive-create', title: 'Create Money Receipt', permission: 'create' },
//       { path: '/dashboard/money-receipt-list', title: 'Money Receipt List', permission: 'view' },
//       { path: '/dashboard/money-receipt-update', title: 'Update Money Receipt', permission: 'edit' },
//       { path: '/dashboard/money-receipt-view', title: 'Money Receipt View', permission: 'view' },
//       { path: '/dashboard/money-receipt-due', title: 'Due Money Receipts', permission: 'view' },
//     ]
//   },
//   {
//     title: 'Products',
//     icon: <InventoryIcon />,
//     children: [
//       { path: '/dashboard/add-product', title: 'Add Product', permission: 'create' },
//       { path: '/dashboard/product-list', title: 'Product List', permission: 'view' },
//       { path: '/dashboard/update-product', title: 'Update Product', permission: 'edit' },
//       { path: '/dashboard/product-type', title: 'Product Types', permission: 'view' },
//       { path: '/dashboard/category', title: 'Categories', permission: 'view' },
//       { path: '/dashboard/brand', title: 'Brands', permission: 'view' },
//       { path: '/dashboard/unit', title: 'Units', permission: 'view' },
//       { path: '/dashboard/barcode', title: 'Barcode Generator', permission: 'view' },
//     ]
//   },
//   {
//     title: 'Purchases',
//     icon: <CartIcon />,
//     children: [
//       { path: '/dashboard/purchase-order', title: 'Purchase Orders', permission: 'view' },
//       { path: '/dashboard/add-purchase', title: 'Add Purchase', permission: 'create' },
//       { path: '/dashboard/purchase-list', title: 'Purchase List', permission: 'view' },
//       { path: '/dashboard/update-purchase', title: 'Update Purchase', permission: 'edit' },
//       { path: '/dashboard/purchase-return-add', title: 'Purchase Return', permission: 'create' },
//       { path: '/dashboard/purchase-return', title: 'Purchase Return List', permission: 'view' },
//       { path: '/dashboard/update-purchase-return', title: 'Update Purchase Return', permission: 'edit' },
//     ]
//   },
//   {
//     title: 'Inventory',
//     icon: <InventoryIcon />,
//     children: [
//       { path: '/dashboard/inventory-dashboard', title: 'Inventory Dashboard', permission: 'view' },
//       { path: '/dashboard/stock', title: 'Stock Management', permission: 'view' },
//       { path: '/dashboard/warehouse', title: 'Warehouse Management', permission: 'view' },
//       { path: '/dashboard/stock-transfer', title: 'Stock Transfer', permission: 'view' },
//       { path: '/dashboard/quantity-adjustment', title: 'Quantity Adjustment', permission: 'view' },
//       { path: '/dashboard/add-adjustment', title: 'Add Adjustment', permission: 'create' },
//       { path: '/dashboard/adjustment', title: 'Adjustment List', permission: 'view' },
//       { path: '/dashboard/warranties', title: 'Warranties', permission: 'view' },
//       { path: '/dashboard/low-stocks', title: 'Low Stock Alerts', permission: 'view' },
//       { path: '/dashboard/expired-products', title: 'Expired Products', permission: 'view' },
//       { path: '/dashboard/remove-stock', title: 'Remove Stock', permission: 'delete' },
//       { path: '/dashboard/stock-transaction', title: 'Stock Transactions', permission: 'view' },
//       { path: '/dashboard/variants', title: 'Variants', permission: 'view' },
//     ]
//   },
//   {
//     title: 'Finance',
//     icon: <FinanceIcon />,
//     children: [
//       { path: '/dashboard/add-income', title: 'Add Income', permission: 'create' },
//       { path: '/dashboard/income-list', title: 'Income List', permission: 'view' },
//       { path: '/dashboard/update-income', title: 'Update Income', permission: 'edit' },
//       { path: '/dashboard/add-expense', title: 'Add Expense', permission: 'create' },
//       { path: '/dashboard/expanse-list', title: 'Expense List', permission: 'view' },
//       { path: '/dashboard/update-expense', title: 'Update Expense', permission: 'edit' },
//       { path: '/dashboard/view-expense', title: 'View Expense', permission: 'view' },
//       { path: '/dashboard/expense-categories', title: 'Expense Categories', permission: 'view' },
//       { path: '/create-donation', title: 'Donations', permission: 'view' },
//       { path: '/create-donation-list', title: 'Donation List', permission: 'view' },
//       { path: '/dashboard/update-donation', title: 'Update Donation', permission: 'edit' },
//     ]
//   },
//   {
//     title: 'HRM',
//     icon: <PersonIcon />,
//     children: [
//       { path: '/dashboard/add-employee', title: 'Add Employee', permission: 'create' },
//       { path: '/dashboard/employee-list', title: 'Employee List', permission: 'view' },
//       { path: '/dashboard/update-employee', title: 'Update Employee', permission: 'edit' },
//       { path: '/dashboard/employee-profile', title: 'Employee Profile', permission: 'view' },
//       { path: '/dashboard/employee-leave', title: 'Leave Management', permission: 'view' },
//       { path: '/dashboard/employee-attendance', title: 'Attendance', permission: 'view' },
//       { path: '/dashboard/add-attendance', title: 'Add Attendance', permission: 'create' },
//       { path: '/dashboard/attendance-list', title: 'Attendance List', permission: 'view' },
//       { path: '/dashboard/update-attendance', title: 'Update Attendance', permission: 'edit' },
//       { path: '/dashboard/view-attendance', title: 'View Attendance', permission: 'view' },
//       { path: '/dashboard/employee-salary', title: 'Salary Management', permission: 'view' },
//       { path: '/dashboard/employee-salary-update', title: 'Update Salary', permission: 'edit' },
//       { path: '/dashboard/employee-overtime', title: 'Overtime', permission: 'view' },
//       { path: '/dashboard/create-overtime', title: 'Create Overtime', permission: 'create' },
//       { path: '/dashboard/update-overtime', title: 'Update Overtime', permission: 'edit' },
//     ]
//   },
//   {
//     title: 'Projects',
//     icon: <AssignmentIcon />,
//     children: [
//       { path: '/dashboard/running-project', title: 'Running Projects', permission: 'view' },
//       { path: '/dashboard/complete-project', title: 'Completed Projects', permission: 'view' },
//     ]
//   },
//   {
//     title: 'Suppliers',
//     icon: <CartIcon />,
//     children: [
//       { path: '/dashboard/add-supplier', title: 'Add Supplier', permission: 'create' },
//       { path: '/dashboard/supplier-list', title: 'Supplier List', permission: 'view' },
//       { path: '/dashboard/update-supplier', title: 'Update Supplier', permission: 'edit' },
//       { path: '/dashboard/supplier-profile', title: 'Supplier Profile', permission: 'view' },
//     ]
//   },
//   {
//     title: 'System',
//     icon: <SettingsIcon />,
//     children: [
//       { path: '/dashboard/all-user-list', title: 'User Management', permission: 'view' },
//       { path: '/dashboard/role', title: 'Role Management', permission: 'view' },
//       { path: '/dashboard/add-role', title: 'Add Role', permission: 'create' },
//       { path: '/dashboard/update-role', title: 'Update Role', permission: 'edit' },
//       { path: '/dashboard/profile', title: 'Profile', permission: 'view' },
//       { path: '/dashboard/profile-update', title: 'Update Profile', permission: 'edit' },
//     ]
//   },
//   {
//     title: 'Reports',
//     icon: <AssignmentIcon />,
//     children: [
//       { path: '/dashboard/report', title: 'All Reports', permission: 'view' },
//       { path: '/dashboard/expired-product-report', title: 'Expired Products', permission: 'view' },
//       { path: '/dashboard/low-stock-report', title: 'Low Stock', permission: 'view' },
//       { path: '/dashboard/product-stock-report', title: 'Product Stock', permission: 'view' },
//       { path: '/dashboard/daily-stock-movement', title: 'Daily Stock Movement', permission: 'view' },
//     ]
//   },
//   {
//     title: 'Recycle Bin',
//     icon: <DeleteIcon />,
//     children: [
//       { path: '/dashboard/recycle-bin-jobcard-list', title: 'Job Cards', permission: 'view' },
//       { path: '/dashboard/recycle-bin-quotation-list', title: 'Quotations', permission: 'view' },
//       { path: '/dashboard/recycle-bin-moneyreceipt-list', title: 'Money Receipts', permission: 'view' },
//       { path: '/dashboard/recycle-bin-customer-list', title: 'Customers', permission: 'view' },
//       { path: '/dashboard/recycle-bin-company-list', title: 'Companies', permission: 'view' },
//       { path: '/dashboard/recycle-bin-showroom-list', title: 'Show Rooms', permission: 'view' },
//       { path: '/dashboard/recycle-bin-employee-list', title: 'Employees', permission: 'view' },
//       { path: '/dashboard/recycle-bin-supplier-list', title: 'Suppliers', permission: 'view' },
//       { path: '/dashboard/recycle-bin-invoice-list', title: 'Invoices', permission: 'view' },
//     ]
//   },
//   {
//     title: 'Backup & Restore',
//     icon: <BackupIcon />,
//     children: [
//       { path: '/dashboard/backup', title: 'Backup Database', permission: 'view' },
//       { path: '/dashboard/restore', title: 'Restore Database', permission: 'view' },
//     ]
//   },
//   {
//     title: 'Tenant Management',
//     icon: <BusinessIcon />,
//     permission: 'superadmin',
//     children: [
//       { path: '/dashboard/all-tenant-list', title: 'All Tenants', permission: 'view' },
//       { path: '/dashboard/contact-customer', title: 'Contact Customers', permission: 'view' },
//       { path: '/dashboard/company-brand', title: 'Company Brands', permission: 'view' },
//       { path: '/dashboard/review', title: 'Client Reviews', permission: 'view' },
//     ]
//   },
// ];

// const Sidebar = ({ open, handleDrawerToggle }) => {
//   const { checkPermission } = usePermissions();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [openMenus, setOpenMenus] = React.useState({});

//   const handleMenuClick = (title) => {
//     setOpenMenus(prev => ({
//       ...prev,
//       [title]: !prev[title]
//     }));
//   };

//   const isActive = (path) => {
//     return location.pathname === path;
//   };

//   const renderMenuItems = (items) => {
//     return items.map((item) => {
//       // Check if user has permission for this menu item
//       if (item.permission === 'superadmin' && !checkPermission('/dashboard/all-tenant-list', 'view')) {
//         return null;
//       }

//       if (item.children) {
//         // Check if any child has permission
//         const hasVisibleChild = item.children.some(child => 
//           checkPermission(child.path, child.permission)
//         );

//         if (!hasVisibleChild) {
//           return null;
//         }

//         return (
//           <React.Fragment key={item.title}>
//             <ListItem disablePadding>
//               <ListItemButton onClick={() => handleMenuClick(item.title)}>
//                 <ListItemIcon>
//                   <Badge 
//                     variant="dot" 
//                     color="primary" 
//                     invisible={!openMenus[item.title]}
//                   >
//                     {item.icon}
//                   </Badge>
//                 </ListItemIcon>
//                 <ListItemText primary={item.title} />
//                 {openMenus[item.title] ? <ExpandLess /> : <ExpandMore />}
//               </ListItemButton>
//             </ListItem>
//             <Collapse in={openMenus[item.title]} timeout="auto" unmountOnExit>
//               <List component="div" disablePadding sx={{ pl: 4 }}>
//                 {renderMenuItems(item.children)}
//               </List>
//             </Collapse>
//           </React.Fragment>
//         );
//       }

//       if (!checkPermission(item.path, item.permission)) {
//         return null;
//       }

//       return (
//         <StyledListItem 
//           key={item.path} 
//           disablePadding 
//           className={isActive(item.path) ? 'active' : ''}
//         >
//           <Tooltip title={item.title} placement="right">
//             <ListItemButton onClick={() => navigate(item.path)}>
//               <ListItemIcon>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.title} />
//             </ListItemButton>
//           </Tooltip>
//         </StyledListItem>
//       );
//     });
//   };

//   return (
//     <List>
//       {renderMenuItems(menuItems)}
//     </List>
//   );
// };

// export default Sidebar;