import React, { useState, useEffect } from "react";
import "./BlockListPopup.css";

const BlockListPopup = ({ onClose }) => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 جلب البلوك ليست من API
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const res = await fetch("https://real-time-chat-backend-production-6f5c.up.railway.app/api/user/blocked", {
          method: "GET",
          credentials: "include", // عشان الكوكي يتبعت
        });

        const data = await res.json();
        console.log("Fetched blocked users:", data.data.blockedUsers);

        if (res.ok && Array.isArray(data.data.blockedUsers)) {
          setBlockedUsers(data.data.blockedUsers);
        } else {
          setBlockedUsers([]);
        }
      } catch (err) {
        console.error("Error fetching blocked users:", err);
        setBlockedUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedUsers();
  }, []);

  // 🟢 فك الحظر
  const handleUnblock = async (userId) => {
    const confirmUnblock = window.confirm(
      "Are you sure you want to unblock this user?"
    );
    if (!confirmUnblock) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/user/unblock/${userId}`,
        {
          method: "Post",
          credentials: "include",
        }
      );

      if (res.ok) {
        setBlockedUsers((prev) => prev.filter((u) => u._id !== userId));
        onClose(); // ✅ يقفل البوب أب بعد الفك
      } else {
        console.error("Failed to unblock user");
      }
    } catch (err) {
      console.error("Error unblocking user:", err);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>🚫 Block List</h3>
          <button className="close-btn" onClick={onClose}>
            ❌
          </button>
        </div>

        <div className="popup-content">
          {loading ? (
            <p>⏳ Loading blocked users...</p>
          ) : blockedUsers.length > 0 ? (
            blockedUsers.map((user) => (
              <div key={user._id} className="blocked-user">
                <span>👤 {user.username || user.customName}</span>
                <button
                  className="unblock-btn"
                  onClick={() => handleUnblock(user._id)}
                >
                  ♻️ Unblock
                </button>
              </div>
            ))
          ) : (
            <p className="empty-text">No blocked users 🚀</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockListPopup;
