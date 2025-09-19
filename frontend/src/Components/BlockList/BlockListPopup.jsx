// BlockListPopup.jsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getBlockedUsers, unblockUser } from "../../api/userApi";
import "./BlockListPopup.css";

const BlockListPopup = ({ onClose }) => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 جلب البلوك ليست كل مرة يفتح فيها البوب أب
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const res = await getBlockedUsers();
        if (res.data?.data?.blockedUsers) {
          setBlockedUsers(res.data.data.blockedUsers);
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
    try {
      await unblockUser(userId);
      setBlockedUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Error unblocking user:", err);
    }
  };

  const popupContent = (
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
                <span>👤 {user.friendName || user.username}</span>
                <button
                  className="unblock-btn"
                  onClick={() => handleUnblock(user.friend)}
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

  // ✅ نرندر في body باستخدام Portal
  return ReactDOM.createPortal(popupContent, document.body);
};

export default BlockListPopup;
