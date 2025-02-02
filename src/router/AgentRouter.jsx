import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AgentLogin from "../components/agent/AgentLogin";
import AgentPrivateRoute from "../components/agent/AgentPrivateRoute";
import AgentPublicRoute from "../components/agent/AgentPublicRoute";
import AgentDashboard from "../components/agent/AgentDashboard";

const AgentRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="login" replace />} />
      <Route
        path="login"
        element={
          <AgentPublicRoute>
            <AgentLogin />
          </AgentPublicRoute>
        }
      />
      <Route
        path="home"
        element={
          <AgentPrivateRoute>
            <AgentDashboard />
          </AgentPrivateRoute>
        }
      />
    </Routes>
  );
};

export default AgentRouter;
