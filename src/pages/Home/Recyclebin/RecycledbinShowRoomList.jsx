/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { FaTrashAlt, FaEdit, FaUserTie } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import swal from "sweetalert";
import Loading from "../../../components/Loading/Loading";
import { HiOutlineSearch } from "react-icons/hi";
import { toast } from "react-toastify";
import {
  useGetAllShowRoomsQuery,
  usePermanantlyDeleteShowRoomMutation,
  useRestoreFromRecycledShowRoomMutation,
} from "../../../redux/api/showRoomApi";
import { Pagination } from "@mui/material";
import { useAppOptions } from "../../../hooks/useAppOptions";
const RecycledbinShowRoomList = () => {
  const textInputRef = useRef(null);
  const [filterType, setFilterType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const limit = 10;
  const { tenantDomain } = useAppOptions()
  const { data: showRoomData, isLoading: showroomLoading } =
    useGetAllShowRoomsQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
    });

  const [
    permanantlyDeleteShowRoom,
    { isLoading: showroomDeleteLoading, error: deleteError },
  ] = usePermanantlyDeleteShowRoomMutation();
  const [restoreFromRecycledShowRoom] =
    useRestoreFromRecycledShowRoomMutation();

  const handleIconPreview = async (e) => {
    navigate(`/dashboard/show-room-profile?id=${e}`);
  };

  const handleDeleteOrRestore = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this Show Room.",
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
        await restoreFromRecycledShowRoom({
          tenantDomain,
          id,
        }).unwrap();
        swal({
          title: "Restored!",
          text: "Show Room has been restored successfully.",
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
        await permanantlyDeleteShowRoom({ tenantDomain, id }).unwrap();
        swal({
          title: "Deleted!",
          text: "Show Room has been permanently deleted.",
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

  if (deleteError) {
    toast.error(error?.message);
  }

  const handleAllShowRoom = () => {
    setFilterType("");
    if (textInputRef.current) {
      textInputRef.current.value = "";
    }
  };
  const recyclebinShowRoomList = showRoomData?.data?.showrooms.filter(
    (showRoom) => showRoom.isRecycled === true
  );

  return (
    <div className="w-full mt-5 mb-24">

      <div className="flex flex-wrap items-center justify-between my-3 mb-8">
        <div className="flex items-center justify-center ">
          <FaUserTie className="invoicIcon" />
          <div className="ml-2">
            <h3 className="text-2xl font-bold"> Dashboard </h3>
            <span>Show Room List </span>
          </div>
        </div>
        <div className="productHome">
          <span>Dashboard / </span>
          <span>Show Room / </span>
          <span>Show Room List </span>
        </div>
      </div>
      <div className="flex-wrap flex items-center justify-between mb-5 bg-[#F1F3F6] py-5 px-3 ">
        <h3 className="mb-3 text-3xl font-bold"> Show Room List:</h3>
        <div className="flex items-center">
          <button
            onClick={handleAllShowRoom}
            className="mx-6 font-semibold cursor-pointer bg-[#42A1DA] px-2 py-1 rounded-md text-white"
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
          <button className="bg-[#42A1DA] text-white px-2 py-2 rounded-md ml-1">
            {" "}
            <HiOutlineSearch size={25} />
          </button>
        </div>
      </div>

      {showroomLoading ? (
        <div className="flex items-center justify-center text-xl">
          <Loading />
        </div>
      ) : (
        <div>
          {recyclebinShowRoomList?.length === 0 ? (
            <div className="flex items-center justify-center h-full text-xl text-center">
              No matching card found.
            </div>
          ) : (
            <section>
              <table className="table">
                <thead className="tableWrap">
                  <tr>
                    <th>SL No</th>
                    <th>Show Room ID </th>
                    <th>Show Room Name</th>
                    <th>Show Room Customer Name </th>

                    <th>Car Reg No. </th>
                    <th>Mobile No.</th>
                    <th>Vehicle Name </th>
                    <th colSpan={3}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recyclebinShowRoomList?.map((card, index) => {
                    const lastVehicle = card?.vehicles
                      ? [...card.vehicles].sort(
                        (a, b) =>
                          new Date(b.createdAt) - new Date(a.createdAt)
                      )[0]
                      : null;
                    const globalIndex =
                      (recyclebinShowRoomList?.meta?.currentPage - 1) * limit +
                      (index + 1);
                    return (
                      <tr key={card._id}>
                        <td>{globalIndex}</td>
                        <td>{card?.showRoomId}</td>
                        <td>{card?.showRoom_name}</td>
                        <td>{card?.vehicle_username}</td>
                        <td>{lastVehicle?.fullRegNum}</td>
                        <td> {card?.fullCompanyNum} </td>
                        <td>{lastVehicle?.vehicle_name}</td>
                        <td>
                          <div
                            onClick={() => handleIconPreview(card._id)}
                            className="flex items-center justify-center cursor-pointer"
                          >
                            <FaUserTie size={25} className="" />
                          </div>
                        </td>

                        <td>
                          <div className="editIconWrap edit">
                            <Link
                              to={`/dashboard/update-show-room?id=${card._id}`}
                            >
                              <FaEdit className="editIcon text-blue-500" />
                            </Link>
                          </div>
                        </td>
                        <td>
                          <button
                            disabled={showroomDeleteLoading}
                            onClick={() => handleDeleteOrRestore(card._id)}
                            className="editIconWrap"
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
      {recyclebinShowRoomList?.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            count={showRoomData?.meta?.totalPages}
            page={currentPage}
            color="primary"
            onChange={(_, page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default RecycledbinShowRoomList;
