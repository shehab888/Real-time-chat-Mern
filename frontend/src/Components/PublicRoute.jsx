import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const PublicRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (user) {
    // لو موجود ومحقق، اوديه على Chat
    if (user.isVerified) {
      return <Navigate to="/chat" replace />;
    }
    // لو موجود ومش verified، اوديه على verify-email
    return <Navigate to="/verify-email" replace />;
  }

  // لو مفيش user → يسمح بعرض الصفحات العامة (Login/Register)
  return <Outlet />;
};

export default PublicRoute;
