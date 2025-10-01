/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import { useState } from "react";
import { useGetAllSalaryQuery } from "../../../redux/api/salary";
import EmployeeSalaryForm from "./EmployeeSalaryForm";
import EmployeeSalaryListTable from "./EmployeeSalaryListTable";
import { allMonths } from "../../../utils/month";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

// Constants
const years = [{ value: "Select Year", label: "Select Year" }];
for (let year = 2024; year <= 2030; year++) {
  years.push({ value: String(year), label: String(year) });
}

const initialSelectedOption = allMonths[new Date().getMonth()];

const EmployeeSalary = () => {
    const tenantDomain = useTenantDomain();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState(initialSelectedOption);
  const limit = 100;

  const {
    data: getAllSalary,
    isLoading: salaryLoading,
    refetch,
  } = useGetAllSalaryQuery({
    searchTerm: filterType,
  });
  return (
    <>
      <EmployeeSalaryForm tenantDomain={tenantDomain}/>
      <EmployeeSalaryListTable
      tenantDomain={tenantDomain}
        filterType={filterType}
        setFilterType={setFilterType}
        getAllSalary={getAllSalary}
      />
    </>
  );
};

export default EmployeeSalary;
