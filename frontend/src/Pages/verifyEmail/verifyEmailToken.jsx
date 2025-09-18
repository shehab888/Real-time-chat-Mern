import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail, getMe } from "../../api/authApi";
import useAuthStore from "../../store/useAuthStore";

const VerifyEmailToken = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    const verify = async () => {
      try {
        // تحقق من البريد الإلكتروني
        await verifyEmail(token);

        // جلب بيانات اليوزر من /auth/me بعد التحقق
        const user = await getMe();
        setUser(user);

        setStatus("✅ Email verified successfully! Redirecting to chat...");

        // redirect بعد 2 ثانية
        setTimeout(() => navigate("/chat", { replace: true }), 2000);
      } catch (err) {
        setStatus(
          `❌ Verification failed. Please request a new link. ${
            err.message || ""
          }`
        );
      }
    };
    verify();
  }, [token, navigate, setUser]);

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
        <h2>Email Verification</h2>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default VerifyEmailToken;
