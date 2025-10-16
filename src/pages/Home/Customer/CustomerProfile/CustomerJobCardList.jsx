/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { FaTrashAlt, FaEdit, FaEye, FaDownload } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlinePlus, HiOutlineSearch } from "react-icons/hi";
import { useRef, useState } from "react";
import swal from "sweetalert";
import {
  useGetAllJobCardsQuery,
  useMovetoRecyclebinJobCardMutation,
} from "../../../../redux/api/jobCard";
import { Pagination } from "@mui/material";
import Loading from "../../../../components/Loading/Loading";
import car from "../../../../../src/assets/jobcard/car-repair.png";
import EmptyCustomerData from "../../../../components/EmptyCustomerData/EmptyCustomerData";
const CustomerJobCardList = ({
  id,
  customerId,
  user_type,
  tenantDomain,
  companyProfileData,
}) => {
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const navigate = useNavigate();
  const textInputRef = useRef();
  const handleIconPreview = async (e) => {
    navigate(`/dashboard/preview?id=${e}`);
  };

  const { data: jobCards, isLoading } = useGetAllJobCardsQuery({
    tenantDomain,
    id,
    limit,
    page: currentPage,
    searchTerm: filterType,
    isRecycled: false,
  });

  const [movetoRecyclebinJobCard, { isLoading: deleteLoading }] =
    useMovetoRecyclebinJobCardMutation();

  const deletePackage = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: " You want to move  this jobcard Recycle bin?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await movetoRecyclebinJobCard({ tenantDomain, id }).unwrap();
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

  const handleAllAddToJobCard = () => {
    setFilterType("");
    if (textInputRef.current) {
      textInputRef.current.value = "";
    }
  };

  return (
    <div className=" mb-24 mt-10 w-full">
      <button className="bg-blue-500 items-center hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition duration-300">
        <Link
          className="flex gap-x-2 "
          to={`/dashboard/create-job-card?id=${customerId}&user_type=${user_type}`}
        >
          Create Job Card <HiOutlinePlus size={20} />
        </Link>
      </button>
      <div className="w-full mt-5 mb-24">
        <div className="flex flex-wrap items-center justify-between mb-5">
          <h3 className="txt-center font-bold  md:text-3xl">Job Card List:</h3>
          <div className="flex flex-wrap items-center">
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
        {isLoading ? (
          <div className="flex items-center justify-center text-xl">
            <Loading />
          </div>
        ) : (
          <div>
            {jobCards?.data?.jobCards?.length === 0 ? (
              <EmptyCustomerData
                title="Your Garage Awaits!"
                subtitle="Rev up your productivity! Start by creating your first job card and watch your garage come to life."
                buttonText="Create Your First Job Card"
                link={`/dashboard/create-job-card?id=${customerId}&user_type=${user_type}`}
                image={car}
              />
            ) : (
              <section className="tableContainer overflow-x-auto">
                <table className=" customTable">
                  <thead>
                    <tr>
                      <th>SL No</th>
                      <th>Order No. </th>
                      <th>User Id</th>
                      <th>User type</th>
                      <th>Mobile No.</th>
                      <th>Date</th>
                      <th colSpan={5}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobCards?.data?.jobCards?.map((card, index) => {
                      const globalIndex =
                        (jobCards?.data?.meta?.currentPage - 1) * limit +
                        (index + 1);
                      return (
                        <tr
                          key={card?._id}
                          className="hover:bg-blue-300 transition-colors duration-200 hover:text-white"
                        >
                          <td>{globalIndex}</td>
                          <td>{card?.job_no}</td>

                          <td>{card?.Id}</td>

                          <td>{card?.user_type}</td>
                          {card?.customer && (
                            <td>{card?.customer?.fullCustomerNum}</td>
                          )}
                          {card?.company && (
                            <td>{card?.company?.fullCompanyNum}</td>
                          )}
                          {card?.showRoom && (
                            <td>{card?.showRoom?.fullCompanyNum}</td>
                          )}

                          <td>{card?.date}</td>
                          <td className="text-center">
                            <Link
                              to={`/dashboard/create-quotation?order_no=${card?.job_no}`}
                              className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors group relative"
                            >
                              <span className="relative inline-block">
                                <svg
                                  className="w-6 h-6 transform group-hover:rotate-[-5deg] transition-transform"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </span>
                              {/* Tooltip */}
                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                Create Quotation
                              </span>
                            </Link>
                          </td>

                          <td>
                            <div
                              onClick={() => handleIconPreview(card._id)}
                              className="flex items-center justify-center cursor-pointer group relative"
                            >
                              <FaEye className="h-[22px] w-[22px]" />
                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                Preview
                              </span>
                            </div>
                          </td>

                          <td>
                            <a
                              className="flex flex-col items-center edit2 group relative"
                              href={`${import.meta.env.VITE_API_URL
                                }/jobCards/jobcard/${card._id
                                }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
                                  JSON.stringify(companyProfileData)
                                )}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <FaDownload className="editIcon text-yellow-300" />
                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                Download
                              </span>
                            </a>
                          </td>

                          <td>
                            <div className="flex flex-col items-center edit group relative">
                              <Link
                                to={`/dashboard/update-jobcard?id=${card._id}&user_type=${user_type}&user=${id}`}
                              >
                                <FaEdit className="editIcon text-blue-500" />
                              </Link>
                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                Edit Job Card
                              </span>
                            </div>
                          </td>

                          <td>
                            <button
                              disabled={deleteLoading}
                              onClick={() => deletePackage(card?._id)}
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
        {jobCards?.data?.jobCards?.length > 0 && (
          <div className="flex justify-center mt-4">
            <Pagination
              count={jobCards?.data?.meta?.totalPages}
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

export default CustomerJobCardList;
