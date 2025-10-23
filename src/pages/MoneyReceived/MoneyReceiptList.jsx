
import MoneyReceiptTable from "./MoneyReceiptTable";
import { ArrowBack, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { backBtnStyle } from "../../utils/customStyle";

const MoneyReceiptList = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="mt-3 md:mt-5 overflow-x-auto">
      <div className="flex flex-wrap items-center justify-center gap-3 text-center  md:justify-between md:mt-5 mb-8">
        <div className="flex flex-wrap items-center justify-center">
          <Button
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={backBtnStyle}
          >
            Back
          </Button>

        </div>
        <div className="flex flex-wrap items-center justify-center">

          <div className="ml-2">
            <h3 className="text-sm font-bold md:text-2xl">Money Receipt</h3>
            <span>
              Money Receipt <ArrowForwardIos sx={{ fontSize: "15px" }} /> Manage
              Money Receipt
            </span>
          </div>
        </div>
        <div className="productHome">
          <span>Home / </span>
          <span>Money / </span>
          <span>Money receipt</span>
        </div>
      </div>
      <MoneyReceiptTable />
    </div>
  );
};

export default MoneyReceiptList;
