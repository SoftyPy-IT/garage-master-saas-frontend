/* eslint-disable react/prop-types */
"use client";

/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import {
  FaTrashAlt,
  FaEdit,
  FaEye,
  FaDownload,
  FaFileInvoice,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Loading from "../../../components/Loading/Loading";
import {
  IconButton,
  Pagination,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  useGetAllQuotationsQuery,
  useMoveRecycledQuotationMutation,
} from "../../../redux/api/quotation";
import { Search } from "lucide-react";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import { useGetCompanyProfileQuery } from "../../../redux/api/companyProfile";

const QuotationTable = ({title}) => {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");

  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const textInputRef = useRef(null);
  const navigate = useNavigate();
  const limit = 10;
  const tenantDomain = useTenantDomain();

  const handleIconPreview = async (e) => {
    navigate(`/dashboard/quotation-view?id=${e}`);
  };
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
  const [
    moveRecycledQuotation,
    { idLoading: deleteLoading, error: deleteError },
  ] = useMoveRecycledQuotationMutation();

  const { data: allQuotations, isLoading: quotationLoading } =
    useGetAllQuotationsQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: false,
    });
  const handleMoveToRecycled = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: " You want to move this quotation to Recycle Bin?",
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

  useEffect(() => {
    if (search) {
      setFilterType(search);
    }
  }, [search]);

  return (
    <Paper
      elevation={2}
      sx={{ px: { xs: 1, md: 2 }, py: 1, mt: { xs: 1, md: 2 } }}
    >
      <div className="md:mt-5">
        <div className="w-full mt-3 md:mt-5 ">
          <div className="mb-6 block md:flex justify-between items-center gap-0 md:gap-1">
            <h2 className="text-xl md:text-2xl font-semibold text-center mb-2">
            {title}
            </h2>
            <div className="flex items-center">
              <TextField
                size="small"
                placeholder="Search quotations"
                variant="outlined"
                inputRef={textInputRef}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton size="small">
                      <Search />
                    </IconButton>
                  ),
                }}
              />
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
                <section className="tableContainer overflow-x-auto ">
                  <table className="customTable">
                    <thead>
                      <tr>
                        <th>SL No </th>
                        <th>Quotation ID </th>
                        <th>Order No. </th>
                        <th>Name</th>
                        <th>Vehicle Name</th>
                        <th>Vehicle Brand</th>
                        <th>Car No. </th>
                        <th>Mobile No.</th>
                        {/* <th>Mileage History</th> */}
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
                        } else{
                          rowClass = "bg-[#2dce89] text-white";
                        }
                        return (
                          <tr
                            key={card._id}
                            className={`${rowClass} transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-100 hover:text-black`}
                          >
                            <td>{globalIndex}</td>
                            <td>{card.quotation_no}</td>
                            <td>{card.job_no}</td>
                            {card?.customer?.customer_name ||
                            card?.company?.company_name ||
                            card?.showRoom?.showRoom_name ? (
                              <>
                                {card?.customer && (
                                  <td>{card?.customer?.customer_name}</td>
                                )}
                                {card?.company && (
                                  <td>{card?.company?.company_name}</td>
                                )}
                                {card?.showRoom && (
                                  <td>{card?.showRoom?.showRoom_name}</td>
                                )}
                              </>
                            ) : (
                              <td></td>
                            )}
                            <td>
                              <span>{card.vehicle?.vehicle_name}</span>
                            </td>

                            <td>
                              <span>{card.vehicle?.vehicle_brand}</span>
                            </td>
                            <td>
                              {card?.vehicle?.carReg_no}{" "}
                              {card?.vehicle?.car_registration_no}
                            </td>
                            {card?.customer?.fullCustomerNum ||
                            card?.company?.fullCompanyNum ||
                            card?.showRoom?.fullCompanyNum ? (
                              <>
                                {card?.customer && (
                                  <td>{card?.customer?.fullCustomerNum}</td>
                                )}
                                {card?.company && (
                                  <td>{card?.company?.fullCompanyNum}</td>
                                )}
                                {card?.showRoom && (
                                  <td>{card?.showRoom?.fullCompanyNum}</td>
                                )}
                              </>
                            ) : (
                              <td></td>
                            )}
                            <td>{card.date}</td>

                            <td>
                              <Tooltip
                                title="View Invoice"
                                arrow
                                placement="top"
                              >
                                <a
                                  className="flex justify-center edit2"
                                  href={`/dashboard/invoice?order_no=${card?.job_no}&id=${card._id}`}
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
                                  href={`${
                                    import.meta.env.VITE_API_URL
                                  }/quotations/quotation/${
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
                              <Tooltip
                                title="Edit Quotation"
                                arrow
                                placement="top"
                              >
                                <div className="flex flex-col items-center edit">
                                  <Link
                                    to={`/dashboard/update-quotation?id=${card._id}`}
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
                                    : "Move to Recycled"
                                }
                                arrow
                                placement="top"
                              >
                                <span>
                                  <button
                                    disabled={deleteLoading}
                                    onClick={() =>
                                      handleMoveToRecycled(card._id)
                                    }
                                    className="editIconWrap rounded-full"
                                    style={{
                                      cursor: deleteLoading
                                        ? "not-allowed"
                                        : "pointer",
                                      background: "white",
                                      border: "none",
                                      padding: 5,
                                      borderRadius: "9999px"
                                    }}
                                  >
                                    <FaTrashAlt className="deleteIcon text-red-500" />
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
              count={allQuotations?.data?.meta?.totalPages}
              page={currentPage}
              color="primary"
              onChange={(_, page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default QuotationTable;
