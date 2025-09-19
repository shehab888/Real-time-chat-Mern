import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const PrivateRoute = () => {
  const user = useAuthStore((state) => state.user);
  console.log("PrivateRoute user:", user);
  if (user === undefined) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
