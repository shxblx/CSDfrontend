import React from "react";
import Login from "../components/AdminLogin";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import PublicRoute from "../components/PublicRoute";

const UserRouter = () => {
  return (
    <Routes>
      <Route
        path="/adminlogin"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route path="/home" element={<PrivateRoute></PrivateRoute>} />
    </Routes>
  );
};

export default UserRouter;
