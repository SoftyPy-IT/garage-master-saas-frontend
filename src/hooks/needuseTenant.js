// import { useState, useEffect } from "react";

// export function getTenantDomain(hostname) {
//   if (!hostname) return "";
//   if (hostname.includes("localhost")) {
//     const parts = hostname.split(".");
//     return parts.slice(0, parts.length - 1).join(".");
//   }

//   const parts = hostname.split(".");

//   if (parts.length > 2) {
//     return parts[0];
//   }
//   return hostname;
// }

// export function useTenantDomain() {
//   const [tenantDomain, setTenantDomain] = useState("");

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const hostname = window.location.hostname;
//       setTenantDomain(getTenantDomain(hostname));
//     }
//   }, []);

//   return tenantDomain;
// }
