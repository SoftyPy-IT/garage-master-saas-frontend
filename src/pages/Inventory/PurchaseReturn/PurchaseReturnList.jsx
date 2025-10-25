import { Toaster } from "react-hot-toast";
import { Box, useTheme, alpha } from "@mui/material";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DeleteIcon from "@mui/icons-material/Delete";
import { usePurchaseReturns } from "../../../hooks/usePurchaseReturns.js";
import PageHeader from "./PageHeader.jsx";
import BreadcrumbNav from "./BreadcrumbNav.jsx";
import FilterSection from "./FilterSection.jsx";
import PurchaseReturnTable from "./PurchaseReturnTable.jsx.jsx";
import ActionMenu from "./ActionMenu.jsx";
import StatsSection from "./StatsSection.jsx";

function PurchaseReturnList() {
  const theme = useTheme();
  const {
    searchTerm,
    anchorEl,
    dateRange,

    filterStatus,
    filterWarehouse,
    isLoading,
    purchaseLoading,
    page,
    selectedReturn,
    purchaseReturnData,
    warehouseOptions,
    totalReturns,
    pendingReturns,
    completedReturns,
    cancelledReturns,
    handleMenuClose,
    handleViewReturn,
    handleEditReturn,
    handleDeleteReturn,
    handleAddReturn,
    handleDateRangeChange,
    handlePageChange,
    handleSearchChange,

    setFilterStatus,
    setFilterWarehouse,
  } = usePurchaseReturns();

  const statsData = [
    {
      id: 1,
      value: totalReturns,
      title: "Total Returns",
      icon: <AssignmentReturnIcon className="text-[30px]" />,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.primary.light,
        0.2
      )}, ${alpha(theme.palette.primary.main, 0.05)})`,
      avatarColor: theme.palette.primary.main,
    },
    {
      id: 2,
      value: pendingReturns,
      title: "Pending Returns",
      icon: <ReceiptIcon className="text-[30px]" />,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.warning.light,
        0.2
      )}, ${alpha(theme.palette.warning.main, 0.05)})`,
      avatarColor: theme.palette.warning.main,
    },
    {
      id: 3,
      value: completedReturns,
      title: "Completed Returns",
      icon: <AssignmentReturnIcon className="text-[30px]" />,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.success.light,
        0.2
      )}, ${alpha(theme.palette.success.main, 0.05)})`,
      avatarColor: theme.palette.success.main,
    },
    {
      id: 4,
      value: cancelledReturns,
      title: "Cancelled Returns",
      icon: <DeleteIcon className="text-[30px]" />,
      gradient: `linear-gradient(135deg, ${alpha(
        theme.palette.error.light,
        0.2
      )}, ${alpha(theme.palette.error.main, 0.05)})`,
      avatarColor: theme.palette.error.main,
    },
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(to bottom, ${alpha(
          theme.palette.primary.light,
          0.05
        )}, ${alpha(theme.palette.background.default, 1)})`,
        minHeight: "100vh",
        p: { xs: 0, md: 2 },
        borderRadius: 2,
      }}
    >
      <BreadcrumbNav />
      <PageHeader onAddReturn={handleAddReturn} />

      <StatsSection stats={statsData} />

      <FilterSection
        searchTerm={searchTerm}
        dateRange={dateRange}
        filterStatus={filterStatus}
        filterWarehouse={filterWarehouse}
        warehouseOptions={warehouseOptions}
        onSearchChange={handleSearchChange}
        onDateRangeChange={handleDateRangeChange}
        onStatusChange={(e) => setFilterStatus(e.target.value)}
        onWarehouseChange={(e) => setFilterWarehouse(e.target.value)}
      />

      <PurchaseReturnTable
        returns={purchaseReturnData?.data?.returns}
        isLoading={isLoading || purchaseLoading}
        onView={handleViewReturn}
        onEdit={handleEditReturn}
        onDelete={handleDeleteReturn}
        page={page}
        totalPages={purchaseReturnData?.data?.meta?.totalPage || 1}
        onPageChange={handlePageChange}
      />

      <ActionMenu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        onView={() => handleViewReturn(selectedReturn?._id)}
        onEdit={() => handleEditReturn(selectedReturn?._id)}
        onDelete={() => handleDeleteReturn(selectedReturn?._id)}
        onPrint={handleMenuClose}
      />

      <Toaster position="top-right" />
    </Box>
  );
}

export default PurchaseReturnList;
