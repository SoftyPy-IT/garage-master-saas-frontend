import WarehouseManagement from "../../pages/Inventory/Warehouse/WarehouseManagement";
import WarehouseStocks from "../../pages/Inventory/Warehouse/WareHouseList";

export const warehouseRoutes = [
  {
    path: "warehouse",
    element: <WarehouseManagement />,
  },
  {
    path: "warehouse-stock",
    element: <WarehouseStocks />,
  },
];
