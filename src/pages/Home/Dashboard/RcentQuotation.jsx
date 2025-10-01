import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useGetAllQuotationsQuery } from "../../../redux/api/quotation";
import Loading from "../../../components/Loading/Loading";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

const RcentQuotation = () => {
    const tenantDomain = useTenantDomain();
  
  const { data, error, isLoading } = useGetAllQuotationsQuery({
    tenantDomain, 
    limit: 5,
    page: 1,
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;



  return (
    <>
      <div className="recentCard overflow-x-auto ">
        <div className="flex items-center justify-between">
          <h3 className="m-3 text-xl block font-semibold">Recent Quotation </h3>
          <Link to="/dashboard/quotation-list">
            <button className=" flex items-center mr-2  rounded-full px-3 py-1 bg-[#DDDDDD]">
              <small className="">See More</small>
              <HiOutlineArrowNarrowRight size={15} className="ml-1" />
            </button>
          </Link>
        </div>

        <hr />
        <table className="min-w-full">
          <thead>
            <th>Quotation ID</th>
            <th>Quotation No </th>
            <th>Job No</th>
            <th> Date</th>
            <th>Total Amount </th>
            <th>Net Total </th>
          </thead>
          <tbody>
            {data?.data?.quotations.slice(0, 5).map((quotation, i) => (
              <tr key={i}>
                <td>{quotation.Id}</td>
                <td>{quotation.quotation_no}</td>
                <td>{quotation.job_no}</td>
                <td>{quotation.date}</td>
                <td>${quotation.total_amount}</td>
                <td>${quotation.net_total}</td>
                {/* <td>
                  <button className="px-3 py-1 border rounded-full bg-[#FDE2E7] text-red-500">
                    Unpaid
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RcentQuotation;
