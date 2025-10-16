/* eslint-disable no-unused-vars */
import { FaRegUser } from "react-icons/fa";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useGetAllELeaveRequestQuery } from "../../../redux/api/leaveRequestApi";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Loading from "../../../components/Loading/Loading";

const DashboardLeave = () => {
  const [currentPage] = useState(1);
  const [search] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const tenantDomain = useTenantDomain();

  const { data, isLoading } = useGetAllELeaveRequestQuery({
    tenantDomain,
    limit: 3, // Only show 3 requests on dashboard
    page: currentPage,
    searchTerm: search,
  });

  useEffect(() => {
    if (data?.data?.leaveRequests) {
      const pending = data?.data?.leaveRequests.filter(
        (request) => request.status === "Pending"
      );
      setPendingCount(pending.length);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  const leaveRequests = data?.data?.leaveRequests || [];


  const getStatusStyles = (status) => {
    switch (status) {
      case "Approved":
        return "bg-[#E2F6ED] text-[#55CE63]";
      case "Pending":
        return "bg-[#FEF5E7] text-[#F39C12]";
      case "Rejected":
        return "bg-[#FDE2E7] text-[#E74C3C]";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("D MMM YYYY");
  };

  return (
    <div className="earningCardWrap space-y-4 bg-white rounded-xl shadow-lg p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xl text-gray-800 flex items-center">
          <span className="mr-2">Leave Requests</span>
          {pendingCount > 0 && (
            <span className="bg-red-100 text-red-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {pendingCount} Pending
            </span>
          )}
        </h3>

        <Link
          to="/dashboard/employee-leave"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          View All
          <HiOutlineArrowNarrowRight className="ml-1" />
        </Link>
      </div>

      {leaveRequests.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No leave requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaveRequests.slice(0, 2).map((request) => (
            <div
              key={request._id}
              className="bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-full mr-3">
                  <FaRegUser className="text-blue-600" size={20} />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {request.employee?.full_name || "Unknown Employee"}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {request.leaveType}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusStyles(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3">
                    <div className="bg-blue-50 px-3 py-1.5 rounded-lg">
                      <p className="text-xs text-gray-500">From</p>
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(request.fromDate)}
                      </p>
                    </div>

                    <div className="bg-blue-50 px-3 py-1.5 rounded-lg">
                      <p className="text-xs text-gray-500">To</p>
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(request.toDate)}
                      </p>
                    </div>

                    <div className="bg-blue-50 px-3 py-1.5 rounded-lg">
                      <p className="text-xs text-gray-500">Days</p>
                      <p className="text-sm font-medium text-gray-800">
                        {request.noOfDays}
                      </p>
                    </div>
                  </div>

                  {request.reason && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Reason</p>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                        {request.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardLeave;
