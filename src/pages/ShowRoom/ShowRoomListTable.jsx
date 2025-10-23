/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */

import { FaTrashAlt, FaEdit, FaUserTie } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import swal from "sweetalert";
import { Pagination } from "@mui/material";
import { Store } from "@mui/icons-material";
import { HiOutlineSearch } from "react-icons/hi";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetAllShowRoomsQuery, useMoveRecycledShowRoomMutation } from "../../redux/api/showRoomApi";
import Can from "../../components/Can";
import EmptyData from "../../components/EmptyData/EmptyData";
import { usePermissions } from "../../context/PermissionContext";
import Loading from "../../components/Loading/Loading";
const ShowRoomListTable = () => {
  const textInputRef = useRef(null);
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const search = new URLSearchParams(location.search).get("search");
  const { performActionWithPermission } = usePermissions();

  const navigate = useNavigate();
  const limit = 10;
  const { tenantDomain } = useTenantDomain();

  const { data: showRoomData, isLoading: loading } = useGetAllShowRoomsQuery({
    tenantDomain,
    limit,
    page: currentPage,
    searchTerm: filterType,
    isRecycled: false,
  });
  const [moveRecycledShowRoom, { isLoading: showroomDeleteLoading }] =
    useMoveRecycledShowRoomMutation();

  const handleIconPreview = async (id) => {
    performActionWithPermission(
      "/dashboard/show-room-list",
      "view",
      () => {
        navigate(`/dashboard/show-room-profile?id=${id}`);
      },
      "You don't have permission to view show room details."
    );
  };

  const handleMoveToRecycled = async (id) => {
    performActionWithPermission(
      "",
      "delete",
      async () => {
        const willDelete = await swal({
          title: "Are you sure?",
          text: "You want to move this Show Room to the Recycle Bin?",
          icon: "warning",
          dangerMode: true,
        });

        if (willDelete) {
          try {
            await moveRecycledShowRoom({ tenantDomain, id }).unwrap();
            swal("Moved to Recycle bin!", "Successful.", "success");
          } catch (error) {
            swal(
              "Error",
              "An error occurred while deleting the card.",
              "error"
            );
          }
        }
      },
      "You don't have permission to move to recycle bin the show room!"
    );
  };

  useEffect(() => {
    if (search) {
      setFilterType(search);
    }
  }, [search]);

  return (
    <div className="w-full mt-5 mb-24">
      <div className="flex-wrap flex items-center justify-between mb-5 px-3 ">
        <h3 className="mb-3 text-xl md:text-3xl font-bold"> Show Room List:</h3>
        <div className="flex items-center">
          <input
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
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

      {loading ? (
        <div className="flex items-center justify-center text-xl">
          <Loading />
        </div>
      ) : (
        <div>
          {showRoomData?.data?.showrooms?.length === 0 ? (
            <EmptyData
              icon={Store}
              title="No Showrooms Found"
              message="We couldn't find any showrooms matching your search criteria."
              subMessage="Try adjusting your filters or add a new showroom."
            />
          ) : (
            <section className="tableContainer overflow-x-auto">
              <table className="customTable">
                <thead>
                  <tr>
                    <th>SL No</th>
                    <th>Show Room ID </th>
                    <th>Show Room Name</th>
                    <th>Show Room Customer Name </th>
                    {/* <th>Mileage History </th> */}
                    <th>Car Reg No. </th>
                    <th>Mobile No.</th>
                    <th>Vehicle Name </th>
                    <th colSpan={3}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {showRoomData?.data?.showrooms?.map((card, index) => {
                    const lastVehicle = card?.vehicles
                      ? [...card.vehicles].sort(
                        (a, b) =>
                          new Date(b.createdAt) - new Date(a.createdAt)
                      )[0]
                      : null;
                    const displayIndex = (currentPage - 1) * limit + index + 1;

                    return (
                      <tr
                        key={card._id}
                        className={` transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-100 hover:text-black`}
                      >
                        <td>{displayIndex}</td>
                        <td>{card?.showRoomId}</td>
                        <td>{card?.showRoom_name}</td>
                        <td>{card?.vehicle_username}</td>
                        {/* <td>
                        {card?.vehicles?.slice(0,1)?.map((vehicle, idx) => (
                          <div key={idx} className="flex flex-wrap gap-1">
                            {vehicle?.mileageHistory?.length > 0 ? (
                              vehicle.mileageHistory.map(
                                (history, historyIdx) => (
                                  <Tooltip
                                    key={historyIdx}
                                    title={new Date(
                                      history.date
                                    ).toLocaleDateString()}
                                    arrow
                                  >
                                    <Chip
                                      bg="primary"
                                      color="primary"
                                      label={`${history.mileage} km`}
                                      size="small"
                                      variant="outlined"
                                      sx={mileageStyle}
                                    />
                                  </Tooltip>
                                )
                              )
                            ) : (
                              <span>No mileage data</span>
                            )}
                          </div>
                        ))}
                        </td> */}
                        <td>{lastVehicle?.fullRegNum}</td>
                        <td>{card?.fullCompanyNum}</td>
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
                          <Can page="/dashboard/update-show-room" action="edit">
                            <div className="editIconWrap edit">
                              <Link
                                to={`/dashboard/update-show-room?id=${card._id}`}
                              >
                                <FaEdit className="editIcon text-blue-500" />
                              </Link>
                            </div>
                          </Can>
                        </td>
                        <td>
                          <Can page="/dashboard/show-room-list" action="delete">
                            <button
                              disabled={showroomDeleteLoading}
                              onClick={() => handleMoveToRecycled(card._id)}
                              className="editIconWrap"
                              style={{
                                background: "white",
                                border: "none",
                                padding: 5,
                                borderRadius: "9999px",
                              }}
                            >
                              <FaTrashAlt className="deleteIcon text-red-500" />
                            </button>
                          </Can>
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
          count={showRoomData?.meta?.totalPages}
          page={currentPage}
          color="primary"
          onChange={(_, page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default ShowRoomListTable;
