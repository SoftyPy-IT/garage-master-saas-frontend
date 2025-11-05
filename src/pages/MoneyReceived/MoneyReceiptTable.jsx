/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { FaTrashAlt, FaEdit, FaEye, FaDownload } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import { useGetAllMoneyReceiptsQuery } from "../../redux/api/money-receipt";
import Loading from "../../components/Loading/Loading";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Table";
import { purchaseBtn } from "../../utils/customStyle";

const MoneyReceiptTable = ({ handleDeleteAction, title, isRecycled }) => {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const limit = 10;
  const navigate = useNavigate();
  const { tenantDomain } = useTenantDomain();

  useEffect(() => {
    if (search) setFilterType(search);
  }, [search]);

  const { data: CompanyInfoData } = useGetCompanyProfileQuery({ tenantDomain });

  const companyProfileData = {
    companyName: CompanyInfoData?.data?.companyName,
    address: CompanyInfoData?.data?.address,
    website: CompanyInfoData?.data?.website,
    phone: CompanyInfoData?.data?.phone,
    email: CompanyInfoData?.data?.email,
    logo: CompanyInfoData?.data?.logo?.[0],
    companyNameBN: CompanyInfoData?.data?.companyNameBN,
  };

  const { data: allMoneyReceipts, isLoading: moneyReceiptLoading } =
    useGetAllMoneyReceiptsQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled,
    });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Money Receipt List", href: "/dashboard/money-receipt-list" },
    { label: title },
  ];

  const getRowClass = (card) => {
    if (card.paymentColor === "#2dce89") return "bg-[#2dce89] text-white";
    if (card.paymentColor === "#f5365c") return "bg-[#f5365c] text-white";
    if (card.paymentColor === "#ffad46") return "bg-[#ffad46] text-black";
    return "";
  };

  const columns = [
    { key: "index", label: "SL No", type: "index" },
    { key: "thanks_from", label: "Received with thanks from" },
    { key: "job_no", label: "Final Payment against bill no" },
    { key: "total_amount", label: "Total Amount" },
    {
      key: "advance",
      label: "Advance Service Bill",
      render: (row) => row.advance || 0,
    },
    { key: "remaining", label: "Due Service Bill" },
    {
      key: "date",
      label: "Date",
      render: (row) =>
        row.default_date !== "NaN-NaN-NaN" ? row.default_date : row.check_date,
    },
  ];

  const actions = [
    {
      key: "view",
      icon: FaEye,
      color: "#fff",
      tooltip: "View",
      onClick: (item) =>
        navigate(`/dashboard/money-receipt-view?id=${item._id}`),
    },
    {
      key: "download",
      icon: FaDownload,
      color: "#fff",
      tooltip: "Download",
      href: (item) =>
        `${import.meta.env.VITE_API_URL}/money-receipts/money/${
          item._id
        }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
          JSON.stringify(companyProfileData)
        )}`,
      target: "_blank",
    },
    {
      key: "edit",
      icon: FaEdit,
      color: "#fff",
      tooltip: "Edit",
      link: (item) => `/dashboard/money-receipt-update?id=${item._id}`,
    },
    {
      key: "delete",
      icon: FaTrashAlt,
      color: "#fff",
      tooltip: "Delete",
      onClick: (item) => handleDeleteAction(item._id),
    },
  ];

  if (moneyReceiptLoading) return <Loading />;

  return (
    <div className="mt-5 overflow-x-auto">
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Breadcrumb items={breadcrumbItems} />
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={purchaseBtn}
        >
          Back
        </Button>
      </Box>

      <Table
        title={title}
        columns={columns}
        data={allMoneyReceipts?.data?.moneyReceipts || []}
        loading={moneyReceiptLoading}
        actions={actions}
        currentPage={currentPage}
        totalPages={allMoneyReceipts?.data?.meta?.totalPages || 1}
        onPageChange={(page) => setCurrentPage(page)}
        onSearch={(value) => setFilterType(value)}
        searchPlaceholder="Search money receipts..."
        emptyMessage="No matching money receipts found."
        getRowClass={getRowClass}
      />
    </div>
  );
};

export default MoneyReceiptTable;
