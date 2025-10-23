/* eslint-disable react-hooks/exhaustive-deps */

import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ShowRoomListTable from "./ShowRoomListTable";
import { backBtnStyle } from "../../utils/customStyle";
const ShowRoomList = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full mt-5 mb-24">
      <div className="flex  flex-wrap items-center justify-center  gap-3  md:justify-between my-3 mb-8">
        <div className="flex items-center justify-center ">
          <Button
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={backBtnStyle}
          >
            Back
          </Button>

        </div>
        <div className="productHome">
          <span>Dashboard / </span>
          <span>Show Room / </span>
          <span>Show Room List </span>
        </div>
      </div>
      <ShowRoomListTable />
    </div>
  );
};

export default ShowRoomList;
