import { Backdrop, CircularProgress } from "@mui/material";
import { useCalendar } from "../../../context/CalendarContext";

export const LoadingBackdrop = () => {
  const { loading } = useCalendar();

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
