/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { CircularProgressbar } from "react-circular-progressbar";
import { useGetAllEmployeesQuery } from "../../../redux/api/employee";
import Loading from "../../../components/Loading/Loading";
import DashboardLeave from "./DashboardLeave";

const EmployeeStatistics = ({ tenantDomain }) => {
  const {
    data: employeeData,
    isLoading,
  } = useGetAllEmployeesQuery({
    tenantDomain,
    limit: 10,
    page: 1,
  });

  if (isLoading) {
    return <Loading />;
  }

  // total employee calculate
  const totalEmployee = employeeData?.data?.employees?.length;
  const activeEmployees = (employeeData?.data?.employees || []).filter(
    (employee) => employee.status === "Active"
  );
  const activeEmployeeCount = activeEmployees?.length;
  const activeEmployeePercentage =
    totalEmployee > 0 ? (activeEmployeeCount / totalEmployee) * 100 : 0;

  // due salary calculate
  const dueSalary = employeeData?.data?.employees?.reduce(
    (totalDue, employee) => {
      const employeeDue = employee.salary.reduce(
        (sum, salaryEntry) => sum + salaryEntry.due,
        0
      );
      return totalDue + employeeDue;
    },
    0
  );

  // total salary
  const totalSalary = employeeData?.data?.employees?.reduce(
    (totalDue, employee) => {
      const totalSalary = employee.salary.reduce(
        (sum, salaryEntry) => sum + (salaryEntry.salary_amount || 0),
        0
      );
      return totalDue + totalSalary;
    },
    0
  );
  //advance salary calculate

  const advanceSalary = employeeData?.data?.employees?.reduce(
    (totalDue, employee) => {
      const salaryAdvance = employee.salary.reduce(
        (sum, salaryEntry) => sum + salaryEntry.advance,
        0
      );
      return totalDue + salaryAdvance;
    },
    0
  );

  const advanceSalaryPercentage = Math.ceil(
    advanceSalary > 0 ? (advanceSalary / totalSalary) * 100 : 0
  );

  // late employee calculate

  const lateEmployeeCount = employeeData?.data?.employees?.reduce(
    (totalLate, employee) => {
      const lateCount = employee.attendance.reduce((count, attendanceEntry) => {
        return count + (attendanceEntry.late_status ? 1 : 0);
      }, 0);
      return totalLate + lateCount;
    },
    0
  );
  const lateEmployeePercentage =
    totalEmployee > 0 ? (lateEmployeeCount / totalEmployee) * 100 : 0;

  // absent employee calculate
  const AbsentEmployeeCount = employeeData?.data?.employees?.reduce(
    (totalAbsent, employee) => {
      const absentCount = employee.attendance.reduce(
        (count, attendanceEntry) => {
          return count + (attendanceEntry.absent ? 1 : 0);
        },
        0
      );
      return totalAbsent + absentCount;
    },
    0
  );
  const absentEmployeePercentage =
    totalEmployee > 0 ? (AbsentEmployeeCount / totalEmployee) * 100 : 0;

  return (
    <>
      <div className=" xl:flex gap-5  justify-between sectionMargin  mb-10 ">
        <div className="earningCardWrap ">
          <p className="mb-3 font-semibold">Employee Statistic</p>
          <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-3">
            <div className="flex items-center w-50 justify-between  earningCard">
              <div>
                <div style={{ width: 60, height: 60 }}>
                  <CircularProgressbar
                    value={activeEmployeePercentage}
                    text={`${activeEmployeePercentage}%`}
                    styles={{
                      path: {
                        stroke: `#60BE6B`,
                      },

                      text: {
                        fill: "#3e98c7",
                      },

                      trail: {
                        stroke: "#f4f4f4",
                      },
                    }}
                  />
                </div>
                <b className="text-sm">Active Employee </b>
              </div>

              <b>
                {" "}
                {activeEmployeeCount} / {totalEmployee}{" "}
              </b>
            </div>
            <div className="flex items-center w-20 justify-between earningCard">
              <div>
                <div style={{ width: 60, height: 60 }}>
                  <CircularProgressbar
                    value={90}
                    text={`${90}%`}
                    styles={{
                      path: {
                        stroke: `#60BE6B`,
                      },

                      text: {
                        fill: "#3e98c7",
                      },

                      trail: {
                        stroke: "#f4f4f4",
                      },
                    }}
                  />
                </div>
                <b className="text-sm">Total Holiday </b>
              </div>
              <b> 5 / 30 </b>
            </div>
            <div className="flex items-center w-20 justify-between earningCard">
              <div>
                <div style={{ width: 60, height: 60 }}>
                  <CircularProgressbar
                    value={absentEmployeePercentage}
                    text={`${absentEmployeePercentage}%`}
                    styles={{
                      path: {
                        stroke: `#F77F00`,
                      },

                      text: {
                        fill: "#3e98c7",
                      },

                      trail: {
                        stroke: "#f4f4f4",
                      },
                    }}
                  />
                </div>
                <b className="text-sm">Today Leave </b>
              </div>
              <b>
                {" "}
                {AbsentEmployeeCount} / {totalEmployee}
              </b>
            </div>
            <div className="flex items-center w-20 justify-between earningCard">
              <div>
                <div style={{ width: 60, height: 60 }}>
                  <CircularProgressbar
                    value={lateEmployeePercentage}
                    text={`${lateEmployeePercentage}%`}
                    styles={{
                      path: {
                        stroke: `#EF4444`,
                      },

                      text: {
                        fill: "#3e98c7",
                      },

                      trail: {
                        stroke: "#f4f4f4",
                      },
                    }}
                  />
                </div>
                <b className="text-sm ">Today Late </b>
              </div>
              <b>
                {" "}
                {lateEmployeeCount} / {totalEmployee}
              </b>
            </div>
            <div className="flex items-center w-20 justify-between earningCard">
              <div>
                <div style={{ width: 60, height: 60 }}>
                  <CircularProgressbar
                    value={advanceSalaryPercentage}
                    text={`${advanceSalaryPercentage}%`}
                    styles={{
                      path: {
                        stroke: `#60BE6B`,
                      },

                      text: {
                        fill: "#3e98c7",
                      },

                      trail: {
                        stroke: "#f4f4f4",
                      },
                    }}
                  />
                </div>
                <b className="text-sm">Advance Salary </b>
              </div>
              <b className="">৳{advanceSalary}</b>
            </div>
            <div className="flex items-center w-20 justify-between earningCard">
              <div>
                <div style={{ width: 60, height: 60 }}>
                  <CircularProgressbar
                    value={90}
                    text={`${90}%`}
                    styles={{
                      path: {
                        stroke: `#EF4444`,
                      },

                      text: {
                        fill: "#3e98c7",
                      },

                      trail: {
                        stroke: "#f4f4f4",
                      },
                    }}
                  />
                </div>
                <b className="text-sm ">Due Salary </b>
              </div>
              <b className="">৳{dueSalary}</b>
            </div>
          </div>
        </div>
        <div className="earningCardWrap mt-5">
          <p className="mb-3 font-semibold ">Task Statistic </p>
          <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
            <div className="task">
              <p>Total Tasks </p>
              <b>350</b>
            </div>
            <div className="task">
              <p>Overdue Tasks </p>
              <b>350</b>
            </div>
          </div>

          <div className="space-y-5 mt-5">
            <div className="flex items-center justify-between ">
              <div className="flex items-center">
                <HiOutlineCheckCircle className="text-[#60BE6B] mr-1" />
                <span className="font-semibold">Complete Task </span>
              </div>
              <b>455</b>
            </div>
            <div className="flex items-center justify-between ">
              <div className="flex items-center">
                <HiOutlineCheckCircle className="text-[#FFBC34] mr-1" />
                <span className="font-semibold">Inprogress Task </span>
              </div>
              <b>25</b>
            </div>
            <div className="flex items-center justify-between ">
              <div className="flex items-center">
                <HiOutlineCheckCircle className="text-[#EF4444]  mr-1" />
                <span className="font-semibold">Pending Task </span>
              </div>
              <b>25</b>
            </div>
            <div className="flex items-center justify-between ">
              <div className="flex items-center">
                <HiOutlineCheckCircle className="text-[#FFBC34] mr-1" />
                <span className="font-semibold">Review Task </span>
              </div>
              <b>25</b>
            </div>
          </div>
        </div>
        <DashboardLeave />
      </div>
    </>
  );
};

export default EmployeeStatistics;
