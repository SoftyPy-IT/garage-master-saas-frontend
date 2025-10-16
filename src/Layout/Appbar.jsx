"use client";

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarDays } from "react-icons/fa6";
import "./Layout.css";
import TopSearchbar from "../components/TopSearchbar/TopSearchbar";
import UserProfile from "../components/UserProfile/UserProfile";
import { Box, Button, Chip, IconButton, Tooltip } from "@mui/material";
import { MenuOpen } from "@mui/icons-material";
import { btnStyle, btnStyle2 } from "../utils/customStyle";
import { useGetAllMetaQuery } from "../redux/api/meta.api";
import { useTenantDomain } from "../hooks/useTenantDomain";
import Loading from "../components/Loading/Loading";
import { useGetCompanyProfileQuery } from "../redux/api/companyProfile";

const AppBar = ({ toggle, navRef, toggleSideBar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { tenantDomain } = useTenantDomain();
  const {
    data: allMetaData,
    isLoading,
  } = useGetAllMetaQuery({ tenantDomain });
  const { data: CompanyInfoData } = useGetCompanyProfileQuery({
    tenantDomain,
  });
  if (isLoading) return <Loading />;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="static w-full h-16 xl:h-16">
      <div className="w-full h-16 xl:h-16 bg-[#42A1DA] fixed z-10 ">
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
          <Box display="flex" alignItems="center" gap={2}>
            <Link to="/dashboard">
              <h3 className="w-[250px] ml-5 lg:text-xl xl:text-xl font-semibold text-white hidden xl:block">
                {CompanyInfoData?.data?.companyName}
              </h3>
            </Link>
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{ display: { xs: "none", lg: "flex" } }}
            >
              <Button
                sx={btnStyle2}
                onClick={() =>
                  window.open("https://trustautosolution.com", "_blank")
                }
              >
                Visit Website
              </Button>
              <Button sx={{ ...btnStyle2, width: "100px" }}>Bd Shop</Button>
              <Button sx={btnStyle2}>Global Shop</Button>
            </Box>
          </Box>

          {/* Menu icon for small and medium devices */}
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
          <div className="hidden lg:flex items-center space-x-5 flex-end">
            {allMetaData?.data?.subscriptionInfo && (
              <>
                {allMetaData.data.subscriptionInfo.daysRemaining > 0 ? (
                  <Tooltip
                    title={`Your subscription has ${allMetaData.data.subscriptionInfo.daysRemaining} day(s) remaining`}
                    arrow
                  >
                    <Chip
                      label={`${allMetaData.data.subscriptionInfo.daysRemaining} Days Left`}
                      sx={{
                        backgroundColor:
                          allMetaData.data.subscriptionInfo.daysRemaining < 15
                            ? "#f44336"
                            : allMetaData.data.subscriptionInfo.daysRemaining <
                              60
                              ? "#ff9800"
                              : "#4caf50",
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: "8px",
                        px: 1.5,
                        py: 0.5,
                        fontSize: "0.875rem",
                        animation:
                          allMetaData.data.subscriptionInfo.daysRemaining < 15
                            ? "pulseRed 2s infinite"
                            : allMetaData.data.subscriptionInfo.daysRemaining <
                              60
                              ? "pulseAmber 2s infinite"
                              : "pulseGreen 2s infinite",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                      }}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    title="Your subscription has expired. Please renew to continue."
                    arrow
                  >
                    <Chip
                      label="Subscription Expired"
                      color="error"
                      sx={{
                        backgroundColor: "#b71c1c",
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: "8px",
                        px: 1.5,
                        py: 0.5,
                        fontSize: "0.875rem",
                        animation: "shake 0.6s ease-in-out infinite",
                        boxShadow: "0 0 12px rgba(244,67,54,0.6)",
                      }}
                    />
                  </Tooltip>
                )}
              </>
            )}

            <TopSearchbar />
            <Link to="/dashboard/holiday">
              <FaCalendarDays size={20} className="text-[#fff]" />
            </Link>
            <UserProfile tenantDomain={tenantDomain} />
          </div>
        </div>

        {/* Dropdown menu for small and medium devices */}
        <div
          className={`md:hidden w-full backdrop-blur-md bg-[#42A1DA]/80 transition-all duration-500 ease-in-out overflow-hidden rounded-b-2xl shadow-xl ${menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
          style={{
            boxShadow: menuOpen ? "0 10px 20px rgba(0, 0, 0, 0.15)" : "none",
          }}
        >
          <div className="flex flex-col items-center pt-6 space-y-4">
            <TopSearchbar />
          </div>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="stretch"
            gap={2}
            sx={{
              width: "100%",
              maxWidth: 420,
              mx: "auto",
              p: 2,
            }}
          >
            <Button
              sx={btnStyle}
              onClick={() =>
                window.open("https://trustautosolution.com", "_blank")
              }
            >
              🌐 Visit Website
            </Button>
            <Button sx={btnStyle}>🛒 BD Shop</Button>
            <Button sx={btnStyle}>🌍 Global Shop</Button>
          </Box>

          <div className="flex items-center justify-center py-6 space-x-6 w-full">
            <Link
              to="/dashboard/holiday"
              className="hover:scale-110 transition-transform"
            >
              <FaCalendarDays size={22} className="text-white" />
            </Link>
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBar;
