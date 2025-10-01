/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { FaTrashAlt, FaEdit, FaEye, FaDownload } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Loading from "../../../components/Loading/Loading";
import {
  useGetAllInvoicesQuery,
  useMoveRecycledInvoiceMutation,
} from "../../../redux/api/invoice";
import { Pagination, Tooltip } from "@mui/material";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import { Money } from "@mui/icons-material";
import { getRowClass } from "../../../utils/getRowClass";
import { useGetCompanyProfileQuery } from "../../../redux/api/companyProfile";

const InvoiceTable = ({ title }) => {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");
  const [filterType, setFilterType] = useState("");
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const tenantDomain = useTenantDomain();

  const navigate = useNavigate();
  const textInputRef = useRef(null);

  const handleIconPreview = async (e) => {
    navigate(`/dashboard/detail?id=${e}`);
  };

  const [moveRecycledInvoice, { isLoading: deleteLoading }] =
    useMoveRecycledInvoiceMutation();
  const { data: profileData } = useGetCompanyProfileQuery({
    tenantDomain,
  });

  const companyProfileData = {
    companyName: profileData?.data?.companyName,
    address: profileData?.data?.address,
    website: profileData?.data?.website,
    phone: profileData?.data?.phone,
    email: profileData?.data?.email,
    logo: profileData?.data?.logo[0],
    companyNameBN: profileData?.data?.companyNameBN,
  };
  const { data: allInvoices, isLoading: invoiceLoading } =
    useGetAllInvoicesQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: false,
    });

  const handleMoveToRecycledbin = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "You want to move this invoice to the Recycle Bin?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await moveRecycledInvoice({ tenantDomain, id }).unwrap();
        swal("Moved!", "Invoice moved to Recycle Bin successfully.", "success");
      } catch (error) {
        swal("Error", "An error occurred while deleting the invoice.", "error");
      }
    }
  };

  useEffect(() => {
    if (search) {
      setFilterType(search);
    }
  }, [search]);

  return (
    <div className="mt-5 overflow-x-auto">
      <div className="overflow-x-auto">
        <div className="flex flex-wrap items-center justify-between mb-5">
          <h3 className="mb-3 text-xl md:text-3xl font-bold">
            {title}: {allInvoices?.data?.invoices?.length}
          </h3>
          <div className="flex items-center searcList">
            <div className="searchGroup">
              <input
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                autoComplete="off"
                type="text"
                placeholder="Write here"
                ref={textInputRef}
              />
            </div>
            <button className="SearchBtn">Search</button>
          </div>
        </div>

        {invoiceLoading ? (
          <div className="flex items-center justify-center text-xl">
            <Loading />
          </div>
        ) : (
          <div>
            {allInvoices?.data?.invoices?.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xl text-center">
                No matching invoice found.
              </div>
            ) : (
              <section className="tableContainer overflow-x-auto">
                <table className="customTable">
                  <thead>
                    <tr>
                      <th>SL No</th>
                      <th>Order No.</th>
                      <th>Customer Name</th>
                      <th>Car Reg No</th>
                      <th>Mobile No.</th>
                      <th>Vehicle Brand</th>
                      <th>Vehicle Name</th>
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
                          className={`${rowClass} hover:bg-blue-300 transition-colors duration-200 hover:text-black`}
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
                          <td>
                            <span>{card.vehicle?.vehicle_name}</span>
                          </td>
                          <td>
                            <span>{card.vehicle?.vehicle_name}</span>
                          </td>
                          <td>{card.date}</td>

                          {/* Actions */}
                          <td>
                            <Tooltip
                              title="Money Receipt"
                              arrow
                              placement="top"
                            >
                              <a
                                className="editIconWrap edit2"
                                href={`/dashboard/money-receive?order_no=${card.job_no}&id=${card?._id}&net_total=${net_total}`}
                                rel="noreferrer"
                              >
                                <Money className="editIcon" />
                              </a>
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
                                href={`${
                                  import.meta.env.VITE_API_URL
                                }/invoices/invoice/${
                                  card._id
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
                            <Tooltip title="Preview" arrow placement="top">
                              <div
                                onClick={() => handleIconPreview(card._id)}
                                className="flex flex-col items-center edit2"
                                style={{ cursor: "pointer" }}
                              >
                                <FaEye className="editIcon" />
                              </div>
                            </Tooltip>
                          </td>

                          <td>
                            <Tooltip title="Edit Invoice" arrow placement="top">
                              <div className="flex flex-col items-center edit">
                                <Link
                                  to={`/dashboard/update-invoice?id=${card._id}`}
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
                                  : "Move to Recycled Bin"
                              }
                              arrow
                              placement="top"
                            >
                              <span>
                                <button
                                  disabled={deleteLoading}
                                  onClick={() =>
                                    handleMoveToRecycledbin(card._id)
                                  }
                                  className="bg-white p-1 rounded-sm"
                                 
                                  style={{
                                      cursor: deleteLoading
                                        ? "not-allowed"
                                        : "pointer",
                                      background: "white",
                                      border: "none",
                                      padding: 5,
                                      borderRadius: "9999px",
                                       opacity: deleteLoading ? 0.7 : 1,
                                    }}
                                >
                                  <FaTrashAlt className="text-[#f5365c] size-[16px]" />
                                </button>
                              </span>
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

        <div className="flex justify-center mt-4">
          <Pagination
            count={allInvoices?.data?.meta?.totalPages}
            page={currentPage}
            color="primary"
            onChange={(_, page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
