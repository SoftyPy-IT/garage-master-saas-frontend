import { ArrowBack } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { DeleteIcon, EditIcon, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import avatar from "../../../public/assets/avatar.jpg";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Table";
import { useAppOptions } from "../../hooks/useAppOptions";
import {
  useGetAllEmployeesQuery,
  useMoveRecycledEmployeeMutation,
} from "../../redux/api/employee";
import { purchaseBtn, wrapBoxStyle } from "../../utils/customStyle";

export default function EmployeeList() {
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const navigate = useNavigate();
  const limit = 20;

  const {
    data: employeeData,
    isLoading,
    error,
  } = useGetAllEmployeesQuery({
    tenantDomain,
    limit,
    page: currentPage,
    searchTerm: filterType,
  });

  const [moveRecycledEmployee] = useMoveRecycledEmployeeMutation();

  const handleDelete = async (employee) => {
    performActionWithPermission(
      "/dashboard/employee-list",
      "delete",
      async () => {
        const confirmed = await swal({
          title: "Are you sure?",
          text: "Move this Employee to the Recycle Bin?",
          icon: "warning",
          buttons: ["Cancel", "Move"],
          dangerMode: true,
        });

        if (confirmed) {
          try {
            await moveRecycledEmployee({
              tenantDomain,
              id: employee._id,
            }).unwrap();
            swal("Success!", "Employee moved to Recycle Bin.", "success");
          } catch (err) {
            swal("Error", "Failed to move employee.", "error");
          }
        }
      },
      "You don't have permission to delete employee."
    );
  };

  if (error) toast.error(error?.data?.message);

  const employees =
    employeeData?.data?.employees?.filter((e) => !e.isRecycled) || [];

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (e) => (
        <img
          src={e.image || avatar}
          alt={e.full_name}
          className="w-12 h-12 rounded-full object-cover"
        />
      ),
    },
    { key: "full_name", label: "Name" },
    { key: "designation", label: "Designation" },
    { key: "email", label: "Email" },
    { key: "mobile_number", label: "Phone" },
  ];

  const actions = [
    {
      key: "view",
      icon: Eye,
      tooltip: "View Employee",
      link: (e) => `/dashboard/employee-profile?id=${e._id}`,
    },
    {
      key: "edit",
      icon: EditIcon,
      tooltip: "Edit Employee",
      link: (e) => `/dashboard/update-employee?id=${e._id}`,
      requirePermission: true,
      permissionPage: "/dashboard/update-employee",
      permissionAction: "edit",
    },
    {
      key: "delete",
      icon: DeleteIcon,
      tooltip: "Delete Employee",
      onClick: handleDelete,
      requirePermission: true,
      permissionPage: "/dashboard/employee-list",
      permissionAction: "delete",
      color: "#DC2626",
    },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Employee", href: "/dashboard/employee-list" },
    { label: "Employee List " },
  ];

  return (
    <Box sx={wrapBoxStyle}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Breadcrumb items={breadcrumbItems} />
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ ...purchaseBtn, height: "40px" }}
        >
          Back
        </Button>
      </Box>
      <Table
        title="Employees"
        columns={columns}
        data={employees}
        actions={actions}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={employeeData?.data?.meta?.totalPages || 1}
        onPageChange={setCurrentPage}
        onSearch={setFilterType}
        searchPlaceholder="Search employees..."
        emptyMessage="No employees found."
      />
    </Box>
  );
}
