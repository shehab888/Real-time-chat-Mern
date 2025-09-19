import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const PublicRoute = () => {
  const user = useAuthStore((state) => state.user);
  console.log("PublicRoute user:", user);
  if (user === undefined) {
    return <p>Loading...</p>; // 👈 نفس فكرة PrivateRoute
  }

  if (user) {
    if (user.isVerified) {
      return <Navigate to="/chat" replace />;
    }
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
