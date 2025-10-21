/* eslint-disable react/prop-types */
import { HiOutlineArrowNarrowRight, } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useGetAllCustomersQuery } from "../../../redux/api/customerApi";
import Loading from "../../../components/Loading/Loading";
const RecentClient = ({ tenantDomain }) => {
  const {
    data: customerData,
    error,
    isLoading,
  } = useGetAllCustomersQuery({
    tenantDomain,
    limit: 5,
    page: 1,
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="recentCard overflow-x-auto">
        <div className="flex items-center justify-between">
          <h3 className="m-3 text-xl block font-semibold">Client</h3>
          <Link to="/dashboard/customer-list">
            <button className=" flex items-center mr-2  rounded-full px-3 py-1 bg-[#DDDDDD]  ">
              <small className="">See More</small>
              <HiOutlineArrowNarrowRight size={15} className="ml-1" />
            </button>
          </Link>
        </div>
        <hr />
        <table className="min-w-full">
          <thead>
            <th>Customer Id </th>

            <th>Customer Name</th>
            <th>Phone </th>

            <th>Status</th>

          </thead>
          <tbody>
            {customerData?.data?.customers.slice(0, 5).map((customer, i) => (
              <tr key={i}>
                <td>{customer.customerId}</td>

                <td>
                  <div className="flex items-center">

                    <div className="ml-2 text-justify">
                      <h4 className="block">{customer.customer_name}</h4>

                    </div>
                  </div>
                </td>

                <td>{customer.fullCustomerNum}</td>

                <td>
                  <button className="px-3 py-1 border rounded-full ">
                    Active
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RecentClient;
