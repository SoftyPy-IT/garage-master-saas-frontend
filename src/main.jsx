// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "./Routes/Route.jsx";
import { QueryClient, QueryClientProvider } from "react-query";
import Providers from "./lib/Providers/Providers.jsx";
import { ThemeProvider } from "@mui/material";
import { theme } from "./Theme.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import ErrorBoundary from "./components/ErrorBoundary";
import { PermissionProvider } from "./context/PermissionContext.jsx";
import { PersistGate } from "redux-persist/integration/react";
import AuthLoader from "./components/AuthLoader.jsx";
import PrintProvider from "./context/PrintProvider.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthLoader>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider theme={theme}>
                <Providers>
                  <PrintProvider>
                    <PermissionProvider>
                      <ToastContainer />
                      <RouterProvider router={router} />
                    </PermissionProvider>
                  </PrintProvider>
                </Providers>
              </ThemeProvider>
            </QueryClientProvider>
          </AuthLoader>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
