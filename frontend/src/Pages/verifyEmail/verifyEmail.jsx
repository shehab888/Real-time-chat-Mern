import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { resendVerificationEmail } from "../../api/authApi";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // Redirect تلقائي لو اليوزر verified
  useEffect(() => {
    if (user?.isVerified) {
      navigate("/chat", { replace: true });
    }
  }, [user, navigate]);

  const handleResend = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await resendVerificationEmail();
      setMessage(
        res.message || "✅ Verification email sent again. Check your inbox."
      );
    } catch (err) {
      setMessage(`❌ Failed to resend verification email. ${err.message || ""}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="verify-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2>Verify your email</h2>
        <p>
          We sent a verification link to your email. Please check your inbox and
          click the link to activate your account.
        </p>

        <button
          onClick={handleResend}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Resending..." : "Resend Verification Email"}
        </button>

        {message && (
          <p
            className="status-msg"
            style={{ color: message.startsWith("✅") ? "green" : "red" }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
