import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLogin from "../components/admin/AdminLogin";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminPublicRoute from "../components/admin/adminPublicRoute";
import AdminPrivateRoute from "../components/admin/adminPrivateRoute";

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route
        path="login"
        element={
          <AdminPublicRoute>
            <AdminLogin />
          </AdminPublicRoute>
        }
      />
      <Route
        path="home"
        element={
          <AdminPrivateRoute>
            <AdminDashboard />
          </AdminPrivateRoute>
        }
      />
    </Routes>
  );
};

export default AdminRouter;
