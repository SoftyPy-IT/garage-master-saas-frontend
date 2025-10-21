import { FaFileInvoice } from "react-icons/fa";
import { ArrowForwardIos } from "@mui/icons-material";
import JobCardTable from "./JobcardTable";

const JobCardList = () => {
  return (
    <>
     <div className="flex flex-row items-center justify-between my-3 mb-8 space-y-4 md:space-y-0">
          <div className="flex md:items-center justify-center">
            <FaFileInvoice className="text-3xl text-blue-500" />
            <div className="ml-2">
              <h3 className="text-lg font-bold md:text-2xl">Job Card</h3>
              <span className="text-xs md:text-sm text-gray-600">
                Job Card <ArrowForwardIos sx={{ fontSize: {xs:"10px", md:"15px"} }} /> Manage
                Job Card
              </span>
            </div>
          </div>

          <div className="text-center md:text-right">
            <span className="text-xs md:text-sm text-gray-500">Home /</span>
            <span className="text-xs md:text-sm text-gray-800 font-semibold">
              {" "}
              Job Card List
            </span>
          </div>
        </div>
      <JobCardTable />
    </>
  );
};

export default JobCardList;
