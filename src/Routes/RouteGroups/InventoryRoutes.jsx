import InventoryDashboard from "../../pages/Inventory/InventoryDashboard";
import ExpiredProduct from "../../pages/Inventory/ExpiredProduct";
import LowStock from "../../pages/Inventory/LowStock";
import Variants from "../../pages/Inventory/Variants";
import StockPage from "../../pages/Inventory/Stock";
import StockAdjustment from "../../pages/Inventory/Adjustment/AdjustmentList";
import AddAdjustment from "../../pages/Inventory/Adjustment/AddAdjustment";
import QuantityAdjustment from "../../pages/Inventory/Adjustment/AdjustmentList";
import PurchaseOrder from "../../pages/Inventory/PurchaseOrder/PurchaseOrder";
import PurchaseReturnList from "../../pages/Inventory/PurchaseReturn/PurchaseReturnList";
import WarrantiesPage from "../../pages/Inventory/Warranty/WarrantiesPage";
import StockTransaction from "../../pages/Inventory/StockTransaction/StockTransaction";
import StockTransfer from "../../pages/Inventory/StockTransfer/StockTransper";

export const inventoryRoutes = [
  {
    path: "inventory-dashboard",
    element: <InventoryDashboard />,
  },
  {
    path: "expired-products",
    element: <ExpiredProduct />,
  },
  {
    path: "add-adjustment",
    element: <AddAdjustment />,
    action: "create",
  },
  {
    path: "adjustment",
    element: <StockAdjustment />,
  },
  {
    path: "quantity-adjustment",
    element: <QuantityAdjustment />,
  },
  {
    path: "low-stocks",
    element: <LowStock />,
  },
  {
    path: "variants",
    element: <Variants />,
  },
  {
    path: "stock",
    element: <StockPage />,
  },
  {
    path: "stock-transaction",
    element: <StockTransaction />,
  },
  {
    path: "warranties",
    element: <WarrantiesPage />,
  },
  {
    path: "stock-transfer",
    element: <StockTransfer />,
  },
  {
    path: "purchase-order",
    element: <PurchaseOrder />,
  },
  {
    path: "purchase-return",
    element: <PurchaseReturnList />,
  },
];
