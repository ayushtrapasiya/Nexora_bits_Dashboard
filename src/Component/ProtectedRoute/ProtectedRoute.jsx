// components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";

 const isAuthenticated = () => {
  return !!localStorage.getItem("authToken") && !!localStorage.getItem("user") && !!localStorage.getItem("deviceId")
};
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // console.log('isAuthenticated: ', isAuthenticated());
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
