import { Box } from "@mui/material";
import SupplierListTable from "./SupplierListTable";
import { Home, Store } from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";
import { wrapBoxStyle } from "../../utils/customStyle";

const SupplierList = () => {
  const breadcrumbItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Suppliers", icon: Store },
  ];

  return (
    <Box sx={wrapBoxStyle}>
      <Breadcrumb items={breadcrumbItems} />
      <SupplierListTable />
    </Box>
  );
};


export default SupplierList;
