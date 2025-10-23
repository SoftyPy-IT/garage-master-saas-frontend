import { ArrowBack } from "@mui/icons-material";
import QuotationTable from "./QuotationTable";
import { Button, Typography, Breadcrumbs } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";

const QuotationList = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-full">
      <div className="shadow-md p-2 md:p-6 mt-4 md:mt-20 mb-6 md:mb-12 bg-white rounded border">
        <div className="flex flex-col md:flex-row md:justify-between items-center content-center mb-2 md:mb-6 space-y-5 ">
          <div>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
              sx={{
                alignSelf: { xs: "flex-start", sm: "center" },
                borderRadius: 5,
              }}
            >
              Back
            </Button>
          </div>
          <div>
            <span className="flex justify-center items-center content-center">
              <FaFileAlt className="mr-2 text-[24px] md:text-[30px] text-blue-500" />
              <h3 className="text-[17px] md:text-2xl">Quotation Management</h3>
            </span>
          </div>
          <span></span>
        </div>

        <div className="flex flex-col md:flex-row items-center content-stretch justify-center md:ml-28">
   
          <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: 15 }}>
            <Typography color="text.primary" sx={{ fontSize: 15 }}>
              Dashboard
            </Typography>
            <Typography color="text.primary" sx={{ fontSize: 15 }}>
              Quotation
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 15 }}>
              Quotation List
            </Typography>
          </Breadcrumbs>
        
        </div>
      </div>
      <QuotationTable title='Quotation List ' />
    </div>
  );
};

export default QuotationList;
