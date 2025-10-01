/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  const user = Cookies.get("tas-auth");

  if (user  && user === "51RSM78du77QnlJy86LgWSEUpVM") {
    return children;
  }
  return <Navigate to="/" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;
