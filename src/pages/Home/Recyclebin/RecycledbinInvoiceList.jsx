/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { FaTrashAlt, FaEdit, FaEye } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Loading from "../../../components/Loading/Loading";
import {
  useGetAllInvoicesQuery,
  useMoveRecycledInvoiceMutation,
  usePermanantlyDeleteInvoiceMutation,
  useRestoreFromRecycledInvoiceMutation,
} from "../../../redux/api/invoice";
import { Box, Chip, Pagination, Tooltip, Typography } from "@mui/material";
import { History } from "lucide-react";
import { useAppOptions } from "../../../hooks/useAppOptions";

const InvoiceTable = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");
  const [filterType, setFilterType] = useState("");
  const { tenantDomain } = useAppOptions()
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const textInputRef = useRef(null);

  const handleIconPreview = async (e) => {
    navigate(`/dashboard/invoice-view?id=${e}`);
  };

  const [permanantlyDeleteInvoice, { isLoading: deleteLoading }] =
    usePermanantlyDeleteInvoiceMutation();
  const [restoreFromRecycledInvoice] = useRestoreFromRecycledInvoiceMutation();

  const { data: allInvoices, isLoading: invoiceLoading } =
    useGetAllInvoicesQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: true,
    });
  const handleDeleteOrRestore = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this Invoice.",
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
        await restoreFromRecycledInvoice({ tenantDomain, id }).unwrap();
        swal({
          title: "Restored!",
          text: "Invoice has been restored successfully.",
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
        const res = await permanantlyDeleteInvoice({
          tenantDomain,
          id,
        }).unwrap();

        swal({
          title: "Deleted!",
          text: "Invoice has been permanently deleted.",
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

  useEffect(() => {
    if (search) {
      setFilterType(search);
    }
  }, [search]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <div className="mt-5 overflow-x-auto">
      <div className=" overflow-x-auto">
        <div className="flex flex-wrap  items-center justify-end mb-5">
          {/* update */}
          <h3 className="mb-3 text-xl  md:text-3xl font-bold">
            Recycledbin Invoice List:
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
            <button className="SearchBtn ">Search </button>
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
                No matching card found.
              </div>
            ) : (
              <section className="tableContainer overflow-x-auto">
                <table className="customTable">
                  <thead>
                    <tr>
                      <th>SL No </th>
                      <th>Order No. </th>
                      <th>Customer Name</th>
                      <th>Vehicle Name</th>
                      <th>Car Reg Num </th>
                      <th>Vehicle Brand</th>
                      <th>Car No. </th>
                      <th>Mileage History </th>
                      <th>Mobile No.</th>
                      <th>Date</th>
                      <th colSpan={4}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allInvoices?.data?.invoices?.map((card, index) => {
                      const globalIndex =
                        (allInvoices?.data?.meta?.currentPage - 1) * limit +
                        (index + 1);

                      const remaining = card.moneyReceipts?.[0]?.remaining;
                      const totalAmount = card.moneyReceipts?.[0]?.total_amount;
                      const advance = card.moneyReceipts?.[0]?.advance;
                      const noMoney = card.moneyReceipts?.length < 0;

                      let rowClass = "";
                      if (card.moneyReceipts.length === 0) {
                        rowClass = "bg-[#f5365c] text-white";
                      } else if (
                        remaining === 0 &&
                        advance === 0 &&
                        totalAmount === 0
                      ) {
                        rowClass = "bg-[#f5365c] text-white";
                      } else if (advance === totalAmount) {
                        rowClass = "bg-[#2dce89] text-white";
                      } else if (advance !== totalAmount) {
                        rowClass = "bg-[#ffad46] text-white";
                      } else {
                        rowClass = "bg-[#f5365c] text-black";
                      }

                      return (
                        <tr key={card._id} className={rowClass}>
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
                          <td>
                            <span>{card.vehicle?.vehicle_name}</span>
                          </td>

                          <td>
                            <span>{card.vehicle?.fullRegNum}</span>
                          </td>

                          <td>
                            {card.vehicle?.mileageHistory?.length > 0 ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {card.vehicle.mileageHistory.map(
                                  (history, idx) => (
                                    <Tooltip
                                      key={history._id}
                                      title={`Recorded on: ${formatDate(
                                        history.date
                                      )}`}
                                      arrow
                                    >
                                      <Chip
                                        icon={<History size={16} />}
                                        label={`${history.mileage} km`}
                                        size="small"
                                        color={
                                          idx === 0 ? "primary" : "default"
                                        }
                                        variant={
                                          idx === 0 ? "filled" : "outlined"
                                        }
                                        sx={{
                                          fontSize: "0.75rem",
                                          color: "white",
                                          "& .MuiChip-icon": {
                                            marginLeft: "4px",
                                            marginRight: "-4px",
                                            color: "white",
                                          },
                                        }}
                                      />
                                    </Tooltip>
                                  )
                                )}
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ color: "white" }}
                              >
                                No history
                              </Typography>
                            )}
                          </td>

                          <td>{card.date}</td>
                          <td>
                            <a
                              className="bg-[#42A0D9] text-white px-3 py-2 text-[12px]  rounded-full "
                              href={`${import.meta.env.VITE_API_URL
                                }/invoices/invoice/${card._id}`}
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
                                to={`/dashboard/update-invoice?id=${card._id}`}
                              >
                                <FaEdit className="editIcon text-blue-500" />
                              </Link>
                            </div>
                          </td>
                          <td>
                            <button
                              disabled={deleteLoading}
                              onClick={() => handleDeleteOrRestore(card._id)}
                              className=" bg-white  p-1  "
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
                              <FaTrashAlt className="text-[#f5365c] size-[16px]" />
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
