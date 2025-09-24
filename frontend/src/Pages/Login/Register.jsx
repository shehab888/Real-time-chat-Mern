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

  const validateForm = () => {
    if (!formData.username.trim()) return "Username is required";
    if (!formData.email.trim()) return "Email is required";

    if (!formData.password) return "Password is required";

    // طول الباسورد
    if (formData.password.length < 8)
      return "Password must be at least 8 characters";

    // حرف كابيتال
    if (!/[A-Z]/.test(formData.password))
      return "Password must contain at least one uppercase letter";

    // حرف صغير
    if (!/[a-z]/.test(formData.password))
      return "Password must contain at least one lowercase letter";

    // رقم
    if (!/[0-9]/.test(formData.password))
      return "Password must contain at least one number";

    // رمز خاص
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
      return "Password must contain at least one special character";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await register(formData);
      console.log("Response:", res.data);

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
        {/* 👇 noValidate يمنع الـ browser من عمل validation لوحده */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="inp username"
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
