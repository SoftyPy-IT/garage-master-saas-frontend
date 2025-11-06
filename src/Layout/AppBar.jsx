"use client";

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarDays } from "react-icons/fa6";
import "./Layout.css";
import TopSearchbar from "../components/TopSearchbar/TopSearchbar";
import UserProfile from "../components/UserProfile/UserProfile";
import { useGetAllMetaQuery } from "../redux/api/meta.api";
import { useTenantDomain } from "../hooks/useTenantDomain";
import Loading from "../components/Loading/Loading";
import { useGetCompanyProfileQuery } from "../redux/api/companyProfile";
import { IconButton } from "@mui/material";
import { MenuOpen } from "@mui/icons-material";

const AppBar = ({ toggle, navRef, toggleSideBar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { tenantDomain } = useTenantDomain();
  const { data: allMetaData, isLoading } = useGetAllMetaQuery({ tenantDomain });
  const { data: CompanyInfoData } = useGetCompanyProfileQuery({
    tenantDomain,
  });

  if (isLoading) return <Loading />;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const SubscriptionChip = () => {
    if (!allMetaData?.data?.subscriptionInfo) return null;

    const { daysRemaining } = allMetaData.data.subscriptionInfo;

    if (daysRemaining <= 0) {
      return (
        <div className="relative group">
          <div className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl shadow-lg animate-pulse border border-red-300">
            Subscription Expired
          </div>
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 shadow-xl">
            Your subscription has expired. Please renew to continue.
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      );
    }

    const getChipColor = () => {
      if (daysRemaining < 15) return "bg-red-500 border-red-300";
      if (daysRemaining < 60) return "bg-orange-500 border-orange-300";
      return "bg-green-500 border-green-300";
    };

    return (
      <div className="relative group">
        <div
          className={`px-4 py-2 ${getChipColor()} text-white text-sm font-semibold rounded-xl shadow-lg border`}
        >
          {daysRemaining} Days Left
        </div>
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 shadow-xl">
          Your subscription has {daysRemaining} day(s) remaining
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="static w-full h-16 xl:h-16">
      <div className="w-full h-16 xl:h-16 bg-[#42A0D9] fixed z-10">
        <div className="flex items-center justify-between lg:pr-8 pl-10 lg:pl-10 xl:pl-20 mt-3 md:mt-2 lg:mt-3">
          <div
            className={`${toggle ? `activeToggle ` : `navActive`}`}
            ref={navRef}
            onClick={toggleSideBar}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </div>

          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <h3 className="w-[200px] ml-0 lg:text-xl xl:text-xl font-semibold text-white hidden xl:block">
                {CompanyInfoData?.data?.companyName}
              </h3>
            </Link>
            <div className="hidden lg:flex items-center gap-3">
              <button
                className="lg:px-3 xl:px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 hover:scale-105 active:scale-95 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                onClick={() =>
                  window.open("https://trustautosolution.com", "_blank")
                }
              >
                Visit Website
              </button>
              <button className="lg:px-3 xl:px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 hover:scale-105 active:scale-95 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 font-medium lg:w-[120px]">
                BD Shop
              </button>
              <button className="lg:px-3 xl:px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 hover:scale-105 active:scale-95 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 font-medium">
                Global Shop
              </button>
            </div>
          </div>

    
          {/* Menu icon for small and medium devices - Right Side */}
          <IconButton
            onClick={toggleMenu}
            sx={{
              color: "#fff",
              display: { xs: "flex", md: "none" },
              marginRight: "10px",
            }}
          >
            <MenuOpen sx={{ fontSize: "40px" }} />
            {/*<MenuOpen sx={{ fontSize: "40px" }} />*/}
            {/* <UserProfile />            
            <ExpandMore/>*/}
          </IconButton>


          {/* Original navigation items - visible on lg screens */}
          <div className="hidden lg:flex items-center space-x-6">
            <SubscriptionChip />

            {/* Keep original TopSearchbar component */}
            <TopSearchbar />

            <Link
              to="/dashboard/holiday"
              className="p-2 xl:p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg hover:bg-white/30 hover:scale-105 transition-all duration-300"
            >
              <FaCalendarDays size={20} className="text-white" />
            </Link>

            <UserProfile tenantDomain={tenantDomain} />
          </div>
        </div>

        {/* Dropdown menu for small and medium devices */}
        <div
          className={`md:hidden w-full backdrop-blur-md bg-[#42A1DA] transition-all duration-500 ease-in-out overflow-hidden rounded-b-2xl shadow-2xl ${menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="flex flex-col items-center pt-6 space-y-4">
            {/* Keep original TopSearchbar component */}
            <TopSearchbar />
          </div>

          <div className="flex flex-col items-stretch gap-3 w-full max-w-[420px] mx-auto p-4">
            <button
              className="px-6 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 hover:scale-105 active:scale-95 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 text-left flex items-center gap-3 text-lg font-medium"
              onClick={() =>
                window.open("https://trustautosolution.com", "_blank")
              }
            >
              <span className="text-xl">🌐</span>
              Visit Website
            </button>
            <button className="px-6 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 hover:scale-105 active:scale-95 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 text-left flex items-center gap-3 text-lg font-medium">
              <span className="text-xl">🛒</span>
              BD Shop
            </button>
            <button className="px-6 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 hover:scale-105 active:scale-95 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 text-left flex items-center gap-3 text-lg font-medium">
              <span className="text-xl">🌍</span>
              Global Shop
            </button>
          </div>

          <div className="flex items-center justify-center py-6 space-x-8 w-full">
            <Link
              to="/dashboard/holiday"
              className="p-3 lg:p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg hover:bg-white/30 hover:scale-110 transition-all duration-300"
            >
              <FaCalendarDays size={24} className="text-white" />
            </Link>
            <div className="relative z-50">
              <UserProfile tenantDomain={tenantDomain} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBar;



// "use client";

// /* eslint-disable react/prop-types */
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { FaCalendarDays } from "react-icons/fa6";
// import { IconButton } from "@mui/material";
// import { MenuOpen } from "@mui/icons-material";
// import "./Layout.css";

// import TopSearchbar from "../components/TopSearchbar/TopSearchbar";
// import UserProfile from "../components/UserProfile/UserProfile";
// import Loading from "../components/Loading/Loading";
// import { useGetAllMetaQuery } from "../redux/api/meta.api";
// import { useTenantDomain } from "../hooks/useTenantDomain";
// import { useGetCompanyProfileQuery } from "../redux/api/companyProfile";

// const AppBar = ({ toggle, navRef, toggleSideBar }) => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const { tenantDomain } = useTenantDomain();
//   const { data: allMetaData, isLoading } = useGetAllMetaQuery({ tenantDomain });
//   const { data: CompanyInfoData } = useGetCompanyProfileQuery({
//     tenantDomain,
//   });

//   if (isLoading) return <Loading />;

//   const toggleMenu = () => setMenuOpen(!menuOpen);

//   const Buttons = () => {
//     const navButtons = [
//       {
//         label: "Visit Website",
//         emoji: "🌐",
//         onClick: () => window.open("https://trustautosolution.com", "_blank"),
//       },
//       {
//         label: "BD Shop",
//         emoji: "🛒",
//         onClick: () => console.log("Open BD Shop"),
//       },
//       {
//         label: "Global Shop",
//         emoji: "🌍",
//         onClick: () => console.log("Open Global Shop"),
//       },
//     ];
//     return (
//       <div className="lg:flex gap-2 space-y-3 md:space-y-0">
//         {navButtons.map((btn) => (
//           <button
//             key={btn.label}
//             className="lg:px-[3px] xl:px-3 lg:py-1 xl:py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl lg:rounded-lg xl:rounded-xl hover:bg-white/30 hover:scale-105 active:scale-95 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 lg:text-[13px]  xl:text-base lg:font-medium xl:font-medium"
//             onClick={btn.onClick}
//           >
            
//             {btn.label}
//           </button>
//         ))}
//       </div>
//     );
//   };

//   const Calender = () => {
//     return (
//       <Link
//         to="/dashboard/holiday"
//         className="p-2 lg:p-1 xl:p-3 bg-white/20 rounded-xl lg:rounded-lg xl:rounded-xl border border-white/30 hover:bg-white/30 hover:scale-110 transition-all duration-300"
//       >
//         <FaCalendarDays className="text-white h-6 lg:h-4 xl:h-5 w-6 lg:w-4 xl:w-5" />
//       </Link>
//     );
//   };

//   // 🟢 Define reusable navigation buttons

//   const SubscriptionChip = () => {
//     if (!allMetaData?.data?.subscriptionInfo) return null;
//     const { daysRemaining } = allMetaData.data.subscriptionInfo;

//     const getChipColor = () => {
//       if (daysRemaining <= 0) return "bg-red-500 border-red-300";
//       if (daysRemaining < 15) return "bg-red-500 border-red-300";
//       if (daysRemaining < 60) return "bg-orange-500 border-orange-300";
//       return "bg-green-500 border-green-300";
//     };

//     return (
//       <div className="relative group">
//         <div
//           className={`lg:px-1 xl:px-3 lg:py-1 xl:py-1.5 ${getChipColor()} text-white text-sm xl:font-semibold rounded-xl lg:rounded-lg xl:rounded-xl shadow-lg border`}
//         >
//           {daysRemaining > 0
//             ? `${daysRemaining} Days Left`
//             : "Subscription Expired"}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="w-full h-16 bg-[#42A0D9] fixed z-10 flex items-center">
//       <div className="flex items-center xl:justify-between w-full px-4 sm:px-6 md:px-8 lg:px-2 xl:px-16 gap-2">
//         {/* Left Sidebar Toggle */}
//         <div
//           className={`${toggle ? "activeToggle" : "navActive"}`}
//           ref={navRef}
//           onClick={toggleSideBar}
//         >
//           <span className="bar" />
//           <span className="bar" />
//           <span className="bar" />
//         </div>

//         {/* Company Name + Buttons */}
//         <div className="flex items-center gap-2 md:gap-4 lg:gap-2">
//           <Link to="/dashboard">
//             <h3 className="hidden sm:block text-white font-semibold text-lg md:text-xl lg:text-[17px] truncate max-w-[150px] lg:max-w-[220px] lg:pl-14">
//               {CompanyInfoData?.data?.companyName}
//             </h3>
//           </Link>

//           {/* Show nav buttons on md+ instead of lg+ */}
//           <div className="hidden md:flex items-center gap-2 lg:gap-3">
//             <Buttons />
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-3 md:gap-5">
//           {/* Show Menu Icon only on small (<md) */}
//           <IconButton
//             onClick={toggleMenu}
//             sx={{
//               color: "#fff",
//               display: { xs: "flex", md: "none" },
//               marginRight: "4px",
//             }}
//           >
//             <MenuOpen sx={{ fontSize: "36px" }} />
//           </IconButton>

//           {/* Desktop Section */}
//           <div className="hidden md:flex items-center gap-4 lg:gap-2 xl:gap-4">
//             <SubscriptionChip />
//             <TopSearchbar />
//             <Calender />
//             <UserProfile tenantDomain={tenantDomain} />
//           </div>
//         </div>
//       </div>

//       {/* 🟢 Mobile Dropdown Menu */}
//       <div
//         className={`md:hidden absolute top-16 left-0 w-full backdrop-blur-md bg-[#42A1DA] transition-all duration-500 overflow-hidden rounded-b-2xl shadow-2xl ${
//           menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
//         }`}
//       >
//         <div className="flex flex-col items-center pt-4 space-y-3">
//           <TopSearchbar />
//         </div>

//         <div className="flex flex-col items-stretch gap-3 w-full max-w-[400px] mx-auto p-4">
//           <Buttons />
//         </div>

//         <div className="flex items-center justify-center py-4 space-x-8">
//           <Calender />
//           <UserProfile tenantDomain={tenantDomain} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AppBar;
