/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useEffect, useState } from "react";
import { FaEye, FaDownload, FaFileInvoice, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Tooltip } from "@mui/material";
import { ArrowBack, AccessTime, Undo } from "@mui/icons-material";
import { DeleteIcon, EditIcon } from "lucide-react";
import swal from "sweetalert";

import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import { wrapBoxStyle } from "../../utils/customStyle";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import {
  useGetAllQuotationsQuery,
  useMoveRecycledQuotationMutation,
  useCancelQuotationMutation,
  useMoveToPendingQuotationMutation,
  useRestoreFromPendingQuotationMutation,
} from "../../redux/api/quotation";
import { useCompanyProfileData } from "../../hooks/useCompanyProfileData";

const QuotationTable = ({
  isRecycled,
  isPendingList = false,
  title = "Quotations",
  status,
  handleMoveAction,
  handlePendingAction,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const search = new URLSearchParams(location.search).get("search");

  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { tenantDomain } = useTenantDomain();

  const { companyProfileData } = useCompanyProfileData();
  const [moveRecycledQuotation, { isLoading: deleteLoading }] =
    useMoveRecycledQuotationMutation();
  const [cancelQuotation, { isLoading: cancelLoading }] =
    useCancelQuotationMutation();
  const [moveToPendingQuotation] = useMoveToPendingQuotationMutation();
  const [restoreFromPendingQuotation] = useRestoreFromPendingQuotationMutation();

  const queryParams = {
    tenantDomain,
    limit,
    page: currentPage,
    searchTerm: filterType,
    isRecycled,
    status,
  };

  if (!isRecycled) {
    queryParams.isPending = isPendingList ? "true" : "false";
  }

  const { data: allQuotations, isLoading: quotationLoading } =
    useGetAllQuotationsQuery(queryParams);

  const handleCancel = (id) => {
    swal({
      title: "Are you sure?",
      text: "Do you want to cancel this quotation? This action cannot be undone.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willCancel) => {
      if (willCancel) {
        cancelQuotation({ id, tenantDomain })
          .unwrap()
          .then(() => {
            swal("Cancelled!", "The quotation has been cancelled.", "success");
          })
          .catch((err) => {
            swal(
              "Error",
              err?.data?.message || "Failed to cancel quotation",
              "error",
            );
          });
      }
    });
  };

  const handleMoveToPending = (id) => {
    swal({
      title: "Are you sure?",
      text: "You want to move this quotation to Pending List?",
      icon: "warning",
      buttons: true,
    }).then((willMove) => {
      if (willMove) {
        moveToPendingQuotation({ tenantDomain, id })
          .unwrap()
          .then(() => {
            swal("Moved!", "Quotation moved to Pending List.", "success");
          })
          .catch((err) => {
            swal(
              "Error",
              err?.data?.message || "Failed to move quotation to pending.",
              "error",
            );
          });
      }
    });
  };

  const handleRestoreFromPending = (id) => {
    swal({
      title: "Are you sure?",
      text: "You want to restore this quotation to the main list?",
      icon: "warning",
      buttons: true,
    }).then((willRestore) => {
      if (willRestore) {
        restoreFromPendingQuotation({ tenantDomain, id })
          .unwrap()
          .then(() => {
            swal("Restored!", "Quotation restored to main list.", "success");
          })
          .catch((err) => {
            swal(
              "Error",
              err?.data?.message || "Failed to restore quotation.",
              "error",
            );
          });
      }
    });
  };

  const handlePendingClick = (id) => {
    if (handlePendingAction) {
      handlePendingAction(id);
      return;
    }

    if (isPendingList) {
      handleRestoreFromPending(id);
      return;
    }

    handleMoveToPending(id);
  };

  const quotationColumns = [
    { key: "slNo", label: "SL No", type: "index" },
    { key: "job_no", label: "Quotation No." },

    {
      key: "name",
      label: "Customer Name",
      render: (data) =>
        data?.customer?.customer_name ||
        data?.company?.company_name ||
        data?.showRoom?.showRoom_name ||
        "N/A",
    },

    {
      key: "vehicle_name",
      label: "Vehicle Name",
      render: (d) =>
        Array.isArray(d?.vehicle)
          ? d.vehicle.map((v) => v.vehicle_name || "—").join(", ")
          : d.vehicle?.vehicle_name || "N/A",
    },

    {
      key: "car_no",
      label: "Vehicle Reg No ",
      render: (d) => {
        if (!d?.vehicle) return "N/A";
        const vehicles = Array.isArray(d.vehicle) ? d.vehicle : [d.vehicle];

        return vehicles
          .map((v) => {
            const carRegNo = v?.carReg_no?.trim() || "";
            const carRegistrationNo = v?.car_registration_no?.trim() || "";
            if (carRegNo && carRegistrationNo)
              return `${carRegNo}-${carRegistrationNo}`;
            return carRegNo || carRegistrationNo || "—";
          })
          .join(", ");
      },
    },

    {
      key: "mobile_no",
      label: "Mobile No.",
      render: (d) =>
        d?.customer?.fullCustomerNum ||
        d?.company?.fullCompanyNum ||
        d?.showRoom?.fullCompanyNum ||
        "N/A",
    },

    { key: "date", label: "Date" },
  ];

  const quotationActions = [
    {
      key: "invoice",
      color: "#fff",
      icon: FaFileInvoice,
      label: "View Invoice",
      href: (d) => `/dashboard/create-invoice?order_no=${d.job_no}&id=${d._id}`,
    },
    {
      key: "download",
      icon: FaDownload,
      color: "#fff",
      label: "Download Quotation",
      href: (d) =>
        `${import.meta.env.VITE_API_URL}/quotations/quotation/${d._id
        }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
          JSON.stringify(companyProfileData),
        )}`,
    },
    {
      key: "preview",
      icon: FaEye,
      color: "#fff",
      label: "Preview",
      onClick: (d) => navigate(`/dashboard/quotation-view?id=${d._id}`),
    },
    {
      key: "edit",
      icon: EditIcon,
      color: "#fff",
      label: "Edit Quotation",
      link: (d) => `/dashboard/update-quotation?id=${d._id}`,
    },



    ...(!isRecycled
      ? [
        {
          key: "pending",
          icon: isPendingList ? Undo : AccessTime,
          color: "#fff",
          label: isPendingList
            ? "Restore to Quotation List"
            : "Move to Pending",
          onClick: (d) => handlePendingClick(d._id),
          tooltip: isPendingList
            ? "Restore to Quotation List"
            : "Move to Pending",
        },
      ]
      : []),

    {
      key: "delete",
      icon: DeleteIcon,
      color: "#fff",
      label: isRecycled ? "Delete / Restore" : "Move to Recycled",
      onClick: (d) => handleMoveAction?.(d._id),
      disabled: () => deleteLoading,
    },
  ];

  const getQuotationRowClass = (data) => {
    if (data.status === "running") return "bg-red-500 text-white";
    if (data.status === "completed") return "bg-green-500 text-white";
    return "";
  };

  useEffect(() => {
    if (search) setFilterType(search);
  }, [search]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Quotation", href: "/dashboard/quotation-list" },
    { label: title },
  ];

  const showPendingListButton = !isRecycled && !isPendingList && status === undefined;

  const handleBack = () => {
    if (isPendingList) {
      navigate("/dashboard/quotation-list");
      return;
    }
    navigate(-1);
  };

  const handleGoToPendingList = () => {
    navigate("/dashboard/pending-quotation");
  };

  const externalHooks = {
    tenantDomain,
    deleteLoading,
    cancelLoading,
    moveRecycledQuotation,
    cancelQuotation,
    swal,
  };

  return (
    <Box sx={wrapBoxStyle}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Breadcrumb items={breadcrumbItems} />
        <Box display="flex" gap={1}>
          {showPendingListButton && (
            <Tooltip title="Pending Quotation List">
              <Button
                variant="contained"
                color="warning"
                startIcon={<AccessTime />}
                onClick={handleGoToPendingList}
                sx={{ borderRadius: 5 }}
              >
                Pending Quotations
              </Button>
            </Tooltip>
          )}
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ borderRadius: 5 }}
          >
            Back
          </Button>
        </Box>
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
