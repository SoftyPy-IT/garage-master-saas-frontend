/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  FaTrashAlt,
  FaEdit,
  FaEye,
  FaFileInvoiceDollar,
  FaDownload,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import swal from "sweetalert";
import Loading from "../../../../components/Loading/Loading";
import {
  useGetAllInvoicesQuery,
  useMoveRecycledInvoiceMutation,
} from "../../../../redux/api/invoice";
import { Pagination, Tooltip } from "@mui/material";
import { AddCircleOutline, Money } from "@mui/icons-material";
import { HiOutlinePlus } from "react-icons/hi";
import { getRowClass } from "../../../../utils/getRowClass";
const CustomerInvoiceList = ({
  id,
  user_type,
  tenantDomain,
  companyProfileData,
}) => {
  const [filterType, setFilterType] = useState("");

  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const textInputRef = useRef(null);

  const handleIconPreview = async (e) => {
    navigate(`/dashboard/detail?id=${e}`);
  };

  const [
    moveRecycledInvoice,
    { isLoading: deleteLoading, error: deleteError },
  ] = useMoveRecycledInvoiceMutation();

  const { data: allInvoices, isLoading: invoiceLoading } =
    useGetAllInvoicesQuery({
      tenantDomain,
      id,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: false,
    });
  const handleMoveToRecycledbin = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: " You want to move  this invoice Recycle bin?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await moveRecycledInvoice({ tenantDomain, id }).unwrap();
        swal(
          "Move to Recycle bin!",
          "Move to Recycle bin successful.",
          "success"
        );
      } catch (error) {
        swal("Error", "An error occurred while deleting the card.", "error");
      }
    }
  };

  return (
    <div className=" mb-24 mt-10 w-full">
      <button className="bg-blue-500 g items-center hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition duration-300">
        <Link className="flex gap-x-2 " to={`/dashboard/create-invoice?id=${id}`}>
          Create Invoice <HiOutlinePlus size={20} />
        </Link>
      </button>
      <div className=" mt-3 md:mt-0 flex items-center justify-end   md:px-3">
        <div className="flex items-center searcList">
          <div className="searchGroup">
            <input
              onChange={(e) => setFilterType(e.target.value)}
              autoComplete="off"
              type="text"
              ref={textInputRef}
            />
          </div>
          <button className="SearchBtn ">Search </button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        {invoiceLoading ? (
          <div className="flex items-center justify-center text-xl">
            <Loading />
          </div>
        ) : (
          <div>
            {allInvoices?.data?.invoices?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                <FaFileInvoiceDollar className="text-6xl text-blue-500 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  No Invoices Found
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by creating your first invoice to keep track of your
                  transactions.
                </p>
                <Link
                  to={`/dashboard/create-invoice?id=${id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition duration-300 flex items-center"
                >
                  <AddCircleOutline sx={{ marginRight: "8px" }} />
                  Create Your First Invoice
                </Link>
              </div>
            ) : (
              <section className="tableContainer overflow-x-auto">
                <table className="customTable">
                  <thead>
                    <tr>
                      <th>SL No </th>
                      <th>Order No. </th>
                      <th>Customer Name</th>
                      <th>Car No. </th>
                      <th>Mobile No.</th>
                      <th>Date</th>
                      <th colSpan={5}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allInvoices?.data?.invoices?.map((card, index) => {
                      const net_total =
                        card?.net_total === card?.advance
                          ? card?.net_total
                          : card?.due;
                      const globalIndex =
                        (allInvoices?.data?.meta?.currentPage - 1) * limit +
                        (index + 1);

                      const rowClass = getRowClass(card);
                      return (
                        <tr
                          key={card._id}
                          className={`${rowClass} hover:bg-blue-300 transition-colors duration-200 hover:text-white`}
                        >
                          <td>{globalIndex}</td>
                          <td>{card?.job_no}</td>
                          {card?.customer && (
                            <td>{card?.customer?.customer_name}</td>
                          )}
                          {card?.company && (
                            <td>{card?.company?.company_name}</td>
                          )}
                          {card?.showRoom && (
                            <td>{card?.showRoom?.showRoom_name}</td>
                          )}
                          <td>
                            {card?.vehicle?.carReg_no}{" "}
                            {card?.vehicle?.car_registration_no}
                          </td>
                          {card?.customer && (
                            <td>{card?.customer?.fullCustomerNum}</td>
                          )}
                          {card?.company && (
                            <td>{card?.company?.fullCompanyNum}</td>
                          )}
                          {card?.showRoom && (
                            <td>{card?.showRoom?.fullCompanyNum}</td>
                          )}
                          <td>{card.date}</td>
                          <td>
                            <Tooltip
                              title="Money Receipt"
                              arrow
                              placement="top"
                            >
                              <a
                                className="editIconWrap edit2"
                                href={`/dashboard/money-receive-create?order_no=${card.job_no}&id=${card?._id}&net_total=${net_total}`}
                                rel="noreferrer"
                              >
                                <Money className="editIcon" />
                              </a>
                            </Tooltip>
                          </td>

                          <td>
                            <Tooltip
                              title="Preview Invoice"
                              arrow
                              placement="top"
                            >
                              <div
                                onClick={() => handleIconPreview(card._id)}
                                className="flex flex-col items-center edit2 cursor-pointer"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ")
                                    handleIconPreview(card._id);
                                }}
                              >
                                <FaEye className="editIcon" />
                              </div>
                            </Tooltip>
                          </td>

                          <td>
                            <Tooltip
                              title="Download Invoice"
                              arrow
                              placement="top"
                            >
                              <a
                                className="flex flex-col items-center edit2"
                                href={`${import.meta.env.VITE_API_URL
                                  }/invoices/invoice/${card._id
                                  }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
                                    JSON.stringify(companyProfileData)
                                  )}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <FaDownload className="editIcon text-yellow-300" />
                              </a>
                            </Tooltip>
                          </td>

                          <td>
                            <Tooltip title="Edit Invoice" arrow placement="top">
                              <div className="flex flex-col items-center edit">
                                <Link
                                  to={{
                                    pathname: `/dashboard/update-invoice`,
                                    search: `?id=${card._id}&user_type=${user_type}&user=${id}`,
                                    state: { redirectTo: "customer-profile" },
                                  }}
                                >
                                  <FaEdit className="editIcon text-blue-500" />
                                </Link>
                              </div>
                            </Tooltip>
                          </td>

                          <td>
                            <Tooltip
                              title={
                                deleteLoading
                                  ? "Deleting..."
                                  : "Move to Recycle Bin"
                              }
                              arrow
                              placement="top"
                            >
                              <button
                                disabled={deleteLoading}
                                onClick={() =>
                                  handleMoveToRecycledbin(card._id)
                                }
                                className="editIconWrap cursor-pointer"
                                style={{
                                  background: "white",
                                  border: "none",
                                  padding: 5,
                                  borderRadius: "9999px"
                                }}
                                aria-label="Move to Recycle Bin"
                              >
                                <FaTrashAlt className="deleteIcon text-red-500" />
                              </button>
                            </Tooltip>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            )}
          </div>
        )}
        {allInvoices?.data?.invoices?.length > 0 && (
          <div className="flex justify-center mt-4">
            <Pagination
              count={allInvoices?.data?.meta?.totalPages}
              page={currentPage}
              color="primary"
              onChange={(_, page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInvoiceList;
