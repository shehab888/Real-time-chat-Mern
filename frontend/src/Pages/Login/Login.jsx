import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // 👈 مهم جدًا عشان الكوكي يتخزن
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/chat"); // ✅ بعد تسجيل الدخول روح للشات
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
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

          {/* Remember Me */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              className="checkbox"
              id="remember"
              defaultChecked
            />
            <label htmlFor="remember" className="checkbox-label">
              Remember Me
            </label>
          </div>

          {/* Error Message */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Button */}
          <button type="submit" className="login-button">
            Log In
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

          {/* Link to Register */}
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
  );
};

export default Login;
