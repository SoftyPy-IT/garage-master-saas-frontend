import { Box, Typography } from "@mui/material";
import SupplierListTable from "./SupplierListTable";
import { FaUsers } from "react-icons/fa";

const SupplierList = () => {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, mt:5 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FaUsers size={40} color="#42A1DA" />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h4" fontWeight="bold">
              Supplier Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage and track your suppliers
            </Typography>
          </Box>
        </Box>
      </Box>
      <SupplierListTable />
    </>
  );
};

export default SupplierList;
