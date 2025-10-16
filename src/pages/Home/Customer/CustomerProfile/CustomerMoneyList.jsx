/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Pagination } from "@mui/material";
import { useRef, useState } from "react";
import {
  FaTrashAlt,
  FaEdit,
  FaEye,
  FaMoneyBillWave,
  FaDownload,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import Loading from "../../../../components/Loading/Loading";
import {
  useGetAllMoneyReceiptsQuery,
  useMoveRecycledMoneyReceiptMutation,
} from "../../../../redux/api/money-receipt";
const CustomerMoneyList = ({ id, user_type, tenantDomain, companyProfileData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");

  const navigate = useNavigate();
  const textInputRef = useRef(null);
  const limit = 10;

  const { data: allMoneyReceipts, isLoading: moneyReceiptLoading } =
    useGetAllMoneyReceiptsQuery({
      tenantDomain,
      id,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: false,
    });

  const [
    moveRecycledMoneyReceipt,
    { isLoading: deleteLoading, error: deleteError },
  ] = useMoveRecycledMoneyReceiptMutation();

  const handleIconPreview = async (e) => {
    navigate(`/dashboard/money-receipt-view?id=${e}`);
  };

  const handleMoveRecycledbin = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: " You want to move  this Money Receipt Recycle Bin?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await moveRecycledMoneyReceipt({ tenantDomain, id }).unwrap();
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

  const handleAllMoneyReceipt = () => {
    setFilterType("");
    if (textInputRef.current) {
      textInputRef.current.value = "";
    }
  };

  if (moneyReceiptLoading) {
    return <Loading />;
  }

  if (deleteError) {
    toast.error(deleteError?.message);
  }

  return (
    <div className=" mb-24 mt-10 w-full">
      <div className="flex items-center justify-end mb-5 bg-[#F1F3F6] py-5 px-3">
        <div className="flex items-center searcList">
          <div className="searchGroup">
            <input
              onChange={(e) => setFilterType(e.target.value)}
              autoComplete="off"
              type="text"
              ref={textInputRef}
              placeholder="Write here..."
            />
          </div>
          <button className="SearchBtn ">Search </button>
        </div>
      </div>
      {allMoneyReceipts?.data?.moneyReceipts?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center p-4 bg-gray-100 rounded-lg">
          <FaMoneyBillWave className="text-6xl text-green-500 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            No Money Receipts Found
          </h3>
          <p className="text-gray-600 mb-4">
            Start by adding your first money receipt to keep track of payments.
          </p>
          <Link
            to={`/dashboard/money-receive-create?id=${id}`}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition duration-300 flex items-center"
          >
            <FaMoneyBillWave className="mr-2" />
            Create Your First Money Receipt
          </Link>
        </div>
      ) : (
        <section className="tableContainer overflow-x-auto">
          <table className="customTable">
            <thead>
              <tr>
                <th>SL No</th>
                <th>Received with thanks from</th>
                <th>Final Payment against bill no</th>
                <th>Total Amount </th>
                <th>Advance Amount </th>

                <th>Due amount</th>
                <th>Date</th>
                <th colSpan={4}>Action</th>
              </tr>
            </thead>
            <tbody>
              {allMoneyReceipts?.data?.moneyReceipts?.map((card, index) => {
                const globalIndex =
                  (allMoneyReceipts?.data?.meta?.currentPage - 1) * limit +
                  (index + 1);
                let rowClass = "";
                if (card.remaining === 0) {
                  rowClass = "bg-[#2dce89] text-white";
                } else if (card.remaining === card.total_amount) {
                  rowClass = "bg-[#f5365c] text-white";
                } else {
                  rowClass = "bg-[#ffad46] text-black";
                }
                return (
                  <tr
                    key={card._id}
                    className={`${card.paymentColor === "#2dce89"
                        ? "bg-[#2dce89] text-white"
                        : card.paymentColor === "#f5365c"
                          ? "bg-[#f5365c] text-white"
                          : card.paymentColor === "#ffad46"
                            ? "bg-[#ffad46] text-black"
                            : ""
                      } transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-100 hover:text-black`}
                  >
                    <td>{globalIndex}</td>
                    <td>{card.thanks_from}</td>
                    <td>{card.job_no}</td>
                    <td>{card.total_amount}</td>
                    <td>{card.advance}</td>

                    <td> {card.remaining} </td>
                    <td>{card.date}</td>
                    <td>
                      <div
                        onClick={() => handleIconPreview(card._id)}
                        className="flex flex-col items-center edit2"
                      >
                        <FaEye className="editIcon" />
                      </div>
                    </td>
                    <td>
                      <a
                        className="flex flex-col items-center edit2"
                        href={`${import.meta.env.VITE_API_URL
                          }/money-receipts/money/${card._id}?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
                            JSON.stringify(companyProfileData)
                          )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaDownload className="editIcon text-yellow-300" />
                      </a>
                    </td>

                    <td>
                      <div className="flex flex-col items-center edit">
                        <Link
                          to={`/dashboard/money-receipt-update?id=${card._id}&user_type=${user_type}&user=${id}`}
                        >
                          <FaEdit className="editIcon text-blue-500" />
                        </Link>
                      </div>
                    </td>
                    <td>
                      <button
                        disabled={deleteLoading}
                        onClick={() => handleMoveRecycledbin(card._id)}
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
          {allMoneyReceipts?.data?.moneyReceipts?.length > 0 && (
            <div className="flex justify-center mt-4">
              <Pagination
                count={allMoneyReceipts?.data?.meta?.totalPages}
                page={currentPage}
                color="primary"
                onChange={(_, page) => setCurrentPage(page)}
              />
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default CustomerMoneyList;
