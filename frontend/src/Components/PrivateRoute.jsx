import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include", // مهم للكويكي
        });
        if (res.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        setIsAuth(false);
        setError("❌ Error checking authentication");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading)
    return (
      <div
        className="loading"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        ⏳ Loading...
      </div>
    );

  if (error)
    return (
      <div
        className="loading"
        style={{ textAlign: "center", color: "red", marginTop: "50px" }}
      >
        {error}
      </div>
    );

  return isAuth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
