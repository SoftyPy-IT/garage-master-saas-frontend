import { useState } from "react";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetAllVehiclesQuery } from "../../redux/api/vehicle";

export const Vehicles = () => {
  const [currentPage] = useState(1);
  const [limit] = useState(10);
  const [filterType] = useState("");
  const { tenantDomain } = useTenantDomain();

  const { data: allVehicle } = useGetAllVehiclesQuery({
    tenantDomain,
    limit,
    page: currentPage,
    searchTerm: filterType,
    isRecycled: false,
  });
  console.log("vehicle data this ", allVehicle);
  console.log();
  return <div>Vehicles</div>;
};
