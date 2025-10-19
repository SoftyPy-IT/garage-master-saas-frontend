/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { FaTrashAlt, FaEdit, FaUserTie } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowForwardIos } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import swal from "sweetalert";
import Loading from "../../../components/Loading/Loading";
import { HiOutlineSearch } from "react-icons/hi";
import { Pagination } from "@mui/material";
import {

  useGetAllCustomersQuery,
  usePermanantlyDeleteCustomerMutation,
  useRestoreFromRecycledCustomerMutation,
} from "../../../redux/api/customerApi";
import { toast } from "react-toastify";
import { useAppOptions } from "../../../hooks/useAppOptions";

const RecycledbinCustomerList = () => {
  const textInputRef = useRef(null);
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");
  const [filterType, setFilterType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const limit = 10;
  const { tenantDomain } = useAppOptions()

  const {

    data: customerData,
    isLoading: customerLoading,
    error: customerError,
    refetch,
  } = useGetAllCustomersQuery({
    tenantDomain,
    limit,
    page: currentPage,
    searchTerm: filterType,
  });

  const [
    permanantlyDeleteCustomer,
    { isLoading: customerDeleteLoading, error: deleteError },
  ] = usePermanantlyDeleteCustomerMutation();
  const [restoreFromRecycledCustomer] = useRestoreFromRecycledCustomerMutation();

  const handleIconPreview = async (e) => {
    navigate(`/dashboard/customer-profile?id=${e}`);
  };
  const handleDeleteOrRestore = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this Customer.",
      icon: "warning",
      buttons: {
        restore: {
          text: "Restore",
          value: "restore",
          visible: true,
          className: "btn-restore",
        },
        delete: {
          text: "Permanently Delete",
          value: "delete",
          visible: true,
          className: "btn-delete",
        },
      },
      className: "custom-swal",
    });

    if (result === "restore") {
      try {
        await restoreFromRecycledCustomer({ tenantDomain, id }).unwrap();
        swal({
          title: "Restored!",
          text: "Customer has been restored successfully.",
          icon: "success",
          button: "OK",
        });
      } catch (error) {
        swal({
          title: "Error",
          text: "An error occurred while restoring the card.",
          icon: "error",
          button: "OK",
        });
      }
    } else if (result === "delete") {
      try {
        await permanantlyDeleteCustomer({ tenantDomain, id }).unwrap();
        swal({
          title: "Deleted!",
          text: "Customer has been permanently deleted.",
          icon: "error",
          button: "OK",
        });
      } catch (error) {
        swal({
          title: "Error",
          text: "An error occurred while deleting the card.",
          icon: "error",
          button: "OK",
        });
      }
    }
  };

  if (deleteError) {
    toast.error(error?.message);
  }

  const handleAllCustomer = () => {
    setFilterType("");
    if (textInputRef.current) {
      textInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (search) {
      setFilterType(search);
    }
  }, [search]);
  const recyclebinCustomerList = customerData?.data?.customers.filter(
    (money) => money.isRecycled === true
  );
  return (
    <div className="w-full mt-5 mb-24">
      <div className="flex flex-wrap items-center justify-between my-3 mb-8">
        <div className="flex items-center justify-center ">
          <FaUserTie className="invoicIcon" />
          <div className="ml-2">
            <h3 className="text-2xl font-bold"> Customer </h3>
            <span>
              Customer <ArrowForwardIos sx={{ fontSize: "15px" }} /> Manage
              Customer{" "}
            </span>
          </div>
        </div>
        <div className="mt-2 productHome md:mt-0 ">
          <span>Dashboard / </span>
          <span> Customer List</span>
        </div>
      </div>
      <div className="flex-wrap flex items-center justify-between mb-5 bg-[#F1F3F6] py-5 px-3">
        <h3 className="mb-3 text-3xl font-bold"> Customer List:</h3>
        <div className="flex items-center">
          <button
            onClick={handleAllCustomer}
            className="bg-[#42A1DA] text-white px-4 py-2 rounded-md mr-1"
          >
            All
          </button>
          <input
            onChange={(e) => setFilterType(e.target.value)}
            type="text"
            placeholder="Search"
            className="border py-2 px-3 rounded-md border-[#ddd]"
            ref={textInputRef}
          />
          <button
            className="bg-[#42A1DA] text-white px-2 py-2 rounded-md ml-1"
            disabled={filterType === ""}
          >
            {" "}
            <HiOutlineSearch size={25} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto ">
        {customerLoading ? (
          <div className="flex items-center justify-center text-xl">
            <Loading />
          </div>
        ) : (
          <div>
            {recyclebinCustomerList?.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xl text-center">
                No matching card found.
              </div>
            ) : (
              <>
                <section>
                  <table className="table">
                    <thead className="tableWrap">
                      <tr>
                        <th>SL No </th>
                        <th>Customer ID </th>
                        <th>Customer Name</th>
                        <th>Veichle User Name</th>
                        <th>Car No. </th>
                        <th>Mobile No.</th>
                        <th>Vehicle Name </th>
                        <th colSpan={3}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recyclebinCustomerList?.map((card, index) => {
                        const lastVehicle = card?.vehicles
                          ? [...card.vehicles].sort(
                            (a, b) =>
                              new Date(b.createdAt) - new Date(a.createdAt)
                          )[0]
                          : null;

                        const globalIndex =
                          (customerData?.data?.meta?.currentPage - 1) * limit +
                          (index + 1);
                        return (
                          <tr key={card?._id} >
                            <td>{globalIndex}</td>
                            <td>{card?.customerId}</td>
                            <td>{card?.customer_name}</td>
                            <td>{card?.vehicle_username}</td>
                            <td>{lastVehicle?.fullRegNum}</td>
                            <td>{card?.fullCustomerNum}</td>

                            <td>{lastVehicle?.vehicle_name}</td>

                            <td>
                              <div
                                onClick={() => handleIconPreview(card?._id)}
                                className="flex items-center justify-center cursor-pointer"
                              >
                                <FaUserTie size={25} className="" />
                              </div>
                            </td>

                            <td>
                              <div className="editIconWrap edit">
                                <Link
                                  to={`/dashboard/update-customer?id=${card?._id}`}
                                >
                                  <FaEdit className="editIcon text-blue-500" />
                                </Link>
                              </div>
                            </td>
                            <td>
                              <div
                                onClick={() => handleDeleteOrRestore(card?._id)}
                                className="editIconWrap"
                              >
                                <FaTrashAlt className="deleteIcon text-red-500" />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </section>
              </>
            )}
          </div>
        )}
      </div>

      {recyclebinCustomerList?.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            count={customerData?.data?.meta?.totalPages}
            page={currentPage}
            color="primary"
            onChange={(_, page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default RecycledbinCustomerList;
