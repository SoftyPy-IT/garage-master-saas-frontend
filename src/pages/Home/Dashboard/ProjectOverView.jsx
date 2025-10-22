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
      color: "cyan-card"
    },
    {
      id: 2,
      name: "Show Room",
      user: allMetaData?.data?.totalShowRooms,
      icon: <HiOutlineUsers className="stat-icon" />,
      path: "/dashboard/show-room-list",
      color: "emerald-card"
    },
    {
      id: 3,
      name: "Company",
      user: allMetaData?.data?.totalCompanies,
      icon: <HiOutlineUsers className="stat-icon" />,
      path: "/dashboard/company-list",
      color: "violet-card"
    },
    {
      id: 5,
      name: "Job Card",
      user: allMetaData?.data?.totalJobCard,
      icon: <HiOutlineBriefcase className="stat-icon" />,
      path: "/dashboard/jobcard-list",
      color: "amber-card"
    },
    {
      id: 6,
      name: "Quotation",
      user: allMetaData?.data?.totalQuotation,
      icon: <FaCarSide className="stat-icon" />,
      path: "/dashboard/quotation-list",
      color: "rose-card"
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
      {/* Animated Background */}
      <div className="background-animation">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
      </div>

      {/* Main Content */}
      <div className="project-content">
        {/* Header */}
        <div className="project-header">
          <h1 className="project-title">
            Project <span className="title-accent">Overview</span>
          </h1>
          <div className="header-decoration">
            <div className="decoration-line"></div>
            <div className="decoration-dot"></div>
          </div>
        </div>

        <div className="project-grid">
          {/* Stats Grid */}
          <div className="stats-container">
            <div className="stats-grid">
              {userData?.map((data, index) => (
                <Link key={data.id} to={data.path} className="stat-link">
                  <div className={`stat-card ${data.color} card-${index + 1}`}>
                    {/* Animated Border */}
                    <div className="card-border"></div>
                    
                    {/* Card Content */}
                    <div className="card-content">
                      <div className="icon-wrapper">
                        {data.icon}
                        <div className="icon-pulse"></div>
                      </div>
                      
                      <div className="stat-info">
                        <div className="stat-number animate-count">
                          {data.user}
                        </div>
                        <div className="stat-label">
                          {data.name}
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <div className="action-arrow">
                        <svg className="arrow-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>

                    {/* Shimmer Effect */}
                    <div className="card-shimmer"></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Chart Section */}
          <div className="chart-section">
            <div className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <h3 className="chart-title">Revenue Analytics</h3>
                  <p className="chart-subtitle">Real-time income & expense tracking</p>
                </div>
                <div className="chart-indicator">
                  <div className="indicator-dot"></div>
                  <span>Live Data</span>
                </div>
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