/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { ArrowBack} from "@mui/icons-material";
import CompanyListTable from "./CompanyListTable";
import { Button } from "@mui/material";
import { backBtnStyle } from "../../../utils/customStyle";

const CompanyList = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full mt-5 mb-24">
      <div className="flex items-center px-3"></div>

      <div className="flex flex-wrap items-center justify-center  md:justify-between my-3 mb-8">
        <div className="flex items-center justify-center ">
          <Button
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={backBtnStyle}
          >
            Back
          </Button>
        </div>
        <div className="mt-2 productHome md:mt-0">
          <span>Home / </span>
          <span>Company / </span>
          <span> Company List </span>
        </div>
      </div>

      <CompanyListTable />
    </div>
  );
};

export default CompanyList;
