/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import { Box, Button, alpha, useTheme } from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import swal from "sweetalert";

import Table from "@/components/Table";
import { useGetAllSuppliersQuery, useMoveRecycledSupplierMutation } from "@/redux/api/supplier";
import { useTenantDomain } from "@/hooks/useTenantDomain";
import { StatusChip, SupplierAvatar } from "@/utils/customStyle";
import { usePermissions } from "@/context/PermissionContext";
import { purchaseBtn } from "../../utils/customStyle";

const SupplierListTable = () => {
  const theme = useTheme();
  const [, setSearch] = useState("");
  const [, setPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 15;
  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = usePermissions();
  const [moveRecycledSupplier] = useMoveRecycledSupplierMutation();

  const { data: allSuppliers, isLoading } = useGetAllSuppliersQuery({
    tenantDomain,
    limit,
    page: currentPage,
    isRecycled: true,
  });


  const totalPages = allSuppliers?.data?.meta?.totalPage || 1;
  const totalCount = allSuppliers?.data?.meta?.total || 0;

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircleIcon fontSize="small" />;
      case "inactive":
        return <CancelIcon fontSize="small" />;
      case "pending":
        return <WarningIcon fontSize="small" />;
      default:
        return null;
    }
  };




  const handleDeleteSupplier = async (id) => {
    performActionWithPermission(
      "/dashboard",
      "delete",
      async () => {
        const willDelete = await swal({
          title: "Move Supplier to Recycle Bin?",
          text: "This supplier will be moved to the recycle bin. Continue?",
          icon: "warning",
          dangerMode: true,
        });

        if (willDelete) {
          try {
            await moveRecycledSupplier({ tenantDomain, id }).unwrap();
            swal("Moved!", "Supplier successfully moved to recycle bin.", "success");
          } catch {
            swal("Error", "An error occurred while moving the supplier.", "error");
          }
        }
      },
      "You don't have permission to delete supplier!"
    );
  };

  const columns = [
    {
      key: "supplierId",
      label: "ID",
      render: (item) => item.supplierId || "N/A",
    },
    {
      key: "full_name",
      label: "Supplier",
      render: (item) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SupplierAvatar
            src={item.supplier_photo}
            alt={item.full_name}
          >
            {item.full_name?.charAt(0) || "S"}
          </SupplierAvatar>
          <Box sx={{ ml: 2 }}>
            <span className="font-semibold">{item.full_name || "Unknown"}</span>
            <p className="text-xs text-gray-500">{item.vendor || "N/A"}</p>
          </Box>
        </Box>
      ),
    },
    {
      key: "shop_name",
      label: "Company",
      render: (item) => item.shop_name || "N/A",
    },
    {
      key: "contact",
      label: "Contact",
      render: (item) => (
        <div>
          <p className="flex items-center text-sm">
            <PhoneIcon fontSize="small" className="mr-1 text-gray-500" />
            {item.full_Phone_number || item.phone_number || "N/A"}
          </p>
          <p className="flex items-center text-sm">
            <EmailIcon fontSize="small" className="mr-1 text-gray-500" />
            {item.email || "N/A"}
          </p>
        </div>
      ),
    },
    {
      key: "supplier_status",
      label: "Status",
      render: (item) => (
        <StatusChip
          icon={getStatusIcon(item.supplier_status)}
          label={item.supplier_status || "Active"}
          size="small"
          status={item.supplier_status}
        />
      ),
    },
  ];
  const actions = [
    {
      key: "view",
      label: "View",
      icon: VisibilityIcon,
      link: (item) => `/dashboard/supplier-profile?id=${item._id}`,
      LinkComponent: Link,
      tooltip: "View Details",
    },
    {
      key: "edit",
      label: "Edit",
      icon: EditIcon,
      link: (item) => `/dashboard/update-supplier?id=${item._id}`,
      LinkComponent: Link,
      tooltip: "Edit Supplier",
      requirePermission: true,
      permissionPage: "/dashboard/update-supplier",
      permissionAction: "edit",
    },
    {
      key: "delete",
      label: "Delete",
      icon: DeleteIcon,
      onClick: (item) => handleDeleteSupplier(item._id),
      tooltip: "Delete Supplier",
      className: "text-red-500 hover:text-red-700",
      requirePermission: true,
      permissionPage: "/dashboard/supplier-list",
      permissionAction: "delete",
    },
  ];
  const handleSearch = (value) => { setSearch(value); setPage(0); };

  return (
    <div className="w-full mt-5 px-0">
      <Box
        sx={{
          p: 4,
          borderRadius: "16px",
          background: alpha(theme.palette.background.paper, 0.9),
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h2 className="text-2xl font-bold flex items-center">
            <BusinessIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            Supplier Management
          </h2>

          <Button sx={purchaseBtn}
            to="/dashboard/add-supplier"
            component={Link}
            startIcon={<AddIcon />}
          >
            Add Supplier
          </Button>
        </div>

        <Table
          title="Suppliers"
          columns={columns}
          data={allSuppliers?.data?.suppliers}
          actions={actions}
          loading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          searchPlaceholder="Search supplier..."
          onSearch={handleSearch}
          emptyMessage="No suppliers found"
        />
        <p className="text-xs text-gray-500 mt-3">
          Showing page {currentPage} of {totalPages} — Total {totalCount} suppliers
        </p>
      </Box>
    </div>
  );
};

export default SupplierListTable;
