import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default PrivateRoute;
