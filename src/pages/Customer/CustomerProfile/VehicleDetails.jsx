"use client";

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { FaEye, FaTrashAlt, FaEdit } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { HiOutlinePlus, HiOutlineSearch } from "react-icons/hi";
import AddVehicleModal from "./AddVehicleModal";
import VehicleDetailsModal from "./VehicleDetailsModal";
import { toast } from "react-toastify";
import { Box, Chip, Pagination, Tooltip, Typography } from "@mui/material";
import swal from "sweetalert";
import { useDeleteVehicleMutation, useGetAllVehiclesQuery } from "../../../redux/api/vehicle";
import Loading from "../../../components/Loading/Loading";
import Can from "../../../components/Can";
import { History } from "@mui/icons-material";

const VehicleDetails = ({ id, user_type, tenantDomain, performActionWithPermission }) => {
  const [open, setOpen] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState(false);
  const [getId, setGetId] = useState("");
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [reload, setReload] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleOpen = () => {
    setIsEditing(false);
    setVehicleToEdit(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setVehicleToEdit(null);
  };

  const handVehicleDetailsOpen = (id) => {
    setVehicleDetails(true);
    setGetId(id);
  };

  const handleVehicleDetailsClose = () => setVehicleDetails(false);

  const handleEditOpen = (vehicle) => {
    setVehicleToEdit(vehicle);
    setIsEditing(true);
    setOpen(true);
  };

  const textInputRef = useRef();
  const { data: allVehicle, isLoading } = useGetAllVehiclesQuery({
    tenantDomain,
    id,
    limit,
    page: currentPage,
    searchTerm: filterType,
    isRecycled: false,
  });

  const [deleteVehicle, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteVehicleMutation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const deletePackage = async (vehicleId) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this vehicle?",
      icon: "warning",
      dangerMode: true,
      buttons: ["Cancel", "Delete"],
    });

    if (willDelete) {
      try {
        await deleteVehicle({ tenantDomain, id: vehicleId }).unwrap();
        swal("Deleted!", "Vehicle deleted successfully.", "success");
        setReload(!reload);
      } catch (error) {
        swal("Error", "An error occurred while deleting the vehicle.", "error");
      }
    }
  };

  if (deleteError) {
    toast.error(deleteError?.message);
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full mt-10 mb-24 ">
      <div className="flex-wrap flex items-center justify-between mb-5 py-5 px-3">
        <div className="flex items-center">
          <button
            onClick={handleOpen}
            className="bg-blue-500 flex items-center hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Add New Vehicle <HiOutlinePlus size={20} />
          </button>
        </div>
        <div className="flex items-center mt-3 md:mt-0">
          <input
            type="text"
            placeholder="Search"
            className="border py-2 px-3 rounded-md border-[#ddd]"
            onChange={(e) => setFilterType(e.target.value)}
            ref={textInputRef}
          />
          <button className="bg-[#42A1DA] text-white px-2 py-2 rounded-sm ml-1">
            {" "}
            <HiOutlineSearch size={22} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center text-xl">
          <Loading />
        </div>
      ) : (
        <div>
          {allVehicle?.data?.vehicles?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4 bg-gray-100 rounded-lg">

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Vehicles Found
              </h3>
              <p className="text-gray-600 mb-4">
                There are no vehicles in the system yet. Add a new vehicle to
                get started.
              </p>
              <button
                onClick={handleOpen}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Add New Vehicle
              </button>
            </div>
          ) : (
            <>
              <section className="tableContainer overflow-x-auto">
                <table className="customTable">
                  <thead>
                    <tr>
                      <th>SL No</th>
                      <th>Vehicle Reg No</th>
                      <th>Chassis No</th>
                      <th>Engine & CC</th>
                      <th>Vehicle Name</th>
                      <th>Mileage History</th>
                      <th colSpan={3}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allVehicle?.data?.vehicles?.map((card, index) => {
                      const globalIndex =
                        (allVehicle?.data?.meta?.currentPage - 1) * limit +
                        (index + 1);
                      return (
                        <tr
                          key={card._id}
                          className="hover:bg-blue-300 transition-colors duration-200 hover:text-white"
                        >
                          <td>{globalIndex}</td>
                          <td>
                            {card?.carReg_no} {card?.car_registration_no}
                          </td>
                          <td>{card.chassis_no}</td>
                          <td>{card.engine_no}</td>
                          <td>{card.vehicle_name}</td>

                          {/* Mileage History Column */}
                          <td>
                            {card.mileageHistory &&
                              card.mileageHistory.length > 0 ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                  justifyContent: "center",
                                }}
                              >
                                {card.mileageHistory.map((history, idx) => (
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
                                      color={idx === 0 ? "primary" : "default"}
                                      variant={
                                        idx === card.mileageHistory.length - 1
                                          ? "filled"
                                          : "outlined"
                                      }
                                      sx={{
                                        fontSize: "0.75rem",
                                        "& .MuiChip-icon": {
                                          marginLeft: "4px",
                                          marginRight: "-4px",
                                        },
                                      }}
                                    />
                                  </Tooltip>
                                ))}
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                              >
                                No history
                              </Typography>
                            )}
                          </td>

                          {/* View Button */}
                          <td>
                            <div
                              onClick={() => handVehicleDetailsOpen(card._id)}
                              className="flex justify-center items-center cursor-pointer"
                            >
                              <FaEye className="text-[#42A1DA]" size={24} />
                            </div>
                          </td>

                          {/* Edit Button */}
                          <td>
                            <Can page="/dashboard/update-customer" action="edit">
                              <div
                                onClick={() => handleEditOpen(card)}
                                className="flex justify-center items-center cursor-pointer"
                              >
                                <FaEdit className="text-green-600" size={24} />
                              </div>
                            </Can>
                          </td>

                          {/* Delete Button */}
                          <td>
                            <Can page="/dashboard/add-customer" action="delete">
                              <button
                                disabled={deleteLoading}
                                onClick={() => deletePackage(card._id)}
                                className="flex justify-center items-center cursor-pointer"
                              >
                                <FaTrashAlt className="text-red-600" size={24} />
                              </button>
                            </Can>

                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            </>
          )}
        </div>
      )}

      {allVehicle?.data?.vehicles?.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            count={allVehicle?.data?.meta?.totalPages}
            page={currentPage}
            color="primary"
            onChange={(_, page) => setCurrentPage(page)}
          />
        </div>
      )}

      {open && (
        <AddVehicleModal
          user_type={user_type}
          id={id}
          open={open}
          setOpen={setOpen}
          onClose={handleClose}
          setReload={setReload}
          reload={reload}
          tenantDomain={tenantDomain}
          vehicleData={vehicleToEdit}
          isEditing={isEditing}
          performActionWithPermission={performActionWithPermission}
        />
      )}


      {vehicleDetails && (
        <VehicleDetailsModal
          open={vehicleDetails}
          setOpen={setVehicleDetails}
          tenantDomain={tenantDomain}
          handVehicleDetailsOpen={handVehicleDetailsOpen}
          handleVehicleDetailsClose={handleVehicleDetailsClose}
          performActionWithPermission={performActionWithPermission}
          getId={getId}
          id={id}
        />
      )}
    </div>
  );
};

export default VehicleDetails;
