/* eslint-disable react/prop-types */
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material";

 const PageHeader = ({ onAddReturn }) => {
  const theme = useTheme();
  
  return (
    <div className="flex justify-between mb-3 items-center bg-paper p-2 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
      <h1
        className="font-bold"
        style={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Purchase Returns
      </h1>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddReturn}
        sx={{
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          transition: "all 0.3s",
          "&:hover": {
            boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
            transform: "translateY(-2px)",
          },
        }}
      >
        New Return
      </Button>
    </div>
  );
};
export default PageHeader