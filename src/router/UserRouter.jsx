import React from "react";
import AdminLogin from "../components/admin/AdminLogin";
import { Navigate, Route, Routes } from "react-router-dom";
import AgentLogin from "../components/admin/AgentLogin";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminPublicRoute from "../components/admin/adminPublicRoute";
import AdminPrivateRoute from "../components/admin/adminPrivateRoute";

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/adminlogin"
        element={
          <AdminPublicRoute>
            <AdminLogin />
          </AdminPublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <AdminPublicRoute>
            <AgentLogin />
          </AdminPublicRoute>
        }
      />

      <Route
        path="/adminhome"
        element={
          <AdminPrivateRoute>
            <AdminDashboard />
          </AdminPrivateRoute>
        }
      />
    </Routes>
  );
};

export default UserRouter;
