import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { login } from "../../api/authApi";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await login({ email, password }); // 👈 استدعاء login من الـ api
      setUser(res.data.data); // 👈 نحط بيانات اليوزر في zustand
      console.log("Login successful:", res.data.data);
      navigate("/chat"); // ✅ روح للشات
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="login">
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="inp email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="inp password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Error */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Button */}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>

            {/* Links */}
            <div className="forgot-links">
              <Link to="/forgot" className="forgot-link">
                Forgot your password?
              </Link>
              <Link to="/reset" className="forgot-link reset-link">
                Reset Password
              </Link>
            </div>

            {/* Register */}
            <div className="login-forgot">
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="create-account-btn">
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
