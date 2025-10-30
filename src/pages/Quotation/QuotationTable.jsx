/* eslint-disable react/prop-types */
"use client";

import { useEffect, useState } from "react";
import { FaEye, FaDownload, FaFileInvoice } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";

import { Box, Button } from "@mui/material";
import {
  useGetAllQuotationsQuery,
  useMoveRecycledQuotationMutation,
} from "../../redux/api/quotation";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import { ArrowBack } from "@mui/icons-material";
import { wrapBoxStyle } from "../../utils/customStyle";
import { DeleteIcon, EditIcon } from "lucide-react";

const QuotationTable = ({
  isRecycled,
  title = "Quotations",
  status,
  handleMoveAction,
}) => {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");

  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { tenantDomain } = useTenantDomain();

  const [moveRecycledQuotation, { isLoading: deleteLoading }] =
    useMoveRecycledQuotationMutation();

  const { data: allQuotations, isLoading: quotationLoading } =
    useGetAllQuotationsQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled,
      status,
    });

  const { data: profileData } = useGetCompanyProfileQuery({ tenantDomain });
  const quotationColumns = [
    { key: "slNo", label: "SL No", type: "index" },
    { key: "quotation_no", label: "Quotation ID" },
    { key: "job_no", label: "Order No." },
    {
      key: "name",
      label: "Name",
      render: (data) => {
        if (data?.customer) return data.customer.customer_name;
        if (data?.company) return data.company.company_name;
        if (data?.showRoom) return data.showRoom.showRoom_name;
        return "N/A";
      },
    },
    {
      key: "vehicle_name",
      label: "Vehicle Name",
      render: (data) => data.vehicle?.vehicle_name || "N/A",
    },
    {
      key: "vehicle_brand",
      label: "Vehicle Brand",
      render: (data) => data.vehicle?.vehicle_brand || "N/A",
    },
    {
      key: "car_no",
      label: "Car No.",
      render: (data) =>
        data.vehicle?.carReg_no || data.vehicle?.car_registration_no || "N/A",
    },
    {
      key: "mobile_no",
      label: "Mobile No.",
      render: (data) => {
        if (data?.customer) return data.customer.fullCustomerNum;
        if (data?.company) return data.company.fullCompanyNum;
        if (data?.showRoom) return data.showRoom.fullCompanyNum;
        return "N/A";
      },
    },
    { key: "date", label: "Date" },
  ];

  const quotationActions = [
    {
      key: "create_invoice",
      icon: FaFileInvoice,
      label: "View Invoice",
      tooltip: "View Invoice",
      className: "flex justify-center edit2",
      href: (data) =>
        `/dashboard/create-invoice?order_no=${data?.job_no}&id=${data._id}`,
      requirePermission: true,
      permissionPage: "/dashboard/quotation-view",
      permissionAction: "view",
    },
    {
      key: "download",
      icon: FaDownload,
      label: "Download Quotation",
      tooltip: "Download Quotation",
      className: "flex flex-col items-center edit2",
      href: (data, hooks) => {
        const companyProfileData = {
          companyName: hooks?.profileData?.data?.companyName,
          address: hooks?.profileData?.data?.address,
          website: hooks?.profileData?.data?.website,
          phone: hooks?.profileData?.data?.phone,
          email: hooks?.profileData?.data?.email,
          logo: hooks?.profileData?.data?.logo?.[0],
          companyNameBN: hooks?.profileData?.data?.companyNameBN,
        };
        return `${import.meta.env.VITE_API_URL}/quotations/quotation/${
          data._id
        }?tenantDomain=${
          hooks?.tenantDomain
        }&companyProfileData=${encodeURIComponent(
          JSON.stringify(companyProfileData)
        )}`;
      },
      target: "_blank",
      requirePermission: true,
      permissionPage: "/dashboard/quotation-view",
      permissionAction: "view",
    },
    {
      key: "preview",
      icon: FaEye,
      label: "Preview",
      tooltip: "Preview",
      className: "flex flex-col items-center edit2",
      onClick: (data, hooks) => {
        hooks.navigate(`/dashboard/quotation-view?id=${data._id}`);
      },
      requirePermission: true,
      permissionPage: "/dashboard/quotation-view",
      permissionAction: "view",
      permissionMessage: "You don't have permission to view quotation",
    },
    {
      key: "edit",
      icon: EditIcon,
      label: "Edit Quotation",
      tooltip: "Edit Quotation",
      className: "flex flex-col items-center edit",
      LinkComponent: Link,
      link: (data) => `/dashboard/update-quotation?id=${data._id}`,
      requirePermission: true,
      permissionPage: "/dashboard/update-quotation",
      permissionAction: "edit",
    },
    {
      key: "delete",
      icon: DeleteIcon,
      label: "Move to Recycled",
      tooltip: (data, hooks) =>
        hooks.deleteLoading ? "Deleting..." : "Move to Recycled",
      className: "editIconWrap rounded-full",
      style: {
        background: "white",
        border: "none",
        padding: 5,
        borderRadius: "9999px",
      },
      iconClassName: "deleteIcon text-red-500",
      onClick: async (data, hooks) => {
        const willDelete = await swal({
          title: "Are you sure?",
          text: "You want to move this quotation to Recycle Bin?",
          icon: "warning",
          dangerMode: true,
        });

        if (willDelete) {
          try {
            await hooks
              ?.moveRecycledQuotation({
                tenantDomain: hooks?.tenantDomain,
                id: data._id,
              })
              .unwrap();
            swal(
              "Move to Recycle bin!",
              "Move to Recycle bin successful.",
              "success"
            );
          } catch (error) {
            swal(
              "Error",
              "An error occurred while deleting the card.",
              "error"
            );
          }
        }
      },
      disabled: (data, hooks) => hooks?.deleteLoading,
      requirePermission: true,
      permissionPage: "/dashboard/quotation-list",
      permissionAction: "delete",
      permissionMessage: "You don't have permission to delete this quotation",
    },
  ];

  const getQuotationRowClass = (data) => {
    if (data.status === "running") {
      return "bg-[#f5365c] text-white";
    } else {
      return "bg-[#2dce89] text-white";
    }
  };

  const externalHooks = {
    tenantDomain,
    profileData,
    deleteLoading,
    moveRecycledQuotation,
    swal,
  };

  useEffect(() => {
    if (search) {
      setFilterType(search);
    }
  }, [search]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Quotation", href: "/dashboard/quotation-list" },
    { label: title },
  ];
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={wrapBoxStyle}>
      <Box display="flex" justifyContent="space-between">
        <Breadcrumb items={breadcrumbItems} />
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{
            alignSelf: { xs: "flex-start", sm: "center" },
            borderRadius: 5,
          }}
        >
          Back
        </Button>
      </Box>
      <Table
        title={title}
        columns={quotationColumns}
        data={allQuotations?.data?.quotations || []}
        actions={quotationActions}
        loading={quotationLoading}
        currentPage={currentPage}
        totalPages={allQuotations?.data?.meta?.totalPages || 1}
        onPageChange={setCurrentPage}
        onSearch={setFilterType}
        searchPlaceholder="Search quotations..."
        externalHooks={externalHooks}
        emptyMessage="No matching quotation found."
        getRowClass={getQuotationRowClass}
      />
    </Box>
  );
};

export default QuotationTable;
