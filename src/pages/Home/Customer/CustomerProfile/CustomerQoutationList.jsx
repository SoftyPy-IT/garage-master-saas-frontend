/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useRef, useState } from "react";
import {
  FaTrashAlt,
  FaEdit,
  FaEye,
  FaFileInvoiceDollar,
  FaDownload,
  FaFileInvoice,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Loading from "../../../../components/Loading/Loading";
import {
  useGetAllQuotationsQuery,
  useMoveRecycledQuotationMutation,
} from "../../../../redux/api/quotation";
import { Pagination, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { HiOutlinePlus } from "react-icons/hi";
const CustomerQoutationList = ({ id, customerId, user_type, tenantDomain, companyProfileData }) => {
  const [filterType, setFilterType] = useState("");

  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const textInputRef = useRef(null);

  const handleIconPreview = async (e) => {
    navigate(`/dashboard/quotation-view?id=${e}`);
  };

  const { data: allQuotations, isLoading: quotationLoading } =
    useGetAllQuotationsQuery({
      tenantDomain,
      id,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: false,
    });

  const [
    moveRecycledQuotation,
    { idLoading: deleteLoading, error: deleteError },
  ] = useMoveRecycledQuotationMutation();

  const deletePackage = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: " You want to move  this quotation Recycle Bin?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await moveRecycledQuotation({ tenantDomain, id }).unwrap();
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

  if (deleteError) {
    toast.error(deleteError?.message);
  }

  return (
    <div className=" mb-24 mt-10 w-full">
      <button className="bg-blue-500 items-center hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition duration-300">
        <Link className="flex gap-x-2 " to={`/dashboard/create-quotation?id=${id}`}>
          Create Quotation <HiOutlinePlus size={20} />
        </Link>
      </button>

      <div className=" flex items-center justify-end mb-5  py-5 md:px-3">
        <div className="flex items-center searcList">
          <div className="searchGroup">
            <input
              onChange={(e) => setFilterType(e.target.value)}
              type="text"
              placeholder="Search"
              className="border py-2 px-3 rounded-md border-[#ddd]"
              ref={textInputRef}
            />
          </div>
          <button className="SearchBtn ">Search </button>
        </div>
      </div>
      <div className="w-full mt-5 mb-24">
        {quotationLoading ? (
          <div className="flex items-center justify-center text-xl">
            <Loading />
          </div>
        ) : (
          <div>
            {allQuotations?.data?.quotations?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg shadow-lg overflow-hidden">
                <FaFileInvoiceDollar className="text-6xl text-blue-500 mb-4" />
                <h2 className="text-3xl font-bold text-blue-800 mb-4">
                  No Quotations Found
                </h2>
                <p className="text-xl text-gray-600 mb-6 max-w-md">
                  Start creating quotations to streamline your garage's pricing
                  process.
                </p>
                <Link
                  to={`/dashboard/create-quotation?id=${id}`}
                  className="group relative inline-flex items-center overflow-hidden rounded-full bg-blue-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-blue-500 hover:bg-blue-700 transition duration-300"
                >
                  <span className="absolute right-0 translate-x-full transition-transform group-hover:-translate-x-4">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                  <span className="text-sm font-medium transition-all group-hover:mr-4">
                    Create Your First Quotation
                  </span>
                </Link>
              </div>
            ) : (
              <section className="tableContainer overflow-x-auto">
                <table className="customTable">
                  <thead>
                    <tr>
                      <th>SL No </th>
                      <th>Order No. </th>
                      <th>Name</th>

                      <th>Car No. </th>
                      <th>Mobile No.</th>
                      <th>Date</th>
                      <th colSpan={5}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allQuotations?.data?.quotations?.map((card, index) => {
                      const globalIndex =
                        (allQuotations?.data?.meta?.currentPage - 1) * limit +
                        (index + 1);
                      let rowClass = "";
                      if (card.status === "running") {
                        rowClass = "bg-[#f5365c] text-white";
                      } else if (card.status === "completed") {
                        rowClass = "bg-[#2dce89] text-white";
                      }

                      return (
                        <tr
                          key={card._id}
                          className={`${rowClass} hover:bg-blue-400 transition-colors duration-200 hover:text-white`}
                        >
                          <td>{globalIndex}</td>
                          <td>{card.job_no}</td>

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
                            <Tooltip title="Preview" arrow placement="top">
                              <div
                                onClick={() => handleIconPreview(card._id)}
                                className="editIconWrap edit2 cursor-pointer"
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
                            <Tooltip title="Create Invoice" arrow placement="top">
                              <a
                                className="flex flex-col items-center edit2"
                                href={`/dashboard/create-invoice?order_no=${card?.job_no}&id=${card._id}`}
                                rel="noreferrer"
                              >
                                <FaFileInvoice className="editIcon text-purple-600" />
                              </a>
                            </Tooltip>
                          </td>

                          <td>
                            <Tooltip
                              title="Download Quotation"
                              arrow
                              placement="top"
                            >
                              <a
                                className="flex flex-col items-center edit2"
                                href={`${import.meta.env.VITE_API_URL
                                  }/quotations/quotation/${card._id}?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
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
                            <Tooltip
                              title="Edit Quotation"
                              arrow
                              placement="top"
                            >
                              <div className="flex flex-col items-center edit">
                                <Link
                                  to={`/dashboard/update-quotation?id=${card._id}&user_type=${user_type}&user=${id}`}
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
                                  : "Delete Quotation"
                              }
                              arrow
                              placement="top"
                            >
                              <button
                                disabled={deleteLoading}
                                onClick={() => deletePackage(card._id)}
                                className="editIconWrap cursor-pointer"
                                style={{

                                  background: "white",
                                  border: "none",
                                  padding: 5,
                                  borderRadius: "9999px"
                                }}
                                aria-label="Delete Quotation"
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

        {allQuotations?.data?.quotations?.length > 0 && (
          <div className="flex justify-center mt-4">
            <Pagination
              count={allQuotations?.data?.meta?.totalPages}
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

export default CustomerQoutationList;
