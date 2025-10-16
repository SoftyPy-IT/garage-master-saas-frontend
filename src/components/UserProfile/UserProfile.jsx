/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useGetAllUserQuery } from "../../redux/api/userApi";
import Loading from "../Loading/Loading";

const UserProfile = ({ tenantDomain }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { data, isLoading } = useGetAllUserQuery({ tenantDomain });

  const handleLogout = () => {
    Cookies.remove("tas-auth");
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initialize
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile button */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={toggleDropdown}
      >
        <img
          src={data?.data[0]?.image || "/images/user.jpg"}
          alt="User"
          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
        />
        <div className="text-white font-medium hidden md:flex items-center">
          <span>Admin</span>
          <HiOutlineChevronDown size={20} className="ml-1" />
        </div>
      </div>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 z-50 ${
            isMobile ? "bottom-14 mb-2" : "mt-2"
          } w-52 origin-top-right rounded-xl shadow-xl bg-white ring-1 ring-black/10 transition-all animate-fade-in`}
        >
          <div className="py-2 px-4 text-sm text-gray-700 space-y-2">
            <Link
              to="/dashboard/profile"
              className="block hover:text-[#42A1DA] transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              👤 My Profile
            </Link>
            <Link
              to="/dashboard/profile-update"
              className="block hover:text-[#42A1DA] transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              ⚙️ Update Info
            </Link>

            <hr className="border-t" />
            <p
              onClick={handleLogout}
              className="cursor-pointer text-red-500 hover:text-red-600 font-semibold"
            >
              🚪 Logout
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
