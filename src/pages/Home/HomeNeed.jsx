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

// const Home = () => {
//   const [showSensitiveData, setShowSensitiveData] = useState(false);
//   const tenantDomain = useTenantDomain();
//   const { checkPermission } = usePermissions();

  
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
        
//         {/* Only show sensitive data toggle if user has permission */}
//         {checkPermission('/dashboard', 'view') && (
//           <Button
//             onClick={() => setShowSensitiveData(!showSensitiveData)}
//             variant="contained"
//             color={showSensitiveData ? "secondary" : "primary"}
//           >
//             {showSensitiveData ? "Hide Sensitive Data" : "Show Sensitive Data"}
//           </Button>
//         )}
//       </div>

//       {/* Conditionally render sensitive sections based on permissions */}
//       {showSensitiveData && checkPermission('/dashboard', 'view') && (
//         <>
//           <AllServices />
//           <DashboardSummary data={allMetaData?.data} accountSummary={accountSummary}/>
//         </>
//       )}

//       {/* Only show charts if user has permission */}
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

//       {/* Only show recent cards if user has permission */}
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

//       {/* Only show employee statistics if user has permission */}
//       {checkPermission('/dashboard/employee-attendance', 'view') && (
//         <EmployeeStatistics />
//       )}
//     </div>
//   );
// };

// export default Home;