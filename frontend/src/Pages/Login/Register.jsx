import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./Login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        alert("✅ Account created successfully!");
        Navigate("/login");
      } else {
        document.getElementById("error-message").innerText = data.message;
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong!");
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
            <input type="checkbox" className="checkbox" id="terms" />
            <p>Agree to our Terms of Service and Privacy Policy.</p>
          </div>

          {/* Button */}
          <button type="submit" className="login-button">
            Create Account
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
