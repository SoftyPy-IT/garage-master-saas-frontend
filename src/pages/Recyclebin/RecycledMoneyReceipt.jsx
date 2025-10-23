import { useEffect, useRef, useState } from "react";
import { FaTrashAlt, FaEdit, FaEye, FaFileInvoice } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import {
  useGetAllMoneyReceiptsQuery,
  usePermanantlyDeleteMoneyReceiptMutation,
  useRestoreFromRecycledMoneyReceiptMutation,
} from "../../redux/api/money-receipt";
import { Pagination } from "@mui/material";
import Loading from "../../components/Loading/Loading";
import { ArrowForwardIos } from "@mui/icons-material";
import { useAppOptions } from "../../hooks/useAppOptions";

const RecycledMoneyReceipt = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const limit = 10;
  const navigate = useNavigate();
  const textInputRef = useRef(null);
  const { tenantDomain } = useAppOptions();

  useEffect(() => {
    if (search) {
      setFilterType(search);
    }
  }, [search]);

  const { data: allMoneyReceipts, isLoading: moneyReceiptLoading } =
    useGetAllMoneyReceiptsQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: true,
    });

  const [
    permanantlyDeleteMoneyReceipt,
    { isLoading: deleteLoading, error: deleteError },
  ] = usePermanantlyDeleteMoneyReceiptMutation();
  const [restoreFromRecycledMoneyReceipt] =
    useRestoreFromRecycledMoneyReceiptMutation();

  const handleIconPreview = async (e) => {
    navigate(`/dashboard/money-receipt-view?id=${e}`);
  };

  const handleDeleteOrRestore = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this Money Receipt.",
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
        await restoreFromRecycledMoneyReceipt({ tenantDomain, id }).unwrap();
        swal({
          title: "Restored!",
          text: "Money Receipt has been restored successfully.",
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
        await permanantlyDeleteMoneyReceipt({ tenantDomain, id }).unwrap();
        swal({
          title: "Deleted!",
          text: "Money Receipt has been permanently deleted.",
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
  const handleAllMoneyReceipt = () => {
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

  if (moneyReceiptLoading) {
    return <Loading />;
  }

  if (deleteError) {
    toast.error(deleteError?.message);
  }

  return (
    <div className="mt-5 overflow-x-auto">
      <div className="flex items-center justify-between mt-5 mb-8">
        <div className="flex  items-center justify-center">
          <FaFileInvoice className="invoicIcon" />
          <div className="ml-2">
            <h3 className="text-sm font-bold md:text-2xl">Money Receipt</h3>
            <span>
              Money Receipt <ArrowForwardIos sx={{ fontSize: "15px" }} /> Manage
              Money Receipt
            </span>
          </div>
        </div>
        <div className="productHome">
          <span>Home / </span>
          <span>Money / </span>
          <span>Money receipt</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-5 bg-[#F1F3F6] py-5 px-3">
        <h3 className="mb-3 text-xl font-bold md:text-3xl">
          Receycled Bin Money Receipt List:
        </h3>
        <div className="flex items-center searcList">
          <div className="searchGroup">
            <button onClick={handleAllMoneyReceipt} className="SearchBtn mr-2">
              All{" "}
            </button>
            <input
              onChange={(e) => setFilterType(e.target.value)}
              autoComplete="off"
              type="text"
              ref={textInputRef}
              placeholder="Write here..."
            />
          </div>
          <button className="SearchBtn">Search</button>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          overflowX: "auto",
          borderRadius: "12px",
          background: "white",
        }}
      >
        <table className="table">
          <thead className="tableWrap">
            <tr>
              <th>SL No</th>
              <th>Received with thanks from</th>
              <th>Final Payment against bill no</th>
              <th>Total Amount</th>
              <th>Advance Service Bill</th>
              <th>Due Service Bill</th>
              <th>Date</th>
              <th colSpan={4}>Action</th>
            </tr>
          </thead>
          <tbody>
            {allMoneyReceipts?.data?.moneyReceipts?.map((card, index) => {
              const serialNumber = (currentPage - 1) * limit + index + 1;

              let rowClass = "";
              if (card.remaining === 0) {
                rowClass = "bg-[#2dce89] text-white";
              } else if (card.remaining === card.total_amount) {
                rowClass = "bg-[#f5365c] text-white";
              } else {
                rowClass = "bg-[#ffad46] text-black";
              }
              return (
                <tr key={card._id} className={rowClass}>
                  <td>{serialNumber}</td>
                  <td>{card.thanks_from}</td>
                  <td>{card.job_no}</td>
                  <td>{card.total_amount}</td>
                  <td>{card.advance || 0}</td>
                  <td>{card.remaining}</td>
                  <td>
                    {card.default_date !== "NaN-NaN-NaN"
                      ? card.default_date
                      : card.check_date}
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
                    <a
                      className="bg-[#42A0D9] text-white px-3 py-2 text-[12px] rounded-full mr-2"
                      href={`${import.meta.env.VITE_API_URL
                        }/money-receipts/money/${card._id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download
                    </a>
                  </td>
                  <td>
                    <div className="editIconWrap edit">
                      <Link
                        to={`/dashboard/money-receipt-update?id=${card._id}`}
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
                        cursor: deleteLoading ? "not-allowed" : "pointer",
                        background: "white",
                        border: "none",
                        padding: 5,
                        borderRadius: "9999px",
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
        <div className="flex justify-center mt-4">
          <Pagination
            count={allMoneyReceipts?.data?.meta?.totalPages}
            page={currentPage}
            color="primary"
            onChange={(_, page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default RecycledMoneyReceipt;
