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
import { useTenantDomain } from "../../../../hooks/useTenantDomain";
import { format } from "date-fns";

const EmployeeLeave = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const tenantDomain = useTenantDomain();

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
      icon: <Users className="h-6 w-6" />,
      color: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30",
      textColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      shadowColor: "shadow-emerald-100 dark:shadow-emerald-900/20",
    },
    {
      id: 2,
      title: "Pending Request",
      value: dashboardMetrics.Pending || 0,
      icon: <ClipboardList className="h-6 w-6" />,
      color: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30",
      textColor: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-200 dark:border-amber-800",
      shadowColor: "shadow-amber-100 dark:shadow-amber-900/20",
    },
    {
      id: 3,
      title: "Approved Request",
      value: dashboardMetrics.Approved || 0,
      icon: <CheckCircle className="h-6 w-6" />,
      color: "bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/40 dark:to-rose-900/30",
      textColor: "text-rose-600 dark:text-rose-400",
      borderColor: "border-rose-200 dark:border-rose-800",
      shadowColor: "shadow-rose-100 dark:shadow-rose-900/20",
    },
    {
      id: 4,
      title: "Today's Leaves",
      value: dashboardMetrics.todayLeaves || 0,
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30",
      textColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800",
      shadowColor: "shadow-blue-100 dark:shadow-blue-900/20",
    },
    {
      id: 5,
      title: "Rejected Request",
      value: dashboardMetrics.Rejected || 0,
      icon: <UserMinus className="h-6 w-6" />,
      color: "bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/40 dark:to-violet-900/30",
      textColor: "text-violet-600 dark:text-violet-400",
      borderColor: "border-violet-200 dark:border-violet-800",
      shadowColor: "shadow-violet-100 dark:shadow-violet-900/20",
    },
  ];

  return (
    <div className="w-full mt-5 mb-24">
      
      
      <div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
               <FaUsers size={70} className="invoicIcon" />
              Employee Leave Overview
            </h2>
          </div>

          {isError ? (
            <div className="text-center py-8 text-red-500">
              Failed to load leave data. Please try again later.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {leaveData.map((leave) => (
                <div
                  key={leave.id}
                  className={`relative overflow-hidden rounded-xl border ${leave.borderColor} ${leave.color} p-6 shadow-lg ${leave.shadowColor} transition-all duration-300`}
                >
                  <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/20 dark:bg-black/10" />
                  <div className="absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-white/20 dark:bg-black/10" />

                  <div
                    className={`mb-3 inline-flex rounded-lg p-2 ${leave.textColor} bg-white/60 dark:bg-black/20`}
                  >
                    {leave.icon}
                  </div>

                  <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-200">
                    {leave.title}
                  </h3>

                  <div className={`text-2xl font-bold ${leave.textColor}`}>
                    {isLoading ? (
                      <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    ) : (
                      leave.value
                    )}
                  </div>

                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full rounded-full ${leave.textColor.replace(
                        "text",
                        "bg"
                      )}`}
                      style={{ width: isLoading ? "50%" : "100%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <EmployeeLeaveTable
        currentPage={currentPage}
        data={data}
        setSearch={setSearch}
        setCurrentPage={setCurrentPage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EmployeeLeave;