/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { FaUsers } from "react-icons/fa";
import "../Employee.css";
import EmployeeLeaveTable from "./EmployeeLeaveTable";
import { useState, useMemo } from "react";
import {
  Users,
  UserMinus,
  ClipboardList,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { useGetAllELeaveRequestQuery } from "../../../../redux/api/leaveRequestApi";
import { format } from "date-fns";
import { useAppOptions } from "../../../../hooks/useAppOptions";

const EmployeeLeave = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const { tenantDomain, performActionWithPermission } = useAppOptions()
  const { data, isLoading, isError } = useGetAllELeaveRequestQuery({
    tenantDomain,
    limit: 10,
    page: currentPage,
    searchTerm: search,
  });

  // Calculate dashboard metrics from API data
  const dashboardMetrics = useMemo(() => {
    if (!data || !data?.data?.leaveRequests) return {};

    const today = format(new Date(), 'yyyy-MM-dd');

    return data?.data?.leaveRequests.reduce((metrics, request) => {
      // Count by status
      metrics[request.status] = (metrics[request.status] || 0) + 1;

      // Count today's leaves
      const fromDate = request.fromDate.split('T')[0];
      const toDate = request.toDate.split('T')[0];

      if (request.status === "Approved" &&
        today >= fromDate &&
        today <= toDate) {
        metrics.todayLeaves = (metrics.todayLeaves || 0) + 1;
      }

      return metrics;
    }, {
      total: data?.data?.leaveRequests.length,
      todayLeaves: 0
    });
  }, [data]);

  // Dashboard card data - now dynamic
  const leaveData = [
    {
      id: 1,
      title: "Total Requests",
      value: dashboardMetrics.total || 0,
      icon: <Users className="h-5 w-5" />,
      color: "bg-white ",
      accentColor: "bg-emerald-500",
      textColor: "text-gray-900 ",
      metricColor: "text-emerald-600",
    },
    {
      id: 2,
      title: "Pending Request",
      value: dashboardMetrics.Pending || 0,
      icon: <ClipboardList className="h-5 w-5" />,
      color: "bg-white ",
      accentColor: "bg-amber-500",
      textColor: "text-gray-900 ",
      metricColor: "text-amber-600 ",
    },
    {
      id: 3,
      title: "Approved Request",
      value: dashboardMetrics.Approved || 0,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "bg-white ",
      accentColor: "bg-rose-500",
      textColor: "text-gray-900 ",
      metricColor: "text-rose-600",
    },
    {
      id: 4,
      title: "Today's Leaves",
      value: dashboardMetrics.todayLeaves || 0,
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-white",
      accentColor: "bg-blue-500",
      textColor: "text-gray-900",
      metricColor: "text-blue-600 ",
    },
    {
      id: 5,
      title: "Rejected Request",
      value: dashboardMetrics.Rejected || 0,
      icon: <UserMinus className="h-5 w-5" />,
      color: "bg-white ",
      accentColor: "bg-violet-500",
      textColor: "text-gray-900 ",
      metricColor: "text-violet-600 ",
    },
  ];

  return (
    <div className="w-full py-6 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50  rounded-xl">
            <FaUsers className="text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Employee Leave
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Overview of employee leave requests and status
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {leaveData.map((leave) => (
          <div
            key={leave.id}
            className={`relative rounded-xl border border-gray-200 dark:border-gray-700 ${leave.color} p-5 shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${leave.accentColor} rounded-l-xl`} />

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {leave.title}
                </p>
                <div className={`text-2xl font-bold ${leave.metricColor} mb-3`}>
                  {isLoading ? (
                    <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  ) : (
                    leave.value
                  )}
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${leave.accentColor} transition-all duration-500`}
                    style={{
                      width: isLoading ? '50%' : '100%',
                      maxWidth: '100%'
                    }}
                  />
                </div>
              </div>

              <div className={`p-2 rounded-lg ${leave.accentColor} bg-opacity-10 ml-3`}>
                <div className={leave.metricColor}>
                  {leave.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isError && (
        <div className="text-center py-8 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Failed to load leave data
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            There was an error loading the leave information. Please try again later.
          </p>
        </div>
      )}

      <div className="mt-8">
        <EmployeeLeaveTable
          performActionWithPermission={performActionWithPermission}
          currentPage={currentPage}
          data={data}
          setSearch={setSearch}
          setCurrentPage={setCurrentPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default EmployeeLeave;