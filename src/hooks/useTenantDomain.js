
import { useState } from "react";

export function getTenantDomain(hostname) {
  if (!hostname) return "";

  if (hostname.includes("localhost")) {
    const hostWithoutPort = hostname.split(":")[0];
    const parts = hostWithoutPort.split(".");
    return parts.slice(0, parts.length - 1).join(".");
  }

  return hostname;
}

export function useTenantDomain() {
  const [tenantDomain] = useState(() => {
    if (typeof window !== "undefined") {
      return getTenantDomain(window.location.hostname);
    }
    return "";
  });

  return { tenantDomain };
};
