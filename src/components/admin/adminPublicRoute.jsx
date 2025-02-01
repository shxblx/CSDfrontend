import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminPublicRoute = ({ children }) => {
  const { adminInfo } = useSelector((state) => state.admin);

  if (adminInfo) {
    return <Navigate to="/adminhome" replace />;
  }

  return children;
};

export default AdminPublicRoute;
