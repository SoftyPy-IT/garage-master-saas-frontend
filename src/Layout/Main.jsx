import { ThemeProvider } from "@mui/material";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { theme } from "../Theme";

const Main = () => {
  return (
    <main>
      <ThemeProvider theme={theme}>
        <Outlet />
      </ThemeProvider>
      <ScrollRestoration />
    </main>
  );
};

export default Main;
