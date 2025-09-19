import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const PrivateRoute = ({ children }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

export default PrivateRoute;
