/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import {
  FaCarSide,
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaPercent,
  FaUsers,
  FaWrench,
} from "react-icons/fa";
import { HiOutlineBriefcase } from "react-icons/hi";
import { Link } from "react-router-dom";
import Loading from "../../../components/Loading/Loading";
import "./AllService.css";
import { useGetAllMetaQuery } from "../../../redux/api/meta.api";
import { AssuredWorkload } from "@mui/icons-material";
import PropTypes from "prop-types";

const AllServices = ({ showSensitiveData, tenantDomain }) => {
  const {
    data: allMetaData,
    isLoading,
  } = useGetAllMetaQuery({ tenantDomain });

  if (isLoading) return <Loading />;

  const card = "flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl";
  const amount = "text-center text-3xl font-bold mb-2 text-white drop-shadow-sm";
  const label = "text-center text-sm font-medium text-white/90";

  return (
    <div className="dashBoardRight mt-5 lg:mt-0">
      {/* Always visible cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-content-center gap-5 mb-6">
        {/* Completed Services */}
        <div className="modern-card blue-card group">
          <Link to="/dashboard/complete-project" className="block h-full">
            <div className={card}>
              <div className="icon-wrapper">
                <HiOutlineBriefcase className="text-white text-2xl" />
              </div>
              <div className="content-wrapper mt-4">
                <h2 className={amount}>
                  {allMetaData?.data?.statusSummary?.completed}
                </h2>
                <p className={label}>Completed Services</p>
              </div>
              <div className="floating-circle"></div>
            </div>
          </Link>
        </div>

        {/* Running Services */}
        <div className="modern-card green-card group">
          <Link to="/dashboard/running-project" className="block h-full">
            <div className={card}>
              <div className="icon-wrapper">
                <FaWrench className="text-white text-2xl" />
              </div>
              <div className="content-wrapper mt-4">
                <h2 className={amount}>
                  {allMetaData?.data?.statusSummary?.running}
                </h2>
                <p className={label}>Running Services</p>
              </div>
              <div className="floating-circle"></div>
            </div>
          </Link>
        </div>

        {/* Total Product */}
        <div className="modern-card purple-card group">
          <div className={card}>
            <div className="icon-wrapper">
              <FaCarSide className="text-white text-2xl" />
            </div>
            <div className="content-wrapper mt-4">
              <h2 className={amount}>000</h2>
              <p className={label}>Total Product</p>
            </div>
            <div className="floating-circle"></div>
          </div>
        </div>

        {/* All Customers */}
        <div className="modern-card pink-card group">
          <Link to="/dashboard/all-customer" className="block h-full">
            <div className={card}>
              <div className="icon-wrapper">
                <FaUsers className="text-white text-2xl" />
              </div>
              <div className="content-wrapper mt-4">
                <h2 className={amount}>
                  {allMetaData?.data?.totalCustomers +
                    allMetaData?.data?.totalShowRooms +
                    allMetaData?.data?.totalCompanies}
                </h2>
                <p className={label}>All Customer</p>
              </div>
              <div className="floating-circle"></div>
            </div>
          </Link>
        </div>
      </div>

      {/* Sensitive Cards */}
      {showSensitiveData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-content-center gap-5">
          {/* Total Sale */}
          <div className="modern-card deep-blue-card group">
            <div className={card}>
              <div className="icon-wrapper">
                <FaPercent className="text-white text-2xl" />
              </div>
              <div className="content-wrapper mt-4">
                <h2 className={amount}>000</h2>
                <p className={label}>Total Sale</p> 
              </div>
              <div className="floating-circle"></div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="modern-card red-card group">
            <div className={card}>
              <div className="icon-wrapper">
                <AssuredWorkload className="text-white text-2xl" />
              </div>
              <div className="content-wrapper mt-4">
                <h2 className={amount}>{allMetaData?.data?.totalAmount} ৳</h2>
                <p className={label}>Total Amount</p>
              </div>
              <div className="floating-circle"></div>
            </div>
          </div>

          {/* Paid Services Bill */}
          <div className="modern-card teal-card group">
            <div className={card}>
              <div className="icon-wrapper">
                <FaFileInvoice className="text-white text-2xl" />
              </div>
              <div className="content-wrapper mt-4">
                <h2 className={amount}>{allMetaData?.data?.totalAdvance} ৳</h2>
                <p className={label}>Paid Services Bill</p>
              </div>
              <div className="floating-circle"></div>
            </div>
          </div>

          {/* Due Service Bill */}
          <div className="modern-card orange-card group">
            <Link to="/dashboard/money-receipt-due" className="block h-full">
              <div className={card}>
                <div className="icon-wrapper">
                  <FaFileInvoiceDollar className="text-white text-2xl" />
                </div>
                <div className="content-wrapper mt-4">
                  <h2 className={amount}>
                    {allMetaData?.data?.totalRemaining} ৳
                  </h2>
                  <p className={label}>Due Service Bill</p>
                </div>
                <div className="floating-circle"></div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

AllServices.propTypes = {
  showSensitiveData: PropTypes.bool.isRequired,
};

export default AllServices;