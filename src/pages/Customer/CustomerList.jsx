/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForwardIos } from "@mui/icons-material";
import { Button } from "@mui/material";
import CustomerListTable from "./CustomerListTable";
const CustomerList = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full mt-5 mb-24">
      <div className="flex flex-wrap items-center justify-center  md:justify-between my-3 mb-8">
        <div className="flex items-center px-3">
          <Button
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={backBtnStyle}
          >
            Back
          </Button>
        </div>
        <div className="flex items-center justify-center ">

          <div className="mt-2 md:mt-0">
            <span>
              Customer <ArrowForwardIos sx={{ fontSize: "15px" }} /> Manage
              Customer{" "}
            </span>
          </div>
        </div>
      </div>

      <CustomerListTable />
    </div>
  );
};

export default CustomerList;
