/* eslint-disable no-unused-vars */
import React, { useState } from "react"; // Import useState
import "./Home.css";
import MonthlyBarChart from "../../components/Chart/MonthlyBarChart";
import YearlyIncomeChart from "../../components/Chart/YearlyIncomeChart";
import AllServices from "./Dashboard/AllServices";
import ProfitOverView from "./Dashboard/ProfitOverView";
import ProjectOverView from "./Dashboard/ProjectOverView";
import RecentClient from "./Dashboard/RecentClient";
import RecentProject from "./Dashboard/RecentProject";
import RcentQuotation from "./Dashboard/RcentQuotation";
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
import { IconButton, Tooltip } from "@mui/material";

const Home = () => {
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const tenantDomain = useTenantDomain();
  const {
    data: allMetaData,
    isLoading,
    isError,
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
      <AllServices showSensitiveData={showSensitiveData} />

      {showSensitiveData && (
        <DashboardSummary
          data={allMetaData?.data}
          accountSummary={accountSummary}
        />
      )}
      {showSensitiveData && <ProfitOverView />}

      {/* <div className="flex xl:flex-nowrap flex-wrap sectionMargin  ">
        <MonthlyBarChart />
        <YearlyIncomeChart />
      </div>
      <div className="hidden  lg:flex items-center justify-between px-10 mt-10">
        <h3 className="text-xl md:text-3xl font-semibold">
          Monthly Income Chart
        </h3>
        <h3 className="text-xl md:text-3xl font-semibold monthlyTitle">
          Yearly Income Chart
        </h3>
      </div> */}

      <ProjectOverView />

      <div className="recentCardWrap gap-5  xl:flex justify-between sectionMargin">
        <RecentClient />
        <RecentProject />
      </div>

      <div className="xl:flex gap-5 justify-between mt-[30px]">
        <RcentQuotation />
        <RecentInvoice />
      </div>
      <EmployeeStatistics />
    </div>
  );
};

export default Home;

// /* eslint-disable no-unused-vars */
// // src/pages/Home/Home.js
// import { useState } from "react";
// import "./Home.css";
// import MonthlyBarChart from "../../components/Chart/MonthlyBarChart";
// import YearlyIncomeChart from "../../components/Chart/YearlyIncomeChart";
// import AllServices from "./Dashboard/AllServices";
// import ProfitOverView from "./Dashboard/ProfitOverView";
// import ProjectOverView from "./Dashboard/ProjectOverView";
// import RecentClient from "./Dashboard/RecentClient";
// import RecentProject from "./Dashboard/RecentProject";
// import RcentQuotation from "./Dashboard/RcentQuotation";
// import RecentInvoice from "./Dashboard/RecentInvoice";
// import EmployeeStatistics from "./Dashboard/EmployeeStatistics";
// import { useTenantDomain } from "../../hooks/useTenantDomain";
// import {
//   useAccountSummaryQuery,
//   useGetAllMetaQuery,
// } from "../../redux/api/meta.api";
// import DashboardSummary from "./Dashboard/IncomeCard";
// import Loading from "../../components/Loading/Loading";
// import { usePermissions } from "../../context/PermissionContext";
// import { Button } from "@mui/material";
// import { Eye, EyeOff } from "lucide-react";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

// const Home = () => {
//   const [showSensitiveData, setShowSensitiveData] = useState(false);
//   const {tenantDomain} = useTenantDomain();
//   const { checkPermission, permissions } = usePermissions();

//   const {
//     data: allMetaData,
//     isLoading,
//   } = useGetAllMetaQuery({ tenantDomain });

//   const { data: accountSummary } = useAccountSummaryQuery({ tenantDomain });

//   if (isLoading) {
//     return <Loading />;
//   }

//   return (
//     <div className="mt-10">
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="md:text-3xl font-bold">Welcome Admin !</h3>
//           <span className="text-sm">Home / Dashboard</span>
//         </div>

//         {/* পারমিশন চেক সংশোধন */}
//         {checkPermission('/dashboard', 'view') && (
//           <Button
//             onClick={() => setShowSensitiveData(!showSensitiveData)}
//             variant="contained"
//             color={showSensitiveData ? "secondary" : "primary"}
//           >
//             {showSensitiveData ? <VisibilityOff/> : <Visibility/>}
//           </Button>
//         )}
//       </div>

//       {/* কন্ডিশনালি সেনসিটিভ সেকশন রেন্ডার করুন */}
//       {showSensitiveData && checkPermission('/dashboard', 'view') && (
//         <>
//           <AllServices />
//           <DashboardSummary data={allMetaData?.data} accountSummary={accountSummary}/>
//         </>
//       )}

//       {/* শুধুমাত্র চার্ট দেখান যদি ইউজারের পারমিশন থাকে */}
//       {checkPermission('/dashboard', 'view') && (
//         <>
//           <div className="flex xl:flex-nowrap flex-wrap sectionMargin">
//             <MonthlyBarChart />
//             <YearlyIncomeChart />
//           </div>
//           <div className="hidden lg:flex items-center justify-between px-10 mt-10">
//             <h3 className="text-xl md:text-3xl font-semibold">
//               Monthly Income Chart
//             </h3>
//             <h3 className="text-xl md:text-3xl font-semibold monthlyTitle">
//               Yearly Income Chart
//             </h3>
//           </div>
//           <ProfitOverView />
//           <ProjectOverView />
//         </>
//       )}

//       {/* শুধুমাত্র রিসেন্ট কার্ড দেখান যদি ইউজারের পারমিশন থাকে */}
//       {checkPermission('/dashboard', 'view') && (
//         <>
//           <div className="recentCardWrap gap-5 xl:flex justify-between sectionMargin">
//             <RecentClient />
//             <RecentProject />
//           </div>

//           <div className="xl:flex gap-5 justify-between mt-[30px]">
//             <RcentQuotation />
//             <RecentInvoice />
//           </div>
//         </>
//       )}

//       {/* শুধুমাত্র এমপ্লয়ি স্ট্যাটিস্টিক্স দেখান যদি ইউজারের পারমিশন থাকে */}
//       {checkPermission('/dashboard/employee-attendance', 'view') && (
//         <EmployeeStatistics />
//       )}
//     </div>
//   );
// };

// export default Home;
