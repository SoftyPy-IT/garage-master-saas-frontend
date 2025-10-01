/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { FaTrashAlt, FaEdit, FaEye, FaFileInvoice } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Loading from "../../../components/Loading/Loading";
import { ArrowForwardIos } from "@mui/icons-material";
import {
  useGetAllJobCardsQuery,
  usePermanantlyDeleteJobCardMutation,
  useRestorfromRecyclebinJobCardMutation,
} from "../../../redux/api/jobCard";
import { Pagination } from "@mui/material";
import { HiOutlineSearch } from "react-icons/hi";
import "./Recyclebin.css";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
const RecyclebinJobcardList = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const textInputRef = useRef(null);
  const navigate = useNavigate();

  const limit = 10;
const tenantDomain = useTenantDomain();

  const { data: allJobCards, isLoading: jobCardLoading } =
    useGetAllJobCardsQuery({
        tenantDomain, 
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: true,
    });

  const [permanentlyDeleteJobCard, { isLoading: deleteLoading }] =
    usePermanantlyDeleteJobCardMutation();
  const [restorefromRecyclebinJobCard, { isLoading: restoreLoading }] =
    useRestorfromRecyclebinJobCardMutation();

  const handleIconPreview = async (e) => {
    navigate(`/dashboard/preview?id=${e}`);
  };

  const handleDeleteOrRestore = async (id) => {

    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this jobcard.",
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
        await restorefromRecyclebinJobCard({ tenantDomain, id }).unwrap();
        swal({
          title: "Restored!",
          text: "Job card has been restored successfully.",
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
        await permanentlyDeleteJobCard({ tenantDomain, id }).unwrap();
        swal({
          title: "Deleted!",
          text: "Job card has been permanently deleted.",
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

  const handleAllAddToJobCard = () => {
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
      <div className="mt-5 overflow-x-auto">
        <div className="flex items-center justify-between my-3 mb-8">
          <div className="flex flex-wrap items-center justify-center ">
            <FaFileInvoice className="invoicIcon" />
            <div className="ml-2">
              <h3 className="text-sm font-bold md:text-2xl"> Job Card </h3>
              <span className="text-sm">
                Job Card <ArrowForwardIos sx={{ fontSize: "15px" }} /> Manage
                Job Card{" "}
              </span>
            </div>
          </div>
          <div className="productHome">
            <span>Home / </span>
            <span>Job Card List </span>
          </div>
        </div>

        <div className="w-full mt-5 mb-24">
          <div className="flex flex-wrap items-center justify-between mb-5">
            <h3 className="txt-center tet-sm ml- sm:ml-0 ont-bold md:text-3xl">
              {" "}
              Job Card List:{" "}
            </h3>
            <div className="flex flex-wrap items-center">
              <button
                onClick={handleAllAddToJobCard}
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
          {jobCardLoading ? (
            <div className="flex items-center justify-center text-xl">
              <Loading />
            </div>
          ) : (
            <div>
              {allJobCards?.data?.jobCards?.length === 0 ? (
                <div className="flex items-center justify-center h-full text-xl text-center">
                  No matching card found.
                </div>
              ) : (
                <section>
                  <table className="table">
                    <thead className="tableWrap">
                      <tr>
                        <th>SL No</th>
                        <th>User Id</th>
                        <th>Order No. </th>
                        <th>User type</th>
                        <th>Mobile No.</th>
                        <th>Date</th>
                        <th colSpan={4}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allJobCards?.data?.jobCards?.map((card, index) => {
                        const globalIndex =
                          (allJobCards?.data?.meta?.currentPage - 1) * limit +
                          (index + 1);
                        return (
                          <tr key={card?._id}>
                            <td>{globalIndex}</td>
                            <td>{card?.Id}</td>
                            <td>{card?.job_no}</td>
                            <td>{card?.user_type}</td>
                            <td>{card?.customer?.fullCustomerNum}</td>
                            <td>{card?.date}</td>
                            <td>
                              <a
                                className="bg-[#42A0D9] text-white px-3 py-2 rounded-full mx-2 "
                                href={`${
                                  import.meta.env.VITE_API_URL
                                }/jobCards/jobcard/${card._id}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Download
                              </a>
                            </td>
                            <td>
                              <div
                                onClick={() => handleIconPreview(card._id)}
                                className="flex items-center justify-center cursor-pointer"
                              >
                                <FaEye className="h-[22px] w-[22px]" />
                              </div>
                            </td>
                            <td>
                              <div className="editIconWrap edit">
                                <Link
                                  to={`/dashboard/update-jobcard?id=${card._id}`}
                                >
                                  <FaEdit className="editIcon text-blue-500" /> 
                                </Link>
                              </div>
                            </td>
                            <td>
                              <button
                                disabled={deleteLoading || restoreLoading}
                                onClick={() => handleDeleteOrRestore(card?._id)}
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
          {allJobCards?.data?.jobCards?.length > 0 && (
            <div className="flex justify-center mt-4">
              <Pagination
                count={allJobCards?.data?.meta?.totalPages}
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

export default RecyclebinJobcardList;
