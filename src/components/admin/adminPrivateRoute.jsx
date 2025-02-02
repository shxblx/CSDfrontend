import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminPrivateRoute = ({ children }) => {
  const { adminInfo } = useSelector((state) => state.admin);

  if (!adminInfo) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminPrivateRoute;
