/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-refresh/only-export-components */
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import HeaderSection from "./HeaderSection";
import StatsCards from "./StatsCards";
import SearchFilter from "./SearchFilter";
import EmployeeRow from "./EmployeeRow";

// API Hooks
import { useGetAllEmployeesQuery } from "../../redux/api/employee";
import { useCreateAttendanceMutation } from "../../redux/api/attendance";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import SubmitButton from "./SubmitButton";
import { useAppOptions } from "../../hooks/useAppOptions";
import Can from "../../components/Can";

export const columns = [
  "SL No",
  "Employee",
  "ID",
  "Designation",
  "Date",
  "Present",
  "Absence",
  "Office Time",
  "In Time",
  "Out Time",
  "Overtime",
  "Late",
];

const AddAttendance = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 9999;
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const {
    data: getAllEmployee,
    isLoading: employeesLoading,
    error: employeesError,
  } = useGetAllEmployeesQuery({
    tenantDomain,
    limit,
    page: currentPage,
  });

  const { data: profileData } = useGetCompanyProfileQuery({ tenantDomain });
  const [createAttendance, { isLoading: createLoading }] =
    useCreateAttendanceMutation();

  // State Management
  const [presentState, setPresentState] = useState([]);
  const [absentState, setAbsentState] = useState([]);
  const [inTime, setInTime] = useState([]);
  const [outTime, setOutTime] = useState([]);
  const [overtime, setOvertime] = useState([]);
  const [lateStatus, setLateStatus] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);

  // Initialize states when employees data is available
  useEffect(() => {
    if (getAllEmployee?.data?.employees) {
      const employeeCount = getAllEmployee.data.employees.length;
      // Initialize all states as empty/unselected
      setPresentState(new Array(employeeCount).fill(false));
      setAbsentState(new Array(employeeCount).fill(false));
      setInTime(new Array(employeeCount).fill(""));
      setOutTime(new Array(employeeCount).fill(""));
      setOvertime(new Array(employeeCount).fill(""));
      setLateStatus(new Array(employeeCount).fill(false));
      setSelectedDates(new Array(employeeCount).fill(dayjs()));
    }
  }, [getAllEmployee]);

  // Handle date change for a specific employee
  const handleDateChange = (index, date) => {
    setSelectedDates((prev) => {
      const updated = [...prev];
      updated[index] = date;
      return updated;
    });
  };

  // Helper Functions
  const formatTime = (time) => (time ? dayjs(time).format("h:mmA") : "");

  const handlePresent = (index) => {
    const newPresentState = [...presentState];
    const newAbsentState = [...absentState];

    newPresentState[index] = !newPresentState[index];
    if (newPresentState[index]) {
      newAbsentState[index] = false;
    }

    setPresentState(newPresentState);
    setAbsentState(newAbsentState);
  };

  const handleAbsent = (index) => {
    const newAbsentState = [...absentState];
    const newPresentState = [...presentState];

    newAbsentState[index] = !newAbsentState[index];
    if (newAbsentState[index]) {
      newPresentState[index] = false;
      // Clear time fields when marked as absent
      setInTime((prev) => {
        const updated = [...prev];
        updated[index] = "";
        return updated;
      });
      setOutTime((prev) => {
        const updated = [...prev];
        updated[index] = "";
        return updated;
      });
      setOvertime((prev) => {
        const updated = [...prev];
        updated[index] = "";
        return updated;
      });
      setLateStatus((prev) => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });
    }

    setAbsentState(newAbsentState);
    setPresentState(newPresentState);
  };

  const handleAttendanceInTime = (index, time) => {
    const formattedTime = formatTime(time);
    setInTime((prev) => {
      const updated = [...prev];
      updated[index] = formattedTime;
      return updated;
    });
  };

  const handleAttendanceOutTime = (index, time) => {
    const formattedTime = formatTime(time);
    setOutTime((prev) => {
      const updated = [...prev];
      updated[index] = formattedTime;
      return updated;
    });
  };

  const handleAttendanceOvertime = (index, value) => {
    setOvertime((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleLate = (index, value) => {
    setLateStatus((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmitAttendance = async () => {
    performActionWithPermission(
      "/dashboard/add-attendance",
      "create",
      async () => {
        // Filter only employees who have been explicitly marked as present or absent
        const attendanceData = getAllEmployee.data.employees
          .map((employee, index) => ({
            employee: employee._id,
            full_name: employee.full_name,
            employeeId: employee.employeeId,
            status: employee.status,
            designation: employee.designation,
            date: selectedDates[index]
              ? selectedDates[index].format("DD-MM-YYYY")
              : dayjs().format("DD-MM-YYYY"),
            office_time: profileData?.data?.officeTime || "10.00",
            present: presentState[index],
            absent: absentState[index],
            in_time: inTime[index],
            out_time: outTime[index],
            overtime: overtime[index],
            late_status: lateStatus[index],
            hasAttendanceMarked: presentState[index] || absentState[index], // Add flag to identify marked employees
          }))
          .filter((attendance) => attendance.hasAttendanceMarked); // Only include marked employees

        // Check if any attendance has been marked
        if (attendanceData.length === 0) {
          toast.error(
            "Please mark attendance (Present or Absent) for at least one employee before submitting."
          );
          return;
        }

        try {
          const response = await createAttendance({
            tenantDomain,
            payload: attendanceData,
          }).unwrap();

          if (response.success) {
            toast.success(response.message);
            // Reset form after successful submission
            const employeeCount = getAllEmployee.data.employees.length;
            setPresentState(new Array(employeeCount).fill(false));
            setAbsentState(new Array(employeeCount).fill(false));
            setInTime(new Array(employeeCount).fill(""));
            setOutTime(new Array(employeeCount).fill(""));
            setOvertime(new Array(employeeCount).fill(""));
            setLateStatus(new Array(employeeCount).fill(false));
            setSelectedDates(new Array(employeeCount).fill(dayjs()));
          }
        } catch (error) {
          toast.error(error.message || "Something went wrong");
        }
      },
      "You don't have permission to create attendance."
    );
  };

  // Calculate statistics - only count explicitly marked attendance
  const totalEmployees = getAllEmployee?.data?.employees?.length || 0;
  const presentCount = presentState.filter(Boolean).length;
  const absentCount = absentState.filter(Boolean).length;
  const lateCount = lateStatus.filter(Boolean).length;

  // Filter employees based on search term
  const filteredEmployees = getAllEmployee?.data?.employees?.filter(
    (employee) =>
      employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading and Error States
  if (employeesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress color="primary" />
        <span className="ml-2 text-gray-600">Loading employee data...</span>
      </div>
    );
  }

  if (employeesError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <AlertTriangle className="mr-2" />
        Error loading employee data. Please try again.
      </div>
    );
  }

  return (
    <div className="pt-8 pb-20 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <HeaderSection formattedDate={dayjs().format("DD-MM-YYYY")} />

      <StatsCards
        totalEmployees={totalEmployees}
        presentCount={presentCount}
        absentCount={absentCount}
        lateCount={lateCount}
      />

      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        officeTime={profileData?.data?.officeTime}
      />

      <div className="md:px-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <TableContainer component={Paper} elevation={0}>
              <Table aria-label="employee attendance table">
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableCell
                        key={index}
                        sx={{
                          backgroundColor:
                            index === 0
                              ? "#4f46e5"
                              : `rgba(79, 70, 229, ${1 - index * 0.07})`,
                          color: index < 8 ? "white" : "#1e1b4b",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          padding: "16px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.map((employee, index) => (
                    <EmployeeRow
                      key={employee._id}
                      employee={employee}
                      index={index}
                      profileData={profileData}
                      presentState={presentState}
                      absentState={absentState}
                      inTime={inTime}
                      outTime={outTime}
                      overtime={overtime}
                      lateStatus={lateStatus}
                      selectedDate={selectedDates[index] || dayjs()}
                      handlePresent={handlePresent}
                      handleAbsent={handleAbsent}
                      handleAttendanceInTime={handleAttendanceInTime}
                      handleAttendanceOutTime={handleAttendanceOutTime}
                      handleAttendanceOvertime={handleAttendanceOvertime}
                      handleLate={handleLate}
                      handleDateChange={handleDateChange}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <Can page="/dashboard/add-attendance" action="create">
            <SubmitButton
              isLoading={createLoading}
              onSubmit={handleSubmitAttendance}
            />
          </Can>
        </div>
      </div>
    </div>
  );
};

export default AddAttendance;
