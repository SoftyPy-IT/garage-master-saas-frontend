import { FaDownload } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { FaTrashAlt, FaEdit, FaEye } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import {
  useDueAllMoneyReceiptsQuery,
  useMoveRecycledMoneyReceiptMutation,
} from "../../../redux/api/money-receipt";
import { Pagination } from "@mui/material";
import Loading from "../../../components/Loading/Loading";
import { ArrowForwardIos } from "@mui/icons-material";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import { useGetCompanyProfileQuery } from "../../../redux/api/companyProfile";

const DuemoneyReceiptList = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const limit = 10;
  const navigate = useNavigate();
  const textInputRef = useRef(null);
  const tenantDomain = useTenantDomain();
  const [moveRecycledMoneyReceipt, { isLoading: deleteLoading }] =
    useMoveRecycledMoneyReceiptMutation();

  useEffect(() => {
    if (search) {
      setFilterType(search);
    }
  }, [search]);

  const { data: allMoneyReceipts, isLoading: moneyReceiptLoading } =
    useDueAllMoneyReceiptsQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: false,
    });

  const { data: CompanyInfoData } = useGetCompanyProfileQuery({
    tenantDomain,
  });

  const companyProfileData = {
    companyName: CompanyInfoData?.data?.companyName,
    address: CompanyInfoData?.data?.address,
    website: CompanyInfoData?.data?.website,
    phone: CompanyInfoData?.data?.phone,
    email: CompanyInfoData?.data?.email,
    logo: CompanyInfoData?.data?.logo[0],
    companyNameBN: CompanyInfoData?.data?.companyNameBN,
  };
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

  return (
    <div className="mt-5 overflow-x-auto">
      <div className="flex items-center justify-between mt-5 mb-8">
        <div className="flex flex-wrap items-center justify-center">
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
      <div className="mt-5 overflow-x-auto">
        <div className="flex-wrap flex items-center justify-between mb-5 bg-[#F1F3F6] py-5 px-3">
          <h3 className="mb-3 text-xl font-bold md:text-3xl">
            Money Receipt Due List:
          </h3>
          <div className="flex items-center searcList">
            <div className="searchGroup">
              <button
                onClick={handleAllMoneyReceipt}
                className="SearchBtn mr-2"
              >
                All{" "}
              </button>
              <input
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                autoComplete="off"
                type="text"
                ref={textInputRef}
                placeholder="Write here..."
              />
            </div>
            <button className="SearchBtn">Search</button>
          </div>
        </div>

        <div>
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
                        className="flex flex-col items-center edit2"
                      >
                        <FaEye className="editIcon" />
                      </div>
                    </td>
                    <td>
                      <a
                        className="flex flex-col items-center edit2"
                        href={`${
                          import.meta.env.VITE_API_URL
                        }/money-receipts/money/${
                          card._id
                        }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
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
                          to={`/dashboard/money-receipt-update?id=${card._id}`}
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
        </div>
      </div>
    </div>
  );
};

export default DuemoneyReceiptList;
