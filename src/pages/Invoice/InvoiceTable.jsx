/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaTrashAlt, FaEdit, FaEye, FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Money } from "@mui/icons-material";
import swal from "sweetalert";
import { useGetAllInvoicesQuery, useMoveRecycledInvoiceMutation } from "../../redux/api/invoice";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import { getRowClass } from "../../utils/getRowClass";
import Table from "../../components/Table";

const InvoiceTable = ({ title = "Invoices" }) => {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");
  const [filterType, setFilterType] = useState("");
  const [limit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { tenantDomain } = useTenantDomain();

  const { data: allInvoices, isLoading: invoiceLoading } = useGetAllInvoicesQuery({
    tenantDomain,
    limit,
    page: currentPage,
    searchTerm: filterType,
    isRecycled: false,
  });

  const [moveRecycledInvoice, { isLoading: deleteLoading }] = useMoveRecycledInvoiceMutation();
  const { data: profileData } = useGetCompanyProfileQuery({ tenantDomain });

  const invoiceColumns = [
    { key: "slNo", label: "SL No", type: "index" },
    { key: "job_no", label: "Order No." },
    {
      key: "customer",
      label: "Customer Name",
      render: (data) => {
        if (data.customer) return data.customer.customer_name;
        if (data.company) return data.company.company_name;
        if (data.showRoom) return data.showRoom.showRoom_name;
        return "N/A";
      }
    },
    {
      key: "vehicle",
      label: "Car Reg No",
      render: (data) => data.vehicle?.carReg_no || data.vehicle?.car_registration_no || "N/A"
    },
    {
      key: "contact",
      label: "Mobile No.",
      render: (data) => {
        if (data.customer) return data.customer.fullCustomerNum;
        if (data.company) return data.company.fullCompanyNum;
        if (data.showRoom) return data.showRoom.fullCompanyNum;
        return "N/A";
      }
    },
    {
      key: "vehicle_brand",
      label: "Vehicle Brand",
      render: (data) => data.vehicle?.vehicle_brand || "N/A"
    },
    {
      key: "vehicle_name",
      label: "Vehicle Name",
      render: (data) => data.vehicle?.vehicle_name || "N/A"
    },
    { key: "date", label: "Date" }
  ];
  const invoiceActions = [
    {
      key: "money_receipt",
      icon: Money,
      label: "Money Receipt",
      tooltip: "Money Receipt",
      className: "editIconWrap edit2",
      href: (data) => `/dashboard/money-receive-create?order_no=${data.job_no}&id=${data._id}&net_total=${data.net_total === data.advance ? data.net_total : data.due}`,
      requirePermission: true,
      permissionPage: '/dashboard/invoice-list',
      permissionAction: 'view'
    },
    {
      key: "download",
      icon: FaDownload,
      label: "Download Invoice",
      tooltip: "Download Invoice",
      className: "flex flex-col items-center edit2",
      href: (data, hooks) => {
        const companyProfileData = {
          companyName: hooks.profileData?.data?.companyName,
          address: hooks.profileData?.data?.address,
          website: hooks.profileData?.data?.website,
          phone: hooks.profileData?.data?.phone,
          email: hooks.profileData?.data?.email,
          logo: hooks.profileData?.data?.logo?.[0],
          companyNameBN: hooks.profileData?.data?.companyNameBN,
        };
        return `${import.meta.env.VITE_API_URL}/invoices/invoice/${data._id}?tenantDomain=${hooks.tenantDomain}&companyProfileData=${encodeURIComponent(
          JSON.stringify(companyProfileData)
        )}`;
      },
      target: "_blank",
      requirePermission: true,
      permissionPage: '/dashboard/invoice-list',
      permissionAction: 'view'
    },
    {
      key: "preview",
      icon: FaEye,
      label: "Preview",
      tooltip: "Preview",
      className: "flex flex-col items-center edit2",
      onClick: (data, hooks) => {
        hooks.navigate(`/dashboard/invoice-view?id=${data._id}`);
      },
      requirePermission: true,
      permissionPage: '/dashboard/invoice-list',
      permissionAction: 'view',
      permissionMessage: "You don't have permission to view invoice!"
    },
    {
      key: "edit",
      icon: FaEdit,
      label: "Edit Invoice",
      tooltip: "Edit Invoice",
      className: "flex flex-col items-center edit",
      LinkComponent: Link,
      link: (data) => `/dashboard/update-invoice?id=${data._id}`,
      requirePermission: true,
      permissionPage: '/dashboard/update-invoice',
      permissionAction: 'edit'
    },
    {
      key: "delete",
      icon: FaTrashAlt,
      label: "Move to Recycled Bin",
      tooltip: (data, hooks) => hooks.deleteLoading ? "Deleting..." : "Move to Recycled Bin",
      className: "bg-white p-1 rounded-sm",
      style: {
        background: "white",
        border: "none",
        padding: 5,
        borderRadius: "9999px",
      },
      iconClassName: "text-[#f5365c] size-[16px]",
      onClick: async (data, hooks) => {
        const willDelete = await swal({
          title: "Are you sure?",
          text: "You want to move this invoice to the Recycle Bin?",
          icon: "warning",
          dangerMode: true,
        });

        if (willDelete) {
          try {
            await hooks.moveRecycledInvoice({ tenantDomain: hooks.tenantDomain, id: data._id }).unwrap();
            swal("Moved!", "Invoice moved to Recycle Bin successfully.", "success");
          } catch (error) {
            swal("Error", "An error occurred while deleting the invoice.", "error");
          }
        }
      },
      disabled: (data, hooks) => hooks.deleteLoading,
      requirePermission: true,
      permissionPage: '/dashboard/invoice-list',
      permissionAction: 'delete',
      permissionMessage: "You don't have permission to delete invoice!"
    }
  ];

  const externalHooks = {
    tenantDomain,
    profileData,
    deleteLoading,
    moveRecycledInvoice,
    swal
  };

  useEffect(() => {
    if (search) {
      setFilterType(search);
    }
  }, [search]);

  return (
    <Table
      title={title}
      columns={invoiceColumns}
      data={allInvoices?.data?.invoices || []}
      actions={invoiceActions}
      loading={invoiceLoading}
      currentPage={currentPage}
      totalPages={allInvoices?.data?.meta?.totalPages || 1}
      onPageChange={setCurrentPage}
      onSearch={setFilterType}
      searchPlaceholder="Search invoices..."
      externalHooks={externalHooks}
      emptyMessage="No matching invoice found."
      getRowClass={getRowClass}
    />
  );
};

export default InvoiceTable;