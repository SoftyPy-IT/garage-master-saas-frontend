/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { FaEdit, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useAllCustomerQuery } from "../../redux/api/meta.api";
import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import { wrapBoxStyle } from "../../utils/customStyle";

const AllCustomerList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const limit = 10;
  const { tenantDomain } = useTenantDomain();

  const { data: allCustomerData, isLoading } = useAllCustomerQuery({
    tenantDomain,
    page: currentPage,
    limit,
    searchTerm: filterType,
    isRecycled: false,
  });

  const customers = allCustomerData?.data?.data || [];
  const totalPages =
    allCustomerData?.data?.meta?.totalPage ||
    Math.ceil((allCustomerData?.data?.meta?.total || 0) / limit);

  const handleIconPreview = (id, userType) => {
    switch (userType) {
      case "customer":
        navigate(`/dashboard/customer-profile?id=${id}`);
        break;
      case "company":
        navigate(`/dashboard/company-profile?id=${id}`);
        break;
      case "showRoom":
        navigate(`/dashboard/show-room-profile?id=${id}`);
        break;
      default:
        toast.error("Invalid user type");
    }
  };

  const columns = [
    { key: "index", label: "SL No", type: "index" },
    { key: "id", label: "Customer ID" },
    { key: "name", label: "Customer Name" },
    { key: "vehicle_username", label: "Vehicle User Name" },
    {
      key: "car_no",
      label: "Car No.",
      render: (item) => {
        const firstVehicle = item?.vehicles?.[0];
        if (!firstVehicle) return "—";

        const carRegNo = firstVehicle?.carReg_no || "";
        const carRegistrationNo = firstVehicle?.car_registration_no || "";

        if (carRegNo && carRegistrationNo) {
          return `${carRegNo}-${carRegistrationNo}`;
        }

        return carRegNo || carRegistrationNo || "—";
      },
    },
    { key: "contact", label: "Mobile No." },
    { key: "userType", label: "User Type" },
  ];

  const actions = [
    {
      key: "view",
      icon: FaUserTie,
      color: "#0EA5E9",
      size: "25px",
      tooltip: "View Profile",
      onClick: (item) => handleIconPreview(item?._id, item?.userType),
    },
    {
      key: "edit",
      icon: FaEdit,
      color: "#2563EB",
      tooltip: "Edit",
      link: (item) =>
        `/dashboard/${
          item?.userType === "customer"
            ? "update-customer"
            : item?.userType === "company"
              ? "update-company"
              : "update-show-room"
        }?id=${item?._id}`,
    },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Customer", href: "/dashboard/customer-list" },
    { label: "All Customer List" },
  ];

  return (
    <Box sx={wrapBoxStyle}>
      <Breadcrumb items={breadcrumbItems} />

      <Table
        title="All Customer List"
        columns={columns}
        data={customers}
        actions={actions}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        onSearch={(value) => {
          setFilterType(value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search customers..."
      />
    </Box>
  );
};

export default AllCustomerList;
