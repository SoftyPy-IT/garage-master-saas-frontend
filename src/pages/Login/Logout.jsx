// import { useTenantLogoutMutation } from "@/redux/api/authApi";
// import { useDispatch } from "react-redux";
// import { logout } from "@/redux/feature/authSlice";
// import { toast } from "react-hot-toast";

// const LogoutButton = () => {
//   const [tenantLogout] = useTenantLogoutMutation();
//   const dispatch = useDispatch();

//   const handleLogout = async () => {
//     try {
//       await tenantLogout().unwrap(); // ✅ Cookie clear করবে server
//       dispatch(logout());
//       toast.success("Logged out successfully!");
//       window.location.href = "/";
//     } catch (err) {
//       toast.error("Logout failed!");
//     }
//   };

//   return <button onClick={handleLogout}>Logout</button>;
// };
