import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PrivetRoute = ({ children }) => {
  const auth = useAuth();
  if (auth) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

export default PrivetRoute;
