import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { router } from "./Routes/Route.jsx";
import Providers from "./lib/Providers/Providers.jsx";
import { theme } from "./Theme.jsx";
import { persistor, store } from "./redux/store.js";

import ErrorBoundary from "./components/ErrorBoundary";
import AuthLoader from "./components/AuthLoader.jsx";
import PrintProvider from "./context/PrintProvider.jsx";
import { PermissionProvider } from "./context/PermissionContext.jsx";

const queryClient = new QueryClient();
const clientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  process.env.REACT_APP_GOOGLE_CLIENT_ID ||
  process.env.VITE_GOOGLE_CLIENT_ID ||
  "731493911262-b4vutijvnt9bgdvgu6m1ai7g0nsno7vl.apps.googleusercontent.com";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GoogleOAuthProvider clientId={clientId}>
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
          </GoogleOAuthProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
