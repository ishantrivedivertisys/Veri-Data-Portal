/*React Libraries */
import { Navigate } from "react-router-dom";
import React, { useEffect } from "react";

// **** Custom Components, Styles and Icons ****
import { AppRoute } from "./AppRoute";
import Navbar from "../Navbar/Navbar";

const AuthorizedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  //const token = "testToken";
  useEffect(() => {}, [token]);
  if (token)
    return (
      <>
        <Navbar />
        {children}
      </>
    );

  return <Navigate to={AppRoute.home} />;
};

export default AuthorizedRoute;
