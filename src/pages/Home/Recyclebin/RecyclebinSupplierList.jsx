/* eslint-disable no-unused-vars */
import { FaTrashAlt, FaEdit, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NotificationAdd } from "@mui/icons-material";
import { FaUserGear } from "react-icons/fa6";
import { useRef, useState } from "react";
import swal from "sweetalert";
import {
  useGetAllSuppliersQuery,
  usePermenantlyDeleteSupplierMutation,
  useRestoreFromRecycledSupplierMutation,
} from "../../../redux/api/supplier";
import Loading from "../../../components/Loading/Loading";
import { Pagination } from "@mui/material";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

const RecyclebinSupplierList = () => {
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
const tenantDomain = useTenantDomain();

  const textInputRef = useRef(null);

  const [permenantlyDeleteSupplier, { isLoading: supplierLoading }] =
    usePermenantlyDeleteSupplierMutation();
  const [restoreFromRecycledSupplier] =
    useRestoreFromRecycledSupplierMutation();

  const { data: suppliersData, isLoading: suppliersLoading } =
    useGetAllSuppliersQuery({
      tenantDomain, 
      limit,
      page: currentPage,
      searchTerm: filterType,
    });

  const handleDeleteOrRestore = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this Supplier.",
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
        await restoreFromRecycledSupplier({tenantDomain, id}).unwrap();
        swal({
          title: "Restored!",
          text: "Supplier has been restored successfully.",
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
        await permenantlyDeleteSupplier(id).unwrap();
        swal({
          title: "Deleted!",
          text: "Supplier has been permanently deleted.",
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
  const handleAllSuppliers = () => {
    setFilterType("");
    if (textInputRef.current) {
      textInputRef.current.value = "";
    }
  };

  const recyclebinSupplierList = suppliersData?.data?.suppliers.filter(
    (employee) => employee.isRecycled === true
  );
  return (
    <div className="w-full mt-5 mb-24">
      
      <div className="md:flex items-center justify-between my-3 mb-8">
        <div className="flex items-center justify-center ">
          <FaUsers size={70} className="invoicIcon" />
          <div className="ml-2">
            <h3 className="text-2xl font-bold"> Supplier </h3>
            <span>Manage Supplier </span>
          </div>
        </div>
        <div className="productHome">
          <span>Home / </span>
          <span>Supplier / </span>
          <span> Supplier List </span>
        </div>
      </div>
      <div className="mt-20 overflow-x-auto">
        <div className="md:flex items-center justify-end mb-5">
          <h3 className="mb-3 text-xl md:text-3xl font-bold">
            Suppliers List:
          </h3>
          <div className="flex items-center searcList">
            <button
              onClick={handleAllSuppliers}
              className="bg-[#42A1DA] text-white px-4 py-2 rounded-md mr-1"
            >
              All
            </button>
            <div className="searchGroup">
              <input
                onChange={(e) => setFilterType(e.target.value)}
                autoComplete="off"
                type="text"
                ref={textInputRef}
              />
            </div>
            <button className="SearchBtn ">Search </button>
          </div>
        </div>
        {suppliersLoading ? (
          <div className="flex items-center justify-center text-xl">
            <Loading />
          </div>
        ) : (
          <div>
            {recyclebinSupplierList?.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xl text-center">
                No matching card found.
              </div>
            ) : (
              <section>
                <table className="table">
                  <thead className="tableWrap">
                    <tr>
                      <th>SL</th>
                      <th>Supplier Id </th>
                      <th>Supplier Name </th>
                      <th>Phone Number </th>
                      <th>Email</th>
                      <th colSpan={3}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recyclebinSupplierList?.map((card, index) => {
                      const globalIndex =
                        (currentPage - 1) * limit + (index + 1);
                      return (
                        <tr key={card._id}>
                          <td>{globalIndex}</td>
                          <td>{card?.supplierId}</td>
                          <td>{card?.full_name}</td>
                          <td>{card?.full_Phone_number}</td>
                          <td>{card?.email}</td>

                          <td>
                            <div className="editIconWrap edit">
                              <Link
                                to={`/dashboard/update-Supplier?id=${card._id}`}
                              >
                                <FaEdit className="editIcon text-blue-500" /> 
                              </Link>
                            </div>
                          </td>
                          <td>
                            <button
                              disabled={supplierLoading}
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
        {suppliersData?.data?.suppliers?.length > 0 && (
          <div className="flex justify-center mt-4">
            <Pagination
              count={suppliersData?.data?.meta?.totalPages}
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

export default RecyclebinSupplierList;
