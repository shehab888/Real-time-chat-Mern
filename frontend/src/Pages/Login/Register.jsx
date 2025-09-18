import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/authApi";
import "./Login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await register(formData);
      console.log("Response:", res.data);

      // لو فيه verification step
      navigate("/verify-email");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login">
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="inp username"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="inp email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="inp password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Terms */}
          <div className="login-terms">
            <input type="checkbox" className="checkbox" id="terms" required />
            <p>Agree to our Terms of Service and Privacy Policy.</p>
          </div>

          {/* Error message */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Button */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* Link to Login */}
          <div className="login-forgot">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="create-account-btn">
                Back to Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
