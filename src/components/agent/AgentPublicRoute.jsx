import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AgentPublicRoute = ({ children }) => {
  const { agentInfo } = useSelector((state) => state.agent);

  if (agentInfo) {
    return <Navigate to="/agent/home" replace />;
  }

  return children;
};

export default AgentPublicRoute;
