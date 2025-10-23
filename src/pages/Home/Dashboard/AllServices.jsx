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
import { useTenantDomain } from "../../../../src/hooks/useTenantDomain";
import PropTypes from "prop-types";

const AllServices = ({ showSensitiveData }) => {
  const { tenantDomain } = useTenantDomain();
  const {
    data: allMetaData,
    isLoading,
  } = useGetAllMetaQuery({ tenantDomain });

  if (isLoading) return <Loading />;

  const card = "flex flex-col md:flex-row items-center justify-center content-center gap-x-2 mt-3 md:mt-8 space-y-2 "
  const amount = "text-center text-[32px] font-bold "

  return (
    <div className="dashBoardRight mt-5 lg:mt-0 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-content-center gap-3 lg:gap-3 xl:gap-7 mb-5">
        {/* Completed Services - Green (success) */}
        <div className="invoice-card completed-card">
          <Link to="/dashboard/complete-project">
            <div className={card}>
              <div className="dashboardCardIconWrap">
                <HiOutlineBriefcase className="dashboardCardIcon" />
              </div>
              <div className="invoice-info ">
                <h2 className={amount}>
                  {allMetaData?.data?.statusSummary?.completed}
                </h2>
                <p className="label">Completed Services</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Running Services - Orange/Yellow (in progress) */}
        <div className="invoice-card running-card">
          <Link to="/dashboard/running-project">
            <div className={card}>
              <div className="dashboardCardIconWrap2 ">
                <FaWrench className="dashboardCardIcon" />
              </div>
              <div className="invoice-info">
                <h2 className={amount}>
                  {allMetaData?.data?.statusSummary?.running}
                </h2>
                <p className="label">Running Services</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Total Product - Purple (inventory) */}
        <div className="invoice-card product-card">
          <div className={card}>
            <div className="dashboardCardIconWrap4">
              <FaCarSide className="dashboardCardIcon" />
            </div>
            <div className="invoice-info">
              <h2 className={amount}>000</h2>
              <p className="label">Total Product</p>
            </div>
          </div>
        </div>

        {/* All Customers - Pink (people) */}
        <div className="invoice-card customer-card">
          <Link to="/dashboard/all-customer">
            <div className={card}>
              <div className="dashboardCardIconWrap7">
                <FaUsers className="dashboardCardIcon" />
              </div>
              <div className="invoice-info">
                <h2 className={amount}>
                  {allMetaData?.data?.totalCustomers +
                    allMetaData?.data?.totalShowRooms +
                    allMetaData?.data?.totalCompanies}
                </h2>
                <p className="label">All Customer</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Sensitive Cards (toggle these) */}
      {showSensitiveData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-content-center gap-3 lg:gap-3 xl:gap-7 mb-5">
          {/* Total Sale - Blue (sales) */}
          <div className="invoice-card sale-card">
            <div className={card}>
              <div className="dashboardCardIconWrap3">
                <FaPercent className="dashboardCardIcon" />
              </div>
              <div className="invoice-info">
                <h2 className={amount}>000</h2>
                <p className="label">Total Sale</p>
              </div>
            </div>
          </div>

          {/* Total Amount - Teal (revenue) */}
          <div className="invoice-card amount-card">
            <div className={card}>
              <div className="dashboardCardIconWrap">
                <AssuredWorkload className="dashboardCardIcon" />
              </div>
              <div className="invoice-info">
                <h2 className={amount}>{allMetaData?.data?.totalAmount} ৳</h2>
                <p className="label">Total Amount</p>
              </div>
            </div>
          </div>

          {/* Paid Services Bill - Green (paid) */}
          <div className="invoice-card paid-card">
            <div className={card}>
              <div className="dashboardCardIconWrap5">
                <FaFileInvoice className="dashboardCardIcon" />
              </div>
              <div className="invoice-info">
                <h2 className={amount}>{allMetaData?.data?.totalAdvance} ৳</h2>
                <p className="label">Paid Services Bill</p>
              </div>
            </div>
          </div>

          {/* Due Service Bill - Red (due/overdue) */}
          <div className="invoice-card due-card">
            <Link to="/dashboard/money-receipt-due">
              <div className={card}>
                <div className="dashboardCardIconWrap6">
                  <FaFileInvoiceDollar className="dashboardCardIcon" />
                </div>
                <div className="invoice-info">
                  <h2 className={amount}>
                    {allMetaData?.data?.totalRemaining} ৳
                  </h2>
                  <p className="label">Due Service Bill</p>
                </div>
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