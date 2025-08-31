import React, { useState } from "react";
import "./Login.css";
const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="container">
      <div className={"login"}>
        <div className="login-form">
          {/* Social Login Icons */}
          <div className="social-icons">
            <button className="social-btn">G</button>
            <button className="social-btn">f</button>
            <button className="social-btn">in</button>
            <button className="social-btn">𝕏</button>
            <button className="social-btn">🍎</button>
          </div>

          {/* Divider */}
          <div className="divider">
            <span>or</span>
          </div>

          {/* Username field (for Sign Up) */}
          {isSignUp && (
            <div className="form-group" id="username-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="inp username"
                required
              />
            </div>
          )}

          {/* Email field */}
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="inp email"
              required
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="inp password"
              required
            />
          </div>

          {/* Remember Me */}
          {!isSignUp && (
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
          )}

          {/* Main Button */}
          <button type="submit" className="login-button" id="main-btn">
            {isSignUp ? "Create Account" : "Log In"}
          </button>

          {/* Forgot Password Links */}
          {!isSignUp && (
            <div className="forgot-links">
              <a href="#" className="forgot-link">
                Forgot your password?
              </a>
              <a href="#" className="forgot-link reset-link">
                Reset Password
              </a>
            </div>
          )}

          {/* Terms (for Sign Up) */}
          {isSignUp && (
            <div className="login-terms" id="terms-group">
              <input type="checkbox" className="checkbox" id="terms" />
              <p>Agree to our Terms of Service and Privacy Policy.</p>
            </div>
          )}

          {/* Toggle Login/Sign Up */}
          <div className="login-forgot">
            <p id="toggle-text">
              <button
                type="button"
                className="create-account-btn"
                id="toggle-btn"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Back to Login" : "Create Account"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
