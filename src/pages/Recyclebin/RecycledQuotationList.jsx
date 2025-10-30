/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { FaTrashAlt, FaEdit, FaEye, FaFileInvoice } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Loading from "../../components/Loading/Loading";
import { Pagination } from "@mui/material";
import {
  useGetAllQuotationsQuery,
  usePermanantlyDeleteQuotationMutation,
  useRestoreFromRecycledQuotationMutation,
} from "../../redux/api/quotation";
import { useAppOptions } from "../../hooks/useAppOptions";
import QuotationTable from "../Quotation/QuotationTable";
const RecycledQuotationList = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const textInputRef = useRef(null);
  const navigate = useNavigate();
  const limit = 10;
  const { tenantDomain } = useAppOptions();
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

  useEffect(() => {
    if (search) {
      setFilterType(search);
    }
  }, [search]);
  const isRecycled = true;
  return (
    <div>
      <QuotationTable
        handleDeleteOrRestore={handleDeleteOrRestore}
        isRecycled={isRecycled}
        title="Recycle Quotation List "
      />
    </div>
  );
};

export default RecycledQuotationList;
