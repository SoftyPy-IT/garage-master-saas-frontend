/* eslint-disable react/prop-types */
import { FaCarSide, FaFileInvoice } from "react-icons/fa";
import {
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import ExpanseIncomeChart from "../../../components/Chart/ExpanseIncomeChart";
import Loading from "../../../components/Loading/Loading";
import { useGetAllMetaQuery } from "../../../redux/api/meta.api";
import "./ProjectOverView.css";

const ProjectOverView = ({ tenantDomain }) => {
  const { data: allMetaData, isLoading } = useGetAllMetaQuery({ tenantDomain });
  if (isLoading) return <Loading />;

  const userData = [ 
    {
      id: 1,
      name: "Customers",
      user: allMetaData?.data?.totalCustomers,
      icon: <HiOutlineUserGroup className="stat-icon" />,
      path: "/dashboard/customer-list",
      color: "blue-card"
    },
    {
      id: 2,
      name: "Show Room",
      user: allMetaData?.data?.totalShowRooms,
      icon: <HiOutlineUsers className="stat-icon" />,
      path: "/dashboard/show-room-list",
      color: "green-card"
    },
    {
      id: 3,
      name: "Company",
      user: allMetaData?.data?.totalCompanies,
      icon: <HiOutlineUsers className="stat-icon" />,
      path: "/dashboard/company-list",
      color: "purple-card"
    },
    {
      id: 5,
      name: "Job Card",
      user: allMetaData?.data?.totalJobCard,
      icon: <HiOutlineBriefcase className="stat-icon" />,
      path: "/dashboard/jobcard-list",
      color: "orange-card"
    },
    {
      id: 6,
      name: "Quotation",
      user: allMetaData?.data?.totalQuotation,
      icon: <FaCarSide className="stat-icon" />,
      path: "/dashboard/quotation-list",
      color: "red-card"
    },
    {
      id: 7,
      name: "Invoice",
      user: allMetaData?.data?.totalInvoice,
      icon: <FaFileInvoice className="stat-icon" />,
      path: "/dashboard/create-invoice-list",
      color: "indigo-card"
    },
  ];

  return (
    <div className="project-overview-page">
      {/* Main Content */} 
      <div className="project-content">
        {/* Header */}
        <div className="project-header">
          <h1 className="project-title">
            Project Overview
          </h1>
        </div>

        <div className="project-grid">
          {/* Stats Grid */}
          <div className="stats-container">
            <div className="stats-grid">
              {userData?.map((data) => (
                <Link key={data.id} to={data.path} className="stat-link">
                  <div className={`stat-card ${data.color}`}>
                    <div className="card-content">
                      <div className="icon-wrapper">
                        {data.icon}
                      </div>
                      
                      <div className="stat-info">
                        <div className="stat-number">
                          {data.user}
                        </div>
                        <div className="stat-label">
                          {data.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Chart Section */}
          <div className="chart-section">
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Revenue Analytics</h3>
                <p className="chart-subtitle">Income & expense tracking</p>
              </div>
              <div className="chart-content">
                <ExpanseIncomeChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverView;