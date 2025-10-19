/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { FaTrashAlt, FaEdit, FaEye, FaFileInvoice } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Loading from "../../../components/Loading/Loading";
import { Pagination } from "@mui/material";
import {
  useGetAllQuotationsQuery,
  usePermanantlyDeleteQuotationMutation,
  useRestoreFromRecycledQuotationMutation,
} from "../../../redux/api/quotation";
import { useAppOptions } from "../../../hooks/useAppOptions";
const RecycledQuotationList = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const textInputRef = useRef(null);
  const navigate = useNavigate();
  const limit = 10;
  const { tenantDomain } = useAppOptions()
  const handleIconPreview = async (e) => {
    navigate(`/dashboard/quotation-view?id=${e}`);
  };

  const [restoreFromRecycledQuotation, { isLoading: deleteLoading }] =
    useRestoreFromRecycledQuotationMutation();
  const [permanantlyDeleteQuotation] = usePermanantlyDeleteQuotationMutation();

  const { data: allQuotations, isLoading: quotationLoading } =
    useGetAllQuotationsQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: true,
    });

  const handleDeleteOrRestore = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this Quotation.",
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
        await restoreFromRecycledQuotation({
          tenantDomain,
          id,
        }).unwrap();
        swal({
          title: "Restored!",
          text: "Quotation has been restored successfully.",
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
        await permanantlyDeleteQuotation({ tenantDomain, id }).unwrap();
        swal({
          title: "Deleted!",
          text: "Quotation has been permanently deleted.",
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

  const handleAllQuotation = () => {
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

  return (
    <div>
      <div className="overflow-x-auto mt-5">


        <div className="flex items-center justify-between my-3 mb-8">
          <div className="flex items-center justify-center ">
            <FaFileInvoice className="invoicIcon" />
            <div className="ml-2">
              <h3 className="text-2xl font-bold"> Quotation </h3>
              <span>Manage Quotation </span>
            </div>
          </div>
          <div className="productHome">
            <span>Dashboard / </span>
            <span>Quotation / </span>
            <span> Quotation List </span>
          </div>
        </div>

        <div className="w-full mt-5 mb-24">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-3xl font-bold text-center ">
              Recycled Bin Quotation List:
            </h3>
            <div className="flex items-center">
              <button
                onClick={handleAllQuotation}
                className="mx-6 font-semibold cursor-pointer bg-[#42A1DA] px-2 py-1 rounded-md text-white"
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
              <button className="SearchBtn ">Search</button>
            </div>
          </div>
          {quotationLoading ? (
            <div className="flex items-center justify-center text-xl">
              <Loading />
            </div>
          ) : (
            <div>
              {allQuotations?.data?.quotations?.length === 0 ? (
                <div className="flex items-center justify-center h-full text-xl text-center">
                  No matching card found.
                </div>
              ) : (
                <section>
                  <table className="table">
                    <thead className="tableWrap">
                      <tr>
                        <th>SL No </th>
                        <th>Order No. </th>
                        <th>Name</th>

                        <th>Car No. </th>
                        <th>Mobile No.</th>
                        <th>Date</th>
                        <th colSpan={4}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allQuotations?.data?.quotations?.map((card, index) => {
                        const globalIndex =
                          (allQuotations?.data?.meta?.currentPage - 1) * limit +
                          (index + 1);
                        return (
                          <tr key={card._id}>
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

                            <td>{card?.vehicle?.fullRegNum}</td>
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
                              <a
                                className="bg-[#42A0D9] text-white px-3 py-2 text-[12px]  rounded-full "
                                href={`${import.meta.env.VITE_API_URL
                                  }/quotations/quotation/${card._id}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Download
                              </a>
                            </td>
                            <td>
                              <div
                                onClick={() => handleIconPreview(card._id)}
                                className="editIconWrap edit2"
                              >
                                <FaEye className="editIcon" />
                              </div>
                            </td>
                            <td>
                              <div className="editIconWrap edit">
                                <Link
                                  to={`/dashboard/update-quotation?id=${card._id}`}
                                >
                                  <FaEdit className="editIcon text-blue-500" />
                                </Link>
                              </div>
                            </td>
                            <td>
                              <button
                                disabled={deleteLoading}
                                onClick={() => handleDeleteOrRestore(card._id)}
                                className="editIconWrap"
                                style={{

                                  background: "white",
                                  border: "none",
                                  padding: 5,
                                  borderRadius: "9999px"
                                }}
                              >
                                <FaTrashAlt className="deleteIcon text-red-500" />
                              </button>
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
    </div>
  );
};

export default RecycledQuotationList;
