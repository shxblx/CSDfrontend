import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AgentPrivateRoute = ({ children }) => {
  const { agentInfo } = useSelector((state) => state.agent);

  if (!agentInfo) {
    return <Navigate to="/agent/login" replace />;
  }

  return children;
};

export default AgentPrivateRoute;