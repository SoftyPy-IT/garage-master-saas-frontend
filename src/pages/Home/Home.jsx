/* eslint-disable no-unused-vars */
import { useState } from "react";
import "./Home.css";
import AllServices from "./Dashboard/AllServices";
import ProfitOverView from "./Dashboard/ProfitOverView";
import ProjectOverView from "./Dashboard/ProjectOverView";
import RecentClient from "./Dashboard/RecentClient";
import RecentProject from "./Dashboard/RecentProject";
import RecentQuotation from "./Dashboard/RecentQuotation";
import RecentInvoice from "./Dashboard/RecentInvoice";
import EmployeeStatistics from "./Dashboard/EmployeeStatistics";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import {
  useAccountSummaryQuery,
  useGetAllMetaQuery,
} from "../../redux/api/meta.api";
import DashboardSummary from "./Dashboard/IncomeCard";
import Loading from "../../components/Loading/Loading";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

const Home = () => {
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const { tenantDomain } = useTenantDomain();
  const {
    data: allMetaData,
    isLoading,
  } = useGetAllMetaQuery({ tenantDomain });
  const { data: accountSummary } = useAccountSummaryQuery({ tenantDomain });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="mt-5 xl:mt-10 ">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="md:text-3xl font-bold">Welcome Admin !</h3>
          <span className="text-sm">Home / Dashboard</span>
        </div>
        {/* Toggle Button */}
        <button
          onClick={() => setShowSensitiveData(!showSensitiveData)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showSensitiveData ? (
            <>
              <Tooltip title="Hide">

                <VisibilityOff />

              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="Show"> <Visibility /></Tooltip>

            </>
          )}
        </button>
      </div>

      {/* Conditionally render sensitive sections */}
      <AllServices showSensitiveData={showSensitiveData} tenantDomain={tenantDomain} />

      {showSensitiveData && (
        <DashboardSummary
          tenantDomain={tenantDomain}
          data={allMetaData?.data}
          accountSummary={accountSummary}
        />
      )}
      {showSensitiveData && <ProfitOverView tenantDomain={tenantDomain} />}
      <ProjectOverView tenantDomain={tenantDomain} />

      <div className="recentCardWrap gap-5  xl:flex justify-between sectionMargin">
        <RecentClient tenantDomain={tenantDomain} />
        <RecentProject tenantDomain={tenantDomain} />
      </div>

      <div className="xl:flex gap-5 justify-between mt-[30px]">
        <RecentQuotation tenantDomain={tenantDomain} />
        <RecentInvoice tenantDomain={tenantDomain} />
      </div>
      <EmployeeStatistics tenantDomain={tenantDomain} />
    </div>
  );
};

export default Home;
