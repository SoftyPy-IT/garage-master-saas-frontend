/* eslint-disable no-unused-vars */
import { FaTrashAlt, FaEdit, FaUserTie } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Diversity3 } from "@mui/icons-material";
import { HiOutlineSearch } from "react-icons/hi";
import { useRef, useState } from "react";
import swal from "sweetalert";
import Loading from "../../../components/Loading/Loading";
import { Chip, Pagination, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import {
  useGetAllCompaniesQuery,
  useMoveRecycledCompanyMutation,
} from "../../../redux/api/companyApi";
import EmptyData from "../../../components/EmptyData/EmptyData";
import { mileageStyle } from "../../../utils/customStyle";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

const CompanyListTable = () => {
  const textInputRef = useRef(null);
  const [filterType, setFilterType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const handleIconPreview = async (e) => {
    navigate(`/dashboard/company-profile?id=${e}`);
  };

  const limit = 10;
   const tenantDomain = useTenantDomain();

  const { data: companyData, isLoading: companyLoading } =
    useGetAllCompaniesQuery({
      tenantDomain, 
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: false,
    });

  const [
    moveRecycledCompany,
    { isLoading: companyDeleteLoading, error: deleteError },
  ] = useMoveRecycledCompanyMutation();

const handleMoveToRecycled = async (id) => {
  const willDelete = await swal({
    title: "Are you sure?",
    text: "You want to move this Company to Recycle Bin?",
    icon: "warning",
    dangerMode: true,
  });

  if (willDelete) {
    try {
      await moveRecycledCompany({ tenantDomain, id }).unwrap(); 
      swal(
        "Moved to Recycle Bin!",
        "Company successfully moved to the recycle bin.",
        "success"
      );
    } catch (error) {
      console.error("Recycling error:", error);
      swal("Error", "An error occurred while moving the company.", "error");
    }
  }
};



  if (companyLoading) {
    return (
      <div className="flex items-center justify-center text-xl">
        <Loading />
      </div>
    );
  }

  if (deleteError) {
    toast.error(deleteError?.message);
  }

  return (
    <div className="w-full mt-5 mb-24">
      <div className="flex-wrap flex items-center justify-between mb- py-5 px-3">
        <h3 className="mb-3 text-xl font-bold md:text-3xl"> Company List:</h3>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="border py-2 px-3 rounded-md border-[#ddd]"
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            ref={textInputRef}
          />
          <button className="bg-[#42A1DA] text-white px-2 py-2 rounded-sm ml-1">
            {" "}
            <HiOutlineSearch size={22} />
          </button>
        </div>
      </div>

      {companyLoading ? (
        <div className="flex flex-wrap items-center justify-center text-xl">
          <Loading />
        </div>
      ) : (
        <div>
          {companyData?.data?.companies?.length === 0 ? (
            <EmptyData
              icon={Diversity3}
              title="No Company Found"
              message="We couldn't find any company matching your search criteria."
              subMessage="Try adjusting your filters or add a new company."
            />
          ) : (
            <>
              <section className="tableContainer overflow-x-auto">
                <table className="customTable">
                  <thead>
                    <tr>
                      <th>SL No</th>
                      <th>Company ID</th>
                      <th>Company Name</th>
                      <th>Vechile User Name</th>
                      <th>Car Reg No. </th>
                      {/* <th>Mileage History </th> */}
                      <th> Mobile No.</th>
                      <th>Vehicle Name </th>
                      <th colSpan={3}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyData?.data?.companies?.map((card, index) => {
                      
                      const lastVehicle = card?.vehicles
                        ? [...card.vehicles].sort(
                            (a, b) =>
                              new Date(b.createdAt) - new Date(a.createdAt)
                          )[0]
                        : null;

                      const globalIndex =
                        (companyData?.data?.meta?.currentPage - 1) * limit +
                        (index + 1);
                      return (
                        <tr key={card._id} className={`transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-100 hover:text-black`}>
                          <td>{globalIndex}</td>
                          <td>{card.companyId}</td>
                          <td>{card?.company_name}</td>
                          <td>{card?.vehicle_username}</td>
                          <td>{lastVehicle?.fullRegNum}</td>
                          {/* <td>
                            {card?.vehicles
                              ?.slice(0, 1)
                              ?.map((vehicle, idx) => (
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
                          <td>{card?.fullCompanyNum} </td>
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
                                to={`/dashboard/update-company?id=${card?._id}`}
                              >
                                <FaEdit className="editIcon text-blue-500" /> 
                              </Link>
                            </div>
                          </td>
                          <td>
                            <button
                              disabled={companyDeleteLoading}
                              onClick={() => handleMoveToRecycled(card?._id)}
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
            </>
          )}
        </div>
      )}
      <div className="flex justify-center mt-4">
        <Pagination
          count={companyData?.data?.meta?.totalPages}
          page={currentPage}
          color="primary"
          onChange={(_, page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default CompanyListTable;
