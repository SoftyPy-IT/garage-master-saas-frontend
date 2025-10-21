/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { Box, Typography, Breadcrumbs, Link, Grid, Paper } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UpdatePurchaseOrderModal from "../UpdatePurchaseOrderModal";
import { useDeletePurchaseOrderMutation, useGetAllPurchaseOrdersQuery } from "../../../redux/api/purchaseOrderApi";
import PageHeader from "./PurchaseHeader";
import FiltersSection from "./PurchaseFilter";
import PurchaseOrdersTable from "./PurchaseOrdersTable";
import ActionMenu from "./ActionMenu";

import { Home, NavigateNext, Receipt } from "@mui/icons-material";
import { ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";
import ReceiveDialog from "./ReceiveDialog";
import { useAppOptions } from "../../../hooks/useAppOptions";
import PurchaseOrderModal from "./PurchaseOrderModal";
import SummaryCards from "./PurchaseSummaryCards";

export default function PurchaseOrder() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openReceiveDialog, setOpenReceiveDialog] = useState(false);
  const [receiveDate, setReceiveDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const { tenantDomain, search, setSearch, searchTerm, setSearchTerm, performActionWithPermission } = useAppOptions()
  const [receiveStatus, setReceiveStatus] = useState("received");
  const [receiveNote, setReceiveNote] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);


  const [receivingOrderId, setReceivingOrderId] = useState(null);

  const [deletePurchase] = useDeletePurchaseOrderMutation();
  const { data: purchaseOrderData, refetch } = useGetAllPurchaseOrdersQuery({
    tenantDomain,
    limit: 10,
    page,
    searchTerm: search,
  });

  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleViewOrder = () => {
    if (selectedOrder) {
      setIsLoading(true);
      setTimeout(() => {
        navigate(`/purchase/${selectedOrder.id}`);
        setIsLoading(false);
      }, 300);
    }
    handleMenuClose();
  };

  const handleEditOrder = () => {
    if (selectedOrder) {
      setOpenUpdateModal(true);
      setAnchorEl(null);
    }
  };

  const handleDeleteOrder = async () => {
    performActionWithPermission('/dashboard/purchase-order', 'delete',
      async () => {
        if (!selectedOrder) return;

        Swal.fire({
          title: "Are you sure?",
          text: "This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
          reverseButtons: true,
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await deletePurchase({
                tenantDomain,
                id: selectedOrder._id,
              }).unwrap();

              if (res.success) {
                toast.success("Purchase order deleted successfully!");
                refetch();

                Swal.fire("Deleted!", "The purchase order has been deleted.", "success");
              }
            } catch (error) {
              Swal.fire("Error", "Failed to delete purchase order", "error");
              console.error(error);
            }
          }
        });

        handleMenuClose();

      }, "You don't have permission to delete order"
    )
  };

  const handleAddOrder = () => {
    setOpenPurchaseModal(true);
  };

  const handleOpenReceiveDialog = () => {
    if (selectedOrder) {
      setReceivingOrderId(selectedOrder._id);
      setOpenReceiveDialog(true);
    }
    handleMenuClose();
  };

  const handleCloseReceiveDialog = () => {
    setOpenReceiveDialog(false);
    setReceivingOrderId(null);
  };



  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value,
    });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setSearch(e.target.value);
  };

  return (
    <Box sx={{ p: 1, borderRadius: 2, mt: 2 }}>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link
          color="inherit"
          href="/dashboard"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Home sx={{ mr: 0.5, fontSize: 18 }} />
          Dashboard
        </Link>
        <Link
          color="inherit"
          href="/purchase"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ShoppingCart sx={{ mr: 0.5, fontSize: 18 }} />
          Purchase
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Receipt sx={{ mr: 0.5, fontSize: 18 }} />
          Purchase Orders
        </Typography>
      </Breadcrumbs>

      <PageHeader onAddOrder={handleAddOrder} />

      <SummaryCards purchaseOrderData={purchaseOrderData} />

      <FiltersSection
        searchTerm={searchTerm}
        onSearch={handleSearch}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
      />

      <PurchaseOrdersTable
        purchaseOrderData={purchaseOrderData}
        isLoading={isLoading}
        onMenuOpen={handleMenuOpen}
        page={page}
        onPageChange={handlePageChange}
      />

      <ActionMenu
        anchorEl={anchorEl}
        selectedOrder={selectedOrder}
        onMenuClose={handleMenuClose}
        onViewOrder={handleViewOrder}
        onEditOrder={handleEditOrder}
        onOpenReceiveDialog={handleOpenReceiveDialog}
        onDeleteOrder={handleDeleteOrder}
      />

      <ReceiveDialog
        open={openReceiveDialog}
        receiveDate={receiveDate}
        receiveStatus={receiveStatus}
        receiveNote={receiveNote}
        purchaseId={receivingOrderId}
        onClose={handleCloseReceiveDialog}
        onReceiveDateChange={setReceiveDate}
        onReceiveStatusChange={setReceiveStatus}
        onReceiveNoteChange={setReceiveNote}
      />

      <PurchaseOrderModal
        open={openPurchaseModal}
        onClose={() => setOpenPurchaseModal(false)}
        tenantDomain={tenantDomain}
      />

      {openUpdateModal && selectedOrder && (
        <UpdatePurchaseOrderModal
          tenantDomain={tenantDomain}
          onClose={() => setOpenUpdateModal(false)}
          open={openUpdateModal}
          orderId={selectedOrder._id}
        />
      )}
    </Box>
  );
}